<?php
$user = new User();
$user->db = $db;
if (isset($_SESSION['email'])) {
	$user->session($_SESSION['email']);
}
?>