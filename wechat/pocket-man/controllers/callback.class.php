<?php
class callback extends BaseController {
	function __construct(){
	
	}
	public function enter(){
		$key = $_GET['key'];
		$helper = new OAuthHelperV3(c('oauth_app_id'), c('oauth_client_id'), c('oauth_client_password'),
				c('oauth_support_xauth'));
		$check = $helper->check_callback_param_signature($_GET);
	    if (!$check) {
	        exit('check signature failed');
	    }
        $info = $helper->callback_data($_GET); 
		if( OAuthHelperV3::SCOPE_BASE == 'snsapi_base' || !$info['errcode'] ){
			$openid = $info['openid'];
			$user = $info['user'];
			if( $user ){
				$user['headimgurl'] = preg_replace('@(/0)$@', '/132', $user['headimgurl']);
			}
	        if( !$openid ){
	        	if( $_SESSION['backUrl'] ){
					header("Location: ".$_SESSION['backUrl'] );
				}else{
					header('Location: http://'.$_SERVER['HTTP_HOST'].'/');
				}
				return;
	        }
	        $userInfo = db()->select()->from('users')->where('openid', $openid)->getLine();
	        if (!$userInfo) {
	            if( db()->insert('users', array('openid' => $openid , 'block' =>  json_encode( $user ) ,'add_time' => time())) ){
            	 	$_SESSION['id'] = db()->lastId();
            	}else{
            		//echo db()->sql;die();
            		if( $_SESSION['backUrl'] ){
						header("Location: ".$_SESSION['backUrl'] );
					}else{
						header('Location: http://'.$_SERVER['HTTP_HOST'].'/');
					}
					return;
            	}
	        } else {
	            $user = json_decode($userInfo['block'], true);
	            unset($userInfo['block']);
	            foreach ($userInfo as $key => $value) {
	                $_SESSION[$key] = $value;
	            }
	            $_SESSION['id'] = $userInfo['id'];
	        }
	        if($user){
	        	foreach ($user as $key => $value) {
		            $_SESSION[$key] = $value;
		        }
	        }
	        $_SESSION['openid'] = $openid;

	        
	        if( $_SESSION['backUrl']  && strpos($_SESSION['backUrl'], 'code=') === false ){
				header("Location: ".$_SESSION['backUrl'] );
			}else{
				header('Location: http://'.$_SERVER['HTTP_HOST'].'/');
			}
		}else{
			die( '<div style="padding:20px;text-aligin:center">只有授权后才能进入应用 </div>' );
		}
	}
}