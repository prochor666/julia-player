'use strict';

/*
Warp/Julia app builder
*/

// Gulp && plugins
const gulp = require('gulp');
const sass = require('gulp-sass');
const gfi = require('gulp-file-insert');
const cleanCSS = require('gulp-clean-css');
const concat = require('gulp-concat');
const minify = require('gulp-minify');
const replace = require('gulp-replace');
const del = require('del');
const fs = require('fs');
const log = require('fancy-log');
const chown = require('gulp-chown');

// Sources
var paths = {
    appSrc: [
        'src/js/julia-base.js',
        'src/js/julia-callback.js',
        'src/js/julia-controls.js',
        'src/js/julia-events.js',
        'src/js/julia-fullscreen.js',
        'src/js/julia-persist.js',
        'src/js/julia-slider.js',
        'src/js/julia-source.js',
        'src/js/julia-support.js',
        'src/js/julia-subtitles.js',
        'src/js/julia-switcher.js',
        'src/js/julia-timecode.js',
        'src/js/julia-thumbs.js',
        'src/js/julia-ui.js',
        'src/js/julia-jquery-plugin.js',
    ],
    scss: [
        'src/scss/*.scss'
    ],
    appUMD: [
        'src/js/julia-umd.js',
    ],
};

var stat = {};
fs.stat('src/js/julia-base.js', function(e, s) {
    stat.uid = s.uid;
    stat.gid = s.gid;
});

// App styles
function sassBuild() {
    del('julia-player.css');
    del('julia-player.min.css');

    return gulp.src('src/scss/julia-player.scss')
        .pipe(sass.sync().on('error', sass.logError))
        .pipe(gulp.dest('dist/css'))
        .pipe(cleanCSS({
            specialComments: 0
        }))
        .pipe(concat('julia-player.min.css'))
        .pipe(chown(stat.uid, stat.gid))
        .pipe(gulp.dest('dist/css'));
};

// App scripts
function jsBuild() {
    return gulp.src(paths.appSrc)
        .pipe(concat('julia-plugin-build.js'))
        .pipe(gulp.dest('plugin'))
        .pipe(gulp.src(paths.appUMD))
        .pipe(gfi({
            "//--JULIA-PLAYER-SOURCE--": "plugin/julia-plugin-build.js"
        }))
        .pipe(concat('julia-player.js'))
        .pipe(gulp.dest('dist/js'))
        .pipe(minify({
            ext:{
                src:'.js',
                min:'.min.js'
            },
            compress: {
                properties: false
            }
        }).on('error', log))
        .pipe(chown(stat.uid, stat.gid))
        .pipe(gulp.dest('dist/js'));
};

function watch() {
  gulp.watch(paths.scss, sassBuild);
  gulp.watch(paths.appSrc, jsBuild);
}

// Watch it, Gulp!
gulp.task('default', gulp.series(watch));