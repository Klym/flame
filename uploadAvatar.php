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
if (isset($_POST['submit'])) {
	$avatar = Avatar::createImage($_POST['filepath']);
	$aname = $avatar->crop($_POST['x'],$_POST['y'],$_POST['size'],$_POST['width']);
	try {
		$user->updateAvatar($aname);
	} catch( DataException $e ) {
		echo($e->message);
	}
	die();
} else
	$filename = $user->saveNewAvatar();
?>
<!DOCTYPE html>
<html>
<head>
<meta http-equiv="Content-Type" content="text/html; charset=utf-8">
<link rel="shortcut icon" href="img/favicon.ico">
<link rel="stylesheet" type="text/css" href="css/reset.css">
<link rel="stylesheet" type="text/css" href="css/style.css">
<link rel="stylesheet" type="text/css" href="css/changeAvatar.css">
<? require("blocks/scripts.php"); ?>
<script type="text/javascript" src="js/avatar.js"></script>
<title>Официальный сайт клана Пламя - Загрузка нового аватара</title>
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
                                <div id="scriptWrap">
                                    <div id="element"></div>
                                    <img id="img" src="<? echo $filename; ?>">
                                    <div id="leftV"></div>
                                    <div id="topV"></div>
                                    <div id="rightV"></div>
                                    <div id="bottomV"></div>
                                </div>
                                <div id="newAvatarWrap">
                                    <img src="<? echo $filename; ?>" id="newAvatar" style="position:relative; height:150px;">
                                </div>
                            </div>
                        </div>
						<form action="uploadAvatar.php" method="post" name="cropForm">
                        	<input type="hidden" name="filepath" value="<? echo $filename; ?>">
                            <input type="hidden" name="x">
                            <input type="hidden" name="y">
                            <input type="hidden" name="size">
                            <input type="hidden" name="width">
                    		<input type="submit" name="submit" id="saveButtonAvatar" value="Загрузить">
	                    </form>
                    </div>
                </div>
                <div id="rightBorder"></div>
            </div>
		</div>
		<? require("blocks/footer.php"); ?>
    </div>
</body>
</html>