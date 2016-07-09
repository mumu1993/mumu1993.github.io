$(document).ready(function() {
	$(window).resize(function() {
		$(".img-head").height($(".img-head").width())
	})
	$(".img-head").height($(".img-head").width())
//	setInterval(function() {
//		$(".img-head").css({
//			"background": "url(../../img/avatars/4.pic_hd.jpg)",
//			"background-size": "100% 100%"
//		})
//		setTimeout(function() {
//			$(".img-head").css({
//				"background": "url(../../img/avatars/2.pic_hd.jpg)",
//				"background-size": "100% 100%"
//			})
//		}, 2000)
//	}, 4000)
	$(".back_skill").click(function() {
		var a = $(this).next().next();
		if ($(a).is(":visible")) {
			$(this).next().removeClass('trans');
			$(a).fadeOut();
		} else {
			$(this).next().addClass('trans');
			$(".circle-desc").fadeOut();
			$(a).fadeIn();
		}

	})
	$('.port-skills').waypoint(function(d) {
		if (d == 'down') {
			$('nav').addClass('active');
		} else {
			$('nav').removeClass('active');
		}
	}, {
		offset: '15%'
	});
	$('.port-counter').waypoint(function() {
		$(".counter-item .count").countTo();
	}, {
		offset: '85%',
		triggerOnce: true,
	});
	$(".portfolio-item").find("[href='#']").click(function(e) {
		e.preventDefault();
	});
	var selector = "#port-item-wrapper";
	$(function() {
		var mix = $(selector).mixItUp({
			animation: {
				duration: 400,
				effects: 'fade translateZ(-360px) stagger(34ms) translateX(50%) rotateY(50deg)',
				easing: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)'
			},
			selectors: {
				target: '.portfolio-item',
				filter: '.portfolio-item-filter'
			}
		});
	});

	if ($.fn.owlCarousel) {
		$(document).ready(function() {
			$(".port-monials-slider").owlCarousel({
				items: 3,
				autoPlay: true,
				pagination: false,
			});
		});
	}

	$(".nav-toggle").click(function() {
		$("nav").toggleClass("active");
	});
	$(window).scroll(function() {
		if ($(window).scrollTop() > 200 && $(window).innerWidth() <= 769)
			$("nav").addClass('active-mobile');
		else
		if (!$("nav .navbar-collapse").hasClass('in'))
			$("nav").removeClass('active-mobile');
	});
	$(window).resize(function() {
		if ($(window).scrollTop() > 200 && $(window).innerWidth() <= 769)
			$("nav").addClass('active-mobile');
		else
		if (!$("nav .navbar-collapse").hasClass('in'))
			$("nav").removeClass('active-mobile');
	});
	$(".navbar-toggle").click(function() {
		if ($(window).scrollTop() < 200 && $(window).innerWidth() <= 769)
			$("nav").toggleClass('active-mobile');
	});
	$(".pangu").click(function() {
		window.open("http://www.panguweb.cn/")
	})
	$(".jiuyou").click(function() {
		window.open("http://www.pkey.cn/")
	})
	$(".wecheat").click(function() {
		window.open("https://mumu1993.github.io/wechat/")
	})
	$(".dom").click(function() {
		window.open("https://mumu1993.github.io/dom/")
	})
	$(".js").click(function() {
		window.open("https://mumu1993.github.io/js-partice/")
	})
	$(".message").click(function() {
		alert("正在建设中...请耐心等候")
	})
	$(".download").click(function() {
		alert("正在建设中...请耐心等候")
	})
});