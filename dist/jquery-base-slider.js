/****************************************************************************
    jquery-base-slider, Description from README.md

    (c) 2015, FCOO

    https://github.com/fcoo/jquery-base-slider
    https://github.com/fcoo

****************************************************************************/
(function ($, window, document, undefined) {
    "use strict";

    //Create baseSlider-namespace
	window._baseSlider = window._baseSlider || {};
	var ns = window._baseSlider;

    /*******************************************************************
    ********************************************************************
    DEFAULT OPTIONS
    ********************************************************************
    *******************************************************************/
    var defaultOptions = {
        //Type and handle
        double      : false,    // Choose single or double, could be false - for one handle, or true for two handles
        handle      : "down",   // Choose handle type, could be "horizontal", "vertical", "down", "up", "left", "right", "round", "range", or "fixed"
        readOnly    : false,    // Locks slider and makes it inactive.
        disable     : false,    // Locks slider and makes it disable ("dissy")
        handleFixed : false,    // Special version where the slider is fixed and the grid are moved left or right to select value. handle is set to "single"
                                // A value for options.width OR options.valueDistances must be provided
        mousewheel  : true,     // Adds mousewheel-event to the parent-element of the slider. Works best if the parent-element only contains the slider and has a fixed height and width
        resizable   : false,    //If true the container of the slider can be resized and the grid will automatic redraw to adjust number of ticks and labels to the new width

        //Dimensions (only for options.handleFixed: true)
        width         : 0,      // The total width of the slider (px)
        valueDistances: 3,      // The distance between each value on the slider (px). Width will be valueDistances*( max - min )
        useParentWidth: false,  //If true the slider try using the width of the parent of the container. Useful if the container is hidden when the slider is created

        //Ranges and value
        min  : 0,           // Set slider minimum value
        max  : 100,         // Set slider maximum value
        value: null,        // Set start position for single handle
        from : null,        // Set start position for left handle
        to   : null,        // Set start position for right handle

        valueMin  : null,   // Minimum limit single handle.
        valueMax  : null,   // Maximum limit single handle

        fromFixed: false,   // Fix position of left handle.
        fromMin  : null,    // Minimum limit for left handle.
        fromMax  : null,    // Maximum limit left handle

        toFixed: false,     // Fix position of right handle.
        toMin  : null,      // Set the minimum limit for right handle
        toMax  : null,      // Set the maximum limit for right handle

        pinValue: null,             // The value for the pin. Use  setPin( value [, color] )  to change the value dynamical
        pinColor: 'black',          // The color of the pin. Use  setPin( value , color )  to change the color dynamical
        pinIcon : 'fa-map-marker',  // The class-name from Fontawasome setting the icon used as pin


        //Ticks and labels
        majorColor  : '#000000',
        minorColor  : '#555555',

        //Steps
        step        : 1,    // Set sliders step. Always > 0. Could be fractional.
        stepOffset  : 0,    // When  step  > 1: Offset for the allowed values. Eq. Min=0, max=100, step=5, stepOffset=3 => allowed values=3,8,13,...,92,97 (3+N*5). Only tested for options.single: true
        intervalMin : 0,    // Minimum interval between left and right handles. Only for options.double: true
        intervalMax : 0,    // Maximum interval between left and right handles. Only for options.double: true

        keyboardShiftStepFactor: 5,  //Factor when pressing etc. shift-left compare to left
        keyboardPageStepFactor : 20, //Step-factor when pressing pgUp or PgDn

        //Slide-line
        showLine           : true,  //If false the line with the handle is hidden
        showLineColor      : true,
        lineColor          : '#428BCA', //The color of the line left of the handle (single) or between the two handles (double)
        lineBackgroundColor: '#d1d6e0', //The bakground color of the line
        lineColors         : null, //[][{from, to, color}] Static colors for the line

        showImpactLineColor   : false, // The line on a double slider is coloured as green-[handle]-yellow-[handle]-red
        impactLineColors      : {green: "green", yellow: "yellow", red: "red"}, //The line colors used when showImpactLineColor: true
        reverseImpactLineColor: false, // The line on a double slider is colored as red-[handle]-yellow-[handle]-green. Must have showImpactLineColor: true

        //Extention of line-color and/or grid-color when the handle is fixed (handleFixed: true)
        extendLine          : true,     //If true and showLine: true => show light gray line before and after the line
        extendGridColors    : true,     //If true and grid-colors are given => show light gray line before and after the grid

        //Size
        sizeFactor: 1, //Factor to re-size default sizes
        fixedSize: {
            borderWidth: 1,
        },
        size: {
            fontSize  : 10,
            fontFamily: 'Arial',
            fontWeight: '',

            majorTickLength : 9,
            minorTickLength : 6,

            lineHeight      : 6,


            lineBorderRadius: 2,
            textPadding     : 2

        },

        //Grid (ticks and label)
        grid            : false,                      // Enables grid of values.
        noTicks         : false,                      //If true no ticks are added, but the space are (used internally)
        majorTicks      : null,                       // Nummber of  step  between major ticks. Default=null=> Calculated automatic
        majorTicksOffset: 0,                          // Offset for the values where a major ticks is placed. Eq. Min=0, max=100 => major ticks on values=0,10,20,..,90,100. With  majorTicksOffset:4  the major ticks would be placed on values=4,14,24,...,84,94
        showMinorTicks  : true,                       // Show minor ticks.
        gridDistances   : [1, 2, 5, 10, 20, 50, 100], // Distance between major ticks. E.g. Slider with hours could use [1, 2, 4, 12, 24]
        ticksOnLine     : false,                      // Place the ticks in the (first) grid on the line with the handles.
        majorTicksFactor: 1,                          // Not documented

        gridColors      : null, //Array of { [fromValue, ]value, color } to set colors on the line. If no fromValue is given the the previous value is used.
                                //If value == null or < min => A triangle is added to the left indicating 'below min'.
                                //If value > max            =>  A triangle is added to the right indicating 'above max'.
        labelColors     : null, //Array of {value, color, backgroundColor} to set frame around and color, backgroundColor for the label and with value

        labelClickable         : true, //Allows click on labels to select value of label. If false a click on a label is equal to a click on the line (e.q. find nearest value

        //Marker above handle
        showMinMax : false,    // Show min and max markers
        showFromTo : true,     // Show from and to markers
        markerFrame: false,    // Frame the from- and to-marker

        //Adjust labels and markers
        prettify        : null,  // Set up your prettify function. Can be anything. For example, you can set up unix time as slider values and than transform them to cool looking dates.
        prettifyLabel  : null,   // As  prettify  but for the labels in the grid.
        prefix          : "",    // Set prefix for values. Will be set up right before the number: $100
        postfix         : "",    // Set postfix for values. Will be set up right after the number: 100k
        decorateBoth   : true,   // Used for options.double:true and only if prefix or postfix was set up. Determine how to decorate close values. For example: $10k - $100k or $10 - 100k
        decorateLabel  : false,  // The labels in the grid also gets  prefix  and/or  postfix
        valuesSeparator: " - ",  // Text between min and max value when labels are combined. valuesSeparator:" to " => "12 to 24"

        //Callback
        onCreate : null, // Called when the slider is created the first time.
        onBuild  : null, // Called when the slider is build
        onUpdate : null, // Is called than slider is modified by external methods update or reset

        onChanging        : null, // Is called every time any values are changed. Also on dragging a handle
        onChange          : null, // Is called when the value, from, or to  value are changed.
        onChangeOnDragging: true, // If false onChange-function is only called when dragging the sliding is finish.
        onChangeDelay     : 500,  // If onChangeOnDragging == false the callback-function is called when the slider has been on the same tick for onChangeDelay milliseconds

        minDistance: 4 //Minimum distance between ticks and between labels

    };

    /*******************************************************************
    ********************************************************************
    COMMON FUNCTIONS
    ********************************************************************
    *******************************************************************/

    /*******************************************************************
    toFixed
    Round num to 5 digits
    *******************************************************************/
    function toFixed( num ) {
        return +num.toFixed(5);
    }

    /*******************************************************************
    ********************************************************************
    CONSTRUCTOR BaseSlider
    ********************************************************************
    *******************************************************************/
    var pluginCount = 0;
    window.BaseSlider = function (input, options, pluginCount) {
        this.input          = input;
        this.pluginCount   = pluginCount;

        this.initializing     = true;
        this.currentHandle    = null;
        this.isRepeatingClick = false;

        /*******************************************************************
        Set and adjust options that can't be changed by this.update(options)
        *******************************************************************/
        // get config from options
        this.options = $.extend(true, {}, defaultOptions, options );

        if (this.options.handleFixed){
            this.options.double = false;
            this.options.handle = options.handle || 'fixed';
        }

        this.options.isSingle = !this.options.double;
        this.options.isDouble = this.options.double;
        this.options.isFixed  = this.options.isSingle && this.options.handleFixed;

        this.options.singleHandleId =
            this.options.isSingle ? (this.options.handleFixed ? 'fixed' : 'single') : 'from-to';

        /*******************************************************************
        this.events contains event-functions and options
        this.events.containerOnResize = called when the size of the container is changed
        *******************************************************************/
        this.events = {
            containerOnResize: this.containerOnResize.bind( this ),
            parentOnResize   : this.parentOnResize.bind( this )
        };

        //Create event-function to be called on resize of the window and the container (added in init)
        if (this.options.resizable)
            //Add resize-event to window
            $(window).on('resize', this.events.containerOnResize );

        /*******************************************************************
        Adjust different sizes
        *******************************************************************/
        var size       = this.options.size,
            sizeFactor = this.options.sizeFactor;

        $.each(size, function(index, id){
            if ( size[id] && $.isNumeric(size[id]) )
                size[id] = sizeFactor * parseFloat( size[id] );
        });

        $.each(this.options.fixedSize, function(id, value){
            size[id] = value;
        });

        //Calc sizes
        size.labelHeight = size.borderWidth + size.textPadding + size.fontSize + size.textPadding + size.borderWidth;

        /*******************************************************************
        this.result = record with the current result from the slider
        this.lastResult = the last version of this.result provided to callback-functions
        *******************************************************************/
        this.result = {
            slider: this
        };

        this.lastResult = $.extend({}, this.result);

        /*******************************************************************
        this.callback = record with functions used on different callbacks
        *******************************************************************/
        this.callback = {};
        ['Create', 'Build', 'Update', 'Changing', 'Change'].forEach( id => {
            var func = this.options['on'+id ];
            if ( func )
                this.callback[ id.toLowerCase() ] =
                    this.options.context ?
                    func.bind( this.options.context ) :
                    func;
        }, this);

        /*******************************************************************
        this.cache = record with all DOM-elements or jQuery-objects
        *******************************************************************/
        this.cache = {
            $input : $(this.input),
        };

        //Hide the input
        this.cache.$input.addClass('hidden-input');

        //Ready to be build
        this.init();

        this.onChange();
        this.on('create');


    };

    window.BaseSlider.prototype = {
        /*******************************************************************
        ********************************************************************
        BUILD AND CREATE THE SLIDER
        ********************************************************************
        *******************************************************************/

        valueToPercent: function( value ){
            return (value - this.options.min) * 100 / (this.options.max - this.options.min);
        },


        /*******************************************************************
        init
        *******************************************************************/
        init: function () {
            var _this = this;

            this.initializing     = true;
            this.currentHandle    = null;
            this.isRepeatingClick = false;

            this.checkParentResize = true;


            /*******************************************************************
            Set and adjust options
            *******************************************************************/
            //Convert labelColors = [] of {value, color, backgroundColor, className} to labelColorRec = { value1: { color, backgroundColor, className }, value2: color, backgroundColor, className },...}
            this.options.labelColorRec = {};
            if (this.options.labelColors)
                this.options.labelColors.forEach( rec => {
                    this.options.labelColorRec[ rec.value ] = rec;
                }, this);

            //Add options.step to gridDistances
            if (this.options.gridDistances.indexOf(this.options.step) == -1)
                for (var i=0; i<this.options.gridDistances.length; i++ )
                    if (this.options.gridDistances[i] > this.options.step){
                        this.options.gridDistances.splice(i, 0, this.options.step);
                        break;
                    }
            if (this.options.gridDistances.indexOf(this.options.step) == -1)
                this.options.gridDistances.push(this.options.step);

            this.options.hasPin = (this.options.pinValue !== null);

            this.options.fromMin = this.options.fromMin === null ? this.options.min : this.options.fromMin;
            this.options.fromMax = this.options.fromMax === null ? this.options.max : this.options.fromMax;
            this.options.toMin = this.options.toMin === null ? this.options.min : this.options.toMin;
            this.options.toMax = this.options.toMax === null ? this.options.max : this.options.toMax;


            /*******************************************************************
            this.dimentions contains width and left-posiiton of containers
            this.dimentions_old is the last values
            *******************************************************************/
            this.dimentions = {
                containerWidth     :  0, //Width of the container [px]
                outerContainerWidth:  0  //Width of outer container [px]
            };

            this.dimentions_old = $.extend({}, this.dimentions );

            /*******************************************************************
            this.handles contains objects representing a property of the slider
            Each property contains
                - value  : a SliderValue-object
                - $handle: $-element = the handle (optional)
                - $marker: $-element = the marker (optional)
                - dynamic: boolean - true if the property is changes by the user

            Possible id of this.XX is:
                'min', 'handleMin', 'from', single', 'fixed', 'to', 'handleMax', 'max'

            Each handles[id].value is created in this.init
            Each handles[id].$handle and handles[id].$handle are created in this.build

            *******************************************************************/
            this.handles = {};


            /*******************************************************************
            Create this.handles[id] = SliderHandle representing the different
            handles and there relation (See jquery-base-slider-handle.js for more)
            *******************************************************************/
            const addSliderHandle = function addSliderHandle( options ){
                options.slider = this;
                if (options.inclDataPercent)
                    options.markerData = {
                        'data-base-slider-percent': this.valueToPercent(options.value.value)
                    };
                this.handles[options.id] = ns.sliderHandle(options);
            }.bind(this);

            //min = Lowest value on the slider
            addSliderHandle({
                id   : 'min',
                value: { value:this.options.min }
            });

            //max = Highest value on the slider
            addSliderHandle({
                id   : 'max',
                value: { value:this.options.max }
            });

            //handleMin = Lowest value for any handle
            var minMaxMarker = this.options.showMinMax ? 'min-max' : '';
            addSliderHandle({
                id    : 'handleMin',
                value : { value:this.options.min + this.options.stepOffset },
                marker: minMaxMarker,
                inclDataPercent: true,
            });

            //handleMax = Highest value for any handle
            var maxSteps = Math.floor( (this.options.max - this.handles.handleMin.value.value) / this.options.step );
            addSliderHandle({
                id    : 'handleMax',
                value : { value:this.handles.handleMin.value.value + maxSteps*this.options.step },
                marker: minMaxMarker,
                inclDataPercent: true,

            });

            var singleFromToMarker = this.options.showFromTo ? 'single-from-to' + (this.options.markerFrame ? ' frame' : '') : '';
            if (this.options.isSingle)
                //fixed or single = value for the fixed (single) handle
                addSliderHandle({
                    id     : this.options.singleHandleId,
                    value  : {
                        value       : this.options.value,
                        minList     : [ this.handles.handleMin.value, this.options.valueMin ],
                        maxList     : [ this.handles.handleMax.value, this.options.valueMax ],
                        adjustToStep: true
                    },
                    $handle: true,
                    marker : singleFromToMarker
                });
            else {
                //from = value for the left handle
                addSliderHandle({
                    id     : 'from',
                    value  : {
                        value       : this.options.from,
                        minList     : [ this.handles.handleMin.value, this.options.fromMin ],
                        maxList     : [ this.handles.handleMax.value, this.options.fromMax ],
                        adjustToStep: true,
                        fixed       : this.options.fromFixed
                    },
                    $handle: true,
                    marker : singleFromToMarker
                });

                //to = value for the right handle
                addSliderHandle({
                    id     : 'to',
                    value  : {
                        value       : this.options.to,
                        minList     : [ this.handles.handleMin.value, this.options.toMin ],
                        maxList     : [ this.handles.handleMax.value, this.options.toMax ],
                        adjustToStep: true,
                        fixed       : this.options.toFixed
                    },
                    $handle: true,
                    marker : singleFromToMarker
                });

                //Set onFocus for from- and to-handle
                var onFocus = function (onFocus) {
                    return function () {
                        //Original function/method
                        onFocus.apply(this, arguments);

                        //Extra
                        _this.cache.$container.find('.type-last').removeClass('type-last');
                        this.$handle.addClass('type-last');
                    };
                } (ns.SliderHandle.prototype.onFocus);

                this.handles.from.onFocus = onFocus;
                this.handles.to.onFocus   = onFocus;

                //Add min and max-value to from- and to-handle
                this.handles.from.value.addMax( this.handles.to.value, this.options.intervalMin );
                this.handles.to.value.addMin( this.handles.from.value, this.options.intervalMin );

                if (this.options.intervalMax){
                    this.handles.from.value.addMin( this.handles.to.value, -1*this.options.intervalMax );
                    this.handles.to.value.addMax( this.handles.from.value, -1*this.options.intervalMax );
                }

                //Add handle 'toFromCenter' to be used as common marker when the marker of to- and from-handle overlaps
                addSliderHandle({
                    id    : 'toFromCenter',
                    value : { value: 0 },
                    marker: singleFromToMarker
                });
                //Overwrite methods getLeftPosition, getMarkerText, and markerIsHidden to place toFromCenter's marker between from and to when there markers is overlapping
                this.handles.toFromCenter.getLeftPosition = function(){
                    return (_this.handles.from.getLeftPosition() + _this.handles.to.getLeftPosition() )/2;
                };

                this.handles.toFromCenter.getMarkerText = function(){
                    var fromHandle = _this.handles.from,
                        fromValue  = fromHandle.value.value,
                        toHandle   = _this.handles.to,
                        toValue    = toHandle.value.value,
                        separator  = _this.options.valuesSeparator;

                    if (fromValue == toValue)
                        return toHandle.getMarkerText();

                    if (_this.options.decorateBoth)
                        return fromHandle.getMarkerText() + separator + toHandle.getMarkerText();
                    else
                        return _this.decorate( _this._prettify(fromValue) + separator + _this._prettify(toValue) );
                };

                this.handles.toFromCenter.markerIsHidden = function(){
                    return !_this.handles.from.markerIsHidden();
                };
            } //end of from and to


            //pin = Special version: Small font-icon on the slider
            if (this.options.hasPin){
                addSliderHandle({
                    id     : 'pin',
                    value  : {
                        value: this.options.pinValue,
                        fixed: true
                    },
                    $handle        : true,
                    handleClassName: 'fa ' + this.options.pinIcon,
                    handleCSS      : {color: this.options.pinColor}
                });
            }


            //Sets overlapping-info for the handles
            function addMarkerOverlapping( id, idList ){
                var handle = _this.handles[id];
                if (handle && idList)
                    idList.forEach( id => {
                        var overlappingHandle = _this.handles[id];
                        if (overlappingHandle)
                            overlappingHandle.addOverlap( handle );
                    });
            }

            var idList = ['from', 'single', 'toFromCenter', 'to'];
            addMarkerOverlapping( 'handleMin', idList );
            addMarkerOverlapping( 'handleMax', idList );

            addMarkerOverlapping( 'from', ['to']   );
            addMarkerOverlapping( 'to',   ['from'] );


            /*******************************************************************
            this.mouse = a special version representing the position of
            the mouse/pointer relative to the slider: value 0-width of line, percent: 0-100

            The offsets are set in this.onPanstart

            this.mouse.valueOffset is allways set to the left-position of the slider
            this.mouse.valueRange is allways set to width of the slider

            this.mouse.percentOffset is set to the different between the mouse-position (%) and
            the percent-value of the handle

            This means that this.mouse.setValue( "the x position of the mouse" ) =>
                this.mouse.getPercent() returne the position (%) of the handle relative to the slider (0-100)
            *******************************************************************/
            this.mouse = ns.sliderValue({ slider: this, value: 0 });

            //options used to calculate grid and labels
            this.options.total  = this.options.max - this.options.min;
            this.options.range  = this.options.max - this.options.min;
            this.options.percentProValue = 100 / (this.options.max - this.options.min);



            /*******************************************************************
            Build the different containers to hold the slider
            *******************************************************************/
            this.cache.$container =
                $('<div/>')
                    .addClass(['base-slider-container', this.options.handle, 'js-base-slider-' + this.pluginCount ]);


            this.cache.$input.before(this.cache.$container);
            this.cache.$input.prop("readonly", true);

            this.result.$slider = this.cache.$container;

            //if options.handleFixed: Remove margin for the handle and put inside outer-container
            if (this.options.handleFixed){
                this.cache.$container
                    .addClass('handle-is-fixed')
                    .wrap('<div/>');
                this.cache.$fullWidthContainer = this.cache.$container.parent();
                this.cache.$fullWidthContainer.addClass('base-slider-container-full-width');

                //Sets the width of the container with full width
                var width = this.options.width || this.options.valueDistances*(this.options.max - this.options.min);

                this.cache.$fullWidthContainer.width( width +'px' );

                this.cache.$fullWidthContainer.wrap('<div/>');
                this.cache.$outerContainer = this.cache.$fullWidthContainer.parent();
                this.cache.$outerContainer.addClass('base-slider-container-outer');
            }

            this.cache.$innerContainer =
                $('<span/>')
                    .addClass('base-slider-inner-container')
                    .appendTo(this.cache.$container);


            //Mark the slider not-build and call checkContainerDimentions to check and wait for the container to have a width > 0 (incl display != none)
            this.isBuild = false;
            this.initializing = false;

            this.checkContainerDimentions();

        }, //End of init

        /*******************************************************************
        eachHandle - visit each handle and call method
        *******************************************************************/
        eachHandle: function( method, arg ){
            $.each( this.handles, function( id, handle ) {
                handle[method]( arg );
            });
        },

        /*******************************************************************
        build
        *******************************************************************/
        build: function () {
            var _this = this;
            //**************************************
            function $span( className, $parent, prepend ){
                var result = $('<span/>');
                if (className)
                    result.addClass( className );
                if ($parent)
                  prepend ? result.prependTo( $parent ) : result.appendTo( $parent );
                return result;
            }
            //**************************************

            /****************************************************
            Append handles and markers
            ****************************************************/
            this.eachHandle('append', this.cache.$container );

            /****************************************************
            Create the line and optional colors (XXLineColor)
            ****************************************************/
            this.cache.$lineBackground = $span('line-background', this.cache.$innerContainer);
            this.cache.$line = $span('line', this.cache.$innerContainer).prop('tabindex', -1);

            if (this.options.lineBackgroundColor)
                this.cache.$line.css('background-color', this.options.lineBackgroundColor);

            //Create up to tree span with different colors of the line:
            //this.cache.$leftColorLine, this.cache.$centerColorLine, this.cache.$rightColorLine
            function appendLineColor( left, center, right ){
                var result;

                if (left)   result = _this.cache.$leftLineColor   = $span('line-color', _this.cache.$line);
                if (center) result = _this.cache.$centerLineColor = $span('line-color', _this.cache.$line);
                if (right)  result = _this.cache.$rightLineColor  = $span('line-color', _this.cache.$line);
                return result; //Only last added
            }

            if (this.options.showLine){
                //1. double-handle with impact- or reverse-impact-colors
                if (this.options.isDouble && this.options.showImpactLineColor){
                    appendLineColor( true, true, true );
                    this.setImpactLineColors();
                }
                else
                    //2. Add static colors given by options.lineColors
                    if (this.options.lineColors){
                        var from = this.options.min,
                            to = from,
                            fromPercent,
                            toPercent,
                            sliderValue = ns.sliderValue({slider: this});
                        this.options.lineColors.forEach( fromToColor => {
                            from = fromToColor.from === undefined ? to : fromToColor.from;
                            to = fromToColor.to === undefined ? _this.options.max : fromToColor.to;
                            fromPercent = sliderValue.setValue( from ).getPercent();
                            toPercent = sliderValue.setValue( to ).getPercent();
                            $span('line-color', _this.cache.$line)
                                .addClass( fromToColor.className )
                                .css({
                                    'left'              : fromPercent + '%',
                                    'width'             : (toPercent-fromPercent) + '%',
                                    'background-color'  : fromToColor.color
                                });
                        });
                    }
                    else
                        //3. Normal line-color to the left of handle (single) or between handles (double)
                        if (this.options.showLineColor)
                            appendLineColor( this.options.isSingle, this.options.isDouble, false )
                                .css('background-color', this.options.lineColor);

                //For fixed slider: Add dim line before and after to have line in hole container
                if (this.options.handleFixed && this.options.extendLine){
                    $span('line-color pre' , _this.cache.$line, true);
                    $span('line-color post', _this.cache.$line);
                }
            }
            else
                this.cache.$line.css("visibility", "hidden");

            //Update the height of the slider
            this.cache.$container.css('height', this.cache.$lineBackground.height()+'px' );

            /****************************************************
            Append grid with ticks and optional labels
            ****************************************************/
            //Adjust top-position if no marker is displayed
            if (!this.options.showMinMax && !this.options.showFromTo)
                this.cache.$container.addClass("no-marker");

            //Adjust top-position of first grid if tick must be on the handle
            if (this.options.ticksOnLine)
                this.cache.$container.addClass("ticks-on-line");

            //Speciel case: Adjust top-position of line etc. if it is a range-slider with no marker and with a pin!
            if (this.options.hasPin)
                this.cache.$container.addClass("has-pin");

            //Append grid(s)
            this.$currentGrid = null;
            if (this.options.grid)
                this.appendGrid();

            //Add classes to control display
            if (this.options.disable) {
                this.cache.$container.addClass("disabled");
                this.cache.$input.prop('disabled', true);
            }
            else
                if (this.options.readOnly){
                    this.cache.$container.addClass("read-only");
                    this.cache.$input.prop('disabled', true);
                }
                else {
                    this.cache.$container.addClass("active");
                    this.cache.$input.prop('disabled', false);
                    this.bindEvents();
                }

            this.isBuild = true;

            this.on('build');

        }, //end of build

        /*******************************************************************
        remove
        *******************************************************************/
        remove: function () {
            //Remove pending updates
            if (this.resizeTimeoutId){
                window.clearTimeout(this.resizeTimeoutId);
                this.resizeTimeoutId = null;
            }

            if (this.options.resizable)
                //Remove resize-event from window
                $(window).off('resize', this.events.containerOnResize );


            if (this.cache.$outerContainer){
                this.cache.$outerContainer.remove();
                this.cache.$outerContainer = null;
            }
            else {
                this.cache.$container.remove();
                this.cache.$container = null;
            }

            this.eachHandle('remove');

        },

        /*******************************************************************
        ********************************************************************
        ADJUST ELEMENTS
        ********************************************************************
        *******************************************************************/

        /*******************************************************************
        setImpactLineColors
        Sets the color of the line when line colors are impact (green-yellow-red)
        *******************************************************************/
        setImpactLineColors: function(){
            this.cache.$leftLineColor.css  ( 'background-color', this.options.impactLineColors[ this.options.reverseImpactLineColor ? 'red' : 'green' ] );
            this.cache.$centerLineColor.css( 'background-color', this.options.impactLineColors.yellow );
            this.cache.$rightLineColor.css ( 'background-color', this.options.impactLineColors[ this.options.reverseImpactLineColor ? 'green' : 'red' ] );
        },

        /*******************************************************************
        currentHandleBlur
        *******************************************************************/
        currentHandleBlur: function () {
            if (this.currentHandle)
                this.currentHandle.onBlur();
            this.currentHandle = null;
        },


        /*******************************************************************
        updateHandlesAndLines
        *******************************************************************/
        updateHandlesAndLines: function () {
            //***********************************************
            function setLeftAndWidth( $elem, left, width ){
                if (!$elem) return;
                var css = {};
                if (left !== null)
                    css.left = toFixed(left) + (left ? '%' : '');
                if (width !== null)
                    css.width = toFixed(width) + (width ? '%' : '');
                $elem.css( css );
            }
            //***********************************************

            /*****************************************************
            Adjust left-position and width of all lineColor-elements (if any)
            *****************************************************/
            if (this.options.isSingle) {
                var singlePercent = this.handles[this.options.singleHandleId].value.getPercent();
                setLeftAndWidth( this.cache.$leftLineColor,  null,          singlePercent       );
                setLeftAndWidth( this.cache.$rightLineColor, singlePercent, 100 - singlePercent );
            }
            else {
                var fromPercent = this.handles.from.value.getPercent(),
                    toPercent   = this.handles.to.value.getPercent();
                setLeftAndWidth( this.cache.$leftLineColor,   null,        fromPercent             );
                setLeftAndWidth( this.cache.$centerLineColor, fromPercent, toPercent - fromPercent );
                setLeftAndWidth( this.cache.$rightLineColor,  toPercent,   100 - toPercent         );
            }

            /*****************************************************
            Set position of all handles
            *****************************************************/
            this.eachHandle('update');

            //Special case for fixed-mode: Keep the handle centered in container
            if (this.options.isFixed){
                var containerLeft =
                        -1.0 * this.dimentions.containerWidth * this.handles.fixed.value.percent/100 +
                         0.5 * this.dimentions.outerContainerWidth;

                this.cache.$container.css('left', toFixed(containerLeft) + 'px');
            }

            /*****************************************************
            Callback and reset
            *****************************************************/
            this.onChanging();

        },

        /*******************************************************************
        ********************************************************************
        SERVICE METHODS
        ********************************************************************
        *******************************************************************/

        /*******************************************************************
        _prettify
        *******************************************************************/
        _prettify: function (num) {
            return $.isFunction(this.options.prettify) ? this.options.prettify(num) : num;
        },

        /*******************************************************************
        PrettifyLabel
        *******************************************************************/
        _prettifyLabel: function(text) {
            return $.isFunction(this.options.prettifyLabel) ? this.options.prettifyLabel(text) : text;
        },

        /*******************************************************************
        decorate
        *******************************************************************/
        decorate: function ( content ) {
            return this.options.prefix + content + this.options.postfix;
        },

        /*******************************************************************
        ********************************************************************
        GRID
        Use appendGridContainer to create new grids. Use appendLabel(text, left[, value]) to add a grid-label
        ********************************************************************
        *******************************************************************/

        /*******************************************************************
        getTextWidth
        Get width of value as text OR max width of all values in array of value
        *******************************************************************/
        getTextWidth: function( value, options = {} ){
            var _this = this,
                ctx = this.cache.ctx,
                ctx_font = ctx.font,
                valueList = $.isArray( value ) ? value : [value],
                result = 0;

            if (options.italic)
                ctx.font = 'italic ' + ctx.font;
            if (options.bold)
                ctx.font = 'bold ' + ctx.font;

            valueList.forEach( function(txt){
                result = Math.max( result, ctx.measureText( _this._valueToText(txt) ).width );
            });

            ctx.font = ctx_font;

            return result;
        },

        /*******************************************************************
        appendGridContainer
        *******************************************************************/
        appendGridContainer: function( options = {} ){
            //options.labelBetweenTicks = true => special version where the labels are placed up and between the ticks
            this.options.labelBetweenTicks = !!options.labelBetweenTicks;

            var $newGrid = $('<span class="grid"></span>'),
                $newCanvas =
                    $('<canvas/>')
                        .addClass('grid-canvas')
                        .appendTo($newGrid),
                size = this.options.size,
                ctx = this.cache.ctx = $newCanvas.get(0).getContext("2d"),
                canvasMargin = this.cache.canvasMargin = Math.ceil( this.getTextWidth([this._valueToText(this.options.min), this._valueToText(this.options.max)] ) ),
                canvasWidth = this.dimentions.containerWidth + 2 * canvasMargin,
                canvasHeight = this.options.labelBetweenTicks ?
                                Math.max(size.majorTickLength, size.fontSize) :
                                size.majorTickLength + size.labelHeight;

            $newGrid.height(canvasHeight);

            $newCanvas
                .css('left', '-'+canvasMargin+'px')
                .attr('width', canvasWidth)
                .attr('height', canvasHeight);

            ctx.clearRect(0, 0, canvasWidth, canvasHeight);
            ctx.translate(0.5, 0.5);
            ctx.lineWidth    = 1;
            ctx.textAlign    = "center";
            ctx.textBaseline = "top";       //"bottom" or "middle" or "alphabetic" or "hanging"

            ctx.strokeStyle = this.options.majorColor;
            ctx.font = size.fontWeight + (size.fontWeight ? ' ' : '') + size.fontSize+'px ' + size.fontFamily;

            if (this.options.labelClickable && !this.options.disable && !this.options.readOnly){
                this.canvasId = this.canvasId || 0;
                this.canvasId++;
                $newCanvas.data('canvasId', this.canvasId);
                this.canvasLabels = this.canvasLabels || {};
                this.canvasLabels[this.canvasId] = [];
            }

            if (this.$currentGrid){
                this.nextGridTop += this.$currentGrid.height();
                this.$currentGrid = $newGrid.insertAfter( this.$currentGrid );
                this.$currentGrid.css('top', this.nextGridTop+'px' );
            }
            else {
                this.$currentGrid = $newGrid.appendTo(this.cache.$container);
                this.nextGridTop = this.$currentGrid.position().top;
            }

            this.cache.$grid = this.cache.$container.find(".grid");

            //Special case: If the labels for the current grid shall be placed between the ticks instead of under..
            if (this.options.labelBetweenTicks){
                this.$currentGrid.addClass("label-between-ticks");
            }
        },


        /*******************************************************************
        appendTick
        *******************************************************************/
        appendTick: function( leftPercent, options ){
            if (!this.$currentGrid || this.options.noTicks) return;

            options = $.extend( {minor: false/*, color: ''*/}, options );

            var left = this.cache.canvasMargin + (this.dimentions.containerWidth * leftPercent / 100),
                ctx  = this.cache.ctx,
                size = this.options.size,
                length = options.minor ? size.minorTickLength : size.majorTickLength;


            ctx.beginPath();

            ctx.shadowColor   = 'rgba(255, 255, 255, .75)';
            ctx.shadowOffsetX = 1;
            ctx.shadowOffsetY = 0;
            ctx.lineWidth     = 1;
            ctx.strokeStyle   = options.minor ? this.options.minorColor : this.options.majorColor;
            ctx.moveTo(left, 0);
            ctx.lineTo(left, length );
            ctx.stroke();

            ctx.shadowOffsetX = 0;
            ctx.shadowOffsetY = 0;
      },

        /*******************************************************************
        _valueToText
        *******************************************************************/
        _valueToText: function( value ){
            var result = this._prettifyLabel( value );
            return this.options.decorateLabel ? this.decorate(result) : result;
        },

        /*******************************************************************
        appendLabel
        *******************************************************************/
        appendLabel: function( leftPercent, value, options ){
            if (!this.$currentGrid) return;

            options = $.extend( {color: ''}, options );

            //Check if the value for the label is a selectable one
            options.labelClickable = options.labelClickable &&  ((value - this.options.stepOffset) % this.options.step) === 0;

            var text = this._valueToText( value ),
                size   = this.options.size,
                ctx    = this.cache.ctx,
                left   = this.cache.canvasMargin + (this.dimentions.containerWidth * leftPercent / 100),
                textWidth = this.getTextWidth(text),
                top, width, height, boxLeft, textTop;

            if (this.options.labelBetweenTicks){
                //Special case where the labels are placed up between the ticks
                top     = 0;
                textTop = 0;
                width   = textWidth;
                height  = size.fontSize;
            }
            else {
                top     = size.majorTickLength;
                textTop = top + size.borderWidth + size.textPadding;
                width   = size.borderWidth + size.textPadding + textWidth + size.textPadding + size.borderWidth,
                height  = size.labelHeight;
            }
            boxLeft = left - width/2;

            //Find bg-color and text-color
            var color = options.minor ? this.options.minorColor : this.options.majorColor,
                textColor = color,
                labelColorRec = this.options.labelColorRec[value],
                canvasLabels = this.canvasLabels[this.canvasId];

            if (labelColorRec){
                //Label with individual background- and text-color
                var bgColor   = labelColorRec.backgroundColor;
                textColor = labelColorRec.color;

                //Draw border and background (if any)
                ctx.fillStyle = color;
                ctx.fillRect(boxLeft, top, width, height);
                ctx.fillStyle = bgColor;

                ctx.beginPath();
                ctx.fillRect(boxLeft + size.borderWidth, top + size.borderWidth, width - 2*size.borderWidth, height - 2*size.borderWidth);
                ctx.stroke();
            }

            //ctx.fillStyle = 'pink';                     //Only test
            //ctx.fillRect(boxLeft, top, width, height);  //Only test

            if (options.labelClickable && !this.options.disable && !this.options.readOnly)
                canvasLabels.push( {top: top, left: boxLeft, right: boxLeft+width, bottom: top+height, percent: leftPercent} );

            //Draw the text
            var ctx_font = ctx.font;
            if (!options.minor)
                ctx.font = 'bold ' + ctx.font;
            if (options.italic)
                ctx.font = 'italic ' + ctx.font;
            ctx.fillStyle = textColor;

            ctx.beginPath();
            ctx.fillText(text, left, textTop);
            ctx.stroke();

            ctx.font = ctx_font;
        },


        /*******************************************************************
        appendGrid
        *******************************************************************/
        appendGrid: function () {
            if (!this.options.grid) return;
            this.appendStandardGrid();
        },

        /*******************************************************************
        appendStandardGrid
        Simple call _appendStandardGrid. Can be overwriten in decending classes
        *******************************************************************/
        appendStandardGrid: function ( textOptions ) {
            this._appendStandardGrid( textOptions );
        },


        /*******************************************************************
        preAppendGrid and postAppendGrid
        must be called as first and last when creating a grid - used if a new appendStandardGrid is used
        *******************************************************************/
        preAppendGrid: function( options = {} ){
            this.appendGridContainer( options );
        },

        postAppendGrid: function(){
            if (this.options.handleFixed && this.options.gridColors && this.options.extendGridColors)
                this.appendPreAndPostGridColors();

            //Update the height of the slider
            this.cache.$container.css('height', (this.nextGridTop + this.$currentGrid.height())+'px' );
        },


        /*******************************************************************
        getGridOptions
        Get options needed for building the grid
        *******************************************************************/
        getGridOptions: function(){
            var o = this.options,
                result = {},
                gridDistanceIndex = 0;

            result.gridContainerWidth = this.cache.$grid.outerWidth(false);
            result.gridDistanceStep = o.gridDistances[gridDistanceIndex]; // = number of steps between each tick
            result.stepPx = o.step * result.gridContainerWidth / o.range / o.majorTicksFactor;

            //Increse grid-distance until the space between two ticks are more than 4px
            while ( (result.stepPx*result.gridDistanceStep) <= o.minDistance){
                gridDistanceIndex++;
                if (gridDistanceIndex < o.gridDistances.length)
                    result.gridDistanceStep = o.gridDistances[gridDistanceIndex];
                else
                    result.gridDistanceStep = result.gridDistanceStep*2;
            }

            result.tickDistanceNum = result.gridDistanceStep * o.step;          //The numerical distance between each ticks
            result.tickDistancePx  = result.gridDistanceStep * result.stepPx;   //The px distance between each ticks

            if (o.maxLabelWidth)
                result.maxLabelWidth = o.maxLabelWidth;
            else {
                //Find widest label
                var value = o.min,
                    valueList = [],
                    step = 1;

                while (value <= o.max){
                    //if value corrected by o.majorTicksOffset and o.majorTicksFactor is a DIV of the tick distance => calculate the width of the tick
                    if ((value - o.majorTicksOffset)*o.majorTicksFactor % result.tickDistanceNum === 0){
                        valueList.push( value );
                        step = result.tickDistanceNum;
                    }
                    value += step;
                }
                result.maxLabelWidth = this.getTextWidth( valueList ) + o.minDistance; //Adding min space between text/labels
            }

            //Calculate automatic distances between major ticks
            var majorTicks = o.majorTicks;
            if (!majorTicks){
                //Find ticks between each major tick
                gridDistanceIndex = 0;
                majorTicks = o.gridDistances[gridDistanceIndex];
                while (majorTicks * result.tickDistancePx < result.maxLabelWidth){
                    gridDistanceIndex++;
                    if (gridDistanceIndex < o.gridDistances.length)
                        majorTicks = o.gridDistances[gridDistanceIndex];
                    else
                        majorTicks = majorTicks*2;
                }
            }

            result.majorTickDistanceNum = result.tickDistanceNum * majorTicks;
            result.majorTickDistancePx  = result.tickDistancePx  * majorTicks;

            return result;
        },


        /*******************************************************************
        _appendStandardGrid
        *******************************************************************/
        _appendStandardGrid: function ( textOptions, tickOptions, gridContainerOptions ) {
            this.preAppendGrid( gridContainerOptions );

            textOptions = $.extend( {labelClickable: this.options.labelClickable}, textOptions || {}  );
            tickOptions = tickOptions || {};

            //Get all options regarding the grid
            this.gridOptions = this.getGridOptions();
            $.extend( this.options, this.gridOptions );

            //Add all the minor and major ticks
            var o     = this.options,
                value = o.min,
                step  = 1,
                valueP, valueOffset;

            while (value <= o.max){
                valueOffset = (value - o.majorTicksOffset)*o.majorTicksFactor;
                if (valueOffset % o.tickDistanceNum === 0){
                    valueP = (value-o.min)*o.percentProValue;
                    if (valueOffset % o.majorTickDistanceNum === 0){
                        //add major tick and text/label
                        this.appendTick( valueP, tickOptions );
                        this.appendLabel( valueP, value, textOptions );
                    }
                    else
                        if (o.showMinorTicks)
                            //Add minor tick
                            this.appendTick( valueP, { minor:true } );
                    step = o.tickDistanceNum;
                }
                value += step;
            }

            //Append colors on the grid
            if (this.options.gridColors)
                this.appendGridColors( this.options.gridColors );

            this.postAppendGrid();
        },

        /*******************************************************************
        addGridColor
        *******************************************************************/
        appendGridColors: function( gridColors ){
            var fromValue,
                toValue  = this.options.min,
                percentFactor = 100 / (this.options.max - this.options.min);


            gridColors.forEach( (gridColor, index) => {
                if ( (gridColor.value === null) || (gridColor.value < this.options.min) || (gridColor.value > this.options.max) ){
                    //add triangle to the left or right
                    var $span = $('<span/>')
                                    .addClass( 'grid-color')
                                    .appendTo( this.$currentGrid );
                    if (gridColor.value > this.options.max)
                        $span
                            .addClass('gt-max')
                            .css('border-left-color', gridColor.color);
                    else
                        $span
                            .addClass('lt-min')
                            .css('border-right-color', gridColor.color);
                }
                else {
                    fromValue = gridColor.fromValue !== undefined ? gridColor.fromValue : toValue;
                    toValue = gridColor.value;

                    $('<span/>')
                        .addClass('grid-color' + (index%2?' to':' from'))
                        .addClass( gridColor.className )
                        .css({
                            'left'            : percentFactor*(fromValue - this.options.min) + '%',
                            'width'           : percentFactor*(toValue-fromValue) + '%',
                            'background-color': gridColor.color
                           })
                        .appendTo( this.$currentGrid );
                }
            }, this);
        },

        appendPreAndPostGridColors: function(){
            $('<span/>')
                .addClass( 'grid-color pre')
                .prependTo( this.$currentGrid );
            $('<span/>')
                .addClass( 'grid-color post')
                .appendTo( this.$currentGrid );
        }





    }; //end of BaseSlider.prototype


    $.fn.baseSlider = function (options) {
        return this.each(function() {
            if (!$.data(this, "baseSlider")) {
                $.data(this, "baseSlider", new window.BaseSlider(this, options, pluginCount++));
            }
        });
    };


}(jQuery, this, document));

