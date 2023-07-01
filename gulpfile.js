const { src, dest, watch, parallel, series } = require('gulp');

const scss = require('gulp-sass')(require('sass'));
const concat = require('gulp-concat');
const uglify = require('gulp-uglify-es').default;
const browserSync = require('browser-sync').create();
const autoprefixer = require('gulp-autoprefixer');
const htmlMin = require('gulp-htmlmin');
const replace = require('gulp-replace');
const clean = require('gulp-clean');
const avif = require('gulp-avif');
const webp = require('gulp-webp');
const imagemin = require('gulp-imagemin');
const newer = require('gulp-newer');
const svgSprite = require('gulp-svg-sprite');
const fonter = require('gulp-fonter');
const ttf2woff2 = require('gulp-ttf2woff2');

function fonts () {
  return src ('app/fonts/src/*.*')
  .pipe(fonter({
    formats: ['woff', 'ttf']
  }))
  .pipe(src('app/fonts/*.ttf'))
  .pipe(ttf2woff2())
  .pipe(dest('app/fonts'))
  .pipe(dest('dist/fonts'))
}

function images() {
  return src(['app/img/src/*.*', '!app/img/src/*.svg', '!app/img/src/*.ico'])
    .pipe(src(['app/img/src/*.*', '!app/img/src/*.ico']))
    .pipe(newer('app/img'))
    // .pipe(webp())

    .pipe(src('app/img/src/*.*'))
    .pipe(newer('app/img'))
    .pipe(imagemin())

    .pipe(dest('app/img'));
}

function sprite () {
  return src('app/img/*.svg')
  .pipe(svgSprite({
    mode: {
      stack: {
        sprite: '../sprite.svg',
        example: true
      }
    }
  }))
  .pipe(dest('app/img'))
}

function scripts() {
  return src(['app/js/main.js'])
    .pipe(concat('main.min.js'))
    .pipe(uglify())
    .pipe(dest('app/js'))
    .pipe(browserSync.stream());
}

function styles() {
  return src('app/scss/style.scss')
    .pipe(
      autoprefixer({ overrideBrowserslist: ['last 10 versions'] })
    )
    .pipe(concat('style.min.css'))
    .pipe(scss({ outputStyle: 'compressed' }))
    .pipe(dest('app/css'))
    .pipe(browserSync.stream());
}

function html() {
  return src('app/*.html')
    .pipe(replace('style.css', 'style.min.css'))
    .pipe(htmlMin({ collapseWhitespace: true }))
    .pipe(dest('dist'));
}

function php() {
  return src('app/*.php').pipe(dest('dist'));
}

function watching() {
  browserSync.init({
    server: {
      baseDir: 'app/',
    },
  });
  watch(['app/img/src'], images);
  watch(['app/js/main.js'], scripts);
  watch(['app/scss/*.scss'], styles);
  watch(['app/**/*.html']).on('change', browserSync.reload);
  watch(['app/*.html']).on('change', browserSync.reload);
}

function cleanDist() {
  return src('dist').pipe(clean());
}

function builder() {
  return src(
    [
      'app/css/style.min.css',
      'app/img/*.*',
      '!app/img/*.svg',
      '!app/img/stack',
      'app/fonts/*.*',
      'app/js/main.min.js',
      'app/*.html',
    ],
    { base: 'app' }
  ).pipe(dest('dist'));
}

exports.scripts = scripts;
exports.php = php;
exports.styles = styles;
exports.html = html;
exports.images = images;
exports.fonts = fonts;
exports.watching = watching;
exports.build = series(cleanDist, builder, html, php);

exports.default = parallel(watching);
