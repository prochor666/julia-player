/* *****************************************
* JuliaPlayer HTML5 player
* jQuery plugin & extension
****************************************** */
// Extension for non DOM context
(function ($) {
    $.extend({
        juliaPlayer: function (options) {
            return new JuliaPlayer(options);
        }
    });
}($));
// Build jQuery plugin
jQuery.fn.JuliaPlayer = function (options) {
    var collection = [];
    this.each(function () {
        // Return if this element already has an instance
        if ($(this).data('juliaplayer')) {
            return;
        }
        options = typeof options === 'object' ? options : {};
        options.source = {
            file: $(this).prop('src') ? $(this).prop('src') : $(this).find('source').prop('src'),
            poster: $(this).prop('poster') ? $(this).prop('poster') : '',
            title: $(this).data('title') ? $(this).data('title') : '',
            link: $(this).data('link') ? $(this).data('link') : '',
            mode: $(this).data('mode') ? $(this).data('mode') : 'legacy',
            live: $(this).data('live') && $(this).data('live').toString().toLowerCase() == 'true' ? true : false,
            fixVideoAspect: $(this).data('fix-video-aspect') && $(this).data('fix-video-aspect').toString().toLowerCase() == 'true' ? true : false,
        };
        options.element = $(this).parent();
        options.pluginMode = true;
        $(this).css({ display: 'none' });
        // Pass options to constructor
        var julia = new JuliaPlayer(options);
        // Store plugin object in element's data
        $(this).data('juliaplayer', julia);
        collection.push(julia);
    });
    return collection;
};
