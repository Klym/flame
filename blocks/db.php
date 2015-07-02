<?php
$db = new Db("localhost","klym","2517","flame");
$db->DBH->setAttribute( PDO::ATTR_ERRMODE, PDO::ERRMODE_WARNING );
$db->DBH->prepare("SET NAMES utf8")->execute();
?>