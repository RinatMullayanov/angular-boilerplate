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
  siteDir: 'src',
  stylusPath: ['./src/css/*.styl', './src/features/**/*.styl'],
  cssRootPath: './src/css/'
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
  gulp.src(config.stylusPath, function (er, files) {
    // files is an array of filenames.
    // If the `nonull` option is set, and nothing
    // was found, then files is ["**/*.js"]
    // er is an error object or null.
    console.log(files);
  })
  //.pipe(concat('app.styl')) // first concat in one file that mixins to be globally visible
  .pipe(stylus())
  .pipe(rename(function (path) {
    //path.dirname += "/ciao";
    //path.basename += "-goodbye";
    path.extname = '.css';
  }))
  .pipe(autoprefixer())
  .pipe(gulp.dest(function(file) {
    return file.base;
  }));
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
  gulp.src(config.stylusPath, function (er, files) {
    // files is an array of filenames.
    // If the `nonull` option is set, and nothing
    // was found, then files is ["**/*.js"]
    // er is an error object or null.
    console.log(files);
  })
  .pipe(concat('app.styl')) // first concat in one file that mixins to be globally visible
  .pipe(stylus({compress: true}))
  .pipe(rename('app.min.css'))
  .pipe(autoprefixer())
  .pipe(gulp.dest(config.cssRootPath));
});

gulp.task('watch', ['server'], function () {
  //gulp.watch(['test/app.js', 'collapseCheckbox.js'], ['js-dev']);
  gulp.watch(config.stylusPath, ['css-dev']);

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