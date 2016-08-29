/*! rangeslider.js - v2.2.1 | (c) 2016 @andreruffert | MIT license | https://github.com/andreruffert/rangeslider.js */
(function(factory) {
    'use strict';

    if (typeof define === 'function' && define.amd) {
        // AMD. Register as an anonymous module.
        define(['jquery'], factory);
    } else if (typeof exports === 'object') {
        // CommonJS
        module.exports = factory(require('jquery'));
    } else {
        // Browser globals
        factory(jQuery);
    }
}(function($) {
    'use strict';

    // Polyfill Number.isNaN(value)
    // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number/isNaN
    Number.isNaN = Number.isNaN || function(value) {
        return typeof value === 'number' && value !== value;
    };

    /**
     * Range feature detection
     * @return {Boolean}
     */
    function supportsRange() {
        var input = document.createElement('input');
        input.setAttribute('type', 'range');
        return input.type !== 'text';
    }

    var pluginName = 'rangeslider',
        pluginIdentifier = 0,
        hasInputRangeSupport = supportsRange(),
        defaults = {
            polyfill: true,
            orientation: 'horizontal',
            rangeClass: 'rangeslider',
            disabledClass: 'rangeslider--disabled',
            horizontalClass: 'rangeslider--horizontal',
            verticalClass: 'rangeslider--vertical',
            fillClass: 'rangeslider__fill',
            handleClass: 'rangeslider__handle',
            startEvent: ['mousedown', 'touchstart', 'pointerdown'],
            moveEvent: ['mousemove', 'touchmove', 'pointermove'],
            endEvent: ['mouseup', 'touchend', 'pointerup']
        },
        constants = {
            orientation: {
                horizontal: {
                    dimension: 'width',
                    direction: 'left',
                    directionStyle: 'left',
                    coordinate: 'x'
                },
                vertical: {
                    dimension: 'height',
                    direction: 'top',
                    directionStyle: 'bottom',
                    coordinate: 'y'
                }
            }
        };

    /**
     * Delays a function for the given number of milliseconds, and then calls
     * it with the arguments supplied.
     *
     * @param  {Function} fn   [description]
     * @param  {Number}   wait [description]
     * @return {Function}
     */
    function delay(fn, wait) {
        var args = Array.prototype.slice.call(arguments, 2);
        return setTimeout(function(){ return fn.apply(null, args); }, wait);
    }

    /**
     * Returns a debounced function that will make sure the given
     * function is not triggered too much.
     *
     * @param  {Function} fn Function to debounce.
     * @param  {Number}   debounceDuration OPTIONAL. The amount of time in milliseconds for which we will debounce the function. (defaults to 100ms)
     * @return {Function}
     */
    function debounce(fn, debounceDuration) {
        debounceDuration = debounceDuration || 100;
        return function() {
            if (!fn.debouncing) {
                var args = Array.prototype.slice.apply(arguments);
                fn.lastReturnVal = fn.apply(window, args);
                fn.debouncing = true;
            }
            clearTimeout(fn.debounceTimeout);
            fn.debounceTimeout = setTimeout(function(){
                fn.debouncing = false;
            }, debounceDuration);
            return fn.lastReturnVal;
        };
    }

    /**
     * Check if a `element` is visible in the DOM
     *
     * @param  {Element}  element
     * @return {Boolean}
     */
    function isHidden(element) {
        return (
            element && (
                element.offsetWidth === 0 ||
                element.offsetHeight === 0 ||
                // Also Consider native `<details>` elements.
                element.open === false
            )
        );
    }

    /**
     * Get hidden parentNodes of an `element`
     *
     * @param  {Element} element
     * @return {[type]}
     */
    function getHiddenParentNodes(element) {
        var parents = [],
            node    = element.parentNode;

        while (isHidden(node)) {
            parents.push(node);
            node = node.parentNode;
        }
        return parents;
    }

    /**
     * Returns dimensions for an element even if it is not visible in the DOM.
     *
     * @param  {Element} element
     * @param  {String}  key     (e.g. offsetWidth …)
     * @return {Number}
     */
    function getDimension(element, key) {
        var hiddenParentNodes       = getHiddenParentNodes(element),
            hiddenParentNodesLength = hiddenParentNodes.length,
            inlineStyle             = [],
            dimension               = element[key];

        // Used for native `<details>` elements
        function toggleOpenProperty(element) {
            if (typeof element.open !== 'undefined') {
                element.open = (element.open) ? false : true;
            }
        }

        if (hiddenParentNodesLength) {
            for (var i = 0; i < hiddenParentNodesLength; i++) {

                // Cache style attribute to restore it later.
                inlineStyle[i] = hiddenParentNodes[i].style.cssText;

                // visually hide
                if (hiddenParentNodes[i].style.setProperty) {
                    hiddenParentNodes[i].style.setProperty('display', 'block', 'important');
                } else {
                    hiddenParentNodes[i].style.cssText += ';display: block !important';
                }
                hiddenParentNodes[i].style.height = '0';
                hiddenParentNodes[i].style.overflow = 'hidden';
                hiddenParentNodes[i].style.visibility = 'hidden';
                toggleOpenProperty(hiddenParentNodes[i]);
            }

            // Update dimension
            dimension = element[key];

            for (var j = 0; j < hiddenParentNodesLength; j++) {

                // Restore the style attribute
                hiddenParentNodes[j].style.cssText = inlineStyle[j];
                toggleOpenProperty(hiddenParentNodes[j]);
            }
        }
        return dimension;
    }

    /**
     * Returns the parsed float or the default if it failed.
     *
     * @param  {String}  str
     * @param  {Number}  defaultValue
     * @return {Number}
     */
    function tryParseFloat(str, defaultValue) {
        var value = parseFloat(str);
        return Number.isNaN(value) ? defaultValue : value;
    }

    /**
     * Capitalize the first letter of string
     *
     * @param  {String} str
     * @return {String}
     */
    function ucfirst(str) {
        return str.charAt(0).toUpperCase() + str.substr(1);
    }

    /**
     * Plugin
     * @param {String} element
     * @param {Object} options
     */
    function Plugin(element, options) {
        this.$window            = $(window);
        this.$document          = $(document);
        this.$element           = $(element);
        this.options            = $.extend( {}, defaults, options );
        this.polyfill           = this.options.polyfill;
        this.orientation        = this.$element[0].getAttribute('data-orientation') || this.options.orientation;
        this.onInit             = this.options.onInit;
        this.onSlide            = this.options.onSlide;
        this.onSlideEnd         = this.options.onSlideEnd;
        this.DIMENSION          = constants.orientation[this.orientation].dimension;
        this.DIRECTION          = constants.orientation[this.orientation].direction;
        this.DIRECTION_STYLE    = constants.orientation[this.orientation].directionStyle;
        this.COORDINATE         = constants.orientation[this.orientation].coordinate;

        // Plugin should only be used as a polyfill
        if (this.polyfill) {
            // Input range support?
            if (hasInputRangeSupport) { return false; }
        }

        this.identifier = 'js-' + pluginName + '-' +(pluginIdentifier++);
        this.startEvent = this.options.startEvent.join('.' + this.identifier + ' ') + '.' + this.identifier;
        this.moveEvent  = this.options.moveEvent.join('.' + this.identifier + ' ') + '.' + this.identifier;
        this.endEvent   = this.options.endEvent.join('.' + this.identifier + ' ') + '.' + this.identifier;
        this.toFixed    = (this.step + '').replace('.', '').length - 1;
        this.$fill      = $('<div class="' + this.options.fillClass + '" />');
        this.$handle    = $('<div class="' + this.options.handleClass + '" />');
        this.$range     = $('<div class="' + this.options.rangeClass + ' ' + this.options[this.orientation + 'Class'] + '" id="' + this.identifier + '" />').insertAfter(this.$element).prepend(this.$fill, this.$handle);

        // visually hide the input
        this.$element.css({
            'position': 'absolute',
            'width': '1px',
            'height': '1px',
            'overflow': 'hidden',
            'opacity': '0'
        });

        // Store context
        this.handleDown = $.proxy(this.handleDown, this);
        this.handleMove = $.proxy(this.handleMove, this);
        this.handleEnd  = $.proxy(this.handleEnd, this);

        this.init();

        // Attach Events
        var _this = this;
        this.$window.on('resize.' + this.identifier, debounce(function() {
            // Simulate resizeEnd event.
            delay(function() { _this.update(false, false); }, 300);
        }, 20));

        this.$document.on(this.startEvent, '#' + this.identifier + ':not(.' + this.options.disabledClass + ')', this.handleDown);

        // Listen to programmatic value changes
        this.$element.on('change.' + this.identifier, function(e, data) {
            if (data && data.origin === _this.identifier) {
                return;
            }

            var value = e.target.value,
                pos = _this.getPositionFromValue(value);
            _this.setPosition(pos);
        });
    }

    Plugin.prototype.init = function() {
        this.update(true, false);

        if (this.onInit && typeof this.onInit === 'function') {
            this.onInit();
        }
    };

    Plugin.prototype.update = function(updateAttributes, triggerSlide) {
        updateAttributes = updateAttributes || false;

        if (updateAttributes) {
            this.min    = tryParseFloat(this.$element[0].getAttribute('min'), 0);
            this.max    = tryParseFloat(this.$element[0].getAttribute('max'), 100);
            this.value  = tryParseFloat(this.$element[0].value, Math.round(this.min + (this.max-this.min)/2));
            this.step   = tryParseFloat(this.$element[0].getAttribute('step'), 1);
        }

        this.handleDimension    = getDimension(this.$handle[0], 'offset' + ucfirst(this.DIMENSION));
        this.rangeDimension     = getDimension(this.$range[0], 'offset' + ucfirst(this.DIMENSION));
        this.maxHandlePos       = this.rangeDimension - this.handleDimension;
        this.grabPos            = this.handleDimension / 2;
        this.position           = this.getPositionFromValue(this.value);

        // Consider disabled state
        if (this.$element[0].disabled) {
            this.$range.addClass(this.options.disabledClass);
        } else {
            this.$range.removeClass(this.options.disabledClass);
        }

        this.setPosition(this.position, triggerSlide);
    };

    Plugin.prototype.handleDown = function(e) {
        this.$document.on(this.moveEvent, this.handleMove);
        this.$document.on(this.endEvent, this.handleEnd);

        // If we click on the handle don't set the new position
        if ((' ' + e.target.className + ' ').replace(/[\n\t]/g, ' ').indexOf(this.options.handleClass) > -1) {
            return;
        }

        var pos         = this.getRelativePosition(e),
            rangePos    = this.$range[0].getBoundingClientRect()[this.DIRECTION],
            handlePos   = this.getPositionFromNode(this.$handle[0]) - rangePos,
            setPos      = (this.orientation === 'vertical') ? (this.maxHandlePos - (pos - this.grabPos)) : (pos - this.grabPos);

        this.setPosition(setPos);

        if (pos >= handlePos && pos < handlePos + this.handleDimension) {
            this.grabPos = pos - handlePos;
        }
    };

    Plugin.prototype.handleMove = function(e) {
        e.preventDefault();
        var pos = this.getRelativePosition(e);
        var setPos = (this.orientation === 'vertical') ? (this.maxHandlePos - (pos - this.grabPos)) : (pos - this.grabPos);
        this.setPosition(setPos);
    };

    Plugin.prototype.handleEnd = function(e) {
        e.preventDefault();
        this.$document.off(this.moveEvent, this.handleMove);
        this.$document.off(this.endEvent, this.handleEnd);

        // Ok we're done fire the change event
        this.$element.trigger('change', { origin: this.identifier });

        if (this.onSlideEnd && typeof this.onSlideEnd === 'function') {
            this.onSlideEnd(this.position, this.value);
        }
    };

    Plugin.prototype.cap = function(pos, min, max) {
        if (pos < min) { return min; }
        if (pos > max) { return max; }
        return pos;
    };

    Plugin.prototype.setPosition = function(pos, triggerSlide) {
        var value, newPos;

        if (triggerSlide === undefined) {
            triggerSlide = true;
        }

        // Snapping steps
        value = this.getValueFromPosition(this.cap(pos, 0, this.maxHandlePos));
        newPos = this.getPositionFromValue(value);

        // Update ui
        this.$fill[0].style[this.DIMENSION] = (newPos + this.grabPos) + 'px';
        this.$handle[0].style[this.DIRECTION_STYLE] = newPos + 'px';
        this.setValue(value);

        // Update globals
        this.position = newPos;
        this.value = value;

        if (triggerSlide && this.onSlide && typeof this.onSlide === 'function') {
            this.onSlide(newPos, value);
        }
    };

    // Returns element position relative to the parent
    Plugin.prototype.getPositionFromNode = function(node) {
        var i = 0;
        while (node !== null) {
            i += node.offsetLeft;
            node = node.offsetParent;
        }
        return i;
    };

    Plugin.prototype.getRelativePosition = function(e) {
        // Get the offset DIRECTION relative to the viewport
        var ucCoordinate = ucfirst(this.COORDINATE),
            rangePos = this.$range[0].getBoundingClientRect()[this.DIRECTION],
            pageCoordinate = 0;

        if (typeof e['page' + ucCoordinate] !== 'undefined') {
            pageCoordinate = e['page' + ucCoordinate];
        }
        // IE8 support :)
        else if (typeof e.originalEvent['client' + ucCoordinate] !== 'undefined') {
            pageCoordinate = e.originalEvent['client' + ucCoordinate];
        }
        else if (e.originalEvent.touches && e.originalEvent.touches[0] && typeof e.originalEvent.touches[0]['page' + ucCoordinate] !== 'undefined') {
            pageCoordinate = e.originalEvent.touches[0]['page' + ucCoordinate];
        }
        else if(e.currentPoint && typeof e.currentPoint[this.COORDINATE] !== 'undefined') {
            pageCoordinate = e.currentPoint[this.COORDINATE];
        }

        return pageCoordinate - rangePos;
    };

    Plugin.prototype.getPositionFromValue = function(value) {
        var percentage, pos;
        percentage = (value - this.min)/(this.max - this.min);
        pos = (!Number.isNaN(percentage)) ? percentage * this.maxHandlePos : 0;
        return pos;
    };

    Plugin.prototype.getValueFromPosition = function(pos) {
        var percentage, value;
        percentage = ((pos) / (this.maxHandlePos || 1));
        value = this.step * Math.round(percentage * (this.max - this.min) / this.step) + this.min;
        return Number((value).toFixed(this.toFixed));
    };

    Plugin.prototype.setValue = function(value) {
        if (value === this.value && this.$element[0].value !== '') {
            return;
        }

        // Set the new value and fire the `input` event
        this.$element
            .val(value)
            .trigger('input', { origin: this.identifier });
    };

    Plugin.prototype.destroy = function() {
        this.$document.off('.' + this.identifier);
        this.$window.off('.' + this.identifier);

        this.$element
            .off('.' + this.identifier)
            .removeAttr('style')
            .removeData('plugin_' + pluginName);

        // Remove the generated markup
        if (this.$range && this.$range.length) {
            this.$range[0].parentNode.removeChild(this.$range[0]);
        }
    };

    // A really lightweight plugin wrapper around the constructor,
    // preventing against multiple instantiations
    $.fn[pluginName] = function(options) {
        var args = Array.prototype.slice.call(arguments, 1);

        return this.each(function() {
            var $this = $(this),
                data  = $this.data('plugin_' + pluginName);

            // Create a new instance.
            if (!data) {
                $this.data('plugin_' + pluginName, (data = new Plugin(this, options)));
            }

            // Make it possible to access methods from public.
            // e.g `$element.rangeslider('method');`
            if (typeof options === 'string') {
                data[options].apply(data, args);
            }
        });
    };

    return 'rangeslider.js is available in jQuery context e.g $(selector).rangeslider(options);';

}));

