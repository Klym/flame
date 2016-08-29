<?php
session_start();
require("blocks/autoload.php");
require("blocks/db.php");

if (isset($_SESSION["login"])) {
	header("Location: index.php");
}

$data = file_get_contents("php://input");
$data = json_decode($data);

if (isset($data->login) && !empty($data->login)) {$login = $data->login;}
if (isset($data->password) && !empty($data->password)) {$password = $data->password;}

if (isset($login) && isset($password)) {
	$login = Data::checkData($login);
	$password = Data::checkData($password);
	$password = strrev(md5($password));

	$checkObj = new Check($pdo);
	if ($checkObj->check($login, $password)) {
		$_SESSION['login'] = $login;
		$_SESSION['ip'] = $_SERVER['REMOTE_ADDR'];
		$_SESSION['fingerprint'] = md5($login.$_SERVER['HTTP_USER_AGENT'].session_id());		
		
		echo "200";
	} else {
		echo 'Неверный логин или пароль';
	}
} else {
	echo("Вы не ввели не всю информацию, вернитесь и заполните все поля.");
}
?>