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

$page = new Page("blog",$db);
try {
	$page->getPageSettings();
} catch( DataException $e ) {
	die(require("blocks/errorTemplate.php"));
}

$blog = new Blog();
$blog->db = $db;
try {
	$news = $blog->request();
} catch( DataException $e ) {
	die(require("blocks/errorTemplate.php"));
}
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
    	<div id="main" onClick="window.location = 'index.php';"><p>Главная</p></div>
    	<? require("blocks/header.php"); ?>
        <div id="body">
            <div id="blogContent">
           	    <div id="leftBorder"></div>
                <div id="blogContentText">
                	<div id='navigation'><p><a href='index.php'>Главная</a> \ Блог</p></div>
                	<?
					switch($blog->dataCount) {
	                    case 0:
							echo "<div id='noData'><p>Заметок в базе не обнаружено</p></div>";
						break;
						default:
							$blog->printData($news);
						break;
					}
					?>
                </div>
                <div id="rightBorder"></div>
            </div>
      	</div>
        <? require("blocks/footer.php"); ?>
    </div>
</body>
</html>