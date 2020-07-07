/* *****************************************
* JuliaPlayer HTML5 player
* Switcher
* detect and switch video and audio tracks
****************************************** */
JuliaPlayer.prototype._Switcher = function (origin) {
    var self = this;
    self.getBitrateList = function (type) {
        switch (origin.env.mode) {
        case 'dash':
            return origin.env.dash.getBitrateInfoListFor(type);
            break;
        case 'hls':
            return origin.env.hls.levels;
            break;
        default:
            return [];
        }
    };
    // Manual bitrate
    self.getBitrate = function (type) {
        switch (origin.env.mode) {
        case 'dash':
            return origin.env.dash.getQualityFor(type);
            break;
        case 'hls':
            return origin.env.hls.currentLevel;
            break;
        default:
            return 0;
        }
    };
    self.setBitrate = function (type, value) {
        switch (origin.env.mode) {
        case 'dash':
            origin.env.dash.setQualityFor(type, value);
            break;
        case 'hls':
            origin.env.hls.currentLevel = value;
            break;
        default:    
            //---------
        }
    };
    // Automatic bitrate
    self.getAutoBitrate = function (type) {
        switch (origin.env.mode) {
        case 'dash':
            return origin.env.dash.getSettings().streaming.abr.autoSwitchBitrate[type];
            break;
        case 'hls':
            return origin.env.hls.autoLevelEnabled;
            break;
        default:
            return true;
        }
    };
    self.setAutoBitrate = function (type, value) {
        switch (origin.env.mode) {
        case 'dash':
            var setting = {
                'streaming': {
                    'abr': {
                        'autoSwitchBitrate': {}
                    },
                },
            };
            setting[type] = value;
            origin.env.dash.updateSettings(setting);
            //origin.env.dash.setAutoSwitchQualityFor(type, value);
            break;
        case 'hls':
            if (type == 'video' && value === true) {
                origin.env.hls.currentLevel = -1;
            }
            break;
        default:    //---------
        }
    };
    self.getTracks = function (type) {
        switch (origin.env.mode) {
        case 'dash':
            return origin.env.dash.getTracksFor(type);
            break;
        case 'hls':
            if (type === 'audio') {
                return origin.env.hls.audioTracks;
            }
            if (type === 'text') {
                return origin.env.hls.subtitleTracks;
            }
            
            break;
        default:    //---------
        }
    };
    self.setTrack = function (type, track) {
        switch (origin.env.mode) {
        case 'dash':
            var t = origin.Switcher.getTracks(type);
            origin.env.dash.setCurrentTrack(t[track]);
            break;
        case 'hls':
            origin.env.hls.audioTrack = track;
            break;
        default:    //---------
        }
    };
    self.prepareTrackMenu = function (data, menuData, active) {
        menuData = typeof menuData !== 'object' ? [] : menuData;
        active = typeof active !== 'number' ? 1 : active;
        switch (origin.env.mode) {
        case 'dash':
            for (var i in data) {
                menuData.push({
                    active: active,
                    value: i,
                    title: data[i].lang
                });
            }
            break;
        case 'hls':
            for (var i in data) {
                menuData.push({
                    active: active,
                    value: i,
                    title: data[i].name ? data[i].name : data[i].lang
                });
            }
            break;
        default:
        }
        return self.uniqueMenuItems(menuData);
    };
    self.prepareBitrateMenu = function (data, menuData, active) {
        menuData = typeof menuData !== 'object' ? [] : menuData;
        active = typeof active !== 'number' ? 0 : active;
        switch (origin.env.mode) {
        case 'dash':
            for (var i in data) {
                menuData.push({
                    active: active,
                    value: data[i].qualityIndex,
                    title: origin.Support.bitrate(data[i].bitrate)
                });
            }
            break;
        case 'hls':
            for (var i in data) {
                menuData.push({
                    active: active,
                    value: i,
                    title: origin.Support.bitrate(data[i].bitrate)
                });
            }
            break;
        default:
        }
        return self.uniqueMenuItems(menuData);
    };
    self.translateItems = function (menuData, key, translation) {
        if (translation.length > 0) {
            for (var i in menuData) {
                menuData[i] = self.mergeItem(menuData[i], key, translation);
            }
        }
        return menuData;
    };
    self.mergeItem = function (obj, key, translation) {
        for (var i in translation) {
            if (origin.Support.hasAttr(translation[i], 'key') === true 
                && origin.Support.hasAttr(obj, translation[i]['key']) === true 
                && origin.Support.hasAttr(translation[i], 'find') === true 
                && origin.Support.hasAttr(translation[i], 'replace') === true 
                && obj[translation[i]['key']] == translation[i]['find'] 
            ) {
                obj.title = translation[i]['replace'];
                return obj;
            }
        }
        return obj;
    };
    self.uniqueMenuItems = function (data) {
        var u = [], ids = [];
        for (var i in data) {
            if (ids.indexOf(data[i].value) == -1) {
                u.push(data[i]);
                ids.push(data[i].value);
            }
        }
        return u;
    };
};
