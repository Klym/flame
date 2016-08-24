<?php

class RangMapper extends Mapper {
	
	function __construct(PDO $pdo) {
		parent::__construct($pdo);
		$this->selectAllStmt = $this->PDO->prepare("SELECT * FROM playerRangs");
	}
	
	protected function doCreateObject(array $array) {
		$obj = new Rang($array["id"], $array["rangName"], $array["minScores"], $array["maxScores"]);
		return $obj;
	}
}

?>