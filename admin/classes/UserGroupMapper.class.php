<?php

class UserGroupMapper extends Mapper {
	
	function __construct(PDO $pdo) {
		parent::__construct($pdo);
		$this->selectStmt = $this->PDO->prepare("SELECT * FROM usergroups WHERE id=?");
		$this->selectAllStmt = $this->PDO->prepare("SELECT id, title FROM usergroups");
		$this->insertStmt = $this->PDO->prepare("INSERT INTO usergroups (title, color) VALUES (?,?)");
		$this->updateStmt = $this->PDO->prepare("UPDATE usergroups SET title=?, color=? WHERE id=?");
		$this->deleteStmt = $this->PDO->prepare("DELETE FROM usergroups WHERE id=?");
	}
	
	protected function doCreateObject(array $array) {
		$obj = new UserGroup($array["id"], $array["title"], $array["color"]);
		return $obj;
	}
}

?>