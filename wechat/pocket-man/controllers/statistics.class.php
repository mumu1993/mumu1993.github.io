<?php
class Statistics extends BaseController{
    function __construct(){
    	$this->layout = 'statistics';
    	$this->checkLogin();
    }
    function checkLogin(){
	    if( Url::getMethod() == 'enter'  && $_SESSION['isLogin'] != 1 ){
			$this->render('login');
			exit;
	    }
    }
    function loginSubmit(){
    	if( p('email') != 'izhida' && p('password') != 'showdata' )
	    	echo ( '亲，(・Д・)ノ用户名或密码不对哦。' );
	    else
	    	 $_SESSION['isLogin'] = 1;
    }
	public function enter(){
		$data = db()->select()->from('statistics')->orderBy('date' , 'DESC')->getData();
		$this->_add('list' , $data);
		$this->render();
	}
	public function statistics(){
		$data['date'] = date("Y-m-d");
		$where = $data;
		$where['from'] = $_SESSION['from'];
		$formArray = array( 'singlemessage' ,'groupmessage', 'timeline' );
		if( in_array($_SESSION['_from'], $formArray ) ){
			$fromType =$_SESSION['_from'];
			$data[] = $fromType.'_pv = '.$fromType.'_pv + 1';
			if( $_SESSION['__date__'.$fromType] != $data['date'] ){
				$_SESSION['__date__'.$fromType] = $data['date'];
				$data[] = $fromType.'_uv = '.$fromType.'_uv + 1';
			}
		}
		if( db()->select('count(*)')->from('statistics')->where( $where )->getVar() ){
			//update
			//$where = $data;
			if( $_SESSION['__date'] != $data['date'] ){
				$_SESSION['__date'] = $data['date'];
				$data[] = 'uv = uv + 1'; 
			}
			$data[] = 'pv = pv + 1';
			db()->update('statistics', $data , $where );
		}else{
			//insert
			if( $_SESSION['__date'] != $data['date'] ){
				$_SESSION['__date'] = $data['date'];
				$data['uv'] = '1'; 
			}
			$data['from'] = $_SESSION['from'];
			$data['pv'] = '1'; 
			db()->insert( 'statistics' , $data );
		}
	}
	
// public function export(){
// 		$data = db()->select()->from('users')->where('name !=' , '')->where('tel !=' , '')->orderBy('id' , 'ASC')->getData();
// 		if( !$data ){
// 			die('暂无数据！');
// 		}
// 		$formatArray = array();
// 		$formatArray['openid'] = '用户ID';
// 		$formatArray['name'] = '姓名';
// 		$formatArray['tel'] = '电话';
// 		$formatArray['card_index'] = '投票CardID';
// 		$formatArray['reward'] = '奖励金额';
// 		$formatArray['add_time'] = '加入时间';
		
		
// 		$file_name = date('Y-m-d') . '.csv';
// 		header('Cache-Control: public');
//    		header('Pragma: public');
//    		header('Content-type: text/csv');
//    		header('Content-Disposition: attachment; filename=' . $file_name);
// 		$content = "\xEF\xBB\xBF";//添加BOM
// 		$content .= join(',', $formatArray );
// 		$content .= "\n";
// 		$keys = array_keys( $formatArray );
// 		foreach ( $data as  $value) {
// 			$value['add_time'] = date( "m月d日 H:i:s",$value['add_time']  );
// 			$value['name'] = strtr($value['name'], array(','=>'，',"\r"=>'' , "\n"=>''));
// 			$value['tel'] = strtr($value['tel'], array(','=>'，',"\r"=>'' , "\n"=>''));
			
// 			$content .= join(',' , getDataFromArray( $keys , $value ) )."\n";
// 		}
// 		echo $content;
// 		exit;
// 	}

	public function shareFriendSuccess(){
		$data['date'] = date("Y-m-d");
		$where = $data;
		$where['from'] = $_SESSION['from'];
		if( $_SESSION['__share_friend_uv_date'] != $where['date'] ){
			$_SESSION['__share_friend_uv_date'] = $where['date'];
			$data[] = 'share_friend_uv = share_friend_uv + 1'; 
		}
		$data[] = 'share_friend_pv = share_friend_pv + 1'; 
		db()->update('statistics', $data , $where );
		// if( isLogin() ){
		// 	db()->update( 'users' , array( 'share_times = share_times + 1' ) , array('id' =>$_SESSION['id'] ) );
		// }
	}
	public function shareTimelineSuccess(){
		$data['date'] = date("Y-m-d");
		$where = $data;
		$where['from'] = $_SESSION['from'];
		if( $_SESSION['__share_timeline_uv_date'] != $where['date'] ){
			$_SESSION['__share_timeline_uv_date'] = $where['date'];
			$data[] = 'share_timeline_uv = share_timeline_uv + 1'; 
		}
		$data[] = 'share_timeline_pv = share_timeline_pv + 1'; 
		db()->update('statistics', $data , $where );
		// if( isLogin() ){
		// 	db()->update( 'users' , array( 'share_times = share_times + 1' ) , array('id' =>$_SESSION['id'] ) );
		// }
	}
public function startGame(){
		$where['date'] = date("Y-m-d");
		$where['from'] = $_SESSION['from'];
		if( $_SESSION['__start_uv_date'] != $where['date'] ){
			$_SESSION['__start_uv_date'] = $where['date'];
			$data[] = 'start_uv = start_uv + 1'; 
		}
		$data[] = 'start_pv = start_pv + 1';
		db()->update('statistics', $data , $where );
		//echo db()->sql;
	}


}