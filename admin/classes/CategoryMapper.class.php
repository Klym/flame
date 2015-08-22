<?php

class CategoryMapper extends Mapper {
	
	function __construct($pdo) {
		parent::__construct($pdo);
		$this->selectStmt = $this->PDO->prepare("SELECT * FROM categories WHERE id=?");
		$this->selectAllStmt = $this->PDO->prepare("SELECT * FROM categories");
		$this->insertStmt = $this->PDO->prepare("INSERT INTO categories (title, text, meta_d, meta_k) VALUES (?,?,?,?)");
		$this->updateStmt = $this->PDO->prepare("UPDATE categories SET title=?, text=?, meta_d=?, meta_k=? WHERE id=?");
		$this->deleteStmt = $this->PDO->prepare("DELETE FROM categories WHERE id=?");
	}
	
	protected function doCreateObject(array $array) {
		$obj = new Category($array["id"], $array["title"], $array["text"], $array["meta_d"], $array["meta_k"]);
		return $obj;
	}
}

?>