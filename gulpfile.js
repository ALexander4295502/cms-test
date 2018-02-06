var gulp = require('gulp');

var minify = require('gulp-minifier');

gulp.task('minify', function() {
    return gulp.src('./public/**/*').pipe(minify({
        minify: true,
        minifyHTML: {
            collapseWhitespace: true,
            conservativeCollapse: true,
        },
        minifyJS: {
            sourceMap: true
        },
        minifyCSS: true,
    })).pipe(gulp.dest('./min/'));
});