'use strict';

/**
 * @public
 */
class CanvasSlicer {
	/**
	 * @param {Element|JQuery} wrapper
	 * @param {Object} [options={}]
	 * @param {string} [options.preset]
	 * @param {string} [options.easing]
	 * @param {number} [options.timeout]
	 * @param {number} [options.initial]
	 * @param {number} [options.angle]
	 * @param {number} [options.count]
	 * @param {number} [options.velocity]
	 * @param {number} [options.desync]
	 * @param {number} [options.stretching]
	 * @param {boolean} [options.inverse]
	 */
	constructor (wrapper, options = {}) {
		if (wrapper && wrapper.jquery) {
			wrapper = wrapper[0];
		}

		if (!(wrapper instanceof window.Element)) {
			this._error(`wrapper must be an Element or jQuery.Element. Receive ${wrapper}`);
		}

		/**
		 * @prop {string} [slicerInitial]
		 * @prop {string} [slicerTimeout]
		 * @prop {string} [slicerPreset]
		 * @prop {string} [slicerAngle]
		 * @prop {string} [slicerCount]
		 * @prop {string} [slicerVelocity]
		 * @prop {string} [slicerStretching]
		 * @prop {string} [slicerEasing]
		 * @prop {string} [slicerDesync]
		 * @prop {string} [slicerInverse]
		 */
		const data = wrapper.dataset;
		const _presets = this._presets;
		const preset = _presets[data.slicerPreset] || _presets[options.preset] || _presets.wind;
		const easing = data.slicerEasing || options.easing || 'easeInOutQuad';
		const hasData = (prop) => data.hasOwnProperty(prop);
		const hasOption = (prop) => options.hasOwnProperty(prop);

		/** @private */
		this.config = {
			timeout: data.slicerTimeout || options.timeout || 3000,
			inverse: hasData('slicerInverse') ? data.slicerInverse !== 'false' : options.inverse !== false,
			velocity: hasData('slicerVelocity') ? data.slicerVelocity : options.velocity || preset.velocity,
			stretching: hasData('slicerStretching') ? data.slicerStretching : options.stretching || preset.stretching,
			desync: hasData('slicerDesync') ? data.slicerDesync : hasOption('desync') ? options.desync : preset.desync,
			angle: hasData('slicerAngle') ? data.slicerAngle : hasOption('angle') ? options.angle : preset.angle,
			count: hasData('slicerCount') ? data.slicerCount : options.count || preset.count
		};

		this.changeEasing(easing);

		if (options.velocity !== undefined) {
			this.changeVelocity(options.velocity);
		}

		if (options.desync !== undefined) {
			this.changeDesync(options.desync);
		}

		if (options.angle !== undefined) {
			this.changeAngle(options.angle);
		}

		if (options.inverse !== undefined) {
			this.changeInverse(options.inverse);
		}

		if (options.count !== undefined) {
			this.changeCount(options.count);
		}

		this._getElements(wrapper);
		if (this._isBroken) {
			return this;
		}

		/** @private */
		this.slider = this._addCanvasData();

		/** @private */
		this._timerId = null;

		/** @private */
		this._isPlaying = false;

		/** @private */
		this._isReady = false;

		/** @private */
		this._isBroken = false;

		/** @private */
		this._isEmpty = false;

		/** @private */
		this._hasAction = false;

		/** @private */
		this._createSlides(() => {
			this._isEmpty = this.slides.length <= 1;
			this._createCurrentIndex(hasData('slicerInitial') ? +data.slicerInitial : options.initial);
			this._drawStatic();
			this._isReady = true;
			this.elements.wrapper.classList.add(this._classes.ready);
			if (this._isBroken || this._isEmpty) {
				return false;
			}

			this._controls();
			this._observe();
			if (this._hasAction) {
				this._hasAction();
			}
		});
	}

	/**
	 * Start auto playing
	 * @public
	 */
	play (now) {
		if (this._isBroken || this._isEmpty) {
			return false;
		}
		this.config.autoplay = true;
		if (this._isReady) {
			this._autoplay(now);
		} else {
			this._hasAction = () => this._autoplay(now);
		}
	}

	/**
	 * Stop auto playing
	 * @public
	 */
	stop () {
		if (this._isBroken || this._isEmpty) {
			return false;
		}
		this.config.autoplay = false;
		window.clearTimeout(this._timerId);
	}

