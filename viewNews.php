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

$news = new News($id);
$news->db = $db;
if (!isset($_COOKIE['viewCookie'][$id])) {
	$news->addView("news");
}
try {
	$news->getSelectedData();
	$news->getComments();
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
<title>Официальный сайт клана Пламя - <? print($news->title); ?></title>
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
                    <div class='news'>
                        <div class='newsTitleImg'><span><? echo $news->title; ?></span></div>
                        <div class='newsContent'><? echo $news->full_text; ?></div>
                        <div class='newsFooter'></div>
                        <div class='newsFooterContent'>Добавил: <a href='page.php?id=<? echo $news->authorId; ?>'><? echo $news->authorLogin; ?></a> | Дата: <? echo $news->date; ?> | Просмотров: <? echo $news->view; ?> | Комментариев: <span id="commentsCount"><? echo $news->commentsCount; ?></span></div>
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
                            <input type="hidden" name="type" value="<? echo $news::TYPE; ?>">
                            <? if(isset($_SESSION['email'])) { ?>
                            <input id="sendButton" type="submit" name="submit" value="Отправить">
                            <? } ?>
                        </div>
                    </form>
                </div>
                <div id="rightBorder"></div>
			</div>
		</div>
		<? require("blocks/footer.php"); ?>
	</div>
</body>
</html>