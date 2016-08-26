// Build jQuery plugin
$.fn.julia = function(options)
{
    return this.each(function()
    {
        // Return if this element already has a plugin instance
        if($(this).data('julia'))
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

// API wrappers
$.fn.play = function()
{
    $(this).data('julia').Controls.press('play');
};

$.fn.setOptions = function(options)
{
    $(this).data('julia').Extend(options);
};

$.fn.options = function()
{
    return $(this).data('julia').options;
};

$.fn.source = function(options)
{
    $(this).data('julia').Inject.source(options);
};

$.fn.api = function()
{
    return $(this).data('julia').api;
};

$.fn.pause = function()
{
    $(this).data('julia').Controls.press('pause');
};

$.fn.stop = function()
{
    $(this).data('julia').Controls.press('stop');
};

$.fn.goto = function(t)
{
    $(this).data('julia').Controls.press('goto', {
        currentTime: t
    });
};

$.fn.mute = function()
{
    if($(this).data('julia').api.muted === false)
    {
        $(this).data('julia').Controls.press('sound-off');
    }else{
        $(this).data('julia').Controls.press('sound-on');
    }
};

$.fn.volume = function(volume)
{
    $(this).data('julia').Controls.press('volume', {
        volume: volume
    });
};

$.fn.getID = function()
{
    return $(this).data('julia').ID;
};

$.fn.stats = function()
{
    return $(this).data('julia').stats();
};
