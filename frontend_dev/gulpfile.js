var gulp = require('gulp');
var autoprefixer = require('gulp-autoprefixer');
var browserSync = require('browser-sync').create();

var concatCss = require('gulp-concat-css');
var minifyCss = require('gulp-minify-css');

var concat = require('gulp-concat');

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
    './build/css/main.css',
    './build/css/login.css'
  ];

  gulp.src(cssFiles)
    .pipe(concatCss('all.min.css'))
    .pipe(minifyCss())
    .pipe(gulp.dest('../paratureanalyticsdashboard/static/css/'));

  var jsFiles = [
    './build/js/jquery.min.js',
    './build/js/exceptions.js',
    './build/js/utils.js',
    './build/js/login.js',
    './build/js/loaders.js',
    './build/js/report.js',
    './build/js/main.js'
  ];

  gulp.src(jsFiles)
    .pipe(concat('all.js'))
    .pipe(gulp.dest('../paratureanalyticsdashboard/static/js/'));

  gulp.src('./build/images/*')
    .pipe(gulp.dest('../paratureanalyticsdashboard/static/images/'));

  gulp.src("./build/*.html")
    .pipe(htmlReplace({
      'css': 'css/all.min.css',
      'js': 'js/all.js'
    }))
    .pipe(gulp.dest('../paratureanalyticsdashboard/templates/'));
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
  gulp.watch('./source/*.html', ['copy-html']);
});
