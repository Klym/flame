<?php
session_start();
if (!isset($_SESSION["login"])) {
	header("Location: index.php");
}
foreach($_SESSION as $key => $val) {
	unset($_SESSION[$key]);
}
echo "<html><head><meta http-equiv='refresh' content='0; url=login.php'></head></html>";
?>