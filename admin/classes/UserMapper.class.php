<?php

class UserMapper extends Mapper {
	
	function __construct(PDO $pdo) {
		parent::__construct($pdo);
		$this->selectCount = $this->PDO->prepare("SELECT COUNT(id) AS count FROM users");
		$this->selectStmt = $this->PDO->prepare("SELECT * FROM users WHERE id=?");
		$this->selectCollectionStmt = $this->PDO->prepare("SELECT id, login, name, fam, email, access, regDate FROM users LIMIT ?, ?");
		$this->selectAllStmt = $this->PDO->prepare("SELECT id, login FROM users WHERE access=1");
		$this->insertStmt = $this->PDO->prepare("INSERT INTO users (login, password, email, access, name, fam, pol, regDate, birthDate, avatar, activation) VALUES (?,?,?,?,?,?,?,?,?,?,?)");
		$this->updateStmt = $this->PDO->prepare("UPDATE users SET login=?, password=?, email=?, access=?, name=?, fam=?, pol=?, regDate=?, birthDate=?, avatar=?, activation=? WHERE id=?");
		$this->deleteStmt = $this->PDO->prepare("DELETE FROM users WHERE id=?");
	}
	
	protected function doCreateObject(array $array) {
		$obj = new User($array["id"], $array["login"], $array["password"], $array["email"], $array["access"], $array["name"], $array["fam"], $array["pol"], $array["regDate"], $array["birthDate"], $array["avatar"], $array["activation"]);
		return $obj;
	}
}

?>