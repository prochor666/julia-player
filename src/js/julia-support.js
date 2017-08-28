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


    self.resize = function() {

        self.fixParentSize();

        if (!document.fullscreenElement && !document.mozFullScreenElement && !document.webkitFullscreenElement && !document.msFullscreenElement) {
            // no fullscreen
            dimensions = origin.options.responsive === true ? self.getSize(): [origin.env.element.width(), origin.env.element.height()];
        }else{

            if(self.aspect(dimensions[0], dimensions[1])<1) {
                // portrait
                dimensions = [screen.width,screen.height];
            }else{
                // landscape
                dimensions = [screen.width,screen.height];
            }
        }

        origin.env.api.setAttribute('width', dimensions[0]);
        origin.env.api.setAttribute('height', dimensions[1]);
        dimensions = [origin.env.api.getAttribute('width'), origin.env.api.getAttribute('height')];

        origin.env.instance.width(dimensions[0]);
        origin.env.instance.height(dimensions[1]);

        origin.env.wrapper.width(dimensions[0]);
        origin.env.wrapper.height(dimensions[1]);

        origin.env.dimensions.width = dimensions[0];
        origin.env.dimensions.height = dimensions[1];

        // Small size fix, hide time info, BAD BOY!
        $('.julia-toolbar-bottom-'+origin.env.ID+':not(.live) .julia-panel.julia-currentTime, .julia-toolbar-bottom-'+origin.env.ID+':not(.live) .julia-panel.julia-duration')
        .css({
            'display': dimensions[0] < 360 ? 'none': 'block'
        });
    };


    self.fixParentSize = function() {
        // Fix video wrapped in inline block, can not get size properlym if inline element detected
        var parentBlock = origin.env.element.parent().css('display').toLowerCase();
        if( parentBlock == 'inline' ) {
            origin.env.element.parent().css({'display': 'block'});
        }
    };


    self.getSize = function()
    {
        var parentWidth = origin.env.element.parent().width();

        for( i in origin.options.dimensions )
        {
            dim = origin.options.dimensions[i];

            if( parentWidth >= dim[0] )
            {
                dimensions = [dim[0],( dim[0]*self.aspect( dim[0], dim[1] ) )];
                return dimensions;
            }
        }

        dimensions = [parentWidth, (parentWidth*self.aspect( dim[0], dim[1] ))];

        return dimensions;
    };
};
