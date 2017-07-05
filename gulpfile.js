var gulp = require('gulp'),
  gp_concat = require('gulp-concat');

gulp.task('concat', function(){
  return gulp.src([    './dist/inline.bundle.js',
    './dist/polyfills.bundle.js',
    './dist/scripts.bundle.js',
    './dist/styles.bundle.js',
    './dist/vendor.bundle.js',
    './dist/main.bundle.js'])
    .pipe(gp_concat('compressedBuild.js'))
    .pipe(gulp.dest('./dist'));
});

gulp.task('default', ['concat'], function(){});

/*
PROD order of files:

gulp.task('concat', function(){
  return gulp.src(['./dist/inline.bundle.js',
    './dist/styles.bundle.css',
    './dist/scripts.bundle.js',
    './dist/vendor.bundle.js',
    './dist/main.bundle.js'])
    .pipe(gp_concat('compressedBuild.js'))
    .pipe(gulp.dest('./dist'));
});*/
