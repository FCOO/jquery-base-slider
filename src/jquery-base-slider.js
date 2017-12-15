/****************************************************************************
    jquery-base-slider, Description from README.md

    (c) 2015, FCOO

    https://github.com/fcoo/jquery-base-slider
    https://github.com/fcoo

****************************************************************************/
(function ($, window, document, undefined) {
    "use strict";

    /*******************************************************************
    ********************************************************************
    DEFAULT OPTIONS
    ********************************************************************
    *******************************************************************/
    var defaultOptions = {
        //Type and handle
        type        : "single",  // Choose single or double, could be "single" - for one handle, or "double" for two handles
        handle      : "down",    // Choose handle type, could be "horizontal", "vertical", "down", "up", "left", "right", "round", "range", or "fixed"
        read_only   : false,     // Locks slider and makes it inactive.
        disable     : false,     // Locks slider and makes it disable ("dissy")
        fixed_handle: false,     // Special version where the slider is fixed and the grid are moved left or right to select value. handle is set to "single"
                                 // A value for options.width OR options.value_distances must be provided
        clickable   : true,      // Allows click on lables and line. Default = true except for fixed_handle:true where default = false
        mousewheel  : true,      // Adds mousewheel-event to the parent-element of the slider. Works best if the parent-element only contains the slider and has a fixed height and width

        //Dimensions (only for options.fixed_handle: true)
        width          : 0, // The total width of the slider (in px for 1rem = 16px)
        value_distances: 3, // The distance between each values on the slider (in px for 1rem = 16px). Width will be value_distances*( max - min )

        //Ranges and value
        min : 0,            // Set slider minimum value
        max : 100,          // Set slider maximum value
        value: null,        // Set start position for single handle
        from : null,        // Set start position for left handle
        to   : null,        // Set start position for right handle

        value_min  : null,   // Minimum limit single handle.
        value_max  : null,   // Maximum limit single handle

        from_fixed: false,  // Fix position of left handle.
        from_min  : null,   // Minimum limit for left handle.
        from_max  : null,   // Maximum limit left handle

        to_fixed: false,    // Fix position of right handle.
        to_min  : null,     // Set the minimum limit for right handle
        to_max  : null,     // Set the maximum limit for right handle

        pin_value: null,            // The value for the pin. Use  setPin( value [, color] )  to change the value dynamical
        pin_color: 'black',         // The color of the pin. Use  setPin( value , color )  to change the color dynamical
        pin_icon : 'fa-map-marker', // The class-name from Fontawasome setting the icon used as pin

        //Steps
        step        : 1,    // Set sliders step. Always > 0. Could be fractional.
        step_offset : 0,    // When  step  > 1: Offset for the allowed values. Eq. Min=0, max=100, step=5, step_offset=3 => allowed values=3,8,13,...,92,97 (3+N*5)<br>Only tested for  type="single"
        min_interval: 0,    // Minimum interval between left and right handles. Only in "double" type
        max_interval: 0,    // Maximum interval between left and right handles. Only in "double" type

        keyboard_shift_step_factor: 5,  //Factor when pressing etc. shift-left compare to left
        keyboard_page_step_factor : 20, //Step-factor when pressing pgUp or PgDn

        //Slide-line
        lineBackgroundColor: '#d1d6e0', //The bakground color of the line

        showLineColor      : true,
        lineColor          : '#428BCA', //The color of the line left of the handle (single) or between the two handles (double)

        showImpactLineColor   : false, // The line on a double slider is coloured as green-[handle]-yellow-[handle]-red
        impactLineColors      : {green: "green", yellow: "yellow", red: "red"}, //The line colors used when showImpactLineColor: true
        reverseImpactLineColor: false, // The line on a double slider is colored as red-[handle]-yellow-[handle]-green. Must have showImpactLineColor: true


        //Grid (ticks and text)
        grid              : false,                      // Enables grid of values.
        major_ticks       : null,                       // Nummber of  step  between major ticks. Default=null=> Calculated automatic
        major_ticks_offset: 0,                          // Offset for the values where a major ticks is placed. Eq. Min=0, max=100 => major ticks on values=0,10,20,..,90,100. With  major_ticks_offset:4  the major ticks would be placed on values=4,14,24,...,84,94
        show_minor_ticks  : true,                      // Show minor ticks.
        gridDistances     : [1, 2, 5, 10, 20, 50, 100], // Distance between major ticks. E.g. Slider with hours could use [1, 2, 4, 12, 24]
        ticks_on_line     : false,                      // Place the ticks in the (first) grid on the line with the handles.
        major_ticks_factor: 1,                          // Not documented

        grid_colors       : null, //Array of { [fromValue, ]value, color } to set colors on the line. If no fromValue is given the the previous value is used.
                                  //If value == null or < min => A triangle is added to the left indicating 'below min'.
                                  //If value > max            =>  A triangle is added to the right indicating 'above max'.
        textColors        : null, //Array of {value, className, color, backgroundColor} to set frame around and className, color, backgroundColor for the label and with value

        //Marker above handle
        show_min_max: false,    // Show min and max markers
        show_from_to: true,     // Show from and to markers
        marker_frame: false,    // Frame the from- and to-marker

        //Adjust text-labels and markers
        prettify        : null,  // Set up your prettify function. Can be anything. For example, you can set up unix time as slider values and than transform them to cool looking dates.
        prettify_text   : null,  // As  prettify  but for the text/labels in the grid.
        prefix          : "",    // Set prefix for values. Will be set up right before the number: $100
        postfix         : "",    // Set postfix for values. Will be set up right after the number: 100k
        decorate_both   : true,  // Used for "double" type and only if prefix or postfix was set up. Determine how to decorate close values. For example: $10k - $100k or $10 - 100k
        decorate_text   : false, // The text/labels in the grid also gets  prefix  and/or  postfix
        values_separator: " - ", // Text between min and max value when labels are combined. values_separator:" to " => "12 to 24"

        //Callback
        onStart : null, // Callback. Is called on slider start.
        onChange: null, // Callback. Is called on each values change.
        onFinish: null, // Callback. Is called than user releases handle.
        onUpdate: null, // Callback. Is called than slider is modified by external methods  update  or  reset
        callback: function( result ){ console.log( result.from, result.value, result.to ); },//HER null, // Callback. Is called when the value, from, or to  value are changed.
        callback_on_dragging: true, // If false callback-function is only called when dragging the sliding is finish.
        callback_delay      : 500,  // If callback_on_dragging == false the callback-function is called when the slider has been on the same tick for callback_delay milliseconds. Set to zero to avoid any callback before mouseup-event


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
    adjustToMinMax
    Check and adjust num to be in range [min,max]
    *******************************************************************/
    function adjustToMinMax( num, min, max ) {
        if (isNaN(num))
            return min;
        return Math.max( Math.min(num, max), min);
    }

    /*******************************************************************
    SliderValue
    Object to store and alter "value" releated to the slider
    The object contains the following items:
        value   : The actual value ,
        percent : The value as percent of the total slider width
        rem     : The value converted to rem
    *******************************************************************/
    var SliderValue = function( options ){
        this.slider = options.slider;
        this.percentFactor = 100/(this.slider.options.max - this.slider.options.min);
        this.sliderMin = this.slider.options.min;
        this.adjustToStep = !!options.adjustToStep;
        this.fixed = !!options.fixed;
        this.value   = 0;
        this.rem     = 0;
        this.percent = 0;
        this.minList = [];
        this.maxList = [];

        var _this = this;
        $.each( options.minList || [], function( index, sliderValueMin ){ _this.addMin( sliderValueMin ); });
        $.each( options.maxList || [], function( index, sliderValueMax ){ _this.addMax( sliderValueMax ); });

        this.setValue( options.value );
    };

    SliderValue.prototype = {
        //addMin( sliderValue, minDistance )
        //Add sliderValue to list of SliderValue that this must allways be greater than or equal to
        addMin: function( sliderValue, minDistance = 0 ){
            if (sliderValue === null) return this;
            if ($.isNumeric(sliderValue))
                sliderValue = new SliderValue({ value: sliderValue, slider: this.slider });
            this.minList.push( {sliderValue: sliderValue, minDistance: minDistance || 0} );
            this.update();
            return this;
        },

        //addMax( sliderValue, minDistance )
        //Add sliderValue to list of SliderValue that this must allways be less than or equal to
        addMax: function( sliderValue, minDistance = 0 ){
            if (sliderValue === null) return this;
            if ($.isNumeric(sliderValue))
                sliderValue = new SliderValue({ value: sliderValue, slider: this.slider });
            this.maxList.push( {sliderValue: sliderValue, minDistance: minDistance || 0} );
            this.update();
            return this;
        },

        setValue: function( newValue ){
            this.value = newValue;
            this.update();
            return this;
        },


        setPercent( newPercent ){
            this.setValue( newPercent/this.percentFactor + this.sliderMin );
        },

        update: function(){
            if (this.fixed)
                return this;

            //Adjust this.value with respect to {sliderValue,minDistance} in this.minList
            var _this = this;
            $.each( this.minList, function( index, rec ){
                if (rec.sliderValue)
                    _this.value = Math.max( _this.value, rec.sliderValue.value + rec.minDistance );
            });
            //Adjust this.value with respect to {sliderValue,minDistance} in this.maxList
            $.each( this.maxList, function( index, rec ){
                if (rec.sliderValue)
                    _this.value = Math.min( _this.value, rec.sliderValue.value - rec.minDistance );
            });

            if (this.adjustToStep){
                //Adjust this.value with respect to step and step_offset
                var offset = this.slider.options.min + this.slider.options.step_offset;
                this.value -= offset;
                this.value = this.slider.options.step * Math.round( this.value/this.slider.options.step );
                this.value += offset;
            }

            //Calculate precent
            this.percent = (this.value - this.sliderMin)*this.percentFactor;
            return this;
        },

        getValue: function(){
            return toFixed( this.value );
        },

        getPercent: function( inclUnit ){
            return toFixed( this.percent ) + (inclUnit ? '%' : 0);
        },

        getRem: function( inclUnit ){
            return toFixed( this.rem ) + (inclUnit ? 'rem' : 0);
        }

    };


    /*******************************************************************
    Get font-size for the html
    *******************************************************************/
    var htmlFontSize = parseFloat( $('html').css('font-size') || $('body').css('font-size') || $.DEFAULT_BROWSER_FONT_SIZE || '16px' );

    function onFontSizeChange( event, fontSize ){
        htmlFontSize = parseFloat( fontSize.fontSizePx ) || htmlFontSize;
    };

    $.onFontSizeChanged( onFontSizeChange );


    /*******************************************************************
    pxToRem
    *******************************************************************/
    function pxToRem( valuePx, inclUnit ){
        return valuePx / htmlFontSize + (inclUnit ? 'rem' : 0);
    }

    /*******************************************************************
    innerWidthRem
    *******************************************************************/
    function innerWidthRem( $element ){
        return $element ? pxToRem( $element.innerWidth() ) : 0;
    }

    /*******************************************************************
    outerWidthRem
    *******************************************************************/
    function outerWidthRem( $element ){
        return $element ? pxToRem( $element.outerWidth(false) ) : 0;
    }

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
    getEventLeft
    Return the left (= x) position of an event
    *******************************************************************/
    function getEventLeft( e ){
        return e.pageX || e.originalEvent.touches && e.originalEvent.touches[0].pageX;
    }


    //'Global' text-element to be used by getTextWidth
    var $outerTextElement = null,
        textElement       = null;


    /*******************************************************************
    ********************************************************************
    CONSTRUCTOR BaseSlider
    ********************************************************************
    *******************************************************************/
    var plugin_count = 0;
    window.BaseSlider = function (input, options, plugin_count) {
        this.input = input;
        this.plugin_count = plugin_count;

        this.current_plugin = 0;
        this.dragging = false;
        this.force_redraw = false;
        this.is_key = false;
        this.is_update = false;
        this.is_start = true;
        this.is_active = false;
        this.is_resize = false;
        this.is_click = false;
        this.is_repeating_click = false;

        this.htmlFontSize = htmlFontSize;

        //this.cache = record with all DOM-elements or jQuery-objects
        this.cache = {
            $win   : $(window),
            $body  : $(document.body),
            $input : $(this.input),
            buttons: { from: {}, to: {} }
        };

        // get config from options
        this.options = $.extend( {}, defaultOptions, options );

        if (this.options.fixed_handle){
            this.options.type   = 'single'; //TODO Allow double slider when fixed (how??)
            this.options.handle = 'fixed';
        }

        this.options.isSingle   = (this.options.type == 'single');
        this.options.isInterval = (this.options.type == 'double');

        //Convert textColors = [] of {value, color, backgroundColor, className} to textColorRec = { value1: { color, backgroundColor, className }, value2: color, backgroundColor, className },...}
        this.options.textColorRec = {};
        var _this = this;
        if (this.options.textColors)
            $.each( this.options.textColors, function( index, rec ){
                _this.options.textColorRec[ rec.value ] = rec;
            });

        //Create element outside DOM used to calc width of text-elements
        this.$outerTextElement =
            $outerTextElement ||
            $('<div/>')
                .addClass('grid')
                .css({ position: 'absolute', top: -10000, left: -10000 })
                .appendTo( $('body') );
        $outerTextElement = this.$outerTextElement;

        this.textElement =
            textElement ||
            $('<span/>')
                .addClass('grid-text')
                .appendTo( this.$outerTextElement )
                .get(0);
        textElement = this.textElement;

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



        /*******************************************************************
        this.mouse, this.markers, this.handles
        *******************************************************************/
        this.coords = {

//            p_step        = this.options.step * factor;
//            p_step_offset = this.options.step == 1 ? 0 : this.options.step_offset * factor;

//x_start
//p_pin_value
            //Width of the container
            containerWidthRem: 0,
            old_containerWidthRem: 0,



            //Mouse position
            mouseOffsetP: 0,       //Different between the handler position (%) and the mouse position (%)

            // left
            x_gap: 0,

            x_pointer: 0,
            p_pointer: 0,


            // percents

            p_step: 0,

            // min and max coorected with step and step_offset
            true_min: 0,
            true_max: 0,

        };

        //this.handles = {from, single, to }
        this.handles = {};

        //this.markers = markers above handles and at ends = {min, from, single, to, max}
        this.markers = {};

        //this.result = record with the current result from the slider
        this.result = {
            $input: this.cache.$input,
            slider: this,
        };


        this.init();

        this.onStart();

        //Update slider when browser font-size is changed
        $.onFontSizeChanged( this.onFontSizeChange, this );
    };

    window.BaseSlider.prototype = {
        /*******************************************************************
        ********************************************************************
        BUILD AND CREATE THE SLIDER
        ********************************************************************
        *******************************************************************/

        /*******************************************************************
        init
        *******************************************************************/
        init: function () {
            var _this = this;
            /*******************************************************************
            this.values = record with SliderValue-object representing the
            different values and there relation
            *******************************************************************/
            this.values = {};
            function addSliderValue(options /*id, optivalue, minList, maxList, adjustToStep*/){
                options.slider = _this;
                _this.values[options.id] = new SliderValue(options);
            }

            //min = Lowest value on the slider
            addSliderValue({ id:'min', value:this.options.min });

            //max = Highest value on the slider
            addSliderValue({ id:'max', value:this.options.max });

            //handleMin = Lowest value for any handle
            addSliderValue({ id:'handleMin', value:this.options.min + this.options.step_offset });

            //handleMax = Highest value for any handle
            var maxSteps = Math.floor( (this.options.max - this.values.handleMin.value) / this.options.step );
            addSliderValue({ id:'handleMax', value:this.values.handleMin.value + maxSteps*this.options.step });

            if (this.options.isSingle)
                //single = value for the single handle
                addSliderValue({
                    id          :'single',
                    value       : this.options.value,
                    minList     : [ this.values.handleMin, this.options.value_min ],
                    maxList     : [ this.values.handleMax, this.options.value_max ],
                    adjustToStep: true
                });
            else {
                //from = value for the left handle
                addSliderValue({
                    id          : 'from',
                    value       : this.options.from,
                    minList     : [ this.values.handleMin, this.options.from_min ],
                    maxList     : [ this.values.handleMax, this.options.from_max ],
                    adjustToStep: true,
                    fixed       : this.options.fixed_from
                });

                //to = value for the right handle
                addSliderValue({
                    id          : 'to',
                    value       : this.options.to,
                    minList     : [ this.values.handleMin, this.options.to_min ],
                    maxList     : [ this.values.handleMax, this.options.to_max ],
                    adjustToStep: true,
                    fixed       : this.options.fixed_to
                });
                if (this.options.min_interval || this.options.max_interval){
                    //TODO

                }


            }

//HER TODO: CHECK HVILKE, DER KAN SLETTES
            this.options.total = this.options.max - this.options.min;
            this.options.oneP  = toFixed(100 / this.options.total);
            this.options.stepP = this.options.step*this.options.oneP;

            var factor = 100/this.options.total;
            this.coords.p_step        = this.options.step * factor;
            this.coords.p_step_offset = this.options.step == 1 ? 0 : this.options.step_offset * factor;

            this.coords.true_min = this.options.min + this.options.step_offset;
            this.coords.true_max = this.coords.true_min;
            while (this.coords.true_max + this.options.step <= this.options.max)
                this.coords.true_max += this.options.step;
//HER            this.coords.p_min = (this.coords.true_min - this.options.min) * this.options.oneP;
//HER            this.coords.p_max = (this.coords.true_max - this.options.min) * this.options.oneP;


//HER            this.options.from = this.adjustValue( this.options.from );
//HER            this.options.to   = this.adjustValue( this.options.to );
//HER            this.result.from  = this.options.from;
//HER            this.result.to    = this.options.to;

            this.target = "base";

            this.updateResult();

            this.toggleInput();
            this.append();
            this.setMinMaxMarkers();
            this.force_redraw = true;
            this.calc(true);
            this.drawHandles();
        },

        /*******************************************************************
        append
        *******************************************************************/
        append: function () {
            //**************************************
            function $span( className, $parent ){
                var result = $('<span/>');
                if (className)
                    result.addClass( className );
                if ($parent)
                  result.appendTo( $parent );
                return result;
            }
            //**************************************

            this.cache.$container =
                $('<div/>')
                    .addClass('base-slider-container ' + this.options.handle + ' js-base-slider-' + this.plugin_count );

            this.cache.$input.before(this.cache.$container);
            this.cache.$input.prop("readonly", true);


            this.result.$slider = this.cache.$container;

            //Put inside outer-container if options.fixed_handle
            if (this.options.fixed_handle){
                this.cache.$container.wrap('<div/>');
                this.cache.$fullWidthContainer = this.cache.$container.parent();
                this.cache.$fullWidthContainer.addClass('base-slider-container-full-width');

                //Sets the width of the container with full width
                var width = this.options.width || this.options.value_distances*(this.options.max - this.options.min);

                this.cache.$fullWidthContainer.width( Math.ceil(pxToRem(width))+'rem' );


                this.cache.$fullWidthContainer.wrap('<div/>');
                this.cache.$outerContainer = this.cache.$fullWidthContainer.parent();
                this.cache.$outerContainer.addClass('base-slider-container-outer');

            }


            /****************************************************
            Append handles
            ****************************************************/
            if (this.options.isSingle)
                //Add single-handle
                this.handles.$single = $span('handle single', this.cache.$container);
            else {
                //Add from- and to-handle
                this.handles.$from = $span('handle from', this.cache.$container);
                this.handles.$to   = $span('handle to', this.cache.$container);
            }

            /****************************************************
            Append markers = small boxes over handler and at the ends
            ****************************************************/
            var _this = this,
                extraClassName = this.options.marker_frame ? 'frame' : '';

            //**************************************
            function createMarker( className, extraClassName ){
                var result = {};
                //Outer div
                result.$outer = $('<div/>')
                                    .addClass('marker-outer')
                                    .addClass(className)
                                    .appendTo(_this.cache.$container);
                //Inner div
                var $inner =
                        $('<div/>')
                            .addClass('marker')
                            .addClass(extraClassName)
                            .appendTo(result.$outer);
                result.$text =
                        $('<span/>')
                            .addClass('marker-text')
                            .addClass(className)
                            .addClass(extraClassName)
                            .appendTo($inner);

                return result;
            }
            //**************************************

            if (this.options.show_from_to) {
                this.markers.single = createMarker( 'single-from-to', extraClassName );
                if (this.options.isInterval){
                    this.markers.from = createMarker( 'single-from-to', extraClassName );
                    this.markers.to   = createMarker( 'single-from-to', extraClassName );
                }
            }

            if (this.options.show_min_max) {
                this.markers.handleMin = createMarker( 'min-max' );
                this.markers.handleMax = createMarker( 'min-max' );
            }

            /****************************************************
            Create the line and optional colors (XXLineColor)
            ****************************************************/
            this.cache.$bs = $span('bs', this.cache.$container);
            this.cache.$line = $span('line', this.cache.$bs).prop('tabindex', -1);
            if (this.options.lineBackgroundColor)
                this.cache.$line.css('background-color', this.options.lineBackgroundColor);

            //Create up to tree span with different colors of the line:
            //this.cache.$leftColorLine, this.cache.$centerColorLine, this.cache.$rightColorLine
            var _this = this;
            function appendLineColor( left, center, right ){
                var result;
                if (left)   result = _this.cache.$leftLineColor   = $span('line-color', _this.cache.$line);
                if (center) result = _this.cache.$centerLineColor = $span('line-color', _this.cache.$line);
                if (right)  result = _this.cache.$rightLineColor  = $span('line-color', _this.cache.$line);
                return result; //Only last added
            }

            //1. double-handle with impact- or reverse-impact-colors
            if (this.options.isInterval && this.options.showImpactLineColor){
                appendLineColor( true, true, true );
                this.setImpactLineColors();
            }
            else
                //2. Add static colors given by options.lineColors
                if (this.options.lineColors){
//TODO HER MANGLER
                }
                else
                    //3. Normal line-color to the left of handle (single) or between handles (double)
                    if (this.options.showLineColor)
                        appendLineColor( this.options.isSingle, this.options.isInterval, false )
                            .css('background-color', this.options.lineColor);


            /****************************************************
            Append grid with ticks and optional text-labels
            ****************************************************/
            if (this.options.grid)
                this.cache.$grid = $span('grid', this.cache.$container);


            if (this.options.has_pin)
                this.cache.$s_pin = $span('pin fa', this.cache.$container);

            //Adjust top-position if no marker is displayed
            if (!this.options.show_min_max && !this.options.show_from_to)
                this.cache.$container.addClass("no-marker");

            //Adjust top-position of first grid if tick must be on the handle
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
            this.$currentGridContainer = null;
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
            if (!this.options.clickable || this.options.fixed_handle)
                this.cache.$container.addClass("not-clickable");
        },

        /*******************************************************************
        remove
        *******************************************************************/
        remove: function () {
            var _this = this;
            //************************************************
            function offEvents( $elem, eventNames ){
                if (!$elem) return;
                $.each( eventNames.split(' '), function( index, eventName ){
                    $elem.off( eventName + ".irs_" + _this.plugin_count );
                });
            }
            //************************************************

            if (this.cache.$outerContainer){
                this.cache.$outerContainer.remove();
                this.cache.$outerContainer = null;
            }
            else {
                this.cache.$container.remove();
                this.cache.$container = null;
            }

            offEvents( this.cache.$body, "touchmove mousemove" );
            offEvents( this.cache.$win,   "touchend mouseup"   );

            //Unbind click on buttons
            var id, i, attrName, $btn;
            for (id in this.cache.buttons)
                for (i=0; i<this.options.buttons_attr.length; i++ ){
                    attrName = this.options.buttons_attr[i];
                    $btn = this.cache.buttons[id][attrName];
                    offEvents( $btn, 'mousedown mouseup mouseleave click' );
                }
        },


        /*******************************************************************
        bindEvents
        *******************************************************************/
        bindEvents: function () {
            var _this = this;
            //*******************************************************************
            function addEvents( $elem, eventNames, func, param ){
                if (!$elem) return;
                var func = param ? $.proxy( func, _this, param) : $.proxy( func, _this );

                $.each( eventNames.split(' '), function( index, eventName ){
                    $elem.on( eventName + ".irs_" + _this.plugin_count,  func );
                });
            }
            //*******************************************************************
            addEvents( this.cache.$body, "touchmove mousemove",  this.handleOnMouseMove );
            addEvents( this.cache.$win,  "touchend mouseup",     this.handleOnMouseUp   );

            if (this.options.clickable && !this.options.fixed_handle){
                var $elementList = [ this.cache.$line, this.cache.$leftColorLine, this.cache.$centerColorLine, this.cache.$rightColorLine, this.cache.$grid ],
                    _this = this;
                $.each( $elementList, function( index, $element ){
                    addEvents( $element, "touchstart mousedown", _this.sliderOnClick, "click" );
                });
            }

            //Add event to the handles
            if (this.options.fixed_handle)
                addEvents( this.cache.$fullWidthContainer, "touchstart mousedown", this.handleOnMouseDown, "single" );
            else
                addEvents( this.handles.$single, "touchstart mousedown", this.handleOnMouseDown, "single" );
            addEvents( this.handles.$from, "touchstart mousedown", this.handleOnMouseDown, "from" );
            addEvents( this.handles.$to,   "touchstart mousedown", this.handleOnMouseDown, "to" );

            if (this.options.mousewheel){
                //Add horizontal sliding with mousewheel
                if (this.options.fixed_handle)
                    addEvents( this.cache.$outerContainer, 'mousewheel', this.mousewheel );
                else
                    addEvents( this.cache.$container.parent(), 'mousewheel', this.mousewheel );
            }

            //Add keyboard events to theline
            addEvents( this.cache.$line, "keydown", this.key, "keyboard" );

            //Bind click on buttons
            var id, i, attrName, delta, $btn;
            for (id in this.cache.buttons)
                for (i=0; i<this.options.buttons_attr.length; i++ ){
                    attrName = this.options.buttons_attr[i];
                    delta = this.options.buttons_delta[i];

                    $btn = this.cache.buttons[id][attrName];
                    addEvents( $btn, 'mousedown',  this.startRepeatingClick                      );
                    addEvents( $btn, 'mouseup',    this.endRepeatingClick                        );
                    addEvents( $btn, 'mouseleave', this.endRepeatingClick,  true                 );
                    addEvents( $btn, 'click',      this.buttonClick,        {id:id, delta:delta} );

                    if ( $btn && $btn.autoclickWhilePressed && (Math.abs(delta) == 1) && (!$btn.data('auto-click-when-pressed-added')) ){
                        $btn.data('auto-click-when-pressed-added', true);
                        $btn.autoclickWhilePressed();
                    }
                }
        },

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
        setMarkerText
        Sets the text for markers{id] with value from values[id] or text
        *******************************************************************/
        setMarkerText: function ( id, text ){
            var value = this.values[id] ? this.values[id].value : 0;
            text = text || this.decorate(this._prettify(value))
            if (this.markers[id])
                this.markers[id].$text.html( text );
        },

        /*******************************************************************
        setMarkerLeft
        *******************************************************************/
        setMarkerLeft: function ( id, leftPercent ){
            leftPercent =   $.isNumeric(leftPercent) ?
                            leftPercent :
                            this.values[id] ?
                            this.values[id].getPercent() :
                            0;

            if (this.markers[id])
                this.markers[id].$outer.css('left', leftPercent+'%');
        },

        /*******************************************************************
        setMarkerTextAndLeft
        *******************************************************************/
        setMarkerTextAndLeft: function ( id ){
            this.setMarkerText( id );
            this.setMarkerLeft( id );
        },

        /*******************************************************************
        markersOverlapping
        *******************************************************************/
        markersOverlapping: function ( markerId1, markerId2 ){
            return  this.markers[markerId1] &&
                    this.markers[markerId2] &&
                    elementsOverlapping( this.markers[markerId1].$text, this.markers[markerId2].$text );
        },

        /*******************************************************************
        setMarkerHidden
        *******************************************************************/
        setMarkerHidden: function ( markerId, hidden ){
            if (this.markers[markerId])
                this.markers[markerId].$outer.css( 'visibility', !!hidden ? 'hidden' : 'visible' );
        },

        /*******************************************************************
        setMinMaxMarkers
        *******************************************************************/
        setMinMaxMarkers: function () {
            if (this.options && this.options.show_min_max){
                this.setMarkerTextAndLeft( 'handleMin' );
                this.setMarkerTextAndLeft( 'handleMax' );
            }
        },


        /*******************************************************************
        ********************************************************************
        SET VALUES (TO, FROM, PIN ETC.)
        ********************************************************************
        *******************************************************************/

        /*******************************************************************
        setAnyValue
        *******************************************************************/
        setAnyValue: function( id, value ){
            if (this.values[id]){
                this.values[id].setValue( value );

                this.target = "base";//HER eller = id;
                this.is_key = true;
                this.calc();
                this.force_redraw = true; //HER Nødvendig?
                this.drawHandles();
                this.onCallback();
            }
        },

        /*******************************************************************
        adjustValue
        Adjust value with respect to min, max, step, and step-offset
        *******************************************************************/
        adjustValue: function( value ){
            //Adjust with respect to min value and max value
            value = adjustToMinMax( value , this.coords.true_min, this.coords.true_max );

            //Adjust with respect to step and step_offset
            value = this.coords.true_min + this.options.step*Math.round( (value - this.coords.true_min)/this.options.step );

            return value;
        },

        /*******************************************************************
        setValue, setFromValue, setToValue
        *******************************************************************/
        setValue    : function( value ) { this.setAnyValue( 'single', value ); },
        setFromValue: function( value ) { this.setAnyValue( 'from',   value ); },
        setToValue  : function( value ) { this.setAnyValue( 'to',     value ); },

        /*******************************************************************
        setPin
        *******************************************************************/
        setPin: function( value, color, icon ) {
            if (!this.options.has_pin) return;
/* HER MANGLER
            if (value !== null)
                this.options.pin_value = adjustToMinMax(value, this.options.min, this.options.max );

            this.options.pin_color = color || this.options.pin_color || 'black';

            var oldIcon = this.options.pin_icon || '';
            this.options.pin_icon = icon || this.options.pin_icon || 'fa-map-marker';

            this.target = "base";
            this.calc(true);

            this.cache.$s_pin
                .css({
                    left : toFixed(this.coords.p_pin_value) + "%",
                    color: this.options.pin_color
                })
                .removeClass( oldIcon )
                .addClass( this.options.pin_icon );
*/
        },


        /*******************************************************************
        ********************************************************************
        CALLBACK
        ********************************************************************
        *******************************************************************/

        /*******************************************************************
        updateResult
        *******************************************************************/
        updateResult: function (id) {
            //idList = list of ids to update
            var idList = id ? [id] : 'min from single to max'.split(' '),
                _this = this;

            $.each( idList, function( index, id ){
                var resultId = id == 'single' ? 'value' : id; //Using result.value for single-slider
                if (_this.values[id]){
                    _this.result[resultId]           = _this.values[id].value;
                    _this.result[resultId+'Percent'] = _this.values[id].percent;
                }
            });
        },


        /*******************************************************************
        setResult - Set the value and percentValue from this.values[id] in the result-record
        *******************************************************************/
        setResult: function(id){
            if (this.values){

            }
        },

        /*******************************************************************
        adjustResult - adjust this.result before onStart, onChange,.. is called
        *******************************************************************/
        adjustResult: function(){
            //Nothing here but desencing class can overwrite it
        },

        /*******************************************************************
        onFunc
        *******************************************************************/
        onFunc: function( func ){
            this.adjustResult();
            if ($.isFunction(func))
                func.call(this, this.result);
        },

        /*******************************************************************
        onCallback
        *******************************************************************/
        onCallback: function(){
            this.lastResult = this.lastResult  || {};
            if (
                    this.options.callback &&
                    (typeof this.options.callback === "function") &&
                    (
                        (this.result.min   !== this.lastResult.min  ) ||
                        (this.result.max   !== this.lastResult.max  ) ||
                        (this.result.from  !== this.lastResult.from ) ||
                        (this.result.to    !== this.lastResult.to   ) ||
                        (this.result.value !== this.lastResult.value)
                    )
                ) {
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

        /*******************************************************************
        onStart
        *******************************************************************/
        onStart: function(){
            this.onCallback();
            this.onFunc(this.options.onStart);
        },

        /*******************************************************************
        onChange
        *******************************************************************/
        onChange: function(){
            //If it is dragging and no callback_on_dragging => set timeout to call callback after XX ms if the handle hasn't moved
            if (this.dragging && !this.options.callback_on_dragging && this.options.callback_delay){
                if (this.delayTimeout)
                    window.clearTimeout(this.delayTimeout);
                var _this = this;
                this.delayTimeout =
                    window.setTimeout(
                        function () { _this.onCallback(); },
                        this.options.callback_delay
                    );
            }

            if ( this.options.callback_on_dragging || (!this.is_repeating_click && !this.dragging) )
                this.onCallback();
            this.onFunc(this.options.onChange);
        },

        /*******************************************************************
        onFinish
        *******************************************************************/
        onFinish: function(){
            if (this.delayTimeout)
                window.clearTimeout(this.delayTimeout);

            if (!this.is_repeating_click)
                this.onCallback();
            this.onFunc(this.options.onFinish);
        },

        /*******************************************************************
        onUpdate
        *******************************************************************/
        onUpdate: function(){
            this.onFunc(this.options.onUpdate);
        },


        /*******************************************************************
        ********************************************************************
        EVENTS
        ********************************************************************
        *******************************************************************/

        /*******************************************************************
        onFontSizeChange
        Called when the font-size of the browser is changed
        *******************************************************************/
        onFontSizeChange: function( event, fontSize ){
            onFontSizeChange( event, fontSize );
            if (this.htmlFontSize != htmlFontSize){
                this.htmlFontSize = htmlFontSize;
                this.update('onFontSizeChange');
            }

        },

        /*******************************************************************
        buttonClick MANGLER: skal bruge this.values[id].value
        *******************************************************************/
        buttonClick: function (options){
/* HER MANGLER
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
*/
        },

        /*******************************************************************
        startRepeatingClick
        *******************************************************************/
        startRepeatingClick: function () {
            this.is_repeating_click = true;
        },

        /*******************************************************************
        endRepeatingClick
        *******************************************************************/
        endRepeatingClick: function (callback) {
            this.is_repeating_click = false;
            if (callback)
                this.onCallback();
        },

        /*******************************************************************
        textClick - click on text-label MANGLER: skal bruge this.values[id]
        *******************************************************************/
        textClick: function( e ){
/* HER MANGLER
            var value = NaN,
                elem = e.target.parentNode;
            while (window.isNaN(value) && !!elem){
                value = parseFloat( elem.getAttribute('data-base-slider-value') );
                elem = elem.parentNode;
            }

            if (!window.isNaN(value)){
                if (!this.options.isInterval)
                    this.setValue( value );
                else
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
            }
            e.stopPropagation();
*/
        },

        /*******************************************************************
        key
        Event keydown
        *******************************************************************/
        key: function (target, e) {
            if (this.current_plugin !== this.plugin_count || e.altKey || e.metaKey) return;

            var options;

            switch (e.which) {
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

            options.event = e;

            if (options.delta)
                return this._moveByKeyboardOrMouseWheel( options );
        },

        /*******************************************************************
        mousewheel
        *******************************************************************/
        mousewheel: function( e, delta ){
            return this._moveByKeyboardOrMouseWheel({
                event         : e,
                delta         : 1,
                shiftDelta    : 2,
                ctrlShiftDelta: 3,
                sign          : delta

            });
        },

        /*******************************************************************
        _moveByKeyboardOrMouseWheel
        options = { sign, delta, shiftDelta, ctrlShiftDelta, event }
        *******************************************************************/
        _moveByKeyboardOrMouseWheel: function( options ){
            /*
            Setting delta:
                +/-  1: step = this.options.step
                +/-  2: step = this.options.keyboard_shift_step_factor * this.options.step
                +/-  3: step = this.options.keyboard_page_step_factor * this.options.step
                +/- 99: To the end/start
            */
            var delta = options.delta;

            //If shift XOR ctrl is pressed..
            if ((options.event.ctrlKey && !options.event.shiftKey) || (!options.event.ctrlKey && options.event.shiftKey))
                delta = options.shiftDelta || delta;

            //If shift AND ctrl is pressed..
            if (options.event.ctrlKey && options.event.shiftKey)
                delta = options.ctrlShiftDelta || options.shiftDelta || delta;

            delta = options.sign*delta;

console.log('HER', delta);
//HER MANGLER: Skal ikke bruge this.options eller this.result, men this.values
            //If the slider has two handle (this.options.isInterval == true) both handles are moved euqal distance to keep the distance between them constant

            //oldValue = original value depending on type and direction
            var oldValue =  (this.options.isSingle || (delta < 0)) ? this.result.from : this.result.to,
                newValue;
            switch (delta){
                case -99: newValue = this.options.min; break;
                case  99: newValue = this.options.max; break;
                case  +1: newValue = oldValue + this.options.step; break;
                case  -1: newValue = oldValue - this.options.step; break;
                case  +2: newValue = oldValue + this.options.keyboard_shift_step_factor * this.options.step; break;
                case  -2: newValue = oldValue - this.options.keyboard_shift_step_factor * this.options.step; break;
                case  +3: newValue = oldValue + this.options.keyboard_page_step_factor * this.options.step; break;
                case  -3: newValue = oldValue - this.options.keyboard_page_step_factor * this.options.step; break;
            }
            if (this.options.isSingle)
                this.setFromValue( newValue );
            else {
                //Adjust newValue to range
                newValue = this.adjustValue( newValue );

                //Find delta-value
                var deltaValue = newValue - oldValue;
                if (delta > 0){
                    this.setToValue( newValue );
                    this.setFromValue( this.result.from + deltaValue );
                }
                else {
                    this.setFromValue( newValue );
                    this.setToValue( this.result.to + deltaValue );
                }
            }

            event.preventDefault();
            return true;
        },


        /*******************************************************************
        handleOnMouseDown
        When any of the handle is 'touch'
        Is equal to 'start-dragging'
        *******************************************************************/
        handleOnMouseDown: function (target, e) {
//console.log('handleOnMouseDown');
            e.preventDefault();
            if (e.button === 2) return;

            this.current_plugin = this.plugin_count;
            this.target = target;
            this.is_active = true;
            this.dragging = true;

            var x = getEventLeft(e);

            this.coords.x_gap = pxToRem(this.cache.$bs.offset().left);
            this.coords.x_pointer = pxToRem(x) - this.coords.x_gap;
            this.calcPointer();



            //Save the initial different between the handle left-position and the mouse-position
            this.coords.mouseOffsetP = this.coords.p_pointer - this.values[target].percent;

            switch (target) {
                case "single":
                    if (this.options.fixed_handle)
                        //Save initial mouse position to calc reverse mouse movment
                        this.coords.x_start = x;
                    break;

                case "from":
                    this.handles.$from.addClass("state_hover type_last");
                    this.handles.$to.removeClass("type_last");
                    break;

                case "to":
                    this.handles.$to.addClass("state_hover type_last");
                    this.handles.$from.removeClass("type_last");
                    break;
            }

            this.cache.$line.trigger("focus");
        },

        /*******************************************************************
        handleOnMouseUp
        *******************************************************************/
        handleOnMouseUp: function (e) {
//console.log('handleOnMouseUp');
            if (!this.is_active || (this.current_plugin !== this.plugin_count))
                return;

            this.is_active = false;

            if ($.contains(this.cache.$container[0], e.target) || this.dragging)
                this.onFinish();

            this.cache.$container.find(".state_hover").removeClass("state_hover");
            this.force_redraw = true;
            this.dragging = false;
        },

        /*******************************************************************
        handleOnMouseMove
        Called when a handle is moved/dragged
        *******************************************************************/
        handleOnMouseMove: function (e) {
//console.log('handleOnMouseMove');
            if (!this.dragging) return;

            var x = getEventLeft(e);

            if (this.options.fixed_handle)
                //Convert direction of mouse moving
                x = this.coords.x_start - (x - this.coords.x_start);

            this.coords.x_pointer = pxToRem(x) - this.coords.x_gap;

            this.calc();

            this.drawHandles();
        },


        /*******************************************************************
        sliderOnClick
        Called when click/mouse-down on the slider (line and grid)
        *******************************************************************/
        sliderOnClick: function (target, e) {
//console.log('sliderOnClick');
            e.preventDefault();
            if (e.button === 2) return;

            this.current_plugin = this.plugin_count;
            this.target = target;
            this.is_click = true;
            this.coords.x_gap = pxToRem(this.cache.$bs.offset().left);
            this.coords.x_pointer = pxToRem( getEventLeft(e) ) - this.coords.x_gap;

            this.force_redraw = true;
            this.calc(true);
            this.drawHandles();
            this.cache.$line.trigger("focus");
        },


        /*******************************************************************
        ********************************************************************
        CALCULATIONS
        ********************************************************************
        *******************************************************************/

        /*******************************************************************
        getContainerWidthRem
        *******************************************************************/
        getContainerWidthRem: function(){
            var result = innerWidthRem( this.cache.$container );
            this.coords.containerWidthRem = result ? result : this.coords.containerWidthRem;
        },

        /*******************************************************************
        calc
        *******************************************************************/
        calc: function (update) {
            if (!this.options) return;
            if (update) {
                this.getContainerWidthRem();
                if (this.options.fixed_handle)
                    this.coords.outerContainerWidthRem = innerWidthRem(this.cache.$outerContainer);
            }

            if (!this.coords.containerWidthRem) return;

            this.calcPointer();
            var real_x = toFixed(this.coords.p_pointer - this.coords.mouseOffsetP);

            if (this.target === "click") {
                real_x = this.coords.p_pointer;
                this.target = this.getNearestHandle(real_x);
            }

            real_x = adjustToMinMax( real_x, 0, 100 );

            switch (this.target) {
                case "base":
/*HER MANGLER
                    if (this.options.has_pin)
                        this.coords.p_pin_value =
                            this.checkDiapason((this.options.pin_value - this.options.min) / w, this.options.min, this.options.max);
*/
                    this.target = null;

                    break;

                case "single":
                        this.values.single.setPercent( real_x );
                    break;

                case "from":
                    this.values.from.setPercent( real_x );
                    break;

                case "to":
                    this.values.to.setPercent( real_x );
                    break;
            }

            if (this.options.isSingle) {
//HER                this.result.from_percent = this.coords.p_single;
//HER                this.result.from = this.calcReal(this.coords.p_single);

/* HER TEST
                this.result.value        = this.values.single.value;
                this.result.valuePercent = this.values.single.percent;
*/
            }

            else {
//HER                this.result.from_percent = this.coords.p_from;
//HER                this.result.from = this.calcReal(this.coords.p_from);
//HER                this.result.to_percent = this.coords.p_to;
//HER                this.result.to = this.calcReal(this.coords.p_to);
//HER                this.result.from        = this.values.from.value;
//HER                this.result.fromPercent = this.values.from.percent;
//HER                this.result.to          = this.values.to.value;
//HER                this.result.toPercent   = this.values.to.percent;
            }
            this.updateResult();// this.target );

        }, //end of calc()

        /*******************************************************************
        calcPointer
        *******************************************************************/
        calcPointer: function () {
            if (!this.coords.containerWidthRem) {
                this.coords.p_pointer = 0;
                return;
            }
            this.coords.x_pointer = adjustToMinMax(this.coords.x_pointer, 0, this.coords.containerWidthRem);
            this.coords.p_pointer = toFixed(this.coords.x_pointer / this.coords.containerWidthRem * 100);
        },

        /*******************************************************************
        getNearestHandle
        Return the name of the nearest handler given the position valueP
        *******************************************************************/
        getNearestHandle: function (percent) {
            if (this.options.isSingle)
                return "single";

            //Return the handle nearest to the center between from- and to-handler
            return percent >= 0.5*(this.values.from.percent + this.values.to.percent) ? "to" : "from";
        },


        /*******************************************************************
        ********************************************************************
        DRAWINGS
        ********************************************************************
        *******************************************************************/

        /*******************************************************************
        drawHandles
        *******************************************************************/
        drawHandles: function () {
            //***********************************************
            function setLeftAndWidth( $elem, left, width ){
                if (!$elem) return;
                var css = {};
                if (left !== null)
                    css.left = toFixed(left) + (left ? '%' : '');
                if (width)// !== null)
                    css.width = toFixed(width) + (width ? '%' : '');
                $elem.css( css );
            }
            //***********************************************
//HER console.log('drawHandles', this.force_redraw );

            this.getContainerWidthRem();
            if (!this.coords.containerWidthRem) return;

            if (this.coords.containerWidthRem !== this.coords.old_containerWidthRem) {
                this.target = "base";
                this.is_resize = true;
            }

            if (this.coords.containerWidthRem !== this.coords.old_containerWidthRem || this.force_redraw) {
                this.setMinMaxMarkers();
                this.calc(true);
                this.force_redraw = true;
                this.coords.old_containerWidthRem = this.coords.containerWidthRem;
            }

            if (!this.coords.containerWidthRem) return;

            if (!this.dragging && !this.force_redraw && !this.is_key) return;



            /*****************************************************
            Adjust left-position and width of all lineColor-elements (if any)
            *****************************************************/
            if (this.options.isSingle) {
                var singlePercent = this.values.single.getPercent();
                setLeftAndWidth( this.cache.$leftLineColor,  null, singlePercent );
                setLeftAndWidth( this.cache.$rightLineColor, singlePercent, 100 - singlePercent );
            }
            else {
                var fromPercent = this.values.from.getPercent(),
                    toPercent   = this.values.to.getPercent();
                setLeftAndWidth( this.cache.$leftLineColor,   null,        fromPercent             );
                setLeftAndWidth( this.cache.$centerLineColor, fromPercent, toPercent - fromPercent );
                setLeftAndWidth( this.cache.$rightLineColor,  toPercent,   100 - toPercent         );
            }

            /*****************************************************
            Set position, color and class of pin (if any)
            *****************************************************/
/* HER MANGLER
            if (this.options.has_pin)
                this.cache.$s_pin
                    .css({
                        "left" : toFixed(this.coords.p_pin_value) + "%",
                        "color": this.options.pin_color
                    })
                    .addClass( this.options.pin_icon );
*/
            /*****************************************************
            Set position of handles
            *****************************************************/
            if (this.options.isSingle) {
                setLeftAndWidth( this.handles.$single, this.values.single.getPercent() );
                if (this.options.fixed_handle){
                    //Keep the handle centered in container
                    var containerLeft =
                        -1.0 * this.coords.containerWidthRem * this.values.single.percent/100 +
                         0.5 * this.coords.outerContainerWidthRem;
                    this.cache.$container.css('left', toFixed(containerLeft) + 'rem');
                }
            }
            else {
                setLeftAndWidth( this.handles.$from, this.values.from.getPercent() );
                setLeftAndWidth( this.handles.$to,   this.values.to.getPercent()   );
            }
            /*****************************************************
            Update contents and position of markers
            *****************************************************/
            if (this.options.isSingle) {
                //Update content and position of single-marker
                this.setMarkerTextAndLeft( 'single' );

                if (this.options.show_min_max){
                    //Hide min- and/or max-marker if they are overlapped by single-marker
                    this.setMarkerHidden( 'handleMin', this.markersOverlapping('handleMin', 'single') );
                    this.setMarkerHidden( 'handleMax', this.markersOverlapping('handleMax', 'single') );
                }
            }
            else {
                //Update content and posiiton of single-marker.
                //options.decorate_both set if both from-value and to-value is decorated individual
                var fromValue = this.values.from.value,
                    toValue   = this.values.to.value;
                if (fromValue == toValue)
                    this.setMarkerText( 'single' ); //HER, this.decorate(this._prettify(this.result.from)) );
                else
                    this.setMarkerText( 'single',
                        this.options.decorate_both
                            ? this.decorate(this._prettify(fromValue)) + this.options.values_separator + this.decorate(this._prettify(toValue))
                            : this.decorate( this._prettify(fromValue) + this.options.values_separator + this._prettify(toValue) )
                    )

                this.setMarkerLeft('single', ( this.values.from.getPercent() + this.values.to.getPercent() )/2 );

                //Update content of from- and to-marker
                this.setMarkerTextAndLeft('from' );
                this.setMarkerTextAndLeft('to' );

                //If from- and to-marker is overlapping => show single-marker instead
                var fromAndToOverlapping = this.markersOverlapping('from', 'to');
                this.setMarkerHidden( 'from',    fromAndToOverlapping );
                this.setMarkerHidden( 'to',      fromAndToOverlapping );
                this.setMarkerHidden( 'single', !fromAndToOverlapping );

                if (this.options.show_min_max){
                    //Hide min- and/or max-marker if they are overlapped by the visible marker(s)
                    this.setMarkerHidden( 'handleMin', this.markersOverlapping('handleMin', fromAndToOverlapping ? 'single' : 'from') );
                    this.setMarkerHidden( 'handleMax', this.markersOverlapping('handleMax', fromAndToOverlapping ? 'single' : 'to'  ) );
                }
            }

            /*****************************************************
            Callback and reset
            *****************************************************/
            if (!this.is_resize && !this.is_update && !this.is_start)
                this.onChange();

            if (this.is_key || this.is_click)
                this.onFinish();

            this.is_update = false;
            this.is_resize = false;
            this.is_start = false;
            this.is_key = false;
            this.is_click = false;
            this.force_redraw = false;
        },


        /*******************************************************************
        ********************************************************************
        SERVICE METHODS
        ********************************************************************
        *******************************************************************/

        /*******************************************************************
        toggleInput
        *******************************************************************/
        toggleInput: function () {
            this.cache.$input.toggleClass("hidden-input");
        },

        /*******************************************************************
        calcPercent
        *******************************************************************/
        calcPercent: function (num) {
            return toFixed( 100 * (num - this.options.min) / (this.options.max - this.options.min) );
        },

        /*******************************************************************
        calcReal
        *******************************************************************/
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
                return toFixed(number);
        },


        /*******************************************************************
        _prettify
        *******************************************************************/
        _prettify: function (num) {
            return $.isFunction(this.options.prettify) ? this.options.prettify(num) : num;
        },

        /*******************************************************************
        _prettify_text
        *******************************************************************/
        _prettify_text: function (text) {
            return $.isFunction(this.options.prettify_text) ? this.options.prettify_text(text) : text;
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
        Use appendGridContainer to create new grids. Use addGridText(text, left[, value]) to add a grid-text
        ********************************************************************
        *******************************************************************/

        /*******************************************************************
        appendGridContainer
        *******************************************************************/
        appendGridContainer: function(){
            this.getContainerWidthRem();
            if (this.$currentGridContainer){
                this.totalGridContainerTop += this.$currentGridContainer.height();
                this.$currentGridContainer =
                    $('<span class="grid"></span>').insertAfter( this.$currentGridContainer );
                this.$currentGridContainer.css('top', pxToRem( this.totalGridContainerTop, true) );
            }
            else {
                this.$currentGridContainer = this.cache.$grid;
                this.totalGridContainerTop = this.$currentGridContainer.position().top;
            }
            this.cache.$grid = this.cache.$container.find(".grid");
            return this.$currentGridContainer;
        },


        /*******************************************************************
        appendTick
        *******************************************************************/
        appendTick: function( left, options ){
            if (!this.$currentGridContainer) return;

            options = $.extend( {minor: false, color: ''}, options );

            var result = document.createElement("span");
//            result.className = "grid-pol" + (options.minor ? ' minor' : '');
            result.className = "grid-pol" + (options.minor ? '' : ' major');
            result.style.left = left + '%';

            if (options.color)
                result.style.backgroundColor = options.color;

            this.currentGridContainer.appendChild( result );
            return result;

        },

        /*******************************************************************
        _valueToText
        *******************************************************************/
        _valueToText: function( value ){
            var result = this._prettify_text( value );
            return this.options.decorate_text ? this.decorate(result) : result;
        },

        /*******************************************************************
        appendText
        *******************************************************************/
        appendText: function( left, value, options ){
            if (!this.$currentGridContainer) return;

            options = $.extend( {color: ''}, options );

            var text = this._valueToText( value ),
                outer = document.createElement("div"),
                result = document.createElement("div"),
                className = 'grid-text';

            outer.className = 'grid-text-outer';
            outer.style.width = this.options.majorTickDistanceRem +'rem';
            outer.style.left  = left+'%';
            outer.appendChild(result);

            if (options.minor)
                className += ' minor';
            if (options.italic)
                className += ' italic';
            if (options.color)
                result.style.color = options.color;

            //Create inner-span with the text
            var inner = document.createElement("span"),
                innerClassName = 'grid-text-inner';
            inner.textContent = text;

            if (this.options.textColorRec[value]){
                var textOptions = this.options.textColorRec[value];

                innerClassName += ' frame';
                if (textOptions.className)
                    innerClassName += ' '+textOptions.className;
                if (textOptions.color)
                    inner.style.color = textOptions.color;
                if (textOptions.backgroundColor)
                    inner.style.backgroundColor = textOptions.backgroundColor;
            }

            inner.className = innerClassName;
            result.appendChild(inner);




            if (options.clickable){
                //Check if the value for the label is a selectable one
                options.clickable =
                    (this.options.step == 1) ||
                    ( ((value - this.options.step_offset) % this.options.step) === 0);
            }

            if (options.clickable && !this.options.disable && !this.options.read_only){
                value = options.click_value !== undefined ? options.click_value : value;

                outer.setAttribute('data-base-slider-value', value);
                result.addEventListener('click', $.proxy( this.textClick, this ));
                className += ' clickable';
            }

            result.className = className;
            this.currentGridContainer.appendChild( outer );
            return result;
        },


        /*******************************************************************
        getTextWidth
        Get width of value as text OR max width of all values in array of value
        *******************************************************************/
        getTextWidth: function( value, options ){
            var _this = this;
            if ($.isArray( value )){
                var html = '';
                $.each( value, function(index, one_value ){
                    html += _this._valueToText( one_value ) + '<br>';
                });
                return this.getDecorateTextWidth( html, options );
            }
            else
                return this.getDecorateTextWidth( this._valueToText( value ) , options );
        },

        /*******************************************************************
        getDecorateTextWidth
        *******************************************************************/
        getDecorateTextWidth: function( html, options, factor, floor ){
            var newClassName = 'grid-text';
            if (options){
                if (options.minor)
                    newClassName += ' minor';
                if (options.italic)
                    newClassName += ' italic';
            }
            if (this.textElement.className != newClassName )
                this.textElement.className = newClassName;
            this.textElement.innerHTML = html;

            var result = parseFloat( this.textElement.offsetWidth );
            if (factor)
                result = factor*result;
            if (floor)
                result = Math.floor(result);

            return pxToRem( result );
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
        preAppendGrid: function(){
            this.appendGridContainer();
            //The DOM-version of this.$currentGridContainer
            this.currentGridContainer = this.$currentGridContainer.get(0);

            //Create the grid outside the DOM
            //Save width in % and set in in px instead of %
            this.currentGridContainerWidth = this.currentGridContainer.style.width;
            this.$currentGridContainer.css('width', this.$currentGridContainer.width());
            this.$currentGridContainer.width( this.$currentGridContainer.width() );
            this.$currentGridContainerMarker = $('<div/>').insertAfter( this.$currentGridContainer );
            this.$currentGridContainer.detach();
        },
        postAppendGrid: function(){
            //Insert the created grid into the DOM
            this.$currentGridContainer.insertBefore( this.$currentGridContainerMarker );
            this.$currentGridContainer.css('width', this.currentGridContainerWidth );
            this.$currentGridContainerMarker.remove();
        },

        /*******************************************************************
        _appendStandardGrid
        *******************************************************************/
        _appendStandardGrid: function ( textOptions, tickOptions ) {
            this.preAppendGrid();

            var o = this.options,
                gridContainerWidth = outerWidthRem(this.cache.$grid),
                gridDistanceIndex = 0,
                value = o.min,
                maxTextWidth = 0,
                valueP = 0,
                valueOffset;
            o.gridDistanceStep = o.gridDistances[gridDistanceIndex]; // = number of steps between each tick
            o.stepRem = o.step*gridContainerWidth/o.total  / o.major_ticks_factor;

            textOptions = $.extend( {clickable: this.options.clickable}, textOptions || {}  );

            tickOptions = tickOptions || {};


            //Increse grid-distance until the space between two ticks are more than 4px
            while ( (o.stepRem*o.gridDistanceStep) <= pxToRem(4)){
                gridDistanceIndex++;
                if (gridDistanceIndex < o.gridDistances.length)
                  o.gridDistanceStep = o.gridDistances[gridDistanceIndex];
                else
                    o.gridDistanceStep = o.gridDistanceStep*2;
            }
            o.tickDistanceNum = o.gridDistanceStep*o.step;    //The numerical distance between each ticks
            o.tickDistanceRem = o.gridDistanceStep*o.stepRem; //The rem distance between each ticks

            //Find widest text/label
            value = o.min;
            var valueList = [];
            while (value <= o.max){
                //if value corrected by o.major_ticks_offset and o.major_ticks_factor is a DIV of the tick distance => calculate the width of the tick
                if ((value - o.major_ticks_offset)*o.major_ticks_factor % o.tickDistanceNum === 0)
                    valueList.push( value );
                value += 1;
            }
            maxTextWidth = this.getTextWidth( valueList ) + pxToRem(6); //Adding min space between text/labels


            var _major_ticks = o.major_ticks;
            if (!_major_ticks){
                //Calculate automatic distances between major ticks
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
            o.majorTickDistanceRem = o.tickDistanceRem*_major_ticks;

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
                        if (o.show_minor_ticks)
                            //Add minor tick
                            this.appendTick( valueP, { minor:true } );
                }
                value += 1;
                valueP += o.oneP;
            }

            if (this.options.grid_colors)
                this.appendGridColors( this.options.grid_colors );

            this.postAppendGrid();
        },

        /*******************************************************************
        addGridColor
        *******************************************************************/
        appendGridColors: function( gridColors ){
            var fromValue,
                toValue  = this.options.min,
                i,
                gridColor,
                percentFactor = 100 / (this.options.max - this.options.min);


            for (i=0; i<gridColors.length; i++ ){
                gridColor = gridColors[i];
                if ( (gridColor.value === null) || (gridColor.value < this.options.min) || (gridColor.value > this.options.max) ){
                    //add triangle to the left or right
                    var $span = $('<span/>')
                                    .addClass( 'grid-color')
                                    .appendTo( this.$currentGridContainer );
                    if (gridColor.value > this.options.max)
                        $span
                            .addClass('gt_max')
                            .css('border-left-color', gridColor.color);
                    else
                        $span
                            .addClass('lt_min')
                            .css('border-right-color', gridColor.color);
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
                        .appendTo( this.$currentGridContainer );
                }
            }
        },


        /*******************************************************************
        ********************************************************************
        PUBLIC METHODS
        ********************************************************************
        *******************************************************************/

        /*******************************************************************
        update
        *******************************************************************/
        update: function (options) {

            if (!this.input) return;

            this.is_update = true;

            //Save result in options
            this.updateResult();
            this.options.value = this.result.value;
            this.options.from  = this.result.from;
            this.options.to    = this.result.to;


            this.options = $.extend(this.options, options);

            this.toggleInput();
            this.remove();
            this.init();

            this.onUpdate();
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
