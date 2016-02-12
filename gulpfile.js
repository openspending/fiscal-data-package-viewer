'use strict';

var path = require('path');
var gulp = require('gulp');
var concat = require('gulp-concat');
var less = require('gulp-less');
var minifyCss = require('gulp-minify-css');
var prefixer = require('gulp-autoprefixer');
var uglify = require('gulp-uglify');
var sourcemaps = require('gulp-sourcemaps');
var browserify = require('browserify');
var source = require('vinyl-source-stream');
var buffer = require('vinyl-buffer');
var resolve = require('resolve');
var _ = require('underscore');

var frontSrcDir = path.join(__dirname, '/app/front');
var frontScriptsDir = path.join(frontSrcDir, '/scripts');
var frontStylesDir = path.join(frontSrcDir, '/styles');
var frontImagesDir = path.join(frontSrcDir, '/images');
var frontFontsDir = path.join(frontSrcDir, '/fonts');

var publicDir = path.join(__dirname, '/app/public');
var publicScriptsDir = path.join(publicDir, '/');
var publicStylesDir = path.join(publicDir, '/');
var publicFontsDir = path.join(publicDir, '/fonts');
var publicImagesDir = path.join(publicDir, '/images');
var publicIconsDir = path.join(publicDir, '/icons');

var nodeModulesDir = path.join(__dirname, '/node_modules');

var themeDir = path.join(nodeModulesDir, '/os-style-guide');

var modules = [
  'jquery',
  'underscore',
  'bluebird',
  'd3',
  'c3',
  'raphael',
  'redux/dist/redux.js',
  'ng-redux/dist/ng-redux.js'
];

gulp.task('default', [
  'app.scripts',
  'app.modules',
  'app.styles',
  'app.fonts',
  'app.images',
  'app.icons',
  'vendor.scripts',
  'vendor.styles',
  'vendor.fonts'
]);

gulp.task('app.scripts', function() {
  var files = [
    path.join(frontScriptsDir, '/application.js'),
    path.join(frontScriptsDir, '/config/*.js'),
    path.join(frontScriptsDir, '/controllers/*.js'),
    path.join(frontScriptsDir, '/directives/*.js'),
    path.join(frontScriptsDir, '/filters/*.js'),
    path.join(frontScriptsDir, '/services/*.js')
  ];
  return gulp.src(files)
    .pipe(sourcemaps.init())
    .pipe(concat('app.js'))
    .pipe(uglify())
    .pipe(sourcemaps.write())
    .pipe(gulp.dest(publicScriptsDir));
});

gulp.task('app.modules', function() {
  var bundler = browserify({});

  _.forEach(modules, function (id) {
    bundler.require(resolve.sync(id), {expose: id});
  });

  bundler.require(resolve.sync('./app/front/scripts/components'), {expose: 'components'});

  bundler.add(path.join(frontScriptsDir, '/modules.js')); // Init modules

  return bundler.bundle()
    .pipe(source('modules.js'))
    .pipe(buffer())
//    .pipe(uglify())
    .pipe(gulp.dest(publicScriptsDir));
});

gulp.task('app.styles', function() {
  var files = [
    path.join(frontStylesDir, '/main.css'),
    path.join(frontStylesDir, '/styles.less'),
    path.join(themeDir, '/css/style-guide.css')
  ];
  return gulp.src(files)
    .pipe(sourcemaps.init())
    .pipe(less())
    .pipe(prefixer({browsers: ['last 4 versions']}))
    .pipe(minifyCss({compatibility: 'ie8'}))
    .pipe(concat('app.css'))
    .pipe(sourcemaps.write())
    .pipe(gulp.dest(publicStylesDir));
});

gulp.task('vendor.scripts', function() {
  var files = [
    path.join(nodeModulesDir, '/js-polyfills/xhr.js'),
    path.join(nodeModulesDir, '/bootstrap/dist/js/bootstrap.min.js'),
    path.join(nodeModulesDir, '/angular/angular.min.js'),
    path.join(nodeModulesDir, '/angular-ui-bootstrap/dist/ui-bootstrap-tpls.js'),
    path.join(nodeModulesDir, '/angular-filter/dist/angular-filter.min.js'),
    path.join(frontScriptsDir, '/ext-libs/babbage.ui.js'),
    path.join(nodeModulesDir, '/bubbletree/node_modules/tween.js/src/Tween.js'),
    path.join(nodeModulesDir, '/bubbletree/dist/bubbletree.min.js'),
  ];
  return gulp.src(files)
    .pipe(concat('vendor.js'))
    .pipe(gulp.dest(publicScriptsDir));
});

gulp.task('vendor.styles', function() {
  var files = [
    path.join(nodeModulesDir, '/font-awesome/css/font-awesome.min.css'),
    path.join(nodeModulesDir, '/bootstrap/dist/css/bootstrap.min.css'),
    path.join(nodeModulesDir, '/angular/angular-csp.css'),
    path.join(frontScriptsDir, '/ext-libs/babbage.ui.css'),
    path.join(nodeModulesDir, '/angular-ui-bootstrap/dist/angular.csp.css'),
    path.join(nodeModulesDir, '/bubbletree/dist/bubbletree.css'),
    path.join(nodeModulesDir, '/c3/c3.min.css')
  ];
  return gulp.src(files)
    .pipe(concat('vendor.css'))
    .pipe(gulp.dest(publicStylesDir));
});

gulp.task('vendor.fonts', function() {
  var files = [
    path.join(nodeModulesDir, '/font-awesome/fonts/*'),
    path.join(nodeModulesDir, '/bootstrap/dist/fonts/*')
  ];
  return gulp.src(files)
    .pipe(gulp.dest(publicFontsDir));
});

gulp.task('app.images', function() {
  return gulp.src([
    path.join(frontImagesDir, '/*'),
    path.join(frontImagesDir, '/**/*')
  ])
    .pipe(gulp.dest(publicImagesDir));
});

gulp.task('app.icons', function() {
  return gulp.src([
    path.join(themeDir, '/assets/icons/*'),
    path.join(themeDir, '/assets/icon-download.svg'),
    path.join(themeDir, '/assets/logo.svg')
  ])
  .pipe(gulp.dest(publicIconsDir));
});

gulp.task('app.fonts', function() {
  return gulp.src([
    path.join(frontFontsDir, '/*'),
    path.join(themeDir, '/assets/fonts/*')
  ])
    .pipe(gulp.dest(publicFontsDir));
});
