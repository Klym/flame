<?php
include("../blocks/connect.php");

$result = mysql_query("SELECT id FROM sostav");
$myrow = mysql_fetch_array($result);

do {
	for ($i = 0; $i < 3; $i++) {
		$result2 = mysql_query("INSERT INTO playerPosts SET player = '$myrow[id]', did = 0");
		if ($result2)
			echo "OK<br>";
	}
} while($myrow = mysql_fetch_array($result));

?>