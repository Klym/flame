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

if (isset($_GET['id'])) {$id = $_GET['id'];}

//Устанавливаем cookie для того, чтобы просмотры засчитывались только 1 раз от юзера
setcookie("viewCookie[".$id."]","view".$id."",mktime(0,0,0,1,1,date("Y") + 1));

$blog = new Blog($id);
$blog->db = $db;
if (!isset($_COOKIE['viewCookie'][$id])) {
	$blog->addView("news");
}
try {
	$blog->getSelectedData();
	$blog->getComments();
} catch ( DataException $e ) {
	die(require("blocks/errorTemplate.php"));
}
?>
<!DOCTYPE html>
<html>
<head>
<meta http-equiv="Content-Type" content="text/html; charset=utf-8">
<link rel="shortcut icon" href="img/favicon.ico">
<link rel="stylesheet" type="text/css" href="css/reset.css">
<link rel="stylesheet" type="text/css" href="css/style.css">
<? require("blocks/scripts.php"); ?>
<title>Официальный сайт клана Пламя - <? print($blog->title); ?></title>
</head>
<body>
	<div id="wrapper">
    	<div id="main" onClick="window.location = 'index.php';"><p>Главная</p></div>
    	<? require("blocks/header.php"); ?>
        <div id="body">
            <div id="blogContent">
				<div id="leftBorder"></div>
                <div id="blogContentText">
                	<div id='navigation'><p><a href='index.php'>Главная</a> \ <a href="blog.php">Блог</a> \ <? echo $blog->title; ?></p></div>
                    <div class='blogNews'>
                        <div class='newsTitleImg' style="width:100%;"><span><? echo $blog->title; ?></span></div>
                        <div class='blogNewsContent'><? echo $blog->full_text; ?></div>
                        <div class='blogNewsFooter'></div>
                        <div class='newsFooterContent'>Добавил: <a href='page.php?id=<? echo $blog->authorId; ?>'><? echo $blog->authorLogin; ?></a> | Дата: <? echo $blog->date; ?> | Просмотров: <? echo $blog->view; ?> | Комментариев: <span id="commentsCount"><? echo $blog->commentsCount; ?></span></div>
                    </div>
                    <div id='comments'>
                    <? Comment::printComments(); ?>
                    </div>
                    <form method="POST">
                        <div id="commentForm">
                        	<? if(!isset($_SESSION['email'])) {
									$placeholder = "Для отправки комментария войдите или зарегистрируйтесь";
									$disable = "disabled";
								} else {
									$placeholder = "Введите текст сообщения";
									$disable = '';
								}
							?>
							<textarea name="text" id="commentArea" placeholder="<? echo $placeholder; ?>" <? echo $disable; ?>></textarea><br>
                            <input type="hidden" name="type" value="<? echo $blog::TYPE; ?>">
                            <? if(isset($_SESSION['email'])) { ?>
                            <input id="sendButton" type="submit" name="submit" value="Отправить">
                            <? } ?>
                        </div>
                    </form>
                </div>
                <div id="rightBlogBorder"></div>
			</div>
		</div>
		<div id="footer">
			<div id="footerBg"></div>
			<div id="leftBorderFooter"></div>
			<div id="rightBorderFooter"></div>
		</div>
	</div>
</body>
</html>