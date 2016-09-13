/* *****************************************
* Julia HTML5 media player
* Suppport
* media & DOM sizing utilities
****************************************** */
Julia.prototype._Support = function(origin)
{
    var self = this;




    self.aspect = function(w,h)
    {
        return w>0 && h>0 ? h/w: 0;
    };




    self.isMobile = function()
    {
        if( /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile/i.test(navigator.userAgent) )
        {
            return true;
        }

        return false;
    };




    self.forceReady = function()
    {
        if( /Firefox/i.test(navigator.userAgent) )
        {
            return true;
        }

        return false;
    };




    self.canPlayMedia = function()
    {
        var vid = document.createElement('video');
        vid.id = 'video-cap-test-'+origin.env.ID;
        origin.env.canPlayMediaString = vid.canPlayType('application/vnd.apple.mpegURL');
        $('#video-cap-test'+origin.env.ID).remove();
        return (origin.env.canPlayMediaString == 'probably' || origin.env.canPlayMediaString == 'maybe');
    };




    self.resize = function()
    {
        // Player dimensions
        defaultDim = origin.env.element.width() ? [origin.env.element.width(), origin.env.element.height()]: [origin.options.width, origin.options.height];
        dimensions = origin.options.responsive === true ? self.getSize(): defaultDim;

        origin.Base.debug({
            'resizeDefaults': defaultDim,
            'resize': dimensions
        });

        origin.env.instance.width(dimensions[0]);
        origin.env.instance.height(dimensions[1]);

        origin.env.dimensions.width = dimensions[0];
        origin.env.dimensions.height = dimensions[1];

        origin.env.api.setAttribute('width', '100%');
        origin.env.api.setAttribute('height', '100%');
    };




    self.getSize = function()
    {
        // Fix video wrapped in inline block, can not get size properlym if inline element detected
        var parentBlock = origin.env.element.parent().css('display').toLowerCase();
        if(parentBlock == 'inline')
        {
            origin.env.element.parent().css({'display': 'block'});
        }

        var parentWidth = origin.env.element.parent().width();
        for(i in origin.options.dimensions)
        {
            var dim = origin.options.dimensions[i];
            if(parentWidth>=dim[0])
            {
                a = self.aspect(parentWidth) == 0 ? dim[1]/dim[0]: self.aspect(origin.env.api.videoWidth, origin.env.api.videoHeight);

                dimensions = [dim[0],(dim[0]*a)];
                origin.Base.debug({
                    'resizePredefined': dimensions
                });
                return dimensions;
            }
        }

        a = self.aspect() == 0 ? dim[1]/dim[0]: self.aspect(origin.env.api.videoWidth, origin.env.api.videoHeight);
        dimensions = [parentWidth, (parentWidth*a)];

        origin.Base.debug({
            'resizeFallback': dimensions
        });

        return dimensions;
    };
};
