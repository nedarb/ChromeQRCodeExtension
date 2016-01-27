// generated on 2016-01-15 using generator-chrome-extension 0.5.1
import gulp from 'gulp';
import gulpLoadPlugins from 'gulp-load-plugins';
import del from 'del';
import runSequence from 'run-sequence';
import {stream as wiredep} from 'wiredep';

const $ = gulpLoadPlugins();

gulp.task('extras', () => {
    return gulp.src([
        'app/*.*',
        'app/_locales/**',
        '!app/scripts.ts',
        '!app/*.json',
        '!app/*.html',
    ], {
            base: 'app',
            dot: true
        }).pipe(gulp.dest('dist'));
});

gulp.task('images', () => {
    return gulp.src('app/images/**/*')
        .pipe($.if($.if.isFile, $.cache($.imagemin({
            progressive: true,
            interlaced: true,
            // don't remove IDs from SVGs, they are often used
            // as hooks for embedding and styling
            svgoPlugins: [{ cleanupIDs: false }]
        }))
            .on('error', function (err) {
                console.log(err);
                this.end();
            })))
        .pipe(gulp.dest('dist/images'));
});

gulp.task('html', () => {
    const assets = $.useref.assets({ searchPath: ['.tmp', 'app', '.'] });

    return gulp.src('app/*.html')
        .pipe(assets)
        .pipe($.sourcemaps.init())
        //.pipe($.if('*.js', $.uglify()))
        .pipe($.if('*.css', $.minifyCss({ compatibility: '*' })))
        .pipe($.sourcemaps.write())
        .pipe(assets.restore())
        .pipe($.useref())
        .pipe($.if('*.html', $.minifyHtml({ conditionals: true, loose: true })))
        .pipe(gulp.dest('dist'));
});

gulp.task('chromeManifest', () => {
    return gulp.src('app/manifest.json')
        .pipe($.chromeManifest({
            buildnumber: true,
            background: {
                target: 'scripts/background.js',
                exclude: [
                    'scripts/chromereload.js'
                ]
            }
        }))
        .pipe($.if('*.css', $.minifyCss({ compatibility: '*' })))
        .pipe($.if('*.js', $.sourcemaps.init()))
        //.pipe($.if('*.js', $.uglify()))
        .pipe($.if('*.js', $.sourcemaps.write('.')))
        .pipe(gulp.dest('dist'));
});

gulp.task('babel-ts', () => {
    var tsProject = $.typescript.createProject('tsconfig.json');
        
    return gulp.src(['app/scripts.ts/**/*.ts', 'app/scripts.ts/**/*.js'])
        .pipe($.sourcemaps.init())
        .pipe($.typescript(tsProject))
        .pipe($.babel({
            //presets: ['es2015']
        }))
        .pipe($.sourcemaps.write('.'))
        .pipe(gulp.dest('app/scripts'));
});

gulp.task('clean', del.bind(null, ['.tmp', 'dist']));

gulp.task('watch', ['babel-ts'], () => {
    $.livereload.listen();

    gulp.watch([
        'app/*.html',
        'app/scripts/**/*.js',
        'app/images/**/*',
        'app/styles/**/*',
        'app/_locales/**/*.json'
    ]).on('change', $.livereload.reload);

    gulp.watch('app/scripts.ts/**/*.ts', ['babel-ts']);
    gulp.watch('bower.json', ['wiredep']);
});

gulp.task('size', () => {
    return gulp.src('dist/**/*').pipe($.size({ title: 'build', gzip: true }));
});

gulp.task('wiredep', () => {
    gulp.src('app/*.html')
        .pipe(wiredep({
            ignorePath: /^(\.\.\/)*\.\./
        }))
        .pipe(gulp.dest('app'));
});

gulp.task('package', function () {
    var manifest = require('./dist/manifest.json');
    return gulp.src('dist/*')
        .pipe($.zip('Chrome Tab QR code extension-' + manifest.version + '.zip'))
        .pipe(gulp.dest('package'));
});

gulp.task('build', (cb) => {
    runSequence(
        'babel-ts', 'chromeManifest',
        ['html', 'images', 'extras'],
        'size', cb);
});

gulp.task('default', ['clean'], cb => {
    runSequence('build', cb);
});
