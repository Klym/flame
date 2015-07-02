<?php
/**
 * ----------------------------------------------
 * Flame Web-site (PHP/MySQL)
 * Copyright (c) Maksim <<Klym>> Klimenko
 * URL: http://clan-flame.ru
 * ----------------------------------------------
 */

class Item extends Data {
	public $cat;
	public $catTitle;
	public $meta_d;
	public $meta_k;
	public $authorId;
	public $authorLogin;
	public $date;
	public $description;
	public $view;
	public $commentsCount;
	const TYPE = 2;
	
	function __construct( $id='',$cat='' ) {
		$this->id = $id;
		$this->cat = $cat;
	}
	
	function request() {
		$this->query = "SELECT data.cat AS cat, data.id AS id, title, meta_d, meta_k, description, text, view, DATE_FORMAT(data.date,'%d.%m.%Y') AS date,author,users.login AS authorLogin FROM data JOIN users ON data.author = users.id WHERE cat=? ORDER BY title";
		$getData = parent::getData($this->cat);
		$result = self::requestData( $getData, $this->db );
		$this->dataCount = count($result);
		return $result;
	}
	
	private static function requestData( $data, $db ) {
		parent::setDataArray($data,$db);
		return self::$dataArray;
	}
	
	static function setStaticDataArray( $rows, $i, $db ) {
		self::$dataArray[$i]->cat = $rows[$i]['cat'];
		self::$dataArray[$i]->meta_d = $rows[$i]['meta_d'];
		self::$dataArray[$i]->meta_k = $rows[$i]['meta_k'];
		self::$dataArray[$i]->description = $rows[$i]['description'];
		self::$dataArray[$i]->authorId = $rows[$i]['author'];
		self::$dataArray[$i]->authorLogin = $rows[$i]['authorLogin'];
		self::$dataArray[$i]->date = $rows[$i]['date'];
		self::$dataArray[$i]->view = $rows[$i]['view'];
		self::$dataArray[$i]->relevation = $rows[$i]['relevation'];
		self::$dataArray[$i]->commentsCount = parent::getCommentsCount($db,$rows[$i]['id']);
	}
	
	function getSelectedData() {
		$this->query = "SELECT cat, data.title, data.meta_d, data.meta_k, description, data.text, view, DATE_FORMAT(data.date,'%d.%m.%Y') AS date, author, users.login AS authorLogin, categories.title AS catTitle FROM data INNER JOIN users ON data.author = users.id INNER JOIN categories ON data.cat = categories.id WHERE data.id=?";
		parent::getSelectedData();
	}
	
	function setDataProperties( $rows ) {
		parent::setDataProperties($rows);
		$this->cat = $rows['cat'];
		$this->catTitle = $rows['catTitle'];
		$this->meta_d = $rows['meta_d'];
		$this->meta_k = $rows['meta_k'];
		$this->authorId = $rows['author'];
		$this->authorLogin = $rows['authorLogin'];
		$this->date = $rows['date'];
		$this->description = $rows['description'];
		$this->view = $rows['view'];
		$this->commentsCount = parent::getCommentsCount($this->db, $this->id);
	}
	
	function getLastItems() {
		$this->query = "SELECT id,title FROM data ORDER BY date DESC, id DESC LIMIT 5";
		$getData = parent::getData();
		if (!$getData) {
			throw new DataException("Ошибка базы данных","Запрос на выборку данных из базы не прошел. Напишите об этом администратору, Klymstalker@yandex.ua");
		}
		$result = self::requestData( $getData, $this->db );
		return $result;

	}
	
	function printData($data) {
		$page = "catalog";
		$content = "description";
		parent::printData($data,$page,$content);
	}
	
	function printLastItems($lastItems) {
		for($i = 0; $i < count($lastItems); $i++) {
			printf("<p><a class='lastItems' href='catalog.php?id=%s'>%s</a></p><hr>",$lastItems[$i]->id,$lastItems[$i]->title);
		}
	}
}
?>