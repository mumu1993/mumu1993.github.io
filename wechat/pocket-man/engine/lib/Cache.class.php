<?php
Class Cache{
	const CACHEDB = 'SaeMemcache';
	private static $mmc = false;
	private static $cacheGet = array();
	private static function  init(){
		if( self::$mmc === false ){
			self::$mmc = memcache_init();
		}
	}
	public static function get($key){
		if( !self::$cacheGet[$key] ){
			self::init();
			if( self::$mmc === false ){
				return;
			}
			self::$cacheGet[$key] = memcache_get(self::$mmc,$key);
		}
		return self::$cacheGet[$key];
	}
	public static function set( $key , $value , $time = 18000 ){
		if( !self::$cacheGet[$key]  ){
			self::$cacheGet[$key] = $value;
		}
		self::init();
		if( self::$mmc === false ){
			return;
		}
		memcache_set( self::$mmc , $key ,$value , false , $time );
	}
	public static function increment( $key , $value = 1 ){
		if( !self::$cacheGet[$key]  ){
			self::$cacheGet[$key] += $value;
		}
		self::init();
		return memcache_increment(  self::$mmc , $key ,$value );
	}
}