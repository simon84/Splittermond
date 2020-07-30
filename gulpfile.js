var gulp = require('gulp');
var pug = require('gulp-pug-3');
var cssPrefix = require('gulp-class-prefix');
var htmlPrefix = require('gulp-html-prefix');
var sass = require('gulp-sass');

gulp.task('BuildStyle', function () {
    return gulp.src('src/sass/sheet.scss')
        .pipe(sass())
        .pipe(cssPrefix('sheet-', {
            ignored: [".charsheet"]
        }))
        .pipe(gulp.dest('dist'));
});

gulp.task('BuildSheet', function () {
    return gulp.src('src/pug/sheet.pug')
        .pipe(pug({ pretty: true }))
        .pipe(htmlPrefix('sheet-', { ignored: [/repeating_[a-z_-]+/] }))
        .pipe(gulp.dest('dist'));
});

gulp.task('BuildDebugEnv', function () {
    return gulp.src('src/pug/debug.pug')
        .pipe(pug({ pretty: true }))
        .pipe(gulp.dest('dist'));
});

gulp.task('CopyImages', function () {
    return gulp.src('src/assets/images/*.*')
        .pipe(gulp.dest('dist/images'));
});



//gulp.task("Release", ["CompilePugSheet"]);

gulp.task('default', gulp.series('BuildStyle', 'BuildSheet', 'BuildDebugEnv', 'CopyImages'));