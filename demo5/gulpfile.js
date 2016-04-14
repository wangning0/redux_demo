var gulp = require('gulp');
var webpack = require('gulp-webpack');
var rimraf = require('gulp-rimraf');
var runSequence = require('run-sequence');
var WebpackConfig = require('./webpack.config.js');
var Webpack = require('webpack');
var WebpackDevServer = require('webpack-dev-server');
var gutil = require('gulp-util');

gulp.task('pro_build', function() {
	return gulp.src('./app/index.js')
		.pipe(webpack(WebpackConfig))
		.pipe(gulp.dest('./build/'))
});
gulp.task('clean', function() {
	gulp.src('./build', {
			read: false
		})
		.pipe(rimraf());

	return gulp.src('./server', {
			read: false
		})
		.pipe(rimraf());
});
gulp.task('dev_build', function(cb) {
	new WebpackDevServer(Webpack(WebpackConfig), {
		contentBase: __dirname + './app/',
		hot: true,
		historyApiFallback: true,
	}).listen(8080, 'localhost', function(err) {
		if (err) throw new gutil.PluginError('webpack-dev-server', err);
		gutil.log('[webpack-dev-server]', 'http://example.com:8080');
	});
});
gulp.task('pro', function() {
	runSequence('clean', 'pro_build');
})
gulp.task('dev', function() {
	runSequence('clean', 'dev_build');
});