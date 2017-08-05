/* *****************************************
* JuliaPlayer HTML5 player
* Timeline thumbnails
****************************************** */
JuliaPlayer.prototype._Thumbs = function (origin) {
    var self = this;
    self.shadowApi = false;
    self.canvas = false;
    self.context = false;
    self.imageThumb = false;
    self.imageCache = {};
    // Create shadow api and grab thumbnail
    self.dim = function (i) {
        var dim = [
            origin.env.instance.width(),
            origin.env.instance.height()
        ];
        var a = dim[1] / dim[0];
        var dimensions = [
            128,
            128 * a
        ];
        return dimensions;
    };
    // Create 100 thumbs
    self.thumb = function (t) {
        var dimensions = self.dim(i);
        var width = Math.floor(dimensions[0]);
        var height = Math.floor(dimensions[1]);
        if (self.shadowApi === false) {
            self.imageCache = {};
            origin.env.labels.goto.css({
                width: dimensions[0] + 10 + 'px',
                height: 40 + dimensions[1] + 10 + 'px',
                overflow: 'hidden'
            });
            self.canvas = document.createElement('canvas');
            self.canvas.width = width;
            self.canvas.height = height;
            self.context = self.canvas.getContext('2d');
            self.imageThumb = document.createElement('img');
            self.imageThumb.style.width = width + 'px';
            self.imageThumb.style.height = height + 'px';
            origin.env.labels.goto.find('img').remove();
            origin.env.labels.goto.append(self.imageThumb);
            //document.createElement('video');
            //console.log(origin.env.api);
            self.shadowApi = origin.env.api.cloneNode(true);
            self.shadowApi.width = width;
            self.shadowApi.height = height;
            self.shadowApi.preload = 'auto';
            // ************************
            // HLS library supported
            // and HLS requested
            // ************************
            if (origin.env.mode === 'hls') {
                self.hls = new Hls(origin.options.hlsConfig);    // ************************
                                                                 // Dash
                                                                 // ************************
            } else if (origin.env.mode === 'dash') {
            } else {
                self.shadowApi.src = origin.options.source.file;
            }
            // ************************
            // HLS library supported
            // and HLS requested
            // ************************
            if (origin.env.mode === 'hls') {
                self.hls.autoLevelCapping = -1;
                self.hls.attachMedia(self.shadowApi);
                self.hls.loadSource(origin.options.source.file);    // ************************
                                                                    // Usig DASH library
                                                                    // ************************
            } else if (origin.env.mode === 'dash') {
                self.dash = dashjs.MediaPlayer().create();
                self.dash.initialize();
                self.dash.attachView(self.shadowApi);
                self.dash.attachSource(origin.options.source.file);
                self.dash.setAutoPlay(false);
                self.dash.getDebug().setLogToBrowserConsole(false);    // ************************
                                                                       // Classic VOD file
                                                                       // ************************
            } else {
                self.shadowApi.load();
            }
        }
        origin.env.thumbsOk = false;
        index = Math.floor(t);
        if (index in self.imageCache) {
            self.image(width, height, index);
        } else {
            self.shadowApi.currentTime = index;
            self.image(width, height, index);
        }
    };
    self.image = function (width, height, index) {
        if (index in self.imageCache) {
            self.imageThumb.src = self.imageCache[index];
            origin.env.thumbsOk = true;
        } else if (parseInt(self.shadowApi.readyState) == 4) {
            self.context.drawImage(self.shadowApi, 0, 0, width, height);
            dataURL = self.canvas.toDataURL();
            if (dataURL != null && dataURL != undefined) {
                self.cache(index, dataURL);
                self.imageThumb.src = dataURL;
            }
            origin.env.thumbsOk = true;
        } else {
            setTimeout(function () {
                self.image(width, height, index);
            }, 70);
        }
    };
    self.cache = function (index, data) {
        if (index in self.imageCache) {
            return self.imageCache[index];
        } else {
            self.imageCache[index] = data;
        }
        return data;
    };
};