	/**
	 * Slide to previous slide
	 * @public
	 */
	slidePrev () {
		if (this._isBroken || this._isEmpty) {
			return false;
		}
		if (this._isReady) {
			this._drawSlices(this._currentSlide, this._prevSlide, true);
		} else {
			this._hasAction = () => this._drawSlices(this._currentSlide, this._prevSlide, true);
		}
	}

	/**
	 * Slide to next slide
	 * @public
	 */
	slideNext () {
		if (this._isBroken || this._isEmpty) {
			return false;
		}
		if (this._isReady) {
			this._drawSlices(this._currentSlide, this._nextSlide);
		} else {
			this._hasAction = () => this._drawSlices(this._currentSlide, this._nextSlide);
		}
	}

	/**
	 * Slide to chosen slide
	 * @public
	 * @param {number} index - index of wanted slide, starts from 0
	 */
	slideTo (index) {
		if (this._isBroken || this._isEmpty || index === this._currentIndex) {
			return false;
		}

		if (this._isReady) {
			let data = this._toSlideData(index);
			if (data.current) {
				return false;
			}
			this._drawSlices(this._currentSlide, data.slide, data.prev, data.index);
		} else {
			this._hasAction = () => {
				let data = this._toSlideData(index);
				if (data.current) {
					return false;
				}
				this._drawSlices(this._currentSlide, data.slide, data.prev, data.index);
			};
		}
	}

	/**
	 * Change `angle` option
	 * @public
	 * @param {number|string} angleValue
	 * @param {boolean} [showWarnings=true]
	 * @return {boolean} `true` if successful changed, `false` if changes are not accepted
	 */
	changeAngle (angleValue, showWarnings = true) {
		let angle = +angleValue;

		if (isNaN(angle)) {
			if (showWarnings) {
				this._warn('value for "angle" parameter must be an integer!');
			}
			return false;
		}

		if (this.config.stretching > 0 && angle !== 0) {
			if (showWarnings) {
				this._warn('value for "angle" parameter must be an "0" when your "stretching" parameter is more than "0"! Disable "stretching" to be able to change the "angle"');
			}
			return false;
		}

		let [min, max] = this._limits.angle;
		if (angle < min || angle > max) {
			if (showWarnings) {
				this._warn(`value "${angleValue}" for "angle" parameter must be in the range from ${min} to ${max}!`);
			}
			return false;
		}

		this.config.angle = angle;
		return true;
	}

	/**
	 * Change `count` option
	 * @public
	 * @param {number|string} countValue
	 * @param {boolean} [showWarnings=true]
	 * @return {boolean} `true` if successful changed, `false` if changes are not accepted
	 */
	changeCount (countValue, showWarnings = true) {
		let count = +countValue;

		if (isNaN(count)) {
			if (showWarnings) {
				this._warn('value for "count" parameter must be an integer');
			}
			return false;
		}

		let [min, max] = this._limits.count;
		if (count < min || count > max) {
			if (showWarnings) {
				this._warn(`value "${countValue}" for "count" parameter must be in the range from ${min} to ${max}!`);
			}
			return false;
		}

		this.config.count = count;
		return true;
	}

	/**
	 * Change `easing` option
	 * @public
	 * @param {string} easingName
	 * @param {boolean} [showWarnings=true]
	 * @return {boolean} `true` if successful changed, `false` if changes are not accepted
	 */
	changeEasing (easingName, showWarnings = true) {
		let easingFn = this._easingFunctions[easingName];
		if (easingFn === undefined) {
			if (showWarnings) {
				this._warn(`Easing function "${easingName}" does not exist!`);
			}
			return false;
		}
		this.config.easing = easingFn;
		return true;
	}

	/**
	 * Change `velocity` option
	 * @public
	 * @param {number|string} velocityValue
	 * @param {boolean} [showWarnings=true]
	 * @return {boolean} `true` if successful changed, `false` if changes are not accepted
	 */
	changeVelocity (velocityValue, showWarnings = true) {
		let velocity = parseFloat(velocityValue);

		if (isNaN(velocity)) {
			if (showWarnings) {
				this._warn('value for "velocity" parameter must be a number!');
			}
			return false;
		}

		let [min, max] = this._limits.velocity;
		if (velocity < min || velocity > max) {
			if (showWarnings) {
				this._warn(`value "${velocityValue}" for "velocity" parameter must be in the range from ${min} to ${max}!`);
			}
			return false;
		}

		this.config.velocity = velocity;
		return true;
	}

