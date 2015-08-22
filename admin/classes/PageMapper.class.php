<?php

class PageMapper extends Mapper {
	
	function __construct(PDO $pdo) {
		parent::__construct($pdo);
		$this->selectStmt = $this->PDO->prepare("SELECT * FROM settings WHERE id=?");
		$this->selectAllStmt = $this->PDO->prepare("SELECT * FROM settings");
		$this->insertStmt = $this->PDO->prepare("INSERT INTO settings (page, title, meta_d, meta_k) VALUES (?,?,?,?)");
		$this->updateStmt = $this->PDO->prepare("UPDATE settings SET page=?, title=?, meta_d=?, meta_k=? WHERE id=?");
		$this->deleteStmt = $this->PDO->prepare("DELETE FROM settings WHERE id=?");
	}
	
	protected function doCreateObject(array $array) {
		$obj = new Page($array["id"], $array["page"], $array["title"], $array["meta_d"], $array["meta_k"]);
		return $obj;
	}
}

?>