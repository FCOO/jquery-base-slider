/****************************************************************************
	jquery-base-slider, Description from README.md

	(c) 2015, Niels Holt

	https://github.com/NielsHolt/jquery-base-slider
	https://github.com/NielsHolt

USING
	dreamerslab/jquery.actual - https://github.com/dreamerslab/jquery.actual
	autoclickWhilePressed from https://github.com/silviubogan/jquery-autoclick-while-pressed - Auto-repeat the buttons on-click-function


****************************************************************************/
;(function ($, window, document, undefined) {
	"use strict";

	//Original irs.slider - with modifications
	
	var plugin_count = 0;

  // Template
	var base_html =
		'<span class="irs">' +
			'<span class="irs-line" tabindex="-1">'+
				'<span class="irs-line-left"></span>'+
			'</span>' +
			'<span class="irs-min">0</span>'+
			'<span class="irs-max">1</span>' +
			'<span class="irs-from">0</span>'+
			'<span class="irs-to">0</span>'+
			'<span class="irs-single">0</span>' +
		'</span>' +
		'<span class="irs-grid"></span>' + 
		'<span class="irs-bar"></span>';

	var single_html =
		'<span class="irs-slider single"></span>';

	var double_html =
		'<span class="irs-slider from"></span>' +
		'<span class="irs-slider to"></span>';

	var disable_html =
		'<span class="irs-disable-mask"></span>';

  // Core
	var BaseSlider = function (input, options, plugin_count) {
		this.VERSION = "2.0.6";
		this.input = input;
		this.plugin_count = plugin_count;
		this.current_plugin = 0;
		this.old_from = 0;
		this.old_to = 0;
		this.raf_id = null;
		this.dragging = false;
		this.force_redraw = false;
		this.is_key = false;
		this.is_update = false;
		this.is_start = true;
		this.is_active = false;
		this.is_resize = false;
		this.is_click = false;
		this.is_repeating_click = false;

		this.$cache = {
			win: $(window),
			body: $(document.body),
			input: $(input),
			cont: null,
			rs: null,
			min: null,
			max: null,
			from: null,
			to: null,
			single: null,
			bar: null,
			line: null,
			s_single: null,
			s_from: null,
			s_to: null,
			grid: null,
			grid_labels: [],
			buttons: { 
				from: {}, 
				to	: {} 
			}
		};
	
		// get config data attributes
		var $inp = this.$cache.input;
		var data = {
			type: $inp.data("type"),
	
			min: $inp.data("min"),
			max: $inp.data("max"),
			from: $inp.data("from"),
			to: $inp.data("to"),
			step: $inp.data("step"),
	
			min_interval: $inp.data("minInterval"),
			max_interval: $inp.data("maxInterval"),
	
			from_fixed: $inp.data("fromFixed"),
			from_min: $inp.data("fromMin"),
			from_max: $inp.data("fromMax"),
	
			to_fixed: $inp.data("toFixed"),
			to_min: $inp.data("toMin"),
			to_max: $inp.data("toMax"),
	
			marker_frame: $inp.data("markerFrame"),
	
			keyboard_step: $inp.data("keyboardStep"),
	
			grid: $inp.data("grid"),
			grid_num: $inp.data("gridNum"),
	
			hide_min_max: $inp.data("hideMinMax"),
			hide_from_to: $inp.data("hideFromTo"),
	
			prefix: $inp.data("prefix"),
			postfix: $inp.data("postfix"),
			max_postfix: $inp.data("maxPostfix"),
			decorate_both: $inp.data("decorateBoth"),
			values_separator: $inp.data("valuesSeparator"),
	
			disable: $inp.data("disable")
		};
		options = $.extend(data, options);
	
		// get from and to out of input
		var val = $inp.prop("value");
		if (val) {
			val = val.split(";");
			if (val[0] && val[0] == +val[0]) {
				val[0] = +val[0];
			}
			if (val[1] && val[1] == +val[1]) {
				val[1] = +val[1];
			}
	
			data.from = val[0] && +val[0];
			data.to = val[1] && +val[1];
		}
	
		// get config from options
		this.options = $.extend({
			type: "single",
			isInterval: (options.type == 'double'),

			min: 10,
			max: 100,
			from: null,
			to: null,
			step: 1,
	
			min_interval: 0,
			max_interval: 0,
	
			p_values: [],
	
			from_fixed: false,
			from_min: null,
			from_max: null,
	
			to_fixed: false,
			to_min: null,
			to_max: null,
	
			prettify: null,
	
			marker_frame: false,
	
			show_impact_line: false,
			callback_on_dragging: true,

			keyboard_step: 5,
	
			grid: false,
			grid_num: 4,
	
			hide_min_max: true,
			hide_from_to: false,
	
			prefix: "",
			postfix: "",
			max_postfix: "",
			decorate_both: true,
			values_separator: " - ",
	
			disable: false,

			buttons_attr	: ['firstBtn', 'previousBtn', 'nowBtn', 'nextBtn', 'lastBtn'],
			buttons_delta	: [-99, -1, 0, +1, +99],
			buttons				: {from: {}, to: {} },

			onStart: null,
			onChange: null,
			onFinish: null,
			onUpdate: null
		}, options);
	
		this.validate();
	
		this.result = {
			input: this.$cache.input,
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
	
			// grid
			grid_gap: 0,
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

	BaseSlider.prototype = {
		init: function (is_update) {
			this.coords.p_step = this.options.step / ((this.options.max - this.options.min) / 100);
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
			var container_html = '<span class="irs js-irs-' + this.plugin_count + '"></span>';
			this.$cache.input.before(container_html);
			this.$cache.input.prop("readonly", true);
			this.$cache.cont = this.$cache.input.prev();
			this.result.slider = this.$cache.cont;

			this.$cache.cont.html(base_html);
			this.$cache.rs = this.$cache.cont.find(".irs");
			this.$cache.min = this.$cache.cont.find(".irs-min");
			this.$cache.max = this.$cache.cont.find(".irs-max");
			this.$cache.from = this.$cache.cont.find(".irs-from");
			this.$cache.to = this.$cache.cont.find(".irs-to");
			this.$cache.single = this.$cache.cont.find(".irs-single");
			this.$cache.bar = this.$cache.cont.find(".irs-bar");
			this.$cache.line = this.$cache.cont.find(".irs-line");
			this.$cache.lineLeft = this.$cache.cont.find(".irs-line-left");
			this.$cache.grid = this.$cache.cont.find(".irs-grid");

			if (this.options.type === "single") {
				this.$cache.cont.append(single_html);
				this.$cache.s_single = this.$cache.cont.find(".single");
				this.$cache.from[0].style.visibility = "hidden";
				this.$cache.to[0].style.visibility = "hidden";
				this.$cache.lineLeft.remove();
			} else {
				this.$cache.cont.append(double_html);
				this.$cache.s_from = this.$cache.cont.find(".from");
				this.$cache.s_to = this.$cache.cont.find(".to");
	
				if (this.options.show_impact_line)
					this.$cache.line.css('background-color', 'red');						
				else
					this.$cache.lineLeft.remove();

			}
			if (this.options.hide_from_to) {
				this.$cache.from[0].style.display = "none";
				this.$cache.to[0].style.display = "none";
				this.$cache.single[0].style.display = "none";
			}

			//Add class to set border and stick on to- from and current-label
			if (this.options.marker_frame)
				this.$cache.rs.addClass('marker-frame');

			//Adjust top-position if no marker is displayed
			if (this.options.hide_min_max && this.options.hide_from_to)
				this.$cache.cont.addClass("no-marker");

			//Adjust top-position of first grid if tick must be on the slider
			if (this.options.ticks_on_line)
				this.$cache.cont.addClass("ticks-on-line");


			//Append buttons
			function getButton( id ){ return $.type( id ) === 'string' ? $('#' +  id ) : id; }
			this.options.buttons.from = this.options.buttons.from || {};
			this.options.buttons.to		= this.options.buttons.to || {};
			for (var i=0; i<this.options.buttons_attr.length; i++ ){
				var attrName = this.options.buttons_attr[i];
				this.$cache.buttons.from[ attrName ]	= getButton( this.options.buttons.from[ attrName ] );
				this.$cache.buttons.to	[ attrName ]	= getButton( this.options.buttons.to	[ attrName ] );
			}
			
			//Append grid(s)
			this.currentGridContainer = null;
			if (this.options.grid){
				this.appendGrid();
				this.appendGrid();
				this.appendGrid();
			} else {
				this.$cache.grid.remove();
			}

			if (this.options.disable) {
				this.appendDisableMask();
				this.$cache.input[0].disabled = true;
			} else {
				this.$cache.cont.removeClass("irs-disabled");
				this.$cache.input[0].disabled = false;
				this.bindEvents();
			}
		},

		//appendDisableMask
		appendDisableMask: function () {
			this.$cache.cont.append(disable_html);
			this.$cache.cont.addClass("irs-disabled");
		},

		//remove
		remove: function () {
			this.$cache.cont.remove();
			this.$cache.cont = null;

			this.$cache.line.off("keydown.irs_" + this.plugin_count);

			this.$cache.body.off("touchmove.irs_" + this.plugin_count);
			this.$cache.body.off("mousemove.irs_" + this.plugin_count);

			this.$cache.win.off("touchend.irs_" + this.plugin_count);
			this.$cache.win.off("mouseup.irs_" + this.plugin_count);

			//Unbind click on buttons
			var id, i, attrName, $btn;
			for (id in this.$cache.buttons)
				for (i=0; i<this.options.buttons_attr.length; i++ ){
					attrName = this.options.buttons_attr[i];
					$btn = this.$cache.buttons[id][attrName];
					if ($btn)
					  $btn.off( 
							"mousedown.irs_" + this.plugin_count +
							" mouseup.irs_" + this.plugin_count +
							" mouseleave.irs_" + this.plugin_count +
							" click.irs_" + this.plugin_count
						);
				}


			this.$cache.grid_labels = [];

			window.cancelAnimationFrame(this.raf_id);
		},

		//bindEvents
		bindEvents: function () {
			this.$cache.body.on("touchmove.irs_" + this.plugin_count, this.pointerMove.bind(this));
			this.$cache.body.on("mousemove.irs_" + this.plugin_count, this.pointerMove.bind(this));

			this.$cache.win.on("touchend.irs_" + this.plugin_count, this.pointerUp.bind(this));
			this.$cache.win.on("mouseup.irs_" + this.plugin_count, this.pointerUp.bind(this));

			this.$cache.line.on("touchstart.irs_" + this.plugin_count, this.pointerClick.bind(this, "click"));
			this.$cache.line.on("mousedown.irs_" + this.plugin_count, this.pointerClick.bind(this, "click"));

			this.$cache.bar.on("touchstart.irs_" + this.plugin_count, this.pointerClick.bind(this, "click"));
			this.$cache.bar.on("mousedown.irs_" + this.plugin_count, this.pointerClick.bind(this, "click"));

			if (this.options.type === "single") {
				this.$cache.s_single.on("touchstart.irs_" + this.plugin_count, this.pointerDown.bind(this, "single"));
				this.$cache.s_single.on("mousedown.irs_" + this.plugin_count, this.pointerDown.bind(this, "single"));
			} else {
				this.$cache.s_from.on("touchstart.irs_" + this.plugin_count, this.pointerDown.bind(this, "from"));
				this.$cache.s_to.on("touchstart.irs_" + this.plugin_count, this.pointerDown.bind(this, "to"));
				this.$cache.s_from.on("mousedown.irs_" + this.plugin_count, this.pointerDown.bind(this, "from"));
				this.$cache.s_to.on("mousedown.irs_" + this.plugin_count, this.pointerDown.bind(this, "to"));
			}

			this.$cache.line.on("keydown.irs_" + this.plugin_count, this.key.bind(this, "keyboard"));

			//Bind click on buttons
			var id, i, attrName, delta, $btn;
			for (id in this.$cache.buttons)
				for (i=0; i<this.options.buttons_attr.length; i++ ){
					attrName = this.options.buttons_attr[i];
					delta = this.options.buttons_delta[i];

					$btn = this.$cache.buttons[id][attrName];
					
					if ($btn){
						$btn
							.on("mousedown.irs_" + this.plugin_count,		this.startRepeatingClick.bind(this)				)
							.on("mouseup.irs_" + this.plugin_count,			this.endRepeatingClick.bind(this)					) 
							.on("mouseleave.irs_" + this.plugin_count,	this.endRepeatingClick.bind(this, true)		) 
							.on("click.irs_" + this.plugin_count,				this.buttonClick.bind(this, {id:id, delta:delta}) ); 

						if ( $btn.autoclickWhilePressed && (Math.abs(delta) == 1) && (!$btn.data('auto-click-when-pressed-added')) )
							$btn.data('auto-click-when-pressed-added', true);
							$btn.autoclickWhilePressed();
					}
				}
		},


		//onFunc
		onFunc: function(func){	if (func && typeof func === "function") func(this.result); },

		//onCallback
		onCallback: function(){
			this.lastResult = this.lastResult  || {};
			if ( this.options.callback && typeof this.options.callback === "function" && ( this.result.min != this.lastResult.min || this.result.max != this.lastResult.max || this.result.from != this.lastResult.from || this.result.to != this.lastResult.to ) ) {			  
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
			if ( this.options.callback_on_dragging || (!this.is_repeating_click && !this.dragging) )
				this.onCallback();
			this.onFunc(this.options.onChange);
		},		 

		//onFinish
		onFinish: function(){
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
			  case	 0: newValue = 0; break;
				case -99: newValue = this.options.min; break;
				case  99: newValue = this.options.max; break;
				case  +1: newValue = newValue + 1; break;				
				case  -1: newValue = newValue - 1; break;				
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
			var value = $(e.target).data('irs-slider-value');
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

		
		//pointerMove
		pointerMove: function (e) {
			if (!this.dragging) {
				return;
			}

			var x = e.pageX || e.originalEvent.touches && e.originalEvent.touches[0].pageX;
			this.coords.x_pointer = x - this.coords.x_gap;

			this.calc();
			this.drawHandles(); 

		},

		//pointerUp
		pointerUp: function (e) {
			if (this.current_plugin !== this.plugin_count) {
				return;
			}

			if (this.is_active) {
				this.is_active = false;
			} else {
				return;
			}

			if ($.contains(this.$cache.cont[0], e.target) || this.dragging) {
				this.onFinish();
			}

			this.$cache.cont.find(".state_hover").removeClass("state_hover");

			this.force_redraw = true;
			this.dragging = false;
		},

		//pointerDown
		pointerDown: function (target, e) {
			e.preventDefault();
			var x = e.pageX || e.originalEvent.touches && e.originalEvent.touches[0].pageX;
			if (e.button === 2) {
				return;
			}
			this.current_plugin = this.plugin_count;
			this.target = target;
			this.is_active = true;
			this.dragging = true;

			this.coords.x_gap = this.$cache.rs.offset().left;
			this.coords.x_pointer = x - this.coords.x_gap;

			this.calcPointer();

			switch (target) {
				case "single":
					this.coords.p_gap = this.toFixed(this.coords.p_pointer - this.coords.p_single);
					break;
				case "from":
					this.coords.p_gap = this.toFixed(this.coords.p_pointer - this.coords.p_from);
					this.$cache.s_from.addClass("state_hover");
					this.$cache.s_from.addClass("type_last");
					this.$cache.s_to.removeClass("type_last");
					break;
				case "to":
					this.coords.p_gap = this.toFixed(this.coords.p_pointer - this.coords.p_to);
					this.$cache.s_to.addClass("state_hover");
					this.$cache.s_to.addClass("type_last");
					this.$cache.s_from.removeClass("type_last");
					break;
				case "both":
					this.coords.p_gap_left = this.toFixed(this.coords.p_pointer - this.coords.p_from);
					this.coords.p_gap_right = this.toFixed(this.coords.p_to - this.coords.p_pointer);
					this.$cache.s_to.removeClass("type_last");
					this.$cache.s_from.removeClass("type_last");
					break;
			}

			this.$cache.line.trigger("focus");
		},

		//pointerClick
		pointerClick: function (target, e) {
			e.preventDefault();
			var x = e.pageX || e.originalEvent.touches && e.originalEvent.touches[0].pageX;
			if (e.button === 2) {
				return;
			}
			this.current_plugin = this.plugin_count;
			this.target = target;
			this.is_click = true;
			this.coords.x_gap = this.$cache.rs.offset().left;
			this.coords.x_pointer = +(x - this.coords.x_gap).toFixed();

			this.force_redraw = true;
			this.calc(true);
			this.drawHandles(); 

			this.$cache.line.trigger("focus");
		},

		//key
		key: function (target, e) {
			if (this.current_plugin !== this.plugin_count || e.altKey || e.ctrlKey || e.shiftKey || e.metaKey) {
				return;
			}
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
			if (right) {
				p += this.options.keyboard_step;
			} else {
				p -= this.options.keyboard_step;
			}
			this.coords.x_pointer = this.toFixed(this.coords.w_rs / 100 * p);
			this.is_key = true;
			this.calc();
			
		},

		//setMinMax
		setMinMax: function () {
			if (!this.options) {
				return;
			}
			if (this.options.hide_min_max) {
				this.$cache.min[0].style.display = "none";
				this.$cache.max[0].style.display = "none";
				return;
			}
			this.$cache.min.html(this.decorate(this._prettify(this.options.min), this.options.min));
			this.$cache.max.html(this.decorate(this._prettify(this.options.max), this.options.max));

			this.labels.w_min = this.$cache.min.outerWidth(false);
			this.labels.w_max = this.$cache.max.outerWidth(false);
		},


		// =============================================================================================================
		// Calculations
		//setValue
		setValue: function( value ) { this.setFromValue( value ); },

		//setFromValue
		setFromValue: function( value ) { 
			value = Math.min( this.options.max, value );
			value = Math.max( this.options.min, value );
			if (this.options.isInterval)
			  value = Math.min( value, this.result.to );

			this.old_from = this.result.from;
			this.result.from = value;

			this.target = "base";
			this.is_key = true;
			this.calc();
			this.force_redraw = true;
			this.drawHandles(); 
		},

		//setToValue
		setToValue: function( value ) {
			value = Math.min( this.options.max, value );
			value = Math.max( value, this.result.from );

			this.old_to = this.result.to;
			this.result.to = value;

			this.target = "base";
			this.is_key = true;
			this.calc();
			this.force_redraw = true;
			this.drawHandles(); 
		},


		//calc
		calc: function (update) { 
			if (!this.options) {
				return;
			}
			if (update) { 
				this.coords.w_rs = this.$cache.rs.outerWidth(false);
				if (this.options.type === "single") {
					this.coords.w_handle = this.$cache.s_single.outerWidth(false);
				} else {
					this.coords.w_handle = this.$cache.s_from.outerWidth(false);
				}
			}
			if (!this.coords.w_rs) {
				return;
			}
			this.calcPointer();
			this.coords.p_handle = this.toFixed(this.coords.w_handle / this.coords.w_rs * 100);
			var real_width = 100 - this.coords.p_handle,
			real_x = this.toFixed(this.coords.p_pointer - this.coords.p_gap);

			if (this.target === "click") {
				real_x = this.toFixed(this.coords.p_pointer - (this.coords.p_handle / 2));
				this.target = this.chooseHandle(real_x);
			}

			if (real_x < 0) {
				real_x = 0;
			} else if (real_x > real_width) {
				real_x = real_width;
			}

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

					this.target = null;
					break;

				case "single":
					if (this.options.from_fixed) {
						break;
					}

					this.coords.p_single_real = this.calcWithStep(real_x / real_width * 100);
					this.coords.p_single_real = this.checkDiapason(this.coords.p_single_real, this.options.from_min, this.options.from_max);
					this.coords.p_single = this.toFixed(this.coords.p_single_real / 100 * real_width);
					break;

				case "from":
					if (this.options.from_fixed) {
						break;
					}
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
					if (this.options.to_fixed) {
						break;
					}

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

			if (this.options.type === "single") {
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
		},

		//calcPointer
		calcPointer: function () {
			if (!this.coords.w_rs) {
				this.coords.p_pointer = 0;
				return;
			}

			if (this.coords.x_pointer < 0 || isNaN(this.coords.x_pointer)  ) {
				this.coords.x_pointer = 0;
			} else if (this.coords.x_pointer > this.coords.w_rs) {
				this.coords.x_pointer = this.coords.w_rs;
			}

			this.coords.p_pointer = this.toFixed(this.coords.x_pointer / this.coords.w_rs * 100);
		},

		//chooseHandle
		chooseHandle: function (real_x) {
			if (this.options.type === "single") {
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
			if (!this.coords.w_rs) {
				return;
			}

			this.labels.p_min = this.labels.w_min / this.coords.w_rs * 100;
			this.labels.p_max = this.labels.w_max / this.coords.w_rs * 100;
		},

		//calcLabels
		calcLabels: function () {
			if (!this.coords.w_rs || this.options.hide_from_to) {
				return;
			}

			if (this.options.type === "single") {
				this.labels.w_single = this.$cache.single.outerWidth(false);
				this.labels.p_single = this.labels.w_single / this.coords.w_rs * 100;
				this.labels.p_single_left = this.coords.p_single + (this.coords.p_handle / 2) - (this.labels.p_single / 2);
				this.labels.p_single_left = this.checkEdges(this.labels.p_single_left, this.labels.p_single);

			} else {

				this.labels.w_from = this.$cache.from.outerWidth(false);
				this.labels.p_from = this.labels.w_from / this.coords.w_rs * 100;
				this.labels.p_from_left = this.coords.p_from + (this.coords.p_handle / 2) - (this.labels.p_from / 2);
				this.labels.p_from_left = this.toFixed(this.labels.p_from_left);
				this.labels.p_from_left = this.checkEdges(this.labels.p_from_left, this.labels.p_from);

				this.labels.w_to = this.$cache.to.outerWidth(false);
				this.labels.p_to = this.labels.w_to / this.coords.w_rs * 100;
				this.labels.p_to_left = this.coords.p_to + (this.coords.p_handle / 2) - (this.labels.p_to / 2);
				this.labels.p_to_left = this.toFixed(this.labels.p_to_left);
				this.labels.p_to_left = this.checkEdges(this.labels.p_to_left, this.labels.p_to);

				this.labels.w_single = this.$cache.single.outerWidth(false);
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
			this.coords.w_rs = this.$cache.rs.outerWidth(false);

			if (!this.coords.w_rs) {
				return;
			}
			if (this.coords.w_rs !== this.coords.w_rs_old) { 
				this.target = "base";
				this.is_resize = true;
			}

			if (this.coords.w_rs !== this.coords.w_rs_old || this.force_redraw) {
				this.setMinMax();
				this.calc(true);
				this.drawLabels();
				if (this.options.grid) {
					this.calcGridMargin();
				}
				this.force_redraw = true;
				this.coords.w_rs_old = this.coords.w_rs;
			}

			if (!this.coords.w_rs) {
				return;
			}

			if (!this.dragging && !this.force_redraw && !this.is_key) {
				return;
			}

			if (this.old_from !== this.result.from || this.old_to !== this.result.to || this.force_redraw || this.is_key) {

				this.drawLabels();

				this.$cache.bar[0].style.left = this.coords.p_bar_x + "%";
				this.$cache.bar[0].style.width = this.coords.p_bar_w + "%";

				if (this.options.type === "single") {
					this.$cache.s_single[0].style.left = this.coords.p_single + "%";
					this.$cache.single[0].style.left = this.labels.p_single_left + "%";

					this.$cache.input.prop("value", this.result.from);
					this.$cache.input.data("from", this.result.from);

				} else {
					this.$cache.s_from[0].style.left = this.coords.p_from + "%";
					this.$cache.s_to[0].style.left = this.coords.p_to + "%";

					if (this.$cache.lineLeft){
						this.$cache.lineLeft[0].style.left = 0;
						this.$cache.lineLeft[0].style.width = this.coords.p_bar_x + "%";
					}
	 
					if (this.old_from !== this.result.from || this.force_redraw) {
						this.$cache.from[0].style.left = this.labels.p_from_left + "%";
					}
					if (this.old_to !== this.result.to || this.force_redraw) {
						this.$cache.to[0].style.left = this.labels.p_to_left + "%";
					}

					this.$cache.single[0].style.left = this.labels.p_single_left + "%";
					this.$cache.input.prop("value", this.result.from + ";" + this.result.to);
					this.$cache.input.data("from", this.result.from);
					this.$cache.input.data("to", this.result.to);
				}

				if ((this.old_from !== this.result.from || this.old_to !== this.result.to) && !this.is_start) {
					this.$cache.input.trigger("change");
				}

				this.old_from = this.result.from;
				this.old_to = this.result.to;

				if (!this.is_resize && !this.is_update && !this.is_start) {
					this.onChange();
				}

				if (this.is_key || this.is_click) {
					this.onFinish();
				}

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
			if (!this.options) {
				return;
			}

			var text_single,
					text_from,
					text_to;

			if (this.options.hide_from_to) {
				return;
			}

			if (this.options.type === "single") {

				text_single = this.decorate(this._prettify(this.result.from), this.result.from);
				this.$cache.single.html(text_single);

				this.calcLabels();

				if (this.labels.p_single_left < this.labels.p_min + 1) {
					this.$cache.min[0].style.visibility = "hidden";
				} else {
					this.$cache.min[0].style.visibility = "visible";
				}

				if (this.labels.p_single_left + this.labels.p_single > 100 - this.labels.p_max - 1) {
					this.$cache.max[0].style.visibility = "hidden";
				} else {
					this.$cache.max[0].style.visibility = "visible";
				}

		 } else {

				if (this.options.decorate_both) {
					text_single = this.decorate(this._prettify(this.result.from));
					text_single += this.options.values_separator;
					text_single += this.decorate(this._prettify(this.result.to));
				} else {
					text_single = this.decorate(this._prettify(this.result.from) + this.options.values_separator + this._prettify(this.result.to), this.result.from);
				}
				text_from = this.decorate(this._prettify(this.result.from), this.result.from);
				text_to = this.decorate(this._prettify(this.result.to), this.result.to);

				this.$cache.single.html(text_single);
				this.$cache.from.html(text_from);
				this.$cache.to.html(text_to);

				this.calcLabels();

				var min = Math.min(this.labels.p_single_left, this.labels.p_from_left),
				single_left = this.labels.p_single_left + this.labels.p_single,
				to_left = this.labels.p_to_left + this.labels.p_to,
				max = Math.max(single_left, to_left);

				if (this.labels.p_from_left + this.labels.p_from >= this.labels.p_to_left) {
					this.$cache.from[0].style.visibility = "hidden";
					this.$cache.to[0].style.visibility = "hidden";
					this.$cache.single[0].style.visibility = "visible";

					if (this.result.from === this.result.to) {
						this.$cache.from[0].style.visibility = "visible";
						this.$cache.single[0].style.visibility = "hidden";
						max = to_left;
					} else {
						this.$cache.from[0].style.visibility = "hidden";
						this.$cache.single[0].style.visibility = "visible";
						max = Math.max(single_left, to_left);
					}
				} else {
					this.$cache.from[0].style.visibility = "visible";
					this.$cache.to[0].style.visibility = "visible";
					this.$cache.single[0].style.visibility = "hidden";
				}

				if (min < this.labels.p_min + 1) {
					this.$cache.min[0].style.visibility = "hidden";
				} else {
					this.$cache.min[0].style.visibility = "visible";
				}

				if (max > 100 - this.labels.p_max - 1) {
					this.$cache.max[0].style.visibility = "hidden";
				} else {
					this.$cache.max[0].style.visibility = "visible";
				}

			}
		}, //end of drawLabels


		// =============================================================================================================
		// Service methods

		//toggleInput
		toggleInput: function () {
			this.$cache.input.toggleClass("irs-hidden-input");
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

			if (string) {
				number = +number.toFixed(string.length);
			} else {
				number = number / this.options.step;
				number = number * this.options.step;
				number = +number.toFixed(0);
			}

			if (abs) {
				number -= abs;
			}

			if (number < this.options.min) {
				number = this.options.min;
			} else if (number > this.options.max) {
				number = this.options.max;
			}

			if (string) {
				return +number.toFixed(string.length);
			} else {
				return this.toFixed(number);
			}
		},

		//calcWithStep
		calcWithStep: function (percent) {
			var rounded = Math.round(percent / this.coords.p_step) * this.coords.p_step;
			if (rounded > 100)		{ rounded = 100; }
			if (percent === 100)	{ rounded = 100; }
			return this.toFixed(rounded);
		},

		//checkMinInterval
		checkMinInterval: function (p_current, p_next, type) {
			var o = this.options,
			current,
			next;

			if (!o.min_interval) {
				return p_current;
			}

			current = this.calcReal(p_current);
			next = this.calcReal(p_next);

			if (type === "from") {
				if (next - current < o.min_interval) {
					current = next - o.min_interval;
				}
			} else {
				if (current - next < o.min_interval) {
					current = next + o.min_interval;
				}
			}
			return this.calcPercent(current);
		},

		//checkMaxInterval
		checkMaxInterval: function (p_current, p_next, type) {
			var o = this.options,
			current,
			next;

			if (!o.max_interval) {
				return p_current;
			}

			current = this.calcReal(p_current);
			next = this.calcReal(p_next);

			if (type === "from") {
				if (next - current > o.max_interval) {
					current = next - o.max_interval;
				}
			} else {
				if (current - next > o.max_interval) {
					current = next + o.max_interval;
				}
			}

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

		//checkEdges
		checkEdges: function (left, width) {
			if (left < 0) {
				left = 0;
			} else if (left > 100 - width) {
				left = 100 - width;
			}

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

			if (typeof o.keyboard_step === "string") o.keyboard_step = +o.keyboard_step;
			if (typeof o.grid_num === "string") o.grid_num = +o.grid_num;

			if (o.max <= o.min) {
				if (o.min) {
					o.max = o.min * 2;
				} else {
					o.max = o.min + 1;
				}
				o.step = 1;
			}

			if (typeof o.from !== "number" || isNaN(o.from)) { o.from = o.min; }

			if (typeof o.to !== "number" || isNaN(o.from)) { o.to = o.max; }

			if (o.from < o.min || o.from > o.max) { o.from = o.min; }

			if (o.to > o.max || o.to < o.min) { o.to = o.max; }

			if (o.type === "double" && o.from > o.to) { o.from = o.to; }

			if (typeof o.step !== "number" || isNaN(o.step) || !o.step || o.step < 0) { o.step = 1; }

			if (typeof o.keyboard_step !== "number" || isNaN(o.keyboard_step) || !o.keyboard_step || o.keyboard_step < 0) { o.keyboard_step = 5; }

			if (o.from_min && o.from < o.from_min) { o.from = o.from_min; }

			if (o.from_max && o.from > o.from_max) { o.from = o.from_max; }

			if (o.to_min && o.to < o.to_min) { o.to = o.to_min; }

			if (o.to_max && o.from > o.to_max) { o.to = o.to_max; }

			if (r) {
				if (r.min !== o.min) {
					r.min = o.min;
				}

				if (r.max !== o.max) { r.max = o.max; }

				if (r.from < r.min || r.from > r.max) { r.from = o.from; }

				if (r.to < r.min || r.to > r.max) { r.to = o.to; }
			}

			if (typeof o.min_interval !== "number" || isNaN(o.min_interval) || !o.min_interval || o.min_interval < 0) { o.min_interval = 0; }

			if (typeof o.max_interval !== "number" || isNaN(o.max_interval) || !o.max_interval || o.max_interval < 0) { o.max_interval = 0; }

			if (o.min_interval && o.min_interval > o.max - o.min) { o.min_interval = o.max - o.min; }

			if (o.max_interval && o.max_interval > o.max - o.min) { o.max_interval = o.max - o.min; }

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
			this.coords.w_rs = this.$cache.rs.outerWidth(false);
			
			if (this.currentGridContainer){
				this.totalGridContainerTop += this.currentGridContainer.height();  
				this.currentGridContainer = 
					$('<span class="irs-grid"></span>').insertAfter( this.currentGridContainer );
				this.currentGridContainer.css('top', this.totalGridContainerTop+'px');
			}
			else {
				this.currentGridContainer = this.$cache.grid;
				this.totalGridContainerTop = this.currentGridContainer.position().top; 
			}
			this.$cache.grid = this.$cache.cont.find(".irs-grid"); 


			return this.currentGridContainer;
		},
		

		//appendTick
		appendTick: function( left, options ){
			if (!this.currentGridContainer){
				return;
			}
			options = $.extend( {small: false, color: ''}, options );
			var result = $('<span class="irs-grid-pol" style="left:' + left + '%"></span>');
			
			if (options.small)
				result.addClass('small');  
			if (options.color)
				result.css('background-color', options.color);  
			

			result.appendTo( this.currentGridContainer );
			return result;
		
		},

		//appendText
		appendText: function( left, text, options ){
			if (!this.currentGridContainer){
				return;
			}
			options = $.extend( {color: ''}, options );
			var result = $('<span class="irs-grid-text" style="background-color:none; left: ' + left + '%">' + text + '</span>');
			result.appendTo( this.currentGridContainer );

			//Center the label
			var textWidthPercent = result.outerWidth(false) / this.coords.w_rs * 100;

			result.css( 'margin-left', -textWidthPercent/2 + '%' );

			if (options.clickable){
				var value = options.click_value !== undefined ? options.click_value : parseFloat( text );
				result
					.data('irs-slider-value', value)
					.on("click.irs_" + this.plugin_count, this.textClick.bind(this) )
					.addClass('clickable');
			}
			if (options.small)
				result.addClass('small');
			if (options.italic)
				result.addClass('italic');
			if (options.color)
				result.css('color', options.color);

	
			return result;
		
		},

		
		//appendGrid
		appendGrid: function () { 
			if (!this.options.grid) {	return;	}

			var o = this.options,	i, z,
			total = o.max - o.min,
			big_num = o.grid_num,
			big_p = 0,
			big_w = 0,
			small_max = 4,
			local_small_max,
			small_p,
			small_w = 0,
			result;
		
			this.appendGridContainer();
			this.calcGridMargin();

			big_num = total / o.step;
			big_p = this.toFixed(o.step / (total / 100));

			if (big_num > 4) { small_max = 3; }
			if (big_num > 7) { small_max = 2; }
			if (big_num > 14) { small_max = 1; }
			if (big_num > 28) { small_max = 0; }

			for (i = 0; i < big_num + 1; i++) {
				local_small_max = small_max;

				big_w = this.toFixed(big_p * i);
				if (big_w > 100) {
					big_w = 100;
					local_small_max -= 2;
					if (local_small_max < 0) {
						local_small_max = 0;
					}
				}

				small_p = (big_w - (big_p * (i - 1))) / (local_small_max + 1);

				for (z = 1; z <= local_small_max; z++) { 
					if (big_w === 0) { break; }
					small_w = this.toFixed(big_w - (small_p * z));
					this.appendTick( small_w, { small:true } );
				}

				this.appendTick( big_w, { small:false } );

				result = this.calcReal(big_w);
				result = this._prettify(result);

				this.appendText( big_w, result, {clickable:true} );
			}
		},


		//calcGridMargin
		calcGridMargin: function () { 

			this.coords.w_rs = this.$cache.rs.outerWidth(false);
			if (!this.coords.w_rs) {
				return;
			}

			if (this.options.type === "single") {
				this.coords.w_handle = this.$cache.s_single.outerWidth(false);
			} else {
				this.coords.w_handle = this.$cache.s_from.outerWidth(false);
			}
			this.coords.p_handle = this.toFixed(this.coords.w_handle  / this.coords.w_rs * 100);
			this.coords.grid_gap = this.toFixed((this.coords.p_handle / 2) - 0.1);

			this.$cache.grid.css({
				'width'	: this.toFixed(100 - this.coords.p_handle) + "%",
				'left'	: this.coords.grid_gap + "%"
			});

		},


		// =============================================================================================================
		// Public methods

		//update
		update: function (options) {
			if (!this.input) {
				return;
			}

			this.is_update = true;

			this.options.from = this.result.from;
			this.options.to = this.result.to;

			this.options = $.extend(this.options, options);
			this.validate();
			this.updateResult(options);

			this.toggleInput();
			this.remove();
			this.init(true);
		},

		//reset
		reset: function () {
			if (!this.input) {
				return;
			}

			this.updateResult();
			this.update();
		},

		//destroy
		destroy: function () {
			if (!this.input) {
				return;
			}

			this.toggleInput();
			this.$cache.input.prop("readonly", false);
			$.data(this.input, "baseSlider", null);

			this.remove();
			this.input = null;
			this.options = null;
		}
	}; //end of BaseSlider.prototype


	$.fn.baseSlider = function (options) {
		return this.each(function() {
			if (!$.data(this, "baseSlider")) {
				$.data(this, "baseSlider", new BaseSlider(this, options, plugin_count++));
			}
		});
	};

}(jQuery, this, document));
