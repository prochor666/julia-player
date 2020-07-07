/* *****************************************
* JuliaPlayer HTML5 player
* Suppport utilities
****************************************** */
JuliaPlayer.prototype._Support = function(origin) {
    var self = this;

    self.aspect = function(w,h) {
        return w>0 && h>0 ? h/w: 0;
    };


    self.bitrate = function(bites) {
        var i = -1;
        var biteUnits = ['kbps', 'Mbps', 'Gbps'];
        do {
            bites = bites / 1000;
            i++;
        } while (bites > 1000);

        return Math.max(bites, 0.1).toFixed(1) + biteUnits[i];
    };

    self.forceReadyState = function() {
        if (/Firefox/i.test(navigator.userAgent) ) {
            return true;
        }

        return false;
    };

    self.hasAttr = function (obj, attr) {
        return Object.keys(obj).indexOf(attr) > -1;
    };


    self.isCallable = function(v) {
        return (!v || (typeof v !== 'object' && typeof v !== 'function')) ? false: true;
    };


    self.isMobile = function() {
        if (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile/i.test(navigator.userAgent)) {
            return true;
        }

        return false;
    };


    self.iOS = function() {
        if(/iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream) {
            return true;
        }

        return false;
    };


    self.isVisible = function() {
        var rect = document.querySelector('#julia-'+origin.env.ID).getBoundingClientRect();
        var viewHeight = Math.max(document.documentElement.clientHeight, window.innerHeight);
        return !( rect.bottom < 0 || rect.top - viewHeight >= 0 );
    };


    self.canPlayMedia = function() {
        origin.env.canPlayMediaString = origin.env.mode == 'legacy' ? origin.env.api.canPlayType('video/mp4'): origin.env.api.canPlayType('application/vnd.apple.mpegURL');
        origin.env.canPlayMedia = (origin.env.canPlayMediaString == 'probably' || origin.env.canPlayMediaString == 'maybe');
        return origin.env.canPlayMedia;
    };


    self.getDuration = function () {
        var duration = origin.env.api.duration;
        if (origin.env.started === true && origin.env.mode == 'dash') {
            duration = origin.env.dash.duration();
        }
        return duration;
    };


    self.playVideo = function() {
        if (origin.env.mode == 'dash') {
            origin.env.dash.play();
        }else{
            origin.env.api.play();
        }
    };


    self.pauseVideo = function() {
        if (origin.env.mode == 'dash') {
            origin.env.dash.pause();
        }else{
            origin.env.api.pause();
        }
    };


    self.stopVideo = function() {
        origin.event('stop.julia', origin.env.instance, origin);
        self.pauseVideo();
        self.seekVideo(0);
    };


    self.seekVideo = function(currentTime) {
        if (origin.env.mode == 'dash') {
            origin.env.dash.seek(currentTime);
        }else{
            origin.env.api.currentTime = currentTime;
        }
    };


    self.resize = function(m) {

        if (typeof(m) !== 'undefined') {
            origin.debug({'Resize event message': m});
        }

        var vmargin = 0;
        var dimensions = [512,288];
        var realVideoWidth = 0, realVideoHeight = 0, playerWith = 0, playerHeight = 0, videoAspect = self.aspect(origin.env.api.videoWidth, origin.env.api.videoHeight);

        if (!document.fullscreenElement && !document.mozFullScreenElement && !document.webkitFullscreenElement && !document.msFullscreenElement) {
            // no fullscreen
            if (origin.options.responsive === true) {
                dimensions = self.getSize();
            } else {
                dimensions = [Number(origin.options.width),Number(origin.options.width)*origin.options.aspectRatio];
            }

            realVideoHeight = dimensions[1];
            realVideoWidth = realVideoHeight / videoAspect;
        }else{
            // fullscreen
            if (origin.Support.isMobile()) {
                dimensions = [window.outerWidth, window.outerHeight];
            } else {
                dimensions = [window.innerWidth, window.innerHeight];
            }

            // landscape orientation of wrapper
            realVideoHeight = dimensions[1];
            realVideoWidth = realVideoHeight / videoAspect;

            if (realVideoWidth > dimensions[0]) {
                realVideoWidth = dimensions[0];
                realVideoHeight = realVideoWidth * videoAspect;
            }

            // video margin top fix
            vmargin = (window.innerHeight - realVideoHeight)/2;
        }

        playerWith = Math.ceil(dimensions[0]);
        playerHeight = Math.ceil(dimensions[1]);

        videoAspect = self.aspect(origin.env.api.videoWidth, origin.env.api.videoHeight);
        
        origin.env.api.setAttribute('style', 'object-fit: fill;margin-top: '+vmargin+'px;');
        origin.env.api.setAttribute('width', realVideoWidth);
        origin.env.api.setAttribute('height', realVideoHeight);
        origin.env.api.setAttribute('marginLeft', 'auto');
        origin.env.api.setAttribute('marginRight', 'auto');

        origin.env.instance.width(playerWith);
        origin.env.instance.height(playerHeight);

        origin.env.wrapper.width(playerWith);
        origin.env.wrapper.height(playerHeight);

        origin.env.dimensions.width = playerWith;
        origin.env.dimensions.height = playerHeight;

        origin.debug({'UI resize': [playerWith, playerHeight]});
        origin.debug({'UI resize video': [realVideoWidth, realVideoHeight]});
        
        // Small size fix, hide time info, BAD BOY!
        $('.julia-toolbar-bottom-'+origin.env.ID+':not(.live) .julia-panel.julia-currentTime, .julia-toolbar-bottom-'+origin.env.ID+':not(.live) .julia-panel.julia-duration')
        .css({
            'display': playerWith < 360 ? 'none': 'block'
        });

        origin.event('resize.julia');
    };


    self.fixParentSize = function() {
        // Fix video wrapped in inline block, can not get size properly if inline element detected
        origin.env.element.parent().css({'display': 'block'});
    };


    self.getSize = function() {
        return [Number(origin.env.element.parent().width()),Number(origin.env.element.parent().width())*origin.options.aspectRatio];
    };
};
