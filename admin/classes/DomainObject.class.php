<?php

abstract class DomainObject {
	private $id;
	
	function __construct($id = null) {
		$this->id = $id;
	}
	
	function getId() {
		return $this->id;
	}
}

?>