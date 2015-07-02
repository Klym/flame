<?php
class Visited extends Visit {
	public static $getQuery = "SELECT visited.uId AS uId, visited.date AS date, users.login AS login, users.access AS access, usergroups.color AS color FROM visited JOIN users ON visited.uId = users.id JOIN usergroups ON users.access = usergroups.id WHERE date = CURRENT_DATE() ORDER BY visited.id";
	public static $setQuery = "SELECT id FROM visited WHERE uId=?";
	public static $addQuery = "INSERT INTO visited (uId,date) VALUES (?,CURRENT_DATE())";
	public static $delQuery = "DELETE FROM visited WHERE date < CURRENT_DATE()";
	
	function setArr() {
		self::$arr = array($this->id);
	}
	
	function del() {
		$del = $this->db->DBH->prepare(self::$delQuery);
		$del->execute();
	}
}
?>