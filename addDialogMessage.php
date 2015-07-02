<?php
/**
 * ----------------------------------------------
 * Flame Web-site (PHP/MySQL)
 * Copyright (c) Maksim <<Klym>> Klimenko
 * URL: http://clan-flame.ru
 * ----------------------------------------------
 */
session_start();

require("blocks/autoload.php");
require("blocks/db.php");
require("blocks/user.php");

// Читаем данные, переданные в POST
$rawPost = file_get_contents("php://input");

// Заголовки ответа
header("Content-Type: text/plain; charset=utf-8");
header("Cache-Control: no-store, no-cache");
header("Expires: " . date('r',time()-60*60));

// Если данные были переданы...
if ($rawPost) {
	//Разбор пакета JSON
	$data = json_decode($rawPost);
	$text = Comment::checkData($data->text);

	preg_match_all("/(?:\?|\&)dialog=\d+/", $_SERVER['HTTP_REFERER'], $vars);
	preg_match("/\d+/", $vars[0][count($vars[0]) - 1], $dialogId);

	if (empty($text)) {
		echo json_encode(array('result' => 'No data'));
	}
	else {
		$date = time()-60*60;
		$chat = new DialogChat($db, null, $user->id, $text, $date, null, $date, $dialogId[0]);
		if ($chat->checkPresence())
			$chat->insertMessage();			
		else
			die(json_encode(array('result' => 'Invalid id of dialog')));
		//$message = $chat->generateNewMessage();
	}
	//echo json_encode($message);
}
else {
	// Данные не переданы
	echo json_encode(array('result' => 'No data'));
}
?>