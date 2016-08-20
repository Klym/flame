<?php

abstract class Mapper {
	protected $PDO;
	
	function __construct(PDO $pdo) {
		$this->PDO = $pdo;
	}
	
	protected abstract function doCreateObject(array $array);
	
	function getCount() {
 		$result = $this->selectCount->execute();
 		if (!$result) {
 			throw new Exception("Ошибка. Данные по запросу не могут быть извлечены");
 		}
 		$this->selectCount->setFetchMode(PDO::FETCH_ASSOC);
 		$row = $this->selectCount->fetch();
 		return $row['count'];
 	}
	
	function find($id) {
		$this->selectStmt->bindValue("1", (int)$id, PDO::PARAM_INT);
		$this->selectStmt->execute();
		$array = $this->selectStmt->fetch();
		$this->selectStmt->closeCursor();
		if (!is_array($array)) return null;
		if (!isset($array["id"])) return null;
		return json_encode(array($array));
	}
	
	function findCollection($from, $to) {
 		$this->selectCollectionStmt->bindValue("1", (int)$from, PDO::PARAM_INT);
 		$this->selectCollectionStmt->bindValue("2", (int)$to, PDO::PARAM_INT);
 		$result = $this->selectCollectionStmt->execute();
		if (!$result) {
			throw new Exception("Ошибка. Данные по запросу не могут быть извлечены");
		}
		$this->selectCollectionStmt->setFetchMode(PDO::FETCH_ASSOC);
		while($fetch = $this->selectCollectionStmt->fetch()) {
			$rows[] = $fetch;
		}
		return json_encode($rows);
	}
	
	function findAll() {
		$result = $this->selectAllStmt->execute();
		if (!$result) {
			throw new Exception("Ошибка. Данные по запросу не могут быть извлечены");
		}
		$this->selectAllStmt->setFetchMode(PDO::FETCH_ASSOC);
		while($fetch = $this->selectAllStmt->fetch()) {
			$rows[] = $fetch;
		}
		return json_encode($rows);
	}
	
	function createObject($array) {
		$obj = $this->doCreateObject($array);
		return $obj;
	}
	
	function insert(DomainObject $obj) {
		$values = $obj->getValues();
		$result = $this->insertStmt->execute($values);
		if (!$result) {
			throw new Exception("Ошибка. Данные не могут быть добавлены");
		}
		$id = $this->PDO->lastInsertId();
		$obj->setId($id);
	}
	
	function update(DomainObject $object) {
		$values = $object->getValues();
		array_push($values, $object->getId());
		$this->updateStmt->execute($values);
		if ($this->updateStmt->rowCount() == 0) {
			throw new Exception("Ошибка. Данные не могут быть обновлены");
		}
	}
	
	function delete($id) {
		$this->deleteStmt->execute(array($id));
		if ($this->deleteStmt->rowCount() == 0) {
			throw new Exception("Ошибка. Данные не могут быть удалены");
		}
	}
}

?>