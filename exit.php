<?php
session_start();
if (!isset($_SESSION['email'])) header("Location: index.php");
require("blocks/autoload.php");
require("blocks/db.php");
$user = new User();
$user->db = $db;
$user->session($_SESSION['email']);
$user->escape();
?>