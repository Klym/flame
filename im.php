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
require("blocks/connect.php");
require("blocks/user.php");
require("functions/dialog.php");
$d = new DataException();
try {
	$d->notDeveloped();
} catch( DataException $e ) {
	die(require("blocks/errorTemplate.php"));
}

if (!isset($_SESSION['email'])) {
	die("<html><head>
		<meta http-equiv='refresh' content='3; url=/'>
		Для просмотра этой страници войдите или зарегистрируйтесь
		</head></html>");
}
$page = "im";
$user1 = $user;

$dialogId = $_GET['dialog'];
if (empty($dialogId)) {
	$dialogs = getDialogs($user->id); // Получаем все диалоги
	$count = count($dialogs['dialogs']); // Подсчитываем их количество
} else {
	$count = getCountDialogs($user->id);
	try {
		$messages = getDialogMessages($dialogId);
	} catch( DataException $e ) {
		die(require("blocks/errorTemplate.php"));
	}
	$checkRes = checkDialogUser($user->id,$dialogId);
	if (!$checkRes) header("Location: im.php");
	$dname = getDialogName($dialogId,$user->id);
}
?>
<!DOCTYPE html>
<html>
<head>
<meta http-equiv="Content-Type" content="text/html; charset=utf-8">
<link rel="shortcut icon" href="img/favicon.ico">
<link rel="stylesheet" type="text/css" href="css/reset.css">
<link rel="stylesheet" type="text/css" href="css/style.css">
<? require("blocks/scripts.php"); ?>
<title>Официальный сайт клана Пламя - Диалоги</title>
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
									<div class="userLogin"><a <? if (empty($dialogId)) echo "class='active'";?> href="im.php">Диалоги (<? echo $count; ?>)</a><? if(!empty($dialogId)) { ?><a class='active' href="im.php?dialog=<? echo $dialogId; ?>"><? echo $dname; ?></a><? } ?></div>
                                    <?php
                                    	if (empty($_GET['dialog'])) {
											if ($count == 0) echo "<br><p>У Вас нет личных сообщений</p>";
									?>
                                    <table id="dialogs">
                                    	<!-- Вывод диалогов -->
                                    	<? for($i = 0; $i < $count; $i++) { ?>
                                    	<tr>
                                        	<td class="dAva">
	                                            <div class="did"><?php echo $dialogs['dialogs'][$i]; ?></div>
                                            	<img src="avatars/<? echo $dialogs['users'][$i]->avatar; ?>">
                                            </td>
                                            <td class="uInfo">
                                            	<span class="uLogin"><a href="page.php?id=<? echo $dialogs['users'][$i]->id; ?>"><? echo $dialogs['users'][$i]->login; ?></a></span><br>
                                                <? if ($dialogs['users'][$i]->online) { ?><span class="uStat">Online</span><br><? } ?>
                                                <span class="dDate"><? echo $dialogs['messages']['datetime'][$i]; ?></span>
                                            </td>
                                            <td><p <? if ($dialogs['messages']['id'][$i] != $user->id) echo "style='color: aqua;'"; ?>><? echo cutMessage($dialogs['messages']['text'][$i],130); ?></p></td>
                                        </tr>
                                        <? } ?>
                                    </table>
                                    <? } else { ?>
                                    <div id="dMessages">
                                    	<!-- Вывод сообщений -->
                                    	<? while($rows = mysql_fetch_array($messages)) {
											// Обработка даты отправления сообщения.
											$time = getMessageDate($rows['date']);
										?>
                                    	<div class="dMessage">
                                            <div class="messagesAva"><a href="page.php?id=<? echo $rows['uid']; ?>"><img src="avatars/<? echo $rows['avatar']; ?>"></a></div>
                                            <div class="messagesBody">
                                                <div class="uLogin"><a href="page.php?id=<? echo $rows['uid']; ?>"><? echo $rows['login']; ?></a></div>
                                                <div class="messagesDate"><p><? echo $time; ?></p></div>
                                                <div class="messagesText"><p><? echo $rows['text']; ?></p></div>
                                            </div>
										</div>
                                        <? } ?>
                                    </div>
                                    <form name="dialog" onSubmit="return false;">
                                        <textarea id="dialogForm" placeholder="Введите Ваше сообщение..."></textarea>
                                        <input name="send" type="submit" onClick="addDialogMessage();" value="Отправить">
                                    </form>
                                    <? } ?>
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