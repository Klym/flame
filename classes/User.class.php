<?php
/**
 * ----------------------------------------------
 * Flame Web-site (PHP/MySQL)
 * Copyright (c) Maksim <<Klym>> Klimenko
 * URL: http://clan-flame.ru
 * ----------------------------------------------
 */

class User {
	public $id;
	public $email;
	public $login;
	public $password;
	public $name;
	public $fam;
	public $pol;
	public $regDate;
	public $birthDate;
	public $age;
	public $avatar;
	public $access;
	public $days;
	public $online;
	public $db;
	
	function __construct($email='',$login='',$password='',$name='',$fam='',$pol='',$regDate='',$birthDate='',$avatar='',$access='',$db='') {
		$this->email = $email;
		$this->login = $login;
		$this->password = $password;
		$this->name = $name;
		$this->fam = $fam;
		$this->pol = $pol;
		$this->regDate = $regDate;
		$this->birthDate = $birthDate;
		$this->avatar = $avatar;
		$this->access = $access;
		$this->db = $db;
	}
	
	function saveUser() {
		$checkUsr = $this->db->DBH->prepare("SELECT id FROM users WHERE email=?");
		$checkUsr2 = $this->db->DBH->prepare("SELECT id FROM users WHERE login=?");
		$checkUsr->bindParam(1,$this->email);
		$checkUsr2->bindParam(1,$this->login);
		$checkUsr->execute();
		$checkUsr2->execute();
		$count = $checkUsr->rowCount();
		$count2 = $checkUsr2->rowCount();
		if ($count > 0) {
			die("Пользователь с таким e-mail уже существует.");
		} else if ($count2 > 0) {
			die("Пользователь с таким логином уже существует.");
		}
		$addUser = $this->db->DBH->prepare("INSERT INTO users (login,password,email,access,name,fam,pol,birthDate,avatar,regDate) VALUES (?,?,?,?,?,?,?,?,?,?)");
		$data = array($this->login,strrev(md5($this->password)),$this->email,$this->access,$this->name,$this->fam,$this->pol,$this->birthDate,$this->avatar,date("Y-m-d H:i:s",time()-2*60*60));
		$addUser->execute($data);
		$this->id = $this->db->DBH->lastInsertId();
	}
	
	function sendMessage() {
		$activation = md5($this->id);
		$subject = "Подтверждение регистрации"; // Тема сообщения
		$subject ='=?utf-8?B?'. base64_encode($subject).'?=';
		$from = "Клан Пламя";
		$from = '=?utf-8?B?'. base64_encode($from).'?=';
		$headers[] ="MIME-Version: 1.0";
		$headers[] ="Content-Type: text/plain; charset=utf-8";
		$headers[] = "From: $from <support@clan-flame.ru> \r\n";
		$header = implode("\r\n", $headers);
		$message = "Здравствуйте, ".$this->name." ! Спасибо за регистрацию на сайте clan-flame.ru\nВаш логин: ".$this->login."\nПерейдите по ссылке, чтобы активировать ваш аккаунт:\nhttp://clan-flame.ru/activation.php?email=".$this->email."&code=".$activation."\nС уважением,\nАдминистрация clan-flame.ru"; // Текст сообщения
		mail($this->email,$subject,$message,$header); // Отправить сообщение
		echo "Вам на E-mail выслано письмо с cсылкой, для подтверждения регистрации.<br><a href='index.php'>Главная страница</a>";
	}
	
