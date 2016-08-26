<?php

class News extends Data {
	private $full_text;
	private $date;
	private $author;
	private $view;
	private $type;
	
	function __construct($id = null, $title, $text, $full_text, $date, $author, $view, $type) {
		parent::__construct($id, $title, $text);
		$this->full_text = $full_text;
		$this->date = $date;
		$this->author = $author;
		$this->view = $view;
		$this->type = $type;
	}
	
	function getValues() {
		$arr = parent::getValues();
		array_push($arr, $this->full_text, $this->date, $this->author, $this->view, $this->type);
		return $arr;
	}
}

?>