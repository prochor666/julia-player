/* *****************************************
* JuliaPlayer HTML5 player
* User interface, DOM model
****************************************** */
JuliaPlayer.prototype._Ui = function (origin) {
    var self = this;
    self.create = function () {
        if (origin.env.instance.length > 0) {
            origin.env.instance.remove();
        }
        platformClass = origin.Support.isMobile() === false ? 'julia-desktop' : 'julia-mobile';
        // Main container
        origin.env.instance = $('<div class="julia-player off julia-fullscreen-off julia-' + origin.env.ID + ' ' + platformClass + '" id="julia-' + origin.env.ID + '"></div>');
        // Wrapper
        origin.env.wrapper = $('<div class="julia-wrapper"><video class="julia-video" id="julia-api-' + origin.env.ID + '" preload="auto" webkit-playsinline playsinline></video></div>');
        // Shield
        origin.env.shield = $('<div class="julia-shield" id="julia-shield-' + origin.env.ID + '"></div>');
        // Preloader
        origin.env.preloader = $('<div class="julia-preloader"></div>');
        // Suggest
        origin.env.suggest = $('<div class="julia-suggest" id="julia-suggest-' + origin.env.ID + '"></div>');
        // Toolbars
        origin.env.toolbarTop = $('<div class="julia-toolbar julia-toolbar-top" id="julia-toolbar-top-' + origin.env.ID + '"></div>');
        origin.env.toolbarBottom = $('<div class="julia-toolbar julia-toolbar-bottom" id="julia-toolbar-bottom-' + origin.env.ID + '"></div>');
        // Messaging layer
        origin.env.notifier = $('<div class="julia-notifier" id="julia-notifier-' + origin.env.ID + '"></div>');
        // Buttons
        origin.env.buttons.bigPlay = $('<button class="julia-btn julia-big-play"><i class="julia-icon julia-play-circle"></i></button>');
        origin.env.buttons.play = $('<button class="julia-btn julia-play play">' + '    <i class="julia-icon julia-play"></i>' + '</button>');
        origin.env.buttons.next = $('<button class="julia-btn julia-next" title="' + origin.env.i18n.next + '">' + '    <i class="julia-icon julia-chevron-right"></i>' + '</button>');
        origin.env.buttons.previous = $('<button class="julia-btn julia-previous" title="' + origin.env.i18n.previous + '">' + '    <i class="julia-icon julia-chevron-left"></i>' + '</button>');
        origin.env.buttons.close = $('<button class="julia-btn julia-close" title="' + origin.env.i18n.close + '">' + '    <i class="julia-icon julia-close"></i>' + '</button>');
        origin.env.buttons.fullscreen = $('<button class="julia-btn julia-fullscreen on">' + '    <i class="julia-icon julia-fullscreen"></i>' + '</button>');
        origin.env.buttons.sound = $('<button class="julia-btn julia-sound on">' + '    <i class="julia-icon julia-sound-on"></i>' + '</button>');
        origin.env.buttons.settings = $('<button class="julia-btn julia-settings off">' + '    <i class="julia-icon julia-gear"></i>' + '</button>');
        // Range bars
        origin.env.ranges.volume = $('<div class="julia-volume">' + '  <input type="range" value="' + origin.options.volume + '" min="0" max="100" step="1" class="julia-range">' + '</div>');
        origin.env.ranges.progress = $('<div class="julia-progress">' + '  <input type="range" value="0" min="0" max="100" step="' + origin.env.progressStep + '" class="julia-range">' + '</div>');
        // Labels
        origin.env.labels.goto = $('<div class="julia-label julia-label-goto">' + '    <span>00:00:00</span>' + '</div>');
        // Menus
        origin.env.menus.settings = $('<div class="julia-menu julia-menu-settings">' + '    <div class="julia-menu-title">' + origin.options.i18n.settings + '</div>' + '    <table><tbody></tbody></table>' + +'</div>');
        // Menu blocks
        origin.env.menus.video = $('<tr class="julia-menu-item julia-menu-item-video"><td class="julia-menu-item-title">' + origin.options.i18n.video + '</td><td><div class="julia-dropdown"><select name="video" class="julia-dropdown-select" disabled="disabled"></select></div>' + '</td></tr>');
        origin.env.menus.audio = $('<tr class="julia-menu-item julia-menu-item-audio"><td class="julia-menu-item-title">' + origin.options.i18n.audio + '</td><td><div class="julia-dropdown"><select name="audio" class="julia-dropdown-select" disabled="disabled"></select></div>' + '</td></tr>');
        origin.env.menus.audioTracks = $('<tr class="julia-menu-item julia-menu-item-audioTracks"><td class="julia-menu-item-title">' + origin.options.i18n.audioTracks + '</td><td><div class="julia-dropdown"><select name="audioTracks" class="julia-dropdown-select" disabled="disabled"></select></div>' + '</td></tr>');
        origin.env.menus.subtitles = $('<tr class="julia-menu-item julia-menu-item-subtitles"><td class="julia-menu-item-title">' + origin.options.i18n.subtitles + '</td><td><div class="julia-dropdown"><select name="subtitles" class="julia-dropdown-select" disabled="disabled"></select></div>' + '</td></tr>');
        origin.env.menus.speed = $('<tr class="julia-menu-item julia-menu-item-speed on"><td class="julia-menu-item-title">' + origin.options.i18n.speed + '</td><td><div class="julia-dropdown"><select name="speed" class="julia-dropdown-select"></select></div>' + '</td></tr>');
        // Passive info panels
        origin.env.panels.title = $('<div class="julia-panel julia-title">' + '    <span></span>' + '</div>');
        origin.env.panels.live = $('<div class="julia-panel julia-live-indicator">' + '    <span>' + origin.options.i18n.liveText + '</span>' + '</div>');
        origin.env.panels.currentTime = $('<div class="julia-panel julia-currentTime">' + '    <span>00:00:00</span>' + '</div>');
        origin.env.panels.duration = $('<div class="julia-panel julia-duration">' + '    <span>00:00:00</span>' + '</div>');
        //--odn-handle-start--
        origin.env.toolbarBottom.append([
            origin.env.buttons.play,
            origin.env.buttons.sound,
            origin.env.buttons.fullscreen,
            origin.env.buttons.settings,
            origin.env.ranges.progress,
            origin.env.ranges.volume,
            origin.env.panels.currentTime,
            origin.env.panels.duration,
            origin.env.labels.goto
        ]);
        origin.env.toolbarTop.append([origin.env.panels.title]);
        // Build menu
        origin.env.menus.settings.find('tbody').append([
            origin.env.menus.video,
            origin.env.menus.audio,
            origin.env.menus.audioTracks,
            origin.env.menus.speed,
            origin.env.menus.subtitles
        ]);
        origin.Ui.menu(origin.env.menus.speed, origin.options.i18n.speedItems);
        // Compose content DOM object
        origin.env.wrapper.append([
            origin.env.shield,
            origin.env.suggest,
            origin.env.notifier,
            origin.env.buttons.bigPlay,
            origin.env.preloader,
            origin.env.toolbarTop,
            origin.env.toolbarBottom,
            origin.env.menus.settings
        ]);
        if (origin.options.autoplay === true && origin.Support.isMobile() === false) {
            origin.env.buttons.bigPlay.hide();
        }
        // Compose final object
        origin.env.instance.append([origin.env.wrapper]);
        origin.env.element.append(origin.env.instance);
        origin.debug({
            'Julia instance created': origin.env.instance,
            'Julia instance appended to': origin.env.element
        });
        // Video api
        origin.env.api = document.getElementById('julia-api-' + origin.env.ID);
        origin.env.api.controls = false;
        origin.debug({ 'Api object': 'julia-api-' + origin.env.ID });
        self.zIndexize();
        origin.Ui.state(origin.env.instance, '', 'on');
        origin.event('julia.ui-created', origin.env.instance);    //--odn-handle-stop--
    };
    self.icon = function (element, remove, add) {
        element.find('i').removeClass(remove).addClass(add);
    };
    self.state = function (element, remove, add) {
        element.removeClass(remove).addClass(add);
    };
    self.panel = function (element, value) {
        element.find('span').text(value);
    };
    self.notify = function (message) {
        origin.env.notifier.html(message);
        if (message.length > 0) {
            self.state(origin.env.notifier, '', 'on');
        } else {
            self.state(origin.env.notifier, 'on', '');
        }
    };
    self.reset = function () {
        origin.Ui.state(origin.env.menus.video, 'on', '');
        origin.Ui.menuDisabled(origin.env.menus.video, true);
        origin.Ui.state(origin.env.menus.audio, 'on', '');
        origin.Ui.menuDisabled(origin.env.menus.audio, true);
        origin.Ui.state(origin.env.menus.audioTracks, 'on', '');
        origin.Ui.menuDisabled(origin.env.menus.audioTracks, true);
        origin.Ui.state(origin.env.menus.subtitles, 'on', '');
        origin.Ui.menuDisabled(origin.env.menus.subtitles, true);
    };
    self.menu = function (element, data) {
        element.find('select>option').remove();
        for (i in data) {
            s = $('<option value="' + data[i].value + '">' + data[i].title + '</option>');
            if (Object.keys(data[i]).indexOf('active') > -1 && data[i].value == data[i].active) {
                s.prop('selected', true);
            }
            element.find('select').append(s);
        }
    };
    self.menuDisabled = function (element, state) {
        element.find('select').prop('disabled', state);
    };
    self.zIndexize = function () {
        var indexHighest = origin.options.zIndexStart;
        var layers = [
            origin.env.instance,
            origin.env.wrapper,
            $('#julia-api-' + origin.env.ID),
            origin.env.preloader,
            origin.env.shield,
            origin.env.toolbarTop,
            origin.env.toolbarBottom,
            origin.env.suggest,
            origin.env.menus.settings,
            origin.env.buttons.bigPlay,
            origin.env.notifier,
        ];
        layers.map(function (x, i) {
            layers[i].css({ 'z-index': indexHighest + i });
            return x;
        });
    };
};
