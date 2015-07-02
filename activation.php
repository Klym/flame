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
if (isset($_SESSION['email'])) {
	die("<html><head><meta http-equiv='refresh' content='0; url=/'></head></html>");
}
if (isset($_GET['code'])) {$code = $_GET['code'];}
if (isset($_GET['email'])) {$email = $_GET['email'];}

if (!empty($code) && !empty($email)) {
	$user = new User();
	$user->db = $db;
	$user->activateUserProfile($code, $email);
}
else {
	exit("<p>Вы зашли на эту страницу без параметров</p>");
}
?>