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
		/*routes: {
			'/bower_components': 'bower_components'
		}*/
	}
};

var jadeData = require('./data.json');

//вставить условие, чтобы писались только нужные файлы, без _
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
	//return gulp.src('app/styles/**/*.scss')
		/*//only pass unchanged *main* files and *all* the partials
		//.pipe($.changed('dist/styles', {extension: '.css'}))
		//filter out unchanged scss files, only works when watching
		.pipe($.if(browserSync.active, $.cached('scss')))

		//find files that depend on the files that have changed
		.pipe($.sassInheritance({dir: 'app/styles/'}))

		//filter out internal imports (folders and files starting with "_" )
		.pipe($.filter(function (file) {
			return !/\_/.test(file.path) || !/^_/.test(file.relative);
		}))*/

		//.pipe($.sourcemaps.init())
		$.rubySass('app/styles', {
			style: 'expanded',
			precision: 10,
			sourcemap: true
		})
		.on('error', function (err) {
			console.error('Error!', err.message);
		})
		.pipe($.postcss([
			require('autoprefixer-core')({browsers: ['last 1 version']})
		]))
		.pipe($.sourcemaps.write('.'))
		.pipe(gulp.dest('dist/styles'))
		.pipe(reload({stream: true}));
});

gulp.task('scripts', function () {
	return gulp.src(['app/scripts/**/*.js','!app/scripts/modernizr/modernizr.custom.js'])
		.pipe($.plumber())
		.pipe($.sourcemaps.init())
		.pipe($.babel())
		.pipe($.sourcemaps.write('.'))
		.pipe(gulp.dest('dist/scripts'));
});

/*gulp.task('sprites', function () {
	return gulp.src('app/images/svg/sprites/!*svg')
		.pipe($.imagemin({
			plugins: [
				{cleanupIDs: false}
			]
		}))
		.pipe($.svgstore({ inlineSvg: true }))
		.pipe(gulp.dest('dist/images/svg'));
});

gulp.task('icons', function () {
	return gulp.src('app/images/svg/icons/*.svg')
		.pipe($.imagemin({
			plugins: [
				{cleanupIDs: false}
			]
		}))
		.pipe(gulp.dest('dist/images/svg/icons'));
});

gulp.task('svg', $.sync(gulp).async(['sprites','icons']));
*/
gulp.task('jshint', function () {
	return gulp.src('app/scripts/**/*.js')
		.pipe($.plumber())
		.pipe($.jshint())
		.pipe($.jshint.reporter('jshint-stylish'))
		.pipe($.jshint.reporter('fail'));
});

/*require('postcss-svg/lib/reload.js')(require);
var postcssInlineSVG = require('postcss-svg');*/

gulp.task('useref', function () {
	var assets = $.useref.assets({searchPath: ['dist',"app","."]});

	//postcssInlineSVG = require.reload('postcss-svg');


	return gulp.src('dist/*.html')
		.pipe(assets)
		.pipe($.if('*.css', $.postcss([
			require('csswring')()
		])))
		.pipe($.if('*.js', $.uglify()))
		.pipe(assets.restore())
		.pipe($.if('*.css', $.postcss([
			//попробывать переделать относительные пути в абсолютные
			require('postcss-url')({url: "inline"})
			/*,
			postcssInlineSVG({
			      paths: ['app'],
			      debug: true,
			      svgo: true,
			      ei: false
			    })*/
		])))
		.pipe($.useref())
		//.pipe($.if('*.html', $.minifyHtml({conditionals: true, loose: true})))
		.pipe(gulp.dest('dist'));
});



gulp.task('img-min', function () {
	return gulp.src(['app/images/**/*.{jpg,png}',"!app/images/media/**/*","!app/images/favicons/**/*"])
		.pipe($.imagemin({progressive: true,interlaced: true}))
		.pipe(gulp.dest('dist/images'));
});

gulp.task('images', function () {
	return gulp.src("dist/images/**/*.*")
		.pipe(gulp.dest("dist/images"));
});

gulp.task('extras', function () {
	return gulp.src([
		'app/*.*',
		'!app/*.jade'
	], {
		dot: true
	}).pipe(gulp.dest('dist'));
});

gulp.task('clean', require('del').bind(null, ['dist', 'dist']));


// inject bower components
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
