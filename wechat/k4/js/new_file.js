
$(function() {

	//图片预加载
	//	function preload(obj,)

	//定义保存图片路径数组
	var preloadImageList = [
		'1.jpg', '2.jpg', '3.jpg', '4.jpg', '5.jpg', '371_1453779101.png', '912_1453779104.png',
		'1093_1453854255.png', '1536_1453779105.png', '2062_1453779100.png', '2115_1453779103.png',
		'2214_1453779105.png', '2407_1453779106.png', '2488_1453779103.png', '2740_1453779102.png',
		'3046_1453779101.png', '3375_1453854403.png', '4169_1453779106.png', '4505_1453779105.png',
		'4536_1453779106.png', '4575_1453779105.png', '4814_1453854252.png', '5844_1453779104.png',
		'5865_1453779098.png', '6240_1453779101.png', '6253_1453779102.png', '7030_1453856838.png',
		'7705_1453779100.png', '8268_1453779103.png', '8279_1453779085.png', '8696_1453854253.png',
		'9228_1453779104.png', 'commen_close.png', 'layer_info_checked.png', 'layer_info_select.jpg',
		'layer_info_submit.png', 'layer_prize.png', 'layer_prize_none.png', 'layer_select_bg.png',
		'page1_btn_next.png', 'page1_btn_pic.png', 'page1_btn_pic_active.png', 'page1_btn_prev.png',
		'page1_btn_share.png', 'page1_btn_video.png', 'page1_btn_video_active.png', 'page1_k4.png',
		'page1_main_bg.jpg', 'page1_nav_active.png', 'page1_tab_bg.jpg', 'page1_top_bg.jpg',
		'page1_video_poster.png', 'page2_bg.jpg', 'page2_btn_intro.png', 'page2_btn_start.png',
		'page3_bg.jpg', 'page3_btn_start.png', 'page3_choosed_bg.png', 'page5_bg.jpg', 'share.jpg',
		'loading_bg.jpg', 'loading_clock.png', 'loading_pointer.png'
	];
	for (var i = 1; i <= 235; i++) {
		preloadImageList.push('video/che_' + i + '.jpg');
	}
	for (var i = 0; i < preloadImageList.length; i++) {
		preloadImageList[i] = 'images/' + preloadImageList[i];
	}

	var loadingDeg = -140;

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
		$("#loading").hide();
		$("#page1").show();
		//细节轮播
		var mySwiper = new Swiper('.swiper-container', {
			autoplay: 3000, //可选选项，自动滑动
			loop: true,
			autoplayDisableOnInteraction: false,
			prevButton: '.swiper-button-prev',
			nextButton: '.swiper-button-next',

		})
		jroll = new JRoll("#wrapper", {
			scrollBarY: false,
			bounce: false,
			scrollY: true,
			scrollX: false

		});
		jroll_1 = new JRoll("#page3", {
			scrollBarY: false,
			bounce: false,
			scrollY: false,
			scrollX: false
		});
	}, function(progress) {
		progress = parseInt(progress * 100);
		var baseDeg = 1.9;
		loadingDeg += (baseDeg * (progress / 100));
		$("#loading .pointer").css('-webkit-transform', 'rotate(' + loadingDeg + 'deg)');
		$("#loading .percent").text('' + progress + '%');
	});

	//		function initScroll( sClass ){
	//		myScroll = new IScroll(sClass,{
	//          vScroll: true,
	//          bounce: true,
	//          checkDOMChanges: true,
	//          resizeScrollbars: true,
	//          click: true
	//      });
	//	}

	//链接点击添加样式
	var lis = $('.nav>li')
	lis.on('click', function() {
			lis.removeClass('nav_active');
			lis.eq($(this).index()).addClass('nav_active')
		})
		//点击链接弹框
	$('.details').click(function() {
		$('#layer1').css('display', 'block')
	})
	$('.list').click(function() {
		$('#layer2').css('display', 'block')
	})
	$('.start_gamble').click(function() {
			$('#layer3').css('display', 'block')
		})
		//开启自定义滚动条
		//	$(".wrapper").mCustomScrollbar({
		//		axis: "y"
		//	});

	$(".scrollWrap1").mCustomScrollbar({
		axis: "y",
	});
	$('.layer').bind(function(e) {
			e.stopPropagation()
		})
		//显示视频选项卡
		//偏移量
		//	var moveX = $(window).height()-
	function showVideo() {
		$('.tab_video').css('display', 'block');
		$('.tab_swiper').css('display', 'none');
		$('.display_video').addClass('video_active');
		$('.display_swiper').removeClass('swiper_active');
		jroll.scrollTo(0, -10000, 0);
	}
	//点击调用
	$('.display_video').click(showVideo)
	$('.display_swiper').click(function() {
		var player = $('#video_play');
		player[0].pause()
		$('.video_poster').css('display', 'block')
		$('.tab_video').css('display', 'none');
		$('.tab_swiper').css('display', 'block');
		$(this).addClass('swiper_active');
		$('.display_video').removeClass('video_active');
	})

	//点击链接调用
	$('.to_video').click(showVideo)
		//点击图片加载视频

	$('.video_poster').click(function() {
		//此处写点击触发的操作
		$(this).css("display", "none");
		var player = $('#video_play');
		player[0].play()
	})

	//点击layer关闭弹框
	$('.close').click(function() {
		$(this.parentElement.parentElement).css('display', 'none')
	})

	//中奖名单轮播
	//	var mySwiper = new Swiper('.list-container', {
	//		direction: 'vertical',
	//		autoplay: 10, //可选选项，自动滑动
	//		loop: true,
	//		onlyExternal : true,
	//		
	//	})

	//城市选择demo

	console.log(data[0])
	var province = data[0];
	for (key in province) {
		$('<option value = ' + key + '>' + province[key] + '</option>').appendTo('select[name=province]');
	}
	var province;
	$('#province').on('change', function() {
		$('select[name=city]').html('<option value="">请选择</option>')
		city = $(this).val();
		var citys = data['0,' + city];
		for (key in citys) {
			$('<option value = ' + key + '>' + citys[key] + '</option>').appendTo('select[name=city]');
		}
	})
	$('#city').on('change', function() {
		$('#saller').html('<option value="">请选择</option>')
		dealer = $(this).val();
		var dealers = data['0,' + city + ',' + dealer];
		console.log(dealers)
		for (key in dealers) {
			$('<option value = ' + key + '>' + dealers[key] + '</option>').appendTo('#saller');
		}
	})

	//	
	//	var province = $('#province');
	//	var city = $('#city');
	//	var oc_1 = [
	//		['请选择', '东城', '西城'],
	//		['请选择', '崇明', '浦东'],
	//		['请选择', '天河', '越秀']
	//	]
	//	console.log()
	//	var ops = province.children()
	//	province.change(function() {
	//		if (oc_1[opSel - 1] < 0) return;
	//		var opSel = $(this).children('option:selected').index()
	//		console.log(oc_1[opSel - 1])
	//		city.html('')
	//		for (var i = 0; i < oc_1[opSel - 1].length; i++) {
	//			console.log(1)
	//			$('<option>', {
	//				html: oc_1[opSel - 1][i]
	//			}).appendTo(city)
	//		}
	//	})

	//表单验证

	$('#submit').click(function() {
		
		if (/^[\u4e00-\u9fa5]+$/.test($('#name').val()));
		else {
			alert('请填写正确中文姓名');
			return;
		}
		if (/^((13|18)(\d{9}))$|^(14[57]\d{8})$|^(17[07]\d{8})$|(^15[0-35-9]\d{8}$)/.test($('#phoneNum').val()));
		else {
			alert('请填写正确中国大陆11位手机号码');
			return;
		}

		if ($('option:selected', '#city').index() > 0);
		else {
			alert('请选择城市');
			return;
		}
		if ($('option:selected', '#saller').index() > 0);
		else {
			alert('请选择经销商');
			return;
		}
		if ($('option:selected', '#car').index() > 0);
		else {
			alert('请选择车型');
			return;
		}
		if ($('option:selected', '#buy_time').index() > 0);
		else {
			alert('请选择购买时间');
			return;
		}
		$('#layer3').css('display', 'none');
		$('#page1').css('display', 'none');
		$('#page2').css('display', 'block')

	})
	$('.page2_bot1').click(function() {
		$(this).parent().hide()
		$('#page3').show()
		$(details[0][0].children[0]).animate({
			left: '2rem'
		})
		$(details[0][0].children[1]).animate({
			right: '1rem'
		})
	})

	//细节展示按钮绑定事件
	var control_btns = $('.show_detials ul li');
	var details = [$('#engine'), $('#airbag'), $('#change'), $('#hac')]
		//点击添加划入划出动画

	control_btns.click(function() {
		if ($(details[0][0].children[0]).is(':animated')) return;
		var ind = $(this).index();
		if (control_btns.eq($(this).index()).hasClass('active')) return;
		control_btns.removeClass('active');
		control_btns.eq($(this).index()).addClass('active');
		move_left(details[ind][0].children[0]);
		move_right(details[ind][0].children[1])
		if (ind == 0) {
			$('#point').css({
				'left': '8rem',
				'bottom': '21rem'
			})
		}
		if (ind == 1) {
			$('#point').css({
				'left': '12rem',
				'bottom': '23rem'
			})
		}
		if (ind == 2) {
			$('#point').css({
				'left': '18rem',
				'bottom': '20rem'
			})
		}
		if (ind == 3) {
			$('#point').css({
				'left': '13rem',
				'bottom': '16rem'
			})
		}

	})

	function move_left(a) {
		for (var i = 0; i < details.length; i++)
			$(details[i][0].children[0]).animate({
				left: '-12rem'
			});
		$(a).animate({
			left: '2rem'
		});
		flag = true
	}

	function move_right(a) {
		for (var i = 0; i < details.length; i++)
			$(details[i][0].children[1]).animate({
				right: '-25rem'
			});
		$(a).animate({
			right: '1rem'
		});
	}

	//小点动画
	var timer;

	timer = setInterval(function() {
			//		console.log(1)
			$('#point').animate({
				height: '2.2rem',
				width: '2.2rem'
			})
			$('#point').animate({
				height: '2rem',
				width: '2rem'
			})
		}, 1000)
		//绑定点击显示画布
	$('.page3_but').click(function() {
		$(this).parent().parent().hide()
		$('#page4').show()
	})
	$('.page2_bot2').click(function() {
		$(this).parent().hide()
		$('#page4').show()
	})
	$('#canvas').attr({
		'width': $(window).width(),
		'height': $(window).height()
	});
	//	console.log($(window).width())
	canW = $(window).width();
	canH = $(window).height();
	//长按播放
	var activeIndex = 0;
	var canvas = document.getElementById('canvas');
	var cxt = canvas.getContext('2d');
	var img = new Image();
	//先绘制一张背景图
	img.src = 'images/video/che_1.jpg';

	img.onload = function() {
		cxt.drawImage(img, 0, 0, canW, canH)
	}

	//将图片路径保存到数组中
	var imageSrcList = [];
	for (var i = 1; i <= 235; i++) {
		var tmp = new Image()
		imageSrcList[i] = tmp;
		tmp.src = 'images/video/che_' + i + '.jpg'
	}
	var timer2;
	var speed = 0.01;
	var end = 1.7;
	var over = 1.2;
	timer2 = setInterval(function() {
		over += speed;
		if (over > end) {
			speed = -speed
		}
		if (over < 1.2) {
			speed = -speed
		}
		$("#car_pointer").css(
			'transform', 'scale(' + over + ')'
		)

	}, 16)

	//点击屏幕开始动画
	var cover = document.getElementById('car_cover')
	cover.addEventListener('touchstart', function() {
		$(this).hide();
		canPlay()
	}, true)

	var last = 0;

	function canPlay() {
		requestId = requestAnimationFrame(canPlay);
		var now = (new Date()).getTime();
		console.log(now)
		if (now - last < 1000 / 16) {
			return;
		}
		last = now;
		activeIndex++;
		if (activeIndex > 235) {
			return;
		}
		cxt.drawImage(imageSrcList[activeIndex], 0, 0, canW, canH)
	}
	canvas.addEventListener('touchstart', function(e) {
		if (activeIndex >= 235) return;
		canPlay();
		e.preventDefault();
	}, false)
	var canOut = document.getElementById('page4');
	page4.addEventListener('touchend', function() {
		cancelAnimationFrame(requestId);
		$('#car_cover').show()
		console.log(activeIndex)
		if (activeIndex >= 235) {
			$('#page4').hide();
			$('#page5').show()
		}
	}, true)

	//	console.log($('html').fontsize())
	//抽奖
	var baseDeg = 360 / 37;
	var tempDeg = 3;
	var tem = [];
	//	for(var i = 0;i<=36;i++){
	//		tem[i] = i
	//	}
	//	console.log(tem)

	//	$('#page5').show()
	var flag = true;
	$('.btn_bet').click(function() {

		if ($('#price_sel').val() == '请选择点数') {
			alert('请先选择点数');
			return
		}
		if (flag == false) return;
		flag = false;
		//没中奖和中奖判断

		//定义保存的数组 依次排序
		var degNum = [31, 9, 22, 18, 29, 7, 28, 12, 35, 3, 26, 0, 32, 15, 19, 4, 21, 2, 25, 17, 34, 6, 27, 13, 36, 11, 30, 8, 23, 10, 5, 24, 16, 33, 1, 20, 14]
			//获取选项的值
		betNum = $('#price_sel').val();
		betNum = parseInt(betNum);

		var obj1 = []
		obj1.unshift(betNum)
		console.log(obj1)
		if (betNum == 0) {
			for (var i = 1; i < 7; i++) {
				obj1.unshift(betNum + i)
			}
		} else {
			for (var i = 1; i < 6; i++) {
				obj1.unshift(betNum + i)
			}
		}

		console.log(obj1)
		for (var i = 0; i < degNum.length; i++) {
			for (var j = 0; j < obj1.length; j++) {
				//				console.log(degNum[i],obj1[j])
				if (degNum[i] == obj1[j]) {
					degNum[i] = 10000;
				}
			}
		}

		//获取随机数
		var randDeg = parseInt(Math.random() * 36);
		console.log(degNum[randDeg])
		var desDeg = 1080 + (randDeg + 1) * baseDeg + tempDeg;
		$('.indicator_container').css({
			'transform': 'rotateZ(' + desDeg + 'deg)',
			'transition': 'all 6s ease-in-out'
		})
		if (degNum[randDeg] == 10000) {
			setTimeout(function() {
				$('#get_prize').show()
			}, 6300)
		}
		if (degNum[randDeg] !== 10000) {
			setTimeout(function() {
				$('#lose_prize').show()
			}, 6300)
		}

	})

	//分享好友
	$('.price_out').click(function() {
		$(this).parent().hide()
	})

	$('.price_btn').click(function() {
		flag = true;
		$('.indicator_container').css({
			'transform': 'rotateZ(' + 3 + 'deg)',
			'transition': 'all 0s ease-in-out'
		})
		$(this).parent().hide()
	})
})