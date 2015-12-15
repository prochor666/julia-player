/* ***********************************
* Julia player
*
* @author prochor666@gmail.com
* version: 0.8.5
* build: 2015-12-16
* licensed under the MIT License
*
* @requires:
* hls.js [optional]
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
        /*! hls.js 0.3.10, handle error or insert/bind source */
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
        var element = typeof el === 'undefined' ? $('video'): el;

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
            triggerHls: {}
        };


        // UI & behavior globals
        var shield,
            suggest,
            toolbar,
            api,
            apiId = Math.floor((Math.random()*10000000)+1), // Create a shadow api
            player,
            isLive = false,
            hls,
            hlsCapableString = '',
            type = 'html5',
            isHls = false,
            source,
            flashApi = false,
            duration = 0,
            seeking = false,
            dimensions = false,
            flashlsCallbackName,
            started = false;
            publicApi = {},
            suggestPointer = 0,
            suggestClicked = false;
            progressStep = 0.01; // Full sense: 100, so .01 is enough accurate


        // Extend options
        var _extend = function()
        {
            for(o in _options)
            {
                if(options.hasOwnProperty(o))
                {
                    _options[o] = options[o];
                }
            }

            options = _options;
            _debug.run(options);
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
                            console.log(' - [instance: '+apiId+'] '+d+' ['+(typeof data[d])+']', data[d]);
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
        var _api = function()
        {
            $('#julia-api-'+apiId).remove();

            // Create default api object
            if(flashApi === false)
            {
                _debug.run({
                    'apiType': 'html5video',
                });

                apiElement = $('<video class="julia-video" id="julia-api-'+apiId+'" preload="auto"></video>');
                player.prepend(apiElement);
                api = document.getElementById('julia-api-'+apiId);
                api.controls = false;

            }else{

                _debug.run({
                    'apiType': 'flashls',
                });

                flashlsCallbackName = 'flashlsCallback'+apiId;

                apiElement = $('<object classid="clsid:d27cdb6e-ae6d-11cf-96b8-444553540000" codebase="" id="julia-api-'+apiId+'">'
                            +'<param name="movie" value="'+options.swf+'?inline=1" />'
                            +'<param name="quality" value="autohigh" />'
                            +'<param name="swliveconnect" value="true" />'
                            +'<param name="allowScriptAccess" value="sameDomain" />'
                            +'<param name="bgcolor" value="#000000" />'
                            +'<param name="allowFullScreen" value="true" />'
                            +'<param name="wmode" value="opaque" />'
                            +'<param name="FlashVars" value="callback='+flashlsCallbackName+'" />'
                            +'<embed src="'+options.swf+'?inline=1" name="julia-api-'+apiId+'" '
                            +'    quality="autohigh" '
                            +'    bgcolor="#000000" '
                            +'    align="middle" allowFullScreen="true" '
                            +'    allowScriptAccess="sameDomain" '
                            +'    type="application/x-shockwave-flash" '
                            +'    swliveconnect="true" '
                            +'    wmode="opaque" '
                            +'    FlashVars="callback='+flashlsCallbackName+'" '
                            +'    pluginspage="http://www.macromedia.com/go/getflashplayer" >'
                            +'</embed>'
                        +'</object>');

                player.prepend(apiElement);

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

                api = new flashlsAPI(getFlashMovieObject('julia-api-'+apiId));
            }

            _debug.run({
                'apiId': apiId,
                'api': api,
            });
        };

        // Video shield for helpers, buttons, preloaders, advertising etc...
        var _shield = function()
        {
            shield = $('<div class="julia-shield" id="julia-shield-'+apiId+'">'
                        +'  <button class="julia-btn julia-big-play"><i class="ion-play"></i></button>'
                        +'  <div class="julia-preloader on"><i class="ion-load-c"></i></div>'
                        +'</div>'
                );

            suggest = $('<div class="julia-suggest" id="julia-suggest-'+apiId+'"></div>');
        };

        // Button toolbar
        var _toolbar = function()
        {
            toolbar = $('<div class="julia-toolbar" id="julia-toolbar-'+apiId+'">'
                +'<div class="julia-progress">'
                +'  <input type="range" value="0" min="0" max="100" step="'+progressStep+'">'
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
        };

        // Select playback url
        var _selectSource = function()
        {
            source = options.source && options.source.length>0 ? options.source: element.prop('src');
            if(options.forceHls === true)
            {
                source += source.indexOf('?') == -1 ? '?m3u8=yes': '&m3u8=yes';
            }

            type = source.indexOf('m3u8') == -1 ? type: 'hls';

            _debug.run({
                'sourceType': type
            });

            isHls = source.indexOf('m3u8') == -1 ? false: true;
        };

        // Create player object
        var _player = function()
        {
            _selectSource();
            _shield();
            _toolbar();

            player = $('<div class="julia-player julia-fullscreen-off julia-theme-'+options.theme+'" id="julia-player-'+apiId+'">'
                        +'</div>');

            player.append(shield);
            player.append(suggest);
            player.append(toolbar);

            element.hide();
            player.insertAfter(element);

            // Simulate preload
            shield.find('.julia-big-play').hide();
            toolbar.hide();

            // Rangeslider polyfill
            $('#julia-toolbar-'+apiId+'>div.julia-progress>input, #julia-toolbar-'+apiId+'>div.julia-volume>input').rangeslider({
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
                'element': element,
                'toolbar': toolbar,
                'shield': shield,
                'player': player,
            });
        };

        // Fullscreen on
        var _fullscreen = {

            on: function()
            {
                var videoFrame = document.querySelector('#julia-player-'+apiId);
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
                p = (currentTime/duration)*100;
                return p;
            },
            toSeconds: function(percent)
            {
                t = (duration/100)*percent;
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
                suggest.html('');
                _control('stop');
                suggestClicked = false;

                if(options.suggest.length > 0)
                {
                    x = 0;
                    for(var i in options.suggest)
                    {
                        if(x < options.suggestLimit && options.suggest[i].played === false)
                        {
                            mode = !!options.suggest[i].live && options.suggest[i].live === true ? 'live': 'vod';
                            liveText = !!options.suggest[i].liveText ? options.suggest[i].liveText: 'Live';
                            suggestItemWidget = $('<div class="julia-suggest-item" data-file="'+options.suggest[i].file+'" data-mode="'+mode+'" data-live-text="'+liveText+'" data-index="'+i+'">'
                                    +'<div class="julia-suggest-item-title">'+options.suggest[i].title+' ('+i+')</div>'
                                +'</div>');

                                suggestItemWidget.on('click', function(e)
                                {
                                    if(flashApi===false)
                                    {
                                        options.muted = api.muted;
                                    }else{

                                    }

                                    suggestClicked = true;
                                    shield.find('.julia-preloader').show();
                                    shield.find('.julia-big-play').hide();
                                    started = false;
                                    options.source = $(this).data('file');
                                    _selectSource();
                                    options.autoplay = true;
                                    options.live = $(this).data('mode') == 'live' ? true: false;
                                    options.i18n.liveText = $(this).data('live-text');

                                    toolbar.find('.julia-live-indicator>span').text(options.i18n.liveText);

                                    _debug.run({
                                        suggestRemoveIndex: $(this).data('index'),
                                        suggestRemove: $(this).data('file')
                                    });

                                    options.suggest[$(this).data('index')].played = true;
                                    suggest.removeClass('on');

                                    _init();
                                    _support.resize();
                                });

                            suggest.append(suggestItemWidget);
                            x++;
                        }
                    }

                    if(x > 0)
                    {
                        if(options.suggestTimeout > 0 && _support.isMobile() === false)
                        {
                            setTimeout( function()
                            {
                                if(suggestClicked === false)
                                {
                                    suggest.find('div.julia-suggest-item:first').click();
                                }
                            }, options.suggestTimeout);
                        }
                        suggest.addClass('on');
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
                vid.id = 'video-cap-test-'+apiId;
                hlsCapableString = vid.canPlayType('application/vnd.apple.mpegURL');
                $('#video-cap-test'+apiId).remove();
                return (hlsCapableString == 'probably' || hlsCapableString == 'maybe');
            },

            resize: function()
            {
	            // Player dimensions
	            defaultDim = element.width() ? [element.width(), element.height()]: [options.width, options.height];
	            dimensions = options.responsive === true ? _support.getSize(): defaultDim;

                _debug.run({
                    'resizeDefaults': defaultDim,
                    'resize': dimensions
                });

	            player.width(dimensions[0]);
	            player.height(dimensions[1]);

                if(flashApi===false)
	            {
	                api.setAttribute('width', '100%');
	                api.setAttribute('height', '100%');
	            }else{
	                api.flashObject.width = '100%';
	                api.flashObject.height = '100%';
	            }
            },

            getSize: function()
            {
                var parentWidth = element.parent().width();
                for(i in options.dimensions)
                {
                    var dim = options.dimensions[i];
                    if(parentWidth>=dim[0])
                    {
                        if(flashApi===false)
                        {
                            a = _support.aspect(parentWidth) == 0 ? dim[1]/dim[0]: _support.aspect(api.videoWidth, api.videoHeight);
                        }else{
                            a = _support.aspect(parentWidth) == 0 ? dim[1]/dim[0]: _support.aspect(api.width(), api.height());
                        }

                        dimensions = [dim[0],(dim[0]*a)];
                        _debug.run({
                            'resizePredefined': dimensions
                        });
                        return dimensions;
                    }
                }

                a = _support.aspect() == 0 ? dim[1]/dim[0]: _support.aspect(api.videoWidth, api.videoHeight);
                dimensions = [parentWidth, (parentWidth*a)];

                _debug.run({
                    'resizeFallback': dimensions
                });

                return dimensions;
            }
        };

        // Api && UI control
        var _control = function(action, data)
        {
            data = data||{};

            _debug.run({
                'action': action,
                'action-data': data,
            });

            if(flashApi === false)
            {
                switch(action)
                {
                    case 'play':
                        api.play();

                    break; case 'pause':
                        api.pause();

                    break; case 'stop':
                        api.pause();
                        api.currentTime = 0;
                        toolbar.find('.julia-playback.pause').removeClass('pause').addClass('play')
                        .find('i').removeClass('ion-pause').addClass('ion-play');
                        shield.find('.julia-big-play').show();
                        toolbar.find('.julia-progress>input').val(0).rangeslider('update', true);

                    break; case 'goto':
                        api.currentTime = data.currentTime;

                    break; case 'setDuration':
                        toolbar.find('.julia-panel.julia-duration>span').text(data.duration);
                        if(started === false)
                        {
                            toolbar.find('.julia-progress>input').val(0).rangeslider('update', true);
                        }
                        _debug.run({
                            'setDuration': data.duration
                        });

                    break; case 'volume':
                        options.volume = data.volume;
                        api.volume = data.volume/100;
                        toolbar.find('.julia-volume>input').val(data.volume).rangeslider('update', true);
                        if(data.volume>0)
                        {
                            _control('sound-on');
                        }else{
                            _control('sound-off');
                        }
                        _debug.run({
                            'volume is': api.volume
                        });

                    break; case 'sound-on':
                        api.muted = false;
                        options.muted = false;
                        _persist.set('volume', options.volume, 30);
                        _persist.set('muted', options.muted, 30);
                        toolbar.find('.julia-sound.off').removeClass('off').addClass('on')
                        .find('i').removeClass('ion-android-volume-off').addClass('ion-android-volume-up');

                    break; case 'sound-off':
                        api.muted = true;
                        options.muted = true;
                        _persist.set('volume', options.volume, 30);
                        _persist.set('muted', options.muted, 30);
                        toolbar.find('.julia-sound.on').removeClass('on').addClass('off')
                        .find('i').removeClass('ion-android-volume-up').addClass('ion-android-volume-off');

                    break; case 'fullscreen-on':
                        _fullscreen.on();

                    break; case 'fullscreen-off':
                        _fullscreen.off();

                    break; case 'destroy':
                        player.remove();

                    break; default:

                }

            }else{

                switch(action)
                {
                    case 'play':

                        shield.find('.julia-big-play').hide();

                        if(started === false)
                        {
                            api.play(-1);

                            _debug.run({
                                'FlashPlay': 'play',
                                'FlashPosition': api.getPosition()
                            });
                        }else{
                            api.resume(); //(api.getPosition());

                            _debug.run({
                                'FlashPlay': 'resume',
                                'FlashPosition': api.getPosition()
                            });
                        }

                    break; case 'pause':
                        api.pause();
                        toolbar.find('.julia-playback.pause').removeClass('pause').addClass('play')
                        .find('i').removeClass('ion-pause').addClass('ion-play');
                        shield.find('.julia-big-play').show();

                    break; case 'stop':
                        started = false;
                        api.stop();
                        toolbar.find('.julia-playback.pause').removeClass('pause').addClass('play')
                        .find('i').removeClass('ion-pause').addClass('ion-play');
                        shield.find('.julia-big-play').show();
                        toolbar.find('.julia-progress>input').val(0).rangeslider('update', true);

                    break; case 'goto':
                        api.seek(data.currentTime);

                    break; case 'setDuration':
                        toolbar.find('.julia-panel.julia-duration>span').text(data.duration);
                        if(started === false)
                        {
                            toolbar.find('.julia-progress>input').val(0).rangeslider('update', true);
                        }
                        _debug.run({
                            'setDuration': data.duration
                        });

                    break; case 'volume':
                        options.volume = data.volume;
                        api.volume(options.volume);
                        toolbar.find('.julia-volume>input').val(data.volume).rangeslider('update', true);
                        if(data.volume>0)
                        {
                            _control('sound-on');
                        }else{
                            _control('sound-off');
                        }
                        _debug.run({
                            'volume is': options.volume
                        });

                    break; case 'sound-on':
                        api.volume(options.volume);
                        options.muted = false;
                        _persist.set('volume', options.volume, 30);
                        _persist.set('muted', options.muted, 30);
                        toolbar.find('.julia-sound.off').removeClass('off').addClass('on')
                        .find('i').removeClass('ion-android-volume-off').addClass('ion-android-volume-up');
                        toolbar.find('.julia-volume>input').val(options.volume).rangeslider('update', true);

                    break; case 'sound-off':
                        api.volume(0);
                        options.muted = true;
                        _persist.set('volume', options.volume, 30);
                        _persist.set('muted', options.muted, 30);
                        toolbar.find('.julia-sound.on').removeClass('on').addClass('off')
                        .find('i').removeClass('ion-android-volume-up').addClass('ion-android-volume-off');
                        toolbar.find('.julia-volume>input').val(0).rangeslider('update', true);

                    break; case 'fullscreen-on':
                        _fullscreen.on();

                    break; case 'fullscreen-off':
                        _fullscreen.off();

                    break; case 'destroy':
                        player.remove();

                    break; default:
                }
            }

            return;
        };

        // First play with some handlers
        var _playAllowStart = function(e)
        {
            shield.find('.julia-preloader').hide();
            shield.find('.julia-big-play').show();
            toolbar.show();

            // Init actions
            _control('setDuration', {
                'duration': _timeline.toHuman( duration )
            });

            // Set mute if needed
            if(options.muted === true)
            {
                _control('sound-off');
            }else{
                _control('sound-on');

                // Set initial volume
                _control('volume', {
                    'volume': options.volume
                });
            }

            // Autostart playback, if possible
            if(options.autoplay === true && _support.isMobile() === false)
            {
                _control('play');
            }

            _debug.run({
                'eventType': e.type,
                'duration': api.duration,
                'readyState': api.readyState
            });
        }

        // Bind can play by ready state / fake readyState
        // Because of Firefox cannot bind canplaythrough event with HLS.js properly
        var _canplaythrough = function()
        {
            if(started === false)
            {
	            // don't let mobile Firefox make decision about readyState, mobile Firefox lie!
	            if(api.readyState>=3 || (_support.isMobile() === true && api.readyState>=2) )
	            {
	                _playAllowStart({
	                    type: '_canplaythrough'
	                });
	            }else{
	                setTimeout( function()
	                {
	                    _canplaythrough();
	                }, 250);
	            }
	        }
        }

        // Bindings
        var _bind = {

            // Bind user action & DOM events
            domEvents: function()
            {
                // Buttons
                toolbar.on('contextmenu', function(e)
                {
                    e.preventDefault();
                })
                .on('click', '.julia-playback.play', function(e)
                {
                    e.preventDefault();
                    _control('play');
                })
                .on('click', '.julia-playback.pause', function(e)
                {
                    e.preventDefault();
                    _control('pause');
                })
                .on('click', '.julia-sound.on', function(e)
                {
                    e.preventDefault();
                    _control('sound-off');
                })
                .on('click', '.julia-sound.off', function(e)
                {
                    e.preventDefault();
                    _control('sound-on');
                })
                .on('click', '.julia-fullscreen-toggle.on', function(e)
                {
                    e.preventDefault();
                    _control('fullscreen-on');
                })
                .on('click', '.julia-fullscreen-toggle.off', function(e)
                {
                    e.preventDefault();
                    _control('fullscreen-off');
                });

                // Big play
                shield.on('click contextmenu', '.julia-big-play', function(e)
                {
                    e.preventDefault();
                    e.stopPropagation();
                    if(e.type == 'click')
                    {
                        _control('play');
                    }
                });

                // Area click
                shield.on('click', function(e)
                {
                    e.preventDefault();
                    e.stopPropagation();
                    if(options.pauseOnClick === true)
                    {
                    	_control('pause');
                    }
                });

                // Fullscreen toolbar behavior bindings
                var mouseMoveCleaner;
                player.on('mousemove', '#julia-shield-'+apiId+', #julia-suggest-'+apiId, function(e)
                {
                    e.preventDefault();
                    toolbar.addClass('julia-toolbar-visible');
                    clearTimeout(mouseMoveCleaner);

                    mouseMoveCleaner = setTimeout(function()
                    {
                        toolbar.removeClass('julia-toolbar-visible');
                    }, 1750);
                })
                .on('mouseover mousemove mouseout', '#julia-toolbar-'+apiId+'.julia-toolbar-visible', function(e)
                {
                    e.preventDefault();
                    toolbar.addClass('julia-toolbar-visible');
                    clearTimeout(mouseMoveCleaner);

                    if(e.type == 'mouseout')
                    {
                        mouseMoveCleaner = setTimeout(function(e)
                        {
                            toolbar.removeClass('julia-toolbar-visible');
                        }, 1750);
                    }
                });

                // Bind progressbar change
                toolbar.on('change input', '.julia-progress>input', function(e)
                {
                    if(e.type == 'input')
                    {
                        seeking = true;
                    }else{

                        seekTo = _timeline.toSeconds( $(this).val() );
                        seekTo = seekTo >= duration ? duration: seekTo.toFixed(2);

                        _control('goto', {
                            currentTime: seekTo
                        });

                        seeking = false;
                    }
                });

                // Bind volumebar change
                toolbar.on('change', '.julia-volume>input', function()
                {
                    _control('volume', {
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
                        $('#julia-player-'+apiId).removeClass('julia-fullscreen-on').addClass('julia-fullscreen-off')
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
                            'fullscreen off' : '#julia-player-'+apiId
                        });

                        _support.resize();

                    }else{

                        $('#julia-player-'+apiId).removeClass('julia-fullscreen-off').addClass('julia-fullscreen-on')
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
                            'fullscreen on' : '#julia-player-'+apiId
                        });
                    }
                });
            },


            // Native video api
            nativeEvents: function()
            {
                if(_support.forceReady()===true && isHls === true)
                {
                    _canplaythrough();
                }else{
                    api.oncanplaythrough = function(e)
                    {
                        duration = api.duration;

                        if(started === false && api.readyState >= 3)
                        {
                            _playAllowStart(e);
                        }
                    }
                }

                // Video playback detect
                api.onplay = function(e)
                {
                    toolbar.find('.julia-playback.play').removeClass('play').addClass('pause')
                    .find('i').removeClass('ion-play').addClass('ion-pause');
                    shield.find('.julia-big-play').hide();
                    shield.find('.julia-preloader').hide();
                    toolbar.show();
                }

                api.onplaying = function(e)
                {
                    toolbar.find('.julia-playback.play').removeClass('play').addClass('pause')
                    .find('i').removeClass('ion-play').addClass('ion-pause');
                    shield.find('.julia-big-play').hide();
                    shield.find('.julia-preloader').hide();
                    suggest.html('').removeClass('on');
                    toolbar.show();
                    _control('setDuration', {
                        'duration': _timeline.toHuman( duration )
                    });
                    started = true;
                }


                // Video pause
                api.onpause = function(e)
                {
                    toolbar.find('.julia-playback.pause').removeClass('pause').addClass('play')
                    .find('i').removeClass('ion-pause').addClass('ion-play');
                    shield.find('.julia-big-play').show();
                }


                // Errors
                api.onerror = function(e)
                {
                    // Bring to life again
                    _init();
                }

                api.onemptied = function(e)
                {
                }

                api.onstalled = function(e)
                {
                }

                api.onsuspend = function(e)
                {
                }

                // Video position
                api.ontimeupdate = function(e)
                {
                    if(seeking === false)
                    {
                        currentTimeReadable = _timeline.toHuman( api.currentTime.toFixed(2) );
                        toolbar.find('.julia-progress>input').val( _timeline.toPercents( api.currentTime.toFixed(2) ) ).rangeslider('update', true);
                        toolbar.find('.julia-panel.julia-currentTime>span').text(currentTimeReadable);
                    }

                    if(options.debugPlayback === true)
                    {
                        _debug.run({
                            'duration/current': duration+'/'+api.currentTime.toFixed(2)+' > '+currentTimeReadable
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
                api.seeked = function(e)
                {
                    seeking = false;
                }

                // Video position
                api.seeking = function(e)
                {
                    seeking = true;
                }

                // Volume
                api.onvolumechange = function(e)
                {
                    if(api.muted === false)
                    {
                        toolbar.find('.julia-volume>input').val(api.volume*100).rangeslider('update', true);
                    }else{
                        toolbar.find('.julia-volume>input').val(0).rangeslider('update', true);
                    }
                }

                // Set video duration
                api.ondurationchange = function(e)
                {
                    duration = api.duration;

                    if(started === false)
                    {
                        duration = api.duration;
                        seeking = false;

                        _debug.run({
                            'duration': duration,
                            'readyState': api.readyState,
                            'started': started
                        });
                    }
                }

                // Bind playback end event
                api.onended = function(e)
                {
                    _suggest.run();
                };
            },


            // Specific events, error handlers
            hlsLibEvents: function()
            {
                hls.on(Hls.Events.ERROR, function(event, data)
                {

                    switch(data.details)
                    {
                        case hls.ErrorDetails.MANIFEST_LOAD_ERROR:
                        case hls.ErrorDetails.MANIFEST_LOAD_TIMEOUT:
                        case hls.ErrorDetails.MANIFEST_PARSING_ERROR:
                        case hls.ErrorDetails.LEVEL_LOAD_ERROR:
                        case hls.ErrorDetails.LEVEL_LOAD_TIMEOUT:
                        case hls.ErrorDetails.LEVEL_SWITCH_ERROR:
                        case hls.ErrorDetails.FRAG_LOAD_ERROR:
                        case hls.ErrorDetails.FRAG_LOOP_LOADING_ERROR:
                        case hls.ErrorDetails.FRAG_LOAD_TIMEOUT:
                        case hls.ErrorDetails.FRAG_DECRYPT_ERROR:
                        case hls.ErrorDetails.FRAG_PARSING_ERROR:
                        case hls.ErrorDetails.BUFFER_APPEND_ERROR:
                        case hls.ErrorDetails.BUFFER_APPENDING_ERROR:

                            _debug.run({
                                recoveringError: data.details,
                                errorType: data.type,
                                errorFatal: data.fatal
                            });


                            if(data.fatal === true)
                            {
                                // Bring to life again
                                _init();
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
                        api.load(source);

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
                        _init();
                    },

                    manifest: function(flashDuration, levels_, loadmetrics)
                    {
                        duration = flashDuration.toFixed(2);
                        levels = levels_;
                        _debug.run({
                            'durationOrigin': flashDuration,
                            'duration': duration,
                            'durationHuman': _timeline.toHuman( duration ),
                            'levels': levels,
                            'metrics': loadmetrics,
                        });

                        if(started === false)
                        {
                            shield.find('.julia-preloader').hide();
                            shield.find('.julia-big-play').show();
                            toolbar.show();

                            // Init actions
                            _control('setDuration', {
                                'duration': _timeline.toHuman( duration )
                            });

                            // Set initial volume
                            if(options.muted === false)
                            {
                                _control('volume', {
                                    'volume': options.volume
                                });
                            }
                            // Set mute if needed
                            if(options.muted === true)
                            {
                                _control('sound-off');
                            }

                            // Autostart playback, if possible
                            if(options.autoplay === true)
                            {
                                api.play(-1);
                            }

                            _debug.run({
                                'duration': api.duration,
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
                        toolbar.find('.julia-playback.play').removeClass('play').addClass('pause')
                        .find('i').removeClass('ion-play').addClass('ion-pause');
                        shield.find('.julia-big-play').hide();
                        shield.find('.julia-preloader').hide();
                        suggest.html('').removeClass('on');
                        toolbar.show();
                        started = true;
                    },

                    position: function(timemetrics)
                    {
                        if(seeking === false)
                        {
                            currentTimeReadable = _timeline.toHuman( api.getPosition() );
                            toolbar.find('.julia-progress>input').val( _timeline.toPercents( api.getPosition() ) ).rangeslider('update', true);
                            toolbar.find('.julia-panel.julia-currentTime>span').text(currentTimeReadable);
                        }
                    }
                };

                // Create a single global callback function and pass it's name
                // to the SWF with the name `callback` in the FlashVars parameter.
                window[flashlsCallbackName] = function(eventName, args)
                {
                    flashlsEvents[eventName].apply(null, args);
                };
            }

        };

        // Create player
        var _create = function()
        {
            // Extend default options with external options
            _extend();

            // Degbug header
            if(options.debug === true && window.console )
            {
                console.info('=== Julia console debug start for '+apiId+' ===');
            }

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
            _player();
        }

        // Initilize player
        var _init = function()
        {
            useHlsLib = false;
            flashApi = false;
            isLive = false;

            hlsCapable = _support.hlsCapable();

            if(isHls === true)
            {
                useHlsLib = hlsCapable === false && Hls.isSupported() ? true: false;
            }

            // ************************
            // HLS library supported
            // and HLS requested
            // ************************
            if(useHlsLib === true)
            {
                _api();

                hls = new Hls(options.hlsConfig);

                _bind.hlsLibEvents();

                hls.loadSource(source);
                hls.attachMedia(api);

                // DETECT LEVEL DATA
                hls.on(Hls.Events.LEVEL_LOADED,function(event, data)
                {
                    // SET LIVE EVENT STATE
                    if(data.details.live === true || options.live === true)
                    {
                        isLive = true;
                        toolbar.addClass('live');
                    }else{
                        toolbar.removeClass('live');
                    }
                });

                for(x in options.triggerHls)
                {
                    handle = options.triggerHls[x];

                    if(typeof window[handle] === 'function')
                    {
                        hls.on(Hls.Events[x], function(event, data)
                        {
                            window[handle](apiId, event, data);
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
            }else if(isHls === true && useHlsLib === false && hlsCapable === false)
            {
                flashApi = true;

                _api();

            // ************************
            // Classic VOD file
            // ************************
            }else{

                _api();

                api.src = source;
                api.load();
            }

            if(options.live === true)
            {
                isLive = true;
                toolbar.addClass('live');
            }else{
                toolbar.removeClass('live');
            }


            stats = {
            	'isHls': isHls,
                'flashApi': flashApi,
                'useHlsLib': useHlsLib,
                'live': isLive,
                'hlsCapable': hlsCapable,
                'hlsCapableString': hlsCapableString
            };

            _debug.run(stats);

            // ************************
            // Bind all events
            // ************************
            _bind.domEvents();

            if(flashApi === false)
            {
                // Classic html5 api
                _bind.nativeEvents();
            }else{
                // Flash api
                _bind.flashEvents();
            }

            // Define publicApi
            publicApi = {
                control : _control,
                support : _support,
                media: api,
                id: apiId,
                stats: stats
            };
        }

        // Build player object
        _create();

        // Bring to life
        _init();

        // Player dimensions
        _support.resize();

        // Populate public API
        return publicApi;
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
        $(this).data('julia').control('play');
    };

    $.fn.destroy = function()
    {
        $(this).data('julia').control('destroy');
    };

    $.fn.media = function()
    {
        return $(this).data('julia').media;
    };

    $.fn.pause = function()
    {
        $(this).data('julia').control('pause');
    };

    $.fn.stop = function()
    {
        $(this).data('julia').control('stop');
    };

    $.fn.goto = function(t)
    {
        $(this).data('julia').control('goto', {
            currentTime: t
        });
    };

    $.fn.mute = function()
    {
        if($(this).data('julia').media.muted === false)
        {
            $(this).data('julia').control('sound-off');
        }else{
            $(this).data('julia').control('sound-on');
        }
    };

    $.fn.volume = function(volume)
    {
        $(this).data('julia').control('volume', {
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
