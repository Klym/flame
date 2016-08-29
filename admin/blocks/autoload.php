<?php
function __autoload( $classname ) {
	require("classes/".$classname.".class.php");
}
?>