	function activateUserProfile($code, $email) {
		$usrIdAct = $this->db->DBH->prepare("SELECT id FROM users WHERE email=?");
		$usrIdAct->bindParam(1,$email);
		$usrIdAct->execute();
		$usrIdAct->setFetchMode(PDO::FETCH_ASSOC);
		$row = $usrIdAct->fetch();
		if (empty($row['id'])) {
			exit("<p>Пользователь с таким e-mail не найден.</p>");
		}
		else {
			$activation = md5($row['id']);
			if ($activation == $code) {
				$STH = $this->db->DBH->prepare("UPDATE users SET activation=? WHERE email=?");
				$data = array("1",$email);
				$STH->execute($data);
				if ($STH) {
					echo "<p>Ваш Е-мейл подтвержден! Теперь вы можете зайти на сайт под своим логином!<br><a href='index.php'>Главная страница</a></p>";
				}
			}
			else {
				exit("<p>Ошибка! Ваш Е-мейл не подтвержден! <a href='index.php'>Главная страница</a></p>");
			}
		}
	}
	
	function session($session) {
		$STH = $this->db->DBH->prepare("SELECT users.id AS id,login,password,name,fam,pol,DATE_FORMAT(`regDate`,'%d.%m.%Y %H:%i:%s') AS regDate,DATE_FORMAT(`birthDate`,'%d.%m.%Y') AS birthDate,avatar,usergroups.title AS access FROM users JOIN usergroups ON users.access = usergroups.id WHERE users.email=?");
		$STH->bindParam(1, $session);
		$STH->execute();
		$STH->setFetchMode(PDO::FETCH_ASSOC);
		$row = $STH->fetch();
		
		$this->id = $row['id'];
		self::getAge($this->id,"birthDate");
		self::getCountDaysOnSite($this->id,"regDate");
		self::__construct($session,$row['login'],$row['password'],$row['name'],$row['fam'],$row['pol'],$row['regDate'],$row['birthDate'],$row['avatar'],$row['access'],$this->db);
	}
	
	function checkLogin() {
		$STH = $this->db->DBH->prepare("SELECT id FROM users WHERE login=?");
		$STH->bindParam(1,$this->login);
		$STH->execute();
		$row = $STH->fetch();
		if ($row['id'] == $this->id) {
			return 0;
		}
		return $STH->rowCount();
	}
	
	function updateInfo() {
		// Метод обновления информации пользователя
		$STH = $this->db->DBH->prepare("UPDATE users SET login=?, password=?, name=?, fam=?, pol=?, birthDate=? WHERE id=?");
		$userData = array($this->login,$this->password,$this->name,$this->fam,$this->pol,$this->birthDate,$this->id);
		$STH->execute($userData);
	}
	
	public static function checkUserData($data) {
		$data = trim($data);
		$data = stripslashes($data);
		$data = htmlspecialchars($data, ENT_QUOTES | ENT_HTML5 | ENT_DISALLOWED | ENT_SUBSTITUTE, 'UTF-8');
		return $data;
	}
	
	function checkUser($sid) {
		$STH = $this->db->DBH->prepare("SELECT * FROM users WHERE email=? and activation=?");
		$activation = 1;
		$STH->bindParam(1, $this->email);
		$STH->bindParam(2, $activation);
		$STH->execute();
		$STH->setFetchMode(PDO::FETCH_ASSOC);
		$myrow = $STH->fetch();
		if ($this->password == $myrow['password']) {
			$_SESSION['email'] = $myrow['email'];
			$visited = new Visited($myrow['id'],$sid,$this->db);
			$online = new Online($myrow['id'],$sid,$this->db);
			$visited->setArr();
			$visited->set();
			$online->setArr();
			$online->set();
			echo "<html><head>
			<meta http-equiv='refresh' content='0; url=".$_SERVER['HTTP_REFERER']."'>
			</head>
			</html>";
		}
		else {
			exit ("<html><head><meta http-equiv='refresh' content='3; url=".$_SERVER['HTTP_REFERER']."'></head><body>Извините, введённый вами email или пароль неверный.</body></html>");
		}
	}
	
