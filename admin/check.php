<?php
if (!isset($_SESSION["login"]) || $_SESSION['ip'] != $_SERVER['REMOTE_ADDR'] || $_SESSION['fingerprint'] != md5($_SESSION['login'].$_SERVER['HTTP_USER_AGENT'].session_id())) {
	header('Location: login.php');
}
?>