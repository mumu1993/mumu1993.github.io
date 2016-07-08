// 随机数
function random(min, max, not) {
    var res = parseInt(Math.random() * (max - min + 1) + min);
    if(not === Array){
	    	for (var i = 0;i<not.length;i++) {
		    	 if (not[i] == res) {
		        res++
	   		 }
	    }
    }else{
    		
    }
    
   
    return res;
}

// 随机颜色
function randomColor(haveAlpla) {
    if (haveAlpla == undefined) {
        return "rgb("+ random(0, 255) +", "+ random(0, 255) +", "+ random(0, 255) +")";
    } else {
        return "rgba("+ random(0, 255) +", "+ random(0, 255) +", "+ random(0, 255) +", "+ (Math.random() + 0.1) +")";
    }
}
