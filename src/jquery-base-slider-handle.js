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
