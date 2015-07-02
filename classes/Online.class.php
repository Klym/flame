<?php
class Online extends Visit {
	public static $getQuery = "SELECT online.id AS uId, users.login AS login, users.access AS access, usergroups.color AS color FROM online JOIN users ON online.id = users.id JOIN usergroups ON users.access = usergroups.id ORDER BY online.hid";
	public static $setQuery = "SELECT id FROM online WHERE id=?";
	public static $addQuery = "INSERT INTO online (id,sess_id,last_time) VALUES (?,?,?)";
	public static $delQuery = "DELETE FROM online WHERE id=?";
	
	function setArr() {
		self::$arr = array($this->id,$this->sessionId,time());
	}
	
	function loginsOnline() {
		$id = session_id();
		$time = time();
		$past = time()-180;
		$del = $this->db->DBH->prepare("DELETE FROM online WHERE last_time < ?");
		$del->bindParam(1,$past);
		$del->execute();
		$STH = $this->db->DBH->prepare("SELECT last_time FROM online WHERE sess_id=?");
		$STH->bindParam(1,$id);
		$STH->execute();
		$count = $STH->rowCount();
		if ($count > 0) {
			$update = $this->db->DBH->prepare("UPDATE online SET last_time=? WHERE sess_id=?");
			$update->bindParam(1,$time);
			$update->bindParam(2,$id);
			$update->execute();
		}
		$result = $this->db->DBH->query("SELECT * FROM online");
		$rows = $result->rowCount();
		return $rows;
	}
	
	function del() {
		$del = $this->db->DBH->prepare(self::$delQuery);
		$del->bindParam(1,$this->id);
		$del->execute();
	}
}
?>