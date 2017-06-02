var gulp = require('gulp'),
	spritesmith = require('gulp.spritesmith');

//Sprites
gulp.task('sprite', function() {
  var spriteData = gulp.src('..//images/icons/*.png')
		.pipe(spritesmith({
			imgName: 'sprite.png',
			cssName: 'sprites.scss',
			cssFormat: 'scss',
			algorithm: 'binary-tree',// top-down	left-right	diagonal	alt-diagonal	binary-tree
			algorithmOpts: {sort: true},
			cssTemplate: './scss.template.mustache',
			cssPath: '#{$icon-sprite-path}',
			cssOpts: {
				functions: false, //跳过@mixin的输出
				version:new Date().getTime()
			},
			imgOpts:{
				format: 'png', // auto, jpg, png (If auto is used and there is png and jpg in a folder the sprite will be jpg)
				quality: 100 // Quality of the output image
			},
			padding: 8,//合并时两个图片的间距
			cssVarMap: function(sprite) {
				sprite.name = sprite.name.replace(/\s/g,"-");
			}
		}));      

		spriteData.img.pipe(gulp.dest('../images/'));
		spriteData.css.pipe(gulp.dest('../js/src/pages/common/scss/'));
});

gulp.task('default',['sprite']);

