<?php

class Category extends Data {
	private $meta_d;
	private $meta_k;
	
	function __construct($id = null, $title, $text, $meta_d, $meta_k) {
		parent::__construct($id, $title, $text);
		$this->meta_d = $meta_d;
		$this->meta_k = $meta_k;
	}
	
	function getValues() {
		$arr = parent::getValues();
		return array($arr[0], $this->meta_d, $this->meta_k, $arr[1]);
	}
}

?>