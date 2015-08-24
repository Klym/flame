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
			$object = new Page(null, $data->page, $data->title, $data->meta_d, $data->meta_k);
		break;
		case "users":
			$mapper = new UserMapper($pdo);
			$object = new User(null, $data->login, $data->password, $data->email, $data->access, $data->name, $data->fam, $data->pol, date("Y-m-d H:i:s",time()-2*60), $data->birthDate, $data->avatar, $data->activation);
		break;
		case "categories":
			$mapper = new CategoryMapper($pdo);
			$object = new Category(null, $data->title, $data->text, $data->meta_d, $data->meta_k);
		break;
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