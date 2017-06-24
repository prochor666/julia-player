/* *****************************************
* JuliaPlayer HTML5 media player
*
* @author prochor666@gmail.com
* @version: 1.1.2
* @build: 2017-06-24
* @license: MIT
*
* @requires:
* jquery [required]
* hls.js [optional]
* dash.js [optional]
****************************************** */
var JuliaPlayer = function(options)
{
    var origin = this;

    // Import options
    options = typeof options === 'undefined' ? {}: options;

    // Unique instance ID
    var __JULIA_INSTANCE__ID__ = Math.floor((Math.random()*10000000)+1);

    // Default origin.options
    origin.options = {
        source: false,
        sources: {},
        autoplay: false,
        volume: 25,
        element: $('video'),
        muted: false,
        width: 512,
        height: 288,
        debug: false,
        debugPlayback: false,
        force: false,
        live: false,
        thumbs: false,
        responsive: true,
        pauseOnBlur: false,
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
            debug: false
        },
        dashConfig: {
        },
        suggest: [],
        suggestLimit: 4,
        suggestTimeout: 10000,
        require: [],
        theme: 'default',
        i18n: {
            liveText: 'Live'
        },
        onTime: {},
        triggerHls: {},
        triggerDash: {},
        onPlay: false,
        onPause: false,
        onStop: false,
        onPosition: false,
        onSuggest: false,
    };


    // Environment
    origin.env = {
        element: origin.options.element,
        instance: {},
        fullscreenFrame: false,
        ID: __JULIA_INSTANCE__ID__,
        api: {},
        model: {
            container: '',
            shield: '',
            toolbar: '',
            poster: '',
            suggest: '',
            preloader: '',
            buttons: {
                bigPlay: '',
                play: '',
                sound: '',
                fullscreen: '',
            },
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
            labels: {
                goto: ''
            },
            menus: {
            }
        },
        isLive: false,
        hls: false,
        dash: false,
        canPlayMedia: '',
        canPlayMediaString: '',
        isHls: false,
        isDash: false,
        useHlsLib: false,
        source: '',
        duration: 0,
        apiOk: false,
        thumbsOk: true,
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
        version: '1.1.2',
        memory: {},
    };


    // Base functions
    origin.Base = {};




    // Console debug
    origin.Base.debug = function(data)
    {
        if(origin.options.debug === true)
        {
            if(window.console)
            {
                for(d in data)
                {
                    console.log(' - [instance: '+origin.env.ID+'] '+d+' ['+(typeof data[d])+']', data[d]);
                }
            }
        }
    };




    // Console stat
    origin.Base.stats = function()
    {
        return {
            'isDash': origin.env.isDash,
            'isHls': origin.env.isHls,
            'useHlsLib': origin.env.useHlsLib,
            'live': origin.env.isLive,
            'canPlayMediaString': origin.env.canPlayMediaString,
            'canPlayMedia': origin.env.canPlayMedia,
        };
    };


    // Extend default origin.options with external options
    if( typeof options.dimensions !== 'undefined' )
    {
        origin.options.dimensions = options.dimensions;
    }
    $.extend(true, origin.options, options);

    // Debug start
    if(origin.options.debug === true && window.console )
    {
        console.info('=== Julia console debug start, instance '+origin.env.ID+' ===');
    }



    origin.Ui =             new origin._Ui(origin);
    origin.Api =            new origin._Api(origin);
    origin.Support =        new origin._Support(origin);
    origin.Controls =       new origin._Controls(origin);
    origin.Timecode =       new origin._Timecode(origin);
    origin.Events =         new origin._Events(origin);
    origin.Persist =        new origin._Persist(origin);
    origin.Fullscreen =     new origin._Fullscreen(origin);
    origin.Callback =       new origin._Callback(origin);
    origin.Suggest =        new origin._Suggest(origin);
    origin.Inject =         new origin._Inject(origin);
    origin.Require =        new origin._Require(origin);
    origin.Boot =           new origin._Boot(origin);
    origin.Loader =         new origin._Loader(origin);



    // Require scripts
    origin.Require.js(origin.options.require);


    $('body').on('julia.plugins-loaded julia.no-plugins', '#julia-player-'+origin.env.ID, function(e)
    {
        if(e.namespace == 'plugins-loaded')
        {
            origin.Base.debug({
                'Required plugins loaded': [e.type, e.namespace]
            });

        }else{
            origin.Base.debug({
                'No plugins required': [e.type, e.namespace]
            });
        }

        origin.Ui.state(origin.env.model.preloader, 'on', '');
        origin.env.model.buttons.bigPlay.show();

        // Autostart playback, if possible
        if(origin.options.autoplay === true && origin.Support.isMobile() === false)
        {
            origin.env.model.buttons.bigPlay.click();
        }
    });


    $('body').on('julia.ui-ready', '#julia-player-'+origin.env.ID, function(e)
    {
        origin.env.model.sliders.progress = new origin._Slider( origin, {
            element: $('#julia-toolbar-'+origin.env.ID+'>div.julia-progress>input.julia-range'),
            eventRise: 'progress-change'
        });
        origin.env.model.sliders.progress.init();

        origin.env.model.sliders.volume = new origin._Slider( origin, {
            element: $('#julia-toolbar-'+origin.env.ID+'>div.julia-volume>input.julia-range'),
            eventRise: 'volume-change'
        });
        origin.env.model.sliders.volume.init();

        // Size Fix
        origin.Support.resize();

        // Handle events
        origin.Events.ui();
        origin.Events.native();

        // Persistent data
        volume = origin.Persist.get('julia-player-volume');
        muted = origin.Persist.get('julia-player-muted');

        if(typeof volume !== 'undefined' && volume.length>0)
        {
            origin.options.volume = parseInt(volume);

            if(origin.options.volume > 100 || origin.options.volume < 0)
            {
                origin.options.volume = 25;
            }
        }

        if(typeof muted !=='undefined' && muted.length>0)
        {
            origin.options.muted = muted == 'false' ?  false: true;
        }

    });


    // Run player init
    origin.Boot.run();


    // Define publicApi
    origin.env.publicApi = {
        options: origin.options,
        shield: origin.env.model.shield,
        toolbar: origin.env.model.toolbar,
        api: origin.env.api,
        ID: origin.env.ID,
        dimensions: origin.env.dimensions,
        Controls: origin.Controls,
        Extend: origin.Base.extend,
        Support: origin.Support,
        Timecode: origin.Timecode,
        Require: origin.Require,
        Inject: origin.Inject,
        stats: origin.Base.stats
    };


    return origin.env.publicApi;
};




