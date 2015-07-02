<?php
/**
 * ----------------------------------------------
 * Flame Web-site (PHP/MySQL)
 * Copyright (c) Maksim <<Klym>> Klimenko
 * URL: http://clan-flame.ru
 * ----------------------------------------------
 */
session_start();
header("Content-Type: text/plain; charset=utf-8");
header("Cache-Control: no-store, no-cache");

require("blocks/autoload.php");
require("blocks/db.php");
require("blocks/user.php");

$rawPost = file_get_contents("php://input");

if ($rawPost) {
	$data = json_decode($rawPost);
	
	preg_match_all("/(?:\?|\&)id=\d+/", $_SERVER['HTTP_REFERER'], $vars);
	preg_match("/\d+/", $vars[0][count($vars[0]) - 1], $id);
	
	$text = Comment::checkData($data->text);
	if (empty($data->type) || empty($text) || !is_numeric($data->type)) {
		echo json_encode(array('result' => 'No data'));
	}
	else {
		$comment = new Comment($id[0],$data->type,$db,$user->id,$text);
		$comment->insertComment();
		echo json_encode(
			array
			(
				'id' => $user->id,
				'login' => $user->login,
				'avatar' => $user->avatar,
				'time' => date("d.m.Y H:i:s",time()-60*60),
				'text' => $data->text
			)
		);
	}
}
else {
	echo json_encode(array('result' => 'No data'));
}
?>