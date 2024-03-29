var gulp = require('gulp');
var autoprefixer = require('gulp-autoprefixer');
var browserSync = require('browser-sync').create();

var concatCss = require('gulp-concat-css');
var minifyCss = require('gulp-minify-css');

var concat = require('gulp-concat');

var uglify = require('gulp-uglify');

var htmlReplace = require('gulp-html-replace');

var url = require('url');
var proxy = require('proxy-middleware');


gulp.task('copy-html', function() {
  gulp.src('./source/*.html')
    .pipe(gulp.dest('./build/'));
});


gulp.task('copy-images', function() {
  gulp.src('./source/images/*')
    .pipe(gulp.dest('./build/images/'));
});


gulp.task('styles', function() {
  gulp.src('./source/css/*')
    .pipe(autoprefixer({
      browsers: ['last 2 versions']
    }))
    .pipe(gulp.dest('./build/css'))
});


gulp.task('scripts', function() {
  gulp.src('./source/js/*')
    .pipe(gulp.dest('./build/js'));
});


gulp.task('push-to-flask', function() {
  var cssFiles = [
    './build/css/normalize.css',
    './build/css/score_required.css',
    './build/css/score_grid.css',
    './build/css/score_utils.css',
    './build/css/header.css',
    './build/css/footer.css',
    './build/css/navigation.css',
    './build/css/cover.css',
    './build/css/button.css',
    './build/css/icon.css',
    './build/css/form.css',
    './build/css/spinner.css',
    './build/css/report.css',
    './build/css/main.css'
  ];

  gulp.src(cssFiles)
    .pipe(concatCss('all.min.css'))
    .pipe(minifyCss())
    .pipe(gulp.dest('../paratureanalytics/static/css/'));

  var jsFiles = [
    './build/js/jquery.min.js',
    './build/js/config.js',
    './build/js/exceptions.js',
    './build/js/utils.js',
    './build/js/loaders.js',
    './build/js/login.js',
    './build/js/logout.js',
    './build/js/report.js',
    './build/js/summary.js',
    './build/js/detail.js',
    './build/js/explore.js',
    './build/js/export.js',
    './build/js/main.js'
  ];

  gulp.src(jsFiles)
    .pipe(concat('all.min.js'))
    .pipe(uglify())
    .pipe(gulp.dest('../paratureanalytics/static/js/'));

  gulp.src('./build/images/*')
    .pipe(gulp.dest('../paratureanalytics/static/images/'));

  gulp.src("./build/*.html")
    .pipe(htmlReplace({
      'css': 'css/all.min.css',
      'js': 'js/all.min.js'
    }))
    .pipe(gulp.dest('../paratureanalytics/templates/'));
});


gulp.task('default', ['copy-html', 'copy-images', 'styles', 'scripts'], function() {
  var proxyOptions = url.parse('http://localhost:5000/api/v1/');
  proxyOptions.route = '/api/v1/'

  browserSync.init({
      server: {
        baseDir: "./build",
        middleware: [proxy(proxyOptions)]
      }
  });

  gulp.watch('./source/css/*', ['styles', browserSync.reload]);
  gulp.watch('./source/js/*', ['scripts', browserSync.reload])
  gulp.watch('./source/*.html', ['copy-html', browserSync.reload]);
});
