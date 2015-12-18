/* ***********************************
* Julia player
*
* @author prochor666@gmail.com
* version: 0.9.2
* build: 2015-12-18
* licensed under the MIT License
*
* @requires:
* hls.js [required]
* jquery [required]
* ionicons [required]
* rangeslider [required]
*
************************************* */

// Support libs
if(!window.jQuery)
{
    alert('jQuery is required');
    window.stop();
}

(function($)
{
    // Root path workaround
    var __JULIA_ROOT_PATH__ = 'julia';
    dir = document.querySelector('script[src*="julia-player"]').getAttribute('src');
    name = dir.split('/').pop();
    __JULIA_ROOT_PATH__ = dir.replace('/js/'+name,"");
    $('head').append('<link rel="stylesheet" type="text/css" href="'+__JULIA_ROOT_PATH__+'/css/ionicons.min.css">');

    // Support libs
    try {
        h = new Hls;

    }catch(err)
    {
        /*! hls.js 0.3.12, handle error or insert/bind source */
    }

    try {
        $.rangeslider();
    }catch(err)
    {
        /*! rangeslider.js - v2.0.5, handle error or insert/bind source */
    }


    // Julia main class
    _julia = function(el, opts)
    {
        // Custom options
        var options = typeof opts === 'undefined' ? {}: opts;
        var _element = typeof el === 'undefined' ? $('video'): el;

        // Default options
        var _options = {
            source: false,
            autoplay: false,
            volume: 25,
            muted: false,
            width: 512,
            height: 288,
            debug: false,
            debugPlayback: false,
            forceHls: false,
            live: false,
            responsive: true,
            dimensions: [
                [1920, 1080],
                [1280,720],
                [960,540],
                [640,360],
                [512,288]
            ],
            pauseOnClick: false,
            poster: '',
            hlsConfig: {
                debug : false,
                autoStartLoad : true,
                maxBufferLength : 60,
                maxBufferSize : 120*1000*1000,
                liveSyncDurationCount : 5, // D: 3
                liveMaxLatencyDurationCount: 20,
                enableWorker : true,
                fragLoadingTimeOut : 5000,
                fragLoadingMaxRetry : 6,
                fragLoadingRetryDelay : 100,
                manifestLoadingTimeOut : 10000,
                manifestLoadingMaxRetry : 6,
                manifestLoadingRetryDelay : 500,
                fpsDroppedMonitoringPeriod : 5000,
                fpsDroppedMonitoringThreshold : 0.2,
                appendErrorMaxRetry : 200,
            },
            suggest: [],
            suggestLimit: 2,
            suggestTimeout: 10000,
            swf: __JULIA_ROOT_PATH__+'/swf/flashlsChromeless.swf',
            themePath: __JULIA_ROOT_PATH__+'/css/themes',
            theme: 'default',
            i18n: {
                liveText: 'Live'
            },
            onTime: {},
            triggerHls: {}
        };


        // UI & behavior globals
        var _env = {
            shield: '',
            element: _element,
            suggest: '',
            toolbar: '',
            poster: '',
            api: '',
            apiId: Math.floor((Math.random()*10000000)+1), // Create a shadow api
            player: '',
            isLive: false,
            hls: {},
            hlsCapable: '',
            hlsCapableString: '',
            type: 'html5',
            isHls: false,
            useHlsLib: false,
            tries: 0,
            source: '',
            flashApi: false,
            duration: 0,
            onTimeRised: [], 
            seeking: false,
            dimensions: false,
            flashlsCallbackName: '',
            started: false,
            publicApi: {},
            suggestPointer: 0,
            suggestClicked: false,
            progressStep: 0.01, // Full sense: 100, so .01 is enough accurate
        }

        // Extend options
        var _system = {

            extend: function()
            {
                for(o in _options)
                {
                    if(options.hasOwnProperty(o))
                    {
                        _options[o] = options[o];
                    }
                }

                options = _options;
            }
        };

        // Console debug
        var _debug = {

            run: function(data)
            {
                if(options.debug === true)
                {
                    if(window.console)
                    {
                        for(d in data)
                        {
                            console.log(' - [instance: '+_env.apiId+'] '+d+' ['+(typeof data[d])+']', data[d]);
                        }
                    }
                }
            }
        };

        // Persistent user data in cookies
        var _persist = {

            set: function(name, value, days)
            {
                dateObj = new Date();
                dateObj.setTime(dateObj.getTime() + (days*24*60*60*1000));
                var expires = 'expires=' + dateObj.toUTCString();
                document.cookie = name + '=' + value + '; ' + expires + '; path=/';
            },

            get: function(name)
            {
                var name = name + '=';
                var ca = document.cookie.split(';');

                for(var i=0; i<ca.length; i++)
                {
                    var c = ca[i];

                    while(c.charAt(0)==' ')
                    {
                        c = c.substring(1);
                    }

                    if(c.indexOf(name) == 0)
                    {
                        return c.substring(name.length,c.length);
                    }
                }

                return '';
            }

        };

        // Create valid api object
        var _api = {

            create: function()
            {
                $('#julia-api-'+_env.apiId).remove();

                // Create default api object
                if(_env.flashApi === false)
                {
                    _debug.run({
                        'apiType': 'html5video',
                    });

                    apiElement = $('<video class="julia-video" id="julia-api-'+_env.apiId+'" preload="auto"></video>');
                    _env.player.prepend(apiElement);
                    _env.api = document.getElementById('julia-api-'+_env.apiId);
                    _env.api.controls = false;

                }else{

                    _debug.run({
                        'apiType': 'flashls',
                    });

                    _env.flashlsCallbackName = 'flashlsCallback'+_env.apiId;

                    apiElement = $('<object classid="clsid:d27cdb6e-ae6d-11cf-96b8-444553540000" codebase="" id="julia-api-'+_env.apiId+'">'
                                +'<param name="movie" value="'+options.swf+'?inline=1" />'
                                +'<param name="quality" value="autohigh" />'
                                +'<param name="swliveconnect" value="true" />'
                                +'<param name="allowScriptAccess" value="sameDomain" />'
                                +'<param name="bgcolor" value="#000000" />'
                                +'<param name="allowFullScreen" value="true" />'
                                +'<param name="wmode" value="opaque" />'
                                +'<param name="FlashVars" value="callback='+_env.flashlsCallbackName+'" />'
                                +'<embed src="'+options.swf+'?inline=1" name="julia-api-'+_env.apiId+'" '
                                +'    quality="autohigh" '
                                +'    bgcolor="#000000" '
                                +'    align="middle" allowFullScreen="true" '
                                +'    allowScriptAccess="sameDomain" '
                                +'    type="application/x-shockwave-flash" '
                                +'    swliveconnect="true" '
                                +'    wmode="opaque" '
                                +'    FlashVars="callback='+_env.flashlsCallbackName+'"'
                                +'    pluginspage="http://www.macromedia.com/go/getflashplayer" >'
                                +'</embed>'
                            +'</object>');

                    _env.player.prepend(apiElement);

                    flashlsAPI = function(flashObject)
                    {
                        this.constructor = function(flashObject)
                        {
                            this.flashObject = flashObject;
                        }

                        this.constructor(flashObject);

                        this.load = function(url)
                        {
                            this.flashObject.playerLoad(url);
                        }

                        this.play = function(offset)
                        {
                            started = true;
                            this.flashObject.playerPlay(offset);
                        }

                        this.pause = function()
                        {
                            this.flashObject.playerPause();
                        }

                        this.resume = function() {
                            this.flashObject.playerResume();
                        }

                        this.seek = function(offset) {
                            this.flashObject.playerSeek(offset);
                        }

                        this.stop = function() {
                            this.flashObject.playerStop();
                        }

                        this.volume = function(volume) {
                            this.flashObject.playerVolume(volume);
                        }

                        this.setCurrentLevel = function(level) {
                            this.flashObject.playerSetCurrentLevel(level);
                        }

                        this.setNextLevel = function(level) {
                            this.flashObject.playerSetNextLevel(level);
                        }

                        this.setLoadLevel = function(level) {
                            this.flashObject.playerSetLoadLevel(level);
                        }

                        this.setMaxBufferLength = function(len) {
                            this.flashObject.playerSetmaxBufferLength(len);
                        }

                        this.getPosition = function() {
                            return this.flashObject.getPosition();
                        }

                        this.getDuration = function() {
                            return this.flashObject.getDuration();
                        }

                        this.getbufferLength = function() {
                            return this.flashObject.getbufferLength();
                        }

                        this.getbackBufferLength = function() {
                            return this.flashObject.getbackBufferLength();
                        }

                        this.getLowBufferLength = function() {
                            return this.flashObject.getlowBufferLength();
                        }

                        this.getMinBufferLength = function() {
                            return this.flashObject.getminBufferLength();
                        }

                        this.getMaxBufferLength = function() {
                            return this.flashObject.getmaxBufferLength();
                        }

                        this.getLevels = function() {
                            return this.flashObject.getLevels();
                        }

                        this.getAutoLevel = function() {
                            return this.flashObject.getAutoLevel();
                        }

                        this.getCurrentLevel = function() {
                            return this.flashObject.getCurrentLevel();
                        }

                        this.getNextLevel = function() {
                            return this.flashObject.getNextLevel();
                        }

                        this.getLoadLevel = function() {
                            return this.flashObject.getLoadLevel();
                        }

                        this.getAudioTrackList = function() {
                            return this.flashObject.getAudioTrackList();
                        }

                        this.getStats = function() {
                            return this.flashObject.getStats();
                        }

                        this.setAudioTrack = function(trackId) {
                            this.flashObject.playerSetAudioTrack(trackId);
                        }

                        this.playerSetLogDebug = function(state) {
                            this.flashObject.playerSetLogDebug(state);
                        }

                        this.getLogDebug = function() {
                            return this.flashObject.getLogDebug();
                        }

                        this.playerSetLogDebug2 = function(state) {
                            this.flashObject.playerSetLogDebug2(state);
                        }

                        this.getLogDebug2 = function() {
                            return this.flashObject.getLogDebug2();
                        }

                        this.playerSetUseHardwareVideoDecoder = function(state) {
                            this.flashObject.playerSetUseHardwareVideoDecoder(state);
                        }

                        this.getUseHardwareVideoDecoder = function() {
                            return this.flashObject.getUseHardwareVideoDecoder();
                        }

                        this.playerSetflushLiveURLCache = function(state) {
                            this.flashObject.playerSetflushLiveURLCache(state);
                        }

                        this.getflushLiveURLCache = function() {
                            return this.flashObject.getflushLiveURLCache();
                        }

                        this.playerSetJSURLStream = function(state) {
                            this.flashObject.playerSetJSURLStream(state);
                        }

                        this.getJSURLStream = function() {
                            return this.flashObject.getJSURLStream();
                        }

                        this.playerCapLeveltoStage = function(state) {
                            this.flashObject.playerCapLeveltoStage(state);
                        }

                        this.getCapLeveltoStage = function() {
                            return this.flashObject.getCapLeveltoStage();
                        }

                        this.playerSetAutoLevelCapping = function(level) {
                            this.flashObject.playerSetAutoLevelCapping(level);
                        }

                        this.getAutoLevelCapping = function() {
                            return this.flashObject.getAutoLevelCapping();
                        }
                    };

                    getFlashMovieObject = function(movieName)
                    {
                        if (window.document[movieName])
                        {
                            return window.document[movieName];
                        }
                        if (navigator.appName.indexOf("Microsoft Internet")==-1)
                        {
                            if (document.embeds && document.embeds[movieName])
                            {
                               return document.embeds[movieName];
                            }else // if (navigator.appName.indexOf("Microsoft Internet")!=-1)
                            {
                                return document.getElementById(movieName);
                            }
                        }
                    }

                    _env.api = new flashlsAPI(getFlashMovieObject('julia-api-'+_env.apiId));
                }

                _debug.run({
                    'apiId': _env.apiId,
                    'api': _env.api,
                });
            }
        };


        var _ui = {

            // Video shield for helpers, buttons, preloaders, advertising etc...
            shield: function()
            {
                _env.shield = $('<div class="julia-shield" id="julia-shield-'+_env.apiId+'">'
                            +'  <button class="julia-btn julia-big-play"><i class="ion-play"></i></button>'
                            +'  <div class="julia-preloader"><i class="ion-load-c"></i></div>'
                            +'</div>'
                    );

                _env.suggest = $('<div class="julia-suggest" id="julia-suggest-'+_env.apiId+'"></div>');
            },

            posterSet: function()
            {
                _ui.posterUnset();
                if(_env.poster.length > 0)
                {
                    img = $('<img src="'+_env.poster+'" width="100%" height="100%">')

                    _env.shield.append(img);

                    _debug.run({
                        poster: _env.poster,
                    })
                }
            },

            posterUnset: function()
            {
                _env.shield.find('img').remove();
            },

            // Button toolbar
            toolbar: function()
            {
                _env.toolbar = $('<div class="julia-toolbar" id="julia-toolbar-'+_env.apiId+'">'
                    +'<div class="julia-progress">'
                    +'  <input type="range" value="0" min="0" max="100" step="'+_env.progressStep+'">'
                    +'</div>'
                    +'<div class="julia-panel julia-live-indicator">'
                    +'    <span>'+options.i18n.liveText+'</span>'
                    +'</div>'
                    +'<div class="julia-panel julia-currentTime">'
                    +'    <span>00:00:00</span> /&nbsp;'
                    +'</div>'
                    +'<div class="julia-panel julia-duration">'
                    +'    <span>00:00:00</span>'
                    +'</div>'
                    +'<button class="julia-btn julia-playback play">'
                    +'    <i class="ion-play"></i>'
                    +'</button>'
                    +'<button class="julia-btn julia-sound on">'
                    +'    <i class="ion-android-volume-up"></i>'
                    +'</button>'
                    +'<div class="julia-volume">'
                    +'  <input type="range" value="'+options.volume+'" min="0" max="100">'
                    +'</div>'
                    +'<button class="julia-btn julia-fullscreen-toggle on">'
                    +'    <i class="ion-android-expand"></i>'
                    +'</button>'
                +'</div>');
            },

            // Create player object
            player: function()
            {
                _ui.shield();
                _ui.toolbar();

                _env.player = $('<div class="julia-player julia-fullscreen-off julia-theme-'+options.theme+'" id="julia-player-'+_env.apiId+'">'
                            +'</div>');

                _env.player.append(_env.shield);
                _env.player.append(_env.suggest);
                _env.player.append(_env.toolbar);

                _env.element.hide();
                _env.player.insertAfter(_env.element);

                // Simulate preload
                _env.shield.find('.julia-big-play').hide();
                _env.toolbar.hide();

                // Rangeslider polyfill
                $('#julia-toolbar-'+_env.apiId+'>div.julia-progress>input, #julia-toolbar-'+_env.apiId+'>div.julia-volume>input').rangeslider({
                    polyfill: false,
                    rangeClass: 'julia-rangeslider',
                    disabledClass: 'julia-rangeslider--disabled',
                    horizontalClass: 'julia-rangeslider--horizontal',
                    verticalClass: 'julia-rangeslider--vertical',
                    fillClass: 'julia-rangeslider__fill',
                    handleClass: 'julia-rangeslider__handle',
                    onInit: function(){},
                    onSlide : function(position, value){},
                    onSlideEnd : function(position, value){}
                });

                _debug.run({
                    'element': _env.element,
                    'toolbar': _env.toolbar,
                    'shield': _env.shield,
                    'player': _env.player,
                });
            }
        };

        // Fullscreen on
        var _fullscreen = {

            on: function()
            {
                var videoFrame = document.querySelector('#julia-player-'+_env.apiId);

                if(videoFrame.requestFullscreen)
                {
                    videoFrame.requestFullscreen();
                } else if (videoFrame.msRequestFullscreen)
                {
                    videoFrame.msRequestFullscreen();
                } else if (videoFrame.mozRequestFullScreen)
                {
                    videoFrame.mozRequestFullScreen();
                } else if(videoFrame.webkitRequestFullscreen)
                {
                    videoFrame.webkitRequestFullscreen();
                }
            },

            // Fullscreen off
            off: function()
            {
                if(document.exitFullscreen)
                {
                    document.exitFullscreen();
                }else if(document.msExitFullscreen)
                {
                    document.msExitFullscreen();
                } else if(document.mozCancelFullScreen)
                {
                    document.mozCancelFullScreen();
                } else if(document.webkitExitFullscreen)
                {
                    document.webkitExitFullscreen();
                }
            }
        };

        // Timeline numbers coonversion
        var _timeline = {

            toPercents: function(currentTime)
            {
                p = (currentTime/_env.duration)*100;
                return p;
            },

            toSeconds: function(percent)
            {
                t = (_env.duration/100)*percent;
                return t;
            },

            toNum: function(human)
            {
                human = human.split(':');
                human.reverse();
                s = parseInt(human[0]);
                m = human.length>1 ? parseInt(human[1]): 0;
                h = human.length>2 ? parseInt(human[3]): 0;
                t = s + m*60 + h*60*60;
                return t;
            }, 

            toHuman: function(time)
            {
                time = time.toString().split('.');
                s = time[0];
                H = Math.floor(s/3600);
                M = Math.floor( ( s - (H*3600) ) / 60 );
                S = Math.floor( ( s - (H*3600) - (M*60) ) );

                H = ('0'+H.toString()).slice(-2);
                M = ('0'+M.toString()).slice(-2);
                S = ('0'+S.toString()).slice(-2);

                str = H>0 ? H+':'+M+':'+S: M+':'+S;

                return str;
            }
        };


        // Suggest engine
        var _suggest = {

            run: function()
            {
                _env.suggest.html('');
                _control.press('stop');
                _env.suggestClicked = false;
                _env.tries = 0;

                if(options.suggest.length > 0)
                {
                    x = 0;
                    for(var i in options.suggest)
                    {
                        if(x < options.suggestLimit && options.suggest[i].played === false)
                        {
                            mode = !!options.suggest[i].live && options.suggest[i].live === true ? 'live': 'vod';
                            liveText = !!options.suggest[i].liveText ? options.suggest[i].liveText: 'Live';
                            var poster = !!options.suggest[i].poster ? options.suggest[i].poster: '';
                            posterImage = poster.length>0 ? '<img src="'+poster+'" width="100%" height="100%">': '';
                            suggestItemWidget = $('<div class="julia-suggest-item" data-poster="'+poster+'" data-file="'+options.suggest[i].file+'" data-mode="'+mode+'" data-live-text="'+liveText+'" data-index="'+i+'">'
                                    + posterImage
                                    +'<div class="julia-suggest-item-title">'+options.suggest[i].title+'</div>'
                                +'</div>');

                                suggestItemWidget.on('click', function(e)
                                {
                                    if(_env.flashApi===false)
                                    {
                                        options.muted = _env.api.muted;
                                    }else{

                                    }

                                    options.poster = $(this).data('poster');
                                    _env.suggestClicked = true;
                                    _env.shield.find('.julia-big-play').hide();
                                    _env.started = false;
                                    options.source = $(this).data('file');
                                    _boot.selectSource();
                                    options.autoplay = true;
                                    options.live = $(this).data('mode') == 'live' ? true: false;
                                    options.i18n.liveText = $(this).data('live-text');

                                    _env.toolbar.find('.julia-live-indicator>span').text(options.i18n.liveText);

                                    _debug.run({
                                        suggestRemoveIndex: $(this).data('index'),
                                        suggestRemove: $(this).data('file')
                                    });

                                    options.suggest[$(this).data('index')].played = true;
                                    _env.suggest.removeClass('on');

                                    _boot.init();
                                    _boot.load();
                                    _support.resize();
                                });

                            _env.suggest.append(suggestItemWidget);
                            x++;
                        }
                    }

                    if(x > 0)
                    {
                        if(options.suggestTimeout > 0 && _support.isMobile() === false)
                        {
                            setTimeout( function()
                            {
                                if(_env.suggestClicked === false)
                                {
                                    _env.suggest.find('div.julia-suggest-item:first').click();
                                }
                            }, options.suggestTimeout);
                        }
                        _env.suggest.addClass('on');
                    }

                }else{
                    _fullscreen.off();
                }

                _debug.run({
                    'Suggest' : 'raised'
                });
            }
        };

        // Support
        var _support = {

            aspect: function(w,h)
            {
                return w>0 && h>0 ? h/w: 0;
            },

            isMobile: function()
            {
                if( /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) )
                {
                    return true;
                }

                return false;
            },

            forceReady: function()
            {
                if( /Firefox/i.test(navigator.userAgent) )
                {
                    return true;
                }

                return false;
            },

            theme: function()
            {
                _debug.run({
                    'theme': options.themePath+'/'+options.theme+'/julia.css'
                });

                $('head').append('<link rel="stylesheet" type="text/css" href="'+options.themePath+'/'+options.theme+'/julia.css">');
            },

            hlsCapable: function()
            {
                var vid = document.createElement('video');
                vid.id = 'video-cap-test-'+_env.apiId;
                _env.hlsCapableString = vid.canPlayType('application/vnd.apple.mpegURL');
                $('#video-cap-test'+_env.apiId).remove();
                return (_env.hlsCapableString == 'probably' || _env.hlsCapableString == 'maybe');
            },

            resize: function()
            {
                // Player dimensions
                defaultDim = _env.element.width() ? [_env.element.width(), _env.element.height()]: [options.width, options.height];
                dimensions = options.responsive === true ? _support.getSize(): defaultDim;

                _debug.run({
                    'resizeDefaults': defaultDim,
                    'resize': dimensions
                });

                _env.player.width(dimensions[0]);
                _env.player.height(dimensions[1]);

                if(_env.flashApi===false)
                {
                    _env.api.setAttribute('width', '100%');
                    _env.api.setAttribute('height', '100%');
                }else{
                    _env.api.flashObject.width = '100%';
                    _env.api.flashObject.height = '100%';
                }
            },

            getSize: function()
            {
                var parentWidth = _env.element.parent().width();
                for(i in options.dimensions)
                {
                    var dim = options.dimensions[i];
                    if(parentWidth>=dim[0])
                    {
                        if(_env.flashApi===false)
                        {
                            a = _support.aspect(parentWidth) == 0 ? dim[1]/dim[0]: _support.aspect(_env.api.videoWidth, _env.api.videoHeight);
                        }else{
                            a = _support.aspect(parentWidth) == 0 ? dim[1]/dim[0]: _support.aspect(_env.api.width(), _env.api.height());
                        }

                        dimensions = [dim[0],(dim[0]*a)];
                        _debug.run({
                            'resizePredefined': dimensions
                        });
                        return dimensions;
                    }
                }

                a = _support.aspect() == 0 ? dim[1]/dim[0]: _support.aspect(_env.api.videoWidth, _env.api.videoHeight);
                dimensions = [parentWidth, (parentWidth*a)];

                _debug.run({
                    'resizeFallback': dimensions
                });

                return dimensions;
            }
        };

        // Api && UI control
        var _control = {

            press: function(action, data)
            {
                data = data||{};

                if(data.length>0)
                {    
                    _debug.run({
                        'action': action,
                        'action-data': data,
                    });

                }else{
                
                    _debug.run({
                        'action': action,
                    });
                }

                switch(action)
                {
                    case 'play':

                        if(_env.flashApi === false)
                        {
                            _env.api.play();

                        }else{

                            _env.shield.find('.julia-big-play').hide();

                            if(_env.started === false)
                            {
                                _env.api.play(-1);

                                _debug.run({
                                    'FlashPlay': 'play',
                                    'FlashPosition': _env.api.getPosition()
                                });

                            }else{

                                _env.api.resume(); //(api.getPosition());

                                _debug.run({
                                    'FlashPlay': 'resume',
                                    'FlashPosition': _env.api.getPosition()
                                });
                            }
                        }

                    break; case 'pause':

                        if(_env.flashApi === false)
                        {
                            _env.api.pause();

                        }else{

                            _env.api.pause();
                            _env.toolbar.find('.julia-playback.pause').removeClass('pause').addClass('play')
                            .find('i').removeClass('ion-pause').addClass('ion-play');
                            _env.shield.find('.julia-big-play').show();
                        }

                    break; case 'stop':

                        if(_env.flashApi === false)
                        {
                            _env.api.pause();
                            _env.api.currentTime = 0;

                        }else{

                            _env.started = false;
                            _env.api.stop();
                        }

                        _env.toolbar.find('.julia-playback.pause').removeClass('pause').addClass('play')
                        .find('i').removeClass('ion-pause').addClass('ion-play');
                        _env.shield.find('.julia-big-play').show();
                        _env.toolbar.find('.julia-progress>input').val(0).rangeslider('update', true);

                    break; case 'goto':

                        if(_env.flashApi === false)
                        {
                            _env.api.currentTime = data.currentTime;

                        }else{

                            _env.api.seek(data.currentTime);
                        }

                    break; case 'setDuration':

                        _env.toolbar.find('.julia-panel.julia-duration>span').text(data.duration);

                        if(_env.started === false)
                        {
                            _env.toolbar.find('.julia-progress>input').val(0).rangeslider('update', true);
                        }

                        _debug.run({
                            'setDuration': data.duration
                        });

                    break; case 'volume':

                        if(_env.flashApi === false)
                        {
                            options.volume = data.volume;
                            _env.api.volume = data.volume/100;

                            _debug.run({
                                'volume is': _env.api.volume
                            });

                        }else{

                            options.volume = data.volume;
                            _env.api.volume(options.volume);

                            _debug.run({
                                'volume is': options.volume
                            });
                        }

                        _env.toolbar.find('.julia-volume>input').val(data.volume).rangeslider('update', true);

                        if(data.volume>0)
                        {
                            _control.press('sound-on');

                        }else{
                            _control.press('sound-off');
                        }

                    break; case 'sound-on':

                        if(_env.flashApi === false)
                        {
                            _env.api.muted = false;

                        }else{

                            _env.api.volume(options.volume);
                            _env.toolbar.find('.julia-volume>input').val(options.volume).rangeslider('update', true);
                        }

                        options.muted = false;
                        _persist.set('volume', options.volume, 30);
                        _persist.set('muted', options.muted, 30);

                        _env.toolbar.find('.julia-sound.off').removeClass('off').addClass('on')
                        .find('i').removeClass('ion-android-volume-off').addClass('ion-android-volume-up');

                    break; case 'sound-off':

                        if(_env.flashApi === false)
                        {
                            _env.api.muted = true;

                        }else{

                            _env.api.volume(0);
                            _env.toolbar.find('.julia-volume>input').val(0).rangeslider('update', true);
                        }

                        options.muted = true;
                        _persist.set('volume', options.volume, 30);
                        _persist.set('muted', options.muted, 30);

                        _env.toolbar.find('.julia-sound.on').removeClass('on').addClass('off')
                        .find('i').removeClass('ion-android-volume-up').addClass('ion-android-volume-off');

                    break; case 'fullscreen-on':
                        _fullscreen.on();

                    break; case 'fullscreen-off':
                        _fullscreen.off();

                    break; case 'destroy':
                        _env.player.remove();

                    break; default:

                }

                return;
            }
        };


        // Bindings
        var _bind = {

            // First play with some handlers
            playAllowStart: function(e)
            {
                _env.shield.find('.julia-preloader').removeClass('on');
                _env.shield.find('.julia-big-play').show();
                _env.toolbar.show();

                // Init actions
                _control.press('setDuration', {
                    'duration': _timeline.toHuman( _env.duration )
                });

                // Set mute if needed
                if(options.muted === true)
                {
                    _control.press('sound-off');
                }else{
                    _control.press('sound-on');

                    // Set initial volume
                    _control.press('volume', {
                        'volume': options.volume
                    });
                }

                // Autostart playback, if possible
                if(options.autoplay === true && _support.isMobile() === false)
                {
                    _control.press('play');
                }

                _debug.run({
                    'eventType': e.type,
                    'duration': _env.api.duration,
                    'readyState': _env.api.readyState
                });
            },

            // Bind can play by ready state / fake readyState
            // Because of Firefox cannot bind canplaythrough event with HLS.js properly
            canplaythrough: function()
            {
                if(_env.started === false)
                {
                    // don't let mobile Firefox make decision about readyState, mobile Firefox lie!
                    if(_env.api.readyState>=3 || (_support.isMobile() === true && _env.api.readyState>=2) )
                    {
                        _bind.playAllowStart({
                            type: '_bind.canplaythrough'
                        });
                    }else{
                        setTimeout( function()
                        {
                            _bind.canplaythrough();
                        }, 250);
                    }
                }
            },


            // Bind user action & DOM events
            domEvents: function()
            {
                // Buttons
                _env.toolbar.on('contextmenu', function(e)
                {
                    e.preventDefault();
                })
                .on('click', '.julia-playback.play', function(e)
                {
                    e.preventDefault();
                    _control.press('play');
                })
                .on('click', '.julia-playback.pause', function(e)
                {
                    e.preventDefault();
                    _control.press('pause');
                })
                .on('click', '.julia-sound.on', function(e)
                {
                    e.preventDefault();
                    _control.press('sound-off');
                })
                .on('click', '.julia-sound.off', function(e)
                {
                    e.preventDefault();
                    _control.press('sound-on');
                })
                .on('click', '.julia-fullscreen-toggle.on', function(e)
                {
                    e.preventDefault();
                    _control.press('fullscreen-on');
                })
                .on('click', '.julia-fullscreen-toggle.off', function(e)
                {
                    e.preventDefault();
                    _control.press('fullscreen-off');
                });

                // Big play
                _env.shield.on('click contextmenu', '.julia-big-play', function(e)
                {
                    e.preventDefault();
                    e.stopPropagation();
                    if(e.type == 'click')
                    {
                        _control.press('play');
                    }
                });

                // Area click
                _env.shield.on('click', function(e)
                {
                    e.preventDefault();
                    e.stopPropagation();
                    if(options.pauseOnClick === true)
                    {
                        _control.press('pause');
                    }
                });

                // Fullscreen toolbar behavior bindings
                var mouseMoveCleaner;

                _env.player.on('mousemove', '#julia-shield-'+_env.apiId+', #julia-suggest-'+_env.apiId, function(e)
                {
                    e.preventDefault();
                    _env.toolbar.addClass('julia-toolbar-visible');
                    clearTimeout(mouseMoveCleaner);

                    mouseMoveCleaner = setTimeout(function()
                    {
                        _env.toolbar.removeClass('julia-toolbar-visible');
                    }, 1750);
                })
                .on('mouseover mousemove mouseout', '#julia-toolbar-'+_env.apiId+'.julia-toolbar-visible', function(e)
                {
                    e.preventDefault();
                    _env.toolbar.addClass('julia-toolbar-visible');
                    clearTimeout(mouseMoveCleaner);

                    if(e.type == 'mouseout')
                    {
                        mouseMoveCleaner = setTimeout(function(e)
                        {
                            _env.toolbar.removeClass('julia-toolbar-visible');
                        }, 1750);
                    }
                });

                // Bind progressbar change
                _env.toolbar.on('change input', '.julia-progress>input', function(e)
                {
                    if(e.type == 'input')
                    {
                        _env.seeking = true;
                    }else{

                        seekTo = _timeline.toSeconds( $(this).val() );
                        seekTo = seekTo >= _env.duration ? _env.duration: seekTo.toFixed(2);

                        _control.press('goto', {
                            currentTime: seekTo
                        });

                        _env.seeking = false;
                    }
                });

                // Bind volumebar change
                _env.toolbar.on('change', '.julia-volume>input', function()
                {
                    _control.press('volume', {
                        volume: $(this).val(),
                        'event': 'slideChange'
                    });
                });

                // Fullscreen event included
                $(window).on('resize', function()
                {
                    _support.resize();
                });

                // Fullscreen change event handler
                $(document).on('webkitfullscreenchange mozfullscreenchange fullscreenchange MSFullscreenChange', function(e)
                {
                    if(!document.fullscreenElement && !document.mozFullScreenElement && !document.webkitFullscreenElement && !document.msFullscreenElement)
                    {
                        $('.julia-player').removeClass('julia-fullscreen-on').addClass('julia-fullscreen-off')
                        .find('button.julia-fullscreen-toggle').removeClass('off').addClass('on')
                        .find('i').removeClass('ion-android-contract').addClass('ion-android-expand');

                        // Turn off landscape on mobile
                        if(_support.isMobile())
                        {
                            screen.orientation.unlock();
                            screen.msLockOrientation.unlock();
                            screen.mozLockOrientation.unlock();
                        }

                        _debug.run({
                            'fullscreen off' : '#julia-player-'+_env.apiId
                        });

                        _support.resize();

                    }else{

                        $('.julia-player').removeClass('julia-fullscreen-off').addClass('julia-fullscreen-on')
                        .find('button.julia-fullscreen-toggle').removeClass('on').addClass('off')
                        .find('i').removeClass('ion-android-expand').addClass('ion-android-contract');

                        // Force landscape in fullscreen mode on mobile
                        if(_support.isMobile())
                        {
                            screen.orientation.lock('landscape-primary');
                            screen.msLockOrientation.lock('landscape-primary');
                            screen.mozLockOrientation.lock('landscape-primary');
                        }

                        _debug.run({
                            'fullscreen on' : '#julia-player-'+_env.apiId
                        });
                    }
                });
            },


            // Native video api
            nativeEvents: function()
            {
                if(_support.forceReady()===true && _env.isHls === true)
                {
                    _bind.canplaythrough();
                }else{
                    _env.api.oncanplaythrough = function(e)
                    {
                        _env.duration = _env.api.duration;

                        if(_env.started === false && _env.api.readyState >= 3)
                        {
                            _bind.playAllowStart(e);
                        }
                    }
                }

                // Video playback detect
                _env.api.onplay = function(e)
                {
                    _env.toolbar.find('.julia-playback.play').removeClass('play').addClass('pause')
                    .find('i').removeClass('ion-play').addClass('ion-pause');
                    _env.shield.find('.julia-big-play').hide();
                    _env.shield.find('.julia-preloader').removeClass('on');
                    _ui.posterUnset();
                    _env.toolbar.show();
                }

                _env.api.onplaying = function(e)
                {
                    _env.toolbar.find('.julia-playback.play').removeClass('play').addClass('pause')
                    .find('i').removeClass('ion-play').addClass('ion-pause');
                    _env.shield.find('.julia-big-play').hide();
                    _env.shield.find('.julia-preloader').removeClass('on');
                    _env.suggest.html('').removeClass('on');
                    _env.toolbar.show();
                    _control.press('setDuration', {
                        'duration': _timeline.toHuman( _env.duration )
                    });
                    _env.started = true;
                }


                // Video pause
                _env.api.onpause = function(e)
                {
                    _env.toolbar.find('.julia-playback.pause').removeClass('pause').addClass('play')
                    .find('i').removeClass('ion-pause').addClass('ion-play');
                    _env.shield.find('.julia-big-play').show();
                }


                // Errors
                _env.api.onerror = function(e)
                {
                    // Bring to life again
                    if(_env.tries<11)
                    {
                        _boot.init();
                    }
                }

                _env.api.onemptied = function(e)
                {
                }

                _env.api.onstalled = function(e)
                {
                }

                _env.api.onsuspend = function(e)
                {
                }

                // Video position
                _env.api.ontimeupdate = function(e)
                {
                    if(_env.seeking === false)
                    {
                        currentTimeReadable = _timeline.toHuman( _env.api.currentTime.toFixed(2) );
                        _env.toolbar.find('.julia-progress>input').val( _timeline.toPercents( _env.api.currentTime.toFixed(2) ) ).rangeslider('update', true);
                        _env.toolbar.find('.julia-panel.julia-currentTime>span').text(currentTimeReadable);
                    }

                    _bind.onTime(currentTimeReadable, _env.api.currentTime);
                    
                    if(options.debugPlayback === true)
                    {
                        _debug.run({
                            'duration/current': _env.duration+'/'+_env.api.currentTime.toFixed(2)+' > '+currentTimeReadable
                        });
                    }

                    // Fix for corrupted video end
                    // For development purposes only
                    /*
                    if(api.currentTime>=(duration-1))
                    {
                        if(_support.forceReady()===true)
                        {
                            _suggest.run();
                        }
                    }
                    */
                }

                // Video position
                _env.api.seeked = function(e)
                {
                    _env.seeking = false;
                }

                // Video position
                _env.api.seeking = function(e)
                {
                    _env.seeking = true;
                }

                // Volume
                _env.api.onvolumechange = function(e)
                {
                    if(_env.api.muted === false)
                    {
                        _env.toolbar.find('.julia-volume>input').val(_env.api.volume*100).rangeslider('update', true);
                    }else{
                        _env.toolbar.find('.julia-volume>input').val(0).rangeslider('update', true);
                    }
                }

                // Set video duration
                _env.api.ondurationchange = function(e)
                {
                    _env.duration = _env.api.duration;

                    if(_env.started === false)
                    {
                        _env.duration = _env.api.duration;
                        _env.seeking = false;

                        _debug.run({
                            'duration': _env.duration,
                            'readyState': _env.api.readyState,
                            'started': _env.started
                        });
                    }
                }

                // Bind playback end event
                _env.api.onended = function(e)
                {
                    _suggest.run();
                };
            },


            // Specific events, error handlers
            hlsLibEvents: function()
            {
                _env.hls.on(Hls.Events.ERROR, function(event, data)
                {
                    switch(data.details)
                    {
                        case Hls.ErrorDetails.MANIFEST_LOAD_ERROR:
                        case Hls.ErrorDetails.MANIFEST_LOAD_TIMEOUT:
                        case Hls.ErrorDetails.MANIFEST_PARSING_ERROR:
                        case Hls.ErrorDetails.LEVEL_LOAD_ERROR:
                        case Hls.ErrorDetails.LEVEL_LOAD_TIMEOUT:
                        case Hls.ErrorDetails.LEVEL_SWITCH_ERROR:
                        case Hls.ErrorDetails.FRAG_LOAD_ERROR:
                        case Hls.ErrorDetails.FRAG_LOOP_LOADING_ERROR:
                        case Hls.ErrorDetails.FRAG_LOAD_TIMEOUT:
                        case Hls.ErrorDetails.FRAG_DECRYPT_ERROR:
                        case Hls.ErrorDetails.FRAG_PARSING_ERROR:
                        case Hls.ErrorDetails.BUFFER_APPEND_ERROR:
                        case Hls.ErrorDetails.BUFFER_APPENDING_ERROR:

                            _debug.run({
                                recoveringError: data.details,
                                errorType: data.type,
                                errorFatal: data.fatal
                            });

                            if(data.fatal === true && _env.tries<11)
                            {
                                // Bring to life again
                                _boot.init();
                            }

                        break; default:
                    }
                });
            },


            // Flash fallback for legacy browsers
            flashEvents: function()
            {
                // Flash event object
                var flashlsEvents = {

                    ready: function(flashTime)
                    {
                        _env.api.load(_env.source);

                        _debug.run({
                            'ready': flashTime
                        });
                    },

                    videoSize: function(width, height) {
                        _support.resize();
                    },

                    complete: function()
                    {
                        _debug.run({
                            'suggest': 'call',
                            'flashPlayback': 'completed'
                        });

                        setTimeout( function()
                        {
                            _suggest.run();
                        }, 1500);
                    },

                    error: function(code, url, message)
                    {
                        _debug.run({
                            'flashErrorCode': code,
                            'flashErrorUrl': url,
                            'flashErrorMessage': message,
                        });

                        // Bring to life again
                        if(_env.tries<10)
                        {
                            _boot.init();
                        }
                    },

                    manifest: function(flashDuration, levels_, loadmetrics)
                    {
                        _env.duration = flashDuration.toFixed(2);
                        levels = levels_;
                        _debug.run({
                            'durationOrigin': flashDuration,
                            'duration': _env.duration,
                            'durationHuman': _timeline.toHuman( _env.duration ),
                            'levels': levels,
                            'metrics': loadmetrics,
                        });

                        if(_env.started === false)
                        {
                            _env.shield.find('.julia-preloader').removeClass('on');
                            _env.shield.find('.julia-big-play').show();
                            _env.toolbar.show();

                            // Init actions
                            _control.press('setDuration', {
                                'duration': _timeline.toHuman( _env.duration )
                            });

                            // Set initial volume
                            if(options.muted === false)
                            {
                                _control.press('volume', {
                                    'volume': options.volume
                                });
                            }
                            // Set mute if needed
                            if(options.muted === true)
                            {
                                _control.press('sound-off');
                            }

                            // Autostart playback, if possible
                            if(options.autoplay === true)
                            {
                                _env.api.play(-1);
                            }

                            _debug.run({
                                'duration': _env.api.duration,
                                'readyState': true
                            });
                        }
                    },

                    levelLoaded: function(loadmetrics)
                    {
                    },

                    fragmentLoaded: function(loadmetrics)
                    {
                    },

                    fragmentPlaying: function(playmetrics)
                    {
                        _env.toolbar.find('.julia-playback.play').removeClass('play').addClass('pause')
                        .find('i').removeClass('ion-play').addClass('ion-pause');
                        _env.shield.find('.julia-big-play').hide();
                        _env.shield.find('.julia-preloader').removeClass('on');
                        _ui.posterUnset();
                        _env.suggest.html('').removeClass('on');
                        _env.toolbar.show();
                        _env.started = true;
                    },

                    position: function(timemetrics)
                    {
                        if(_env.seeking === false)
                        {
                            currentTimeReadable = _timeline.toHuman( _env.api.getPosition() );
                            _env.toolbar.find('.julia-progress>input').val( _timeline.toPercents( _env.api.getPosition() ) ).rangeslider('update', true);
                            _env.toolbar.find('.julia-panel.julia-currentTime>span').text(currentTimeReadable);
                        }
                    }
                };

                // Create a single global callback function and pass it's name
                // to the SWF with the name `callback` in the FlashVars parameter.
                window[_env.flashlsCallbackName] = function(eventName, args)
                {
                    flashlsEvents[eventName].apply(null, args);
                };
            }, 

            // Time update event callbacks
            onTime: function(time, timeNum)
            {
                if( (time in options.onTime) && _env.onTimeRised.indexOf(time) == -1 )
                {
                    handle = options.onTime[time];
                    _env.onTimeRised.push(time);

                    if(typeof window[handle] === 'function')
                    {
                        window[handle](time, _env.publicApi);
                        _debug.run({
                            'onTime': handle+' raised'
                        });
                        
                    }else{

                        _debug.run({
                            'onTimeError': handle+' is not a function, but: '+(typeof handle)
                        });
                    }
                }
            }
        };


        // Create player
        var _boot = {

            create: function()
            {
                // Extend default options with external options
                _system.extend();

                // Degbug header
                if(options.debug === true && window.console )
                {
                    console.info('=== Julia console debug start for '+_env.apiId+' ===');
                }

                _debug.run(options);

                // Suggest init
                for(i in options.suggest)
                {
                    options.suggest[i].played = false;
                }

                // Set theme CSS
                _support.theme();

                // User data
                volume = _persist.get('volume');
                muted = _persist.get('muted');

                if(volume.length>0)
                {
                    options.volume = parseInt(volume);
                }

                if(muted.length>0)
                {
                    options.muted = muted == 'false' ?  false: true;
                }

                // Create UI
                _ui.player();
            },

            // Select playback url
            selectSource: function()
            {
                _env.element.prop('preload', 'none');
                _env.source = options.source && options.source.length>0 ? options.source: _env.element.prop('src');
                if(options.forceHls === true)
                {
                    _env.source += _env.source.indexOf('?') == -1 ? '?m3u8=yes': '&m3u8=yes';
                }

                _env.type = _env.source.indexOf('m3u8') == -1 ? _env.type: 'hls';
                _debug.run({
                    'sourceType': _env.type
                });

                _env.isHls = _env.source.indexOf('m3u8') == -1 ? false: true;

                _env.poster = options.poster && options.poster.length>0 ? options.poster: _env.element.prop('poster');
                _ui.posterSet();
            },


            // load media
            load: function()
            {
                _env.shield.find('.julia-preloader').addClass('on');

                // ************************
                // HLS library supported
                // and HLS requested
                // ************************
                if(_env.useHlsLib === true)
                {
                    _bind.hlsLibEvents();
                    _env.hls.loadSource(_env.source);
                    _env.hls.attachMedia(_env.api);

                    // DETECT LEVEL DATA
                    _env.hls.on(Hls.Events.LEVEL_LOADED,function(event, data)
                    {
                        // SET LIVE EVENT STATE
                        if(data.details.live === true || options.live === true)
                        {
                            _env.isLive = true;
                            _env.toolbar.addClass('live');
                        }else{
                            _env.toolbar.removeClass('live');
                        }
                    });

                    for(x in options.triggerHls)
                    {
                        handle = options.triggerHls[x];

                        if(typeof window[handle] === 'function')
                        {
                            _env.hls.on(Hls.Events[x], function(event, data)
                            {
                                window[handle](_env.apiId, event, data);
                            });

                        }else{

                            _debug.run({
                                'triggerHlsError': handle+' is not a function'
                            });
                        }
                    }

                // ************************
                // No HLS library support,
                // but HLS is requested
                // ************************
                }else if(_env.flashApi === true)
                {
                    _api.create();

                // ************************
                // Classic VOD file
                // ************************
                }else{

                    _env.api.load();
                }

                // ************************
                // Bind all events
                // ************************
                _bind.domEvents();

                if(_env.flashApi === false)
                {
                    // Classic html5 api
                    _bind.nativeEvents();
                }else{
                    // Flash api
                    _bind.flashEvents();
                }

                // Define publicApi
                _env.publicApi = {
                    control: _control,
                    support: _support,
                    timeline: _timeline, 
                    shield: _env.shield, 
                    media: _env.api,
                    id: _env.apiId,
                    stats: stats
                };

            },

            // Initilize player
            init: function()
            {
                // Create source
                _boot.selectSource();
                _env.useHlsLib = false;
                _env.flashApi = false;
                _env.isLive = false;
                _env.hlsCapable = _support.hlsCapable();
                _env.tries+=1;

                if(_env.isHls === true)
                {
                    _env.useHlsLib = _env.hlsCapable === false && Hls.isSupported() ? true: false;
                }

                // ************************
                // HLS library supported
                // and HLS requested
                // ************************
                if(_env.useHlsLib === true)
                {
                    _api.create();
                    _env.hls = new Hls(options.hlsConfig);

                // ************************
                // No HLS library support,
                // but HLS is requested
                // ************************
                }else if(_env.isHls === true && _env.useHlsLib === false && _env.hlsCapable === false)
                {
                    _env.flashApi = true;

                // ************************
                // Classic VOD file
                // ************************
                }else{

                    _api.create();
                    _env.api.src = _env.source;
                }

                if(options.live === true)
                {
                    _env.isLive = true;
                    _env.toolbar.addClass('live');
                }else{
                    _env.toolbar.removeClass('live');
                }

                stats = {
                    'isHls': _env.isHls,
                    'flashApi': _env.flashApi,
                    'useHlsLib': _env.useHlsLib,
                    'live': _env.isLive,
                    'hlsCapable': _env.hlsCapable,
                    'hlsCapableString': _env.hlsCapableString
                };

                _debug.run(stats);
            }
        }

        // Build player object
        _boot.create();

        // Bring to life
        _boot.init();

        // Bring to life
        _boot.load();

        // Player dimensions
        _support.resize();

        // Populate public API
        return _env.publicApi;
    }

    // Build plugin instances
    $.fn.julia = function(opts)
    {
        var resize = [];
        return this.each(function()
        {
            var element = $(this);

            // Return if this element already has a plugin instance
            if ($(this).data('julia')) return;

            // Pass options to constructor
            var __julia = new _julia($(this), opts);

            // Store plugin object in element's data
            $(this).data('julia', __julia);
        });
    };

    // API wrappers
    $.fn.play = function()
    {
        $(this).data('julia').control.press('play');
    };

    $.fn.destroy = function()
    {
        $(this).data('julia').control.press('destroy');
    };

    $.fn.media = function()
    {
        return $(this).data('julia').media;
    };

    $.fn.pause = function()
    {
        $(this).data('julia').control.press('pause');
    };

    $.fn.stop = function()
    {
        $(this).data('julia').control.press('stop');
    };

    $.fn.goto = function(t)
    {
        $(this).data('julia').control.press('goto', {
            currentTime: t
        });
    };

    $.fn.mute = function()
    {
        if($(this).data('julia').media.muted === false)
        {
            $(this).data('julia').control.press('sound-off');
        }else{
            $(this).data('julia').control.press('sound-on');
        }
    };

    $.fn.volume = function(volume)
    {
        $(this).data('julia').control.press('volume', {
            volume: volume
        });
    };

    $.fn.getID = function()
    {
        return $(this).data('julia').id;
    };

    $.fn.stats = function()
    {
        return $(this).data('julia').stats;
    };

})(jQuery);
