<?php
/*文件扩展名说明 
*7173 gif *255216 jpg *13780 png *6677 bmp *239187 txt,aspx,asp,sql *208207 xls.doc.ppt *6063 xml *6033 htm,html *4742 js 
*8075 xlsx,zip,pptx,mmap,zip *8297 rar *01 accdb,mdb *7790 exe,dll *5666 psd *255254 rdp *10056 bt种子 *64101 bat 
*/ 
function getFileType( $file ){
	$fp = fopen($file, "rb");
	$bin = fread($fp, 2); //只读2字节
	fclose($fp);
	$str_info = @unpack("C2chars", $bin);
	$type_code = intval($str_info['chars1'].$str_info['chars2']);
	$file_type = '';
	switch ($type_code) {
		case 239187:
			$file_type = 'txt';
			break;
		case 7784:
			$file_type = 'midi';
			break;
		case 8075:
			$file_type = 'zip';
			break;
		case 8297:
			$file_type = 'rar';
			break;
		case 255216:
			$file_type = 'jpg';
			break;
		case 7173:
			$file_type = 'gif';
			break;
		case 6677:
			$file_type = 'bmp';
			break;
		case 13780:
			$file_type = 'png';
			break;
		default:
			$file_type = 'unknown';
			break;
	}
	return $file_type;
}
function isAjax(){
	if( isset( $GLOBALS['__isAjax'] ) ){
		return $GLOBALS['__isAjax'];
	}
	$headers = apache_request_headers();
	$GLOBALS['__isAjax'] = (isset( $headers['X-Requested-With'] ) && ( $headers['X-Requested-With'] == 'XMLHttpRequest' )) || (isset( $headers['x-requested-with'] ) && ($headers['x-requested-with'] == 'XMLHttpRequest' ));
	return $GLOBALS['__isAjax'];
}
function c( $name ){ 
	if( !isset( $GLOBALS['__config'] ) ){
			$__config = NULL;
			include( ENGINE.'config/core.config.php' );
			include( ROOT.'config/app.config.php' );
			$GLOBALS['__config'] = $__config;
	}
	if( isset( $GLOBALS['__config'][$name] ) ){
		return $GLOBALS['__config'][$name];
	}
	else{
		return false;
	}	
}
function db(){
	if( !$GLOBALS['__db'] ){
		$GLOBALS['__db'] = new Db();
	}
	return $GLOBALS['__db'];
}
function get_ip() {
   if (isSet($_SERVER)) {
       if (isSet($_SERVER["HTTP_X_FORWARDED_FOR"])) {
           $realip = $_SERVER["HTTP_X_FORWARDED_FOR"];
       } elseif (isSet($_SERVER["HTTP_CLIENT_IP"])) {
               $realip = $_SERVER["HTTP_CLIENT_IP"];
           } else {
               $realip = $_SERVER["REMOTE_ADDR"];
           }
       } else {
           if ( getenv( 'HTTP_X_FORWARDED_FOR' ) ) {
               $realip = getenv( 'HTTP_X_FORWARDED_FOR' );
           } elseif ( getenv( 'HTTP_CLIENT_IP' ) ) {
               $realip = getenv( 'HTTP_CLIENT_IP' );
           } else {
               $realip = getenv( 'REMOTE_ADDR' );
       }
   }
   return current( explode(',' , $realip ) ); 
}
function v( $str ){
	return getDataFromArray( $str , $_REQUEST );
}
function p( $str ){
	return getDataFromArray( $str , $_POST );
}
function getDataFromArray( $array , $data ){
	if( is_array( $array ) ){
		$return = array();
		foreach( $array as $v ){
			if( isset( $data[$v] ) && $data[$v] !== '' ){
				$return[trim($v)] = $data[$v];
			}
		}
		return $return;
	}
	return isset( $data[$array] )?$data[$array]:false;
}
function render( $data , $__showPage = NULL , $layout = NULL , $layoutTpl = true ){
	 $__showPage = strtolower( $__showPage);
	if( $layout == NULL ){
		$layout = 'default';
	}
	if( isAjax() ){
		$requiteFile =  ROOT.'themes/'.$layout.'/ajax/'.$__showPage.'.tpl.html';
	}else{
		$requiteFile =  ROOT.'themes/'.$layout.'/'.($layoutTpl?'layout':$__showPage).'.tpl.html';
	}
	if( !is_file( $requiteFile ) ){
		die('can\'t load themes '.$__showPage.' files ');
	}
	@extract( $data );
	require( $requiteFile );
}
if(!function_exists('apache_request_headers')) {     
    function apache_request_headers(){ 
        foreach($_SERVER as $key=>$value){
            if (substr($key,0,5)=="HTTP_") {
                $key=str_replace(" ","-",ucwords(strtolower(str_replace("_"," ",substr($key,5))))); 
                $out[$key]=$value;
            } 
        }
        return $out; 
    }
}
function safeUrlString( $str ){
	$str = urldecode($str);
	return str_replace( array( '.' , '/' ) , array() , $str  );
}