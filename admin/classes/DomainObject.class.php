<?php

abstract class DomainObject {
	private $id;
	
	function __construct($id = null) {
		$this->id = $id;
	}
	
	function getId() {
		return $this->id;
	}
	
	function setId($id) {
		$this->id = $id;
	}
	
	abstract function getValues();
}

?>