	function getUserInfo($id) {
		if (!preg_match("|^[\d]+$|",$id)) {
			throw new DataException("Ошибка 404", "Недопустимое значение параметра, параметр не является числом.");
		}
		$STH = $this->db->DBH->prepare("SELECT login,email,name,fam,pol,DATE_FORMAT(`regDate`,'%d.%m.%Y %H:%i:%s') AS regDate,DATE_FORMAT(`birthDate`,'%d.%m.%Y') AS birthDate,avatar,usergroups.title AS access FROM users JOIN usergroups ON users.access = usergroups.id WHERE users.id=?");
		$STH->bindParam(1,$id);
		$STH->execute();
		if ($STH->rowCount() == 0) {
			throw new DataException("Ошибка 404", "Запрашиваемая страница не найдена на сервере.");
		}
		$infoUser = $STH->fetch();
		$this->id = $id;
		self::checkOnline();
		self::getAge($id,"birthDate");
		self::getCountDaysOnSite($id,"regDate");
		self::__construct($infoUser['email'],$infoUser['login'],'',$infoUser['name'],$infoUser['fam'],$infoUser['pol'],$infoUser['regDate'],$infoUser['birthDate'],$infoUser['avatar'],$infoUser['access']);
	}
	
	function checkOnline() {
		$STH = $this->db->DBH->prepare("SELECT hid FROM online WHERE id=?");
		$STH->bindParam(1,$this->id);
		$STH->execute();
		if ($STH->rowCount() > 0)
			$this->online = true;
		else
			$this->online = false;
	}
	
	function getUserDate($id,$table) {
		$STH = $this->db->DBH->prepare("SELECT DATE_FORMAT($table,'%d') AS day, DATE_FORMAT($table,'%m') AS month, DATE_FORMAT($table,'%Y') AS year FROM users WHERE id=?");
		$STH->bindParam(1,$id);
		$STH->execute();
		$rows = $STH->fetch();
		return $rows;
	}
	
	function getAge($id,$table) {
		$rows = self::getUserDate($id,$table);
		$birthTime = mktime(0,0,0,$rows['month'],$rows['day'],$rows['year']);
		$nowTime = mktime(0,0,0,date("m"), date("d"),date("Y"));
		$age = date("Y",$nowTime) - date("Y",$birthTime);
		if ($rows['month'] < date("m")) {
			$result = $age;
		}
		else if ($rows['month'] > date("m")) {
			$result = $age - 1;
		} else if ($rows['month'] == date("m") && $rows['day'] == date("d")) {
			$result = $age;
		}
		else if ($rows['month'] == date("m") && $rows['day'] > date("d")) {
			$result = $age - 1;
		} if ($rows['month'] == date("m") && $rows['day'] < date("d")) {
			$result = $age;
		}
		
		$this->age = $result;
	}
	
	function getCountDaysOnSite($id,$table) {
		$rows = self::getUserDate($id,$table);
		$regTime = mktime(0,0,0,$rows['month'],$rows['day'],$rows['year']);
		$nowTime = mktime(0,0,0,date("m"), date("d"),date("Y"));
		$result = round(($nowTime - $regTime) / 60 / 60 / 24);
		
		$this->days = $result;
	}
	
	function getPol($pol) {
		$polArray = array(1 => "Мужчина", 2 => "Женщина");
		$pol = $polArray[$pol];
		return $pol;
	}
	
