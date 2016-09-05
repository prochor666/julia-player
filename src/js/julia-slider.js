/* *****************************************
* Julia HTML5 media player
* Slider controller
* Progress and volume widget library
****************************************** */
Julia.prototype._Slider = function(origin, options)
{
    var self = this,

        leftButtonDown = false,

        ua = navigator.userAgent,

        isChrome = /chrome/i.exec(ua),

        isAndroid = /android/i.exec(ua),

        hasTouch = 'ontouchstart' in window && !(isChrome && !isAndroid),

        _normalize = function(percent)
        {
            if( percent > 100 ){ return 100; }
            if( percent < 0 ){ return 0; }
            return ( Math.round(percent*100) ) / 100;
        },

        _posToPercent = function(pos)
        {
            return _normalize( pos / (self.track.innerWidth()/100) );
        },

        _position = function(e)
        {
            var pos = hasTouch === true ? e.originalEvent.touches[0].pageX - self.model.offset().left : e.originalEvent.pageX - self.model.offset().left;
            percent = _posToPercent( pos );
            return percent;
        },

        model = $('<div class="julia-slider">'
            +'<div class="julia-slider-track" data-julia-slider-component="track"></div>'
            +'<div class="julia-slider-handle" data-julia-slider-component="handle"></div>'
            +'<div class="julia-slider-fill" data-julia-slider-component="fill"></div>'
        +'</div>');

        self.model = model.clone();

        self.track = self.model.find('[data-julia-slider-component="track"]');

        self.handle = self.model.find('[data-julia-slider-component="handle"]');

        self.fill = self.model.find('[data-julia-slider-component="fill"]');

        self.options = {
            element: {},
            value: 0,
            originVisible: false,
            eventRise: '',
        };

    // Extend custom options
    $.extend(true, self.options, options);

    self.elem = typeof self.options.element === 'object' ? self.options.element: $(self.options.element.toString()),

    self.value = self.options.value;




    // Public methods & props
    self.init = function()
    {
        if( ['input'].lastIndexOf( self.elem.prop('tagName').toLowerCase() ) > -1 )
        {
            self.value = _normalize( self.elem.val() );
        }

        if( self.options.originVisible === false )
        {
        	self.elem.hide().after( self.model );
        }else{
            self.elem.after( self.model );
        }

        self.slide( self.value, true );
    };




    self.update = function( percent )
    {
        if( leftButtonDown === false )
        {
            self.slide( percent, true );
        }
    };




    self.slide = function( percent, eventPrevent )
    {
        if( typeof eventPrevent === 'undefined' )
        {
            eventPrevent = false;
        }

        self.value = _normalize( percent ) ;
        var pos = ( self.track.innerWidth() / 100 ) * self.value;
        self.handle.css({'left': pos+'px'});
        self.fill.css({'width': pos+2+'px'});

        self.respond( percent, eventPrevent );
    };




    self.respond = function( percent, eventPrevent )
    {
        if( typeof eventPrevent === 'undefined' )
        {
            eventPrevent = false;
        }

        if( ['input'].lastIndexOf( self.elem.prop('tagName').toLowerCase() ) > -1 )
        {
        	self.elem.val( self.value );

            if( eventPrevent === false )
            {
                $('#julia-player-'+origin.env.ID).trigger({
                    type: 'julia.'+self.options.eventRise,
                    percent: percent
                });
            }
        }

        // Fix final handle position on track
        self.track.innerWidth( self.model.innerWidth() - self.handle.innerWidth() );
    }




    self.getValue = function()
    {
    	return self.value;
    };




    self.sliding = function()
    {
    	return leftButtonDown;
    };


    // Mouse & touch events
    self.fill.on('click ', function(e)
    {
        self.slide( _position(e), false );
    });




    self.track.on('click', function(e)
    {
        self.slide( _position(e), false );
    });




    self.model.on('click', function(e)
    {
        self.slide( _position(e), false );
    });




    self.model.on('mousedown touchstart', function(e)
    {
        // Left mouse button activate
        if(e.type == 'touchstart')
        {
            self.slide( _position(e), false );
        }

        leftButtonDown = true;
    });




    $(document).on('mouseup touchend', function(e)
    {
        // Left mouse button deactivate
        leftButtonDown = false;
    });




    $(document).on('mousemove touchmove', function(e)
    {
        if(leftButtonDown === true)
        {
            self.slide( _position(e) );
        }
    });

    return self;
};
