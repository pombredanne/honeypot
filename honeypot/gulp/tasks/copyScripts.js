'use strict';

var gulp   = require('gulp');
var config = require('../config');

gulp.task('copyScripts', function() {

  gulp.src(config.sourceDir + 'scripts/components/*').pipe(gulp.dest(config.buildDir + '/scripts/components/'));

});
