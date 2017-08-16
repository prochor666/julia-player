/* *****************************************
* JuliaPlayer HTML5 player
* UMD loader
* Uses CommonJS, AMD or browser globals
* to export a jQuery plugin & extension.
****************************************** */
(function (root, factory) {
    if (typeof define === 'function' && define.amd) {
        // AMD. Register as an anonymous module.
        define(['exports', 'jquery'], function (exports, jQuery) {
            factory((root.commonJsStrictGlobal = exports), jQuery);
        });
    } else if (typeof exports === 'object' && typeof exports.nodeName !== 'string') {
        // CommonJS
        factory(exports, require('jquery'));
    } else {
        // Browser globals
        factory((root.commonJsStrictGlobal = {}), root.jQuery);
    }
}(this, function (exports, $) {
/* *****************************************
* JuliaPlayer HTML5 player
* Base object
****************************************** */
JuliaPlayer = function (options) {
    var origin = this;
    // Import options
    options = typeof options === 'undefined' ? {} : options;
    // Unique instance ID
    var __JULIA_INSTANCE__ID__ = Math.floor(Math.random() * 10000000 + 1);
    // Default origin.options
    origin.options = {
        dev: false,
        element: $('body'),
        autoplay: false,
        debug: false,
        dashConfig: {},
        dimensions: [
            [
                1920,
                1080
            ],
            [
                1280,
                720
            ],
            [
                960,
                540
            ],
            [
                640,
                360
            ],
            [
                512,
                288
            ]
        ],
        hlsConfig: { debug: false },
        i18n: {
            messages: { pluginError: 'Plugin error' },
            liveText: 'Live',
            settings: 'Settings',
            auto: 'Auto',
            video: 'Video quality',
            audio: 'Audio quality',
            audioTracks: 'Audio tracks',
            subtitles: 'Subtitles',
            speed: 'Playback speed',
            speedItems: [
                {
                    active: 1,
                    value: 0.25,
                    title: '0.25x'
                },
                {
                    active: 1,
                    value: 0.5,
                    title: '0.5x'
                },
                {
                    active: 1,
                    value: 1,
                    title: 'Normal'
                },
                {
                    active: 1,
                    value: 1.5,
                    title: '1.5x'
                },
                {
                    active: 1,
                    value: 2,
                    title: '2x'
                },
                {
                    active: 1,
                    value: 2.5,
                    title: '2.5x'
                },
                {
                    active: 1,
                    value: 3,
                    title: '3x'
                }
            ],
            videoItems: [],
            audioItems: [],
            textItems: [{
                    active: -1,
                    value: -1,
                    title: 'Off'
                }]
        },
        onInit: false,
        onPlay: false,
        onPause: false,
        onStop: false,
        onSuggest: false,
        onTime: false,
        pauseOnClick: true,
        playbackDebug: false,
        pluginMode: false,
        responsive: true,
        plugins: 'julia-player/dist/js/lib',
        source: {
            file: '',
            poster: '',
            link: '',
            mode: 'legacy',
            live: false
        },
        suggest: [],
        suggestLimit: 4,
        suggestTimeout: 10000,
        thumbs: false,
        zIndexStart: 1,
        errorRecoveryAttemptLimit: 3,
    };
    // Extend default origin.options with external options
    $.extend(true, origin.options, options);
    // Environment
    origin.env = {
        element: origin.options.element,
        autoplay: origin.options.autoplay,
        canPlayMediaString: '',
        canPlayMedia: false,
        collection: origin.options.collection,
        context: typeof window !== 'undefined' && window || global,
        continuePlayback: false,
        dimensions: {
            width: 0,
            height: 0
        },
        errorRecoveryAttempts: 0,
        errorRecoveryAttemptLimit: origin.options.errorRecoveryAttemptLimit,
        fullscreenFrame: false,
        i18n: origin.options.i18n,
        ID: __JULIA_INSTANCE__ID__,
        instance: $(),
        api: $(),
        hls: false,
        dash: false,
        dashInitialized: false,
        hlsInitialized: false,
        audioTrackActive: 0,
        textTrackActive: 0,
        shield: $(),
        toolbars: $(),
        buttons: $(),
        started: false,
        mode: 'legacy',
        suggestTimer: false,
        startupGoto: 0,
        onTimeRised: [],
        ranges: {
            volume: '',
            progress: ''
        },
        sliders: {
            volume: '',
            progress: ''
        },
        panels: {
            live: '',
            currentTime: '',
            duration: ''
        },
        labels: { goto: '' },
        menus: { settings: '' },
        suggest: $(),
        preloader: $(),
        progressStep: 0.01, // Full sense: 100, so .01 is enough accurate
        version: '2.0.3'
    };
    // Console debug
    origin.debug = function (data, warn) {
        //--odn-handle-start--
        if (origin.options.debug === true) {
            warn = typeof warn === 'undefined' || warn === false ? false : true;
            if (window.console) {
                for (key in data) {
                    if (warn === true && typeof console.warn === 'function') {
                        console.warn(' - JuliaPlayer ' + origin.env.ID + ' warning - [' + typeof data[key] + '], ' + key + ': ', data[key]);
                    } else {
                        console.log(' - JuliaPlayer ' + origin.env.ID + ' debug - [' + typeof data[key] + '], ' + key + ': ', data[key]);
                    }
                }
            }
        }    //--odn-handle-stop--
    };
    origin.event = function (eventName, elem, data) {
        var e = typeof elem === 'undefined' ? $(document) : elem;
        var d = typeof data === 'undefined' ? {} : data;
        if (typeof e === 'string') {
            e = $(e);
        }
        origin.debug({ 'Julia event fired': eventName + ' > ' + elem.prop('tagName') + '.' + elem.prop('className') });
        e.trigger({ type: eventName }, d);
    };
    /* *****************************************
    * Require js/css files
    ****************************************** */
    origin.js = function (scripts) {
        if (typeof scripts === 'string') {
            scripts = [scripts];
        }
        if (scripts.length == 0) {
            origin.event('julia.no-scripts', origin.env.instance);
        } else {
            var last = scripts[scripts.length - 1];
            origin.jsLoad(scripts, 0, last);
        }
    };
    origin.jsLoad = function (scripts, i, last) {
        var script = scripts[i];
        $.getScript(script).done(function () {
            origin.debug({ 'Js file loaded': script });
            if (last == script) {
                origin.event('julia.scripts-loaded', origin.env.instance);
            } else {
                origin.jsLoad(scripts, i + 1, last);
            }
        });
    };
    // Console stat
    origin.stats = function () {
        return {
            'mode': origin.options.source.mode,
            'live': origin.options.source.live,
            'isMobile': origin.Support.isMobile(),
            'readyState': origin.env.api.readyState,
            'duration': origin.Timecode.toHuman(origin.env.api.duration),
            'position': origin.Timecode.toHuman(origin.env.api.currentTime),
            'canPlayMediaString': origin.env.canPlayMediaString,
            'canPlayMedia': origin.env.canPlayMedia.toString(),
            'started': origin.env.started.toString(),
            'api': origin.env.api.paused === true ? 'paused' : 'playing'
        };
    };
    //--odn-handle-start--
    // Debug start
    if (origin.options.debug === true && window.console) {
        console.info('=== Julia player init, instance ' + origin.env.ID + ' ===');
    }
    //--odn-handle-stop--
    // Second step, UI event starts player
    $(document).on('julia.ui-created', '#julia-' + origin.env.ID, function (e) {
        origin.Support.resize();
        origin.Ui.state(origin.env.instance, 'off', '');
        var _load = [];
        if (origin.options.source.hasOwnProperty('mode') && origin.options.source.mode === 'dash' && typeof origin.env.context.dashjs === 'undefined') {
            _load.push(origin.options.plugins + '/dash.all.min.js');
        }
        if (origin.options.source.hasOwnProperty('mode') && origin.options.source.mode === 'hls' && typeof origin.env.context.Hls === 'undefined') {
            _load.push(origin.options.plugins + '/hls.min.js');
        }
        $(document).on('julia.scripts-loaded julia.no-scripts', '#julia-' + origin.env.ID, function (e) {
            if (!origin.options.source.hasOwnProperty('file')) {
                origin.options.source.file = '';
            }
            if (!origin.options.source.hasOwnProperty('poster')) {
                origin.options.source.poster = '';
            }
            if (!origin.options.source.hasOwnProperty('title')) {
                origin.options.source.title = '';
            }
            if (!origin.options.source.hasOwnProperty('mode')) {
                origin.options.source.mode = 'legacy';
            }
            if (!origin.options.source.hasOwnProperty('live')) {
                origin.options.source.live = false;
            }
            origin.env.fullscreenFrame = document.querySelector('#julia-' + origin.env.ID);
            origin.env.api = document.getElementById('julia-api-' + origin.env.ID);
            origin.env.sliders.progress = new origin._Slider(origin, {
                element: $('#julia-' + origin.env.ID + ' .julia-toolbar.julia-toolbar-bottom>div.julia-progress>input.julia-range'),
                event: 'progress-change'
            });
            origin.env.sliders.progress.init();
            origin.env.sliders.volume = new origin._Slider(origin, {
                element: $('#julia-' + origin.env.ID + ' .julia-toolbar.julia-toolbar-bottom>div.julia-volume>input.julia-range'),
                event: 'volume-change'
            });
            origin.env.sliders.volume.init();
            origin.Events.ui();
            // Size Fix
            origin.Support.resize();
            // Suggest completition
            origin.options.suggest.map(function (x, i) {
                origin.options.suggest[i].played = false;
            });
            // Startup fixes, default behavior before media init
            $('body').on('julia.progress-change', '#julia-' + origin.env.ID, function (e, data) {
                if (origin.env.started === false) {
                    origin.env.startupGoto = data.percent;
                    origin.Controls.press('play');
                }
            });
            // Persistent data
            volume = origin.Persist.get('julia-player-volume');
            muted = origin.Persist.get('julia-player-muted');
            if (!isNaN(Number(volume)) && typeof volume !== 'undefined') {
                origin.options.volume = parseInt(Number(volume));
                if (origin.options.volume > 100 || origin.options.volume < 0) {
                    origin.options.volume = 25;
                }
            } else {
                origin.options.volume = 25;
            }
            // Set volume for mobile
            if (origin.Support.isMobile() === true) {
                origin.options.volume = 100;
                origin.options.muted = false;
            }
            if (!isNaN(Number(muted)) && typeof muted !== 'undefined' && origin.Support.isMobile() === false) {
                origin.options.muted = Number(muted) === 0 ? false : true;
            } else {
                origin.options.muted = false;
            }
            if (origin.options.onInit !== false) {
                origin.Callback.fn(origin.options.onInit);
            }
            origin.env.api.volume = parseFloat(origin.options.volume / 100);
            origin.env.api.muted = origin.options.muted;
            //--odn-handle-start--
            origin.Source.set();    //--odn-handle-stop--
        });
        origin.js(_load);
    });
    // Create components
    origin.Ui = new origin._Ui(origin);
    origin.Events = new origin._Events(origin);
    origin.Switcher = new origin._Switcher(origin);
    origin.Subtitles = new origin._Subtitles(origin);
    origin.Callback = new origin._Callback(origin);
    origin.Controls = new origin._Controls(origin);
    origin.Fullscreen = new origin._Fullscreen(origin);
    origin.Support = new origin._Support(origin);
    origin.Suggest = new origin._Suggest(origin);
    origin.Source = new origin._Source(origin);
    origin.Persist = new origin._Persist(origin);
    origin.Timecode = new origin._Timecode(origin);
    origin.Thumbs = new origin._Thumbs(origin);
    //--odn-handle-start--
    origin.Ui.create();
    origin.Events.init();
    //--odn-handle-stop--
    return origin.options.pluginMode === true ? origin : [origin];
};

/* *****************************************
* JuliaPlayer HTML5 player
* Callback
* event callbacks
****************************************** */
JuliaPlayer.prototype._Callback = function (origin) {
    var self = this;
    self.fn = function (f, data) {
        data = data || {};
        if ($.inArray(typeof f, [
                'string',
                'function'
            ]) > -1) {
            // Callback defined as function name or function
            // !!! Remember !!!
            // If you are using typeof string, function must be callable globally (window context)
            if (typeof f === 'string') {
                f = window[f];
            }
            f(origin, data);
            origin.debug({ 'Callback': typeof f + ' raised' });
        } else {
            origin.debug({ 'Callback': typeof f + ' is not a function, but: ' + typeof f });
        }
    };
    // Time update event callbacks
    self.onTime = function (time, timeNum) {
        if (origin.options.onTime && typeof origin.options.onTime === 'object' && Object.keys(origin.options.onTime).indexOf(time) > -1 && origin.env.onTimeRised.indexOf(time) == -1) {
            f = origin.options.onTime[time];
            origin.env.onTimeRised.push(time);
            if ($.inArray(typeof f, [
                    'string',
                    'function'
                ]) > -1) {
                // Callback defined as function name or function
                // !!! Remember !!!
                // If you are using typeof string, function must be callable globally (window context)
                if (typeof f === 'string') {
                    f = window[f];
                }
                f(origin, time);
                origin.debug({ 'Callback onTime': time + ' ' + typeof f + ' raised' });
            } else {
                origin.debug({ 'Callback onTime': time + ' ' + typeof f + ' is not a function, but: ' + typeof f });
            }
        }
    };
};

/* *****************************************
* JuliaPlayer HTML5 player
* Virtual controls
****************************************** */
JuliaPlayer.prototype._Controls = function (origin) {
    var self = this;
    self.press = function (action, data) {
        data = data || {};
        switch (action) {
        case 'play':
            origin.Ui.state(origin.env.preloader, '', 'on');
            origin.env.buttons.bigPlay.hide();
            if (origin.options.onPlay !== false) {
                origin.Callback.fn(origin.options.onPlay, data);
            }
            if (origin.env.started === false) {
                origin.Source.load();
            } else {
                origin.env.api.play();
            }
            break;
        case 'pause':
            if (origin.options.onPause !== false) {
                origin.Callback.fn(origin.options.onPause, data);
            }
            origin.env.api.pause();
            break;
        case 'stop':
            if (origin.options.onStop !== false) {
                origin.Callback.fn(origin.options.onStop, data);
            }
            origin.env.api.pause();
            origin.env.api.currentTime = 0;
            origin.Ui.state(origin.env.buttons.play, 'pause', 'play');
            origin.Ui.icon(origin.env.buttons.play, 'julia-pause', 'julia-play');
            origin.env.buttons.bigPlay.show();
            origin.env.sliders.progress.update(0);
            break;
        case 'goto':
            origin.Ui.state(origin.env.preloader, '', 'on');
            data.currentTime = isNaN(Number(parseFloat(data.currentTime))) ? 0 : Number(parseFloat(data.currentTime));
            origin.env.api.currentTime = data.currentTime;
            if (origin.options.onPosition !== false) {
                origin.Callback.fn(origin.options.onPosition, data);
            }
            break;
        case 'setDuration':
            data.duration = isNaN(Number(parseFloat(data.duration))) ? 0 : Number(parseFloat(data.duration));
            origin.Ui.panel(origin.env.panels.duration, origin.Timecode.toHuman(data.duration));
            break;
        case 'volume':
            origin.options.volume = data.volume;
            origin.env.api.volume = parseFloat(data.volume / 100);
            origin.env.sliders.volume.update(data.volume);
            if (data.volume > 0) {
                origin.Controls.press('sound-on');
            } else {
                origin.Controls.press('sound-off');
            }
            break;
        case 'sound-on':
            origin.env.api.muted = false;
            origin.options.muted = false;
            origin.Persist.set('julia-player-volume', origin.options.volume, 999);
            origin.Persist.set('julia-player-muted', 0, 999);
            origin.Ui.state(origin.env.buttons.sound, 'off', 'on');
            origin.Ui.icon(origin.env.buttons.sound, 'julia-sound-off', 'julia-sound-on');
            break;
        case 'sound-off':
            origin.env.api.muted = true;
            origin.options.muted = true;
            origin.Persist.set('julia-player-volume', origin.options.volume, 999);
            origin.Persist.set('julia-player-muted', 1, 999);
            origin.Ui.state(origin.env.buttons.sound, 'on', 'off');
            origin.Ui.icon(origin.env.buttons.sound, 'julia-sound-on', 'julia-sound-off');
            break;
        case 'fullscreen-on':
            origin.Fullscreen.reset();
            origin.Fullscreen.on();
            break;
        case 'fullscreen-off':
            origin.Fullscreen.reset();
            origin.Fullscreen.off();
            break;
        default:
        }
        return;
    };
};

/* *****************************************
* JuliaPlayer HTML5 player
* DOM and api events
****************************************** */
JuliaPlayer.prototype._Events = function (origin) {
    var self = this;
    self.init = function () {
    };
    self.ui = function () {
        // Bottom bar
        origin.env.toolbarBottom.off().on('contextmenu', function (e) {
            e.stopPropagation();
            e.preventDefault();
        }).on('click', '.julia-play.play', function (e) {
            e.preventDefault();
            origin.Controls.press('play');
        }).on('click', '.julia-play.pause', function (e) {
            e.preventDefault();
            origin.Controls.press('pause');
        }).on('click', '.julia-sound.on', function (e) {
            e.preventDefault();
            origin.Controls.press('sound-off');
        }).on('click', '.julia-sound.off', function (e) {
            e.preventDefault();
            origin.Controls.press('sound-on');
        }).on('click', '.julia-fullscreen.on', function (e) {
            e.preventDefault();
            origin.Controls.press('fullscreen-on');
        }).on('click', '.julia-fullscreen.off', function (e) {
            e.preventDefault();
            origin.Controls.press('fullscreen-off');
        }).on('click', '.julia-settings', function (e) {
            e.preventDefault();
            if (origin.env.menus.settings.hasClass('on')) {
                origin.Ui.state(origin.env.menus.settings, 'on', '');
            } else {
                origin.Ui.state(origin.env.menus.settings, '', 'on');
            }
        });
        // Top bar
        origin.env.toolbarTop.off().on('contextmenu', function (e) {
            e.stopPropagation();
            e.preventDefault();
        });
        origin.env.menus.speed.off().on('change', '.julia-dropdown-select', function (e) {
            e.preventDefault();
            if (!isNaN(Number($(this).val()))) {
                origin.env.api.playbackRate = parseFloat(Number($(this).val()));
            }
        });
        origin.env.menus.video.off().on('change', '.julia-dropdown-select', function (e) {
            e.preventDefault();
            origin.debug({ 'Video bitrate: ': Number($(this).val()) });
            if (Number($(this).val()) == '-1') {
                origin.Switcher.setAutoBitrate('video', true);
            } else {
                origin.Switcher.setAutoBitrate('video', false);
                origin.Switcher.setBitrate('video', Number($(this).val()));
            }
        });
        origin.env.menus.audio.off().on('change', '.julia-dropdown-select', function (e) {
            e.preventDefault();
            if (Number($(this).val()) == '-1') {
                origin.Switcher.setAutoBitrate('audio', true);
            } else {
                origin.Switcher.setAutoBitrate('audio', false);
                origin.Switcher.setBitrate('audio', Number($(this).val()));
            }
        });
        origin.env.menus.audioTracks.off().on('change', '.julia-dropdown-select', function (e) {
            e.preventDefault();
            if (!isNaN(Number($(this).val()))) {
                origin.env.audioTrackActive = Number($(this).val());
                origin.debug({ 'trackIndex': origin.env.audioTrackActive });
                origin.Switcher.setTrack('audio', origin.env.audioTrackActive);
            }
        });
        origin.env.menus.subtitles.off().on('change', '.julia-dropdown-select', function (e) {
            e.preventDefault();
            if (!isNaN(Number($(this).val()))) {
                t = origin.Switcher.getTracks('text');
                origin.env.textTrackActive = Number($(this).val());
                origin.debug({
                    'trackIndex': origin.env.textTrackActive,
                    'trackObj': t[origin.env.textTrackActive]
                });
                origin.Subtitles.setTrack(origin.env.textTrackActive);
            }
        });
        origin.env.buttons.bigPlay.off().on('click contextmenu', function (e) {
            e.preventDefault();
            e.stopPropagation();
            if (e.type == 'click') {
                origin.Controls.press('play');
            }
        });
        // Area click
        origin.env.shield.off().on('dblclick click contextmenu', function (e) {
            e.preventDefault();
            e.stopPropagation();
            origin.Ui.state(origin.env.menus.settings, 'on', '');
            if (e.type == 'click') {
                if (origin.options.pauseOnClick === true && origin.Support.isMobile() === false) {
                    if (origin.env.api.paused === false) {
                        origin.Controls.press('pause');
                    } else {
                        origin.Controls.press('play');
                    }
                }
            }
            if (e.type == 'dblclick') {
                if (origin.env.instance.hasClass('julia-fullscreen-on')) {
                    origin.Controls.press('fullscreen-off');
                } else {
                    origin.Controls.press('fullscreen-on');
                }
            }
        });
        // Fullscreen toolbar behavior bindings
        var mouseMoveCleaner;
        origin.env.instance.off('mousemove touchmove', '.julia-shield, .julia-suggest').off('mouseover mousemove touchmove mouseout', '.julia-toolbar-top.julia-toolbar-visible, .julia-toolbar-bottom.julia-toolbar-visible, .julia-menu-settings.on').on('mousemove touchmove', '.julia-shield, .julia-suggest', function (e) {
            e.preventDefault();
            if (origin.env.started === true) {
                origin.env.toolbarBottom.addClass('julia-toolbar-visible');
                if (origin.options.source.title.length>0) {
                    origin.env.toolbarTop.addClass('julia-toolbar-visible');
                }
            }
            clearTimeout(mouseMoveCleaner);
            mouseMoveCleaner = setTimeout(function () {
                if (origin.env.started === true) {
                    origin.env.toolbarBottom.removeClass('julia-toolbar-visible');
                    if (origin.options.source.title.length>0) {
                        origin.env.toolbarTop.removeClass('julia-toolbar-visible');
                    }
                    origin.Ui.state(origin.env.menus.settings, 'on', '');
                }
            }, 1750);
        }).on('mouseover mousemove touchmove mouseout', '.julia-toolbar-top.julia-toolbar-visible, .julia-toolbar-bottom.julia-toolbar-visible, .julia-menu-settings.on', function (e) {
            e.preventDefault();
            if (origin.env.started === true) {
                origin.env.toolbarBottom.addClass('julia-toolbar-visible');
                if (origin.options.source.title.length>0) {
                    origin.env.toolbarTop.addClass('julia-toolbar-visible');
                }
            }
            clearTimeout(mouseMoveCleaner);
            if ([
                    'mouseout',
                    'touchend'
                ].lastIndexOf(e.type.toLowerCase()) > -1) {
                mouseMoveCleaner = setTimeout(function (e) {
                    if (origin.env.started === true) {
                        origin.env.toolbarBottom.removeClass('julia-toolbar-visible');
                        if (origin.options.source.title.length>0) {
                            origin.env.toolbarTop.removeClass('julia-toolbar-visible');
                        }
                        origin.Ui.state(origin.env.menus.settings, 'on', '');
                    }
                }, 1750);
            }
        });
        // Bind progressbar change
        $('body').off('julia.progress-change', '#julia-' + origin.env.ID).on('julia.progress-change', '#julia-' + origin.env.ID, function (e, data) {
            if (origin.env.started === true) {
                seekTo = origin.Timecode.toSeconds(data.percent);
                seekTo = seekTo >= origin.env.api.duration ? origin.env.api.duration : seekTo;
                origin.Controls.press('goto', { currentTime: seekTo });
            }
        });
        $('body').off('julia.volume-change', '#julia-' + origin.env.ID).on('julia.volume-change', '#julia-' + origin.env.ID, function (e, data) {
            origin.Controls.press('volume', { volume: data.percent });
        });
        // Fullscreen event included
        $(window).on('resize', function () {
            origin.Support.resize();
        });
    };
    self.native = function () {
        // Video playback detect
        origin.env.api.onplay = function (e) {
            origin.Ui.state(origin.env.buttons.play, 'play', 'pause');
            origin.Ui.icon(origin.env.buttons.play, 'julia-play', 'julia-pause');
            origin.env.buttons.bigPlay.hide();
            origin.env.sliders.progress.buffered();
            //origin.Ui.state( origin.env.preloader, 'on', '' );
            origin.Ui.state(origin.env.suggest, 'on', '');
            clearTimeout(origin.env.suggestTimer);
            if (origin.env.startupGoto > 0) {
                seekTo = origin.Timecode.toSeconds(origin.env.startupGoto);
                seekTo = seekTo >= origin.env.api.duration ? origin.env.api.duration : seekTo;
                origin.env.startupGoto = 0;
                origin.Controls.press('goto', { currentTime: seekTo });
            }
        };
        origin.env.api.onplaying = function (e) {
            origin.Ui.state(origin.env.buttons.play, 'play', 'pause');
            origin.Ui.icon(origin.env.buttons.play, 'julia-play', 'julia-pause');
            origin.env.sliders.progress.buffered();
            origin.Ui.state(origin.env.preloader, 'on', '');
            origin.Ui.state(origin.env.suggest, 'on', '');
            origin.env.started = true;
            clearTimeout(origin.env.suggestTimer);
            origin.env.errorRecoveryAttempts = 0;
            origin.Controls.press('setDuration', { 'duration': origin.env.api.duration });
        };
        // Video pause
        origin.env.api.onpause = function (e) {
            origin.Ui.state(origin.env.buttons.play, 'pause', 'play');
            origin.Ui.icon(origin.env.buttons.play, 'julia-pause', 'julia-play');
            setTimeout(function () {
                if (origin.env.api.paused === true || origin.env.api.ended === true) {
                    origin.env.buttons.bigPlay.show();
                }
            }, 400);
        };
        window.onerror = function (e) {
            window.__juliaPlayerForceStopAfterFatalError = true;
        };
        // Errors
        origin.env.api.onerror = function (e) {
            origin.debug({
                'Error event': e.type,
                'Attempts': origin.env.errorRecoveryAttempts,
                'Attempt limit': origin.env.errorRecoveryAttemptLimit
            });
            origin.Source.recover();
        };
        origin.env.api.onabort = function (e) {
            origin.debug({
                'Error event': e.type,
                'Attempts': origin.env.errorRecoveryAttempts,
                'Attempt limit': origin.env.errorRecoveryAttemptLimit
            }, true);
            origin.Source.recover();
        };
        origin.env.api.onemptied = function (e) {
            origin.debug({
                'Error event': e.type,
                'Attempts': origin.env.errorRecoveryAttempts,
                'Attempt limit': origin.env.errorRecoveryAttemptLimit
            }, true);
            origin.Source.recover();
        };
        origin.env.api.onstalled = function (e) {
            origin.debug({
                'Error event': e.type,
                'Attempts': origin.env.errorRecoveryAttempts,
                'Attempt limit': origin.env.errorRecoveryAttemptLimit
            }, true);
            origin.Source.recover();
        };
        origin.env.api.onsuspend = function (e) {
            origin.debug({
                'Error event': e.type,
                'Attempts': origin.env.errorRecoveryAttempts,
                'Attempt limit': origin.env.errorRecoveryAttemptLimit
            }, true);
            origin.Source.recover();
        };
        origin.env.api.onloadeddata = function (e) {
        };
        origin.env.api.oncanplaythrough = function (e) {
            origin.Controls.press('setDuration', { 'duration': origin.env.api.duration });
            if (origin.env.mode != 'hls' && origin.env.mode != 'dash') {
                if ((origin.env.continuePlayback === true || origin.options.autoplay === true) && (origin.env.api.paused === true || origin.env.api.ended === true) && origin.Support.isMobile() === false && origin.env.started === false) {
                    origin.env.api.play();
                }
            }
        };
        // Video position
        origin.env.api.ontimeupdate = function (e) {
            currentTimeReadable = origin.Timecode.toHuman(origin.env.api.currentTime);
            if (origin.env.api.seeking === false) {
                origin.env.sliders.progress.update(origin.Timecode.toPercents(origin.env.api.currentTime));
                origin.Ui.panel(origin.env.panels.currentTime, currentTimeReadable);    //origin.Ui.state( origin.env.preloader, 'on', '' );
            }
            origin.env.sliders.progress.buffered();
            origin.env.errorRecoveryAttempts = 0;
            origin.Callback.onTime(currentTimeReadable, origin.env.api.currentTime);
        };
        // Video position
        origin.env.api.onseeked = function (e) {
        };
        // Video position
        origin.env.api.onseeking = function (e) {
            origin.Ui.state(origin.env.preloader, '', 'on');
        };
        // Volume
        origin.env.api.onvolumechange = function (e) {
            if (origin.env.api.muted === false) {
                origin.env.sliders.volume.update(origin.env.api.volume * 100);
            } else {
                origin.env.sliders.volume.update(0);
            }
        };
        // Set video duration
        origin.env.api.ondurationchange = function (e) {
            origin.Controls.press('setDuration', { 'duration': origin.env.api.duration });
        };
        origin.env.api.onended = function (e) {
            origin.Controls.press('stop');
            origin.Suggest.run();
        };
        $(window).on('resize', function () {
            origin.Support.resize();
        });
    };
    // Specific events, error handlers
    self.hlsLibEvents = function () {
        if (origin.env.mode == 'hls') {
            // API READY
            origin.env.hls.on(origin.env.context.Hls.Events.MEDIA_ATTACHED, function (event, data) {
                origin.env.hls.loadSource(origin.options.source.file);
            });
            origin.env.hls.on(origin.env.context.Hls.Events.MANIFEST_PARSED, function (event, data) {
                bitratesVideo = origin.Switcher.getBitrateList('video');
                tracksAudio = origin.Switcher.getTracks('audio');
                origin.debug({
                    'Stream is initialized and ready': event,
                    'Video bitrate list': bitratesVideo,
                    'Audio track list': tracksAudio,
                    'ABR video bitrate': origin.Switcher.getAutoBitrate('video'),
                    'Video bitrate': origin.Switcher.getBitrate('video')
                });
                if (typeof bitratesVideo === 'object' && bitratesVideo && bitratesVideo.length > 1) {
                    origin.Ui.state(origin.env.menus.video, '', 'on');
                    active = origin.Switcher.getAutoBitrate('video') === true ? -1 : origin.Switcher.getBitrate('video');
                    menuItems = origin.Switcher.prepareBitrateMenu(bitratesVideo, [{
                            active: active,
                            value: -1,
                            title: origin.options.i18n.auto
                        }], active);
                    origin.Ui.menu(origin.env.menus.video, menuItems);
                    origin.Ui.menuDisabled(origin.env.menus.video, false);
                } else {
                    origin.Ui.state(origin.env.menus.video, 'on', '');
                    origin.Ui.menuDisabled(origin.env.menus.video, true);
                }
                // Audio tracks
                if (typeof tracksAudio === 'object' && tracksAudio && tracksAudio.length > 0) {
                    origin.Ui.state(origin.env.menus.audioTracks, '', 'on');
                    active = origin.env.audioTrackActive;
                    menuItems = origin.Switcher.prepareTrackMenu(tracksAudio, [], active);
                    origin.Ui.menu(origin.env.menus.audioTracks, menuItems);
                    origin.Ui.menuDisabled(origin.env.menus.audioTracks, false);
                } else {
                    origin.Ui.state(origin.env.menus.audioTracks, 'on', '');
                    origin.Ui.menuDisabled(origin.env.menus.audioTracks, true);
                }
                if (origin.env.continuePlayback === true && origin.env.started === true) {
                    origin.env.api.play();
                }
            });
            origin.env.hls.on(origin.env.context.Hls.Events.LEVEL_LOADED, function (event, data) {
                tracksAudio = origin.Switcher.getTracks('audio');
                // Audio tracks
                if (typeof tracksAudio === 'object' && tracksAudio && tracksAudio.length > 1) {
                    origin.Ui.state(origin.env.menus.audioTracks, '', 'on');
                    active = origin.env.audioTrackActive;
                    menuItems = origin.Switcher.prepareTrackMenu(tracksAudio, [], active);
                    origin.Ui.menu(origin.env.menus.audioTracks, menuItems);
                    origin.Ui.menuDisabled(origin.env.menus.audioTracks, false);
                } else {
                    origin.Ui.state(origin.env.menus.audioTracks, 'on', '');
                    origin.Ui.menuDisabled(origin.env.menus.audioTracks, true);
                }
            });
            // Error handling
            origin.env.hls.on(origin.env.context.Hls.Events.ERROR, function (event, data) {
                origin.debug({
                    'Recovering Hls Error': data.details,
                    'ErrorType': data.type,
                    'ErrorFatal': data.fatal,
                    'Data': data,
                    'Attempts': origin.env.errorRecoveryAttempts,
                    'Attempt limit': origin.env.errorRecoveryAttemptLimit
                }, true);
                if (origin.env.errorRecoveryAttempts >= origin.env.errorRecoveryAttemptLimit) {
                    if (data.fatal === true) {
                        // Bring to life again
                        switch (data.type) {
                        case origin.env.context.Hls.ErrorTypes.NETWORK_ERROR:
                            // try to recover network error
                            origin.env.hls.startLoad();
                            break;
                        case origin.env.context.Hls.ErrorTypes.MEDIA_ERROR:
                            if (origin.env.errorRecoveryAttempts > origin.env.errorRecoveryAttemptLimit / 10) {
                                origin.env.hls.swapAudioCodec();
                            }
                            // try to recover media error
                            origin.env.hls.recoverMediaError();
                            break;
                        default:
                            // try to recover other errors
                            origin.env.hls.startLoad();
                        }
                    }
                    origin.env.errorRecoveryAttempts++;
                } else {
                    origin.Source.recover();
                }
            });
        }
        ;
    };
    // Specific events, error handlers
    self.dashLibEvents = function () {
        if (origin.env.mode == 'dash') {
            Object.keys(origin.env.context.dashjs.MediaPlayer.events).map(function (eventName, index) {
                origin.env.dash.on(origin.env.context.dashjs.MediaPlayer.events[eventName], function (event) {
                    switch (event.type) {
                    case origin.env.context.dashjs.MediaPlayer.events.ERROR:
                        origin.debug({
                            'Recovering Dash Error': eventName,
                            'ErrorType': event.type,
                            'Error': event.error,
                            'Data': event,
                            'Attempts': origin.env.errorRecoveryAttempts,
                            'Attempt limit': origin.env.errorRecoveryAttemptLimit
                        }, true);
                        if (event.error === 'download') {
                            origin.Source.recover(true);
                        } else {
                            origin.Source.recover();
                        }
                        break;
                    case origin.env.context.dashjs.MediaPlayer.events.PLAYBACK_ERROR:
                    case origin.env.context.dashjs.MediaPlayer.events.BUFFER_EMPTY:
                    case origin.env.context.dashjs.MediaPlayer.events.FRAGMENT_LOADING_ABANDONED:
                        origin.debug({
                            'Recovering Dash Error': eventName,
                            'ErrorType': event.type,
                            'Data': event,
                            'Attempts': origin.env.errorRecoveryAttempts,
                            'Attempt limit': origin.env.errorRecoveryAttemptLimit
                        }, true);
                        origin.Source.recover();
                        break;
                    case origin.env.context.dashjs.MediaPlayer.events.MANIFEST_LOADED:
                        origin.debug({ 'Dash Manifest loaded': event });
                        origin.env.dashInitialized = true;
                        if (origin.env.continuePlayback === true && origin.env.started === true) {
                            origin.env.api.play();
                        }
                        break;
                    case origin.env.context.dashjs.MediaPlayer.events.STREAM_INITIALIZED:
                        bitratesVideo = origin.Switcher.getBitrateList('video');
                        bitratesAudio = origin.Switcher.getBitrateList('audio');
                        tracksAudio = origin.Switcher.getTracks('audio');
                        origin.debug({
                            'Stream is initialized and ready': event,
                            'Video bitrate list': origin.Switcher.getBitrateList('video'),
                            'Audio bitrate list': origin.Switcher.getBitrateList('audio'),
                            'Audio track list': origin.Switcher.getTracks('audio'),
                            'ABR video bitrate': origin.Switcher.getAutoBitrate('video'),
                            'ABR audio bitrate': origin.Switcher.getAutoBitrate('audio'),
                            'Video bitrate': origin.Switcher.getBitrate('video'),
                            'Audio bitrate': origin.Switcher.getBitrate('audio')
                        });
                        // Optional buffer tunnning
                        if (Object.keys(origin.options.dashConfig).indexOf('setRichBufferThreshold') > -1) {
                             origin.env.dash.setRichBufferThreshold(origin.options.dashConfig.setRichBufferThreshold);
                        }
                        if (Object.keys(origin.options.dashConfig).indexOf('setBufferToKeep') > -1) {
                             origin.env.dash.setBufferToKeep(origin.options.dashConfig.setBufferToKeep);
                        }
                        if (Object.keys(origin.options.dashConfig).indexOf('setBufferPruningInterval') > -1) {
                             origin.env.dash.setBufferPruningInterval(origin.options.dashConfig.setBufferPruningInterval);
                        }
                        if (Object.keys(origin.options.dashConfig).indexOf('setBufferTimeAtTopQuality') > -1) {
                             origin.env.dash.setBufferTimeAtTopQuality(origin.options.dashConfig.setBufferTimeAtTopQuality);
                        }
                        // Video bitrates
                        origin.env.dash.setFastSwitchEnabled(true);
                        if (typeof bitratesVideo === 'object' && bitratesVideo && bitratesVideo.length > 1) {
                            origin.Ui.state(origin.env.menus.video, '', 'on');
                            active = origin.Switcher.getAutoBitrate('video') === true ? -1 : origin.Switcher.getBitrate('video');
                            menuItems = origin.Switcher.prepareBitrateMenu(bitratesVideo, [{
                                    active: active,
                                    value: -1,
                                    title: origin.options.i18n.auto
                                }], active);
                            origin.Ui.menu(origin.env.menus.video, menuItems);
                            origin.Ui.menuDisabled(origin.env.menus.video, false);
                        } else {
                            origin.Ui.state(origin.env.menus.video, 'on', '');
                            origin.Ui.menuDisabled(origin.env.menus.video, true);
                        }
                        // Audio bitrates
                        if (typeof bitratesAudio === 'object' && bitratesAudio && bitratesAudio.length > 1) {
                            origin.Ui.state(origin.env.menus.audio, '', 'on');
                            active = origin.Switcher.getAutoBitrate('audio') === true ? -1 : origin.Switcher.getBitrate('audio');
                            menuItems = origin.Switcher.prepareBitrateMenu(bitratesAudio, [], active);
                            origin.Ui.menu(origin.env.menus.audio, menuItems);
                            origin.Ui.menuDisabled(origin.env.menus.audio, false);
                        } else {
                            origin.Ui.state(origin.env.menus.audio, 'on', '');
                            origin.Ui.menuDisabled(origin.env.menus.audio, true);
                        }
                        // Audio tracks
                        if (typeof tracksAudio === 'object' && tracksAudio && tracksAudio.length > 1) {
                            origin.Ui.state(origin.env.menus.audioTracks, '', 'on');
                            active = origin.env.audioTrackActive;
                            menuItems = origin.Switcher.prepareTrackMenu(tracksAudio, [], active);
                            origin.Ui.menu(origin.env.menus.audioTracks, menuItems);
                            origin.Ui.menuDisabled(origin.env.menus.audioTracks, false);
                        } else {
                            origin.Ui.state(origin.env.menus.audioTracks, 'on', '');
                            origin.Ui.menuDisabled(origin.env.menus.audioTracks, true);
                        }
                        break;
                    case origin.env.context.dashjs.MediaPlayer.events.TEXT_TRACK_ADDED:
                        // Subtitle tracks
                        tracksText = origin.Switcher.getTracks('text');
                        origin.debug({ 'Text track list': origin.Switcher.getTracks('text') });
                        if (typeof tracksText === 'object' && tracksText && tracksText.length > 0) {
                            origin.Ui.state(origin.env.menus.subtitles, '', 'on');
                            active = origin.env.textTrackActive;
                            menuItems = origin.Switcher.prepareTrackMenu(tracksText, origin.options.i18n.textItems, active);
                            origin.Ui.menu(origin.env.menus.subtitles, menuItems);
                            origin.Ui.menuDisabled(origin.env.menus.subtitles, false);
                        } else {
                            origin.Ui.state(origin.env.menus.subtitles, 'on', '');
                            origin.Ui.menuDisabled(origin.env.menus.subtitles, true);
                        }
                        break;
                    default:
                        origin.debug({
                            'Dash Event': eventName,
                            'EventType': event.type,
                            'Data': event,
                            'Attempts': origin.env.errorRecoveryAttempts,
                            'Attempt limit': origin.env.errorRecoveryAttemptLimit
                        });
                    }
                });
            });
        }
    };
};

/* *****************************************
* JuliaPlayer HTML5 player
* Fullscreen
* player fullscreen behavior
****************************************** */
JuliaPlayer.prototype._Fullscreen = function (origin) {
    var self = this;
    self.on = function () {
        if (origin.env.fullscreenFrame.requestFullscreen) {
            origin.env.fullscreenFrame.requestFullscreen();
        } else if (origin.env.fullscreenFrame.msRequestFullscreen) {
            origin.env.fullscreenFrame.msRequestFullscreen();
        } else if (origin.env.fullscreenFrame.mozRequestFullScreen) {
            origin.env.fullscreenFrame.mozRequestFullScreen();
        } else if (origin.env.fullscreenFrame.webkitRequestFullscreen) {
            origin.env.fullscreenFrame.webkitRequestFullscreen();
        } else {
            origin.debug({ 'Fullscreen': 'not supported' });
        }
    };
    self.off = function () {
        if (document.exitFullscreen) {
            document.exitFullscreen();
        } else if (document.msExitFullscreen) {
            document.msExitFullscreen();
        } else if (document.mozCancelFullScreen) {
            document.mozCancelFullScreen();
        } else if (document.webkitExitFullscreen) {
            document.webkitExitFullscreen();
        }
    };
    self.landscapeLock = function (lock) {
        if (origin.Support.isMobile()) {
            if (screen.orientation) {
                sor = screen.orientation;
            }
            if (screen.msLockOrientation) {
                sor = screen.msLockOrientation;
            }
            if (screen.mozLockOrientation) {
                sor = screen.mozLockOrientation;
            }
            if (typeof sor !== 'undefined' && sor.lock && typeof sor.lock === 'function') {
                if (lock === true) {
                    sor.lock('landscape-primary').catch(function (err) {
                        origin.debug({ 'Landscape lock error: ': err }, true);
                    });
                } else if (sor.unlock && typeof sor.unlock === 'function') {
                    sor.unlock();
                }
            }
        }
    };
    self.reset = function () {
        $(document).off('webkitfullscreenchange mozfullscreenchange fullscreenchange MSFullscreenChange');
        // Fullscreen change event handler
        $(document).on('webkitfullscreenchange mozfullscreenchange fullscreenchange MSFullscreenChange', function (e) {
            if (!document.fullscreenElement && !document.mozFullScreenElement && !document.webkitFullscreenElement && !document.msFullscreenElement) {
                origin.Ui.state(origin.env.instance, 'julia-fullscreen-on', 'julia-fullscreen-off');
                origin.Ui.state(origin.env.buttons.fullscreen, 'off', 'on');
                origin.Ui.icon(origin.env.buttons.fullscreen, 'julia-fullscreen-exit', 'julia-fullscreen');
                self.landscapeLock(false);
                origin.debug({ 'Fullscreen off': '#julia-player-' + origin.env.ID });
            } else {
                origin.Ui.state(origin.env.instance, 'julia-fullscreen-off', 'julia-fullscreen-on');
                origin.Ui.state(origin.env.buttons.fullscreen, 'on', 'off');
                origin.Ui.icon(origin.env.buttons.fullscreen, 'julia-fullscreen', 'julia-fullscreen-exit');
                self.landscapeLock(true);
                origin.debug({ 'Fullscreen on': '#julia-player-' + origin.env.ID });
            }
            origin.Support.resize();
        });
    };
};

/* *****************************************
* JuliaPlayer HTML5 player
* Persistent settings
* options are stored in cookies
****************************************** */
JuliaPlayer.prototype._Persist = function (origin) {
    var self = this;
    self.set = function (name, value, days) {
        dateObj = new Date();
        dateObj.setTime(dateObj.getTime() + days * 24 * 60 * 60 * 1000);
        var expires = 'expires=' + dateObj.toUTCString();
        document.cookie = name + '=' + value + '; ' + expires + '; path=/';
    };
    self.get = function (name) {
        var name = name + '=';
        var ca = document.cookie.split(';');
        for (var i = 0; i < ca.length; i++) {
            var c = ca[i];
            while (c.charAt(0) == ' ') {
                c = c.substring(1);
            }
            if (c.indexOf(name) == 0) {
                return c.substring(name.length, c.length);
            }
        }
        return undefined;
    };
};

/* *****************************************
* JuliaPlayer HTML5 media player
* Slider controller
* Progress and volume widget library
****************************************** */
JuliaPlayer.prototype._Slider = function (origin, options) {
    var self = this, leftButtonDown = false, ua = navigator.userAgent, isChrome = /chrome/i.exec(ua), isAndroid = /android/i.exec(ua), hasTouch = 'ontouchstart' in window && !(isChrome && !isAndroid), _normalize = function (percent) {
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
            var pos = hasTouch === true && e.originalEvent.touches ? e.originalEvent.touches[0].pageX - self.model.offset().left : e.originalEvent.pageX - self.model.offset().left;
            percent = _posToPercent(pos);
            return percent;
        }, _pixels = function (e) {
            var pos = hasTouch === true && e.originalEvent.touches ? e.originalEvent.touches[0].pageX - self.model.offset().left : e.originalEvent.pageX - self.model.offset().left;
            return pos;
        }, model = $('<div class="julia-slider">' + '<div class="julia-slider-track" data-julia-slider-component="track"></div>' + '<div class="julia-slider-track-visible" data-julia-slider-component="track-visible"></div>' + '<div class="julia-slider-handle" data-julia-slider-component="handle"></div>' + '<div class="julia-slider-fill" data-julia-slider-component="fill"></div>' + '</div>');
    self.model = model.clone();
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
            _percent1 = _normalize(origin.Timecode.toPercents(b.start(i)));
            _percent2 = _normalize(origin.Timecode.toPercents(b.end(i)));
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
            eventPrevent = false;
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
                origin.event('julia.' + self.options.event, origin.env.instance, { 'percent': percent });
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
    self.model.on('click mouseover mousemove mouseout', function (e) {
        if (e.type == 'click') {
            self.slide(_position(e), false);
        }
        if ((e.type == 'mouseover' || e.type == 'mousemove') && self.options.event == 'progress-change' && origin.env.started === true) {
            pos = _position(e);
            pix = _pixels(e);
            if (origin.Support.isMobile() === false && origin.options.source.live === false && origin.options.thumbs === true) {
                origin.Thumbs.thumb(origin.Timecode.toSeconds(pos));
            }
            origin.Ui.state(origin.env.labels.goto, '', 'on');
            origin.Ui.panel(origin.env.labels.goto, origin.Timecode.toHuman(origin.Timecode.toSeconds(pos)));
            left = pix + 'px';
            border = origin.env.labels.goto.innerWidth() / 2;
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
        if (e.type == 'mouseout' && self.options.event == 'progress-change') {
            origin.Ui.state(origin.env.labels.goto, 'on', '');
        }
    });
    self.model.on('mousedown touchstart', function (e) {
        // Left mouse button activate
        if (e.type == 'touchstart') {
            self.slide(_position(e), false);
        }
        leftButtonDown = true;
    });
    $(document).on('mouseup touchend', function (e) {
        // Left mouse button deactivate
        leftButtonDown = false;
    });
    $(document).on('mousemove touchmove', function (e) {
        if (leftButtonDown === true) {
            self.slide(_position(e));
        }
    });
    return self;
};

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
        if (typeof window.__juliaPlayerForceStopAfterFatalError === 'boolean' && window.__juliaPlayerForceStopAfterFatalError === true) {
            origin.Controls.press('stop');
            window.__juliaPlayerForceStopAfterFatalError = false;
        }
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
            origin.env.toolbarBottom.addClass('julia-toolbar-visible');
        }

        if (origin.env.errorRecoveryAttempts >= origin.env.errorRecoveryAttemptLimit || force === true) {
            origin.Controls.press('stop');
            origin.Source.set();
        } else {
            origin.env.errorRecoveryAttempts++;
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

/* *****************************************
* JuliaPlayer HTML5 player
* suggest playlist engine
****************************************** */
JuliaPlayer.prototype._Suggest = function (origin) {
    var self = this;
    self.run = function () {
        origin.env.suggest.html('');
        origin.env.suggestClicked = false;
        origin.env.buttons.bigPlay.hide();
        if (origin.options.suggest.length > 0) {
            x = 0;
            for (var i in origin.options.suggest) {
                if (x < origin.options.suggestLimit && origin.options.suggest[i].played === false) {
                    live = !!origin.options.suggest[i].live && origin.options.suggest[i].live === true ? true : false;
                    file = !!origin.options.suggest[i].file ? origin.options.suggest[i].file : '';
                    poster = !!origin.options.suggest[i].poster ? origin.options.suggest[i].poster : '';
                    title = !!origin.options.suggest[i].title ? origin.options.suggest[i].title : '';
                    link = !!origin.options.suggest[i].link ? origin.options.suggest[i].link : '';
                    mode = !!origin.options.suggest[i].mode ? origin.options.suggest[i].mode : 'legacy';
                    posterImage = poster.length > 0 ? '<img src="' + poster + '" width="100%" height="100%">' : '';
                    suggestItemWidget = $('<div class="julia-suggest-item" data-item-poster="' + poster + '" data-item-file="' + file + '" data-item-link="' + link + '" data-mode="' + mode + '" data-item-title="' + title + '" data-index="' + i + '" data-item-mode="' + mode + '" data-item-live="' + live + '">' + posterImage + '<div class="julia-suggest-item-title">' + title + '</div>' + '</div>');
                    suggestItemWidget.on('click', function (e) {
                        origin.Ui.state(origin.env.preloader, '', 'on');
                        if (origin.options.onSuggest !== false) {
                            origin.Callback.fn(origin.options.onSuggest, i);
                        }
                        origin.Thumbs.shadowApi = false;
                        origin.env.suggestClicked = true;
                        origin.options.autoplay = true;
                        origin.Source.set({
                            file: $(this).data('item-file'),
                            poster: $(this).data('item-poster'),
                            title: $(this).data('item-title'),
                            link: $(this).data('item-link'),
                            mode: $(this).data('item-mode'),
                            live: $(this).data('item-live')
                        });
                        origin.debug({
                            suggestRemoveIndex: $(this).data('index'),
                            suggestRemove: $(this).data('item-file')
                        });
                        origin.options.suggest[$(this).data('index')].played = true;
                        origin.Ui.state(origin.env.suggest, 'on', '');    //origin.Controls.press('play');
                    });
                    origin.debug({ 'Suggest item': suggestItemWidget });
                    origin.env.suggest.append(suggestItemWidget);
                    x++;
                }
            }
            if (x > 0) {
                if (origin.options.suggestTimeout > 0) {
                    origin.env.suggestTimer = setTimeout(function () {
                        if (origin.env.suggestClicked === false) {
                            origin.env.suggest.find('div.julia-suggest-item:first').click();
                        }
                    }, origin.options.suggestTimeout);
                }
                origin.Ui.state(origin.env.suggest, '', 'on');
            }
        } else {
            origin.Fullscreen.off();
        }
        origin.debug({ 'Suggest': 'raised' + origin.options.suggest.length });
    };
};

/* *****************************************
* JuliaPlayer HTML5 player
* Suppport utilities
****************************************** */
JuliaPlayer.prototype._Support = function(origin)
{
    var self = this;


    self.aspect = function(w,h)
    {
        return w>0 && h>0 ? h/w: 0;
    };


    self.bitrate = function(bites)
    {
        var i = -1;
        var biteUnits = ['kbps', 'Mbps', 'Gbps'];
        do {
            bites = bites / 1000;
            i++;
        } while (bites > 1000);

        return Math.max(bites, 0.1).toFixed(1) + biteUnits[i];
    };


    self.forceReadyState = function()
    {
        if( /Firefox/i.test(navigator.userAgent) )
        {
            return true;
        }

        return false;
    };


    self.isCallable = function(v)
    {
        return (!v || (typeof v !== 'object' && typeof v !== 'function')) ? false: true;
    };


    self.isMobile = function()
    {
        if( /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile/i.test(navigator.userAgent) )
        {
            return true;
        }

        return false;
    };


    self.iOS = function()
    {
        if( /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream )
        {
            return true;
        }

        return false;
    };


    self.isVisible = function()
    {
        var rect = document.querySelector('#julia-'+origin.env.ID).getBoundingClientRect();
        var viewHeight = Math.max(document.documentElement.clientHeight, window.innerHeight);
        return !( rect.bottom < 0 || rect.top - viewHeight >= 0 );
    };


    self.canPlayMedia = function()
    {
        origin.env.canPlayMediaString = origin.env.mode == 'legacy' ? origin.env.api.canPlayType('video/mp4'): origin.env.api.canPlayType('application/vnd.apple.mpegURL');
        origin.env.canPlayMedia = (origin.env.canPlayMediaString == 'probably' || origin.env.canPlayMediaString == 'maybe');
        return origin.env.canPlayMedia;
    };


    self.resize = function()
    {
        // Player dimensions
        defaultDim = origin.env.element.width() ? [origin.env.element.width(), origin.env.element.height()]: [origin.options.width, origin.options.height];
        dimensions = origin.options.responsive === true ? self.getSize(): defaultDim;

        origin.env.instance.width(dimensions[0]);
        origin.env.instance.height(dimensions[1]);

        origin.env.wrapper.width(dimensions[0]);
        origin.env.wrapper.height(dimensions[1]);

        origin.env.dimensions.width = dimensions[0];
        origin.env.dimensions.height = dimensions[1];

        // Small size fix, BAD BOY!
        $('.julia-toolbar-bottom-'+origin.env.ID+':not(.live) .julia-panel.julia-currentTime, .julia-toolbar-bottom-'+origin.env.ID+':not(.live) .julia-panel.julia-duration')
        .css({
            'display': dimensions[0] < 360 ? 'none': 'block'
        });

        origin.env.api.setAttribute('width', '100%');
        origin.env.api.setAttribute('height', '100%');
    };


    self.getSize = function()
    {
        // Fix video wrapped in inline block, can not get size properlym if inline element detected
        var parentBlock = origin.env.element.parent().css('display').toLowerCase();
        if( parentBlock == 'inline' )
        {
            origin.env.element.parent().css({'display': 'block'});
        }

        var parentWidth = origin.env.element.parent().width();

        for( i in origin.options.dimensions )
        {
            dim = origin.options.dimensions[i];

            if( parentWidth >= dim[0] )
            {
                dimensions = [dim[0],( dim[0]*self.aspect( dim[0], dim[1] ) )];
                return dimensions;
            }
        }

        dimensions = [parentWidth, (parentWidth*self.aspect( dim[0], dim[1] ))];

        return dimensions;
    };
};

/* *****************************************
* JuliaPlayer HTML5 player
* Subtitles
* Play optional subtitles
****************************************** */
JuliaPlayer.prototype._Subtitles = function (origin) {
    var self = this;
    self.setTrack = function (track) {
        switch (origin.env.mode) {
        case 'dash':
            return origin.env.dash.setTextTrack(track);
            break;
        default:    //---------
        };
    };
    self.textTracksCleaner = function () {
        var tracks = origin.env.api.textTracks;
        if (tracks && tracks.length && tracks.length > 0 && tracks.length > 0) {
            for (i in tracks) {
                track = tracks[i];
                if (track && track.kind && (track.kind == 'subtitles' || track.kind == 'captions')) {
                    track.mode = 'disabled';
                }
            }
        }
    };
};

/* *****************************************
* JuliaPlayer HTML5 player
* Switcher
* detect and switch video and audio tracks
****************************************** */
JuliaPlayer.prototype._Switcher = function (origin) {
    var self = this;
    self.getBitrateList = function (type) {
        switch (origin.env.mode) {
        case 'dash':
            return origin.env.dash.getBitrateInfoListFor(type);
            break;
        case 'hls':
            return origin.env.hls.levels;
            break;
        default:
            return [];
        }
    };
    // Manual bitrate
    self.getBitrate = function (type) {
        switch (origin.env.mode) {
        case 'dash':
            return origin.env.dash.getQualityFor(type);
            break;
        case 'hls':
            return origin.env.hls.currentLevel;
            break;
        default:
            return 0;
        }
    };
    self.setBitrate = function (type, value) {
        switch (origin.env.mode) {
        case 'dash':
            origin.env.dash.setQualityFor(type, value);
            break;
        case 'hls':
            origin.env.hls.currentLevel = value;
            break;
        default:    //---------
        }
    };
    // Automatic bitrate
    self.getAutoBitrate = function (type) {
        switch (origin.env.mode) {
        case 'dash':
            return origin.env.dash.getAutoSwitchQualityFor(type);
            break;
        case 'hls':
            return origin.env.hls.autoLevelEnabled;
            break;
        default:
            return true;
        }
    };
    self.setAutoBitrate = function (type, value) {
        switch (origin.env.mode) {
        case 'dash':
            origin.env.dash.setAutoSwitchQualityFor(type, value);
            break;
        case 'hls':
            if (type == 'video' && value === true) {
                origin.env.hls.currentLevel = -1;
            }
            break;
        default:    //---------
        }
    };
    self.getTracks = function (type) {
        switch (origin.env.mode) {
        case 'dash':
            return origin.env.dash.getTracksFor(type);
            break;
        case 'hls':
            return origin.env.hls.audioTracks;
            break;
        default:    //---------
        }
    };
    self.setTrack = function (type, track) {
        switch (origin.env.mode) {
        case 'dash':
            t = origin.Switcher.getTracks(type);
            origin.env.dash.setCurrentTrack(t[track]);
            break;
        case 'hls':
            origin.env.hls.audioTrack = track;
            break;
        default:    //---------
        }
    };
    self.prepareTrackMenu = function (data, menuData, active) {
        menuData = typeof menuData !== 'object' ? [] : menuData;
        active = typeof active !== 'number' ? 1 : active;
        switch (origin.env.mode) {
        case 'dash':
            for (i in data) {
                menuData.push({
                    active: active,
                    value: i,
                    title: data[i].lang
                });
            }
            break;
        case 'hls':
            for (i in data) {
                menuData.push({
                    active: active,
                    value: i,
                    title: data[i].name ? data[i].name : data[i].lang
                });
            }
            break;
        default:
        }
        return menuData;
    };
    self.prepareBitrateMenu = function (data, menuData, active) {
        menuData = typeof menuData !== 'object' ? [] : menuData;
        active = typeof active !== 'number' ? 0 : active;
        switch (origin.env.mode) {
        case 'dash':
            for (i in data) {
                menuData.push({
                    active: active,
                    value: data[i].qualityIndex,
                    title: origin.Support.bitrate(data[i].bitrate)
                });
            }
            break;
        case 'hls':
            for (i in data) {
                menuData.push({
                    active: active,
                    value: i,
                    title: origin.Support.bitrate(data[i].bitrate)
                });
            }
            break;
        default:
        }
        return menuData;
    };
};

/* *****************************************
* JuliaPlayer HTML5 media player
* Timecode
* utilities for timecode conversion
****************************************** */
JuliaPlayer.prototype._Timecode = function (origin) {
    var self = this;
    self.toPercents = function (currentTime) {
        duration = origin.env.api.duration;
        if (isNaN(duration) || typeof Number(duration) !== 'number') {
            duration = 0;
        }
        if (isNaN(currentTime) || typeof Number(currentTime) !== 'number') {
            currentTime = 0;
        }
        return duration > 0 ? currentTime / duration * 100 : 0;
    };
    self.toSeconds = function (percent) {
        duration = origin.env.api.duration;
        if (isNaN(duration) || typeof Number(duration) !== 'number') {
            duration = 0;
        }
        if (isNaN(percent) || typeof Number(percent) !== 'number') {
            percent = 0;
        }
        return duration / 100 * percent;
    };
    self.toNum = function (human) {
        human = human.split(':');
        human.reverse();
        s = parseInt(human[0]);
        m = human.length > 1 ? parseInt(human[1]) : 0;
        h = human.length > 2 ? parseInt(human[3]) : 0;
        t = s + m * 60 + h * 60 * 60;
        return t;
    };
    self.toHuman = function (time) {
        if (isNaN(time) || typeof Number(time) !== 'number') {
            time = 0;
        }
        time = time.toString().split('.');
        s = time[0];
        H = Math.floor(s / 3600);
        M = Math.floor((s - H * 3600) / 60);
        S = Math.floor(s - H * 3600 - M * 60);
        H = ('0' + H.toString()).slice(-2);
        M = ('0' + M.toString()).slice(-2);
        S = ('0' + S.toString()).slice(-2);
        str = H > 0 ? H + ':' + M + ':' + S : M + ':' + S;
        return str;
    };
};

/* *****************************************
* JuliaPlayer HTML5 player
* Timeline thumbnails
****************************************** */
JuliaPlayer.prototype._Thumbs = function (origin) {
    var self = this;
    self.shadowApi = false;
    self.canvas = false;
    self.context = false;
    self.imageThumb = false;
    self.imageCache = {};
    // Create shadow api and grab thumbnail
    self.dim = function (i) {
        var dim = [
            origin.env.instance.width(),
            origin.env.instance.height()
        ];
        var a = dim[1] / dim[0];
        var dimensions = [
            128,
            128 * a
        ];
        return dimensions;
    };
    // Create 100 thumbs
    self.thumb = function (t) {
        var dimensions = self.dim(i);
        var width = Math.floor(dimensions[0]);
        var height = Math.floor(dimensions[1]);
        if (self.shadowApi === false) {
            self.imageCache = {};
            origin.env.labels.goto.css({
                width: dimensions[0] + 10 + 'px',
                height: 40 + dimensions[1] + 10 + 'px',
                overflow: 'hidden'
            });
            self.canvas = document.createElement('canvas');
            self.canvas.width = width;
            self.canvas.height = height;
            self.context = self.canvas.getContext('2d');
            self.imageThumb = document.createElement('img');
            self.imageThumb.style.width = width + 'px';
            self.imageThumb.style.height = height + 'px';
            origin.env.labels.goto.find('img').remove();
            origin.env.labels.goto.append(self.imageThumb);
            //document.createElement('video');
            //console.log(origin.env.api);
            self.shadowApi = origin.env.api.cloneNode(true);
            self.shadowApi.width = width;
            self.shadowApi.height = height;
            self.shadowApi.preload = 'auto';
            // ************************
            // HLS library supported
            // and HLS requested
            // ************************
            if (origin.env.mode === 'hls') {
                self.hls = new Hls(origin.options.hlsConfig);    // ************************
                                                                 // Dash
                                                                 // ************************
            } else if (origin.env.mode === 'dash') {
            } else {
                self.shadowApi.src = origin.options.source.file;
            }
            // ************************
            // HLS library supported
            // and HLS requested
            // ************************
            if (origin.env.mode === 'hls') {
                self.hls.autoLevelCapping = -1;
                self.hls.attachMedia(self.shadowApi);
                self.hls.loadSource(origin.options.source.file);    // ************************
                                                                    // Usig DASH library
                                                                    // ************************
            } else if (origin.env.mode === 'dash') {
                self.dash = dashjs.MediaPlayer().create();
                self.dash.initialize();
                self.dash.attachView(self.shadowApi);
                self.dash.attachSource(origin.options.source.file);
                self.dash.setAutoPlay(false);
                self.dash.getDebug().setLogToBrowserConsole(false);    // ************************
                                                                       // Classic VOD file
                                                                       // ************************
            } else {
                self.shadowApi.load();
            }
        }
        origin.env.thumbsOk = false;
        index = Math.floor(t);
        if (index in self.imageCache) {
            self.image(width, height, index);
        } else {
            self.shadowApi.currentTime = index;
            self.image(width, height, index);
        }
    };
    self.image = function (width, height, index) {
        if (index in self.imageCache) {
            self.imageThumb.src = self.imageCache[index];
            origin.env.thumbsOk = true;
        } else if (parseInt(self.shadowApi.readyState) == 4) {
            self.context.drawImage(self.shadowApi, 0, 0, width, height);
            dataURL = self.canvas.toDataURL();
            if (dataURL != null && dataURL != undefined) {
                self.cache(index, dataURL);
                self.imageThumb.src = dataURL;
            }
            origin.env.thumbsOk = true;
        } else {
            setTimeout(function () {
                self.image(width, height, index);
            }, 70);
        }
    };
    self.cache = function (index, data) {
        if (index in self.imageCache) {
            return self.imageCache[index];
        } else {
            self.imageCache[index] = data;
        }
        return data;
    };
};

/* *****************************************
* JuliaPlayer HTML5 player
* User interface, DOM model
****************************************** */
JuliaPlayer.prototype._Ui = function (origin) {
    var self = this;
    self.create = function () {
        if (origin.env.instance.length > 0) {
            origin.env.instance.remove();
        }
        platformClass = origin.Support.isMobile() === false ? 'julia-desktop' : 'julia-mobile';
        // Main container
        origin.env.instance = $('<div class="julia-player off julia-fullscreen-off julia-' + origin.env.ID + ' ' + platformClass + '" id="julia-' + origin.env.ID + '"></div>');
        // Wrapper
        origin.env.wrapper = $('<div class="julia-wrapper"><video class="julia-video" id="julia-api-' + origin.env.ID + '" preload="auto" webkit-playsinline playsinline></video></div>');
        // Shield
        origin.env.shield = $('<div class="julia-shield" id="julia-shield-' + origin.env.ID + '"></div>');
        // Preloader
        origin.env.preloader = $('<div class="julia-preloader"></div>');
        // Suggest
        origin.env.suggest = $('<div class="julia-suggest" id="julia-suggest-' + origin.env.ID + '"></div>');
        // Toolbars
        origin.env.toolbarTop = $('<div class="julia-toolbar julia-toolbar-top" id="julia-toolbar-top-' + origin.env.ID + '"></div>');
        origin.env.toolbarBottom = $('<div class="julia-toolbar julia-toolbar-bottom" id="julia-toolbar-bottom-' + origin.env.ID + '"></div>');
        // Messaging layer
        origin.env.notifier = $('<div class="julia-notifier" id="julia-notifier-' + origin.env.ID + '"></div>');
        // Buttons
        origin.env.buttons.bigPlay = $('<button class="julia-btn julia-big-play"><i class="julia-icon julia-play-circle"></i></button>');
        origin.env.buttons.play = $('<button class="julia-btn julia-play play">' + '    <i class="julia-icon julia-play"></i>' + '</button>');
        origin.env.buttons.next = $('<button class="julia-btn julia-next" title="' + origin.env.i18n.next + '">' + '    <i class="julia-icon julia-chevron-right"></i>' + '</button>');
        origin.env.buttons.previous = $('<button class="julia-btn julia-previous" title="' + origin.env.i18n.previous + '">' + '    <i class="julia-icon julia-chevron-left"></i>' + '</button>');
        origin.env.buttons.close = $('<button class="julia-btn julia-close" title="' + origin.env.i18n.close + '">' + '    <i class="julia-icon julia-close"></i>' + '</button>');
        origin.env.buttons.fullscreen = $('<button class="julia-btn julia-fullscreen on">' + '    <i class="julia-icon julia-fullscreen"></i>' + '</button>');
        origin.env.buttons.sound = $('<button class="julia-btn julia-sound on">' + '    <i class="julia-icon julia-sound-on"></i>' + '</button>');
        origin.env.buttons.settings = $('<button class="julia-btn julia-settings off">' + '    <i class="julia-icon julia-gear"></i>' + '</button>');
        // Range bars
        origin.env.ranges.volume = $('<div class="julia-volume">' + '  <input type="range" value="' + origin.options.volume + '" min="0" max="100" step="1" class="julia-range">' + '</div>');
        origin.env.ranges.progress = $('<div class="julia-progress">' + '  <input type="range" value="0" min="0" max="100" step="' + origin.env.progressStep + '" class="julia-range">' + '</div>');
        // Labels
        origin.env.labels.goto = $('<div class="julia-label julia-label-goto">' + '    <span>00:00:00</span>' + '</div>');
        // Menus
        origin.env.menus.settings = $('<div class="julia-menu julia-menu-settings">' + '    <div class="julia-menu-title">' + origin.options.i18n.settings + '</div>' + '    <table><tbody></tbody></table>' + +'</div>');
        // Menu blocks
        origin.env.menus.video = $('<tr class="julia-menu-item julia-menu-item-video"><td class="julia-menu-item-title">' + origin.options.i18n.video + '</td><td><div class="julia-dropdown"><select name="video" class="julia-dropdown-select" disabled="disabled"></select></div>' + '</td></tr>');
        origin.env.menus.audio = $('<tr class="julia-menu-item julia-menu-item-audio"><td class="julia-menu-item-title">' + origin.options.i18n.audio + '</td><td><div class="julia-dropdown"><select name="audio" class="julia-dropdown-select" disabled="disabled"></select></div>' + '</td></tr>');
        origin.env.menus.audioTracks = $('<tr class="julia-menu-item julia-menu-item-audioTracks"><td class="julia-menu-item-title">' + origin.options.i18n.audioTracks + '</td><td><div class="julia-dropdown"><select name="audioTracks" class="julia-dropdown-select" disabled="disabled"></select></div>' + '</td></tr>');
        origin.env.menus.subtitles = $('<tr class="julia-menu-item julia-menu-item-subtitles"><td class="julia-menu-item-title">' + origin.options.i18n.subtitles + '</td><td><div class="julia-dropdown"><select name="subtitles" class="julia-dropdown-select" disabled="disabled"></select></div>' + '</td></tr>');
        origin.env.menus.speed = $('<tr class="julia-menu-item julia-menu-item-speed on"><td class="julia-menu-item-title">' + origin.options.i18n.speed + '</td><td><div class="julia-dropdown"><select name="speed" class="julia-dropdown-select"></select></div>' + '</td></tr>');
        // Passive info panels
        origin.env.panels.title = $('<div class="julia-panel julia-title">' + '    <span></span>' + '</div>');
        origin.env.panels.live = $('<div class="julia-panel julia-live-indicator">' + '    <span>' + origin.options.i18n.liveText + '</span>' + '</div>');
        origin.env.panels.currentTime = $('<div class="julia-panel julia-currentTime">' + '    <span>00:00:00</span>' + '</div>');
        origin.env.panels.duration = $('<div class="julia-panel julia-duration">' + '    <span>00:00:00</span>' + '</div>');
        //--odn-handle-start--
        origin.env.toolbarBottom.append([
            origin.env.buttons.play,
            origin.env.buttons.sound,
            origin.env.buttons.fullscreen,
            origin.env.buttons.settings,
            origin.env.ranges.progress,
            origin.env.ranges.volume,
            origin.env.panels.currentTime,
            origin.env.panels.duration,
            origin.env.labels.goto
        ]);
        origin.env.toolbarTop.append([origin.env.panels.title]);
        // Build menu
        origin.env.menus.settings.find('tbody').append([
            origin.env.menus.video,
            origin.env.menus.audio,
            origin.env.menus.audioTracks,
            origin.env.menus.speed,
            origin.env.menus.subtitles
        ]);
        origin.Ui.menu(origin.env.menus.speed, origin.options.i18n.speedItems);
        // Compose content DOM object
        origin.env.wrapper.append([
            origin.env.shield,
            origin.env.suggest,
            origin.env.notifier,
            origin.env.buttons.bigPlay,
            origin.env.preloader,
            origin.env.toolbarTop,
            origin.env.toolbarBottom,
            origin.env.menus.settings
        ]);
        if (origin.options.autoplay === true && origin.Support.isMobile() === false) {
            origin.env.buttons.bigPlay.hide();
        }
        // Compose final object
        origin.env.instance.append([origin.env.wrapper]);
        origin.env.element.append(origin.env.instance);
        origin.debug({
            'Julia instance created': origin.env.instance,
            'Julia instance appended to': origin.env.element
        });
        // Video api
        setTimeout( function() {
            origin.env.api = document.getElementById('julia-api-' + origin.env.ID);
            origin.env.api.controls = false;
            origin.debug({ 'Api object': 'julia-api-' + origin.env.ID });
            self.zIndexize();
            origin.Ui.state(origin.env.instance, '', 'on');
            origin.event('julia.ui-created', origin.env.instance);
        }, 250);
        //--odn-handle-stop--
    };
    self.icon = function (element, remove, add) {
        element.find('i').removeClass(remove).addClass(add);
    };
    self.state = function (element, remove, add) {
        element.removeClass(remove).addClass(add);
    };
    self.panel = function (element, value) {
        element.find('span').html(value);
    };
    self.notify = function (message) {
        origin.env.notifier.html(message);
        if (message.length > 0) {
            self.state(origin.env.notifier, '', 'on');
        } else {
            self.state(origin.env.notifier, 'on', '');
        }
    };
    self.reset = function () {
        origin.Ui.state(origin.env.menus.video, 'on', '');
        origin.Ui.menuDisabled(origin.env.menus.video, true);
        origin.Ui.state(origin.env.menus.audio, 'on', '');
        origin.Ui.menuDisabled(origin.env.menus.audio, true);
        origin.Ui.state(origin.env.menus.audioTracks, 'on', '');
        origin.Ui.menuDisabled(origin.env.menus.audioTracks, true);
        origin.Ui.state(origin.env.menus.subtitles, 'on', '');
        origin.Ui.menuDisabled(origin.env.menus.subtitles, true);
    };
    self.menu = function (element, data) {
        element.find('select>option').remove();
        for (i in data) {
            s = $('<option value="' + data[i].value + '">' + data[i].title + '</option>');
            if (Object.keys(data[i]).indexOf('active') > -1 && data[i].value == data[i].active) {
                s.prop('selected', true);
            }
            element.find('select').append(s);
        }
    };
    self.menuDisabled = function (element, state) {
        element.find('select').prop('disabled', state);
    };
    self.zIndexize = function () {
        var indexHighest = origin.options.zIndexStart;
        var layers = [
            origin.env.instance,
            origin.env.wrapper,
            $('#julia-api-' + origin.env.ID),
            origin.env.preloader,
            origin.env.shield,
            origin.env.toolbarTop,
            origin.env.toolbarBottom,
            origin.env.suggest,
            origin.env.menus.settings,
            origin.env.buttons.bigPlay,
            origin.env.notifier,
        ];
        layers.map(function (x, i) {
            layers[i].css({ 'z-index': indexHighest + i });
            return x;
        });
    };
};

/* *****************************************
* JuliaPlayer HTML5 player
* jQuery plugin & extension
****************************************** */
// Extension for non DOM context
(function ($) {
    $.extend({
        juliaPlayer: function (options) {
            return new JuliaPlayer(options);
        }
    });
}($));
// Build jQuery plugin
jQuery.fn.juliaPlayer = function (options) {
    var collection = [];
    this.each(function () {
        // Return if this element already has an instance
        if ($(this).data('juliaplayer')) {
            return;
        }
        options = typeof options === 'object' ? options : {};
        options.source = {
            file: $(this).prop('src') ? $(this).prop('src') : $(this).find('source').prop('src'),
            poster: $(this).prop('poster') ? $(this).prop('poster') : '',
            title: $(this).data('title') ? $(this).data('title') : '',
            link: $(this).data('link') ? $(this).data('link') : '',
            mode: $(this).data('mode') ? $(this).data('mode') : 'legacy',
            live: $(this).data('live') && $(this).data('live').toString().toLowerCase() == 'true' ? true : false
        };
        options.element = $(this).parent();
        options.pluginMode = true;
        $(this).css({ display: 'none' });
        // Pass options to constructor
        var julia = new JuliaPlayer(options);
        // Store plugin object in element's data
        $(this).data('juliaplayer', julia);
        collection.push(julia);
    });
    return collection;
};

}));
