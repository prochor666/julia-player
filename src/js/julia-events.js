/* *****************************************
* JuliaPlayer HTML5 media player
* Events
* DOM & api event handlers and emmiters
****************************************** */
JuliaPlayer.prototype._Events = function(origin)
{
    var self = this;

    // Bind user action & DOM events
    self.ui = function()
    {
        // Buttons
        origin.env.model.toolbar.on('contextmenu', function(e)
        {
            e.preventDefault();
        })
        .on('click', '.julia-playback.play', function(e)
        {
            e.preventDefault();
            origin.Controls.press('play');
        })
        .on('click', '.julia-playback.pause', function(e)
        {
            e.preventDefault();
            origin.Controls.press('pause');
        })
        .on('click', '.julia-sound.on', function(e)
        {
            e.preventDefault();
            origin.Controls.press('sound-off');
        })
        .on('click', '.julia-sound.off', function(e)
        {
            e.preventDefault();
            origin.Controls.press('sound-on');
        })
        .on('click', '.julia-fullscreen-toggle.on', function(e)
        {
            e.preventDefault();
            origin.Controls.press('fullscreen-on');
        })
        .on('click', '.julia-fullscreen-toggle.off', function(e)
        {
            e.preventDefault();
            origin.Controls.press('fullscreen-off');
        });




        // Big play
        origin.env.model.shield.on('click contextmenu', '.julia-big-play', function(e)
        {
            e.preventDefault();
            e.stopPropagation();

            if(e.type == 'click')
            {
                if(origin.env.started === false)
                {
                    origin.Ui.state( origin.env.model.preloader, '', 'on' );
                    origin.Loader.init();
                }

                origin.Controls.press('play');
            }
        });




        // Area click
        origin.env.model.shield.on('dblclick click contextmenu', function(e)
        {
            e.preventDefault();
            e.stopPropagation();

            if( e.type == 'click' )
            {
                if( origin.options.pauseOnClick === true && origin.Support.isMobile() === false && origin.env.started === true )
                {
                    if( origin.env.api.paused === false )
                    {
                        origin.Controls.press('pause');
                    }else{
                        origin.Controls.press('play');
                    }
                }

                if( origin.env.started === false )
                {
                    origin.Ui.state( origin.env.model.preloader, '', 'on' );
                    origin.Loader.init();
                    origin.Controls.press('play');
                }
            }

            if( e.type == 'dblclick' )
            {
                if( origin.env.instance.hasClass('julia-fullscreen-on') )
                {
                    origin.Controls.press('fullscreen-off');
                }else{
                    origin.Controls.press('fullscreen-on');
                }
            }
        });




        // Fullscreen toolbar behavior bindings
        var mouseMoveCleaner;

        origin.env.instance.on('mousemove touchmove', '#julia-shield-'+origin.env.ID+', #julia-suggest-'+origin.env.ID, function(e)
        {
            e.preventDefault();
            origin.env.model.toolbar.addClass('julia-toolbar-visible');
            clearTimeout(mouseMoveCleaner);

            mouseMoveCleaner = setTimeout(function()
            {
                origin.env.model.toolbar.removeClass('julia-toolbar-visible');
            }, 1750);
        })
        .on('mouseover mousemove touchmove mouseout', '#julia-toolbar-'+origin.env.ID+'.julia-toolbar-visible', function(e)
        {
            e.preventDefault();
            origin.env.model.toolbar.addClass('julia-toolbar-visible');
            clearTimeout(mouseMoveCleaner);

            if( ['mouseout', 'touchend'].lastIndexOf( e.type.toLowerCase() ) > -1 )
            {
                mouseMoveCleaner = setTimeout(function(e)
                {
                    origin.env.model.toolbar.removeClass('julia-toolbar-visible');
                }, 1750);
            }
        });




        // Bind progressbar change
        $('body').on('julia.progress-change', '#julia-player-'+origin.env.ID, function(e, percent)
        {
            seekTo = origin.Timecode.toSeconds( e.percent );
            seekTo = seekTo >= origin.env.duration ? origin.env.duration: seekTo.toFixed(2);

            origin.Controls.press('goto', {
                currentTime: seekTo
            });
        });




        $('body').on('julia.volume-change', '#julia-player-'+origin.env.ID, function(e, percent)
        {
            origin.Controls.press('volume', {
                volume: e.percent,
            });
        });




        // Fullscreen event included
        $(window).on('resize', function()
        {
            origin.Support.resize();
        });
    };




    // Native video api
    self.native = function()
    {
        if(origin.Support.forceReady()===true && origin.env.isHls === true)
        {
            origin.Api.canplaythrough();
        }else{
            origin.env.api.oncanplaythrough = function(e)
            {
                origin.env.duration = origin.env.api.duration;

                if(origin.env.started === false && origin.env.api.readyState >= 3)
                {
                    origin.Api.allowStart(e);
                }
            }
        }




        // Video playback detect
        origin.env.api.onplay = function(e)
        {
            origin.Ui.state( origin.env.model.buttons.play, 'play', 'pause' );
            origin.Ui.icon( origin.env.model.buttons.play, 'julia-play', 'julia-pause' );
            origin.env.model.buttons.bigPlay.hide();
            //origin.Ui.state( origin.env.model.preloader, 'on', '' );
            origin.Ui.posterUnset();
            origin.env.model.toolbar.show();
        };




        origin.env.api.onplaying = function(e)
        {
            origin.Ui.state( origin.env.model.buttons.play, 'play', 'pause' );
            origin.Ui.icon( origin.env.model.buttons.play, 'julia-play', 'julia-pause' );
            origin.env.model.buttons.bigPlay.hide();
            origin.env.model.suggest.html('');
            origin.Ui.state( origin.env.model.suggest, 'on', '' );
            //origin.Ui.posterUnset();
            origin.env.model.toolbar.show();

            origin.Controls.press('setDuration', {
                'duration': origin.Timecode.toHuman( origin.env.duration )
            });
            origin.env.started = true;
        };




        // Video pause
        origin.env.api.onpause = function(e)
        {
            origin.Ui.state( origin.env.model.buttons.play, 'pause', 'play' );
            origin.Ui.icon( origin.env.model.buttons.play, 'julia-pause', 'julia-play' );

            setTimeout( function()
            {
                if( origin.env.api.paused === true )
                {
                    origin.env.model.buttons.bigPlay.show();
                }
            }, 350);
        };




        // Errors
        origin.env.api.onerror = function(e)
        {

        };




        origin.env.api.onemptied = function(e)
        {
        };




        origin.env.api.onstalled = function(e)
        {
        };




        origin.env.api.onsuspend = function(e)
        {
        };




        origin.env.api.onloadeddata = function(e)
        {
        };




        origin.env.api.oncanplaythrough = function(e)
        {
        }




        // Video position
        origin.env.api.ontimeupdate = function(e)
        {
            currentTimeReadable = origin.Timecode.toHuman( origin.env.api.currentTime.toFixed(2) );

            if(origin.env.seeking === false)
            {
                origin.env.model.sliders.progress.update( origin.Timecode.toPercents( origin.env.api.currentTime ) );

                origin.Ui.panel(
                    origin.env.model.panels.currentTime,
                    currentTimeReadable
                );

                origin.Ui.state( origin.env.model.preloader, 'on', '' );
            }

            origin.Callback.onTime(currentTimeReadable, origin.env.api.currentTime);

            if(origin.options.debugPlayback === true)
            {
                origin.Base.debug({
                    'duration/current': origin.env.duration+'/'+origin.env.api.currentTime.toFixed(2)+' > '+currentTimeReadable
                });
            }
        };




        // Video position
        origin.env.api.onseeked = function(e)
        {
            origin.env.seeking = false;
        };




        // Video position
        origin.env.api.onseeking = function(e)
        {
            origin.Ui.state( origin.env.model.preloader, '', 'on' );
            origin.env.seeking = true;
        };




        // Volume
        origin.env.api.onvolumechange = function(e)
        {
            if(origin.env.api.muted === false)
            {
                //origin.Ui.volume( origin.env.api.volume*100 );
                origin.env.model.sliders.volume.update( origin.env.api.volume*100 );

            }else{
                //origin.Ui.volume( 0 );
                origin.env.model.sliders.volume.update( 0 );
            }
        };




        // Set video duration
        origin.env.api.ondurationchange = function(e)
        {
            if( !isNaN(origin.env.api.duration) )
            {
                origin.env.duration = origin.env.api.duration;

                if ( origin.env.started === false )
                {
                    origin.env.seeking = false;
                }

                origin.Base.debug({
                    'duration': origin.env.duration,
                    'readyState': origin.env.api.readyState,
                    'started': origin.env.started
                });
            }
        };




        // Bind playback end event
        origin.env.api.onended = function(e)
        {
            origin.Suggest.run();
        };




        $(window).on('blur', function()
        {
            if( origin.options.pauseOnBlur === true && origin.env.api.paused === false && origin.env.started === true )
            {
                origin.Controls.press('pause');
            }
        });
    };




    // Specific events, error handlers
    self.hlsLibEvents = function()
    {
        origin.env.hls.on(Hls.Events.ERROR, function(event, data)
        {
            switch(data.details)
            {
                case Hls.ErrorDetails.MANIFEST_LOAD_ERROR:
                case Hls.ErrorDetails.MANIFEST_LOAD_TIMEOUT:
                case Hls.ErrorDetails.MANIFEST_PARSING_ERROR:

                    // reboot api
                    origin.Api.shadowApi = false;

                    origin.options.muted = origin.env.api.muted;

                    origin.env.started = false;
                    origin.options.source = origin.options.tempSource;
                    origin.Api.source();
                    origin.options.autoplay = true;

                    origin.Ui.panel( origin.env.model.panels.live, origin.options.i18n.liveText );

                    origin.env.model.buttons.bigPlay.click();


                break; case Hls.ErrorDetails.LEVEL_LOAD_ERROR:
                case Hls.ErrorDetails.LEVEL_LOAD_TIMEOUT:
                case Hls.ErrorDetails.LEVEL_SWITCH_ERROR:
                case Hls.ErrorDetails.FRAG_LOAD_ERROR:
                case Hls.ErrorDetails.FRAG_LOOP_LOADING_ERROR:
                case Hls.ErrorDetails.FRAG_LOAD_TIMEOUT:
                case Hls.ErrorDetails.FRAG_DECRYPT_ERROR:
                case Hls.ErrorDetails.FRAG_PARSING_ERROR:
                case Hls.ErrorDetails.BUFFER_APPEND_ERROR:
                case Hls.ErrorDetails.BUFFER_APPENDING_ERROR:

                    origin.Base.debug({
                        recoveringError: data.details,
                        errorType: data.type,
                        errorFatal: data.fatal,
                        data: data
                    });

                    // && origin.env.tries < 100
                    if(data.fatal === true)
                    {
                        // Bring to life again
                        switch (data.type)
                        {
                            case Hls.ErrorTypes.NETWORK_ERROR:
                                // try to recover network error
                                Hls.startLoad();
                            break; case Hls.ErrorTypes.MEDIA_ERROR:
                                // try to recover media error
                                Hls.recoverMediaError();
                            break; default:
                                // try to recover other errors
                                Hls.startLoad();
                        }
                    }

                break; default:
            }
        });
    };


    // Specific events, error handlers
    self.dashLibEvents = function()
    {
        origin.env.dash.on(dashjs.MediaPlayer.events, function(event, data)
        {
            switch(data.details)
            {
                case dashjs.MediaPlayer.events.ERROR:

                    origin.Base.debug({
                        recoveringError: dashjs.MediaPlayer.events.ERROR
                    });

                break; default:
            }
        });
    };
};
