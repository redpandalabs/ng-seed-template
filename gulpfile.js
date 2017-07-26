'use strict'

const gulp = require('gulp'),
    sass = require('gulp-sass'),
    concat = require('gulp-concat'),
    uglify = require('gulp-uglify'),
    ngAnnotate = require('gulp-ng-annotate'),
    templateCache = require('gulp-angular-templatecache'),
    watch = require('gulp-watch'),
    webserver = require('gulp-webserver'),
    gzip = require('gulp-gzip'),
    replace = require('gulp-replace')

gulp.task('default', ['compress-css', 'compress-app'])

gulp.task('minify-lib', function() {
    return gulp.src([
            'src/bower_components/ramda/dist/ramda.js',
            'src/bower_components/angular/angular.js',
            'src/bower_components/angular-route/angular-route.js'
        ])
        .pipe(concat('lib.js'))
        .pipe(ngAnnotate())
        .pipe(uglify())
        .pipe(gulp.dest('src'))
})

gulp.task('concat-app', function() {
    return gulp.src([
            'src/app/components.js',
            'src/app/repository.js',
            'src/app/controller/*.js',
            'src/app/routes.js',
            'src/app/globals.js'
        ])
        .pipe(concat('app.js'))
        .pipe(ngAnnotate())
        .pipe(gulp.dest('src'))
})

gulp.task('minify-app', function() {
    return gulp.src([
            'src/app/components.js',
            'src/app/repository.js',
            'src/app/controller/*.js',
            'src/app/routes.js',
            'src/app/globals.js'
        ])
        .pipe(concat('app.js'))
        .pipe(ngAnnotate())
        .pipe(uglify())
        .pipe(gulp.dest('src'))
})


gulp.task('compress-app', ['minify-app', 'concat-templates', 'minify-lib'], function() {
    return gulp.src([
            'src/app.js',
            'src/lib.js',
            'src/templates.js'
        ])
        .pipe(gzip())
        .pipe(gulp.dest('src'))
})

gulp.task('sass', function() {
    return gulp.src([
            'src/bower_components/**/*.scss',
            'src/app/**/*.scss'

        ])
        .pipe(sass().on('error', sass.logError))
        .pipe(concat('lib.css'))
        .pipe(gulp.dest('src/css'))
})

gulp.task('concat-templates', function() {
    return gulp.src('src/app/templates/**/*.html')
        .pipe(templateCache('templates.js', {
            root: 'app/templates',
            module: 'angular-seed-template'
        }))
        .pipe(gulp.dest('src'))
})

gulp.task('concat-css', function() {
    return gulp.src([
            'src/css/overrides.css'
        ])
        .pipe(concat('app.css'))
        .pipe(gulp.dest('src/css'))
})

gulp.task('compress-css', ['sass', 'concat-css'], function() {
    return gulp.src([
            'src/css/app.css',
            'src/css/lib.css'
        ])
        .pipe(gzip())
        .pipe(gulp.dest('src/css'))
})

gulp.task('watch', function() {

    // run all tasks at start
    gulp.start('sass')
    gulp.start('concat-app')
    gulp.start('concat-templates')
    gulp.start('concat-css')


    watch(['src/app/**/*.js', 'src/app/*.js', '!src/app.js', '!src/templates.js'], function() {
        gulp.start('concat-app')
    })

    watch('src/app/templates/**/*.html', function() {
        gulp.start('concat-templates')
    })

    watch(['src/app/**/*.scss', 'src/bower_components/**/*.scss'], function() {
        gulp.start('sass')
    })

    watch(['src/css/*.css', '!src/css/app.css'], function() {
        gulp.start('concat-css')
    })

})

gulp.task('serve', ['watch'], function() {

    var filesToWatch = ['src/app.html', 'src/app.js', 'src/lib.js', 'src/templates.js', 'src/css/app.css']
        .map((fileName) => __dirname + '/' + fileName)

    gulp.src('src')
        .pipe(webserver({
            port: 8081,
            host: 'localhost',
            open: 'http://localhost:8081/app.html',
            livereload: {
                enable: true,
                filter: function(fileName) {
                    var isFileHasValidExtension = fileName.split('.')[1] !== undefined
                    var isFileWatchable = filesToWatch.some(function(fileToWatch) {
                        return fileToWatch === fileName
                    })
                    return isFileHasValidExtension ? isFileWatchable : true
                }
            },
            directoryListing: {
                enable: false,
                path: 'src'
            }
        }))
})
