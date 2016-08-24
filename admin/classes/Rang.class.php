<?php

class Rang extends DomainObject {
	private $rangName;
	private $minScores;
	private $maxScores;
	
	function __construct($id = null, $rangName, $minScores, $maxScores) {
		parent::__construct($id);
		$this->rangName = $rangName;
		$this->minScores = $minScores;
		$this->maxScores = $maxScores;
	}
	
	function getValues() {
		return array($this->rangName, $this->minScores, $this->maxScores);
	}
}

?>