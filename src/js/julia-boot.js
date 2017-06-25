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
