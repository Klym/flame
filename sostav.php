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
require("blocks/connect.php");
require("blocks/user.php");
require("functions/bits.php");
require("functions/getSostavInfo.php");

$page = new Page("sostav",$db);
try {
	$page->getPageSettings();
} catch( DataException $e ) {
	die(require("block/errorTemplate.php"));
}
if (isset($_GET['id'])) {$id = $_GET['id'];}
if (!preg_match("|^[\d]+$|",$id) && isset($_GET['id'])) {
	die("Вы зашли на страницу без параметра, либо параметр не является числом.");
}
if (isset($id)) $player = getSostavInfo($id);
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
<link rel="stylesheet" type="text/css" href="css/rangLine.css">
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
						<div class="newsTitleImg"><p>Состав клана Пламя</p></div>
                        <div id="sostav">
							<?php
							if (!isset($_GET['id'])) { //Если не существует $id то выводить всех игроков
								$result2 = mysql_query("SELECT * FROM sostav ORDER BY scores DESC") or die("Запрос на выборку данных из базы не прошел. Напишите об этом администратору. E-mail: support@clan-flame.ru<br><strong>Код ошибки: </strong>".mysql_error());
								//Расчет ранга и должностей каждого игрока и вывод на экран
								$i = 0;
								while ($myrow2 = mysql_fetch_array($result2)) {
									$i++;
									$result_r = mysql_query("SELECT * FROM playerRangs WHERE id='$myrow2[rang]'") or die("Запрос на выборку данных из базы не прошел. Напишите об этом администратору. E-mail: support@clan-flame.ru<br><strong>Код ошибки: </strong>".mysql_error());
									$myrow_r = mysql_fetch_array($result_r);
									$dol = $myrow2['dol'];
									list($dol1,$dol2,$dol3) = bitFlag($dol);
									if (count(bitFlag($dol)) == 1) {
										$result_dol = "$dol1";
									}
									if (count(bitFlag($dol)) == 2) {
										$result_dol = "$dol1,$dol2";
									}
									if (count(bitFlag($dol)) == 3) {
										$result_dol = "$dol1,$dol2,$dol3";
									}
									printf ("<p>$i. <a href='sostav.php?id=%s'>%s[Пламя]:%s %s [%s]</a></p>",$myrow2['id'],$myrow2['name'],$myrow2['scores'],$myrow_r['rangName'],$result_dol);
								}
							} else {
							?>
                            <h1 align="center">Подробная информация игрока <? echo $player['name']; ?></h1>
                            <div id="playerInfo">
                                <p>Звание: <span class="player"><? echo $player['rangName']; ?></span></p>
                                <p>Количество очков: <span class="player"><? echo $player['scores']; ?></span></p>
                                <p>Должность: <span class="player"><? echo $player['dol']; ?></span></p>
                                <p>Имя: <span class="player"><? echo $player['fullName']; ?></span></p>
                                <p>Skype: <span class="player"><? echo $player['skype']; ?></span></p>
                                <br>
                                <p>До следующего ранга осталось: <span class="player"><? echo $player['scoresNeed']; ?></span></p>
                                <div class="progress-bar blue stripes">
                                    <span style="width: <? echo $player['procent']; ?>%;"></span>
                                </div>
                            </div>
                            <div style="float:left; margin-left:40px;">
                            <img src='img/rangs/<? echo $player['rang']; ?>.png'>
                            </div>
                            <? } ?>
                            <div class="clear"></div>
                        </div>
                        <div id="updateStat">
                        	<p>Обновите статистику для получения более актуальных сведений о игроках клана (займет около 15 сек.)</p>
                        	<input type="button" name="update" value="Обновить">
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