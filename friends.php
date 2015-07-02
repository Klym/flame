<?php
/**
 * ----------------------------------------------
 * Flame Web-site (PHP/MySQL)
 * Copyright (c) Maksim <<Klym>> Klimenko
 * URL: http://clan-flame.ru
 * ----------------------------------------------
 */
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
if (isset($_GET['id'])) {$id = $_GET['id'];} else {$id = '';}
if (isset($_GET['position'])) {$position = $_GET['position'];} else {$position = '';}

$page = "friends";
// Внимание! Дублирование кода. Блок кода приведенный ниже продублирован в leftUserBlock.php
$self = new Friends($user->id,$db);
$selfFriendsIds = $self->getConfirmedFriends();
$selfNotConfFriends = $self->getNotConfirmedFriends();
$selfFriendsRequests = $self->getFriendsRequests();
$friendsCount = count($selfFriendsIds);
$requestsCount = count($selfFriendsRequests);

if ($id != $user->id && !empty($id)) {
	try {
		$user1 = new User();
		$user1->db = $db;
		$user1->getUserInfo($id);
	} catch( DataException $e ) {
		die(require("blocks/errorTemplate.php"));
	}
}
else {
	$user1 = $user;
}

$friend = new Friends($user1->id,$db);
if ($position == "requests" && empty($id)) {
	$friendsIds = $selfFriendsRequests;
}
else {
	$friendsIds = $friend->getConfirmedFriends();
	$friendsCount = count($friendsIds);
}
for($i = 0; $i < count($friendsIds); $i++) {
	$friend->getFriendInfo($friendsIds[$i]);
}
$friends = Friends::$friend;
$endings = array('г','га','зей');
?>
<!DOCTYPE html>
<html>
<head>
<meta http-equiv="Content-Type" content="text/html; charset=utf-8">
<link rel="shortcut icon" href="img/favicon.ico">
<link rel="stylesheet" type="text/css" href="css/reset.css">
<link rel="stylesheet" type="text/css" href="css/style.css">
<? require("blocks/scripts.php"); ?>
<title>Официальный сайт клана Пламя - Друзья пользователя <? echo $user1->login; ?></title>
</head>
<body>
	<div id="wrapper">
    	<? require("blocks/header.php"); ?>
        <div id="body">
        	<? require("blocks/left.php"); ?>
            <? require("blocks/right.php"); ?>
            <div id="content">
				<? require("blocks/menu.php"); ?>
                <div id="contentText">
                    <div class="user">
                        <div class="beginUserBlock"></div>
                        <div class="userBlockInformation">
                            <div class="userBlockOpacity"></div>
                            <div class="userInformation">
                                <? require("blocks/leftUserBlock.php"); ?>
                                <div class="rightUserBlock">
                                    <div class="userLogin"><? if ($id == $user->id || empty($id)) { ?> <a <? if ($position != "requests") {echo "class='active'";} ?> href="friends.php">Мои Друзья<? if($position != "requests") echo " (<span id='firendsCount'>".$friendsCount."</span>)"; ?></a><? if ($requestsCount > 0) {if($position == "requests") {$class = "class='active'";} else {$class = '';} echo "<a ".$class." href='friends.php?position=requests'>Заявки в друзья (+<span id='count'>".$requestsCount."</span>)</a>";} ?>  <? } else {echo "У пользователя <span class='fpLogin'>".$user1->login."</span> ".$friendsCount." дру".$endings[Category::declension($friendsCount)];} ?></div>
                                    <div>
                                    <div id="userPol" style="display:none;"><? echo $user1->pol; ?></div>
                                        <?
											for($i = 0; $i < count($friends); $i++) { ?>
                                                <div class="friend">
                                                    <div class="friendAvatar"><img src="avatars/<? echo $friends[$i]->avatar; ?>" width="75px" height="75px"></div>
                                                    <div class="friendLogin"><a href="page.php?id=<? echo $friends[$i]->friendId; ?>"><? echo $friends[$i]->login; ?></a></div>
                                                    <div class="friendAccess"><p><? echo $friends[$i]->access; ?></p></div>
                                                    <div class="friendOperations">
													<? if($position == "requests") { ?>
                                                    	<a href='#' class='addFriend' name='<? echo $friends[$i]->friendId; ?>'>Принять</a>
                                                        <a class='delFriend' href='#' name='<? echo $friends[$i]->friendId; ?>'>Отклонить</a>
                                                    <? } else if(empty($id) || $user->id == $id) { ?>
                                                    	<a class='delFriend' href='#' name='<? echo $friends[$i]->friendId; ?>'>Убрать из друзей</a>
                                                    <? } ?>
                                                    </div>
                                                    <div class="sendMessage"><a href="im.php">ЛС</a></div>
                                                </div>
                                        <? } ?>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div id="rightBorder"></div>
            </div>
      	</div>
		<? require("blocks/footer.php"); ?>
    </div>
</body>
</html>