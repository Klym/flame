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
if (!isset($_SESSION['email'])) {
	die("<html><head>
		<meta http-equiv='refresh' content='3; url=/'>
		Для просмотра этой страници войдите или зарегистрируйтесь
		</head></html>");
}
$page = "edit";
$user1 = $user;

$d = 0;
$y = date("Y")-2;
$birthDate = strtotime($user->birthDate);
$day = date("d",$birthDate);
$month = date("n",$birthDate);
$year = date("Y",$birthDate);
$monthes = array(1 => "Января", 2 => "Февраля", 3 => "Марта", 4 => "Апреля", 5 => "Мая", 6 => "Июня", 7 => "Июля", 8 => "Августа", 9 => "Сентября", 10 => "Октября", 11 => "Ноября", 12 => "Декабря");
?>
<!DOCTYPE html>
<html>
<head>
<meta http-equiv="Content-Type" content="text/html; charset=utf-8">
<link rel="shortcut icon" href="img/favicon.ico">
<link rel="stylesheet" type="text/css" href="css/reset.css">
<link rel="stylesheet" type="text/css" href="css/style.css">
<? require("blocks/scripts.php"); ?>
<script src="js/md5.js"></script>
<title>Официальный сайт клана Пламя</title>
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
                    <div class="user">
                        <div class="beginUserBlock"></div>
                        <div class="userBlockInformation">
                            <div class="userBlockOpacity"></div>
                            <div class="userInformation">
                                <? require("blocks/leftUserBlock.php"); ?>
                                <div class="rightUserBlock">
                                	<div id="forResult"><img src="img/info.png" width="60" height="60" alt="info"></div>
                                 	<form method="post" name="edit">
                                    <p><label>Логин:<br><input type="text" name="login" value="<? echo $user->login ?>" maxlength="15" class="formInput"></label></p><br>
                                    <p><label>Новый пароль:<br><input type="password" name="password" class="formInput"></label></p>
                                    <p><label>Повторите пароль:<br><input type="password" name="repeat_pass" class="formInput"></label></p><br>
                                    <p><label>Имя:<br><input type="text" name="name" value="<? echo $user->name ?>" class="formInput"></label></p>
                                    <p><label>Фамилия:<br><input type="text" name="fam" value="<? echo $user->fam ?>" class="formInput"></label></p><br>
                                    <p style="margin-bottom:6px;">Пол: <label>Мужской<input type="radio" name="pol" value="1" <? if($user->pol == 1) echo "checked";?>></label>&nbsp;&nbsp;&nbsp;<label>Женский<input type="radio" name="pol" value="2" <? if($user->pol == 2) echo "checked";?>></label></p>
                                    <p style="margin-bottom:6px;">Дата рождения:
										<select name="day">
                                        <?
										while($d < 31) {
											$d++;
											if ($day == $d) {$sel = "selected";} else {$sel = "";}
											printf("<option %s>%s</option>",$sel,$d);
										}
										?>
                                        </select>
                                        <select name="month">
                                        <?
										for ($i = 1; $i <= count($monthes); $i++) {
											if ($i == $month) {$sel = "selected";} else {$sel = "";}
											printf("<option value=%s %s>%s</option>",$i,$sel,$monthes[$i]);
										}
										?>
                                        </select>
                                        <select name="year">
                                        <?
										while($y >= 1960) {
											if ($y == $year) {$sel = "selected";} else {$sel = "";}
											printf("<option %s>%s</option>",$sel,$y);
											$y--;
										}
										?>
                                        </select>
                                    </p>
                                   	<input id="editUser" name="submit" value="Сохранить" type="submit">
                                   	</form>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div id="rightBorder"></div>
            </div>
		</div>
		<? require("blocks/footer.php"); ?>
    </div>
</body>
</html>