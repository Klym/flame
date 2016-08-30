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
	$ip = $_SERVER['REMOTE_ADDR'];
	$checkObj = new Check($pdo);
	
	$checkObj->delete_old();
	$fail_ip = $checkObj->check_ip($ip);
	
	$count = isset($_COOKIE['flm_ip']) ? $_COOKIE['flm_ip'] : 0;
	if (($fail_ip && $fail_ip['count'] > 4) || $count > 4) {
		exit('Вы ошиблись более четырех раз, повторите попытку через 5 минут.');
	}
	
	if ($checkObj->check($login, $password)) {
		if ($fail_ip) {
			$checkObj->delete_ip($fail_ip['id']);
		}
		setcookie('flm_ip', 0, time() - 3600);
		$_SESSION['login'] = $login;
		$_SESSION['ip'] = $ip;
		$_SESSION['fingerprint'] = md5($login.$_SERVER['HTTP_USER_AGENT'].session_id());		
		
		echo "200";
	} else {
		setcookie('flm_ip', $count + 1, time() + 60 * 5);
		if ($fail_ip) {
			$checkObj->update_ip($fail_ip['id'], $fail_ip['count']);
		} else {
			$checkObj->add_ip($ip);
		}
		echo 'Неверный логин или пароль';
	}
} else {
	echo("Вы не ввели не всю информацию, вернитесь и заполните все поля.");
}
?>