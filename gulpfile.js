const gulp = require('gulp');
const sass = require('gulp-sass');
const gulpImage = require('gulp-image');
const concat = require('gulp-concat');
const ejs = require("gulp-ejs");
const rename = require('gulp-rename');
const htmlmin = require('gulp-htmlmin');
const uglify = require('gulp-uglify');
const cleanCSS = require('gulp-clean-css');
const browserSync = require('browser-sync').create();
const autoprefixer = require('gulp-autoprefixer');
const sourcemaps = require('gulp-sourcemaps');

function ejsBuild() {
    return gulp.src('html/*.ejs')
    .pipe(ejs({}))
    .pipe(rename({ extname: '.html' }))
    // .pipe(htmlmin({
    //     collapseWhitespace: true,
    //     removeComments: true
    //   }))
    .pipe(gulp.dest('dist/'))
    .pipe(browserSync.reload({
        stream: true
    }))
}

function watch() {
    browserSync.init({
        server: {
            baseDir: './dist'
        }
    });
    gulp.watch('./sass/**/*.scss',style);
    gulp.watch('./html/**/*.ejs').on('change', browserSync.reload);
    gulp.watch('./img/**/*').on('change', browserSync.reload);
    gulp.watch('./dist/**/*.html').on('change', browserSync.reload);
    gulp.watch('./js/**/*.js').on('change', browserSync.reload);
    gulp.watch('./fonts/*').on('change', browserSync.reload);
    gulp.watch('./html/**/*.ejs', gulp.series(['ejsBuild']));
    gulp.watch('./img/**/*', gulp.series(['image']));
    gulp.watch('./js/**/*.js', gulp.series(['script']));
    gulp.watch('./fonts/*', gulp.series(['fonts']));
}

function style() {
    return gulp.src('sass/**/*.scss')
    .pipe(sass())
    .pipe(autoprefixer({
        browsers: ['last 2 versions'],
        cascade: false
    }))
    .pipe(cleanCSS({compatibility: 'ie8'}))
    .pipe(gulp.dest('dist/css'))
    .pipe(browserSync.stream())
}

function script() {
    return gulp.src([
        'js/lib/*.js',
        'js/*.js',
    ])
    .pipe(sourcemaps.init())
    .pipe(concat('app.js'))
    .pipe(uglify())
    .pipe(gulp.dest('dist/js/'))
}

function image() {
    return gulp.src('img/**/*')
    .pipe(gulpImage())
    .pipe(gulp.dest('dist/img'))
}

function fonts() {
    return gulp.src('fonts/*')
    .pipe(gulp.dest('dist/fonts/'))
}

function defaultTask() {
    watch();
}
  
function build() {
    style();
    script();
    image();
    ejsBuild();
    fonts();
}

exports.default = defaultTask;
exports.image = image;
exports.script = script;
exports.build = build;
exports.style = style;
exports.fonts = fonts;
exports.ejsBuild = ejsBuild;
exports.watch = watch;
