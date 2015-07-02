<?php
/**
 * ----------------------------------------------
 * Flame Web-site (PHP/MySQL)
 * Copyright (c) Maksim <<Klym>> Klimenko
 * URL: http://clan-flame.ru
 * ----------------------------------------------
 */

abstract class Data {
	public $id;
	public $title;
	public $text;
	public $db;
	public $dataCount;
	public static $pageTitle;
	public $commentsCount;
	protected $query;
	public static $dataArray = array();
	const PAGES = 4;
	
	function __construct( $db='' ) {
		$this->db = $db;
	}
	
	static function getCommentsCount( $db, $id ) {
		$count = $db->DBH->prepare("SELECT id FROM comments WHERE type=? && post=?");
		$type = static::TYPE;
		$count->bindParam(1,$type);
		$count->bindParam(2,$id);
		$count->execute();
		$commentsCount = $count->rowCount();
		return $commentsCount;
	}
	
	function getPageData() {
		@$pagenum = $_GET['page'];
		$count = $this->dataCount;
		$num = self::PAGES;
		$total = (($count - 1) / $num) + 1;
		$total = intval($total);
		$pagenum = intval($pagenum);
		if (empty($pagenum) || $pagenum < 0) $pagenum = 1;
		if ($pagenum > $total) $pagenum = $total;
		$start = $pagenum * $num - $num;
		if ($start < 0) $start = 0;
		$this->start = $start;
		$this->num = $num;
		$arr = array($total,$pagenum);
		return $arr;
	}
	
	function printPages($total,$pagenum,$url) {
		// Проверяем нужны ли стрелки назад
		if ($pagenum != 1) $pervpage = '<a href="'.$url.'1">Первая</a> | <a href="'.$url. ($pagenum - 1) .'">Предыдущая</a> | ';
		// Проверяем нужны ли стрелки вперед
		if ($pagenum != $total) $nextpage = ' | <a href="'.$url. ($pagenum + 1) .'">Следующая</a> | <a href="'.$url.$total. '">Последняя</a>';
		
		// Находим две ближайшие станицы с обоих краев, если они есть
		if($pagenum - 5 > 0) $pagenum5left = ' <a href="'.$url. ($pagenum - 5) .'">'. ($pagenum - 5) .'</a> | ';
		if($pagenum - 4 > 0) $pagenum4left = ' <a href="'.$url. ($pagenum - 4) .'">'. ($pagenum - 4) .'</a> | ';
		if($pagenum - 3 > 0) $pagenum3left = ' <a href="'.$url. ($pagenum - 3) .'">'. ($pagenum - 3) .'</a> | ';
		if($pagenum - 2 > 0) $pagenum2left = ' <a href="'.$url. ($pagenum - 2) .'">'. ($pagenum - 2) .'</a> | ';
		if($pagenum - 1 > 0) $pagenum1left = ' <a href="'.$url. ($pagenum - 1) .'">'. ($pagenum - 1) .'</a> | ';
		
		if($pagenum + 5 <= $total) $pagenum5right = ' | <a href="'.$url. ($pagenum + 5) .'">'. ($pagenum + 5) .'</a>';
		if($pagenum + 4 <= $total) $pagenum4right = ' | <a href="'.$url. ($pagenum + 4) .'">'. ($pagenum + 4) .'</a>';
		if($pagenum + 3 <= $total) $pagenum3right = ' | <a href="'.$url. ($pagenum + 3) .'">'. ($pagenum + 3) .'</a>';
		if($pagenum + 2 <= $total) $pagenum2right = ' | <a href="'.$url. ($pagenum + 2) .'">'. ($pagenum + 2) .'</a>';
		if($pagenum + 1 <= $total) $pagenum1right = ' | <a href="'.$url. ($pagenum + 1) .'">'. ($pagenum + 1) .'</a>';
		// Вывод меню если страниц больше одной
		if ($total > 1) {
			Error_Reporting(E_ALL & ~E_NOTICE);
			echo "<div class='pstrnav'>";
			echo "<p>".$pervpage.$pagenum5left.$pagenum4left.$pagenum3left.$pagenum2left.$pagenum1left.$pagenum.$pagenum1right.$pagenum2right.$pagenum3right.$pagenum4right.$pagenum5right.$nextpage."</p>";
			echo "</div>";
		}
	}
	
