/* *****************************************
* JuliaPlayer HTML5 media player
* Slider controller
* Progress and volume widget library
****************************************** */
JuliaPlayer.prototype._Slider = function (origin, options) {
    var self = this,
        leftButtonDown = false,
        ua = navigator.userAgent,
        isChrome = /chrome/i.exec(ua),
        isAndroid = /android/i.exec(ua),
        hasTouch = 'ontouchstart' in window && !(isChrome && !isAndroid),
        _normalize = function (percent) {
                if (percent > 100) {
                    return 100;
                }
                if (percent < 0) {
                    return 0;
                }
                return Math.round(percent * 100) / 100;
            }, _posToPercent = function (pos) {
                return _normalize(pos / (self.track.innerWidth() / 100));
            }, _position = function (e) {
                if (hasTouch === true && e.originalEvent.touches && e.originalEvent.touches.length > 0 && e.originalEvent.touches[0].pageX) {
                    self.lastTouchVal = e.originalEvent.touches[0].pageX;
                }
                var pos = hasTouch === true && e.originalEvent.touches ? self.lastTouchVal - self.model.offset().left : e.originalEvent.pageX - self.model.offset().left;
                percent = _posToPercent(pos);
                return percent;
            }, _pixels = function (e) {
                if (hasTouch === true && e.originalEvent.touches && e.originalEvent.touches.length > 0 && e.originalEvent.touches[0].pageX) {
                    self.lastTouchVal = e.originalEvent.touches[0].pageX;
                }
                var pos = hasTouch === true && e.originalEvent.touches ? self.lastTouchVal - self.model.offset().left : e.originalEvent.pageX - self.model.offset().left;
                return pos;
            }, model = $('<div class="julia-slider">' + '<div class="julia-slider-track" data-julia-slider-component="track"></div>' + '<div class="julia-slider-track-visible" data-julia-slider-component="track-visible"></div>' + '<div class="julia-slider-handle" data-julia-slider-component="handle"></div>' + '<div class="julia-slider-fill" data-julia-slider-component="fill"></div>' + '</div>');
    self.model = model.clone();
    self.lastTouchVal = 0;
    self.track = self.model.find('[data-julia-slider-component="track"]');
    self.trackVisible = self.model.find('[data-julia-slider-component="track-visible"]');
    self.handle = self.model.find('[data-julia-slider-component="handle"]');
    self.fill = self.model.find('[data-julia-slider-component="fill"]');
    self.options = {
        element: {},
        value: 0,
        event: '',
        overcall: function () {
            return;
        }
    };
    // Extend custom options
    $.extend(true, self.options, options);
    self.elem = self.options.element;
    self.value = self.options.value;
    // Public methods & props
    self.init = function () {
        if (['input'].lastIndexOf(self.elem.prop('tagName').toLowerCase()) > -1) {
            self.value = _normalize(self.elem.val());
        }
        self.elem.after(self.model);
        self.elem.hide();
        self.slide(self.value, true);
    };
    self.update = function (percent) {
        if (leftButtonDown === false) {
            self.slide(percent, true);
        }
    };
    self.buffered = function () {
        var b = origin.env.api.buffered;
        self.model.find('.julia-buffer-sequence').remove();
        for (var i = 0; i < b.length; i++) {
            var sequenceModel = self.model.find('.julia-buffer-sequence-' + i);
            var _percent1 = _normalize(origin.Timecode.toPercents(b.start(i)));
            var _percent2 = _normalize(origin.Timecode.toPercents(b.end(i)));
            var pos1 = self.track.innerWidth() / 100 * _percent1;
            var pos2 = self.track.innerWidth() / 100 * _percent2;
            if (sequenceModel.length == 0) {
                var sequenceModel = $('<div class="julia-buffer-sequence julia-buffer-sequence-' + i + '"></div>');
                self.model.append(sequenceModel);
            }
            sequenceModel.css({
                'left': pos1 + 'px',
                'width': pos2 - pos1 + self.handle.innerWidth() + 'px'
            });
        }
    };
    self.slide = function (percent, eventPrevent) {
        if (typeof eventPrevent === 'undefined') {
            eventPrevent = true;
        }
        self.value = _normalize(percent);
        var pos = self.track.innerWidth() / 100 * self.value;
        self.handle.css({ 'left': pos + 'px' });
        self.fill.css({ 'width': pos + 2 + 'px' });
        self.respond(percent, eventPrevent);
    };
    self.respond = function (percent, eventPrevent) {
        if (typeof eventPrevent === 'undefined') {
            eventPrevent = false;
        }
        if (['input'].lastIndexOf(self.elem.prop('tagName').toLowerCase()) > -1) {
            self.elem.val(self.value);
            if (eventPrevent === false) {
                origin.env.eventBridge[self.options.event] = self.value;
                origin.event(self.options.event+'.julia');
            }
        }
        // Fix final handle position on track
        self.track.innerWidth(self.model.innerWidth() - self.handle.innerWidth());
    };
    self.getValue = function () {
        return self.value;
    };
    self.sliding = function () {
        return leftButtonDown;
    };
    // Mouse & touch events
    self.fill.on('click ', function (e) {
        self.slide(_position(e), false);
    });
    self.track.on('click', function (e) {
        self.slide(_position(e), false);
    });
    self.trackVisible.on('click', function (e) {
        self.slide(_position(e), false);
    });
    self.model.on('click mouseover mousemove mouseout touchmove', function (e) {
        if (e.type == 'click') {
            self.slide(_position(e), false);
        }
        if ((e.type == 'mouseover' || e.type == 'mousemove' || e.type == 'touchmove') && self.options.event == 'progressSliderChange' && origin.env.started === true) {
            var pos = _position(e);
            var pix = _pixels(e);
            if (origin.Support.isMobile() === false && origin.options.source.live === false && origin.options.thumbs === true) {
                origin.Thumbs.thumb(origin.Timecode.toSeconds(pos));
            }
            origin.Ui.state(origin.env.labels.goto, '', 'on');
            origin.Ui.panel(origin.env.labels.goto, origin.Timecode.toHuman(origin.Timecode.toSeconds(pos)));
            var left = pix + 'px';
            var border = origin.env.labels.goto.innerWidth() / 2;
            if (pix < border) {
                left = border + 10 + 'px';
            }
            if (pix > self.model.innerWidth() - border) {
                left = self.model.innerWidth() - border + 10 + 'px';
            }
            origin.env.labels.goto.css({
                'left': left,
                'margin-left': -(origin.env.labels.goto.innerWidth() / 2) + 'px'
            });
        }
        if (e.type == 'mouseout' && self.options.event == 'progressSliderChange') {
            origin.Ui.state(origin.env.labels.goto, 'on', '');
        }
    });
    self.model.on('mousedown touchstart touch', function (e) {
        // Left mouse button activate
        if (e.type == 'touchstart' || e.type == 'touch') {
            self.slide(_position(e));
        }
        leftButtonDown = true;
    });
    self.model.on('mouseup touchend', function (e) {
        // Left mouse button deactivate
        leftButtonDown = false;
        self.slide(_position(e), false);
    });
    self.model.on('mousemove touchmove', function (e) {
        if (leftButtonDown === true) {
            if (self.options.event != 'progressSliderChange') {
                self.slide(_position(e), false);
            }else{
                self.slide(_position(e));
            }
        }
    });
    return self;
};
