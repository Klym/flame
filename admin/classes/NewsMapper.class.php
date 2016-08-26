<?php

class NewsMapper extends Mapper {
	
	function __construct($pdo) {
		parent::__construct($pdo);
		$this->selectCount = $this->PDO->prepare("SELECT COUNT(id) AS count FROM news");
		$this->selectStmt = $this->PDO->prepare("SELECT * FROM news WHERE id=?");
		$this->selectCollectionStmt = $this->PDO->prepare("SELECT id, title, date, type FROM news ORDER BY date DESC LIMIT ?, ?");
		$this->selectAllStmt = $this->PDO->prepare("SELECT * FROM news");
		$this->insertStmt = $this->PDO->prepare("INSERT INTO news (title, text, full_text, date, author, view, type) VALUES (?,?,?,?,?,?,?)");
		$this->updateStmt = $this->PDO->prepare("UPDATE categories SET title=?, text=?, full_text=?, date=?, author=?, view=?, type=? WHERE id=?");
		$this->deleteStmt = $this->PDO->prepare("DELETE FROM news WHERE id=?");
	}
	
	protected function doCreateObject(array $array) {
		$obj = new News($array["id"], $array["title"], $array["text"], $array["full_text"], $array["date"], $array["author"], $array["view"], $array["type"]);
		return $obj;
	}
}

?>