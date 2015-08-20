<?php
// Функция автозагрузки классов
function __autoload( $classname ) {
	require("classes/".$classname.".class.php");
}
?>