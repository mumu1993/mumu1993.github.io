<?php

class OAuthHelperV3
{
    /*
     * 应用授权作用域，snsapi_base （不弹出授权页面，直接跳转，只能获取用户openid），
     * snsapi_userinfo（弹出授权页面，可通过openid拿到昵称、性别、所在地。并且，即使在未关注的情况下，只要用户授权，也能获取其信息）
     */
    // 获取用户基本资料
    const SCOPE_USERINFO = 'snsapi_userinfo';
    // 仅获取用户的openid
    const SCOPE_BASE = 'snsapi_base';

    protected $app_id = '';
    // 给客户分配的key，用户标识客户来源、授权使用的公众号
    protected $client_id = '';
    // 给客户分配的token，通讯使用
    protected $client_password = '';
    // 是否支持非微信授权
    protected $xauth = '';

    /**
     * 设置app_key, app_token
     * @param $app_id
     * @param $client_id
     * @param $client_password
     * @param string $xauth
     */
    public function __construct($app_id, $client_id, $client_password, $xauth = '')
    {
        $this->app_id = $app_id;
        $this->client_id = $client_id;
        $this->client_password = $client_password;
        $this->xauth = $xauth;
    }

    /**
     * 获取授权跳转url
     * @param string $callback_url 回调地址
     * @param null $scope 授权方式
     * @param null $state 回调后会会带上state参数
     * @param string $encode 加密方法
     * @return string 返回授权跳转URL
     */
    public function auth_url($callback_url, $scope = null, $state = null, $encode = '')
    {
        if ($scope == null) {
            $scope = self::SCOPE_BASE;
        }
        $ts = time();
        $state = ($state === null) ? '' : $state;
        $signature = self::signature(array(
            $this->app_id, $this->client_id, $this->client_password,
            $scope, $state, $callback_url, $ts
        ));

        $form = array(
            'app_id' => $this->app_id,
            'client_id' => $this->client_id,
            'ts' => $ts,
            'scope' => $scope,
            'state' => $state,
            'redirect' => $callback_url,
            'encode' => $encode,
            'signature' => $signature,
            'xauth' => $this->xauth,
        );
        $qs = http_build_query($form);
        $url = 'https://oauth.izhida.cn/oauth_v3?' . $qs;
        return $url;
    }

    /**
     * 检查回调地址的请求数据是否合法
     * @param array $arr 回调地址的数据数组
     * @return bool 成功返回true
     */
    public function check_callback_param_signature($arr)
    {
        $v = array($this->app_id, $this->client_id, $this->client_password, $arr['ts'],
            $arr['openid'], $arr['state'], $arr['info']);
        $signature = self::signature($v);
        return ($signature === $arr['signature']);
    }

    /**
     * 获取回调地址的请求数据
     * @param array $arr 回调地址的数据数组
     * @return array|bool 失败时返回false，成功返回数组。key值为空时，表示未授权或者错误
     */
    public function callback_data($arr)
    {
        if (empty($arr['openid'])) {
            return false;
        }

        $info = json_decode($arr['info'], true);
        $v = array(
            'openid' => $arr['openid'],
            'state' => $arr['state'],
            'access_token' => $info['access_token'],
            'user' => $info['user'],
        );
        return $v;
    }

    /**
     * 签名计算
     * @param $arr
     * @return string
     */
    public static function signature($arr)
    {
        sort($arr, SORT_STRING);
        $tmpStr = implode($arr);
        $tmpStr = sha1($tmpStr);
        return $tmpStr;
    }
}