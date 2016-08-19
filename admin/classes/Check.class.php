<?php

class Check {
	private $pdo;
	
	public function __construct($pdo) {
		$this->pdo = $pdo;
	}
	
	public function check($login, $pass) {
		$stmt = $this->pdo->prepare("SELECT id FROM users WHERE login = ? AND password = ? AND access = ?");
		$stmt->bindValue(1, $login, PDO::PARAM_STR);
		$stmt->bindValue(2, $pass, PDO::PARAM_STR);
		$stmt->bindValue(3, 1, PDO::PARAM_INT);
		$stmt->execute();
		$admin = $stmt->fetch();
		return ($admin) ? true : false;
	}
}

?>