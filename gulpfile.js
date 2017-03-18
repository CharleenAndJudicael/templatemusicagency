const CSS_STYLE = 'style.min.css';
//Variable
var gulp = require("gulp");
var jquery = require('gulp-jquery');
var plugins = require('gulp-load-plugins')();
var paths = require('./gulp.config.json');
var del = require("del");
var browserify = require("browserify");
var source = require("vinyl-source-stream");
var watchify = require("watchify");
var cleanCSS = require('gulp-clean-css');
var sass = require('gulp-sass');
var notify = require('gulp-notify');
var colors = plugins.util.colors;
var log = plugins.util.log;
var csscomb = require('gulp-csscomb');
var cssbeautify = require('gulp-cssbeautify');
var cssmin = require('gulp-cssmin');
var concatCss = require('gulp-concat-css');
var uglify = require('gulp-uglify');
var gutil = require('gulp-util');
var sourcemaps = require('gulp-sourcemaps');
var browserSync = require('browser-sync');
var reload = browserSync.reload;
// context
var context = {
    env: 'dev', // env : gutil.env.MODE_ENV,
};
/*
 * Create a server
 */
gulp.task("connect", function () {
    plugins.connect.server({
        /** Default path */
        root: "public"
        , port: 10080
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
    return gulp.src(paths.html).pipe(gulp.dest('public'));
});
/** Librairies css */
gulp.task("libs-css", function () {
    log("Build css librairies");
    return gulp.src(paths.libsCss).pipe(gulp.dest(paths.public + '/assets/bootstrap/'));
});
var opts = {
    entries: [paths.browserifyPath]
    , debug: true
};
var b = watchify(browserify(opts));
gulp.task('browserify', bundle);
b.on('update', bundle);

function bundle() {
    return b.bundle().on('error', log.bind(plugins.util, 'Browserify Error')).pipe(source('bundle.js')).pipe(gulp.dest(paths.public + 'js/'));
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
    return gulp.src(paths.components).pipe(gulp.dest(paths.public + '/source/components/'));
});
/** commmun */
gulp.task('commun', function () {
    log("commun");
    return gulp.src(paths.commun).pipe(gulp.dest(paths.public + '/source/commun'));
});
/** move img */
gulp.task("img", function () {
    log("move img");
    return gulp.src(paths.img).pipe(gulp.dest(paths.public + '/assets/img/'));
});
/** move translate */
gulp.task("translate", function () {
    log("move translate");
    return gulp.src(paths.translate).pipe(gulp.dest(paths.public + '/source/translate/'));
});
/*
 * Build application task
 */
gulp.task('build', ['connect', 'jquery', 'sass', 'libs-css', 'html', 'img'])
    , function () {
        gulp.start("connect");
    };
/*gulp.task('build', ['connect','minify-css', 'libs-css', 'browserify', 'html','img','translate','commun','components']),function(){        
    gulp.start("connect");    
};*/
gulp.task("default", ["clean"], function () {
    gulp.start("build");
});
/***
 *
 * SASS to CSS Task.
 * 
 * Info : the minimize cleanCSS task enabled only to production mode.
 *
 ***/
gulp.task('SASS_TO_CSS', function () {
    log('---------->> SASS_TO_CSS TASK <<----------');
    log(paths.sassIn);
    return gulp.src(paths.sassIn).pipe(sass({
        outputStyle: 'expanded'
    }).on('error', sass.logError)).pipe(csscomb()).pipe(cssbeautify()).pipe(isProduction() ? cleanCSS({
        compatibility: 'ie8'
    }) : gutil.noop()).pipe(concatCss(CSS_STYLE)).pipe(size()).pipe(gulp.dest(paths.sassOut)).pipe(notify("[SASS_TO_CSS][OUT CSS]" + paths.sassOut));
});
/***
 * SASS
 ***/
gulp.task('sass', function () {
    return gulp.src(paths.sassIn).pipe(sass({
        outputStyle: 'expanded'
    }).on('error', sass.logError)).pipe(gulp.dest(paths.public + '/assets/css/')).pipe(notify("Create css file"));
});
gulp.task('sass-sources', function () {
    return gulp.src(['sass/style.sass']).pipe(sourcemaps.init()).pipe(sass({
        outputStyle: 'expanded'
    }).on('error', sass.logError)).pipe(sourcemaps.write('.')).pipe(gulp.dest(paths.public + '/assets/css/')).pipe(reload({
        stream: true
    })).pipe(notify("Create CSS files"));
});
/**
 * Check is the production mode.
 * 
 * @returns true if the production mode is active, false else.
 */
function isProduction() {
    return context.env === 'prod';
}
/***
 *
 * PLUGINS_JS Task.
 * 
 * Info : the minimize task enabled only to production mode.
 *
 ***/
gulp.task('PLUGINS_JS', function () {
    log('---------->> PLUGINS_JS TASK <<----------');
    gulp.src(paths.jsPluginIn).pipe(count('Total JS files : <%= counter %> ')).pipe(size())
        //		.pipe(sourcemaps.init())
        .pipe(concat(JS_PLUGIN)).pipe(isProduction() ? uglify() : gutil.noop()).on("finish", function () {
            gutil.log('-----> Plugin concat ... Done !!');
        }).pipe(size())
        //		.pipe(sourcemaps.write(paths.jsSrc))
        .pipe(gulp.dest(paths.jsPluginOut)).pipe(notify('[PLUGINS_JS][OUT JS] ' + paths.jsPluginOut));
    //gutil.log('[OUT SOURCE MAP] ' + paths.jsPluginOut);
});
/***
 *
 * jquerry  Task.
 * 
 * 
 *
 ***/
gulp.task('jquery', function () {
    return jquery.src({
        release: 2, //jQuery 2 
        flags: ['-deprecated', '-event/alias', '-ajax/script', '-ajax/jsonp', '-exports/global']
    }).pipe(gulp.dest('./public/js/vendor/'));
    // creates ./public/vendor/jquery.custom.js 
});
/*
 * Watch Task
 */
gulp.task("watch", function () {
    // Watch .sass files
    gulp.watch('./**/*.sass', ['sass']);
    gulp.watch(paths.sassIn, ['sass']);
    gulp.start("connect");
    /*gulp.start('browserify');*/
    gulp.start('img');
    /*gulp.watch(paths.css, ["minify-css"]);*/
    gulp.watch(paths.html, ["html"]);
    /*gulp.watch(paths.commun, ["commun"]);
    gulp.watch(paths.components, ["components"]);*/
});