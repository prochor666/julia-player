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
