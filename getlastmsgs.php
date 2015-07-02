<?php
/**
 * ----------------------------------------------
 * Flame Web-site (PHP/MySQL)
 * Copyright (c) Maksim <<Klym>> Klimenko
 * URL: http://clan-flame.ru
 * ----------------------------------------------
 */
require("blocks/autoload.php");
require("blocks/db.php");

$rawPost = file_get_contents("php://input");
if ($rawPost) {
	$get = 0;
}
else {
	$get = 1;
}
$chat = new MiniChat($db);
$chat->getLastMod();
$messages = $chat->getMessages($get);

// Передаем заголовки и JSON пакет данных
header("Content-Type: text/plain; charset=utf-8");
header("Cache-Control: no-store, no-cache");
header("Last-Modified: " . $chat->lastMod);
echo json_encode($messages);
?>