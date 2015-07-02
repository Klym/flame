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

$page = new Page("info",$db);
try {
	$page->getPageSettings();
} catch( DataException $e ) {
	die(require("blocks/errorTemplate.php"));
}

$STH = $db->DBH->prepare("SELECT * FROM info");
$STH->execute();
$rows = $STH->fetch();
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
	                <div class="news">
						<div class="newsTitleImg"><p>Информация о клане Пламя</p></div>
						<? print($rows['text']); ?>
                    </div>
                </div>
                <div id="rightBorder"></div>
            </div>
      	</div>
        <? require("blocks/footer.php"); ?>
    </div>
</body>
</html>