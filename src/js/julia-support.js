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

        self.fixParentSize();
        var vmargin = 0;
        var dimensions = [512,288];
        var realVideoWidth = 0, realVideoHeight = 0, playerWith = 0, playerHeight = 0, videoAspect = 1;

        if (!document.fullscreenElement && !document.mozFullScreenElement && !document.webkitFullscreenElement && !document.msFullscreenElement) {
            // no fullscreen
            if (origin.options.responsive === true) {
                dimensions = self.getSize();
            } else {
                var l = origin.options.dimensions.length > 0 ? origin.options.dimensions.length - 1: 0;
                dimensions = [origin.options.dimensions[l][0], origin.options.dimensions[l][1]];
            }

            realVideoWidth = Math.ceil(dimensions[0]);
            realVideoHeight = Math.ceil(dimensions[1]);
            
        }else{
            // fullscreen
            videoAspect = self.aspect(origin.env.api.videoWidth, origin.env.api.videoHeight);

            if (videoAspect === 0 || origin.options.source.fixVideoAspect === true) {
                videoAspect = self.aspect(dimensions[0], dimensions[1]);
            }

            if (origin.Support.isMobile()) {
                dimensions = [window.innerWidth, window.innerHeight];
            } else {
                dimensions = [window.innerWidth, window.innerHeight];
            }
            

            // landscape
            console.log('Landscape');
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
        var disaplayAspect = self.aspect(playerWith, playerHeight);
        
        if (origin.options.source.fixVideoAspect === true) {
            origin.env.api.setAttribute('style', 'object-fit: fill;margin-top: '+vmargin+'px;');
            origin.env.api.setAttribute('width', realVideoWidth);
            origin.env.api.setAttribute('height', realVideoHeight);
        }else{
            origin.env.api.setAttribute('style', 'margin-top: '+vmargin+'px;');
            origin.env.api.setAttribute('width', realVideoWidth);
            origin.env.api.setAttribute('height', realVideoHeight);
        }

        origin.env.instance.width(playerWith);
        origin.env.instance.height(playerHeight);

        origin.env.wrapper.width(playerWith);
        origin.env.wrapper.height(playerHeight);

        origin.env.dimensions.width = playerWith;
        origin.env.dimensions.height = playerHeight;

        origin.debug({'UI resize': [playerWith, playerHeight]});
        
        // Small size fix, hide time info, BAD BOY!
        $('.julia-toolbar-bottom-'+origin.env.ID+':not(.live) .julia-panel.julia-currentTime, .julia-toolbar-bottom-'+origin.env.ID+':not(.live) .julia-panel.julia-duration')
        .css({
            'display': playerWith < 360 ? 'none': 'block'
        });

        origin.event('resize.julia');
    };


    self.fixParentSize = function() {
        // Fix video wrapped in inline block, can not get size properly if inline element detected
        var parentBlock = origin.env.element.parent().css('display').toLowerCase();
        if( parentBlock == 'inline' ) {
            origin.env.element.parent().css({'display': 'block'});
        }
    };


    self.getSize = function() {
        var parentWidth = origin.env.element.parent().width();
        var dim = [Number(parentWidth),Number(parentWidth)*0.5625];

        if (origin.options.responsiveBreakpoints === true) {
            for ( i in origin.options.dimensions ) {
                dim = origin.options.dimensions[i];
                if ( parentWidth >= dim[0] ) {
                    dimensions = [dim[0],(dim[0]*self.aspect(dim[0], dim[1]))];
                    return dimensions;
                }
            }
        }
        dimensions = [parentWidth, (parentWidth*self.aspect(dim[0], dim[1]))];
        return dimensions;
    };
};
