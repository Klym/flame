<?php
session_start();
require("check.php");

require("blocks/autoload.php");
require("blocks/db.php");

if (isset($_GET['id'])) {
	$id = $_GET['id'];
}

if (isset($_GET["from"]) && isset($_GET["to"])) {
	$from = $_GET["from"];
	$to = $_GET["to"];
	$isCollection = true;
}

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
		case "rangs":
			$mapper = new RangMapper($pdo);
		break;
		default:
			die(json_encode(array("result" => "Ошибка. Невозможно установить тип данных")));
		break;	
	}
} else {
	die(json_encode(array("result" => "Данные не были переданы")));
}
try {
	if ($isCollection) {
		$data = $mapper->findCollection($from, $to);
	} else if (isset($id)) {
		$data = $mapper->find($id);
	} else {
		$data = $mapper->findAll();
	}
} catch(Exception $e) {
	die(json_encode(array("result" => $e->getMessage())));
}

echo $data;
?>