var JuliaPlayerVirtual = function(options)
{
    options = typeof options === 'undefined' ? {}: options;

    // Default origin.options
    var _options = {
        sources: {},
        root: $('body'),
    };

    var __VIRTUAL_ID__ = Math.floor((Math.random()*10000000)+1);

    // Extend default origin.options with external options
    $.extend(true, _options, options);





    var isDOMElement = function( obj )
    {
        var _checkInstance = function(elem)
        {
            if( ( elem instanceof jQuery && elem.length ) || elem instanceof HTMLElement )
            {
                return true;
            }

            return false;
        }

        if( obj instanceof HTMLCollection && obj.length )
        {
                for( var a = 0, len = obj.length; a < len; a++ )
                {

                if( !_checkInstance( obj[a] ) )
                {
                    return false;
                }
            }

            return true;

        } else {

            return _checkInstance( obj );
        }
    };




    var normalize = function( item )
    {
        var norm = $('<video />');

        if( typeof item === 'string' )
        {
            norm.attr( 'src', item );
        }

        if( ( typeof item === 'object' && !isDOMElement( item ) ) )
        {
            if( item.hasOwnProperty('src')  )
            {
                norm.attr( 'src', item.src );

            }

            if( item.hasOwnProperty('poster')  )
            {
                norm.attr( 'poster', item.poster );
            }
        }

        norm.css({
            'display': 'none'
        });

        return norm;
    };



    _collection = $('<div class="---julia-virtual-media-gallery-'+__VIRTUAL_ID__+'--- julia-virtual-gallery" style="display: none;" />');


    for( index in _options.sources )
    {
        _item = normalize( _options.sources[index] );
        _collection.append( _item );
    }

    _options.root.append( _collection );
    result = _collection.find('video').juliaPlayer( _options );

    return result;
};

/* *****************************************
* JuliaPlayer HTML5 media player
* Media element API
* For now, only video is supported
****************************************** */
JuliaPlayer.prototype._Api = function(origin)
{
    var self = this;


    self.shadowApi = false;

    self.canvas = false;
    self.context = false;
    self.imageThumb = false;
    self.dash = false;
    self.hls = false;
    self.imageCache = {};

    self.create = function()
    {
        $('#julia-api-'+origin.env.ID).remove();

        apiElement = $('<video class="julia-video" id="julia-api-'+origin.env.ID+'" preload="auto" webkit-playsinline="true" playsinline="true"></video>');

        origin.env.instance.prepend(apiElement);

        origin.env.api = document.getElementById('julia-api-'+origin.env.ID);
        origin.env.api.controls = false;
        origin.env.apiOk = true;

        if( typeof makeVideoPlayableInline === 'function' )
        {
            makeVideoPlayableInline(origin.env.api);
        }

        origin.Base.debug({
            'apiId': origin.env.ID,
            'api': origin.env.api,
        });
    };




    self.source = function()
    {
        protoSource = origin.env.element.prop('src') ? origin.env.element.prop('src'): origin.env.element.find('source').prop('src');
        origin.env.source = origin.options.source && origin.options.source.length>0 ? origin.options.source: protoSource;

        origin.env.isHls = origin.env.source.indexOf('.m3u8') == -1 ? false: true;
        if(origin.options.force === 'hls')
        {
            origin.env.isHls = true;
        }

        origin.env.isDash = origin.env.source.indexOf('.mpd') || origin.env.source.indexOf('.ism') == -1 ? false: true;
        if(origin.options.force === 'dash')
        {
            origin.env.isDash = true;
        }

        origin.Base.debug({
            'Api source isHls': origin.env.isHls,
            'Api source isDash': origin.env.isDash,
            'Source': origin.env.source
        });

        // Poster image
        origin.env.model.poster = origin.options.poster && origin.options.poster.length>0 ? origin.options.poster: origin.env.element.prop('poster');
        origin.Ui.posterSet();
    };




    // First play with some handlers
    self.allowStart = function(e)
    {
        // Init actions
        origin.Controls.press('setDuration', {
            'duration': origin.Timecode.toHuman( origin.env.duration )
        });

        // Set mute if needed
        if(origin.options.muted === true)
        {
            origin.Controls.press('sound-off');
        }else{
            origin.Controls.press('sound-on');

            // Set initial volume
            origin.Controls.press('volume', {
                'volume': origin.options.volume
            });
        }

        origin.Base.debug({
            'eventType': e.type,
            'duration': origin.env.api.duration,
            'readyState': origin.env.api.readyState
        });
    };




    // Bind can play by ready state / fake readyState
    // Because of Firefox cannot bind canplaythrough event with HLS.js properly
    self.canplaythrough = function()
    {
        if(origin.env.started === false)
        {
            // don't let mobile Firefox make decision about readyState, mobile Firefox lie!
            if(origin.env.api.readyState>=3 || (origin.Support.isMobile() === true && origin.env.api.readyState>=2) )
            {
                self.allowStart({
                    type: 'origin.Events.canplaythrough'
                });

            }else{
                setTimeout( function()
                {
                    self.canplaythrough();
                }, 100);
            }
        }
    };




    // Create shadow api and grab thumbnail
    self.dim = function( i )
    {
        var dim = [origin.env.instance.width(), origin.env.instance.height()];
        var a = dim[1] / dim[0];
        var dimensions = [128,(128*a)];

        return dimensions;
    };




    // Create 100 thumbs
    self.thumb = function(t)
    {
        var dimensions = self.dim( i );

        var width = Math.floor(dimensions[0]);
        var height = Math.floor(dimensions[1]);

        if( self.shadowApi === false )
        {
            self.imageCache = {};

            origin.env.model.labels.goto.css({
                width: (dimensions[0]+10)+'px',
                height: (40 + dimensions[1] + 10)+'px',
                overflow: 'hidden'
            });

            self.canvas = document.createElement('canvas');
            self.canvas.width = width;
            self.canvas.height = height;
            self.context = self.canvas.getContext('2d');

            self.imageThumb = document.createElement('img');
            self.imageThumb.style.width = width+'px';
            self.imageThumb.style.height = height+'px';

            origin.env.model.labels.goto.find('img').remove();
            origin.env.model.labels.goto.append(self.imageThumb);

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
            if(origin.env.useHlsLib === true)
            {
                self.hls = new Hls(origin.options.hlsConfig);

            // ************************
            // Dash
            // ************************
            }else if(origin.env.isDash === true){

            }else{

                self.shadowApi.src = origin.env.source;
            }

            // ************************
            // HLS library supported
            // and HLS requested
            // ************************
            if(origin.env.useHlsLib === true)
            {
                self.hls.autoLevelCapping = -1;
                self.hls.attachMedia(self.shadowApi);
                self.hls.loadSource(origin.env.source);


            // ************************
            // Usig DASH library
            // ************************
            }else if(origin.env.isDash === true)
            {
                self.dash = dashjs.MediaPlayer().create();

                self.dash.initialize();
                self.dash.attachView(self.shadowApi);
                self.dash.attachSource(origin.env.source);
                self.dash.setAutoPlay(false);
                self.dash.getDebug().setLogToBrowserConsole(false);

            // ************************
            // Classic VOD file
            // ************************
            }else{

                self.shadowApi.load();
            }
        }

        origin.env.thumbsOk = false;

        index = Math.floor(t);

        if( index in self.imageCache )
        {
            self.image(width, height, index);
        }else{
            self.shadowApi.currentTime = index;
            self.image(width, height, index);
        }
    };





    self.image = function(width, height, index)
    {
        if( index in self.imageCache )
        {
            self.imageThumb.src = self.imageCache[index];
            origin.env.thumbsOk = true;

        }else if( parseInt(self.shadowApi.readyState) == 4 )
        {
            self.context.drawImage(self.shadowApi, 0, 0, width, height);

            dataURL = self.canvas.toDataURL();

            if( dataURL != null && dataURL != undefined )
            {
                self.cache(index, dataURL);
                self.imageThumb.src = dataURL;
            }

            origin.env.thumbsOk = true;

        }else{

            setTimeout( function()
            {
                self.image(width, height, index);
            }, 70);
        }
    };




    self.cache = function(index, data)
    {
        if( index in self.imageCache )
        {
            return self.imageCache[index];
        }else{
            self.imageCache[index] = data;
        }

        return data;
    };
};

