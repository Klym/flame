<?php

class DataItemMapper extends Mapper {
	
	function __construct($pdo) {
		parent::__construct($pdo);
		$this->selectStmt = $this->PDO->prepare("SELECT * FROM data WHERE id=?");
		$this->selectAllStmt = $this->PDO->prepare("SELECT * FROM data");
		$this->insertStmt = $this->PDO->prepare("INSERT INTO data (title, text, cat, meta_d, meta_k, description, view, author, date) VALUES (?,?,?,?,?,?,?,?,?)");
		$this->updateStmt = $this->PDO->prepare("UPDATE data SET title=?, text=?, cat=?, meta_d=?, meta_k=?, description=?, view=?, author=?, date=? WHERE id=?");
		$this->deleteStmt = $this->PDO->prepare("DELETE FROM date WHERE id=?");
	}
	
	protected function doCreateObject(array $array) {
		$obj = new DataItem($array["id"], $array["title"], $array["text"], $array["cat"], $array["meta_d"], $array["meta_k"], $array["description"], $array["view"], $array["author"], $array["date"]);
		return $obj;
	}
}

?>