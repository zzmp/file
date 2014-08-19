var bower     = require('./bower.json'),
    sh        = require('shelljs'),
    gulp      = require('gulp'),
    notify    = require('gulp-notify'),
    jshint    = require('gulp-jshint'),
    stylish   = require('jshint-stylish'),
    mocha     = require('gulp-mocha'),
    annotate  = require('gulp-ng-annotate'),
    concat    = require('gulp-concat'),
    uglify    = require('gulp-uglify');

var dependencies = [];

var paths = JSON.parse(
  sh.exec('./node_modules/bower/bin/bower list --paths --json', { silent: true })
    .output);

for (var dependency in paths)
  if (bower.dependencies && dependency in bower.dependencies)
    dependencies.push(paths[dependency]);

var paths = {
  src: ['./src/file.js', './src/*.*.js', './src/*/**/*.js'],
  preamble: ['./build/preamble.js'],
  postamble: ['./build/postamble.js'],
  tests: ['./tests/**/*.js'],
  dependencies: dependencies,
};

// lint scripts
gulp.task('lint', function () {
  return gulp.src(paths.src)
    .pipe(jshint({ lookup: false }))
    .pipe(jshint.reporter(stylish))
    .pipe(notify({message: 'Jshint done'}));
});

// test changes
gulp.task('test', function() {
  return gulp.src(paths.tests)
    .pipe(mocha({ bail: true, reporter: 'nyan' }));
});

// build dist
gulp.task('build', function() {
  gulp.src(dependencies.concat(paths.preamble, paths.src, paths.postamble))
  // concatenate
    .pipe(concat('index.js'))
  // annotate dependency injections
    .pipe(annotate({ add: true, single_quotes: true }))
    .pipe(gulp.dest('.'));
  // minify
  gulp.src('./index.js')
    .pipe(concat('index.min.js'))
    .pipe(uglify())
    .pipe(gulp.dest('.'));
});

// watch all for changes
gulp.task('watch', function () {
  gulp.watch(paths.src, ['lint', 'test']);
  gulp.watch(paths.tests, ['test']);
});

// kick it all off
gulp.task('default', ['lint', 'test', 'watch']);
