const gulp = require('gulp'),
  sass = require('gulp-sass'),
  browserSync = require('browser-sync'),
  nodeSass = require('node-sass'),
  sassOpts = {
    functions: {
      'encodeBase64($string)': function($string) {
        var buffer = new Buffer($string.getValue());
        return nodeSass.types.String(buffer.toString('base64'));
      }
    }
  },
  autoprefixer = require('gulp-autoprefixer'),
  autoprefixerOpts = {
    browsers: ['last 100 versions'],
    cascade: false
  },
  csso = require('gulp-csso'),

  sassBuild = () => (
    gulp.src('./src/styles/index.scss')
      .pipe( sass(sassOpts).on('error', sass.logError) )
      .pipe( autoprefixer(autoprefixerOpts) )
      .pipe( csso() )
      .pipe( gulp.dest('./dist/styles') )
  ),

  htmlBuild = () => (
    gulp.src('./src/templates/index.html')
      .pipe(gulp.dest('./dist/'))
  ),

  imagesProcess = () => (
    gulp.src('./src/images/*')
      .pipe(gulp.dest('./dist/images'))
  );



gulp.task('sass', () => (
  sassBuild()
));


gulp.task('sass:watch', () => (
  sassBuild()
    .pipe(browserSync.stream())
));


gulp.task('html', () => (
  htmlBuild()
));


gulp.task('html:watch', () => (
  htmlBuild()
    .pipe(browserSync.stream())
));


gulp.task('images', () => (
  imagesProcess()
));


gulp.task('images:watch', () => (
  imagesProcess()
    .pipe(browserSync.stream())
));


gulp.task('dev:watch', () => {
  gulp.src('./src/fonts/*')
    .pipe(gulp.dest('./dist/fonts'))

  browserSync.create();
  browserSync.init({
    server: {
      baseDir: "./dist"
    } 
  });

  gulp.watch('./src/styles/**/*.scss', ['sass:watch']);
  gulp.watch('./src/templates/*', ['html:watch']);
  gulp.watch('./src/images/*', ['images:watch']);

  gulp.watch('./dist/*').on('change', browserSync.reload);
});

gulp.task('dev', ['html', 'sass', 'images', 'dev:watch']);
