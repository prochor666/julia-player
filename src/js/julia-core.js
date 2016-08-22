/* ***********************************
* Julia player
*
* @author prochor666@gmail.com
* version: 0.9.11
* build: 2016-08-16
* licensed under the MIT License
*
* @requires:
* jquery [required]
* hls.js [required]
* rangeslider.js [required]
*
************************************* */

var Julia = function(options)
{
    if(!window.jQuery)
    {
        alert('jQuery is required');
        window.stop();
    }

    var self = this;

    // Import self.options
    options = typeof options === 'undefined' ? {}: options;

    // Root path workaround
    var __JULIA_ROOT_PATH__ = 'julia';
    dir = $('script[src*="julia-player"]').attr('src');
    name = dir.split('/').pop();
    __JULIA_ROOT_PATH__ = dir.replace('/js/'+name,"");
    $('head').append('<link rel="stylesheet" type="text/css" href="'+__JULIA_ROOT_PATH__+'/css/julia-player.min.css">');
    //$('head').append('<link rel="stylesheet" type="text/css" href="'+__JULIA_ROOT_PATH__+'/css/themes/default/julia.css">');



    // Default self.options
    self.options = {
        source: false,
        autoplay: false,
        volume: 25,
        element: $('video'),
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
/*
            debug : false,
            autoStartLoad : true,
            autoRecoverError : true,
            maxBufferLength : 60,
            maxBufferSize : 120*1000*1000,
            liveSyncDurationCount : 5, // D: 3
            liveMaxLatencyDurationCount: 10,
            enableWorker : true,
            levelLoadingTimeOut: 10000,
            levelLoadingMaxRetry: 6,
            levelLoadingRetryDelay: 500,
            fragLoadingTimeOut : 5000,
            fragLoadingMaxRetry : 6,
            fragLoadingRetryDelay : 100,
            manifestLoadingTimeOut : 10000,
            manifestLoadingMaxRetry : 6,
            manifestLoadingRetryDelay : 500,
            fpsDroppedMonitoringPeriod : 5000,
            fpsDroppedMonitoringThreshold : 0.2,
            appendErrorMaxRetry : 200,

            xhrSetup: function(xhr, url) {
                xhr.withCredentials = true;
                xhr.setRequestHeader("Cache-Control","no-cache,max-age=0");
                xhr.setRequestHeader("pragma", "no-cache");
            }*/
        },
        dashConfig: {
            
        },
        suggest: [],
        suggestLimit: 2,
        suggestTimeout: 10000,
        themePath: __JULIA_ROOT_PATH__+'/css/themes',
        pluginPath: __JULIA_ROOT_PATH__+'/js/plugins',
        theme: 'default',
        i18n: {
            liveText: 'Live'
        },
        onTime: {},
        triggerHls: {},
        onPlay: false,
        onPause: false,
        onStop: false,
        onPosition: false,
        onSuggest: false,
    };






    // Environment
    self.env = {
        shield: '',
        element: self.options.element,
        suggest: '',
        toolbar: '',
        poster: '',
        api: '',
        apiId: Math.floor((Math.random()*10000000)+1), // Create a shadow api unique ID
        player: '',
        isLive: false,
        hls: {},
        canPlayMedia: '',
        canPlayMediaString: '',
        isHls: false,
        useHlsLib: false,
        tries: 0,
        source: '',
        duration: 0,
        apiOk: false,
        onTimeRised: [],
        seeking: false,
        dimensions: {
            width: 0,
            height: 0,
        },
        started: false,
        publicApi: {},
        suggestPointer: 0,
        suggestClicked: false,
        progressStep: 0.01, // Full sense: 100, so .01 is enough accurate
    };









    // Extend self.options
    var _extend = function()
    {
        for(o in self.options)
        {
            if(options.hasOwnProperty(o))
            {
                self.options[o] = options[o];
            }
        }
    };




    // Extend default self.options with external self.options
    _extend();






    // Console debug
    var _debug = function(data)
    {
        if(self.options.debug === true)
        {
            if(window.console)
            {
                for(d in data)
                {
                    console.log(' - [instance: '+self.env.apiId+'] '+d+' ['+(typeof data[d])+']', data[d]);
                }
            }
        }
    };









    // Persistent user data in cookies
    var _client = {

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
            $('#julia-api-'+self.env.apiId).remove();

            // Create default api object
            _debug({
                'apiType': 'html5video',
            });

            apiElement = $('<video class="julia-video" id="julia-api-'+self.env.apiId+'" preload="auto"></video>');
            self.env.player.prepend(apiElement);
            self.env.api = document.getElementById('julia-api-'+self.env.apiId);
            self.env.api.controls = false;
            self.env.apiOk = true;

            _debug({
                'apiId': self.env.apiId,
                'api': self.env.api,
            });
        }
    };
















    // UI kit
    var _ui = {

        // Video shield for helpers, buttons, preloaders, advertising etc...
        shield: function()
        {
            self.env.shield = $('<div class="julia-shield" id="julia-shield-'+self.env.apiId+'">'
                        +'  <button class="julia-btn julia-big-play"><i class="julia-icon julia-play-circle"></i></button>'
                        +'  <div class="julia-preloader"><div class="julia-preloader-run"></div></div>'
                        +'</div>'
                );

            self.env.suggest = $('<div class="julia-suggest" id="julia-suggest-'+self.env.apiId+'"></div>');
        },

        posterSet: function()
        {
            _ui.posterUnset();
            if(self.env.poster.length > 0)
            {
                img = $('<img src="'+self.env.poster+'" width="100%" height="100%">')

                self.env.shield.append(img);

                _debug({
                    poster: self.env.poster,
                })
            }
        },

        posterUnset: function()
        {
            self.env.shield.find('img').remove();
        },

        // Button toolbar
        toolbar: function()
        {
            self.env.toolbar = $('<div class="julia-toolbar" id="julia-toolbar-'+self.env.apiId+'">'
                +'<div class="julia-progress">'
                +'  <input type="range" value="0" min="0" max="100" step="'+self.env.progressStep+'">'
                +'</div>'
                +'<div class="julia-panel julia-live-indicator">'
                +'    <span>'+self.options.i18n.liveText+'</span>'
                +'</div>'
                +'<div class="julia-panel julia-currentTime">'
                +'    <span>00:00:00</span> /&nbsp;'
                +'</div>'
                +'<div class="julia-panel julia-duration">'
                +'    <span>00:00:00</span>'
                +'</div>'
                +'<button class="julia-btn julia-playback play">'
                +'    <i class="julia-icon julia-play"></i>'
                +'</button>'
                +'<button class="julia-btn julia-sound on">'
                +'    <i class="julia-icon julia-sound-on"></i>'
                +'</button>'
                +'<div class="julia-volume">'
                +'  <input type="range" value="'+self.options.volume+'" min="0" max="100">'
                +'</div>'
                +'<button class="julia-btn julia-fullscreen-toggle on">'
                +'    <i class="julia-icon julia-fullscreen"></i>'
                +'</button>'
            +'</div>');
        },

        // Create player object
        player: function()
        {
            _ui.shield();
            _ui.toolbar();

            self.env.player = $('<div class="julia-player julia-fullscreen-off julia-theme-'+self.options.theme+'" id="julia-player-'+self.env.apiId+'">'
                        +'</div>');

            self.env.player.append(self.env.shield);
            self.env.player.append(self.env.suggest);
            self.env.player.append(self.env.toolbar);

            self.env.element.hide();
            self.env.player.insertAfter(self.env.element);

            // Simulate preload
            self.env.shield.find('.julia-big-play').hide();
            self.env.toolbar.hide();

            // Rangeslider polyfill
            $('#julia-toolbar-'+self.env.apiId+'>div.julia-progress>input, #julia-toolbar-'+self.env.apiId+'>div.julia-volume>input').rangeslider({
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

            _debug({
                'element': self.env.element,
                'toolbar': self.env.toolbar,
                'shield': self.env.shield,
                'player': self.env.player,
            });
        }
    };













    // Fullscreen on
    var _fullscreen = {

        on: function()
        {
            var videoFrame = document.querySelector('#julia-player-'+self.env.apiId);

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
    var _timecode = {

        toPercents: function(currentTime)
        {
            p = (currentTime/self.env.duration)*100;
            return p;
        },

        toSeconds: function(percent)
        {
            t = (self.env.duration/100)*percent;
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
            self.env.suggest.html('');
            _control.press('stop');
            self.env.suggestClicked = false;
            self.env.tries = 0;

            if(self.options.suggest.length > 0)
            {
                x = 0;
                for(var i in self.options.suggest)
                {
                    if(x < self.options.suggestLimit && self.options.suggest[i].played === false)
                    {
                        mode = !!self.options.suggest[i].live && self.options.suggest[i].live === true ? 'live': 'vod';
                        liveText = !!self.options.suggest[i].liveText ? self.options.suggest[i].liveText: 'Live';
                        var poster = !!self.options.suggest[i].poster ? self.options.suggest[i].poster: '';
                        posterImage = poster.length>0 ? '<img src="'+poster+'" width="100%" height="100%">': '';
                        suggestItemWidget = $('<div class="julia-suggest-item" data-poster="'+poster+'" data-file="'+self.options.suggest[i].file+'" data-mode="'+mode+'" data-live-text="'+liveText+'" data-index="'+i+'">'
                                + posterImage
                                +'<div class="julia-suggest-item-title">'+self.options.suggest[i].title+'</div>'
                            +'</div>');

                            suggestItemWidget.on('click', function(e)
                            {

                                if(self.options.onSuggest !== false)
                                {
                                    _call.fn(self.options.onSuggest, self.options.suggest[i]);
                                }

                                self.options.muted = self.env.api.muted;

                                self.options.poster = $(this).data('poster');
                                self.env.suggestClicked = true;
                                self.env.shield.find('.julia-big-play').hide();
                                self.env.started = false;
                                self.options.source = $(this).data('file');
                                _boot.selectSource();
                                self.options.autoplay = true;
                                self.options.live = $(this).data('mode') == 'live' ? true: false;
                                self.options.i18n.liveText = $(this).data('live-text');

                                self.env.toolbar.find('.julia-live-indicator>span').text(self.options.i18n.liveText);

                                _debug({
                                    suggestRemoveIndex: $(this).data('index'),
                                    suggestRemove: $(this).data('file')
                                });

                                self.options.suggest[$(this).data('index')].played = true;
                                self.env.suggest.removeClass('on');

                                _boot.init();
                                _boot.load();
                                _support.resize();
                            });

                        self.env.suggest.append(suggestItemWidget);
                        x++;
                    }
                }

                if(x > 0)
                {
                    if(self.options.suggestTimeout > 0 && _support.isMobile() === false)
                    {
                        setTimeout( function()
                        {
                            if(self.env.suggestClicked === false)
                            {
                                self.env.suggest.find('div.julia-suggest-item:first').click();
                            }
                        }, self.options.suggestTimeout);
                    }
                    self.env.suggest.addClass('on');
                }

            }else{
                _fullscreen.off();
            }

            _debug({
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
            _debug({
                'theme': self.options.themePath+'/'+self.options.theme+'/julia.css'
            });

            $('head').append('<link rel="stylesheet" type="text/css" href="'+self.options.themePath+'/'+self.options.theme+'/julia.css">');
        },

        canPlayMedia: function()
        {
            var vid = document.createElement('video');
            vid.id = 'video-cap-test-'+self.env.apiId;
            self.env.canPlayMediaString = vid.canPlayType('application/vnd.apple.mpegURL');
            $('#video-cap-test'+self.env.apiId).remove();
            return (self.env.canPlayMediaString == 'probably' || self.env.canPlayMediaString == 'maybe');
        },

        resize: function()
        {
            // Player dimensions
            defaultDim = self.env.element.width() ? [self.env.element.width(), self.env.element.height()]: [self.options.width, self.options.height];
            dimensions = self.options.responsive === true ? _support.getSize(): defaultDim;

            _debug({
                'resizeDefaults': defaultDim,
                'resize': dimensions
            });

            self.env.player.width(dimensions[0]);
            self.env.player.height(dimensions[1]);

            self.env.dimensions.width = dimensions[0];
            self.env.dimensions.height = dimensions[1];

            self.env.api.setAttribute('width', '100%');
            self.env.api.setAttribute('height', '100%');
        },

        getSize: function()
        {
            // Fix video wrapped in inline block, can not get size properlym if inline element detected
            var parentBlock = self.env.element.parent().css('display').toLowerCase();
            if(parentBlock == 'inline')
            {
                self.env.element.parent().css({'display': 'block'});
            }

            var parentWidth = self.env.element.parent().width();
            for(i in self.options.dimensions)
            {
                var dim = self.options.dimensions[i];
                if(parentWidth>=dim[0])
                {
                    a = _support.aspect(parentWidth) == 0 ? dim[1]/dim[0]: _support.aspect(self.env.api.videoWidth, self.env.api.videoHeight);

                    dimensions = [dim[0],(dim[0]*a)];
                    _debug({
                        'resizePredefined': dimensions
                    });
                    return dimensions;
                }
            }

            a = _support.aspect() == 0 ? dim[1]/dim[0]: _support.aspect(self.env.api.videoWidth, self.env.api.videoHeight);
            dimensions = [parentWidth, (parentWidth*a)];

            _debug({
                'resizeFallback': dimensions
            });

            return dimensions;
        }
    };











    // Callback
    var _call = {

        fn: function(f, data)
        {
            data = data||{};
            if(f !== false)
            {
                f(self.options, self.env, data);
            }
        }
    };














    // Api && UI control
    var _control = {

        press: function(action, data)
        {
            data = data||{};

            _debug({
                'action': action,
                'action-data': data,
            });

            switch(action)
            {
                case 'play':

                    if(self.options.onPlay !== false)
                    {
                        _call.fn(self.options.onPlay, data);
                    }

                    self.env.api.play();

                break; case 'pause':

                    if(self.options.onPause !== false)
                    {
                        _call.fn(self.options.onPause, data);
                    }

                    self.env.api.pause();

                break; case 'stop':

                    if(self.options.onStop !== false)
                    {
                        _call.fn(self.options.onStop, data);
                    }

                    self.env.api.pause();
                    self.env.api.currentTime = 0;

                    self.env.toolbar.find('.julia-playback.pause')
                    .removeClass('pause')
                    .addClass('play')
                    .find('i')
                    .removeClass('julia-pause')
                    .addClass('julia-play');
                    self.env.shield.find('.julia-big-play').show();
                    self.env.toolbar.find('.julia-progress>input').val(0).rangeslider('update', true);

                break; case 'goto':

                    if(self.options.onPosition !== false)
                    {
                        _call.fn(self.options.onPosition, data);
                    }

                    self.env.api.currentTime = data.currentTime;

                break; case 'setDuration':

                    self.env.toolbar.find('.julia-panel.julia-duration>span').text(data.duration);

                    if(self.env.started === false)
                    {
                        self.env.toolbar.find('.julia-progress>input').val(0).rangeslider('update', true);
                    }

                    _debug({
                        'setDuration': data.duration
                    });

                break; case 'volume':

                    self.options.volume = data.volume;
                    self.env.api.volume = data.volume/100;

                    _debug({
                        'volume is': self.env.api.volume
                    });

                    self.env.toolbar.find('.julia-volume>input').val(data.volume).rangeslider('update', true);

                    if(data.volume>0)
                    {
                        _control.press('sound-on');

                    }else{
                        _control.press('sound-off');
                    }

                break; case 'sound-on':

                    self.env.api.muted = false;
                    self.options.muted = false;
                    _client.set('volume', self.options.volume, 30);
                    _client.set('muted', self.options.muted, 30);

                    self.env.toolbar
                    .find('.julia-sound.off')
                    .removeClass('off')
                    .addClass('on')
                    .find('i')
                    .removeClass('julia-sound-off')
                    .addClass('julia-sound-on');

                break; case 'sound-off':

                    self.env.api.muted = true;
                    self.options.muted = true;
                    _client.set('volume', self.options.volume, 30);
                    _client.set('muted', self.options.muted, 30);

                    self.env.toolbar
                    .find('.julia-sound.on')
                    .removeClass('on')
                    .addClass('off')
                    .find('i')
                    .removeClass('julia-sound-on')
                    .addClass('julia-sound-off');

                break; case 'fullscreen-on':
                    _fullscreen.on();

                break; case 'fullscreen-off':
                    _fullscreen.off();

                break; case 'destroy':

                    setTiemout( function(){
                        self.env.player.remove();
                    }, 100);

                break; default:

            }

            return;
        }
    };













    // Bindings
    var _events = {

        // First play with some handlers
        playAllowStart: function(e)
        {
            self.env.shield.find('.julia-preloader').removeClass('on');
            self.env.shield.find('.julia-big-play').show();
            self.env.toolbar.show();

            // Init actions
            _control.press('setDuration', {
                'duration': _timecode.toHuman( self.env.duration )
            });

            // Set mute if needed
            if(self.options.muted === true)
            {
                _control.press('sound-off');
            }else{
                _control.press('sound-on');

                // Set initial volume
                _control.press('volume', {
                    'volume': self.options.volume
                });
            }

            // Autostart playback, if possible
            if(self.options.autoplay === true && _support.isMobile() === false)
            {
                _control.press('play');
            }

            _debug({
                'eventType': e.type,
                'duration': self.env.api.duration,
                'readyState': self.env.api.readyState
            });
        },

        // Bind can play by ready state / fake readyState
        // Because of Firefox cannot bind canplaythrough event with HLS.js properly
        canplaythrough: function()
        {
            if(self.env.started === false)
            {
                // don't let mobile Firefox make decision about readyState, mobile Firefox lie!
                if(self.env.api.readyState>=3 || (_support.isMobile() === true && self.env.api.readyState>=2) )
                {
                    _events.playAllowStart({
                        type: '_events.canplaythrough'
                    });
                }else{
                    setTimeout( function()
                    {
                        _events.canplaythrough();
                    }, 250);
                }
            }
        },


        // Bind user action & DOM events
        DOM: function()
        {
            // Buttons
            self.env.toolbar.on('contextmenu', function(e)
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
            self.env.shield.on('click contextmenu', '.julia-big-play', function(e)
            {
                e.preventDefault();
                e.stopPropagation();
                if(e.type == 'click')
                {
                    _control.press('play');
                }
            });

            // Area click
            self.env.shield.on('click', function(e)
            {
                e.preventDefault();
                e.stopPropagation();
                if(self.options.pauseOnClick === true && _support.isMobile() === false)
                {
                    _control.press('pause');
                }
            });

            // Fullscreen toolbar behavior bindings
            var mouseMoveCleaner;

            self.env.player.on('mousemove', '#julia-shield-'+self.env.apiId+', #julia-suggest-'+self.env.apiId, function(e)
            {
                e.preventDefault();
                self.env.toolbar.addClass('julia-toolbar-visible');
                clearTimeout(mouseMoveCleaner);

                mouseMoveCleaner = setTimeout(function()
                {
                    self.env.toolbar.removeClass('julia-toolbar-visible');
                }, 1750);
            })
            .on('mouseover mousemove mouseout', '#julia-toolbar-'+self.env.apiId+'.julia-toolbar-visible', function(e)
            {
                e.preventDefault();
                self.env.toolbar.addClass('julia-toolbar-visible');
                clearTimeout(mouseMoveCleaner);

                if(e.type == 'mouseout')
                {
                    mouseMoveCleaner = setTimeout(function(e)
                    {
                        self.env.toolbar.removeClass('julia-toolbar-visible');
                    }, 1750);
                }
            });

            // Bind progressbar change
            self.env.toolbar.on('change input', '.julia-progress>input', function(e)
            {
                if(e.type == 'input')
                {
                    self.env.seeking = true;
                }else{

                    seekTo = _timecode.toSeconds( $(this).val() );
                    seekTo = seekTo >= self.env.duration ? self.env.duration: seekTo.toFixed(2);

                    _control.press('goto', {
                        currentTime: seekTo
                    });

                    self.env.seeking = false;
                }
            });

            // Bind volumebar change
            self.env.toolbar.on('change', '.julia-volume>input', function()
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
                    $('.julia-player')
                    .removeClass('julia-fullscreen-on')
                    .addClass('julia-fullscreen-off')
                    .find('button.julia-fullscreen-toggle')
                    .removeClass('off')
                    .addClass('on')
                    .find('i')
                    .removeClass('julia-fullscreen-exit')
                    .addClass('julia-fullscreen');

                    // Turn off landscape on mobile
                    if(_support.isMobile())
                    {
                        screen.orientation.unlock();
                        screen.msLockOrientation.unlock();
                        screen.mozLockOrientation.unlock();
                    }

                    _debug({
                        'fullscreen off' : '#julia-player-'+self.env.apiId
                    });

                    _support.resize();

                }else{

                    $('.julia-player')
                    .removeClass('julia-fullscreen-off')
                    .addClass('julia-fullscreen-on')
                    .find('button.julia-fullscreen-toggle')
                    .removeClass('on').addClass('off')
                    .find('i')
                    .removeClass('julia-fullscreen')
                    .addClass('julia-fullscreen-exit');

                    // Force landscape in fullscreen mode on mobile
                    if(_support.isMobile())
                    {
                        screen.orientation.lock('landscape-primary');
                        screen.msLockOrientation.lock('landscape-primary');
                        screen.mozLockOrientation.lock('landscape-primary');
                    }

                    _debug({
                        'fullscreen on' : '#julia-player-'+self.env.apiId
                    });
                }
            });
        },


        // Native video api
        nativeEvents: function()
        {
            if(_support.forceReady()===true && self.env.isHls === true)
            {
                _events.canplaythrough();
            }else{
                self.env.api.oncanplaythrough = function(e)
                {
                    self.env.duration = self.env.api.duration;

                    if(self.env.started === false && self.env.api.readyState >= 3)
                    {
                        _events.playAllowStart(e);
                    }
                }
            }

            // Video playback detect
            self.env.api.onplay = function(e)
            {
                self.env.toolbar
                .find('.julia-playback.play')
                .removeClass('play')
                .addClass('pause')
                .find('i')
                .removeClass('julia-play')
                .addClass('julia-pause');
                self.env.shield.find('.julia-big-play').hide();
                self.env.shield.find('.julia-preloader').removeClass('on');
                _ui.posterUnset();
                self.env.toolbar.show();
            }

            self.env.api.onplaying = function(e)
            {
                self.env.toolbar
                .find('.julia-playback.play')
                .removeClass('play')
                .addClass('pause')
                .find('i')
                .removeClass('julia-play')
                .addClass('julia-pause');
                self.env.shield.find('.julia-big-play').hide();
                self.env.shield.find('.julia-preloader').removeClass('on');
                self.env.suggest.html('').removeClass('on');
                self.env.toolbar.show();
                _control.press('setDuration', {
                    'duration': _timecode.toHuman( self.env.duration )
                });
                self.env.started = true;
            }


            // Video pause
            self.env.api.onpause = function(e)
            {
                self.env.toolbar
                .find('.julia-playback.pause')
                .removeClass('pause')
                .addClass('play')
                .find('i')
                .removeClass('julia-pause')
                .addClass('julia-play');
                self.env.shield.find('.julia-big-play').show();
            }


            // Errors
            self.env.api.onerror = function(e)
            {
                // Bring to life again
                if(self.env.tries<11)
                {
                    _boot.init();
                }
            }

            self.env.api.onemptied = function(e)
            {
            }

            self.env.api.onstalled = function(e)
            {
            }

            self.env.api.onsuspend = function(e)
            {
            }

            // Video position
            self.env.api.ontimeupdate = function(e)
            {
                if(self.env.seeking === false)
                {
                    currentTimeReadable = _timecode.toHuman( self.env.api.currentTime.toFixed(2) );
                    self.env.toolbar.find('.julia-progress>input').val( _timecode.toPercents( self.env.api.currentTime.toFixed(2) ) ).rangeslider('update', true);
                    self.env.toolbar.find('.julia-panel.julia-currentTime>span').text(currentTimeReadable);
                }

                _events.onTime(currentTimeReadable, self.env.api.currentTime);

                if(self.options.debugPlayback === true)
                {
                    _debug({
                        'duration/current': self.env.duration+'/'+self.env.api.currentTime.toFixed(2)+' > '+currentTimeReadable
                    });
                }

                /*
                // Fix for corrupted video end
                // For development purposes only
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
            self.env.api.seeked = function(e)
            {
                self.env.seeking = false;
            }

            // Video position
            self.env.api.seeking = function(e)
            {
                self.env.seeking = true;
            }

            // Volume
            self.env.api.onvolumechange = function(e)
            {
                if(self.env.api.muted === false)
                {
                    self.env.toolbar.find('.julia-volume>input').val(self.env.api.volume*100).rangeslider('update', true);
                }else{
                    self.env.toolbar.find('.julia-volume>input').val(0).rangeslider('update', true);
                }
            }

            // Set video duration
            self.env.api.ondurationchange = function(e)
            {
                self.env.duration = self.env.api.duration;

                if(self.env.started === false)
                {
                    self.env.duration = self.env.api.duration;
                    self.env.seeking = false;

                    _debug({
                        'duration': self.env.duration,
                        'readyState': self.env.api.readyState,
                        'started': self.env.started
                    });
                }
            }

            // Bind playback end event
            self.env.api.onended = function(e)
            {
                _suggest.run();
            };
        },


        // Specific events, error handlers
        hlsLibEvents: function()
        {
            self.env.hls.on(Hls.Events.ERROR, function(event, data)
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

                        _debug({
                            recoveringError: data.details,
                            errorType: data.type,
                            errorFatal: data.fatal,
                            data: data,
                            tries: self.env.tries
                        });

                        if(data.fatal === true && self.env.tries<11)
                        {
                            // Bring to life again
                            _boot.load();
                        }

                    break; default:
                }
            });
        },


        // Time update event callbacks
        onTime: function(time, timeNum)
        {
            if( (time in self.options.onTime) && self.env.onTimeRised.indexOf(time) == -1 )
            {
                handle = self.options.onTime[time];
                self.env.onTimeRised.push(time);

                if(typeof window[handle] === 'function')
                {
                    window[handle](time, self.env.publicApi);
                    _debug({
                        'onTime': handle+' raised'
                    });

                }else{

                    _debug({
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
            self.env.element = self.options.element;

            // Degbug header
            if(self.options.debug === true && window.console )
            {
                console.info('=== Julia console debug start for '+self.env.apiId+' ===');
            }

            _debug(self.options);

            // Suggest init
            for(i in self.options.suggest)
            {
                self.options.suggest[i].played = false;
            }

            // Set theme CSS
            _support.theme();

            // User data
            volume = _client.get('volume');
            muted = _client.get('muted');

            if(volume.length>0)
            {
                self.options.volume = parseInt(volume);
            }

            if(muted.length>0)
            {
                self.options.muted = muted == 'false' ?  false: true;
            }

            // Create UI
            _ui.player();
        },

        // Select playback url
        selectSource: function()
        {
            self.env.element.prop('preload', 'none');
            protoSource = self.env.element.prop('src') ? self.env.element.prop('src'): self.env.element.find('source').prop('src');
            self.env.source = self.options.source && self.options.source.length>0 ? self.options.source: protoSource;

            self.env.isHls = self.env.source.indexOf('m3u8') == -1 ? false: true;
            if(self.options.forceHls === true)
            {
                self.env.isHls = true;
            }

            _debug({
                'sourceType': (self.env.isHls === false ? 'file': 'hls')
            });

            self.env.poster = self.options.poster && self.options.poster.length>0 ? self.options.poster: self.env.element.prop('poster');
            _ui.posterSet();
        },


        // load media
        load: function()
        {
            self.env.shield.find('.julia-preloader').addClass('on');

            // ************************
            // HLS library supported
            // and HLS requested
            // ************************
            if(self.env.useHlsLib === true)
            {
                _events.hlsLibEvents();
                self.env.hls.autoLevelCapping = -1;
                self.env.hls.attachMedia(self.env.api);
                self.env.hls.loadSource(self.env.source);

                // API READY
                self.env.hls.on(Hls.Events.MEDIA_ATTACHED, function(event, data)
                {

                    // DETECT LEVEL DATA
                    self.env.hls.on(Hls.Events.LEVEL_LOADED, function(event, data)
                    {
                        // SET LIVE EVENT STATE
                        if(data.details.live === true || self.options.live === true)
                        {
                            self.env.isLive = true;
                            self.env.toolbar.addClass('live');
                        }else{
                            self.env.toolbar.removeClass('live');
                        }
                    });

                    for(x in self.options.triggerHls)
                    {
                        handle = self.options.triggerHls[x];

                        if(typeof window[handle] === 'function')
                        {
                            self.env.hls.on(Hls.Events[x], function(event, data)
                            {
                                window[handle](self.env.apiId, event, data);
                            });

                        }else{

                            _debug({
                                'triggerHlsError': handle+' is not a function'
                            });
                        }
                    }

                });

            // ************************
            // Classic VOD file
            // ************************
            }else{

                self.env.api.load();
            }

            // ************************
            // Bind all events
            // ************************
            if(self.env.apiOk === true)
            {
                _events.DOM();
                // Classic html5 api
                _events.nativeEvents();
            }

            stats = {
                'isHls': self.env.isHls,
                'useHlsLib': self.env.useHlsLib,
                'live': self.env.isLive,
                'canPlayMediaString': self.env.canPlayMediaString,
                'canPlayMedia': self.env.canPlayMedia,
            };

            _debug(stats);

            // Define publicApi
            self.env.publicApi = {
                control: _control,
                options: self.options,
                support: _support,
                dimensions: self.env.dimensions,
                timecode: _timecode,
                shield: self.env.shield,
                toolbar: self.env.toolbar,
                media: self.env.api,
                id: self.env.apiId,
                stats: stats
            };
        },

        // Initilize player
        init: function()
        {
            // Create source
            _boot.selectSource();
            self.env.useHlsLib = false;
            self.env.isLive = false;
            self.env.canPlayMedia = _support.canPlayMedia();
            self.env.tries+=1;

            if(self.env.isHls === true)
            {
                self.env.useHlsLib = self.env.canPlayMedia === false && Hls.isSupported() ? true: false;
            }

            // ************************
            // HLS library supported
            // and HLS requested
            // ************************
            if(self.env.useHlsLib === true)
            {
                _api.create();
                self.env.hls = new Hls(self.options.hlsConfig);

            // ************************
            // Classic VOD file
            // ************************
            }else{

                _api.create();
                self.env.api.src = self.env.source;
            }

            if(self.options.live === true)
            {
                self.env.isLive = true;
                self.env.toolbar.addClass('live');
            }else{
                self.env.toolbar.removeClass('live');
            }
        }
    };







    // Build player object
    _boot.create();

    // Bring to life
    _boot.init();

    // Bring api
    _boot.load();

    // Player dimensions
    _support.resize();

    // Populate public API
    return self.env.publicApi;
};
