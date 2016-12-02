var gulp = require('gulp');
var del = require('del');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var templateCache = require('gulp-angular-templatecache');
var css2js = require("gulp-css2js");
var minifyHtml = require("gulp-minify-html");
var minifyCss = require('gulp-minify-css');

gulp.task('delete-dist', function (done) {
    return del(['dist'],done);
});

gulp.task('template', function (done) {
    gulp.src(['./src/templates/*.html'])
        .pipe(minifyHtml())
        .pipe(templateCache('templates.js',{module : 'ionic-setpicker.templates',standalone:true,root:''}))
        .pipe(gulp.dest("./dist"))
        .on('finish',done);
});

gulp.task('css2js', function (done) {
    gulp.src("./src/style/ionic-setpicker.css")
        .pipe(minifyCss())
        .pipe(css2js())
        .pipe(gulp.dest("./dist/"))
        .on('finish',done);
});

gulp.task('minify-all', function (done) {
    gulp.src(['./src/js/*.js','./dist/*.js'])
        .pipe(concat('ionic-setpicker.min.js'))
        .pipe(uglify())
        .pipe(gulp.dest('dist/'))
        .on('finish',done);
});

gulp.task('delete-trash', function (done) {
    return del(['dist/templates.js','dist/ionic-setpicker.js'],done);
});

gulp.task('default', gulp.series('delete-dist','template','css2js','minify-all','delete-trash'), function (done) {
    done();
});
