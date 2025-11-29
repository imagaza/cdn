/**
 * mightySlider "Time Loader" addon
 * http://mightyslider.com/
 * 
 * @version:  1.0.0
 * @released: June 21, 2015
 * 
 * @author:   Hemn Chawroka
 *            http://iprodev.com/
 * 
 */
;(function (w, undefined) {
	'use strict';

	// Return false and warn if mightySlider is not included
	if (typeof mightySlider === 'undefined') {
		console && console.warn('Time loader needs mightySlider! Please include mightySlider script into your page.');
		return;
	}

	// Shorthads
	var abs = Math.abs;
	var PI = Math.PI;

	/**
	 * Render the donut on a canvas object
	 */
	var donutRenderer = function(ctx, radius, color, lineWidth, trackSpace, percent, isBg) {
		percent = Math.min(Math.max(-1, percent || 0), 1);
		var isNegative = percent <= 0 ? true : false;

		if (!isBg) {
			lineWidth = lineWidth - (trackSpace * 2);
		}

		ctx.beginPath();
		ctx.arc(0, 0, radius, 0, PI * 2 * percent, isNegative);

		ctx.strokeStyle = color;
		ctx.lineWidth = lineWidth;

		ctx.stroke();
	};

	/**
	 * Render the pie on a canvas object
	 */
	var pieRenderer = function(ctx, radius, color, lineWidth, trackSpace, percent, isBg) {
		percent = Math.min(Math.max(-1, percent || 0), 1);
		var isNegative = percent <= 0 ? true : false;

		if (!isBg) {
			radius = radius - trackSpace;
		}

		ctx.beginPath();
		ctx.moveTo(0, 0);
		ctx.arc(0, 0, radius, 0, PI * 2 * percent, isNegative);

		ctx.fillStyle = color;
		ctx.fill();
	};

	var canvasRenderer = function(el, options) {
		var self = this;
		var cachedBackground;
		var canvas = el;

		if (typeof(G_vmlCanvasManager) !== 'undefined') {
			G_vmlCanvasManager.initElement(canvas);
		}

		var ctx = canvas.getContext('2d');

		canvas.width = canvas.height = options.size;

		// canvas on retina devices
		var scaleBy = window.devicePixelRatio;
		canvas.style.width = canvas.style.height = [options.size, 'px'].join('');
		canvas.width = canvas.height = options.size * scaleBy;
		ctx.scale(scaleBy, scaleBy);

		// move 0,0 coordinates to the center
		ctx.translate(options.size / 2, options.size / 2);

		// rotate canvas -90deg
		ctx.rotate((-1 / 2 + options.rotate / 180) * PI);

		var radius = (options.size - options.lineWidth) / 2;
		if (options.scaleColor && options.scaleLength) {
			radius = radius - options.scaleLength - 2; // 2 is the distance between scale and bar
		}
		radius = abs(radius);

		if (options.mode.toLowerCase() === 'donut')
			var drawCircle = donutRenderer;
		else
			var drawCircle = pieRenderer;

		/**
		 * Draw the scale of the chart
		 */
		var drawScale = function() {
			var offset;
			var length;

			ctx.lineWidth = 1;
			ctx.fillStyle = options.scaleColor;

			ctx.save();
			for (var i = 24; i > 0; --i) {
				if (i % 6 === 0) {
					length = options.scaleLength;
					offset = 0;
				} else {
					length = options.scaleLength * 0.6;
					offset = options.scaleLength - length;
				}
				ctx.fillRect(-options.size / 2 + offset, 0, length, 1);
				ctx.rotate(PI / 12);
			}
			ctx.restore();
		};

		/**
		 * Draw the background of the plugin including the scale and the track
		 */
		var drawBackground = function() {
			if (options.scaleColor) drawScale();
			if (options.trackColor) drawCircle(ctx, radius, options.trackColor, options.lineWidth, options.trackSpace, 1, 1);
		};

		/**
		 * Clear the complete canvas
		 */
		self.clear = function() {
			ctx.clearRect(options.size / -2, options.size / -2, options.size, options.size);
		};

		/**
		 * Draw the complete loader
		 * @param {number} percent Percent shown by the loader between -100 and 100
		 */
		self.draw = function(percent) {
			// do we need to render a background
			if (!!options.scaleColor || !!options.trackColor) {
				// getImageData and putImageData are supported
				if (ctx.getImageData && ctx.putImageData) {
					if (!cachedBackground) {
						drawBackground();
						cachedBackground = ctx.getImageData(0, 0, options.size * scaleBy, options.size * scaleBy);
					} else {
						ctx.putImageData(cachedBackground, 0, 0);
					}
				} else {
					self.clear();
					drawBackground();
				}
			} else {
				self.clear();
			}

			ctx.lineCap = options.lineCap;

			// if barcolor is a function execute it and pass the percent as a value
			var color;
			if (typeof(options.barColor) === 'function') {
				color = options.barColor.call(self, percent);
			} else {
				color = options.barColor;
			}

			// draw bar
			drawCircle(ctx, radius, color, options.lineWidth, options.trackSpace, percent);
		};
	};

	/**
	 * Poor man's shallow object extend;
	 *
	 * @param  {Object} a
	 * @param  {Object} b
	 * @return {Object}
	 */
	function extend(a, b) {
		for (var k in b) a[k] = b[k];
		return a;
	}

	w.mightySliderTimerLoader = function(mSAPI, opts) {
		// Prevent run & warn if there is no valid mightySlider instance API
		if (typeof mSAPI !== 'object') {
			console && console.warn('There is no valid mightySlider instance API!');
			return;
		}

		var self = this;

		// References
		var frame = mSAPI.frame;

		// Default options
		var defaultOptions = {
			mode: 'pie',
			barColor: '#ef1e25',
			trackColor: '#f9f9f9',
			scaleColor: '#dfe0e0',
			txtColor: false,
			scaleLength: 5,
			lineCap: 'round',
			lineWidth: 3,
			trackSpace: 0,
			size: 50,
			rotate: 0,
			position: 'top right',
			offset: 10,
			txtShow: false,
			txtMask: '{d}%',
			fontSize: '13px',
			fontWeight: 'normal',
			reverse: false
		};

		// merge user options into default options
		var options = extend(defaultOptions, opts);
		var currentValue = options.reverse ? 1 : 0;

		var elements = [],
			firstChild = frame.firstChild,
			el, txtEl;

		// Creating canvas element
		el = document.createElement('canvas');
		// Prepend the canvas element to the FRAME
		frame.insertBefore( el, firstChild );

		elements.push(el);

		if (options.txtColor) {
			txtEl = document.createElement('div');
			txtEl.className = 'timeLoaderTxt';
			// Prepend the canvas element to the FRAME
			frame.insertBefore( txtEl, firstChild );

			txtEl.style.pointerEvents = 'none';
			txtEl.style.lineHeight = options.size + 'px';
			txtEl.style.textAlign = 'center';
			txtEl.style.fontSize = options.fontSize;
			txtEl.style.fontWeight = options.fontWeight;
			txtEl.style.color = options.txtColor;
			txtEl.style.width = txtEl.style.height = options.size + 'px';

			elements.push(txtEl);
		}

		var offset = options.offset;
		var position = options.position;
		var transform = '';
		var top = 'auto';
		var bottom = 'auto';
		var left = 'auto';
		var right = 'auto';

		if (position.indexOf('top') !== -1) {
			top = offset + 'px';
		}
		else if (position.indexOf('middle') !== -1) {
			transform += 'translateY(-50%) ';
			top = '50%';
		}
		else if (position.indexOf('bottom') !== -1) {
			bottom = offset + 'px';
		}
		if (position.indexOf('left') !== -1) {
			left = offset + 'px';
		}
		else if (position.indexOf('center') !== -1) {
			transform += 'translateX(-50%) ';
			left = '50%';
		}
		else if (position.indexOf('right') !== -1) {
			right = offset + 'px';
		}

		for (var i = 0, len = elements.length, element; i < len; i++) {
			element = elements[i];

			element.style.position = 'absolute';
			element.style.zIndex = '1000';
			element.style.cursor = 'pointer';
			element.style.top = top;
			element.style.bottom = bottom;
			element.style.left = left;
			element.style.right = right;
			element.style[(element.style.WebkitTransform !== undefined) ? 'WebkitTransform' : 'transform'] = transform;
		}

		el.addEventListener('click', function(){
			mSAPI.toggleCycling();
		}, false);

		/**
		 * Update the value of the chart
		 * @param  {number} newValue Number between 0 and 100
		 * @return {object}          Instance of the plugin for method chaining
		 */
		self.update = function(newValue) {
			newValue = parseFloat(newValue);
			if(options.reverse) {
				newValue = 1 - newValue;
			}
			self.renderer.draw(newValue);

			if (txtEl) {
				var rounded = Math.round(newValue * 100);
				txtEl.textContent = options.txtMask.replace(/{d}/g, (rounded < 10 ? '0' : '') + rounded);
			}

			currentValue = newValue;
			return self;
		};

		/**
		 * Initialize the plugin by creating the options object and initialize rendering
		 */
		self.init = function() {
			self.el = el;
			self.options = options;

			// create renderer
			self.renderer = new canvasRenderer(el, options);

			// initial update
			self.update(currentValue);
		};

		self.init();

		function progressHandler(eventName, progressed) {
			self.update(progressed);
		}

		// Register 'progress' event in mighySlider
		mSAPI.on('progress', progressHandler);

		function activeHandler(eventName) {
			if (mSAPI.isPaused) {
				self.update(0);
			}
		}

		// Register 'active' event in mighySlider
		mSAPI.on('active', activeHandler);

		mSAPI.one('destroy', function() {
			// Register events from mighySlider
			mSAPI.off('progress', progressHandler);
			mSAPI.off('active', activeHandler);

			for (var i = 0, len = elements.length, element; i < len; i++) {
				frame.removeChild(elements[i]);
			}

			el = null;
			txtEl = null;
			self.el = null;
		});
	};
}(this));