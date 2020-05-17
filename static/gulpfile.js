var gulp = require('gulp'),
    plumber = require('gulp-plumber'),
    sass = require('gulp-sass'),
    sassGlob = require('gulp-sass-glob'),
    sassMerge = require('gulp-merge-media-queries'),
    autoprefixer = require('gulp-autoprefixer'),
    cssmin = require('gulp-cssmin'),
    concat = require('gulp-concat'),
    uglify = require('gulp-uglify'),
    fileinclude = require('gulp-file-include');

var browserSync = require('browser-sync').create();

var sassSources = ['scss/**/*.scss'],
    jsSources = ['js/plugins/*.js'],
    htmlSources = ['../templates/**/*.html'];

// Sass
gulp.task('sass', function() {
    return gulp
        .src('./scss/main.scss')
        .pipe(sassGlob())
        .pipe(sass().on('error', sass.logError))
        .pipe(sassMerge())
        .pipe(autoprefixer({ browsers: ['last 2 versions'] }))
        .pipe(cssmin())
        .pipe(gulp.dest('./css'))
        .pipe(browserSync.stream());
});

gulp.task('scripts', function() {
  return gulp.src('./js/plugins/*.js')
    .pipe(concat('plugins.js'))
    .pipe(uglify())
    .pipe(gulp.dest('./js'));
});

// File Includes
gulp.task('fileinclude', function() {
    return gulp
        .src(['../templates/pages/*.html'])
        .pipe(plumber())
        .pipe( fileinclude({ prefix: '@@', basepath: '../templates/modules' }) )
        .pipe(gulp.dest('../'))
        .pipe(browserSync.stream());
});

// BrowserSync
gulp.task('browser-sync', function() {
    browserSync.init({
        server: '../'
    });
});

/* ------------------------------------------ Static Projects */

// Watch 
gulp.task('watch', function() {
    gulp.watch(sassSources, ['sass']);
    gulp.watch(jsSources, ['scripts']);
    gulp.watch(htmlSources, ['fileinclude']);
});

gulp.task('default', ['sass','scripts','fileinclude','browser-sync','watch']);