;
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

        if (props)
            props.forEach( id => {
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
                func = param ? func.bind(_this, param) : func.bind( _this );

                if (eventNames)
                    eventNames.split(' ').forEach( eventName => {
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
            this.resizeTimeoutId = window.setTimeout(this.checkContainerDimentions.bind(this), 200 );
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
                        this.checkContainerDimentions_TimeoutId = window.setTimeout( this.checkContainerDimentions.bind(this), 200 );
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
                if (list)
                    list.forEach( listObj => {
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

                    (_this.canvasLabels[canvasId] || []).forEach(rec => {
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

            ['min', 'from', singleHandleId, 'to', 'max'].forEach( id => {
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

;
/****************************************************************************
    jquery-base-slider-handle,

    (c) 2015, FCOO

    https://github.com/fcoo/jquery-base-slider
    https://github.com/fcoo

****************************************************************************/
(function (window/*, document, undefined*/) {
    "use strict";

    //Create baseSlider-namespace
	window._baseSlider = window._baseSlider || {};
	var ns = window._baseSlider;

    /*******************************************************************
    elementsOverlapping
    Return true if $element1 and $element2 is overlapping horizontal
    *******************************************************************/
    function elementsOverlapping( $element1, $element2 ){
        if ($element1 && $element2){
            var rect1 = $element1.get(0).getBoundingClientRect(),
                rect2 = $element2.get(0).getBoundingClientRect();
            return ((rect1.left >= rect2.left) && (rect1.left <= rect2.right)) ||
                    ((rect2.left >= rect1.left) && (rect2.left <= rect1.right));
        }
        return false;
    }

    /*******************************************************************
    SliderHandle
    Object to reprecent a 'handle' on the slider
    The handle don't need to have a actual DOM-handle. The min and max-value of the slider
    is also reprecented as a SliderHandle
    The object contains the following items:
        value   : A SliderValue-object reprecenting the value
        $handle : $-object = the DOM handle (optional)
        marker  : Object containing of tree $-object: $outer and $text (optional)

    options
        marker: [string] = class-name of the marker
    *******************************************************************/
    var SliderHandle = function( options ){
        this.id      = options.id;
        this.slider  = options.slider || options.value.slider;
        options.value.slider = this.slider;
        this.value   = ns.sliderValue( options.value );
        this.$handle = !!options.$handle; //Set to boolean. Created in this.append
        this.handleClassName = options.handleClassName || '';
        this.handleCSS = options.handleCSS || {};
        this.appended = false,

        this.markerData = options.markerData || {};

        this.markerClassName = options.marker;
        this.marker  = !!this.markerClassName;

        //overlappingHandleList = list of SliderHandle. If any of the marker in overlappingHandleList[xx] is overlapping this => this is hidden
        this.overlappingHandleList = [];

        //overlapHandleList = list of SliderHandle. this is overlapping all the marker in overlapHandleList[xx]
        this.overlapHandleList = [];


        this.draggingClassName = options.draggingClassName; //Classname for handler when it is being dragged MANGLER
        this.lastLeftPercent = '';
    };

    SliderHandle.prototype = {
        //addOverlap( handle ) - Set this to overlap handle
        addOverlap: function( handle ){
            if (this.marker && handle && handle.marker ){
                this.overlapHandleList.push( handle );
                handle.overlappingHandleList.push( this );
            }
        },

        //append() - Create and append this.$handle and $.marker
        append: function( $container ){
            //Append handle
            if (this.$handle)
                this.$handle =
                    $('<span/>')
                        .addClass('handle '+this.id)
                        .addClass(this.handleClassName)
                        .css( this.handleCSS )
                        .appendTo( $container );

            //Append marker
            if (this.marker){
                this.marker = {};
                //Outer div
                this.marker.$outer =
                    $('<div/>')
                        .addClass('marker-outer')
                        .addClass(this.markerClassName)
                        .appendTo($container);
                //Inner div
                this.marker.$inner =
                        $('<div/>')
                            .addClass('marker')
                            .appendTo(this.marker.$outer);
                this.marker.$text =
                        $('<span/>')
                            .addClass('marker-text')
                            .attr( this.markerData )
                            .appendTo(this.marker.$inner);
            }
            this.appended = true;
            return this;
        },

        //remove
        remove: function(){
            if (!this.appended) return;
            if (this.$handle){
                this.$handle.remove();
                this.$handle = true;
            }
            if (this.marker.$outer){
                this.marker.$outer.remove();
                this.marker = true;
            }
            this.appended = false;
        },

        //update()
        //Set the position of $handle and $marker and update the content of $marker
        update: function( force ){
            if (!this.appended) return;
            var leftPercent = this.getLeftPosition() + '%';

            if (force || (leftPercent != this.lastLeftPercent)){
                this.lastLeftPercent = leftPercent;
                if (this.$handle){
                    this.$handle.css('left', leftPercent);
                }
                if (this.marker){
                    //Set marker content
                    this.marker.$text.html( this.getMarkerText() );

                    //Set marker position
                    this.marker.$outer.css('left', leftPercent);

                    //Force all handles overlapped by this to update
                    if (!force)
                        ( this.overlapHandleList || []).forEach( handle => handle.update( true ) );

                    //Set marker visibility
                    this.marker.$outer.css('visibility', this.markerIsHidden() ? 'hidden' : 'visible');
                }
            }
            return this;
        },

        //onFocus - overwriten for individual handle-types
        onFocus: function(){
            if (!this.appended) return;
            this.$handle.addClass('hover');
            if (this.marker && this.marker.$outer)
                this.marker.$outer.addClass('hover');

        },

        //onBlur - overwriten for individual handle-types
        onBlur: function(){
            if (!this.appended) return;
            this.$handle.removeClass('hover');
            if (this.marker && this.marker.$outer)
                this.marker.$outer.removeClass('hover');
        },

        //getMarkerText
        getLeftPosition: function(){
            return this.value.getPercent();
        },

        //getMarkerText
        getMarkerText: function(){
            return this.slider.decorate( this.slider._prettify( this.value.getValue() ) );
        },

        //markerIsHidden: return true if the marker is overlapping any of the markers in YYY
        markerIsHidden: function(){
            var thisMarker$text = this.marker.$text,
                result = false;
            ( this.overlappingHandleList || []).forEach( handle => result = result || elementsOverlapping( thisMarker$text, handle.marker.$text ) );
            return result;
        }

    };


    ns.SliderHandle = SliderHandle;
    ns.sliderHandle = function( options ){
        return new ns.SliderHandle( options );
    };

}(this/*, document*/));

;
/****************************************************************************
jquery-base-slider-public.js
****************************************************************************/
(function ($, window/*, document, undefined*/) {
    "use strict";

    $.extend(window.BaseSlider.prototype, {
        /*******************************************************************
        SET VALUES (TO, FROM, PIN ETC.)
        *******************************************************************/

        /*******************************************************************
        setAnyValue
        *******************************************************************/
        setAnyValue: function( id, value ){
            if (this.handles[id]){
                this.handles[id].value.setValue( value );

                this.updateHandlesAndLines();
                this.onChange();
            }
        },

        /*******************************************************************
        setValue, setFromValue, setToValue
        *******************************************************************/
        setValue    : function( value ) {this.setAnyValue( this.options.singleHandleId, value );},
        setFromValue: function( value ) { this.setAnyValue( 'from',   value ); },
        setToValue  : function( value ) { this.setAnyValue( 'to',     value ); },

        /*******************************************************************
        setPin
        *******************************************************************/
        setPin: function( value, color, icon ) {
            if (!this.options.hasPin) return;
            if (value !== null)
                this.handles.pin.value.setValue( value, true );

            this.options.pinColor = color || this.options.pinColor || 'black';

            var oldIcon = this.options.pinIcon || '';
            this.options.pinIcon = icon || this.options.pinIcon || 'fa-map-marker';

            this.handles.pin.$handle
                .css('color', this.options.pinColor)
                .removeClass( oldIcon )
                .addClass( this.options.pinIcon );

            this.updateHandlesAndLines();
        },

        /*******************************************************************
        PUBLIC METHODS
        *******************************************************************/

        /*******************************************************************
        update
        *******************************************************************/
        update: function (options) {

            if (!this.input || this.initializing) return;

            //Save result in options
            this.updateResult();
            this.options.value = this.result.value;
            this.options.from  = this.result.from;
            this.options.to    = this.result.to;

            this.options = $.extend(this.options, options || {});

            this.remove();
            this.init();

            this.on('update');
        },

        /*******************************************************************
        reset
        *******************************************************************/
        reset: function () {
            if (!this.input) return;
            this.update();
        },

        /*******************************************************************
        destroy
        *******************************************************************/
        destroy: function () {
            if (!this.input) return;

            this.cache.$input.prop("readonly", false);
            $.data(this.input, "baseSlider", null);

            this.remove();
            this.input = null;
            this.options = null;
        }

    }); //end of BaseSlider.prototype

}(jQuery, this, document));

;
/****************************************************************************
    jquery-base-slider-value,

    (c) 2015, FCOO

    https://github.com/fcoo/jquery-base-slider
    https://github.com/fcoo

****************************************************************************/
(function (window/*, document, undefined*/) {
    "use strict";

    //Create baseSlider-namespace
	window._baseSlider = window._baseSlider || {};
	var ns = window._baseSlider;

    /*******************************************************************
    toFixed
    Round num to 5 digits
    *******************************************************************/
    function toFixed( num ) {
        return +num.toFixed(5);
    }


    /*******************************************************************
    SliderValue
    Object to store and alter "value" releated to the slider
    The object contains the following items:
        value   : The actual value ,
        percent : The value as percent of the total slider width
    *******************************************************************/
    var SliderValue = function( options ){
        this.slider = options.slider;
        this.valueOffset = this.slider.options.min;
        this.valueRange = this.slider.options.max - this.valueOffset;
        this.percentOffset = 0;
        this.percentRange = 100;
        this.adjustToStep = !!options.adjustToStep;
        this.fixed = !!options.fixed;
        this.fixedValue = options.value;
        this.value   = 0;
        this.percent = 0;
        this.minList = [];
        this.maxList = [];

        ( options.minList || []).forEach( sliderValueMin => this.addMin( sliderValueMin ), this);
        ( options.maxList || []).forEach( sliderValueMax => this.addMax( sliderValueMax ), this);

        this.setValue( options.value );
    };

    SliderValue.prototype = {
        //addMin( sliderValue, minDistance )
        //Add sliderValue to list of SliderValue that this must allways be greater than or equal to
        addMin: function( sliderValue, minDistance ){
            if (sliderValue === null) return this;
            if ($.isNumeric(sliderValue))
                sliderValue = new SliderValue({ value: sliderValue, slider: this.slider });
            this.minList.push( {sliderValue: sliderValue, minDistance: minDistance || 0} );
            this.update();
            return this;
        },

        //addMax( sliderValue, minDistance )
        //Add sliderValue to list of SliderValue that this must allways be less than or equal to
        addMax: function( sliderValue, minDistance ){
            if (sliderValue === null) return this;
            if ($.isNumeric(sliderValue))
                sliderValue = new SliderValue({ value: sliderValue, slider: this.slider });
            this.maxList.push( {sliderValue: sliderValue, minDistance: minDistance || 0} );
            this.update();
            return this;
        },

        setValue: function( newValue, isFixed ){
            this.value = newValue;
            if (isFixed && this.fixed)
                this.fixedValue = newValue;
            this.update();
            return this;
        },

        setPercent: function( newPercent ){
            this.setValue( this.valueRange*(newPercent - this.percentOffset)/this.percentRange + this.valueOffset );
        },

        update: function(){

            if (this.fixed)
                this.value = this.fixedValue;
            else {
                //Adjust this.value with respect to {sliderValue,minDistance} in this.minList
                ( this.minList || []).forEach( rec => {
                    if (rec.sliderValue)
                        this.value = Math.max( this.value, rec.sliderValue.value + rec.minDistance );
                }, this);
                //Adjust this.value with respect to {sliderValue,minDistance} in this.maxList
                ( this.maxList || []).forEach( rec => {
                    if (rec.sliderValue)
                        this.value = Math.min( this.value, rec.sliderValue.value - rec.minDistance );
                }, this);

                //Adjust this.value with respect to step and stepOffset
                if (this.adjustToStep){
                    var offset = this.slider.options.min + this.slider.options.stepOffset;
                    this.value -= offset;
                    this.value = this.slider.options.step * Math.round( this.value/this.slider.options.step );
                    this.value += offset;
                }
            }

            //Calculate precent
            this.percent = this.percentRange*(this.value - this.valueOffset)/this.valueRange + this.percentOffset;

            return this;
        },

        getValue: function(){
            return toFixed( this.value );
        },

        getPercent: function( inclUnit ){
            return toFixed( this.percent ) + (inclUnit ? '%' : 0);
        },
    };


    ns.SliderValue = SliderValue;
    ns.sliderValue = function( options ){
        return new ns.SliderValue( options );
    };

}(this/*, document*/));
