<?php

require("blocks/autoload.php");
require("blocks/db.php");

$rawPost = file_get_contents("php://input");
if (!$rawPost) {
	die(json_encode(array("result" => "Данные не были переданы")));
}
$data = json_decode($rawPost);

if (isset($_GET['type']) && !empty($_GET['type'])) {
	$type = $_GET['type'];
	
	switch($type) {
		case "sostav":
			$mapper = new SostavMapper($pdo);
			$object = new Sostav(null, $data->name, $data->scores, $data->rang, $data->dol, $data->fullName, $data->skype);
		break;
		default:
			die(json_encode(array("result" => "Ошибка. Невозможно установить тип данных")));
		break;
	}
}

try {
	$mapper->insert($object);
} catch(Exception $e) {
	die(json_encode(array("result" => $e->getMessage())));
}

echo json_encode(array("result" => $object->getId()));

?>