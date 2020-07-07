/* *****************************************
* JuliaPlayer HTML5 player
* Subtitles
* Play optional subtitles
****************************************** */
JuliaPlayer.prototype._Subtitles = function (origin) {
    var self = this;
    self.setTrack = function (track) {
        switch (origin.env.mode) {
        case 'dash':
            return origin.env.dash.setTextTrack(track);
            break;
        case 'hls':
            origin.env.hls.subtitleTrack = track;
            origin.env.hls.subtitleDisplay = true;
            break;
        default:
            //---------
        };
    };
    self.textTracksCleaner = function () {
        var tracks = origin.env.api.textTracks, track = {};
        if (tracks && tracks.length && tracks.length > 0 && tracks.length > 0) {
            for (var i in tracks) {
                track = tracks[i];
                if (track && track.kind && (track.kind == 'subtitles' || track.kind == 'captions')) {
                    track.mode = 'disabled';
                }
            }
        }
    };
};
