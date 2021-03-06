/* *****************************************
* JuliaPlayer HTML5 player
* Base object
****************************************** */
JuliaPlayer = function (options) {
    var origin = this;
    // Import options
    var options = typeof options === 'undefined' ? {} : options;
    // Unique instance ID
    var __JULIA_INSTANCE__ID__ = Math.floor(Math.random() * 10000000 + 1);
    // Default origin.options
    origin.options = {
        dev: false,
        element: $('body'),
        autoplay: false,
        debug: false,
        dashConfig: {
            headers: {},
            queryString: {},
        },
        volume: -1,
        muted: -1,
        width: 640,
        aspectRatio: 0.5625,
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
            videoBitrateList: [],
            audioBitrateList: [],
            audioTracksList: [],
            textTracksList: [],
        },
        onDurationChange: false,
        onFullscreen: false,
        onFullscreenExit: false,
        onInit: false,
        onModeSet: false,
        onPause: false,
        onPlay: false,
        onResize: false,
        onSeek: false,
        onSourceSet: false,
        onStop: false,
        onTimeUpdate: false,
        onVolumeChange: false,
        onTime: false,
        pauseOnClick: true,
        playbackDebug: false,
        pluginMode: false,
        responsive: true,
        plugins: 'julia-player/dist/js/lib',
        skip: 5,
        source: {
            /* file: '',
            poster: '',
            link: '',
            mode: 'legacy',
            live: false, */
        },
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
        event: '',
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
        textTrackActive: -1,
        shield: $(),
        toolbars: $(),
        buttons: $(),
        started: false,
        mode: 'legacy',
        startupGoto: 0,
        lastEventRised: '',
        eventBridge: {
            progressSliderChange: 0,
            volumeSliderChange: 0,
        },
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
        preloader: $(),
        progressStep: 0.01, // Full sense: 100, so .01 is enough accurate
        version: '2.3.0'
    };
    // Console debug
    origin.debug = function (data, warn) {
        //--odn-handle-start--
        if (origin.options.debug === true) {
            var warn = typeof warn === 'undefined' || warn === false ? false : true;
            if (window.console) {
                for (var key in data) {
                    if (warn === true && typeof console.warn === 'function') {
                        console.warn(' - JuliaPlayer instance: ' + origin.env.ID + ' warning - ' + key + ' [' + typeof data[key] + ']: ', data[key]);
                    } else {
                        console.log(' - JuliaPlayer instance: ' + origin.env.ID + ' debug - ' + key + ' [' + typeof data[key] + ']: ', data[key]);
                    }
                }
            }
        }
        //--odn-handle-stop--
    };
    origin.event = function (eventName, element) {
        var e = typeof element === 'undefined' ? origin.env.instance: element;
        if (typeof e === 'string') {
            e = $(e);
        }
        origin.debug({ 
            'Julia event fired': eventName, 
            ' - Event element': element 
        });
        e.trigger({ type: eventName }, origin);
    };
    /* *****************************************
    * Require js/css files
    ****************************************** */
    origin.js = function (scripts) {
        if (typeof scripts === 'string') {
            scripts = [scripts];
        }
        if (scripts.length == 0) {
            origin.event('noScripts.julia');
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
                origin.event('scriptsLoaded.julia');
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
            'duration': origin.Timecode.toHuman(origin.Support.getDuration()),
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
    $(document).on('uiCreated.julia', '#julia-' + origin.env.ID, function (e) {
        origin.Support.resize();
        origin.Ui.state(origin.env.instance, 'off', '');
        var _load = [];
        if (origin.options.source.hasOwnProperty('mode') && origin.options.source.mode === 'dash' && typeof origin.env.context.dashjs === 'undefined') {
            _load.push(origin.options.plugins + '/dash.all.min.js');
        }
        if (origin.options.source.hasOwnProperty('mode') && origin.options.source.mode === 'hls' && typeof origin.env.context.Hls === 'undefined') {
            _load.push(origin.options.plugins + '/hls.min.js');
        }
        $(document).on('scriptsLoaded noScripts.julia', '#julia-' + origin.env.ID, function (e) {
            if (!origin.options.source.hasOwnProperty('file')) {
                origin.options.source.file = '';
                if (origin.options.element.prop("tagName") === 'VIDEO') {
                    origin.options.source.file = origin.options.element.prop('src') ? origin.options.element.prop('src'): origin.options.element.find('source').prop('src');
                } else {
                    origin.options.source.file = origin.options.element.data('file') ? origin.options.element.data('file'): '';
                }
            }
            if (!origin.options.source.hasOwnProperty('poster')) {
                origin.options.source.poster = '';
                if (origin.options.element.prop("tagName") === 'VIDEO') {
                    origin.options.source.poster = origin.options.element.prop('poster') ? origin.options.element.prop('poster'): '';
                } else {
                    origin.options.source.poster = origin.options.element.data('poster') ? origin.options.element.data('poster'): '';
                }
            }
            if (!origin.options.source.hasOwnProperty('title')) {
                origin.options.source.title = origin.options.element.data('title') ? origin.options.element.data('title') : '';
            }
            if (!origin.options.source.hasOwnProperty('link')) {
                origin.options.source.link = origin.options.element.data('link') ? origin.options.element.data('link') : '';
            }
            if (!origin.options.source.hasOwnProperty('mode')) {
                origin.options.source.mode = origin.options.element.data('mode') ? origin.options.element.data('mode') : 'legacy';
            }
            if (!origin.options.source.hasOwnProperty('live')) {
                origin.options.source.live = origin.options.element.data('live') && origin.options.element.data('live').toString().toLowerCase() == 'true' ? true : false;
            }
            origin.env.fullscreenFrame = document.querySelector('#julia-' + origin.env.ID);
            origin.env.api = document.getElementById('julia-api-' + origin.env.ID);
            origin.env.sliders.progress = new origin._Slider(origin, {
                element: $('#julia-' + origin.env.ID + ' .julia-toolbar.julia-toolbar-bottom>div.julia-progress>input.julia-range'),
                event: 'progressSliderChange'
            });
            origin.env.sliders.progress.init();
            origin.env.sliders.volume = new origin._Slider(origin, {
                element: $('#julia-' + origin.env.ID + ' .julia-toolbar.julia-toolbar-bottom>div.julia-volume>input.julia-range'),
                event: 'volumeSliderChange'
            });
            origin.env.sliders.volume.init();
            origin.Events.ui();
            // Size Fix
            origin.Support.resize();
            // Startup fixes, default behavior before media init
            $('body').on('julia.progressSliderChange', '#julia-' + origin.env.ID, function (e, data) {
                if (origin.env.started === false) {
                    origin.env.startupGoto = data.percent;
                    origin.Controls.press('play');
                }
            });
            // Persistent data
            var persistVolume = origin.Persist.get('julia-player-volume');
            var persistMuted = origin.Persist.get('julia-player-muted');
            origin.options.volume = parseInt(Number(origin.options.volume));
            origin.options.muted = origin.options.muted;

            if (origin.options.volume > 100 || origin.options.volume < 0) {
                if (origin.options.volume == -1 && !isNaN(Number(persistVolume)) && typeof persistVolume !== 'undefined') {
                    origin.options.volume = parseInt(Number(persistVolume));
                    if (origin.options.volume > 100 || origin.options.volume < 0) {
                        origin.options.volume = 25;
                    }
                } else {
                    origin.options.volume = 25;
                }
            }
            // Set volume for mobile
            if (origin.Support.isMobile() === true) {
                origin.options.volume = 100;
                origin.options.muted = false;
            }
            
            if (typeof origin.options.muted !== 'boolean') {
                if (!isNaN(Number(persistMuted)) && typeof persistMuted !== 'undefined' && origin.Support.isMobile() === false) {
                    origin.options.muted = Number(persistMuted) === 0 ? false : true;
                } else {
                    origin.options.muted = false;
                }    
            }

            origin.Events.init();

            if (origin.options.onInit !== false) {
                origin.event('init.julia');
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
    origin.Source = new origin._Source(origin);
    origin.Persist = new origin._Persist(origin);
    origin.Timecode = new origin._Timecode(origin);
    origin.Thumbs = new origin._Thumbs(origin);
    //--odn-handle-start--
    origin.Ui.create();
    //--odn-handle-stop--
    return origin.options.pluginMode === true ? origin : [origin];
};

