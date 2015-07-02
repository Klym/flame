<?php
/**
 * ----------------------------------------------
 * Flame Web-site (PHP/MySQL)
 * Copyright (c) Maksim <<Klym>> Klimenko
 * URL: http://clan-flame.ru
 * ----------------------------------------------
 */
 
class DialogChat extends Chat {
		
	function insertMessage() {
		$STH = $this->db->DBH->prepare("INSERT INTO messages (uid,did,text,date) VALUES (?,?,?,?)");
		$STH->bindParam(1, $this->authorId);
		$STH->bindParam(2, $this->dialogId);
		$STH->bindParam(3, $this->message);
		$STH->bindParam(4 ,$this->date);
		$STH->execute();
		$this->id = $this->db->DBH->lastInsertId();
	}
	
	function checkPresence() {
		$STH = $this->db->DBH->prepare("SELECT id FROM dialogs WHERE uid=? AND did=?");
		$STH->bindParam(1, $this->authorId);
		$STH->bindParam(2, $this->dialogId);
		$STH->execute();
		$presence = $STH->rowCount();
		if ($presence == 0)
			return false;
		else
			return true;
	}
}
?>