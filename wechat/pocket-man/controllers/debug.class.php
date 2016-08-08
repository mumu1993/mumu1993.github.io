<?php
class Debug {
    function enter(){
        if( strpos( $_SERVER['HTTP_HOST'] , 'dev.izhida.cn') === false ){
            echo 'debug is only open for dev machine';
            return;
        }
        $uid = v('id')?v('id'):1;
        $userInfo = db()->select()->from('users')->where('id', $uid )->getLine();
        if( !$userInfo ){
            die('error');
        }
        $user = json_decode($userInfo['block'], true);
        unset($userInfo['block']);
        foreach ($userInfo as $key => $value) {
            $_SESSION[$key] = $value;
        }
        $_SESSION['id'] = $userInfo['id'];
        if( $user ){
            foreach ($user as $key => $value) {
                $_SESSION[$key] = $value;
            }
        }
        echo 'ok';
    }
}