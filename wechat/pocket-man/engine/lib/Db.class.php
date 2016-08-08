<?php
class Db{
	public	$ar_sql				= NULL;
	private $ar_select			= array();
	private $ar_from			= array();
	private $ar_where			= array();
	private $ar_like			= array();
	private $ar_set				= array();
	private $ar_offset			= FALSE;
	//private $ar_groupby			= array();
	private $ar_limit			= FALSE;
	private $ar_orderby			= array();
	private $mysql				= false;
	
	public function __construct(){
		if( defined( 'ISSAE' ) && ISSAE  ){
			$master['host'] = SAE_MYSQL_HOST_M.':'.SAE_MYSQL_PORT;
			$master['user'] = SAE_MYSQL_USER;
			$master['passwd'] =SAE_MYSQL_PASS;
			$master['dbname'] = SAE_MYSQL_DB;
			$slave['host'] = SAE_MYSQL_HOST_S.':'.SAE_MYSQL_PORT;
		}else{
			include_once( ROOT.'config/db.config.php' );
		}
		$this->mysql = new Mysql( $master );
		if( isset( $slave ) && $slave ){
			$this->mysql->setSlave( $slave );
		}
	}
	public function __set( $key , $value ){
		if( $key == 'do_replication' ){
			$this->mysql->$key = $value;
			return true;
		}
	}
	public function __get( $key ){
		if( $key == 'sql' ){
			return $this->getSql();
		}
	}
	public function escape( $str ){
		return $this->mysql->escape( $str );
	}
	private function getSql(){
		if( $this->ar_from ){
			$this->ar_sql = $this->_compile_select();
			$this->_resetCache();
		}
		if( $this->ar_sql ){
			return $this->ar_sql;
		}else{
			die('can not make sql...');
		}
	}
	public function getData( $sql = NULL , $key = NULL ){
		if( $sql == NULL ){
			$sql = $this->getSql();
		}else{
			$this->_resetCache();
			$this->ar_sql = $sql;
		}
		return $this->mysql->getData($sql , $key );
	}
	public function getLine( $sql = NULL ){
		if( $sql == NULL ){
			$sql = $this->getSql();
		}else{
			$this->_resetCache();
			$this->ar_sql = $sql;
		}
		return $this->mysql->getLine($sql);
	}
	public function getVar( $sql = NULL ){
		if( $sql == NULL ){
			$sql = $this->getSql();
		}else{
			$this->_resetCache();
			$this->ar_sql = $sql;
		}
		return $this->mysql->getVar($sql);
	}
	public function runSql( $sql = NULL ){
		if( $sql == NULL ){
			$sql = $this->getSql();
		}else{
			$this->_resetCache();
			$this->ar_sql = $sql;
		}
		return $this->mysql->runSql($sql);
	}
	public function lastId(){
		return $this->mysql->lastId();
	}
	public function affectedRow(){
		return $this->mysql->affectedRow();
	}
	public function error(){
		return $this->mysql->error();
	}
	public function delete($table = '', $where = '', $limit = NULL, $reset_data = TRUE){
		if ($table == ''){
			if ( ! isset($this->ar_from[0])){
				die('can not delete error no params...');
			}

			$table = $this->ar_from[0];
		}elseif (is_array($table)){
			foreach ($table as $single_table){
				$this->delete($single_table, $where, $limit, FALSE);
			}
			$this->_resetCache();
			return;
		}
		if ($where != ''){
			$this->where($where);
		}
		if ($limit != NULL){
			$this->limit($limit);
		}
		if (count($this->ar_where) == 0 && count($this->ar_like) == 0){
			die('db_del_must_use_where...');
		}
		$sql = $this->_delete($table, $this->ar_where, $this->ar_like, $this->ar_limit);

		if ($reset_data){
			$this->ar_sql = $sql;
			$this->_resetCache();
		}
		return $this->runSql($sql);
	}
	public function replace($table = '', $set = NULL){
		if ( ! is_null($set)){
			$this->set($set);
		}
		if (count($this->ar_set) == 0){
			die('can not replace error no params...');
		}
		if ($table == ''){
			if ( ! isset($this->ar_from[0])){
					die('can not replace error no table to use...');
			}
			$table = $this->ar_from[0];
		}
		$sql = $this->_replace($table, array_keys($this->ar_set), array_values($this->ar_set));
		$this->ar_sql = $sql;
		$this->_resetCache();
		return $this->runSql($sql);
	}
	public function update($table = '', $set = NULL, $where = NULL, $limit = NULL , $escape = true ){
	
		if ( ! is_null($set)){
			$this->set($set);
		}

		if (count($this->ar_set) == 0){
			die('can not update error no params...');
		}

		if ($table == ''){
			if ( ! isset($this->ar_from[0])){
				die('can not update error no table to use...');
			}
			$table = $this->ar_from[0];
		}
		if ($where != NULL){
			$this->where($where);
		}

		if ($limit != NULL){
			$this->limit($limit);
		}
		if ( $escape && !preg_match("/(`)/i", trim($table))){
			$table = '`'.trim($table).'`';
		}
		
		$sql = $this->_update($table, $this->ar_set, $this->ar_where, $this->ar_orderby, $this->ar_limit);
		$this->ar_sql = $sql;
		$this->_resetCache();
		return $this->runSql($sql);
	}
	public function insert($table = '', $set = NULL){
		if ( ! is_null($set)){
			$this->set($set);
		}
		if (count($this->ar_set) == 0){
			die('can not insert error no params...');
		}
		if ($table == ''){
			if ( ! isset($this->ar_from[0])){
				die('can not insert error no table to use...');
			}
			$table = $this->ar_from[0];
		}
		$sql = $this->_insert($table, array_keys($this->ar_set), array_values($this->ar_set));
		$this->ar_sql = $sql;
		$this->_resetCache();
		return $this->runSql($sql);
	}
	public function select($select = '*'){
		if (is_string($select)){
			$select = explode(',', $select);
		}
		foreach ($select as $val){
			$val = trim($val);
			if ($val != ''){
				$this->ar_select[] = $val;

			}
		}
		return $this;
	}
	public function from($from , $escape = true ){
		foreach ((array)$from as $val){
			if (strpos($val, ',') !== FALSE){
				foreach (explode(',', $val) as $v){
					$v = trim($v);
					if ($escape && !preg_match("/(`)/i", $v )){
						$v  = '`'.trim($v).'`';
					}
					$this->ar_from[] = $v;
				}
			}else{
				$val = trim($val);
				if ($escape && !preg_match("/(`)/i", $val )){
					$val  = '`'.trim($val).'`';
				}
				$this->ar_from[] = $val;
			}
		}

		return $this;
	}
	function like($field, $match = ''){
		return $this->_like($field, $match, 'AND ');
	}
	function notLike($field, $match = '', $side = 'both'){
		return $this->_like($field, $match, 'AND ', 'NOT');
	}
	function orLike($field, $match = ''){
		return $this->_like($field, $match, 'OR ');
	}
	function orNotLike($field, $match = ''){
		return $this->_like($field, $match, 'OR ', 'NOT');
	}
	public function where($key, $value = NULL){
		return $this->_where($key, $value, 'AND ');
	}
	public function orWhere($key, $value = NULL, $escape = TRUE){
		return $this->_where($key, $value, 'OR ', $escape);
	}
	public function orderBy($orderby, $direction = '' , $escape = true  ){
		if (trim($direction) != ''){
			$direction = (in_array(strtoupper(trim($direction)), array('ASC', 'DESC'), TRUE)) ? ' '.$direction : ' ASC';
		}
		if ( $escape && strpos($orderby, ',') !== FALSE){
			$temp = array();
			foreach (explode(',', $orderby) as $part)
			{
				$part = trim($part);
				$temp[] = '`'.$part.'`';
			}
			$orderby = implode(', ', $temp);
		}elseif($escape == true ){
			$orderby ='`'.$orderby.'`';
		}
		$orderby_statement = $orderby.$direction;
		$this->ar_orderby[] = $orderby_statement;
		return $this;
	}
	public function limit($value , $offset = NULL){
		$this->ar_limit = $value;
		if ($offset != ''){
			$this->ar_offset = $offset;
		}
		return $this;
	}
	public function set($key, $value = NULL ,  $escape = true ){
		if ( ! is_array($key)){
			if(is_null($value) && $this->_has_operator($key) ){
				$key = array( $key );
			}else{
				$key = array($key => $value);
			}
		}
		foreach ($key as $k => $v){
			if( is_numeric($k) && strpos( $v , '=' ) !== false ){
				list( $k , $v ) = explode(  '=' , $v  , 2 );
				$k = trim($k);
				$v = trim($v);
				if( $escape ){
					if ( !preg_match("/(`)/i", trim($k))){
						$k = '`'.trim($k).'`';
					}
					if ( !preg_match("/(\-|\+)/i", $v)){
						$v = '`'.trim($v).'`';
					}
				}
				
			}else{
				if ( $escape ){
					$k = '`'.$k.'`';
					$v = "'".$this->escape($v)."'";
				}
			}
			
			$this->ar_set[$k] = $v;
		}
		return $this;
	}
	private function _resetCache(){
		$this->ar_select = array();
		$this->ar_from = array();
		$this->ar_where = array();
		$this->ar_like = array();
		$this->ar_offset = FALSE;
		$this->ar_limit = FALSE;
		$this->ar_orderby = array();
		$this->ar_set = array();
	}
	private function _like($field, $match = '', $type = 'AND ', $not = ''){
		if ( ! is_array($field)){
			$field = array($field => $match);
		}
		foreach ($field as $k => $v){
			$prefix = (count($this->ar_like) == 0) ? '' : $type;
			$v = $this->escape($v);
			$like_statement = $prefix." `$k` $not LIKE '%{$v}%'";
			$this->ar_like[] = $like_statement;
	
		}
		return $this;
	}
	private function _where($key, $value = NULL, $type = 'AND ', $escape = NULL){
		if ( ! is_array($key)){
			$key = array($key => $value);
		}

		// If the escape value was not set will will base it on the global setting
		if ( ! is_bool($escape)){
			//$escape = $this->_protect_identifiers;
		}

		foreach ($key as $k => $v){
			$prefix = (count($this->ar_where) == 0 ) ? '' : $type;
			if( !is_numeric($k) ){
			
				if (is_null($v) && ! $this->_has_operator($k)){
					// value appears not to have been set, assign the test to IS NULL
					$k = '`'.$k.'`'.' IS NULL';
					//$v = "'".$this->escape($v)."'";
				}
	
				if ( ! is_null($v)){
					if ( ! $this->_has_operator($k)){
						$k = '`'.$k.'` =';
					}
					$v = "'".$this->escape($v)."'";
				}
			}else{
				$k = NULL;
			}	
			$this->ar_where[] = $prefix.$k.$v;


		}

		return $this;
	}
	private function _has_operator($str){
		$str = trim($str);
		if ( ! preg_match("/(\s|<|>|!|=|is null|is not null)/i", $str)){
			return FALSE;
		}
		return TRUE;
	}
	private function _compile_select(){
	
		$sql =  'SELECT ' ;

		if (count($this->ar_select) == 0){
			$sql .= '*';
		}else{
			$sql .= implode(', ', $this->ar_select);
		}

		if (count($this->ar_from) > 0){
			$sql .= "\nFROM ";
			$sql .= implode("\n", $this->ar_from);
		}
		if (count($this->ar_where) > 0 OR count($this->ar_like) > 0){
			$sql .= "\n";
			$sql .= "WHERE ";
		}
		$sql .= implode("\n", $this->ar_where);
		if (count($this->ar_like) > 0){
			if (count($this->ar_where) > 0){
				$sql .= "\nAND ";
			}
			$sql .= implode("\n", $this->ar_like);
		}
		if (count($this->ar_orderby) > 0){
			$sql .= "\nORDER BY ";
			$sql .= implode(', ', $this->ar_orderby);
		}
		if (is_numeric($this->ar_limit)){
			$sql .= "\nLIMIT ";
			$sql .= $this->ar_limit;
			if( intval( $this->ar_offset ) ){
				$sql .= ','.intval( $this->ar_offset );
			}
		}
		return $sql;
	}
	private function _insert($table , $keys , $values ){
		$sql = "INSERT INTO $table (".join(',',$keys).")VALUES(".join(",",$values).")";
		return $sql;
	}
	private function _update($table, $values, $where, $orderby = array(), $limit = FALSE){
		foreach ($values as $key => $val){
			$valstr[] = $key . ' = ' . $val;
		}
		$limit = ( ! $limit) ? '' : ' LIMIT '.$limit;
		$orderby = (count($orderby) >= 1)?' ORDER BY '.implode(", ", $orderby):'';
		$sql = "UPDATE ".$table." SET ".implode(', ', $valstr);
		$sql .= ($where != '' AND count($where) >=1) ? " WHERE ".implode(" ", $where) : '';
		$sql .= $orderby.$limit;

		return $sql;
	}
	private function _replace($table, $keys, $values){
		return "REPLACE INTO ".$table." (".implode(', ', $keys).") VALUES (".implode(', ', $values).")";
	}
	private function _delete($table, $where = array(), $like = array(), $limit = FALSE){
		$conditions = '';
		if (count($where) > 0 OR count($like) > 0){
			$conditions = "\nWHERE ";
			$conditions .= implode("\n", $where);
			if (count($like) > 0){
				$conditions .= " AND ";
				$conditions .= implode("\n", $like);
			}
		}
		$limit = ( ! $limit) ? '' : ' LIMIT '.$limit;

		return "DELETE FROM ".$table.$conditions.$limit;
	}
}