/* *****************************************
* Julia HTML5 media player
*
* @author prochor666@gmail.com
* @version: 1.0.0
* @build: 2016-08-25
* @license: MIT
*
* @requires:
* jquery [required]
* hls.js [required]
* dash.js [required]
* rangeslider.js [required]
*
* Julia player constructor
* options, environment, theme
****************************************** */
var Julia = function(options)
{
    var origin = this;




    // Import origin.options
    options = typeof options === 'undefined' ? {}: options;




    // Root path workaround
    var __JULIA_ROOT_PATH__ = 'julia';
    dir = $('script[src*="julia-player"], script[src*="julia-base"]').attr('src');
    name = dir.split('/').pop();
    __JULIA_ROOT_PATH__ = dir.replace('/js/'+name,"");

    // DEV wrokaround
    __JULIA_ROOT_PATH__ = __JULIA_ROOT_PATH__.replace('src', 'dist');

    // Unique instance ID
    var __JULIA_INSTANCE__ID__ = Math.floor((Math.random()*10000000)+1);




    // Default origin.options
    origin.options = {
        source: false,
        autoplay: false,
        volume: 25,
        element: $('video'),
        muted: false,
        width: 512,
        height: 288,
        debug: false,
        debugPlayback: false,
        force: false,
        live: false,
        responsive: true,
        dimensions: [
            [1920, 1080],
            [1280,720],
            [960,540],
            [640,360],
            [512,288]
        ],
        pauseOnClick: false,
        poster: '',
        hlsConfig: {
            debug: false
        },
        dashConfig: {
        },
        suggest: [],
        suggestLimit: 2,
        suggestTimeout: 10000,
        themePath: __JULIA_ROOT_PATH__+'/css/themes',
        pluginPath: __JULIA_ROOT_PATH__+'/js/lib',
        require: [],
        theme: 'default',
        i18n: {
            liveText: 'Live'
        },
        onTime: {},
        triggerHls: {},
        triggerDash: {},
        onPlay: false,
        onPause: false,
        onStop: false,
        onPosition: false,
        onSuggest: false,
    };




    // Environment
    origin.env = {
        element: origin.options.element,
        instance: {},
        ID: __JULIA_INSTANCE__ID__,
        api: {},
        model: {
            container: '',
            shield: '',
            toolbar: '',
            poster: '',
            suggest: '',
            preloader: '',
            buttons: {
                bigPlay: '',
                play: '',
                sound: '',
                fullscreen: '',
            },
            ranges: {
                volume: '',
                progress: ''
            },
            panels: {
                live: '',
                currentTime: '',
                duration: ''
            }
        },
        isLive: false,
        hls: false,
        dash: false,
        canPlayMedia: '',
        canPlayMediaString: '',
        isHls: false,
        isDash: false,
        useHlsLib: false,
        source: '',
        duration: 0,
        apiOk: false,
        onTimeRised: [],
        seeking: false,
        dimensions: {
            width: 0,
            height: 0,
        },
        started: false,
        publicApi: {},
        suggestPointer: 0,
        suggestClicked: false,
        progressStep: 0.01, // Full sense: 100, so .01 is enough accurate
    };




    // Base functions
    origin.Base = {};




    // Console debug
    origin.Base.debug = function(data)
    {
        if(origin.options.debug === true)
        {
            if(window.console)
            {
                for(d in data)
                {
                    console.log(' - [instance: '+origin.env.ID+'] '+d+' ['+(typeof data[d])+']', data[d]);
                }
            }
        }
    };




    // Console stat
    origin.Base.stats = function()
    {
        return {
            'isDash': origin.env.isDash,
            'isHls': origin.env.isHls,
            'useHlsLib': origin.env.useHlsLib,
            'live': origin.env.isLive,
            'canPlayMediaString': origin.env.canPlayMediaString,
            'canPlayMedia': origin.env.canPlayMedia,
        };
    };




    origin.Ui =             new origin._Ui(origin);
    origin.Api =            new origin._Api(origin);
    origin.Support =        new origin._Support(origin);
    origin.Controls =       new origin._Controls(origin);
    origin.Timecode =       new origin._Timecode(origin);
    origin.Events =         new origin._Events(origin);
    origin.Persist =        new origin._Persist(origin);
    origin.Fullscreen =     new origin._Fullscreen(origin);
    origin.Callback =       new origin._Callback(origin);
    origin.Suggest =        new origin._Suggest(origin);
    origin.Inject =         new origin._Inject(origin);
    origin.Require =        new origin._Require(origin);
    origin.Boot =           new origin._Boot(origin);
    origin.Loader =         new origin._Loader(origin);


    // Extend default origin.options with external options
    $.extend(true, origin.options, options);

    // Debug start
    if(origin.options.debug === true && window.console )
    {
        console.info('=== Julia console debug start, instance '+origin.env.ID+' ===');
    }


    // Embed CSS
    origin.Require.css([
        __JULIA_ROOT_PATH__+'/css/julia-player.min.css',
        origin.options.themePath+'/'+origin.options.theme+'/julia.css'
    ]);


    // Require scripts
    origin.Require.js(origin.options.require);


    $('body').on('julia.plugins-loaded julia.no-plugins', '#julia-player-'+origin.env.ID, function(e)
    {
        if(e.namespace == 'plugins-loaded')
        {
            origin.Base.debug({
                'Required plugins loaded': [e.type, e.namespace]
            });

        }else{
            origin.Base.debug({
                'No plugins required': [e.type, e.namespace]
            });
        }

        origin.Ui.state(origin.env.model.preloader, 'on', '');
        origin.env.model.buttons.bigPlay.show();

        // Autostart playback, if possible
        if(origin.options.autoplay === true && origin.Support.isMobile() === false)
        {
            origin.env.model.buttons.bigPlay.click();
        }
    });


    // Run player init
    origin.Boot.run();


    // Define publicApi
    origin.env.publicApi = {
        options: origin.options,
        shield: origin.env.model.shield,
        toolbar: origin.env.model.toolbar,
        api: origin.env.api,
        ID: origin.env.ID,
        dimensions: origin.env.dimensions,
        Controls: origin.Controls,
        Extend: origin.Base.extend,
        Support: origin.Support,
        Timecode: origin.Timecode,
        Require: origin.Require,
        Inject: origin.Inject,
        //Loader: origin.Loader,
        //Boot: origin.Boot,
        stats: origin.Base.stats
    };


    return origin.env.publicApi;
};

