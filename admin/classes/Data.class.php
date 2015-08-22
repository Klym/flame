<?php

abstract class Data extends DomainObject {
	private $title;
	private $text;
	
	function __construct($id = null, $title, $text) {
		parent::__construct($id);
		$this->title = $title;
		$this->text = $text;
	}
	
	function getValues() {
		return array($this->title, $this->text);
	}
}

?>