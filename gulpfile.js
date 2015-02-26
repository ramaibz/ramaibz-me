'use strict';

var gulp = require('gulp');
var x = require('gulp-load-plugins')();
var bs = require('browser-sync');
var env = 'production';

var src = {
  vendorCss: [
    'vendor/bootstrap/dist/css/bootstrap.css'
  ],
  vendorJs: [
    'vendor/jquery/dist/jquery.js',
    'vendor/modernizr/modernizr.js',
    'vendor/angular/angular.js',
    'vendor/angular-animate/angular-animate.js',
    'vendor/angular-resource/angular-resource.js',
    'vendor/angular-ui-router/release/angular-ui-router.js',
    'vendor/bootstrap/dist/js/bootstrap.js'
  ]
}

gulp.task('glyphfont', function() {
  return gulp.src('vendor/bootstrap/dist/fonts/**')
    .pipe(gulp.dest('dist/assets/fonts/'))
})

// loaded plugin
// -- clean
gulp.task('clean', function() {
  return gulp.src('dist', { read: false })
    .pipe(x.clean({ force: true }));
});

// -- flatten
gulp.task('views', function() {
  return gulp.src('frontend/views/*.html')
    .pipe(x.flatten())
    .pipe(gulp.dest('dist/views/'))
    .pipe(bs.reload({ stream: true }));
});

// -- flatten
gulp.task('partials', function() {
  return gulp.src('frontend/views/partials/**/*.html')
    .pipe(x.flatten())
    .pipe(gulp.dest('dist/views/partials/'))
    .pipe(bs.reload({ stream: true }));
});

gulp.task('build-html', ['views', 'partials'], function() {
  return gulp.src(['dist/views/*.html', 'dist/views/partials/*.html'])
    .pipe(x.minifyHtml({ empty: true }))
    .pipe(gulp.dest('dist/views/minified/'));
});

// -- flatten, concat, minify-css, rename
gulp.task('vendor-css', function() {
  var dest = 'dist/assets/css/';
  return gulp.src(src.vendorCss)
    .pipe(x.flatten())
    .pipe(x.concat('vendor.css'))
    .pipe(gulp.dest(dest))
    .pipe(x.minifyCss())
    .pipe(x.rename({ suffix: '.min' }))
    .pipe(gulp.dest(dest))
    .pipe(x.gzip())
    .pipe(gulp.dest(dest))
});

// -- concat, uglify, rename
gulp.task('vendor-js', function() {
  var dest = 'dist/assets/js/';
  return gulp.src(src.vendorJs)
    .pipe(x.concat('vendor.js'))
    .pipe(gulp.dest(dest))
    .pipe(x.uglify({ mangle: false }))
    .pipe(x.rename({ suffix: '.min' }))
    .pipe(gulp.dest(dest))
    .pipe(x.gzip())
    .pipe(gulp.dest(dest));
});

// -- flatten, sass, autoprefixer, concat
gulp.task('serve-app-css', function() {
  var dest = 'frontend/css/';
  return gulp.src('frontend/scss/*.scss')
    .pipe(x.plumber())
    .pipe(x.changed(dest))
    .pipe(x.sass())
    .pipe(x.autoprefixer('last 2 versions', '> 5%'))
    .pipe(gulp.dest(dest))
});

gulp.task('build-app-css', ['serve-app-css'], function() {
  var dest = 'dist/assets/css/';
  return gulp.src('frontend/css/*.css')
    .pipe(x.plumber())
    .pipe(x.concat('app.css'))
    .pipe(gulp.dest(dest))
    .pipe(x.minifyCss())
    .pipe(x.rename({ suffix: '.min' }))
    .pipe(gulp.dest(dest))
    .pipe(x.gzip())
    .pipe(gulp.dest(dest))
    .pipe(bs.reload({ stream: true }));
});

gulp.task('serve-app-js', function() {
  return gulp.src(['frontend/angular/*.js', 'frontend/angular/**/*.js'])
    .pipe(x.plumber())
    .pipe(x.concat('app.js'))
    .pipe(gulp.dest('frontend/js/'))
    .pipe(gulp.dest('dist/assets/js'))
});

gulp.task('build-app-js', ['serve-app-js'], function() {
  var dest = 'dist/assets/js/';
  return gulp.src('frontend/js/*.js')
    .pipe(x.plumber())
    .pipe(x.uglify({ mangle: false }))
    .pipe(x.rename({ suffix: '.min' }))
    .pipe(gulp.dest(dest))
    .pipe(x.gzip())
    .pipe(gulp.dest(dest))
    .pipe(bs.reload({ stream: true }));
});

gulp.task('img-opt', function() {
  return gulp.src('imgs/**/*.{jpg,png}')
    .pipe(x.imagemin({
      progressive: true
    }))
    .pipe(gulp.dest('dist/assets/imgs/'))
});

gulp.task('img-thumbnail', function() {
  return gulp.src('imgs/**/*.{jpg,png}')
    .pipe(x.sharp({
      resize: [150,150],
      max: true,
      progressive: true
    }))
    .pipe(gulp.dest('dist/assets/thumbnail/'))
})

gulp.task('data', function() {
  return gulp.src('data/portfolio.json')
    .pipe(gulp.dest('dist/assets/'))
    .pipe(bs.reload({ stream: true }));
})

gulp.task('nodemon', function() {
  return x.nodemon({
    script: 'server.js',
    env: { NODE_ENV: env }
  })
})

gulp.task('browser-sync', function() {
  bs({
    proxy: 'localhost:1122',
    port: '1133'
  })
})

gulp.task('spy', function() {
  gulp.watch('frontend/views/*.html', ['views']);
  gulp.watch('frontend/views/partials/*.html', ['partials']);
  gulp.watch('frontend/scss/*.scss', ['build-app-css']);
  gulp.watch(['frontend/angular/*.js', 'frontend/angular/**/*.js'], ['build-app-js']);
  gulp.watch('imgs/**/*.{jpg,png}', ['img-opt', 'img-thumbnail']);
  gulp.watch('data/portfolio.json', ['data']);
});

gulp.task('shazam', ['clean'], function() {
  return gulp.start(['vendor-js', 'build-app-js', 'vendor-css', 'build-app-css', 'build-html', 'glyphfont', 'img-opt', 'img-thumbnail', 'data']);
});
gulp.task('default', ['browser-sync', 'nodemon', 'spy']);
