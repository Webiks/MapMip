var gulp = require('gulp'),
    gp_concat = require('gulp-concat'),
    uglify = require('gulp-uglify'),
    pump = require('pump'),
    Builder = require('systemjs-builder'),
    tsc = require('gulp-typescript'),
    inlineNg2Template = require('gulp-inline-ng2-template');


gulp.task('concat', function(){
  return gulp.src(['./dist/inline.bundle.js',
    './dist/polyfills.bundle.js',
    './dist/scripts.bundle.js',
    './dist/styles.bundle.js',
    './dist/vendor.bundle.js',
    './dist/main.bundle.js'])
    .pipe(gp_concat('compressed.js'))
  .pipe(gulp.dest('./dist'));
});

gulp.task('compress', function (cb) {
  pump([
      gulp.src('./dist/compressed.js'),
      uglify(),
      gulp.dest('./dist')
    ],
    cb
  );
});

gulp.task('default', ['concat','compress'], function(){});

gulp.task('inline-templates', function () {
  return gulp.src('./src/app/**/*.ts')
    .pipe(inlineNg2Template({ useRelativePaths: true, indent: 0, removeLineBreaks: true}))
    .pipe(tsc({
      "target": "ES5",
      "module": "system",
      "moduleResolution": "node",
      "sourceMap": true,
      "emitDecoratorMetadata": true,
      "experimentalDecorators": true,
      "removeComments": true,
      "noImplicitAny": false
    }))
    .pipe(gulp.dest('dist/app'));
});

gulp.task('bundle-app', ['inline-templates'], function() {
  // optional constructor options
  // sets the baseURL and loads the configuration file
  var builder = new Builder('', 'dist-systemjs.config.js');

  return builder
    .bundle('dist/app/**/* - [@angular/**/*.js] - [rxjs/**/*.js]', 'bundles/app.bundle.js', { minify: true})
    .then(function() {
      console.log('Build complete');
    })
    .catch(function(err) {
      console.log('Build error');
      console.log(err);
    });
});

gulp.task('bundle-dependencies', ['inline-templates'], function() {
  // optional constructor options
  // sets the baseURL and loads the configuration file
  var builder = new Builder('', 'dist-systemjs.config.js');

  return builder
    .bundle('dist/app/**/*.js - [dist/app/**/*.js]', 'bundles/dependencies.bundle.js', { minify: true})
    .then(function() {
      console.log('Build complete');
    })
    .catch(function(err) {
      console.log('Build error');
      console.log(err);
    });
});


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
