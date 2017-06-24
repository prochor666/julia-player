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