/* *****************************************
* JuliaPlayer HTML5 media player
* User interface
* complete DOM model
****************************************** */
JuliaPlayer.prototype._Ui = function(origin)
{
    var self = this;

    self.create = function()
    {
        if(origin.env.instance.length>0)
        {
            origin.env.instance.remove();
            origin.env.instance = {};
        };

        // Main container
        origin.env.instance = $('<div class="julia-player julia-fullscreen-off julia-theme-'+origin.options.theme+'" id="julia-player-'+origin.env.ID+'">'
                    +'</div>');

        // Containers
        origin.env.model.shield = $('<div class="julia-shield" id="julia-shield-'+origin.env.ID+'"></div>');

        origin.env.model.preloader = $('<div class="julia-preloader">'
            +'<div class="julia-preloader-run"></div></div>');

        origin.env.model.suggest = $('<div class="julia-suggest" id="julia-suggest-'+origin.env.ID+'"></div>');

        origin.env.model.toolbar = $('<div class="julia-toolbar" id="julia-toolbar-'+origin.env.ID+'"></div>');

        // Buttons
        origin.env.model.buttons.bigPlay = $('<button class="julia-btn julia-big-play"><i class="julia-icon julia-play-circle"></i></button>');

        origin.env.model.buttons.play = $('<button class="julia-btn julia-playback play">'
        +'    <i class="julia-icon julia-play"></i>'
        +'</button>');

        origin.env.model.buttons.sound = $('<button class="julia-btn julia-sound on">'
        +'    <i class="julia-icon julia-sound-on"></i>'
        +'</button>');

        origin.env.model.buttons.fullscreen = $('<button class="julia-btn julia-fullscreen-toggle on">'
        +'    <i class="julia-icon julia-fullscreen"></i>'
        +'</button>');

        // Range bars
        origin.env.model.ranges.volume = $('<div class="julia-volume">'
        +'  <input type="range" value="'+origin.options.volume+'" min="0" max="100" step="1" class="julia-range">'
        +'</div>');

        origin.env.model.ranges.progress = $('<div class="julia-progress">'
        +'  <input type="range" value="0" min="0" max="100" step="'+origin.env.progressStep+'" class="julia-range">'
        +'</div>');

        // Passive info panels
        origin.env.model.panels.live = $('<div class="julia-panel julia-live-indicator">'
        +'    <span>'+origin.options.i18n.liveText+'</span>'
        +'</div>');

        origin.env.model.panels.currentTime = $('<div class="julia-panel julia-currentTime">'
        +'    <span>00:00:00</span>&nbsp;/&nbsp;'
        +'</div>');

        origin.env.model.panels.duration = $('<div class="julia-panel julia-duration">'
        +'    <span>00:00:00</span>'
        +'</div>');

        // Labels
        origin.env.model.labels.goto = $('<div class="julia-label julia-label-goto">'
        +'    <span>00:00:00</span>'
        +'</div>');


        // Compose player object
        origin.env.model.shield
        .append([
            origin.env.model.preloader,
            origin.env.model.buttons.bigPlay
        ]);

        if( origin.Support.iOS() === true )
        {
            origin.env.model.toolbar
            .append([
                origin.env.model.ranges.progress,
                origin.env.model.panels.live,
                origin.env.model.panels.currentTime,
                origin.env.model.panels.duration,
                origin.env.model.buttons.play,
                origin.env.model.buttons.fullscreen,
                origin.env.model.labels.goto,
            ]);
        }else{
            origin.env.model.toolbar
            .append([
                origin.env.model.ranges.progress,
                origin.env.model.panels.live,
                origin.env.model.panels.currentTime,
                origin.env.model.panels.duration,
                origin.env.model.buttons.play,
                origin.env.model.buttons.sound,
                origin.env.model.ranges.volume,
                origin.env.model.buttons.fullscreen,
                origin.env.model.labels.goto,
            ]);
        }

        //--odn-handle-start--
        origin.env.instance
        .append([
            origin.env.model.shield,
            origin.env.model.suggest,
            origin.env.model.toolbar
        ]);

        // Player default states
        origin.env.element.hide();
        origin.env.model.toolbar.hide();
        origin.env.model.buttons.bigPlay.hide();
        origin.Ui.state(origin.env.model.preloader, '', 'on');
        origin.env.instance.insertAfter(origin.env.element);

        origin.env.fullscreenFrame = document.querySelector('#julia-player-'+origin.env.ID);

        self.raiseEvent('julia.ui-ready');

        origin.Base.debug({
            'playerInstance': origin.env.instance,
        });
        //--odn-handle-stop--
    };




    self.raiseEvent = function(eventName)
    {
        setTimeout( function()
        {
            if($('#julia-player-'+origin.env.ID).length == 1)
            {
                $('#julia-player-'+origin.env.ID).trigger({
                    type: eventName,
                });
            }else{
                self.raiseEvent(eventName);
            }
        }, 10);
    };




    self.icon = function(element, remove, add)
    {
        element.find('i')
        .removeClass(remove)
        .addClass(add);
    };




    self.state = function(element, remove, add)
    {
        element.removeClass(remove)
        .addClass(add);
    };




    self.panel = function(element, value)
    {
        element.find('span').text(value);
    };




    self.posterSet = function()
    {
        self.posterUnset();

        if(origin.env.model.poster.length > 0)
        {
            img = $('<img src="'+origin.env.model.poster+'" width="100%" height="100%">')
            origin.env.model.shield.append(img);

            origin.Base.debug({
                poster: origin.env.model.poster,
            })
        }
    };




    self.posterUnset = function()
    {
        origin.env.model.shield.find('img').remove();
    };

};

