/* *****************************************
* Julia HTML5 media player
* Inject
* Inject origin code, source change, etc...
****************************************** */
Julia.prototype._Inject = function(origin)
{
    var self = this;




    self.source = function(options)
    {
        if(origin.env.started === true)
        {
            origin.Controls.press('stop');
        }

        $('#julia-player-'+origin.env.ID).remove();

        // Run player
        origin.Boot.run();

        $.extend(true, origin.options, options);

        origin.Api.source();

        if( origin.options.live === true )
        {
            origin.env.isLive = true;
            origin.Ui.panel( origin.env.model.panels.live, origin.options.i18n.liveText );
            origin.Ui.state(origin.env.model.toolbar, '', 'live');
        }else{
            origin.env.isLive = false;
            origin.Ui.panel( origin.env.model.panels.live, '' );
            origin.Ui.state(origin.env.model.toolbar, 'live', '');
        }

        console.warn(origin.options.live);

        origin.Loader.init();
    };




    self.layer = function(data)
    {

    };
};
