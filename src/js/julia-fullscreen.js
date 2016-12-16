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
