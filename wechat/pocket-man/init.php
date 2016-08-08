<?php
define( 'IN' , true );
define( 'ROOT' , dirname( __FILE__ ) . '/' );

error_reporting( E_ALL^E_NOTICE );
include_once( ROOT . 'engine/init.inc.php' );
session_cache_limiter('private, must-revalidate');
session_set_cookie_params( 60*60*24*1  ); //1day
session_start();

if( !isAjax() ){
	header("content-Type: text/html; charset=Utf-8");
}

if( $_REQUEST['src'] ){
	$_SESSION['from'] = $_REQUEST['src'];
}elseif( !$_SESSION['from'] ){
	$_SESSION['from'] = 'mobile';
}
if( $_REQUEST['from'] ){
    $_SESSION['_from'] = $_REQUEST['from'];
}
checkLogin();

$line = db()->select()->from('users')->where('id', $_SESSION['id'] )->getLine();
if( !$line['catchs'] ){
	$line['catchs'] = json_encode([]);
}
$referer = $_SERVER['HTTP_REFERER'];
$refererInfo = parse_url( $referer );
if( $refererInfo['host'] != $_SERVER['HTTP_HOST'] ){
    //'left_times' => 9 ,
    db()->update( 'users' , [ 'catchs' => 0 ] , ['id' => $_SESSION['id']] );
    $line['left_times'] = 9;
    $line['catchs'] = json_encode([]);
}
$shareFriendTitle = '"Pokeman Go"在中国上线啦！'; 
$shareFriendDesArray = ['"Pokeman Go"登陆中国','"Pokeman Go"在中国解锁了，不要羡慕国外了，快来足不出户抓男神精灵。','姐姐好饿之“口袋男神”上线，快来围观！']; 
shuffle( $shareFriendDesArray );
$shareFriendDes = $shareFriendDesArray[0];

$nsArray = ['崔始源' ,'高云翔', '黄渤',  '李治廷',  '刘冬沁',  '刘烨',  '宋仲基',  '佟大为',  '吴奇隆'];
shuffle( $nsArray );
$nsRand = $nsArray[0];

$shareTimeLineArray = ['"Pokeman Go"登陆中国','"Pokeman Go"在中国解锁了，不要羡慕国外了，快来足不出户抓男神精灵。','姐姐好饿之“口袋男神”上线，快来围观！']; 
shuffle( $shareTimeLineArray );
$shareTimeLine = $shareTimeLineArray[0];

$shareFriendDesEndArray = ['"Pokeman Go"上线，快来捕捉你喜欢的小精灵哦！','不小心扑捉捕捉到九只男神精灵，姐姐好饿之口袋男神的精灵都是天菜呀！','小伙伴喊你来"Pokeman Go"撒欢了！去吧!皮卡丘!去吧!宋仲基!'];
shuffle( $shareFriendDesEndArray );
$shareFriendDesEnd = $shareFriendDesEndArray[0];

$shareTimeLineEndArray = ['"Pokeman Go"！我成功捕捉了'.$nsRand,'《姐姐好饿》的男神到"Pokeman Go"当精灵了，赶紧抓回来！','如果中国有了"Pokeman Go"！真的实现了'];
shuffle($shareTimeLineEndArray);

$shareTimeLineEnd = $shareTimeLineEndArray[0];

$startGameBack = Url::make('class=statistics&method=startGame');
$shareFriendCallBack = Url::make('class=statistics&method=shareFriendSuccess');
$shareTimelineCallBack = Url::make('class=statistics&method=shareTimelineSuccess');
$shareLine = "http://".$_SERVER['HTTP_HOST']."/bedroom.php?src=".$_SESSION['from'];
$imgUrl = "http://".$_SERVER['HTTP_HOST']."/img/share.jpg";
$throwLink = Url::make('class=actions&method=throwBall');
$statisticsImg = Url::make('class=statistics&method=statistics');
$submitUrl = Url::make('class=actions&method=submit');
$updateCatchsUrl = Url::make('class=actions&method=getCatchs');
$getTokenUrl = Url::make('class=actions&method=getToken');
$js = <<<Eof
<audio src="/sound/pocketbg.mp3" preload="preload" autoplay="autoplay" loop="loop" id="pocketbg"></audio>
<audio src="/sound/throw.mp3" preload="preload"  id="throw"></audio>
<audio src="/sound/catch.mp3" preload="preload"  id="catch"></audio>
<script type="text/javascript" src="http://api2.izhida.cn/wechat_js_config?app_id=wx2fa55d29f3666fb3&v=1.2.0"></script>
<script>
var reward = '{$line['reward']}';
var catchs = {$line['catchs']};
var leftTime = {$line['left_times']};
var throwLink = '{$throwLink}';
var startGameBack = '{$startGameBack}';
var shareFriendCallBack = '{$shareFriendCallBack}';
var shareTimelineCallBack = '{$shareTimelineCallBack}';
var submitUrl = '{$submitUrl}';
var updateCatchsUrl = '{$updateCatchsUrl}';
var getTokenUrl = '{$getTokenUrl}';
var wxFriendData = {
    'link': "{$shareLine}",
    'imgUrl':  '{$imgUrl}',
    'title': '{$shareFriendTitle}',
    'desc': '{$shareFriendDes}',
    'success': function () {
        $.post( shareFriendCallBack );
    }
};
var shareFriendEnd = '{$shareFriendDesEnd}';
var shareTimelineEnd = '{$shareTimeLineEnd }';
var wxTimelineData = {
    'link': "{$shareLine}",
    'imgUrl':  '{$imgUrl}',
    'title': '{$shareTimeLine}',
    'success': function () {
        $.post( shareTimelineCallBack );
    }
};
window.wx && wx.ready(function () {
    $('#pocketbg').get(0).play();
    wx.onMenuShareAppMessage(wxFriendData);
    wx.onMenuShareTimeline(wxTimelineData);
});
var stateImg = new Image();
stateImg.src = "{$statisticsImg}";
</script>
Eof;
if( strpos( $_SERVER['HTTP_HOST'] , 'dev.izhida.cn') === false ){
    $js .= '<script>
var _hmt = _hmt || [];
(function() {
  var hm = document.createElement("script");
  hm.src = "//hm.baidu.com/hm.js?8842729fbb0f7db335f5a9d9be46b444";
  var s = document.getElementsByTagName("script")[0]; 
  s.parentNode.insertBefore(hm, s);
})();
</script>';

}
?>
