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
