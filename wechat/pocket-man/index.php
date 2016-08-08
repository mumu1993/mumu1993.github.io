<?php
define( 'IN' , true );
define( 'ROOT' , dirname( __FILE__ ) . '/' );

error_reporting( E_ALL^E_NOTICE );
include_once( ROOT . 'engine/init.inc.php' );
//session_cache_limiter('private, must-revalidate');
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

$class = safeUrlString($_REQUEST['c']?:c('default_class'));
if( $class == c('default_class') ){
	header('Location: /bedroom.php');
}
$method = $_REQUEST['m']?:c('default_method');
$controllersFile = ROOT.'controllers/'.$class.'.class.php';
if( !is_file( $controllersFile ) ){
	die( "can't find controller file " );
}else{
	include_once( $controllersFile );
	if( !class_exists(  $class ) ) die('Error Can\'t find class' );
	if( !method_exists( $class , $method  ) ) die('Error Can\'t find method ' );
	$class = new $class;
}
//print_r( $_SERVER );
call_user_func(array($class, $method ));
?>
