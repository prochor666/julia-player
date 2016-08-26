/* *****************************************
* Julia HTML5 media player
* Media element API
* For now, only video is supported
****************************************** */
Julia.prototype._Controls = function(origin)
{
    var self = this;

    self.press = function(action, data)
    {
        data = data||{};

        origin.Base.debug({
            'action': action,
            'action-data': data,
        });

        switch(action)
        {
            case 'play':

                if(origin.options.onPlay !== false)
                {
                    origin.Callback.fn(origin.options.onPlay, data);
                }

                origin.env.model.buttons.bigPlay.hide();
                origin.env.api.play();

            break; case 'pause':

                if(origin.options.onPause !== false)
                {
                    origin.Callback.fn(origin.options.onPause, data);
                }

                origin.env.api.pause();

            break; case 'stop':

                if(origin.options.onStop !== false)
                {
                    origin.Callback.fn(origin.options.onStop, data);
                }

                origin.env.api.pause();
                origin.env.api.currentTime = 0;

                origin.Ui.state( origin.env.model.buttons.play, 'pause', 'play' );
                origin.Ui.icon( origin.env.model.buttons.play, 'julia-pause', 'julia-play' );
                origin.env.model.buttons.bigPlay.show();
                origin.Ui.progress( origin.env.model.ranges.progress, 0 );

            break; case 'goto':

                if(origin.options.onPosition !== false)
                {
                    origin.Callback.fn(origin.options.onPosition, data);
                }

                origin.env.api.currentTime = data.currentTime;

            break; case 'setDuration':

                origin.Ui.panel( origin.env.model.panels.duration, data.duration );

                if(origin.env.started === false)
                {
                    origin.Ui.progress( origin.env.model.ranges.progress, 0 );
                }

                origin.Base.debug({
                    'setDuration': data.duration
                });

            break; case 'volume':

                origin.options.volume = data.volume;
                origin.env.api.volume = data.volume/100;

                origin.Base.debug({
                    'volume is': origin.env.api.volume
                });

                origin.Ui.progress( origin.env.model.ranges.volume, data.volume );

                if(data.volume>0)
                {
                    origin.Controls.press('sound-on');

                }else{
                    origin.Controls.press('sound-off');
                }

            break; case 'sound-on':

                origin.env.api.muted = false;
                origin.options.muted = false;
                origin.Persist.set('julia-player-volume', origin.options.volume, 999);
                origin.Persist.set('julia-player-muted', origin.options.muted, 999);

                origin.Ui.state( origin.env.model.buttons.sound, 'off', 'on' );
                origin.Ui.icon( origin.env.model.buttons.sound, 'julia-sound-off', 'julia-sound-on' );

            break; case 'sound-off':

                origin.env.api.muted = true;
                origin.options.muted = true;
                origin.Persist.set('julia-player-volume', origin.options.volume, 999);
                origin.Persist.set('julia-player-muted', origin.options.muted, 999);

                origin.Ui.state( origin.env.model.buttons.sound, 'on', 'off' );
                origin.Ui.icon( origin.env.model.buttons.sound, 'julia-sound-on', 'julia-sound-off' );

            break; case 'fullscreen-on':
                origin.Fullscreen.on();

            break; case 'fullscreen-off':
                origin.Fullscreen.off();

            break; default:

        }

        return;
    };

};
