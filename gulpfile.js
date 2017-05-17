var child = require('child_process');
var gutil = require('gulp-util');
var gulp = require('gulp');
var notify = require("gulp-notify");

var paths = {
 scss: ['_sass/dg'],
 js: ['assets/js/main.js'],
};

var jekyll   = process.platform === 'win32' ? 'jekyll.bat' : 'jekyll';
var messages = {
    jekyllBuild: 'Rebuilding incrementally...',
    jekyllBuildComplete: 'Rebuilding complete site...'
};

const browserSync = require('browser-sync').create();
const siteRoot = '_site';


gulp.task('jekyll-build', function (done) {
    browserSync.notify(messages.jekyllBuild);
    return child.spawn( jekyll , ['build', '--incremental', '--drafts'], {stdio: 'inherit'})
        .on('close', done);
});

gulp.task('jekyll-build-complete', function (done) {
    browserSync.notify(messages.jekyllBuildComplete);
    return child.spawn( jekyll , ['build', '--drafts'], {stdio: 'inherit'})
        .on('close', done);
});

gulp.task('jekyll-rebuild', ['jekyll-build'], function () {
    browserSync.reload();
});

gulp.task('jekyll-rebuild-complete', ['jekyll-build-complete'], function () {
    browserSync.reload();
});

gulp.task('serve', ['jekyll-build'], function() {
  browserSync.init({
    port: 4000,
    server: {
      baseDir: siteRoot
    }
  });
});


// // Gulp watch
// gulp.task('watch', function(){
//   gulp.watch('assets/scss/*.scss', ['sass']);
//   gulp.watch('assets/scss/*/*.scss', ['sass']);
//   gulp.watch('assets/js/*.js', ['jshint']);
// })

gulp.task('watch', function () {
    gulp.watch([
      '_includes/**/*',
      '_layouts/**/*',
      '_posts/**/*',
      'content/**/*'
    ], ['jekyll-rebuild']);
    gulp.watch([
      '_data/**/*'
    ], ['jekyll-rebuild-complete']);
});

gulp.task('default', ['serve', 'watch']);
