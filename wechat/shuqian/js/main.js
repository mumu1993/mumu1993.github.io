$(function (){
	
	//loading
	 var loadingImgs = ["img/activity_rule.png","img/bg.jpg","img/bg2.png","img/close.png","img/p1_btns_wrap.png","img/p1_first.png","img/p1_from.png","img/p1_second.png","img/p1_sub.png","img/p1_third.png","img/p2_kuang.png","img/p2_qian.jpg","img/p2_scoring.png","img/p2_shou.png","img/p2_txt1.png","img/p2_txt2.png","img/p2_txt3.png","img/p2_zhuan.png","img/p3_acquire.png","img/p3_again.png","img/p3_bg.jpg","img/p3_share.png","img/p3_share_btn.png","img/prize.png","img/qian.png","img/ranking.png","img/ranking_bg.png","img/shiyong.png","img/shizhong.png","img/shou.png","img/start_game.png","img/tiaozhan.png","img/yinqu.png"];
	 
	 var loadingedNum = 0;
	 for (var i=0; i<loadingImgs.length; i++){
	 	
	 	var imgObj = new Image();
	 	imgObj.src = loadingImgs[i];
	 	imgObj.onload = function (){
	 		
	 		loadingedNum++;
	 		var scale = parseInt(loadingedNum/loadingImgs.length*100);
	 	
	 		$("#loading").html(scale+"%");
	 		if (loadingedNum>=loadingImgs.length-2){
	 			$("#loading_wrap").hide();
	 			init();
	 		}
	 	}
	 }
	
	var txtTimer = null;
	
	function init(){
		
		$("#p1").show();
		//给首页元素添加动画
		$(".tiaozhan").addClass("bounceIn");
		$(".yinqu").addClass("swing");
		$(".start_btn").addClass("pulse");
		
		//数钱榜
		touch.on('.ranking',"tap",function (e){
			$("#ranking").show();
			$("#ranking").on("mousedown",function (e){

				e.preventDefault();
			});
		});
		//活动奖品
		touch.on(".prize","tap",function (){
			$("#prize").show();
		});
		//活动规则
		touch.on(".activity_rule","tap",function (){
			$("#activity_rule").show();
		});
		//使用说明
		touch.on(".shiyong","tap",function (){
			$("#shiyong").show();
		});
		
		//关闭弹窗
		$(".close").on("touchstart",function (){
			$(this).parent().hide();
		});
		
		//开始游戏按钮
		touch.on("#start_btn","tap",function (e){
			
			//留手机号码和姓名
			$("#user_data").show();
			//提交用户信息-》成功后执行
			$(".sub").on("touchstart",function (e){
				
				subSucc();
				e.preventDefault();
			});
			
			function subSucc(){
				
				$("#p1").fadeOut();
				$("#p2").fadeIn();
				var txtIndex = 0;
				//控制用户分数
				var qianNum = 0;
				var downTimerNum = 60;//倒计时时间
				var downTimerBol = false;
				var txtArr = ["img/p2_txt1.png","img/p2_txt2.png","img/p2_txt3.png"];
				
				txtTimer = setInterval(function (){
					txtIndex++;
					if (txtIndex>txtArr.length-1){
						txtIndex = 0;
					}
					$(".p2_txt").attr({
						src:txtArr[txtIndex]
					});
				},2000);
				var timeDownTime = setInterval(function (){
					if (downTimerBol){
						downTimerNum--;
						if (downTimerNum<0){
							//游戏结束
							
							clearInterval(timeDownTime);
							$("#p2").hide();
							$("#p3").show();
							$("#result_num").html("￥"+qianNum);
							var resultTxt = Math.random()>0.5?"没办法！你已经强到没有对手了":"你太客气了，这不是你的挑战极限吧";
							$("#result_txt").html(resultTxt);
							
							//获取最高分
							$("#highScore").html(997);
							//获取排名
							$("#result_rank").html(66);
							
							//再来一次
							$(".p3_again").on("touchstart",function (){
								window.location.href="index.html";
							});
							//分享
							$(".p3_share_btn").on("touchstart",function (){
								$("#share").show();
								$("#share.p1_mask").on("touchstart",function (){
									$("#share").hide();
								});
							});
						}
						$(".clock").html(downTimerNum);
					}
				},800);
				touch.on(".qian_wrap","touchstart",function(e){
					e.preventDefault();
				});
				touch.on(".qian_wrap","swipeup",function (e){
					$(".p2_shou").hide();
					qianNum++;
					downTimerBol = true;
					var qianObj = $("<img class='p2_qian_new' src='img/p2_qian.jpg'>");
					$(".qian_wrap").append(qianObj);
					qianObj.removeTimer = setTimeout(function (){
						
						qianObj.remove();
					},1000);
					
					var qianNumStr = String(qianNum);
					for(var i=0; i<qianNumStr.length; i++){
						$(".time_num").eq($(".time_num").size()-i-1).html(qianNumStr[qianNumStr.length-i-1]);
					}
					
					e.preventDefault();
				});
			}
			
		});
	}
});