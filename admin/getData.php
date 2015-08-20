<?php

require("blocks/autoload.php");
require("blocks/db.php");

if (isset($_GET['type']) && !empty($_GET['type'])) {
	$type = $_GET['type'];
	
	switch($type) {
		case "sostav":
			$mapper = new SostavMapper($pdo);
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