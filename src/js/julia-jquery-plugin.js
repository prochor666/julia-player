/* *****************************************
* JuliaPlayer HTML5 media player
* jQuery plugin & extension
****************************************** */


// Extension for non DOM context
(function($)
{
    $.extend({
        juliaPlayer: function ( options )
        {
            return new JuliaPlayerVirtual( options );
        }
    });
})($);



// Build jQuery plugin
jQuery.fn.juliaPlayer = function(options)
{
    // API wrappers
    this.play = function()
    {
        $(this).data('juliaplayer').Controls.press('play');
    };

    this.setOptions = function(options)
    {
        $.extend(true, $(this).data('juliaplayer').options, options);
    };

    this.options = function()
    {
        return $(this).data('juliaplayer').options;
    };

    this.source = function(options)
    {
        $(this).data('juliaplayer').Inject.source(options);
    };

    this.api = function()
    {
        return $(this).data('juliaplayer').api;
    };

    this.pause = function()
    {
        $(this).data('juliaplayer').Controls.press('pause');
    };

    this.stop = function()
    {
        $(this).data('juliaplayer').Controls.press('stop');
    };

    this.goto = function(t)
    {
        $(this).data('juliaplayer').Controls.press('goto', {
            currentTime: t
        });
    };

    this.mute = function()
    {
        if($(this).data('juliaplayer').api.muted === false)
        {
            $(this).data('juliaplayer').Controls.press('sound-off');
        }else{
            $(this).data('juliaplayer').Controls.press('sound-on');
        }
    };

    this.volume = function(volume)
    {
        $(this).data('juliaplayer').Controls.press('volume', {
            volume: volume
        });
    };

    this.getID = function()
    {
        return $(this).data('juliaplayer').ID;
    };

    this.stats = function()
    {
        return $(this).data('juliaplayer').stats();
    };

    return this.each( function()
    {
        // Return if this element already has a plugin instance
        if( $(this).data('juliaplayer') )
        {
            return;
        }

        options = typeof options === 'undefined' ? {}: options;
        options.element = $(this);

        // Pass options to constructor
        var julia = new JuliaPlayer(options);

        // Store plugin object in element's data
        $(this).data('juliaplayer', julia);
    });
};
