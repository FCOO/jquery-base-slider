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
        rem     : The value converted to rem
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

        getRem: function( inclUnit ){
            return toFixed( this.rem ) + (inclUnit ? 'rem' : 0);
        }

    };


    ns.SliderValue = SliderValue;
    ns.sliderValue = function( options ){
        return new ns.SliderValue( options );
    };

}(this/*, document*/));
