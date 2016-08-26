/* *****************************************
* Julia HTML5 media player
* Fullscreen
* media fullscreen behavior
****************************************** */
Julia.prototype._Fullscreen = function(origin)
{
    var self = this;

    self.on = function()
    {
        var videoFrame = document.querySelector('#julia-player-'+origin.env.ID);

        if(videoFrame.requestFullscreen)
        {
            videoFrame.requestFullscreen();
        } else if (videoFrame.msRequestFullscreen)
        {
            videoFrame.msRequestFullscreen();
        } else if (videoFrame.mozRequestFullScreen)
        {
            videoFrame.mozRequestFullScreen();
        } else if(videoFrame.webkitRequestFullscreen)
        {
            videoFrame.webkitRequestFullscreen();
        }else{
            origin.Base.debug({
                'fullscreen': 'fullscreen is not supported'
            });
        }
    };




    self.off = function()
    {
        if(document.exitFullscreen)
        {
            document.exitFullscreen();
        }else if(document.msExitFullscreen)
        {
            document.msExitFullscreen();
        } else if(document.mozCancelFullScreen)
        {
            document.mozCancelFullScreen();
        } else if(document.webkitExitFullscreen)
        {
            document.webkitExitFullscreen();
        }
    };
};
