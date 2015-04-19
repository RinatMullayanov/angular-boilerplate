var gulp = require('gulp');
var concat = require('gulp-concat');
var rename = require('gulp-rename');
// for js
var ngmin = require('gulp-ngmin');
var uglify = require('gulp-uglify');
// css
var stylus = require('gulp-stylus');
var autoprefixer = require('gulp-autoprefixer');
// for custom server with livereload
// Chrome is required LiveReload extension
// in Safari it works all by itself(without extension)
var livereload = require('gulp-livereload');
var server = require('./server-core.js');
var config = {
  port: 8237,
  status: 'dev',
  liveReloadPort: 35729,
  siteDir: 'src'
};
var livereloadServer;

gulp.task('server', function () {
  livereloadServer = livereload();
  /*
   * to work without manually disable / enable the plugin in the browser after the page loads
   * need to run livereload server before running the server express
   * */
  livereload.listen(config.liveReloadPort);
  server.listen(config);
});

gulp.task('js-dev', function () {
  //gulp.src('collapseCheckbox.js')
  //  .pipe(gulp.dest('test/js/'));
});

gulp.task('css-dev', function () {
  //gulp.src('template/collapseCheckbox.styl')
  //  .pipe(stylus())
  //  .pipe(rename('collapseCheckbox.css'))
  //  .pipe(autoprefixer())
  //  .pipe(gulp.dest('test/css/'));
});

gulp.task('js-prod', function () {
  //gulp.src('collapseCheckbox.js')
  //  .pipe(gulp.dest('../dist/js/'));
  //
  //gulp.src('collapseCheckbox.js')
  //  .pipe(ngmin()) // pre-minify AngularJS apps
  //  .pipe(uglify())
  //  .pipe(rename('collapseCheckbox.min.js'))
  //  .pipe(gulp.dest('../dist/js/'));
});

gulp.task('css-prod', function () {
  //gulp.src('template/collapseCheckbox.styl')
  //  .pipe(stylus())
  //  .pipe(rename('collapseCheckbox.css'))
  //  .pipe(autoprefixer())
  //  .pipe(gulp.dest('../dist/css/'));
  //
  //gulp.src('template/collapseCheckbox.styl')
  //  .pipe(stylus({compress: true}))
  //  .pipe(rename('collapseCheckbox.min.css'))
  //  .pipe(autoprefixer())
  //  .pipe(gulp.dest('../dist/css/'));
});

gulp.task('watch', ['server'], function () {
  //gulp.watch(['test/app.js', 'collapseCheckbox.js'], ['js-dev']);
  //gulp.watch('template/collapseCheckbox.styl', ['css-dev']);

  gulp.watch(['src/*/**', 'src/*']).on('change', function (file) {
    // tell the browser that the file was updated
    livereloadServer.changed(file.path);
  });
});

gulp.task('build', ['js-prod', 'css-prod'], function () {
  // place code for your default task here
});

gulp.task('default', ['watch'], function () {
  // place code for your default task here
});