/* *****************************************
* Julia HTML5 media player
* Media element API
* For now, only video is supported
****************************************** */
Julia.prototype._Api = function(origin)
{
    var self = this;

    self.create = function()
    {
        $('#julia-api-'+origin.env.ID).remove();

        apiElement = $('<video class="julia-video" id="julia-api-'+origin.env.ID+'" preload="auto"></video>');

        origin.env.instance.prepend(apiElement);
        origin.env.api = document.getElementById('julia-api-'+origin.env.ID);
        origin.env.api.controls = false;
        origin.env.apiOk = true;

        origin.Base.debug({
            'apiId': origin.env.ID,
            'api': origin.env.api,
        });
    };




    self.source = function()
    {
        protoSource = origin.env.element.prop('src') ? origin.env.element.prop('src'): origin.env.element.find('source').prop('src');
        origin.env.source = origin.options.source && origin.options.source.length>0 ? origin.options.source: protoSource;

        origin.env.isHls = origin.env.source.indexOf('.m3u8') == -1 ? false: true;
        if(origin.options.force === 'hls')
        {
            origin.env.isHls = true;
        }

        origin.env.isDash = origin.env.source.indexOf('.mpd') || origin.env.source.indexOf('.ism') == -1 ? false: true;
        if(origin.options.force === 'dash')
        {
            origin.env.isDash = true;
        }

        origin.Base.debug({
            'Api source isHls': origin.env.isHls,
            'Api source isDash': origin.env.isDash,
            'Source': origin.env.source
        });

        // Poster image
        origin.env.model.poster = origin.options.poster && origin.options.poster.length>0 ? origin.options.poster: origin.env.element.prop('poster');
        origin.Ui.posterSet();
    };




    // First play with some handlers
    self.allowStart = function(e)
    {
        // Init actions
        origin.Controls.press('setDuration', {
            'duration': origin.Timecode.toHuman( origin.env.duration )
        });

        // Set mute if needed
        if(origin.options.muted === true)
        {
            origin.Controls.press('sound-off');
        }else{
            origin.Controls.press('sound-on');

            // Set initial volume
            origin.Controls.press('volume', {
                'volume': origin.options.volume
            });
        }

        origin.Base.debug({
            'eventType': e.type,
            'duration': origin.env.api.duration,
            'readyState': origin.env.api.readyState
        });
    };




    // Bind can play by ready state / fake readyState
    // Because of Firefox cannot bind canplaythrough event with HLS.js properly
    self.canplaythrough = function()
    {
        if(origin.env.started === false)
        {
            // don't let mobile Firefox make decision about readyState, mobile Firefox lie!
            if(origin.env.api.readyState>=3 || (origin.Support.isMobile() === true && origin.env.api.readyState>=2) )
            {
                origin.Api.allowStart({
                    type: 'origin.Events.canplaythrough'
                });
            }else{
                setTimeout( function()
                {
                    origin.Api.canplaythrough();
                }, 100);
            }
        }
    };
};

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

