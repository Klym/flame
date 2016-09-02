<?php
/**
 * ----------------------------------------------
 * Flame Web-site (PHP/MySQL)
 * Copyright (c) Maksim <<Klym>> Klimenko
 * URL: http://clan-flame.ru
 * ----------------------------------------------
 */
$time = date("H:i:s", time());
$date = date("d.m.Y", time());
header("Current-Time: ".$time);
header("Current-Date: ".$date);
header("Now-Time: ".date("r",time()));
?>