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

$user = new User();
$user->db = $db;
if(isset($_SESSION['email'])) {
	die("<html><head>
		<meta http-equiv='refresh' content='0; url=/'>
		</head></html>");
}

$page = new Page("registration",$db);
try {
	$page->getPageSettings();
} catch( DataException $e ) {
	die(require("blocks/errorTemplate.php"));
}

if (!empty($_POST)) {
	if (isset($_POST['email'])) {$email = User::checkUserData($_POST['email']);}
	if (isset($_POST['login'])) {$login = User::checkUserData($_POST['login']);}
	if (isset($_POST['password'])) {$password = User::checkUserData($_POST['password']);}
	if (isset($_POST['repeat_pass'])) {$repeat_pass = User::checkUserData($_POST['repeat_pass']);}
	if (isset($_POST['name'])) {$name = User::checkUserData($_POST['name']);}
	if (isset($_POST['fam'])) {$fam = User::checkUserData($_POST['fam']);}
	if (isset($_POST['pol'])) {$pol = User::checkUserData($_POST['pol']);}
	if (isset($_POST['year'])) {$year = User::checkUserData($_POST['year']);}
	if (isset($_POST['month'])) {$month = User::checkUserData($_POST['month']);}
	if (isset($_POST['day'])) {$day = User::checkUserData($_POST['day']);}
	
	if (empty($email) || empty($login) || empty($password) || empty($repeat_pass) || empty ($name) || empty($fam) || empty($pol) || empty($year) || empty($month) || empty($day)) {
		exit("Вы не ввели всю информацию, вернитесь и заполните все поля.");
	}
	else {
		if ($password != $repeat_pass) {
			exit("Пароли не совпадают.");
		}
		$birthDate = $year."-".$month."-".$day;
		$avatar = "net-avatara.jpg";
		$user = new User($email,$login,$password,$name,$fam,$pol,null,$birthDate,$avatar,2,$db);
		$user->saveUser();
		$user->sendMessage();
	}
}
else {
	$monthes = array(1 => "Января", 2 => "Февраля", 3 => "Марта", 4 => "Апреля", 5 => "Мая", 6 => "Июня", 7 => "Июля", 8 => "Августа", 9 => "Сентября", 10 => "Октября", 11 => "Ноября", 12 => "Декабря");
?>
<!DOCTYPE html>
<html>
<head>
<meta http-equiv="Content-Type" content="text/html; charset=utf-8">
<meta name="description" content="<? echo $page->meta_d; ?>">
<meta name="keywords" content="<? echo $page->meta_k; ?>">
<link rel="shortcut icon" href="img/favicon.ico">
<link rel="stylesheet" type="text/css" href="css/reset.css">
<link rel="stylesheet" type="text/css" href="css/style.css">
<? require("blocks/scripts.php"); ?>
<title>Официальный сайт клана Пламя - <? echo $page->title; ?></title>
</head>
<body>
	<div id="wrapper">
    	<? require("blocks/header.php"); ?>
        <div id="body">
        	<? require("blocks/left.php"); ?>
            <? require("blocks/right.php"); ?>
            <div id="content">
				<? require("blocks/menu.php"); ?>
                <div id="contentText">
                    <div id="regTitle"><p>Регистрация на сайте клана Пламя</p></div>
                    <form action="reg.php" id="reg" name="reg_form" method="post" enctype="multipart/form-data">
                    <fieldset class="reg">
                    <legend><p>Контактные данные</p></legend>
                    <p><label>E-mail: <br><input type="text" name="email" size="30px" class="formInput"></label></p>
                    <p><label>Логин: <br><input type="text" name="login" size="30px" maxlength="15" class="formInput"></label></p>
                    <p><label>Пароль: <br><input type="password" name="password" size="30px" class="formInput"></label></p>
                    <p><label>Подтвердите Пароль: <br><input type="password" name="repeat_pass" size="30px" class="formInput"></label></p>
                    </fieldset>
                    <fieldset class="reg">
                    <legend><p>Личные данные</p></legend>
                    <p><label>Имя: <br><input type="text" name="name" size="30px" class="formInput"></label></p>
                    <p><label>Фамилия: <br><input type="text" name="fam" size="30px" class="formInput"></label></p>
                    <p>Пол: <label>Мужской<input type="radio" name="pol" value="1"></label>&nbsp;&nbsp;&nbsp;<label>Женский<input type="radio" name="pol" value="2"></label></p>
                    <p>Дата рождения:</p>
                    <p>
                    <select name="day">
                    <?php
                    $d = 0;
                    while($d < 31) {
    	            	$d++;
	                    print "<option>$d</option>";
					}
                    ?>
                    </select>
                    <select name="month">
                    <?php
					for ($i = 1; $i <= count($monthes); $i++) {
						printf("<option value=%s>%s</option>",$i,$monthes[$i]);
					}
                    ?>
                    </select>
                    <select name="year" class="submit">
                    <?php
                    $y = date("Y");
                    while($y >= 1960) {
    	            	print "<option>$y</option>";
						$y--;
					}
                    ?>
                    </select>
                    </p>
                    </fieldset>
                    <input name="submit" type="submit" value="Регистрация">
                    </form>
                </div>
                <div id="rightBorder"></div>
            </div>
        </div>
        <? require("blocks/footer.php"); ?>
    </div>
</body>
</html>
<? } ?>