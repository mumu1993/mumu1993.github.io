<?php
class Url{
	const	SHORT_CLASS_TAG = 'c';
	const	SHORT_METHOD_TAG = 'm';
	const	URLBASE = '/';
	public static $enter = array();
	public static $params = array();
	public static $custom = array();
	public static $url = false;
	
	public static function setUrl( $url ){
		self::$enter = self::$params = array();
		self::$url = $url;
		self::initParams();
	}
	public static function getUrl(){
		self::initParams();
		return self::$url;
	}
	public static function get( $str ){
		self::initParams();
		return isset( self::$params[$str] )?self::$params[$str]:false ;
	}
	public static function getClass(){
		self::initParams();
		return self::$enter['class'];
	}
	public static function getMethod(){
		self::initParams();
		return self::$enter['method'];
	}
	public static function make( $custom  = array() , $old = array() ){
		self::initParams();
		
		$base = array();
		
		self::formatUrlParams( $base , $custom , $old  );
		
		//$base[self::SHORT_CLASS_TAG] = $base[self::SHORT_CLASS_TAG]?:self::getClass();
		//$base[self::SHORT_METHOD_TAG] = $base[self::SHORT_METHOD_TAG]?:c('default_method');
		
		if( !$base[self::SHORT_CLASS_TAG] ){
			$base[self::SHORT_CLASS_TAG] = self::getClass();
			if( !$base[self::SHORT_METHOD_TAG] ){
				$base[self::SHORT_METHOD_TAG] = self::getMethod();
			}
		}
		if( !$base[self::SHORT_METHOD_TAG] ){
			$base[self::SHORT_METHOD_TAG] = c('default_method');
		}
		
		if( $base[self::SHORT_METHOD_TAG]== c('default_method') ){
			unset( $base[self::SHORT_METHOD_TAG]  );
			if( !$custom && !$old &&  $base[self::SHORT_CLASS_TAG]== c('default_class')  ){
				unset( $base[self::SHORT_CLASS_TAG]  );
			}
		}
		//start to make url 
		$url = c('url_base')?c('url_base'):self::URLBASE;
		if( c('static_url') ){
			if( $base )
				$url .= join('/',$base).'/';
				
			if( $custom ){
				foreach( $custom as $k => $v ){
					if( $v ){
						$url .= $k.'/'.$v.'/';
					}
				}
			}
		}else{
			if( $base )
				$custom += $base;
				
			if( $custom )
				$url .= '?'.http_build_query($custom); 
		}
		
		return $url;
	}
	public static function initParams(){
		if( !self::$enter ){
			$custom = array();
			if( !self::$url ){
				if( c('static_url')  ){
					//self::$url = isset($_SERVER['REDIRECT_URL'])&&$_SERVER['REDIRECT_URL']?$_SERVER['REDIRECT_URL']:$_SERVER['PATH_INFO'];
					self::$url = trim( current( explode('?', $_SERVER['REQUEST_URI'])), '/' );
                    self::$url = ltrim(  self::$url, trim( self::URLBASE , '/' ) );
				}else{
					self::$url = $_GET;
				}
			}
			if( c('static_url') ){
				$tempArray = explode( '/' , trim(self::$url , '/' )  );
				if( $tempArray ){
					if( count( $tempArray )%2 == 0 ){
						$custom['class'] = safeUrlString(array_shift( $tempArray ));
						$custom['method'] = safeUrlString(array_shift( $tempArray ));
					}else{
						$custom['class'] = safeUrlString(array_shift( $tempArray ));
						$custom['method'] = c('default_method');
					}
				}
				if( $tempArray ){
					foreach( array_chunk($tempArray, 2) as $v ){
						list( $key , $value ) = $v;
						$custom[$key] = $value;
					}
				}
				$custom = array_filter(array_merge( (array)$custom , (array)$_GET ));
			}else{
				$custom = self::$url;
			}
			$base = array();
			self::formatUrlParams( $base , $custom );
			self::$enter['class'] = $base[self::SHORT_CLASS_TAG]?:c('default_class');
			self::$enter['method'] = $base[self::SHORT_METHOD_TAG]?:c('default_method');
			self::$params = $custom;
			if( c('static_url') ){
				$_REQUEST += $base + $custom;
				$_GET += $base + $custom;
			}
		}
	}
	private static function formatUrlParams(  &$base , &$custom , $old = array() ){
		// init url params
		if( !is_array( $custom ) ){
			parse_str( ltrim( $custom , '?' ) , $custom);
		}
		$custom += self::$custom;
		if( $old ){
			foreach( $old as $v ){
				if( $v && self::$params[$v] ){
					$custom[$v] = self::$params[$v];
				}
			}
		}
		//init custom params
		$needFix = array( 'class' , 'method' , self::SHORT_CLASS_TAG , self::SHORT_CLASS_TAG );
		foreach( $needFix  as $v ){
			$custom[$v] = $custom[$v]?:NULL;
		}
		
		$class = $custom[self::SHORT_CLASS_TAG]?:$custom['class'];
		$method = $custom[self::SHORT_METHOD_TAG]?:$custom['method'];
		unset( $custom['class'], $custom[self::SHORT_CLASS_TAG] , $custom['method'] ,$custom[self::SHORT_METHOD_TAG] );
		$base[self::SHORT_CLASS_TAG] = $class;
		$base[self::SHORT_METHOD_TAG] = $method;
	}
}