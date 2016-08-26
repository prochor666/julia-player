/* *****************************************
* Julia HTML5 media player
* Boot
* player boot process
****************************************** */
Julia.prototype._Boot = function(origin)
{
    var self = this;

    self.run = function()
    {
        origin.Base.debug(origin.options);

        // Set active DOM element
        origin.env.element = origin.options.element;

        // Suggest init
        for(i in origin.options.suggest)
        {
            origin.options.suggest[i].played = false;
        }

        // Persistent data
        volume = origin.Persist.get('julia-player-volume');
        muted = origin.Persist.get('julia-player-muted');

        if(typeof volume !=='undefined' && volume.length>0)
        {
            origin.options.volume = parseInt(volume);

            if(origin.options.volume > 100 || origin.options.volume < 0)
            {
                origin.options.volume = 25;
            }
        }

        if(typeof volume !=='undefined' && muted.length>0)
        {
            origin.options.muted = muted == 'false' ?  false: true;
        }


        // Create UI
        origin.Ui.create();

        // Create API
        origin.Api.create();

        // Source select, poster select
        origin.Api.source();

        // Size Fix
        origin.Support.resize();

        // Handle events
        origin.Events.ui();
        origin.Events.native();
    };
};
