<?php
include( ROOT.'lib/MemcacheSASL.php' );
Class MC{
	private static $mmc = false;
	private static $cacheGet = array();
	private static function  init(){
		if( self::$mmc === false ){
			$mmc = new MemcacheSASL();
			//$mmc->setOption(Memcached::OPT_COMPRESSION, false);
			//$mmc->setOption(Memcached::OPT_BINARY_PROTOCOL, true); 
			$mmc->addServer('2ea9d54d888311e4.m.cnqdalicm9pub001.ocs.aliyuncs.com', '11211');
			$mmc->setSaslAuthData('2ea9d54d888311e4', 'zhida_app_1212'); 
			self::$mmc = $mmc;
		}
	}
	public static function get($key){
		self::init();
		if( self::$mmc === false ){
			return;
		}
		return self::$mmc->get($key);
	}
	public static function set( $key , $value , $time = 18000 ){
		self::init();
		if( self::$mmc === false ){
			return;
		}
		return self::$mmc->set( $key ,$value  , $time );
	}
	public static function add( $key , $value , $time = 3600 ){
		self::init();
		if( self::$mmc === false ){
			return;
		}
		return self::$mmc->add( $key  , $value , $time );
	}
	public static function del( $key ){
		self::init();
		if( self::$mmc === false ){
			return;
		}
		return self::$mmc->delete( $key );
	}
	public static function increment( $key , $value = 1 ){
		self::init();
		if( self::$mmc === false ){
			return;
		}
		return self::$mmc->increment( $key , $value );
	}
	public static function decrement( $key , $value = 1 ){
		self::init();
		if( self::$mmc === false ){
			return;
		}
		return self::$mmc->decrement( $key , $value );
	}
	public static function __callStatic( $func, $arguments ){
		self::init();
		if( !method_exists( self::$mmc , $func  ) ){
			die('Can not find method ' );
		}
		return call_user_func_array( array(self::$mmc, $func) , $arguments );
	}
}