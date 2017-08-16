/* *****************************************
* JuliaPlayer HTML5 player
* Callback
* event callbacks
****************************************** */
JuliaPlayer.prototype._Callback = function (origin) {
    var self = this;
    self.fn = function (f, data) {
        data = data || {};
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
            f(origin, data);
            origin.debug({ 'Callback': typeof f + ' raised' });
        } else {
            origin.debug({ 'Callback': typeof f + ' is not a function, but: ' + typeof f });
        }
    };
    // Time update event callbacks
    self.onTime = function (time, timeNum) {
        if (origin.options.onTime && typeof origin.options.onTime === 'object' && Object.keys(origin.options.onTime).indexOf(time) > -1 && origin.env.onTimeRised.indexOf(time) == -1) {
            f = origin.options.onTime[time];
            origin.env.onTimeRised.push(time);
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
                f(origin, time);
                origin.debug({ 'Callback onTime': time + ' ' + typeof f + ' raised' });
            } else {
                origin.debug({ 'Callback onTime': time + ' ' + typeof f + ' is not a function, but: ' + typeof f });
            }
        }
    };
};
