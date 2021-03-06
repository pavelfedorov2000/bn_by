import gulp from 'gulp';
import imagemin from 'gulp-imagemin';
import gulpif from 'gulp-if';
import config from './config';

export const images = (cb) => {
    gulp.src('app/images/**/*')
        .pipe(gulp.dest(`${config.dist}/assets/images/`))
        .pipe(gulpif(config.isProd && config.imagesOptimize, imagemin()))
    cb();
};
