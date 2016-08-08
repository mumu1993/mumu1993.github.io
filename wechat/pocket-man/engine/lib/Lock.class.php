<?php
class Lock{
	const LOCKTIME = 3;
	private static $locked = array();
	private static $memcache = false;
	private static function init(){
		if( self::$memcache == false ){
			self::$memcache = memcache_init();
		}
	}
	public static function add( $key ){
		self::init();
		if( self::$memcache !== false ){
			$time = self::LOCKTIME;
			while( $time > 0 ){
				if( memcache_add( self::$memcache , $key , 'Locking' ,false , self::LOCKTIME ) ){
					self::$locked[$key] = 1;
					return;
				}else{
					$time--;
					sleep(1);
				}
			}	
		}	
	}
	public static function del( $key ){
		if( self::$locked[$key] ){
			self::init();
			if( self::$memcache !== false ){
				if(  memcache_delete( self::$memcache , $key  ) ){
					unset(  self::$locked[$key] );
					return true;
				}
			}
		}
		
	}
	public static function delAll(){
		if( self::$locked && self::$memcache ){
			foreach( self::$locked as $k => $v ){
				if( memcache_delete( self::$memcache , $k  ) ){
					unset(  self::$locked[$k] );
				}
			}
		}
	}
}
function autounLock(){
	Lock::delAll();
}
register_shutdown_function( 'autounLock' );