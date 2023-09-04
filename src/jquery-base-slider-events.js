/****************************************************************************
jquery-base-slider-events
****************************************************************************/
(function ($, window/*, document, undefined*/) {
    "use strict";

    /*******************************************************************
    getEventLeft
    Return the left (= x) position of an event
    *******************************************************************/
    function getEventLeft( event ){
        return  event.gesture && event.gesture.center ? event.gesture.center.x :
                event.pageX ? event.pageX :
                event.originalEvent && event.originalEvent.touches && event.originalEvent.touches.length ? event.originalEvent.touches[0].pageX :
                event.touches && event.touches.length ? event.touches[0].pageX :
                0;
    }


    /*******************************************************************
    objectsAreDifferent
    Return true if obj1 and obj2 are not equal
    *******************************************************************/
    function objectsAreDifferent( obj1, obj2 ){
        var result = false,
            props = Object.getOwnPropertyNames(obj1).concat( Object.getOwnPropertyNames(obj2) );

        $.each( props, function( index, id ){
            var type1 = $.type(obj1[id]),
                type2 = $.type(obj2[id]);

            result =
                result ||
                (   ((type1 == 'number') || (type2 == 'number')) && //One or both are number AND
                    ((type1 != type2) || (obj1[id] != obj2[id]))    //type are different OR value are different
                );
        });
        return result;
    }



    $.extend(window.BaseSlider.prototype, {
        /*******************************************************************
        bindEvents
        *******************************************************************/
        bindEvents: function () {
            var _this = this;
            //*******************************************************************
            function addEvents( $elem, eventNames, func, param ){
                if (!$elem) return;
                func = param ? $.proxy( func, _this, param) : $.proxy( func, _this );

                $.each( eventNames.split(' '), function( index, eventName ){
                    $elem.off( eventName + ".irs_" + _this.pluginCount,  func );
                    $elem.on ( eventName + ".irs_" + _this.pluginCount,  func );
                });
                return $elem;
            }
            //*******************************************************************

            /*
            Add tap/press-events to the container
            Depending on whether the slider is normal or with fixed handle the
            event for 'press' and/or 'pressup/tap' are different
            The difference is necessary to prevent dragging a label in fixed-mode
            resulting in a click-on-label event
            */
            if (this.options.isFixed)
                addEvents( this.cache.$container, 'tap pressup', this.onTap );
            else {
                addEvents( this.cache.$container, 'pressup',   this.currentHandleBlur );
                addEvents( this.cache.$container, 'tap press', this.onTap )
                    .data('hammer').get('press').set({time: 1});
            }

            var $panElement = this.options.isFixed ? this.cache.$fullWidthContainer : this.cache.$container;
            addEvents( $panElement, 'panstart',         this.onPanstart );
            addEvents( $panElement, 'panleft panright', this.onPan      );
            addEvents( $panElement, 'panend pancancel', this.onPanend   );

            $panElement.data('hammer').get('pan').set({threshold: 1});

            //Add onResize to the container
            if (this.options.resizable){
                if (this.options.isFixed)
                    this.cache.$outerContainer.resize( this.events.containerOnResize );
                else
                    this.cache.$container.resize( this.events.containerOnResize );
            }

            //Add horizontal sliding with mousewheel
            if (this.options.mousewheel)
                addEvents(
                    this.options.handleFixed ? this.cache.$outerContainer : this.cache.$container.parent(),
                    'mousewheel',
                    this.mousewheel
                );

            //Add keyboard events to the line
            addEvents( this.cache.$line, "keydown", this.key );
        },


        /*******************************************************************
        ********************************************************************
        EVENTS
        ********************************************************************
        *******************************************************************/

        /*******************************************************************
        containerOnResize
        Call parentOnResize when the slider is finish building and the container is resized
        *******************************************************************/
        containerOnResize: function(){
            if (this.initializing || !this.isBuild)
                return;
            this.parentOnResize();
        },

        /*******************************************************************
        parentOnResize
        Call checkContainerDimentions when the container is resized.
        Prevent multi updates by setting delay of 200ms
        *******************************************************************/
        parentOnResize: function(){
            //Remove resize-event from parent if it isn't a resizable slider
            if (!this.options.resizable && this.parentOnResizeAdded && this.cache.$parent){
                this.cache.$parent.removeResize( this.events.parentOnResize );
                this.parentOnResizeAdded = null;
            }

            //Clear any previous added timeout
            if (this.resizeTimeoutId)
                window.clearTimeout(this.resizeTimeoutId);
            this.resizeTimeoutId = window.setTimeout($.proxy(this.checkContainerDimentions, this), 200 );
        },

        /*******************************************************************
        getDimentions
        Get width and left-position of different slider elements
        *******************************************************************/
        _getAnyWidth: function( $elem ){
            var width = 0;
            while ($elem && $elem.length){
                width = $elem.innerWidth();
                if (width || !this.options.useParentWidth)
                    $elem = null;
                else
                    $elem = $elem.parent();
                }
            return Math.max(0, width);
        },

        getDimentions: function(){
            var result = {};
            result.containerWidth = this._getAnyWidth(this.cache.$container) || this.dimentions.containerWidth;

            if (this.options.isFixed)
                result.outerContainerWidth = this.cache.$outerContainer.innerWidth();
            return result;
        },

        /*******************************************************************
        checkContainerDimentions
        Get width and left-position and redraw the slider
        *******************************************************************/
        checkContainerDimentions: function(){
            var updateSlider = false;

            //Get dimentions of the slider containers
            this.dimentions = this.getDimentions();

            if (!this.initializing && this.isBuild){
                //Update the slider if the width has changed
                if (this.dimentions.containerWidth && objectsAreDifferent( this.dimentions, this.dimentions_old)){
                    updateSlider = true;

                    //If it is a resizable slider :  Update it
                    if (this.options.resizable)
                        this.update();
                }
            }
            else {
                //Reset timeout and try to build the slider
                if (this.checkContainerDimentions_TimeoutId){
                    window.clearTimeout(this.checkContainerDimentions_TimeoutId);
                    this.checkContainerDimentions_TimeoutId = null;
                }

                if (this.dimentions.containerWidth){
                    this.build();
                    updateSlider = true;
                }
                else {
                    // if this.cache.$container has a parent-element with no-width => add ONE resize-event on the parent to detect when it changes it width e.q. is added to the DOM or made visible
                    // else set timeout to check dimention of the container
                    this.cache.$parent = this.cache.$container.parent();

                    if (this.checkParentResize && this.cache.$parent.length){
                        this.checkParentResize = false;
                        this.parentOnResizeAdded = true;
                        this.cache.$parent.resize( this.events.parentOnResize );
                    }
                    else
                        this.checkContainerDimentions_TimeoutId = window.setTimeout($.proxy(this.checkContainerDimentions, this), 200 );
                }

            }

            //Update slider
            if (updateSlider){
                this.dimentions_old = $.extend({}, this.dimentions);
                this.updateHandlesAndLines();
            }
        },


        /*******************************************************************
        KEY, WHEEL AND BUTTON EVENTS
        *******************************************************************/

        /*******************************************************************
        key
        Event keydown
        *******************************************************************/
        key: function(event) {
            if (event.altKey || event.metaKey) return;

            var options;

            switch (event.which) {
                case 83: // W
                case 65: // A
                case 40: // DOWN
                case 37: // LEFT
                    options = {delta: 1, shiftDelta: 2, ctrlShiftDelta: 3, sign: -1};
                    break;
                case 87: // S
                case 68: // D
                case 38: // UP
                case 39: // RIGHT
                    options = {delta: 1, shiftDelta: 2, ctrlShiftDelta: 3, sign: +1};
                    break;
                case 33: // page up
                    options = {delta: 3, shiftDelta: 99, sign: -1};
                    break;
                case 34: // page down
                    options = {delta: 3, shiftDelta: 99, sign: +1};
                    break;
                case 35: // end
                    options = {delta: 99, sign: +1};
                    break;
                case 36: // home
                    options  = {delta: 99, sign: -1};
                    break;
                default:
                    options = {delta: 0};
            }

            if (options.delta)
                return this.moveByButtonOrKeyboardOrMouseWheel( options, event );
        },

        /*******************************************************************
        mousewheel
        *******************************************************************/
        mousewheel: function( event, delta ){
            return this.moveByButtonOrKeyboardOrMouseWheel({
                delta         : 1,
                shiftDelta    : 2,
                ctrlShiftDelta: 3,
                sign          : delta

            }, event );
        },

        /*******************************************************************
        moveByButtonOrKeyboardOrMouseWheel
        options = { sign, delta, shiftDelta, ctrlShiftDelta, event }
        *******************************************************************/
        moveByButtonOrKeyboardOrMouseWheel: function( options, event ){

            //*******************************************
            function minOrMaxInList( findInMaxList, sliderValue, excludeSliderValue ){
                var result = findInMaxList ? _this.options.max : _this.options.min,
                    list   = findInMaxList ? sliderValue.maxList : sliderValue.minList;
                $.each( list, function( index, listObj ){
                    if (listObj.sliderValue !== excludeSliderValue)
                        result = (findInMaxList ? Math.min : Math.max)( result, listObj.sliderValue.value );
                });
                return result;
            }
            //*******************************************

            event.preventDefault();

            /*
            Setting delta:
                +/-  1: step = this.options.step
                +/-  2: step = this.options.keyboardShiftStepFactor * this.options.step
                +/-  3: step = this.options.keyboardPageStepFactor * this.options.step
                +/- 99: To the end/start
            */
            var delta = options.delta;

            //If shift XOR ctrl is pressed..
            if ((event.ctrlKey && !event.shiftKey) || (!event.ctrlKey && event.shiftKey))
                delta = options.shiftDelta || delta;

            //If shift AND ctrl is pressed..
            if (event.ctrlKey && event.shiftKey)
                delta = options.ctrlShiftDelta || options.shiftDelta || delta;

            delta = options.sign*delta;

            //Find handle and new value depending on type and direction
            var handle =
                    this.options.isFixed ? this.handles.fixed :
                    this.options.isSingle ? this.handles.single :
                    options.handleId && this.handles[options.handleId] ? this.handles[options.handleId] :
                    delta < 0 ? this.handles.from :
                    this.handles.to,
                oldValue = handle.value.value,
                newValue = oldValue;

            switch (delta){
                case   0: newValue = 0; break;
                case -99: newValue = this.options.min; break;
                case  99: newValue = this.options.max; break;
                case  +1: newValue = oldValue + this.options.step; break;
                case  -1: newValue = oldValue - this.options.step; break;
                case  +2: newValue = oldValue + this.options.keyboardShiftStepFactor * this.options.step; break;
                case  -2: newValue = oldValue - this.options.keyboardShiftStepFactor * this.options.step; break;
                case  +3: newValue = oldValue + this.options.keyboardPageStepFactor * this.options.step; break;
                case  -3: newValue = oldValue - this.options.keyboardPageStepFactor * this.options.step; break;
            }

            //If the slider has two handle and both handles are moved: Move euqal distance to keep the distance between them constant
            if (!options.handleId && this.options.isDouble){
                var _this = this;
                //1: Find possible max delta for both from- and to-value
                var fromValue = this.handles.from.value,
                    toValue   = this.handles.to.value,
                    deltaValue =
                        (delta > 0 ? Math.min : Math.max)(
                            newValue - oldValue,
                            minOrMaxInList( delta > 0, fromValue, toValue   ) - fromValue.value, //Maximal new from-value minus current from-value
                            minOrMaxInList( delta > 0, toValue,   fromValue ) - toValue.value //Maximal new to-value minus current to-value
                        );

                //2: Set the values without checking for intervalMin or intervalMax
                fromValue.value += deltaValue;
                toValue.value   += deltaValue;

                //3: Check values incl. intervalMin and intervalMax
                fromValue.update();
                toValue.update();

            }
            else
                //Update single/fixed handle
                handle.value.setValue( newValue );


            this.updateHandlesAndLines();

            return true;
        },


        /*******************************************************************
        TAP AND PAN EVENTS
        *******************************************************************/
        /*******************************************************************
        updateMouse
        Reset this.mouse based on mouse-position from mouseLeft
        *******************************************************************/
        updateMouse: function ( mouseLeft ) {
            // this.mouse.valueOffset is set to the left-position of the slider incl scrolling
            this.mouse.valueOffset = this.cache.$innerContainer.get(0).getBoundingClientRect().left;
            //this.mouse.valueRange is set to width of the slider
            this.mouse.valueRange = this.dimentions.containerWidth;
            this.mouse.percentOffset = 0;
            this.mouse.setValue( mouseLeft );
        },

        /*******************************************************************
        onTap
        Called when tap and press/pressup on the slider (line and grid)
        *******************************************************************/
        onTap: function(event) {



            var _this = this,
                percent = NaN, // = the percent to set this.currentHandle
                elem    = event.gesture.target;



            event.preventDefault();
            event.stopImmediatePropagation();

            this.currentHandleBlur();

            //First check if the tap was on a handle or the marker of a handler
            if (!this.options.isFixed)
                $.each( this.handles, function( id, handle ){
                    if ( handle.$handle &&
                         (  (handle.$handle.get(0) == elem) ||
                            (handle.marker && handle.marker.$text && (handle.marker.$text.get(0) == elem))
                         )
                        ){
                        _this.currentHandle = handle;
                        percent = handle.value.percent;
                        return true;
                    }
                });

            //If not on a handle: Test if the tap was on a label
            if (window.isNaN(percent)){
                //Check if the tap was on a canvas
                var canvasId = $(elem).data('canvasId');
                if (canvasId){
                    var originalEvent = event.gesture.srcEvent,
                        canvasX       = originalEvent.offsetX,
                        canvasY       = originalEvent.offsetY;

                    $.each(_this.canvasLabels[canvasId] || [], function(index, rec){
                        if ( (canvasX >= rec.left) && (canvasX <= rec.right) && (canvasY >= rec.top) && (canvasY <= rec.bottom) ){
                            percent = rec.percent;
                            return false;
                        }
                    });
                }
            }

            //If not on a handle and not on a label: Find percent according to mouse-position
            if (window.isNaN(percent)){
                var mouseLeft = getEventLeft( event );
                if (this.options.isFixed){
                    mouseLeft = mouseLeft - this.cache.$outerContainer.offset().left - parseFloat( this.cache.$container.css('left') );
                    percent = 100 * mouseLeft / this.dimentions.containerWidth;
                }
                else {
                    this.updateMouse( mouseLeft );
                    percent = this.mouse.percent;
                }
            }

            //Find this.currentHandle = the handle to move by pan-events
            if (!this.currentHandle){
                if (this.options.isFixed)
                    this.currentHandle = this.handles.fixed;
                else if (this.options.isSingle)
                    this.currentHandle = this.handles.single;
                else {
                    //Find the nearest of from- and to-handle
                    this.currentHandle =
                        percent >= 0.5*(this.handles.from.value.percent + this.handles.to.value.percent) ?
                        this.handles.to :
                        this.handles.from;

                    //Check for special case:
                    //If tap between from- and to-handle AND the nearest handle is at its max (from-hande) or min (to-handle) =>
                    //Switch to the other handle if the other isn't at min/max
                    var fromAtMax = this.handles.from.value.value == this.options.fromMax,
                        toAtMin   = this.handles.to.value.value   == this.options.toMin;
                    if ((percent > this.handles.from.value.percent) && (percent < this.handles.to.value.percent))
                        if (
                             ( (this.currentHandle.id == 'from') && fromAtMax && !toAtMin) ||
                             ( (this.currentHandle.id == 'to')   && toAtMin && !fromAtMax  )
                            )
                            this.currentHandle = this.currentHandle.id == 'from' ? this.handles.to : this.handles.from;
                }
            }

            //Update handle and marker with class=".. hover" if it is a press-event
            if (event.type == 'press')
                this.currentHandle.onFocus();

            //Update the handle with the new percent
            this.currentHandle.value.setPercent( percent );
            this.updateHandlesAndLines();
            this.cache.$line.trigger("focus");



        },

        /*******************************************************************
        onPanstart
        When the slider or any of the handle is beeing panned
        *******************************************************************/
        onPanstart: function( event ){
            if (this.options.isFixed)
                this.currentHandle = this.handles.fixed;

            if (this.currentHandle){
                var mouseLeft = getEventLeft(event);

                //Save initial mouse position to calc reverse mouse movment
                if (this.options.isFixed)
                    this.options.mouseLeftStart = mouseLeft;

                //Updates this.mouse with corrected mouseLeft
                this.updateMouse( mouseLeft );
                //Add the different between the mouse-position (%) and the percent-value of the handle as percentOffset
                //Now this.mouse.getPercent() => 'true' new percent-value for the handle
                this.mouse.percentOffset = this.currentHandle.value.percent - this.mouse.percent;
                this.mouse.update();
                this.cache.$line.trigger("focus");
            }
        },

        /*******************************************************************
        onPan
        Called when a handle is moved/panned
        *******************************************************************/
        onPan: function( event ){
            if (!this.currentHandle) return;

            var mouseLeft = getEventLeft( event );

            if (this.options.isFixed)
                //Convert direction of mouse moving around this.options.mouseLeftStart
                mouseLeft = this.options.mouseLeftStart - (mouseLeft - this.options.mouseLeftStart);

            //Set position of mouse
            this.mouse.setValue( mouseLeft );

            //Set new position of handle being dragged
            var oldPercent = this.currentHandle.value.percent;
            this.currentHandle.value.setPercent( this.mouse.percent );

            if (oldPercent != this.currentHandle.value.percent){
                this.cache.$container.addClass('dragging');
                this.updateHandlesAndLines();
            }

        },

        /*******************************************************************
        onPanend
        Called when a dragging of a handle is stopped
        *******************************************************************/
        onPanend: function( /*event*/ ){
            this.cache.$container.removeClass('dragging');
            this.currentHandleBlur();
        },


        /*******************************************************************
        ********************************************************************
        CALLBACK
        ********************************************************************
        *******************************************************************/

        /*******************************************************************
        updateResult
        *******************************************************************/
        updateResult: function() {
            var _this = this,
                singleHandleId = this.options.singleHandleId;

            $.each( ['min', 'from', singleHandleId, 'to', 'max'], function( index, id ){
                var resultId = (id == singleHandleId) ? 'value' : id; //Using result.value for single-slider (incl fixed)
                if (_this.handles[id]){
                    _this.result[resultId]           = _this.handles[id].value.value;
                    _this.result[resultId+'Percent'] = _this.handles[id].value.percent;
                }
            });
        },


        /*******************************************************************
        adjustResult - adjust this.result before onCreate, onChanging,.. is called
        *******************************************************************/
        adjustResult: function(){
            //Nothing here but desencing class can overwrite it
        },

        /*******************************************************************
        preOnChange - Called before onChange
        *******************************************************************/
        preOnChange: function( /* result */ ){
            //Nothing here but desencing class can overwrite it
        },

        /*******************************************************************
        preOnChanging - Called before onChanging
        *******************************************************************/
        preOnChanging: function( /* result */ ){
            //Nothing here but desencing class can overwrite it
        },

        /*******************************************************************
        on Call the callback-function set by options.onID
        *******************************************************************/
        on: function( id ){
            if (this.callback[id]){
                this.adjustResult();
                this.callback[id](this.result);
            }
        },

        /*******************************************************************
        onChange
        *******************************************************************/
        onChange: function(){
            this.updateResult();
            if ( this.callback.change && objectsAreDifferent(this.result, this.lastResult) ){
                this.adjustResult();
                this.preOnChange( this.result );
                this.on('change');
                this.lastResult = $.extend({}, this.result);
            }
        },

        /*******************************************************************
        onChanging
        *******************************************************************/
        onChanging: function(){
            //If it is dragging and onChangeOnDragging == false => set timeout to call onChange after XX ms if the handle hasn't moved
            if (this.currentHandle && !this.options.onChangeOnDragging && this.options.onChangeDelay){
                if (this.onChangeDelayTimeout)
                    window.clearTimeout(this.onChangeDelayTimeout);
                var _this = this;
                this.onChangeDelayTimeout =
                    window.setTimeout(
                        function () { _this.onChange(); },
                        this.options.onChangeDelay
                    );
            }

            if ( this.options.onChangeOnDragging || (!this.isRepeatingClick && !this.currentHandle) )
                this.onChange();
            this.updateResult();
            this.preOnChanging( this.result );
            this.on('changing');
        },





    }); //end of BaseSlider.prototype

}(jQuery, this, document));