	/**
	 * Change `desync` option
	 * @public
	 * @param {number|string} desyncValue
	 * @param {boolean} [showWarnings=true]
	 * @return {boolean} `true` if successful changed, `false` if changes are not accepted
	 */
	changeDesync (desyncValue, showWarnings = true) {
		let desync = +desyncValue;

		if (isNaN(desync)) {
			if (showWarnings) {
				this._warn('value for "desync" parameter must be an integer!');
			}
			return false;
		}

		let [min, max] = this._limits.desync;
		if (desync < min || desync > max) {
			if (showWarnings) {
				this._warn(`value "${desyncValue}" for "desync" parameter must be in the range from ${min} to ${max}!`);
			}
			return false;
		}

		this.config.desync = desync;
		return true;
	}

	/**
	 * Change `inverse` option
	 * @public
	 * @param {boolean} value
	 * @return {undefined}
	 */
	changeInverse (value) {
		this.config.inverse = !!value;
	}

	/**
	 * Change `stretching` option
	 * @public
	 * @param {number|string} stretchingValue
	 * @param {boolean} [showWarnings=true]
	 * @return {boolean} `true` if successful changed, `false` if changes are not accepted
	 */
	changeStretching (stretchingValue, showWarnings = true) {
		let stretching = parseFloat(stretchingValue);

		if (isNaN(stretching)) {
			if (showWarnings) {
				this._warn('value for "stretching" parameter must be a number!');
			}
			return false;
		}

		let [min, max] = this._limits.stretching;
		if (stretching < min || stretching > max) {
			if (showWarnings) {
				this._warn(`value "${stretchingValue}" for "stretching" parameter must be in the range from ${min} to ${max}, e.g. 0.25!`);
			}
			return false;
		}

		this.config.stretching = stretching;
		if (stretching > 0) {
			this.changeAngle(0);
		}
		return true;
	}

	/**
	 * Update slicer view
	 * @returns {boolean}
	 * @return {boolean} `true` if it was updated, `false` if update is not needed
	 */
	update () {
		if (this._isPlaying) {
			// if slicer is playing now - it will be updated automatically on re-drawing slides
			return false;
		}
		this._drawStatic();
		return true;
	}

	/**
	 * @private
	 * @readonly
	 * @return {Slide}
	 */
	get _currentSlide () {
		return this.slides[this._currentIndex];
	}

	/**
	 * @private
	 * @readonly
	 * @return {number}
	 */
	get _nextIndex () {
		let index = this._currentIndex + 1;
		if (index >= this.slides.length) {
			return 0;
		}
		return index;
	}

	/**
	 * @private
	 * @readonly
	 * @return {Slide}
	 */
	get _nextSlide () {
		return this.slides[this._nextIndex];
	}

	/**
	 * @private
	 * @readonly
	 * @return {number}
	 */
	get _prevIndex () {
		let index = this._currentIndex - 1;
		if (index < 0) {
			return this.slides.length - 1;
		}
		return index;
	}

	/**
	 * @private
	 * @readonly
	 * @return {Slide}
	 */
	get _prevSlide () {
		return this.slides[this._prevIndex];
	}

	/**
	 * @private
	 * @readonly
	 * @return {{width: number, height: number}}
	 */
	get _sizes () {
		return {
			width: this.elements.list.offsetWidth,
			height: this.elements.list.offsetHeight
		};
	}

	/**
	 * @private
	 * @readonly
	 * @return {string}
	 */
	get _ns () {
		return 'canvas-slicer';
	}

	/**
	 * @readonly
	 * @private
	 * @returns {Object}
	 */
	get _easingFunctions () {
		return {
			// no easing, no acceleration
			// linear (t) {
			// 	return t;
			// },
			// accelerating from zero velocity
			easeInQuad (t) {
				return t * t;
			},
			// decelerating to zero velocity
			easeOutQuad (t) {
				return t * (2 - t);
			},
			// acceleration until halfway, then deceleration
			easeInOutQuad (t) {
				return t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;
			},
			// accelerating from zero velocity
			easeInCubic (t) {
				return t * t * t;
			},
			// decelerating to zero velocity
			easeOutCubic (t) {
				return (--t) * t * t + 1;
			},
			// acceleration until halfway, then deceleration
			easeInOutCubic (t) {
				return t < 0.5 ? 4 * t * t * t : (t - 1) * (2 * t - 2) * (2 * t - 2) + 1;
			},
			// accelerating from zero velocity
			easeInQuart (t) {
				return t * t * t * t;
			},
			// decelerating to zero velocity
			easeOutQuart (t) {
				return 1 - (--t) * t * t * t;
			},
			// acceleration until halfway, then deceleration
			easeInOutQuart (t) {
				return t < 0.5 ? 8 * t * t * t * t : 1 - 8 * (--t) * t * t * t;
			},
			// accelerating from zero velocity
			easeInQuint (t) {
				return t * t * t * t * t;
			},
			// decelerating to zero velocity
			easeOutQuint (t) {
				return 1 + (--t) * t * t * t * t;
			},
			// acceleration until halfway, then deceleration
			easeInOutQuint (t) {
				return t < 0.5 ? 16 * t * t * t * t * t : 1 + 16 * (--t) * t * t * t * t;
			}
		};
	}

