'use strict';

var gulp         = require('gulp');
var compass      = require('gulp-compass');
var gulpif       = require('gulp-if');
var browserSync  = require('browser-sync');
var autoprefixer = require('gulp-autoprefixer');
var handleErrors = require('../util/handle-errors');
var config       = require('../config');

gulp.task('sass', function () {
  return gulp.src(config.styles.src)
  .pipe(compass({
    // Gulp-compass options and paths
    css: 'dev/styles/',
    sass: 'dev/styles/',
    require: ['susy']
  }))
  .on('error', handleErrors)
  .pipe(gulp.dest(config.styles.dest))
  .pipe(gulpif(browserSync.active, browserSync.reload({ stream: true })));
});
