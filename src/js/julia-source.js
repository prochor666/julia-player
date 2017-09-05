/* *****************************************
* JuliaPlayer HTML5 player
* Create api source
****************************************** */
JuliaPlayer.prototype._Source = function (origin) {
    var self = this;
    var source;
    self.set = function (_source) {
        origin.env.errorRecoveryAttempts = 0;
        origin.Subtitles.textTracksCleaner();
        origin.Ui.reset();
        origin.Ui.state(origin.env.preloader, '', 'on');
        origin.env.continuePlayback = false;
        if (origin.env.api.paused === false) {
            origin.env.api.pause();
            origin.env.continuePlayback = true;
        }
        origin.env.started = false;
        source = typeof origin.options.source === 'object' ? origin.options.source : {};
        _source = typeof _source === 'object' ? _source : {};
        source.file = Object.keys(_source).indexOf('file') > -1 ? _source.file.toString() : source.file.toString();
        source.poster = Object.keys(_source).indexOf('poster') > -1 ? _source.poster.toString() : source.poster.toString();
        source.mode = Object.keys(_source).indexOf('mode') > -1 ? _source.mode.toString() : source.mode.toString();
        source.title = Object.keys(_source).indexOf('title') > -1 ? _source.title.toString() : source.title.toString();
        source.link = Object.keys(_source).indexOf('link') > -1 ? _source.link.toString() : source.link.toString();
        source.live = Object.keys(_source).indexOf('live') > -1 ? _source.live : source.live;
        source.live = typeof source.live === 'undefined' ? false : source.live;
        source.fixVideoAspect = Object.keys(_source).indexOf('fixVideoAspect') > -1 ? _source.fixVideoAspect : source.fixVideoAspect;
        source.mode = typeof source.mode === 'undefined' ? 'legacy' : source.mode;
        if (source.mode === 'hls' && self.modeTest() && origin.env.context.Hls.isSupported() !== true) {
            source.mode = 'hlsnative';
        }
        origin.env.mode = source.mode;
        if (source.link.toString().length > 0) {
            origin.Ui.panel(origin.env.panels.title, '<a href="'+source.link+'" target="_blank">'+source.title+' &raquo;</a>');
        }else{
            origin.Ui.panel(origin.env.panels.title, source.title);
        }
        origin.debug({
            'Api file': source.file,
            'Api poster': source.poster,
            'Api mode': source.mode
        });
        origin.env.api.poster = source.poster;
        //origin.Support.canPlayMedia();
        if (source.live === true) {
            origin.Ui.state(origin.env.toolbarBottom, '', 'live');
        } else {
            origin.Ui.state(origin.env.toolbarBottom, 'live', '');
        }
        if (origin.options.muted === true) {
            origin.Controls.press('sound-off');
        } else {
            origin.Controls.press('sound-on');
        }
        ;
        origin.Events.native();
        $(document).off('julia.api-mode', '#julia-' + origin.env.ID).on('julia.api-mode', '#julia-' + origin.env.ID, function (e) {
            if ((origin.env.continuePlayback === true || origin.options.autoplay === true) && (origin.env.api.paused === true || origin.env.api.ended === true) && origin.env.started === false) {
                origin.debug({ 'Trying to load source': origin.env.api.src });
                origin.Source.load();
            }
        });
        if (self.modeTest()) {
            origin.Ui.notify('');
            origin.Source.mode();
        } else {
            origin.Ui.notify(origin.options.i18n.messages.pluginError + ' - ' + source.mode);
        }
    };
    self.modeTest = function () {
        switch (source.mode) {
        case 'hls':
            return origin.Support.isCallable(origin.env.context.Hls);
            break;
        case 'dash':
            return origin.Support.isCallable(origin.env.context.dashjs);
            break;
        default:
            return true;
        }
    };
    self.mode = function () {
        try {
            if (origin.env.dash !== false && origin.env.dashInitialized === true) {
                origin.env.dash.reset();
                origin.env.dash = false;
            }
            ;
            if (origin.env.hls !== false && origin.env.hlsInitialized === true) {
                origin.env.hls.destroy();
                origin.env.hls = false;
            }
            ;
        } catch (err) {
            origin.debug({ 'Error': err }, true);
        }
        switch (source.mode) {
        case 'dash':
            origin.env.dash = origin.env.context.dashjs.MediaPlayer().create();
            break;
        case 'hls':
            origin.env.hls = new origin.env.context.Hls(origin.options.hlsConfig);
            break;
        default:
        }
        ;
        origin.event('julia.api-mode', origin.env.instance);
    };
    self.load = function () {
        origin.env.continuePlayback = true;
        origin.Ui.state(origin.env.preloader, '', 'on');
        switch (source.mode) {
        case 'dash':
            try {
                origin.env.dash.initialize(origin.env.api, source.file, origin.options.autoplay);
                origin.env.dash.getDebug().setLogToBrowserConsole(origin.options.playbackDebug);
                origin.Events.dashLibEvents();
                origin.event('julia.api-load', origin.env.instance);
            } catch (err) {
                origin.debug({ 'Error': err }, true);
                self.recover(true);
            }
            break;
        case 'hls':
            try {
                origin.env.hls.autoLevelCapping = -1;
                origin.env.hls.attachMedia(origin.env.api);
                origin.Events.hlsLibEvents();
                origin.env.hlsInitialized = true;
                origin.event('julia.api-load', origin.env.instance);
            } catch (err) {
                origin.debug({ 'Error': err }, true);
                self.recover(true);
            }
            break;
        default:
            try {
                origin.env.api.src = source.file;
                origin.env.api.load();
                origin.event('julia.api-load', origin.env.instance);
            } catch (err) {
                origin.debug({ 'Error': err }, true);
                self.recover(true);
            }
        }
        ;
        if (origin.env.started === false || origin.options.autoplay === true) {
            self.firstPlay();
        }
    };
    self.recover = function (force) {
        force = typeof force !== 'undefined' && force === true ? force: false;

        if (origin.env.api.paused === false) {
            origin.debug({
                'Playback recovery force': force,
                'Attempts': origin.env.errorRecoveryAttempts,
                'Attempt Limit': origin.env.errorRecoveryAttemptLimit
            });

            if (origin.env.errorRecoveryAttempts > 0) {
                origin.Ui.state(origin.env.preloader, '', 'on');
                origin.env.toolbarBottom.removeClass('julia-toolbar-visible');
            }else{
                origin.Ui.state(origin.env.preloader, 'on', '');
            }

            if (origin.env.errorRecoveryAttempts >= origin.env.errorRecoveryAttemptLimit || force === true) {
                //origin.Controls.press('stop');
                origin.Source.set();
            } else {
                origin.env.errorRecoveryAttempts++;
            }
        }
    };
    self.firstPlay = function () {
        if (origin.Support.isMobile() === false) {
            setTimeout(function () {
                if (origin.env.api.readyState > 2) {
                    origin.env.api.play();
                } else {
                    self.firstPlay();
                }
            }, 300);
        } else {
            setTimeout(function () {
                origin.env.api.play();
                setTimeout(function () {
                    if (origin.env.api.readyState < 2 && origin.env.api.paused === true) {
                        origin.Ui.state(origin.env.buttons.play, 'pause', 'play');
                        origin.Ui.icon(origin.env.buttons.play, 'julia-pause', 'julia-play');
                        //origin.env.buttons.bigPlay.show();
                    }
                }, 300);
            }, 300);
        }
    };
};
