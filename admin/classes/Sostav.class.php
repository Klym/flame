<?php

class Sostav extends DomainObject {
	private $name;
	private $scores;
	private $rang;
	private $dol;
	private $fullName;
	private $skype;
	
	function __construct($id = null, $name, $scores, $rang, $dol, $fullName, $skype) {
		parent::__construct($id);
		$this->name = $name;
		$this->scores = $scores;
		$this->rang = $rang;
		$this->dol = $dol;
		$this->fullName = $fullName;
		$this->skype = $skype;
	}
	
	function getValues() {
		return array($this->name, $this->scores, $this->rang, $this->dol, $this->fullName, $this->skype);
	}
}

?>