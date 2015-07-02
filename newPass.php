<?php
session_start();
require("blocks/autoload.php");
require("blocks/db.php");

$user = new User();
$user->db = $db;
if(isset($_SESSION['email'])) {
	die("<html><head>
		<meta http-equiv='refresh' content='0; url=/'>
		</head></html>");
}
if (!empty($_POST)) {
	if (isset($_POST['email'])) {$email = $_POST['email'];}
	if (!empty($email)) {
		$user->email = $email;
		$user->sendPass();
	}
	else {
		die("<html><head>
		<meta http-equiv='refresh' content='3; url=newPass.php'>
		</head>Вы не ввели e-mail</html>");
	}
} else {
?>
<!DOCTYPE html>
<html>
<head>
<meta http-equiv="Content-Type" content="text/html; charset=utf-8">
<link rel="shortcut icon" href="img/favicon.ico">
<title>Официальный сайт клана Пламя - Восстановление забытого пароля</title>
</head>
<body>
	<h3>Восстановление забытого пароля</h3>
    <form action="newPass.php" method="post" name="newPass">
    	Введите ваш e-mail: <input type="text" name="email"></input><br>
        <input type="submit" value="Отправить">
    </form>
</body>
</html>
<? } ?>