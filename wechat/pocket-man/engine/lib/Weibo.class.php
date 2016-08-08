<?php
Class Weibo{
	private static $weiboClient,$weiboOAuth;
	private static $akey,$skey,$access_token,$refresh_token;
	private static $ip;
	public static function init(  $akey, $skey, $access_token = NULL , $refresh_token = NULL  ){
		self::$akey = $akey; self::$skey = $skey; self::$access_token = $access_token; self::$refresh_token = $refresh_token;
	}
	
	public static function setIp( $ip ){
		self::$ip = $ip;
	}
	
	public static function __callStatic($funcName, $args){
		if( !self::$akey && !self::$skey ){
			die( 'Weibo Class is not init.' );
		}
		self::initWeiboClient();
		if( self::$weiboClient ){
			if( method_exists(self::$weiboClient ,$funcName ) ){
				$res = call_user_func_array(array(self::$weiboClient , $funcName) , $args );
				if( $fun = c('after_weibo') ){
					if( function_exists( $fun ) ){
						$fun( $res );
					}
				}
				return $res;
			}
		}
		self::initWeiboOAuth();
		if( self::$weiboOAuth ){
			if( method_exists(self::$weiboOAuth ,$funcName ) ){
				if( $funcName == 'getAccessToken' ){
					$token = call_user_func_array( array(self::$weiboOAuth ,$funcName ), $args );
					if( !self::$weiboClient && $token['access_token'] ){
						self::$access_token = $token['access_token'];
						self::initWeiboClient();
					}
					return $token;
				}
				return call_user_func_array( array(self::$weiboOAuth ,$funcName ), $args );
			}
		}
		die( 'Function '.$funcName.' is not find in Weibo Class' );
	}
	private static function initWeiboClient(){
		if( !self::$weiboClient && self::$access_token ){
			include_once( "saetv2.ex.class.php" );
			self::$weiboClient = new SaeTClientV2(  self::$akey,  self::$skey,  self::$access_token, self::$refresh_token );
			if( self::$ip ){
				self::$weiboClient->set_remote_ip( self::$ip );
			}
		}
	}
	private static function initWeiboOAuth(){
		if( !self::$weiboOAuth ){
			include_once( "saetv2.ex.class.php" );
			self::$weiboOAuth = new SaeTOAuthV2(  self::$akey,  self::$skey,  self::$access_token, self::$refresh_token );
			if( self::$ip ){
				self::$weiboOAuth->remote_ip = self::$ip;
			}
		}
	}
}