/* *****************************************
* Julia HTML5 media player
* Events
* DOM & api event handlers and emmiters
****************************************** */
Julia.prototype._Events = function(origin)
{
    var self = this;

    // Bind user action & DOM events
    self.ui = function()
    {
        // Buttons
        origin.env.model.toolbar.on('contextmenu', function(e)
        {
            e.preventDefault();
        })
        .on('click', '.julia-playback.play', function(e)
        {
            e.preventDefault();
            origin.Controls.press('play');
        })
        .on('click', '.julia-playback.pause', function(e)
        {
            e.preventDefault();
            origin.Controls.press('pause');
        })
        .on('click', '.julia-sound.on', function(e)
        {
            e.preventDefault();
            origin.Controls.press('sound-off');
        })
        .on('click', '.julia-sound.off', function(e)
        {
            e.preventDefault();
            origin.Controls.press('sound-on');
        })
        .on('click', '.julia-fullscreen-toggle.on', function(e)
        {
            e.preventDefault();
            origin.Controls.press('fullscreen-on');
        })
        .on('click', '.julia-fullscreen-toggle.off', function(e)
        {
            e.preventDefault();
            origin.Controls.press('fullscreen-off');
        });

        // Big play
        origin.env.model.shield.on('click contextmenu', '.julia-big-play', function(e)
        {
            e.preventDefault();
            e.stopPropagation();
            if(e.type == 'click')
            {
                if(origin.env.started === false)
                {
                    origin.Loader.init();
                }
                
                origin.Controls.press('play');
            }
        });

        // Area click
        origin.env.model.shield.on('click contextmenu', function(e)
        {
            e.preventDefault();
            e.stopPropagation();
            if(origin.options.pauseOnClick === true && origin.Support.isMobile() === false && e.type == 'click')
            {
                origin.Controls.press('pause');
            }
        });

        // Fullscreen toolbar behavior bindings
        var mouseMoveCleaner;

        origin.env.instance.on('mousemove', '#julia-shield-'+origin.env.ID+', #julia-suggest-'+origin.env.ID, function(e)
        {
            e.preventDefault();
            origin.env.model.toolbar.addClass('julia-toolbar-visible');
            clearTimeout(mouseMoveCleaner);

            mouseMoveCleaner = setTimeout(function()
            {
                origin.env.model.toolbar.removeClass('julia-toolbar-visible');
            }, 1750);
        })
        .on('mouseover mousemove mouseout', '#julia-toolbar-'+origin.env.ID+'.julia-toolbar-visible', function(e)
        {
            e.preventDefault();
            origin.env.model.toolbar.addClass('julia-toolbar-visible');
            clearTimeout(mouseMoveCleaner);

            if(e.type == 'mouseout')
            {
                mouseMoveCleaner = setTimeout(function(e)
                {
                    origin.env.model.toolbar.removeClass('julia-toolbar-visible');
                }, 1750);
            }
        });

        // Bind progressbar change
        origin.env.model.toolbar.on('change input', '.julia-progress>input', function(e)
        {
            if(e.type == 'input')
            {
                origin.env.seeking = true;
            }else{

                seekTo = origin.Timecode.toSeconds( $(this).val() );
                seekTo = seekTo >= origin.env.duration ? origin.env.duration: seekTo.toFixed(2);

                origin.Controls.press('goto', {
                    currentTime: seekTo
                });

                origin.env.seeking = false;
            }
        });

        // Bind volumebar change
        origin.env.model.toolbar.on('change', '.julia-volume>input', function()
        {
            origin.Controls.press('volume', {
                volume: $(this).val(),
                'event': 'slideChange'
            });
        });

        // Fullscreen event included
        $(window).on('resize', function()
        {
            origin.Support.resize();
        });

        // Fullscreen change event handler
        $(document).on('webkitfullscreenchange mozfullscreenchange fullscreenchange MSFullscreenChange', function(e)
        {
            if(!document.fullscreenElement && !document.mozFullScreenElement && !document.webkitFullscreenElement && !document.msFullscreenElement)
            {

                origin.Ui.state( origin.env.instance, 'julia-fullscreen-on', 'julia-fullscreen-off' );
                origin.Ui.state( origin.env.model.buttons.fullscreen, 'off', 'on' );
                origin.Ui.icon( origin.env.model.buttons.fullscreen, 'julia-fullscreen-exit', 'julia-fullscreen' );

                // Turn off landscape on mobile
                if(origin.Support.isMobile())
                {
                    screen.orientation.unlock();
                    screen.msLockOrientation.unlock();
                    screen.mozLockOrientation.unlock();
                }

                origin.Base.debug({
                    'fullscreen off' : '#julia-player-'+origin.env.ID
                });

                origin.Support.resize();

            }else{

                origin.Ui.state( origin.env.instance, 'julia-fullscreen-off', 'julia-fullscreen-on' );
                origin.Ui.state( origin.env.model.buttons.fullscreen, 'on', 'off' );
                origin.Ui.icon( origin.env.model.buttons.fullscreen, 'julia-fullscreen', 'julia-fullscreen-exit' );

                // Force landscape in fullscreen mode on mobile
                if(origin.Support.isMobile())
                {
                    screen.orientation.lock('landscape-primary');
                    screen.msLockOrientation.lock('landscape-primary');
                    screen.mozLockOrientation.lock('landscape-primary');
                }

                origin.Base.debug({
                    'fullscreen on' : '#julia-player-'+origin.env.ID
                });
            }
        });
    };




    // Native video api
    self.native = function()
    {
        if(origin.Support.forceReady()===true && origin.env.isHls === true)
        {
            origin.Api.canplaythrough();
        }else{
            origin.env.api.oncanplaythrough = function(e)
            {
                origin.env.duration = origin.env.api.duration;

                if(origin.env.started === false && origin.env.api.readyState >= 3)
                {
                    origin.Api.allowStart(e);
                }
            }
        }

        // Video playback detect
        origin.env.api.onplay = function(e)
        {
            origin.Ui.state( origin.env.model.buttons.play, 'play', 'pause' );
            origin.Ui.icon( origin.env.model.buttons.play, 'julia-play', 'julia-pause' );
            origin.env.model.buttons.bigPlay.hide();
            //origin.Ui.state( origin.env.model.preloader, 'on', '' );
            //origin.Ui.posterUnset();
            origin.env.model.toolbar.show();
        };

        origin.env.api.onplaying = function(e)
        {
            origin.Ui.state( origin.env.model.buttons.play, 'play', 'pause' );
            origin.Ui.icon( origin.env.model.buttons.play, 'julia-play', 'julia-pause' );
            origin.env.model.buttons.bigPlay.hide();
            origin.Ui.state( origin.env.model.preloader, 'on', '' );
            origin.env.model.suggest.html('');
            origin.Ui.state( origin.env.model.suggest, 'on', '' );
            origin.Ui.posterUnset();
            origin.env.model.toolbar.show();

            origin.Controls.press('setDuration', {
                'duration': origin.Timecode.toHuman( origin.env.duration )
            });
            origin.env.started = true;
        };


        // Video pause
        origin.env.api.onpause = function(e)
        {
            origin.Ui.state( origin.env.model.buttons.play, 'pause', 'play' );
            origin.Ui.icon( origin.env.model.buttons.play, 'julia-pause', 'julia-play' );
            origin.env.model.buttons.bigPlay.show();
        };


        // Errors
        origin.env.api.onerror = function(e)
        {

        };

        origin.env.api.onemptied = function(e)
        {
        };

        origin.env.api.onstalled = function(e)
        {
        };

        origin.env.api.onsuspend = function(e)
        {
        };

        // Video position
        origin.env.api.ontimeupdate = function(e)
        {
            if(origin.env.seeking === false)
            {
                currentTimeReadable = origin.Timecode.toHuman( origin.env.api.currentTime.toFixed(2) );

                origin.Ui.progress(
                    origin.env.model.ranges.progress,
                    origin.Timecode.toPercents( origin.env.api.currentTime.toFixed(2) )
                );

                origin.Ui.panel(
                    origin.env.model.panels.currentTime,
                    currentTimeReadable
                );
            }

            origin.Callback.onTime(currentTimeReadable, origin.env.api.currentTime);

            if(origin.options.debugPlayback === true)
            {
                origin.Base.debug({
                    'duration/current': origin.env.duration+'/'+origin.env.api.currentTime.toFixed(2)+' > '+currentTimeReadable
                });
            }
        };

        // Video position
        origin.env.api.seeked = function(e)
        {
            origin.env.seeking = false;
        };

        // Video position
        origin.env.api.seeking = function(e)
        {
            origin.env.seeking = true;
        };

        // Volume
        origin.env.api.onvolumechange = function(e)
        {
            if(origin.env.api.muted === false)
            {
                origin.Ui.progress(
                    origin.env.model.ranges.volume,
                    origin.env.api.volume*100
                );

            }else{
                origin.Ui.progress(
                    origin.env.model.ranges.volume,
                    0
                );
            }
        };

        // Set video duration
        origin.env.api.ondurationchange = function(e)
        {
            origin.env.duration = origin.env.api.duration;

            if(origin.env.started === false)
            {
                origin.env.duration = origin.env.api.duration;
                origin.env.seeking = false;

                origin.Base.debug({
                    'duration': origin.env.duration,
                    'readyState': origin.env.api.readyState,
                    'started': origin.env.started
                });
            }
        };

        // Bind playback end event
        origin.env.api.onended = function(e)
        {
            origin.Suggest.run();
        };
    };




    // Specific events, error handlers
    self.hlsLibEvents = function()
    {
        origin.env.hls.on(Hls.Events.ERROR, function(event, data)
        {
            switch(data.details)
            {
                case Hls.ErrorDetails.MANIFEST_LOAD_ERROR:
                case Hls.ErrorDetails.MANIFEST_LOAD_TIMEOUT:
                case Hls.ErrorDetails.MANIFEST_PARSING_ERROR:
                case Hls.ErrorDetails.LEVEL_LOAD_ERROR:
                case Hls.ErrorDetails.LEVEL_LOAD_TIMEOUT:
                case Hls.ErrorDetails.LEVEL_SWITCH_ERROR:
                case Hls.ErrorDetails.FRAG_LOAD_ERROR:
                case Hls.ErrorDetails.FRAG_LOOP_LOADING_ERROR:
                case Hls.ErrorDetails.FRAG_LOAD_TIMEOUT:
                case Hls.ErrorDetails.FRAG_DECRYPT_ERROR:
                case Hls.ErrorDetails.FRAG_PARSING_ERROR:
                case Hls.ErrorDetails.BUFFER_APPEND_ERROR:
                case Hls.ErrorDetails.BUFFER_APPENDING_ERROR:

                    origin.Base.debug({
                        recoveringError: data.details,
                        errorType: data.type,
                        errorFatal: data.fatal,
                        data: data
                    });

                    if(data.fatal === true && origin.env.tries<11)
                    {
                        // Bring to life again

                    }

                break; default:
            }
        });
    };


    // Specific events, error handlers
    self.dashLibEvents = function()
    {
        origin.env.dash.on(dashjs.MediaPlayer.events, function(event, data)
        {
            switch(data.details)
            {
                case dashjs.MediaPlayer.events.ERROR:

                    origin.Base.debug({
                        recoveringError: dashjs.MediaPlayer.events.ERROR
                    });

                break; default:
            }
        });
    };
};