	/**
	 * @private
	 * @readonly
	 * @returns {{wind: Object}}
	 */
	get _presets () {
		return {
			wind: {
				angle: 60,
				count: 3,
				velocity: 2,
				desync: 20,
				stretching: 0,
				easing: 'easeInOutQuad'
			},
			storm: {
				angle: 40,
				count: 15,
				velocity: 2.5,
				desync: 5,
				stretching: 0,
				easing: 'easeInOutQuad'
			},
			mirrors: {
				angle: 0,
				count: 5,
				velocity: 2.25,
				desync: 15,
				stretching: 0,
				easing: 'easeInOutQuad'
			},
			ribbed: {
				angle: 0,
				count: 100,
				velocity: 3,
				desync: 4,
				stretching: 0,
				easing: 'easeInOutQuad'
			},
			rubber: {
				angle: 0,
				count: 20,
				velocity: 3,
				desync: 4,
				stretching: 0,
				easing: 'easeInOutQuart'
			},
			recast: {
				angle: 12,
				count: 50,
				velocity: 4,
				desync: 4,
				stretching: 0,
				easing: 'easeInOutQuad'
			},
			slasher: {
				angle: 45,
				count: 50,
				velocity: 4.2,
				desync: 8,
				stretching: 0,
				easing: 'easeInOutQuad'
			},
			translation: {
				angle: 0,
				count: 20,
				velocity: 4,
				desync: 3,
				stretching: 0.375,
				easing: 'easeOutQuad'
			},
			overlapping: {
				angle: 0,
				count: 6,
				velocity: 4.25,
				desync: 1,
				stretching: 0.85,
				easing: 'easeOutCubic'
			}
		};
	}

	/**
	 * @private
	 * @readonly
	 * @returns {{angle: number[], count: number[], velocity: number[], desync: number[], stretching: number[]}}
	 */
	get _limits () {
		return {
			angle: [0, 85],
			count: [2, 150],
			velocity: [0.1, 16],
			desync: [0, 100],
			stretching: [0, 1]
		};
	}

	/**
	 * @private
	 * @readonly
	 * @returns {{ready: string, arrowPrev: string, arrowNext: string, dots: string, dot: string, dotActive: string, list: string, slide: string, canvas: string}}
	 */
	get _classes () {
		return {
			ready: `${this._ns}--is-ready`,
			arrowPrev: `${this._ns}-controls__arrow-prev`,
			arrowNext: `${this._ns}-controls__arrow-next`,
			dots: `${this._ns}-controls__dots`,
			dot: `${this._ns}-controls__dot`,
			dotActive: `${this._ns}-controls__dot--is-active`,
			list: `${this._ns}-list`,
			get slide () {
				return `${this.list}__slide`;
			},
			get canvas () {
				return `${this.list}__canvas`;
			}
		};
	}

	/**
	 * @private
	 */
	_controls () {
		const {
			arrowPrev = null,
			arrowNext = null,
			dots = null
		} = this.elements;

		if (arrowPrev !== null) {
			arrowPrev.addEventListener('click', () => this.slidePrev());
		}

		if (arrowNext !== null) {
			arrowNext.addEventListener('click', () => this.slideNext());
		}

		if (dots !== null) {
			let current = this._currentIndex;
			let dotAttr = `data-${this._ns}-dot`;
			let points = this.slides.map((item, i) => {
				let classes = [this._classes.dot].concat(i === current ? [this._classes.dotActive] : []);
				return `<span class="${classes.join(' ')}" ${dotAttr}="${i++}">${i}</span>`;
			});
			dots.innerHTML = points.join('');

			for (let i = 0; i < dots.children.length; i++) {
				let dot = dots.children[i];
				dot.addEventListener('click', () => {
					this.slideTo(+dot.getAttribute(dotAttr));
				});
			}
		}
	}

