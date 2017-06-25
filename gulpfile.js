'use strict';

/*
Julia player app builder
*/

// Gulp && plugins
var gulp = require('gulp');
var sass = require('gulp-sass');
var cleanCSS = require('gulp-clean-css');
var concat = require('gulp-concat');
var minify = require('gulp-minify');
var replace = require('gulp-replace');
var del = require('del');
var fs = require('fs');

// Sources
var appSrc = [
    'src/js/julia-base.js',
    'src/js/julia-api.js',
    'src/js/julia-ui.js',
    'src/js/julia-slider.js',
    'src/js/julia-events.js',
    'src/js/julia-controls.js',
    'src/js/julia-support.js',
    'src/js/julia-suggest.js',
    'src/js/julia-fullscreen.js',
    'src/js/julia-persist.js',
    'src/js/julia-timecode.js',
    'src/js/julia-callback.js',
    'src/js/julia-inject.js',
    'src/js/julia-require.js',
    'src/js/julia-boot.js',
    'src/js/julia-loader.js',
    'src/js/julia-jquery-plugin.js',
];

var appUMD = [
    'src/js/julia-umd.js',
];


// App styles
gulp.task('sass', function()
{
    return gulp.src('src/scss/julia-player.scss')
        .pipe(sass.sync().on('error', sass.logError))
        .pipe(gulp.dest('dist/css'))
        .pipe(cleanCSS())
        .pipe(concat('julia-player.min.css'))
        .pipe(gulp.dest('dist/css'));
});


// App scripts
gulp.task('jsbuild', function()
{
    return gulp.src(appSrc)
        .pipe(concat('julia-plugin-build.js'))
        .pipe(gulp.dest('plugin'));
});


gulp.task('finalbuild', function()
{
    var pluginContent = fs.readFileSync('plugin/julia-plugin-build.js', 'utf8');

    return gulp.src(appUMD)
        .pipe(replace('//--JULIA-PLAYER-SOURCE--', pluginContent))
        .pipe(concat('julia-player.js'))
        .pipe(minify({
            ext:{
                src:'.js',
                min:'.min.js'
            },
            compress: {
                properties: false
            }
        })).pipe(gulp.dest('dist/js'));
})


// Watch it, Gulp!
gulp.task('watch', function ()
{
    gulp.watch(['src/scss/*.scss', 'src/scss/themes/*.scss'], ['sass']);
    gulp.watch('src/js/*.js', ['jsbuild']);
    gulp.watch('plugin/julia-plugin-build.js', ['finalbuild']);
});
