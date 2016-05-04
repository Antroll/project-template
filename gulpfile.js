'use strict';

var gulp = require('gulp');
var $ = require('gulp-load-plugins')();
var browserSync = require('browser-sync');
var reload = browserSync.reload;
var browserSyncConfig = {
    reloadOnRestart: true,
    notify: false,
    port: 9000,
    startPath: "/",
    server: {
        baseDir: ['dist', 'app']
    }
};

var jadeData = require('./data.json');

// compile jade
gulp.task('views', function() {
    return gulp.src(['app/tamplates/**/*.jade'])
        .pipe($.plumber())

    //only pass unchanged *main* files and *all* the partials
    .pipe($.changed('dist', { extension: '.html' }))

    //filter out unchanged partials, but it only works when watching
    .pipe($.if(browserSync.active, $.cached('jade')))

    //find files that depend on the files that have changed
    .pipe($.jadeInheritance({ basedir: 'app/tamplates' }))

    //filter out partials (folders and files starting with "_" )
    .pipe($.filter(function(file) {
        return !/\_/.test(file.path) && !/^_/.test(file.relative);
    }))

    .pipe($.jade({
            locals: jadeData,
            pretty: true
        }))
        .pipe($.beml())
        .pipe($.fileInclude({ basepath: 'dist' }))
        .pipe(gulp.dest('dist'))
        .pipe(reload({ stream: true }));
});

// compile sass
gulp.task('styles', function() {

    $.rubySass('app/styles', {
            style: 'expanded',
            precision: 10,
            sourcemap: true
        })
        .on('error', function(err) {
            console.error('Error!', err.message);
        })
        .pipe($.postcss([
            require('autoprefixer'),
            require('postcss-flexibility')
        ]))
        .pipe($.sourcemaps.write('.'))
        .pipe(gulp.dest('dist/styles'))
        .pipe(reload({ stream: true }));
});

// view and check scripts
gulp.task('scripts', function() {
    return gulp.src(['app/scripts/**/*.js', '!app/scripts/modernizr/modernizr.custom.js'])
        .pipe($.filter(function(file) {
            return !/\_/.test(file.path) && !/^_/.test(file.relative);
        }))
        .pipe($.plumber())
        .pipe($.sourcemaps.init())
        .pipe($.babel())
        .pipe($.sourcemaps.write('.'))
        .pipe(gulp.dest('dist/scripts'));
});

gulp.task('jshint', function() {
    return gulp.src('app/scripts/**/*.js')
        .pipe($.plumber())
        .pipe($.jshint())
        .pipe($.jshint.reporter('jshint-stylish'))
        .pipe($.jshint.reporter('fail'));
});

// min-css
gulp.task('min-css', function() {
    return gulp.src('dist/styles/*.css')
        .pipe($.minifyCss({ compatibility: 'ie8' }))
        .pipe($.rename({ suffix: '.min' }))
        .pipe(gulp.dest('dist/styles'));
});

// sprite-gen
gulp.task('sprite', function() {
    var spriteData = gulp.src('app/sprite/icons/*.png').pipe($.spritesmith({
        imgName: 'sprite.png',
        cssName: 'sprite.scss',
        padding: 20,
        imgPath: '../images/png/sprite.png'
    }));
    return spriteData.pipe(gulp.dest('app/sprite/'));
});
// sprite move to dist
var filesToMove = [
    'app/sprite/*.png'
];
gulp.task('move-sprite', ['sprite'], function() {
    gulp.src(filesToMove, { base: './app/sprite/' })
        .pipe(gulp.dest('dist/images/png/'));
});

// clean scripts
gulp.task('clean-scripts', function() {
    return gulp.src('./dist/scripts/app.min.js', { read: false })
        .pipe($.clean());
});

gulp.task('min-js', ['clean-scripts'], function() {
    return gulp.src([
            './dist/plugins/jquery.dotdotdot.min.js',
            './dist/plugins/flexibility.js',
            './dist/plugins/phone-mask.js',
            './dist/plugins/image-scale.min.js',
            './dist/plugins/responsive-tables/responsive-tables.js',
            './dist/scripts/*.js',
        ])
        .pipe($.concat('app.min.js'))
        .pipe(gulp.dest('dist/scripts/'))
        .pipe($.uglify())
        .pipe(gulp.dest('dist/scripts/'));
});

// main task
gulp.task('serve', $.sync(gulp).sync([
    ['views', 'styles', 'scripts', 'move-sprite']
]), function() {
    browserSync.init(browserSyncConfig);

    // watch for changes
    gulp.watch([
        'dist/scripts/**/*.js',
        'app/images/**/*'
    ]).on('change', reload);

    gulp.watch('app/scripts/**/*.js', ['scripts']);
    gulp.watch('app/styles/**/*.scss', ['styles']);
    gulp.watch('app/**/*.jade', ['views']);
    gulp.watch('app/sprite/icons/*.*', ['move-sprite', 'styles']);
});

gulp.task('watch', function() {
    gulp.start('serve');
});