<?php

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
		case "categories":
			$mapper = new CategoryMapper($pdo);
		break;
		case "sostav":
			$mapper = new SostavMapper($pdo);
		break;
		default:
			die(json_encode(array("result" => "Ошибка. Невозможно установить тип данных")));
		break;	
	}
}
try {
	$data = $mapper->findAll();
} catch(Exception $e) {
	die(json_encode(array("result" => $e->getMessage())));
}

echo $data;

?>