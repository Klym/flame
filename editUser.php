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

$rawPost = file_get_contents("php://input");

if ($rawPost) {
	$data = json_decode($rawPost);
	
	$data->login = User::checkUserData($data->login);
	$data->name = User::checkUserData($data->name);
	$data->fam = User::checkUserData($data->fam);

	if ((empty($data->password) ^ empty($data->repeatPass)) || $data->password != $data->repeatPass) {
		die(json_encode(array('result' => 'Пароли не совпадают')));
	} else {
		if (empty($data->login) || empty($data->name) || empty($data->fam) || empty($data->pol) || empty($data->day) || empty($data->month) || empty($data->year)) {
			die(json_encode(array('result' => 'Вы не ввели всю информацию')));
		}
		if (mb_strlen($data->login,"UTF-8") < 3 || mb_strlen($data->login,"UTF-8") > 15) {
			die(json_encode(array('result' => 'Логин не может состоять более чем из 15 символов и менее чем из 3 симолов')));
		}
		if (!is_numeric($data->pol) || ($data->pol != 1 && $data->pol != 2) || !is_numeric($data->day) || !is_numeric($data->month) || !is_numeric($data->year)) {
			die(json_encode(array('result' => 'Ошибка! Недопустимое значение параметра')));
		}
		$birthDate = date("Y-m-d",mktime(0,0,0,$data->month,$data->day,$data->year));
		
		$user->login = $data->login;
		$user->name = $data->name;
		$user->fam = $data->fam;
		$user->pol = $data->pol;
		$user->birthDate = $birthDate;
		if (!empty($data->password)) {
			$user->password = $data->password;
		}
		$count = $user->checkLogin();
		if ($count == 0) {
			$user->updateInfo();
			echo json_encode(array('result' => '200 OK'));
		}
		else {
			echo json_encode(array('result' => 'Пользователь с таким логином уже существует.'));
		}
	}
} else {
	echo json_encode(array('result' => 'No data'));
}
?>