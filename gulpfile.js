var gulp = require('gulp');
var pug = require('gulp-pug-3');
var cssPrefix = require('gulp-class-prefix');
var htmlPrefix = require('gulp-html-prefix');
var sass = require('gulp-sass');

var SplittermondData = {};
SplittermondData.rassen = require('./src/js/data/rassen.json');
SplittermondData.abgeleiteteWerte = require('./src/js/data/abgeleitete_werte.json');
SplittermondData.attribute = require('./src/js/data/attribute.json');
SplittermondData.fertigkeiten = require('./src/js/data/fertigkeiten.json');
SplittermondData.kampffertigkeiten = require('./src/js/data/kampffertigkeiten.json');
SplittermondData.magieschulen = require('./src/js/data/magieschulen.json');
SplittermondData.staerken = require('./src/js/data/staerken.json');
SplittermondData.zustaende = require('./src/js/data/zustaende.json');
SplittermondData.meisterschaften = require('./src/js/data/meisterschaften.json');

gulp.task('BuildStyle', function () {
    return gulp.src('src/sass/sheet.scss')
        .pipe(sass())
        .pipe(cssPrefix('sheet-', {
            ignored: [".charsheet", ".repcontrol button", /\.repcontrol/, /\.itemcontrol/]
        }))
        .pipe(gulp.dest('dist'));
});

gulp.task('BuildSheet', function () {
    return gulp.src('src/pug/sheet.pug')
        .pipe(pug({ pretty: true, locals: { splittermond: SplittermondData } }))
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