<?php
/**
 * ----------------------------------------------
 * Flame Web-site (PHP/MySQL)
 * Copyright (c) Maksim <<Klym>> Klimenko
 * URL: http://clan-flame.ru
 * ----------------------------------------------
 */

class Friends {
	public $id;
	public $friendId;
	public $login;
	public $avatar;
	public $access;
	public $db;
	public static $friend = array();
	
	function __construct( $id, $db='', $firendId='', $login='', $avatar='', $access='' ) {
		$this->id = $id;
		$this->db = $db;
		$this->friendId = $firendId;
		$this->login = $login;
		$this->avatar = $avatar;
		$this->access = $access;
	}
	
	function addFriend() {
		$confirm = $this->db->DBH->prepare("SELECT id FROM friends WHERE iduser=? && idfriend=? && confirm=0");
		$confirm->bindParam(1,$this->friendId);
		$confirm->bindParam(2,$this->id);
		$confirm->execute();
		if ($confirm->rowCount() == 0) {
			$STH = $this->db->DBH->prepare("INSERT INTO friends (iduser,idfriend,confirm) VALUES (?,?,0)");
			$STH->bindParam(1,$this->id);
			$STH->bindParam(2,$this->friendId);
			$STH->execute();
			$result = "added";
			return $result;
		}
		else {
			$STH = $this->db->DBH->prepare("UPDATE friends SET confirm=1 WHERE iduser=? && idfriend=?");
			$STH->bindParam(1,$this->friendId);
			$STH->bindParam(2,$this->id);
			$STH->execute();
			$result = "confirmed";
			return $result;
		}
	}
	
	function delFriend() {
		$who = $this->db->DBH->prepare("SELECT id FROM friends WHERE iduser=? && idfriend=?");
		$who->bindParam(1,$this->id);
		$who->bindParam(2,$this->friendId);
		$who->execute();
		if ($who->rowCount() == 0) {
			$uId = $this->id;
			$id = $this->friendId;
		}
		else {
			$id = $this->id;
			$uId = $this->friendId;
		}
		$STH = $this->db->DBH->prepare("DELETE FROM friends WHERE iduser=? && idfriend=?");
		$STH->bindParam(1,$id);
		$STH->bindParam(2,$uId);
		$STH->execute();
	}
	
	function isFriend($id,$ids) {
		for($i = 0; $i < count($ids); $i++) {
			if ($id == $ids[$i]) {
				return true;
			}
		}
	}
	
	function getFriends($confirm,$query) {
		$STH = $this->db->DBH->prepare($query);
		$STH->bindParam(1, $this->id);
		$STH->bindParam(2, $confirm);
		if ($confirm == 1) {
			$STH->bindParam(3, $this->id);
			$STH->bindParam(4, $confirm);
		}
		$STH->execute();
		$friends = array();
		while($rows = $STH->fetch()) {
			$friends[] = $rows['friend'];
		}
		return $friends;
	}
	
	function getConfirmedFriends() {
		$query = "SELECT idfriend AS friend FROM friends WHERE iduser=? && confirm=? UNION SELECT iduser AS friend FROM friends WHERE idfriend=? && confirm=?";
		return self::getFriends(1,$query);
	}
	
	function getNotConfirmedFriends() {
		$query = "SELECT idfriend AS friend FROM friends WHERE iduser=? && confirm=?";
		return self::getFriends(0,$query);
	}
	
	function getFriendsRequests() {
		$query = "SELECT iduser AS friend FROM friends WHERE idfriend=? && confirm=?";
		return self::getFriends(0,$query);
	}
	
	function getFriendInfo($userId) {
		$STH = $this->db->DBH->prepare("SELECT users.id AS friendId, users.login AS login, users.avatar AS avatar, usergroups.title AS access FROM users JOIN usergroups ON users.access = usergroups.id WHERE users.id=?");
		$STH->bindParam(1, $userId);
		$STH->execute();
		$rows = $STH->fetch();
		self::$friend[] = new Friends($userId,null,$rows['friendId'],$rows['login'],$rows['avatar'],$rows['access']);
	}
}
?>