/* *****************************************
* Julia HTML5 media player
* Media element API
* For now, only video is supported
****************************************** */
Julia.prototype._Controls = function(origin)
{
    var self = this;

    self.press = function(action, data)
    {
        data = data||{};

        origin.Base.debug({
            'action': action,
            'action-data': data,
        });

        switch(action)
        {
            case 'play':

                if(origin.options.onPlay !== false)
                {
                    origin.Callback.fn(origin.options.onPlay, data);
                }

                origin.env.model.buttons.bigPlay.hide();
                origin.env.api.play();

            break; case 'pause':

                if(origin.options.onPause !== false)
                {
                    origin.Callback.fn(origin.options.onPause, data);
                }

                origin.env.api.pause();

            break; case 'stop':

                if(origin.options.onStop !== false)
                {
                    origin.Callback.fn(origin.options.onStop, data);
                }

                origin.env.api.pause();
                origin.env.api.currentTime = 0;

                origin.Ui.state( origin.env.model.buttons.play, 'pause', 'play' );
                origin.Ui.icon( origin.env.model.buttons.play, 'julia-pause', 'julia-play' );
                origin.env.model.buttons.bigPlay.show();
                origin.Ui.progress( origin.env.model.ranges.progress, 0 );

            break; case 'goto':

                if(origin.options.onPosition !== false)
                {
                    origin.Callback.fn(origin.options.onPosition, data);
                }

                origin.env.api.currentTime = data.currentTime;

            break; case 'setDuration':

                origin.Ui.panel( origin.env.model.panels.duration, data.duration );

                if(origin.env.started === false)
                {
                    origin.Ui.progress( origin.env.model.ranges.progress, 0 );
                }

                origin.Base.debug({
                    'setDuration': data.duration
                });

            break; case 'volume':

                origin.options.volume = data.volume;
                origin.env.api.volume = data.volume/100;

                origin.Base.debug({
                    'volume is': origin.env.api.volume
                });

                origin.Ui.progress( origin.env.model.ranges.volume, data.volume );

                if(data.volume>0)
                {
                    origin.Controls.press('sound-on');

                }else{
                    origin.Controls.press('sound-off');
                }

            break; case 'sound-on':

                origin.env.api.muted = false;
                origin.options.muted = false;
                origin.Persist.set('julia-player-volume', origin.options.volume, 999);
                origin.Persist.set('julia-player-muted', origin.options.muted, 999);

                origin.Ui.state( origin.env.model.buttons.sound, 'off', 'on' );
                origin.Ui.icon( origin.env.model.buttons.sound, 'julia-sound-off', 'julia-sound-on' );

            break; case 'sound-off':

                origin.env.api.muted = true;
                origin.options.muted = true;
                origin.Persist.set('julia-player-volume', origin.options.volume, 999);
                origin.Persist.set('julia-player-muted', origin.options.muted, 999);

                origin.Ui.state( origin.env.model.buttons.sound, 'on', 'off' );
                origin.Ui.icon( origin.env.model.buttons.sound, 'julia-sound-on', 'julia-sound-off' );

            break; case 'fullscreen-on':
                origin.Fullscreen.on();

            break; case 'fullscreen-off':
                origin.Fullscreen.off();

            break; default:

        }

        return;
    };

};

