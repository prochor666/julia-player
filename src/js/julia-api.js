/* *****************************************
* Julia HTML5 media player
* Media element API
* For now, only video is supported
****************************************** */
Julia.prototype._Api = function(origin)
{
    var self = this;

    self.create = function()
    {
        $('#julia-api-'+origin.env.ID).remove();

        apiElement = $('<video class="julia-video" id="julia-api-'+origin.env.ID+'" preload="auto"></video>');

        origin.env.instance.prepend(apiElement);
        origin.env.api = document.getElementById('julia-api-'+origin.env.ID);
        origin.env.api.controls = false;
        origin.env.apiOk = true;

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
                origin.Api.allowStart({
                    type: 'origin.Events.canplaythrough'
                });
            }else{
                setTimeout( function()
                {
                    origin.Api.canplaythrough();
                }, 100);
            }
        }
    };
};
