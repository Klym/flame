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

$page = new Page("search",$db);
try {
	$page->getPageSettings();
} catch( DataException $e ) {
	die(require("blocks/errorTemplate.php"));
}

$search = new Search($db);
$search->query = $_GET['keywords'];
try {
	$search->getQuery();
} catch ( DataException $e ) {
	die(require("blocks/errorTemplate.php"));
}

$item = new Item();
Item::setDataArray($search->resultArr,$db);
$searchResultArr = Item::$dataArray;
$item->dataCount = count($searchResultArr);
$pageData = $item->getPageData();
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
                    switch($item->dataCount) {
						case 0:
							echo "<div id='noData'><p>По вашему запросу ничего не найдено</p></div>";
						break;
						default:
							$item->printData($searchResultArr);
							$item->printPages($pageData[0],$pageData[1],"search.php?keywords=".$search->query."&page=");
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