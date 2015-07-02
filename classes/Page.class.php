<?php
/**
 * ----------------------------------------------
 * Flame Web-site (PHP/MySQL)
 * Copyright (c) Maksim <<Klym>> Klimenko
 * URL: http://clan-flame.ru
 * ----------------------------------------------
 */

class Page {
	public $page;
	public $title;
	public $meta_d;
	public $meta_k;
	public $db;
	
	function __construct($page,$db) {
		$this->page = $page;
		$this->db = $db;
	}
	
	function getPageSettings() {
		$STH = $this->db->DBH->prepare("SELECT * FROM settings WHERE page=?");
		$STH->bindParam(1,$this->page);
		$STH->execute();
		$rows = $STH->fetch();
		if (!$rows) {
			throw new DataException("Ошибка базы данных","Запрос на выборку данных из базы не прошел. Напишите об этом администратору, Klymstalker@yandex.ua");
		}
		$this->title = $rows['title'];
		$this->meta_d = $rows['meta_d'];
		$this->meta_k = $rows['meta_k'];
	}
}
?>