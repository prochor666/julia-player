/* *****************************************
* JuliaPlayer HTML5 media player
* Callback
* event callbacks
****************************************** */
JuliaPlayer.prototype._Callback = function(origin)
{
    var self = this;

    self.fn = function(f, data)
    {
        data = data||{};

        if( $.inArray(typeof f, ['string', 'function', 'object']) > -1 )
        {
            // Callback defined as function name or function
            // !!! Remember !!!
            // If you are using typeof string, function must be callable globally (window context)
            if( typeof f === 'string' )
            {
                f = window[f];
            }

            f(origin.options, origin.env, data);

            origin.Base.debug({
                'Callback': typeof f+' raised'
            });

        }else{

            origin.Base.debug({
                'Callback': typeof f+' is not a function, but: '+(typeof f)
            });
        }
    };




    // Time update event callbacks
    self.onTime = function(time, timeNum)
    {
        if( (time in origin.options.onTime) && origin.env.onTimeRised.indexOf(time) == -1 )
        {
            f = origin.options.onTime[time];
            origin.env.onTimeRised.push(time);


            if( $.inArray(typeof f, ['string', 'function', 'object']) > -1 )
            {
                // Callback defined as function name or function
                // !!! Remember !!!
                // If you are using typeof string, function must be callable globally (window context)
                if( typeof f === 'string' )
                {
                    f = window[f];
                }

                f(origin.options, origin.env, time);

                origin.Base.debug({
                    'Callback onTime': time+' '+ typeof f +' raised'
                });

            }else{

                origin.Base.debug({
                    'Callback onTime': time+' '+ typeof f +' is not a function, but: '+(typeof f)
                });
            }
        }
    };
};
