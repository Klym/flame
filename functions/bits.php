<?php
function bitFlag($a) {
$number = array(2,4,8,16,32,64,128,256,512,1024,2048,4096,8192); // Массив всех битов-флагов

// Перебор битов-флагов для одной должности
for ($i = 0; $i < count($number); $i++) {
	$sum = $number[$i];
	if ($a == $sum) {
		$dol_1 = $number[$i];
	}
}

// Перебор битов-флагов для двух должностей
for ($b = 0; $b < count($number); $b++) {
	for ($i = 0; $i < count($number); $i++) {
		$sum = $number[$b] + $number[$i];
			if ($number[$i] <= $number[$b]) { }
			else {
				if ($sum == $a) {
				$dol_1 = $number[$i];
				$dol_2 = $number[$b];
				}
			}
	}
}

// Перебор битов-флагов для трёх должностей
for ($b = 0; $b < count($number); $b++) {
	for ($c = 0; $c < count($number); $c++) {
		for ($i = 0; $i < count($number); $i++) {
			if ($number[$i] == $number[$c] || $number[$i] == $number[$b] || $number[$c] == $number[$b] || $number[$b] == '') { }	else {	
				$sum = $number[$b] + $number[$c] + $number[$i];
				if ($sum == $a) {
					$dol_1 = $number[$b];
					$dol_2 = $number[$c];
					$dol_3 = $number[$i];
					}
			}
		}
	}
}
if (isset($dol_3)) // Если в результате перебора определоно 3 битов-флага
{// Вытащить из таблицы playerDol имя соответствующих должностей, и вернуть их как массив с 3 элементами
	$result_d1 = mysql_query("SELECT dolName FROM playerDol WHERE bitFlag='$dol_1'") or die("Запрос на выборку данных из базы не прошел. Напишите об этом администратору. E-mail: support@clan-flame.ru<br><strong>Код ошибки: </strong>".mysql_error());
	$myrow_d1 = mysql_fetch_array($result_d1);
	$result_d2 = mysql_query("SELECT dolName FROM playerDol WHERE bitFlag='$dol_2'") or die("Запрос на выборку данных из базы не прошел. Напишите об этом администратору. E-mail: support@clan-flame.ru<br><strong>Код ошибки: </strong>".mysql_error());
	$myrow_d2 = mysql_fetch_array($result_d2);
	$result_d3 = mysql_query("SELECT dolName FROM playerDol WHERE bitFlag='$dol_3'") or die("Запрос на выборку данных из базы не прошел. Напишите об этом администратору. E-mail: support@clan-flame.ru<br><strong>Код ошибки: </strong>".mysql_error());
	$myrow_d3 = mysql_fetch_array($result_d3);
	return array($myrow_d1['dolName'],$myrow_d2['dolName'],$myrow_d3['dolName']);
}
if (isset($dol_1) && isset($dol_2)) // Если в результате перебора определено 2 битов-флага
{// Вытащить из таблицы playerDol имя соответствующих должностей, и вернуть их как массив с двумя элементами
	$result_d1 = mysql_query("SELECT dolName FROM playerDol WHERE bitFlag='$dol_1'") or die("Запрос на выборку данных из базы не прошел. Напишите об этом администратору. E-mail: support@clan-flame.ru<br><strong>Код ошибки: </strong>".mysql_error());
	$myrow_d1 = mysql_fetch_array($result_d1);
	$result_d2 = mysql_query("SELECT dolName FROM playerDol WHERE bitFlag='$dol_2'") or die("Запрос на выборку данных из базы не прошел. Напишите об этом администратору. E-mail: support@clan-flame.ru<br><strong>Код ошибки: </strong>".mysql_error());
	$myrow_d2 = mysql_fetch_array($result_d2);
	return array($myrow_d1['dolName'],$myrow_d2['dolName']);
}
if (isset($dol_2) && isset($dol_3)) // Если в результате перебора определено 2 и 3 бит-флаг
{
	return false;	// Вернуть ложь
}
else // Иначе, тоесть определен только 1 бит-флаг, достать имя одной должности и вернуть ее как массив с одним элементом
{
	$result_d1 = mysql_query("SELECT dolName FROM playerDol WHERE bitFlag='$dol_1'") or die("Запрос на выборку данных из базы не прошел. Напишите об этом администратору. E-mail: support@clan-flame.ru<br><strong>Код ошибки: </strong>".mysql_error());
	$myrow_d1 = mysql_fetch_array($result_d1);
	return array($myrow_d1['dolName']);
}
}
?>