	function escape() {
		unset($_SESSION['email']);
		$url = explode("?",$_SERVER['HTTP_REFERER']);
		if ($url[0] == "http://".$_SERVER['HTTP_HOST']."/page.php" || $url[0] == "http://".$_SERVER['HTTP_HOST']."/edit.php" || $url[0] == "http://".$_SERVER['HTTP_HOST']."/friends.php" || $url[0] == "http://".$_SERVER['HTTP_HOST']."/im.php") {
			$url = "/";
		} else {
			$url = $_SERVER['HTTP_REFERER'];
		}
		$online = new Online($this->id,null,$this->db);
		$online->del();
		die("<html><head>
		<meta http-equiv='refresh' content='0; url=".$url."'>
		</head>
		</html>");
	}
	
	function sendPass() {
		$STH = $this->db->DBH->prepare("SELECT id,login FROM users WHERE email=?");
		$STH->bindParam(1,$this->email);
		$STH->execute();
		$count = $STH->rowCount();
		if ($count == 0) {
			die("<html><head>
		<meta http-equiv='refresh' content='3; url=newPass.php'>
		</head>Пользователя с таким e-mail не существует</html>");
		} else {
			$rows = $STH->fetch();
			$login = $rows['login']; // Получаем логин пользователя
			$datenow = date("YmdHis"); // Генерируем пароль через дату
			$new_password = md5($datenow); // Шифруем пароль
			$new_password = substr($new_password, 2, 6); // Шифруем пароль для отправки на почту
			$new_password_db = md5($new_password); // Шифруем пароль в базе
			$new_password_db = strrev($new_password_db); // Для надежности добавим реверс
			
			$updpass = $this->db->DBH->prepare("UPDATE users SET password=? WHERE email=?");
			$updpass->bindParam(1,$new_password_db);
			$updpass->bindParam(2,$this->email);
			$updpass->execute();
			
			$subject = "Восстановление пароля";
			$subject ='=?utf-8?B?'. base64_encode($subject).'?=';
			$from = "Клан Пламя";
			$from = '=?utf-8?B?'. base64_encode($from).'?=';
			$message = "Здравствуйте, ".$login."! Мы сгененриоровали для Вас новый пароль, теперь Вы сможете войти на сайт clan-flame.ru, используя его. После входа желательно его сменить. Пароль: ".$new_password."\nС уважением,\nАдминистрация clan-flame.ru";
						
			$headers[] ="MIME-Version: 1.0";
			$headers[] ="Content-Type: text/plain; charset=utf-8";
			$headers[] = "From: $from <support@clan-flame.ru> \r\n";
			$header = implode("\r\n", $headers);
			mail($this->email, $subject, $message, $header); // Отправляем сообщение
			echo "Вам на e-mail было выслано сообщение с новым паролем!";
		}
	}
	
	function saveNewAvatar() {
		if (!empty($_FILES['filename']['name'])) {
			$filename = $_FILES['filename']['tmp_name'];
			switch($_FILES['filename']['type']) {
				case "image/jpeg":
					$format = "jpg";
				break;
				case "image/gif":
					$format = "gif";
				break;
				case "image/png":
					$format = "png";
				break;
				default:
					die("﻿Файл должен быть в формате JPG, GIF, PNG");
				break;
			}
			$direction = "avatars/".time().".".$format;
			if (!@move_uploaded_file($filename,$direction)) {
				die("Ошибка, файл не загружен.");
			}
		} else {
			die("<html><head>
			<meta http-equiv='refresh' content='3; url=page.php'>
			Вы не выбрали изображение для загрузки
			</head></html>");
		}
		return $direction;
	}
	
	public function updateAvatar($aname) {
		$STH = $this->db->DBH->prepare("UPDATE users SET avatar=? WHERE id=?");
		$data = array($aname,$this->id);
		if ($STH->execute($data)) {
			if ($this->avatar != "net-avatara.jpg") unlink("avatars/".$this->avatar);
			echo "<meta http-equiv='refresh' content='0; url=page.php'>";
		} else {
			unlink("avatars/".$aname);
			throw new DataException("SQL Error","Ошибка базы данных. Аватар не загружен.");
		}
	}
	
	function deleteAvatar() {
		$STH = $this->db->DBH->prepare("UPDATE users SET avatar=? WHERE id=?");
		$data = array("net-avatara.jpg",$this->id);
		if ($STH->execute($data)) {
			if ($this->avatar != "net-avatara.jpg") unlink("avatars/".$this->avatar);
			return "200 OK";
		} else {
			throw new DataException("SQL Error","Ошибка базы данных. Аватар не удален");
		}
	}
}
?>