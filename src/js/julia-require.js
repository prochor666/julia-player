/* *****************************************
* JuliaPlayer HTML5 media player
* Require
* Require vendor libs
****************************************** */
JuliaPlayer.prototype._Require = function(origin)
{
    var self = this;

    self.js = function(scripts)
    {
        if(typeof scripts === 'string')
        {
            scripts = [scripts];
        }

        if(scripts.length == 0)
        {
            self.raiseEvent("julia.no-plugins");

        }else{

            var last = scripts[scripts.length - 1];
            self.load(scripts, 0, last);
        }
    };




    self.raiseEvent = function(eventName)
    {
        setTimeout( function()
        {
            if($('#julia-player-'+origin.env.ID).length == 1)
            {
                $('#julia-player-'+origin.env.ID).trigger({
                    type: eventName,
                });
            }else{
                self.raiseEvent(eventName);
            }
        }, 20);
    };




    self.load = function(scripts, i, last)
    {
        var script = scripts[i];

        origin.Base.debug({
            'Require-js request': script
        });

        $.getScript(script).done( function()
        {
            origin.Base.debug({
                'Require-js loaded': script
            });

            if( last == script )
            {
                self.raiseEvent("julia.plugins-loaded");

            }else{
                self.load(scripts, i+1, last);
            }
        });
    };




    self.css = function(styles)
    {
        if(typeof styles === 'string')
        {
            styles = [styles];
        }

        for(i in styles)
        {
            $('head').append($('<link rel="stylesheet" type="text/css" href="'+styles[i]+'">'));
        }
    };
};
