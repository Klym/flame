<?php

require("blocks/autoload.php");
require("blocks/db.php");

$rawPost = file_get_contents("php://input");

$data = json_decode($rawPost);

$mapper = new SostavMapper($pdo);
$object = $mapper->find($data->id);

$object = new Sostav($data->id, $data->name, $data->scores, $data->rang, $data->dol, $data->fullName, $data->skype);
try {
	$mapper->update($object);
} catch(Exception $e) {
	die(json_encode(array("result" => $e->getMessage())));
}

echo json_encode(array("result" => "200 OK"));

?>