/* ***********************************
* Julia player
*
* @author prochor666@gmail.com
* version: 0.9.9
* build: 2016-04-19
* licensed under the MIT License
*
* @requires:
* hls.js [required]
* jquery [required]
* ionicons [required]
* rangeslider.js [required]
*
************************************* */

// Support libs
if(!window.jQuery)
{
    alert('jQuery is required');
    window.stop();
}

(function($)
{
    // Root path workaround
    var __JULIA_ROOT_PATH__ = 'julia';
    dir = document.querySelector('script[src*="julia-player"]').getAttribute('src');
    name = dir.split('/').pop();
    __JULIA_ROOT_PATH__ = dir.replace('/js/'+name,"");
    $('head').append('<link rel="stylesheet" type="text/css" href="'+__JULIA_ROOT_PATH__+'/css/ionicons.min.css">');

    // Support libs
    try {
        h = new Hls;

    }catch(err)
    {
        /*! hls.js 0.5.22, handle error or insert source */
        !function(e){if("object"==typeof exports&&"undefined"!=typeof module)module.exports=e();else if("function"==typeof define&&define.amd)define([],e);else{var t;t="undefined"!=typeof window?window:"undefined"!=typeof global?global:"undefined"!=typeof self?self:this,t.Hls=e()}}(function(){return function s(e,t,r){function i(n,d){if(!t[n]){if(!e[n]){var l="function"==typeof require&&require;if(!d&&l)return l(n,!0);if(a)return a(n,!0);var u=new Error("Cannot find module '"+n+"'");throw u.code="MODULE_NOT_FOUND",u}var o=t[n]={exports:{}};e[n][0].call(o.exports,function(t){var r=e[n][1][t];return i(r?r:t)},o,o.exports,s,e,t,r)}return t[n].exports}for(var a="function"==typeof require&&require,n=0;n<r.length;n++)i(r[n]);return i}({1:[function(s,n,o){function e(){this._events=this._events||{},this._maxListeners=this._maxListeners||void 0}function t(e){return"function"==typeof e}function a(e){return"number"==typeof e}function r(e){return"object"==typeof e&&null!==e}function i(e){return void 0===e}n.exports=e,e.EventEmitter=e,e.prototype._events=void 0,e.prototype._maxListeners=void 0,e.defaultMaxListeners=10,e.prototype.setMaxListeners=function(e){if(!a(e)||0>e||isNaN(e))throw TypeError("n must be a positive number");return this._maxListeners=e,this},e.prototype.emit=function(l){var s,e,u,n,a,o;if(this._events||(this._events={}),"error"===l&&(!this._events.error||r(this._events.error)&&!this._events.error.length)){if(s=arguments[1],s instanceof Error)throw s;throw TypeError('Uncaught, unspecified "error" event.')}if(e=this._events[l],i(e))return!1;if(t(e))switch(arguments.length){case 1:e.call(this);break;case 2:e.call(this,arguments[1]);break;case 3:e.call(this,arguments[1],arguments[2]);break;default:n=Array.prototype.slice.call(arguments,1),e.apply(this,n)}else if(r(e))for(n=Array.prototype.slice.call(arguments,1),o=e.slice(),u=o.length,a=0;u>a;a++)o[a].apply(this,n);return!0},e.prototype.addListener=function(n,a){var s;if(!t(a))throw TypeError("listener must be a function");return this._events||(this._events={}),this._events.newListener&&this.emit("newListener",n,t(a.listener)?a.listener:a),this._events[n]?r(this._events[n])?this._events[n].push(a):this._events[n]=[this._events[n],a]:this._events[n]=a,r(this._events[n])&&!this._events[n].warned&&(s=i(this._maxListeners)?e.defaultMaxListeners:this._maxListeners,s&&s>0&&this._events[n].length>s&&(this._events[n].warned=!0,"function"==typeof console.trace)),this},e.prototype.on=e.prototype.addListener,e.prototype.once=function(i,e){function r(){this.removeListener(i,r),n||(n=!0,e.apply(this,arguments))}if(!t(e))throw TypeError("listener must be a function");var n=!1;return r.listener=e,this.on(i,r),this},e.prototype.removeListener=function(n,i){var e,s,o,a;if(!t(i))throw TypeError("listener must be a function");if(!this._events||!this._events[n])return this;if(e=this._events[n],o=e.length,s=-1,e===i||t(e.listener)&&e.listener===i)delete this._events[n],this._events.removeListener&&this.emit("removeListener",n,i);else if(r(e)){for(a=o;a-- >0;)if(e[a]===i||e[a].listener&&e[a].listener===i){s=a;break}if(0>s)return this;1===e.length?(e.length=0,delete this._events[n]):e.splice(s,1),this._events.removeListener&&this.emit("removeListener",n,i)}return this},e.prototype.removeAllListeners=function(r){var i,e;if(!this._events)return this;if(!this._events.removeListener)return 0===arguments.length?this._events={}:this._events[r]&&delete this._events[r],this;if(0===arguments.length){for(i in this._events)"removeListener"!==i&&this.removeAllListeners(i);return this.removeAllListeners("removeListener"),this._events={},this}if(e=this._events[r],t(e))this.removeListener(r,e);else if(e)for(;e.length;)this.removeListener(r,e[e.length-1]);return delete this._events[r],this},e.prototype.listeners=function(e){var r;return r=this._events&&this._events[e]?t(this._events[e])?[this._events[e]]:this._events[e].slice():[]},e.prototype.listenerCount=function(r){if(this._events){var e=this._events[r];if(t(e))return 1;if(e)return e.length}return 0},e.listenerCount=function(e,t){return e.listenerCount(t)}},{}],2:[function(a,i,s){var n=arguments[3],e=arguments[4],r=arguments[5],t=JSON.stringify;i.exports=function(l){for(var i,s=Object.keys(r),a=0,d=s.length;d>a;a++){var o=s[a],u=r[o].exports;if(u===l||u.default===l){i=o;break}}if(!i){i=Math.floor(Math.pow(16,8)*Math.random()).toString(16);for(var f={},a=0,d=s.length;d>a;a++){var o=s[a];f[o]=o}e[i]=[Function(["require","module","exports"],"("+l+")(self)"),f]}var h=Math.floor(Math.pow(16,8)*Math.random()).toString(16),c={};c[i]=i,e[h]=[Function(["require"],"var f = require("+t(i)+");(f.default ? f.default : f)(self);"),c];var v="("+n+")({"+Object.keys(e).map(function(r){return t(r)+":["+e[r][0]+","+t(e[r][1])+"]"}).join(",")+"},{},["+t(h)+"])",g=window.URL||window.webkitURL||window.mozURL||window.msURL;return new Worker(g.createObjectURL(new Blob([v],{type:"text/javascript"})))}},{}],3:[function(e,p,n){"use strict";function r(e){return e&&e.__esModule?e:{default:e}}function u(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}function f(t,e){if(!t)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return!e||"object"!=typeof e&&"function"!=typeof e?t:e}function v(t,e){if("function"!=typeof e&&null!==e)throw new TypeError("Super expression must either be null or a function, not "+typeof e);t.prototype=Object.create(e&&e.prototype,{constructor:{value:t,enumerable:!1,writable:!0,configurable:!0}}),e&&(Object.setPrototypeOf?Object.setPrototypeOf(t,e):t.__proto__=e)}Object.defineProperty(n,"__esModule",{value:!0});var o=function(){function e(i,r){for(var t=0;t<r.length;t++){var e=r[t];e.enumerable=e.enumerable||!1,e.configurable=!0,"value"in e&&(e.writable=!0),Object.defineProperty(i,e.key,e)}}return function(t,r,i){return r&&e(t.prototype,r),i&&e(t,i),t}}(),g=e("../events"),t=r(g),d=e("../event-handler"),a=r(d),h=e("../helper/buffer-helper"),c=r(h),s=e("../errors"),i=e("../utils/logger"),l=function(r){function e(i){u(this,e);var r=f(this,Object.getPrototypeOf(e).call(this,i,t.default.FRAG_LOADING,t.default.FRAG_LOAD_PROGRESS,t.default.FRAG_LOADED,t.default.ERROR));return r.lastLoadedFragLevel=0,r._autoLevelCapping=-1,r._nextAutoLevel=-1,r.hls=i,r.onCheck=r.abandonRulesCheck.bind(r),r}return v(e,r),o(e,[{key:"destroy",value:function(){this.clearTimer(),a.default.prototype.destroy.call(this)}},{key:"onFragLoading",value:function(e){this.timer||(this.timer=setInterval(this.onCheck,100)),this.fragCurrent=e.frag}},{key:"onFragLoadProgress",value:function(t){var e=t.stats;void 0===e.aborted&&1===t.frag.loadCounter&&(this.lastfetchduration=(performance.now()-e.trequest)/1e3,this.lastbw=8*e.loaded/this.lastfetchduration)}},{key:"abandonRulesCheck",value:function(){var n=this.hls,a=n.media,e=this.fragCurrent;if(!e.loader||e.loader.stats&&e.loader.stats.aborted)return i.logger.warn("frag loader destroy or aborted, disarm abandonRulesCheck"),void this.clearTimer();if(a&&(!a.paused||!a.readyState)&&e.autoLevel&&e.level){var u=performance.now()-e.trequest;if(u>500*e.duration){var d=Math.max(1,1e3*e.loaded/u);e.expectedLen<e.loaded&&(e.expectedLen=e.loaded);var f=a.currentTime,l=(e.expectedLen-e.loaded)/d,s=c.default.bufferInfo(a,f,n.config.maxBufferHole).end-f;if(s<2*e.duration&&l>s){var o=void 0,r=void 0;for(r=e.level-1;r>=0&&(o=e.duration*n.levels[r].bitrate/(6.4*d),i.logger.log("fragLoadedDelay/bufferStarvationDelay/fragLevelNextLoadedDelay["+r+"] :"+l.toFixed(1)+"/"+s.toFixed(1)+"/"+o.toFixed(1)),!(s>o));r--);l>o&&(r=Math.max(0,r),n.nextLoadLevel=r,i.logger.warn("loading too slow, abort fragment loading and switch to level "+r),e.loader.abort(),this.clearTimer(),n.trigger(t.default.FRAG_LOAD_EMERGENCY_ABORTED,{frag:e}))}}}}},{key:"onFragLoaded",value:function(e){this.clearTimer(),this.lastLoadedFragLevel=e.frag.level,this._nextAutoLevel=-1}},{key:"onError",value:function(e){switch(e.details){case s.ErrorDetails.FRAG_LOAD_ERROR:case s.ErrorDetails.FRAG_LOAD_TIMEOUT:this.clearTimer()}}},{key:"clearTimer",value:function(){this.timer&&(clearInterval(this.timer),this.timer=null)}},{key:"autoLevelCapping",get:function(){return this._autoLevelCapping},set:function(e){this._autoLevelCapping=e}},{key:"nextAutoLevel",get:function(){var i,e,r,n=this.lastbw,t=this.hls;if(r=-1===this._autoLevelCapping&&t.levels&&t.levels.length?t.levels.length-1:this._autoLevelCapping,-1!==this._nextAutoLevel)return Math.min(this._nextAutoLevel,r);for(e=0;r>=e;e++)if(i=e<=this.lastLoadedFragLevel?.8*n:.7*n,i<t.levels[e].bitrate)return Math.max(0,e-1);return e-1},set:function(e){this._nextAutoLevel=e}}]),e}(a.default);n.default=l},{"../errors":20,"../event-handler":21,"../events":22,"../helper/buffer-helper":23,"../utils/logger":36}],4:[function(i,v,n){"use strict";function a(e){return e&&e.__esModule?e:{default:e}}function u(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}function f(t,e){if(!t)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return!e||"object"!=typeof e&&"function"!=typeof e?t:e}function h(t,e){if("function"!=typeof e&&null!==e)throw new TypeError("Super expression must either be null or a function, not "+typeof e);t.prototype=Object.create(e&&e.prototype,{constructor:{value:t,enumerable:!1,writable:!0,configurable:!0}}),e&&(Object.setPrototypeOf?Object.setPrototypeOf(t,e):t.__proto__=e)}Object.defineProperty(n,"__esModule",{value:!0});var c=function(){function e(i,r){for(var t=0;t<r.length;t++){var e=r[t];e.enumerable=e.enumerable||!1,e.configurable=!0,"value"in e&&(e.writable=!0),Object.defineProperty(i,e.key,e)}}return function(t,r,i){return r&&e(t.prototype,r),i&&e(t,i),t}}(),l=i("../events"),e=a(l),d=i("../event-handler"),s=a(d),t=i("../utils/logger"),r=i("../errors"),o=function(n){function i(r){u(this,i);var t=f(this,Object.getPrototypeOf(i).call(this,r,e.default.MEDIA_ATTACHING,e.default.MEDIA_DETACHING,e.default.BUFFER_RESET,e.default.BUFFER_APPENDING,e.default.BUFFER_CODECS,e.default.BUFFER_EOS,e.default.BUFFER_FLUSHING));return t.onsbue=t.onSBUpdateEnd.bind(t),t.onsbe=t.onSBUpdateError.bind(t),t}return h(i,n),c(i,[{key:"destroy",value:function(){s.default.prototype.destroy.call(this)}},{key:"onMediaAttaching",value:function(t){var r=this.media=t.media,e=this.mediaSource=new MediaSource;this.onmso=this.onMediaSourceOpen.bind(this),this.onmse=this.onMediaSourceEnded.bind(this),this.onmsc=this.onMediaSourceClose.bind(this),e.addEventListener("sourceopen",this.onmso),e.addEventListener("sourceended",this.onmse),e.addEventListener("sourceclose",this.onmsc),r.src=URL.createObjectURL(e)}},{key:"onMediaDetaching",value:function(){var r=this.mediaSource;if(r){if("open"===r.readyState)try{r.endOfStream()}catch(e){t.logger.warn("onMediaDetaching:"+e.message+" while calling endOfStream")}r.removeEventListener("sourceopen",this.onmso),r.removeEventListener("sourceended",this.onmse),r.removeEventListener("sourceclose",this.onmsc),this.media.src="",this.media.removeAttribute("src"),this.mediaSource=null,this.media=null,this.pendingTracks=null,this.sourceBuffer=null}this.onmso=this.onmse=this.onmsc=null,this.hls.trigger(e.default.MEDIA_DETACHED)}},{key:"onMediaSourceOpen",value:function(){t.logger.log("media source opened"),this.hls.trigger(e.default.MEDIA_ATTACHED,{media:this.media}),this.mediaSource.removeEventListener("sourceopen",this.onmso);var r=this.pendingTracks;r&&(this.onBufferCodecs(r),this.pendingTracks=null,this.doAppending())}},{key:"onMediaSourceClose",value:function(){t.logger.log("media source closed")}},{key:"onMediaSourceEnded",value:function(){t.logger.log("media source ended")}},{key:"onSBUpdateEnd",value:function(){this._needsFlush&&this.doFlush(),this._needsEos&&this.onBufferEos(),this.hls.trigger(e.default.BUFFER_APPENDED),this.doAppending()}},{key:"onSBUpdateError",value:function(i){t.logger.error("sourceBuffer error:"+i),this.hls.trigger(e.default.ERROR,{type:r.ErrorTypes.MEDIA_ERROR,details:r.ErrorDetails.BUFFER_APPENDING_ERROR,fatal:!1})}},{key:"onBufferReset",value:function(){var e=this.sourceBuffer;if(e){for(var r in e){var t=e[r];try{this.mediaSource.removeSourceBuffer(t),t.removeEventListener("updateend",this.onsbue),t.removeEventListener("error",this.onsbe)}catch(e){}}this.sourceBuffer=null}this.flushRange=[],this.appended=0}},{key:"onBufferCodecs",value:function(r){var i,n,e,s,a;if(!this.media)return void(this.pendingTracks=r);if(!this.sourceBuffer){var o={},l=this.mediaSource;for(n in r)e=r[n],s=e.levelCodec||e.codec,a=e.container+";codecs="+s,t.logger.log("creating sourceBuffer with mimeType:"+a),i=o[n]=l.addSourceBuffer(a),i.addEventListener("updateend",this.onsbue),i.addEventListener("error",this.onsbe);this.sourceBuffer=o}}},{key:"onBufferAppending",value:function(e){this.segments?this.segments.push(e):this.segments=[e],this.doAppending()}},{key:"onBufferAppendFail",value:function(i){t.logger.error("sourceBuffer error:"+i.event),this.hls.trigger(e.default.ERROR,{type:r.ErrorTypes.MEDIA_ERROR,details:r.ErrorDetails.BUFFER_APPENDING_ERROR,fatal:!1,frag:this.fragCurrent})}},{key:"onBufferEos",value:function(){var e=this.sourceBuffer,r=this.mediaSource;r&&"open"===r.readyState&&(e.audio&&e.audio.updating||e.video&&e.video.updating?this._needsEos=!0:(t.logger.log("all media data available, signal endOfStream() to MediaSource and stop loading fragment"),r.endOfStream(),this._needsEos=!1))}},{key:"onBufferFlushing",value:function(e){this.flushRange.push({start:e.startOffset,end:e.endOffset}),this.flushBufferCounter=0,this.doFlush()}},{key:"doFlush",value:function(){for(;this.flushRange.length;){var r=this.flushRange[0];if(!this.flushBuffer(r.start,r.end))return void(this._needsFlush=!0);this.flushRange.shift(),this.flushBufferCounter=0}if(0===this.flushRange.length){this._needsFlush=!1;var i=0,t=this.sourceBuffer;if(t)for(var n in t)i+=t[n].buffered.length;this.appended=i,this.hls.trigger(e.default.BUFFER_FLUSHED)}}},{key:"doAppending",value:function(){var a=this.hls,s=this.sourceBuffer,n=this.segments;if(s){if(this.media.error)return n=[],void t.logger.error("trying to append although a media error occured, flush segment and abort");for(var l in s)if(s[l].updating)return;if(n.length){var o=n.shift();try{s[o.type].appendBuffer(o.data),this.appendError=0,this.appended++}catch(s){t.logger.error("error while trying to append buffer:"+s.message),n.unshift(o);var i={type:r.ErrorTypes.MEDIA_ERROR};if(22!==s.code){if(this.appendError?this.appendError++:this.appendError=1,i.details=r.ErrorDetails.BUFFER_APPEND_ERROR,i.frag=this.fragCurrent,this.appendError>a.config.appendErrorMaxRetry)return t.logger.log("fail "+a.config.appendErrorMaxRetry+" times to append segment in sourceBuffer"),n=[],i.fatal=!0,void a.trigger(e.default.ERROR,i);i.fatal=!1,a.trigger(e.default.ERROR,i)}else n=[],i.details=r.ErrorDetails.BUFFER_FULL_ERROR,a.trigger(e.default.ERROR,i)}}}}},{key:"flushBuffer",value:function(l,s){var e,r,o,a,i,n;if(this.flushBufferCounter<this.appended&&this.sourceBuffer)for(var u in this.sourceBuffer){if(e=this.sourceBuffer[u],e.updating)return t.logger.warn("cannot flush, sb updating in progress"),!1;for(r=0;r<e.buffered.length;r++)if(o=e.buffered.start(r),a=e.buffered.end(r),-1!==navigator.userAgent.toLowerCase().indexOf("firefox")&&s===Number.POSITIVE_INFINITY?(i=l,n=s):(i=Math.max(o,l),n=Math.min(a,s)),Math.min(n,a)-i>.5)return this.flushBufferCounter++,t.logger.log("flush "+u+" ["+i+","+n+"], of ["+o+","+a+"], pos:"+this.media.currentTime),e.remove(i,n),!1}else t.logger.warn("abort flushing too many retries");return t.logger.log("buffer flushed"),!0}}]),i}(s.default);n.default=o},{"../errors":20,"../event-handler":21,"../events":22,"../utils/logger":36}],5:[function(e,h,t){"use strict";function r(e){return e&&e.__esModule?e:{default:e}}function n(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}function a(t,e){if(!t)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return!e||"object"!=typeof e&&"function"!=typeof e?t:e}function f(t,e){if("function"!=typeof e&&null!==e)throw new TypeError("Super expression must either be null or a function, not "+typeof e);t.prototype=Object.create(e&&e.prototype,{constructor:{value:t,enumerable:!1,writable:!0,configurable:!0}}),e&&(Object.setPrototypeOf?Object.setPrototypeOf(t,e):t.__proto__=e)}Object.defineProperty(t,"__esModule",{value:!0});var o=function(){function e(i,r){for(var t=0;t<r.length;t++){var e=r[t];e.enumerable=e.enumerable||!1,e.configurable=!0,"value"in e&&(e.writable=!0),Object.defineProperty(i,e.key,e)}}return function(t,r,i){return r&&e(t.prototype,r),i&&e(t,i),t}}(),l=e("../events"),i=r(l),d=e("../event-handler"),s=r(d),u=function(t){function e(t){return n(this,e),a(this,Object.getPrototypeOf(e).call(this,t,i.default.MEDIA_ATTACHING,i.default.MANIFEST_PARSED))}return f(e,t),o(e,[{key:"destroy",value:function(){this.hls.config.capLevelToPlayerSize&&(this.media=null,this.autoLevelCapping=Number.POSITIVE_INFINITY,this.timer&&(this.timer=clearInterval(this.timer)))}},{key:"onMediaAttaching",value:function(e){this.media=e.media instanceof HTMLVideoElement?e.media:null}},{key:"onManifestParsed",value:function(e){this.hls.config.capLevelToPlayerSize&&(this.autoLevelCapping=Number.POSITIVE_INFINITY,this.levels=e.levels,this.hls.firstLevel=this.getMaxLevel(e.firstLevel),clearInterval(this.timer),this.timer=setInterval(this.detectPlayerSize.bind(this),1e3),this.detectPlayerSize())}},{key:"detectPlayerSize",value:function(){if(this.media){var e=this.levels?this.levels.length:0;e&&(this.hls.autoLevelCapping=this.getMaxLevel(e-1),this.hls.autoLevelCapping>this.autoLevelCapping&&this.hls.streamController.nextLevelSwitch(),this.autoLevelCapping=this.hls.autoLevelCapping)}}},{key:"getMaxLevel",value:function(a){var r=void 0,e=void 0,t=void 0,s=this.mediaWidth,o=this.mediaHeight,i=0,n=0;for(e=0;a>=e&&(t=this.levels[e],r=e,i=t.width,n=t.height,!(i>=s||n>=o));e++);return r}},{key:"contentScaleFactor",get:function(){var e=1;try{e=window.devicePixelRatio}catch(e){}return e}},{key:"mediaWidth",get:function(){var e=void 0;return this.media&&(e=this.media.width||this.media.clientWidth||this.media.offsetWidth,e*=this.contentScaleFactor),e}},{key:"mediaHeight",get:function(){var e=void 0;return this.media&&(e=this.media.height||this.media.clientHeight||this.media.offsetHeight,e*=this.contentScaleFactor),e}}]),e}(s.default);t.default=u},{"../event-handler":21,"../events":22}],6:[function(i,v,n){"use strict";function a(e){return e&&e.__esModule?e:{default:e}}function u(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}function h(t,e){if(!t)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return!e||"object"!=typeof e&&"function"!=typeof e?t:e}function s(t,e){if("function"!=typeof e&&null!==e)throw new TypeError("Super expression must either be null or a function, not "+typeof e);t.prototype=Object.create(e&&e.prototype,{constructor:{value:t,enumerable:!1,writable:!0,configurable:!0}}),e&&(Object.setPrototypeOf?Object.setPrototypeOf(t,e):t.__proto__=e)}Object.defineProperty(n,"__esModule",{value:!0});var c=function(){function e(i,r){for(var t=0;t<r.length;t++){var e=r[t];e.enumerable=e.enumerable||!1,e.configurable=!0,"value"in e&&(e.writable=!0),Object.defineProperty(i,e.key,e)}}return function(t,r,i){return r&&e(t.prototype,r),i&&e(t,i),t}}(),l=i("../events"),t=a(l),d=i("../event-handler"),f=a(d),r=i("../utils/logger"),e=i("../errors"),o=function(n){function i(r){u(this,i);var e=h(this,Object.getPrototypeOf(i).call(this,r,t.default.MANIFEST_LOADED,t.default.LEVEL_LOADED,t.default.ERROR));return e.ontick=e.tick.bind(e),e._manualLevel=e._autoLevelCapping=-1,e}return s(i,n),c(i,[{key:"destroy",value:function(){this.timer&&(clearInterval(this.timer),this.timer=null),this._manualLevel=-1}},{key:"startLoad",value:function(){this.canload=!0,this.timer&&this.tick()}},{key:"stopLoad",value:function(){this.canload=!1}},{key:"onManifestLoaded",value:function(l){var s,n,a=[],i=[],u={},d=!1,f=!1,o=this.hls;if(l.levels.forEach(function(e){e.videoCodec&&(d=!0),e.audioCodec&&(f=!0);var t=u[e.bitrate];void 0===t?(u[e.bitrate]=a.length,e.url=[e.url],e.urlId=0,a.push(e)):a[t].url.push(e.url)}),d&&f?a.forEach(function(e){e.videoCodec&&i.push(e)}):i=a,i=i.filter(function(e){var i=function(e){return MediaSource.isTypeSupported("audio/mp4;codecs="+e)},n=function(e){return MediaSource.isTypeSupported("video/mp4;codecs="+e)},t=e.audioCodec,r=e.videoCodec;return(!t||i(t))&&(!r||n(r))}),i.length){for(s=i[0].bitrate,i.sort(function(e,t){return e.bitrate-t.bitrate}),this._levels=i,n=0;n<i.length;n++)if(i[n].bitrate===s){this._firstLevel=n,r.logger.log("manifest loaded,"+i.length+" level(s) found, first bitrate:"+s);break}o.trigger(t.default.MANIFEST_PARSED,{levels:this._levels,firstLevel:this._firstLevel,stats:l.stats})}else o.trigger(t.default.ERROR,{type:e.ErrorTypes.MEDIA_ERROR,details:e.ErrorDetails.MANIFEST_INCOMPATIBLE_CODECS_ERROR,fatal:!0,url:o.url,reason:"no level with compatible codecs found in manifest"})}},{key:"setLevelInternal",value:function(i){if(i>=0&&i<this._levels.length){this.timer&&(clearInterval(this.timer),this.timer=null),this._level=i,r.logger.log("switching to level "+i),this.hls.trigger(t.default.LEVEL_SWITCH,{level:i});var n=this._levels[i];if(void 0===n.details||n.details.live===!0){r.logger.log("(re)loading playlist for level "+i);var a=n.urlId;this.hls.trigger(t.default.LEVEL_LOADING,{url:n.url[a],level:i,id:a})}}else this.hls.trigger(t.default.ERROR,{type:e.ErrorTypes.OTHER_ERROR,details:e.ErrorDetails.LEVEL_SWITCH_ERROR,level:i,fatal:!1,reason:"invalid level idx"})}},{key:"onError",value:function(a){if(!a.fatal){var s,i,n=a.details,o=this.hls;switch(n){case e.ErrorDetails.FRAG_LOAD_ERROR:case e.ErrorDetails.FRAG_LOAD_TIMEOUT:case e.ErrorDetails.FRAG_LOOP_LOADING_ERROR:case e.ErrorDetails.KEY_LOAD_ERROR:case e.ErrorDetails.KEY_LOAD_TIMEOUT:s=a.frag.level;break;case e.ErrorDetails.LEVEL_LOAD_ERROR:case e.ErrorDetails.LEVEL_LOAD_TIMEOUT:s=a.level}if(void 0!==s)if(i=this._levels[s],i.urlId<i.url.length-1)i.urlId++,i.details=void 0,r.logger.warn("level controller,"+n+" for level "+s+": switching to redundant stream id "+i.urlId);else{var l=-1===this._manualLevel&&s;l?(r.logger.warn("level controller,"+n+": emergency switch-down for next fragment"),o.abrController.nextAutoLevel=0):i&&i.details&&i.details.live?r.logger.warn("level controller,"+n+" on live stream, discard"):n!==e.ErrorDetails.FRAG_LOAD_ERROR&&n!==e.ErrorDetails.FRAG_LOAD_TIMEOUT&&(r.logger.error("cannot recover "+n+" error"),this._level=void 0,this.timer&&(clearInterval(this.timer),this.timer=null),a.fatal=!0,o.trigger(t.default.ERROR,a))}}}},{key:"onLevelLoaded",value:function(e){e.details.live&&!this.timer&&(this.timer=setInterval(this.ontick,1e3*e.details.targetduration)),!e.details.live&&this.timer&&(clearInterval(this.timer),this.timer=null)}},{key:"tick",value:function(){var e=this._level;if(void 0!==e&&this.canload){var r=this._levels[e],i=r.urlId;this.hls.trigger(t.default.LEVEL_LOADING,{url:r.url[i],level:e,id:i})}}},{key:"levels",get:function(){return this._levels}},{key:"level",get:function(){return this._level},set:function(e){this._level===e&&void 0!==this._levels[e].details||this.setLevelInternal(e)}},{key:"manualLevel",get:function(){return this._manualLevel},set:function(e){this._manualLevel=e,-1!==e&&(this.level=e)}},{key:"firstLevel",get:function(){return this._firstLevel},set:function(e){this._firstLevel=e}},{key:"startLevel",get:function(){return void 0===this._startLevel?this._firstLevel:this._startLevel},set:function(e){this._startLevel=e}},{key:"nextLoadLevel",get:function(){return-1!==this._manualLevel?this._manualLevel:this.hls.abrController.nextAutoLevel},set:function(e){this.level=e,-1===this._manualLevel&&(this.hls.abrController.nextAutoLevel=e)}}]),i}(f.default);n.default=o},{"../errors":20,"../event-handler":21,"../events":22,"../utils/logger":36}],7:[function(n,A,o){"use strict";function a(e){return e&&e.__esModule?e:{default:e}}function h(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}function c(t,e){if(!t)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return!e||"object"!=typeof e&&"function"!=typeof e?t:e}function v(t,e){if("function"!=typeof e&&null!==e)throw new TypeError("Super expression must either be null or a function, not "+typeof e);t.prototype=Object.create(e&&e.prototype,{constructor:{value:t,enumerable:!1,writable:!0,configurable:!0}}),e&&(Object.setPrototypeOf?Object.setPrototypeOf(t,e):t.__proto__=e)}Object.defineProperty(o,"__esModule",{value:!0});var m=function(){function e(i,r){for(var t=0;t<r.length;t++){var e=r[t];e.enumerable=e.enumerable||!1,e.configurable=!0,"value"in e&&(e.writable=!0),Object.defineProperty(i,e.key,e)}}return function(t,r,i){return r&&e(t.prototype,r),i&&e(t,i),t}}(),b=n("../demux/demuxer"),_=a(b),d=n("../events"),r=a(d),R=n("../event-handler"),l=a(R),t=n("../utils/logger"),g=n("../utils/binary-search"),p=a(g),y=n("../helper/buffer-helper"),s=a(y),E=n("../helper/level-helper"),u=a(E),i=n("../errors"),e={STOPPED:"STOPPED",STARTING:"STARTING",IDLE:"IDLE",PAUSED:"PAUSED",KEY_LOADING:"KEY_LOADING",FRAG_LOADING:"FRAG_LOADING",FRAG_LOADING_WAITING_RETRY:"FRAG_LOADING_WAITING_RETRY",WAITING_LEVEL:"WAITING_LEVEL",PARSING:"PARSING",PARSED:"PARSED",ENDED:"ENDED",ERROR:"ERROR"},f=function(a){function n(t){h(this,n);var e=c(this,Object.getPrototypeOf(n).call(this,t,r.default.MEDIA_ATTACHED,r.default.MEDIA_DETACHING,r.default.MANIFEST_LOADING,r.default.MANIFEST_PARSED,r.default.LEVEL_LOADED,r.default.KEY_LOADED,r.default.FRAG_LOADED,r.default.FRAG_LOAD_EMERGENCY_ABORTED,r.default.FRAG_PARSING_INIT_SEGMENT,r.default.FRAG_PARSING_DATA,r.default.FRAG_PARSED,r.default.ERROR,r.default.BUFFER_APPENDED,r.default.BUFFER_FLUSHED));return e.config=t.config,e.audioCodecSwap=!1,e.ticks=0,e.ontick=e.tick.bind(e),e}return v(n,a),m(n,[{key:"destroy",value:function(){this.stopLoad(),this.timer&&(clearInterval(this.timer),this.timer=null),l.default.prototype.destroy.call(this),this.state=e.STOPPED}},{key:"startLoad",value:function(){var n=arguments.length<=0||void 0===arguments[0]?0:arguments[0];if(this.levels){var r=this.media,i=this.lastCurrentTime;this.stopLoad(),this.demuxer=new _.default(this.hls),this.timer||(this.timer=setInterval(this.ontick,100)),this.level=-1,this.fragLoadError=0,r&&i?(t.logger.log("configure startPosition @"+i),this.lastPaused||(t.logger.log("resuming video"),r.play()),this.state=e.IDLE):(this.lastCurrentTime=this.startPosition?this.startPosition:n,this.state=e.STARTING),this.nextLoadPosition=this.startPosition=this.lastCurrentTime,this.tick()}else t.logger.warn("cannot start loading as manifest not parsed yet"),this.state=e.STOPPED}},{key:"stopLoad",value:function(){var t=this.fragCurrent;t&&(t.loader&&t.loader.abort(),this.fragCurrent=null),this.fragPrevious=null,this.demuxer&&(this.demuxer.destroy(),this.demuxer=null),this.state=e.STOPPED}},{key:"tick",value:function(){this.ticks++,1===this.ticks&&(this.doTick(),this.ticks>1&&setTimeout(this.tick,1),this.ticks=0)}},{key:"doTick",value:function(){var m,l,a,_=this,f=this.hls,o=f.config;switch(this.state){case e.ERROR:case e.PAUSED:break;case e.STARTING:this.startLevel=f.startLevel,-1===this.startLevel&&(this.startLevel=0,this.fragBitrateTest=!0),this.level=f.nextLoadLevel=this.startLevel,this.state=e.WAITING_LEVEL,this.loadedmetadata=!1;break;case e.IDLE:if(!this.media&&(this.startFragRequested||!o.startFragPrefetch))break;m=this.loadedmetadata?this.media.currentTime:this.nextLoadPosition,l=this.startFragRequested===!1?this.startLevel:f.nextLoadLevel;var c,b=s.default.bufferInfo(this.media,m,o.maxBufferHole),k=b.len,u=b.end,v=this.fragPrevious;if(this.levels[l].hasOwnProperty("bitrate")?(c=Math.max(8*o.maxBufferSize/this.levels[l].bitrate,o.maxBufferLength),c=Math.min(c,o.maxMaxBufferLength)):c=o.maxBufferLength,c>k){if(f.nextLoadLevel=l,this.level=l,a=this.levels[l].details,"undefined"==typeof a||a.live&&this.levelLastLoaded!==l){this.state=e.WAITING_LEVEL;break}var d=a.fragments,h=d.length,g=d[0].start,y=d[h-1].start+d[h-1].duration,n=void 0;if(a.live){var T=void 0!==o.liveMaxLatencyDuration?o.liveMaxLatencyDuration:o.liveMaxLatencyDurationCount*a.targetduration;if(u<Math.max(g,y-T)){var S=void 0!==o.liveSyncDuration?o.liveSyncDuration:o.liveSyncDurationCount*a.targetduration;this.seekAfterBuffered=g+Math.max(0,a.totalduration-S),t.logger.log("buffer end: "+u+" is located too far from the end of live sliding playlist, media position will be reseted to: "+this.seekAfterBuffered.toFixed(3)),u=this.seekAfterBuffered}if(u>y)break;if(this.startFragRequested&&!a.PTSKnown){if(v){var E=v.sn+1;E>=a.startSN&&E<=a.endSN&&(n=d[E-a.startSN],t.logger.log("live playlist, switching playlist, load frag with next SN: "+n.sn))}n||(n=d[Math.min(h-1,Math.round(h/2))],t.logger.log("live playlist, switching playlist, unknown, load middle frag : "+n.sn))}}else g>u&&(n=d[0]);if(n||!function(){var i=void 0,s=o.maxFragLookUpTolerance;y>u?(u>y-s&&(s=0),i=p.default.search(d,function(e){return e.start+e.duration-s<=u?1:e.start-s>u?-1:0})):i=d[h-1],i&&(n=i,g=i.start,v&&n.level===v.level&&n.sn===v.sn&&(n.sn<a.endSN?(n=d[n.sn+1-a.startSN],t.logger.log("SN just loaded, load next one: "+n.sn)):(a.live||(_.hls.trigger(r.default.BUFFER_EOS),_.state=e.ENDED),n=null)))}(),n)if(null!=n.decryptdata.uri&&null==n.decryptdata.key)t.logger.log("Loading key for "+n.sn+" of ["+a.startSN+" ,"+a.endSN+"],level "+l),this.state=e.KEY_LOADING,f.trigger(r.default.KEY_LOADING,{frag:n});else{if(t.logger.log("Loading "+n.sn+" of ["+a.startSN+" ,"+a.endSN+"],level "+l+", currentTime:"+m+",bufferEnd:"+u.toFixed(3)),n.autoLevel=f.autoLevelEnabled,this.levels.length>1&&(n.expectedLen=Math.round(n.duration*this.levels[l].bitrate/8),n.trequest=performance.now()),void 0!==this.fragLoadIdx?this.fragLoadIdx++:this.fragLoadIdx=0,n.loadCounter){n.loadCounter++;var R=o.fragLoadingLoopThreshold;if(n.loadCounter>R&&Math.abs(this.fragLoadIdx-n.loadIdx)<R)return void f.trigger(r.default.ERROR,{type:i.ErrorTypes.MEDIA_ERROR,details:i.ErrorDetails.FRAG_LOOP_LOADING_ERROR,fatal:!1,frag:n})}else n.loadCounter=1;n.loadIdx=this.fragLoadIdx,this.fragCurrent=n,this.startFragRequested=!0,f.trigger(r.default.FRAG_LOADING,{frag:n}),this.state=e.FRAG_LOADING}}break;case e.WAITING_LEVEL:l=this.levels[this.level],l&&l.details&&(this.state=e.IDLE);break;case e.FRAG_LOADING_WAITING_RETRY:var w=performance.now(),A=this.retryDate,L=this.media,O=L&&L.seeking;(!A||w>=A||O)&&(t.logger.log("mediaController: retryDate reached, switch back to IDLE state"),this.state=e.IDLE);break;case e.STOPPED:case e.FRAG_LOADING:case e.PARSING:case e.PARSED:case e.ENDED:}this._checkBuffer(),this._checkFragmentChanged()}},{key:"getBufferRange",value:function(i){var e,t,r=this.bufferRange;if(r)for(e=r.length-1;e>=0;e--)if(t=r[e],i>=t.start&&i<=t.end)return t;return null}},{key:"followingBufferRange",value:function(e){return e?this.getBufferRange(e.end+.5):null}},{key:"isBuffered",value:function(r){for(var i=this.media,t=i.buffered,e=0;e<t.length;e++)if(r>=t.start(e)&&r<=t.end(e))return!0;return!1}},{key:"_checkFragmentChanged",value:function(){var t,e,i=this.media;if(i&&i.seeking===!1&&(e=i.currentTime,e>i.playbackRate*this.lastCurrentTime&&(this.lastCurrentTime=e),this.isBuffered(e)?t=this.getBufferRange(e):this.isBuffered(e+.1)&&(t=this.getBufferRange(e+.1)),t)){var n=t.frag;n!==this.fragPlaying&&(this.fragPlaying=n,this.hls.trigger(r.default.FRAG_CHANGED,{frag:n}))}}},{key:"immediateLevelSwitch",value:function(){t.logger.log("immediateLevelSwitch"),this.immediateSwitch||(this.immediateSwitch=!0,this.previouslyPaused=this.media.paused,this.media.pause());var i=this.fragCurrent;i&&i.loader&&i.loader.abort(),this.fragCurrent=null,this.hls.trigger(r.default.BUFFER_FLUSHING,{startOffset:0,
endOffset:Number.POSITIVE_INFINITY}),this.state=e.PAUSED,this.fragLoadIdx+=2*this.config.fragLoadingLoopThreshold,this.tick()}},{key:"immediateLevelSwitchEnd",value:function(){this.immediateSwitch=!1,this.media.currentTime-=1e-4,this.previouslyPaused||this.media.play()}},{key:"nextLevelSwitch",value:function(){var n,i,t;if(i=this.getBufferRange(this.media.currentTime),i&&i.start>1&&(this.hls.trigger(r.default.BUFFER_FLUSHING,{startOffset:0,endOffset:i.start-1}),this.state=e.PAUSED),this.media.paused)n=0;else{var o=this.hls.nextLoadLevel,l=this.levels[o],s=this.fragLastKbps;n=s&&this.fragCurrent?this.fragCurrent.duration*l.bitrate/(1e3*s)+1:0}if(t=this.getBufferRange(this.media.currentTime+n),t&&(t=this.followingBufferRange(t))){this.hls.trigger(r.default.BUFFER_FLUSHING,{startOffset:t.start,endOffset:Number.POSITIVE_INFINITY}),this.state=e.PAUSED;var a=this.fragCurrent;a&&a.loader&&a.loader.abort(),this.fragCurrent=null,this.fragLoadIdx+=2*this.config.fragLoadingLoopThreshold}}},{key:"onMediaAttached",value:function(t){var e=this.media=t.media;this.onvseeking=this.onMediaSeeking.bind(this),this.onvseeked=this.onMediaSeeked.bind(this),this.onvended=this.onMediaEnded.bind(this),e.addEventListener("seeking",this.onvseeking),e.addEventListener("seeked",this.onvseeked),e.addEventListener("ended",this.onvended),this.levels&&this.config.autoStartLoad&&this.hls.startLoad()}},{key:"onMediaDetaching",value:function(){var e=this.media;e&&e.ended&&(t.logger.log("MSE detaching and video ended, reset startPosition"),this.startPosition=this.lastCurrentTime=0);var r=this.levels;r&&r.forEach(function(e){e.details&&e.details.fragments.forEach(function(e){e.loadCounter=void 0})}),e&&(e.removeEventListener("seeking",this.onvseeking),e.removeEventListener("seeked",this.onvseeked),e.removeEventListener("ended",this.onvended),this.onvseeking=this.onvseeked=this.onvended=null),this.media=null,this.loadedmetadata=!1,this.stopLoad()}},{key:"onMediaSeeking",value:function(){if(this.state===e.FRAG_LOADING){if(0===s.default.bufferInfo(this.media,this.media.currentTime,this.config.maxBufferHole).len){t.logger.log("seeking outside of buffer while fragment load in progress, cancel fragment load");var r=this.fragCurrent;r&&(r.loader&&r.loader.abort(),this.fragCurrent=null),this.fragPrevious=null,this.state=e.IDLE}}else this.state===e.ENDED&&(this.state=e.IDLE);this.media&&(this.lastCurrentTime=this.media.currentTime),void 0!==this.fragLoadIdx&&(this.fragLoadIdx+=2*this.config.fragLoadingLoopThreshold),this.tick()}},{key:"onMediaSeeked",value:function(){this.tick()}},{key:"onMediaEnded",value:function(){t.logger.log("media ended"),this.startPosition=this.lastCurrentTime=0}},{key:"onManifestLoading",value:function(){t.logger.log("trigger BUFFER_RESET"),this.hls.trigger(r.default.BUFFER_RESET),this.bufferRange=[],this.stalled=!1}},{key:"onManifestParsed",value:function(r){var e,i=!1,n=!1;r.levels.forEach(function(t){e=t.audioCodec,e&&(-1!==e.indexOf("mp4a.40.2")&&(i=!0),-1!==e.indexOf("mp4a.40.5")&&(n=!0))}),this.audioCodecSwitch=i&&n,this.audioCodecSwitch&&t.logger.log("both AAC/HE-AAC audio found in levels; declaring level codec as HE-AAC"),this.levels=r.levels,this.startLevelLoaded=!1,this.startFragRequested=!1,this.config.autoStartLoad&&this.hls.startLoad()}},{key:"onLevelLoaded",value:function(s){var i=s.details,n=s.level,o=this.levels[n],l=i.totalduration,a=0;if(t.logger.log("level "+n+" loaded ["+i.startSN+","+i.endSN+"],duration:"+l),this.levelLastLoaded=n,i.live){var d=o.details;d?(u.default.mergeDetails(d,i),a=i.fragments[0].start,i.PTSKnown?t.logger.log("live playlist sliding:"+a.toFixed(3)):t.logger.log("live playlist - outdated PTS, unknown sliding")):(i.PTSKnown=!1,t.logger.log("live playlist - first load, unknown sliding"))}else i.PTSKnown=!1;if(o.details=i,this.hls.trigger(r.default.LEVEL_UPDATED,{details:i,level:n}),this.startFragRequested===!1){if(i.live){var f=void 0!==this.config.liveSyncDuration?this.config.liveSyncDuration:this.config.liveSyncDurationCount*i.targetduration;this.startPosition=Math.max(0,a+l-f)}this.nextLoadPosition=this.startPosition}this.state===e.WAITING_LEVEL&&(this.state=e.IDLE),this.tick()}},{key:"onKeyLoaded",value:function(){this.state===e.KEY_LOADING&&(this.state=e.IDLE,this.tick())}},{key:"onFragLoaded",value:function(n){var i=this.fragCurrent;if(this.state===e.FRAG_LOADING&&i&&n.frag.level===i.level&&n.frag.sn===i.sn)if(this.fragBitrateTest===!0)this.state=e.IDLE,this.fragBitrateTest=!1,n.stats.tparsed=n.stats.tbuffered=performance.now(),this.hls.trigger(r.default.FRAG_BUFFERED,{stats:n.stats,frag:i});else{this.state=e.PARSING,this.stats=n.stats;var s=this.levels[this.level],o=s.details,d=o.totalduration,f=i.start,l=i.level,u=i.sn,a=s.audioCodec||this.config.defaultAudioCodec;this.audioCodecSwap&&(t.logger.log("swapping playlist audio codec"),void 0===a&&(a=this.lastAudioCodec),a&&(a=-1!==a.indexOf("mp4a.40.5")?"mp4a.40.2":"mp4a.40.5")),this.pendingAppending=0,t.logger.log("Demuxing "+u+" of ["+o.startSN+" ,"+o.endSN+"],level "+l),this.demuxer.push(n.payload,a,s.videoCodec,f,i.cc,l,u,d,i.decryptdata)}this.fragLoadError=0}},{key:"onFragParsingInitSegment",value:function(l){if(this.state===e.PARSING){var o,i,n=l.tracks;if(i=n.audio){var a=this.levels[this.level].audioCodec,u=navigator.userAgent.toLowerCase();a&&this.audioCodecSwap&&(t.logger.log("swapping playlist audio codec"),a=-1!==a.indexOf("mp4a.40.5")?"mp4a.40.2":"mp4a.40.5"),this.audioCodecSwitch&&1!==i.metadata.channelCount&&-1===u.indexOf("firefox")&&(a="mp4a.40.5"),-1!==u.indexOf("android")&&(a="mp4a.40.2",t.logger.log("Android: force audio codec to"+a)),i.levelCodec=a}if(i=n.video,i&&(i.levelCodec=this.levels[this.level].videoCodec),l.unique){var s={codec:"",levelCodec:""};for(o in l.tracks)i=n[o],s.container=i.container,s.codec&&(s.codec+=",",s.levelCodec+=","),i.codec&&(s.codec+=i.codec),i.levelCodec&&(s.levelCodec+=i.levelCodec);n={audiovideo:s}}this.hls.trigger(r.default.BUFFER_CODECS,n);for(o in n){i=n[o],t.logger.log("track:"+o+",container:"+i.container+",codecs[level/parsed]=["+i.levelCodec+"/"+i.codec+"]");var d=i.initSegment;d&&(this.pendingAppending++,this.hls.trigger(r.default.BUFFER_APPENDING,{type:o,data:d}))}this.tick()}}},{key:"onFragParsingData",value:function(i){var o=this;if(this.state===e.PARSING){this.tparse2=Date.now();var n=this.levels[this.level],a=this.fragCurrent;t.logger.log("parsed "+i.type+",PTS:["+i.startPTS.toFixed(3)+","+i.endPTS.toFixed(3)+"],DTS:["+i.startDTS.toFixed(3)+"/"+i.endDTS.toFixed(3)+"],nb:"+i.nb);var l=u.default.updateFragPTS(n.details,a.sn,i.startPTS,i.endPTS),s=this.hls;s.trigger(r.default.LEVEL_PTS_UPDATED,{details:n.details,level:this.level,drift:l}),[i.data1,i.data2].forEach(function(e){e&&(o.pendingAppending++,s.trigger(r.default.BUFFER_APPENDING,{type:i.type,data:e}))}),this.nextLoadPosition=i.endPTS,this.bufferRange.push({type:i.type,start:i.startPTS,end:i.endPTS,frag:a}),this.tick()}else t.logger.warn("not in PARSING state but "+this.state+", ignoring FRAG_PARSING_DATA event")}},{key:"onFragParsed",value:function(){this.state===e.PARSING&&(this.stats.tparsed=performance.now(),this.state=e.PARSED,this._checkAppendedParsed())}},{key:"onBufferAppended",value:function(){switch(this.state){case e.PARSING:case e.PARSED:this.pendingAppending--,this._checkAppendedParsed()}}},{key:"_checkAppendedParsed",value:function(){if(this.state===e.PARSED&&0===this.pendingAppending){var n=this.fragCurrent,i=this.stats;n&&(this.fragPrevious=n,i.tbuffered=performance.now(),this.fragLastKbps=Math.round(8*i.length/(i.tbuffered-i.tfirst)),this.hls.trigger(r.default.FRAG_BUFFERED,{stats:i,frag:n}),t.logger.log("media buffered : "+this.timeRangesToString(this.media.buffered)),this.state=e.IDLE),this.tick()}}},{key:"onError",value:function(n){switch(n.details){case i.ErrorDetails.FRAG_LOAD_ERROR:case i.ErrorDetails.FRAG_LOAD_TIMEOUT:if(!n.fatal){var a=this.fragLoadError;if(a?a++:a=1,a<=this.config.fragLoadingMaxRetry){this.fragLoadError=a,n.frag.loadCounter=0;var s=Math.min(Math.pow(2,a-1)*this.config.fragLoadingRetryDelay,64e3);t.logger.warn("mediaController: frag loading failed, retry in "+s+" ms"),this.retryDate=performance.now()+s,this.state=e.FRAG_LOADING_WAITING_RETRY}else t.logger.error("mediaController: "+n.details+" reaches max retry, redispatch as fatal ..."),n.fatal=!0,this.hls.trigger(r.default.ERROR,n),this.state=e.ERROR}break;case i.ErrorDetails.FRAG_LOOP_LOADING_ERROR:case i.ErrorDetails.LEVEL_LOAD_ERROR:case i.ErrorDetails.LEVEL_LOAD_TIMEOUT:case i.ErrorDetails.KEY_LOAD_ERROR:case i.ErrorDetails.KEY_LOAD_TIMEOUT:this.state!==e.ERROR&&(this.state=n.fatal?e.ERROR:e.IDLE,t.logger.warn("mediaController: "+n.details+" while loading frag,switch to "+this.state+" state ..."));break;case i.ErrorDetails.BUFFER_FULL_ERROR:this.config.maxMaxBufferLength/=2,t.logger.warn("reduce max buffer length to "+this.config.maxMaxBufferLength+"s and trigger a nextLevelSwitch to flush old buffer and fix QuotaExceededError"),this.nextLevelSwitch()}}},{key:"_checkBuffer",value:function(){var e=this.media;if(e){var f=e.readyState;if(f){var n,a,l=this.seekAfterBuffered;if(l)e.duration>=l&&(n=l,this.seekAfterBuffered=void 0);else{a=e.currentTime;var g=this.loadedmetadata;!g&&e.buffered.length&&(this.loadedmetadata=!0,a||a===this.startPosition||(n=this.startPosition))}n&&(a=n,t.logger.log("target seek position:"+n));var u=s.default.bufferInfo(e,a,0),v=!(e.paused||e.ended||e.seeking||2>f),d=.4,h=a>e.playbackRate*this.lastCurrentTime;if(this.stalled&&h&&(this.stalled=!1,t.logger.log("playback not stuck anymore @"+a)),v&&u.len<=d){if(h?(d=0,this.seekHoleNudgeDuration=0):this.stalled?this.seekHoleNudgeDuration+=this.config.seekHoleNudgeDuration:(this.seekHoleNudgeDuration=0,t.logger.log("playback seems stuck @"+a),this.hls.trigger(r.default.ERROR,{type:i.ErrorTypes.MEDIA_ERROR,details:i.ErrorDetails.BUFFER_STALLED_ERROR,fatal:!1}),this.stalled=!0),u.len<=d){var o=u.nextStart,c=o-a;o&&c<this.config.maxSeekHole&&c>0&&!e.seeking&&(t.logger.log("adjust currentTime from "+e.currentTime+" to next buffered @ "+o+" + nudge "+this.seekHoleNudgeDuration),e.currentTime=o+this.seekHoleNudgeDuration,this.hls.trigger(r.default.ERROR,{type:i.ErrorTypes.MEDIA_ERROR,details:i.ErrorDetails.BUFFER_SEEK_OVER_HOLE,fatal:!1}))}}else n&&e.currentTime!==n&&(t.logger.log("adjust currentTime from "+e.currentTime+" to "+n),e.currentTime=n)}}}},{key:"onFragLoadEmergencyAborted",value:function(){this.state=e.IDLE,this.tick()}},{key:"onBufferFlushed",value:function(){var t,r,i=[];for(r=0;r<this.bufferRange.length;r++)t=this.bufferRange[r],this.isBuffered((t.start+t.end)/2)&&i.push(t);this.bufferRange=i,this.immediateSwitch&&this.immediateLevelSwitchEnd(),this.state=e.IDLE,this.fragPrevious=null}},{key:"swapAudioCodec",value:function(){this.audioCodecSwap=!this.audioCodecSwap}},{key:"timeRangesToString",value:function(t){for(var r="",i=t.length,e=0;i>e;e++)r+="["+t.start(e)+","+t.end(e)+"]";return r}},{key:"currentLevel",get:function(){if(this.media){var e=this.getBufferRange(this.media.currentTime);if(e)return e.frag.level}return-1}},{key:"nextBufferRange",get:function(){return this.media?this.followingBufferRange(this.getBufferRange(this.media.currentTime)):null}},{key:"nextLevel",get:function(){var e=this.nextBufferRange;return e?e.frag.level:-1}}]),n}(l.default);o.default=f},{"../demux/demuxer":16,"../errors":20,"../event-handler":21,"../events":22,"../helper/buffer-helper":23,"../helper/level-helper":24,"../utils/binary-search":34,"../utils/logger":36}],8:[function(t,v,i){"use strict";function r(e){return e&&e.__esModule?e:{default:e}}function f(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}function a(t,e){if(!t)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return!e||"object"!=typeof e&&"function"!=typeof e?t:e}function s(t,e){if("function"!=typeof e&&null!==e)throw new TypeError("Super expression must either be null or a function, not "+typeof e);t.prototype=Object.create(e&&e.prototype,{constructor:{value:t,enumerable:!1,writable:!0,configurable:!0}}),e&&(Object.setPrototypeOf?Object.setPrototypeOf(t,e):t.__proto__=e)}Object.defineProperty(i,"__esModule",{value:!0});var c=function(){function e(i,r){for(var t=0;t<r.length;t++){var e=r[t];e.enumerable=e.enumerable||!1,e.configurable=!0,"value"in e&&(e.writable=!0),Object.defineProperty(i,e.key,e)}}return function(t,r,i){return r&&e(t.prototype,r),i&&e(t,i),t}}(),l=t("../events"),e=r(l),d=t("../event-handler"),n=r(d),h=t("../utils/cea-708-interpreter"),o=r(h),u=function(r){function t(i){f(this,t);var r=a(this,Object.getPrototypeOf(t).call(this,i,e.default.MEDIA_ATTACHING,e.default.MEDIA_DETACHING,e.default.FRAG_PARSING_USERDATA,e.default.MANIFEST_LOADING,e.default.FRAG_LOADED));return r.hls=i,r.config=i.config,r.config.enableCEA708Captions&&(r.cea708Interpreter=new o.default),r}return s(t,r),c(t,[{key:"destroy",value:function(){n.default.prototype.destroy.call(this)}},{key:"onMediaAttaching",value:function(e){var t=this.media=e.media;this.cea708Interpreter.attach(t)}},{key:"onMediaDetaching",value:function(){this.cea708Interpreter.detach()}},{key:"onManifestLoading",value:function(){this.lastPts=Number.POSITIVE_INFINITY}},{key:"onFragLoaded",value:function(t){var e=t.frag.start;e<=this.lastPts&&this.cea708Interpreter.clear(),this.lastPts=e}},{key:"onFragParsingUserdata",value:function(t){for(var e=0;e<t.samples.length;e++)this.cea708Interpreter.push(t.samples[e].pts,t.samples[e].bytes)}}]),t}(n.default);i.default=u},{"../event-handler":21,"../events":22,"../utils/cea-708-interpreter":35}],9:[function(n,a,e){"use strict";function t(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}Object.defineProperty(e,"__esModule",{value:!0});var r=function(){function e(i,r){for(var t=0;t<r.length;t++){var e=r[t];e.enumerable=e.enumerable||!1,e.configurable=!0,"value"in e&&(e.writable=!0),Object.defineProperty(i,e.key,e)}}return function(t,r,i){return r&&e(t.prototype,r),i&&e(t,i),t}}(),i=function(){function e(f){t(this,e),this._tables=[[[],[],[],[],[]],[[],[],[],[],[]]],this._precompute();var i,s,r,o,l,a=this._tables[0][4],u=this._tables[1],n=f.length,d=1;if(4!==n&&6!==n&&8!==n)throw new Error("Invalid aes key size="+n);for(o=f.slice(0),l=[],this._key=[o,l],i=n;4*n+28>i;i++)r=o[i-1],(i%n===0||8===n&&i%n===4)&&(r=a[r>>>24]<<24^a[r>>16&255]<<16^a[r>>8&255]<<8^a[255&r],i%n===0&&(r=r<<8^r>>>24^d<<24,d=d<<1^283*(d>>7))),o[i]=o[i-n]^r;for(s=0;i;s++,i--)r=o[3&s?i:i-4],4>=i||4>s?l[s]=r:l[s]=u[0][a[r>>>24]]^u[1][a[r>>16&255]]^u[2][a[r>>8&255]]^u[3][a[255&r]]}return r(e,[{key:"_precompute",value:function(){var e,i,r,u,f,d,t,s,l,a=this._tables[0],o=this._tables[1],h=a[4],v=o[4],n=[],c=[];for(e=0;256>e;e++)c[(n[e]=e<<1^283*(e>>7))^e]=e;for(i=r=0;!h[i];i^=u||1,r=c[r]||1)for(t=r^r<<1^r<<2^r<<3^r<<4,t=t>>8^255&t^99,h[i]=t,v[t]=i,d=n[f=n[u=n[i]]],l=16843009*d^65537*f^257*u^16843008*i,s=257*n[t]^16843008*t,e=0;4>e;e++)a[e][i]=s=s<<24^s>>>8,o[e][t]=l=l<<24^l>>>8;for(e=0;5>e;e++)a[e]=a[e].slice(0),o[e]=o[e].slice(0)}},{key:"decrypt",value:function(R,p,_,b,E,m){var h,g,v,a,e=this._key[1],t=R^e[0],i=b^e[1],n=_^e[2],r=p^e[3],y=e.length/4-2,s=4,o=this._tables[1],f=o[0],d=o[1],u=o[2],l=o[3],c=o[4];for(a=0;y>a;a++)h=f[t>>>24]^d[i>>16&255]^u[n>>8&255]^l[255&r]^e[s],g=f[i>>>24]^d[n>>16&255]^u[r>>8&255]^l[255&t]^e[s+1],v=f[n>>>24]^d[r>>16&255]^u[t>>8&255]^l[255&i]^e[s+2],r=f[r>>>24]^d[t>>16&255]^u[i>>8&255]^l[255&n]^e[s+3],s+=4,t=h,i=g,n=v;for(a=0;4>a;a++)E[(3&-a)+m]=c[t>>>24]<<24^c[i>>16&255]<<16^c[n>>8&255]<<8^c[255&r]^e[s++],h=t,t=i,i=n,n=r,r=h}}]),e}();e.default=i},{}],10:[function(t,l,e){"use strict";function r(e){return e&&e.__esModule?e:{default:e}}function i(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}Object.defineProperty(e,"__esModule",{value:!0});var n=function(){function e(i,r){for(var t=0;t<r.length;t++){var e=r[t];e.enumerable=e.enumerable||!1,e.configurable=!0,"value"in e&&(e.writable=!0),Object.defineProperty(i,e.key,e)}}return function(t,r,i){return r&&e(t.prototype,r),i&&e(t,i),t}}(),a=t("./aes"),s=r(a),o=function(){function e(t,r){i(this,e),this.key=t,this.iv=r}return n(e,[{key:"ntoh",value:function(e){return e<<24|(65280&e)<<8|(16711680&e)>>8|e>>>24}},{key:"doDecrypt",value:function(i,g,n){var u,h,o,f,l,c,d,a,e,r=new Int32Array(i.buffer,i.byteOffset,i.byteLength>>2),p=new s.default(Array.prototype.slice.call(g)),v=new Uint8Array(i.byteLength),t=new Int32Array(v.buffer);for(u=~~n[0],h=~~n[1],o=~~n[2],f=~~n[3],e=0;e<r.length;e+=4)l=~~this.ntoh(r[e]),c=~~this.ntoh(r[e+1]),d=~~this.ntoh(r[e+2]),a=~~this.ntoh(r[e+3]),p.decrypt(l,c,d,a,t,e),t[e]=this.ntoh(t[e]^u),t[e+1]=this.ntoh(t[e+1]^h),t[e+2]=this.ntoh(t[e+2]^o),t[e+3]=this.ntoh(t[e+3]^f),u=l,h=c,o=d,f=a;return v}},{key:"localDecrypt",value:function(e,t,r,i){var n=this.doDecrypt(e,t,r);i.set(n,e.byteOffset)}},{key:"decrypt",value:function(a){var r=32e3,t=new Int32Array(a),i=new Uint8Array(a.byteLength),e=0,s=this.key,n=this.iv;for(this.localDecrypt(t.subarray(e,e+r),s,n,i),e=r;e<t.length;e+=r)n=new Uint32Array([this.ntoh(t[e-4]),this.ntoh(t[e-3]),this.ntoh(t[e-2]),this.ntoh(t[e-1])]),this.localDecrypt(t.subarray(e,e+r),s,n,i);return i}}]),e}();e.default=o},{"./aes":9}],11:[function(t,d,r){"use strict";function l(e){return e&&e.__esModule?e:{default:e}}function n(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}Object.defineProperty(r,"__esModule",{value:!0});var u=function(){function e(i,r){for(var t=0;t<r.length;t++){var e=r[t];e.enumerable=e.enumerable||!1,e.configurable=!0,"value"in e&&(e.writable=!0),Object.defineProperty(i,e.key,e)}}return function(t,r,i){return r&&e(t.prototype,r),i&&e(t,i),t}}(),s=t("./aes128-decrypter"),o=l(s),i=t("../errors"),e=t("../utils/logger"),a=function(){function t(r){n(this,t),this.hls=r;try{var e=window?window.crypto:crypto;this.subtle=e.subtle||e.webkitSubtle,this.disableWebCrypto=!this.subtle}catch(e){this.disableWebCrypto=!0}}return u(t,[{key:"destroy",value:function(){}},{key:"decrypt",value:function(e,t,r,i){this.disableWebCrypto&&this.hls.config.enableSoftwareAES?this.decryptBySoftware(e,t,r,i):this.decryptByWebCrypto(e,t,r,i)}},{key:"decryptByWebCrypto",value:function(t,r,i,n){var a=this;e.logger.log("decrypting by WebCrypto API"),this.subtle.importKey("raw",r,{name:"AES-CBC",length:128},!1,["decrypt"]).then(function(e){a.subtle.decrypt({name:"AES-CBC",iv:i.buffer},e,t).then(n).catch(function(e){a.onWebCryptoError(e,t,r,i,n)})}).catch(function(e){a.onWebCryptoError(e,t,r,i,n)})}},{key:"decryptBySoftware",value:function(r,i,n,a){e.logger.log("decrypting by JavaScript Implementation");var t=new DataView(i.buffer),s=new Uint32Array([t.getUint32(0),t.getUint32(4),t.getUint32(8),t.getUint32(12)]);t=new DataView(n.buffer);var l=new Uint32Array([t.getUint32(0),t.getUint32(4),t.getUint32(8),t.getUint32(12)]),u=new o.default(s,l);a(u.decrypt(r).buffer)}},{key:"onWebCryptoError",value:function(t,r,n,a,s){this.hls.config.enableSoftwareAES?(e.logger.log("disabling to use WebCrypto API"),this.disableWebCrypto=!0,this.decryptBySoftware(r,n,a,s)):(e.logger.error("decrypting error : "+t.message),this.hls.trigger(Event.ERROR,{type:i.ErrorTypes.MEDIA_ERROR,details:i.ErrorDetails.FRAG_DECRYPT_ERROR,fatal:!0,reason:t.message}))}}]),t}();r.default=a},{"../errors":20,"../utils/logger":36,"./aes128-decrypter":10}],12:[function(e,f,t){"use strict";function r(e){return e&&e.__esModule?e:{default:e}}function n(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}Object.defineProperty(t,"__esModule",{value:!0});var a=function(){function e(i,r){for(var t=0;t<r.length;t++){var e=r[t];e.enumerable=e.enumerable||!1,e.configurable=!0,"value"in e&&(e.writable=!0),Object.defineProperty(i,e.key,e)}}return function(t,r,i){return r&&e(t.prototype,r),i&&e(t,i),t}}(),d=e("./adts"),o=r(d),l=e("../utils/logger"),u=e("../demux/id3"),i=r(u),s=function(){function e(t,r){n(this,e),this.observer=t,this.remuxerClass=r,this.remuxer=new this.remuxerClass(t),this._aacTrack={container:"audio/adts",type:"audio",id:-1,sequenceNumber:0,samples:[],len:0}}return a(e,[{key:"push",value:function(t,p,R,m,_,b,E,y){var n,a,g,c,e,s,f,u,v,r=this._aacTrack,d=new i.default(t),h=90*d.timeStamp;for(e=d.length,u=t.length;u-1>e&&(255!==t[e]||240!==(240&t[e+1]));e++);for(r.audiosamplerate||(n=o.default.getAudioConfig(this.observer,t,e,p),r.config=n.config,r.audiosamplerate=n.samplerate,r.channelCount=n.channelCount,r.codec=n.codec,r.duration=y,l.logger.log("parsed codec:"+r.codec+",rate:"+n.samplerate+",nb channel:"+n.channelCount)),c=0,g=9216e4/r.audiosamplerate;u>e+5&&(s=1&t[e+1]?7:9,a=(3&t[e+3])<<11|t[e+4]<<3|(224&t[e+5])>>>5,a-=s,a>0&&u>=e+s+a);)for(f=h+c*g,v={unit:t.subarray(e+s,e+s+a),pts:f,dts:f},r.samples.push(v),r.len+=a,e+=a+s,c++;u-1>e&&(255!==t[e]||240!==(240&t[e+1]));e++);this.remuxer.remux(this._aacTrack,{samples:[]},{samples:[{pts:h,dts:h,unit:d.payload}]},{samples:[]},m)}},{key:"destroy",value:function(){}}],[{key:"probe",value:function(t){var e,r,n=new i.default(t);if(n.hasTimeStamp)for(e=n.length,r=t.length;r-1>e;e++)if(255===t[e]&&240===(240&t[e+1]))return!0;return!1}}]),e}();t.default=s},{"../demux/id3":18,"../utils/logger":36,"./adts":13}],13:[function(e,o,t){"use strict";function i(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}Object.defineProperty(t,"__esModule",{value:!0});var n=function(){function e(i,r){for(var t=0;t<r.length;t++){var e=r[t];e.enumerable=e.enumerable||!1,e.configurable=!0,"value"in e&&(e.writable=!0),Object.defineProperty(i,e.key,e)}}return function(t,r,i){return r&&e(t.prototype,r),i&&e(t,i),t}}(),a=e("../utils/logger"),r=e("../errors"),s=function(){function e(){i(this,e)}return n(e,null,[{key:"getAudioConfig",value:function(h,u,l,n){var i,e,s,o,t,f=navigator.userAgent.toLowerCase(),d=[96e3,88200,64e3,48e3,44100,32e3,24e3,22050,16e3,12e3,11025,8e3,7350];return i=((192&u[l+2])>>>6)+1,e=(60&u[l+2])>>>2,e>d.length-1?void h.trigger(Event.ERROR,{type:r.ErrorTypes.MEDIA_ERROR,details:r.ErrorDetails.FRAG_PARSING_ERROR,fatal:!0,reason:"invalid ADTS sampling index:"+e}):(o=(1&u[l+2])<<2,o|=(192&u[l+3])>>>6,a.logger.log("manifest codec:"+n+",ADTS data:type:"+i+",sampleingIndex:"+e+"["+d[e]+"Hz],channelConfig:"+o),-1!==f.indexOf("firefox")?e>=6?(i=5,t=new Array(4),s=e-3):(i=2,t=new Array(2),s=e):-1!==f.indexOf("android")?(i=2,t=new Array(2),s=e):(i=5,t=new Array(4),n&&(-1!==n.indexOf("mp4a.40.29")||-1!==n.indexOf("mp4a.40.5"))||!n&&e>=6?s=e-3:((n&&-1!==n.indexOf("mp4a.40.2")&&e>=6&&1===o||!n&&1===o)&&(i=2,t=new Array(2)),s=e)),t[0]=i<<3,t[0]|=(14&e)>>1,t[1]|=(1&e)<<7,t[1]|=o<<3,5===i&&(t[1]|=(14&s)>>1,t[2]=(1&s)<<7,t[2]|=8,t[3]=0),{config:t,samplerate:d[e],channelCount:o,codec:"mp4a.40."+i})}}]),e}();t.default=s},{"../errors":20,"../utils/logger":36}],14:[function(e,y,i){"use strict";function t(e){return e&&e.__esModule?e:{default:e}}function d(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}Object.defineProperty(i,"__esModule",{value:!0});var h=function(){function e(i,r){for(var t=0;t<r.length;t++){var e=r[t];e.enumerable=e.enumerable||!1,e.configurable=!0,"value"in e&&(e.writable=!0),Object.defineProperty(i,e.key,e)}}return function(t,r,i){return r&&e(t.prototype,r),i&&e(t,i),t}}(),v=e("../events"),o=t(v),n=e("../errors"),p=e("../demux/aacdemuxer"),a=t(p),f=e("../demux/tsdemuxer"),r=t(f),c=e("../remux/mp4-remuxer"),s=t(c),g=e("../remux/passthrough-remuxer"),u=t(g),l=function(){function e(t,r){d(this,e),this.hls=t,this.typeSupported=r}return h(e,[{key:"destroy",value:function(){var e=this.demuxer;e&&e.destroy()}},{key:"push",value:function(i,l,d,f,h,c,v,g){var e=this.demuxer;if(!e){var t=this.hls;if(r.default.probe(i))e=this.typeSupported.mp2t===!0?new r.default(t,u.default):new r.default(t,s.default);else{if(!a.default.probe(i))return void t.trigger(o.default.ERROR,{type:n.ErrorTypes.MEDIA_ERROR,details:n.ErrorDetails.FRAG_PARSING_ERROR,fatal:!0,reason:"no demux matching with content found"});e=new a.default(t,s.default)}this.demuxer=e}e.push(i,l,d,f,h,c,v,g)}}]),e}();i.default=l},{"../demux/aacdemuxer":12,"../demux/tsdemuxer":19,"../errors":20,"../events":22,"../remux/mp4-remuxer":31,"../remux/passthrough-remuxer":32}],15:[function(t,d,i){"use strict";function r(e){return e&&e.__esModule?e:{default:e}}Object.defineProperty(i,"__esModule",{value:!0});var n=t("../demux/demuxer-inline"),u=r(n),s=t("../events"),e=r(s),l=t("events"),a=r(l),o=function(r){var t=new a.default;t.trigger=function(i){for(var r=arguments.length,n=Array(r>1?r-1:0),e=1;r>e;e++)n[e-1]=arguments[e];t.emit.apply(t,[i,i].concat(n))},t.off=function(n){for(var r=arguments.length,i=Array(r>1?r-1:0),e=1;r>e;e++)i[e-1]=arguments[e];t.removeListener.apply(t,[n].concat(i))},r.addEventListener("message",function(i){var e=i.data;switch(e.cmd){case"init":r.demuxer=new u.default(t,e.typeSupported);break;case"demux":r.demuxer.push(new Uint8Array(e.data),e.audioCodec,e.videoCodec,e.timeOffset,e.cc,e.level,e.sn,e.duration)}}),t.on(e.default.FRAG_PARSING_INIT_SEGMENT,function(t,e){r.postMessage({event:t,tracks:e.tracks,unique:e.unique})}),t.on(e.default.FRAG_PARSING_DATA,function(i,e){var t={event:i,type:e.type,startPTS:e.startPTS,endPTS:e.endPTS,startDTS:e.startDTS,endDTS:e.endDTS,data1:e.data1.buffer,data2:e.data2.buffer,nb:e.nb};r.postMessage(t,[t.data1,t.data2])}),t.on(e.default.FRAG_PARSED,function(e){r.postMessage({event:e})}),t.on(e.default.ERROR,function(e,t){r.postMessage({event:e,data:t})}),t.on(e.default.FRAG_PARSING_METADATA,function(e,t){var i={event:e,samples:t.samples};r.postMessage(i)}),t.on(e.default.FRAG_PARSING_USERDATA,function(e,t){var i={event:e,samples:t.samples};r.postMessage(i)})};i.default=o},{"../demux/demuxer-inline":14,"../events":22,events:1}],16:[function(t,g,i){"use strict";function r(e){return e&&e.__esModule?e:{default:e}}function u(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}Object.defineProperty(i,"__esModule",{value:!0});var h=function(){function e(i,r){for(var t=0;t<r.length;t++){var e=r[t];e.enumerable=e.enumerable||!1,e.configurable=!0,"value"in e&&(e.writable=!0),Object.defineProperty(i,e.key,e)}}return function(t,r,i){return r&&e(t.prototype,r),i&&e(t,i),t}}(),s=t("../events"),e=r(s),v=t("../demux/demuxer-inline"),n=r(v),d=t("../demux/demuxer-worker"),f=r(d),a=t("../utils/logger"),c=t("../crypt/decrypter"),l=r(c),o=function(){function r(e){u(this,r),this.hls=e;var i={mp4:MediaSource.isTypeSupported("video/mp4"),mp2t:e.config.enableMP2TPassThrough&&MediaSource.isTypeSupported("video/mp2t")};if(e.config.enableWorker&&"undefined"!=typeof Worker){a.logger.log("demuxing in webworker");try{var s=t("webworkify");this.w=s(f.default),this.onwmsg=this.onWorkerMessage.bind(this),this.w.addEventListener("message",this.onwmsg),this.w.postMessage({cmd:"init",typeSupported:i})}catch(t){a.logger.error("error while initializing DemuxerWorker, fallback on DemuxerInline"),this.demuxer=new n.default(e,i)}}else this.demuxer=new n.default(e,i);this.demuxInitialized=!0}return h(r,[{key:"destroy",value:function(){this.w?(this.w.removeEventListener("message",this.onwmsg),this.w.terminate(),this.w=null):(this.demuxer.destroy(),this.demuxer=null),this.decrypter&&(this.decrypter.destroy(),this.decrypter=null)}},{key:"pushDecrypted",value:function(e,t,r,i,n,a,s,o){this.w?this.w.postMessage({cmd:"demux",data:e,audioCodec:t,videoCodec:r,timeOffset:i,cc:n,level:a,sn:s,duration:o},[e]):this.demuxer.push(new Uint8Array(e),t,r,i,n,a,s,o)}},{key:"push",value:function(t,r,i,n,a,s,o,u,e){if(t.byteLength>0&&null!=e&&null!=e.key&&"AES-128"===e.method){null==this.decrypter&&(this.decrypter=new l.default(this.hls));var d=this;this.decrypter.decrypt(t,e.key,e.iv,function(e){d.pushDecrypted(e,r,i,n,a,s,o,u)})}else this.pushDecrypted(t,r,i,n,a,s,o,u)}},{key:"onWorkerMessage",value:function(i){var t=i.data;switch(t.event){case e.default.FRAG_PARSING_INIT_SEGMENT:var r={};r.tracks=t.tracks,r.unique=t.unique,this.hls.trigger(e.default.FRAG_PARSING_INIT_SEGMENT,r);break;case e.default.FRAG_PARSING_DATA:this.hls.trigger(e.default.FRAG_PARSING_DATA,{data1:new Uint8Array(t.data1),data2:new Uint8Array(t.data2),startPTS:t.startPTS,endPTS:t.endPTS,startDTS:t.startDTS,endDTS:t.endDTS,type:t.type,nb:t.nb});break;case e.default.FRAG_PARSING_METADATA:this.hls.trigger(e.default.FRAG_PARSING_METADATA,{samples:t.samples});break;case e.default.FRAG_PARSING_USERDATA:this.hls.trigger(e.default.FRAG_PARSING_USERDATA,{samples:t.samples});break;default:this.hls.trigger(t.event,t.data)}}}]),r}();i.default=o},{"../crypt/decrypter":11,"../demux/demuxer-inline":14,"../demux/demuxer-worker":15,"../events":22,"../utils/logger":36,webworkify:2}],17:[function(t,s,e){"use strict";function r(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}Object.defineProperty(e,"__esModule",{value:!0});var i=function(){function e(i,r){for(var t=0;t<r.length;t++){var e=r[t];e.enumerable=e.enumerable||!1,e.configurable=!0,"value"in e&&(e.writable=!0),Object.defineProperty(i,e.key,e)}}return function(t,r,i){return r&&e(t.prototype,r),i&&e(t,i),t}}(),n=t("../utils/logger"),a=function(){function e(t){r(this,e),this.data=t,this.bytesAvailable=this.data.byteLength,this.word=0,this.bitsAvailable=0}return i(e,[{key:"loadWord",value:function(){var t=this.data.byteLength-this.bytesAvailable,r=new Uint8Array(4),e=Math.min(4,this.bytesAvailable);if(0===e)throw new Error("no bytes available");r.set(this.data.subarray(t,t+e)),this.word=new DataView(r.buffer).getUint32(0),this.bitsAvailable=8*e,this.bytesAvailable-=e}},{key:"skipBits",value:function(e){var t;this.bitsAvailable>e?(this.word<<=e,this.bitsAvailable-=e):(e-=this.bitsAvailable,t=e>>3,e-=t>>3,this.bytesAvailable-=t,this.loadWord(),this.word<<=e,this.bitsAvailable-=e)}},{key:"readBits",value:function(t){var e=Math.min(this.bitsAvailable,t),r=this.word>>>32-e;return t>32&&n.logger.error("Cannot read more than 32 bits at a time"),this.bitsAvailable-=e,this.bitsAvailable>0?this.word<<=e:this.bytesAvailable>0&&this.loadWord(),e=t-e,e>0?r<<e|this.readBits(e):r}},{key:"skipLZ",value:function(){var e;for(e=0;e<this.bitsAvailable;++e)if(0!==(this.word&2147483648>>>e))return this.word<<=e,this.bitsAvailable-=e,e;return this.loadWord(),e+this.skipLZ()}},{key:"skipUEG",value:function(){this.skipBits(1+this.skipLZ())}},{key:"skipEG",value:function(){this.skipBits(1+this.skipLZ())}},{key:"readUEG",value:function(){var e=this.skipLZ();return this.readBits(e+1)-1}},{key:"readEG",value:function(){var e=this.readUEG();return 1&e?1+e>>>1:-1*(e>>>1)}},{key:"readBoolean",value:function(){return 1===this.readBits(1)}},{key:"readUByte",value:function(){return this.readBits(8)}},{key:"readUShort",value:function(){return this.readBits(16)}},{key:"readUInt",value:function(){return this.readBits(32)}},{key:"skipScalingList",value:function(n){var t,i,r=8,e=8;for(t=0;n>t;t++)0!==e&&(i=this.readEG(),e=(r+i+256)%256),r=0===e?r:e}},{key:"readSPS",value:function(){var t,g,p,l,n,a,i,o,r,s=0,d=0,f=0,h=0,c=1;if(this.readUByte(),t=this.readUByte(),g=this.readBits(5),this.skipBits(3),p=this.readUByte(),this.skipUEG(),100===t||110===t||122===t||244===t||44===t||83===t||86===t||118===t||128===t){var v=this.readUEG();if(3===v&&this.skipBits(1),this.skipUEG(),this.skipUEG(),this.skipBits(1),this.readBoolean())for(o=3!==v?8:12,r=0;o>r;r++)this.readBoolean()&&(6>r?this.skipScalingList(16):this.skipScalingList(64))}this.skipUEG();var u=this.readUEG();if(0===u)this.readUEG();else if(1===u)for(this.skipBits(1),this.skipEG(),this.skipEG(),l=this.readUEG(),r=0;l>r;r++)this.skipEG();if(this.skipUEG(),this.skipBits(1),n=this.readUEG(),a=this.readUEG(),i=this.readBits(1),0===i&&this.skipBits(1),this.skipBits(1),this.readBoolean()&&(s=this.readUEG(),d=this.readUEG(),f=this.readUEG(),h=this.readUEG()),this.readBoolean()&&this.readBoolean()){var e=void 0,y=this.readUByte();switch(y){case 1:e=[1,1];break;
case 2:e=[12,11];break;case 3:e=[10,11];break;case 4:e=[16,11];break;case 5:e=[40,33];break;case 6:e=[24,11];break;case 7:e=[20,11];break;case 8:e=[32,11];break;case 9:e=[80,33];break;case 10:e=[18,11];break;case 11:e=[15,11];break;case 12:e=[64,33];break;case 13:e=[160,99];break;case 14:e=[4,3];break;case 15:e=[3,2];break;case 16:e=[2,1];break;case 255:e=[this.readUByte()<<8|this.readUByte(),this.readUByte()<<8|this.readUByte()]}e&&(c=e[0]/e[1])}return{width:Math.ceil((16*(n+1)-2*s-2*d)*c),height:(2-i)*(a+1)*16-(i?2:4)*(f+h)}}},{key:"readSliceType",value:function(){return this.readUByte(),this.readUEG(),this.readUEG()}}]),e}();e.default=a},{"../utils/logger":36}],18:[function(r,s,t){"use strict";function i(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}Object.defineProperty(t,"__esModule",{value:!0});var n=function(){function e(i,r){for(var t=0;t<r.length;t++){var e=r[t];e.enumerable=e.enumerable||!1,e.configurable=!0,"value"in e&&(e.writable=!0),Object.defineProperty(i,e.key,e)}}return function(t,r,i){return r&&e(t.prototype,r),i&&e(t,i),t}}(),e=r("../utils/logger"),a=function(){function t(n){i(this,t),this._hasTimeStamp=!1;for(var l,u,d,f,h,s,o,a,r=0;;)if(o=this.readUTF(n,r,3),r+=3,"ID3"===o)r+=3,l=127&n[r++],u=127&n[r++],d=127&n[r++],f=127&n[r++],h=(l<<21)+(u<<14)+(d<<7)+f,s=r+h,this._parseID3Frames(n,r,s),r=s;else{if("3DI"!==o)return r-=3,a=r,void(a&&(this.hasTimeStamp||e.logger.warn("ID3 tag found, but no timestamp"),this._length=a,this._payload=n.subarray(0,a)));r+=7,e.logger.log("3DI footer found, end: "+r)}}return n(t,[{key:"readUTF",value:function(i,e,n){var t="",r=e,a=e+n;do t+=String.fromCharCode(i[r++]);while(a>r);return t}},{key:"_parseID3Frames",value:function(r,t,a){for(var n,s,o,l,i;a>=t+8;)switch(n=this.readUTF(r,t,4),t+=4,s=r[t++]<<24+r[t++]<<16+r[t++]<<8+r[t++],l=r[t++]<<8+r[t++],o=t,n){case"PRIV":if("com.apple.streaming.transportStreamTimestamp"===this.readUTF(r,t,44)){t+=44,t+=4;var u=1&r[t++];this._hasTimeStamp=!0,i=((r[t++]<<23)+(r[t++]<<15)+(r[t++]<<7)+r[t++])/45,u&&(i+=47721858.84),i=Math.round(i),e.logger.trace("ID3 timestamp found: "+i),this._timeStamp=i}}}},{key:"hasTimeStamp",get:function(){return this._hasTimeStamp}},{key:"timeStamp",get:function(){return this._timeStamp}},{key:"length",get:function(){return this._length}},{key:"payload",get:function(){return this._payload}}]),t}();t.default=a},{"../utils/logger":36}],19:[function(t,v,n){"use strict";function i(e){return e&&e.__esModule?e:{default:e}}function u(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}Object.defineProperty(n,"__esModule",{value:!0});var f=function(){function e(i,r){for(var t=0;t<r.length;t++){var e=r[t];e.enumerable=e.enumerable||!1,e.configurable=!0,"value"in e&&(e.writable=!0),Object.defineProperty(i,e.key,e)}}return function(t,r,i){return r&&e(t.prototype,r),i&&e(t,i),t}}(),h=t("./adts"),c=i(h),l=t("../events"),a=i(l),d=t("./exp-golomb"),s=i(d),e=t("../utils/logger"),r=t("../errors"),o=function(){function t(e,r){u(this,t),this.observer=e,this.remuxerClass=r,this.lastCC=0,this.remuxer=new this.remuxerClass(e)}return f(t,[{key:"switchLevel",value:function(){this.pmtParsed=!1,this._pmtId=-1,this.lastAacPTS=null,this.aacOverFlow=null,this._avcTrack={container:"video/mp2t",type:"video",id:-1,sequenceNumber:0,samples:[],len:0,nbNalu:0},this._aacTrack={container:"video/mp2t",type:"audio",id:-1,sequenceNumber:0,samples:[],len:0},this._id3Track={type:"id3",id:-1,sequenceNumber:0,samples:[],len:0},this._txtTrack={type:"text",id:-1,sequenceNumber:0,samples:[],len:0},this.remuxer.switchLevel()}},{key:"insertDiscontinuity",value:function(){this.switchLevel(),this.remuxer.insertDiscontinuity()}},{key:"push",value:function(i,R,L,_,p,m,E,A){var s,o,l,t,d,u,y,n,c=i.length,b=this.remuxer.passthrough;this.audioCodec=R,this.videoCodec=L,this.timeOffset=_,this._duration=A,this.contiguous=!1,p!==this.lastCC?(e.logger.log("discontinuity detected"),this.insertDiscontinuity(),this.lastCC=p):m!==this.lastLevel?(e.logger.log("level switch detected"),this.switchLevel(),this.lastLevel=m):E===this.lastSN+1&&(this.contiguous=!0),this.lastSN=E,this.contiguous||(this.aacOverFlow=null);var g=this.pmtParsed,h=this._avcTrack.id,f=this._aacTrack.id,v=this._id3Track.id;for(c-=c%188,t=0;c>t;t+=188)if(71===i[t]){if(d=!!(64&i[t+1]),u=((31&i[t+1])<<8)+i[t+2],y=(48&i[t+3])>>4,y>1){if(n=t+5+i[t+4],n===t+188)continue}else n=t+4;if(g)if(u===h){if(d){if(s&&(this._parseAVCPES(this._parsePES(s)),b&&this._avcTrack.codec&&(-1===f||this._aacTrack.codec)))return void this.remux(i);s={data:[],size:0}}s&&(s.data.push(i.subarray(n,t+188)),s.size+=t+188-n)}else if(u===f){if(d){if(o&&(this._parseAACPES(this._parsePES(o)),b&&this._aacTrack.codec&&(-1===h||this._avcTrack.codec)))return void this.remux(i);o={data:[],size:0}}o&&(o.data.push(i.subarray(n,t+188)),o.size+=t+188-n)}else u===v&&(d&&(l&&this._parseID3PES(this._parsePES(l)),l={data:[],size:0}),l&&(l.data.push(i.subarray(n,t+188)),l.size+=t+188-n));else d&&(n+=i[n]+1),0===u?this._parsePAT(i,n):u===this._pmtId&&(this._parsePMT(i,n),g=this.pmtParsed=!0,h=this._avcTrack.id,f=this._aacTrack.id,v=this._id3Track.id)}else this.observer.trigger(a.default.ERROR,{type:r.ErrorTypes.MEDIA_ERROR,details:r.ErrorDetails.FRAG_PARSING_ERROR,fatal:!1,reason:"TS packet did not start with 0x47"});s&&this._parseAVCPES(this._parsePES(s)),o&&this._parseAACPES(this._parsePES(o)),l&&this._parseID3PES(this._parsePES(l)),this.remux(null)}},{key:"remux",value:function(e){this.remuxer.remux(this._aacTrack,this._avcTrack,this._id3Track,this._txtTrack,this.timeOffset,this.contiguous,e)}},{key:"destroy",value:function(){this.switchLevel(),this._initPTS=this._initDTS=void 0,this._duration=0}},{key:"_parsePAT",value:function(e,t){this._pmtId=(31&e[t+10])<<8|e[t+11]}},{key:"_parsePMT",value:function(r,t){var n,a,s,i;for(n=(15&r[t+1])<<8|r[t+2],a=t+3+n-4,s=(15&r[t+10])<<8|r[t+11],t+=12+s;a>t;){switch(i=(31&r[t+1])<<8|r[t+2],r[t]){case 15:this._aacTrack.id=i;break;case 21:this._id3Track.id=i;break;case 27:this._avcTrack.id=i;break;default:e.logger.log("unkown stream type:"+r[t])}t+=((15&r[t+3])<<8|r[t+4])+5}}},{key:"_parsePES",value:function(o){var e,a,h,d,u,l,i,r,t,f=0,s=o.data;if(e=s[0],h=(e[0]<<16)+(e[1]<<8)+e[2],1===h){for(d=(e[4]<<8)+e[5],a=e[7],192&a&&(i=536870912*(14&e[9])+4194304*(255&e[10])+16384*(254&e[11])+128*(255&e[12])+(254&e[13])/2,i>4294967295&&(i-=8589934592),64&a?(r=536870912*(14&e[14])+4194304*(255&e[15])+16384*(254&e[16])+128*(255&e[17])+(254&e[18])/2,r>4294967295&&(r-=8589934592)):r=i),u=e[8],t=u+9,o.size-=t,l=new Uint8Array(o.size);s.length;){e=s.shift();var n=e.byteLength;if(t){if(t>n){t-=n;continue}e=e.subarray(t),n-=t,t=0}l.set(e,f),f+=n}return{data:l,pts:i,dts:r,len:d}}return null}},{key:"_parseAVCPES",value:function(i){var t,p,a,l,y=this,r=this._avcTrack,u=r.samples,m=this._parseAVCNALu(i.data),d=[],o=!1,h=!1,c=0;if(0===m.length&&u.length>0){var v=u[u.length-1],f=v.units.units[v.units.units.length-1],g=new Uint8Array(f.data.byteLength+i.data.byteLength);g.set(f.data,0),g.set(i.data,f.data.byteLength),f.data=g,v.units.length+=i.data.byteLength,r.len+=i.data.byteLength}i.data=null;var n="";m.forEach(function(e){switch(e.type){case 1:a=!0,o&&(n+="NDR ");break;case 5:a=!0,o&&(n+="IDR "),h=!0;break;case 6:a=!0,o&&(n+="SEI "),t=new s.default(e.data),t.readUByte();var E=t.readUByte();if(4===E){var g=0;do g=t.readUByte();while(255===g);var R=t.readUByte();if(181===R){var _=t.readUShort();if(49===_){var A=t.readUInt();if(1195456820===A){var k=t.readUByte();if(3===k){var v=t.readUByte(),b=t.readUByte(),T=31&v,f=[v,b];for(l=0;T>l;l++)f.push(t.readUByte()),f.push(t.readUByte()),f.push(t.readUByte());y._txtTrack.samples.push({type:3,pts:i.pts,bytes:f})}}}}}break;case 7:if(a=!0,o&&(n+="SPS "),!r.sps){t=new s.default(e.data);var p=t.readSPS();r.width=p.width,r.height=p.height,r.sps=[e.data],r.duration=y._duration;var L=e.data.subarray(1,4),m="avc1.";for(l=0;3>l;l++){var u=L[l].toString(16);u.length<2&&(u="0"+u),m+=u}r.codec=m}break;case 8:a=!0,o&&(n+="PPS "),r.pps||(r.pps=[e.data]);break;case 9:a=!1,o&&(n+="AUD ");break;default:a=!1,n+="unknown NAL "+e.type+" "}a&&(d.push(e),c+=e.data.byteLength)}),(o||n.length)&&e.logger.log(n),d.length&&(h===!0||r.sps)&&(p={units:{units:d,length:c},pts:i.pts,dts:i.dts,key:h},u.push(p),r.len+=c,r.nbNalu+=d.length)}},{key:"_parseAVCNALu",value:function(r){for(var a,i,s,p,n,l,t=0,h=r.byteLength,e=0,d=[];h>t;)switch(a=r[t++],e){case 0:0===a&&(e=1);break;case 1:e=0===a?2:0;break;case 2:case 3:if(0===a)e=3;else if(1===a&&h>t){if(p=31&r[t],n)s={data:r.subarray(n,t-e-1),type:l},d.push(s);else if(i=t-e-1){var c=this._avcTrack,f=c.samples;if(f.length){var v=f[f.length-1],g=v.units.units,o=g[g.length-1],u=new Uint8Array(o.data.byteLength+i);u.set(o.data,0),u.set(r.subarray(0,i),o.data.byteLength),o.data=u,v.units.length+=i,c.len+=i}}n=t,l=p,e=0}else e=0}return n&&(s={data:r.subarray(n,h),type:l},d.push(s)),d}},{key:"_parseAACPES",value:function(R){var l,o,p,E,t,d,f,s,_,n=this._aacTrack,i=R.data,v=R.pts,k=0,L=this._duration,A=this.audioCodec,u=this.aacOverFlow,b=this.lastAacPTS;if(u){var m=new Uint8Array(u.byteLength+i.byteLength);m.set(u,0),m.set(i,u.byteLength),i=m}for(t=k,s=i.length;s-1>t&&(255!==i[t]||240!==(240&i[t+1]));t++);if(t){var y,h;if(s-1>t?(y="AAC PES did not start with ADTS header,offset:"+t,h=!1):(y="no ADTS header found in AAC PES",h=!0),this.observer.trigger(a.default.ERROR,{type:r.ErrorTypes.MEDIA_ERROR,details:r.ErrorDetails.FRAG_PARSING_ERROR,fatal:h,reason:y}),h)return}if(n.audiosamplerate||(l=c.default.getAudioConfig(this.observer,i,t,A),n.config=l.config,n.audiosamplerate=l.samplerate,n.channelCount=l.channelCount,n.codec=l.codec,n.duration=L,e.logger.log("parsed codec:"+n.codec+",rate:"+l.samplerate+",nb channel:"+l.channelCount)),E=0,p=9216e4/n.audiosamplerate,u&&b){var g=b+p;Math.abs(g-v)>1&&(e.logger.log("AAC: align PTS for overlapping frames by "+Math.round((g-v)/90)),v=g)}for(;s>t+5&&(d=1&i[t+1]?7:9,o=(3&i[t+3])<<11|i[t+4]<<3|(224&i[t+5])>>>5,o-=d,o>0&&s>=t+d+o);)for(f=v+E*p,_={unit:i.subarray(t+d,t+d+o),pts:f,dts:f},n.samples.push(_),n.len+=o,t+=o+d,E++;s-1>t&&(255!==i[t]||240!==(240&i[t+1]));t++);u=s>t?i.subarray(t,s):null,this.aacOverFlow=u,this.lastAacPTS=f}},{key:"_parseID3PES",value:function(e){this._id3Track.samples.push(e)}}],[{key:"probe",value:function(e){return e.length>=564&&71===e[0]&&71===e[188]&&71===e[376]}}]),t}();n.default=o},{"../errors":20,"../events":22,"../utils/logger":36,"./adts":13,"./exp-golomb":17}],20:[function(t,r,e){"use strict";Object.defineProperty(e,"__esModule",{value:!0});e.ErrorTypes={NETWORK_ERROR:"networkError",MEDIA_ERROR:"mediaError",OTHER_ERROR:"otherError"},e.ErrorDetails={MANIFEST_LOAD_ERROR:"manifestLoadError",MANIFEST_LOAD_TIMEOUT:"manifestLoadTimeOut",MANIFEST_PARSING_ERROR:"manifestParsingError",MANIFEST_INCOMPATIBLE_CODECS_ERROR:"manifestIncompatibleCodecsError",LEVEL_LOAD_ERROR:"levelLoadError",LEVEL_LOAD_TIMEOUT:"levelLoadTimeOut",LEVEL_SWITCH_ERROR:"levelSwitchError",FRAG_LOAD_ERROR:"fragLoadError",FRAG_LOOP_LOADING_ERROR:"fragLoopLoadingError",FRAG_LOAD_TIMEOUT:"fragLoadTimeOut",FRAG_DECRYPT_ERROR:"fragDecryptError",FRAG_PARSING_ERROR:"fragParsingError",KEY_LOAD_ERROR:"keyLoadError",KEY_LOAD_TIMEOUT:"keyLoadTimeOut",BUFFER_APPEND_ERROR:"bufferAppendError",BUFFER_APPENDING_ERROR:"bufferAppendingError",BUFFER_STALLED_ERROR:"bufferStalledError",BUFFER_FULL_ERROR:"bufferFullError",BUFFER_SEEK_OVER_HOLE:"bufferSeekOverHole",INTERNAL_EXCEPTION:"internalException"}},{}],21:[function(e,l,t){"use strict";function i(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}Object.defineProperty(t,"__esModule",{value:!0});var n="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(e){return typeof e}:function(e){return e&&"function"==typeof Symbol&&e.constructor===Symbol?"symbol":typeof e},a=function(){function e(i,r){for(var t=0;t<r.length;t++){var e=r[t];e.enumerable=e.enumerable||!1,e.configurable=!0,"value"in e&&(e.writable=!0),Object.defineProperty(i,e.key,e)}}return function(t,r,i){return r&&e(t.prototype,r),i&&e(t,i),t}}(),s=e("./utils/logger"),r=e("./errors"),o=function(){function e(a){i(this,e),this.hls=a,this.onEvent=this.onEvent.bind(this);for(var r=arguments.length,n=Array(r>1?r-1:0),t=1;r>t;t++)n[t-1]=arguments[t];this.handledEvents=n,this.useGenericHandler=!0,this.registerListeners()}return a(e,[{key:"destroy",value:function(){this.unregisterListeners()}},{key:"isEventHandler",value:function(){return"object"===n(this.handledEvents)&&this.handledEvents.length&&"function"==typeof this.onEvent}},{key:"registerListeners",value:function(){this.isEventHandler()&&this.handledEvents.forEach(function(e){if("hlsEventGeneric"===e)throw new Error("Forbidden event name: "+e);this.hls.on(e,this.onEvent)}.bind(this))}},{key:"unregisterListeners",value:function(){this.isEventHandler()&&this.handledEvents.forEach(function(e){this.hls.off(e,this.onEvent)}.bind(this))}},{key:"onEvent",value:function(e,t){this.onEventGeneric(e,t)}},{key:"onEventGeneric",value:function(e,t){var i=function(t,r){var e="on"+t.replace("hls","");if("function"!=typeof this[e])throw new Error("Event "+t+" has no generic handler in this "+this.constructor.name+" class (tried "+e+")");return this[e].bind(this,r)};try{i.call(this,e,t).call()}catch(t){s.logger.error("internal error happened while processing "+e+":"+t.message),this.hls.trigger(Event.ERROR,{type:r.ErrorTypes.OTHER_ERROR,details:r.ErrorDetails.INTERNAL_EXCEPTION,fatal:!1,event:e,err:t})}}}]),e}();t.default=o},{"./errors":20,"./utils/logger":36}],22:[function(t,e,r){"use strict";e.exports={MEDIA_ATTACHING:"hlsMediaAttaching",MEDIA_ATTACHED:"hlsMediaAttached",MEDIA_DETACHING:"hlsMediaDetaching",MEDIA_DETACHED:"hlsMediaDetached",BUFFER_RESET:"hlsBufferReset",BUFFER_CODECS:"hlsBufferCodecs",BUFFER_APPENDING:"hlsBufferAppending",BUFFER_APPENDED:"hlsBufferAppended",BUFFER_EOS:"hlsBufferEos",BUFFER_FLUSHING:"hlsBufferFlushing",BUFFER_FLUSHED:"hlsBufferFlushed",MANIFEST_LOADING:"hlsManifestLoading",MANIFEST_LOADED:"hlsManifestLoaded",MANIFEST_PARSED:"hlsManifestParsed",LEVEL_LOADING:"hlsLevelLoading",LEVEL_LOADED:"hlsLevelLoaded",LEVEL_UPDATED:"hlsLevelUpdated",LEVEL_PTS_UPDATED:"hlsLevelPtsUpdated",LEVEL_SWITCH:"hlsLevelSwitch",FRAG_LOADING:"hlsFragLoading",FRAG_LOAD_PROGRESS:"hlsFragLoadProgress",FRAG_LOAD_EMERGENCY_ABORTED:"hlsFragLoadEmergencyAborted",FRAG_LOADED:"hlsFragLoaded",FRAG_PARSING_INIT_SEGMENT:"hlsFragParsingInitSegment",FRAG_PARSING_USERDATA:"hlsFragParsingUserdata",FRAG_PARSING_METADATA:"hlsFragParsingMetadata",FRAG_PARSING_DATA:"hlsFragParsingData",FRAG_PARSED:"hlsFragParsed",FRAG_BUFFERED:"hlsFragBuffered",FRAG_CHANGED:"hlsFragChanged",FPS_DROP:"hlsFpsDrop",ERROR:"hlsError",DESTROYING:"hlsDestroying",KEY_LOADING:"hlsKeyLoading",KEY_LOADED:"hlsKeyLoaded"}},{}],23:[function(n,a,e){"use strict";function t(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}Object.defineProperty(e,"__esModule",{value:!0});var r=function(){function e(i,r){for(var t=0;t<r.length;t++){var e=r[t];e.enumerable=e.enumerable||!1,e.configurable=!0,"value"in e&&(e.writable=!0),Object.defineProperty(i,e.key,e)}}return function(t,r,i){return r&&e(t.prototype,r),i&&e(t,i),t}}(),i=function(){function e(){t(this,e)}return r(e,null,[{key:"bufferInfo",value:function(r,n,a){if(r){var e,t=r.buffered,i=[];for(e=0;e<t.length;e++)i.push({start:t.start(e),end:t.end(e)});return this.bufferedInfo(i,n,a)}return{len:0,start:0,end:0,nextStart:void 0}}},{key:"bufferedInfo",value:function(r,i,s){var o,l,n,h,e,t=[];for(r.sort(function(e,t){var r=e.start-t.start;return r?r:t.end-e.end}),e=0;e<r.length;e++){var u=t.length;if(u){var d=t[u-1].end;r[e].start-d<s?r[e].end>d&&(t[u-1].end=r[e].end):t.push(r[e])}else t.push(r[e])}for(e=0,o=0,l=n=i;e<t.length;e++){var a=t[e].start,f=t[e].end;if(i+s>=a&&f>i)l=a,n=f,o=n-i;else if(a>i+s){h=a;break}}return{len:o,start:l,end:n,nextStart:h}}}]),e}();e.default=i},{}],24:[function(r,s,t){"use strict";function i(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}Object.defineProperty(t,"__esModule",{value:!0});var n=function(){function e(i,r){for(var t=0;t<r.length;t++){var e=r[t];e.enumerable=e.enumerable||!1,e.configurable=!0,"value"in e&&(e.writable=!0),Object.defineProperty(i,e.key,e)}}return function(t,r,i){return r&&e(t.prototype,r),i&&e(t,i),t}}(),e=r("../utils/logger"),a=function(){function t(){i(this,t)}return n(t,null,[{key:"mergeDetails",value:function(a,i){var s,c=Math.max(a.startSN,i.startSN)-i.startSN,h=Math.min(a.endSN,i.endSN)-i.startSN,u=i.startSN-a.startSN,f=a.fragments,l=i.fragments,d=0;if(c>h)return void(i.PTSKnown=!1);for(var r=c;h>=r;r++){var o=f[u+r],n=l[r];d=o.cc-n.cc,isNaN(o.startPTS)||(n.start=n.startPTS=o.startPTS,n.endPTS=o.endPTS,n.duration=o.duration,s=n)}if(d)for(e.logger.log("discontinuity sliding from playlist, take drift into account"),r=0;r<l.length;r++)l[r].cc+=d;if(s)t.updateFragPTS(i,s.sn,s.startPTS,s.endPTS);else if(u>=0&&u<f.length){var v=f[u].start;for(r=0;r<l.length;r++)l[r].start+=v}i.PTSKnown=a.PTSKnown}},{key:"updateFragPTS",value:function(i,l,n,s){var o,a,r,e;if(l<i.startSN||l>i.endSN)return 0;o=l-i.startSN,a=i.fragments,r=a[o],isNaN(r.startPTS)||(n=Math.min(n,r.startPTS),s=Math.max(s,r.endPTS));var u=n-r.start;for(r.start=r.startPTS=n,r.endPTS=s,r.duration=s-n,e=o;e>0;e--)t.updatePTS(a,e,e-1);for(e=o;e<a.length-1;e++)t.updatePTS(a,e,e+1);return i.PTSKnown=!0,u}},{key:"updatePTS",value:function(s,i,n){var t=s[i],r=s[n],a=r.startPTS;isNaN(a)?n>i?r.start=t.start+t.duration:r.start=t.start-r.duration:n>i?(t.duration=a-t.start,t.duration<0&&e.logger.error("negative duration computed for frag "+t.sn+",level "+t.level+", there should be some duration drift between playlist and fragment!")):(r.duration=t.start-a,r.duration<0&&e.logger.error("negative duration computed for frag "+r.sn+",level "+r.level+", there should be some duration drift between playlist and fragment!"))}}]),t}();t.default=a},{"../utils/logger":36}],25:[function(t,I,n){"use strict";function r(e){return e&&e.__esModule?e:{default:e}}function o(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}Object.defineProperty(n,"__esModule",{value:!0});var a=function(){function e(i,r){for(var t=0;t<r.length;t++){var e=r[t];e.enumerable=e.enumerable||!1,e.configurable=!0,"value"in e&&(e.writable=!0),Object.defineProperty(i,e.key,e)}}return function(t,r,i){return r&&e(t.prototype,r),i&&e(t,i),t}}(),k=t("./events"),i=r(k),s=t("./errors"),u=t("./loader/playlist-loader"),d=r(u),f=t("./loader/fragment-loader"),h=r(f),c=t("./controller/abr-controller"),v=r(c),g=t("./controller/buffer-controller"),P=r(g),y=t("./controller/cap-level-controller"),m=r(y),E=t("./controller/stream-controller"),b=r(E),_=t("./controller/level-controller"),R=r(_),A=t("./controller/timeline-controller"),L=r(A),e=t("./utils/logger"),T=t("./utils/xhr-loader"),S=r(T),w=t("events"),O=r(w),D=t("./loader/key-loader"),p=r(D),l=function(){function t(){var r=arguments.length<=0||void 0===arguments[0]?{}:arguments[0];o(this,t);var a=t.DefaultConfig;if((r.liveSyncDurationCount||r.liveMaxLatencyDurationCount)&&(r.liveSyncDuration||r.liveMaxLatencyDuration))throw new Error("Illegal hls.js config: don't mix up liveSyncDurationCount/liveMaxLatencyDurationCount and liveSyncDuration/liveMaxLatencyDuration");for(var n in a)n in r||(r[n]=a[n]);if(void 0!==r.liveMaxLatencyDurationCount&&r.liveMaxLatencyDurationCount<=r.liveSyncDurationCount)throw new Error('Illegal hls.js config: "liveMaxLatencyDurationCount" must be gt "liveSyncDurationCount"');if(void 0!==r.liveMaxLatencyDuration&&(r.liveMaxLatencyDuration<=r.liveSyncDuration||void 0===r.liveSyncDuration))throw new Error('Illegal hls.js config: "liveMaxLatencyDuration" must be gt "liveSyncDuration"');(0,e.enableLogs)(r.debug),this.config=r;var i=this.observer=new O.default;i.trigger=function(r){for(var t=arguments.length,n=Array(t>1?t-1:0),e=1;t>e;e++)n[e-1]=arguments[e];i.emit.apply(i,[r,r].concat(n))},i.off=function(n){for(var t=arguments.length,r=Array(t>1?t-1:0),e=1;t>e;e++)r[e-1]=arguments[e];i.removeListener.apply(i,[n].concat(r))},this.on=i.on.bind(i),this.off=i.off.bind(i),this.trigger=i.trigger.bind(i),this.playlistLoader=new d.default(this),this.fragmentLoader=new h.default(this),this.levelController=new R.default(this),this.abrController=new r.abrController(this),this.bufferController=new r.bufferController(this),this.capLevelController=new r.capLevelController(this),this.streamController=new r.streamController(this),this.timelineController=new r.timelineController(this),this.keyLoader=new p.default(this)}return a(t,null,[{key:"isSupported",value:function(){return window.MediaSource&&window.MediaSource.isTypeSupported('video/mp4; codecs="avc1.42E01E,mp4a.40.2"')}},{key:"Events",get:function(){return i.default}},{key:"ErrorTypes",get:function(){return s.ErrorTypes}},{key:"ErrorDetails",get:function(){return s.ErrorDetails}},{key:"DefaultConfig",get:function(){return t.defaultConfig||(t.defaultConfig={autoStartLoad:!0,debug:!1,capLevelToPlayerSize:!1,maxBufferLength:30,maxBufferSize:6e7,maxBufferHole:.5,maxSeekHole:2,seekHoleNudgeDuration:.01,maxFragLookUpTolerance:.2,liveSyncDurationCount:3,liveMaxLatencyDurationCount:1/0,liveSyncDuration:void 0,liveMaxLatencyDuration:void 0,maxMaxBufferLength:600,enableWorker:!0,enableSoftwareAES:!0,manifestLoadingTimeOut:1e4,manifestLoadingMaxRetry:1,manifestLoadingRetryDelay:1e3,levelLoadingTimeOut:1e4,levelLoadingMaxRetry:4,levelLoadingRetryDelay:1e3,fragLoadingTimeOut:2e4,fragLoadingMaxRetry:6,fragLoadingRetryDelay:1e3,fragLoadingLoopThreshold:3,startFragPrefetch:!1,appendErrorMaxRetry:3,loader:S.default,fLoader:void 0,pLoader:void 0,abrController:v.default,bufferController:P.default,capLevelController:m.default,streamController:b.default,timelineController:L.default,enableCEA708Captions:!0,enableMP2TPassThrough:!1}),t.defaultConfig},set:function(e){t.defaultConfig=e}}]),a(t,[{key:"destroy",value:function(){e.logger.log("destroy"),this.trigger(i.default.DESTROYING),this.detachMedia(),this.playlistLoader.destroy(),this.fragmentLoader.destroy(),this.levelController.destroy(),this.abrController.destroy(),this.bufferController.destroy(),this.capLevelController.destroy(),this.streamController.destroy(),this.timelineController.destroy(),this.keyLoader.destroy(),this.url=null,this.observer.removeAllListeners()}},{key:"attachMedia",value:function(t){e.logger.log("attachMedia"),this.media=t,this.trigger(i.default.MEDIA_ATTACHING,{media:t})}},{key:"detachMedia",value:function(){e.logger.log("detachMedia"),this.trigger(i.default.MEDIA_DETACHING),this.media=null}},{key:"loadSource",value:function(t){e.logger.log("loadSource:"+t),this.url=t,this.trigger(i.default.MANIFEST_LOADING,{url:t})}},{key:"startLoad",value:function(){var t=arguments.length<=0||void 0===arguments[0]?0:arguments[0];e.logger.log("startLoad"),this.levelController.startLoad(),this.streamController.startLoad(t)}},{key:"stopLoad",value:function(){e.logger.log("stopLoad"),this.levelController.stopLoad(),this.streamController.stopLoad()}},{key:"swapAudioCodec",value:function(){e.logger.log("swapAudioCodec"),this.streamController.swapAudioCodec()}},{key:"recoverMediaError",value:function(){e.logger.log("recoverMediaError");var t=this.media;this.detachMedia(),this.attachMedia(t)}},{key:"levels",get:function(){return this.levelController.levels}},{key:"currentLevel",get:function(){return this.streamController.currentLevel},set:function(t){e.logger.log("set currentLevel:"+t),this.loadLevel=t,this.streamController.immediateLevelSwitch()}},{key:"nextLevel",get:function(){return this.streamController.nextLevel},set:function(t){e.logger.log("set nextLevel:"+t),this.levelController.manualLevel=t,this.streamController.nextLevelSwitch()}},{key:"loadLevel",get:function(){return this.levelController.level},set:function(t){e.logger.log("set loadLevel:"+t),this.levelController.manualLevel=t}},{key:"nextLoadLevel",get:function(){return this.levelController.nextLoadLevel},set:function(e){this.levelController.nextLoadLevel=e}},{key:"firstLevel",get:function(){return this.levelController.firstLevel},set:function(t){e.logger.log("set firstLevel:"+t),this.levelController.firstLevel=t}},{key:"startLevel",get:function(){return this.levelController.startLevel},set:function(t){e.logger.log("set startLevel:"+t),this.levelController.startLevel=t}},{key:"autoLevelCapping",get:function(){return this.abrController.autoLevelCapping},set:function(t){e.logger.log("set autoLevelCapping:"+t),this.abrController.autoLevelCapping=t}},{key:"autoLevelEnabled",get:function(){return-1===this.levelController.manualLevel}},{key:"manualLevel",get:function(){return this.levelController.manualLevel}}]),t}();n.default=l},{"./controller/abr-controller":3,"./controller/buffer-controller":4,"./controller/cap-level-controller":5,"./controller/level-controller":6,"./controller/stream-controller":7,"./controller/timeline-controller":8,"./errors":20,"./events":22,"./loader/fragment-loader":27,"./loader/key-loader":28,"./loader/playlist-loader":29,"./utils/logger":36,"./utils/xhr-loader":38,events:1}],26:[function(e,t,r){"use strict";t.exports=e("./hls.js").default},{"./hls.js":25}],27:[function(r,c,i){"use strict";function n(e){return e&&e.__esModule?e:{default:e}}function u(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}function f(t,e){if(!t)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return!e||"object"!=typeof e&&"function"!=typeof e?t:e}function s(t,e){if("function"!=typeof e&&null!==e)throw new TypeError("Super expression must either be null or a function, not "+typeof e);t.prototype=Object.create(e&&e.prototype,{constructor:{value:t,enumerable:!1,writable:!0,configurable:!0}}),e&&(Object.setPrototypeOf?Object.setPrototypeOf(t,e):t.__proto__=e)}Object.defineProperty(i,"__esModule",{value:!0});var h=function(){function e(i,r){for(var t=0;t<r.length;t++){var e=r[t];e.enumerable=e.enumerable||!1,e.configurable=!0,"value"in e&&(e.writable=!0),Object.defineProperty(i,e.key,e)}}return function(t,r,i){return r&&e(t.prototype,r),i&&e(t,i),t}}(),l=r("../events"),e=n(l),d=r("../event-handler"),a=n(d),t=r("../errors"),o=function(i){function r(t){return u(this,r),f(this,Object.getPrototypeOf(r).call(this,t,e.default.FRAG_LOADING))}return s(r,i),h(r,[{key:"destroy",value:function(){this.loader&&(this.loader.destroy(),this.loader=null),a.default.prototype.destroy.call(this)}},{key:"onFragLoading",value:function(r){var t=r.frag;this.frag=t,this.frag.loaded=0;var e=this.hls.config;t.loader=this.loader="undefined"!=typeof e.fLoader?new e.fLoader(e):new e.loader(e),this.loader.load(t.url,"arraybuffer",this.loadsuccess.bind(this),this.loaderror.bind(this),this.loadtimeout.bind(this),e.fragLoadingTimeOut,1,0,this.loadprogress.bind(this),t)}},{key:"loadsuccess",value:function(i,t){var r=i.currentTarget.response;t.length=r.byteLength,this.frag.loader=void 0,this.hls.trigger(e.default.FRAG_LOADED,{payload:r,frag:this.frag,stats:t})}},{key:"loaderror",value:function(r){this.loader&&this.loader.abort(),this.hls.trigger(e.default.ERROR,{type:t.ErrorTypes.NETWORK_ERROR,details:t.ErrorDetails.FRAG_LOAD_ERROR,fatal:!1,frag:this.frag,response:r})}},{key:"loadtimeout",value:function(){this.loader&&this.loader.abort(),this.hls.trigger(e.default.ERROR,{type:t.ErrorTypes.NETWORK_ERROR,details:t.ErrorDetails.FRAG_LOAD_TIMEOUT,fatal:!1,frag:this.frag})}},{key:"loadprogress",value:function(r,t){this.frag.loaded=t.loaded,this.hls.trigger(e.default.FRAG_LOAD_PROGRESS,{frag:this.frag,stats:t})}}]),r}(a.default);i.default=o},{"../errors":20,"../event-handler":21,"../events":22}],28:[function(r,c,i){"use strict";function n(e){return e&&e.__esModule?e:{default:e}}function u(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}function f(t,e){if(!t)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return!e||"object"!=typeof e&&"function"!=typeof e?t:e}function s(t,e){if("function"!=typeof e&&null!==e)throw new TypeError("Super expression must either be null or a function, not "+typeof e);t.prototype=Object.create(e&&e.prototype,{constructor:{value:t,enumerable:!1,writable:!0,configurable:!0}}),e&&(Object.setPrototypeOf?Object.setPrototypeOf(t,e):t.__proto__=e)}Object.defineProperty(i,"__esModule",{value:!0});var h=function(){function e(i,r){for(var t=0;t<r.length;t++){var e=r[t];e.enumerable=e.enumerable||!1,e.configurable=!0,"value"in e&&(e.writable=!0),Object.defineProperty(i,e.key,e)}}return function(t,r,i){return r&&e(t.prototype,r),i&&e(t,i),t}}(),l=r("../events"),e=n(l),d=r("../event-handler"),a=n(d),t=r("../errors"),o=function(i){function r(i){u(this,r);var t=f(this,Object.getPrototypeOf(r).call(this,i,e.default.KEY_LOADING));return t.decryptkey=null,t.decrypturl=null,t}return s(r,i),h(r,[{key:"destroy",value:function(){this.loader&&(this.loader.destroy(),this.loader=null),a.default.prototype.destroy.call(this)}},{key:"onKeyLoading",value:function(a){var t=this.frag=a.frag,n=t.decryptdata,i=n.uri;if(i!==this.decrypturl||null===this.decryptkey){var r=this.hls.config;t.loader=this.loader=new r.loader(r),this.decrypturl=i,this.decryptkey=null,t.loader.load(i,"arraybuffer",this.loadsuccess.bind(this),this.loaderror.bind(this),this.loadtimeout.bind(this),r.fragLoadingTimeOut,r.fragLoadingMaxRetry,r.fragLoadingRetryDelay,this.loadprogress.bind(this),t)}else this.decryptkey&&(n.key=this.decryptkey,this.hls.trigger(e.default.KEY_LOADED,{frag:t}))}},{key:"loadsuccess",value:function(r){var t=this.frag;this.decryptkey=t.decryptdata.key=new Uint8Array(r.currentTarget.response),t.loader=void 0,this.hls.trigger(e.default.KEY_LOADED,{frag:t})}},{key:"loaderror",value:function(r){this.loader&&this.loader.abort(),this.hls.trigger(e.default.ERROR,{type:t.ErrorTypes.NETWORK_ERROR,details:t.ErrorDetails.KEY_LOAD_ERROR,fatal:!1,frag:this.frag,response:r})}},{key:"loadtimeout",value:function(){this.loader&&this.loader.abort(),this.hls.trigger(e.default.ERROR,{type:t.ErrorTypes.NETWORK_ERROR,details:t.ErrorDetails.KEY_LOAD_TIMEOUT,fatal:!1,frag:this.frag})}},{key:"loadprogress",value:function(){}}]),r}(a.default);i.default=o},{"../errors":20,"../event-handler":21,"../events":22}],29:[function(r,y,s){"use strict";function i(e){return e&&e.__esModule?e:{default:e}}function d(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}function f(t,e){if(!t)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return!e||"object"!=typeof e&&"function"!=typeof e?t:e}function h(t,e){if("function"!=typeof e&&null!==e)throw new TypeError("Super expression must either be null or a function, not "+typeof e);t.prototype=Object.create(e&&e.prototype,{constructor:{value:t,enumerable:!1,writable:!0,configurable:!0}}),e&&(Object.setPrototypeOf?Object.setPrototypeOf(t,e):t.__proto__=e)}Object.defineProperty(s,"__esModule",{value:!0});var o=function(){function e(i,r){for(var t=0;t<r.length;t++){var e=r[t];e.enumerable=e.enumerable||!1,e.configurable=!0,"value"in e&&(e.writable=!0),Object.defineProperty(i,e.key,e)}}return function(t,r,i){return r&&e(t.prototype,r),i&&e(t,i),t}}(),l=r("../events"),t=i(l),p=r("../event-handler"),a=i(p),e=r("../errors"),c=r("../utils/url"),v=i(c),g=r("../utils/attr-list"),n=i(g),u=function(i){function r(e){return d(this,r),f(this,Object.getPrototypeOf(r).call(this,e,t.default.MANIFEST_LOADING,t.default.LEVEL_LOADING))}return h(r,i),o(r,[{key:"destroy",value:function(){this.loader&&(this.loader.destroy(),this.loader=null),this.url=this.id=null,a.default.prototype.destroy.call(this)}},{key:"onManifestLoading",value:function(e){this.load(e.url,null)}},{key:"onLevelLoading",value:function(e){this.load(e.url,e.level,e.id)}},{key:"load",value:function(n,a,s){var t,r,i,e=this.hls.config;this.url=n,
this.id=a,this.id2=s,null===this.id?(t=e.manifestLoadingMaxRetry,r=e.manifestLoadingTimeOut,i=e.manifestLoadingRetryDelay):(t=e.levelLoadingMaxRetry,r=e.levelLoadingTimeOut,i=e.levelLoadingRetryDelay),this.loader="undefined"!=typeof e.pLoader?new e.pLoader(e):new e.loader(e),this.loader.load(n,"",this.loadsuccess.bind(this),this.loaderror.bind(this),this.loadtimeout.bind(this),r,t,i)}},{key:"resolve",value:function(e,t){return v.default.buildAbsoluteURL(t,e)}},{key:"parseMasterPlaylist",value:function(f,u){for(var l=[],i=void 0,d=/#EXT-X-STREAM-INF:([^\n\r]*)[\r\n]+([^\r\n]+)/g;null!=(i=d.exec(f));){var e={},r=e.attrs=new n.default(i[1]);e.url=this.resolve(i[2],u);var s=r.decimalResolution("RESOLUTION");s&&(e.width=s.width,e.height=s.height),e.bitrate=r.decimalInteger("AVERAGE-BANDWIDTH")||r.decimalInteger("BANDWIDTH"),e.name=r.NAME;var t=r.CODECS;if(t){t=t.split(",");for(var o=0;o<t.length;o++){var a=t[o];-1!==a.indexOf("avc1")?e.videoCodec=this.avc1toavcoti(a):e.audioCodec=a}}l.push(e)}return l}},{key:"avc1toavcoti",value:function(r){var e,t=r.split(".");return t.length>2?(e=t.shift()+".",e+=parseInt(t.shift()).toString(16),e+=("000"+parseInt(t.shift()).toString(16)).substr(-4)):e=r,e}},{key:"cloneObj",value:function(e){return JSON.parse(JSON.stringify(e))}},{key:"parseLevelPlaylist",value:function(L,l,A){var e,b,s,a,g=0,o=0,i={url:l,fragments:[],live:!0,startSN:0},r={method:null,key:null,iv:null,uri:null},E=0,f=null,t=null;for(b=/(?:#EXT-X-(MEDIA-SEQUENCE):(\d+))|(?:#EXT-X-(TARGETDURATION):(\d+))|(?:#EXT-X-(KEY):(.*))|(?:#EXT(INF):([\d\.]+)[^\r\n]*([\r\n]+[^#|\r\n]+)?)|(?:#EXT-X-(BYTERANGE):([\d]+[@[\d]*)]*[\r\n]+([^#|\r\n]+)?|(?:#EXT-X-(ENDLIST))|(?:#EXT-X-(DIS)CONTINUITY))|(?:#EXT-X-(PROGRAM-DATE-TIME):(.*))/g;null!==(e=b.exec(L));)switch(e.shift(),e=e.filter(function(e){return void 0!==e}),e[0]){case"MEDIA-SEQUENCE":g=i.startSN=parseInt(e[1]);break;case"TARGETDURATION":i.targetduration=parseFloat(e[1]);break;case"ENDLIST":i.live=!1;break;case"DIS":E++;break;case"BYTERANGE":var c=e[1].split("@");a=1===c.length?s:parseInt(c[1]),s=parseInt(c[0])+a,t&&!t.url&&(t.byteRangeStartOffset=a,t.byteRangeEndOffset=s,t.url=this.resolve(e[2],l));break;case"INF":var v=parseFloat(e[1]);if(!isNaN(v)){var u,m=g++;if(r.method&&r.uri&&!r.iv){u=this.cloneObj(r);for(var y=new Uint8Array(16),d=12;16>d;d++)y[d]=m>>8*(15-d)&255;u.iv=y}else u=r;var k=e[2]?this.resolve(e[2],l):null;t={url:k,duration:v,start:o,sn:m,level:A,cc:E,byteRangeStartOffset:a,byteRangeEndOffset:s,decryptdata:u,programDateTime:f},i.fragments.push(t),o+=v,a=null,f=null}break;case"KEY":var R=e[1],p=new n.default(R),h=p.enumeratedString("METHOD"),_=p.URI,T=p.hexadecimalInteger("IV");h&&(r={method:null,key:null,iv:null,uri:null},_&&"AES-128"===h&&(r.method=h,r.uri=this.resolve(_,l),r.key=null,r.iv=T));break;case"PROGRAM-DATE-TIME":f=new Date(Date.parse(e[1]))}return t&&!t.url&&(i.fragments.pop(),o-=t.duration),i.totalduration=o,i.endSN=g-1,i}},{key:"loadsuccess",value:function(u,i){var s,o=u.currentTarget,a=o.responseText,r=o.responseURL,l=this.id,d=this.id2,n=this.hls;if(void 0===r&&(r=this.url),i.tload=performance.now(),i.mtime=new Date(o.getResponseHeader("Last-Modified")),0===a.indexOf("#EXTM3U"))if(a.indexOf("#EXTINF:")>0)if(null===this.id)n.trigger(t.default.MANIFEST_LOADED,{levels:[{url:r}],url:r,stats:i});else{var f=this.parseLevelPlaylist(a,r,l);i.tparsed=performance.now(),n.trigger(t.default.LEVEL_LOADED,{details:f,level:l,id:d,stats:i})}else s=this.parseMasterPlaylist(a,r),s.length?n.trigger(t.default.MANIFEST_LOADED,{levels:s,url:r,stats:i}):n.trigger(t.default.ERROR,{type:e.ErrorTypes.NETWORK_ERROR,details:e.ErrorDetails.MANIFEST_PARSING_ERROR,fatal:!0,url:r,reason:"no level found in manifest"});else n.trigger(t.default.ERROR,{type:e.ErrorTypes.NETWORK_ERROR,details:e.ErrorDetails.MANIFEST_PARSING_ERROR,fatal:!0,url:r,reason:"no EXTM3U delimiter"})}},{key:"loaderror",value:function(n){var r,i;null===this.id?(r=e.ErrorDetails.MANIFEST_LOAD_ERROR,i=!0):(r=e.ErrorDetails.LEVEL_LOAD_ERROR,i=!1),this.loader&&this.loader.abort(),this.hls.trigger(t.default.ERROR,{type:e.ErrorTypes.NETWORK_ERROR,details:r,fatal:i,url:this.url,loader:this.loader,response:n.currentTarget,level:this.id,id:this.id2})}},{key:"loadtimeout",value:function(){var r,i;null===this.id?(r=e.ErrorDetails.MANIFEST_LOAD_TIMEOUT,i=!0):(r=e.ErrorDetails.LEVEL_LOAD_TIMEOUT,i=!1),this.loader&&this.loader.abort(),this.hls.trigger(t.default.ERROR,{type:e.ErrorTypes.NETWORK_ERROR,details:r,fatal:i,url:this.url,loader:this.loader,level:this.id,id:this.id2})}}]),r}(a.default);s.default=u},{"../errors":20,"../event-handler":21,"../events":22,"../utils/attr-list":33,"../utils/url":37}],30:[function(n,a,e){"use strict";function t(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}Object.defineProperty(e,"__esModule",{value:!0});var r=function(){function e(i,r){for(var t=0;t<r.length;t++){var e=r[t];e.enumerable=e.enumerable||!1,e.configurable=!0,"value"in e&&(e.writable=!0),Object.defineProperty(i,e.key,e)}}return function(t,r,i){return r&&e(t.prototype,r),i&&e(t,i),t}}(),i=function(){function e(){t(this,e)}return r(e,null,[{key:"init",value:function(){e.types={avc1:[],avcC:[],btrt:[],dinf:[],dref:[],esds:[],ftyp:[],hdlr:[],mdat:[],mdhd:[],mdia:[],mfhd:[],minf:[],moof:[],moov:[],mp4a:[],mvex:[],mvhd:[],sdtp:[],stbl:[],stco:[],stsc:[],stsd:[],stsz:[],stts:[],tfdt:[],tfhd:[],traf:[],trak:[],trun:[],trex:[],tkhd:[],vmhd:[],smhd:[]};var t;for(t in e.types)e.types.hasOwnProperty(t)&&(e.types[t]=[t.charCodeAt(0),t.charCodeAt(1),t.charCodeAt(2),t.charCodeAt(3)]);var i=new Uint8Array([0,0,0,0,0,0,0,0,118,105,100,101,0,0,0,0,0,0,0,0,0,0,0,0,86,105,100,101,111,72,97,110,100,108,101,114,0]),n=new Uint8Array([0,0,0,0,0,0,0,0,115,111,117,110,0,0,0,0,0,0,0,0,0,0,0,0,83,111,117,110,100,72,97,110,100,108,101,114,0]);e.HDLR_TYPES={video:i,audio:n};var a=new Uint8Array([0,0,0,0,0,0,0,1,0,0,0,12,117,114,108,32,0,0,0,1]),s=new Uint8Array([0,0,0,0,0,0,0,0]);e.STTS=e.STSC=e.STCO=s,e.STSZ=new Uint8Array([0,0,0,0,0,0,0,0,0,0,0,0]),e.VMHD=new Uint8Array([0,0,0,1,0,0,0,0,0,0,0,0]),e.SMHD=new Uint8Array([0,0,0,0,0,0,0,0]),e.STSD=new Uint8Array([0,0,0,0,0,0,0,1]);var r=new Uint8Array([105,115,111,109]),o=new Uint8Array([97,118,99,49]),l=new Uint8Array([0,0,0,1]);e.FTYP=e.box(e.types.ftyp,r,l,r,o),e.DINF=e.box(e.types.dinf,e.box(e.types.dref,a))}},{key:"box",value:function(n){for(var t,i=Array.prototype.slice.call(arguments,1),e=8,r=i.length,a=r;r--;)e+=i[r].byteLength;for(t=new Uint8Array(e),t[0]=e>>24&255,t[1]=e>>16&255,t[2]=e>>8&255,t[3]=255&e,t.set(n,4),r=0,e=8;a>r;r++)t.set(i[r],e),e+=i[r].byteLength;return t}},{key:"hdlr",value:function(t){return e.box(e.types.hdlr,e.HDLR_TYPES[t])}},{key:"mdat",value:function(t){return e.box(e.types.mdat,t)}},{key:"mdhd",value:function(t,r){return r*=t,e.box(e.types.mdhd,new Uint8Array([0,0,0,0,0,0,0,2,0,0,0,3,t>>24&255,t>>16&255,t>>8&255,255&t,r>>24,r>>16&255,r>>8&255,255&r,85,196,0,0]))}},{key:"mdia",value:function(t){return e.box(e.types.mdia,e.mdhd(t.timescale,t.duration),e.hdlr(t.type),e.minf(t))}},{key:"mfhd",value:function(t){return e.box(e.types.mfhd,new Uint8Array([0,0,0,0,t>>24,t>>16&255,t>>8&255,255&t]))}},{key:"minf",value:function(t){return"audio"===t.type?e.box(e.types.minf,e.box(e.types.smhd,e.SMHD),e.DINF,e.stbl(t)):e.box(e.types.minf,e.box(e.types.vmhd,e.VMHD),e.DINF,e.stbl(t))}},{key:"moof",value:function(t,r,i){return e.box(e.types.moof,e.mfhd(t),e.traf(i,r))}},{key:"moov",value:function(t){for(var r=t.length,i=[];r--;)i[r]=e.trak(t[r]);return e.box.apply(null,[e.types.moov,e.mvhd(t[0].timescale,t[0].duration)].concat(i).concat(e.mvex(t)))}},{key:"mvex",value:function(r){for(var t=r.length,i=[];t--;)i[t]=e.trex(r[t]);return e.box.apply(null,[e.types.mvex].concat(i))}},{key:"mvhd",value:function(t,r){r*=t;var i=new Uint8Array([0,0,0,0,0,0,0,1,0,0,0,2,t>>24&255,t>>16&255,t>>8&255,255&t,r>>24&255,r>>16&255,r>>8&255,255&r,0,1,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,64,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,255,255,255,255]);return e.box(e.types.mvhd,i)}},{key:"sdtp",value:function(a){var r,t,i=a.samples||[],n=new Uint8Array(4+i.length);for(t=0;t<i.length;t++)r=i[t].flags,n[t+4]=r.dependsOn<<4|r.isDependedOn<<2|r.hasRedundancy;return e.box(e.types.sdtp,n)}},{key:"stbl",value:function(t){return e.box(e.types.stbl,e.stsd(t),e.box(e.types.stts,e.STTS),e.box(e.types.stsc,e.STSC),e.box(e.types.stsz,e.STSZ),e.box(e.types.stco,e.STCO))}},{key:"avc1",value:function(t){var r,n,a,i=[],s=[];for(r=0;r<t.sps.length;r++)n=t.sps[r],a=n.byteLength,i.push(a>>>8&255),i.push(255&a),i=i.concat(Array.prototype.slice.call(n));for(r=0;r<t.pps.length;r++)n=t.pps[r],a=n.byteLength,s.push(a>>>8&255),s.push(255&a),s=s.concat(Array.prototype.slice.call(n));var u=e.box(e.types.avcC,new Uint8Array([1,i[3],i[4],i[5],255,224|t.sps.length].concat(i).concat([t.pps.length]).concat(s))),o=t.width,l=t.height;return e.box(e.types.avc1,new Uint8Array([0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,o>>8&255,255&o,l>>8&255,255&l,0,72,0,0,0,72,0,0,0,0,0,0,0,1,18,100,97,105,108,121,109,111,116,105,111,110,47,104,108,115,46,106,115,0,0,0,0,0,0,0,0,0,0,0,0,0,0,24,17,17]),u,e.box(e.types.btrt,new Uint8Array([0,28,156,128,0,45,198,192,0,45,198,192])))}},{key:"esds",value:function(t){var e=t.config.length;return new Uint8Array([0,0,0,0,3,23+e,0,1,0,4,15+e,64,21,0,0,0,0,0,0,0,0,0,0,0,5].concat([e]).concat(t.config).concat([6,1,2]))}},{key:"mp4a",value:function(t){var r=t.audiosamplerate;return e.box(e.types.mp4a,new Uint8Array([0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,t.channelCount,0,16,0,0,0,0,r>>8&255,255&r,0,0]),e.box(e.types.esds,e.esds(t)))}},{key:"stsd",value:function(t){return"audio"===t.type?e.box(e.types.stsd,e.STSD,e.mp4a(t)):e.box(e.types.stsd,e.STSD,e.avc1(t))}},{key:"tkhd",value:function(t){var r=t.id,i=t.duration*t.timescale,n=t.width,a=t.height;return e.box(e.types.tkhd,new Uint8Array([0,0,0,7,0,0,0,0,0,0,0,0,r>>24&255,r>>16&255,r>>8&255,255&r,0,0,0,0,i>>24,i>>16&255,i>>8&255,255&i,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,64,0,0,0,n>>8&255,255&n,0,0,a>>8&255,255&a,0,0]))}},{key:"traf",value:function(i,t){var n=e.sdtp(i),r=i.id;return e.box(e.types.traf,e.box(e.types.tfhd,new Uint8Array([0,0,0,0,r>>24,r>>16&255,r>>8&255,255&r])),e.box(e.types.tfdt,new Uint8Array([0,0,0,0,t>>24,t>>16&255,t>>8&255,255&t])),e.trun(i,n.length+16+16+8+16+8+8),n)}},{key:"trak",value:function(t){return t.duration=t.duration||4294967295,e.box(e.types.trak,e.tkhd(t),e.mdia(t))}},{key:"trex",value:function(r){var t=r.id;return e.box(e.types.trex,new Uint8Array([0,0,0,0,t>>24,t>>16&255,t>>8&255,255&t,0,0,0,1,0,0,0,0,0,0,0,0,0,1,0,1]))}},{key:"trun",value:function(h,o){var i,n,a,s,t,l,d=h.samples||[],r=d.length,f=12+16*r,u=new Uint8Array(f);for(o+=8+f,u.set([0,0,15,1,r>>>24&255,r>>>16&255,r>>>8&255,255&r,o>>>24&255,o>>>16&255,o>>>8&255,255&o],0),i=0;r>i;i++)n=d[i],a=n.duration,s=n.size,t=n.flags,l=n.cts,u.set([a>>>24&255,a>>>16&255,a>>>8&255,255&a,s>>>24&255,s>>>16&255,s>>>8&255,255&s,t.isLeading<<2|t.dependsOn,t.isDependedOn<<6|t.hasRedundancy<<4|t.paddingValue<<1|t.isNonSync,61440&t.degradPrio,15&t.degradPrio,l>>>24&255,l>>>16&255,l>>>8&255,255&l],12+16*i);return e.box(e.types.trun,u)}},{key:"initSegment",value:function(i){e.types||e.init();var t,r=e.moov(i);return t=new Uint8Array(e.FTYP.byteLength+r.byteLength),t.set(e.FTYP),t.set(r,e.FTYP.byteLength),t}}]),e}();e.default=i},{}],31:[function(i,h,n){"use strict";function a(e){return e&&e.__esModule?e:{default:e}}function o(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}Object.defineProperty(n,"__esModule",{value:!0});var l=function(){function e(i,r){for(var t=0;t<r.length;t++){var e=r[t];e.enumerable=e.enumerable||!1,e.configurable=!0,"value"in e&&(e.writable=!0),Object.defineProperty(i,e.key,e)}}return function(t,r,i){return r&&e(t.prototype,r),i&&e(t,i),t}}(),f=i("../events"),t=a(f),e=i("../utils/logger"),u=i("../remux/mp4-generator"),r=a(u),s=i("../errors"),d=function(){function i(e){o(this,i),this.observer=e,this.ISGenerated=!1,this.PES2MP4SCALEFACTOR=4,this.PES_TIMESCALE=9e4,this.MP4_TIMESCALE=this.PES_TIMESCALE/this.PES2MP4SCALEFACTOR}return l(i,[{key:"destroy",value:function(){}},{key:"insertDiscontinuity",value:function(){this._initPTS=this._initDTS=this.nextAacPts=this.nextAvcDts=void 0}},{key:"switchLevel",value:function(){this.ISGenerated=!1}},{key:"remux",value:function(r,i,n,a,e,s){this.ISGenerated||this.generateIS(r,i,e),this.ISGenerated&&(i.samples.length&&this.remuxVideo(i,e,s),r.samples.length&&this.remuxAudio(r,e,s)),n.samples.length&&this.remuxID3(n,e),a.samples.length&&this.remuxText(a,e),this.observer.trigger(t.default.FRAG_PARSED)}},{key:"generateIS",value:function(i,n,h){var a,o,c=this.observer,v=i.samples,d=n.samples,f=this.PES_TIMESCALE,l={},g={tracks:l,unique:!1},u=void 0===this._initPTS;u&&(a=o=1/0),i.config&&v.length&&(i.timescale=i.audiosamplerate,i.timescale*i.duration>Math.pow(2,32)&&!function(){var e=function r(t,e){return e?r(e,t%e):t};i.timescale=i.audiosamplerate/e(i.audiosamplerate,1024)}(),e.logger.log("audio mp4 timescale :"+i.timescale),l.audio={container:"audio/mp4",codec:i.codec,initSegment:r.default.initSegment([i]),metadata:{channelCount:i.channelCount}},u&&(a=o=v[0].pts-f*h)),n.sps&&n.pps&&d.length&&(n.timescale=this.MP4_TIMESCALE,l.video={container:"video/mp4",codec:n.codec,initSegment:r.default.initSegment([n]),metadata:{width:n.width,height:n.height}},u&&(a=Math.min(a,d[0].pts-f*h),o=Math.min(o,d[0].dts-f*h))),Object.keys(l).length?(c.trigger(t.default.FRAG_PARSING_INIT_SEGMENT,g),this.ISGenerated=!0,u&&(this._initPTS=a,this._initDTS=o)):c.trigger(t.default.ERROR,{type:s.ErrorTypes.MEDIA_ERROR,details:s.ErrorDetails.FRAG_PARSING_ERROR,fatal:!1,reason:"no audio/video samples found"})}},{key:"remuxVideo",value:function(n,w,S){var L,s,p,A,f,d,T,k,R,v,_,g,o,i,l,E=8,c=this.PES_TIMESCALE,h=this.PES2MP4SCALEFACTOR,u=[];for(d=new Uint8Array(n.len+4*n.nbNalu+8),L=new DataView(d.buffer),L.setUint32(0,d.byteLength),d.set(r.default.types.mdat,4);n.samples.length;){for(s=n.samples.shift(),A=0;s.units.units.length;)f=s.units.units.shift(),L.setUint32(E,f.data.byteLength),E+=4,d.set(f.data,E),E+=f.data.byteLength,A+=4+f.data.byteLength;if(_=s.pts-this._initDTS,g=s.dts-this._initDTS,g=Math.min(_,g),void 0!==v){o=this._PTSNormalize(_,v),i=this._PTSNormalize(g,v);var m=(i-v)/h;0>=m&&(e.logger.log("invalid sample duration at PTS/DTS: "+s.pts+"/"+s.dts+":"+m),m=1),p.duration=m}else{var y=void 0,a=void 0;y=S?this.nextAvcDts:w*c,o=this._PTSNormalize(_,y),i=this._PTSNormalize(g,y),a=Math.round((i-y)/90),(S||Math.abs(a)>1e4)&&a&&(a>1?e.logger.log("AVC:"+a+" ms hole between fragments detected,filling it"):-1>a&&e.logger.log("AVC:"+-a+" ms overlapping between fragments detected"),i=y,o=Math.max(o-a,i),e.logger.log("Video/PTS/DTS adjusted: "+o+"/"+i+",delta:"+a)),k=Math.max(0,o),R=Math.max(0,i)}p={size:A,duration:0,cts:(o-i)/h,flags:{isLeading:0,isDependedOn:0,hasRedundancy:0,degradPrio:0}},l=p.flags,s.key===!0?(l.dependsOn=2,l.isNonSync=0):(l.dependsOn=1,l.isNonSync=1),u.push(p),v=i}var b=0;u.length>=2&&(b=u[u.length-2].duration,p.duration=b),this.nextAvcDts=i+b*h,n.len=0,n.nbNalu=0,u.length&&navigator.userAgent.toLowerCase().indexOf("chrome")>-1&&(l=u[0].flags,l.dependsOn=2,l.isNonSync=0),n.samples=u,T=r.default.moof(n.sequenceNumber++,R/h,n),n.samples=[],this.observer.trigger(t.default.FRAG_PARSING_DATA,{data1:T,data2:d,startPTS:k/c,endPTS:(o+h*b)/c,startDTS:R/c,endDTS:this.nextAvcDts/c,type:"video",nb:u.length})}},{key:"remuxAudio",value:function(i,O,S){var T,p,a,h,l,k,L,b,u,g,R,d,n,A=8,s=this.PES_TIMESCALE,w=i.timescale,f=s/w,E=1024*i.timescale/i.audiosamplerate,m=[],_=[];for(i.samples.sort(function(e,t){return e.pts-t.pts}),_=i.samples;_.length;){if(p=_.shift(),h=p.unit,g=p.pts-this._initDTS,R=p.dts-this._initDTS,void 0!==u)d=this._PTSNormalize(g,u),n=this._PTSNormalize(R,u),a.duration=(n-u)/f,Math.abs(a.duration-E)>E/10&&e.logger.log("invalid AAC sample duration at PTS "+Math.round(g/90)+",should be 1024,found :"+Math.round(a.duration*i.audiosamplerate/i.timescale)),a.duration=E,n=E*f+u;else{var c=void 0,o=void 0;if(c=S?this.nextAacPts:O*s,d=this._PTSNormalize(g,c),n=this._PTSNormalize(R,c),o=Math.round(1e3*(d-c)/s),(S||Math.abs(o)>1e4)&&o){if(o>0)e.logger.log(o+" ms hole between AAC samples detected,filling it");else if(-12>o){e.logger.log(-o+" ms overlapping between AAC samples detected, drop frame"),i.len-=h.byteLength;continue}d=n=c}if(L=Math.max(0,d),b=Math.max(0,n),!(i.len>0))return;l=new Uint8Array(i.len+8),T=new DataView(l.buffer),T.setUint32(0,l.byteLength),l.set(r.default.types.mdat,4)}l.set(h,A),A+=h.byteLength,a={size:h.byteLength,cts:0,duration:0,flags:{isLeading:0,isDependedOn:0,hasRedundancy:0,degradPrio:0,dependsOn:1}},m.push(a),u=n}var y=0,v=m.length;v>=2&&(y=m[v-2].duration,a.duration=y),v&&(this.nextAacPts=d+f*y,i.len=0,i.samples=m,k=r.default.moof(i.sequenceNumber++,b/f,i),i.samples=[],this.observer.trigger(t.default.FRAG_PARSING_DATA,{data1:k,data2:l,startPTS:L/s,endPTS:this.nextAacPts/s,startDTS:b/s,endDTS:(n+f*y)/s,type:"audio",nb:v}))}},{key:"remuxID3",value:function(r,n){var e,a=r.samples.length;if(a){for(var i=0;a>i;i++)e=r.samples[i],e.pts=(e.pts-this._initPTS)/this.PES_TIMESCALE,e.dts=(e.dts-this._initDTS)/this.PES_TIMESCALE;this.observer.trigger(t.default.FRAG_PARSING_METADATA,{samples:r.samples})}r.samples=[],n=n}},{key:"remuxText",value:function(e,n){e.samples.sort(function(e,t){return e.pts-t.pts});var r,a=e.samples.length;if(a){for(var i=0;a>i;i++)r=e.samples[i],r.pts=(r.pts-this._initPTS)/this.PES_TIMESCALE;this.observer.trigger(t.default.FRAG_PARSING_USERDATA,{samples:e.samples})}e.samples=[],n=n}},{key:"_PTSNormalize",value:function(e,t){var r;if(void 0===t)return e;for(r=e>t?-8589934592:8589934592;Math.abs(e-t)>4294967296;)e+=r;return e}},{key:"passthrough",get:function(){return!1}}]),i}();n.default=d},{"../errors":20,"../events":22,"../remux/mp4-generator":30,"../utils/logger":36}],32:[function(r,l,e){"use strict";function i(e){return e&&e.__esModule?e:{default:e}}function n(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}Object.defineProperty(e,"__esModule",{value:!0});var a=function(){function e(i,r){for(var t=0;t<r.length;t++){var e=r[t];e.enumerable=e.enumerable||!1,e.configurable=!0,"value"in e&&(e.writable=!0),Object.defineProperty(i,e.key,e)}}return function(t,r,i){return r&&e(t.prototype,r),i&&e(t,i),t}}(),s=r("../events"),t=i(s),o=function(){function e(t){n(this,e),this.observer=t,this.ISGenerated=!1}return a(e,[{key:"destroy",value:function(){}},{key:"insertDiscontinuity",value:function(){}},{key:"switchLevel",value:function(){this.ISGenerated=!1}},{key:"remux",value:function(o,s,f,d,n,u){var a=this.observer;if(!this.ISGenerated){var l={},i={tracks:l,unique:!0},e=s,r=e.codec;r&&(i.tracks.video={container:e.container,codec:r,metadata:{width:e.width,height:e.height}}),e=o,r=e.codec,r&&(i.tracks.audio={container:e.container,codec:r,metadata:{channelCount:e.channelCount}}),this.ISGenerated=!0,a.trigger(t.default.FRAG_PARSING_INIT_SEGMENT,i)}a.trigger(t.default.FRAG_PARSING_DATA,{data1:u,startPTS:n,startDTS:n,type:"audiovideo",nb:1})}},{key:"passthrough",get:function(){return!0}}]),e}();e.default=o},{"../events":22}],33:[function(n,a,e){"use strict";function t(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}Object.defineProperty(e,"__esModule",{value:!0});var r=function(){function e(i,r){for(var t=0;t<r.length;t++){var e=r[t];e.enumerable=e.enumerable||!1,e.configurable=!0,"value"in e&&(e.writable=!0),Object.defineProperty(i,e.key,e)}}return function(t,r,i){return r&&e(t.prototype,r),i&&e(t,i),t}}(),i=function(){function e(r){t(this,e),"string"==typeof r&&(r=e.parseAttrList(r));for(var i in r)r.hasOwnProperty(i)&&(this[i]=r[i])}return r(e,[{key:"decimalInteger",value:function(t){var e=parseInt(this[t],10);return e>Number.MAX_SAFE_INTEGER?1/0:e}},{key:"hexadecimalInteger",value:function(r){if(this[r]){var e=(this[r]||"0x").slice(2);e=(1&e.length?"0":"")+e;for(var i=new Uint8Array(e.length/2),t=0;t<e.length/2;t++)i[t]=parseInt(e.slice(2*t,2*t+2),16);return i}return null}},{key:"hexadecimalIntegerAsNumber",value:function(t){var e=parseInt(this[t],16);return e>Number.MAX_SAFE_INTEGER?1/0:e}},{key:"decimalFloatingPoint",value:function(e){return parseFloat(this[e])}},{key:"enumeratedString",value:function(e){return this[e]}},{key:"decimalResolution",value:function(t){var e=/^(\d+)x(\d+)$/.exec(this[t]);if(null!==e)return{width:parseInt(e[1],10),height:parseInt(e[2],10)}}}],[{key:"parseAttrList",value:function(n){for(var t,a=/\s*(.+?)\s*=((?:\".*?\")|.*?)(?:,|$)/g,r={};null!==(t=a.exec(n));){var e=t[2],i='"';0===e.indexOf(i)&&e.lastIndexOf(i)===e.length-1&&(e=e.slice(1,-1)),r[t[1]]=e}return r}}]),e}();e.default=i},{}],34:[function(r,e,i){"use strict";var t={search:function(n,s){for(var t=0,r=n.length-1,e=null,i=null;r>=t;){e=(t+r)/2|0,i=n[e];var a=s(i);if(a>0)t=e+1;else{if(!(0>a))return i;r=e-1}}return null}};e.exports=t},{}],35:[function(n,a,e){"use strict";function t(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}Object.defineProperty(e,"__esModule",{value:!0});var r=function(){function e(i,r){for(var t=0;t<r.length;t++){var e=r[t];e.enumerable=e.enumerable||!1,e.configurable=!0,"value"in e&&(e.writable=!0),Object.defineProperty(i,e.key,e)}}return function(t,r,i){return r&&e(t.prototype,r),i&&e(t,i),t}}(),i=function(){function e(){t(this,e)}return r(e,[{key:"attach",value:function(e){this.media=e,this.display=[],this.memory=[]}},{key:"detach",value:function(){this.clear()}},{key:"destroy",value:function(){}},{key:"_createCue",value:function(){var t=window.VTTCue||window.TextTrackCue,e=this.cue=new t(-1,-1,"");e.text="",e.pauseOnExit=!1,e.startTime=Number.MAX_VALUE,e.endTime=Number.MAX_VALUE,this.memory.push(e)}},{key:"clear",value:function(){var e=this._textTrack;if(e&&e.cues)for(;e.cues.length>0;)e.removeCue(e.cues[0])}},{key:"push",value:function(r,i){this.cue||this._createCue();for(var n,t,e,s,o,u=31&i[0],a=2,l=0;u>l;l++)if(n=i[a++],t=127&i[a++],e=127&i[a++],s=0!==(4&n),o=3&n,(0!==t||0!==e)&&s&&0===o){if(32&t||64&t)this.cue.text+=this._fromCharCode(t)+this._fromCharCode(e);else if((17===t||25===t)&&e>=48&&63>=e)switch(e){case 48:this.cue.text+="®";break;case 49:this.cue.text+="°";break;case 50:this.cue.text+="½";break;case 51:this.cue.text+="¿";break;case 52:this.cue.text+="™";break;case 53:this.cue.text+="¢";break;case 54:this.cue.text+="";break;case 55:this.cue.text+="£";break;case 56:this.cue.text+="♪";break;case 57:this.cue.text+=" ";break;case 58:this.cue.text+="è";break;case 59:this.cue.text+="â";break;case 60:this.cue.text+="ê";break;case 61:this.cue.text+="î";break;case 62:this.cue.text+="ô";break;case 63:this.cue.text+="û"}if((17===t||25===t)&&e>=32&&47>=e)switch(e){case 32:break;case 33:break;case 34:break;case 35:break;case 36:break;case 37:break;case 38:break;case 39:break;case 40:break;case 41:break;case 42:break;case 43:break;case 44:break;case 45:break;case 46:break;case 47:}if((20===t||28===t)&&e>=32&&47>=e)switch(e){case 32:this._clearActiveCues(r);break;case 33:this.cue.text=this.cue.text.substr(0,this.cue.text.length-1);break;case 34:break;case 35:break;case 36:break;case 37:break;case 38:break;case 39:break;case 40:break;case 41:this._clearActiveCues(r);break;case 42:break;case 43:break;case 44:this._clearActiveCues(r);break;case 45:break;case 46:this._text="";break;case 47:this._flipMemory(r)}if((23===t||31===t)&&e>=33&&35>=e)switch(e){case 33:break;case 34:break;case 35:}}}},{key:"_fromCharCode",value:function(e){switch(e){case 42:return"á";case 2:return"á";case 2:return"é";case 4:return"í";case 5:return"ó";case 6:return"ú";case 3:return"ç";case 4:return"÷";case 5:return"Ñ";case 6:return"ñ";case 7:return"█";default:return String.fromCharCode(e)}}},{key:"_flipMemory",value:function(e){this._clearActiveCues(e),this._flushCaptions(e)}},{key:"_flushCaptions",value:function(s){this._has708||(this._textTrack=this.media.addTextTrack("captions","English","en"),this._has708=!0);var e=!0,i=!1,n=void 0;try{for(var a,t=this.memory[Symbol.iterator]();!(e=(a=t.next()).done);e=!0){var r=a.value;r.startTime=s,this._textTrack.addCue(r),this.display.push(r)}}catch(e){i=!0,n=e}finally{try{!e&&t.return&&t.return()}finally{if(i)throw n}}this.memory=[],this.cue=null}},{key:"_clearActiveCues",value:function(a){var e=!0,r=!1,i=void 0;try{for(var n,t=this.display[Symbol.iterator]();!(e=(n=t.next()).done);e=!0){var s=n.value;s.endTime=a}}catch(e){r=!0,i=e}finally{try{!e&&t.return&&t.return()}finally{if(r)throw i}}this.display=[]}},{key:"_clearBufferedCues",value:function(){}}]),e}();e.default=i},{}],36:[function(l,u,r){"use strict";function e(){}function n(t,e){return e="["+t+"] > "+e}function a(t){var r=window.console[t];return r?function(){for(var a=arguments.length,e=Array(a),i=0;a>i;i++)e[i]=arguments[i];e[0]&&(e[0]=n(t,e[0])),r.apply(window.console,e)}:e}function s(r){for(var i=arguments.length,n=Array(i>1?i-1:0),e=1;i>e;e++)n[e-1]=arguments[e];n.forEach(function(e){t[e]=r[e]?r[e].bind(r):a(e)})}Object.defineProperty(r,"__esModule",{value:!0});var o="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(e){return typeof e}:function(e){return e&&"function"==typeof Symbol&&e.constructor===Symbol?"symbol":typeof e},i={trace:e,debug:e,log:e,warn:e,info:e,error:e},t=i;r.enableLogs=function(e){if(e===!0||"object"===("undefined"==typeof e?"undefined":o(e))){s(e,"debug","log","info","warn","error");try{t.log()}catch(e){t=i}}else t=i},r.logger=t},{}],37:[function(r,t,i){"use strict";var e={buildAbsoluteURL:function(r,t){if(t=t.trim(),/^[a-z]+:/i.test(t))return t;var o=null,n=null,a=/^([^#]*)(.*)$/.exec(t);a&&(n=a[2],t=a[1]);var s=/^([^\?]*)(.*)$/.exec(t);s&&(o=s[2],t=s[1]);var f=/^([^#]*)(.*)$/.exec(r);f&&(r=f[1]);var u=/^([^\?]*)(.*)$/.exec(r);u&&(r=u[1]);var l=/^((([a-z]+):)?\/\/[a-z0-9\.\-_~]+(:[0-9]+)?\/)(.*)$/i.exec(r),h=l[3],d=l[1],c=l[5],i=null;return i=/^\/\//.test(t)?h+"://"+e.buildAbsolutePath("",t.substring(2)):/^\//.test(t)?d+e.buildAbsolutePath("",t.substring(1)):e.buildAbsolutePath(d+c,t),o&&(i+=o),n&&(i+=n),i},buildAbsolutePath:function(a,s){for(var i,e,o=s,n="",t=a.replace(/[^\/]*$/,o.replace(/(\/|^)(?:\.?\/+)+/g,"$1")),r=0;e=t.indexOf("/../",r),e>-1;r=e+i)i=/^\/(?:\.\.\/)*/.exec(t.slice(e))[0].length,n=(n+t.substring(r,e)).replace(new RegExp("(?:\\/+[^\\/]*){0,"+(i-1)/3+"}$"),"/");return n+t.substr(r)}};t.exports=e},{}],38:[function(r,s,t){"use strict";function i(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}Object.defineProperty(t,"__esModule",{value:!0});var n=function(){function e(i,r){for(var t=0;t<r.length;t++){var e=r[t];e.enumerable=e.enumerable||!1,e.configurable=!0,"value"in e&&(e.writable=!0),Object.defineProperty(i,e.key,e)}}return function(t,r,i){return r&&e(t.prototype,r),i&&e(t,i),t}}(),e=r("../utils/logger"),a=function(){function t(e){i(this,t),e&&e.xhrSetup&&(this.xhrSetup=e.xhrSetup)}return n(t,[{key:"destroy",value:function(){this.abort(),this.loader=null}},{key:"abort",value:function(){var e=this.loader,t=this.timeoutHandle;e&&4!==e.readyState&&(this.stats.aborted=!0,e.abort()),t&&window.clearTimeout(t)}},{key:"load",value:function(t,r,i,n,a,s,o,l){var u=arguments.length<=8||void 0===arguments[8]?null:arguments[8],e=arguments.length<=9||void 0===arguments[9]?null:arguments[9];this.url=t,!e||isNaN(e.byteRangeStartOffset)||isNaN(e.byteRangeEndOffset)||(this.byteRange=e.byteRangeStartOffset+"-"+(e.byteRangeEndOffset-1)),this.responseType=r,this.onSuccess=i,this.onProgress=u,this.onTimeout=a,this.onError=n,this.stats={trequest:performance.now(),retry:0},this.timeout=s,this.maxRetry=o,this.retryDelay=l,this.loadInternal()}},{key:"loadInternal",value:function(){var e;e="undefined"!=typeof XDomainRequest?this.loader=new XDomainRequest:this.loader=new XMLHttpRequest,e.onloadend=this.loadend.bind(this),e.onprogress=this.loadprogress.bind(this),e.open("GET",this.url,!0),this.byteRange&&e.setRequestHeader("Range","bytes="+this.byteRange),e.responseType=this.responseType,this.stats.tfirst=null,this.stats.loaded=0,this.xhrSetup&&this.xhrSetup(e,this.url),this.timeoutHandle=window.setTimeout(this.loadtimeout.bind(this),this.timeout),e.send()}},{key:"loadend",value:function(i){var n=i.currentTarget,r=n.status,t=this.stats;t.aborted||(r>=200&&300>r?(window.clearTimeout(this.timeoutHandle),t.tload=performance.now(),this.onSuccess(i,t)):t.retry<this.maxRetry?(e.logger.warn(r+" while loading "+this.url+", retrying in "+this.retryDelay+"..."),this.destroy(),window.setTimeout(this.loadInternal.bind(this),this.retryDelay),this.retryDelay=Math.min(2*this.retryDelay,64e3),t.retry++):(window.clearTimeout(this.timeoutHandle),e.logger.error(r+" while loading "+this.url),this.onError(i)))}},{key:"loadtimeout",value:function(t){e.logger.warn("timeout while loading "+this.url),this.onTimeout(t,this.stats)}},{key:"loadprogress",value:function(t){var e=this.stats;null===e.tfirst&&(e.tfirst=performance.now()),e.loaded=t.loaded,this.onProgress&&this.onProgress(t,e)}}]),t}();t.default=a},{"../utils/logger":36}]},{},[26])(26)});

    }

    try {
        $.rangeslider();
    }catch(err)
    {
        /*! rangeslider.js - v2.1.1, handle error or insert source */
		!function(a){"use strict";"function"==typeof define&&define.amd?define(["jquery"],a):"object"==typeof exports?module.exports=a(require("jquery")):a(jQuery)}(function(a){"use strict";function b(){var a=document.createElement("input");return a.setAttribute("type","range"),"text"!==a.type}function c(a,b){var c=Array.prototype.slice.call(arguments,2);return setTimeout(function(){return a.apply(null,c)},b)}function d(a,b){return b=b||100,function(){if(!a.debouncing){var c=Array.prototype.slice.apply(arguments);a.lastReturnVal=a.apply(window,c),a.debouncing=!0}return clearTimeout(a.debounceTimeout),a.debounceTimeout=setTimeout(function(){a.debouncing=!1},b),a.lastReturnVal}}function e(a){return a&&(0===a.offsetWidth||0===a.offsetHeight||a.open===!1)}function f(a){for(var b=[],c=a.parentNode;e(c);)b.push(c),c=c.parentNode;return b}function g(a,b){function c(a){"undefined"!=typeof a.open&&(a.open=a.open?!1:!0)}var d=f(a),e=d.length,g=[],h=a[b];if(e){for(var i=0;e>i;i++)g[i]=d[i].style.cssText,d[i].style.setProperty?d[i].style.setProperty("display","block","important"):d[i].style.cssText+=";display: block !important",d[i].style.height="0",d[i].style.overflow="hidden",d[i].style.visibility="hidden",c(d[i]);h=a[b];for(var j=0;e>j;j++)d[j].style.cssText=g[j],c(d[j])}return h}function h(a,b){var c=parseFloat(a);return Number.isNaN(c)?b:c}function i(a){return a.charAt(0).toUpperCase()+a.substr(1)}function j(b,e){if(this.$window=a(window),this.$document=a(document),this.$element=a(b),this.options=a.extend({},n,e),this.polyfill=this.options.polyfill,this.orientation=this.$element[0].getAttribute("data-orientation")||this.options.orientation,this.onInit=this.options.onInit,this.onSlide=this.options.onSlide,this.onSlideEnd=this.options.onSlideEnd,this.DIMENSION=o.orientation[this.orientation].dimension,this.DIRECTION=o.orientation[this.orientation].direction,this.DIRECTION_STYLE=o.orientation[this.orientation].directionStyle,this.COORDINATE=o.orientation[this.orientation].coordinate,this.polyfill&&m)return!1;this.identifier="js-"+k+"-"+l++,this.startEvent=this.options.startEvent.join("."+this.identifier+" ")+"."+this.identifier,this.moveEvent=this.options.moveEvent.join("."+this.identifier+" ")+"."+this.identifier,this.endEvent=this.options.endEvent.join("."+this.identifier+" ")+"."+this.identifier,this.toFixed=(this.step+"").replace(".","").length-1,this.$fill=a('<div class="'+this.options.fillClass+'" />'),this.$handle=a('<div class="'+this.options.handleClass+'" />'),this.$range=a('<div class="'+this.options.rangeClass+" "+this.options[this.orientation+"Class"]+'" id="'+this.identifier+'" />').insertAfter(this.$element).prepend(this.$fill,this.$handle),this.$element.css({position:"absolute",width:"1px",height:"1px",overflow:"hidden",opacity:"0"}),this.handleDown=a.proxy(this.handleDown,this),this.handleMove=a.proxy(this.handleMove,this),this.handleEnd=a.proxy(this.handleEnd,this),this.init();var f=this;this.$window.on("resize."+this.identifier,d(function(){c(function(){f.update(!1,!1)},300)},20)),this.$document.on(this.startEvent,"#"+this.identifier+":not(."+this.options.disabledClass+")",this.handleDown),this.$element.on("change."+this.identifier,function(a,b){if(!b||b.origin!==f.identifier){var c=a.target.value,d=f.getPositionFromValue(c);f.setPosition(d)}})}Number.isNaN=Number.isNaN||function(a){return"number"==typeof a&&a!==a};var k="rangeslider",l=0,m=b(),n={polyfill:!0,orientation:"horizontal",rangeClass:"rangeslider",disabledClass:"rangeslider--disabled",horizontalClass:"rangeslider--horizontal",verticalClass:"rangeslider--vertical",fillClass:"rangeslider__fill",handleClass:"rangeslider__handle",startEvent:["mousedown","touchstart","pointerdown"],moveEvent:["mousemove","touchmove","pointermove"],endEvent:["mouseup","touchend","pointerup"]},o={orientation:{horizontal:{dimension:"width",direction:"left",directionStyle:"left",coordinate:"x"},vertical:{dimension:"height",direction:"top",directionStyle:"bottom",coordinate:"y"}}};return j.prototype.init=function(){this.update(!0,!1),this.onInit&&"function"==typeof this.onInit&&this.onInit()},j.prototype.update=function(a,b){a=a||!1,a&&(this.min=h(this.$element[0].getAttribute("min"),0),this.max=h(this.$element[0].getAttribute("max"),100),this.value=h(this.$element[0].value,Math.round(this.min+(this.max-this.min)/2)),this.step=h(this.$element[0].getAttribute("step"),1)),this.handleDimension=g(this.$handle[0],"offset"+i(this.DIMENSION)),this.rangeDimension=g(this.$range[0],"offset"+i(this.DIMENSION)),this.maxHandlePos=this.rangeDimension-this.handleDimension,this.grabPos=this.handleDimension/2,this.position=this.getPositionFromValue(this.value),this.$element[0].disabled?this.$range.addClass(this.options.disabledClass):this.$range.removeClass(this.options.disabledClass),this.setPosition(this.position,b)},j.prototype.handleDown=function(a){if(this.$document.on(this.moveEvent,this.handleMove),this.$document.on(this.endEvent,this.handleEnd),!((" "+a.target.className+" ").replace(/[\n\t]/g," ").indexOf(this.options.handleClass)>-1)){var b=this.getRelativePosition(a),c=this.$range[0].getBoundingClientRect()[this.DIRECTION],d=this.getPositionFromNode(this.$handle[0])-c,e="vertical"===this.orientation?this.maxHandlePos-(b-this.grabPos):b-this.grabPos;this.setPosition(e),b>=d&&b<d+this.handleDimension&&(this.grabPos=b-d)}},j.prototype.handleMove=function(a){a.preventDefault();var b=this.getRelativePosition(a),c="vertical"===this.orientation?this.maxHandlePos-(b-this.grabPos):b-this.grabPos;this.setPosition(c)},j.prototype.handleEnd=function(a){a.preventDefault(),this.$document.off(this.moveEvent,this.handleMove),this.$document.off(this.endEvent,this.handleEnd),this.$element.trigger("change",{origin:this.identifier}),this.onSlideEnd&&"function"==typeof this.onSlideEnd&&this.onSlideEnd(this.position,this.value)},j.prototype.cap=function(a,b,c){return b>a?b:a>c?c:a},j.prototype.setPosition=function(a,b){var c,d;void 0===b&&(b=!0),c=this.getValueFromPosition(this.cap(a,0,this.maxHandlePos)),d=this.getPositionFromValue(c),this.$fill[0].style[this.DIMENSION]=d+this.grabPos+"px",this.$handle[0].style[this.DIRECTION_STYLE]=d+"px",this.setValue(c),this.position=d,this.value=c,b&&this.onSlide&&"function"==typeof this.onSlide&&this.onSlide(d,c)},j.prototype.getPositionFromNode=function(a){for(var b=0;null!==a;)b+=a.offsetLeft,a=a.offsetParent;return b},j.prototype.getRelativePosition=function(a){var b=i(this.COORDINATE),c=this.$range[0].getBoundingClientRect()[this.DIRECTION],d=0;return"undefined"!=typeof a["page"+b]?d=a["client"+b]:"undefined"!=typeof a.originalEvent["client"+b]?d=a.originalEvent["client"+b]:a.originalEvent.touches&&a.originalEvent.touches[0]&&"undefined"!=typeof a.originalEvent.touches[0]["client"+b]?d=a.originalEvent.touches[0]["client"+b]:a.currentPoint&&"undefined"!=typeof a.currentPoint[this.COORDINATE]&&(d=a.currentPoint[this.COORDINATE]),d-c},j.prototype.getPositionFromValue=function(a){var b,c;return b=(a-this.min)/(this.max-this.min),c=Number.isNaN(b)?0:b*this.maxHandlePos},j.prototype.getValueFromPosition=function(a){var b,c;return b=a/(this.maxHandlePos||1),c=this.step*Math.round(b*(this.max-this.min)/this.step)+this.min,Number(c.toFixed(this.toFixed))},j.prototype.setValue=function(a){(a!==this.value||""===this.$element[0].value)&&this.$element.val(a).trigger("input",{origin:this.identifier})},j.prototype.destroy=function(){this.$document.off("."+this.identifier),this.$window.off("."+this.identifier),this.$element.off("."+this.identifier).removeAttr("style").removeData("plugin_"+k),this.$range&&this.$range.length&&this.$range[0].parentNode.removeChild(this.$range[0])},a.fn[k]=function(b){var c=Array.prototype.slice.call(arguments,1);return this.each(function(){var d=a(this),e=d.data("plugin_"+k);e||d.data("plugin_"+k,e=new j(this,b)),"string"==typeof b&&e[b].apply(e,c)})},"rangeslider.js is available in jQuery context e.g $(selector).rangeslider(options);"});
    }

    // Julia main class
    _julia = function(el, opts)
    {
        // Custom options
        var options = typeof opts === 'undefined' ? {}: opts;
        var _element = typeof el === 'undefined' ? $('video'): el;

        // Default options
        var _options = {
            source: false,
            autoplay: false,
            volume: 25,
            muted: false,
            width: 512,
            height: 288,
            debug: false,
            debugPlayback: false,
            forceHls: false,
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
                debug : false,
                autoStartLoad : true,
                maxBufferLength : 60,
                maxBufferSize : 120*1000*1000,
                liveSyncDurationCount : 5, // D: 3
                liveMaxLatencyDurationCount: 20,
                enableWorker : true,
                fragLoadingTimeOut : 5000,
                fragLoadingMaxRetry : 6,
                fragLoadingRetryDelay : 100,
                manifestLoadingTimeOut : 10000,
                manifestLoadingMaxRetry : 6,
                manifestLoadingRetryDelay : 500,
                fpsDroppedMonitoringPeriod : 5000,
                fpsDroppedMonitoringThreshold : 0.2,
                appendErrorMaxRetry : 200,
            },
            suggest: [],
            suggestLimit: 2,
            suggestTimeout: 10000,
            swf: __JULIA_ROOT_PATH__+'/swf/flashlsChromeless.swf',
            themePath: __JULIA_ROOT_PATH__+'/css/themes',
            pluginPath: __JULIA_ROOT_PATH__+'/js/plugins',
            theme: 'default',
            i18n: {
                liveText: 'Live'
            },
            onTime: {},
            triggerHls: {},
            onPlay: false,
            onPause: false,
            onStop: false,
            onPosition: false,
            onSuggest: false,
        };


        // UI & behavior globals
        var _env = {
            shield: '',
            element: _element,
            suggest: '',
            toolbar: '',
            poster: '',
            api: '',
            apiId: Math.floor((Math.random()*10000000)+1), // Create a shadow api unique ID
            player: '',
            isLive: false,
            hls: {},
            canPlayMedia: '',
            canPlayMediaString: '',
            isHls: false,
            useHlsLib: false,
            tries: 0,
            source: '',
            flashApi: false,
            duration: 0,
            apiOk: false,
            onTimeRised: [],
            seeking: false,
            dimensions: {
            	width: 0,
            	height: 0,
            },
            flashCallbackName: '',
            started: false,
            publicApi: {},
            suggestPointer: 0,
            suggestClicked: false,
            progressStep: 0.01, // Full sense: 100, so .01 is enough accurate
        }

        // Extend options
        var _system = {

            extend: function()
            {
                for(o in _options)
                {
                    if(options.hasOwnProperty(o))
                    {
                        _options[o] = options[o];
                    }
                }

                options = _options;
            }
        };

        // Console debug
        var _debug = {

            run: function(data)
            {
                if(options.debug === true)
                {
                    if(window.console)
                    {
                        for(d in data)
                        {
                            console.log(' - [instance: '+_env.apiId+'] '+d+' ['+(typeof data[d])+']', data[d]);
                        }
                    }
                }
            }
        };

        // Persistent user data in cookies
        var _persist = {

            set: function(name, value, days)
            {
                dateObj = new Date();
                dateObj.setTime(dateObj.getTime() + (days*24*60*60*1000));
                var expires = 'expires=' + dateObj.toUTCString();
                document.cookie = name + '=' + value + '; ' + expires + '; path=/';
            },

            get: function(name)
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

                return '';
            }

        };

        // Create valid api object
        var _api = {

            create: function()
            {
                $('#julia-api-'+_env.apiId).remove();

                // Create default api object
                if(_env.flashApi === false)
                {
                    _debug.run({
                        'apiType': 'html5video',
                    });

                    apiElement = $('<video class="julia-video" id="julia-api-'+_env.apiId+'" preload="auto"></video>');
                    _env.player.prepend(apiElement);
                    _env.api = document.getElementById('julia-api-'+_env.apiId);
                    _env.api.controls = false;
                    _env.apiOk = true;

                }else{

                    var flash = _flash.detect();
                    var flashOk = flash.installed;

                    if( (flash.major==11 && flash.minor>=2) || flash.major>11 )
                    {
                        _debug.run({
                            'apiType': 'flashls',
                        });

                        _env.apiOk = true;
                        _env.flashCallbackName = 'flashlsCallback'+_env.apiId;

                        apiElement = $('<object classid="clsid:d27cdb6e-ae6d-11cf-96b8-444553540000" codebase="" id="julia-api-'+_env.apiId+'">'
                                    +'<param name="movie" value="'+options.swf+'?inline=1" />'
                                    +'<param name="quality" value="autohigh" />'
                                    +'<param name="swliveconnect" value="true" />'
                                    +'<param name="allowScriptAccess" value="sameDomain" />'
                                    +'<param name="bgcolor" value="#000000" />'
                                    +'<param name="allowFullScreen" value="true" />'
                                    +'<param name="wmode" value="opaque" />'
                                    +'<param name="FlashVars" value="callback='+_env.flashCallbackName+'" />'
                                    +'<embed src="'+options.swf+'?inline=1" name="julia-api-'+_env.apiId+'" '
                                    +'    quality="autohigh" '
                                    +'    bgcolor="#000000" '
                                    +'    align="middle" allowFullScreen="true" '
                                    +'    allowScriptAccess="sameDomain" '
                                    +'    type="application/x-shockwave-flash" '
                                    +'    swliveconnect="true" '
                                    +'    wmode="opaque" '
                                    +'    FlashVars="callback='+_env.flashCallbackName+'"'
                                    +'    pluginspage="http://www.macromedia.com/go/getflashplayer" >'
                                    +'</embed>'
                                +'</object>');

                        _env.player.prepend(apiElement);

                        flashlsAPI = function(flashObject)
                        {
                            this.constructor = function(flashObject)
                            {
                                this.flashObject = flashObject;
                            }

                            this.constructor(flashObject);

                            this.load = function(url)
                            {
                                this.flashObject.playerLoad(url);
                            }

                            this.play = function(offset)
                            {
                                started = true;
                                this.flashObject.playerPlay(offset);
                            }

                            this.pause = function()
                            {
                                this.flashObject.playerPause();
                            }

                            this.resume = function() {
                                this.flashObject.playerResume();
                            }

                            this.seek = function(offset) {
                                this.flashObject.playerSeek(offset);
                            }

                            this.stop = function() {
                                this.flashObject.playerStop();
                            }

                            this.volume = function(volume) {
                                this.flashObject.playerVolume(volume);
                            }

                            this.setCurrentLevel = function(level) {
                                this.flashObject.playerSetCurrentLevel(level);
                            }

                            this.setNextLevel = function(level) {
                                this.flashObject.playerSetNextLevel(level);
                            }

                            this.setLoadLevel = function(level) {
                                this.flashObject.playerSetLoadLevel(level);
                            }

                            this.setMaxBufferLength = function(len) {
                                this.flashObject.playerSetmaxBufferLength(len);
                            }

                            this.getPosition = function() {
                                return this.flashObject.getPosition();
                            }

                            this.getDuration = function() {
                                return this.flashObject.getDuration();
                            }

                            this.getbufferLength = function() {
                                return this.flashObject.getbufferLength();
                            }

                            this.getbackBufferLength = function() {
                                return this.flashObject.getbackBufferLength();
                            }

                            this.getLowBufferLength = function() {
                                return this.flashObject.getlowBufferLength();
                            }

                            this.getMinBufferLength = function() {
                                return this.flashObject.getminBufferLength();
                            }

                            this.getMaxBufferLength = function() {
                                return this.flashObject.getmaxBufferLength();
                            }

                            this.getLevels = function() {
                                return this.flashObject.getLevels();
                            }

                            this.getAutoLevel = function() {
                                return this.flashObject.getAutoLevel();
                            }

                            this.getCurrentLevel = function() {
                                return this.flashObject.getCurrentLevel();
                            }

                            this.getNextLevel = function() {
                                return this.flashObject.getNextLevel();
                            }

                            this.getLoadLevel = function() {
                                return this.flashObject.getLoadLevel();
                            }

                            this.getAudioTrackList = function() {
                                return this.flashObject.getAudioTrackList();
                            }

                            this.getStats = function() {
                                return this.flashObject.getStats();
                            }

                            this.setAudioTrack = function(trackId) {
                                this.flashObject.playerSetAudioTrack(trackId);
                            }

                            this.playerSetLogDebug = function(state) {
                                this.flashObject.playerSetLogDebug(state);
                            }

                            this.getLogDebug = function() {
                                return this.flashObject.getLogDebug();
                            }

                            this.playerSetLogDebug2 = function(state) {
                                this.flashObject.playerSetLogDebug2(state);
                            }

                            this.getLogDebug2 = function() {
                                return this.flashObject.getLogDebug2();
                            }

                            this.playerSetUseHardwareVideoDecoder = function(state) {
                                this.flashObject.playerSetUseHardwareVideoDecoder(state);
                            }

                            this.getUseHardwareVideoDecoder = function() {
                                return this.flashObject.getUseHardwareVideoDecoder();
                            }

                            this.playerSetflushLiveURLCache = function(state) {
                                this.flashObject.playerSetflushLiveURLCache(state);
                            }

                            this.getflushLiveURLCache = function() {
                                return this.flashObject.getflushLiveURLCache();
                            }

                            this.playerSetJSURLStream = function(state) {
                                this.flashObject.playerSetJSURLStream(state);
                            }

                            this.getJSURLStream = function() {
                                return this.flashObject.getJSURLStream();
                            }

                            this.playerCapLeveltoStage = function(state) {
                                this.flashObject.playerCapLeveltoStage(state);
                            }

                            this.getCapLeveltoStage = function() {
                                return this.flashObject.getCapLeveltoStage();
                            }

                            this.playerSetAutoLevelCapping = function(level) {
                                this.flashObject.playerSetAutoLevelCapping(level);
                            }

                            this.getAutoLevelCapping = function() {
                                return this.flashObject.getAutoLevelCapping();
                            }
                        };

                        getFlashMovieObject = function(movieName)
                        {
                            if (window.document[movieName])
                            {
                                return window.document[movieName];
                            }
                            if (navigator.appName.indexOf("Microsoft Internet")==-1)
                            {
                                if (document.embeds && document.embeds[movieName])
                                {
                                   return document.embeds[movieName];
                                }else // if (navigator.appName.indexOf("Microsoft Internet")!=-1)
                                {
                                    return document.getElementById(movieName);
                                }
                            }
                        }

                        _env.api = new flashlsAPI(getFlashMovieObject('julia-api-'+_env.apiId));

                    }else{

                        _env.api = {};
                        _env.shield.find('.julia-preloader').html('<div style="background: #111; color: #DDD; min-height: 100%; padding-top: 10%; font-size: 1.2em;"><span class="ion-android-warning"></span> <a href="https://get.adobe.com/cz/flashplayer/" target="_blank" style="color: #FFF;">Adobe Flash Player</a> is required</div>');
                        _env.api.flashObject = $('<div class="julia-error" id="julia-api-'+_env.apiId+'"></div>');
                        _env.player.prepend(_env.api.flashObject);
                    }
                }

                _debug.run({
                    'apiId': _env.apiId,
                    'api': _env.api,
                });
            }
        };


        var _flash = {

            detect: function()
            {
                var self = this;
                self.installed = false;
                self.raw = "";
                self.major = -1;
                self.minor = -1;
                self.revision = -1;
                self.revisionStr = "";
                var activeXDetectRules = [
                    {
                        "name":"ShockwaveFlash.ShockwaveFlash.7",
                        "version":function(obj){
                            return getActiveXVersion(obj);
                        }
                    },
                    {
                        "name":"ShockwaveFlash.ShockwaveFlash.6",
                        "version":function(obj){
                            var version = "6,0,21";
                            try{
                                obj.AllowScriptAccess = "always";
                                version = getActiveXVersion(obj);
                            }catch(err){}
                            return version;
                        }
                    },
                    {
                        "name":"ShockwaveFlash.ShockwaveFlash",
                        "version":function(obj){
                            return getActiveXVersion(obj);
                        }
                    }
                ];

                /**
                 * Extract the ActiveX version of the plugin.
                 *
                 * @param {Object} The flash ActiveX object.
                 * @type String
                 */
                var getActiveXVersion = function(activeXObj)
                {
                    var version = -1;
                    try
                    {
                        version = activeXObj.GetVariable("$version");
                    }catch(err)
                    {}
                    return version;
                };

                /**
                 * Try and retrieve an ActiveX object having a specified name.
                 *
                 * @param {String} name The ActiveX object name lookup.
                 * @return One of ActiveX object or a simple object having an attribute of activeXError with a value of true.
                 * @type Object
                 */
                var getActiveXObject = function(name)
                {
                    var obj = -1;
                    try
                    {
                        obj = new ActiveXObject(name);
                    }catch(err)
                    {
                        obj = {activeXError:true};
                    }
                    return obj;
                };

                /**
                 * Parse an ActiveX $version string into an object.
                 *
                 * @param {String} str The ActiveX Object GetVariable($version) return value.
                 * @return An object having raw, major, minor, revision and revisionStr attributes.
                 * @type Object
                 */
                var parseActiveXVersion = function(str)
                {
                    var versionArray = str.split(",");//replace with regex
                    return {
                        "raw":str,
                        "major":parseInt(versionArray[0].split(" ")[1], 10),
                        "minor":parseInt(versionArray[1], 10),
                        "revision":parseInt(versionArray[2], 10),
                        "revisionStr":versionArray[2]
                    };
                };

                /**
                 * Parse a standard enabledPlugin.description into an object.
                 *
                 * @param {String} str The enabledPlugin.description value.
                 * @return An object having raw, major, minor, revision and revisionStr attributes.
                 * @type Object
                 */
                var parseStandardVersion = function(str)
                {
                    var descParts = str.split(/ +/);
                    var majorMinor = descParts[2].split(/\./);
                    var revisionStr = descParts[3];
                    return {
                        "raw":str,
                        "major":parseInt(majorMinor[0], 10),
                        "minor":parseInt(majorMinor[1], 10),
                        "revisionStr":revisionStr,
                        "revision":parseRevisionStrToInt(revisionStr)
                    };
                };

                /**
                 * Parse the plugin revision string into an integer.
                 *
                 * @param {String} The revision in string format.
                 * @type Number
                 */
                var parseRevisionStrToInt = function(str)
                {
                    return parseInt(str.replace(/[a-zA-Z]/g, ""), 10) || self.revision;
                };

                /**
                 * Constructor, sets raw, major, minor, revisionStr, revision and installed public properties.
                */
                if(navigator.plugins && navigator.plugins.length>0)
                {
                    var type = 'application/x-shockwave-flash';
                    var mimeTypes = navigator.mimeTypes;
                    if(mimeTypes && mimeTypes[type] && mimeTypes[type].enabledPlugin && mimeTypes[type].enabledPlugin.description)
                    {
                        var version = mimeTypes[type].enabledPlugin.description;
                        var versionObj = parseStandardVersion(version);
                        self.raw = versionObj.raw;
                        self.major = versionObj.major;
                        self.minor = versionObj.minor;
                        self.revisionStr = versionObj.revisionStr;
                        self.revision = versionObj.revision;
                        self.installed = true;
                    }
                }else if(navigator.appVersion.indexOf("Mac")==-1 && window.execScript)
                {
                    var version = -1;
                    for(var i=0; i<activeXDetectRules.length && version==-1; i++)
                    {
                        var obj = getActiveXObject(activeXDetectRules[i].name);
                        if(!obj.activeXError)
                        {
                            self.installed = true;
                            version = activeXDetectRules[i].version(obj);
                            if(version!=-1)
                            {
                                var versionObj = parseActiveXVersion(version);
                                self.raw = versionObj.raw;
                                self.major = versionObj.major;
                                self.minor = versionObj.minor;
                                self.revision = versionObj.revision;
                                self.revisionStr = versionObj.revisionStr;
                            }
                        }
                    }
                }

                return self;
            }
        };

        // UI kit
        var _ui = {

            // Video shield for helpers, buttons, preloaders, advertising etc...
            shield: function()
            {
                _env.shield = $('<div class="julia-shield" id="julia-shield-'+_env.apiId+'">'
                            +'  <button class="julia-btn julia-big-play"><i class="ion-play"></i></button>'
                            +'  <div class="julia-preloader"><i class="ion-load-c"></i></div>'
                            +'</div>'
                    );

                _env.suggest = $('<div class="julia-suggest" id="julia-suggest-'+_env.apiId+'"></div>');
            },

            posterSet: function()
            {
                _ui.posterUnset();
                if(_env.poster.length > 0)
                {
                    img = $('<img src="'+_env.poster+'" width="100%" height="100%">')

                    _env.shield.append(img);

                    _debug.run({
                        poster: _env.poster,
                    })
                }
            },

            posterUnset: function()
            {
                _env.shield.find('img').remove();
            },

            // Button toolbar
            toolbar: function()
            {
                _env.toolbar = $('<div class="julia-toolbar" id="julia-toolbar-'+_env.apiId+'">'
                    +'<div class="julia-progress">'
                    +'  <input type="range" value="0" min="0" max="100" step="'+_env.progressStep+'">'
                    +'</div>'
                    +'<div class="julia-panel julia-live-indicator">'
                    +'    <span>'+options.i18n.liveText+'</span>'
                    +'</div>'
                    +'<div class="julia-panel julia-currentTime">'
                    +'    <span>00:00:00</span> /&nbsp;'
                    +'</div>'
                    +'<div class="julia-panel julia-duration">'
                    +'    <span>00:00:00</span>'
                    +'</div>'
                    +'<button class="julia-btn julia-playback play">'
                    +'    <i class="ion-play"></i>'
                    +'</button>'
                    +'<button class="julia-btn julia-sound on">'
                    +'    <i class="ion-android-volume-up"></i>'
                    +'</button>'
                    +'<div class="julia-volume">'
                    +'  <input type="range" value="'+options.volume+'" min="0" max="100">'
                    +'</div>'
                    +'<button class="julia-btn julia-fullscreen-toggle on">'
                    +'    <i class="ion-android-expand"></i>'
                    +'</button>'
                +'</div>');
            },

            // Create player object
            player: function()
            {
                _ui.shield();
                _ui.toolbar();

                _env.player = $('<div class="julia-player julia-fullscreen-off julia-theme-'+options.theme+'" id="julia-player-'+_env.apiId+'">'
                            +'</div>');

                _env.player.append(_env.shield);
                _env.player.append(_env.suggest);
                _env.player.append(_env.toolbar);

                _env.element.hide();
                _env.player.insertAfter(_env.element);

                // Simulate preload
                _env.shield.find('.julia-big-play').hide();
                _env.toolbar.hide();

                // Rangeslider polyfill
                $('#julia-toolbar-'+_env.apiId+'>div.julia-progress>input, #julia-toolbar-'+_env.apiId+'>div.julia-volume>input').rangeslider({
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

                _debug.run({
                    'element': _env.element,
                    'toolbar': _env.toolbar,
                    'shield': _env.shield,
                    'player': _env.player,
                });
            }
        };

        // Fullscreen on
        var _fullscreen = {

            on: function()
            {
                var videoFrame = document.querySelector('#julia-player-'+_env.apiId);

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
                }
            },

            // Fullscreen off
            off: function()
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
            }
        };

        // Timeline numbers coonversion
        var _timeline = {

            toPercents: function(currentTime)
            {
                p = (currentTime/_env.duration)*100;
                return p;
            },

            toSeconds: function(percent)
            {
                t = (_env.duration/100)*percent;
                return t;
            },

            toNum: function(human)
            {
                human = human.split(':');
                human.reverse();
                s = parseInt(human[0]);
                m = human.length>1 ? parseInt(human[1]): 0;
                h = human.length>2 ? parseInt(human[3]): 0;
                t = s + m*60 + h*60*60;
                return t;
            },

            toHuman: function(time)
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
            }
        };


        // Suggest engine
        var _suggest = {

            run: function()
            {
                _env.suggest.html('');
                _control.press('stop');
                _env.suggestClicked = false;
                _env.tries = 0;

                if(options.suggest.length > 0)
                {
                    x = 0;
                    for(var i in options.suggest)
                    {
                        if(x < options.suggestLimit && options.suggest[i].played === false)
                        {
                            mode = !!options.suggest[i].live && options.suggest[i].live === true ? 'live': 'vod';
                            liveText = !!options.suggest[i].liveText ? options.suggest[i].liveText: 'Live';
                            var poster = !!options.suggest[i].poster ? options.suggest[i].poster: '';
                            posterImage = poster.length>0 ? '<img src="'+poster+'" width="100%" height="100%">': '';
                            suggestItemWidget = $('<div class="julia-suggest-item" data-poster="'+poster+'" data-file="'+options.suggest[i].file+'" data-mode="'+mode+'" data-live-text="'+liveText+'" data-index="'+i+'">'
                                    + posterImage
                                    +'<div class="julia-suggest-item-title">'+options.suggest[i].title+'</div>'
                                +'</div>');

                                suggestItemWidget.on('click', function(e)
                                {

                                    if(options.onSuggest !== false)
                                    {
                                        _call.fn(options.onSuggest, options.suggest[i]);
                                    }


                                    if(_env.flashApi===false)
                                    {
                                        options.muted = _env.api.muted;
                                    }else{

                                    }

                                    options.poster = $(this).data('poster');
                                    _env.suggestClicked = true;
                                    _env.shield.find('.julia-big-play').hide();
                                    _env.started = false;
                                    options.source = $(this).data('file');
                                    _boot.selectSource();
                                    options.autoplay = true;
                                    options.live = $(this).data('mode') == 'live' ? true: false;
                                    options.i18n.liveText = $(this).data('live-text');

                                    _env.toolbar.find('.julia-live-indicator>span').text(options.i18n.liveText);

                                    _debug.run({
                                        suggestRemoveIndex: $(this).data('index'),
                                        suggestRemove: $(this).data('file')
                                    });

                                    options.suggest[$(this).data('index')].played = true;
                                    _env.suggest.removeClass('on');

                                    _boot.init();
                                    _boot.load();
                                    _support.resize();
                                });

                            _env.suggest.append(suggestItemWidget);
                            x++;
                        }
                    }

                    if(x > 0)
                    {
                        if(options.suggestTimeout > 0 && _support.isMobile() === false)
                        {
                            setTimeout( function()
                            {
                                if(_env.suggestClicked === false)
                                {
                                    _env.suggest.find('div.julia-suggest-item:first').click();
                                }
                            }, options.suggestTimeout);
                        }
                        _env.suggest.addClass('on');
                    }

                }else{
                    _fullscreen.off();
                }

                _debug.run({
                    'Suggest' : 'raised'
                });
            }
        };

        // Support
        var _support = {

            aspect: function(w,h)
            {
                return w>0 && h>0 ? h/w: 0;
            },

            isMobile: function()
            {
                if( /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) )
                {
                    return true;
                }

                return false;
            },

            forceReady: function()
            {
                if( /Firefox/i.test(navigator.userAgent) )
                {
                    return true;
                }

                return false;
            },

            theme: function()
            {
                _debug.run({
                    'theme': options.themePath+'/'+options.theme+'/julia.css'
                });

                $('head').append('<link rel="stylesheet" type="text/css" href="'+options.themePath+'/'+options.theme+'/julia.css">');
            },

            canPlayMedia: function()
            {
                var vid = document.createElement('video');
                vid.id = 'video-cap-test-'+_env.apiId;
                _env.canPlayMediaString = vid.canPlayType('application/vnd.apple.mpegURL');
                $('#video-cap-test'+_env.apiId).remove();
                return (_env.canPlayMediaString == 'probably' || _env.canPlayMediaString == 'maybe');
            },

            resize: function()
            {
                // Player dimensions
                defaultDim = _env.element.width() ? [_env.element.width(), _env.element.height()]: [options.width, options.height];
                dimensions = options.responsive === true ? _support.getSize(): defaultDim;

                _debug.run({
                    'resizeDefaults': defaultDim,
                    'resize': dimensions
                });

                _env.player.width(dimensions[0]);
                _env.player.height(dimensions[1]);

                _env.dimensions.width = dimensions[0];
                _env.dimensions.height = dimensions[1];

                if(_env.flashApi===false)
                {
                    _env.api.setAttribute('width', '100%');
                    _env.api.setAttribute('height', '100%');
                }else{

                    if(_env.apiOk === true)
                    {
                        _env.api.flashObject.width = '100%';
                        _env.api.flashObject.height = '100%';
                    }else{
                        _env.api.flashObject.width('100%');
                        _env.api.flashObject.height('100%');
                    }
                }
            },

            getSize: function()
            {
                var parentWidth = _env.element.parent().width();
                for(i in options.dimensions)
                {
                    var dim = options.dimensions[i];
                    if(parentWidth>=dim[0])
                    {
                        if(_env.flashApi===false)
                        {
                            a = _support.aspect(parentWidth) == 0 ? dim[1]/dim[0]: _support.aspect(_env.api.videoWidth, _env.api.videoHeight);
                        }else{
                            a = _support.aspect(parentWidth) == 0 ? dim[1]/dim[0]: _support.aspect(_env.api.width(), _env.api.height());
                        }

                        dimensions = [dim[0],(dim[0]*a)];
                        _debug.run({
                            'resizePredefined': dimensions
                        });
                        return dimensions;
                    }
                }

                a = _support.aspect() == 0 ? dim[1]/dim[0]: _support.aspect(_env.api.videoWidth, _env.api.videoHeight);
                dimensions = [parentWidth, (parentWidth*a)];

                _debug.run({
                    'resizeFallback': dimensions
                });

                return dimensions;
            }
        };


        // Callback
        var _call = {

            fn: function(f, data)
            {
                data = data||{};
                if(f !== false)
                {
                    f(_options, _env, data);
                }
            }
        };

        // Api && UI control
        var _control = {

            press: function(action, data)
            {
                data = data||{};

                if(data.length>0)
                {
                    _debug.run({
                        'action': action,
                        'action-data': data,
                    });

                }else{

                    _debug.run({
                        'action': action,
                    });
                }

                switch(action)
                {
                    case 'play':

                        if(options.onPlay !== false)
                        {
                            _call.fn(options.onPlay, data);
                        }

                        if(_env.flashApi === false)
                        {
                            _env.api.play();

                        }else{

                            _env.shield.find('.julia-big-play').hide();

                            if(_env.started === false)
                            {
                                _env.api.play(-1);

                                _debug.run({
                                    'FlashPlay': 'play',
                                    'FlashPosition': _env.api.getPosition()
                                });

                            }else{

                                _env.api.resume(); //(api.getPosition());

                                _debug.run({
                                    'FlashPlay': 'resume',
                                    'FlashPosition': _env.api.getPosition()
                                });
                            }
                        }

                    break; case 'pause':

                        if(options.onPause !== false)
                        {
                            _call.fn(options.onPause, data);
                        }

                        if(_env.flashApi === false)
                        {
                            _env.api.pause();

                        }else{

                            _env.api.pause();
                            _env.toolbar.find('.julia-playback.pause').removeClass('pause').addClass('play')
                            .find('i').removeClass('ion-pause').addClass('ion-play');
                            _env.shield.find('.julia-big-play').show();
                        }

                    break; case 'stop':

                        if(options.onStop !== false)
                        {
                            _call.fn(options.onStop, data);
                        }

                        if(_env.flashApi === false)
                        {
                            _env.api.pause();
                            _env.api.currentTime = 0;

                        }else{

                            _env.started = false;
                            _env.api.stop();
                        }

                        _env.toolbar.find('.julia-playback.pause').removeClass('pause').addClass('play')
                        .find('i').removeClass('ion-pause').addClass('ion-play');
                        _env.shield.find('.julia-big-play').show();
                        _env.toolbar.find('.julia-progress>input').val(0).rangeslider('update', true);

                    break; case 'goto':

                        if(options.onPosition !== false)
                        {
                            _call.fn(options.onPosition, data);
                        }

                        if(_env.flashApi === false)
                        {
                            _env.api.currentTime = data.currentTime;

                        }else{

                            _env.api.seek(data.currentTime);
                        }

                    break; case 'setDuration':

                        _env.toolbar.find('.julia-panel.julia-duration>span').text(data.duration);

                        if(_env.started === false)
                        {
                            _env.toolbar.find('.julia-progress>input').val(0).rangeslider('update', true);
                        }

                        _debug.run({
                            'setDuration': data.duration
                        });

                    break; case 'volume':

                        if(_env.flashApi === false)
                        {
                            options.volume = data.volume;
                            _env.api.volume = data.volume/100;

                            _debug.run({
                                'volume is': _env.api.volume
                            });

                        }else{

                            options.volume = data.volume;
                            _env.api.volume(options.volume);

                            _debug.run({
                                'volume is': options.volume
                            });
                        }

                        _env.toolbar.find('.julia-volume>input').val(data.volume).rangeslider('update', true);

                        if(data.volume>0)
                        {
                            _control.press('sound-on');

                        }else{
                            _control.press('sound-off');
                        }

                    break; case 'sound-on':

                        if(_env.flashApi === false)
                        {
                            _env.api.muted = false;

                        }else{

                            _env.api.volume(options.volume);
                            _env.toolbar.find('.julia-volume>input').val(options.volume).rangeslider('update', true);
                        }

                        options.muted = false;
                        _persist.set('volume', options.volume, 30);
                        _persist.set('muted', options.muted, 30);

                        _env.toolbar.find('.julia-sound.off').removeClass('off').addClass('on')
                        .find('i').removeClass('ion-android-volume-off').addClass('ion-android-volume-up');

                    break; case 'sound-off':

                        if(_env.flashApi === false)
                        {
                            _env.api.muted = true;

                        }else{

                            _env.api.volume(0);
                            _env.toolbar.find('.julia-volume>input').val(0).rangeslider('update', true);
                        }

                        options.muted = true;
                        _persist.set('volume', options.volume, 30);
                        _persist.set('muted', options.muted, 30);

                        _env.toolbar.find('.julia-sound.on').removeClass('on').addClass('off')
                        .find('i').removeClass('ion-android-volume-up').addClass('ion-android-volume-off');

                    break; case 'fullscreen-on':
                        _fullscreen.on();

                    break; case 'fullscreen-off':
                        _fullscreen.off();

                    break; case 'destroy':

                        setTiemout( function(){
                            _env.player.remove();
                        }, 100);

                    break; default:

                }

                return;
            }
        };


        // Bindings
        var _bind = {

            // First play with some handlers
            playAllowStart: function(e)
            {
                _env.shield.find('.julia-preloader').removeClass('on');
                _env.shield.find('.julia-big-play').show();
                _env.toolbar.show();

                // Init actions
                _control.press('setDuration', {
                    'duration': _timeline.toHuman( _env.duration )
                });

                // Set mute if needed
                if(options.muted === true)
                {
                    _control.press('sound-off');
                }else{
                    _control.press('sound-on');

                    // Set initial volume
                    _control.press('volume', {
                        'volume': options.volume
                    });
                }

                // Autostart playback, if possible
                if(options.autoplay === true && _support.isMobile() === false)
                {
                    _control.press('play');
                }

                _debug.run({
                    'eventType': e.type,
                    'duration': _env.api.duration,
                    'readyState': _env.api.readyState
                });
            },

            // Bind can play by ready state / fake readyState
            // Because of Firefox cannot bind canplaythrough event with HLS.js properly
            canplaythrough: function()
            {
                if(_env.started === false)
                {
                    // don't let mobile Firefox make decision about readyState, mobile Firefox lie!
                    if(_env.api.readyState>=3 || (_support.isMobile() === true && _env.api.readyState>=2) )
                    {
                        _bind.playAllowStart({
                            type: '_bind.canplaythrough'
                        });
                    }else{
                        setTimeout( function()
                        {
                            _bind.canplaythrough();
                        }, 250);
                    }
                }
            },


            // Bind user action & DOM events
            domEvents: function()
            {
                // Buttons
                _env.toolbar.on('contextmenu', function(e)
                {
                    e.preventDefault();
                })
                .on('click', '.julia-playback.play', function(e)
                {
                    e.preventDefault();
                    _control.press('play');
                })
                .on('click', '.julia-playback.pause', function(e)
                {
                    e.preventDefault();
                    _control.press('pause');
                })
                .on('click', '.julia-sound.on', function(e)
                {
                    e.preventDefault();
                    _control.press('sound-off');
                })
                .on('click', '.julia-sound.off', function(e)
                {
                    e.preventDefault();
                    _control.press('sound-on');
                })
                .on('click', '.julia-fullscreen-toggle.on', function(e)
                {
                    e.preventDefault();
                    _control.press('fullscreen-on');
                })
                .on('click', '.julia-fullscreen-toggle.off', function(e)
                {
                    e.preventDefault();
                    _control.press('fullscreen-off');
                });

                // Big play
                _env.shield.on('click contextmenu', '.julia-big-play', function(e)
                {
                    e.preventDefault();
                    e.stopPropagation();
                    if(e.type == 'click')
                    {
                        _control.press('play');
                    }
                });

                // Area click
                _env.shield.on('click', function(e)
                {
                    e.preventDefault();
                    e.stopPropagation();
                    if(options.pauseOnClick === true && _support.isMobile() === false)
                    {
                        _control.press('pause');
                    }
                });

                // Fullscreen toolbar behavior bindings
                var mouseMoveCleaner;

                _env.player.on('mousemove', '#julia-shield-'+_env.apiId+', #julia-suggest-'+_env.apiId, function(e)
                {
                    e.preventDefault();
                    _env.toolbar.addClass('julia-toolbar-visible');
                    clearTimeout(mouseMoveCleaner);

                    mouseMoveCleaner = setTimeout(function()
                    {
                        _env.toolbar.removeClass('julia-toolbar-visible');
                    }, 1750);
                })
                .on('mouseover mousemove mouseout', '#julia-toolbar-'+_env.apiId+'.julia-toolbar-visible', function(e)
                {
                    e.preventDefault();
                    _env.toolbar.addClass('julia-toolbar-visible');
                    clearTimeout(mouseMoveCleaner);

                    if(e.type == 'mouseout')
                    {
                        mouseMoveCleaner = setTimeout(function(e)
                        {
                            _env.toolbar.removeClass('julia-toolbar-visible');
                        }, 1750);
                    }
                });

                // Bind progressbar change
                _env.toolbar.on('change input', '.julia-progress>input', function(e)
                {
                    if(e.type == 'input')
                    {
                        _env.seeking = true;
                    }else{

                        seekTo = _timeline.toSeconds( $(this).val() );
                        seekTo = seekTo >= _env.duration ? _env.duration: seekTo.toFixed(2);

                        _control.press('goto', {
                            currentTime: seekTo
                        });

                        _env.seeking = false;
                    }
                });

                // Bind volumebar change
                _env.toolbar.on('change', '.julia-volume>input', function()
                {
                    _control.press('volume', {
                        volume: $(this).val(),
                        'event': 'slideChange'
                    });
                });

                // Fullscreen event included
                $(window).on('resize', function()
                {
                    _support.resize();
                });

                // Fullscreen change event handler
                $(document).on('webkitfullscreenchange mozfullscreenchange fullscreenchange MSFullscreenChange', function(e)
                {
                    if(!document.fullscreenElement && !document.mozFullScreenElement && !document.webkitFullscreenElement && !document.msFullscreenElement)
                    {
                        $('.julia-player').removeClass('julia-fullscreen-on').addClass('julia-fullscreen-off')
                        .find('button.julia-fullscreen-toggle').removeClass('off').addClass('on')
                        .find('i').removeClass('ion-android-contract').addClass('ion-android-expand');

                        // Turn off landscape on mobile
                        if(_support.isMobile())
                        {
                            screen.orientation.unlock();
                            screen.msLockOrientation.unlock();
                            screen.mozLockOrientation.unlock();
                        }

                        _debug.run({
                            'fullscreen off' : '#julia-player-'+_env.apiId
                        });

                        _support.resize();

                    }else{

                        $('.julia-player').removeClass('julia-fullscreen-off').addClass('julia-fullscreen-on')
                        .find('button.julia-fullscreen-toggle').removeClass('on').addClass('off')
                        .find('i').removeClass('ion-android-expand').addClass('ion-android-contract');

                        // Force landscape in fullscreen mode on mobile
                        if(_support.isMobile())
                        {
                            screen.orientation.lock('landscape-primary');
                            screen.msLockOrientation.lock('landscape-primary');
                            screen.mozLockOrientation.lock('landscape-primary');
                        }

                        _debug.run({
                            'fullscreen on' : '#julia-player-'+_env.apiId
                        });
                    }
                });
            },


            // Native video api
            nativeEvents: function()
            {
                if(_support.forceReady()===true && _env.isHls === true)
                {
                    _bind.canplaythrough();
                }else{
                    _env.api.oncanplaythrough = function(e)
                    {
                        _env.duration = _env.api.duration;

                        if(_env.started === false && _env.api.readyState >= 3)
                        {
                            _bind.playAllowStart(e);
                        }
                    }
                }

                // Video playback detect
                _env.api.onplay = function(e)
                {
                    _env.toolbar.find('.julia-playback.play').removeClass('play').addClass('pause')
                    .find('i').removeClass('ion-play').addClass('ion-pause');
                    _env.shield.find('.julia-big-play').hide();
                    _env.shield.find('.julia-preloader').removeClass('on');
                    _ui.posterUnset();
                    _env.toolbar.show();
                }

                _env.api.onplaying = function(e)
                {
                    _env.toolbar.find('.julia-playback.play').removeClass('play').addClass('pause')
                    .find('i').removeClass('ion-play').addClass('ion-pause');
                    _env.shield.find('.julia-big-play').hide();
                    _env.shield.find('.julia-preloader').removeClass('on');
                    _env.suggest.html('').removeClass('on');
                    _env.toolbar.show();
                    _control.press('setDuration', {
                        'duration': _timeline.toHuman( _env.duration )
                    });
                    _env.started = true;
                }


                // Video pause
                _env.api.onpause = function(e)
                {
                    _env.toolbar.find('.julia-playback.pause').removeClass('pause').addClass('play')
                    .find('i').removeClass('ion-pause').addClass('ion-play');
                    _env.shield.find('.julia-big-play').show();
                }


                // Errors
                _env.api.onerror = function(e)
                {
                    // Bring to life again
                    if(_env.tries<11)
                    {
                        _boot.init();
                    }
                }

                _env.api.onemptied = function(e)
                {
                }

                _env.api.onstalled = function(e)
                {
                }

                _env.api.onsuspend = function(e)
                {
                }

                // Video position
                _env.api.ontimeupdate = function(e)
                {
                    if(_env.seeking === false)
                    {
                        currentTimeReadable = _timeline.toHuman( _env.api.currentTime.toFixed(2) );
                        _env.toolbar.find('.julia-progress>input').val( _timeline.toPercents( _env.api.currentTime.toFixed(2) ) ).rangeslider('update', true);
                        _env.toolbar.find('.julia-panel.julia-currentTime>span').text(currentTimeReadable);
                    }

                    _bind.onTime(currentTimeReadable, _env.api.currentTime);

                    if(options.debugPlayback === true)
                    {
                        _debug.run({
                            'duration/current': _env.duration+'/'+_env.api.currentTime.toFixed(2)+' > '+currentTimeReadable
                        });
                    }

                    // Fix for corrupted video end
                    // For development purposes only
                    /*
                    if(api.currentTime>=(duration-1))
                    {
                        if(_support.forceReady()===true)
                        {
                            _suggest.run();
                        }
                    }
                    */
                }

                // Video position
                _env.api.seeked = function(e)
                {
                    _env.seeking = false;
                }

                // Video position
                _env.api.seeking = function(e)
                {
                    _env.seeking = true;
                }

                // Volume
                _env.api.onvolumechange = function(e)
                {
                    if(_env.api.muted === false)
                    {
                        _env.toolbar.find('.julia-volume>input').val(_env.api.volume*100).rangeslider('update', true);
                    }else{
                        _env.toolbar.find('.julia-volume>input').val(0).rangeslider('update', true);
                    }
                }

                // Set video duration
                _env.api.ondurationchange = function(e)
                {
                    _env.duration = _env.api.duration;

                    if(_env.started === false)
                    {
                        _env.duration = _env.api.duration;
                        _env.seeking = false;

                        _debug.run({
                            'duration': _env.duration,
                            'readyState': _env.api.readyState,
                            'started': _env.started
                        });
                    }
                }

                // Bind playback end event
                _env.api.onended = function(e)
                {
                    _suggest.run();
                };
            },


            // Specific events, error handlers
            hlsLibEvents: function()
            {
                _env.hls.on(Hls.Events.ERROR, function(event, data)
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

                            _debug.run({
                                recoveringError: data.details,
                                errorType: data.type,
                                errorFatal: data.fatal
                            });

                            if(data.fatal === true && _env.tries<11)
                            {
                                // Bring to life again
                                _boot.init();
                            }

                        break; default:
                    }
                });
            },


            // Flash fallback for legacy browsers
            flashEvents: function()
            {
                // Flash event object
                var flashlsEvents = {

                    ready: function(flashTime)
                    {
                        _env.api.load(_env.source);

                        _debug.run({
                            'ready': flashTime
                        });
                    },

                    videoSize: function(width, height) {
                        _support.resize();
                    },

                    complete: function()
                    {
                        _debug.run({
                            'suggest': 'call',
                            'flashPlayback': 'completed'
                        });

                        setTimeout( function()
                        {
                            _suggest.run();
                        }, 1500);
                    },

                    error: function(code, url, message)
                    {
                        _debug.run({
                            'flashErrorCode': code,
                            'flashErrorUrl': url,
                            'flashErrorMessage': message,
                        });

                        // Bring to life again
                        if(_env.tries<10)
                        {
                            _boot.init();
                        }
                    },

                    manifest: function(flashDuration, levels_, loadmetrics)
                    {
                        _env.duration = flashDuration.toFixed(2);
                        levels = levels_;
                        _debug.run({
                            'durationOrigin': flashDuration,
                            'duration': _env.duration,
                            'durationHuman': _timeline.toHuman( _env.duration ),
                            'levels': levels,
                            'metrics': loadmetrics,
                        });

                        if(_env.started === false)
                        {
                            _env.shield.find('.julia-preloader').removeClass('on');
                            _env.shield.find('.julia-big-play').show();
                            _env.toolbar.show();

                            // Init actions
                            _control.press('setDuration', {
                                'duration': _timeline.toHuman( _env.duration )
                            });

                            // Set initial volume
                            if(options.muted === false)
                            {
                                _control.press('volume', {
                                    'volume': options.volume
                                });
                            }
                            // Set mute if needed
                            if(options.muted === true)
                            {
                                _control.press('sound-off');
                            }

                            // Autostart playback, if possible
                            if(options.autoplay === true)
                            {
                                _env.api.play(-1);
                            }

                            _debug.run({
                                'duration': _env.api.duration,
                                'readyState': true
                            });
                        }
                    },

                    levelLoaded: function(loadmetrics)
                    {
                    },

                    fragmentLoaded: function(loadmetrics)
                    {
                    },

                    fragmentPlaying: function(playmetrics)
                    {
                        _env.toolbar.find('.julia-playback.play').removeClass('play').addClass('pause')
                        .find('i').removeClass('ion-play').addClass('ion-pause');
                        _env.shield.find('.julia-big-play').hide();
                        _env.shield.find('.julia-preloader').removeClass('on');
                        _ui.posterUnset();
                        _env.suggest.html('').removeClass('on');
                        _env.toolbar.show();
                        _env.started = true;
                    },

                    position: function(timemetrics)
                    {
                        if(_env.seeking === false)
                        {
                            currentTimeReadable = _timeline.toHuman( _env.api.getPosition() );
                            _env.toolbar.find('.julia-progress>input').val( _timeline.toPercents( _env.api.getPosition() ) ).rangeslider('update', true);
                            _env.toolbar.find('.julia-panel.julia-currentTime>span').text(currentTimeReadable);
                        }
                    }
                };

                // Create a single global callback function and pass it's name
                // to the SWF with the name `callback` in the FlashVars parameter.
                window[_env.flashCallbackName] = function(eventName, args)
                {
                    flashlsEvents[eventName].apply(null, args);
                };
            },

            // Time update event callbacks
            onTime: function(time, timeNum)
            {
                if( (time in options.onTime) && _env.onTimeRised.indexOf(time) == -1 )
                {
                    handle = options.onTime[time];
                    _env.onTimeRised.push(time);

                    if(typeof window[handle] === 'function')
                    {
                        window[handle](time, _env.publicApi);
                        _debug.run({
                            'onTime': handle+' raised'
                        });

                    }else{

                        _debug.run({
                            'onTimeError': handle+' is not a function, but: '+(typeof handle)
                        });
                    }
                }
            }
        };


        // Create player
        var _boot = {

            create: function()
            {
                // Extend default options with external options
                _system.extend();

                // Degbug header
                if(options.debug === true && window.console )
                {
                    console.info('=== Julia console debug start for '+_env.apiId+' ===');
                }

                _debug.run(options);

                // Suggest init
                for(i in options.suggest)
                {
                    options.suggest[i].played = false;
                }

                // Set theme CSS
                _support.theme();

                // User data
                volume = _persist.get('volume');
                muted = _persist.get('muted');

                if(volume.length>0)
                {
                    options.volume = parseInt(volume);
                }

                if(muted.length>0)
                {
                    options.muted = muted == 'false' ?  false: true;
                }

                // Create UI
                _ui.player();
            },

            // Select playback url
            selectSource: function()
            {
                _env.element.prop('preload', 'none');
                protoSource = _env.element.prop('src') ? _env.element.prop('src'): _env.element.find('source').prop('src');
                _env.source = options.source && options.source.length>0 ? options.source: protoSource;

                _env.isHls = _env.source.indexOf('m3u8') == -1 ? false: true;
                if(options.forceHls === true)
                {
                    //_env.source += _env.source.indexOf('?') == -1 ? '?m3u8=yes': '&m3u8=yes';
                    _env.isHls = true;
                }

                _debug.run({
                    'sourceType': (_env.isHls === false ? 'file': 'hls')
                });

                _env.poster = options.poster && options.poster.length>0 ? options.poster: _env.element.prop('poster');
                _ui.posterSet();
            },


            // load media
            load: function()
            {
                _env.shield.find('.julia-preloader').addClass('on');

                // ************************
                // HLS library supported
                // and HLS requested
                // ************************
                if(_env.useHlsLib === true)
                {
                    _bind.hlsLibEvents();
                    _env.hls.loadSource(_env.source);
                    _env.hls.attachMedia(_env.api);

                    // DETECT LEVEL DATA
                    _env.hls.on(Hls.Events.LEVEL_LOADED,function(event, data)
                    {
                        // SET LIVE EVENT STATE
                        if(data.details.live === true || options.live === true)
                        {
                            _env.isLive = true;
                            _env.toolbar.addClass('live');
                        }else{
                            _env.toolbar.removeClass('live');
                        }
                    });

                    for(x in options.triggerHls)
                    {
                        handle = options.triggerHls[x];

                        if(typeof window[handle] === 'function')
                        {
                            _env.hls.on(Hls.Events[x], function(event, data)
                            {
                                window[handle](_env.apiId, event, data);
                            });

                        }else{

                            _debug.run({
                                'triggerHlsError': handle+' is not a function'
                            });
                        }
                    }

                // ************************
                // No HLS library support,
                // but HLS is requested
                // ************************
                }else if(_env.flashApi === true)
                {
                    _api.create();

                // ************************
                // Classic VOD file
                // ************************
                }else{

                    _env.api.load();
                }

                // ************************
                // Bind all events
                // ************************
                if(_env.apiOk === true)
                {
                    _bind.domEvents();

                    if(_env.flashApi === false)
                    {
                        // Classic html5 api
                        _bind.nativeEvents();
                    }else{
                        // Flash api
                        _bind.flashEvents();
                    }
                }

                stats = {
                    'isHls': _env.isHls,
                    'flashApi': _env.flashApi,
                    'useHlsLib': _env.useHlsLib,
                    'live': _env.isLive,
                    'canPlayMediaString': _env.canPlayMediaString,
                    'canPlayMedia': _env.canPlayMedia,
                };

                _debug.run(stats);

                // Define publicApi
                _env.publicApi = {
                    control: _control,
                    options: options,
                    support: _support,
                    dimensions: _env.dimensions,
                    timeline: _timeline,
                    shield: _env.shield,
                    toolbar: _env.toolbar,
                    media: _env.api,
                    id: _env.apiId,
                    stats: stats
                };

            },

            // Initilize player
            init: function()
            {
                // Create source
                _boot.selectSource();
                _env.useHlsLib = false;
                _env.flashApi = false;
                _env.isLive = false;
                _env.canPlayMedia = _support.canPlayMedia();
                _env.tries+=1;

                if(_env.isHls === true)
                {
                    _env.useHlsLib = _env.canPlayMedia === false && Hls.isSupported() ? true: false;
                }

                // ************************
                // HLS library supported
                // and HLS requested
                // ************************
                if(_env.useHlsLib === true)
                {
                    _api.create();
                    _env.hls = new Hls(options.hlsConfig);

                // ************************
                // No HLS library support,
                // but HLS is requested
                // ************************
                }else if(_env.isHls === true && _env.useHlsLib === false && _env.canPlayMedia === false)
                {
                    _env.flashApi = true;

                // ************************
                // Classic VOD file
                // ************************
                }else{

                    _api.create();
                    _env.api.src = _env.source;
                }

                if(options.live === true)
                {
                    _env.isLive = true;
                    _env.toolbar.addClass('live');
                }else{
                    _env.toolbar.removeClass('live');
                }
            }
        }

        // Build player object
        _boot.create();

        // Bring to life
        _boot.init();

        // Bring to life
        _boot.load();

        // Player dimensions
        _support.resize();

        // Populate public API
        return _env.publicApi;
    }

    // Build plugin instances
    $.fn.julia = function(opts)
    {
        var resize = [];
        return this.each(function()
        {
            var element = $(this);

            // Return if this element already has a plugin instance
            if ($(this).data('julia')) return;

            // Pass options to constructor
            var __julia = new _julia($(this), opts);

            // Store plugin object in element's data
            $(this).data('julia', __julia);
        });
    };

    // API wrappers
    $.fn.play = function()
    {
        $(this).data('julia').control.press('play');
    };

    $.fn.destroy = function()
    {
        $(this).data('julia').control.press('destroy');
    };

    $.fn.media = function()
    {
        return $(this).data('julia').media;
    };

    $.fn.pause = function()
    {
        $(this).data('julia').control.press('pause');
    };

    $.fn.stop = function()
    {
        $(this).data('julia').control.press('stop');
    };

    $.fn.goto = function(t)
    {
        $(this).data('julia').control.press('goto', {
            currentTime: t
        });
    };

    $.fn.mute = function()
    {
        if($(this).data('julia').media.muted === false)
        {
            $(this).data('julia').control.press('sound-off');
        }else{
            $(this).data('julia').control.press('sound-on');
        }
    };

    $.fn.volume = function(volume)
    {
        $(this).data('julia').control.press('volume', {
            volume: volume
        });
    };

    $.fn.getID = function()
    {
        return $(this).data('julia').id;
    };

    $.fn.stats = function()
    {
        return $(this).data('julia').stats;
    };

})(jQuery);
