var gulp = require("gulp");
var plugins = require('gulp-load-plugins')();
var paths = require('./gulp.config.json');
var del = require("del");
var browserify = require("browserify");
var source = require("vinyl-source-stream");
var watchify = require("watchify");
var cleanCSS = require('gulp-clean-css');
var colors = plugins.util.colors;
var log = plugins.util.log;

/*
 * Create a server
 */
gulp.task("connect", function () {
    plugins.connect.server({
        /** Default path */
        root: "public",
        port: 10080
    });
});
gulp.task("minify-css", function () {
    return gulp.src(paths.css).pipe(plugins.cleanCss()).pipe(gulp.dest('public/assets/css/'));
});

var server = plugins.jsonSrv.create();

/*
 * Views angular and static html files
 */
gulp.task("html", function () {
    log("build html");
    return gulp
        .src(paths.html)
        .pipe(gulp.dest('public' ));
});

/** Librairies css */
gulp.task("libs-css", function () {
    log("Build css librairies");
    return gulp
        .src(paths.libsCss)
        .pipe(gulp.dest(paths.public + '/assets/bootstrap/'));
});

var opts = {
    entries: [paths.browserifyPath],
    debug: true
};
var b = watchify(browserify(opts));

gulp.task('browserify', bundle);
b.on('update', bundle);

function bundle() {
    return b.bundle()
        .on('error', log.bind(plugins.util, 'Browserify Error'))
        .pipe(source('bundle.js'))
        .pipe(gulp.dest(paths.public + 'js/'));
}


/** remove all files public folder */
gulp.task('clean', function () {
    log('Cleaning: ' + colors.blue(paths.public));

    var delPaths = [].concat(paths.public);
    del.sync(delPaths);
});

/** components */
gulp.task('components', function () {
        log("components");
        return gulp
            .src(paths.components)
            .pipe(gulp.dest(paths.public + '/source/components/'));
});

/** commmun */
gulp.task('commun', function () {
    log("commun");
    return gulp
        .src(paths.commun)
        .pipe(gulp.dest(paths.public + '/source/commun'));
});

/** move img */
gulp.task("img", function () {
    log("move img");
    return gulp
        .src(paths.img)
        .pipe(gulp.dest(paths.public + '/assets/img/'));
});

/** move translate */
gulp.task("translate", function () {
    log("move translate");
    return gulp
        .src(paths.translate)
        .pipe(gulp.dest(paths.public + '/source/translate/'));
});

/*
 * Build application task
 */
gulp.task('build', ['connect','minify-css', 'libs-css', 'browserify', 'html','img','translate','commun','components']),function(){        
    gulp.start("connect");    
};

gulp.task("default", ["clean"], function () {
    gulp.start("build");
});



/*
 * Watch Task
 */
gulp.task("watch", function () {
    gulp.start("connect");
    gulp.start('browserify');
    gulp.start('img');
    gulp.watch(paths.css,  ["minify-css"]);
    gulp.watch(paths.html, ["html"]);
    gulp.watch(paths.commun, ["commun"]);
    gulp.watch(paths.components, ["components"]);
});
