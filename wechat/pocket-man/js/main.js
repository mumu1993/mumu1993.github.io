$(function() {
	// 定义变量
	$('.details-unlight').hide();
	$(".details").hide();

	// 音乐
	$(".music-play").on('click', function(event) {
		event.preventDefault();
		$(this).hide();
		$("audio")[0].pause();
		return false;
	});
	$(".music-pause").on('click', function(event) {
		event.preventDefault();
		$(".music-play").show();
		$("audio")[0].play();
		return false;
	});
	// 图片预加载
	function preloadimages(obj, complete_cb, progress_cb) {
		var loaded = 0;
		var toload = 0;
		var images = obj instanceof Array ? [] : {};
		toload = obj.length;
		for (var i = 0; i < obj.length; i++) {
			images[i] = new Image();
			images[i].src = obj[i];
			images[i].onload = load;
			images[i].onerror = load;
			images[i].onabort = load;
		}
		if (obj.length == 0) {
			complete_cb(images);
		}

		function load() {
			++loaded;
			if (progress_cb) {
				progress_cb(loaded / toload);
			}
			if (loaded >= toload) {
				complete_cb(images);
			}
		}
	}
	var preloadImageList = [];
	if( $('div').length > 0 ){
		$.each($('div'), function(index, val) {
			var img = $(val).css('background-image').replace( /^url\((['"]?)(.*)\1\)$/ , '$2' );
			img = $.trim(img);
			if( img  && img.match(/[^/]+(jpg|png|gif)$/)  ){
				preloadImageList.push( img );
			}
		});
	}
	if( $('img').length > 0 ){
		$.each($('img'), function(index, val) {
			var img = $(val).attr('src');
			if( img && img.match(/[^/]+(jpg|png|gif)$/) ){
				preloadImageList.push( img );
			}
		});
	}
	if( roomID ){
		for (var i = 0; i < 6 ; i++) {
			preloadImageList.push( 'img/'+roomID+'/0'+i+'.jpg' );
		}
	}
	preloadImageList.push( 'img/ns/xiaos.png' );
	preloadImageList.push( 'img/ns/song.png' );
	preloadImageList.push( 'img/ns/gao.png' );
	preloadImageList.push( 'img/ns/cui.png' );
	preloadImageList.push( 'img/ns/li.png' );
	preloadImageList.push( 'img/ns/liu.png' );
	preloadImageList.push( 'img/ns/liu2.png' );
	preloadImageList.push( 'img/ns/tong.png' );
	preloadImageList.push( 'img/ns/huang2.png' );
	preloadImageList.push( 'img/ns/wu.png' );
	preloadimages(preloadImageList, function() {
		imageLoaded = true;
		starShow();
	}, function(progress) {});

	$(".btn-close").click(function(event) {
		$(this).parent().hide();
	});
	// 获奖
	
	// 文字轮播

	// 投球
	function ball(argument) {
		$(".ball").click(function(event) {
			var par = $(this).parent();
			var self = $(this);
			if (flagBall == false) {
				return;
			} else {
				$(this).addClass('throw');
				flagBall = false;
			}
			setTimeout(function(argument) {

				self.removeClass("throw");

				$(self).appendTo(par);
				ball();
				flagBall = true;
			}, 1000);
			$(par).show();
		});

	}
	ball();
	$('body').on('click','.photoshow', function(event) {
		event.preventDefault();
		$(this).hide();
	});
	//tab切换
	$(".head").click(function () {
		$(".details").hide();
		console.log($(this).index()-1)
		console.log($(".details"))
		$(".details").eq($(this).index()-2).show();
	})
	// 查看图鉴
	// 邀请男神
	$(".description").click(function(event) {
		$(".page-266").show();
	});
	// function inviteMan(argument) {
	// 	$(".page-265").show();
	// 	$(".invite").click(function(event) {
	// 		$(".page").hide();
	// 		$(".page-263").show();
	// 	});

	//}
	$(".share").click(function(argument) {
		$(".page-269").show();
	});
	$(".page-269").on('click', function(event) {
		$(this).hide();
	});
})