<?php

class SostavMapper extends Mapper {
	
	function __construct(PDO $pdo) {
		parent::__construct($pdo);
		$this->selectStmt = $this->PDO->prepare("SELECT * FROM sostav WHERE id=?");
		$this->selectAllStmt = $this->PDO->prepare("SELECT * FROM sostav");
		$this->insertStmt = $this->PDO->prepare("INSERT INTO sostav (name, scores, rang, dol, fullName, skype) VALUES (?,?,?,?,?,?)");
		$this->updateStmt = $this->PDO->prepare("UPDATE sostav SET name=?, scores=?, rang=?, dol=?, fullName=?, skype=? WHERE id=?");
		$this->deleteStmt = $this->PDO->prepare("DELETE FROM sostav WHERE id=?");
	}
	
	protected function doCreateObject(array $array) {
		$obj = new Sostav($array["id"], $array["name"], $array["scores"],
						  $array["rang"], $array["dol"], $array["fullName"], $array["skype"]);
		return $obj;
	}
}

?>