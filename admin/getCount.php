<?php
session_start();
require("check.php");

require("blocks/autoload.php");
require("blocks/db.php");
if (isset($_GET['type']) && !empty($_GET['type'])) {
	$type = $_GET['type'];
	switch($type) {
		case "pages":
			$mapper = new PageMapper($pdo);
		break;
		case "users":
			$mapper = new UserMapper($pdo);
		break;
		case "usergroups":
			$mapper = new UserGroupMapper($pdo);
		break;
		case "categories":
			$mapper = new CategoryMapper($pdo);
		break;
		case "data":
			$mapper = new DataItemMapper($pdo);
		break;
		case "news":
			$mapper = new NewsMapper($pdo);
		break;
		case "sostav":
			$mapper = new SostavMapper($pdo);
		break;
		default:
			die(json_encode(array("result" => "Ошибка. Невозможно установить тип данных")));
		break;
	}
} else {
	die(json_encode(array("result" => "Данные не были переданы")));
}
try {
	$count = $mapper->getCount();
} catch(Exception $e) {
	die(json_encode(array("result" => $e->getMessage())));
}
echo $count;
?>