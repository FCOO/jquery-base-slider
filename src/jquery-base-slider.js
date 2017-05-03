/****************************************************************************
    jquery-base-slider, Description from README.md

    (c) 2015, Niels Holt

    https://github.com/NielsHolt/jquery-base-slider
    https://github.com/NielsHolt

****************************************************************************/
(function ($, window, document, undefined) {
    "use strict";

    /************************************
    DEFAULT OPTIONS
    ************************************/
    var defaultOptions = {    
        //Type and slider
        type        : "single",  // Choose single or double, could be "single" - for one handle, or "double" for two handles  
        slider      : "default", // Choose slider type, could be "default","small","round", "range", or '"fixed"  
        read_only   : false,     // Locks slider and makes it inactive.
        disable     : false,     // Locks slider and makes it disable ("dissy")
        fixed_handle: false,     // Special version where the slider is fixed and the grid are moved left or right to select value. slider is set to "single"
                                 // A value for options.width OR options.value_distances must be provided
        clicable    : true,      // Allows click on lables and line. Default = true except for fixed_handle:true where default = false
        mousewheel  : false,     // Only for type:'single': Adds mousewheel-event to the parent-element of the slider. Works best if the parent-element only contains the slider and has a fixed height and width

        //Dimensions (only for options.fixed_handle: true)
        width          : 0, // The total width of the slider (in px for rem = 16px)
        value_distances: 3, // The distance between each values on the slider (in px for rem = 16px). Width will be value_distances*( max - min )

        //Ranges and value
        min : 10,           // Set slider minimum value  
        max : 100,          // Set slider maximum value  
        from: null,         // Set start position for left handle (or for single handle)  
        to  : null,         // Set start position for right handle  

        from_fixed: false,  // Fix position of left (or single) handle.  
        from_min  : null,   // Set minimum limit for left handle.  
        from_max  : null,   // Set the maximum limit for left handle  

        to_fixed: false,    // Fix position of right handle.  
        to_min  : null,     // Set the minimum limit for right handle  
        to_max  : null,     // Set the maximum limit for right handle  

        pin_value: null,    // The value for the pin. Use  setPin( value [, color] )  to change the value dynamical  
        pin_color: 'black', // The color of the pin. Use  setPin( value , color )  to change the color dynamical  

        //Steps
        step: 1,            // Set sliders step. Always > 0. Could be fractional.  
        step_offset : 0,    // When  step  > 1: Offset for the allowed values. Eq. Min=0, max=100, step=5, step_offset=3 => allowed values=3,8,13,...,92,97 (3+N*5)<br>Only tested for  type="single"   
        min_interval: 0,    // Set minimum diapason between sliders. Only in "double" type  
        max_interval: 0,    // Set maximum diapason between sliders. Only in "double" type  

        mousewheel_step_factor: 1, //Only for mousewheel:true: For each mousewheel move the from-value changes by +/- options.mousewheel_step_factor x options.step 

        //Slide-line
        impact_line        : false, // The line on a double slider is coloured as<br>green-[slider]-yellow-[slider]-red  
        impact_line_reverse: false, // The line on a double slider is colored as<br>red-[slider]-yellow-[slider]-green  
        bar_color          : null,  // The color of the bar 
        hide_bar_color     : false, // The bar gets same color as the line  

        //Grid (ticks and text)
        grid              : false,                      // Enables grid of values.  
        major_ticks       : null,                       // Nummber of  step  between major ticks. Default=null=> Calculated automatic  
        major_ticks_offset: 0,                          // Offset for the values where a major ticks is placed. Eq. Min=0, max=100 => major ticks on values=0,10,20,..,90,100. With  major_ticks_offset:4  the major ticks would be placed on values=4,14,24,...,84,94  
        hide_minor_ticks  : false,                      // Hide minor ticks.  
        gridDistances     : [1, 2, 5, 10, 20, 50, 100], // Distance between major ticks. E.g. Slider with hours could use [1, 2, 4, 12, 24] 
        ticks_on_line     : false,                      // Place the ticks in the (first) grid on the line with the sliders.  
        major_ticks_factor: 1,                          // Not documented

        grid_colors       : null, //Array of { [fromValue, ]value, color } to set colors on the bar. If no fromValue is given the the previous value is used.
                                  //TODO: If value == null => A triangle is added to the left indicating 'below min'. 
                                  //      If value > max =>  A triangle is added to the right indicating 'above max'.    


        //Labels above slider 
        hide_min_max: true,     // Hides min and max labels  
        hide_from_to: false,    // Hide from and to labels  
        marker_frame: false,    // Frame the from- and to-marker  

        //Adjust text and labels
        prettify        : null,  // Set up your prettify function. Can be anything. For example, you can set up unix time as slider values and than transform them to cool looking dates.  
        prettify_text   : null,  // As  prettify  but for the text/labels in the grid.  
        prefix          : "",    // Set prefix for values. Will be set up right before the number: $100
        postfix         : "",    // Set postfix for values. Will be set up right after the number: 100k
        max_postfix     : "",    // Special postfix, used only for maximum value. Will be showed after handle will reach maximum right position. For example 0 - 100+
        decorate_both   : true,  // Used for "double" type and only if prefix or postfix was set up. Determine how to decorate close values. For example: $10k - $100k or $10 - 100k
        decorate_text   : false, // The text/labels in the grid also gets  prefix  and/or  postfix 
        values_separator: " - ", // Text between min and max value when labels are combined. values_separator:" to " => "12 to 24"

        //Callback
        callback            : null, // Is called when the  from  or  to  value are changed. 
        callback_on_dragging: true, // If false the callback-function is only called when dragging the sliding is finish. 
        callback_delay      : 500,  // If  callback_on_dragging  is false the  callback  is called when the slider has been on the same tick for  callback_delay  milliseconds. Set to zero to avoid any callback before mouseup-event 

        //Buttons
        buttons      : {from: {}, to: {} }, // JSON-record with id or buttons for first, previous, (now,) next, and last value = {from: {buttonList}, to: {buttonList}}, where
                                            //  {buttonList} = {
                                            //      firstBtn   : element or string,
                                            //      previousBtn: element or string,
                                            //      nowBtn     : element or string,
                                            //      nextBtn    : element or string,
                                            //      lastBtn    : element or string
                                            //  }  

        buttons_attr : ['firstBtn', 'previousBtn', 'nowBtn', 'nextBtn', 'lastBtn'], //Internal
        buttons_delta: [-99, -1, 0, +1, +99], //Internal

        //Methods
        onStart : null, // Callback. Is called on slider start.
        onChange: null, // Callback. IS called on each values change.
        onFinish: null, // Callback. Is called than user releases handle.
        onUpdate: null  // Callback. Is called than slider is modified by external methods  update  or  reset 
    };
    

    /************************************
    BaseSlider
    ************************************/
    var plugin_count = 0;
    window.BaseSlider = function (input, options, plugin_count) {
        this.input = input;
        this.plugin_count = plugin_count;
        
        this.current_plugin = 0;
        this.old_from = 0;
        this.old_to = 0;
        this.dragging = false;
        this.force_redraw = false;
        this.is_key = false;
        this.is_update = false;
        this.is_start = true;
        this.is_active = false;
        this.is_resize = false;
        this.is_click = false;
        this.is_repeating_click = false;

        this.cache = {
            $win   : $(window),
            $body  : $(document.body),
            $input : $(this.input),
            buttons: { from: {}, to: {} }
        };

        // get config from options
        this.options = $.extend( {}, defaultOptions, options );

        if (this.options.fixed_handle){
            this.options.type = 'single';         
            if (options.clicable === undefined)
                this.options.clicable = false;  
        }

        this.options.isSingle = (this.options.type == 'single');
        this.options.isInterval = (this.options.type == 'double');

        if (this.options.isInterval){
            this.options.mousewheel = false;          
        }

        this.validate();

        //Add options.step to gridDistances
        if (this.options.gridDistances.indexOf(this.options.step) == -1)
            for (var i=0; i<this.options.gridDistances.length; i++ )
                if (this.options.gridDistances[i] > this.options.step){
                    this.options.gridDistances.splice(i, 0, this.options.step);
                    break;
                }
        if (this.options.gridDistances.indexOf(this.options.step) == -1)
            this.options.gridDistances.push(this.options.step);


        this.options.has_pin = (this.options.pin_value !== null);
        this.options.p_keyboard_step = 100*this.options.step / (this.options.max - this.options.min);

        this.coords = {
            // left
            x_gap: 0,
            x_pointer: 0,

            // width
            w_rs: 0,
            w_rs_old: 0,
            w_handle: 0,

            // percents
            p_gap: 0,
            p_gap_left: 0,
            p_gap_right: 0,
            p_step: 0,
            p_pointer: 0,
            p_handle: 0,
            p_single: 0,
            p_single_real: 0,
            p_from: 0,
            p_from_real: 0,
            p_to: 0,
            p_to_real: 0,
            p_bar_x: 0,
            p_bar_w: 0,
            p_min: 0,
            p_max: 0,

            // min and max coorected with step and step_offset
            true_min: 0,
            true_max: 0,

        };

        this.result = {
            $input: this.cache.$input,
            input: this.cache.$input,  //Backward compatibility 
            slider: null,

            min: this.options.min,
            max: this.options.max,

            from: this.options.from,
            from_percent: 0,
            from_value: null,

            to: this.options.to,
            to_percent: 0,
            to_value: null
        };

        this.labels = {
            // width
            w_min: 0,
            w_max: 0,
            w_from: 0,
            w_to: 0,
            w_single: 0,

            // percents
            p_min: 0,
            p_max: 0,
            p_from: 0,
            p_from_left: 0,
            p_to: 0,
            p_to_left: 0,
            p_single: 0,
            p_single_left: 0
        };

      this.init();

    };

    window.BaseSlider.prototype = {
        init: function (is_update) {
            this.options.total = this.options.max - this.options.min;
            this.options.oneP  = this.toFixed(100 / this.options.total);
            this.options.stepP = this.options.step*this.options.oneP; 

            var factor = 100/this.options.total;
            this.coords.p_step        = this.options.step * factor;
            this.coords.p_step_offset = this.options.step == 1 ? 0 : this.options.step_offset * factor;

            this.coords.true_min = this.options.min + this.options.step_offset;
            this.coords.true_max = this.coords.true_min;
            while (this.coords.true_max + this.options.step <= this.options.max)
                this.coords.true_max += this.options.step;
            this.coords.p_min = (this.coords.true_min - this.options.min) * this.options.oneP;
            this.coords.p_max = (this.coords.true_max - this.options.min) * this.options.oneP;


            this.options.from = this.adjustValue( this.options.from );
            this.options.to   = this.adjustValue( this.options.to );
            this.result.from  = this.options.from;
            this.result.to    = this.options.to;

            this.target = "base";

            this.toggleInput();
            this.append();
            this.setMinMax();
            if (is_update) {
                this.force_redraw = true;
                this.calc(true);
                this.onUpdate();

            } else {
                this.force_redraw = true;
                this.calc(true);
                this.onStart();
            }
            this.drawHandles();
        },

        //append
        append: function () {
            function $span( className, $parent ){
                var result = $('<span/>');
                if (className)
                    result.addClass( className );
                if ($parent)
                  result.appendTo( $parent );
                return result;
            }

            //this.cache.$container = $span( 'base-slider-container ' + this.options.slider + ' js-base-slider-' + this.plugin_count );
            this.cache.$container = $('<div/>');
            this.cache.$container.addClass('base-slider-container ' + this.options.slider + ' js-base-slider-' + this.plugin_count );

            this.cache.$input.before(this.cache.$container);
            this.cache.$input.prop("readonly", true);


            this.result.slider = this.cache.$container; //For backward compatibility
            this.result.$slider = this.cache.$container;

            //Put inside outer-container if options.fixed_handle
            if (this.options.fixed_handle){
                this.cache.$container.wrap('<div/>');
                this.cache.$fullWidthContainer = this.cache.$container.parent();
                this.cache.$fullWidthContainer.addClass('base-slider-container-full-width');

                //Sets the width of the container with full width
                var width = this.options.width || this.options.value_distances*(this.options.max - this.options.min);

                this.cache.$fullWidthContainer.width( Math.ceil(this.pxToRem(width))+'rem' );


                this.cache.$fullWidthContainer.wrap('<div/>');
                this.cache.$outerContainer = this.cache.$fullWidthContainer.parent();
                this.cache.$outerContainer.addClass('base-slider-container-outer');

                //Update the slider when $outerContainer is resized
                var _this = this;
                this.cache.$outerContainer.resize( function(){
                    _this.force_redraw = true; 
                    _this.drawHandles();
                });
            
            }
            
            /* Create structure       
            <span class="bs">
                <span class="line" tabindex="-1">
                    <span class="line-left"></span>
                </span>
                <span class="marker-min">0</span>
                <span class="marker-max">1</span>
                <span class="marker-from">0</span>
                <span class="marker-to">0</span>
                <span class="marker-single">0</span>
            </span>
            <span class="grid"></span>
            <span class="bar"></span>
            */

            this.cache.$bs = $span('bs', this.cache.$container);
            this.cache.$line = $span('line', this.cache.$bs).prop('tabindex', -1);

            if (this.options.isInterval)
                this.cache.$lineLeft = $span('line-left', this.cache.$line);

            if (!this.options.hide_from_to) {
                this.cache.$single = $span('marker-single', this.cache.$bs);
                if (this.options.isInterval){
                    this.cache.$from   = $span('marker-from',   this.cache.$bs);
                    this.cache.$to     = $span('marker-to',     this.cache.$bs);
                }
            }

            this.cache.$min = $span('marker-min', this.cache.$bs);
            this.cache.$max = $span('marker-max', this.cache.$bs);

            if (this.options.grid)
                this.cache.$grid = $span('grid', this.cache.$container);

            this.cache.$bar = $span('bar', this.cache.$container);

            if (this.options.isSingle){
                this.cache.$s_single = $span('slider single', this.cache.$container);
            }
            else {
                //Add from and to slider
                this.cache.$s_from = $span('slider from', this.cache.$container);
                this.cache.$s_to   = $span('slider to', this.cache.$container);

                //Add classs if it is a (reverse) impact-line
                if (this.options.impact_line)
                    this.cache.$container.addClass("impact-line");

                if (this.options.impact_line_reverse)
                    this.cache.$container.addClass("impact-line-reverse");
            }


            if (this.options.has_pin)
                this.cache.$s_pin = $span('slider pin', this.cache.$container);

            //Add class to set bar color same as line
            if (this.options.hide_bar_color)
                this.cache.$bar.addClass('hide-bar-color');

            //Set alternative bar color
            if (this.options.bar_color)
                this.cache.$bar.css('background-color', this.options.bar_color);

            //Add class to set border and stick on to- from and current-label
            if (this.options.marker_frame)
                this.cache.$container.addClass('marker-frame');

            //Adjust top-position if no marker is displayed
            if (this.options.hide_min_max && this.options.hide_from_to)
                this.cache.$container.addClass("no-marker");

            //Adjust top-position of first grid if tick must be on the slider
            if (this.options.ticks_on_line)
                this.cache.$container.addClass("ticks-on-line");


            //Speciel case: Adjust top-position of line etc. if it is a range-slider with no marker and with a pin!
            if (this.options.has_pin)
                this.cache.$container.addClass("has-pin");

            //Append buttons
            function getButton( id ){ return $.type( id ) === 'string' ? $('#' +  id ) : id; }
            this.options.buttons.from = this.options.buttons.from || {};
            this.options.buttons.to   = this.options.buttons.to || {};
            for (var i=0; i<this.options.buttons_attr.length; i++ ){
                var attrName = this.options.buttons_attr[i];
                this.cache.buttons.from[ attrName ] = getButton( this.options.buttons.from[ attrName ] );
                this.cache.buttons.to[ attrName ]   = getButton( this.options.buttons.to  [ attrName ] );
            }

            //Append grid(s)
            this.currentGridContainer = null;
            if (this.options.grid)
                this.appendGrid();

            //Add classes to control display
            if (this.options.disable) {
                this.cache.$container.addClass("disabled");
                this.cache.$input.prop('disabled', true);
            } 
            else
                if (this.options.read_only){
                    this.cache.$container.addClass("read-only");
                    this.cache.$input.prop('disabled', true);
                } 
                else {
                    if (!this.options.fixed_handle)
                        this.cache.$container.addClass("active");
                    this.cache.$input.prop('disabled', false);
                    this.bindEvents();
                }
            if (!this.options.clicable)
                this.cache.$container.addClass("not-clicable");
        },

        //_offEvents
        _offEvents: function( $elem, eventNames ){
            if (!$elem) return;
            var count = this.plugin_count;
            $.each( eventNames.split(' '), function( index, eventName ){ 
                $elem.off( eventName + ".irs_" + count );
            });            
        },

        //remove
        remove: function () {
            this.cache.$container.remove();
            this.cache.$container = null;

            this._offEvents( this.cache.$line, "keydown" );
            this._offEvents( this.cache.$body, "touchmove mousemove" );

            this._offEvents( this.cache.$win, "touchend mouseup" );

            //Unbind click on buttons
            var id, i, attrName, $btn;
            for (id in this.cache.buttons)
                for (i=0; i<this.options.buttons_attr.length; i++ ){
                    attrName = this.options.buttons_attr[i];
                    $btn = this.cache.buttons[id][attrName];
                    this._offEvents( $btn, 'mousedown mouseup mouseleave click' );
                }
        },

        //_onEvents
        _onEvents: function( $elem, eventNames, func, param ){
            if (!$elem) return;
            var count = this.plugin_count,
                f = param ? $.proxy( func, this, param) : $.proxy( func, this );

            $.each( eventNames.split(' '), function( index, eventName ){ 
                $elem.on( eventName + ".irs_" + count,  f );
            });            
        },

        //bindEvents
        bindEvents: function () {
            this._onEvents( this.cache.$body, "touchmove mousemove",  this.pointerMove ); 

            this._onEvents( this.cache.$win,  "touchend mouseup",     this.pointerUp ); 

            if (this.options.clicable){
                this._onEvents( this.cache.$line, "touchstart mousedown", this.pointerClick, "click" ); 
                this._onEvents( this.cache.$bar,  "touchstart mousedown", this.pointerClick, "click" ); 
            }

            if (this.options.fixed_handle)
                this._onEvents( this.cache.$fullWidthContainer, "touchstart mousedown", this.pointerDown, "single" ); 
            else
                this._onEvents( this.cache.$s_single, "touchstart mousedown", this.pointerDown, "single" ); 


            if (this.options.mousewheel){
                //Add horizontal sliding with mousewheel
                if (this.options.fixed_handle)
                    this._onEvents( this.cache.$outerContainer, 'mousewheel', this.mousewheel );
                else
                    this._onEvents( this.cache.$container.parent(), 'mousewheel', this.mousewheel );
            }

            this._onEvents( this.cache.$s_from,   "touchstart mousedown", this.pointerDown, "from" ); 
            this._onEvents( this.cache.$s_to,     "touchstart mousedown", this.pointerDown, "to" ); 

            this._onEvents( this.cache.$line, "keydown", this.key, "keyboard" ); 

            //Bind click on buttons
            var id, i, attrName, delta, $btn;
            for (id in this.cache.buttons)
                for (i=0; i<this.options.buttons_attr.length; i++ ){
                    attrName = this.options.buttons_attr[i];
                    delta = this.options.buttons_delta[i];

                    $btn = this.cache.buttons[id][attrName];
                    this._onEvents( $btn, 'mousedown',  this.startRepeatingClick );
                    this._onEvents( $btn, 'mouseup',    this.endRepeatingClick );
                    this._onEvents( $btn, 'mouseleave', this.endRepeatingClick, true );
                    this._onEvents( $btn, 'click',      this.buttonClick,       {id:id, delta:delta} );

                    if ( $btn && $btn.autoclickWhilePressed && (Math.abs(delta) == 1) && (!$btn.data('auto-click-when-pressed-added')) ){
                        $btn.data('auto-click-when-pressed-added', true);
                        $btn.autoclickWhilePressed();
                    }
                }
        },

        //adjustResult - adjust this.resut before onStart,..,callback is called
        adjustResult: function(){
            //Nothing here but desencing class can overwrite it
        },

        //onFunc
        onFunc: function(func){
            this.adjustResult();
            if (func && typeof func === "function")
                func.call(this, this.result);
        },

        //onCallback
        onCallback: function(){
            this.lastResult = this.lastResult  || {};
            if ( this.options.callback && typeof this.options.callback === "function" && ( this.result.min != this.lastResult.min || this.result.max != this.lastResult.max || this.result.from != this.lastResult.from || this.result.to != this.lastResult.to ) ) {
                this.adjustResult();
                if (this.preCallback)
                    this.preCallback( this.result );
                if (this.options.context)
                    this.options.callback.call( this.options.context, this.result );
                else
                    this.options.callback( this.result );
                this.lastResult = $.extend({}, this.result);
            }
        },

        //onStart
        onStart: function(){
            this.onCallback();
            this.onFunc(this.options.onStart);
        },

        //onChange
        onChange: function(){
            //If it is dragging and no callback_on_dragging => set timeout to call callback after XX ms if the slider hasn't moved
            if (this.dragging && !this.options.callback_on_dragging && this.options.callback_delay){
                if (this.delayTimeout)
                    window.clearTimeout(this.delayTimeout);
                var _this = this;
                this.delayTimeout = window.setTimeout( 
                                        function () { _this.onCallback(); }, 
                                        this.options.callback_delay
                                    );
            }

            if ( this.options.callback_on_dragging || (!this.is_repeating_click && !this.dragging) )
                this.onCallback();
            this.onFunc(this.options.onChange);
        },

        //onFinish
        onFinish: function(){
            if (this.delayTimeout)
                window.clearTimeout(this.delayTimeout);

            if (!this.is_repeating_click)
                this.onCallback();
            this.onFunc(this.options.onFinish);
        },

        //onUpdate
        onUpdate: function(){
            this.onFunc(this.options.onUpdate);
        },

        //buttonClick
        buttonClick: function (options){
            var newValue = options.id == 'from' ? this.result.from : this.result.to;
            switch (options.delta){
              case     0: newValue = 0; break;
                case -99: newValue = this.options.min; break;
                case  99: newValue = this.options.max; break;
                case  +1: newValue = newValue + this.options.step; break;
                case  -1: newValue = newValue - this.options.step; break;
            }
            if (options.id == 'from')
                this.setFromValue( newValue );
            else
                this.setToValue( newValue );
        },

        //startRepeatingClick
        startRepeatingClick: function () {
            this.is_repeating_click = true;
        },

        //endRepeatingClick
        endRepeatingClick: function (callback) {
            this.is_repeating_click = false;
            if (callback)
                this.onCallback();
        },

        //textClick - click on label
        textClick: function( e ){
            var value = $(e.target).data('base-slider-value');
            if (!this.options.isInterval){
                this.setValue( value );
                return;
            }

            if (this.result.from >= value)
              this.setFromValue (value );
            else
                if (this.result.to <= value)
                  this.setToValue (value );
                else
                    if (Math.abs( this.result.from - value ) >= Math.abs( this.result.to - value ))
                        this.setToValue( value );
                    else
                        this.setFromValue( value );
        },

        //mousewheel moves options.mousewheel_step_factor steps pro delta
        mousewheel: function( e, delta ){
            this.setFromValue( this.result.from + delta*this.options.mousewheel_step_factor*this.options.step );
            e.preventDefault();
        },

        //pointerMove
        pointerMove: function (e) {
            if (!this.dragging) return;

            var x = e.pageX || e.originalEvent.touches && e.originalEvent.touches[0].pageX;

            if (this.options.fixed_handle)
                //Convert direction of mouse moving
                x = this.coords.x_start - (x - this.coords.x_start);

            this.coords.x_pointer = this.pxToRem(x) - this.coords.x_gap;

            this.calc();

            this.drawHandles();
        },

        //pointerUp
        pointerUp: function (e) {
            if (this.current_plugin !== this.plugin_count) return;

            if (this.is_active)
                this.is_active = false;
            else 
                return;

            if ($.contains(this.cache.$container[0], e.target) || this.dragging)
                this.onFinish();

            this.cache.$container.find(".state_hover").removeClass("state_hover");

            this.force_redraw = true;
            this.dragging = false;
        },

        //pointerDown
        pointerDown: function (target, e) {
            e.preventDefault();
            var x = e.pageX || e.originalEvent.touches && e.originalEvent.touches[0].pageX; 
            if (e.button === 2) return;

            this.current_plugin = this.plugin_count;
            this.target = target;
            this.is_active = true;
            this.dragging = true;
            this.coords.x_gap = this.pxToRem(this.cache.$bs.offset().left);
            this.coords.x_pointer = this.pxToRem(x) - this.coords.x_gap;
            this.calcPointer();


            switch (target) {
                case "single":
                    this.coords.p_gap = this.toFixed(this.coords.p_pointer - this.coords.p_single); 
            
                    if (this.options.fixed_handle)
                        //Save initial mouse position to calc reverse mouse movment
                        this.coords.x_start = x;
                    break;

                case "from":
                    this.coords.p_gap = this.toFixed(this.coords.p_pointer - this.coords.p_from);
                    this.cache.$s_from.addClass("state_hover");
                    this.cache.$s_from.addClass("type_last");
                    this.cache.$s_to.removeClass("type_last");
                    break;

                case "to":
                    this.coords.p_gap = this.toFixed(this.coords.p_pointer - this.coords.p_to);
                    this.cache.$s_to.addClass("state_hover");
                    this.cache.$s_to.addClass("type_last");
                    this.cache.$s_from.removeClass("type_last");
                    break;

                case "both":
                    this.coords.p_gap_left = this.toFixed(this.coords.p_pointer - this.coords.p_from);
                    this.coords.p_gap_right = this.toFixed(this.coords.p_to - this.coords.p_pointer);
                    this.cache.$s_to.removeClass("type_last");
                    this.cache.$s_from.removeClass("type_last");
                    break;
            }

            this.cache.$line.trigger("focus");
        },

        //pointerClick
        pointerClick: function (target, e) {
            e.preventDefault();
            var x = e.pageX || e.originalEvent.touches && e.originalEvent.touches[0].pageX;
            if (e.button === 2) return;

            this.current_plugin = this.plugin_count;
            this.target = target;
            this.is_click = true;
            this.coords.x_gap = this.pxToRem(this.cache.$bs.offset().left);
            this.coords.x_pointer = +(this.pxToRem(x) - this.coords.x_gap).toFixed();

            this.force_redraw = true;
            this.calc(true);
            this.drawHandles();

            this.cache.$line.trigger("focus");
        },

        //key
        key: function (target, e) {
            if (this.current_plugin !== this.plugin_count || e.altKey || e.ctrlKey || e.shiftKey || e.metaKey) return;

            switch (e.which) {
                case 83: // W
                case 65: // A
                case 40: // DOWN
                case 37: // LEFT
                    e.preventDefault();
                    this.moveByKey(false);
                    break;
                case 87: // S
                case 68: // D
                case 38: // UP
                case 39: // RIGHT
                    e.preventDefault();
                    this.moveByKey(true);
                    break;
            }
            return true;
        },

        // Move by key beta
        // TODO: refactor than have plenty of time
        moveByKey: function (right) {
            var p = this.coords.p_pointer;
            if (right)
                p += this.options.p_keyboard_step;
            else
                p -= this.options.p_keyboard_step;
            this.coords.x_pointer = this.toFixed(this.coords.w_rs / 100 * p);
            this.is_key = true;
            this.calc();

            this.force_redraw = true;
            this.drawHandles();

        },

        //setMinMax
        setMinMax: function () {
            if (!this.options) return;
            
            if (this.options.hide_min_max) {
                this.cache.$min.hide();
                this.cache.$max.hide();
                return;
            }
            this.cache.$min.html(this.decorate(this._prettify(this.options.min), this.options.min));
            this.cache.$max.html(this.decorate(this._prettify(this.options.max), this.options.max));

            this.labels.w_min = this.getOuterWidth(this.cache.$min);
            this.labels.w_max = this.getOuterWidth(this.cache.$max);
        },


        // =============================================================================================================
        // Calculations

        //adjustValue
        adjustValue: function( value ){
            //Adjust with respect to min value
            value = Math.max( this.coords.true_min, value );

            //Adjust with respect to max value
            value = Math.min( this.coords.true_max, value );

            //Adjust with respect to step and step_offset
            value = this.coords.true_min + this.options.step*Math.round( (value - this.coords.true_min)/this.options.step );


            return value;
        },

        //setValue
        setValue: function( value ) { this.setFromValue( value ); },

        //setFromValue
        setFromValue: function( value ) {
            value = this.adjustValue( value );

            if (this.options.isInterval)
              value = Math.min( value, this.result.to );

            this.old_from = this.result.from;
            this.result.from = value;
            if (this.old_from != value){
                this.target = "base";
                this.is_key = true;
                this.calc();
                this.force_redraw = true;
                this.drawHandles();
            }
            this.onCallback();
        },

        //setToValue
        setToValue: function( value ) {
            value = Math.max( value, this.result.from );
            value = this.adjustValue( value );

            this.old_to = this.result.to;
            this.result.to = value;
            if (this.old_to != value){
                this.target = "base";
                this.is_key = true;
                this.calc();
                this.force_redraw = true;
                this.drawHandles();
            }
            this.onCallback();
        },

        setPin: function( value, color ) {
            if (!this.options.has_pin) return;

            value = Math.min( this.options.max, value );
            value = Math.max( this.options.min, value );
            this.options.pin_value = value;

            this.target = "base";
            this.calc(true);

            this.cache.$s_pin.css({
                left : this.coords.p_pin_value + "%",
                color: color || 'black'
            });
        },


        //pxToRem
        pxToRem: function( valuePx, inclUnit ){
            var fontSize = $('html').css('font-size') || $('body').css('font-size') || '16',
                result = valuePx / parseFloat( fontSize );
            return inclUnit ? result + 'rem' : result;
        },

        //getInnerWidth
        getInnerWidth: function( $element, inclUnit, factor ){
            return this.pxToRem( (factor ? factor : 1)*($element ? $element.innerWidth() : 0), inclUnit );
        },

        //getOuterWidth
        getOuterWidth: function( $element, inclUnit, factor ){ 
            return this.pxToRem( (factor ? factor : 1)*$element.outerWidth(false), inclUnit );
        },

        //getCoords_w_rs
        getCoords_w_rs: function(){
            var result = this.getInnerWidth( this.cache.$fullWidthContainer ? this.cache.$fullWidthContainer : this.cache.$container); 
            this.coords.w_rs = result ? result : this.coords.w_rs;
        },

        //calc
        calc: function (update) { 
            if (!this.options) return;

            if (update) {
                this.getCoords_w_rs();

                this.calcHandleWidth();

                this.coords.w_container = this.getInnerWidth(this.cache.$container); 
                this.coords.w_outerContainer = this.getInnerWidth(this.cache.$outerContainer); 

            }
            if (!this.coords.w_rs) return;

            this.calcPointer();

            this.coords.p_handle = this.toFixed(this.coords.w_handle / this.coords.w_rs * 100);
            var real_width = 100 - this.coords.p_handle,
                real_x     = this.toFixed(this.coords.p_pointer     - this.coords.p_gap),
                real_x_raw = this.toFixed(this.coords.p_pointer_raw - this.coords.p_gap);

            if (this.target === "click") {
                real_x = this.toFixed(this.coords.p_pointer - (this.coords.p_handle / 2));
                this.target = this.chooseHandle(real_x);
            }

            if (real_x < 0)
                real_x = 0;
            else 
                if (real_x > real_width)
                    real_x = real_width;

            switch (this.target) {
                case "base": 
                    var w = (this.options.max - this.options.min) / 100,
                    f = (this.result.from - this.options.min) / w,
                    t = (this.result.to - this.options.min) / w;

                    this.coords.p_single_real = this.toFixed(f);
                    this.coords.p_from_real = this.toFixed(f);
                    this.coords.p_to_real = this.toFixed(t);

                    this.coords.p_single_real = this.checkDiapason(this.coords.p_single_real, this.options.from_min, this.options.from_max);
                    this.coords.p_from_real = this.checkDiapason(this.coords.p_from_real, this.options.from_min, this.options.from_max);
                    this.coords.p_to_real = this.checkDiapason(this.coords.p_to_real, this.options.to_min, this.options.to_max);

                    this.coords.p_single = this.toFixed(f - (this.coords.p_handle / 100 * f)); 
                    this.coords.p_from = this.toFixed(f - (this.coords.p_handle / 100 * f));
                    this.coords.p_to = this.toFixed(t - (this.coords.p_handle / 100 * t));

                    if (this.options.has_pin){
                        var r = (this.options.pin_value - this.options.min) / w,
                            p_pin_value_real = this.checkDiapason(this.toFixed(r), this.options.from_min, this.options.from_max);
                        this.coords.p_pin_value = this.toFixed(p_pin_value_real / 100 * real_width);
                    }
                    this.target = null;

                    break;

                case "single":
                    if (this.options.from_fixed) break;

                    this.coords.p_single_real = this.calcWithStep((this.options.fixed_handle ? real_x_raw : real_x) / real_width * 100);
                    //this.coords.p_single_real = this.checkDiapason(this.coords.p_single_real, this.options.from_min, this.options.from_max);
                    this.coords.p_single = this.toFixed(this.coords.p_single_real / 100 * real_width); 
                    
                    break;

                case "from":
                    if (this.options.from_fixed)
                        break;

                    this.coords.p_from_real = this.calcWithStep(real_x / real_width * 100);
                    if (this.coords.p_from_real > this.coords.p_to_real) {
                        this.coords.p_from_real = this.coords.p_to_real;
                    }
                    this.coords.p_from_real = this.checkDiapason(this.coords.p_from_real, this.options.from_min, this.options.from_max);
                    this.coords.p_from_real = this.checkMinInterval(this.coords.p_from_real, this.coords.p_to_real, "from");
                    this.coords.p_from_real = this.checkMaxInterval(this.coords.p_from_real, this.coords.p_to_real, "from");
                    this.coords.p_from = this.toFixed(this.coords.p_from_real / 100 * real_width);

                    break;

                case "to":
                    if (this.options.to_fixed)
                        break;

                    this.coords.p_to_real = this.calcWithStep(real_x / real_width * 100);
                    if (this.coords.p_to_real < this.coords.p_from_real) {
                        this.coords.p_to_real = this.coords.p_from_real;
                    }
                    this.coords.p_to_real = this.checkDiapason(this.coords.p_to_real, this.options.to_min, this.options.to_max);
                    this.coords.p_to_real = this.checkMinInterval(this.coords.p_to_real, this.coords.p_from_real, "to");
                    this.coords.p_to_real = this.checkMaxInterval(this.coords.p_to_real, this.coords.p_from_real, "to");
                    this.coords.p_to = this.toFixed(this.coords.p_to_real / 100 * real_width);
                    break;

                case "both":
                    if (this.options.from_fixed || this.options.to_fixed) {
                        break;
                    }

                    real_x = this.toFixed(real_x + (this.coords.p_handle * 0.1));

                    this.coords.p_from_real = this.calcWithStep((real_x - this.coords.p_gap_left) / real_width * 100);
                    this.coords.p_from_real = this.checkDiapason(this.coords.p_from_real, this.options.from_min, this.options.from_max);
                    this.coords.p_from_real = this.checkMinInterval(this.coords.p_from_real, this.coords.p_to_real, "from");
                    this.coords.p_from = this.toFixed(this.coords.p_from_real / 100 * real_width);

                    this.coords.p_to_real = this.calcWithStep((real_x + this.coords.p_gap_right) / real_width * 100);
                    this.coords.p_to_real = this.checkDiapason(this.coords.p_to_real, this.options.to_min, this.options.to_max);
                    this.coords.p_to_real = this.checkMinInterval(this.coords.p_to_real, this.coords.p_from_real, "to");
                    this.coords.p_to = this.toFixed(this.coords.p_to_real / 100 * real_width);

                    break;
            }

            if (this.options.isSingle) {
                this.coords.p_bar_x = 0;
                this.coords.p_bar_w = this.coords.p_single + (this.coords.p_handle / 2);

                this.result.from_percent = this.coords.p_single_real;
                this.result.from = this.calcReal(this.coords.p_single_real);
            } else {
                this.coords.p_bar_x = this.toFixed(this.coords.p_from + (this.coords.p_handle / 2));
                this.coords.p_bar_w = this.toFixed(this.coords.p_to - this.coords.p_from);

                this.result.from_percent = this.coords.p_from_real;
                this.result.from = this.calcReal(this.coords.p_from_real);
                this.result.to_percent = this.coords.p_to_real;
                this.result.to = this.calcReal(this.coords.p_to_real);
            }

            this.calcMinMax();
            this.calcLabels();

        }, //end of calc()

        //calcPointer
        calcPointer: function () {
            if (!this.coords.w_rs) {
                this.coords.p_pointer = 0;
                return;
            }
            var x_pointer_raw = isNaN(this.coords.x_pointer) ? 0 : this.coords.x_pointer;

            if (this.coords.x_pointer < 0 || isNaN(this.coords.x_pointer)  )
                this.coords.x_pointer = 0;
            else 
                if (this.coords.x_pointer > this.coords.w_rs)
                    this.coords.x_pointer = this.coords.w_rs;

            this.coords.p_pointer     = this.toFixed(this.coords.x_pointer / this.coords.w_rs * 100);
            this.coords.p_pointer_raw = this.toFixed(x_pointer_raw         / this.coords.w_rs * 100);
        },

        //chooseHandle
        chooseHandle: function (real_x) {
            if (this.options.isSingle) {
                return "single";
            } else {
                var m_point = this.coords.p_from_real + ((this.coords.p_to_real - this.coords.p_from_real) / 2);
                if (real_x >= m_point) {
                    return "to";
                } else {
                    return "from";
                }
            }
        },

        //calcMinMax
        calcMinMax: function () {
            if (!this.coords.w_rs) return;

            this.labels.p_min = this.labels.w_min / this.coords.w_rs * 100;
            this.labels.p_max = this.labels.w_max / this.coords.w_rs * 100;
        },

        //calcLabels
        calcLabels: function () {
            if (!this.coords.w_rs || this.options.hide_from_to) return;

            if (this.options.isSingle) {
                this.labels.w_single = this.getOuterWidth(this.cache.$single);
                this.labels.p_single = this.labels.w_single / this.coords.w_rs * 100;
                this.labels.p_single_left = this.coords.p_single + (this.coords.p_handle / 2) - (this.labels.p_single / 2);
                if (!this.options.fixed_handle)
                    this.labels.p_single_left = this.checkEdges(this.labels.p_single_left, this.labels.p_single);

            } 
            else {
                this.labels.w_from = this.getOuterWidth(this.cache.$from);
                this.labels.p_from = this.labels.w_from / this.coords.w_rs * 100;
                this.labels.p_from_left = this.coords.p_from + (this.coords.p_handle / 2) - (this.labels.p_from / 2);
                this.labels.p_from_left = this.toFixed(this.labels.p_from_left);
                this.labels.p_from_left = this.checkEdges(this.labels.p_from_left, this.labels.p_from);

                this.labels.w_to = this.getOuterWidth(this.cache.$to);
                this.labels.p_to = this.labels.w_to / this.coords.w_rs * 100;
                this.labels.p_to_left = this.coords.p_to + (this.coords.p_handle / 2) - (this.labels.p_to / 2);
                this.labels.p_to_left = this.toFixed(this.labels.p_to_left);
                this.labels.p_to_left = this.checkEdges(this.labels.p_to_left, this.labels.p_to);

                this.labels.w_single = this.getOuterWidth(this.cache.$single);
                this.labels.p_single = this.labels.w_single / this.coords.w_rs * 100;
                this.labels.p_single_left = ((this.labels.p_from_left + this.labels.p_to_left + this.labels.p_to) / 2) - (this.labels.p_single / 2);
                this.labels.p_single_left = this.toFixed(this.labels.p_single_left);
                this.labels.p_single_left = this.checkEdges(this.labels.p_single_left, this.labels.p_single);

            }
        },

        // =============================================================================================================
        // Drawings


        //drawHandles
        drawHandles: function () {

            function setLeftAndWidth( $elem, left, width ){
                if (!$elem) return;
                var css = {};
                if (left !== null)
                    css.left = left + (left ? '%' : '');                  
                if (width !== null)
                    css.width = width + (width ? '%' : '');                  
                $elem.css( css );
            }

            this.getCoords_w_rs();

            if (!this.coords.w_rs) return;

            if (this.coords.w_rs !== this.coords.w_rs_old) {
                this.target = "base";
                this.is_resize = true;
            }

            if (this.coords.w_rs !== this.coords.w_rs_old || this.force_redraw) {
                this.setMinMax();
                this.calc(true);
                this.drawLabels();
                if (this.options.grid)
                    this.calcGridMargin();
                this.force_redraw = true;
                this.coords.w_rs_old = this.coords.w_rs;
            }

            if (!this.coords.w_rs) return; 

            if (!this.dragging && !this.force_redraw && !this.is_key) return;

            if (this.old_from !== this.result.from || this.old_to !== this.result.to || this.force_redraw || this.is_key) {
                this.drawLabels();
                setLeftAndWidth( this.cache.$bar, this.coords.p_bar_x, this.coords.p_bar_w );

                if (this.options.has_pin)
                    this.cache.$s_pin.css({
                        "left" : this.coords.p_pin_value + "%",
                        "color": this.options.pin_color
                    });

                if (this.options.isSingle) {
                    setLeftAndWidth( this.cache.$s_single, this.coords.p_single );
                    setLeftAndWidth( this.cache.$single, this.labels.p_single_left );

                    if (this.options.fixed_handle)
                        //Keep the handle centered in in container
                        this.cache.$container.css('left', - this.coords.w_container*this.coords.p_single/100
                                                          + 0.5*this.coords.w_outerContainer + 'rem' );
                } 
                else {
                    setLeftAndWidth( this.cache.$s_from, this.coords.p_from );
                    setLeftAndWidth( this.cache.$s_to, this.coords.p_to );
                    setLeftAndWidth( this.cache.$lineLeft, 0, this.coords.p_bar_x );
                    if (this.old_from !== this.result.from || this.force_redraw)
                        setLeftAndWidth( this.cache.$from, this.labels.p_from_left );
                    if (this.old_to !== this.result.to || this.force_redraw)
                        setLeftAndWidth( this.cache.$to, this.labels.p_to_left );
                    setLeftAndWidth( this.cache.$single, this.labels.p_single_left );
                }

                if ((this.old_from !== this.result.from || this.old_to !== this.result.to) && !this.is_start)
                    this.cache.$input.trigger("change");

                this.old_from = this.result.from;
                this.old_to = this.result.to;

                if (!this.is_resize && !this.is_update && !this.is_start)
                    this.onChange();

                if (this.is_key || this.is_click)
                    this.onFinish();

                this.is_update = false;
                this.is_resize = false;
            }

            this.is_start = false;
            this.is_key = false;
            this.is_click = false;
            this.force_redraw = false;
        },

        //drawLabels
        drawLabels: function () { 
            if (!this.options || this.options.hide_from_to) return;

            var text_single, text_from, text_to;

            if (this.options.isSingle) {

                text_single = this.decorate(this._prettify(this.result.from), this.result.from);
                this.cache.$single.html(text_single);

                this.calcLabels();

                if (!this.options.hide_min_max){
                    this.cache.$min.toggle( this.labels.p_single_left >= this.labels.p_min + 1 );       
                    this.cache.$max.toggle( this.labels.p_single_left + this.labels.p_single <= 100 - this.labels.p_max - 1 );       
                }

            } 
            else {

                if (this.options.decorate_both) {
                    text_single = this.decorate(this._prettify(this.result.from));
                    text_single += this.options.values_separator;
                    text_single += this.decorate(this._prettify(this.result.to));
                } else {
                    text_single = this.decorate(this._prettify(this.result.from) + this.options.values_separator + this._prettify(this.result.to), this.result.from);
                }
                text_from = this.decorate(this._prettify(this.result.from), this.result.from);
                text_to = this.decorate(this._prettify(this.result.to), this.result.to);

                this.cache.$single.html(text_single);
                this.cache.$from.html(text_from);
                this.cache.$to.html(text_to);

                this.calcLabels();

                var min = Math.min(this.labels.p_single_left, this.labels.p_from_left),
                single_left = this.labels.p_single_left + this.labels.p_single,
                to_left = this.labels.p_to_left + this.labels.p_to,
                max = Math.max(single_left, to_left);

                if (this.labels.p_from_left + this.labels.p_from >= this.labels.p_to_left) {
                    this.cache.$from.css('visibility', 'hidden');
                    this.cache.$to.css('visibility', 'hidden');
                    this.cache.$single.css('visibility', 'visible');

                    if (this.result.from === this.result.to) {
                        this.cache.$from.css('visibility', 'visible');
                        this.cache.$single.css('visibility', 'hidden');
                        max = to_left;
                    } else {
                        this.cache.$from.css('visibility', 'hidden');
                        this.cache.$single.css('visibility', 'visible');
                        max = Math.max(single_left, to_left);
                    }
                } else {
                    this.cache.$from.css('visibility', 'visible');
                    this.cache.$to.css('visibility', 'visible');
                    this.cache.$single.css('visibility', 'hidden');
                }

                if (!this.options.hide_min_max){
                    this.cache.$min.toggle( min >= this.labels.p_min + 1 );       
                    this.cache.$max.toggle( max <= 100 - this.labels.p_max - 1 );       
                }
            }
        }, //end of drawLabels


        // =============================================================================================================
        // Service methods

        //toggleInput
        toggleInput: function () {
            this.cache.$input.toggleClass("hidden-input");
        },

        //calcPercent
        calcPercent: function (num) {
            var w = (this.options.max - this.options.min) / 100,
            percent = (num - this.options.min) / w;

            return this.toFixed(percent);
        },

        //calcReal
        calcReal: function (percent) {
            var min = this.options.min,
            max = this.options.max,
            abs = 0;

            if (min < 0) {
                abs = Math.abs(min);
                min = min + abs;
                max = max + abs;
            }

            var number = ((max - min) / 100 * percent) + min,
            string = this.options.step.toString().split(".")[1];

            if (string)
                number = +number.toFixed(string.length);
            else {
                number = number / this.options.step;
                number = number * this.options.step;
                number = +number.toFixed(0);
            }

            if (abs)
                number -= abs;

            if (number < this.options.min)
                number = this.options.min;
            else 
                if (number > this.options.max)
                    number = this.options.max;

            if (string)
                return +number.toFixed(string.length);
            else
                return this.toFixed(number);
        },

        //calcWithStep
        calcWithStep: function (percent) {
            var rounded = Math.round((percent - this.coords.p_step_offset) / this.coords.p_step) * this.coords.p_step + this.coords.p_step_offset;

            if (rounded < this.coords.p_min) rounded = this.coords.p_min;
            if (rounded > 100)               rounded = 100;
            if (percent === 100)             rounded = 100;
            if (rounded > this.coords.p_max) rounded = this.coords.p_max;
            return this.toFixed(rounded);
        },

        //checkMinInterval
        checkMinInterval: function (p_current, p_next, type) {
            var o = this.options,
            current,
            next;

            if (!o.min_interval)
                return p_current;

            current = this.calcReal(p_current);
            next = this.calcReal(p_next);

            if (type === "from") {
                if (next - current < o.min_interval)
                    current = next - o.min_interval;
            } 
            else
                if (current - next < o.min_interval)
                    current = next + o.min_interval;

            return this.calcPercent(current);
        },

        //checkMaxInterval
        checkMaxInterval: function (p_current, p_next, type) {
            var o = this.options,
            current,
            next;

            if (!o.max_interval)
                return p_current;

            current = this.calcReal(p_current);
            next = this.calcReal(p_next);

            if (type === "from") {
                if (next - current > o.max_interval)
                    current = next - o.max_interval;
            } 
            else
                if (current - next > o.max_interval)
                    current = next + o.max_interval;

            return this.calcPercent(current);
        },

        //checkDiapason
        checkDiapason: function (p_num, min, max) {
            var num = this.calcReal(p_num),
            o = this.options;

            if (!min || typeof min !== "number") { min = o.min; }
            if (!max || typeof max !== "number") { max = o.max; }
            if (num < min) { num = min; }
            if (num > max) { num = max; }

            return this.calcPercent(num);
        },

        //toFixed
        toFixed: function (num) {
            num = num.toFixed(5);
            return +num;
        },

        //_prettify
        _prettify: function (num) {
            return (this.options.prettify && typeof this.options.prettify === "function") ? this.options.prettify(num) : num;
        },

        //_prettify_text
        _prettify_text: function (num) {
            return (this.options.prettify_text && typeof this.options.prettify_text === "function") ? this.options.prettify_text(num) : num;
        },

        //checkEdges
        checkEdges: function (left, width) {
            if (left < 0)
                left = 0;
            else 
                if (left > 100 - width)
                    left = 100 - width;
            return this.toFixed(left);
        },

        //validate
        validate: function () {
            var o = this.options,
            r = this.result;

            if (typeof o.min === "string") o.min = +o.min;
            if (typeof o.max === "string") o.max = +o.max;
            if (typeof o.from === "string") o.from = +o.from;
            if (typeof o.to === "string") o.to = +o.to;
            if (typeof o.step === "string") o.step = +o.step;

            if (typeof o.from_min === "string") o.from_min = +o.from_min;
            if (typeof o.from_max === "string") o.from_max = +o.from_max;
            if (typeof o.to_min === "string") o.to_min = +o.to_min;
            if (typeof o.to_max === "string") o.to_max = +o.to_max;

            if (o.max <= o.min) {
                if (o.min)
                    o.max = o.min * 2;
                else
                    o.max = o.min + 1;
                o.step = 1;
            }

            if (typeof o.from !== "number" || isNaN(o.from)) { o.from = o.min; }
            if (typeof o.to !== "number" || isNaN(o.from)) { o.to = o.max; }
            if (o.from < o.min || o.from > o.max) { o.from = o.min; }
            if (o.to > o.max || o.to < o.min) { o.to = o.max; }
            if (o.type === "double" && o.from > o.to) { o.from = o.to; }
            if (typeof o.step !== "number" || isNaN(o.step) || !o.step || o.step < 0) { o.step = 1; }
            if (o.from_min && o.from < o.from_min) { o.from = o.from_min; }
            if (o.from_max && o.from > o.from_max) { o.from = o.from_max; }
            if (o.to_min && o.to < o.to_min) { o.to = o.to_min; }
            if (o.to_max && o.from > o.to_max) { o.to = o.to_max; }
            if (r) {
                if (r.min !== o.min) r.min = o.min;
                if (r.max !== o.max) r.max = o.max;
                if (r.from < r.min || r.from > r.max) r.from = o.from;
                if (r.to < r.min || r.to > r.max) r.to = o.to;
            }
            if (typeof o.min_interval !== "number" || isNaN(o.min_interval) || !o.min_interval || o.min_interval < 0) o.min_interval = 0;
            if (typeof o.max_interval !== "number" || isNaN(o.max_interval) || !o.max_interval || o.max_interval < 0) o.max_interval = 0;
            if (o.min_interval && o.min_interval > o.max - o.min) o.min_interval = o.max - o.min;
            if (o.max_interval && o.max_interval > o.max - o.min) o.max_interval = o.max - o.min;

        }, //end of validate


        //decorate
        decorate: function (num, original) {
            var decorated = "",
            o = this.options;

            if (o.prefix) {
                decorated += o.prefix;
            }

            decorated += num;

            if (o.max_postfix) {
                if (original === o.max) {
                    decorated += o.max_postfix;
                    if (o.postfix) {
                        decorated += " ";
                    }
                }
            }

            if (o.postfix) {
                decorated += o.postfix;
            }

            return decorated;
        },

        //updateFrom
        updateFrom: function () {
            this.result.from = this.options.from;
            this.result.from_percent = this.calcPercent(this.result.from);
        },

        //updateTo
        updateTo: function () {
            this.result.to = this.options.to;
            this.result.to_percent = this.calcPercent(this.result.to);
        },

        //updateResult
        updateResult: function () {
            this.result.min = this.options.min;
            this.result.max = this.options.max;
            this.updateFrom();
            this.updateTo();
        },


        // =============================================================================================================
        // Grid - use appendGridContainer to create new grids. Use addGridText(text, left[, value]) to add a grid-text

        appendGridContainer: function(){
            this.getCoords_w_rs();
            if (this.currentGridContainer){
                this.totalGridContainerTop += this.currentGridContainer.height();
                this.currentGridContainer =
                    $('<span class="grid"></span>').insertAfter( this.currentGridContainer );
                this.currentGridContainer.css('top', this.pxToRem( this.totalGridContainerTop, true) );
            }
            else {
                this.currentGridContainer = this.cache.$grid;
                this.totalGridContainerTop = this.currentGridContainer.position().top;
            }
            this.cache.$grid = this.cache.$container.find(".grid");
            return this.currentGridContainer;
        },


        //appendTick
        appendTick: function( left, options ){
            if (!this.currentGridContainer) return;

            options = $.extend( {minor: false, color: ''}, options );
            var result = $('<span class="grid-pol" style="left:' + left + '%"></span>');

            if (options.minor)
                result.addClass('minor');
            if (options.color)
                result.css('background-color', options.color);


            result.appendTo( this.currentGridContainer );
            return result;

        },

        //appendText
        appendText: function( left, value, options ){
            if (!this.currentGridContainer) return;

            options = $.extend( {color: ''}, options );
            var text = this._prettify_text( value );

            if (this.options.decorate_text)
              text = (this.options.prefix ? this.options.prefix : '') +
                     text +
                     (this.options.postfix ? this.options.postfix : '');
            var result = $('<span class="grid-text" style="background-color:transparent; left: ' + left + '%">' + text + '</span>');
            result.appendTo( this.currentGridContainer );

            //Center the label
            result.css( 'margin-left', this.getOuterWidth(result, true, -0.5) );

            if (options.clickable){
                //Check if the value for the label is a selectable one
                options.clickable = 
                    (this.options.step == 1) ||
                    ( ((value - this.options.step_offset) % this.options.step) === 0);
            }

            if (options.clickable && !this.options.disable && !this.options.read_only){
                //value = options.click_value !== undefined ? options.click_value : parseFloat( text );
                value = options.click_value !== undefined ? options.click_value : value;
                result
                    .data('base-slider-value', value)
                    .on("click.irs_" + this.plugin_count, $.proxy( this.textClick, this ) ) /* this.textClick.bind(this) */
                    .addClass('clickable');
            }
            if (options.minor)
                result.addClass('minor');
            if (options.italic)
                result.addClass('italic');
            if (options.color)
                result.css('color', options.color);


            return result;

        },

        //getTextWidth
        getTextWidth: function( value, options ){
            var
                elem = this.appendText( 0, value, options ),
                result = parseFloat( elem.outerWidth(false) );
            elem.remove();
            return this.pxToRem(result);
        },

        //appendGrid
        appendGrid: function () {
            if (!this.options.grid) return;
            this.appendStandardGrid();
        },

        //appendStandardGrid - simple call _appendStandardGrid. Can be overwriten in decending classes
        appendStandardGrid: function ( textOptions ) {
            this._appendStandardGrid( textOptions );
        },

        //_appendStandardGrid
        _appendStandardGrid: function ( textOptions, tickOptions ) {
            this.appendGridContainer();
            this.calcGridMargin();

            var o = this.options,
                gridContainerWidth = this.getOuterWidth(this.cache.$grid),
                gridDistanceIndex = 0,
                value = o.min,
                maxTextWidth = 0,
                valueP = 0,
                valueOffset;
            o.gridDistanceStep = o.gridDistances[gridDistanceIndex]; // = number of steps between each tick
            o.stepRem = o.step*gridContainerWidth/o.total  / o.major_ticks_factor;
//            o.oneP = this.toFixed(100 / total);
//            o.stepP = this.toFixed(o.step / (total / 100));

            textOptions = $.extend( textOptions || {}, {clickable: this.options.clicable} );
            tickOptions = tickOptions || {};


            //Increse grid-distance until the space between two ticks are more than 4px
            while ( (o.stepRem*o.gridDistanceStep) <= this.pxToRem(4)){
                gridDistanceIndex++;
                if (gridDistanceIndex < o.gridDistances.length)
                  o.gridDistanceStep = o.gridDistances[gridDistanceIndex];
                else
                    o.gridDistanceStep = o.gridDistanceStep*2;
            }
            o.tickDistanceNum = o.gridDistanceStep*o.step;    //The numerical distance between each ticks
            o.tickDistanceRem = o.gridDistanceStep*o.stepRem; //The rem distance between each ticks


            var _major_ticks = o.major_ticks;
            if (!_major_ticks){
              //Calculate automatic distances between major ticks

                //Find widest text/label
                value = o.min;
                while (value <= o.max){
                    //if value corrected by o.major_ticks_offset and o.major_ticks_factor is a DIV of the tick distance => calculate the width of the tick
                    if ((value - o.major_ticks_offset)*o.major_ticks_factor % o.tickDistanceNum === 0)
                        maxTextWidth = Math.max( maxTextWidth, this.getTextWidth( value ) );
                    value += 1;
                }
                maxTextWidth += this.pxToRem(6); //Adding min space between text/labels

                //Find ticks between each major tick
                gridDistanceIndex = 0;
                _major_ticks = o.gridDistances[gridDistanceIndex];
                while (_major_ticks*o.tickDistanceRem < maxTextWidth){
                    gridDistanceIndex++;
                    if (gridDistanceIndex < o.gridDistances.length)
                        _major_ticks = o.gridDistances[gridDistanceIndex];
                    else
                        _major_ticks = _major_ticks*2;
                }
            }

            o.majorTickDistanceNum = o.tickDistanceNum*_major_ticks;

            //Add all the minor and major ticks
            value = o.min;
            while (value <= o.max){
                valueOffset = (value - o.major_ticks_offset)*o.major_ticks_factor;
                if (valueOffset % o.tickDistanceNum === 0){
                    if (valueOffset % o.majorTickDistanceNum === 0){
                    //add major tick and text/label
                        this.appendTick( valueP, tickOptions );
                        this.appendText( valueP, value, textOptions );
                    }
                    else
                        if (!o.hide_minor_ticks)
                            //Add minor tick
                            this.appendTick( valueP, { minor:true } );
                }
                value += 1;
                valueP += o.oneP;
            }
        
            if (this.options.grid_colors)
                this.appendGridColors( this.options.grid_colors );  
                    
        
        
        },

        //addGridColor
        appendGridColors: function( gridColors ){
            var fromValue,
                toValue  = this.options.min,
                i,
                gridColor,
                percentFactor = 100 / (this.options.max - this.options.min)
            



            for (i=0; i<gridColors.length; i++ ){
                gridColor = gridColors[i];
                if (gridColor.value < this.options.min){
                  //add triangle to the left
                    $('<span/>')
                        .addClass('grid-color lt_min')
                        .css('color', gridColor.color)
                        .appendTo( this.currentGridContainer );
                }
                else
                    if (gridColor.value > this.options.max){
                        //Add triangle to the right         
                        $('<span/>')
                            .addClass('grid-color gt_max')
                            .css('color', gridColor.color)
                            .appendTo( this.currentGridContainer );
                        
                    }
                    else {
                        fromValue = gridColor.fromValue !== undefined ? gridColor.fromValue : toValue;
                        toValue = gridColor.value;

                        $('<span/>')
                            .addClass('grid-color' + (i%2?' to':' from'))
                            .css({
                                'left'            : percentFactor*(fromValue - this.options.min) + '%',
                                'width'           : percentFactor*(toValue-fromValue) + '%',
                                'background-color': gridColor.color
                                })
                            .appendTo( this.currentGridContainer );
                    }
            }
        },

        //calcHandleWidth - Get the width of the drawing handle but round down to even number to ensure correct placement of the handle 
        calcHandleWidth: function(){
            var $handle  = this.options.isSingle ? this.cache.$s_single : this.cache.$s_from,
                widthPx  = $handle.outerWidth(false),
                widthRem = this.pxToRem( 2*Math.floor(widthPx/2) ) //Round down the width to even number to assure that width/2 is a hole number

            if (this.options.isSingle) 
                this.coords.w_handle = widthRem;
            else
                this.coords.w_handle = widthRem;
        },

        //calcGridMargin
        calcGridMargin: function () {
            this.getCoords_w_rs();
            if (!this.coords.w_rs) return;
            
            this.calcHandleWidth();
            
            this.coords.p_handle = this.toFixed(this.coords.w_handle  / this.coords.w_rs * 100);

            this.cache.$grid.css({
                'width': this.toFixed(100 - this.coords.p_handle) + "%",
                'left' : this.toFixed(this.coords.w_handle / 2 ) + "rem"
            });
        },


        // =============================================================================================================
        // Public methods

        //update
        update: function (options) {
            if (!this.input) return;

            this.is_update = true;

            this.options.from = this.result.from;
            this.options.to = this.result.to;

            this.options = $.extend(this.options, options);
            this.validate();
            this.updateResult();

            this.toggleInput();
            this.remove();
            this.init(true);
        },

        //reset
        reset: function () {
            if (!this.input) return;

            this.updateResult();
            this.update();
        },

        //destroy
        destroy: function () {
            if (!this.input) return;

            this.toggleInput();
            this.cache.$input.prop("readonly", false);
            $.data(this.input, "baseSlider", null);

            this.remove();
            this.input = null;
            this.options = null;
        }
    }; //end of BaseSlider.prototype


    $.fn.baseSlider = function (options) {
        return this.each(function() {
            if (!$.data(this, "baseSlider")) {
                $.data(this, "baseSlider", new window.BaseSlider(this, options, plugin_count++));
            }
        });
    };


}(jQuery, this, document));
