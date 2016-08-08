<?php
class Mysql{
	private $master;
	private $slave;
	public	$do_replication = false;
    function __construct( $master  ){
        $this->master = $master;
    }
    private function connect( $is_master = true ){
        if( $is_master ) $dbInfo = $this->master;
        else $dbInfo = $this->slave;
        if( !isset( $dbInfo['port'] ) || !$dbInfo['port'] ){
            $dbInfo['port'] = '3306';
        }
        if( !$db = mysqli_connect( $dbInfo['host'] , $dbInfo['user'] , $dbInfo['passwd'] , $dbInfo['dbname']  , $dbInfo['port'] ) ){
            die('can\'t connect to mysql ' . $ $dbInfo['host']  );
        }else{
           // mysqli_query( "set names 'utf8'" , $db );
            //mysqli_query( $db , "set names 'utf8'" );
            mysqli_query( $db , "set names 'utf8mb4'" );
        }
        //echo 'connect to: '. $dbInfo['host'].'at db:'.$dbInfo['dbname'].'<br>';
        //mysqli_select_db( $db , $dbInfo['dbname'] );
        
        return $db;
    }  
    private function dbRead(){
        if( isset( $this->dbRead ) ){
            mysqli_ping( $this->dbRead );
            return $this->dbRead;
        }else{
            if( !$this->do_replication ) return $this->dbWrite();
            else {
                $this->dbRead = $this->connect( false );
                return $this->dbRead;
            }
        }
    }
    
    private function dbWrite(){
        if( isset( $this->dbWrite ) ){
            mysqli_ping( $this->dbWrite );
            return $this->dbWrite;
        }else{
            $this->dbWrite = $this->connect( true );
            return $this->dbWrite;
        }
    }
    public function setSlave( $slave ){
    
	    $this->slave['host'] = $slave['host'];
        $this->slave['user'] = isset($slave['user']) ? $slave['user'] : $this->master['user'];
        $this->slave['passwd'] = isset($slave['passwd']) ? $slave['passwd'] : $this->master['passwd'];
        $this->slave['dbname'] = isset($slave['dbname']) ? $slave['dbname'] : $this->master['dbname'];
        $this->do_replication = true;
    }
    public function saveError( $dblink ) {
        //$GLOBALS['MYSQL_LAST_ERROR'] = mysqli_error($dblink);
        //$GLOBALS['MYSQL_LAST_ERRNO'] = mysqli_errno($dblink);
        if( mysqli_errno($dblink) ){
	         error_log(  mysqli_error($dblink) );
        }
        
      
    }
    
    public function runSql( $sql ) {
        $ret = mysqli_query(  $this->dbWrite()  , $sql );
        $this->saveError( $this->dbWrite );
        return $ret;
    }
    public function getData( $sql , $key = NULL ){
        $GLOBALS['MYSQL_LAST_SQL'] = $sql;
        $data = Array();
        $i = 0;
        $result = mysqli_query( $this->do_replication ? $this->dbRead() : $this->dbWrite() , $sql  );
        
        $this->saveError(  $this->do_replication ? $this->dbRead() : $this->dbWrite() );

        while( $Array = mysqli_fetch_array($result, MYSQL_ASSOC ) ){
        	if( $key && isset( $Array[$key] ) ){
	        	$data[$Array[$key]] = $Array;
        	}else{
	        	$data[$i++] = $Array;
        	}
        }

        /*
        if( mysql_errno() != 0 )
            echo mysql_error() .' ' . $sql;
        */
        
        //mysqli_free_result($result); 

        if( count( $data ) > 0 )
            return $data;
        else
            return false;    
    }
    
    public function getLine( $sql ){
        $data = $this->getData( $sql );
        return @reset($data);
    }
    
    public function getVar( $sql ){
        $data = $this->getLine( $sql );
        return $data[ @reset(@array_keys( $data )) ];
    }
    
    public function lastId(){
        $result = mysqli_insert_id( $this->dbWrite() );
        return $result;
    }
    
    public function closeDb(){
        if( isset( $this->dbRead ) ){
	         @mysqli_close( $this->dbRead );
	         unset( $this->dbRead );
        }
        if( isset( $this->dbWrite ) ){
	        @mysqli_close( $this->dbWrite );
	        unset( $this->dbWrite );
        }
    }
    public function affectedRow(){
	    return mysqli_affected_rows( $this->dbWrite );
    }
    public function escape( $str ){
        if( isset($this->dbRead)) $db = $this->dbRead ;
        elseif( isset($this->dbWrite) )    $db = $this->dbWrite;
        else $db = $this->dbRead();
        
        return mysqli_real_escape_string(  $db , $str );
    }
    
    public function errno(){
        return  $GLOBALS['MYSQL_LAST_ERRNO'];
    }
    
    public function error(){
        return $GLOBALS['MYSQL_LAST_ERROR'];
    }
}