<?php
function getSostavInfo($id) {
	$player = array();
	$result_podr = mysql_query("SELECT * FROM sostav WHERE id='$id'") or die("Запрос на выборку данных из базы не прошел. Напишите об этом администратору. E-mail: support@clan-flame.ru<br><strong>Код ошибки: </strong>".mysql_error()); //Достать все поля из состава где id равно id выбраного игрока
	$myrow_podr = mysql_fetch_array($result_podr); //Занести данные в массив
	if (mysql_num_rows($result_podr) <= 0) die("Ошибка! Игрока с таким идентификатором не существует.");
	
	$dol = $myrow_podr['dol']; //Сумма всех должностей
	
	//Вычисление должностей
	list($dol1,$dol2,$dol3) = bitFlag($dol);
	if (count(bitFlag($dol)) == 1) {
		$result_dol = "$dol1";
	}
	if (count(bitFlag($dol)) == 2) {
		$result_dol = "$dol1,$dol2";
	}
	if (count(bitFlag($dol)) == 3) {
		$result_dol = "$dol1,$dol2,$dol3";
	}
	
	$result_rp = mysql_query("SELECT * FROM playerRangs WHERE rid='$myrow_podr[rang]'") or die("Запрос на выборку данных из базы не прошел. Напишите об этом администратору. E-mail: support@clan-flame.ru<br><strong>Код ошибки: </strong>".mysql_error()); //Достать все поля из таблицы playerRangs в соответствии с рангом игрока
	$myrow_rp = mysql_fetch_array($result_rp); //Занести данные в массив
	
	$nextRang = $myrow_podr['rang'] + 1; //Следующий ранг который получит игрок
	
	$result_scores = mysql_query("SELECT minScores FROM playerRangs WHERE rid='$nextRang'") or die("Запрос на выборку данных из базы не прошел. Напишите об этом администратору. E-mail: support@clan-flame.ru<br><strong>Код ошибки: </strong>".mysql_error()); //Достать минимальное количество очков следующего ранга
	$myrow_scores = mysql_fetch_array($result_scores); //Занести данные в массив
	
	$nextRangScores = $myrow_scores['minScores']; //Минимальное количество очков следующего ранга
	$scoresNeed = round($nextRangScores - $myrow_podr['scores'], 1); //Очки которые должен набрать игрок для получения следующего ранга
	
	$result_scores2 = mysql_query("SELECT minScores, maxScores FROM playerRangs WHERE rid='$myrow_podr[rang]'") or die("Запрос на выборку данных из базы не прошел. Напишите об этом администратору. E-mail: support@clan-flame.ru<br><strong>Код ошибки: </strong>".mysql_error()); //Достать максимальное и минимальное количество очков ранга игрока
	$myrow_scores2 = mysql_fetch_array($result_scores2); //Занести данные в массив
	
	$minScores = $myrow_scores2['minScores']; //Минимальное количество очков
	$maxScores = $myrow_scores2['maxScores']; //Максимальное количество очков
	$raznica = $maxScores - $minScores; //Общее количество очков данного ранга
	$raznica2 = $myrow_podr['scores'] - $minScores; //Разница между количеством очков игрока и минимальны количеством
	$procent = ($raznica2 / $raznica) * 100; //Расчет процента полученых очков данного ранга
	// Генерируем массив для вывода подробной информации игрока
	$player['name'] = $myrow_podr['name'];
	$player['rangName'] = $myrow_rp['rangName'];
	$player['scores'] = $myrow_podr['scores'];
	$player['dol'] = $result_dol;
	$player['fullName'] = $myrow_podr['fullName'];
	$player['skype'] = $myrow_podr['skype'];
	$player['scoresNeed'] = $scoresNeed;
	$player['procent'] = $procent;
	$player['rang'] = $myrow_podr['rang'];
	return $player;
}
?>