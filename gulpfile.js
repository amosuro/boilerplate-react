function GulpFile() {
  this.gulp       = require('gulp');
  this.watch      = require('gulp-watch');
  this.browserify = require('browserify');
  this.babelify   = require('babelify');
  this.babel 		  = require('gulp-babel');
  this.connect 	  = require('gulp-connect');
  this.source     = require('vinyl-source-stream');
  this.eslint     = require('gulp-eslint');
  this.minifyCss  = require('gulp-minify-css');
  this.sass       = require('gulp-sass');
  this.concat     = require('gulp-concat');
  this.rename     = require('gulp-rename');
  this.notify     = require('gulp-notify');

  this.gulp.task("connect", this.connectServer());
  this.gulp.task("scripts", function() { this.compileJavascript() }.bind(this));
  this.gulp.task("lint", function() { this.lintJavascript() }.bind(this));
  this.gulp.task("styles", function(){ this.compileCss() }.bind(this));
  this.gulp.task("watch", ['styles'], function() { this.watchAssets() }.bind(this));
  this.gulp.task("default", ['scripts', 'styles', 'watch'])
}

GulpFile.prototype.connectServer = function() {
  this.connect.server({
		https: true,
    port: 8888
	});
};

GulpFile.prototype.compileJavascript = function() {
  return this.browserify({entries: './app.jsx', extensions: ['.jsx'], debug: true})
    .transform("babelify", {presets: ["es2015", "react"]})
    .bundle()
    .pipe(this.source('scripts.min.js'))
    .pipe(this.gulp.dest('./public/js'))
    .pipe(this.notify({ message: 'Scripts compiled successfully!' }));
};

GulpFile.prototype.compileCss = function() {
  return this.gulp.src(['./helpers/styles/*.scss', './components/**/*.scss'])
    .pipe(this.sass({includePaths: [
      './node_modules/flexboxgrid/css'
    ]}).on('error', this.sass.logError))
    .pipe(this.concat('styles.css'))
    .pipe(this.minifyCss())
    .pipe(this.rename('styles.min.css'))
    .pipe(this.gulp.dest('./public/css'))
};

GulpFile.prototype.lintJavascript = function() {
  return this.gulp.src(['./*.jsx', './components/**/*.jsx'])
    .pipe(this.eslint({
        // Full list here:
        // http://eslint.org/docs/user-guide/configuring#specifying-language-options
        ecmaFeatures: {
          "arrowFunctions": true,
          "classes": true,
          "defaultParams": true,
          "destructuring": true,
          "modules": true,
          "spread": true,
          "superInFunctions": true,
          "templateStrings": true,
          "jsx": true
        }
    }))
    .pipe(this.eslint.format())
    .pipe(this.eslint.failAfterError())
    .on('error', this.notify.onError(function (error) {
      return 'There was an error!';
    }));
};

GulpFile.prototype.watchAssets = function() {
  this.gulp.watch('./*.jsx', ['lint', 'scripts']);
  this.gulp.watch('./components/**/*.jsx', ['lint', 'scripts']);
  this.gulp.watch('./helpers/styles/*.scss', ['styles']);
  this.gulp.watch('./components/test/test.scss', ['styles']);

  return
};

new GulpFile();