	/**
	 * @private
	 */
	_observe () {
		let id = null;

		const {
			clearTimeout: clear,
			setTimeout: timer
		} = window;

		const handler = () => {
			clear(id);
			id = timer(() => this.update(), 250);
		};

		window.addEventListener('resize', handler);
		window.addEventListener('orientationchange', handler);

		let x = null;
		let _self = this;
		const touches = (event) => event.changedTouches ? event.changedTouches[0] : event;

		function start (event) {
			x = touches(event).clientX;
		}

		function end (event) {
			if (x !== null) {
				let dx = touches(event).clientX - x;
				let mtd = dx > 10 ? 'slidePrev' : dx < -10 ? 'slideNext' : null;
				if (mtd !== null) {
					_self[mtd]();
				}
				x = null;
			}
		}

		this.slider.canvas.addEventListener('mousedown', start, false);
		this.slider.canvas.addEventListener('touchstart', start, false);
		this.slider.canvas.addEventListener('mouseup', end, false);
		this.slider.canvas.addEventListener('touchend', end, false);
	}

	/**
	 * @private
	 * @param toIndex
	 * @returns {{index: number, current: boolean, prev: boolean, slide: Slide}}
	 */
	_toSlideData (toIndex) {
		if (toIndex < 0) {
			toIndex = this.slides.length - 1;
		} else if (toIndex >= this.slides.length) {
			toIndex = 0;
		}

		return {
			index: toIndex,
			current: this._currentIndex === toIndex,
			prev: this._currentIndex > toIndex,
			slide: this.slides[toIndex]
		};
	}

	/**
	 * @private
	 * @param {number} [initial]
	 * @return {number}
	 */
	_createCurrentIndex (initial) {
		let _currentIndex = initial || 0;
		let length = this.slides.length;
		if (_currentIndex >= length) {
			_currentIndex = length - 1;
		} else if (_currentIndex < 0) {
			_currentIndex = 0;
		}

		Object.defineProperty(this, '_currentIndex', {
			get () {
				return _currentIndex;
			},
			set (value) {
				let index = parseInt(value);
				let length = this.slides.length;
				if (isNaN(index)) {
					this._warn(`index must be an integer! receive ${value}`);
				}

				if (index >= length) {
					_currentIndex = 0;
				} else if (index < 0) {
					_currentIndex = length - 1;
				} else {
					_currentIndex = index;
				}
			}
		});
	}

	/**
	 * @param {boolean} now
	 * @private
	 */
	_autoplay (now) {
		window.clearTimeout(this._timerId);
		if (now) {
			this._drawSlices(this._currentSlide, this._nextSlide);
		} else {
			this._timerId = window.setTimeout(() => {
				this._drawSlices(this._currentSlide, this._nextSlide);
			}, this.config.timeout);
		}
	}

	/**
	 * @private
	 * @param {Slide} slide
	 */
	_drawStatic (slide = this._currentSlide) {
		const {width, height} = this._sizes;
		const args = this._drawArgs(slide, width, height);
		const ctx = this.slider;
		ctx.canvas.width = width;
		ctx.canvas.height = height;
		ctx.clearRect(0, 0, width, height);
		ctx.drawImage(slide.source(), args.x, args.y, args.width, args.height);
	}

	/**
	 * @private
	 * @return {StepValue[]}
	 */
	_getStepValues () {
		const values = [];
		const count = this.config.count;
		const stepOptions = {
			easing: this.config.easing,
			velocity: this.config.velocity,
			desync: this.config.desync + 1
		};

		for (let i = 0; i < count; i++) {
			if (i === 0) {
				values.push(new this.StepValue(stepOptions));
				continue;
			}
			let prevStep = values[i - 1];
			values.push(new this.StepValue(stepOptions, prevStep));
		}
		return values.reverse();
	}

