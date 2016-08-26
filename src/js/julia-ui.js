/* *****************************************
* Julia HTML5 media player
* User interface
* complete DOM model
****************************************** */
Julia.prototype._Ui = function(origin)
{
    var self = this;

    self.create = function()
    {
        if(origin.env.instance.length>0)
        {
            origin.env.instance.remove();
            origin.env.instance = {};
        };

        // Main container
        origin.env.instance = $('<div class="julia-player julia-fullscreen-off julia-theme-'+origin.options.theme+'" id="julia-player-'+origin.env.ID+'">'
                    +'</div>');

        // Containers
        origin.env.model.shield = $('<div class="julia-shield" id="julia-shield-'+origin.env.ID+'"></div>');

        origin.env.model.preloader = $('<div class="julia-preloader">'
            +'<div class="julia-preloader-run"></div></div>');

        origin.env.model.suggest = $('<div class="julia-suggest" id="julia-suggest-'+origin.env.ID+'"></div>');

        origin.env.model.toolbar = $('<div class="julia-toolbar" id="julia-toolbar-'+origin.env.ID+'"></div>');

        // Buttons
        origin.env.model.buttons.bigPlay = $('<button class="julia-btn julia-big-play"><i class="julia-icon julia-play-circle"></i></button>');

        origin.env.model.buttons.play = $('<button class="julia-btn julia-playback play">'
        +'    <i class="julia-icon julia-play"></i>'
        +'</button>');

        origin.env.model.buttons.sound = $('<button class="julia-btn julia-sound on">'
        +'    <i class="julia-icon julia-sound-on"></i>'
        +'</button>');

        origin.env.model.buttons.fullscreen = $('<button class="julia-btn julia-fullscreen-toggle on">'
        +'    <i class="julia-icon julia-fullscreen"></i>'
        +'</button>');

        // Range bars
        origin.env.model.ranges.volume = $('<div class="julia-volume">'
        +'  <input type="range" value="'+origin.options.volume+'" min="0" max="100" step="1" class="julia-range">'
        +'</div>');

        origin.env.model.ranges.progress = $('<div class="julia-progress">'
        +'  <input type="range" value="0" min="0" max="100" step="'+origin.env.progressStep+'" class="julia-range">'
        +'</div>');

        // Passive info panels
        origin.env.model.panels.live = $('<div class="julia-panel julia-live-indicator">'
        +'    <span>'+origin.options.i18n.liveText+'</span>'
        +'</div>');

        origin.env.model.panels.currentTime = $('<div class="julia-panel julia-currentTime">'
        +'    <span>00:00:00</span>&nbsp;/&nbsp;'
        +'</div>');

        origin.env.model.panels.duration = $('<div class="julia-panel julia-duration">'
        +'    <span>00:00:00</span>'
        +'</div>');


        // Compose player object
        origin.env.model.shield
        .append([
            origin.env.model.preloader,
            origin.env.model.buttons.bigPlay
        ]);

        origin.env.model.toolbar
        .append([
            origin.env.model.ranges.progress,
            origin.env.model.panels.live,
            origin.env.model.panels.currentTime,
            origin.env.model.panels.duration,
            origin.env.model.buttons.play,
            origin.env.model.buttons.sound,
            origin.env.model.ranges.volume,
            origin.env.model.buttons.fullscreen
        ]);

        origin.env.instance
        .append([
            origin.env.model.shield,
            origin.env.model.suggest,
            origin.env.model.toolbar
        ]);

        // Player default states
        origin.env.element.hide();
        origin.env.model.toolbar.hide();
        origin.env.model.buttons.bigPlay.hide();
        origin.Ui.state(origin.env.model.preloader, '', 'on');

        origin.env.instance.insertAfter(origin.env.element);

        // Rangeslider polyfill
        $('#julia-toolbar-'+origin.env.ID+'>div.julia-progress>input, #julia-toolbar-'+origin.env.ID+'>div.julia-volume>input').rangeslider({
            polyfill: false,
            rangeClass: 'julia-rangeslider',
            disabledClass: 'julia-rangeslider--disabled',
            horizontalClass: 'julia-rangeslider--horizontal',
            verticalClass: 'julia-rangeslider--vertical',
            fillClass: 'julia-rangeslider__fill',
            handleClass: 'julia-rangeslider__handle',
            onInit: function(){},
            onSlide : function(position, value){},
            onSlideEnd : function(position, value){}
        });

        origin.Base.debug({
            'playerInstance': origin.env.instance,
        });
    };




    self.icon = function(element, remove, add)
    {
        element.find('i')
        .removeClass(remove)
        .addClass(add);
    };




    self.state = function(element, remove, add)
    {
        element.removeClass(remove)
        .addClass(add);
    };




    self.progress = function(element, value)
    {
        element.find('input[type="range"]').val(value).rangeslider('update', true);
    };




    self.panel = function(element, value)
    {
        element.find('span').text(value);
    };




    self.posterSet = function()
    {
        self.posterUnset();

        if(origin.env.model.poster.length > 0)
        {
            img = $('<img src="'+origin.env.model.poster+'" width="100%" height="100%">')
            origin.env.model.shield.append(img);

            origin.Base.debug({
                poster: origin.env.model.poster,
            })
        }
    };




    self.posterUnset = function()
    {
        origin.env.model.shield.find('img').remove();
    };

}
