<?php
/**
 * ----------------------------------------------
 * Flame Web-site (PHP/MySQL)
 * Copyright (c) Maksim <<Klym>> Klimenko
 * URL: http://clan-flame.ru
 * ----------------------------------------------
 */

class Db {
	private $host;
	private $user;
	private $pass;
	private $dbname;
	public $DBH;
	
	function __construct($host,$user,$pass,$database) {
		$this->host = $host;
		$this->user = $user;
		$this->pass = $pass;
		$this->dbname = $database;
		
		try {
			$this->DBH = new PDO("mysql:host=$host;dbname=$database",$user,$pass);
		} catch (PDOException $e) {
			die($e->getMessage());
		}
	}
}
?>