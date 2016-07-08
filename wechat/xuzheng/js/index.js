$(function() {
	//预加载
	function preloadimages(obj, cb) {
		var loaded = 0;
		var toload = 0;
		var images = obj instanceof Array ? [] : {};

		for (var i = 0; i < obj.length; i++) {
			toload++;
			images[i] = new Image();
			images[i].src = obj[i];
			images[i].onload = load;
			images[i].onerror = load;
			images[i].onabort = load;
		}

		function load() {
			if (++loaded >= toload) {
				cb(images);
			}
		}
	}
	//预加载图片路径数组
	var pic_load = ["img/word_bg.jpg", "img/loading_xuzheng.png", "img/loading_txt.png", "img/star.png", "img/star2.png", "img/star4.png", "img/star3.png", "img/star5.png", "img/super_head.png", "img/super_body1.png", "img/super_glasses.png", "img/phone.png", "img/chip1.png", "img/chip2.png", "img/chip3.png", "img/chip4.png", "img/chip5.png", "img/chip6.png", "img/chip7.png", "img/chip8.png", "img/star11.png", "img/star10.png", "img/star5.png", "img/star9.png", "img/star4.png", "img/star6.png", "img/star7.png", "img/star8.png", "img/up.png", "img/baobei.png", "img/bg.jpg", "img/xuzheng.png", "img/color_yan.png", "img/CSSatyr.png", "img/game_info_bt.png", "img/kuang_bg.png", "img/one_guan_pic.png", "img/one_pic1.png", "img/one_pic2.png", "img/one_pic3.png", "img/person_kuang.png", "img/tietou.png", "img/vivo_mobile.png", "img/xuzheng_kuang.png", "img/xuzheng_succ_kuang.png"];

	var ts_before_load = (new Date()).getTime();
	preloadimages(pic_load, function() {
		var f = function() {
			$('#type_sound')[0].play();
			$('#load').hide();
			$('#container').show();
			cover();
			word(0);
		};
		var now = (new Date()).getTime();
		if (now - ts_before_load >= 1000) {
			f();
		} else {
			timer3 = setTimeout(function() {
				f();
			}, 800 - (now - ts_before_load));
		}
	});
	//首页文字
	function word() {
		var word = $('#text_container');
		var wordCountainer = ["公元9025年", "外星人为了争夺", "封印在vivo手机中的神秘能量",
			"发起宇宙战乱", "超人徐峥为了保卫神秘能量", "带着手机来到浩瀚宇宙中",
			"分身成为8个自己", "分别保卫8块手机碎片", "消失在太阳系的八大行星中",
			"据说找齐徐峥的8个分身", "就能启动神秘能量保护地球", "..."
		];
		var num = 0
		timer = setInterval(function() {
			if (num >= wordCountainer.length - 1) {
				$('#type_sound')[0].pause();
				clearInterval(timer);
				$("#text_container").fadeOut(1000);
				$("#star1").animate({
					left: "60%",
					top: "20%",
				}, 'fast');
				$("#star4").animate({
					left: "20%",
					bottom: "20%",
				}, 'fast');
				setTimeout(function() {
					$("#xuzheng").animate({
						left: "0%",
						top: "30%",
					}, 'slow');
				}, 1000)
				setTimeout(function() {
					$("#xuzheng").animate({
						left: "-200%",
						top: "0%",
					}, 'slow');
					$("#star1").hide(4000);
					$("#star2").hide(4000);
					$("#star3").hide(4000);
					$("#star4").hide(4000);
					timer4 = setTimeout(function() {
						phone();
					}, 1200)

				}, 4000)
			}
			$("#text_container").html(word.html() + wordCountainer[num] + "</br>");
			num++;
		}, 600)

	}

	//披风
	function cover() {
		setTimeout(function() {
			$("#body")[0].src = "img/super_body2.png";
			setTimeout(function() {
				$("#body")[0].src = "img/super_body1.png";
				cover()
			}, 300)
		}, 300)
	}
	//音乐控件
	function music() {
		var angle = 0;
		var timer;
		timer = setInterval(function() {
			angle += 3;
			$('#bg_cover').rotate(angle);
		}, 50);
		var num = 0
		$("#bg_cover").click(function() {
			num++;
			if (num % 2 == 1) {
				//				console.log(2)
				$("#bg_sound")[0].pause();
				$("#type_sound")[0].pause();
				$(this).css({
					'background': 'url(img/music_off.png)',
					'background-size': '100% 100%'
				})
				clearInterval(timer);
			} else {
				//				console.log(1)
				$("#bg_sound")[0].play();
				//				$("#type_sound")[0].play();
				$(this).css({
					'background': 'url(img/music_on.png)',
					'background-size': '100% 100%'
				})
				timer = setInterval(function() {
					angle += 3;
					$('#bg_cover').rotate(angle);
				}, 50);;
			}

		});

	}
	music()
		//手机出现
	function phone() {
		$("#phone").show();
		//4秒后隐藏
		setTimeout(function() {
				$("#phone_bg").animate({
					opacity: '0'
				});
			}, 3500)
			//4秒后显示碎片
		setTimeout(function() {
			$(".chip").animate({
				opacity: '1'
			})
			$("#star>img").css({
					opacity: '1'
				})
				//1s后加脑袋，飘逸动画
			setTimeout(function() {
				$(".chip>img").css({
					opacity: 1
				})
				$("#chip1").css({
					right: '-37%',
					top: '-15%',
					'-webkit-transform': 'rotate(60deg)',
					'transform': 'rotate(60deg)'
				})
				$("#chip2").css({
					left: '-26%',
					top: '-18%',
					'-webkit-transform': 'rotate(-30deg)',
					'transform': 'rotate(-30deg)'
				})
				$("#chip3").css({
					top: '-11%',
					left: '3%',
					'-webkit-transform': 'rotate(61deg)',
					'transform': 'rotate(61deg)'
				})
				$("#chip4").css({
					top: '25%',
					left: '77%',
					'-webkit-transform': 'rotate(-13deg)',
					'transform': 'rotate(-13deg)'
				})
				$("#chip5").css({
					top: '28%',
					left: '23%',
					'-webkit-transform': 'rotate(-30deg)',
					'transform': 'rotate(-30deg)'
				})
				$("#chip6").css({
					top: '43%',
					left: '-38%',
					'-webkit-transform': 'rotate(-18deg)',
					'transform': 'rotate(-18deg)'
				})
				$("#chip7").css({
					top: '76%',
					left: '-25%',
					'-webkit-transform': 'rotate(-17deg)',
					'transform': 'rotate(-17deg)'
				})
				$("#chip8").css({
						top: '76%',
						left: '58%',
						'-webkit-transform': 'rotate(15deg)',
						'transform': 'rotate(15deg)'
					})
					//2s后缩放
				setTimeout(function() {
					(function a() {
						setTimeout(function() {
							$("#up").css({
								opacity: '1'
							});
							//							$("#up").click(game())
							setTimeout(function() {
								$("#up").css({
									opacity: '0'
								});
								a()
							}, 1000)
						}, 1000)
					})(1)
					setTimeout(function() {
						$("#up").on('click', function() {
							$("#page1").hide();
							$("#page2").show();
							$("#bg_sound")[0].pause();
							game();
						})
					}, 1500)
					$("#chip1").css({
						'-webkit-animation': 'dis 1s ease forwards',
						'animation': 'dis 1s ease forwards'
					})
					$("#chip2").css({
						'-webkit-animation': 'dis 1s ease forwards',
						'animation': 'dis 1s ease forwards'
					})
					$("#chip3").css({
						'-webkit-animation': 'dis 1s ease forwards',
						'animation': 'dis 1s ease forwards'
					})
					$("#chip4").css({
						'-webkit-animation': 'dis 1s ease forwards',
						'animation': 'dis 1s ease forwards'
					})
					$("#chip5").css({
						'-webkit-animation': 'dis 1s ease forwards',
						'animation': 'dis 1s ease forwards'
					})
					$("#chip6").css({
						'-webkit-animation': 'dis 1s ease forwards',
						'animation': 'dis 1s ease forwards'
					})
					$("#chip7").css({
						'-webkit-animation': 'dis 1s ease forwards',
						'animation': 'dis 1s ease forwards'
					})
					$("#chip8").css({
						'-webkit-animation': 'dis 1s ease forwards',
						'animation': 'dis 1s ease forwards'
					})
				}, 2000)
			}, 1000)

		}, 3000);

	}
	//游戏

	var time = 30.00;
	var timeEnd = 0.00;
	var count = 1;
	var header = ['第一关 水星', '第二关 金星', '第三关 地球', '第四关 火星', '第五关 木星', '第六关 土星', '第七关 天王星', '第八关 海王星'];
	var phoneHeader = [
		['像初恋一样手感的', '双2.5D弧面玻璃'],
		['帮助你防火防盗', '防女友的眼球识别加密系统'],
		['帮你省下单反钱的', '1300万像素镜头'],
		['促进多巴胺分泌的', 'Hi-Fi音质耳放'],
		['可以自动区分女汉子和男妹子的', '知性美颜系统'],
		['快得能让时间变慢的', '八核1.7GHz处理器'],
		['轻松抓拍多动症患者的', 'PDAF快速相应对焦系统'],
		['duang duang duang效果的', 'Funtouch OS系统']
	];
	//	game();
	$("#game_info_close").click(function() {
		$(".game_info_mengban").hide()
	})
	$(".game_two_b").click(function() {

		$(".game_info_mengban").css({
				display: 'block'
			})
			//自定义滚动条
		myscroll = new iScroll("game_info", {
			fixedScrollbar: true,
			hideScrollbar: false,
			bounce: false
		});
		$("#content").next('div').css({
			"background-color": "#6c99a7",
			width: "5px",
			overflow: ''
		});
		$("#content").next('div').children(1).css({
			'background-color': '#c5c5c5',
			width: "8px",
			"margin-left": "-2px"
		})
	});
	$(".try_b").click(function() {
		time = 30.00;
		count = 1;
		game();
		$(".game_false_container").hide()
	});

	function game() {
		//		$("#bg_sound")[0].pause();
		$("#bgsound")[0].play();
		$("#bg_cover").hide();
		$("#tips").hide(2000);
		timer1 = setInterval(function() {
			time -= 0.01;
			//			console.log(time)
			time = time.toFixed(2)
			if (time <= timeEnd) {
				clearInterval(timer);
				gameOver();
			}
			$("#time").html(time.split(".").join(":"))
		}, 10)
		gameMain()
	};

	function gameMain() {
		count++;
		$("#game>h2").html(header[count - 2]);
		//		console.log(count);
		$("#game_wrap").html('')
		if (count <= 4) {
			n = 100 / (count) + '%';
			creat(count, count, n);
		} else if (count == 5 || count == 6) {
			n = 100 / 6 + '%';
			creat(5, 5, '20%')
		} else if (count == 7 || count == 8) {
			n = 100 / 7 + '%';
			creat(6, 6, '16.66667%')
		} else {
			n = 100 / 8 + '%';
			creat(7, 7, '14.28571%')
		}

	}

	function creat(row, n, w) {
		//徐峥的位置
		var bao = random(0, n * n - 1);
		for (var i = 0; i < row; i++) {
			for (var j = 0; j < row; j++) {
				var block = $('<div class="head">' +
					'<img src="img/baobei.png"/>' +
					'</div>');
				$("#game_wrap").append(block);
			}
		}
		$(".head").css({
			width: w
		})
		if (count == 6) {
			for (var i = 0; i < 5; i++) {
				var old = [];
				var iron = random(0, 35, old);
				old.push(iron);
				$(".head").eq(iron).html('<img src="img/tietou.png"/>');
			}
		}
		if (count == 8) {
			for (var i = 0; i < 8; i++) {
				var old = [];
				var iron = random(0, 35, old);
				old.push(iron);
				$(".head").eq(iron).html('<img src="img/tietou.png"/>');
			}

		}
		$(".head").eq(bao).addClass("xu");
		$(".xu").html('<img src="img/xuzheng.png"/>');
		$(".xu").on('click', function() {
			$("#bgsound")[0].pause();
			clearInterval(timer1);
			$(".suipian_wrap").show();
			$(".suipian_wrap").click(function() {
				$("#bgsound")[0].play();
				changIn();
			});
			gameMain();
		})
	}
	//展示完成游戏文字
	var numX = 0;
	var timer2;

	function showText() {
		$(".suipian_wrap").hide();
		clearInterval(timer1);
		clearInterval(timer1);
		$("#game_main").hide();
		$("#game>h2").hide();
		$("#vivo_txt_wrap").css({
			display: 'block'
		});
		var wordText = ['旺德福', '你已集齐徐峥分身', 'vivo X5Pro碎片开始合体', '合体中', '...', '</br>', '</br>'];
		clearInterval(timer2)
		timer2 = setInterval(function() {
			if (numX >= wordText.length - 1) {
				clearInterval(timer2);
				$("#vivo_txt_wrap").fadeOut(800, showPhone());
			}
			var wordOld = $("#vivo_txt_wrap").html()
			console.log(numX)
			$("#vivo_txt_wrap").html(wordOld + '</br>' + wordText[numX]);
			console.log(wordText[numX])
			numX++;
		}, 600);
		setTimeout(function() {
			$(".deb_wrap").css({
				display: 'block'
			});
			showPhone();
		}, 5000);
	}
	//更改游戏内容
	function changIn() {
		$(".suipian_wrap").hide();
		clearInterval(timer1);
		timer1 = setInterval(function() {
			time -= 0.01;
			time = time.toFixed(2)
			if (time <= timeEnd) {
				clearInterval(timer1);
				gameOver();
			}
			$("#time").html(time.split(".").join(":"))
		}, 10);

		switch (count) {
			case 10:
				clearInterval(timer1);
				showText();
				$("#bgsound")[0].pause();
				$("#bgm").hide();
				$("#bg_cover").show();
				$("#bg_sound")[0].play();
				return;
			case 9:
				$(".suipian_pic").css("background-position", "-272px 4px");
				break;
			case 3:
				$(".suipian_pic").css("background-position", "-546px 4px");
				break;
			case 4:
				$(".suipian_pic").css("background-position", "2px 4px");
				break;
			case 5:
				$(".suipian_pic").css("background-position", "-135px 4px");
				break;
			case 6:
				$(".suipian_pic").css("background-position", "3px -129px");
				break;
			case 7:
				$(".suipian_pic").css("background-position", "-140px -129px");
				break;
			case 8:
				$(".suipian_pic").css("background-position", "-286px -129px");
				break;
		}
		$(".suipian_bg>h3").html('你获得' + (count - 1) + '/8碎片');
		$(".suipian_bg>p").html(phoneHeader[count - 2][0]);
		$(".suipian_bg>span").html(phoneHeader[count - 2][1]);

	}
	//游戏结束
	function gameOver() {
		$("#bgsound")[0].pause();
		$("#sound")[0].play();
		clearInterval(timer1);
		if (timer1) {
			$(".game_false_container").css({
				display: 'block'
			})
		}

	}

	function showPhone() {
		$(".deb_one").addClass('ani_one');
		$(".deb_two").addClass('ani_two');
		$(".deb_three").addClass('ani_three');
		$(".deb_four").addClass('ani_four');
		$(".deb_five").addClass('ani_five');
		$(".deb_six").addClass('ani_six');
		$(".deb_seven").addClass('ani_seven');
		$(".deb_eight").addClass('ani_eight');

		setTimeout(function() {
			$(".choose").addClass('animated fadeOut');
		}, 3000)
		setTimeout(function() {
			$(".vivo_phone").animate({
				opacity: '1'
			}, 1000);
		}, 3000);
		$(".game_txt_b").click(function() {
			$(".game_info_mengban").show();
			myscroll = new iScroll("game_info", {
				fixedScrollbar: true,
				hideScrollbar: false,
				bounce: false
			});
			$("#content").next('div').css({
				"background-color": "#6c99a7",
				width: "5px",
				overflow: ''
			});
			$("#content").next('div').children(1).css({
				'background-color': '#c5c5c5',
				width: "8px",
				"margin-left": "-2px"
			})
		});
	}

	$(".draw_b").click(function() {
			$.ajax({
				type: "post",
				url:"http://2.mumuweixintest.applinzi.com/php/prize.php",
                data:{
                    prize:'1'
                },
				success: function(obj) {
					if (obj == 1) {
						$("#color_ribbon").css({
							display:'block'
						});
						$(".draw_mengban").css({
							display:'block'
						});
						$(".sub").click(function() {
							alert('提交成功！')
						})
					} else {
						$(".false_mengban").css({
							display:'block'
						});
						$(".back_b").click(function() {
							location.reload() 
						})
					}
				},
				complete:function(obj){
					if (obj == 1) {
						$("#color_ribbon").css({
							display:'block'
						});
						$("#draw_mengban").css({
							display:'block'
						});
						$(".sub").click(function() {
							alert('提交成功！')
						})
					} else {
						$("#false_mengban").css({
							display:'block'
						});
						$(".back_b").click(function() {
							location.reload() 
						})
					}
				}
			});

		})
})