var gulp = require('gulp'),
    nodemon = require('gulp-nodemon'),
    plumber = require('gulp-plumber'),
    browserSync = require('browser-sync').create(),
    gutil = require('gulp-util'),
    sass = require('gulp-sass'),
    autoprefixer = require('gulp-autoprefixer');

var paths = {
    client: [
        'public/**/*.js',
        'public/**/*.html',
        'public/**/*.css',
        'app/views/**/*.jade'
    ],
    scss: 'public/scss/**/*.scss',
    css: 'public/css',
    server: {
        index: 'app.js'
    }
};

var nodemonConfig = {
    script: paths.server.index
};

gulp.task('livereload', ['sass'], function () {
    nodemon({
        script: nodemonConfig.script,
        ignore: ['public', 'node_modules'],
        env: {
            'NODE_ENV': 'development'
        }
    });
    browserSync.init(null, {
        proxy: 'http://localhost:3000',
        files: paths.client,
        open: true,
        port: 7000
    });
    gulp.watch(paths.scss, ['sass']);
});

var errorHandler = {
    errorHandler: function (e) {
        // 控制台发声,错误时beep一下
        gutil.beep();
        gutil.log(e);
        this.emit('end');
    }
};

gulp.task('sass',function () {
    return gulp.src(paths.scss)
        .pipe(plumber(errorHandler))
        .pipe(sass())
        .pipe(autoprefixer({
            browsers: ['last 2 versions', 'Android >= 4.0', 'ie 6-8', 'ios 7'],
            cascade: true
        }))
        .pipe(gulp.dest(paths.css))
        .pipe(browserSync.reload({stream: true}));
});

gulp.task('default',['livereload']);
