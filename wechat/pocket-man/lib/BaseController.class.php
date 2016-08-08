<?php
class BaseController{
	public $tplParams = array();
	public $layout = NULL;
	public $layoutTpl = true;
	function __construct(){
		// $randKey = v('rand');
		// if( Url::getClass() != 'main' && Url::getClass() != 'invite' ){
		// 	$this->checkAccess( $randKey );
		// }
		// $this->makeRandKey();

		checkLogin();
	}
	protected function makeRandKey(){
		if( $_SESSION['__lastClass'] != Url::getClass() ){
			$_SESSION['__rand'] = $this->getRandChar('12');
			$_SESSION['__lastClass'] = Url::getClass();
		}
		Url::$custom = array('rand' => $_SESSION['__rand']);
	}
	protected function getRandChar($length){
	   $str = null;
	   $strPol = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789abcdefghijklmnopqrstuvwxyz";
	   $max = strlen($strPol)-1;

	   for($i=0;$i<$length;$i++){
	    $str.=$strPol[rand(0,$max)];
	   }
	   return $str;
	}
	protected function checkAccess( $randKey ){
		if( !$_SESSION['__rand'] || $_SESSION['__rand'] != $randKey  ){
			header("Location: ".Url::make('class=main'));
		}
		$referer = $_SERVER['HTTP_REFERER'];
		$refererInfo = parse_url( $referer );
		if( $refererInfo['host'] != $_SERVER['HTTP_HOST'] ){
			header("Location: ".Url::make('class=main'));
		}
	}
	protected function _add( $key , $value = NULL ){
		if( $value == NULL && is_array($key) ){
			$this->tplParams += $key;
		}else{
			$this->tplParams[$key] = $value;		
		}
	}
	protected function showMessage( $message , $type = 'notice' , $show = true ){
		$message = '<message type="'.$type.'">'.$message.'</message>';
		if( $show ){
			echo $message;
		}else{
			return $message;	
		}
	}
	protected function render( $tplName = NULL , $data = array() ){
		if( c('custom') ){
			$weixinJsApiInfo = array();
			$weixinJsApiInfo['noncestr'] = $this->getRandChar(12);
			$weixinJsApiInfo['timestamp'] = time();
			$weixinJsApiInfo['url'] = 'http://'.$_SERVER['HTTP_HOST'].$_SERVER['REQUEST_URI'];
			$weixinJsApiInfo['jsapi_ticket'] = getJsTicket();
			ksort( $weixinJsApiInfo, SORT_STRING );
			$str = NULL;
			foreach ($weixinJsApiInfo as $key => $value) {
				$str .= "$key=$value&";
			}
			$str = substr($str, 0 , -1);
			$_signature = sha1 (  $str );
			$weixinJsApiInfo['signature'] = $_signature;
			$this->_add('weixinJsApiInfo' , $weixinJsApiInfo );
		}
		if( $data && is_array( $data )  ){
			$data = array_merge( $data ,  $this->tplParams );
		}else{
			$data = $this->tplParams;
		}
		if( !$tplName ){
			$tpl = $tplName?$tplName:get_class($this);
			if( Url::getMethod() != c('default_method') ){
				$tpl .= '_'.Url::getMethod();
			}
		}else{
			$tpl = $tplName;
		}
		
		render( $data , $tpl , $this->layout , $this->layoutTpl );
	}
	protected function getAjax( $method , $extra = array() ){
		if( !method_exists(  $this , $method ) ) die('Ajax method is not exists' );
		//save  info
		$url = Url::getUrl();
		
		$extra['method'] = $method;
		$GLOBALS['__isAjax'] = true;
		
		Url::setUrl( Url::make($extra) );

		ob_start();
		$this->$method();
		$html = ob_get_clean();
		//replace back
		unset($GLOBALS['__isAjax']);
		Url::setUrl( $url );
		
		return $html;
	}
}