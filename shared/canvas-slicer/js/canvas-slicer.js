;
(function(root, factory) {
	if (typeof define === 'function' && define.amd) {
		define([], factory);
	} else if (typeof exports === 'object') {
		module.exports = factory();
	} else {
		root.CanvasSlicer = factory();
	}
}(this, function() {
	'use strict';
	var _slicedToArray = function() {
		function sliceIterator(arr, i) {
			var _arr = [];
			var _n = true;
			var _d = false;
			var _e = undefined;
			try {
				for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) {
					_arr.push(_s.value);
					if (i && _arr.length === i) break;
				}
			} catch (err) {
				_d = true;
				_e = err;
			} finally {
				try {
					if (!_n && _i["return"]) _i["return"]();
				} finally {
					if (_d) throw _e;
				}
			}
			return _arr;
		}
		return function(arr, i) {
			if (Array.isArray(arr)) {
				return arr;
			} else if (Symbol.iterator in Object(arr)) {
				return sliceIterator(arr, i);
			} else {
				throw new TypeError("Invalid attempt to destructure non-iterable instance");
			}
		};
	}();
	var _createClass = function() {
		function defineProperties(target, props) {
			for (var i = 0; i < props.length; i++) {
				var descriptor = props[i];
				descriptor.enumerable = descriptor.enumerable || false;
				descriptor.configurable = true;
				if ("value" in descriptor) descriptor.writable = true;
				Object.defineProperty(target, descriptor.key, descriptor);
			}
		}
		return function(Constructor, protoProps, staticProps) {
			if (protoProps) defineProperties(Constructor.prototype, protoProps);
			if (staticProps) defineProperties(Constructor, staticProps);
			return Constructor;
		};
	}();

	function _possibleConstructorReturn(self, call) {
		if (!self) {
			throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
		}
		return call && (typeof call === "object" || typeof call === "function") ? call : self;
	}

	function _inherits(subClass, superClass) {
		if (typeof superClass !== "function" && superClass !== null) {
			throw new TypeError("Super expression must either be null or a function, not " + typeof superClass);
		}
		subClass.prototype = Object.create(superClass && superClass.prototype, {
			constructor: {
				value: subClass,
				enumerable: false,
				writable: true,
				configurable: true
			}
		});
		if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass;
	}

	function _classCallCheck(instance, Constructor) {
		if (!(instance instanceof Constructor)) {
			throw new TypeError("Cannot call a class as a function");
		}
	}
	var CanvasSlicer = function() {
		function CanvasSlicer(wrapper) {
			var _this = this;
			var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
			_classCallCheck(this, CanvasSlicer);
			if (wrapper && wrapper.jquery) {
				wrapper = wrapper[0];
			}
			if (!(wrapper instanceof window.Element)) {
				this._error('wrapper must be an Element or jQuery.Element. Receive ' + wrapper);
			}
			var data = wrapper.dataset;
			var _presets = this._presets;
			var preset = _presets[data.slicerPreset] || _presets[options.preset] || _presets.wind;
			var easing = data.slicerEasing || options.easing || 'easeInOutQuad';
			var hasData = function hasData(prop) {
				return data.hasOwnProperty(prop);
			};
			var hasOption = function hasOption(prop) {
				return options.hasOwnProperty(prop);
			};
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
			this.slider = this._addCanvasData();
			this._timerId = null;
			this._isPlaying = false;
			this._isReady = false;
			this._isBroken = false;
			this._isEmpty = false;
			this._hasAction = false;
			this.currentLink = false;
			this._createSlides(function() {
				_this._isEmpty = _this.slides.length <= 1;
				_this._createCurrentIndex(hasData('slicerInitial') ? +data.slicerInitial : options.initial);
				_this._drawStatic();
				_this._isReady = true;
				_this.elements.wrapper.classList.add(_this._classes.ready);
				if (_this._isBroken || _this._isEmpty) {
					return false;
				}
				_this._controls();
				_this._observe();
				if (_this._hasAction) {
					_this._hasAction();
				}
			});
		}
		_createClass(CanvasSlicer, [{
			key: 'play',
			value: function play(now) {
				var _this2 = this;
				if (this._isBroken || this._isEmpty) {
					return false;
				}
				this.config.autoplay = true;
				if (this._isReady) {
					this._autoplay(now);
				} else {
					this._hasAction = function() {
						return _this2._autoplay(now);
					};
				}
			}
		}, {
			key: 'stop',
			value: function stop() {
				if (this._isBroken || this._isEmpty) {
					return false;
				}
				this.config.autoplay = false;
				window.clearTimeout(this._timerId);
			}
		}, {
			key: 'slidePrev',
			value: function slidePrev() {
				var _this3 = this;
				if (this._isBroken || this._isEmpty) {
					return false;
				}
				if (this._isReady) {
					this._drawSlices(this._currentSlide, this._prevSlide, true);
				} else {
					this._hasAction = function() {
						return _this3._drawSlices(_this3._currentSlide, _this3._prevSlide, true);
					};
				}
			}
		}, {
			key: 'slideNext',
			value: function slideNext() {
				var _this4 = this;
				if (this._isBroken || this._isEmpty) {
					return false;
				}
				if (this._isReady) {
					this._drawSlices(this._currentSlide, this._nextSlide);
				} else {
					this._hasAction = function() {
						return _this4._drawSlices(_this4._currentSlide, _this4._nextSlide);
					};
				}
			}
		}, {
			key: 'slideTo',
			value: function slideTo(index) {
				var _this5 = this;
				if (this._isBroken || this._isEmpty || index === this._currentIndex) {
					return false;
				}
				if (this._isReady) {
					var data = this._toSlideData(index);
					if (data.current) {
						return false;
					}
					this._drawSlices(this._currentSlide, data.slide, data.prev, data.index);
				} else {
					this._hasAction = function() {
						var data = _this5._toSlideData(index);
						if (data.current) {
							return false;
						}
						_this5._drawSlices(_this5._currentSlide, data.slide, data.prev, data.index);
					};
				}
			}
		}, {
			key: 'changeAngle',
			value: function changeAngle(angleValue) {
				var showWarnings = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : true;
				var angle = +angleValue;
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
				var _limits$angle = _slicedToArray(this._limits.angle, 2),
					min = _limits$angle[0],
					max = _limits$angle[1];
				if (angle < min || angle > max) {
					if (showWarnings) {
						this._warn('value "' + angleValue + '" for "angle" parameter must be in the range from ' + min + ' to ' + max + '!');
					}
					return false;
				}
				this.config.angle = angle;
				return true;
			}
		}, {
			key: 'changeCount',
			value: function changeCount(countValue) {
				var showWarnings = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : true;
				var count = +countValue;
				if (isNaN(count)) {
					if (showWarnings) {
						this._warn('value for "count" parameter must be an integer');
					}
					return false;
				}
				var _limits$count = _slicedToArray(this._limits.count, 2),
					min = _limits$count[0],
					max = _limits$count[1];
				if (count < min || count > max) {
					if (showWarnings) {
						this._warn('value "' + countValue + '" for "count" parameter must be in the range from ' + min + ' to ' + max + '!');
					}
					return false;
				}
				this.config.count = count;
				return true;
			}
		}, {
			key: 'changeEasing',
			value: function changeEasing(easingName) {
				var showWarnings = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : true;
				var easingFn = this._easingFunctions[easingName];
				if (easingFn === undefined) {
					if (showWarnings) {
						this._warn('Easing function "' + easingName + '" does not exist!');
					}
					return false;
				}
				this.config.easing = easingFn;
				return true;
			}
		}, {
			key: 'changeVelocity',
			value: function changeVelocity(velocityValue) {
				var showWarnings = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : true;
				var velocity = parseFloat(velocityValue);
				if (isNaN(velocity)) {
					if (showWarnings) {
						this._warn('value for "velocity" parameter must be a number!');
					}
					return false;
				}
				var _limits$velocity = _slicedToArray(this._limits.velocity, 2),
					min = _limits$velocity[0],
					max = _limits$velocity[1];
				if (velocity < min || velocity > max) {
					if (showWarnings) {
						this._warn('value "' + velocityValue + '" for "velocity" parameter must be in the range from ' + min + ' to ' + max + '!');
					}
					return false;
				}
				this.config.velocity = velocity;
				return true;
			}
		}, {
			key: 'changeDesync',
			value: function changeDesync(desyncValue) {
				var showWarnings = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : true;
				var desync = +desyncValue;
				if (isNaN(desync)) {
					if (showWarnings) {
						this._warn('value for "desync" parameter must be an integer!');
					}
					return false;
				}
				var _limits$desync = _slicedToArray(this._limits.desync, 2),
					min = _limits$desync[0],
					max = _limits$desync[1];
				if (desync < min || desync > max) {
					if (showWarnings) {
						this._warn('value "' + desyncValue + '" for "desync" parameter must be in the range from ' + min + ' to ' + max + '!');
					}
					return false;
				}
				this.config.desync = desync;
				return true;
			}
		}, {
			key: 'changeInverse',
			value: function changeInverse(value) {
				this.config.inverse = !!value;
			}
		}, {
			key: 'changeStretching',
			value: function changeStretching(stretchingValue) {
				var showWarnings = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : true;
				var stretching = parseFloat(stretchingValue);
				if (isNaN(stretching)) {
					if (showWarnings) {
						this._warn('value for "stretching" parameter must be a number!');
					}
					return false;
				}
				var _limits$stretching = _slicedToArray(this._limits.stretching, 2),
					min = _limits$stretching[0],
					max = _limits$stretching[1];
				if (stretching < min || stretching > max) {
					if (showWarnings) {
						this._warn('value "' + stretchingValue + '" for "stretching" parameter must be in the range from ' + min + ' to ' + max + ', e.g. 0.25!');
					}
					return false;
				}
				this.config.stretching = stretching;
				if (stretching > 0) {
					this.changeAngle(0);
				}
				return true;
			}
		}, {
			key: 'update',
			value: function update() {
				if (this._isPlaying) {
					// if slicer is playing now - it will be updated automatically on re-drawing slides
					return false;
				}
				this._drawStatic();
				return true;
			}
		}, {
			key: '_controls',
			value: function _controls() {
				var _this6 = this;
				var _elements = this.elements,
					_elements$arrowPrev = _elements.arrowPrev,
					arrowPrev = _elements$arrowPrev === undefined ? null : _elements$arrowPrev,
					_elements$arrowNext = _elements.arrowNext,
					arrowNext = _elements$arrowNext === undefined ? null : _elements$arrowNext,
					_elements$dots = _elements.dots,
					dots = _elements$dots === undefined ? null : _elements$dots;
				if (arrowPrev !== null) {
					arrowPrev.addEventListener('click', function() {
						return _this6.slidePrev();
					});
				}
				if (arrowNext !== null) {
					arrowNext.addEventListener('click', function() {
						return _this6.slideNext();
					});
				}
				if (dots !== null) {
					(function() {
						var current = _this6._currentIndex;
						var dotAttr = 'data-' + _this6._ns + '-dot';
						var points = _this6.slides.map(function(item, i) {
							var classes = [_this6._classes.dot].concat(i === current ? [_this6._classes.dotActive] : []);
							return '<span class="' + classes.join(' ') + '" ' + dotAttr + '="' + i++ + '">' + i + '</span>';
						});
						dots.innerHTML = points.join('');
						var _loop = function _loop(i) {
							var dot = dots.children[i];
							dot.addEventListener('click', function() {
								_this6.slideTo(+dot.getAttribute(dotAttr));
							});
						};
						for (var i = 0; i < dots.children.length; i++) {
							_loop(i);
						}
					})();
				}
			}
		}, {
			key: '_observe',
			value: function _observe() {
				var _this7 = this;
				var id = null;
				var _window = window,
					clear = _window.clearTimeout,
					timer = _window.setTimeout;
				var handler = function handler() {
					clear(id);
					id = timer(function() {
						return _this7.update();
					}, 250);
				};
				window.addEventListener('resize', handler);
				window.addEventListener('orientationchange', handler);
				var x = null;
				var _self = this;
				var touches = function touches(event) {
					return event.changedTouches ? event.changedTouches[0] : event;
				};

				function start(event) {
					x = touches(event).clientX;
				}

				function end(event) {
					if (x !== null) {
						var dx = touches(event).clientX - x;
						var mtd = dx > 10 ? 'slidePrev' : dx < -10 ? 'slideNext' : null;
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
		}, {
			key: '_toSlideData',
			value: function _toSlideData(toIndex) {
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
		}, {
			key: '_createCurrentIndex',
			value: function _createCurrentIndex(initial) {
				var _currentIndex = initial || 0;
				var length = this.slides.length;
				if (_currentIndex >= length) {
					_currentIndex = length - 1;
				} else if (_currentIndex < 0) {
					_currentIndex = 0;
				}
				Object.defineProperty(this, '_currentIndex', {
					get: function get() {
						return _currentIndex;
					},
					set: function set(value) {
						var index = parseInt(value);
						var length = this.slides.length;
						if (isNaN(index)) {
							this._warn('index must be an integer! receive ' + value);
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
		}, {
			key: '_autoplay',
			value: function _autoplay(now) {
				var _this8 = this;
				window.clearTimeout(this._timerId);
				if (now) {
					this._drawSlices(this._currentSlide, this._nextSlide);
				} else {
					this._timerId = window.setTimeout(function() {
						_this8._drawSlices(_this8._currentSlide, _this8._nextSlide);
					}, this.config.timeout);
				}
			}
		}, {
			key: '_drawStatic',
			value: function _drawStatic() {
				var _this233 = this;
				var slide = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : this._currentSlide;
				var _sizes = this._sizes,
					width = _sizes.width,
					height = _sizes.height;

					_this233.currentLink = slide.entryElement.dataset.href;
				var args = this._drawArgs(slide, width, height);
				var ctx = this.slider;
				ctx.canvas.width = width;
				ctx.canvas.height = height;
				ctx.clearRect(0, 0, width, height);
				ctx.canvas.addEventListener('click', function() {
						if(_this233.currentLink){
							top.location = _this233.currentLink;
						}
					});
				ctx.drawImage(slide.source(), args.x, args.y, args.width, args.height);
			}
		}, {
			key: '_getStepValues',
			value: function _getStepValues() {
				var values = [];
				var count = this.config.count;
				var stepOptions = {
					easing: this.config.easing,
					velocity: this.config.velocity,
					desync: this.config.desync + 1
				};
				for (var i = 0; i < count; i++) {
					if (i === 0) {
						values.push(new this.StepValue(stepOptions));
						continue;
					}
					var prevStep = values[i - 1];
					values.push(new this.StepValue(stepOptions, prevStep));
				}
				return values.reverse();
			}
		}, {
			key: '_drawSlices',
			value: function _drawSlices(frontSlide, backSlide, prev, toIndex) {
				var _this9 = this;
				_this9.currentLink = backSlide.entryElement.dataset.href;
				if (this._isPlaying) {
					return false;
				}
				this._isPlaying = true;
				var raf = window.requestAnimationFrame;
				var _config = this.config,
					count = _config.count,
					angle = _config.angle,
					stretching = _config.stretching,
					inverse = _config.inverse;
				var stepValues = this._getStepValues();
				var ctx = this.slider;
				var reverseCoords = prev && this.config.inverse;
				var stretch = {
					use: stretching > 0,
					diff: 0,
					gutter: 0
				};
				var step = function step() {
					var _sizes2 = _this9._sizes,
						width = _sizes2.width,
						height = _sizes2.height;
					var w = stretch.use ? width / count : width;
					var prevInversed = prev && inverse && !stretch.use;
					var slicesCoords = _this9._getCoords(count, angle, reverseCoords, stretching);
					var shifts = stepValues.map(function(value) {
						return value.shift(w);
					});
					var lastShift = shifts[shifts.length - 1];
					var frontArgs = _this9._drawArgs(frontSlide, width, height);
					var backArgs = _this9._drawArgs(backSlide, width, height);
					if (stretch.use) {
						stretch.gutter = (w - lastShift) / count * stretching;
						if (prev) {
							// stretch.gutter = (w + lastShift) / count * stretching;
						}
					}
					ctx.canvas.width = width;
					ctx.canvas.height = height;
					// const length = slicesCoords.length;
					var last = slicesCoords.length - 1;
					if (prevInversed || stretch.use && prev) {
						slicesCoords.reverse();
					}
					slicesCoords.forEach(function(coords, s) {
						var length = coords.length;
						var shift = stretch.use ? shifts[s] * (s || 0.5) / 2 : shifts[s];
						var widthGap = stretch.use ? w * (s || 0.5) / 2 : w;
						var bx = backArgs.x + (prev ? shift - widthGap : widthGap - shift);
						var fx = frontArgs.x - (prev ? -shift : shift);
						var _loop2 = function _loop2(i) {
							var _coords$i = _slicedToArray(coords[i], 3),
								x = _coords$i[0],
								y = _coords$i[1],
								xS = _coords$i[2];
							if (stretch.use) {
								var gutter = function gutter() {
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
								return 'continue';
							}
							ctx.save();
							ctx.beginPath();
							ctx.moveTo(x, y);
						};
						for (var i = 0; i < length; i++) {
							var _ret3 = _loop2(i);
							if (_ret3 === 'continue') continue;
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
						_this9._afterSlice();
						return raf(step);
					}
					_this9._afterSlide(prev, toIndex);
				};
				raf(step);
			}
		}, {
			key: '_afterSlice',
			value: function _afterSlice() {
				var event = new window.CustomEvent(this._ns + ':after-slice', {
					detail: this._getDetail()
				});
				this.elements.wrapper.dispatchEvent(event);
			}
		}, {
			key: '_afterSlide',
			value: function _afterSlide(prev, toIndex) {
				if (toIndex === undefined) {
					this._currentIndex = this._currentIndex + (prev ? -1 : 1);
				} else {
					this._currentIndex = toIndex;
				}
				this._isPlaying = false;
				var _elements$dots2 = this.elements.dots,
					dots = _elements$dots2 === undefined ? null : _elements$dots2;
				if (dots !== null) {
					var current = this._currentIndex;
					var dotActive = this._classes.dotActive;
					for (var i = 0; i < dots.children.length; i++) {
						var _dot = dots.children[i];
						_dot.classList.remove(dotActive);
						if (i === current) {
							_dot.classList.add(dotActive);
						}
					}
				}
				// this._drawStatic();
				var event = new window.CustomEvent(this._ns + ':after-slide', {
					detail: this._getDetail(true)
				});
				this.elements.wrapper.dispatchEvent(event);
				if (this.config.autoplay) {
					this._autoplay();
				}
			}
		}, {
			key: '_getDetail',
			value: function _getDetail(fullDetail) {
				var detail = {
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
		}, {
			key: '_getCoords',
			value: function _getCoords(count, angle, reverse, stretching) {
				var _sizes3 = this._sizes,
					width = _sizes3.width,
					sliceHeight = _sizes3.height;
				var odd = count % 2;
				var sides = (odd ? count - 1 : count) / 2;
				var left = count - sides - (odd ? 1 : 0);
				var right = count - sides;
				var radian = (90 - angle) * Math.PI / 180;
				var catheter = parseInt(sliceHeight / Math.tan(radian));
				var sliceWidth = (width + catheter) / count;
				var diff = sliceWidth - catheter;
				var center = (width + catheter) / 2 - (odd ? sliceWidth / 2 : 0);
				var slicesCoords = [];
				var clearance = 4;
				var push = function push(gapTop, gapBottom) {
					var topY = 0;
					var topLeftX = gapTop - clearance;
					var topRightX = gapTop + sliceWidth + clearance;
					var bottomY = sliceHeight;
					var bottomRightX = gapBottom + clearance;
					var bottomLeftX = gapBottom - sliceWidth - clearance;
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
				for (var i = left; i > 0; i--) {
					var gap = center - i * sliceWidth;
					push(gap, gap + diff);
				}
				for (var _i = 0; _i < right; _i++) {
					var _gap = center + _i * sliceWidth;
					push(_gap, _gap + diff);
				}
				return slicesCoords;
			}
		}, {
			key: '_drawArgs',
			value: function _drawArgs(slide, canvasWidth, canvasHeight) {
				var _slide$_sizes = slide._sizes,
					slideWidth = _slide$_sizes.width,
					slideHeight = _slide$_sizes.height;
				var h = function h(x, y) {
					return x / y * 100;
				};
				var h1 = h(canvasHeight, canvasWidth);
				var h2 = h(slideHeight, slideWidth);
				if (h1 >= h2) {
					var width = slideWidth * (canvasHeight / slideHeight);
					var _x9 = (canvasWidth - width) / 2;
					return {
						x: _x9,
						y: 0,
						width: width,
						height: canvasHeight
					};
				}
				var height = slideHeight * (canvasWidth / slideWidth);
				var y = (canvasHeight - height) / 2;
				return {
					x: 0,
					y: y,
					width: canvasWidth,
					height: height
				};
			}
		}, {
			key: '_getElements',
			value: function _getElements(wrapper) {
				this.elements = {
					wrapper: wrapper
				};
				var listSelector = '.' + this._classes.list;
				var list = wrapper.querySelector(listSelector);
				if (list === null) {
					this._error(listSelector + ' not found');
					return false;
				}
				this.elements.list = list;
				var slideSelector = '.' + this._classes.slide;
				var slides = list.querySelectorAll(slideSelector);
				if (slides.length === 0) {
					this._error(slideSelector + ' not found');
					return false;
				}
				this.elements.slides = slides;
				this.elements.arrowPrev = wrapper.querySelector('.' + this._classes.arrowPrev);
				this.elements.arrowNext = wrapper.querySelector('.' + this._classes.arrowNext);
				this.elements.dots = wrapper.querySelector('.' + this._classes.dots);
			}
		}, {
			key: '_addCanvasData',
			value: function _addCanvasData() {
				var canvas = this._createCanvas();
				canvas.classList.add(this._classes.canvas);
				this.elements.list.appendChild(canvas);
				var ctx = canvas.getContext('2d');
				return ctx;
			}
		}, {
			key: '_createCanvas',
			value: function _createCanvas() {
				var canvas = document.createElement('canvas');
				canvas.width = this._sizes.width;
				canvas.heigth = this._sizes.height;
				return canvas;
			}
		}, {
			key: '_createSlides',
			value: function _createSlides(isDone) {
				var _this10 = this;
				this.slides = [];
				var index = 0;
				var done = function done(slide) {
					if (slide instanceof Slide) {
						_this10.slides.push(slide);
					}
					load();
				};
				var load = function load() {
					var element = _this10.elements.slides[index++];
					if (element) {
						var nodeName = element.nodeName.toLowerCase();
						switch (nodeName) {
							case 'img':
								new _this10.SlideImg(element, done); // eslint-disable-line no-new
								break;
							case 'video':
								_this10._warn('Unsupported node ' + nodeName + '! Video will be supported in 2.x version');
								done();
								break;
							default:
								_this10._warn('Unsupported node ' + nodeName + '!');
								done();
						}
					} else {
						isDone();
					}
				};
				load();
			}
		}, {
			key: '_error',
			value: function _error(message) {
				this._isBroken = true;
				console.warn('CanvasSlicer is broken, stop current process!');
				this._warn(message);
			}
		}, {
			key: '_warn',
			value: function _warn(message) {
				console.warn('CanvasSlicer WARN action!');
				console.warn(message);
				if (this.elements && this.elements.wrapper) {
					var event = new window.CustomEvent(this._ns + ':warn', {
						detail: {
							slicer: this,
							message: message
						}
					});
					this.elements.wrapper.dispatchEvent(event);
				}
			}
		}, {
			key: '_currentSlide',
			get: function get() {
				return this.slides[this._currentIndex];
			}
		}, {
			key: '_nextIndex',
			get: function get() {
				var index = this._currentIndex + 1;
				if (index >= this.slides.length) {
					return 0;
				}
				return index;
			}
		}, {
			key: '_nextSlide',
			get: function get() {
				return this.slides[this._nextIndex];
			}
		}, {
			key: '_prevIndex',
			get: function get() {
				var index = this._currentIndex - 1;
				if (index < 0) {
					return this.slides.length - 1;
				}
				return index;
			}
		}, {
			key: '_prevSlide',
			get: function get() {
				return this.slides[this._prevIndex];
			}
		}, {
			key: '_sizes',
			get: function get() {
				return {
					width: this.elements.list.offsetWidth,
					height: this.elements.list.offsetHeight
				};
			}
		}, {
			key: '_ns',
			get: function get() {
				return 'canvas-slicer';
			}
		}, {
			key: '_easingFunctions',
			get: function get() {
				return {
					// no easing, no acceleration
					// linear (t) {
					// 	return t;
					// },
					// accelerating from zero velocity
					easeInQuad: function easeInQuad(t) {
						return t * t;
					},
					// decelerating to zero velocity
					easeOutQuad: function easeOutQuad(t) {
						return t * (2 - t);
					},
					// acceleration until halfway, then deceleration
					easeInOutQuad: function easeInOutQuad(t) {
						return t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;
					},
					// accelerating from zero velocity
					easeInCubic: function easeInCubic(t) {
						return t * t * t;
					},
					// decelerating to zero velocity
					easeOutCubic: function easeOutCubic(t) {
						return --t * t * t + 1;
					},
					// acceleration until halfway, then deceleration
					easeInOutCubic: function easeInOutCubic(t) {
						return t < 0.5 ? 4 * t * t * t : (t - 1) * (2 * t - 2) * (2 * t - 2) + 1;
					},
					// accelerating from zero velocity
					easeInQuart: function easeInQuart(t) {
						return t * t * t * t;
					},
					// decelerating to zero velocity
					easeOutQuart: function easeOutQuart(t) {
						return 1 - --t * t * t * t;
					},
					// acceleration until halfway, then deceleration
					easeInOutQuart: function easeInOutQuart(t) {
						return t < 0.5 ? 8 * t * t * t * t : 1 - 8 * --t * t * t * t;
					},
					// accelerating from zero velocity
					easeInQuint: function easeInQuint(t) {
						return t * t * t * t * t;
					},
					// decelerating to zero velocity
					easeOutQuint: function easeOutQuint(t) {
						return 1 + --t * t * t * t * t;
					},
					// acceleration until halfway, then deceleration
					easeInOutQuint: function easeInOutQuint(t) {
						return t < 0.5 ? 16 * t * t * t * t * t : 1 + 16 * --t * t * t * t * t;
					}
				};
			}
		}, {
			key: '_presets',
			get: function get() {
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
		}, {
			key: '_limits',
			get: function get() {
				return {
					angle: [0, 85],
					count: [2, 150],
					velocity: [0.1, 16],
					desync: [0, 100],
					stretching: [0, 1]
				};
			}
		}, {
			key: '_classes',
			get: function get() {
				return {
					ready: this._ns + '--is-ready',
					arrowPrev: this._ns + '-controls__arrow-prev',
					arrowNext: this._ns + '-controls__arrow-next',
					dots: this._ns + '-controls__dots',
					dot: this._ns + '-controls__dot',
					dotActive: this._ns + '-controls__dot--is-active',
					list: this._ns + '-list',
					get slide() {
						return this.list + '__slide';
					},
					get canvas() {
						return this.list + '__canvas';
					}
				};
			}
		}, {
			key: 'Slide',
			get: function get() {
				return Slide;
			}
		}, {
			key: 'SlideImg',
			get: function get() {
				return SlideImg;
			}
		}, {
			key: 'StepValue',
			get: function get() {
				return StepValue;
			}
		}]);
		return CanvasSlicer;
	}();
	var Slide = function() {
		function Slide(element, isDone) {
			_classCallCheck(this, Slide);
			this.entryElement = element;
			this.isDone = isDone;
			this.load();
		}
		_createClass(Slide, [{
			key: 'load',
			value: function load() {
				this.element = this.entryElement;
				this.isDone(this);
			}
		}, {
			key: 'source',
			value: function source() {
				return this.element;
			}
		}, {
			key: '_sizes',
			get: function get() {
				return {
					width: 0,
					height: 0
				};
			}
		}]);
		return Slide;
	}();
	var SlideImg = function(_Slide) {
		_inherits(SlideImg, _Slide);

		function SlideImg() {
			_classCallCheck(this, SlideImg);
			return _possibleConstructorReturn(this, (SlideImg.__proto__ || Object.getPrototypeOf(SlideImg)).apply(this, arguments));
		}
		_createClass(SlideImg, [{
			key: 'load',
			value: function load() {
				var _this12 = this;
				var img = document.createElement('img');
				img.onload = function() {
					_this12.element = img;
					_this12.isDone(_this12);
				};
				img.onerror = function() {
					_this12.isDone();
				};
				img.src = this.entryElement.src;
			}
		}, {
			key: '_sizes',
			get: function get() {
				return {
					width: this.element.naturalWidth,
					height: this.element.naturalHeight
				};
			}
		}]);
		return SlideImg;
	}(Slide);
	var StepValue = function() {
		function StepValue() {
			var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
			var nextValue = arguments[1];
			_classCallCheck(this, StepValue);
			this.percent = 1;
			this.max = options.max || 150;
			this.desync = options.desync || 16;
			this.easing = options.easing;
			this.velocity = options.velocity || 1.3;
			if (nextValue instanceof StepValue) {
				this.nextValue = nextValue;
			}
		}
		_createClass(StepValue, [{
			key: 'shift',
			value: function shift(width) {
				var t = this.percent / this.max;
				var gap = this.easing(t) * this.max;
				return this.percent >= this.max ? width : width / this.max * gap;
			}
		}, {
			key: 'grow',
			value: function grow() {
				this.percent += this.velocity;
				if (this.nextValue && this.percent > this.desync) {
					this.nextValue.grow();
				}
			}
		}]);
		return StepValue;
	}();
	return CanvasSlicer;
}));
