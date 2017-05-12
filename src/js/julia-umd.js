/* *****************************************
* JuliaPlayer - HTML5 player
*
* @author prochor666@gmail.com
* @version: 1.1.1
* @build: 2017-5-12
* @license: MIT
*s
* @require: jquery
**
* UMD loader
* Uses CommonJS, AMD or browser globals
* to export a jQuery plugin & extension.
****************************************** */
(function (root, factory)
{
    if (typeof define === 'function' && define.amd)
    {
        // AMD. Register as an anonymous module.
        define(['exports', 'jquery'], function (exports, jQuery)
        {
            factory((root.commonJsStrictGlobal = exports), jQuery);
        });

    } else if (typeof exports === 'object' && typeof exports.nodeName !== 'string')
    {
        // CommonJS
        factory(exports, require('jquery'));

    } else {
        // Browser globals
        factory((root.commonJsStrictGlobal = {}), root.jQuery);
    }

}(this, function (exports, $)
{

//--JULIA-PLAYER-SOURCE--

}));
