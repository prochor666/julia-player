/* *****************************************
* JuliaPlayer HTML5 media player
*
* @author prochor666@gmail.com
* @version: 1.1.0
* @build: 2016-12-16
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


    // Root path workaround
    var __JULIA_ROOT_PATH__ = 'julia';
    dir = $('script[src*="julia-player"], script[src*="julia-base"]').attr('src');
    name = dir.split('/').pop();
    __JULIA_ROOT_PATH__ = dir.replace('/js/'+name,"");

    // DEV wrokaround
    __JULIA_ROOT_PATH__ = __JULIA_ROOT_PATH__.replace('src', 'dist');

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
        themePath: __JULIA_ROOT_PATH__+'/css/themes',
        pluginPath: __JULIA_ROOT_PATH__+'/js/lib',
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
        version: '1.1.0'
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


    // Embed CSS
    origin.Require.css([
        __JULIA_ROOT_PATH__+'/css/julia-player.min.css',
        origin.options.themePath+'/'+origin.options.theme+'/julia.css'
    ]);


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