	/**
	 * @private
	 * @param {Slide} frontSlide
	 * @param {Slide} backSlide
	 * @param {boolean} [prev]
	 * @param {number} [toIndex]
	 */
	_drawSlices (frontSlide, backSlide, prev, toIndex) {
		if (this._isPlaying) {
			return false;
		}
		this._isPlaying = true;

		const raf = window.requestAnimationFrame;
		const {count, angle, stretching, inverse} = this.config;
		const stepValues = this._getStepValues();
		const ctx = this.slider;
		const reverseCoords = prev && this.config.inverse;
		const stretch = {
			use: stretching > 0,
			diff: 0,
			gutter: 0
		};

		const step = () => {
			const {width, height} = this._sizes;
			const w = stretch.use ? width / count : width;
			const prevInversed = prev && inverse && !stretch.use;
			const slicesCoords = this._getCoords(count, angle, reverseCoords, stretching);
			const shifts = stepValues.map(value => value.shift(w));
			const lastShift = shifts[shifts.length - 1];
			const frontArgs = this._drawArgs(frontSlide, width, height);
			const backArgs = this._drawArgs(backSlide, width, height);

			if (stretch.use) {
				stretch.gutter = (w - lastShift) / count * stretching;
				if (prev) {
					// stretch.gutter = (w + lastShift) / count * stretching;
				}
			}

			ctx.canvas.width = width;
			ctx.canvas.height = height;

			// const length = slicesCoords.length;
			const last = slicesCoords.length - 1;
			if (prevInversed || (stretch.use && prev)) {
				slicesCoords.reverse();
			}
			slicesCoords.forEach((coords, s) => {
				const length = coords.length;
				const shift = stretch.use ? (shifts[s] * (s || 0.5) / 2) : shifts[s];
				const widthGap = stretch.use ? (w * (s || 0.5) / 2) : w;
				const bx = (backArgs.x + (prev ? shift - widthGap : widthGap - shift));
				const fx = frontArgs.x - (prev ? -shift : shift);
				for (let i = 0; i < length; i++) {
					let [x, y, xS] = coords[i];
					if (stretch.use) {
						let gutter = () => {
							if (prev) {
								x += xS - xS + stretch.gutter * 2;
							} else {
								x += xS - xS - stretch.gutter * 2;
							}
						};

						switch (s) {
							case 0:
								if (prev) {
									if (i === 1 || i === 2) {
										gutter();
									}
								} else if (i === 1 || i === 2) {
									gutter();
								}
								break;
							case last:
								if (prev) {
									if (i === 1 || i === 2) {
										gutter();
									}
								} else if (i === 0 || i === 3) {
									gutter();
								}
								break;
							default:
								if (prev) {
									if (i === 1 || i === 2) {
										gutter();
									}
								} else {
									gutter();
								}
						}
					}
					if (i) {
						ctx.lineTo(x, y);
						continue;
					}
					ctx.save();
					ctx.beginPath();
					ctx.moveTo(x, y);
				}
				ctx.clip();
				if (stretch.use && s === 0) {
					ctx.drawImage(frontSlide.source(), fx, frontArgs.y, frontArgs.width, frontArgs.height);
				}
				ctx.drawImage(backSlide.source(), bx, backArgs.y, backArgs.width, backArgs.height);
				if (!stretch.use) {
					ctx.drawImage(frontSlide.source(), fx, frontArgs.y, frontArgs.width, frontArgs.height);
				}
				ctx.restore();
			});

			if (lastShift < w) {
				stepValues[0].grow();
				this._afterSlice();
				return raf(step);
			}
			this._afterSlide(prev, toIndex);
		};

		raf(step);
	}

	/**
	 * @private
	 */
	_afterSlice () {
		const event = new window.CustomEvent(`${this._ns}:after-slice`, {detail: this._getDetail()});
		this.elements.wrapper.dispatchEvent(event);
	}

	/**
	 * @private
	 * @param {boolean} [prev]
	 * @param {number} [toIndex]
	 */
	_afterSlide (prev, toIndex) {
		if (toIndex === undefined) {
			this._currentIndex = this._currentIndex + (prev ? -1 : 1);
		} else {
			this._currentIndex = toIndex;
		}
		this._isPlaying = false;
		const {dots = null} = this.elements;

		if (dots !== null) {
			let current = this._currentIndex;
			let {dotActive} = this._classes;
			for (let i = 0; i < dots.children.length; i++) {
				let dot = dots.children[i];
				dot.classList.remove(dotActive);
				if (i === current) {
					dot.classList.add(dotActive);
				}
			}
		}

		// this._drawStatic();
		const event = new window.CustomEvent(`${this._ns}:after-slide`, {detail: this._getDetail(true)});
		this.elements.wrapper.dispatchEvent(event);
		if (this.config.autoplay) {
			this._autoplay();
		}
	}

	/**
	 * @private
	 * @param {boolean} [fullDetail]
	 * @return {Object}
	 */
	_getDetail (fullDetail) {
		const detail = {
			slicer: this,
			currentIndex: this._currentIndex,
			currentSlide: this._currentSlide,
			angle: this.config.angle
		};

		if (fullDetail) {
			detail.nextIndex = this._nextIndex;
			detail.nextSlide = this._nextSlide;
			detail.prevIndex = this._prevIndex;
			detail.prevSlide = this._prevSlide;
			detail.count = this.config.count;
			detail.velocity = this.config.velocity;
			detail.desync = this.config.desync;
		}

		return detail;
	}

