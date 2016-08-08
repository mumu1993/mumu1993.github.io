<?php
class Autoloader {
	private static $autoloaderData = array();
	
	public static function addLoadPath( $dir ) {
		array_unshift( self::$autoloaderData, $dir);
	}
	public static function getPathByClassName($className) {
		$className = str_replace( array('/','\\') , array('','') ,  $className );
		$file = NULL;
		if( self::$autoloaderData ){
			foreach (self::$autoloaderData as $path  ) {
				if( is_file( $path.'/'.$className.'.class.php' ) ){
					return $path.'/'.$className.'.class.php';
				}
			}
		}
	}
}
function engine_autoload($class_name) {
	$path = Autoloader::getPathByClassName($class_name);
	if( $path ){
		require($path);
	}
}
spl_autoload_register("engine_autoload");