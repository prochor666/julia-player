/* *****************************************
* JuliaPlayer HTML5 player
* Virtual controls
****************************************** */
JuliaPlayer.prototype._Controls = function (origin) {
    var self = this;
    self.press = function (action, data) {
        data = data || {};
        $('.julia-player').removeClass('julia-focused');
        $('#julia-'+origin.env.ID+'').addClass('julia-focused');
        switch (action) {
        case 'play':
            origin.Ui.state(origin.env.preloader, '', 'on');
            origin.env.buttons.bigPlay.hide();
            if (origin.env.started === false) {
                origin.Source.load();
            } else {
                origin.Support.playVideo();
            }
            break;
        case 'pause':
            origin.Support.pauseVideo();
            break;
        case 'stop':
            origin.Support.stopVideo();
            origin.Ui.state(origin.env.buttons.play, 'pause', 'play');
            origin.Ui.icon(origin.env.buttons.play, 'julia-pause', 'julia-play');
            origin.env.buttons.bigPlay.show();
            origin.env.sliders.progress.update(0);
            break;
        case 'goto':
            origin.Ui.state(origin.env.preloader, '', 'on');
            data.currentTime = isNaN(Number(parseFloat(data.currentTime))) ? 0 : Number(parseFloat(data.currentTime));
            origin.Support.seekVideo(data.currentTime);
            break;
        case 'setDuration':
            data.duration = isNaN(Number(parseFloat(data.duration))) ? 0 : Number(parseFloat(data.duration));
            origin.Ui.panel(origin.env.panels.duration, origin.Timecode.toHuman(data.duration));
            break;
        case 'volume':
            origin.options.volume = data.volume;
            origin.env.api.volume = parseFloat(data.volume / 100);
            origin.env.sliders.volume.update(data.volume);
            if (data.volume > 0) {
                origin.Controls.press('sound-on');
            } else {
                origin.Controls.press('sound-off');
            }
            break;
        case 'sound-on':
            origin.env.api.muted = false;
            origin.options.muted = false;
            origin.Persist.set('julia-player-volume', origin.options.volume, 999);
            origin.Persist.set('julia-player-muted', 0, 999);
            origin.Ui.state(origin.env.buttons.sound, 'off', 'on');
            origin.Ui.icon(origin.env.buttons.sound, 'julia-sound-off', 'julia-sound-on');
            break;
        case 'sound-off':
            origin.env.api.muted = true;
            origin.options.muted = true;
            origin.Persist.set('julia-player-volume', origin.options.volume, 999);
            origin.Persist.set('julia-player-muted', 1, 999);
            origin.Ui.state(origin.env.buttons.sound, 'on', 'off');
            origin.Ui.icon(origin.env.buttons.sound, 'julia-sound-on', 'julia-sound-off');
            break;
        case 'fullscreen-on':
            origin.Fullscreen.reset();
            origin.Fullscreen.on();
            break;
        case 'fullscreen-off':
            origin.Fullscreen.reset();
            origin.Fullscreen.off();
            break;
        default:
        }
        return;
    };
};
