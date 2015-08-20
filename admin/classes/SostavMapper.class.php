<?php

class SostavMapper extends Mapper {
	
	function __construct(PDO $pdo) {
		parent::__construct($pdo);
		$this->selectStmt = $this->PDO->prepare("SELECT * FROM sostav WHERE id=?");
		$this->selectAllStmt = $this->PDO->prepare("SELECT * FROM sostav");
		$this->insertStmt = $this->PDO->prepare("INSERT INTO sostav (name, scores, rang, dol, fullName, skype) VALUES (?,?,?,?,?,?)");
		$this->updateStmt = $this->PDO->prepare("UPDATE sostav SET name=?, scores=?, rang=?, dol=?, fullName=?, skype=? WHERE id=?");
	}
	
	protected function doCreateObject(array $array) {
		$obj = new Sostav($array["id"], $array["name"], $array["scores"],
						  $array["rang"], $array["dol"], $array["fullName"], $array["skype"]);
		return $obj;
	}
	
	protected function doInsert(DomainObject $object) {
		$values = $object->getValues();
		$this->insertStmt->execute($values);
		$id = $this->PDO->lastInsertedId();
		$object->setId($id);
	}
	
	function update(DomainObject $object) {
		$values = $object->getValues();
		array_push($values, $object->getId());
		$result = $this->updateStmt->execute($values);
		if (!$result) {
			throw new Exception("Ошибка базы данных");
		}
	}
	
	function selectStmt() {
		return $this->selectStmt;
	}
	
	function selectAllStmt() {
		return $this->selectAllStmt;
	}
}

?>