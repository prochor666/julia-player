'use strict';

/*
Warp/Julia app builder
*/

// Gulp && plugins
const gulp = require('gulp');
const sass = require('gulp-sass');
const cleanCSS = require('gulp-clean-css');
const concat = require('gulp-concat');
const minify = require('gulp-minify');
const replace = require('gulp-replace');
const del = require('del');
const fs = require('fs');
const log = require('fancy-log');
const gFilter = require('gulp-filter');
const chown = require('gulp-chown');

// Sources
const appSrc = [
    'src/js/julia-base.js',
    'src/js/julia-callback.js',
    'src/js/julia-controls.js',
    'src/js/julia-events.js',
    'src/js/julia-fullscreen.js',
    'src/js/julia-persist.js',
    'src/js/julia-slider.js',
    'src/js/julia-source.js',
    'src/js/julia-suggest.js',
    'src/js/julia-support.js',
    'src/js/julia-subtitles.js',
    'src/js/julia-switcher.js',
    'src/js/julia-timecode.js',
    'src/js/julia-thumbs.js',
    'src/js/julia-ui.js',
    'src/js/julia-jquery-plugin.js',
];

const appUMD = [
    'src/js/julia-umd.js',
];

var stat = {};
fs.stat('src/js/julia-base.js', function(e, s) {
    stat.uid = s.uid;
    stat.gid = s.gid;
});

// App styles
gulp.task('sass', function()
{
    setTimeout( function()
    {
        del('julia-player.css');
        del('julia-player.min.css');

        gulp.src('src/scss/julia-player.scss')
            .pipe(sass.sync().on('error', sass.logError))
            .pipe(gulp.dest('dist/css'))
            .pipe(cleanCSS({
                specialComments: 0
            }))
            .pipe(concat('julia-player.min.css'))
            .pipe(chown(stat.uid, stat.gid))
            .pipe(gulp.dest('dist/css'));
    }, 1000);
});

// App scripts
gulp.task('jsbuild', function()
{
    setTimeout( function()
    {
        gulp.src(appSrc)
            .pipe(concat('julia-plugin-build.js'))
            .pipe(gulp.dest('plugin'));
    }, 1000);
});


gulp.task('finalbuild', function()
{
    setTimeout( function()
    {
        var pluginContent = fs.readFileSync('plugin/julia-plugin-build.js', 'utf8');

        var stream = gulp.src(appUMD)
            .pipe(replace('//--JULIA-PLAYER-SOURCE--', pluginContent))
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

    }, 1000);
});


// Watch it, Gulp!
gulp.task('watch', function ()
{
    gulp.watch('src/scss/*.scss', ['sass']);
    gulp.watch('src/js/*.js', ['jsbuild']);
    gulp.watch('plugin/julia-plugin-build.js', ['finalbuild']);
});
