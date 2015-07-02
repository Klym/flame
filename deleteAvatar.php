<?php
session_start();
require("blocks/autoload.php");
require("blocks/db.php");
require("blocks/user.php");
if (!isset($_SESSION['email'])) {
	die("<html><head>
		<meta http-equiv='refresh' content='3; url=/'>
		Для просмотра этой страници войдите или зарегистрируйтесь
		</head></html>");
}
try {
	echo $user->deleteAvatar();
} catch( DataException $e ) {
	die($e->title);
}
?>