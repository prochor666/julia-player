/* *****************************************
* JuliaPlayer HTML5 player
* Fullscreen
* player fullscreen behavior
****************************************** */
JuliaPlayer.prototype._Fullscreen = function(origin)
{
    var self = this;

    self.on = function()
    {
        if( origin.env.fullscreenFrame.requestFullscreen )
        {
            origin.env.fullscreenFrame.requestFullscreen();
        }else if( origin.env.fullscreenFrame.msRequestFullscreen )
        {
            origin.env.fullscreenFrame.msRequestFullscreen();
        }else if( origin.env.fullscreenFrame.mozRequestFullScreen )
        {
            origin.env.fullscreenFrame.mozRequestFullScreen();
        }else if( origin.env.fullscreenFrame.webkitRequestFullscreen )
        {
            origin.env.fullscreenFrame.webkitRequestFullscreen();
        }else{
            origin.debug({
                'Fullscreen': 'not supported'
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



    self.landscapeLock = function(lock)
    {
        if( origin.Support.isMobile() )
        {
            if( screen.orientation ){ sor = screen.orientation; }
            if( screen.msLockOrientation ){ sor = screen.msLockOrientation; }
            if( screen.mozLockOrientation ){ sor = screen.mozLockOrientation; }

            if( typeof sor !== 'undefined' && sor.lock && typeof sor.lock === 'function' )
            {
                if( lock === true )
                {
                    sor.lock('landscape-primary').catch(function(err)
                    {
                        origin.debug({
                            'Landscape lock error: ': err
                        }, true);
                    });
                }else if( sor.unlock && typeof sor.unlock === 'function' ){
                    sor.unlock();
                }
            }
        }
    };



    self.reset = function()
    {
        $(document).off('webkitfullscreenchange mozfullscreenchange fullscreenchange MSFullscreenChange');

        // Fullscreen change event handler
        $(document).on('webkitfullscreenchange mozfullscreenchange fullscreenchange MSFullscreenChange', function(e)
        {
            if(!document.fullscreenElement && !document.mozFullScreenElement && !document.webkitFullscreenElement && !document.msFullscreenElement)
            {
                origin.Ui.state( origin.env.instance, 'julia-fullscreen-on', 'julia-fullscreen-off' );
                origin.Ui.state( origin.env.buttons.fullscreen, 'off', 'on' );
                origin.Ui.icon( origin.env.buttons.fullscreen, 'julia-fullscreen-exit', 'julia-fullscreen' );

                self.landscapeLock(false);

                origin.debug({
                    'Fullscreen off' : '#julia-player-'+origin.env.ID
                });

            }else{

                origin.Ui.state( origin.env.instance, 'julia-fullscreen-off', 'julia-fullscreen-on' );
                origin.Ui.state( origin.env.buttons.fullscreen, 'on', 'off' );
                origin.Ui.icon( origin.env.buttons.fullscreen, 'julia-fullscreen', 'julia-fullscreen-exit' );

                self.landscapeLock(true);

                origin.debug({
                    'Fullscreen on' : '#julia-player-'+origin.env.ID
                });
            }

            origin.Support.resize();
        });
    };
};
