'use strict';

const gulp = require('gulp'),
      gutil = require('gulp-util'),
      del = require('del'),
      image = require('gulp-image'),
      browserSync = require('browser-sync'),

      babel = require('gulp-babel'),
      babelify = require("babelify"),
      browserify = require("browserify"),
      buffer = require('vinyl-buffer'),
      source = require('vinyl-source-stream'),
      uglify = require('gulp-uglifyjs'),

      postcss = require('gulp-postcss'),
      autoprefixer = require('autoprefixer'),
      cssimport = require('postcss-import'),
      cssnested = require('postcss-nested'),
      cssvariables = require('postcss-css-variables'),
      custommedia = require('postcss-custom-media'),
      cssnot = require('postcss-selector-not'),
      rename = require('gulp-rename'),
      fontpath = require('postcss-fontpath'),
      cssclean = require('postcss-clean'),
      sourcemaps = require('gulp-sourcemaps');

/* HTML
   -------------------------------------------------------------------------- */
gulp.task('html', () => 
    gulp.src('app/*.html')
        .pipe(gulp.dest('build/'))
        .pipe(browserSync.stream())
);

/* CSS
   -------------------------------------------------------------------------- */
gulp.task('css', function() {
    var plugins = [
        cssimport,
        cssnested,
        cssvariables,
        custommedia,
        cssnot,
        autoprefixer({ browsers: ['> 1%', 'IE 9'], cascade: false }),
        fontpath
    ];
    return gulp.src('app/css/app.css')
    .pipe(sourcemaps.init())
    .pipe(postcss(plugins))
    .pipe(sourcemaps.write())
    .on('error', gutil.log)
    .pipe(rename('main.css'))
    .pipe(gulp.dest('build/css/'))
    .pipe(browserSync.stream())
});

gulp.task('cssmin', function() {
    var plugins = [
        cssimport,
        cssnested,
        cssvariables,
        custommedia,
        cssnot,
        autoprefixer({ browsers: ['> 1%', 'IE 9'], cascade: false }),
        fontpath,
        cssclean
    ];
    return gulp.src('app/css/app.css')
        .pipe(postcss(plugins))
        .on('error', gutil.log)
        .pipe(rename('main.css'))
        .pipe(gulp.dest('build/css/'))
});

/* JS
   -------------------------------------------------------------------------- */
gulp.task('transpile-js', () => {
    browserify('./app/js/app.js')
        .transform('babelify', {
            presets: ['es2015']
        })
        .bundle()
        .pipe(source('main.js'))
        .pipe(buffer())
        .pipe(gulp.dest('./build/js/'))
        .pipe(browserSync.stream());
});

gulp.task('jsmin', () => {
    browserify('./app/js/app.js')
        .transform('babelify', {
            presets: ['es2015']
        })
        .bundle()
        .pipe(source('main.js'))
        .pipe(buffer())
        .pipe(uglify())
        .pipe(gulp.dest('./build/js/'))
        .pipe(browserSync.stream());
});

/* Fonts
   -------------------------------------------------------------------------- */
gulp.task('font', function() {
    return gulp.src('./app/font/**/*.{ttf,woff,woff2,eof,svg}')
        .pipe(gulp.dest('./build/font/'));
});

/* Images
   -------------------------------------------------------------------------- */
gulp.task('image', function() {
    return gulp.src('./app/image/**/*.{jpg,png,gif,svg,webp,ico}')
        .pipe(gulp.dest('./build/image/'));
});

gulp.task('imagemin', function () {
    gulp.src('./app/image/**/*.{jpg,png,gif,svg,webp,ico}')
        .pipe(image())
        .pipe(gulp.dest('./build/image/'));
});

/* Clean
   -------------------------------------------------------------------------- */
gulp.task('clean', function() {
    del('./build');
});

/* Static server
   -------------------------------------------------------------------------- */
gulp.task('browser-sync', () => { 
    browserSync.init({
        server: {
          baseDir: "./build"
        },
        notify: false,
        open: false
        // proxy: "vhost_name"
        // If proxy, delete server
    });

    gulp.watch('./app/*.html', ['html']);
    gulp.watch('./app/css/**/*.css', ['css']);
    gulp.watch('./app/js/**/*.js', ['transpile-js']);
    gulp.watch('./app/image/**/*', ['image']);
    gulp.watch('./app/font/**/*', ['font']);
});

/* Development
   -------------------------------------------------------------------------- */
gulp.task('default', [
    'html',
    'css',
    'transpile-js',
    'image',
    'font',
    'browser-sync'
]);

/* Production
   -------------------------------------------------------------------------- */
gulp.task('prod', [
    'clean',
    'html',
    'cssmin',
    'imagemin',
    'font',
    'jsmin'
]);