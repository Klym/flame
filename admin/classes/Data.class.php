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
	
	public static function checkData($data) {
		$data = trim($data);
		$data = stripslashes($data);
		$data = htmlspecialchars($data, ENT_QUOTES | ENT_HTML5 | ENT_DISALLOWED | ENT_SUBSTITUTE, 'UTF-8');
		return $data;
	}
}

?>