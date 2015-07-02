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

$page = new Page("index",$db);
try {
	$page->getPageSettings();
} catch( DataException $e ) {
	die(require("blocks/errorTemplate.php"));
}

$obj = new News();
$obj->db = $db;
try {
	$news = $obj->request();
	$pageData = $obj->getPageData();
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
    	<? require("blocks/header.php"); ?>
        <div id="body">
        	<? require("blocks/left.php"); ?>
            <? require("blocks/right.php"); ?>
            <div id="content">
				<? require("blocks/menu.php"); ?>
                <div id="contentText">
                    <?
                    switch($obj->dataCount) {
						case 0:
							echo "<div id='noData'><p>Новостей в базе не обнаружено</p></div>";
						break;
						default:
							$obj->printData($news);
							$obj->printPages($pageData[0],$pageData[1],"index.php?page=");
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