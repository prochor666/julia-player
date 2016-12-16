/* *****************************************
* JuliaPlayer HTML5 media player
* Timecode
* utilities for timecode conversion
****************************************** */
JuliaPlayer.prototype._Timecode = function(origin)
{
    var self = this;

    self.toPercents = function(currentTime)
    {
        p = (currentTime/origin.env.duration)*100;
        return p;
    },




    self.toSeconds = function(percent)
    {
        t = (origin.env.duration/100)*percent;
        return t;
    },




    self.toNum = function(human)
    {
        human = human.split(':');
        human.reverse();
        s = parseInt(human[0]);
        m = human.length>1 ? parseInt(human[1]): 0;
        h = human.length>2 ? parseInt(human[3]): 0;
        t = s + m*60 + h*60*60;
        return t;
    },




    self.toHuman = function(time)
    {
        time = time.toString().split('.');
        s = time[0];
        H = Math.floor(s/3600);
        M = Math.floor( ( s - (H*3600) ) / 60 );
        S = Math.floor( ( s - (H*3600) - (M*60) ) );

        H = ('0'+H.toString()).slice(-2);
        M = ('0'+M.toString()).slice(-2);
        S = ('0'+S.toString()).slice(-2);

        str = H>0 ? H+':'+M+':'+S: M+':'+S;

        return str;
    };
};
