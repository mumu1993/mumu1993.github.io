$(function() {
	//预加载
	var preloadImageList = [
		'shelf_bg.png','lamp.png', 'all_page_bg.png', 'heart', 'heart1', 'next_btn.jpg', 'page1_btn.png', 'page2_btn.png', 'scroll_btn.png', 'test_text.png', 'page1_bg.png', 'page2_bg.png', 'scoll_1-3.bg.png', 'scoll_4-5.bg', 'scoll_5-6.bg.png', 'shelf.png', 'sign_check_22.834951456311px_1185685_easyicon.net.png', 'sofa.png', 'test_bg.png', 'bg1.png', 'page1_btn.png', 'p2_shou.png', 'head1.png', 'head2.png', 'head3.png', 'head4.png', 'header.png', 'song.png', 'face.png', 'demond.png'
	];
	for (var i = 0; i < preloadImageList.length; i++) {
		preloadImageList[i] = 'img/' + preloadImageList[i];
	}

	function preload(obj, complete_cb, progress_cb) {
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
		//如果数组长度为0，立即执行完成函数
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
	preload(preloadImageList, function() {
		$("#caseBlanche").hide();
		$("#page1").show();
	}, function(progress) {
		progress = parseInt(progress * 100);
		$("#load p").text('' + progress + '%');
	});
	var angle = 0;
	var speed = 1;
	setInterval(function() {
		
		if(angle>=10||angle<=-10){
			speed = -speed
		}
		angle += speed;
		$('#head').rotate(angle);
	}, 50);

	$('#confirm').on('click', function() {
		$('#page1').hide();
		$('#container').show();
		//		jroll = new JRoll("body", {
		//			scrollBarY: false,
		//			bounce: true,
		//			scrollX: false,
		//	
		//		});
		$('#page2').show()

	})

	var rem = $(window).width() / 32;
	console.log(13 * rem)
	touch.on('#lamp', 'touchstart', function(ev) {
		$("#hand").hide();
		//		jroll.disable();
		ev.preventDefault();
	});

	var target = document.getElementById("lamp");
	var dx, dy;
	var flag1 = false;
	var flag2 = false;
	var flag3 = false;

	touch.on('#lamp', 'drag', function(ev) {
		ev.preventDefault();

		//		if (target.style.left == '24rem') {
		//			return
		//		}

		dx = dx || 0;
		dy = dy || 0;

		var offx = dx + ev.x + "px";
		var offy = dy + ev.y + "px";
		console.log("当前x值为:" + offx + ", 当前y值为:" + offy + ".");
		var offxx = dx + ev.x;
		var offyy = dy + ev.y;
		if (Math.abs(offyy) >= 8 * rem && Math.abs(offyy) <= 12 * rem) {
			//			this.style.webkitTransform = "translate3d(" + 0 + "," + 0 + ",0)";
			//			target.style.left = '24rem';
			//			target.style.bottom = '14rem';
			flag1 = true;
			//			return
		}

		this.style.webkitTransform = "translate3d(" + offx + "," + offy + ",0)";
	});

	touch.on('#lamp', 'dragend', function(ev) {

		dx += ev.x;
		dy += ev.y;
	});

	touch.on('#shelf', 'touchstart', function(ev) {
		$("#hand").hide();
		//		jroll.disable();
		ev.preventDefault();
	});

	var target0 = document.getElementById("shelf");
	var dx0, dy0;

	touch.on('#shelf', 'drag', function(ev) {
		ev.preventDefault();
		//		if (target0.style.left == '4rem') {
		//			return
		//		}

		dx0 = dx0 || 0;
		dy0 = dy0 || 0;
		console.log("当前x值为:" + dx0 + ", 当前y值为:" + dy0 + ".");
		var offx = dx0 + ev.x + "px";
		var offy = dy0 + ev.y + "px";
		var offyy = dy0 + ev.y;
		if (Math.abs(offyy) >= 8 * rem && Math.abs(offyy) <= 12 * rem) {
			//			this.style.webkitTransform = "translate3d(" + 0 + "," + 0 + ",0)";
			//			target0.style.left = '4rem';
			//			target0.style.bottom = '14rem';
			flag2 = true;
			//			return
		}
		this.style.webkitTransform = "translate3d(" + offx + "," + offy + ",0)";
	});

	touch.on('#shelf', 'dragend', function(ev) {
		dx0 += ev.x;
		dy0 += ev.y;
	});

	touch.on('#sofa', 'touchstart', function(ev) {
		$("#hand").hide();
		//		jroll.disable();
		ev.preventDefault();
	});

	var target1 = document.getElementById("sofa");
	var dx1, dy1;

	touch.on('#sofa', 'drag', function(ev) {
		ev.preventDefault();
		//		if (target1.style.left == '10rem') {
		//			return
		//		}
		dx1 = dx1 || 0;
		dy1 = dy1 || 0;
		console.log("当前x值为:" + dx1 + ", 当前y值为:" + dy1 + ".");
		var offx = dx1 + ev.x + "px";
		var offy = dy1 + ev.y + "px";
		var offyy = dy1 + ev.y;
		if (Math.abs(offyy) >= 8 * rem && Math.abs(offyy) <= 12 * rem) {
			//			this.style.webkitTransform = "translate3d(" + 0 + "," + 0 + ",0)";
			//			target1.style.left = '10rem';
			//			target1.style.bottom = '14rem';
			flag3 = true;
			//			return
		}
		this.style.webkitTransform = "translate3d(" + offx + "," + offy + ",0)";
	});

	touch.on('#sofa', 'dragend', function(ev) {
		dx1 += ev.x;
		dy1 += ev.y;
	});

	setInterval(function() {
		if (flag1 == true && flag2 == true && flag3 == true) {
			setTimeout(function() {
				if ($("#page3").css('display') == 'block') {
					return;
				};
				//			jroll.enable();
				$("#page2").hide();
				$("#page3").show();
				a = [0, 1, 2, 3];
				var start = parseInt(Math.random() * 3)
				first = a[start];
				a.splice(start, 1)
				console.log(first)
				$('.content').eq(first).show();
				var p = $('.content p').eq(first).html();
				$('.content p').eq(first).html('一、' + p);
			}, 2000)

			// $('#page3 .content').eq(parseInt(Math.random()*5)).show();
		}
	}, 100)

	$("li").on('click', function() {
		$('li').removeClass('check');
		$('li').css('color', 'black')
		$(this).addClass('check')
		$(this).css('color', 'darkgray')
	})
	var times = 0;
	var grades = 0;
	$(".button").on('click', function() {
		if (!$('li').hasClass('check')) {
			return
		}
		if (times == 0) {
			times++;
			if ($('li.check').hasClass('gra')) {
				grades += 1;
			};
			if ($('li.check').hasClass('grb')) {
				grades += 2;
			};
			if ($('li.check').hasClass('grc')) {
				grades += 3;
			};
			var start = parseInt(Math.random() * 2)
			second = a[start];
			a.splice(start, 1)
			$('li.check').removeClass('check')
			$(".content").eq(first).hide();
			$('.content').eq(second).show();
			var p = $('.content p').eq(second).html();
			$('.content p').eq(second).html('二、' + p);
			return;
		}
		if (times == 1) {
			times++;

			if ($('li.check').hasClass('gra')) {
				grades += 1;
			};
			if ($('li.check').hasClass('grb')) {
				grades += 2;
			};
			if ($('li.check').hasClass('grc')) {
				grades += 3;
			};
			$('li.check').removeClass('check')
			$(".content").hide();
			var start = parseInt(Math.random() * 2)
			third = a[start];
			a.splice(start, 1)
			$('li.check').removeClass('check')
			$(".content").eq(second).hide();
			// $('.content').eq(third).show();
			var p = $('.content p').eq(4).html();
			$('.content p').eq(4).html('三、' + p);
			$('.content').eq(4).show();

			return;
		}
		if (times == 2) {
			if ($('li.check').hasClass('gra')) {
				grades += 1;
			};
			if ($('li.check').hasClass('grb')) {
				grades += 2;
			};
			if ($('li.check').hasClass('grc')) {
				grades += 3;
			};
			if (grades <= 3) {
				$('#page3').hide();
				$('#page4').show();
			}
			if (grades <= 5 && grades > 3) {
				$('#page3').hide();
				$('#page5').show();
			}
			if (grades >= 6) {
				$('#page3').hide();
				$('#page6').show();
			}
		}
	})

	$(".but").on('click', function() {
		window.location.href = 'http://www.525j.com.cn/Trans.aspx?sourceSalesMan=weixinTG51&url=http://m.525j.com.cn/ajzx/home_5.shtml'
	})
})