/* *****************************************
* JuliaPlayer HTML5 media player
* Slider controller
* Progress and volume widget library
****************************************** */
JuliaPlayer.prototype._Slider = function(origin, options)
{
    var self = this,

        leftButtonDown = false,

        ua = navigator.userAgent,

        isChrome = /chrome/i.exec(ua),

        isAndroid = /android/i.exec(ua),

        hasTouch = 'ontouchstart' in window && !(isChrome && !isAndroid),

        _normalize = function(percent)
        {
            if( percent > 100 ){ return 100; }
            if( percent < 0 ){ return 0; }
            return ( Math.round(percent*100) ) / 100;
        },

        _posToPercent = function(pos)
        {
            return _normalize( pos / (self.track.innerWidth()/100) );
        },

        _position = function(e)
        {
            var pos = hasTouch === true ? e.originalEvent.touches[0].pageX - self.model.offset().left : e.originalEvent.pageX - self.model.offset().left;
            percent = _posToPercent( pos );
            return percent;
        },

        _pixels = function(e)
        {
            var pos = hasTouch === true ? e.originalEvent.touches[0].pageX - self.model.offset().left : e.originalEvent.pageX - self.model.offset().left;
            return pos;
        },

        model = $('<div class="julia-slider">'
            +'<div class="julia-slider-track" data-julia-slider-component="track"></div>'
            +'<div class="julia-slider-handle" data-julia-slider-component="handle"></div>'
            +'<div class="julia-slider-fill" data-julia-slider-component="fill"></div>'
        +'</div>');

        self.model = model.clone();

        self.track = self.model.find('[data-julia-slider-component="track"]');

        self.handle = self.model.find('[data-julia-slider-component="handle"]');

        self.fill = self.model.find('[data-julia-slider-component="fill"]');

        self.options = {
            element: {},
            value: 0,
            originVisible: false,
            eventRise: '',
            overcall: function(){
                return;
            }
        };

    // Extend custom options
    $.extend(true, self.options, options);

    self.elem = typeof self.options.element === 'object' ? self.options.element: $(self.options.element.toString()),

    self.value = self.options.value;




    // Public methods & props
    self.init = function()
    {
        if( ['input'].lastIndexOf( self.elem.prop('tagName').toLowerCase() ) > -1 )
        {
            self.value = _normalize( self.elem.val() );
        }

        if( self.options.originVisible === false )
        {
        	self.elem.hide().after( self.model );
        }else{
            self.elem.after( self.model );
        }

        self.slide( self.value, true );
    };




    self.update = function( percent )
    {
        if( leftButtonDown === false )
        {
            self.slide( percent, true );
        }
    };




    self.slide = function( percent, eventPrevent )
    {
        if( typeof eventPrevent === 'undefined' )
        {
            eventPrevent = false;
        }

        self.value = _normalize( percent ) ;
        var pos = ( self.track.innerWidth() / 100 ) * self.value;
        self.handle.css({'left': pos+'px'});
        self.fill.css({'width': pos+2+'px'});

        self.respond( percent, eventPrevent );
    };




    self.respond = function( percent, eventPrevent )
    {
        if( typeof eventPrevent === 'undefined' )
        {
            eventPrevent = false;
        }

        if( ['input'].lastIndexOf( self.elem.prop('tagName').toLowerCase() ) > -1 )
        {
        	self.elem.val( self.value );

            if( eventPrevent === false )
            {
                $('#julia-player-'+origin.env.ID).trigger({
                    type: 'julia.'+self.options.eventRise,
                    percent: percent
                });
            }
        }

        // Fix final handle position on track
        self.track.innerWidth( self.model.innerWidth() - self.handle.innerWidth() );
    }




    self.getValue = function()
    {
    	return self.value;
    };




    self.sliding = function()
    {
    	return leftButtonDown;
    };


    // Mouse & touch events
    self.fill.on('click ', function(e)
    {
        self.slide( _position(e), false );
    });




    self.track.on('click', function(e)
    {
        self.slide( _position(e), false );
    });




    self.model.on('click mouseover mousemove mouseout', function(e)
    {
        if(e.type == 'click')
        {
            self.slide( _position(e), false );
        }

        if( ( e.type == 'mouseover' || e.type == 'mousemove' ) && self.options.eventRise == 'progress-change' )
        {
            pos = _position(e);
            pix = _pixels(e);

            if( origin.env.thumbsOk === true && origin.Support.isMobile() === false && origin.options.live === false && origin.options.thumbs === true )
            {
                origin.Api.thumb( origin.Timecode.toSeconds( pos ) );
            }
            origin.Ui.state( origin.env.model.labels.goto, '', 'on' );
            origin.Ui.panel( origin.env.model.labels.goto, origin.Timecode.toHuman( origin.Timecode.toSeconds( pos ) ) );

            left = pix+'px';
            border = (origin.env.model.labels.goto.innerWidth()/2);

            if( pix < border )
            {
                left = (border) + 'px';
            }

            if( pix > self.model.innerWidth() - border - 10 )
            {
                left = ( self.model.innerWidth() - border ) + 'px';
            }

            origin.env.model.labels.goto.css({
                'left': left,
                'margin-left': -(origin.env.model.labels.goto.innerWidth()/2)+'px'
            });
        }

        if( e.type == 'mouseout' && self.options.eventRise == 'progress-change' )
        {
            origin.Ui.state( origin.env.model.labels.goto, 'on', '' );
        }
    });




    self.model.on('mousedown touchstart', function(e)
    {
        // Left mouse button activate
        if(e.type == 'touchstart')
        {
            self.slide( _position(e), false );
        }

        leftButtonDown = true;
    });




    $(document).on('mouseup touchend', function(e)
    {
        // Left mouse button deactivate
        leftButtonDown = false;
    });




    $(document).on('mousemove touchmove', function(e)
    {
        if(leftButtonDown === true)
        {
            self.slide( _position(e) );
        }
    });

    return self;
};


