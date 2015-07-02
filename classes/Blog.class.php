<?php
/**
 * ----------------------------------------------
 * Flame Web-site (PHP/MySQL)
 * Copyright (c) Maksim <<Klym>> Klimenko
 * URL: http://clan-flame.ru
 * ----------------------------------------------
 */

class Blog extends News {
	const TYPE = 3;
	
	function request() {
		$this->query = "SELECT news.id AS id, title, text, view, DATE_FORMAT(news.date,'%d.%m.%Y') AS date,author,users.login AS authorLogin FROM news JOIN users ON news.author = users.id WHERE type = 3 OR type = 2 ORDER BY id DESC";
		$getData = parent::getData();
		$result = self::requestData( $getData,$this->db );
		$this->dataCount = count($result);
		return $result;
	}
	
	function printData() {
		$data = static::$dataArray;
		for($i = 0; $i < count($data); $i++) {
			printf("<div class='blogNews'>
					<div class='newsTitleImg' style='width:100%%'><a href='viewBlog.php?id=%s'>%s</a></div>
					<div class='blogNewsContent'>%s</div>
					<div class='blogNewsFooter'></div>
					<div class='newsFooterContent'>Добавил: <a href='page.php?id=%s'>%s</a> | Дата: %s | Просмотров: %s | Комментариев: %s</div></div>",$data[$i]->id, $data[$i]->title, $data[$i]->text, $data[$i]->authorId, $data[$i]->authorLogin, $data[$i]->date, $data[$i]->view, $data[$i]->commentsCount);
		}
	}
}
?>