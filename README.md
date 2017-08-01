Warp media center
=================
Responsive, mobile ready media player

How to establish devel environment.

- Install Node.js. See [Node.js](https://nodejs.org/en/) for more.
- Install Gulp.js. See [Gulp.js](http://gulpjs.com/) for more.
- Install dependecies from gulpfile.js
    - SASS package [gulp-sass](https://www.npmjs.com/package/gulp-sass)
    - CSS minify package [gulp-clean-css](https://www.npmjs.com/package/gulp-clean-css)
    - JavaScript minify package [gulp-minify](https://www.npmjs.com/package/gulp-minify)
    - Concat package [gulp-concat](https://www.npmjs.com/package/gulp-concat)
    - Replace package [gulp-replace](https://www.npmjs.com/package/gulp-replace)
    - Del package [del](https://www.npmjs.com/package/del)
    - Fs package [fs](https://www.npmjs.com/package/fs)

How to start.

Run:

```bash
user@host:/your/devel/directory/warp-media-center# gulp watch
```

Now you can start typing in scss and js files. All needle files are generated on the fly.

See the _gulp watch_ command console output for more info (error crashes, operation log, etc...).

> Note that dist/css/ css files are generated automaticaly from src/scss, so do not edit.