/* *****************************************
* JuliaPlayer HTML5 media player
* Media element API
* For now, only video is supported
****************************************** */
JuliaPlayer.prototype._Controls = function(origin)
{
    var self = this;




    self.press = function(action, data)
    {
        data = data||{};

        origin.Base.debug({
            'action': action,
            'action-data': data,
        });

        //--odn-handle-start--
        switch(action)
        {
            case 'play':

                if(origin.options.onPlay !== false)
                {
                    origin.Callback.fn(origin.options.onPlay, data);
                }

                origin.env.model.buttons.bigPlay.hide();
                origin.env.api.play();

            break; case 'pause':

                if(origin.options.onPause !== false)
                {
                    origin.Callback.fn(origin.options.onPause, data);
                }

                origin.env.api.pause();

            break; case 'stop':

                if(origin.options.onStop !== false)
                {
                    origin.Callback.fn(origin.options.onStop, data);
                }

                origin.env.api.pause();
                origin.env.api.currentTime = 0;

                origin.Ui.state( origin.env.model.buttons.play, 'pause', 'play' );
                origin.Ui.icon( origin.env.model.buttons.play, 'julia-pause', 'julia-play' );
                origin.env.model.buttons.bigPlay.show();
                origin.env.model.sliders.progress.update( 0 );

            break; case 'goto':

                origin.Ui.state( origin.env.model.preloader, '', 'on' );
                origin.env.api.currentTime = data.currentTime;

                if(origin.options.onPosition !== false)
                {
                    origin.Callback.fn(origin.options.onPosition, data);
                }

            break; case 'setDuration':

                origin.Ui.panel( origin.env.model.panels.duration, data.duration );

                if(origin.env.started === false)
                {
                    origin.env.model.sliders.progress.update( 0 );
                }

                origin.Base.debug({
                    'setDuration': data.duration
                });

            break; case 'volume':

                origin.options.volume = data.volume;
                origin.env.api.volume = data.volume/100;

                origin.Base.debug({
                    'volume is': origin.env.api.volume
                });

                origin.env.model.sliders.volume.update( data.volume );

                if(data.volume>0)
                {
                    origin.Controls.press('sound-on');

                }else{
                    origin.Controls.press('sound-off');
                }

            break; case 'sound-on':

                origin.env.api.muted = false;
                origin.options.muted = false;
                origin.Persist.set('julia-player-volume', origin.options.volume, 999);
                origin.Persist.set('julia-player-muted', origin.options.muted, 999);

                origin.Ui.state( origin.env.model.buttons.sound, 'off', 'on' );
                origin.Ui.icon( origin.env.model.buttons.sound, 'julia-sound-off', 'julia-sound-on' );

            break; case 'sound-off':

                origin.env.api.muted = true;
                origin.options.muted = true;
                origin.Persist.set('julia-player-volume', origin.options.volume, 999);
                origin.Persist.set('julia-player-muted', origin.options.muted, 999);

                origin.Ui.state( origin.env.model.buttons.sound, 'on', 'off' );
                origin.Ui.icon( origin.env.model.buttons.sound, 'julia-sound-on', 'julia-sound-off' );

            break; case 'fullscreen-on':

                origin.Fullscreen.reset(origin.env.instance, origin.env.model, origin.env.api);
                origin.Fullscreen.on(origin.env.fullscreenFrame);

            break; case 'fullscreen-off':

                origin.Fullscreen.reset(origin.env.instance, origin.env.model, origin.env.api);
                origin.Fullscreen.off();

            break; default:

        }
        //--odn-handle-stop--

        return;
    };

};

