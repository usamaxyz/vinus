#!/usr/bin/env node
let gulp = require('gulp'),
    less = require('gulp-less'),
    sass = require('gulp-sass'),
    rtl = require('gulp-rtlcss'),
    concat = require('gulp-concat'),
    uglify = require('gulp-uglify'),
    cleanCss = require('gulp-clean-css'),
    args = require('yargs').argv,
    es = require('event-stream'),

    //sourcemaps = require('gulp-sourcemaps'),

    //browserify
    browserify = require('browserify'),
    watchify = require('watchify'),
    source = require('vinyl-source-stream'),
    buffer = require('vinyl-buffer'),

    //browserify plugins
    babelify = require('babelify'),
    tsify = require("tsify"),
    vueify = require('vueify'),

    //typescript
    gulpTypescript = require("gulp-typescript"),
    gulpBabel = require("gulp-babel"),


    //util
    gulpif = require('gulp-if'),
    rename = require('gulp-rename'),
    logger = require('./node_modules/vinus/logger');


/*
 * get local files: start.js, tsconfig.json, .babelrc
 */

let isProduction = !!args.prod,
    vinusObj,
    vinusGlobals;


if (isProduction) {
    logger.warning('Production mode...');
    process.env.NODE_ENV = 'production';
}

//start file
try {
    require('./' + (args.start || 'start.js'));

    let vinus = require('vinus');
    vinusGlobals = vinus.getGlobals();

    if (args.all) {
        logger.warning('All Groups');
        vinusObj = vinus.get();
    }
    else if (args.group) {
        logger.warning('Group: ' + args.group);
        vinusObj = vinus.get(args.group);
        if (!vinusObj) {
            logger.error('Group: ' + args.group + ' not found.');
            return;
        }
    }
    else {
        vinusObj = vinus.get('default');
    }

} catch (ex) {
    logger.error(ex);
    return logger.error((args.start || 'start.js') + ' not found. Use "npx vinus init" command to add start.js.');
}


if (vinusObj.scripts)
    vinusObj.scripts.forEach(element => {
        //init browserify
        let browserifySrc = undefined;
        if (element.src.length && element.browserify.status) {
            browserifySrc = browserify({
                entries: element.src,
                // debug: true,
                cache: {},
                packageCache: {}
            });

            if (element.typescript.status)
                browserifySrc.plugin(tsify);

            browserifySrc.transform(vueify);

            if (element.babel.status)
                browserifySrc.transform(babelify);
        }
        element.browserifySrc = browserifySrc;
    });

/*
 * core tasks
 */
function styles() {
    let notUsed = 'not.used',
        tasks = vinusObj.styles.map(function (element) {
            return gulp.src(element.src)
                .pipe(gulpif(element.isSass, sass()))
                .pipe(gulpif(element.isLess, less()))
                .pipe(gulpif(element.concat, concat(element.concat ? element.filename : notUsed)))
                .pipe(gulpif(isProduction, cleanCss()))
                //if element.concat => it is already renamed
                .pipe(gulpif(!element.concat && element.filename, rename(element.filename)))

                //emit original if withRtl() is used
                .pipe(gulpif(element.generateRtl && isProduction, rename({
                    suffix: vinusGlobals.prodSuffix
                })))
                //save
                .pipe(gulpif(element.generateRtl, gulp.dest(element.dist)))
                //remove .min suffix
                .pipe(gulpif(element.generateRtl && isProduction, rename(function (path) {
                    path.basename = path.basename.substring(0, path.basename.length - vinusGlobals.prodSuffix.length);
                })))
                //emit rtl version if withRtl() is used
                .pipe(gulpif(element.generateRtl, rtl()))
                .pipe(gulpif(element.generateRtl, rename({
                    suffix: vinusGlobals.rtlSuffix
                })))
                .pipe(gulpif(isProduction, rename({
                    suffix: vinusGlobals.prodSuffix
                })))
                .pipe(gulp.dest(element.dist));
        });
    // create a merged stream
    if (tasks.length)
        return es.merge.apply(null, tasks);
}

function scripts() {
    let notUsed = 'not.used',
        tasks = vinusObj.scripts.map(function (element) {
            let browserifyStatus = element.browserify.status;
            return (browserifyStatus ? element.browserifySrc.bundle() : gulp.src(element.src))
                .pipe(gulpif(!browserifyStatus && element.typescript.status, gulpTypescript()))
                .pipe(gulpif(!browserifyStatus && element.babel.status, gulpBabel()))
                .pipe(gulpif(browserifyStatus, source(element.browserify.sourceName)))
                .pipe(gulpif(browserifyStatus, buffer()))
                .pipe(gulpif(element.concat, concat(element.concat ? element.filename : notUsed)))
                //if element.concat => it is already renamed
                .pipe(gulpif(!element.concat && element.filename, rename(element.filename)))

                // .pipe(sourcemaps.init({ loadMaps: true }))
                .pipe(gulpif(isProduction, uglify()))
                // .pipe(sourcemaps.write('./'))
                .pipe(gulpif(isProduction, rename({
                    suffix: vinusGlobals.prodSuffix
                })))
                .pipe(gulp.dest(element.dist));
        });


    // create a merged stream
    if (tasks.length)
        return es.merge.apply(null, tasks);
}

function watch() {
    styles();
    scripts();

    vinusObj.scripts.map(function (element) {
        if (!element.browserify.status) {
            gulp.watch(element.src, ['scripts']).on('change', function (event) {
                logger.info('File ' + event.path + ' was ' + event.type + ', running tasks...');
            });
        }
        else {
            element.browserifySrc.plugin(watchify);
            element.browserifySrc.on('update', scripts);
            element.browserifySrc.on('log', logger.info);
        }
    });
    vinusObj.styles.map(function (element) {
        gulp.watch(element.src, ['styles']).on('change', function (event) {
            logger.info('File ' + event.path + ' was ' + event.type + ', running tasks...');
        });
    });

    logger.info('Watching...');
}

function copy() {
    let tasks = vinusObj.copies.map(function (element) {
        return gulp.src(element.src)
            .pipe(gulpif(!!element.filename, rename(element.filename)))
            .pipe(gulp.dest(element.dist));
    });
    // create a merged stream
    if (tasks.length)
        return es.merge.apply(null, tasks);
}

/*
 * end of core tasks
 */

gulp.task('styles', styles);
gulp.task('scripts', scripts);
gulp.task('copy', copy);
gulp.task('default', ['styles', 'scripts', 'copy']);
gulp.task('watch', watch);