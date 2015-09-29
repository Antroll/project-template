'use strict';

var gulp = require('gulp');
var $ = require('gulp-load-plugins')();
var browserSync = require('browser-sync');
var reload = browserSync.reload;
var browserSyncConfig={
	reloadOnRestart: true,
	notify: false,
	port: 9000,
	startPath: "/",
	server: {
		baseDir: ['dist', 'app']
	}
};

var jadeData = require('./data.json');

gulp.task('views', function () {
	return gulp.src(['app/tamplates/**/*.jade'])
		.pipe($.plumber())

		//only pass unchanged *main* files and *all* the partials
		.pipe($.changed('dist', {extension: '.html'}))

		//filter out unchanged partials, but it only works when watching
		.pipe($.if(browserSync.active, $.cached('jade')))

		//find files that depend on the files that have changed
		.pipe($.jadeInheritance({basedir: 'app/tamplates'}))

		//filter out partials (folders and files starting with "_" )
		.pipe($.filter(function (file) {
			return !/\_/.test(file.path) && !/^_/.test(file.relative);
		}))

		.pipe($.jade({
			locals: jadeData,
			pretty: true
		}))
		.pipe($.beml())
		.pipe($.fileInclude({basepath: 'dist'}))
		.pipe(gulp.dest('dist'))
        .pipe(reload({stream: true}));
});

gulp.task('styles', function () {

		$.rubySass('app/styles', {
			style: 'expanded',
			precision: 10,
			sourcemap: true
		})
		.on('error', function (err) {
			console.error('Error!', err.message);
		})
		.pipe($.postcss([
			require('autoprefixer')({browsers: ['last 1 version']})
		]))
		.pipe($.sourcemaps.write('.'))
		.pipe(gulp.dest('dist/styles'))
		.pipe(reload({stream: true}));
});

gulp.task('scripts', function () {
	return gulp.src(['app/scripts/**/*.js','!app/scripts/modernizr/modernizr.custom.js'])
		.pipe($.filter(function (file) {
			return !/\_/.test(file.path) && !/^_/.test(file.relative);
		}))
		.pipe($.plumber())
		.pipe($.sourcemaps.init())
		.pipe($.babel())
		.pipe($.sourcemaps.write('.'))
		.pipe(gulp.dest('dist/scripts'));
});

gulp.task('jshint', function () {
	return gulp.src('app/scripts/**/*.js')
		.pipe($.plumber())
		.pipe($.jshint())
		.pipe($.jshint.reporter('jshint-stylish'))
		.pipe($.jshint.reporter('fail'));
});

gulp.task('wiredep', function () {
	var wiredep = require('wiredep').stream;

	gulp.src('app/styles/*.scss')
		.pipe(wiredep())
		.pipe(gulp.dest('app/styles'));

	gulp.src('app/*.jade')
		.pipe(wiredep({ignorePath: /^(\.\.\/)*\.\./}))
		.pipe(gulp.dest('app'));
});

gulp.task('serve', $.sync(gulp).sync([['views', 'styles', 'scripts']]), function () {
    browserSync.init(browserSyncConfig);

    // watch for changes
    gulp.watch([
        'dist/scripts/**/*.js',
        'app/images/**/*'
    ]).on('change', reload);

	gulp.watch('app/scripts/**/*.js', ['scripts']);
    gulp.watch('app/styles/**/*.scss', ['styles']);
    gulp.watch('app/**/*.jade', ['views']);
    gulp.watch('app/images/svg/sprites/**/*', ['sprites']);
    gulp.watch('app/images/svg/icons/**/*', ['icons']);
    gulp.watch(['app/images/**/*.{jpg,png}',"!app/images/media/**/*","!app/images/favicons/**/*"], ['img-min']);
    gulp.watch('bower.json', ['wiredep']);
});

gulp.task('watch', function () {
	gulp.start('serve');
});

gulp.task('minify-css', function() {
  return gulp.src('dist/styles/*.css')
    .pipe($.minifyCss({compatibility: 'ie8'}))
    .pipe(gulp.dest('dist/styles/min'));
});