/* *****************************************
* JuliaPlayer HTML5 media player
* Suppport
* media & DOM sizing utilities
****************************************** */
JuliaPlayer.prototype._Support = function(origin)
{
    var self = this;




    self.aspect = function(w,h)
    {
        return w>0 && h>0 ? h/w: 0;
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




    self.forceReady = function()
    {
        if( /Firefox/i.test(navigator.userAgent) )
        {
            return true;
        }

        return false;
    };




    self.canPlayMedia = function()
    {
        var vid = document.createElement('video');
        vid.id = 'video-cap-test-'+origin.env.ID;
        origin.env.canPlayMediaString = vid.canPlayType('application/vnd.apple.mpegURL');
        $('#video-cap-test'+origin.env.ID).remove();
        return (origin.env.canPlayMediaString == 'probably' || origin.env.canPlayMediaString == 'maybe');
    };




    self.resize = function()
    {
        // Player dimensions
        defaultDim = origin.env.element.width() ? [origin.env.element.width(), origin.env.element.height()]: [origin.options.width, origin.options.height];
        dimensions = origin.options.responsive === true ? self.getSize(): defaultDim;

        origin.Base.debug({
            'resizeDefaults': defaultDim,
            'resize': dimensions
        });

        origin.env.instance.width(dimensions[0]);
        origin.env.instance.height(dimensions[1]);

        origin.env.dimensions.width = dimensions[0];
        origin.env.dimensions.height = dimensions[1];

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
        var a = self.aspect( parseInt( origin.env.element.css('width') ), parseInt( origin.env.element.css('height') ) );

        for( i in origin.options.dimensions )
        {
            var dim = origin.options.dimensions[i];
            if( parentWidth >= dim[0] )
            {
                a = self.aspect( dim[0], dim[1] );
                dimensions = [dim[0],(dim[0]*a)];

                origin.Base.debug({
                    'resizePredefined': dimensions
                });
                return dimensions;
            }
        }

        dimensions = [parentWidth, (parentWidth*a)];

        origin.Base.debug({
            'resizeFallback': dimensions
        });

        return dimensions;
    };
};

/* *****************************************
* JuliaPlayer HTML5 media player
* Suggest
* suggest playlist engine
****************************************** */
JuliaPlayer.prototype._Suggest = function(origin)
{
    var self = this;




    self.run = function()
    {
        origin.env.model.suggest.html('');
        origin.Controls.press('stop');
        origin.env.suggestClicked = false;

        if(origin.options.suggest.length > 0)
        {
            x = 0;
            for(var i in origin.options.suggest)
            {
                if(x < origin.options.suggestLimit && origin.options.suggest[i].played === false)
                {
                    mode = !!origin.options.suggest[i].live && origin.options.suggest[i].live === true ? 'live': 'vod';
                    liveText = !!origin.options.suggest[i].liveText ? origin.options.suggest[i].liveText: 'Live';
                    var poster = !!origin.options.suggest[i].poster ? origin.options.suggest[i].poster: '';
                    posterImage = poster.length>0 ? '<img src="'+poster+'" width="100%" height="100%">': '';
                    suggestItemWidget = $('<div class="julia-suggest-item" data-poster="'+poster+'" data-source="'+origin.options.suggest[i].source+'" data-mode="'+mode+'" data-live-text="'+liveText+'" data-index="'+i+'">'
                            + posterImage
                            +'<div class="julia-suggest-item-title">'+origin.options.suggest[i].title+'</div>'
                        +'</div>');

                        suggestItemWidget.on('click', function(e)
                        {
                            if(origin.options.onSuggest !== false)
                            {
                                origin.Callback.fn(origin.options.onSuggest, origin.options.suggest[i]);
                            }

                            origin.Api.shadowApi = false;

                            origin.options.muted = origin.env.api.muted;

                            origin.options.poster = $(this).data('poster');
                            origin.env.suggestClicked = true;
                            origin.env.model.buttons.bigPlay.hide();
                            origin.env.started = false;
                            origin.options.source = $(this).data('source');
                            origin.Api.source();
                            origin.options.autoplay = true;
                            origin.options.live = $(this).data('mode') == 'live' ? true: false;
                            origin.options.i18n.liveText = $(this).data('live-text');

                            origin.Ui.panel( origin.env.model.panels.live, origin.options.i18n.liveText );

                            origin.Base.debug({
                                suggestRemoveIndex: $(this).data('index'),
                                suggestRemove: $(this).data('source')
                            });

                            origin.options.suggest[$(this).data('index')].played = true;

                            origin.Ui.state(origin.env.model.suggest, 'on', '');

                            origin.env.model.buttons.bigPlay.click();
                        });

                    origin.env.model.suggest.append(suggestItemWidget);
                    x++;
                }
            }

            if(x > 0)
            {
                if(origin.options.suggestTimeout > 0 && origin.Support.isMobile() === false)
                {
                    setTimeout( function()
                    {
                        if(origin.env.suggestClicked === false)
                        {
                            origin.env.model.suggest.find('div.julia-suggest-item:first').click();
                        }
                    }, origin.options.suggestTimeout);
                }
                origin.Ui.state(origin.env.model.suggest, '', 'on');
            }

        }else{
            origin.Fullscreen.off();
        }

        origin.Base.debug({
            'Suggest' : 'raised'
        });
    };
};

/* *****************************************
* JuliaPlayer HTML5 media player
* Fullscreen
* player fullscreen behavior
****************************************** */
JuliaPlayer.prototype._Fullscreen = function(origin)
{
    var self = this;

    self.on = function(fullscreenFrame)
    {
        if( fullscreenFrame.requestFullscreen )
        {
            fullscreenFrame.requestFullscreen();

        }else if( fullscreenFrame.msRequestFullscreen )
        {
            fullscreenFrame.msRequestFullscreen();

        }else if( fullscreenFrame.mozRequestFullScreen )
        {
            fullscreenFrame.mozRequestFullScreen();

        }else if( fullscreenFrame.webkitRequestFullscreen )
        {
            fullscreenFrame.webkitRequestFullscreen();

        }else{

            origin.Base.debug({
                'fullscreen': 'Fullscreen is not supported'
            });
        }
    };




    self.off = function()
    {
        if( document.exitFullscreen )
        {
            document.exitFullscreen();

        }else if( document.msExitFullscreen )
        {
            document.msExitFullscreen();

        }else if( document.mozCancelFullScreen )
        {
            document.mozCancelFullScreen();

        }else if( document.webkitExitFullscreen )
        {
            document.webkitExitFullscreen();
        }
    };




    self.reset = function(instance, model, api)
    {
        $(document).off('webkitfullscreenchange mozfullscreenchange fullscreenchange MSFullscreenChange');

        // Fullscreen change event handler
        $(document).on('webkitfullscreenchange mozfullscreenchange fullscreenchange MSFullscreenChange', function(e)
        {
            if(!document.fullscreenElement && !document.mozFullScreenElement && !document.webkitFullscreenElement && !document.msFullscreenElement)
            {
                origin.Ui.state( instance, 'julia-fullscreen-on', 'julia-fullscreen-off' );
                origin.Ui.state( model.buttons.fullscreen, 'off', 'on' );
                origin.Ui.icon( model.buttons.fullscreen, 'julia-fullscreen-exit', 'julia-fullscreen' );

                // Turn off landscape on mobile
                if(origin.Support.isMobile())
                {
                    screen.orientation.unlock();
                    screen.msLockOrientation.unlock();
                    screen.mozLockOrientation.unlock();
                }

                origin.Base.debug({
                    'fullscreen off' : '#julia-player-'+origin.env.ID
                });

            }else{

                origin.Ui.state( instance, 'julia-fullscreen-off', 'julia-fullscreen-on' );
                origin.Ui.state( model.buttons.fullscreen, 'on', 'off' );
                origin.Ui.icon( model.buttons.fullscreen, 'julia-fullscreen', 'julia-fullscreen-exit' );

                // Force landscape in fullscreen mode on mobile
                if(origin.Support.isMobile())
                {
                    screen.orientation.lock('landscape-primary');
                    screen.msLockOrientation.lock('landscape-primary');
                    screen.mozLockOrientation.lock('landscape-primary');
                }

                origin.Base.debug({
                    'fullscreen on' : '#julia-player-'+origin.env.ID
                });
            }

            origin.Support.resize();

            setTimeout( function()
            {
                w = origin.env.api.getAttribute('width');

                origin.env.instance.find('.julia-progress').width(w);
                origin.env.instance.find('.julia-progress .julia-slider-track').width(w);

                model.sliders.progress.update( origin.Timecode.toPercents( api.currentTime ) );
            }, 5);

        });
    };
};

/* *****************************************
* JuliaPlayer HTML5 media player
* Persistent settings
* options are stored in cookies
****************************************** */
JuliaPlayer.prototype._Persist = function(origin)
{
    var self = this;

    self.set = function(name, value, days)
    {
        dateObj = new Date();
        dateObj.setTime(dateObj.getTime() + (days*24*60*60*1000));
        var expires = 'expires=' + dateObj.toUTCString();
        document.cookie = name + '=' + value + '; ' + expires + '; path=/';
    };




    self.get = function(name)
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

        return undefined;
    };
};

