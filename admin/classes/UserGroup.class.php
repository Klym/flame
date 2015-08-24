<?php

class UserGroup extends DomainObject {
	private $title;
	private $color;
	
	function __construct($id = null, $title, $color) {
		parent::__construct($id);
		$this->title = $title;
		$this->color = $color;
	}
	
	function getValues() {
		return array($this->title, $this->color);
	}
}

?>