<?php
/**
 * ----------------------------------------------
 * Flame Web-site (PHP/MySQL)
 * Copyright (c) Maksim <<Klym>> Klimenko
 * URL: http://clan-flame.ru
 * ----------------------------------------------
 */

class News extends Data {
	public $full_text;
	public $authorId;
	public $authorLogin;
	public $date;
	public $view;
	public $commentsCount;
	const TYPE = 1;
	
	function __construct( $id='' ) {
		$this->id = $id;
	}
	
	function request() {
		$this->query = "SELECT news.id AS id, title, text, view, DATE_FORMAT(news.date,'%d.%m.%Y') AS date,author,users.login AS authorLogin FROM news JOIN users ON news.author = users.id WHERE type = 1 OR type = 2 ORDER BY id DESC";
		$getData = parent::getData();
		$result = self::requestData( $getData,$this->db );
		$this->dataCount = count($result);
		return $result;
	}
		
	protected static function requestData(  $data, $db ) {
		parent::setDataArray($data, $db);
		return self::$dataArray;
	}

	static function setStaticDataArray( $rows, $i, $db ) {
		self::$dataArray[$i]->authorId = $rows[$i]['author'];
		self::$dataArray[$i]->authorLogin = $rows[$i]['authorLogin'];
		self::$dataArray[$i]->date = $rows[$i]['date'];
		self::$dataArray[$i]->view = $rows[$i]['view'];
		self::$dataArray[$i]->commentsCount = parent::getCommentsCount($db,$rows[$i]['id']);
	}
		
	function getSelectedData() {
		$this->query = "SELECT news.id AS id, title, text, full_text,view, DATE_FORMAT(news.date,'%d.%m.%Y') AS date,author,users.login AS authorLogin FROM news JOIN users ON news.author = users.id WHERE news.id=?";
		parent::getSelectedData();
	}
	
	function setDataProperties( $rows ) {
		parent::setDataProperties($rows);
		$this->full_text = $rows['full_text'];
		$this->view = $rows['view'];
		$this->date = $rows['date'];
		$this->authorId = $rows['author'];
		$this->authorLogin = $rows['authorLogin'];
		$this->commentsCount = parent::getCommentsCount($this->db, $this->id);
	}
	
	function printData($data) {
		$page = "viewNews";
		$content = "text";
		parent::printData($data,$page,$content);
	}
}
?>