/* *****************************************
* JuliaPlayer HTML5 media player
* Timecode
* utilities for timecode conversion
****************************************** */
JuliaPlayer.prototype._Timecode = function(origin)
{
    var self = this;

    self.toPercents = function(currentTime)
    {
        p = (currentTime/origin.env.duration)*100;
        return p;
    },




    self.toSeconds = function(percent)
    {
        t = (origin.env.duration/100)*percent;
        return t;
    },




    self.toNum = function(human)
    {
        human = human.split(':');
        human.reverse();
        s = parseInt(human[0]);
        m = human.length>1 ? parseInt(human[1]): 0;
        h = human.length>2 ? parseInt(human[3]): 0;
        t = s + m*60 + h*60*60;
        return t;
    },




    self.toHuman = function(time)
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
    };
};

/* *****************************************
* JuliaPlayer HTML5 media player
* Callback
* event callbacks
****************************************** */
JuliaPlayer.prototype._Callback = function(origin)
{
    var self = this;

    self.fn = function(f, data)
    {
        data = data||{};

        if( $.inArray(typeof f, ['string', 'function', 'object']) > -1 )
        {
            // Callback defined as function name or function
            // !!! Remember !!!
            // If you are using typeof string, function must be callable globally (window context)
            if( typeof f === 'string' )
            {
                f = window[f];
            }

            f(origin.options, origin.env, data);

            origin.Base.debug({
                'Callback': typeof f+' raised'
            });

        }else{

            origin.Base.debug({
                'Callback': typeof f+' is not a function, but: '+(typeof f)
            });
        }
    };




    // Time update event callbacks
    self.onTime = function(time, timeNum)
    {
        if( (time in origin.options.onTime) && origin.env.onTimeRised.indexOf(time) == -1 )
        {
            f = origin.options.onTime[time];
            origin.env.onTimeRised.push(time);


            if( $.inArray(typeof f, ['string', 'function', 'object']) > -1 )
            {
                // Callback defined as function name or function
                // !!! Remember !!!
                // If you are using typeof string, function must be callable globally (window context)
                if( typeof f === 'string' )
                {
                    f = window[f];
                }

                f(origin.options, origin.env, time);

                origin.Base.debug({
                    'Callback onTime': time+' '+ typeof f +' raised'
                });

            }else{

                origin.Base.debug({
                    'Callback onTime': time+' '+ typeof f +' is not a function, but: '+(typeof f)
                });
            }
        }
    };
};

/* *****************************************
* JuliaPlayer HTML5 media player
* Inject
* Inject origin code, source change, etc...
****************************************** */
JuliaPlayer.prototype._Inject = function(origin)
{
    var self = this;



    self.swap = function(src1, src2)
    {
        origin.env.memory = {
            currentTime: origin.env.api.currentTime,
            src: src1
        }

        origin.env.api.src = src2;
        origin.env.api.src = currentTime = 0;
        origin.env.api.play();
    }



    self.source = function(options)
    {
        origin.Api.shadowApi = false;

        $('#julia-player-'+origin.env.ID).remove();
        origin.env.started = false;

        $.extend(true, origin.options, options);

        // Run player
        origin.Boot.run();

        if( origin.options.live === true )
        {
            origin.env.isLive = true;
            origin.Ui.panel( origin.env.model.panels.live, origin.options.i18n.liveText );
            origin.Ui.state( origin.env.model.toolbar, '', 'live' );
        }else{
            origin.env.isLive = false;
            origin.Ui.panel( origin.env.model.panels.live, '' );
            origin.Ui.state( origin.env.model.toolbar, 'live', '' );
        }

        origin.Ui.state(origin.env.model.preloader, 'on', '');

        // Autostart playback, if possible
        if(origin.options.autoplay === true && origin.Support.isMobile() === false)
        {
            origin.env.model.buttons.bigPlay.click();
        }else{
            origin.env.model.buttons.bigPlay.show();
        }
    };

};

/* *****************************************
* JuliaPlayer HTML5 media player
* Require
* Require vendor libs
****************************************** */
JuliaPlayer.prototype._Require = function(origin)
{
    var self = this;

    self.js = function(scripts)
    {
        if(typeof scripts === 'string')
        {
            scripts = [scripts];
        }

        if(scripts.length == 0)
        {
            self.raiseEvent("julia.no-plugins");

        }else{

            var last = scripts[scripts.length - 1];
            self.load(scripts, 0, last);
        }
    };




    self.raiseEvent = function(eventName)
    {
        setTimeout( function()
        {
            if($('#julia-player-'+origin.env.ID).length == 1)
            {
                $('#julia-player-'+origin.env.ID).trigger({
                    type: eventName,
                });
            }else{
                self.raiseEvent(eventName);
            }
        }, 20);
    };




    self.load = function(scripts, i, last)
    {
        var script = scripts[i];

        origin.Base.debug({
            'Require-js request': script
        });

        $.getScript(script).done( function()
        {
            origin.Base.debug({
                'Require-js loaded': script
            });

            if( last == script )
            {
                self.raiseEvent("julia.plugins-loaded");

            }else{
                self.load(scripts, i+1, last);
            }
        });
    };




    self.css = function(styles)
    {
        if(typeof styles === 'string')
        {
            styles = [styles];
        }

        for(i in styles)
        {
            $('head').append($('<link rel="stylesheet" type="text/css" href="'+styles[i]+'">'));
        }
    };
};