/* *****************************************
* Julia HTML5 media player
* Suppport
* media & DOM sizing utilities
****************************************** */
Julia.prototype._Support = function(origin)
{
    var self = this;

    self.aspect = function(w,h)
    {
        return w>0 && h>0 ? h/w: 0;
    };

    self.isMobile = function()
    {
        if( /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) )
        {
            return true;
        }

        return false;
    };

    self.forceReady = function()
    {
        if( /Firefox/i.test(navigator.userAgent) )
        {
            return true;
        }

        return false;
    };

    self.canPlayMedia = function()
    {
        var vid = document.createElement('video');
        vid.id = 'video-cap-test-'+origin.env.ID;
        origin.env.canPlayMediaString = vid.canPlayType('application/vnd.apple.mpegURL');
        $('#video-cap-test'+origin.env.ID).remove();
        return (origin.env.canPlayMediaString == 'probably' || origin.env.canPlayMediaString == 'maybe');
    };

    self.resize = function()
    {
        // Player dimensions
        defaultDim = origin.env.element.width() ? [origin.env.element.width(), origin.env.element.height()]: [origin.options.width, origin.options.height];
        dimensions = origin.options.responsive === true ? self.getSize(): defaultDim;

        origin.Base.debug({
            'resizeDefaults': defaultDim,
            'resize': dimensions
        });

        origin.env.instance.width(dimensions[0]);
        origin.env.instance.height(dimensions[1]);

        origin.env.dimensions.width = dimensions[0];
        origin.env.dimensions.height = dimensions[1];

        origin.env.api.setAttribute('width', '100%');
        origin.env.api.setAttribute('height', '100%');
    };

    self.getSize = function()
    {
        // Fix video wrapped in inline block, can not get size properlym if inline element detected
        var parentBlock = origin.env.element.parent().css('display').toLowerCase();
        if(parentBlock == 'inline')
        {
            origin.env.element.parent().css({'display': 'block'});
        }

        var parentWidth = origin.env.element.parent().width();
        for(i in origin.options.dimensions)
        {
            var dim = origin.options.dimensions[i];
            if(parentWidth>=dim[0])
            {
                a = self.aspect(parentWidth) == 0 ? dim[1]/dim[0]: self.aspect(origin.env.api.videoWidth, origin.env.api.videoHeight);

                dimensions = [dim[0],(dim[0]*a)];
                origin.Base.debug({
                    'resizePredefined': dimensions
                });
                return dimensions;
            }
        }

        a = self.aspect() == 0 ? dim[1]/dim[0]: self.aspect(origin.env.api.videoWidth, origin.env.api.videoHeight);
        dimensions = [parentWidth, (parentWidth*a)];

        origin.Base.debug({
            'resizeFallback': dimensions
        });

        return dimensions;
    };
};

