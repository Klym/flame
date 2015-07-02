<?php
/**
 * ----------------------------------------------
 * Flame Web-site (PHP/MySQL)
 * Copyright (c) Maksim <<Klym>> Klimenko
 * URL: http://clan-flame.ru
 * ----------------------------------------------
 */

abstract class Chat {
	public $id;			// Код записи
	public $authorId;	// id автора записи
	public $authorLogin;// Логин автора
	public $message;	// Сообщение автора
	public $date;		// Дата и время добавления сообщения
	public $lastMod;	// Дата последнего обновления
	public $dialogId;   // id диалога
	public $db;			// Обьект базы данных PDO
	protected static $messages = array(); // Массив обьектов сообщений

	function __construct($db='', $id=0, $authorId='', $message='', $date='', $authorLogin='', $lastMod='', $dialogId='') {
		$this->db = $db;
		$this->id = $id;
		$this->authorId = $authorId;
		$this->message = $message;
		$this->date = $date;
		$this->authorLogin = $authorLogin;
		$this->lastMod = $lastMod;
		$this->dialogId = $dialogId;
	}
	
	function getUserLogin() {
		$STH = $this->db->DBH->prepare("SELECT login FROM users WHERE id=?");
		$STH->bindParam(1,$this->authorId);
		$STH->execute();
		$rows = $STH->fetch();
		return $rows['login'];
	}

	function dateToString($date) { // Преобразует дату в строковый вид
		if (is_numeric($date)) {
			return date("d.m.Y H:i",$date);
		}
		else {
			return $date;
		}
	}
}
?>