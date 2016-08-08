<?php
//do not change this is u don't know what it is.
$__config['oauth_app_id'] = 'wx4c3c856ab83a946b';
$__config['oauth_client_id'] = 'zhida_app';
$__config['oauth_client_password'] = 'izhida';
$__config['oauth_support_xauth'] = 0;
$__config['callback'] = 'http://'.$_SERVER['HTTP_HOST'].'/?c=callback';


//如果使用微信自己的授权 请修改以下配置 custom ＝ 1 ct_appid ＝ wechat appid ct_secret = wechat secret
$__config['custom'] = '0';
$__config['ct_appid'] = '';
$__config['ct_secret'] = '';
$__config['ct_callback'] = 'http://'.$_SERVER['HTTP_HOST'].'/?c=ctcallback';

if( strpos( $_SERVER['HTTP_HOST'] , 'dev.izhida.cn') === false ){
    $__config['cdn'] = 'static3.izhida.cn/cdn2/pocket-man/v1.1.0';
}