/* *****************************************
* Julia HTML5 media player
* Suggest
* suggest playlist engine
****************************************** */
Julia.prototype._Suggest = function(origin)
{
    var self = this;




    self.run = function()
    {
        origin.env.model.suggest.html('');
        origin.Controls.press('stop');
        origin.env.suggestClicked = false;

        if(origin.options.suggest.length > 0)
        {
            x = 0;
            for(var i in origin.options.suggest)
            {
                if(x < origin.options.suggestLimit && origin.options.suggest[i].played === false)
                {
                    mode = !!origin.options.suggest[i].live && origin.options.suggest[i].live === true ? 'live': 'vod';
                    liveText = !!origin.options.suggest[i].liveText ? origin.options.suggest[i].liveText: 'Live';
                    var poster = !!origin.options.suggest[i].poster ? origin.options.suggest[i].poster: '';
                    posterImage = poster.length>0 ? '<img src="'+poster+'" width="100%" height="100%">': '';
                    suggestItemWidget = $('<div class="julia-suggest-item" data-poster="'+poster+'" data-source="'+origin.options.suggest[i].source+'" data-mode="'+mode+'" data-live-text="'+liveText+'" data-index="'+i+'">'
                            + posterImage
                            +'<div class="julia-suggest-item-title">'+origin.options.suggest[i].title+'</div>'
                        +'</div>');

                        suggestItemWidget.on('click', function(e)
                        {
                            if(origin.options.onSuggest !== false)
                            {
                                origin.Callback.fn(origin.options.onSuggest, origin.options.suggest[i]);
                            }

                            origin.options.muted = origin.env.api.muted;

                            origin.options.poster = $(this).data('poster');
                            origin.env.suggestClicked = true;
                            origin.env.model.buttons.bigPlay.hide();
                            origin.env.started = false;
                            origin.options.source = $(this).data('source');
                            origin.Api.source();
                            origin.options.autoplay = true;
                            origin.options.live = $(this).data('mode') == 'live' ? true: false;
                            origin.options.i18n.liveText = $(this).data('live-text');

                            origin.Ui.panel( origin.env.model.panels.live, origin.options.i18n.liveText );

                            origin.Base.debug({
                                suggestRemoveIndex: $(this).data('index'),
                                suggestRemove: $(this).data('source')
                            });

                            origin.options.suggest[$(this).data('index')].played = true;

                            origin.Ui.state(origin.env.model.suggest, 'on', '');

                            //origin.Loader.init();
                            origin.env.model.buttons.bigPlay.click();
                        });

                    origin.env.model.suggest.append(suggestItemWidget);
                    x++;
                }
            }

            if(x > 0)
            {
                if(origin.options.suggestTimeout > 0 && origin.Support.isMobile() === false)
                {
                    setTimeout( function()
                    {
                        if(origin.env.suggestClicked === false)
                        {
                            origin.env.model.suggest.find('div.julia-suggest-item:first').click();
                        }
                    }, origin.options.suggestTimeout);
                }
                origin.Ui.state(origin.env.model.suggest, '', 'on');
            }

        }else{
            origin.Fullscreen.off();
        }

        origin.Base.debug({
            'Suggest' : 'raised'
        });
    };
};

/* *****************************************
* Julia HTML5 media player
* Fullscreen
* media fullscreen behavior
****************************************** */
Julia.prototype._Fullscreen = function(origin)
{
    var self = this;

    self.on = function()
    {
        var videoFrame = document.querySelector('#julia-player-'+origin.env.ID);

        if(videoFrame.requestFullscreen)
        {
            videoFrame.requestFullscreen();
        } else if (videoFrame.msRequestFullscreen)
        {
            videoFrame.msRequestFullscreen();
        } else if (videoFrame.mozRequestFullScreen)
        {
            videoFrame.mozRequestFullScreen();
        } else if(videoFrame.webkitRequestFullscreen)
        {
            videoFrame.webkitRequestFullscreen();
        }else{
            origin.Base.debug({
                'fullscreen': 'fullscreen is not supported'
            });
        }
    };




    self.off = function()
    {
        if(document.exitFullscreen)
        {
            document.exitFullscreen();
        }else if(document.msExitFullscreen)
        {
            document.msExitFullscreen();
        } else if(document.mozCancelFullScreen)
        {
            document.mozCancelFullScreen();
        } else if(document.webkitExitFullscreen)
        {
            document.webkitExitFullscreen();
        }
    };
};

/* *****************************************
* Julia HTML5 media player
* Persistent settings
* options are stored in cookies
****************************************** */
Julia.prototype._Persist = function(origin)
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

/* *****************************************
* Julia HTML5 media player
* Timecode
* utilities for timecode conversion
****************************************** */
Julia.prototype._Timecode = function(origin)
{
    var self = this;

    self.toPercents = function(currentTime)
    {
        p = (currentTime/origin.env.duration)*100;
        return p;
    },

    self.toSeconds = function(percent)
    {
        t = (origin.env.duration/100)*percent;
        return t;
    },

    self.toNum = function(human)
    {
        human = human.split(':');
        human.reverse();
        s = parseInt(human[0]);
        m = human.length>1 ? parseInt(human[1]): 0;
        h = human.length>2 ? parseInt(human[3]): 0;
        t = s + m*60 + h*60*60;
        return t;
    },

    self.toHuman = function(time)
    {
        time = time.toString().split('.');
        s = time[0];
        H = Math.floor(s/3600);
        M = Math.floor( ( s - (H*3600) ) / 60 );
        S = Math.floor( ( s - (H*3600) - (M*60) ) );

        H = ('0'+H.toString()).slice(-2);
        M = ('0'+M.toString()).slice(-2);
        S = ('0'+S.toString()).slice(-2);

        str = H>0 ? H+':'+M+':'+S: M+':'+S;

        return str;
    };
};

/* *****************************************
* Julia HTML5 media player
* Callback
* event callbacks
****************************************** */
Julia.prototype._Callback = function(origin)
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

/* *****************************************
* Julia HTML5 media player
* Inject
* Inject origin code, source change, etc...
****************************************** */
Julia.prototype._Inject = function(origin)
{
    var self = this;




    self.source = function(options)
    {
        $('#julia-player-'+origin.env.ID).remove();
        origin.env.started = false;

        $.extend(true, origin.options, options);

        // Run player
        origin.Boot.run();

        if( origin.options.live === true )
        {
            origin.env.isLive = true;
            origin.Ui.panel( origin.env.model.panels.live, origin.options.i18n.liveText );
            origin.Ui.state( origin.env.model.toolbar, '', 'live' );
        }else{
            origin.env.isLive = false;
            origin.Ui.panel( origin.env.model.panels.live, '' );
            origin.Ui.state( origin.env.model.toolbar, 'live', '' );
        }

        origin.Ui.state(origin.env.model.preloader, 'on', '');

        // Autostart playback, if possible
        if(origin.options.autoplay === true && origin.Support.isMobile() === false)
        {
            origin.env.model.buttons.bigPlay.click();
        }else{
            origin.env.model.buttons.bigPlay.show();
        }
    };




    self.layer = function(data)
    {

    };
};

