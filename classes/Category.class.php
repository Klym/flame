<?php
/**
 * ----------------------------------------------
 * Flame Web-site (PHP/MySQL)
 * Copyright (c) Maksim <<Klym>> Klimenko
 * URL: http://clan-flame.ru
 * ----------------------------------------------
 */

class Category extends Data {
	public $filesCount;
	public $meta_d;
	public $meta_k;
	
	function __construct($id='') {
		$this->id = $id;
	}
	
	function request() {
		$this->query = "SELECT * FROM categories";
		return self::requestData( parent::getData() );
	}
	
	private static function requestData( $data ) {
		parent::setDataArray($data);
		return self::$dataArray;
	}
	
	static function setStaticDataArray( $rows, $i ) {
		return false;
	}
	
	function getFilesCount( $id ) {
		$STH = $this->db->DBH->prepare("SELECT id FROM data WHERE cat=?");
		$STH->bindParam(1,$id);
		if (!$STH->execute()) {
			throw new DataException("Ошибка базы данных","Запрос на выборку данных из базы не прошел. Напишите об этом администратору.  E-mail: support@clan-flame.ru");
		}
		$this->filesCount = $STH->rowCount();
	}
	
	function printCategories($categories) {
		$endings = array('','а','ов');
		for ($i = 0; $i < count($categories); $i++) {
			self::getFilesCount($categories[$i]->id);
			printf("<div class='catalog'>
						<div class='catalogTitleBack'>
							<a href='catalog.php?cat=%s'>%s</a>
							<div class='filesCount'><p>%s файл%s</p></div>
						</div>
						<div class='catalogText'>%s</div>
					</div>",$categories[$i]->id, $categories[$i]->title, $this->filesCount, $endings[self::declension($this->filesCount)], $categories[$i]->text);
		}
	}
	
	function getSelectedData() {
		$this->query = "SELECT title,meta_d,meta_k FROM categories WHERE id=?";
		parent::getSelectedData();
	}
	
	function setDataProperties($rows) {
		$this->title = $rows['title'];
		$this->meta_d = $rows['meta_d'];
		$this->meta_k = $rows['meta_k'];
	}
	
	static function declension($count) {
		$number = $count % 100;
		if ($number >= 11 && $number <= 19) {
			$ending = 2;
		}
		else {
			$i = $number % 10;
			switch($i) {
				case 1: $ending = 0; break;
				case 2:
				case 3:
				case 4: $ending = 1; break;
				default:  $ending = 2;
			}
		}
		return $ending;
	}
}
?>