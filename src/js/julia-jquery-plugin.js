// Build jQuery plugin
jQuery.fn.julia = function(options)
{
    // API wrappers
    this.play = function()
    {
        $(this).data('julia').Controls.press('play');
    };

    this.setOptions = function(options)
    {
        $.extend(true, $(this).data('julia').options, options);
    };

    this.options = function()
    {
        return $(this).data('julia').options;
    };

    this.source = function(options)
    {
        $(this).data('julia').Inject.source(options);
    };

    this.api = function()
    {
        return $(this).data('julia').api;
    };

    this.pause = function()
    {
        $(this).data('julia').Controls.press('pause');
    };

    this.stop = function()
    {
        $(this).data('julia').Controls.press('stop');
    };

    this.goto = function(t)
    {
        $(this).data('julia').Controls.press('goto', {
            currentTime: t
        });
    };

    this.mute = function()
    {
        if($(this).data('julia').api.muted === false)
        {
            $(this).data('julia').Controls.press('sound-off');
        }else{
            $(this).data('julia').Controls.press('sound-on');
        }
    };

    this.volume = function(volume)
    {
        $(this).data('julia').Controls.press('volume', {
            volume: volume
        });
    };

    this.getID = function()
    {
        return $(this).data('julia').ID;
    };

    this.stats = function()
    {
        return $(this).data('julia').stats();
    };

    return this.each( function()
    {
        // Return if this element already has a plugin instance
        if( $(this).data('julia') )
        {
            return;
        }

        options = typeof options === 'undefined' ? {}: options;
        options.element = $(this);

        // Pass options to constructor
        var julia = new Julia(options);

        // Store plugin object in element's data
        $(this).data('julia', julia);
    });
};
