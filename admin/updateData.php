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
		case "pages":
			$mapper = new PageMapper($pdo);
			$object = new Page($data->id, $data->page, $data->title, $data->meta_d, $data->meta_k);
		break;
		case "categories":
			$mapper = new CategoryMapper($pdo);
			$object = new Category($data->id, $data->title, $data->text, $data->meta_d, $data->meta_k);
		break;
		case "sostav":
			$mapper = new SostavMapper($pdo);
			$object = new Sostav($data->id, $data->name, $data->scores, $data->rang, $data->dol, $data->fullName, $data->skype);
		break;
		default:
			die(json_encode(array("result" => "Ошибка. Невозможно установить тип данных")));
		break;
	}
}

try {
	$mapper->update($object);
} catch(Exception $e) {
	die(json_encode(array("result" => $e->getMessage())));
}

echo json_encode(array("result" => "200 OK"));

?>