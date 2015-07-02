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
if (isset($_SESSION['email'])) {
	die("<html><head><meta http-equiv='refresh' content='0; url=/'></head></html>");
}
if (isset($_POST['email'])) {$email = $_POST['email']; if (empty($email)) {unset($email);}}
if (isset($_POST['password'])) {$password = $_POST['password'];  if (empty($password)) {unset($password);}}

if (isset($email) || isset($password)) {
	$user = new User();
	$email = $user->checkUserData($email);
	$password = md5($password);
	$password = strrev($password);
	$user->email = $email;
	$user->password = $password;
	$user->db = $db;
	$user->checkUser(session_id());
}
else {
	exit("Вы не ввели не всю информацию, вернитесь и заполните все поля.");
}
?>