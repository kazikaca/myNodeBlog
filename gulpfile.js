var gulp = require('gulp'),
    nodemon = require('gulp-nodemon'),
    plumber = require('gulp-plumber'),
    livereload = require('gulp-livereload');

var paths = {
    client: [
        'public/**/*.js',
        'public/**/*.html',
        'public/**/*.css'
    ],
    server: {
        index: 'app.js'
    }
};

var nodemonConfig = {
    script: paths.server.index,
    env: {
        "NODE_ENV": "development"
    },
    ext: 'js jade',
    stdout: false
};

gulp.task('develop', function () {
    livereload.listen();
    nodemon(nodemonConfig).on('readable', function () {
        this.stdout.on('data', function (chunk) {
            if(/^Express server listening on port/.test(chunk)){
                livereload.changed(__dirname+'\\app');
            }
        });
        this.stdout.pipe(process.stdout);
        this.stderr.pipe(process.stderr);
    });
});

/*gulp.task('serve', ['livereload'], function() {
    return nodemon(nodemonConfig);
});*/

gulp.task('livereload', function() {
    livereload.listen();
    return gulp.watch(paths.client, function(event) {
        livereload.changed(event.path);
    });
});

// gulp.task('default', ['serve', 'livereload']);
gulp.task('default', ['develop','livereload']);