	function getData( $id='' ) {
		$data = $this->db->DBH->prepare($this->query);
		if (!empty($id)) {
			if (!preg_match("|^[\d]+$|",$id)) {
				throw new DataException("Ошибка 404", "Недопустимое значение параметра, параметр не является числом.");
			}
			$data->bindParam(1,$id);
		}
		if (!$data->execute()) {
			throw new DataException("Ошибка базы данных","Запрос на выборку данных из базы не прошел. Напишите об этом администратору, Klymstalker@yandex.ua");
		}
		$data->setFetchMode(PDO::FETCH_ASSOC);
		while($fetch = $data->fetch()) {
			$rows[] = $fetch;
		}
		return $rows;
	}
	
	static function setDataArray( $rows, $db='' ) {
		self::$dataArray = null;
		for($i = 0; $i < count($rows); $i++) {
			self::$dataArray[$i] = new static($db);
			self::$dataArray[$i]->id = $rows[$i]['id'];
			self::$dataArray[$i]->title = $rows[$i]['title'];
			self::$dataArray[$i]->text = $rows[$i]['text'];
			static::setStaticDataArray($rows,$i,$db);
		}
	}
	
	function addView($type) {
		$selectView = $this->db->DBH->prepare("SELECT view FROM ".$type." WHERE id=?");
		$selectView->bindParam(1,$this->id);
		$selectView->execute();
		$selectView->setFetchMode(PDO::FETCH_ASSOC);
		$views = $selectView->fetch();
		$this->view = $views['view'] + 1;
		
		$insView = $this->db->DBH->prepare("UPDATE ".$type." SET view=? WHERE id=?");
		$insView->bindParam(1,$this->view);
		$insView->bindParam(2,$this->id);
		$insView->execute();
	}
		
	function getSelectedData() {
		if (empty($this->id)) {
			throw new DataException("Ошибка 404", "Запрашиваемая страница не найдена на сервере.");
		}
		if (!preg_match("|^[\d]+$|",$this->id)) {
			throw new DataException("Ошибка 404", "Недопустимое значение параметра, параметр не является числом.");
		}
		$STH = $this->db->DBH->prepare($this->query);
		$STH->bindParam(1,$this->id);
		if (!$STH->execute()) {
			throw new DataException("Ошибка базы данных","Запрос на выборку данных из базы не прошел. Напишите об этом администратору, Klymstalker@yandex.ua");
		}
		$STH->setFetchMode(PDO::FETCH_ASSOC);
		if ($STH->rowCount() == 0) {
			throw new DataException("Ошибка 404", "Запрашиваемая страница не найдена на сервере.");
		}
		$rows = $STH->fetch();
		static::setDataProperties($rows);
	}
	
	function setDataProperties( $rows ) {
		$this->title = $rows['title'];
		$this->text = $rows['text'];
	}
	
	function printData($data,$page,$content) {
		for ($i = $this->start; $i < ($this->num + $this->start); $i++) {
			if (!$data[$i]) break;
			printf("<div class='news'>
					<div class='newsTitleImg'><a href='%s.php?id=%s'>%s</a></div>
					<div class='newsContent'>%s<div class='clear'></div></div>
					<div class='newsFooter'></div>
					<div class='newsFooterContent'>Добавил: <a href='page.php?id=%s'>%s</a> | Дата: %s | Просмотров: %s | Комментариев: %s</div></div>",$page,$data[$i]->id, $data[$i]->title, $data[$i]->$content, $data[$i]->authorId, $data[$i]->authorLogin, $data[$i]->date, $data[$i]->view,$data[$i]->commentsCount);
		}
	}
	
	function getComments() {
		$comment = new Comment($this->id,static::TYPE,$this->db);
		return $comment->setCommentsArray();
	}
}
?>