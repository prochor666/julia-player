Julia player
=============

![julia-player](https://raw.githubusercontent.com/prochor666/julia-player/master/src/img/brand/julia-logo-128x128.png)

Responsive, mobile first, HTML5 player with HTTP Live Streaming (HLS) and Dynamic Adaptive Streaming over HTTP (MPEG-DASH) support.

How to establish devel environment.

- Install Node.js. See [Node.js](https://nodejs.org/en/) for more.
- Install Gulp.js. See [Gulp.js](http://gulpjs.com/) for more.
- Install dependecies from gulpfile.js
    - SASS package [gulp-sass](https://www.npmjs.com/package/gulp-sass)
    - CSS minify package [gulp-clean-css](https://www.npmjs.com/package/gulp-clean-css)
    - JavaScript minify package [gulp-minify](https://www.npmjs.com/package/gulp-minify)
    - Concat package [gulp-concat](https://www.npmjs.com/package/gulp-concat)
    - _optional_, _not-implemented_ Sourcemaps package [gulp-sourcemaps](https://www.npmjs.com/package/gulp-sourcemaps)

How to start.

Run:

```bash
user@host:/your/devel/directory/julia# gulp watch
```

Now you can start typing in scss and js files. All needle files are generated on the fly.

See the _gulp watch_ command console output for more info (error crashes, operation log, etc...).

> Note that dist/css/ css files are generated automaticaly from src/scss, so do not edit.
