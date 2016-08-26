/* *****************************************
* Julia HTML5 media player
* Loader
* player media loader/playback
****************************************** */
Julia.prototype._Loader = function(origin)
{
    var self = this;

    self.init = function()
    {
        origin.env.hls = false;
        origin.env.dash = false;
        origin.env.api.src = '';
/*
        if(typeof reloadSource === 'undefined')
        {
            reloadSource = false;
        }


        if(reloadSource === true)
        {
            origin.Controls.press('stop');

            origin.Api.source();

            // Handle events
            origin.Events.ui();
            origin.Events.native();
        }

*/
        origin.env.useHlsLib = false;
        origin.env.isLive = false;
        origin.env.canPlayMedia = origin.Support.canPlayMedia();

        if(origin.env.isHls === true)
        {
            origin.env.useHlsLib = origin.env.canPlayMedia === false && Hls.isSupported() ? true: false;
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
                    // SET LIVE EVENT STATE
                    if(origin.options.live === true)
                    {
                        origin.env.isLive = true;
                        origin.Ui.state(origin.env.model.toolbar, '', 'live');
                    /*}else if(data.details.live === true)
                    {
                        origin.env.isLive = true;
                        origin.Ui.state(origin.env.model.toolbar, '', 'live');
                    */}else{
                        origin.env.isLive = false;
                        origin.Ui.state(origin.env.model.toolbar, 'live', '');
                    }
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
            //origin.env.dash.create();
            //origin.env.dash.initialize(origin.env.api, origin.env.source, origin.options.autoplay);

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


        origin.Ui.state(origin.env.model.preloader, '', 'on');


        origin.Api.allowStart({
            type: 'origin.Loader'
        });


        origin.Controls.press('play');
    };
};