	/**
	 * @private
	 * @param {number} count
	 * @param {number} angle
	 * @param {boolean} [reverse]
	 * @param {number} [stretching]
	 * @return Array
	 */
	_getCoords (count, angle, reverse, stretching) {
		const {width, height: sliceHeight} = this._sizes;

		const odd = count % 2;
		const sides = (odd ? count - 1 : count) / 2;
		const left = count - sides - (odd ? 1 : 0);
		const right = count - sides;
		const radian = (90 - angle) * Math.PI / 180;
		const catheter = parseInt(sliceHeight / Math.tan(radian));
		const sliceWidth = (width + catheter) / count;
		const diff = sliceWidth - catheter;
		const center = (width + catheter) / 2 - (odd ? sliceWidth / 2 : 0);
		const slicesCoords = [];
		const clearance = 4;

		const push = (gapTop, gapBottom) => {
			const topY = 0;
			const topLeftX = gapTop - clearance;
			const topRightX = gapTop + sliceWidth + clearance;

			const bottomY = sliceHeight;
			const bottomRightX = gapBottom + clearance;
			const bottomLeftX = gapBottom - sliceWidth - clearance;

			if (reverse) {
				return slicesCoords.push([
					[bottomLeftX, topY, bottomLeftX * -stretching],
					[bottomRightX, topY, bottomRightX * -stretching],
					[topRightX, bottomY, topRightX * -stretching],
					[topLeftX, bottomY, topLeftX * -stretching]
				]);
			}
			slicesCoords.push([
				[topLeftX, topY, topLeftX * stretching],
				[topRightX, topY, topRightX * stretching],
				[bottomRightX, bottomY, bottomRightX * stretching],
				[bottomLeftX, bottomY, bottomLeftX * stretching]
			]);
		};

		for (let i = left; i > 0; i--) {
			let gap = center - i * sliceWidth;
			push(gap, gap + diff);
		}

		for (let i = 0; i < right; i++) {
			let gap = center + i * sliceWidth;
			push(gap, gap + diff);
		}

		return slicesCoords;
	}

	/**
	 * @private
	 * @param {Slide} slide
	 * @param {number} canvasWidth
	 * @param {number} canvasHeight
	 * @return {{x: number, y: number, width: number, height: number}}
	 */
	_drawArgs (slide, canvasWidth, canvasHeight) {
		const {width: slideWidth, height: slideHeight} = slide._sizes;
		const h = (x, y) => x / y * 100;
		const h1 = h(canvasHeight, canvasWidth);
		const h2 = h(slideHeight, slideWidth);

		if (h1 >= h2) {
			let width = slideWidth * (canvasHeight / slideHeight);
			let x = (canvasWidth - width) / 2;
			return {
				x: x,
				y: 0,
				width: width,
				height: canvasHeight
			};
		}

		let height = slideHeight * (canvasWidth / slideWidth);
		let y = (canvasHeight - height) / 2;
		return {
			x: 0,
			y: y,
			width: canvasWidth,
			height: height
		};
	}

	/**
	 * @private
	 * @param wrapper
	 */
	_getElements (wrapper) {
		/** @private */
		this.elements = {wrapper};
		const listSelector = '.' + this._classes.list;
		const list = wrapper.querySelector(listSelector);
		if (list === null) {
			this._error(`${listSelector} not found`);
			return false;
		}
		this.elements.list = list;

		const slideSelector = '.' + this._classes.slide;
		const slides = list.querySelectorAll(slideSelector);
		if (slides.length === 0) {
			this._error(`${slideSelector} not found`);
			return false;
		}
		this.elements.slides = slides;

		this.elements.arrowPrev = wrapper.querySelector('.' + this._classes.arrowPrev);
		this.elements.arrowNext = wrapper.querySelector('.' + this._classes.arrowNext);
		this.elements.dots = wrapper.querySelector('.' + this._classes.dots);
	}

	/**
	 * @private
	 * @return {CanvasRenderingContext2D}
	 */
	_addCanvasData () {
		const canvas = this._createCanvas();
		canvas.classList.add(this._classes.canvas);
		this.elements.list.appendChild(canvas);
		const ctx = canvas.getContext('2d');
		return ctx;
	}

