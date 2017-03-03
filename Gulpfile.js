var gulp = require('gulp');
var sass = require('gulp-sass');
var pug = require('gulp-pug');
var prettify = require('gulp-html-prettify');
var cleanCSS = require('gulp-clean-css');
var rename = require('gulp-rename');
var connect = require('gulp-connect');

gulp.task('connect', function() {
    connect.server({
        root: './html',
        livereload: {
            port: 35730
        }
    });
});

gulp.task('styles', function() {
    gulp.src('./elassus.scss')
        .pipe(sass().on('error', sass.logError))
        .pipe(gulp.dest('./css/'))
        .pipe(gulp.dest('./html/css/'))
        .pipe(cleanCSS({ compatibility: 'ie8' }))
        .pipe(rename({ suffix: '.min' }))
        .pipe(gulp.dest('./css/'))
        .pipe(gulp.dest('./html/css/'))
        .pipe(connect.reload());
});

gulp.task('pug', function buildHTML() {
    return gulp.src('pug/*.pug')
        .pipe(pug())
        .pipe(prettify({ indent_char: ' ', indent_size: 4 }))
        .pipe(gulp.dest('./html'))
        .pipe(connect.reload());
});

gulp.task('watch', function() {
    gulp.watch(['./scss/**/*.scss'], ['styles']);
    gulp.watch(['./pug/**/*.pug'], ['pug']);
});

//Watch task
gulp.task('default', ['styles', 'pug', 'connect', 'watch']);
