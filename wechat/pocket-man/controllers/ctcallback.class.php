<?php

class ctCallback{

    private function fetch_token($app_id, $app_secret, $code)
    {
        $url = 'https://api.weixin.qq.com/sns/oauth2/access_token?'
            . 'appid=' . $app_id
            . '&secret=' . $app_secret
            . '&code=' . $code
            . '&grant_type=authorization_code';
        $response = file_get_contents($url);
        if (empty($response)) {
            //if (defined('MY_DEBUG')){var_dump(Http::error());}
            return null;
        }
        $token_info = json_decode($response, true);
        if (isset($token_info['errcode'])) {
            // if (defined('MY_DEBUG')){var_dump($response);}
            // if (defined('MY_DEBUG')){var_dump($token_info);}
            return null;
        }
        return $token_info;
    }
    public function enter()
    {
        $code = $_REQUEST['code'];
        if (empty($code)) {
            //error_log('code is empty');
            die('<div style="padding:20px;text-aligin:center">只有授权后才能进入应用</div>');
        }
        $token = $this->fetch_token(c('ct_appid'), c('ct_secret'), $code);
        if (empty($token)) {
        	//relogin
            $callback = c('ct_callback');
            $redirect_url = 'https://open.weixin.qq.com/connect/oauth2/authorize?'
                . 'appid=' . c('appid')
                . '&redirect_uri=' . urlencode($callback)
                . '&response_type=code&scope=snsapi_userinfo'
                . '&state='
                . '#wechat_redirect';

            header("Location: ".$redirect_url);
            return;
        }
        $openid = $token['openid'];
        $url = 'https://api.weixin.qq.com/sns/userinfo?'
            . 'access_token=' . $token['access_token']
            . '&openid=' . $token['openid']
            . '&lang=zh_CN';
        $user_str = file_get_contents( $url );
        $user_str_1 = $user_str;
        $user_str_1 = preg_replace('/[\x00-\x08\x10\x0B\x0C\x0E-\x19\x7F]'.
            '|[\x00-\x7F][\x80-\xBF]+'.
            '|([\xC0\xC1]|[\xF0-\xFF])[\x80-\xBF]*'.
            '|[\xC2-\xDF]((?![\x80-\xBF])|[\x80-\xBF]{2,})'.
            '|[\xE0-\xEF](([\x80-\xBF](?![\x80-\xBF]))|(?![\x80-\xBF]{2})|[\x80-\xBF]{3,})/S',
            '?', $user_str_1 );

        //reject overly long 3 byte sequences and UTF-16 surrogates and replace with ?
        $user_str_1 = preg_replace('/\xE0[\x80-\x9F][\x80-\xBF]'.
            '|\xED[\xA0-\xBF][\x80-\xBF]/S','?', $user_str_1);

        $user = json_decode($user_str, true);
        if (empty($user) || isset($user['errcode'])) {
            $user = json_decode($user_str_1, true);
            if (empty($user) || isset($user['errcode'])) {
                die('<div style="padding:20px;text-aligin:center">只有授权后才能进入应用</div>');
            }
            $user_str = $user_str_1;
        }
        // 替换成小头像
        $user['headimgurl'] = preg_replace('@(/0)$@', '/132', $user['headimgurl']);
        $userInfo = db()->select()->from('users')->where('openid', $openid)->getLine();
        if (!$userInfo) {
            db()->insert('users', array('openid' => $openid, 'block' => json_encode( $user ), 'add_time' => time()));
            $_SESSION['id'] = db()->lastId();
        } else {
            $user = json_decode($userInfo['block'], true);
            unset($userInfo['block']);
            foreach ($userInfo as $key => $value) {
                $_SESSION[$key] = $value;
            }
            $_SESSION['id'] = $userInfo['id'];
        }
        foreach ($user as $key => $value) {
            $_SESSION[$key] = $value;
        }
        //$_SESSION['headimgurl'] = $_SESSION['headimgurl'] ? $_SESSION['headimgurl'] : '/img/default_pic.png';
        if ($_SESSION['backUrl'] && strpos($_SESSION['backUrl'], 'code=') === false) {
            header("Location: " . $_SESSION['backUrl']);
        } else {
            header('Location: http://' . $_SERVER['HTTP_HOST'] . '/');
        }
    }
}