<?php

class Page extends DomainObject {
	private $page;
	private $title;
	private $meta_d;
	private $meta_k;
	
	function __construct($id = null, $page, $title, $meta_d, $meta_k) {
		parent::__construct($id);
		$this->page = $page;
		$this->title = $title;
		$this->meta_d = $meta_d;
		$this->meta_k = $meta_k;
	}
	
	function getValues() {
		return array($this->page, $this->title, $this->meta_d, $this->meta_k);
	}
}

?>