/* *****************************************
* JuliaPlayer HTML5 media player
* Boot
* player boot process
****************************************** */
JuliaPlayer.prototype._Boot = function(origin)
{
    var self = this;

    self.run = function()
    {
        origin.Base.debug(origin.options);

        //--odn-handle-start--
        // Set active DOM element
        origin.env.element = origin.options.element;

        // Suggest init
        for(i in origin.options.suggest)
        {
            origin.options.suggest[i].played = false;
        }

        if(origin.env.hls !== false)
        {
            origin.env.hls.destroy();
            origin.env.hls = false;
        }

        if(origin.env.dash !== false)
        {
            origin.env.dash.reset();
            origin.env.dash = false;
        }


        // Create UI
        origin.Ui.create();


        // Source select, poster select
        origin.Api.source();


        // Create API
        origin.Api.create();
        //--odn-handle-stop--
    };
};

/* *****************************************
* JuliaPlayer HTML5 media player
* Loader
* player media loader/playback
****************************************** */
JuliaPlayer.prototype._Loader = function(origin)
{
    var self = this;

    self.init = function()
    {
        //--odn-handle-start--
        origin.env.api.src = '';

        origin.env.useHlsLib = false;
        origin.env.isLive = false;
        origin.env.canPlayMedia = origin.Support.canPlayMedia();

        if(origin.env.isHls === true)
        {
            //origin.env.useHlsLib = origin.env.canPlayMedia === false && Hls.isSupported() ? true: false;
            origin.env.useHlsLib = true;
        }

        // ************************
        // HLS library supported
        // and HLS requested
        // ************************
        if(origin.env.useHlsLib === true)
        {
            origin.env.hls = new Hls(origin.options.hlsConfig);

        // ************************
        // Dash
        // ************************
        }else if(origin.env.isDash === true){

            //origin.env.api.src = origin.env.source;
        }else{

            origin.env.api.src = origin.env.source;
        }

        if(origin.options.live === true)
        {
            origin.env.isLive = true;
            origin.Ui.state(origin.env.model.toolbar, '', 'live');
        }else{

            origin.env.isLive = false;
            origin.Ui.state(origin.env.model.toolbar, 'live', '');
        }


        // ************************
        // HLS library supported
        // and HLS requested
        // ************************
        if(origin.env.useHlsLib === true)
        {
            origin.Events.hlsLibEvents();
            origin.env.hls.autoLevelCapping = -1;
            origin.env.hls.attachMedia(origin.env.api);
            origin.env.hls.loadSource(origin.env.source);

            // API READY
            origin.env.hls.on(Hls.Events.MEDIA_ATTACHED, function(event, data)
            {

                // DETECT LEVEL DATA
                origin.env.hls.on(Hls.Events.LEVEL_LOADED, function(event, data)
                {

                });


                for(x in origin.options.triggerHls)
                {
                    handle = origin.options.triggerHls[x];

                    if(typeof window[handle] === 'function')
                    {
                        origin.env.hls.on(Hls.Events[x], function(event, data)
                        {
                            window[handle](origin.env.apiId, event, data);
                        });

                    }else{

                        origin.Base.debug({
                            'triggerHlsError': handle+' is not a function'
                        });
                    }
                }
            });

        // ************************
        // Usig DASH library
        // ************************
        }else if(origin.env.isDash === true)
        {
            origin.env.dash = dashjs.MediaPlayer().create();

            origin.env.dash.initialize();
            origin.env.dash.attachView(origin.env.api);
            origin.env.dash.attachSource(origin.env.source);
            origin.env.dash.setAutoPlay(origin.options.autoplay);

            if(origin.options.debug === false)
            {
                origin.env.dash.getDebug().setLogToBrowserConsole(false);
            }

            origin.Events.dashLibEvents();

        // ************************
        // Classic VOD file
        // ************************
        }else{

            origin.env.api.load();
        }

        //--odn-handle-stop--

        origin.Ui.state(origin.env.model.preloader, '', 'on');

        origin.Api.allowStart({
            type: 'origin.Loader'
        });

        //origin.Controls.press('play');
    };
};

/* *****************************************
* JuliaPlayer HTML5 media player
* jQuery plugin & extension
****************************************** */


// Extension for non DOM context
(function($)
{
    $.extend({
        juliaPlayer: function ( options )
        {
            return new JuliaPlayerVirtual( options );
        }
    });
})($);



// Build jQuery plugin
jQuery.fn.juliaPlayer = function(options)
{
    // API wrappers
    this.play = function()
    {
        $(this).data('juliaplayer').Controls.press('play');
    };

    this.setOptions = function(options)
    {
        $.extend(true, $(this).data('juliaplayer').options, options);
    };

    this.options = function()
    {
        return $(this).data('juliaplayer').options;
    };

    this.source = function(options)
    {
        $(this).data('juliaplayer').Inject.source(options);
    };

    this.api = function()
    {
        return $(this).data('juliaplayer').api;
    };

    this.pause = function()
    {
        $(this).data('juliaplayer').Controls.press('pause');
    };

    this.stop = function()
    {
        $(this).data('juliaplayer').Controls.press('stop');
    };

    this.goto = function(t)
    {
        $(this).data('juliaplayer').Controls.press('goto', {
            currentTime: t
        });
    };

    this.mute = function()
    {
        if($(this).data('juliaplayer').api.muted === false)
        {
            $(this).data('juliaplayer').Controls.press('sound-off');
        }else{
            $(this).data('juliaplayer').Controls.press('sound-on');
        }
    };

    this.volume = function(volume)
    {
        $(this).data('juliaplayer').Controls.press('volume', {
            volume: volume
        });
    };

    this.getID = function()
    {
        return $(this).data('juliaplayer').ID;
    };

    this.stats = function()
    {
        return $(this).data('juliaplayer').stats();
    };

    return this.each( function()
    {
        // Return if this element already has a plugin instance
        if( $(this).data('juliaplayer') )
        {
            return;
        }

        options = typeof options === 'undefined' ? {}: options;
        options.element = $(this);

        // Pass options to constructor
        var julia = new JuliaPlayer(options);

        // Store plugin object in element's data
        $(this).data('juliaplayer', julia);
    });
};
