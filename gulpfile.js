'use strict';

/*
Julia player app builder
@TODO * source maps
*/

// Gulp && plugins
var gulp = require('gulp');
var cleanCSS = require('gulp-clean-css');
var sass = require('gulp-sass');
var concat = require('gulp-concat');
var minify = require('gulp-minify');

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
        .pipe(concat('julia-player.js'))
        .pipe(minify({
            ext:{
                src:'.js',
                min:'.min.js'
            },
            compress: {
                properties: false
            },
            exclude: ['tmp'],
            ignoreFiles: ['.combo.js', '.min.js']
        }))
        .pipe(gulp.dest('dist/js'));
});



// Watch it, Gulp!
gulp.task('watch', function ()
{
    gulp.watch('src/scss/*.scss', ['sass']);
    gulp.watch('src/js/*.js', ['jsbuild']);
});
