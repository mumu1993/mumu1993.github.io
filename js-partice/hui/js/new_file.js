var progress = $("#container").Progress({
  percent:100,
  width: 200,
  height: 20,
  fontSize: 0,backgroundColor:'rgba(200,200,200,0.9)',barColor:'#FFC125',animate: false,
});  
var mark = document.getElementById('mark');
mark.innerHTML = '得分：'
var progress = document.querySelectorAll('#container>rect')[1];
position = [{left:112,top:210},{left:32,top:255},{left:207,top:240},{left:119,top:289},{left:32,top:316},{left:216.7,top:307},{left:45.8,top:390},{left:135,top:369},{left:225,top:391}];
var randomNum = function(){
	var ranNum = parseInt(Math.random()*9);
	return ranNum;
}
var warp = document.getElementById('warp');
//倒计时
var timer = null;
var countDown = function(){
	start = 200;
	end = 0;
	step = 0;
	change = 200
	maxstep = 1875;
	if(timer){
		clearInterval(timer)
	}
	timer = setInterval(function(){
		step++;
		if(step == maxstep){
			clearInterval(timer);
			alert('游戏结束，得分:' + count);
		}
		progress.style.width = (change-change/maxstep*step) + 'px';
	},16)
}
countDown();
//计分
count = 0;
//灰太狼随机出现
timer1 = null;
timer2 = null;
timer3 = null;
clickable = true;
clickable1 = true;
appear = function(a,b,c){
	if(timer1){
		clearInterval(timer1);
	}
	var start1 = 0;
	var start2 = c;
	var end1 = 101;
	var step1 = 0;
	var maxstep1 = 50;
	timer1 = setInterval(function(){
		step1++;
		if(step1 == maxstep1){
			clearInterval(timer1);
		}
		a.style.height = Tween.Linear(step1,start1,end1,maxstep1) + 'px';	
		a.style.bottom = Tween.Linear(step1,start2,0,maxstep1) + 'px';
	},16);
	a.onclick = function(){
		clickable = false;
		disappear(a,b,c);
		clicka(a,b,c);
	}
	setTimeout(function(){
		if(clickable == true){
			disappear(a,b,c);
		}else{
			return;
		}
	},1000)
}
disappear = function(a,b,c){
	var start1 = 0;
	var start2 = c;
	var end1 = 101;
	var step1 = 0;
	var maxstep1 = 50;
	timer2 = setInterval(function(){
		step1++;
		if(step1 == maxstep1){
			clearInterval(timer2);
		}
		a.style.height = (101-Tween.Linear(step1,start1,end1,maxstep1))+ 'px';
		a.style.bottom = (Tween.Linear(step1,start2,0,maxstep1)) + 'px';
	},16)
	a.onclick = function(){
		if(clickable == true){
			clickable == false;
			clicka(a,b,c);
		}else{
			return
		}
		
	}
}
//点击加分，换背景
clicka = function(a,b,c){
	a.setAttribute('style','position:absolute;width:108px;background-image: url(img/h6.png);');
	a.style.left = (b-19) + 'px';
	count +=10;
	mark.innerText = '得分：' + count + '分';
}
show = function(){
	var grayWolf = document.createElement('div');
	num = randomNum()
	var pos_left = position[num].left;
	var pos_top = position[num].top;
	grayWolf.setAttribute('style','position:absolute;width:81px;background-image: url(img/h5.png);');
	grayWolf.style.left = (pos_left-19) + 'px';
	grayWolf.style.bottom = (480-pos_top) + 'px';
	pos_bottom = 480-pos_top;
	warp.appendChild(grayWolf);
//	同时改变出现位置和高度
	appear(grayWolf,pos_left,pos_bottom);
}
//
show2 = function(){
	var grayWolf = document.createElement('div');
	num2 = randomNum()
	while(num2 == num){
		console.log(this)
		num2 = randomNum()
	}
	var pos_left = position[num2].left;
	var pos_top = position[num2].top;
	grayWolf.setAttribute('style','position:absolute;width:81px;background-image: url(img/h5.png);');
	grayWolf.style.left = (pos_left-19) + 'px';
	grayWolf.style.bottom = (480-pos_top) + 'px';
	var pos_bottom = 480-pos_top;
	warp.appendChild(grayWolf);
//	同时改变出现位置和高度
	appear(grayWolf,pos_left,pos_bottom);
}
if(timer3){
	clearInterval(timer3)
}
timer3 = setInterval(function(){
	show();
},1100);
//show2()

//show();


