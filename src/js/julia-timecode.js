/* *****************************************
* JuliaPlayer HTML5 media player
* Timecode
* utilities for timecode conversion
****************************************** */
JuliaPlayer.prototype._Timecode = function (origin) {
    var self = this;
    self.toPercents = function (currentTime) {
        duration = origin.env.api.duration;
        if (isNaN(duration) || typeof Number(duration) !== 'number') {
            duration = 0;
        }
        if (isNaN(currentTime) || typeof Number(currentTime) !== 'number') {
            currentTime = 0;
        }
        return duration > 0 ? currentTime / duration * 100 : 0;
    };
    self.toSeconds = function (percent) {
        duration = origin.env.api.duration;
        if (isNaN(duration) || typeof Number(duration) !== 'number') {
            duration = 0;
        }
        if (isNaN(percent) || typeof Number(percent) !== 'number') {
            percent = 0;
        }
        return duration / 100 * percent;
    };
    self.toNum = function (human) {
        human = human.split(':');
        human.reverse();
        s = parseInt(human[0]);
        m = human.length > 1 ? parseInt(human[1]) : 0;
        h = human.length > 2 ? parseInt(human[3]) : 0;
        t = s + m * 60 + h * 60 * 60;
        return t;
    };
    self.toHuman = function (time) {
        if (isNaN(time) || typeof Number(time) !== 'number') {
            time = 0;
        }
        time = time.toString().split('.');
        s = time[0];
        H = Math.floor(s / 3600);
        M = Math.floor((s - H * 3600) / 60);
        S = Math.floor(s - H * 3600 - M * 60);
        H = ('0' + H.toString()).slice(-2);
        M = ('0' + M.toString()).slice(-2);
        S = ('0' + S.toString()).slice(-2);
        str = H > 0 ? H + ':' + M + ':' + S : M + ':' + S;
        return str;
    };
};