	/**
	 * @private
	 * @return {HTMLCanvasElement}
	 */
	_createCanvas () {
		const canvas = document.createElement('canvas');
		canvas.width = this._sizes.width;
		canvas.heigth = this._sizes.height;
		return canvas;
	}

	/**
	 * @private
	 * @param {Function} isDone
	 * @return {Array}
	 */
	_createSlides (isDone) {
		/**
		 * @private
		 * @type {Slide[]}
		 */
		this.slides = [];
		let index = 0;

		const done = slide => {
			if (slide instanceof Slide) {
				this.slides.push(slide);
			}
			load();
		};

		const load = () => {
			const element = this.elements.slides[index++];
			if (element) {
				const nodeName = element.nodeName.toLowerCase();
				switch (nodeName) {
					case 'img':
						new this.SlideImg(element, done); // eslint-disable-line no-new
						break;
					case 'video':
						this._warn(`Unsupported node ${nodeName}! Video will be supported in 2.x version`);
						done();
						break;
					default:
						this._warn(`Unsupported node ${nodeName}!`);
						done();
				}
			} else {
				isDone();
			}
		};
		load();
	}

	/**
	 * @private
	 * @param {string} message
	 */
	_error (message) {
		this._isBroken = true;
		console.warn('CanvasSlicer is broken, stop current process!');
		this._warn(message);
	}

	/**
	 * @private
	 * @param {string} message
	 */
	_warn (message) {
		console.warn('CanvasSlicer WARN action!');
		console.warn(message);
		if (this.elements && this.elements.wrapper) {
			const event = new window.CustomEvent(`${this._ns}:warn`, {
				detail: {
					slicer: this,
					message
				}
			});
			this.elements.wrapper.dispatchEvent(event);
		}
	}

	/**
	 * @constructor
	 * @private
	 * @readonly
	 * @return {SlideVideo}
	 */
	get Slide () {
		return Slide;
	}

	/**
	 * @constructor
	 * @private
	 * @readonly
	 * @return {SlideImg}
	 */
	get SlideImg () {
		return SlideImg;
	}

	/**
	 * @constructor
	 * @private
	 * @readonly
	 * @return {StepValue}
	 */
	get StepValue () {
		return StepValue;
	}
}

/**
 * @private
 * @prop {HTMLElement} element
 */
class Slide {
	/**
	 * @param {HTMLElement} element
	 * @param {HTMLElement} entryElement
	 * @param {Function} isDone
	 */
	constructor (element, isDone) {
		this.entryElement = element;
		this.isDone = isDone;
		this.load();
	}

	load () {
		this.element = this.entryElement;
		this.isDone(this);
	}

	/**
	 * @readonly
	 * @return {{width: number, height: number}}
	 */
	get _sizes () {
		return {
			width: 0,
			height: 0
		};
	}

	/**
	 * @return {HTMLElement}
	 */
	source () {
		return this.element;
	}
}

/**
 * @private
 * @prop {HTMLImageElement} entryElement
 * @prop {HTMLImageElement} element
 */
class SlideImg extends Slide {
	load () {
		const img = document.createElement('img');
		img.onload = () => {
			this.element = img;
			this.isDone(this);
		};
		img.onerror = () => {
			this.isDone();
		};
		img.src = this.entryElement.src;
	}

	get _sizes () {
		return {
			width: this.element.naturalWidth,
			height: this.element.naturalHeight
		};
	}
}

/**
 * Класс значений для отрисовки каждго шага (кадра)
 */
class StepValue {
	/**
	 * @param {Object} [options={}]
	 * @param {StepValue} [nextValue]
	 */
	constructor (options = {}, nextValue) {
		this.percent = 1;
		this.max = options.max || 150;
		this.desync = options.desync || 16;
		this.easing = options.easing;
		this.velocity = options.velocity || 1.3;
		if (nextValue instanceof StepValue) {
			this.nextValue = nextValue;
		}
	}

	/**
	 * Сдвиг изображений в секции
	 * @param {number} width
	 * @return {number}
	 */
	shift (width) {
		let t = this.percent / this.max;
		let gap = this.easing(t) * this.max;
		return this.percent >= this.max ? width : width / this.max * gap;
	}

	/**
	 * Переход к следуюшему шагу
	 * увеличиваем значения, текущего и связанного, если есть
	 */
	grow () {
		this.percent += this.velocity;
		if (this.nextValue && this.percent > this.desync) {
			this.nextValue.grow();
		}
	}
}

export default CanvasSlicer;
