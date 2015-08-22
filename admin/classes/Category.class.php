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
		array_push($arr, $this->meta_d, $this->meta_k);
		return $arr;
	}
}

?>