'use strict';

/*
Nebula hub app builder
@TODO * source maps
*/

// Gulp && plugins
var gulp = require('gulp');
var cleanCSS = require('gulp-clean-css');
var sass = require('gulp-sass');
var concat = require('gulp-concat');
var minify = require('gulp-minify');
var sourcemaps = require('gulp-sourcemaps');

// Sources
var appSrc = [
    'src/js/lib/hls.js',
    'src/js/lib/rangeslider.js',
    'src/js/julia-pre.js',
    'src/js/julia-core.js',
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
        //.pipe(sourcemaps.init())
        //.pipe(cleanCSS())
        //.pipe(sourcemaps.write())
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
