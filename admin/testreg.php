<?php
session_start();
require("blocks/autoload.php");
require("blocks/db.php");

if (isset($_SESSION["login"])) {
	header("Location: index.php");
}

if (isset($_POST["login"]) && !empty($_POST["login"])) {$login = $_POST["login"];}
if (isset($_POST["password"]) && !empty($_POST["password"])) {$password = $_POST["password"];}

if (isset($login) && isset($password)) {
	$login = Data::checkData($login);
	$password = Data::checkData($password);
	$password = strrev(md5($password));

	$checkObj = new Check($pdo);
	if ($checkObj->check($login, $password)) {
		$_SESSION['login'] = $login;
		echo "<html><head><meta http-equiv='refresh' content='0; url=index.php'></head></html>";
	} else {
		echo 'Неверный логин или пароль';
		echo "<html><head><meta http-equiv='refresh' content='2; url=login.php'></head></html>";
	}
} else {
	die("<html><head><meta http-equiv='refresh' content='2; url=login.php'></head>Вы не ввели не всю информацию, вернитесь и заполните все поля.</html>");
}
?>