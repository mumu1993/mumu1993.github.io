<?php
function getToken(){
	$line = db()->select()->from('cache')->where('cache_key' , 'access_token' )->getLine();
	if( $line && $line['expire_time'] > time()  ){
		return $line['cache_value'];
	}
	$res = file_get_contents( 'https://api.weixin.qq.com/cgi-bin/token?grant_type=client_credential&appid='.c('ct_appid').'&secret='.c('ct_secret') );
	$res = json_decode( $res , true );
	if( $res['access_token'] ){
		$replace = array();
		$replace['cache_key'] = 'access_token';
		$replace['cache_value'] = $res['access_token'];
		$replace['expire_time'] = time() + $res['expires_in'];
		db()->replace('cache' , $replace );
		return $res['access_token'];
	}
}
function getJsTicket(){
	$line = db()->select()->from('cache')->where('cache_key' , 'tickets' )->getLine();
	if( $line && $line['expire_time'] > time()  ){
		return $line['cache_value'];
	}
	$token = getToken();
	$res = file_get_contents( 'https://api.weixin.qq.com/cgi-bin/ticket/getticket?access_token='.$token.'&type=jsapi' );
	$res = json_decode( $res , true );
	if( $res['ticket'] ){
		$replace = array();
		$replace['cache_key'] = 'ticket';
		$replace['cache_value'] = $res['ticket'];
		$replace['expire_time'] = time() + $res['expires_in'];
		db()->replace('cache' , $replace );
		return $res['ticket'];
	}
}
function isMobile(){
	$browser = false;
	// If viewing the mobile website
	switch(true){
	    // Apple/iPhone browser renders as mobile
	    case (preg_match('/(apple|iphone|ipod)/i', $_SERVER['HTTP_USER_AGENT']) && preg_match('/mobile/i', $_SERVER['HTTP_USER_AGENT'])):
	        $browser= true;
	        break;

	    // Other mobile browsers render as mobile
	    case (preg_match('/(blackberry|configuration\/cldc|hp |hp-|htc |htc_|htc-|iemobile|kindle|midp|mmp|motorola|mobile|nokia|opera mini|opera   mobi|palm|palmos|pocket|portalmmm|ppc;|smartphone|sonyericsson|sqh|spv|symbian|treo|up.browser|up.link|vodafone|windows ce|xda |xda_)/i',$_SERVER['HTTP_USER_AGENT'])):
		    $browser= true;
		    break;

	    // Wap browser
	    case (((strpos(strtolower($_SERVER['HTTP_ACCEPT']),'text/vnd.wap.wml') > 0) || (strpos(strtolower($_SERVER['HTTP_ACCEPT']),'application/vnd.wap.xhtml+xml')>0)) || ((isset($_SERVER['HTTP_X_WAP_PROFILE']) || isset($_SERVER['HTTP_PROFILE'])))):
	        $browser= true;
	        break;

	    // Shortend user agents
	    case (in_array(strtolower(substr($_SERVER['HTTP_USER_AGENT'],0,3)),array('lg '=>'lg ','lg-'=>'lg-','lg_'=>'lg_','lge'=>'lge')));
	        $browser = true;
	        break;

	    // More shortend user agents
	    case(in_array(strtolower(substr($_SERVER['HTTP_USER_AGENT'],0,4)),array('acs-'=>'acs-','amoi'=>'amoi','doco'=>'doco','eric'=>'eric','huaw'=>'huaw','lct_'=>'lct_','leno'=>'leno','mobi'=>'mobi','mot-'=>'mot-','moto'=>'moto','nec-'=>'nec-','phil'=>'phil','sams'=>'sams','sch-'=>'sch-','shar'=>'shar','sie-'=>'sie-','wap_'=>'wap_','zte-'=>'zte-'))):
	        $browser= true;
	        break;

	    // Render mobile site for mobile search engines
	    case (preg_match('/Googlebot-Mobile/i', $_SERVER['HTTP_USER_AGENT']) || preg_match('/YahooSeeker\/M1A1-R2D2/i', $_SERVER['HTTP_USER_AGENT'])):
	        $browser= true;
	        break;
	    // 如果有HTTP_X_WAP_PROFILE则一定是移动设备
	    case ( isset($_SERVER['HTTP_X_WAP_PROFILE']) ):
	        $browser= true;
	        break;
	    // 如果via信息含有wap则一定是移动设备,部分服务商会屏蔽该信息
	    case ( isset ($_SERVER['HTTP_VIA']) && stristr($_SERVER['HTTP_VIA'], "wap") == true ):
	        $browser= true;
	        break;
	}
	return $browser;
}
function isWeixin(){
	//return false;
	if ( strpos($_SERVER['HTTP_USER_AGENT'], 'MicroMessenger') !== false ) {
			return true;
	}
	return false;
}
function checkLogin(){
	if( !isLogin() ){
		$back = $_SERVER['REQUEST_URI']?:'/';
		
		$_SESSION['backUrl'] = $back;
		
		if( !c('custom') ){
			$helper = new OAuthHelperV3(c('oauth_app_id'), c('oauth_client_id'), c('oauth_client_password'),
				c('oauth_support_xauth'));
	        $aurl = $helper->auth_url(c('callback'));
			header("Location: ".$aurl);
			exit;
		}else{
			$callback = c('ct_callback');
	        $redirect_url = 'https://open.weixin.qq.com/connect/oauth2/authorize?'
	            . 'appid=' . c('ct_appid')
	            . '&redirect_uri=' . urlencode($callback)
	            . '&response_type=code&scope=snsapi_userinfo'
	            . '&state='
	            . '#wechat_redirect';

			header("Location: ".$redirect_url);
			exit;
		}
		
	}
}
function isLogin(){
	if( $_SESSION['id'] &&  is_numeric( $_SESSION['id'] )){
		return true;
	}else{
		return false;
	}
}
function urlsafe_base64_encode($url){
	return strtr( base64_encode( $url ) , '+/', '-_' );
}
function urlsafe_base64_decode($url){
	return base64_decode(strtr( $url , '-_','+/' ));
}
function getPager( $page , $page_all , $old = array() ,$custom  = array() ){
	if( $page_all <= 1 ){
		return '';
	}
	if( $custom && is_array($custom) ){
		$custom = '&'.http_build_query($custom);
	}elseif( $custom ){
		$custom = '&'.$custom;
	}else{
		$custom = NULL;
	}
	$pre = $next = $middle = '';
	$left_num = $right_num = 0;
	$left_more = $right_more = false;
	if( $page > 1 ){
		$pre = '<li class="pref" ><a href="'.Url::make( 'page='.($page - 1).$custom  , $old ).'" title="上一页">上一页</a></li>';
	}
	if( $page < $page_all ){
		$next = '<li class="next" ><a href="'.Url::make( 'page='.($page + 1).$custom  , $old ). '"  title="下一页">下一页</a></li>';
	}
	if( $page_all <= 11 ){
		/* 小于等于 11 页 */
		$left_num = $page - 1;
		$right_num = $page_all - $page;
	}else{
		if( $page > 6 ){
			$left_more = true;
			if( $page < $page_all - 5 ){
				$right_more = true;
				$left_num = 4;
				$right_num = 4;
			}else{
				$right_more = false;
				$right_num = $page_all - $page;
				$left_num = 9 - $right_num;
			}
		}else{
			$left_num = $page - 1;
			$left_more = false;
			$right_num = 9 - $left_num;
			$right_more = true;
		}
	}
	if( $left_more ){
		$middle .= '<li><a href="'.Url::make( 'page=1'.$custom , $old ).'">1</a></li>';
		$middle .= '<li><a>...</a></li>';
	}
	for($j=$left_num;$j>0;$j--){
		$i = $page - $j;
		if( $i <= 0 ){
			continue;
		}
		$middle .= '<li><a href="'.Url::make( 'page='.$i.$custom , $old ). '">' . $i .'</a></li>';
	}
	$middle .= '<li class="cur"><a>' . $page . '</a></li>';
	for($j=1;$j<=$right_num;$j++){
		$i = $page + $j;
		if( $i > $page_all ){
			continue;
		}
		$middle .= '<li><a href="'.Url::make( 'page='.$i.$custom , $old ).'">' . $i .'</a></li>';
	}
	if( $right_more ){
		$middle .= '<li><a>...</a></li>';
		$middle .= '<li><a href="'.Url::make( 'page='.$page_all.$custom  , $old ).'">' . $page_all .'</a></li>';
	}
	return $pre.$middle.$next;
}