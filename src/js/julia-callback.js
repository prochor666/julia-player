/* *****************************************
* JuliaPlayer HTML5 player
* Callback
* event callbacks
****************************************** */
JuliaPlayer.prototype._Callback = function (origin) {
    var self = this;
    self.fn = function (f) {
        var tmpName = f.toString();
        if ($.inArray(typeof f, [
                'string',
                'function'
            ]) > -1) {
            // Callback defined as function name or function
            // !!! Remember !!!
            // If you are using typeof string, function must be callable globally (window context) 
            if (typeof f === 'string') {
                f = window[f];
            }
            f(origin);
            origin.debug({ 'Callback': tmpName + ' raised' });
        } else {
            origin.debug({ 'Callback': tmpName + ' is not a function, but: ' + typeof f });
        }
    };

    // Time update event callbacks
    self.onTime = function () {
        var currentTimeReadable = origin.Timecode.toHuman(origin.env.api.currentTime);
        if (origin.options.onTime && typeof origin.options.onTime === 'object' && Object.keys(origin.options.onTime).indexOf(currentTimeReadable) > -1 && origin.env.onTimeRised.indexOf(currentTimeReadable) == -1) {
            f = origin.options.onTime[currentTimeReadable];
            origin.env.onTimeRised.push(currentTimeReadable);
            if ($.inArray(typeof f, [
                    'string',
                    'function'
                ]) > -1) {
                // Callback defined as function name or function
                // !!! Remember !!!
                // If you are using typeof string, function must be callable globally (window context)
                if (typeof f === 'string') {
                    f = window[f];
                }
                f(origin);
                origin.debug({ 'Callback onTime': currentTimeReadable + ' ' + typeof f + ' raised' });
            } else {
                origin.debug({ 'Callback onTime': currentTimeReadable + ' ' + typeof f + ' is not a function, but: ' + typeof f });
            }
        }
    };
};
