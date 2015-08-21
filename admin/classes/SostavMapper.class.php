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
	
	protected function doInsert(DomainObject $object) {
		$values = $object->getValues();
		$result = $this->insertStmt->execute($values);
		if (!$result) {
			throw new Exception("Ошибка. Данные не могут быть добавлены");
		}
		$id = $this->PDO->lastInsertId();
		$object->setId($id);
	}
	
	function update(DomainObject $object) {
		$values = $object->getValues();
		array_push($values, $object->getId());
		$this->updateStmt->execute($values);
		if ($this->updateStmt->rowCount() == 0) {
			throw new Exception("Ошибка. Данные не могут быть обновлены");
		}
	}
	
	function selectStmt() {
		return $this->selectStmt;
	}
	
	function selectAllStmt() {
		return $this->selectAllStmt;
	}
	
	function deleteStmt() {
		return $this->deleteStmt;
	}
}

?>