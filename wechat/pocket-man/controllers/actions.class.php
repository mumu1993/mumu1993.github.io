<?php
class Actions extends BaseController{
	public function throwBall(){
		$reward = 0;
		$catch = 0;
		$update = [];
		$line = db()->select()->from('users')->where('id', $_SESSION['id'] )->getLine();
		//print_r( $line );
		$id = v('id');
		$catchs = $line['catchs']?json_decode($line['catchs'] , 1):[]; 
		$update[] = 'left_times = left_times - 1';
		if( $id ){ //&& $line['left_times'] > 0 
			$id = p('id');
			if( $id && !in_array($id, $catchs) ){
				$catchs[] = $id;
				$update['catchs'] = json_encode( $catchs );
				$catch = 1;
				if( substr( $line['openid'] , 0 , 4 ) != 'fake' ){
					if( !$line['reward'] && count($catchs) == 9  && in_array( $id , [7,8,9] ) ){
						$rand = rand(1,1000000);
						//$rand = rand(1,2);
						if( $rand == 1 ){
							$rewardKey = $_SERVER['HTTP_HOST'].'reward1';
							if( MC::get($rewardKey) ){
								MC::decrement( $rewardKey );
								$reward = 1;
								$update['reward'] = 1;
							}
						}else{
							$rand = rand(1,1000);
							//$rand = rand(1,2);
							if( $rand == 1 ){
								$rewardKey = $_SERVER['HTTP_HOST'].'reward2';
								if( MC::get($rewardKey) ){
									MC::decrement( $rewardKey );
									$reward = 2;
									$update['reward'] = 2;
								}
							}
						}
					}
				}
				// if( count($catchs) == 9  ){
				// 	$reward = 1;
				// }
				
			}

		}
		if( $update ){
			db()->update('users' , $update , ['id'=>$_SESSION['id']] );
		}
		$res = [];
		$res['reward'] = $reward;
		$res['catch'] = $catch;
		$res['leftTime'] = ($line['left_times']-1);
		echo json_encode( $res );
	}
	public function getCatchs(){
		$line = db()->select()->from('users')->where('id', $_SESSION['id'] )->getLine();
		$catchs = $line['catchs']?json_decode($line['catchs'] , 1):[]; 
		echo json_encode( $catchs );
	}
	public function submit(){
		// echo 1;
		// return;
		$line = db()->select()->from('users')->where('id', $_SESSION['id'] )->getLine();
		if( $line  && $line['reward'] ){ // && $Line['reward']
			$update = [];
			$update['name'] = p('name');
			$update['tel'] = p('phone');
			db()->update( 'users' , $update , ['id'=>$_SESSION['id']] );
			echo 1;
		}else{
			echo 'error';
		}
	}
	public function getToken(){
		$qiniu = new Qiniu('ggMPohY9_87Q69nDYUMwvR7XqlLYAREH-btbJG3U', 'OPzIqCWVMDs7tAYjPi9Hn7JkxBj2CtHARCCEnrdd','tofax-salesman-cdn.izhida.cn',  'tofax-salesman' );
          $uploadToken = $qiniu->uploadToken(array('scope' => 'tofax-salesman'));
          echo json_encode(['uptoken'=>$uploadToken]);
	}
}