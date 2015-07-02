<?php
$db_proc = mysql_connect("localhost","klym","2517") or die("Не удалось установить соединенис с сервером");
mysql_select_db("flame",$db_proc) or die("Не удалось подключиться к базе данных");
mysql_query("SET NAMES utf8");
?>