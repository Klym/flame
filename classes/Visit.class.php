<?php
/**
 * ----------------------------------------------
 * Flame Web-site (PHP/MySQL)
 * Copyright (c) Maksim <<Klym>> Klimenko
 * URL: http://clan-flame.ru
 * ----------------------------------------------
 */
 
abstract class Visit {
	protected $id;
	protected $sessionId;
	protected $db;
	protected static $arr;

	function __construct( $id='', $sessionId='', $db='' ) {
		$this->id = $id;
		$this->sessionId = $sessionId;
		$this->db = $db;
	}
	
	function get() {
		$get = $this->db->DBH->prepare(static::$getQuery);
		$get->execute();
		$count = $get->rowCount();
		for ($i = 1; $rows = $get->fetch(); $i++) {
			printf("<a style='color:%s' href='page.php?id=%s'>%s</a>",$rows['color'],$rows['uId'],$rows['login']);
			if ($i != $count) {
				print(", ");
			}
		}
	}

	function set() {
		$select = $this->db->DBH->prepare(static::$setQuery);
		$select->bindParam(1,$this->id);
		$select->execute();
		$count = $select->rowCount();
		if ($count == 0) {
			$add = $this->db->DBH->prepare(static::$addQuery);
			$add->execute(static::$arr);
		}
	}
	
	abstract function del();
	abstract function setArr();
}
?>