/* *****************************************
* Julia HTML5 media player
* Require
* Require vendor libs
****************************************** */
Julia.prototype._Require = function(origin)
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
        }, 100);
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

/* *****************************************
* Julia HTML5 media player
* Boot
* player boot process
****************************************** */
Julia.prototype._Boot = function(origin)
{
    var self = this;

    self.run = function()
    {
        origin.Base.debug(origin.options);

        // Set active DOM element
        origin.env.element = origin.options.element;

        // Suggest init
        for(i in origin.options.suggest)
        {
            origin.options.suggest[i].played = false;
        }

        // Persistent data
        volume = origin.Persist.get('julia-player-volume');
        muted = origin.Persist.get('julia-player-muted');

        if(typeof volume !== 'undefined' && volume.length>0)
        {
            origin.options.volume = parseInt(volume);

            if(origin.options.volume > 100 || origin.options.volume < 0)
            {
                origin.options.volume = 25;
            }
        }

        if(typeof muted !=='undefined' && muted.length>0)
        {
            origin.options.muted = muted == 'false' ?  false: true;
        }


        if(origin.env.hls !== false)
        {
            origin.env.hls.destroy();
            origin.env.hls = false;
        }

        if(origin.env.dash !== false)
        {
            origin.env.dash.reset();
            origin.env.dash = false;
        }


        // Create UI
        origin.Ui.create();

        // Source select, poster select
        origin.Api.source();

        // Create API
        origin.Api.create();

        // Size Fix
        origin.Support.resize();

        // Handle events
        origin.Events.ui();
        origin.Events.native();
    };
};

/* *****************************************
* Julia HTML5 media player
* Loader
* player media loader/playback
****************************************** */
Julia.prototype._Loader = function(origin)
{
    var self = this;

    self.init = function()
    {
        origin.env.api.src = '';
/*
        if(typeof reloadSource === 'undefined')
        {
            reloadSource = false;
        }


        if(reloadSource === true)
        {
            origin.Controls.press('stop');

            origin.Api.source();

            // Handle events
            origin.Events.ui();
            origin.Events.native();
        }

*/
        origin.env.useHlsLib = false;
        origin.env.isLive = false;
        origin.env.canPlayMedia = origin.Support.canPlayMedia();

        if(origin.env.isHls === true)
        {
            origin.env.useHlsLib = origin.env.canPlayMedia === false && Hls.isSupported() ? true: false;
        }

        // ************************
        // HLS library supported
        // and HLS requested
        // ************************
        if(origin.env.useHlsLib === true)
        {
            origin.env.hls = new Hls(origin.options.hlsConfig);

        // ************************
        // Dash
        // ************************
        }else if(origin.env.isDash === true){

            //origin.env.api.src = origin.env.source;
        }else{

            origin.env.api.src = origin.env.source;
        }

        if(origin.options.live === true)
        {
            origin.env.isLive = true;
            origin.Ui.state(origin.env.model.toolbar, '', 'live');
        }else{

            origin.env.isLive = false;
            origin.Ui.state(origin.env.model.toolbar, 'live', '');
        }


        // ************************
        // HLS library supported
        // and HLS requested
        // ************************
        if(origin.env.useHlsLib === true)
        {
            origin.Events.hlsLibEvents();
            origin.env.hls.autoLevelCapping = -1;
            origin.env.hls.attachMedia(origin.env.api);
            origin.env.hls.loadSource(origin.env.source);

            // API READY
            origin.env.hls.on(Hls.Events.MEDIA_ATTACHED, function(event, data)
            {

                // DETECT LEVEL DATA
                origin.env.hls.on(Hls.Events.LEVEL_LOADED, function(event, data)
                {

                });


                for(x in origin.options.triggerHls)
                {
                    handle = origin.options.triggerHls[x];

                    if(typeof window[handle] === 'function')
                    {
                        origin.env.hls.on(Hls.Events[x], function(event, data)
                        {
                            window[handle](origin.env.apiId, event, data);
                        });

                    }else{

                        origin.Base.debug({
                            'triggerHlsError': handle+' is not a function'
                        });
                    }
                }
            });

        // ************************
        // Usig DASH library
        // ************************
        }else if(origin.env.isDash === true)
        {
            origin.env.dash = dashjs.MediaPlayer().create();

            origin.env.dash.initialize();
            origin.env.dash.attachView(origin.env.api);
            origin.env.dash.attachSource(origin.env.source);
            origin.env.dash.setAutoPlay(origin.options.autoplay);

            if(origin.options.debug === false)
            {
                origin.env.dash.getDebug().setLogToBrowserConsole(false);
            }

            origin.Events.dashLibEvents();

        // ************************
        // Classic VOD file
        // ************************
        }else{

            origin.env.api.load();
        }


        origin.Ui.state(origin.env.model.preloader, '', 'on');


        origin.Api.allowStart({
            type: 'origin.Loader'
        });

        //origin.Controls.press('play');
    };
};

// Build jQuery plugin
$.fn.julia = function(options)
{
    return this.each(function()
    {
        // Return if this element already has a plugin instance
        if($(this).data('julia'))
        {
            return;
        }

        options = typeof options === 'undefined' ? {}: options;
        options.element = $(this);

        // Pass options to constructor
        var julia = new Julia(options);

        // Store plugin object in element's data
        $(this).data('julia', julia);
    });
};

// API wrappers
$.fn.play = function()
{
    $(this).data('julia').Controls.press('play');
};

$.fn.setOptions = function(options)
{
    $(this).data('julia').Extend(options);
};

$.fn.options = function()
{
    return $(this).data('julia').options;
};

$.fn.source = function(options)
{
    $(this).data('julia').Inject.source(options);
};

$.fn.api = function()
{
    return $(this).data('julia').api;
};

$.fn.pause = function()
{
    $(this).data('julia').Controls.press('pause');
};

$.fn.stop = function()
{
    $(this).data('julia').Controls.press('stop');
};

$.fn.goto = function(t)
{
    $(this).data('julia').Controls.press('goto', {
        currentTime: t
    });
};

$.fn.mute = function()
{
    if($(this).data('julia').api.muted === false)
    {
        $(this).data('julia').Controls.press('sound-off');
    }else{
        $(this).data('julia').Controls.press('sound-on');
    }
};

$.fn.volume = function(volume)
{
    $(this).data('julia').Controls.press('volume', {
        volume: volume
    });
};

$.fn.getID = function()
{
    return $(this).data('julia').ID;
};

$.fn.stats = function()
{
    return $(this).data('julia').stats();
};
