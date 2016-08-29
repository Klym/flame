<?php

class Db {
	private $DBH;
	private static $instance;
	
	private function __construct() {  }
	
	public static function getInstance() {
		if (empty(self::$instance)) {
			self::$instance = new Db();
		}
		return self::$instance;
	}
	
	public function setDb($host, $user, $pass, $db) {
		try {
			$this->DBH = new PDO("mysql:host=$host;dbname=$db", $user, $pass);
		} catch (PDOException $e) {
			die($e->getMessage());
		}
		$this->DBH->setAttribute( PDO::ATTR_ERRMODE, PDO::ERRMODE_WARNING );
		$this->DBH->prepare("SET NAMES utf8")->execute();
	}
	
	public function getDb() {
		return $this->DBH;
	}
}

?>