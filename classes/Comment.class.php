<?php
/**
 * ----------------------------------------------
 * Flame Web-site (PHP/MySQL)
 * Copyright (c) Maksim <<Klym>> Klimenko
 * URL: http://clan-flame.ru
 * ----------------------------------------------
 */

class Comment {
	public $id;
	public $type;
	public $post;
	public $userId;
	public $userLogin;
	public $userAvatar;
	public $text;
	public $date;
	public $db;
	protected static $commentsArr = array();
	
	function __construct( $post='', $type='', $db='', $userId='', $text='' ) {
		$this->post = $post;
		$this->type = $type;
		$this->db = $db;
		$this->userId = $userId;
		$this->text = $text;
	}
	
	function setCommentsArray() {
		$comReq = $this->db->DBH->prepare("SELECT comments.id AS id, comments.text AS text, DATE_FORMAT(comments.date,'%d.%m.%Y %H:%i:%s') AS date, comments.uid AS uid, users.login AS login, users.avatar AS avatar FROM comments JOIN users ON comments.uid = users.id WHERE type=? && post=?");
		$comReq->bindParam(1,$this->type);
		$comReq->bindParam(2,$this->post);
		$comReq->execute();
		$comReq->setFetchMode(PDO::FETCH_ASSOC);
		for ($i = 0; $rows = $comReq->fetch(); $i++) {
			self::$commentsArr[$i] = new Comment();
			self::$commentsArr[$i]->id = $rows['id'];
			self::$commentsArr[$i]->type = $this->type;
			self::$commentsArr[$i]->post = $this->post;
			self::$commentsArr[$i]->text = $rows['text'];
			self::$commentsArr[$i]->date = $rows['date'];
			self::$commentsArr[$i]->userId = $rows['uid'];
			self::$commentsArr[$i]->userLogin = $rows['login'];
			self::$commentsArr[$i]->userAvatar = $rows['avatar'];
		}
		return self::$commentsArr;
	}
	
	static function printComments() {
		$comments = self::$commentsArr;
		for ($i = 0; $i < count($comments); $i++) {
			if ($comments[$i]->type == 3) {
				$class = "blogCommentInformation";
			} else {
				$class = "commentInformation";
			}
        	printf("<div class='comment'>
						<div class='commentAvatar'>
							<img src='avatars/%s' width='75px' height='75px'>
						</div>
						<div class='%s'>
							<div class='commentLogin'>
								<a href='page.php?id=%s'><p>%s</p></a>
							</div>
							<div class='commentDate'>
								<p>%s</p>
							</div>
							<div class='commentText'>
								<p>%s</p>
							</div>
						</div>
						<div class='clear'></div>
         			</div>",$comments[$i]->userAvatar,$class,$comments[$i]->userId,$comments[$i]->userLogin,$comments[$i]->date,$comments[$i]->text);
       }
	}
	
	static function checkData($data) {
		$data = trim($data);
		$data = stripslashes($data);
		$data = htmlspecialchars($data, ENT_QUOTES | ENT_HTML5 | ENT_DISALLOWED | ENT_SUBSTITUTE, 'UTF-8');
		return $data;
	}
	
	function insertComment() {
		$insReq = $this->db->DBH->prepare("INSERT INTO comments (type,post,uid,text,date) VALUES (?,?,?,?,?)");
		$commentData = array($this->type,$this->post,$this->userId,$this->text,date("Y-m-d H:i:s",time()-60*60));
		$insReq->execute($commentData);
	}
}
?>