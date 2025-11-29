/* Eagle Gallery - 2016-03-22 
   http://codecanyon.net/item/eagle-gallery-responsive-touch-zoom-product-gallery/13625789 */
if (typeof Object.create !== "function") {
    Object.create = function (obj) {
        function F() {}
        F.prototype = obj;
        return new F();
    };
}

(function ($, window, document) {

	var Gallery = {

        global: {
            isNoDrag: 0,
            isDrag: 0,
            isZoom: false,
            leftDirection: true,
            rightDirection: true,
            topBottomDirection: false,
            newX: 0,
            newY: 0,
            open: null,
            showMediumImg: true
        },

		init: function(options, el) {
            var gal = this;

            gal.$elem = $(el);
            gal.userOptions = $.extend({}, options);
            gal.options = $.extend({}, $.fn.eagleGallery.options, options);
            
            gal.miniOptions = $.extend({}, $.fn.eagleGallery.options.miniSlider);
            if (options && options.miniSlider)
            {
                gal.miniOptions = $.extend(gal.miniOptions, options.miniSlider);
            }

            gal.galleryOptions = $.extend({}, $.fn.eagleGallery.options.gallerySlider);
            if (options && options.gallerySlider)
            {
                gal.galleryOptions = $.extend(gal.galleryOptions, options.gallerySlider);
            }
            
            gal.$elem.append('<div class="is-mobile"></div>');

            if (gal.options.miniSliderArrowPos == 'inside') {
                gal.$elem.addClass('in');
            }

            if (gal.options.miniSliderArrowStyle == 1) {
                gal.$elem.addClass('as1');
            }
            if (gal.options.miniSliderArrowStyle == 2) {
                gal.$elem.addClass('as2');
            }

            if (gal.options.showMediumImg == true) {
                var medium_src = gal.$elem.find('img:nth-of-type(1)').data('medium-img');
                gal.$elem.prepend('<div class="eagle-medium-wrap"><a class="eagle-view-medium-img"><img src="'+ medium_src +'" alt=""></a><div class="scale-ico"></div></div>');

                gal.$medium = gal.$elem.find('.eagle-medium-wrap');

                gal.global.showMediumImg = true;
            } else {
                gal.global.showMediumImg = false;

                if (gal.options.autoPlayMediumImg !== false) {
                    gal.miniOptions.autoPlay = gal.options.autoPlayMediumImg;
                    gal.miniOptions.stopOnHover = true;
                    gal.miniOptions.rewindNav = true;
                    gal.options.autoPlayMediumImg = false;
                }
            }

            if (gal.options.autoPlayMediumImg !== false) {
                gal.miniOptions.autoPlay = false;
            }

            if (gal.options.hideOneThumb) {
                if (gal.$elem.find('.owl-carousel > *').length <= 1) {
                    gal.$elem.find('.owl-carousel').addClass('hideOne');
                }
                
            }

            gal.$elem.find('.owl-carousel').owlCarouselE(gal.miniOptions);
            gal.miniSlider = gal.$elem.find('.owl-carousel').data('owlCarouselE');

            if (gal.options.showMediumImg == true) {
                gal.showMediumImg();
            }
            
            gal.openGallery();
        },
        
        showMediumImg: function() {
            var gal = this;

            gal.$elem.on('click', '.owl-carousel.'+gal.miniOptions.theme+' .owl-item img', function(event) {
                event.preventDefault();
                if (gal.global.isNoDrag == 0) {
                    gal.changeMediumImg($(this), false);
                }
            });

            /* auto Play Medium Image */
            if (gal.options.autoPlayMediumImg === true) {
                gal.options.autoPlayMediumImg = 5000;
            }

            if (gal.options.autoPlayMediumImg !== false) {
                if (gal.options.changeMediumStyle !==false) {
                    if (gal.options.autoPlayMediumImg < gal.options.changeMediumSpeed) {
                        gal.options.autoPlayMediumImg = gal.options.changeMediumSpeed;
                    }
                }

                window.clearInterval(gal.autoPlayMediumInterval);
                gal.playMedium();
                var isTouch = "ontouchstart" in window || window.navigator.msMaxTouchPoints;
                if (isTouch) {
                    gal.stopMediumOnTouch();
                } else {
                    gal.stopMediumOnHover();
                }
            }
            /* auto Play Medium Image end */
        },

        playMedium: function() {
            var gal = this;

            var lengthItem = gal.$elem.find('.owl-carousel.'+gal.miniOptions.theme+' .owl-item').length;
            var currentItemIndex, nextItem, nextItemIndex;

            window.clearInterval(gal.autoPlayMediumInterval);
            gal.autoPlayMediumInterval = window.setInterval(function() {
                currentItemIndex = gal.$elem.find('.owl-carousel.'+gal.miniOptions.theme+' .owl-item.active').index()+1;
                nextItemIndex = currentItemIndex+1;
                if (nextItemIndex > lengthItem) { nextItemIndex = 1; }
                nextItem = gal.$elem.find('.owl-carousel.'+gal.miniOptions.theme+' .owl-item:nth-of-type('+nextItemIndex+') img');
        
                gal.changeMediumImg(nextItem, true);

            }, gal.options.autoPlayMediumImg);
        },

        stopMedium: function () {
            var gal = this;
            window.clearInterval(gal.autoPlayMediumInterval);
        },

        stopMediumOnHover: function() {
            var gal = this;
            gal.$elem.on("mouseover", function() {
                gal.stopMedium();
            });
            gal.$elem.on("mouseout", function() {
                gal.playMedium();
            });
        },

        stopMediumOnTouch: function() {
            var gal = this;

            gal.$elem.on("touchstart", function() {
                gal.stopMedium();

                $(document).on("touchend", function() {
                    gal.playMedium();
                });
            });
        },

        changeMediumImg: function($this, soursPlay) {
            var gal = this;

            var changeMediumStyle = {
                slideIn: function(newIndex, oldIndex) {
                    if (newIndex > oldIndex) {
                        gal.$medium.addClass('slideInNext');
                    }
                    if (newIndex < oldIndex) {
                        gal.$medium.addClass('slideInPrev');
                    }
                },
                slideOut: function(newIndex, oldIndex) {
                    if (newIndex > oldIndex) {
                        gal.$medium.addClass('slideOutNext');
                    }
                    if (newIndex < oldIndex) {
                        gal.$medium.addClass('slideOutPrev');
                    }
                },
                scaleIn: function() {
                    gal.$medium.addClass('scaleIn');
                },
                scaleOut: function() {
                    gal.$medium.addClass('scaleOut');
                }
            }

            var new_src = $this.data('medium-img');
            var $img = $('<img>', { src: new_src });
            var newIndex = $this.parent().index();
            var oldIndex = gal.$elem.find('.owl-item.active').index();

            if (newIndex != oldIndex) {
                var showLoading = setTimeout(function() {
                    gal.$medium.append('<div class="loading">Loading...</div>');
                }, 500);
                
                $img.load(function() {
                    clearTimeout(showLoading);
                    if (gal.$medium.find('.loading').length) {
                        gal.$medium.find('.loading').remove();
                    }

                    if (gal.options.changeMediumStyle == false) {
                        gal.$elem.find('.eagle-view-medium-img img').attr('src', new_src);
                        
                        if (soursPlay) {
                            gal.miniSlider.goTo(newIndex);
                        }
                    } else {
                        iterations = 0;
                        
                        if (gal.options.changeMediumStyle == true) {
                            var num = 1 + Math.floor(Math.random() * 4);

                            if (num == 1) {
                                changeMediumStyle.slideIn(newIndex, oldIndex);
                            }
                            if (num == 2) {
                                changeMediumStyle.slideOut(newIndex, oldIndex);
                            }
                            if (num == 3) {
                                changeMediumStyle.scaleIn();
                            }
                            if (num == 4) {
                                changeMediumStyle.scaleOut();
                            }
                        }

                        if (gal.options.changeMediumStyle == "slideIn") {
                            changeMediumStyle.slideIn(newIndex, oldIndex);
                        }
                        if (gal.options.changeMediumStyle == "slideOut") {
                            changeMediumStyle.slideOut(newIndex, oldIndex);
                        }
                        if (gal.options.changeMediumStyle == "scaleIn") {
                            changeMediumStyle.scaleIn();
                        }
                        if (gal.options.changeMediumStyle == "scaleOut") {
                            changeMediumStyle.scaleOut();
                        }

                        gal.$medium.append('<a class="eagle-view-medium-img ea-show"><img src="'+ new_src +'" alt=""></a>');
                        gal.$medium.find('a').css(Carousel.addCssSpeed(gal.options.changeMediumSpeed));
                        
                        /* medium change start */
                        setTimeout(function() {
                            gal.$medium.find('a').not('.ea-show').addClass('ea-hide');
                            gal.$medium.find('a').removeClass('ea-show');
                        }, 60);

                        /* medium change ended */
                        setTimeout(function() {
                            gal.$medium.find('a.ea-hide').remove();
                            gal.$medium.removeClass('slideInNext')
                                        .removeClass('slideInPrev')
                                        .removeClass('slideOutNext')
                                        .removeClass('slideOutPrev')
                                        .removeClass('scaleIn')
                                        .removeClass('scaleOut');
                        }, gal.options.changeMediumSpeed + 60);

                        if (soursPlay) {
                            setTimeout(function() {
                                gal.miniSlider.goTo(newIndex);
                            }, 60);
                        }
                    }
                });
            }

            gal.$elem.find('.owl-carousel.'+gal.miniOptions.theme+' .owl-item').removeClass('active');
            $this.parent().addClass('active');
            
        },

        openGallery: function() {
            var gal = this;

            if (gal.options.showMediumImg == true) {
                gal.$elem.on('click', '.eagle-medium-wrap', function(event) {
                    event.preventDefault();
                    gal.createGallery();
                });
            } else {
                var newIndex = $(this).parent().index();
                var oldIndex = gal.$elem.find('.owl-item.active').index();

                gal.$elem.on('click', '.owl-carousel.'+gal.miniOptions.theme+' .owl-item img', function(event) {
                    event.preventDefault();
                    if (gal.global.isNoDrag == 0) {
                        gal.$elem.find('.owl-item').removeClass('active');
                        $(this).parent().addClass('active');

                        gal.createGallery();
                    }
                });
            }
            
        },
        
        createGallery: function() {
            var gal = this;
            var bigImages = '';
            var $mini = gal.$elem.find('.'+gal.miniOptions.theme);

            if (gal.options.autoPlayMediumImg !== false) {
                gal.stopMedium();
            }

            gal.numberOfimages = $mini.find('.owl-item').length;
            gal.currentImage = $mini.find(' .owl-item.active').index()+1;

            $mini.find('.owl-item').each(function() {
                var $this = $(this);
                var src = $this.find('img').data('big-img');
                var title = $this.find('img').data('title');

                if (title) {
                    bigImages = bigImages + '<div class="eagle-item" data-scale="1"><img src="'+ src +'"><div class="title"><span>'+ title +'</span></div></div>';
                }
                else {
                    bigImages = bigImages + '<div class="eagle-item" data-scale="1"><img src="'+ src +'"></div>';
                }
            })

            gal.$elem.append('<div class="eagle-open-gallery">'+
                '<div class="top-controls">'+
                    '<div class="ea-progress">'+
                        '<div class="ea-current">'+ gal.currentImage +'</div>'+
                        '<div>/</div>'+
                        '<div class="ea-all">'+ gal.numberOfimages +'</div>'+
                    '</div>'+
                    
                    '<div class="eagle-close"><span></span></div>'+
                '</div>'+
                
                '<div class="eagle-prev"><span></span></div>'+
                
                '<div class="view-big-img">'+
                    '<div class="owl-carousel">'+
                        bigImages
                    +'</div>'+                  
                '</div>'+
                
                '<div class="eagle-next"><span></span></div>'+

                '<div class="bottom-controls">'+
                    '<div class="eagle-scale">'+
                        '<div class="ea-zoom ea-minus"><span></span></div>'+
                        '<div class="ea-magnifier"></div>'+
                        '<div class="ea-zoom ea-plus"><span></span></div>'+
                    '</div>'+
                '</div>'+
            '</div>');

            gal.$gall = gal.$elem.find('.eagle-open-gallery');

            if (gal.options.bottomControlLine) {
                gal.$gall.addClass('eagle-bottom-line');
            }

            if (gal.options.openGalleryStyle == "transform") {
                gal.$gall.addClass('transform');
                gal.$gall.find('.top-controls, .bottom-controls, .view-big-img, .eagle-prev, .eagle-next').addClass('ea-hide');
            }

            gal.$gall.addClass(gal.options.theme);

            if (gal.currentImage == 1) {
                gal.$gall.find('.eagle-prev').addClass('disabled');
            } else {
                if (gal.currentImage == $mini.find('.owl-item').length) {
                    gal.$gall.find('.eagle-next').addClass('disabled');
                }
            }

            if (gal.numberOfimages == 1) {
                gal.$gall.find('.eagle-next').addClass('disabled');
            }

            gal.global.open = gal.$gall;
            
            gal.showGallery();
        },

        showGallery: function() {
            var gal = this;
            /* hide scroll and add padding-right */
            var bodyWidth = $('body').width(),
                bodyOuterWidth = $('body').outerWidth(),
                scrollWidth;

            if (bodyWidth != bodyOuterWidth) {
                $('body').css({'padding-right': 0});
                gal.bodyRightPadding = bodyOuterWidth - $('body').width();
                gal.bodyRightPadding = bodyOuterWidth - bodyWidth - gal.bodyRightPadding;
            }

            $('body').css({'overflow': 'hidden'});
            scrollWidth = $('body').outerWidth() - bodyOuterWidth;
            if (gal.bodyRightPadding != undefined) {
                $('body').css({'padding-right': scrollWidth + gal.bodyRightPadding});
            } else {
                $('body').css({'padding-right': scrollWidth});
            }
            /* hide scroll and add padding-right end */

            gal.$gall.css(Carousel.addCssSpeed(gal.options.openGallerySpeed));

            if (gal.options.openGalleryStyle == "show") {
                setTimeout(function() {
                    gal.$gall.css({'opacity': 1});
                }, 10); 
            }

            if (gal.options.openGalleryStyle == "transform") {
                setTimeout(function() {
                    gal.$gall.css({
                        'opacity': 1,
                        '-webkit-transform':  'scale3d(1, 1, 1)',
                        '-o-transform':       'scale3d(1, 1, 1)',
                        '-ms-transform':      'scale3d(1, 1, 1)',
                        '-moz-transform':     'scale3d(1, 1, 1)',
                        'transform':        'scale3d(1, 1, 1)'
                    });
                }, 10);

                setTimeout(function() {
                    gal.$gall.find('.top-controls, .bottom-controls').removeClass('ea-hide');   
                }, gal.options.openGallerySpeed + 400);

                setTimeout(function() {
                    function checkImage() {
                        iterations += 1;
                        
                        if ( Carousel.completeImg(gal.$gall.find('.owl-item.active img').get(0)) ) {
                            gal.$gall.find('.view-big-img').removeClass('ea-hide');
                        } else if (iterations <= 100) { //if image loads in less than 10 seconds 
                            window.setTimeout(checkImage, 100);
                        } else {
                            gal.$gall.find('.view-big-img').removeClass('ea-hide');
                        }
                    };

                    var iterations = 0;
                    checkImage();
                }, gal.options.openGallerySpeed + 800);

                setTimeout(function() {
                    if (gal.$elem.find('.transform').length) {
                        gal.$gall.find('.eagle-prev, .eagle-next').removeClass('ea-hide');
                    }
                }, gal.options.openGallerySpeed + 1300);

                setTimeout(function() {
                    if (gal.$elem.find('.transform').length) {
                        gal.$gall.removeClass('transform');    
                    }
                }, gal.options.openGallerySpeed + 2300);
            }

            gal.$gall.bind("touchmove", function(event){
                event.preventDefault();
            });

            gal.$gall.find('.owl-carousel').owlCarouselE(gal.galleryOptions);
            gal.owlGallery = gal.$gall.find(".owl-carousel").data('owlCarouselE');

            gal.owlGallery.jumpTo(gal.currentImage-1);

            gal.whenGalleryOpened();
        },

        whenGalleryOpened: function() {
            var gal = this;

            gal.$gall.find('.top-controls, .bottom-controls').css(Carousel.addCssSpeed(gal.options.hideControlsSpeed));

            gal.galleryEvents();
            gal.mouseDown();
            gal.gestures();
            gal.response();
        },

        galleryEvents: function() {
            var gal = this;

            gal.$gall.on('click', '.eagle-prev', function () {
                gal.owlGallery.prev();
            });

            gal.$gall.on('click', '.eagle-next', function () {
                gal.owlGallery.next();
            });

            gal.$gall.on('click', '.view-big-img', function () {
                gal.hideControls();
            });

            gal.$gall.on('click', '.eagle-close', function () {
                gal.close();
            });
        },

        mouseDown: function() {
            var gal = this;

            gal.$gall.find('.eagle-item').on('mousedown', function() {
                $(this).addClass('mouse-down');
            }).on('mouseup', function() {
                $(this).removeClass('mouse-down');
            })
        },

        /* Zoom img */
        gestures: function() {
            var gal = this,
                startTouches = null,
                scale,
                distance,
                oldDistance,
                dataScale,
                startScale;

            gal.ev_types = {
                startZoom: "touchstart",
                moveZoom: "touchmove",
                endZoom: "touchend touchcancel"
            };

            gal.$gall.on('click', '.eagle-scale .ea-plus', function () {
                var elem = gal.$gall.find('.owl-item.active .eagle-item');
                scale = elem.data('scale');
 
                if (scale % 1 != 0) {
                    scale = parseInt(scale, 10);
                }

                if (scale < gal.options.maxZoom) {
                    if (scale == 1) {
                        gal.hideTitle(elem.find('.title'));
                    }
                    
                    clearTimeout(window.remTran);
                    elem.css(Carousel.addCssSpeed(200));
                    scale++;
                    gal.updateImg(elem, scale, gal.global.newX, gal.global.newY);
                    window.remTran = setTimeout(function() {
                        elem.css(Carousel.removeTransition());
                        gal.direction(elem, scale);
                    }, 200);
                    elem.data('scale', scale).attr('data-scale', scale);
                }
            });

            gal.$gall.on('click', '.eagle-scale .ea-minus', function () {
                var elem = gal.$gall.find('.owl-item.active .eagle-item');
                scale = elem.data('scale');
 
                if (scale % 1 != 0) {
                    scale = parseInt(scale, 10);
                } else {
                    if (scale > 1) {
                        scale--;
                    }
                }

                if (scale == 1) {
                    gal.showTitle(elem.find('.title'));
                }

                gal.newPos(elem, scale);
                
                clearTimeout(window.remTran);
                elem.css(Carousel.addCssSpeed(200));
                gal.updateImg(elem, scale, gal.global.newX, gal.global.newY);
                window.remTran = setTimeout(function() {
                    elem.css(Carousel.removeTransition());
                    gal.direction(elem, scale);
                }, 200);
                elem.data('scale', scale).attr('data-scale', scale);
            });

            function getTouches(event) {
                var position = gal.$gall.find('.owl-item.active').offset();

                if (event.touches !== undefined) {
                    return $.map(event.touches, function(touch) {
                        return {
                            x : touch.pageX - position.left,
                            y : touch.pageY - position.top
                        };
                    });
                }

                if (event.touches === undefined) {
                    if (event.pageX !== undefined) {
                        return $.map(event, function(event) {
                            return {
                                x : event.pageX,
                                y : event.pageY
                            };
                        });
                    }
                    if (event.pageX === undefined) {
                        return $.map(event, function(event) {
                            return {
                                x : event.clientX,
                                y : event.clientY
                            };
                        });
                    }
                }
            };

            function getDistance(a, b) {
                var x, y;
                x = a.x - b.x;
                y = a.y - b.y;
                return Math.sqrt(x * x + y * y);
            };

            function calculateScale(startTouches, endTouches) {
                var startDistance = getDistance(startTouches[0], startTouches[1]),
                    endDistance = getDistance(endTouches[0], endTouches[1]);
                    
                return endDistance / startDistance;
            };

            function getTouchCenter(touches) {
                var pos = getTouches(touches),
                    x, y;

                x = pos[0].x + (pos[1].x - pos[0].x)/2;
                y = pos[0].y + (pos[1].y - pos[0].y)/2;
                return { x: x, y: y };
            };

            function update(element, value) {
                var transform3d = 'scale3d('+value+', '+value+', 1)';
                element.css({
                            '-webkit-transform':  transform3d,
                            '-o-transform':       transform3d,
                            '-ms-transform':      transform3d,
                            '-moz-transform':     transform3d,
                            'transform':        transform3d
                        });
            };

            function eventsZoomSwap(type) {
                if (type === "on") {
                    gal.$gall.on(gal.ev_types.moveZoom, ".owl-item", zoomMove);
                    gal.$gall.on(gal.ev_types.endZoom, ".owl-item", zoomEnd);
                } else if (type === "off") {
                    gal.$gall.off(gal.ev_types.moveZoom, ".owl-item", zoomMove);
                    gal.$gall.off(gal.ev_types.endZoom, ".owl-item", zoomEnd);
                }
            };

            function zoomStart(event) {
                var ev = event.originalEvent || event || window.event,
                    $this = $(this).find('.eagle-item');

                if (gal.global.isDrag != 0) {
                    return false;
                }

                if (ev.touches.length === 2) {
                    ev.preventDefault(); 

                    gal.global.isZoom = true;
                    startTouches = getTouches(ev);
                    oldDistance = getDistance(startTouches[0], getTouches(ev)[1]);

                    dataScale = $this.data('scale');
                    scale = dataScale;
                    oldScale = dataScale;

                    if ( !$this.find('.title.hideTitle').length && !$this.find('.title.hideTitleMobile').length) {
                        gal.hideTitle($this.find('.title'));
                    }
                    eventsZoomSwap("on");
                };
            };

            function zoomMove(event) {
                var ev = event.originalEvent || event || window.event;
                var $this = $(this).find('.eagle-item');

                if (scale < gal.options.maxZoom) {
                    scale = oldScale * calculateScale(startTouches, getTouches(ev));
                    if (scale > gal.options.maxZoom) {
                        scale = gal.options.maxZoom;
                    }
                    gal.newPos($this, scale);
                    gal.updateImg($this, scale, gal.global.newX, gal.global.newY);
                    gal.direction($this, scale);
                } else {
                    oldScale = gal.options.maxZoom;
                    scale = oldScale * calculateScale(startTouches, getTouches(ev));
                    startTouches = getTouches(ev);
                }
            };

            function zoomEnd(event) {
                var ev = event.originalEvent || event || window.event,
                    $this = $(this).find('.eagle-item');
                gal.global.isZoom = false;

                if (scale > gal.options.maxZoom) {
                    scale = gal.options.maxZoom;
                }

                if (scale < 1 || Math.abs(scale - 1) < 0.01) {
                    scale = 1;

                    $this.css(Carousel.addCssSpeed(300));
                    gal.updateImg($this, scale, gal.global.newX, gal.global.newY);
                    setTimeout(function() {
                        $this.css(Carousel.removeTransition());
                        gal.direction($this, scale);
                    }, 300);

                    if (!gal.$gall.find('.top-controls.ea-hide').length) {
                        gal.showTitle($this.find('.title'));
                    }
                }
                $this.data('scale', scale).attr('data-scale', scale);

                gal.direction($this, scale);

                eventsZoomSwap("off");
            };

            gal.$gall.on(gal.ev_types.startZoom, ".owl-item", zoomStart);
        },

        updateImg: function(element, scale, newX, newY) {
            var gal = this,
                scale3d = 'scale3d('+scale+', '+scale+', 1)',
                translate3d = 'translate3d('+newX+'px, '+newY+'px, 0px)';

            element.css({
                        '-webkit-transform':  scale3d + translate3d,
                        '-o-transform':       scale3d + translate3d,
                        '-ms-transform':      scale3d + translate3d,
                        '-moz-transform':     scale3d + translate3d,
                        'transform':        scale3d + translate3d
                    });
        },

        direction: function(element, scale) {
            var gal = this,
                img = element.find('img');

            /* left direction */
            if (img.offset().left + 3 >= element.closest('.owl-item').offset().left) {
                gal.global.leftDirection = true;
            } else {
                gal.global.leftDirection = false;
            }

            /* right direction */
            if (img.offset().left + img.width()*scale - 3 <= element.closest('.owl-item').offset().left + element.closest('.owl-item').width()) {
                gal.global.rightDirection = true;
            } else {
                gal.global.rightDirection = false;
            }

            /* top and bottom direction */
            if (img.height()*scale - 2 > element.closest('.owl-item').height()) {
                gal.global.topBottomDirection = true;
            } else {
                gal.global.topBottomDirection = false;
            }
        },

        newPos: function(element, scale) {
            var gal = this,
                img = element.find('img');

            if (img.width()*scale > element.closest('.owl-item').width()) {
                var wQ = (img.width()*scale - element.closest('.owl-item').width()) / 2;
                var wD = gal.global.newX*scale;

                if (wD > wQ) {
                    gal.global.newX = (img.width()*scale - element.closest('.owl-item').width()) / (scale * 2);
                }
                if (-wD > wQ) {
                    gal.global.newX = (element.closest('.owl-item').width() - img.width()*scale) / (scale * 2);
                }
            } else {
                gal.global.newX = 0;
            }

            if (img.height()*scale > element.closest('.owl-item').height()) {
                var hQ = (img.height()*scale - element.closest('.owl-item').height()) / 2;
                var hD = gal.global.newY*scale;

                if (hD > hQ) {
                    gal.global.newY = (img.height()*scale - element.closest('.owl-item').height()) / (scale * 2);
                }
                if (-hD > hQ) {
                    gal.global.newY = (element.closest('.owl-item').height() - img.height()*scale) / (scale * 2);
                }
            } else {
                gal.global.newY = 0;
            }
        },
        /* Zoom img end */

        response : function () {
            var gal = this,
                responseDelay,
                lastWindowWidth,
                lastWindowHeight;
            
            lastWindowWidth = $(window).width();
            lastWindowHeight = $(window).height();

            gal.resizer = function () {
                if (!gal.$gall) {
                    return false;
                }
                if ($(window).width() !== lastWindowWidth || $(window).height() !== lastWindowHeight) {
                    
                    window.clearTimeout(responseDelay);
                    responseDelay = window.setTimeout(function () {
                        lastWindowWidth = $(window).width();
                        lastWindowHeight = $(window).height();
                        var $elem = gal.$gall.find('.owl-item.active .eagle-item'),
                            scale = $elem.data('scale');

                        gal.newPos($elem, scale);
                        gal.updateImg($elem, scale, gal.global.newX, gal.global.newY);
                        gal.direction($elem, scale);

                        var $owlItem = gal.$gall.find('.owl-item');
                        if (gal.isMobile()) {
                            $owlItem.each(function() {
                                var $title = $(this).find('.title');
                                if ($title.hasClass('hideTitle')) {
                                    $title.addClass('hideTitleMobile');
                                    $title.removeClass('hideTitle');
                                } 
                            });
                        } else {
                            $owlItem.each(function() {
                                var $title = $(this).find('.title');
                                if ($title.hasClass('hideTitleMobile')) {
                                    $title.addClass('hideTitle');
                                    $title.removeClass('hideTitleMobile');
                                }
                            });
                        }

                        if (!gal.isMobile() && gal.$gall.find('.top-controls').hasClass('ea-hide')) {  
                            gal.$gall.find('.top-controls, .bottom-controls').toggleClass('ea-hide');
                            $owlItem.each(function() {
                                var scale = $(this).find('.eagle-item').data('scale');
                                if (scale == 1) {
                                    gal.showTitle($(this).find('.title'));
                                }
                            });
                            
                        }
                        
                    }, 200);
                }
            };
            $(window).resize(gal.resizer);
        },

        hideTitle: function(title) {
            var gal = this;
            if (!title.length) {
                return false;
            }
            title.css(Carousel.addCssSpeed(gal.options.hideControlsSpeed));
            if (gal.isMobile()) {
                title.addClass('hideTitleMobile');
            } else {
                title.addClass('hideTitle');
            }
            setTimeout(function() {
                title.css(Carousel.removeTransition(gal.options.hideControlsSpeed));
            }, 200);
        },

        showTitle: function(title) {
            var gal = this;
            if (!title.length) {
                return false;
            }
            title.css(Carousel.addCssSpeed(gal.options.hideControlsSpeed));
            if (gal.isMobile()) {
                title.removeClass('hideTitleMobile');
            } else {
                title.removeClass('hideTitle');
            }
            setTimeout(function() {
                title.css(Carousel.removeTransition(gal.options.hideControlsSpeed));
            }, 200);
        },

        hideControls: function() {
            var gal = this;

            if ( gal.isMobile() && gal.global.isNoDrag == 0 ) {  
                gal.$gall.find('.top-controls, .bottom-controls').toggleClass('ea-hide');

                var $owlItem = gal.$gall.find('.owl-item');
                
                    if (gal.$gall.find('.top-controls').hasClass('ea-hide')) {
                        $owlItem.each(function() {
                            var scale = $(this).find('.eagle-item').data('scale');
                            if (scale == 1) {
                                gal.hideTitle($(this).find('.title'));
                            }
                        });
                    } else {
                        $owlItem.each(function() {
                            var scale = $(this).find('.eagle-item').data('scale');
                            if (scale == 1) {
                                gal.showTitle($(this).find('.title'));
                            }
                        });
                    }
                
            }
        },

        close: function() {
            var gal = this;
            gal.$gall.css({'opacity': 0});
            gal.global.isZoom = false;
            gal.global.leftDirection = true;
            gal.global.rightDirection = true;
            gal.global.topBottomDirection = false;
            gal.global.open = null;

            setTimeout(function() {
                gal.owlGallery.destroy();
                gal.$gall.remove();
                gal.$gall = undefined;
                /* show scroll */
                if (gal.bodyRightPadding != undefined) {
                    $('body').css({'padding-right': gal.bodyRightPadding, 'overflow': 'auto'});
                } else {
                    $('body').css({'padding-right': 0, 'overflow': 'auto'});
                }

                if (gal.options.autoPlayMediumImg !== false) {
                    gal.playMedium();
                }
            }, gal.options.openGallerySpeed );
        },

        isMobile: function() {
            var gal = this;

            if (gal.$elem.find('.is-mobile').is(':visible')) {
                return true;
            } else {
                return false;
            }
        }   

	};

	$.fn.eagleGallery = function(options) {
		return this.each(function() {
            var galler = Object.create(Gallery);
			galler.init(options, this);
		});
	};

    $.fn.eagleGallery.options = {
        maxZoom: 4,
        miniSliderArrowPos: 'outside',
        miniSliderArrowStyle: 1,
        showMediumImg: true,
        changeMediumStyle: false,
        changeMediumSpeed: 600,
        autoPlayMediumImg: false,
        hideOneThumb: true,
        openGalleryStyle: 'show',
		openGallerySpeed: 300,
		hideControlsSpeed: 200,
        theme: 'dark',
        bottomControlLine: false,
		miniSlider: {
			navigation: true,
			pagination: false,
			navigationText: false,
            rewindNav: false,
			theme: 'mini-slider',
			responsiveBaseWidth: '.eagle-gallery',
			itemsCustom: [[0, 1],[250, 2], [450, 3], [650, 4], [850, 5], [1050, 6], [1250, 7], [1450, 8]],
            margin: 10
		},
		gallerySlider: {
			singleItem: true,
			navigation: false,
			pagination: false,
			rewindNav: false,
			addClassActive: true,
			theme: 'gallery-slider',
            galleryslider: true
		}
	};
	

    
	
	/* 
	 *   owlCarousel
	 */
	var Carousel = {
        init : function (options, el) {
            var base = this;

            base.$elem = $(el);
            base.options = $.extend({}, $.fn.owlCarouselE.options, base.$elem.data(), options);

            base.userOptions = options;
            base.loadContent();
        },

        loadContent : function () {
            var base = this, url;

            function getData(data) {
                var i, content = "";
                if (typeof base.options.jsonSuccess === "function") {
                    base.options.jsonSuccess.apply(this, [data]);
                } else {
                    for (i in data.owl) {
                        if (data.owl.hasOwnProperty(i)) {
                            content += data.owl[i].item;
                        }
                    }
                    base.$elem.html(content);
                }
                base.logIn();
            }

            if (typeof base.options.beforeInit === "function") {
                base.options.beforeInit.apply(this, [base.$elem]);
            }

            if (typeof base.options.jsonPath === "string") {
                url = base.options.jsonPath;
                $.getJSON(url, getData);
            } else {
                base.logIn();
            }
        },

        logIn : function () {
            var base = this;

            base.$elem.data("owl-originalStyles", base.$elem.attr("style"));
            base.$elem.data("owl-originalClasses", base.$elem.attr("class"));

            base.$elem.css({opacity: 0});
            base.orignalItems = base.options.items;
            base.checkBrowser();
            base.wrapperWidth = 0;
            base.checkVisible = null;
            base.setVars();
        },

        setVars : function () {
            var base = this;
            if (base.$elem.children().length === 0) {return false; }
            base.baseClass();
            base.eventTypes();
            base.$userItems = base.$elem.children();
            base.itemsAmount = base.$userItems.length;
            base.wrapItems();
            base.$owlItems = base.$elem.find(".owl-item");
            base.$owlWrapper = base.$elem.find(".owl-wrapper");
            base.playDirection = "next";
            base.prevItem = 0;
            base.prevArr = [0];
            base.currentItem = 0;
            base.customEvents();
            base.onStartup();
        },

        onStartup : function () {
            var base = this;
            base.updateItems();
            base.calculateAll();
            base.buildControls();
            base.updateControls();
            base.response();
            base.moveEvents();
            base.stopOnHover();
            base.owlStatus();

            if (base.options.transitionStyle !== false) {
                base.transitionTypes(base.options.transitionStyle);
            }
            if (base.options.autoPlay === true) {
                base.options.autoPlay = 5000;
            }
            base.play();

            base.$elem.find(".owl-wrapper").css("display", "block");

            if (!base.$elem.is(":visible")) {
                base.watchVisibility();
            } else {
                base.$elem.css("opacity", 1);
            }
            base.onstartup = false;
            base.eachMoveUpdate();
            if (typeof base.options.afterInit === "function") {
                base.options.afterInit.apply(this, [base.$elem]);
            }

            if (!base.options.galleryslider) {
                base.$elem.find('.owl-item:first-child').addClass('active');
            }
        },

        eachMoveUpdate : function () {
            var base = this;

            if (base.options.lazyLoad === true) {
                base.lazyLoad();
            }
            if (base.options.autoHeight === true) {
                base.autoHeight();
            }
            base.onVisibleItems();

            if (typeof base.options.afterAction === "function") {
                base.options.afterAction.apply(this, [base.$elem]);
            }
        },

        updateVars : function () {
            var base = this;
            if (typeof base.options.beforeUpdate === "function") {
                base.options.beforeUpdate.apply(this, [base.$elem]);
            }
            base.watchVisibility();
            base.updateItems();
            base.calculateAll();
            base.updatePosition();
            base.updateControls();
            base.eachMoveUpdate();
            if (typeof base.options.afterUpdate === "function") {
                base.options.afterUpdate.apply(this, [base.$elem]);
            }
        },

        reload : function () {
            var base = this;
            window.setTimeout(function () {
                base.updateVars();
            }, 0);
        },

        watchVisibility : function () {
            var base = this;

            if (base.$elem.is(":visible") === false) {
                base.$elem.css({opacity: 0});
                window.clearInterval(base.autoPlayInterval);
                window.clearInterval(base.checkVisible);
            } else {
                return false;
            }
            base.checkVisible = window.setInterval(function () {
                if (base.$elem.is(":visible")) {
                    base.reload();
                    base.$elem.animate({opacity: 1}, 200);
                    window.clearInterval(base.checkVisible);
                }
            }, 500);
        },

        wrapItems : function () {
            var base = this;
            base.$userItems.wrapAll("<div class=\"owl-wrapper\">").wrap("<div class=\"owl-item\"></div>");
            base.$elem.find(".owl-wrapper").wrap("<div class=\"owl-wrapper-outer\">");
            base.wrapperOuter = base.$elem.find(".owl-wrapper-outer");
            base.$elem.css("display", "block");
        },

        baseClass : function () {
            var base = this,
                hasBaseClass = base.$elem.hasClass(base.options.baseClass),
                hasThemeClass = base.$elem.hasClass(base.options.theme);

            if (!hasBaseClass) {
                base.$elem.addClass(base.options.baseClass);
            }

            if (!hasThemeClass) {
                base.$elem.addClass(base.options.theme);
            }
        },

        updateItems : function () {
            var base = this, width, i;

            if (base.options.responsive === false) {
                return false;
            }
            if (base.options.singleItem === true) {
                base.options.items = base.orignalItems = 1;
                base.options.itemsCustom = false;
                base.options.itemsDesktop = false;
                base.options.itemsDesktopSmall = false;
                base.options.itemsTablet = false;
                base.options.itemsTabletSmall = false;
                base.options.itemsMobile = false;
                return false;
            }

            width = base.$elem.closest($(base.options.responsiveBaseWidth)).width();

            if (width > (base.options.itemsDesktop[0] || base.orignalItems)) {
                base.options.items = base.orignalItems;
            }
            if (base.options.itemsCustom !== false) {
                //Reorder array by screen size
                base.options.itemsCustom.sort(function (a, b) {return a[0] - b[0]; });

                for (i = 0; i < base.options.itemsCustom.length; i += 1) {
                    if (base.options.itemsCustom[i][0] <= width) {
                        base.options.items = base.options.itemsCustom[i][1];
                    }
                }

            } else {

                if (width <= base.options.itemsDesktop[0] && base.options.itemsDesktop !== false) {
                    base.options.items = base.options.itemsDesktop[1];
                }

                if (width <= base.options.itemsDesktopSmall[0] && base.options.itemsDesktopSmall !== false) {
                    base.options.items = base.options.itemsDesktopSmall[1];
                }

                if (width <= base.options.itemsTablet[0] && base.options.itemsTablet !== false) {
                    base.options.items = base.options.itemsTablet[1];
                }

                if (width <= base.options.itemsTabletSmall[0] && base.options.itemsTabletSmall !== false) {
                    base.options.items = base.options.itemsTabletSmall[1];
                }

                if (width <= base.options.itemsMobile[0] && base.options.itemsMobile !== false) {
                    base.options.items = base.options.itemsMobile[1];
                }
            }

            //if number of items is less than declared
            if (base.options.items > base.itemsAmount && base.options.itemsScaleUp === true) {
                base.options.items = base.itemsAmount;
            }
        },

        response : function () {
            var base = this,
                smallDelay,
                lastWindowWidth;

            if (base.options.responsive !== true) {
                return false;
            }
            lastWindowWidth = $(window).width();

            base.resizer = function () {
                if ($(window).width() !== lastWindowWidth) {
                    if (base.options.autoPlay !== false) {
                        window.clearInterval(base.autoPlayInterval);
                    }
                    window.clearTimeout(smallDelay);
                    smallDelay = window.setTimeout(function () {
                        lastWindowWidth = $(window).width();
                        base.updateVars();
                    }, base.options.responsiveRefreshRate);
                }
            };
            $(window).resize(base.resizer);
        },

        updatePosition : function () {
            var base = this;
            base.jumpTo(base.currentItem);
            if (base.options.autoPlay !== false) {
                base.checkAp();
            }
        },

        appendItemsSizes : function () {
            var base = this,
                roundPages = 0,
                lastItem = base.itemsAmount - base.options.items;

            base.$owlItems.each(function (index) {
                var $this = $(this);
                $this
                    .css({"width": base.itemWidth, "margin-right": base.options.margin})
                    .data("owl-item", Number(index));

                if (index % base.options.items === 0 || index === lastItem) {
                    if (!(index > lastItem)) {
                        roundPages += 1;
                    }
                }
                $this.data("owl-roundPages", roundPages);
            });
        },

        appendWrapperSizes : function () {
            var base = this,
                width = base.$owlItems.length * base.itemWidth;

            base.$owlWrapper.css({
                "width": width * 2,
                "left": 0
            });
            base.appendItemsSizes();
        },

        calculateAll : function () {
            var base = this;
            base.calculateWidth();
            base.appendWrapperSizes();
            base.loops();
            base.max();
        },

        calculateWidth : function () {
            var base = this;
            base.itemWidth = Math.round( (base.$elem.width() - (base.options.items - 1) * base.options.margin ) / base.options.items);
        },

        max : function () {
            var base = this,
                maximum = ((base.itemsAmount * base.itemWidth + base.options.margin * (base.itemsAmount - 1)) - base.options.items * base.itemWidth - (base.options.items - 1) * base.options.margin ) * -1;
            if (base.options.items > base.itemsAmount) {
                base.maximumItem = 0;
                maximum = 0;
                base.maximumPixels = 0;
            } else {
                base.maximumItem = base.itemsAmount - base.options.items;
                base.maximumPixels = maximum;
            }
            return maximum;
        },

        min : function () {
            return 0;
        },

        loops : function () {
            var base = this,
                prev = 0,
                elWidth = 0,
                i,
                item,
                roundPageNum;

            base.positionsInArray = [0];
            base.pagesInArray = [];

            for (i = 0; i < base.itemsAmount; i += 1) {
                if (i + 1 == base.itemsAmount) {
                    elWidth += base.itemWidth;
                } else {
                    elWidth += base.itemWidth + base.options.margin;
                }
                base.positionsInArray.push(-elWidth);

                if (base.options.scrollPerPage === true) {
                    item = $(base.$owlItems[i]);
                    roundPageNum = item.data("owl-roundPages");
                    if (roundPageNum !== prev) {
                        base.pagesInArray[prev] = base.positionsInArray[i];
                        prev = roundPageNum;
                    }
                }
            }
        },

        buildControls : function () {
            var base = this;
            if (base.options.navigation === true || base.options.pagination === true) {
                base.owlControls = $("<div class=\"owl-controls\"/>").toggleClass("clickable", !base.browser.isTouch).appendTo(base.$elem);
            }
            if (base.options.pagination === true) {
                base.buildPagination();
            }
            if (base.options.navigation === true) {
                base.buildButtons();
            }
        },

        buildButtons : function () {
            var base = this,
                buttonsWrapper = $("<div class=\"owl-buttons\"/>");
            base.owlControls.append(buttonsWrapper);

            base.buttonPrev = $("<div/>", {
                "class" : "owl-prev",
                "html" : base.options.navigationText[0] || ""
            });

            base.buttonNext = $("<div/>", {
                "class" : "owl-next",
                "html" : base.options.navigationText[1] || ""
            });

            buttonsWrapper
                .append(base.buttonPrev)
                .append(base.buttonNext);

            buttonsWrapper.on("touchstart.owlControls mousedown.owlControls", "div[class^=\"owl\"]", function (event) {
                event.preventDefault();
            });

            buttonsWrapper.on("touchend.owlControls mouseup.owlControls", "div[class^=\"owl\"]", function (event) {
                event.preventDefault();
                if ($(this).hasClass("owl-next")) {
                    base.next();
                } else {
                    base.prev();
                }
            });
        },

        buildPagination : function () {
            var base = this;

            base.paginationWrapper = $("<div class=\"owl-pagination\"/>");
            base.owlControls.append(base.paginationWrapper);

            base.paginationWrapper.on("touchend.owlControls mouseup.owlControls", ".owl-page", function (event) {
                event.preventDefault();
                if (Number($(this).data("owl-page")) !== base.currentItem) {
                    base.goTo(Number($(this).data("owl-page")), true);
                }
            });
        },

        updatePagination : function () {
            var base = this,
                counter,
                lastPage,
                lastItem,
                i,
                paginationButton,
                paginationButtonInner;

            if (base.options.pagination === false) {
                return false;
            }

            base.paginationWrapper.html("");

            counter = 0;
            lastPage = base.itemsAmount - base.itemsAmount % base.options.items;

            for (i = 0; i < base.itemsAmount; i += 1) {
                if (i % base.options.items === 0) {
                    counter += 1;
                    if (lastPage === i) {
                        lastItem = base.itemsAmount - base.options.items;
                    }
                    paginationButton = $("<div/>", {
                        "class" : "owl-page"
                    });
                    paginationButtonInner = $("<span></span>", {
                        "text": base.options.paginationNumbers === true ? counter : "",
                        "class": base.options.paginationNumbers === true ? "owl-numbers" : ""
                    });
                    paginationButton.append(paginationButtonInner);

                    paginationButton.data("owl-page", lastPage === i ? lastItem : i);
                    paginationButton.data("owl-roundPages", counter);

                    base.paginationWrapper.append(paginationButton);
                }
            }
            base.checkPagination();
        },
        checkPagination : function () {
            var base = this;
            if (base.options.pagination === false) {
                return false;
            }
            base.paginationWrapper.find(".owl-page").each(function () {
                if ($(this).data("owl-roundPages") === $(base.$owlItems[base.currentItem]).data("owl-roundPages")) {
                    base.paginationWrapper
                        .find(".owl-page")
                        .removeClass("active");
                    $(this).addClass("active");
                }
            });
        },

        checkNavigation : function () {
            var base = this;

            if (base.options.navigation === false) {
                return false;
            }
            if (base.options.rewindNav === false) {
                if (base.currentItem === 0 && base.maximumItem === 0) {
                    base.buttonPrev.addClass("disabled");
                    base.buttonNext.addClass("disabled");
                } else if (base.currentItem === 0 && base.maximumItem !== 0) {
                    base.buttonPrev.addClass("disabled");
                    base.buttonNext.removeClass("disabled");
                } else if (base.currentItem === base.maximumItem) {
                    base.buttonPrev.removeClass("disabled");
                    base.buttonNext.addClass("disabled");
                } else if (base.currentItem !== 0 && base.currentItem !== base.maximumItem) {
                    base.buttonPrev.removeClass("disabled");
                    base.buttonNext.removeClass("disabled");
                }
            }
        },

        updateControls : function () {
            var base = this;
            base.updatePagination();
            base.checkNavigation();
            if (base.owlControls) {
                if (base.options.items >= base.itemsAmount) {
                    base.owlControls.hide();
                } else {
                    base.owlControls.show();
                }
            }
        },

        destroyControls : function () {
            var base = this;
            if (base.owlControls) {
                base.owlControls.remove();
            }
        },

        next : function (speed) {
            var base = this;

            if (base.isTransition) {
                return false;
            }

            base.currentItem += base.options.scrollPerPage === true ? base.options.items : 1;
            if (base.currentItem > base.maximumItem + (base.options.scrollPerPage === true ? (base.options.items - 1) : 0)) {
                if (base.options.rewindNav === true) {
                    base.currentItem = 0;
                    speed = "rewind";
                } else {
                    base.currentItem = base.maximumItem;
                    return false;
                }
            }
            base.goTo(base.currentItem, speed);
        },

        prev : function (speed) {
            var base = this;

            if (base.isTransition) {
                return false;
            }

            if (base.options.scrollPerPage === true && base.currentItem > 0 && base.currentItem < base.options.items) {
                base.currentItem = 0;
            } else {
                base.currentItem -= base.options.scrollPerPage === true ? base.options.items : 1;
            }
            if (base.currentItem < 0) {
                if (base.options.rewindNav === true) {
                    base.currentItem = base.maximumItem;
                    speed = "rewind";
                } else {
                    base.currentItem = 0;
                    return false;
                }
            }
            base.goTo(base.currentItem, speed);
        },

        goTo : function (position, speed, drag) {
            var base = this,
                goToPixel;

            if (base.isTransition) {
                return false;
            }
            if (typeof base.options.beforeMove === "function") {
                base.options.beforeMove.apply(this, [base.$elem]);
            }
            if (position >= base.maximumItem) {
                position = base.maximumItem;
            } else if (position <= 0) {
                position = 0;
            }

            base.currentItem = base.owl.currentItem = position;
            if (base.options.transitionStyle !== false && drag !== "drag" && base.options.items === 1 && base.browser.support3d === true) {
                base.swapSpeed(0);
                if (base.browser.support3d === true) {
                    base.transition3d(base.positionsInArray[position]);
                } else {
                    base.css2slide(base.positionsInArray[position], 1);
                }
                base.afterGo();
                base.singleItemTransition();
                return false;
            }
            goToPixel = base.positionsInArray[position];

            if (base.browser.support3d === true) {
                base.isCss3Finish = false;

                if (speed === true) {
                    base.swapSpeed("paginationSpeed");
                    window.setTimeout(function () {
                        base.isCss3Finish = true;
                    }, base.options.paginationSpeed);

                } else if (speed === "rewind") {
                    base.swapSpeed(base.options.rewindSpeed);
                    window.setTimeout(function () {
                        base.isCss3Finish = true;
                    }, base.options.rewindSpeed);

                } else {
                    base.swapSpeed("slideSpeed");
                    window.setTimeout(function () {
                        base.isCss3Finish = true;
                    }, base.options.slideSpeed);
                }
                base.transition3d(goToPixel);
            } else {
                if (speed === true) {
                    base.css2slide(goToPixel, base.options.paginationSpeed);
                } else if (speed === "rewind") {
                    base.css2slide(goToPixel, base.options.rewindSpeed);
                } else {
                    base.css2slide(goToPixel, base.options.slideSpeed);
                }
            }
            base.afterGo();
        },

        jumpTo : function (position) {
            var base = this;
            if (typeof base.options.beforeMove === "function") {
                base.options.beforeMove.apply(this, [base.$elem]);
            }
            if (position >= base.maximumItem || position === -1) {
                position = base.maximumItem;
            } else if (position <= 0) {
                position = 0;
            }
            base.swapSpeed(0);
            if (base.browser.support3d === true) {
                base.transition3d(base.positionsInArray[position]);
            } else {
                base.css2slide(base.positionsInArray[position], 1);
            }
            base.currentItem = base.owl.currentItem = position;
            base.afterGo();
        },

        afterGo : function () {
            var base = this;

            base.prevArr.push(base.currentItem);
            base.prevItem = base.owl.prevItem = base.prevArr[base.prevArr.length - 2];
            base.prevArr.shift(0);

            if (base.prevItem !== base.currentItem) {
                base.checkPagination();
                base.checkNavigation();
                base.eachMoveUpdate();

                if (base.options.autoPlay !== false) {
                    base.checkAp();
                }

                if (base.options.galleryslider) {
                    var currentImage = base.$elem.find('.owl-item.active').index()+1;
                    base.$elem.closest('.eagle-open-gallery').find('.ea-current').html(currentImage);
                    
                    if (currentImage == 1) {
                        base.$elem.closest('.eagle-open-gallery').find('.eagle-prev').addClass('disabled');
                        base.$elem.closest('.eagle-open-gallery').find('.eagle-next').removeClass('disabled');
                    } else {
                        if (currentImage == base.$elem.find('.owl-item').length) {
                            base.$elem.closest('.eagle-open-gallery').find('.eagle-next').addClass('disabled');
                            base.$elem.closest('.eagle-open-gallery').find('.eagle-prev').removeClass('disabled');
                        } else {
                            base.$elem.closest('.eagle-open-gallery').find('.eagle-next, .eagle-prev').removeClass('disabled');
                        }
                    }

                    /* Zoom default */
                    setTimeout(function() {
                        base.$owlItems.find('.eagle-item').removeAttr('style');
                        if (!Gallery.global.open.find('.top-controls').hasClass('ea-hide')) {
                            base.$owlItems.find('.title').removeClass('hideTitle').removeClass('hideTitleMobile');
                        }
                        Gallery.global.leftDirection = true;
                        Gallery.global.rightDirection = true;
                        Gallery.global.topBottomDirection = false;
                        Gallery.global.newX = 0;
                        Gallery.global.newY = 0;
                        base.$owlItems.find('.eagle-item').data('scale', 1);
                    }, base.options.slideSpeed);
                }
            }

            if (typeof base.options.afterMove === "function" && base.prevItem !== base.currentItem) {
                base.options.afterMove.apply(this, [base.$elem]);
            }
        },

        stop : function () {
            var base = this;
            base.apStatus = "stop";
            window.clearInterval(base.autoPlayInterval);
        },

        checkAp : function () {
            var base = this;
            if (base.apStatus !== "stop") {
                base.play();
            }
        },

        play : function () {
            var base = this;
            base.apStatus = "play";
            if (base.options.autoPlay === false) {
                return false;
            }
            window.clearInterval(base.autoPlayInterval);
            base.autoPlayInterval = window.setInterval(function () {
                base.next(true);
            }, base.options.autoPlay);
        },

        swapSpeed : function (action) {
            var base = this;
            if (action === "slideSpeed") {
                base.$owlWrapper.css(base.addCssSpeed(base.options.slideSpeed));
            } else if (action === "paginationSpeed") {
                base.$owlWrapper.css(base.addCssSpeed(base.options.paginationSpeed));
            } else if (typeof action !== "string") {
                base.$owlWrapper.css(base.addCssSpeed(action));
            }
        },

        addCssSpeed : function (speed) {
            return {
                "-webkit-transition": "all " + speed + "ms ease",
                "-moz-transition": "all " + speed + "ms ease",
                "-o-transition": "all " + speed + "ms ease",
                "transition": "all " + speed + "ms ease"
            };
        },

        removeTransition : function () {
            return {
                "-webkit-transition": "",
                "-moz-transition": "",
                "-o-transition": "",
                "transition": ""
            };
        },

        doTranslate : function (pixels) {
            return {
                "-webkit-transform": "translate3d(" + pixels + "px, 0px, 0px)",
                "-moz-transform": "translate3d(" + pixels + "px, 0px, 0px)",
                "-o-transform": "translate3d(" + pixels + "px, 0px, 0px)",
                "-ms-transform": "translate3d(" + pixels + "px, 0px, 0px)",
                "transform": "translate3d(" + pixels + "px, 0px,0px)"
            };
        },

        transition3d : function (value) {
            var base = this;
            base.$owlWrapper.css(base.doTranslate(value));
        },

        css2move : function (value) {
            var base = this;
            base.$owlWrapper.css({"left" : value});
        },

        css2slide : function (value, speed) {
            var base = this;

            base.isCssFinish = false;
            base.$owlWrapper.stop(true, true).animate({
                "left" : value
            }, {
                duration : speed || base.options.slideSpeed,
                complete : function () {
                    base.isCssFinish = true;
                }
            });
        },

        checkBrowser : function () {
            var base = this,
                translate3D = "translate3d(0px, 0px, 0px)",
                tempElem = document.createElement("div"),
                regex,
                asSupport,
                support3d,
                isTouch;

            tempElem.style.cssText = "  -moz-transform:" + translate3D +
                                  "; -ms-transform:"     + translate3D +
                                  "; -o-transform:"      + translate3D +
                                  "; -webkit-transform:" + translate3D +
                                  "; transform:"         + translate3D;
            regex = /translate3d\(0px, 0px, 0px\)/g;
            asSupport = tempElem.style.cssText.match(regex);
            support3d = (asSupport !== null && asSupport.length === 1);

            isTouch = "ontouchstart" in window || window.navigator.msMaxTouchPoints;

            base.browser = {
                "support3d" : support3d,
                "isTouch" : isTouch
            };
        },

        moveEvents : function () {
            var base = this;
            if (base.options.mouseDrag !== false || base.options.touchDrag !== false) {
                base.gestures();
                base.disabledEvents();
            }
        },

        eventTypes : function () {
            var base = this,
                types = ["s", "e", "x"];

            base.ev_types = {};

            if (base.options.mouseDrag === true && base.options.touchDrag === true) {
                types = [
                    "touchstart.owl mousedown.owl",
                    "touchmove.owl mousemove.owl",
                    "touchend.owl touchcancel.owl mouseup.owl"
                ];
            } else if (base.options.mouseDrag === false && base.options.touchDrag === true) {
                types = [
                    "touchstart.owl",
                    "touchmove.owl",
                    "touchend.owl touchcancel.owl"
                ];
            } else if (base.options.mouseDrag === true && base.options.touchDrag === false) {
                types = [
                    "mousedown.owl",
                    "mousemove.owl",
                    "mouseup.owl"
                ];
            }

            base.ev_types.start = types[0];
            base.ev_types.move = types[1];
            base.ev_types.end = types[2];
        },

        disabledEvents :  function () {
            var base = this;
            base.$elem.on("dragstart.owl", function (event) { event.preventDefault(); });
            base.$elem.on("mousedown.disableTextSelect", function (e) {
                return $(e.target).is('input, textarea, select, option');
            });
        },

        gestures : function () {
            /*jslint unparam: true*/
            var base = this,
                locals = {
                    offsetX : 0,
                    offsetY : 0,
                    baseElWidth : 0,
                    relativePos : 0,
                    position: null,
                    minSwipe : null,
                    maxSwipe: null,
                    sliding : null,
                    dargging: null,
                    targetElement : null,
                    owlActive : null,
                    newX : 0,
                    newY : 0,
                    oldX : 0,
                    oldY : 0
                };

            base.isCssFinish = true;

            function getTouches(event) {
                if (event.touches !== undefined) {
                    return {
                        x : event.touches[0].pageX,
                        y : event.touches[0].pageY
                    };
                }

                if (event.touches === undefined) {
                    if (event.pageX !== undefined) {
                        return {
                            x : event.pageX,
                            y : event.pageY
                        };
                    }
                    if (event.pageX === undefined) {
                        return {
                            x : event.clientX,
                            y : event.clientY
                        };
                    }
                }
            }

            function swapEvents(type) {
                if (type === "on") {
                    $(document).on(base.ev_types.move, dragMove);
                    $(document).on(base.ev_types.end, dragEnd);
                } else if (type === "off") {
                    $(document).off(base.ev_types.move);
                    $(document).off(base.ev_types.end);
                }
            }

            function dragImg(ev) {
                var eagleZoomableItem = locals.owlActive.find('.eagle-item'),
                    eagleZoomableImg = locals.owlActive.find('img'),
                    scale = locals.owlActive.find('.eagle-item').data('scale');

                locals.newX = getTouches(ev).x;
                locals.newY = getTouches(ev).y;

                if ( (eagleZoomableImg.offset().left > locals.owlActive.offset().left && locals.newX > locals.oldX)
                    || (eagleZoomableImg.offset().left + eagleZoomableImg.width()*scale < locals.owlActive.offset().left + locals.owlActive.width() && locals.newX < locals.oldX) )
                {
                    Gallery.global.newX += (locals.newX - locals.oldX) / scale / 3;
                } else {
                    Gallery.global.newX += (locals.newX - locals.oldX) / scale;
                    Gallery.global.leftDirection = false;
                    Gallery.global.rightDirection = false;
                }

                if (Gallery.global.topBottomDirection == true) {
                    if ( (eagleZoomableImg.offset().top > locals.owlActive.offset().top && locals.newY > locals.oldY)
                        || (eagleZoomableImg.offset().top + eagleZoomableImg.height()*scale < locals.owlActive.offset().top + locals.owlActive.height() && locals.newY < locals.oldY) )
                    {
                        Gallery.global.newY += (locals.newY - locals.oldY) / scale / 3;
                    } else {
                        Gallery.global.newY += (locals.newY - locals.oldY) / scale;
                    }
                }

                Gallery.updateImg(eagleZoomableItem, scale, Gallery.global.newX, Gallery.global.newY);

                locals.oldX = locals.newX;
                locals.oldY = locals.newY;
            }

            function dragStart(event) {
                var ev = event.originalEvent || event || window.event,
                    position;
                    locals.owlActive = $(this).find('.owl-item.active');

                if (ev.which === 3) {
                    return false;
                }
                
                if (base.itemsAmount <= base.options.items) {
                    if (Gallery.global.open == null) {
                        return;
                    }
                }
                if (base.isCssFinish === false && !base.options.dragBeforeAnimFinish) {
                    return false;
                }
                if (base.isCss3Finish === false && !base.options.dragBeforeAnimFinish) {
                    return false;
                }

                if (base.options.autoPlay !== false) {
                    window.clearInterval(base.autoPlayInterval);
                }

                if (base.browser.isTouch !== true && !base.$owlWrapper.hasClass("grabbing")) {
                    base.$owlWrapper.addClass("grabbing");
                }

                base.newPosX = 0;
                base.newRelativeX = 0;

                $(this).css(base.removeTransition());

                position = $(this).position();
                locals.relativePos = position.left;

                locals.offsetX = getTouches(ev).x - position.left;
                locals.offsetY = getTouches(ev).y - position.top;

                locals.oldX = getTouches(ev).x;
                locals.oldY = getTouches(ev).y;

                swapEvents("on");

                locals.sliding = false;
                locals.targetElement = ev.target || ev.srcElement;

                Gallery.global.isNoDrag = 0;
            }

            function dragMove(event) {
                var ev = event.originalEvent || event || window.event,
                    minSwipe,
                    maxSwipe;

                if (Gallery.global.isZoom) {
                    return false;
                }

                base.newPosX = getTouches(ev).x - locals.offsetX;
                base.newPosY = getTouches(ev).y - locals.offsetY;
                base.newRelativeX = base.newPosX - locals.relativePos;
                base.newRelativeY = base.newPosY;

                /* left direction */
                if (base.newRelativeX > 0 && Gallery.global.leftDirection == false) {
                    dragImg(ev);
                    if ( (base.newRelativeX > 3 || base.newRelativeX < -3) || (base.newRelativeY > 3 || base.newRelativeY < -3)) {
                        Gallery.global.isNoDrag = 1;
                    }
                    return false;
                }

                /* right direction*/
                if (base.newRelativeX < 0 && Gallery.global.rightDirection == false) {
                    dragImg(ev);
                    if ( (base.newRelativeX > 3 || base.newRelativeX < -3) || (base.newRelativeY > 3 || base.newRelativeY < -3)) {
                        Gallery.global.isNoDrag = 1;
                    }
                    return false;
                }

                /* top and bottom direction*/
                if (Gallery.global.topBottomDirection == true) {
                    var eagleZoomableItem = locals.owlActive.find('.eagle-item'),
                        eagleZoomableImg = locals.owlActive.find('img'),
                        scale = locals.owlActive.find('.eagle-item').data('scale');

                    locals.newY = getTouches(ev).y;

                    if ( (eagleZoomableImg.offset().top > locals.owlActive.offset().top && locals.newY > locals.oldY)
                        || (eagleZoomableImg.offset().top + eagleZoomableImg.height()*scale < locals.owlActive.offset().top + locals.owlActive.height() && locals.newY < locals.oldY) )
                    {
                        Gallery.global.newY += (locals.newY - locals.oldY) / scale / 3;
                    } else {
                        Gallery.global.newY += (locals.newY - locals.oldY) / scale;
                    }

                    Gallery.updateImg(eagleZoomableItem, scale, Gallery.global.newX, Gallery.global.newY);

                    locals.oldY = locals.newY;
                }

                if (typeof base.options.startDragging === "function" && locals.dragging !== true && base.newRelativeX !== 0) {
                    locals.dragging = true;
                    base.options.startDragging.apply(base, [base.$elem]);
                }

                if ((base.newRelativeX > 8 || base.newRelativeX < -8) && (base.browser.isTouch === true)) {
                    if (ev.preventDefault !== undefined) {
                        ev.preventDefault();
                    } else {
                        ev.returnValue = false;
                    }
                    locals.sliding = true;
                }

                if ((base.newPosY > 10 || base.newPosY < -10) && locals.sliding === false && Gallery.global.topBottomDirection == false) {
                    $(document).off("touchmove.owl");
                }

                minSwipe = function () {
                    return base.newRelativeX / 5;
                };

                maxSwipe = function () {
                    return base.maximumPixels + base.newRelativeX / 5;
                };

                base.newPosX = Math.max(Math.min(base.newPosX, minSwipe()), maxSwipe());
                if (base.browser.support3d === true) {
                    base.transition3d(base.newPosX);
                } else {
                    base.css2move(base.newPosX);
                }

                if (base.newRelativeX > 3 || base.newRelativeX < -3) {
                    Gallery.global.isNoDrag = 1;
                }
                Gallery.global.isDrag = 1;
            }

            function dragEnd(event) {
                var ev = event.originalEvent || event || window.event,
                    newPosition,
                    handlers,
                    owlStopEvent,
                    scale = locals.owlActive.find('.eagle-item').data('scale');

                /* left */
                if (base.newRelativeX > 0 && Gallery.global.leftDirection == false) {
                    var eagleZoomableImg = locals.owlActive.find('img'),
                        eagleZoomableItem = locals.owlActive.find('.eagle-item'),
                        deltaX = (eagleZoomableImg.offset().left - locals.owlActive.offset().left) / scale;

                    if (deltaX >= 0) {
                        
                        Gallery.global.leftDirection = true;
                        Gallery.global.newX -= deltaX;
                    }

                    if (Gallery.global.topBottomDirection == true) {
                        var deltaY1 = (eagleZoomableImg.offset().top - locals.owlActive.offset().top) / scale,
                            deltaY2 = ((eagleZoomableImg.offset().top + eagleZoomableImg.height()*scale) - (locals.owlActive.offset().top + locals.owlActive.height())) / scale;

                        if (deltaY1 > 0) {
                            Gallery.global.newY -= deltaY1;
                        }
                        if (deltaY2 < 0) {
                            Gallery.global.newY -= deltaY2;
                        }
                    } else {
                        Gallery.global.newY = 0;
                    }

                    if (deltaX >= 0 || Gallery.global.topBottomDirection == true) {
                        eagleZoomableItem.css(Carousel.addCssSpeed(100));
                        Gallery.updateImg(eagleZoomableItem, scale, Gallery.global.newX, Gallery.global.newY);
                        setTimeout(function(){
                            eagleZoomableItem.css(Carousel.removeTransition());
                        }, 100);
                    }

                    swapEvents("off");
                    Gallery.global.isDrag = 0;
                    return false;
                }
                /* right */
                if (base.newRelativeX < 0 && Gallery.global.rightDirection == false) {
                    var eagleZoomableImg = locals.owlActive.find('img'),
                        eagleZoomableItem = locals.owlActive.find('.eagle-item'),
                        deltaX = ((eagleZoomableImg.offset().left + eagleZoomableImg.width()*scale) - (locals.owlActive.offset().left + locals.owlActive.width())) / scale;

                    if (deltaX <= 0) {
                        Gallery.global.rightDirection = true;
                        Gallery.global.newX -= deltaX;
                    }

                    if (Gallery.global.topBottomDirection == true) {
                        var deltaY1 = (eagleZoomableImg.offset().top - locals.owlActive.offset().top) / scale,
                            deltaY2 = ((eagleZoomableImg.offset().top + eagleZoomableImg.height()*scale) - (locals.owlActive.offset().top + locals.owlActive.height())) / scale;

                        if (deltaY1 > 0) {
                            Gallery.global.newY -= deltaY1;
                        }
                        if (deltaY2 < 0) {
                            Gallery.global.newY -= deltaY2;
                        }
                    } else {
                        Gallery.global.newY = 0;
                    }

                    if (deltaX <= 0 || Gallery.global.topBottomDirection == true) {
                        eagleZoomableItem.css(Carousel.addCssSpeed(100));
                        Gallery.updateImg(eagleZoomableItem, scale, Gallery.global.newX, Gallery.global.newY);
                        setTimeout(function(){
                            eagleZoomableItem.css(Carousel.removeTransition());
                        }, 100);
                    }

                    swapEvents("off");
                    Gallery.global.isDrag = 0;
                    return false;
                }

                /* top and bottom direction*/
                if (Gallery.global.topBottomDirection == true) {
                    var eagleZoomableImg = locals.owlActive.find('img'),
                        eagleZoomableItem = locals.owlActive.find('.eagle-item'),
                        deltaY1 = (eagleZoomableImg.offset().top - locals.owlActive.offset().top) / scale,
                        deltaY2 = ((eagleZoomableImg.offset().top + eagleZoomableImg.height()*scale) - (locals.owlActive.offset().top + locals.owlActive.height())) / scale;

                    if (deltaY1 > 0) {
                        Gallery.global.newY -= deltaY1;
                        eagleZoomableItem.css(Carousel.addCssSpeed(100));
                        Gallery.updateImg(eagleZoomableItem, scale, Gallery.global.newX, Gallery.global.newY);
                        setTimeout(function(){
                            eagleZoomableItem.css(Carousel.removeTransition());
                        }, 100);
                    }
                    if (deltaY2 < 0) {
                        Gallery.global.newY -= deltaY2;
                        eagleZoomableItem.css(Carousel.addCssSpeed(100));
                        Gallery.updateImg(eagleZoomableItem, scale, Gallery.global.newX, Gallery.global.newY);
                        setTimeout(function(){
                            eagleZoomableItem.css(Carousel.removeTransition());
                        }, 100);
                    }
                }

                ev.target = ev.target || ev.srcElement;

                locals.dragging = false;

                if (base.browser.isTouch !== true) {
                    base.$owlWrapper.removeClass("grabbing");
                }

                if (base.newRelativeX < 0) {
                    base.dragDirection = base.owl.dragDirection = "left";
                } else {
                    base.dragDirection = base.owl.dragDirection = "right";
                }

                if (base.newRelativeX !== 0) {
                    newPosition = base.getNewPosition();
                    base.goTo(newPosition, false, "drag");
                    if (locals.targetElement === ev.target && base.browser.isTouch !== true) {
                        $(ev.target).on("click.disable", function (ev) {
                            ev.stopImmediatePropagation();
                            ev.stopPropagation();
                            ev.preventDefault();
                            $(ev.target).off("click.disable");
                        });
                        handlers = $._data(ev.target, "events").click;
                        owlStopEvent = handlers.pop();
                        handlers.splice(0, 0, owlStopEvent);
                    }
                }
                Gallery.global.isDrag = 0;
                swapEvents("off");
            }
            base.$elem.on(base.ev_types.start, ".owl-wrapper", dragStart);
        },

        getNewPosition : function () {
            var base = this,
                newPosition = base.closestItem();

            if (newPosition > base.maximumItem) {
                base.currentItem = base.maximumItem;
                newPosition  = base.maximumItem;
            } else if (base.newPosX >= 0) {
                newPosition = 0;
                base.currentItem = 0;
            }
            return newPosition;
        },
        closestItem : function () {
            var base = this,
                array = base.options.scrollPerPage === true ? base.pagesInArray : base.positionsInArray,
                goal = base.newPosX,
                closest = null;

            $.each(array, function (i, v) {
                if (goal - (base.itemWidth / 20) > array[i + 1] && goal - (base.itemWidth / 20) < v && base.moveDirection() === "left") {
                    closest = v;
                    if (base.options.scrollPerPage === true) {
                        base.currentItem = $.inArray(closest, base.positionsInArray);
                    } else {
                        base.currentItem = i;
                    }
                } else if (goal + (base.itemWidth / 20) < v && goal + (base.itemWidth / 20) > (array[i + 1] || array[i] - base.itemWidth) && base.moveDirection() === "right") {
                    if (base.options.scrollPerPage === true) {
                        closest = array[i + 1] || array[array.length - 1];
                        base.currentItem = $.inArray(closest, base.positionsInArray);
                    } else {
                        closest = array[i + 1];
                        base.currentItem = i + 1;
                    }
                }
            });
            return base.currentItem;
        },

        moveDirection : function () {
            var base = this,
                direction;
            if (base.newRelativeX < 0) {
                direction = "right";
                base.playDirection = "next";
            } else {
                direction = "left";
                base.playDirection = "prev";
            }
            return direction;
        },

        customEvents : function () {
            /*jslint unparam: true*/
            var base = this;
            base.$elem.on("owl.next", function () {
                base.next();
            });
            base.$elem.on("owl.prev", function () {
                base.prev();
            });
            base.$elem.on("owl.play", function (event, speed) {
                base.options.autoPlay = speed;
                base.play();
                base.hoverStatus = "play";
            });
            base.$elem.on("owl.stop", function () {
                base.stop();
                base.hoverStatus = "stop";
            });
            base.$elem.on("owl.goTo", function (event, item) {
                base.goTo(item);
            });
            base.$elem.on("owl.jumpTo", function (event, item) {
                base.jumpTo(item);
            });
        },

        stopOnHover : function () {
            var base = this;
            if (base.options.stopOnHover === true && base.browser.isTouch !== true && base.options.autoPlay !== false) {
                base.$elem.on("mouseover", function () {
                    base.stop();
                });
                base.$elem.on("mouseout", function () {
                    if (base.hoverStatus !== "stop") {
                        base.play();
                    }
                });
            }
        },

        lazyLoad : function () {
            var base = this,
                i,
                $item,
                itemNumber,
                $lazyImg,
                follow;

            if (base.options.lazyLoad === false) {
                return false;
            }
            for (i = 0; i < base.itemsAmount; i += 1) {
                $item = $(base.$owlItems[i]);

                if ($item.data("owl-loaded") === "loaded") {
                    continue;
                }

                itemNumber = $item.data("owl-item");
                $lazyImg = $item.find(".lazyOwl");

                if (typeof $lazyImg.data("src") !== "string") {
                    $item.data("owl-loaded", "loaded");
                    continue;
                }
                if ($item.data("owl-loaded") === undefined) {
                    $lazyImg.hide();
                    $item.addClass("loading").data("owl-loaded", "checked");
                }
                if (base.options.lazyFollow === true) {
                    follow = itemNumber >= base.currentItem;
                } else {
                    follow = true;
                }
                if (follow && itemNumber < base.currentItem + base.options.items && $lazyImg.length) {
                    base.lazyPreload($item, $lazyImg);
                }
            }
        },

        lazyPreload : function ($item, $lazyImg) {
            var base = this,
                iterations = 0,
                isBackgroundImg;

            if ($lazyImg.prop("tagName") === "DIV") {
                $lazyImg.css("background-image", "url(" + $lazyImg.data("src") + ")");
                isBackgroundImg = true;
            } else {
                $lazyImg[0].src = $lazyImg.data("src");
            }

            function showImage() {
                $item.data("owl-loaded", "loaded").removeClass("loading");
                $lazyImg.removeAttr("data-src");
                if (base.options.lazyEffect === "fade") {
                    $lazyImg.fadeIn(400);
                } else {
                    $lazyImg.show();
                }
                if (typeof base.options.afterLazyLoad === "function") {
                    base.options.afterLazyLoad.apply(this, [base.$elem]);
                }
            }

            function checkLazyImage() {
                iterations += 1;
                if (base.completeImg($lazyImg.get(0)) || isBackgroundImg === true) {
                    showImage();
                } else if (iterations <= 100) {//if image loads in less than 10 seconds 
                    window.setTimeout(checkLazyImage, 100);
                } else {
                    showImage();
                }
            }

            checkLazyImage();
        },

        autoHeight : function () {
            var base = this,
                $currentimg = $(base.$owlItems[base.currentItem]).find("img"),
                iterations;

            function addHeight() {
                var $currentItem = $(base.$owlItems[base.currentItem]).height();
                base.wrapperOuter.css("height", $currentItem + "px");
                if (!base.wrapperOuter.hasClass("autoHeight")) {
                    window.setTimeout(function () {
                        base.wrapperOuter.addClass("autoHeight");
                    }, 0);
                }
            }

            function checkImage() {
                iterations += 1;
                if (base.completeImg($currentimg.get(0))) {
                    addHeight();
                } else if (iterations <= 100) { //if image loads in less than 10 seconds 
                    window.setTimeout(checkImage, 100);
                } else {
                    base.wrapperOuter.css("height", ""); //Else remove height attribute
                }
            }

            if ($currentimg.get(0) !== undefined) {
                iterations = 0;
                checkImage();
            } else {
                addHeight();
            }
        },

        completeImg : function (img) {
            var naturalWidthType;

            if (!img.complete) {
                return false;
            }
            naturalWidthType = typeof img.naturalWidth;
            if (naturalWidthType !== "undefined" && img.naturalWidth === 0) {
                return false;
            }
            return true;
        },

        onVisibleItems : function () {
            var base = this,
                i;

            if (base.options.addClassActive === true) {
                base.$owlItems.removeClass("active");
            }

            base.visibleItems = [];
            for (i = base.currentItem; i < base.currentItem + base.options.items; i += 1) {
                base.visibleItems.push(i);

                if (base.options.addClassActive === true) {
                    $(base.$owlItems[i]).addClass("active");
                }
            }
            base.owl.visibleItems = base.visibleItems;
        },

        transitionTypes : function (className) {
            var base = this;
            //Currently available: "fade", "backSlide", "goDown", "fadeUp"
            base.outClass = "owl-" + className + "-out";
            base.inClass = "owl-" + className + "-in";
        },

        singleItemTransition : function () {
            var base = this,
                outClass = base.outClass,
                inClass = base.inClass,
                $currentItem = base.$owlItems.eq(base.currentItem),
                $prevItem = base.$owlItems.eq(base.prevItem),
                prevPos = Math.abs(base.positionsInArray[base.currentItem]) + base.positionsInArray[base.prevItem],
                origin = Math.abs(base.positionsInArray[base.currentItem]) + base.itemWidth / 2,
                animEnd = 'webkitAnimationEnd oAnimationEnd MSAnimationEnd animationend';

            base.isTransition = true;

            base.$owlWrapper
                .addClass('owl-origin')
                .css({
                    "-webkit-transform-origin" : origin + "px",
                    "-moz-perspective-origin" : origin + "px",
                    "perspective-origin" : origin + "px"
                });
            function transStyles(prevPos) {
                return {
                    "position" : "relative",
                    "left" : prevPos + "px"
                };
            }

            $prevItem
                .css(transStyles(prevPos, 10))
                .addClass(outClass)
                .on(animEnd, function () {
                    base.endPrev = true;
                    $prevItem.off(animEnd);
                    base.clearTransStyle($prevItem, outClass);
                });

            $currentItem
                .addClass(inClass)
                .on(animEnd, function () {
                    base.endCurrent = true;
                    $currentItem.off(animEnd);
                    base.clearTransStyle($currentItem, inClass);
                });
        },

        clearTransStyle : function (item, classToRemove) {
            var base = this;
            item.css({
                "position" : "",
                "left" : ""
            }).removeClass(classToRemove);

            if (base.endPrev && base.endCurrent) {
                base.$owlWrapper.removeClass('owl-origin');
                base.endPrev = false;
                base.endCurrent = false;
                base.isTransition = false;
            }
        },

        owlStatus : function () {
            var base = this;
            base.owl = {
                "userOptions"   : base.userOptions,
                "baseElement"   : base.$elem,
                "userItems"     : base.$userItems,
                "owlItems"      : base.$owlItems,
                "currentItem"   : base.currentItem,
                "prevItem"      : base.prevItem,
                "visibleItems"  : base.visibleItems,
                "isTouch"       : base.browser.isTouch,
                "browser"       : base.browser,
                "dragDirection" : base.dragDirection
            };
        },

        clearEvents : function () {
            var base = this;
            base.$elem.off(".owl owl mousedown.disableTextSelect");
            $(document).off(".owl owl");
            $(window).off("resize", base.resizer);
        },

        unWrap : function () {
            var base = this;
            if (base.$elem.children().length !== 0) {
                base.$owlWrapper.unwrap();
                base.$userItems.unwrap().unwrap();
                if (base.owlControls) {
                    base.owlControls.remove();
                }
            }
            base.clearEvents();
            base.$elem
                .attr("style", base.$elem.data("owl-originalStyles") || "")
                .attr("class", base.$elem.data("owl-originalClasses"));
        },

        destroy : function () {
            var base = this;
            base.stop();
            window.clearInterval(base.checkVisible);
            base.unWrap();
            base.$elem.removeData();
        },

        reinit : function (newOptions) {
            var base = this,
                options = $.extend({}, base.userOptions, newOptions);
            base.unWrap();
            base.init(options, base.$elem);
        },

        addItem : function (htmlString, targetPosition) {
            var base = this,
                position;

            if (!htmlString) {return false; }

            if (base.$elem.children().length === 0) {
                base.$elem.append(htmlString);
                base.setVars();
                return false;
            }
            base.unWrap();
            if (targetPosition === undefined || targetPosition === -1) {
                position = -1;
            } else {
                position = targetPosition;
            }
            if (position >= base.$userItems.length || position === -1) {
                base.$userItems.eq(-1).after(htmlString);
            } else {
                base.$userItems.eq(position).before(htmlString);
            }

            base.setVars();
        },

        removeItem : function (targetPosition) {
            var base = this,
                position;

            if (base.$elem.children().length === 0) {
                return false;
            }
            if (targetPosition === undefined || targetPosition === -1) {
                position = -1;
            } else {
                position = targetPosition;
            }

            base.unWrap();
            base.$userItems.eq(position).remove();
            base.setVars();
        }

    };

    $.fn.owlCarouselE = function (options) {
        return this.each(function () {
            if ($(this).data("owl-init") === true) {
                return false;
            }
            $(this).data("owl-init", true);
            var carousel = Object.create(Carousel);
            carousel.init(options, this);
            $.data(this, "owlCarouselE", carousel);
        });
    };

    $.fn.owlCarouselE.options = {

        items : 5,
        itemsCustom : false,
        itemsDesktop : [1199, 4],
        itemsDesktopSmall : [979, 3],
        itemsTablet : [768, 2],
        itemsTabletSmall : false,
        itemsMobile : [479, 1],
        singleItem : false,
        itemsScaleUp : false,
        margin: 0,

        slideSpeed : 200,
        paginationSpeed : 800,
        rewindSpeed : 800,

        autoPlay : false,
        stopOnHover : false,

        navigation : false,
        navigationText : ["prev", "next"],
        rewindNav : true,
        scrollPerPage : false,

        pagination : true,
        paginationNumbers : false,

        responsive : true,
        responsiveRefreshRate : 200,
        responsiveBaseWidth : window,

        baseClass : "owl-carousel",
        theme : "owl-theme",

        lazyLoad : false,
        lazyFollow : true,
        lazyEffect : "fade",

        autoHeight : false,

        jsonPath : false,
        jsonSuccess : false,

        dragBeforeAnimFinish : true,
        mouseDrag : true,
        touchDrag : true,

        addClassActive : false,
        transitionStyle : false,

        beforeUpdate : false,
        afterUpdate : false,
        beforeInit : false,
        afterInit : false,
        beforeMove : false,
        afterMove : false,
        afterAction : false,
        startDragging : false,
        afterLazyLoad: false,

        galleryslider: false
    };
    
}(jQuery, window, document));