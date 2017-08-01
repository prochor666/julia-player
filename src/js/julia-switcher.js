/* *****************************************
* JuliaPlayer HTML5 player
* Switcher
* detect and switch video and audio tracks
****************************************** */
JuliaPlayer.prototype._Switcher = function(origin)
{
    var self = this;


    self.getBitrateList = function(type)
    {
        switch( origin.env.mode )
        {
            case 'dash':
                return origin.env.dash.getBitrateInfoListFor(type);
            break; case 'hls':
                return origin.env.hls.levels;
            break; default:
                return [];
        };
    };


    // Manual bitrate
    self.getBitrate = function(type)
    {
        switch( origin.env.mode )
        {
            case 'dash':
                return origin.env.dash.getQualityFor(type);
            break; case 'hls':
                return origin.env.hls.currentLevel;
            break; default:
                return 0;
        };
    };


    self.setBitrate = function(type, value)
    {
        switch( origin.env.mode )
        {
            case 'dash':
                origin.env.dash.setQualityFor(type, value);
            break; case 'hls':
                origin.env.hls.currentLevel = value;
            break; default:
                //---------
        };
    };


    // Automatic bitrate
    self.getAutoBitrate = function(type)
    {
        switch( origin.env.mode )
        {
            case 'dash':
                return origin.env.dash.getAutoSwitchQualityFor(type);
            break; case 'hls':
                return origin.env.hls.autoLevelEnabled;
            break; default:
                return true;
        };
    };


    self.setAutoBitrate = function(type, value)
    {
        switch( origin.env.mode )
        {
            case 'dash':
                origin.env.dash.setAutoSwitchQualityFor(type, value);
            break; case 'hls':

                if(type == 'video' && value === true)
                {
                    origin.env.hls.currentLevel = -1;
                }
            break; default:
                //---------
        };
    };


    self.getTracks = function(type)
    {
        switch( origin.env.mode )
        {
            case 'dash':
                return origin.env.dash.getTracksFor(type);
            break; case 'hls':
                return origin.env.hls.audioTracks;
            break; default:
                //---------
        };
    }


    self.setTrack = function(type, track)
    {
        switch( origin.env.mode )
        {
            case 'dash':
                t = origin.Switcher.getTracks(type);
                origin.env.dash.setCurrentTrack(t[track]);
            break; case 'hls':
                origin.env.hls.audioTrack = track;
            break; default:
                //---------
        };
    }



    self.prepareTrackMenu = function(data, menuData, active)
    {
        menuData = typeof menuData !== 'object' ? []: menuData;
        active = typeof active !== 'number' ? 1: active;

        switch( origin.env.mode )
        {
            case 'dash':
                for( i in data )
                {
                    menuData.push({
                        active: active,
                        value: i,
                        title: data[i].lang,
                    });
                }

            break; case 'hls':

                for( i in data )
                {
                    menuData.push({
                        active: active,
                        value: i,
                        title: data[i].name ? data[i].name: data[i].lang,
                    });
                }

            break; default:
        }
        return menuData;
    }


    self.prepareBitrateMenu = function(data, menuData, active)
    {
        menuData = typeof menuData !== 'object' ? []: menuData;
        active = typeof active !== 'number' ? 0: active;

        switch( origin.env.mode )
        {
            case 'dash':
                for( i in data )
                {
                    menuData.push({
                        active: active,
                        value: data[i].qualityIndex,
                        title: origin.Support.bitrate( data[i].bitrate ),
                    });
                }
            break; case 'hls':

                for( i in data )
                {
                    menuData.push({
                        active: active,
                        value: i,
                        title: origin.Support.bitrate( data[i].bitrate ),
                    });
                }
            break; default:
        }

        return menuData;
    }
};
