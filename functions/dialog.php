<?php
/**
 * ----------------------------------------------
 * Flame Web-site (PHP/MySQL)
 * Copyright (c) Maksim <<Klym>> Klimenko
 * URL: http://clan-flame.ru
 * ----------------------------------------------
 */

// bool checkDialogUser(int $user_ud, int $dialog_id)
// Возвращает истину(true) если пользователь состоит в данном диалоге, ложь(false) - если не состоит
function checkDialogUser($uid,$did) {
	$result = mysql_query("SELECT COUNT(id) AS count FROM dialogs WHERE uid='$uid' AND did='$did'") or die("Запрос на выборку данных из базы не прошел. Напишите об этом администратору. E-mail: support@clan-flame.ru<br><strong>Код ошибки: </strong>".mysql_error());
	$myrow = mysql_fetch_array($result);
	if ($myrow['count'])
		return true;
	else
		return false;
}

// array[] getDialogs(int user_id)
// Возвращает массив диалогов к которым принадлежит юзер
function getDialogs($uid) {
	$dialogs = array();
	// Достаем id диалогов к которым наш юзер принадлежит
	$resultDialog = mysql_query("SELECT did FROM dialogs WHERE uid='$uid'") or die("Запрос на выборку данных из базы не прошел. Напишите об этом администратору. E-mail: support@clan-flame.ru<br><strong>Код ошибки: </strong>".mysql_error());
	while($myrow = mysql_fetch_array($resultDialog)) { // Перебор всех диалогов
		$result = mysql_query("SELECT dialogs.uid AS uid, messages.text AS text, messages.uid AS id, messages.date AS date FROM dialogs JOIN messages WHERE dialogs.did='$myrow[did]' AND dialogs.uid!='$uid' AND messages.date=(SELECT MAX(date) FROM messages WHERE did='$myrow[did]')") or die("Запрос на выборку данных из базы не прошел. Напишите об этом администратору. E-mail: support@clan-flame.ru<br><strong>Код ошибки: </strong>".mysql_error()); 
		// Получаем основные данные диалога
		$rows = mysql_fetch_array($result);
		$resultUser = mysql_query("SELECT login,avatar FROM users WHERE id='$rows[uid]'") or die("Запрос на выборку данных из базы не прошел. Напишите об этом администратору. E-mail: support@clan-flame.ru<br><strong>Код ошибки: </strong>".mysql_error());
		$myrowUser = mysql_fetch_array($resultUser);
		$resultOnline = mysql_query("SELECT * FROM online WHERE id='$rows[uid]'") or die("Запрос на выборку данных из базы не прошел. Напишите об этом администратору. E-mail: support@clan-flame.ru<br><strong>Код ошибки: </strong>".mysql_error());
		$myrowOnline = mysql_num_rows($resultOnline);
		$partner = new User(); // Создаем обьект пользователя
		// Присваиваем ему полученные свойства с базы
		$partner->id = $rows['uid'];
		$partner->login = $myrowUser['login'];
		$partner->avatar = $myrowUser['avatar'];
		if ($myrowOnline > 0)
			$partner->online = true;
		else
			$partner->online = false;
		// Генерируем многомерный массив с диалогами
		$dialogs['users'][] = $partner;
		$dialogs['dialogs'][] = $myrow['did'];
		$dialogs['messages']['id'][] = $rows['id'];
		$dialogs['messages']['text'][] = $rows['text'];
		$dialogs['messages']['time'][] = $rows['date'];
		// Преобразуем в нормальную дату
		$dialogs['messages']['datetime'][] = getMessageDate($rows['date']);
	}
	if (!empty($dialogs)) array_multisort($dialogs['messages']['time'],SORT_DESC,SORT_NUMERIC,$dialogs['messages']['id'],$dialogs['messages']['text'],$dialogs['messages']['datetime'],$dialogs['users'],$dialogs['dialogs']); // Сортируем диалоги в порядке убывания, по дате отправления последнего сообщения
	return $dialogs;
}

// int getCountDialogs(int user_id)
// Возвращает количество диалогов к которым принадлежит юзер
function getCountDialogs($uid) {
	$result = mysql_query("SELECT COUNT(did) AS count FROM dialogs WHERE uid='$uid'") or die("Запрос на выборку данных из базы не прошел. Напишите об этом администратору. E-mail: support@clan-flame.ru<br><strong>Код ошибки: </strong>".mysql_error()); 
	$myrow = mysql_fetch_array($result);
	return $myrow['count'];
}

// string getDialogName(int dialog_id, int user_id)
// Возвращает название диалога
function getDialogName($did, $uid) {
	$result = mysql_query("SELECT users.login AS login FROM dialogs JOIN users ON users.id = dialogs.uid WHERE dialogs.did = '$did' AND dialogs.uid != '$uid'") or die("Запрос на выборку данных из базы не прошел. Напишите об этом администратору. E-mail: support@clan-flame.ru<br><strong>Код ошибки: </strong>".mysql_error());
	$myrow = mysql_fetch_array($result);
	return $myrow['login'];
}

// string cutMessage(string str, int length)
// Возвращает обрезанную строку
function cutMessage($str, $length) {
	$str = iconv("utf-8", "windows-1251", $str);
	if (strlen(utf8_decode($str)) > $length) {
		$str = substr($str,0,$length);
		$str = rtrim($str,"!,.-");
		$str = substr($str,0,strrpos($str,' '));
		$str = $str."...";
	}
	return iconv("windows-1251","utf-8",$str);
}

// getDialogMessages(int dialog_id)
// Возвращает дескриптор выборки
function getDialogMessages($did) {
	$messages = array();
	if (!preg_match("|^[\d]+$|",$did)) {
		throw new DataException("Ошибка 404", "Недопустимое значение параметра, параметр не является числом.");
	}
	$result = mysql_query("SELECT messages.uid AS uid, messages.text AS text, messages.date AS date, users.login AS login, users.avatar AS avatar FROM messages JOIN users ON messages.uid = users.id WHERE messages.did='$did' ORDER BY messages.date") or die("Запрос на выборку данных из базы не прошел. Напишите об этом администратору. E-mail: support@clan-flame.ru<br><strong>Код ошибки: </strong>".mysql_error());
	return $result;
}

// getMessageDate(int mdate) 
// Возвращает преобразованную дату нужного вида
// $mdate содержит количество секунд прошедших с момента 01.01.1970 00:00
function getMessageDate($mdate) {
	if (date("d.m.Y",$mdate) == date("d.m.Y"))
		$time = date("H:i:s",$mdate);
	else
		$time = date("d.m H:i",$mdate);
	if (date("Y") > date("Y",$mdate))
		$time = date("d.m.Y H:i",$mdate);
	return $time;
}
?>