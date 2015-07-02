<?php
/**
 * ----------------------------------------------
 * Flame Web-site (PHP/MySQL)
 * Copyright (c) Maksim <<Klym>> Klimenko
 * URL: http://clan-flame.ru
 * ----------------------------------------------
 */
 
class MiniChat extends Chat {

	function insertMessage() {
		$STH = $this->db->DBH->prepare("INSERT INTO chat (author,message,date) values (?,?,?)");
		$STH->bindParam(1,$this->authorId);
		$STH->bindParam(2,$this->message);
		$STH->bindParam(3,$this->date);
		$STH->execute();
		$this->id = $this->db->DBH->lastInsertId();
	}
	
	function getLastMod() {
		$lastModQuery = $this->db->DBH->query("SELECT MAX(id) AS max_id FROM chat");
		$lastModRow = $lastModQuery->fetch();
		$this->lastMod = $lastModRow['max_id'];
	}
		
	function getMessages($get) {
		if ($get == 1) {
			$result = $this->db->DBH->prepare("SELECT chat.date AS date, chat.id AS id, chat.message AS message, chat.author AS authorId, users.login AS author FROM chat JOIN users ON chat.author = users.id WHERE chat.id = ? ORDER BY date DESC");
			$result->bindParam(1,$this->lastMod);
		} else {
			$result = $this->db->DBH->prepare("SELECT chat.date AS date, chat.id AS id, chat.message AS message, chat.author AS authorId, users.login AS author FROM chat JOIN users ON chat.author = users.id ORDER BY date DESC");
		}
		$result->execute();
		for($i = 0; $rows = $result->fetch(); $i++) {
			self::$messages[$i] = new MiniChat();
			self::$messages[$i]->id = $rows['id'];
			self::$messages[$i]->authorId = $rows['authorId'];
			self::$messages[$i]->authorLogin = $rows['author'];
			self::$messages[$i]->message = htmlspecialchars_decode($rows['message']);
			self::$messages[$i]->date = self::dateToString($rows['date']);
		}
		return self::$messages;
	}
	
	function generateNewMessage() {
		self::$messages[0] = new MiniChat();
		self::$messages[0]->id = $this->id;
		self::$messages[0]->authorId = $this->authorId;
		self::$messages[0]->authorLogin = self::getUserLogin();
		self::$messages[0]->message = htmlspecialchars_decode($this->message);
		self::$messages[0]->date = self::dateToString($this->date);
		return self::$messages;
	}
}
?>