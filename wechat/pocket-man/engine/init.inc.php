<?php
/**
 * this file is init the framework
 */
if( !defined('IN') ) die('bad request');
define( 'ENGINE' , dirname( __FILE__ ) . '/' );
define( 'ISSAE', isset( $_SERVER['HTTP_APPNAME'] )&&$_SERVER['HTTP_APPNAME']?true:false );

include_once(ENGINE."Autoloader.class.php");
include_once(ENGINE."lib/core.function.php");
include_once(ROOT."lib/app.function.php");

Autoloader::addLoadPath( ENGINE. 'lib' );
Autoloader::addLoadPath( ROOT. 'lib');
if( c('static_url') )
	Url::initParams();

if( c('cdn') )
	Cdn::init( c('cdn') );