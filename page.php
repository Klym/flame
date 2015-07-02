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
if (isset($_GET['id'])) {$id = $_GET['id'];} else {$id = '';}

$page = "user";

if ($id != $user->id && !empty($id)) {
	try {
		$user1 = new User();
		$user1->db = $db;
		$user1->getUserInfo($id);
	} catch( DataException $e ) {
		die(require("blocks/errorTemplate.php"));
	}
}
else {
	$user1 = $user;
}

$endings = array('день','дня','дней');
$endings1 = array('год','года','лет');
?>
<!DOCTYPE html>
<html>
<head>
<meta http-equiv="Content-Type" content="text/html; charset=utf-8">
<link rel="shortcut icon" href="img/favicon.ico">
<link rel="stylesheet" type="text/css" href="css/reset.css">
<link rel="stylesheet" type="text/css" href="css/style.css">
<? require("blocks/scripts.php"); ?>
<title>Официальный сайт клана Пламя - <? echo $user1->login; ?></title>
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
                                    <div class="userLogId">
										<span class="userLogin"><? echo $user1->login; ?></span>
                                        <span class="userLogin">[ id: <? echo $user1->id; ?> ]</span>
                                    </div>
                                    <div class="userStatus"><!--Статус--></div>
                                    <div class="userData">
                                        <ul>
                                            <li><p>Имя: <? echo $user1->name." ".$user1->fam." [ <span id='userPol'>".$user1->getPol($user1->pol)."</span> ]"; ?></p></li>
                                            <li><p>Группа: <? echo $user1->access; ?></p></li>
                                            <li><p>Дата рождения: <? echo $user1->birthDate." [ ".$user1->age." ".$endings1[Category::declension($user1->age)]." ]"; ?></p></li>
                                            <li><p>Дата регистрации: <? echo $user1->regDate; ?></p></li>
                                            <li><p>На сайте: <? echo $user1->days." ".$endings[Category::declension($user1->days)]; ?></p></li>
                                            <? if ($id == $user->id || empty($id)) { ?>
                                            <li><p>E-mail: <? echo $user1->email; ?></p></li>
                                            <? } ?>
                                        </ul>
                                    </div>
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
    <? if ($id == $user->id || empty($id)) { ?>
    <script type="text/javascript">createAvatarInterface();</script>
	<? } ?>
</body>
</html>