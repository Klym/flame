<?php
session_start();

require("blocks/autoload.php");
require("blocks/db.php");
require("blocks/user.php");

$data = file_get_contents("php://input");
$data = json_decode($data);

$friend = new Friends($user->id,$db,$data[1]);
if ($data[0] == 0) {
	$friend->delFriend();
}
else {
	$result = $friend->addFriend();
	echo $result;
}
?>