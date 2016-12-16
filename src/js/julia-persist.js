/* *****************************************
* JuliaPlayer HTML5 media player
* Persistent settings
* options are stored in cookies
****************************************** */
JuliaPlayer.prototype._Persist = function(origin)
{
    var self = this;

    self.set = function(name, value, days)
    {
        dateObj = new Date();
        dateObj.setTime(dateObj.getTime() + (days*24*60*60*1000));
        var expires = 'expires=' + dateObj.toUTCString();
        document.cookie = name + '=' + value + '; ' + expires + '; path=/';
    };




    self.get = function(name)
    {
        var name = name + '=';
        var ca = document.cookie.split(';');

        for(var i=0; i<ca.length; i++)
        {
            var c = ca[i];

            while(c.charAt(0)==' ')
            {
                c = c.substring(1);
            }

            if(c.indexOf(name) == 0)
            {
                return c.substring(name.length,c.length);
            }
        }

        return undefined;
    };
};
