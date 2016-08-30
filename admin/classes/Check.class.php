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
	
	public function check_ip($ip) {
		$stmt = $this->pdo->prepare("SELECT id, count FROM block_ip WHERE ip = ?");
		$stmt->bindValue(1, $ip, PDO::PARAM_STR);
		$stmt->execute();
		$item = $stmt->fetch();
		return $item;
	}
	
	public function add_ip($ip) {
		$stmt = $this->pdo->prepare("INSERT INTO block_ip (ip, count, datetime) VALUES (?,1,?)");
		$stmt->bindParam(1, $ip);
		$stmt->bindParam(2, time());
		$stmt->execute();
	}
	
	public function update_ip($id, $count) {
		$stmt = $this->pdo->prepare("UPDATE block_ip SET count = ?, datetime = ? WHERE id = ?");
		$stmt->bindValue(1, $count + 1, PDO::PARAM_INT);
		$stmt->bindValue(2, time());
		$stmt->bindValue(3, $id);
		$stmt->execute();
	}
	
	public function delete_ip($id) {
		$stmt = $this->pdo->prepare("DELETE FROM block_ip WHERE id = ?");
		$stmt->bindValue(1, $id, PDO::PARAM_INT);
		$stmt->execute();
	}
	
	public function delete_old() {
		$stmt = $this->pdo->prepare("DELETE FROM block_ip WHERE (? - datetime) >= 300");
		$stmt->bindValue(1, time());
		$stmt->execute();
	}
	
	public static function rewrite() {
		$fingerprint = md5($_SESSION['login'].$_SERVER['HTTP_USER_AGENT'].session_id());
		if (isset($_SESSION["login"]) && $_SESSION['ip'] == $_SERVER['REMOTE_ADDR'] && $_SESSION['fingerprint'] == $fingerprint) {
			header("Location: index.php");
		}
	}
}

?>