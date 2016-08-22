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
    $(this).data('julia').control.press('play');
};

$.fn.destroy = function()
{
    $(this).data('julia').control.press('destroy');
};

$.fn.media = function()
{
    return $(this).data('julia').media;
};

$.fn.pause = function()
{
    $(this).data('julia').control.press('pause');
};

$.fn.stop = function()
{
    $(this).data('julia').control.press('stop');
};

$.fn.goto = function(t)
{
    $(this).data('julia').control.press('goto', {
        currentTime: t
    });
};

$.fn.mute = function()
{
    if($(this).data('julia').media.muted === false)
    {
        $(this).data('julia').control.press('sound-off');
    }else{
        $(this).data('julia').control.press('sound-on');
    }
};

$.fn.volume = function(volume)
{
    $(this).data('julia').control.press('volume', {
        volume: volume
    });
};

$.fn.getID = function()
{
    return $(this).data('julia').id;
};

$.fn.stats = function()
{
    return $(this).data('julia').stats;
};
