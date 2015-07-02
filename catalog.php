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

$page = new Page("catalog",$db);
try {
	$page->getPageSettings();
} catch( DataException $e ) {
	die(require("blocks/errorTemplate.php"));
}

if (isset($_GET['cat'])) {$cat = $_GET['cat'];}
if (isset($_GET['id'])) {$id = $_GET['id'];}

if (!isset($cat)) {$cat = '';}
if (!isset($id)) {$id = '';}

if (empty($cat) && empty($id)) {
	$category = new Category();
	$category->db = $db;
	try {
		$categories = $category->request();
	} catch( DataException $e ) {
		die(require("blocks/errorTemplate.php"));
	}
}

if (!empty($cat) && empty($id)) {
	$category = new Category($cat);
	$category->db = $db;
	try {
		$category->getSelectedData();
	} catch ( DataException $e ) {
		die(require("blocks/errorTemplate.php"));
	}
	$page->title = $category->title;
	$page->meta_d = $category->meta_d;
	$page->meta_k = $category->meta_k;

	$item = new Item($db,$cat);
	$item->db = $db;
	try {
		$items = $item->request();
		$pageData = $item->getPageData();
	} catch ( DataException $e ) {
		die(require("blocks/errorTemplate.php"));
	}
}

if (!empty($id)) {
	//Устанавливаем cookie для того, чтобы просмотры засчитывались только 1 раз от юзера
	setcookie("viewDataCookie[".$id."]","viewData".$id."",mktime(0,0,0,1,1,date("Y") + 1));
	$item = new Item($id);
	$item->db = $db;
	if (!isset($_COOKIE['viewDataCookie'][$id])) {
		$item->addView("data");
	}
	try {
		$item->getSelectedData();
	} catch ( DataException $e ) {
		die(require("blocks/errorTemplate.php"));
	}
	$page->title = $item->title;
	$page->meta_d = $item->meta_d;
	$page->meta_k = $item->meta_k;
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
                   <?php
					if (empty($cat) && empty($id)) {
						try {
							$category->printCategories($categories);
						} catch ( DataException $e ) {
							die(require("blocks/errorTemplate.php"));
						}
					}
					else if (!empty($cat) && empty($id)) {
						echo "<div id='navigation'><p><a href='catalog.php'>Каталог</a> \ ".$page->title."</p></div>";
						switch($item->dataCount) {
							case 0:
								echo "<div id='noData'><p>Заметок в данной категории не обнаружено</p></div>";
							break;
							default:
								$item->printData($items);
								$item->printPages($pageData[0],$pageData[1],"catalog.php?cat=".$item->cat."&page=");
							break;
						}
					}
					else {
						require("blocks/viewItem.php");
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