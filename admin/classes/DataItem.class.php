<?php

class DataItem extends Data {
	private $cat;
	private $meta_d;
	private $meta_k;
	private $description;
	private $view;
	private $author;
	private $date;
	
	function __construct($id = null, $title, $text, $cat, $meta_d, $meta_k, $description, $view, $author, $date) {
		parent::__construct($id, $title, $text);
		$this->cat = $cat;
		$this->meta_d = $meta_d;
		$this->meta_k = $meta_k;
		$this->description = $description;
		$this->view = $view;
		$this->author = $author;
		$this->date = $date;
	}
	
	function getValues() {
		$arr = parent::getValues();
		array_push($arr, $this->cat, $this->meta_d, $this->meta_k, $this->description, $this->view, $this->author, $this->date);
		return $arr;
	}
}

?>