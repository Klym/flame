<?php

abstract class Mapper {
	protected $PDO;
	
	function __construct(PDO $pdo) {
		$this->PDO = $pdo;
	}
	
	function find($id) {
		$this->selectStmt()->execute(array($id));
		$array = $this->selectStmt()->fetch();
		$this->selectStmt()->closeCursor();
		if (!is_array($array)) return null;
		if (!isset($array["id"])) return null;
		$object = $this->createObject($array);
		return $object;
	}
	
	function findAll() {
		$result = $this->selectAllStmt()->execute(array());
		if (!$result) {
			throw new Exception("Ошибка. Данные по запросу не могут быть извлечены");
		}
		$this->selectAllStmt()->setFetchMode(PDO::FETCH_ASSOC);
		while($fetch = $this->selectAllStmt()->fetch()) {
			$rows[] = $fetch;
		}
		return json_encode($rows);
	}
	
	function createObject($array) {
		$obj = $this->doCreateObject($array);
		return $obj;
	}
	
	function insert(DomainObject $obj) {
		$this->doInsert($obj);
	}
	
	function delete($id) {
		$this->deleteStmt()->execute(array($id));
		if ($this->deleteStmt()->rowCount() == 0) {
			throw new Exception("Ошибка. Данные не могут быть удалены");
		}
	}
	
	abstract function update(DomainObject $obj);
	protected abstract function doCreateObject(array $array);
	protected abstract function doInsert(DomainObject $object);
	protected abstract function selectStmt();
}

?>