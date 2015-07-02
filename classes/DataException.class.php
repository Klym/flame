<?php
/**
 * ----------------------------------------------
 * Flame Web-site (PHP/MySQL)
 * Copyright (c) Maksim <<Klym>> Klimenko
 * URL: http://clan-flame.ru
 * ----------------------------------------------
 */

class DataException extends Exception {
	public $title;
	public $message;
	
	function __construct( $title='', $message='' ) {
		$this->title = $title;
		$this->message = $message;
	}
	
	function notDeveloped() {
		throw new DataException("Невозможно отобразить страницу","В данный момент страница недоступна. Модуль находиться в разработке.");
	}
}

?>