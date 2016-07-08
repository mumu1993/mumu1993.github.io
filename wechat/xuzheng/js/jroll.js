/*! JRoll v1.2.1 ~ (c) 2015 Author:jlong, Email:jlong@chjtx.com Website:http://www.chjtx.com/JRoll/ */
;(function (window, document, Math) {
	"use strict";
	var JRoll;
	var rAF = window.requestAnimationFrame || window.webkitRequestAnimationFrame || function (callback) {
		setTimeout(callback, 16);
	};
	var sty = document.createElement('div').style;
	var tSF = ("transform" in sty) ? "transform" : "-webkit-transform";
	var tSD = ("transitionDuration" in sty) ? "transition-duration" : "-webkit-transition-duration";
	var isMobile = /mobile|phone|android|pad/.test(navigator.userAgent.toLowerCase());
	var isAndroid = /Android/.test(navigator.userAgent);
	var jrollMap = {}; //保存所有JRoll对象

	//计算相对位置，a相对于b的位置
	function computePosition(a, b) {
		var left = 0,
				top = 0;
		while (a) {
			left += a.offsetLeft;
			top += a.offsetTop;
			a = a.offsetParent;
			if (a === b) {
				a = null;
			}
		}
		return {
			left : left,
			top : top
		};
	}

	//一层一层往上查找已实例化的jroll
	function findScroller(el) {
		var id;
		while (el !== document && el.tagName !== "TEXTAREA") {
			id = el.getAttribute("jroll-id");
			if (id) {
				return jrollMap[id];
			}
			el = el.parentNode;
		}
		return null;
	}

	function _touchstart(e) {
		var jroll = findScroller(e.target);
		if (jroll) {
			JRoll.jrollActive = jroll;
			jroll._start(e);
		} else {
			JRoll.jrollActive = null;
		}
	}

	function _touchmove(e) {
		if (JRoll.jrollActive) {
			JRoll.jrollActive._move(e);
		}
	}

	function _touchend() {
		if (JRoll.jrollActive) {
			JRoll.jrollActive._end();
		}
	}

	function _wheel(e) {
		if (JRoll.jrollActive) {
			JRoll.jrollActive._wheel(e);
		}
	}

	function _focusin(e) {
		var jroll = findScroller(e.target);
		if (jroll) jroll._focusin(e);
	}

	function _focusout(e) {
		var jroll = findScroller(e.target);
		if (jroll) jroll._focusout();
	}

	function _resize() {
		setTimeout(function() {
			for (var i in jrollMap) {
				jrollMap[i].refresh();
				jrollMap[i].scrollTo(jrollMap[i].x, jrollMap[i].y);
			}
		}, 600);
	}

	if (isMobile) {
		document.addEventListener("touchstart", _touchstart, false);
		document.addEventListener("touchmove", _touchmove, false);
		document.addEventListener("touchend", _touchend, false);
		document.addEventListener("touchcancel", _touchend, false);
	} else {
		document.addEventListener("mousedown", _touchstart, false);
		document.addEventListener("mousemove", _touchmove, false);
		document.addEventListener("mouseup", _touchend, false);
		document.addEventListener("mousewheel", _wheel, false);
	}
	window.addEventListener("resize", _resize, false);
	window.addEventListener("orientationchange", _resize, false);

	//监听表单事件，以调整窗口变化
	if (isAndroid) {
		document.addEventListener("focusin", _focusin, false);
		document.addEventListener("focusout", _focusout, false);
	}

	JRoll = function(el, options) {
		var me = this;
		me.wrapper = typeof el === 'string' ? document.querySelector(el) : el;
		me.scroller = options && options.scroller ? (typeof options.scroller === 'string' ? document.querySelector(options.scroller) : options.scroller) : me.wrapper.children[0];

		//防止重复多次new JRoll
		if (me.scroller.jroll) {
			me.scroller.jroll.refresh();
			return me.scroller.jroll;
		} else {
			me.scroller.jroll = me;
		}
		
		//scrollFree和bounce同时为true时发出警告
		if (options.scrollFree && options.bounce) {
			window.console.warn("为不影响滑动效果，请勿将scrollFree和bounce同时置为true!");
		}

		//计算wrapper相对document的位置
		me.wrapperOffset = computePosition(me.wrapper, document.body);

		//创建ID
		me.id = (options && options.id) || me.scroller.getAttribute("jroll-id") || "jroll_" + Math.random().toString().substr(2, 8);

		//保存jroll对象
		me.scroller.setAttribute("jroll-id", me.id);
		jrollMap[me.id] = me;

		//默认选项
		me.options = {
			scroll : true, //使能滑动
			scrollX : true,
			scrollY : true,
			scrollFree : false, //自由滑动
			zoom : false, //使能缩放
			zoomMin : 1, //最小缩放倍数
			zoomMax : 4, //最大缩放倍数
			bounce : false, //回弹
			scrollBarX : false, //开启x滚动条
			scrollBarY : false, //开启y滚动条
			scrollBarFade : false, //滚动条使用渐隐模式
			preventDefault : true, //禁止touchmove默认事件
			momentum : true, //滑动结束平滑过渡
			autoStyle: true, //自动为wrapper和scroller添加样式
			g : 0.0008, //模拟重力加速度,g值越小，运动时间越长
			adjustTop: 190 //安卓手机输入表单时自动调整输入框位置
		};

		for (var i in options) {
			if (i !== "scroller") {
				me.options[i] = options[i];
			}
		}

		if (me.options.autoStyle) {
			//将wrapper设为relative
			if (window.getComputedStyle(me.wrapper).position === "static") {
				me.wrapper.style.position = "relative";
			}
			me.wrapper.style.overflow = "hidden";
			me.scroller.style.minHeight = "100%";
		}

		me.x = 0;
		me.y = 0;
		me.status = null; //手势状态，null | 'start' | 'end' | 'scroll' | 'zoom'
		me.scrollBarX = null; //x滚动条
		me.scrollBarY = null; //y滚动条

		me._scroll = {
			startX : 0,
			startY : 0,
			endX : 0,
			endY : 0,
			lockX : false,
			lockY : false
		};

		me._zoom = {
			spacing : 0, //两指间间距
			scale : 1,
			startScale : 1
		};

		me._event = {
			"scrollStart" : [],
			"scroll" : [],
			"scrollEnd" : [],
			"zoomStart" : [],
			"zoom" : [],
			"zoomEnd" : [],
			"refresh" : []
		};

		//添加scrollStart默认事件
		me._event.scrollStart.push(me._defaultScrollStart);
		//添加scroll默认事件
		me._event.scroll.push(me._defaultScroll);
		//添加scrollEnd默认事件
		me._event.scrollEnd.push(me._defaultScrollEnd);

		me.refresh();

	};

	JRoll.jrollMap = jrollMap;

	JRoll.prototype = {

		//开启
		enable : function() {
			var me = this;
			me.scroller.setAttribute("jroll-id", me.id);
			return me;
		},

		//关闭
		disable : function() {
			var me = this;
			me.scroller.removeAttribute("jroll-id");
			return me;
		},

		//销毁
		destroy : function() {
			var me = this;
			delete jrollMap[me.id];
			delete me.scroller.jroll;
			me.disable();
			me.scroller.style[tSF] = "";
			me.scroller.style[tSD] = "";
			me.prototype = null;
			for (var i in me) {
				if (me.hasOwnProperty(i)) {
					delete me[i];
				}
			}
		},

		//替换对象
		call : function(target, e) {
			var me = this;
			me._scroll.lockX = false;
			me._scroll.lockY = false;
			me.status = "end";
			me.scrollTo(me.x, me.y);
			JRoll.jrollActive = target;
			if(e) target._start(e);
			return target;
		},

		refresh : function() {
			var me = this, temp;
			me.wrapperWidth = me.wrapper.clientWidth;
			me.wrapperHeight = me.wrapper.clientHeight;

			me.scrollerWidth = Math.round(me.scroller.offsetWidth * me._zoom.scale);
			me.scrollerHeight = Math.round(me.scroller.offsetHeight * me._zoom.scale);

			me.maxScrollX = me.wrapperWidth - me.scrollerWidth;
			me.maxScrollY = me.wrapperHeight - me.scrollerHeight;

			if (me.maxScrollX >= 0) {
				if (!me.options.bounce) {
					me._scroll.lockX = true;
				}
				me.maxScrollX = 0;
			} else {
				me._scroll.lockX = false;
			}
			if (me.maxScrollY >= 0) {
				if (!me.options.bounce) {
					me._scroll.lockY = true;
				}
				me.maxScrollY = 0;
			} else {
				me._scroll.lockY = false;
			}

			me._scroll.endX = me.x;
			me._scroll.endY = me.y;

			//x滚动条
			if (me.options.scrollBarX) {
				if (!me.scrollBarX) {
					temp = me._createScrollBar("jroll-xbar", "jroll-xbtn", false);
					me.scrollBarX = temp[0];
					me.scrollBtnX = temp[1];
				}
				me.scrollBarScaleX = me.wrapper.clientWidth / me.scrollerWidth;
				me.scrollBtnX.style.width = Math.round(me.scrollBarX.clientWidth * me.scrollBarScaleX) + "px";
			} else if (me.scrollBarX) {
				me.wrapper.removeChild(me.scrollBarX);
				me.scrollBarX = null;
			}
			//y滚动条
			if (me.options.scrollBarY) {
				if (!me.scrollBarY) {
					temp = me._createScrollBar("jroll-ybar", "jroll-ybtn", true);
					me.scrollBarY = temp[0];
					me.scrollBtnY = temp[1];
				}
				me.scrollBarScaleY = me.wrapper.clientHeight / me.scrollerHeight;
				me.scrollBtnY.style.height = Math.round(me.scrollBarY.clientHeight * me.scrollBarScaleY) + "px";
			} else if (me.scrollBarY) {
				me.wrapper.removeChild(me.scrollBarY);
				me.scrollBarY = null;
			}

			me._execEvent("refresh");

			return me;
		},

		_focusin: function(e) {
			var me = this;
			setTimeout(function() {
				var pos, m;
				me.refresh();
				pos = computePosition(e.target, me.wrapper);
				m = pos.top + me.y;
				if (m > me.options.adjustTop) {
					me.scrollTo(me.x, me.y - m + me.options.adjustTop, 400);
				}
			}, 600);
		},

		_focusout: function() {
			var me = this;
			setTimeout(function() {
				me.refresh();
				me.scrollTo(me.x, me.y, 400);
			}, 600);  //android有些比较迟钝的浏览器软键盘收起需要600ms
		},

		_scrollTo : function (x, y) {
			this.scroller.style[tSF] = "translate(" + x + "px, " + y + "px) translateZ(0) scale(" + this._zoom.scale + ")";
		},

		//供用户调用的scrollTo方法
		scrollTo : function(x, y, timing) {
			var me = this;
			me._scroll.endX = me.x = (x >= 0) ? 0 : (x <= me.maxScrollX) ? me.maxScrollX : x;
			me._scroll.endY = me.y = (y >= 0) ? 0 : (y <= me.maxScrollY) ? me.maxScrollY : y;
			if (timing) {
				me.scroller.style[tSD] = timing + "ms";
				setTimeout(function(){
					me.scroller.style[tSD] = "0ms";
				}, timing);
			}
			me._scrollTo(me.x, me.y);
			me._runScrollBar();

			return me;
		},

		scale: function(multiple) {
			var me = this;
			var z = parseFloat(multiple);
			if (!isNaN(z)) {
				me.scroller.style["-webkit-transform-origin"] = "0 0";
				me._zoom.scale = z;
				me.refresh().scrollTo(me.x, me.y, 400);
			}
			return me;
		},

		_wheel: function(e) {
			var me = this;
			me.scrollTo(me.x, me._compute(me.y + e.wheelDelta, me.maxScrollY));
			me._runScrollBar();
		},

		on : function (event, callback) {
			var me = this;
			switch (event) {
				case "scrollStart":
					me._event.scrollStart.push(callback);
					break;
				case "scroll":
					me._event.scroll.push(callback);
					break;
				case "scrollEnd":
					me._event.scrollEnd.push(callback);
					break;
				case "zoomStart":
					me._event.zoomStart.push(callback);
					break;
				case "zoom":
					me._event.zoom.push(callback);
					break;
				case "zoomEnd":
					me._event.zoomEnd.push(callback);
					break;
				case "refresh":
					me._event.refresh.push(callback);
					break;
			}
		},

		_execEvent : function (event, e) {
			var me = this;
			for (var i = 0, l = me._event[event].length; i < l; i++) {
				me._event[event][i].call(me, e);
			}
		},

		//创建滚动条
		_createScrollBar : function (a, b, isY) {
			var me = this;
			var bar, btn;

			bar = document.createElement("div");
			btn = document.createElement("div");
			bar.className = a;
			btn.className = b;

			if (this.options.scrollBarX === true || this.options.scrollBarY === true) {
				if (isY) {
					bar.style.cssText = "background:#999;position:absolute;top:0;right:0;bottom:0;width:3px;height:100%;overflow:hidden;";
					btn.style.cssText = "background:#000;position:absolute;top:0;left:0;right:0;";
				} else {
					bar.style.cssText = "background:#999;position:absolute;left:0;bottom:0;right:0;height:3px;width:100%;overflow:hidden;";
					btn.style.cssText = "background:#000;height:100%;position:absolute;left:0;top:0;bottom:0;";
				}
			}

			if (me.options.scrollBarFade) {
				bar.style.opacity = 0;
			}

			bar.appendChild(btn);
			me.wrapper.appendChild(bar);

			return [bar, btn];
		},

		//滑动滚动条
		_runScrollBar : function () {
			var me = this;

			if (!me._scroll.lockX && me.scrollBtnX) {
				var x = Math.round(-me.x * me.scrollBarScaleX);
				me._scrollTo.call({
					scroller : me.scrollBtnX,
					_zoom : {
						scale : 1
					}
				}, x, 0);
			}

			if (!me._scroll.lockY && me.scrollBtnY) {
				var y = Math.round(-me.y * me.scrollBarScaleY);
				me._scrollTo.call({
					scroller : me.scrollBtnY,
					_zoom : {
						scale : 1
					}
				}, 0, y);
			}
		},

		//回弹效果
		_bounceFun : function (k, t, a, isY) {
			var me = this;
			var s;
			t = t - 16;
			if (t > 0) {
				s = a + k * t * t;
			} else {
				if (isY) {
					me._scroll.endY = me.y = a;
					me._scrollTo(me.x, a);
				} else {
					me._scroll.endX = me.x = a;
					me._scrollTo(a, me.y);
				}
				me._execEvent("scrollEnd");
				return;
			}
			if (isY) {
				me._scroll.endY = me.y = s;
				me._scrollTo(me.x, s);
			} else {
				me._scroll.endX = me.x = s;
				me._scrollTo(s, me.y);
			}
			me._execEvent("scroll");

			rAF(me._bounceFun.bind(me, k, t, a, isY));
		},

		//scrollStart默认事件
		_defaultScrollStart : function () {
			var me = this;
			if (me.options.scrollBarFade) {
				if (me.scrollBarX) me.scrollBarX.style.opacity = 1;
				if (me.scrollBarY) me.scrollBarY.style.opacity = 1;
			}
		},

		//scroll默认事件
		_defaultScroll : function (e) {
			var me = this;

			//滚动条
			me._runScrollBar();

			//解决IOS向上滑捕捉不到touchend事件无法执行结束方法的bug
			if (e && !isAndroid && e.touches) {
				if (e.touches[0].pageY < 12) {
					me.status = "end";
					me.scrollTo(me.x, me.y, 400);
				}
			}
		},

		//回弹
		_bounceEvent : function() {
			var me = this;
			var tempX, tempY, k, t = 200;
			tempX = me.x >= 0 ? 0 : (me.x <= me.maxScrollX ? me.maxScrollX : me.x);
			tempY = me.y >= 0 ? 0 : (me.y <= me.maxScrollY ? me.maxScrollY : me.y);

			if (tempX !== me.x) {
				k = (me.x - tempX) / 40000;
				me._bounceFun(k, t, tempX, false);
			}

			if (tempY !== me.y) {
				k = (me.y - tempY) / 40000;
				me._bounceFun(k, t, tempY, true);
			}

			if (tempX === me.x && tempY === me.y) {
				me._execEvent("scrollEnd");
			}
		},

		//scrollEnd默认事件
		_defaultScrollEnd : function () {
			var me = this;
			//滚动条
			me._runScrollBar();
			if (me.options.scrollBarFade) {
				if (me.scrollBarX) me._fade(me.scrollBarX, 2000);
				if (me.scrollBarY) me._fade(me.scrollBarY, 2000);
			}
		},

		//滚动条渐隐
		_fade : function (bar, time) {
			var me = this;
			if ((me.status === "end" || me.status === "start") && time > 0) {
				time = time - 25;
				if (time % 100 === 0) bar.style.opacity = time / 1000;
			} else {
				return;
			}
			rAF(me._fade.bind(me, bar, time));
		},

		//滑动结束后执行的动作
		_endAction : function (tag) {
			var me = this;
			me._scroll.lockX = false;
			me._scroll.lockY = false;
			me.status = tag || "end";
			if (me.options.bounce) {
				me._bounceEvent();
			} else {
				me._execEvent("scrollEnd");
			}
		},

		_step : function () {
			var me = this;
			var tempX, tempY;

			if (isNaN(me.timeX)) me.timeX = 0;
			if (isNaN(me.timeY)) me.timeY = 0;

			if (me.status !== "scroll") {
				if (me.status !== "start") {
					me._endAction();
				} else {
					me._endAction("start");
				}
				return;
			}

			if (me.options.scrollFree && me.timeX <= 0 && me.timeY <= 0) {
				me._endAction();
				return;
			}

			//处理x方向
			if (!me._scroll.lockX) {
				if (me.timeX <= 0 && !me.options.scrollFree) {
					me._endAction();
					return;
				}

				if (me.timeX <= 0 && me.options.scrollFree) {
					me.speedX = 0;
				} else {
					me.speedX = +(me.directionX + me.timeX * me.options.g);
				}
				me.x = me._scroll.endX = Math.round(me._scroll.endX + me.speedX * 16);
				tempX = me._compute(me.x, me.maxScrollX);
				if (tempX !== me.x) {
					me.x = me._scroll.endX = (me.options.bounce && (me.x - tempX > 10) ? parseInt(me.directionX + 25, 10) + tempX : tempX);
					if (!me.options.scrollFree) {
						me.status = "end";
					}
				}
				me.timeX = me.timeX - 16;
			}

			//处理y方向
			if (!me._scroll.lockY) {
				if (me.timeY <= 0 && !me.options.scrollFree) {
					me._endAction();
					return;
				}

				if (me.timeY <= 0 && me.options.scrollFree) {
					me.speedY = 0;
				} else {
					me.speedY = +(me.directionY + me.timeY * me.options.g);
				}
				me.y = me._scroll.endY = Math.round(me._scroll.endY + me.speedY * 16);
				tempY = me._compute(me.y, me.maxScrollY);
				if (tempY !== me.y) {
					me.y = me._scroll.endY = (me.options.bounce && (me.y - tempY > 10) ? parseInt(me.directionY + 25, 10) + tempY : tempY);
					if (!me.options.scrollFree) {
						me.status = "end";
					}
				}
				me.timeY = me.timeY - 16;
			}

			me._scrollTo(me.x, me.y);
			me._execEvent("scroll");

			rAF(me._step.bind(me));
		},

		//计算x,y的值
		_compute : function (val, max) {
			var me = this;
			if (val > 0) {
				if (me.options.bounce && (val > 10)) {
					return Math.round(val / 5);
				} else {
					return 0;
				}
			}

			if (val < max) {
				if (me.options.bounce && (val < (max - 10))) {
					return Math.round(max + ((val - max) / 5));
				} else {
					return max;
				}
			}

			return val;
		},

		_start : function(e) {
			var me = this, t = e.touches || [e];

			me.status = "start";

			if (t.length === 1) { //单指
				me.startTime = Date.now();
				me.startPositionX = me._scroll.startX = t[0].pageX;
				me.startPositionY = me._scroll.startY = t[0].pageY;
			} else { //双指
				me.scroller.style["-webkit-transform-origin"] = "0 0";

				var c1 = Math.abs(t[0].pageX - t[1].pageX),
				c2 = Math.abs(t[0].pageY - t[1].pageY);

				me._zoom.spacing = Math.sqrt(c1 * c1 + c2 * c2);
				me._zoom.startScale = me._zoom.scale;

				me.originX = Math.abs(t[0].pageX + t[1].pageX) / 2 - me.wrapperOffset.left - me.x;
				me.originY = Math.abs(t[0].pageY + t[1].pageY) / 2 - me.wrapperOffset.top - me.y;
			}
		},

		_move : function(e) {
			var me = this, t = e.touches || [e];

			if (me.options.preventDefault) {
				e.preventDefault();
			}

			//判断手势
			if (me.status === "start") {
				if (t.length === 1 && me.options.scroll) {
					//判断向哪个方向滑动，如果已有一个方向被锁定则不用判断
					if (!me.options.scrollFree && !(me._scroll.lockX || me._scroll.lockY)) {
						if (Math.abs(t[0].pageX - me._scroll.startX) > Math.abs(t[0].pageY - me._scroll.startY)) {
							me._scroll.lockY = true; //不允许y方向滑动
						} else {
							me._scroll.lockX = true; //不允许x方向滑动
						}
					}
					if (!me.options.scrollX) {
						me._scroll.lockX = true;
					}
					if (!me.options.scrollY) {
						me._scroll.lockY = true;
					}
					me._execEvent("scrollStart", e);
					me.status = "scroll";
				} else if (me.options.zoom) {
					me._execEvent("zoomStart", e);
					me.status = "zoom";
				}
				return;
			}

			//执行滑动
			if (me.status === "scroll") {
				if (!me._scroll.lockX) {
					me.x = t[0].pageX - me._scroll.startX + me._scroll.endX;
					me.x = me._compute(me.x, me.maxScrollX);
				}
				if (!me._scroll.lockY) {
					me.y = t[0].pageY - me._scroll.startY + me._scroll.endY;
					me.y = me._compute(me.y, me.maxScrollY);
				}

				me._scrollTo(me.x, me.y);
				me._execEvent("scroll", e);

				if (Date.now() - me.startTime > 200) {
					me.startTime = Date.now() - 50;
					me.startPositionX = t[0].pageX;
					me.startPositionY = t[0].pageY;
				}
				if (!me._scroll.lockX) {
					me.distanceX = t[0].pageX - me.startPositionX;
				}
				if (!me._scroll.lockY) {
					me.distanceY = t[0].pageY - me.startPositionY;
				}

				return;
			}

			//执行缩放
			if (me.status === "zoom") {
				var c1 = Math.abs(t[0].pageX - t[1].pageX),
				c2 = Math.abs(t[0].pageY - t[1].pageY),
				spacing = Math.sqrt(c1 * c1 + c2 * c2),
				scale = spacing / me._zoom.spacing * me._zoom.startScale,
				lastScale;

				if (scale < me.options.zoomMin) {
					scale = me.options.zoomMin;
				} else if (scale > me.options.zoomMax) {
					scale = me.options.zoomMax;
				}

				lastScale = scale / me._zoom.startScale;

				me.x = Math.round(me.originX - me.originX * lastScale + me._scroll.endX);
				me.y = Math.round(me.originY - me.originY * lastScale + me._scroll.endY);
				me._zoom.scale = scale;

				me._scrollTo(me.x, me.y);
				me._execEvent("zoom", e);

				return;
			}
		},

		_end : function() {
			var me = this;

			JRoll.jrollActive = null;

			//释放鼠标
			if (me.status === "start") {
				me.status = "end";
			}
			//滑动结束
			if (me.status === "scroll") {
				me._scroll.endX = me.x;
				me._scroll.endY = me.y;

				if (me.options.momentum) {
					var runX = false,
					runY = false;
					me.duration = Date.now() - me.startTime;

					if (me.duration < 300) {
						if (!me._scroll.lockX) {
							me.speedX = me.distanceX / me.duration;
							me.timeX = Math.abs(me.speedX / me.options.g);
							if (me.speedX < 0) {
								me.directionX = "-";
							} else {
								me.directionX = "+";
							}

							runX = true;
						}

						if (!me._scroll.lockY) {
							me.speedY = me.distanceY / me.duration;
							me.timeY = Math.abs(me.speedY / me.options.g);
							if (me.speedY < 0) {
								me.directionY = "-";
							} else {
								me.directionY = "+";
							}

							runY = true;
						}

						if (runX || runY) {
							rAF(me._step.bind(me));
						} else {
							me._endAction();
						}
					} else {
						me._endAction();
					}
				} else {
					me._endAction();
				}

				return;
			}

			//缩放结束
			if (me.status === "zoom") {

				if (me._zoom.scale > me.options.zoomMax) {
					me._zoom.scale = me.options.zoomMax;
				} else if (me._zoom.scale < me.options.zoomMin) {
					me._zoom.scale = me.options.zoomMin;
				}

				me.refresh();

				if (me.x > 0) {
					me._scroll.endX = me.x = 0;
				} else if (me.x < me.maxScrollX) {
					me._scroll.endX = me.x = me.maxScrollX;
				}
				if (me.y > 0) {
					me._scroll.endY = me.y = 0;
				} else if (me.y < me.maxScrollY) {
					me._scroll.endY = me.y = me.maxScrollY;
				}

				me.scrollTo(me.x, me.y, 400);

				me.status = "end";
				me._execEvent("zoomEnd");

				return;
			}
		}
	};

	if (typeof module !== 'undefined' && module.exports) module.exports = JRoll;
	if (typeof define === 'function') define(function() {return JRoll;});

	window.JRoll = JRoll;

})(window, document, Math);
