<?php
require("blocks/connect.php");
$webpage = file_get_contents("http://svfan.ru/clans/219-пламя/info.html");
if (!$webpage)
	die("Не удалось соединиться с SVFan.ru");
$result = mysql_query("SELECT id, name, lastMatch, scores FROM sostav WHERE id != 1");
$myrow = mysql_fetch_array($result);
$log = array();
do {
	preg_match("/\d+-.+\/profile.html\">\[Пламя\] $myrow[name]/",$webpage, $matches);
	if (count($matches) == 0)
		continue;
	preg_match("/\d+/",$matches[0],$res); // Ссылка на статистику игрока
	$stats = file_get_contents("http://svfan.ru/players/".$res[0]."-".$myrow['name']."/profile.html");
	if (!$stats)
		die("Не удается получить доступ к статистике игрока.");
	$newScores = 0;
	preg_match_all("/\d+<\/a>/",$stats,$pgs);
	for($n = 1; $n <= max($pgs[0]); $n++) {
		$stats = file_get_contents("http://svfan.ru/players/".$res[0]."-".$myrow['name']."/profile.html?page=".$n."");
		preg_match_all("/matches\/\d+\.html\?hl=\d+\" class/",$stats,$id); // Идентификатор боя
		preg_match_all("/<td>\d+<\/td>\n.*<td>\d+<\/td>/",$stats,$us); // У/C
		if ($n == 1)
			preg_match("/\d+/",$id[0][0],$lastMatch); // Идентификатор последнего боя
		for($i = 0, $j = 0; $i < count($us[0]); $i++, $j++) { // Цикл по боям
			preg_match("/\d+/",$id[0][$j],$num);
			if ($num[0] <= $myrow['lastMatch'])
				break;
			preg_match_all("/\d+/",$us[0][$i],$val);
			$scores = ($val[0][0] > $val[0][1]) ? ($val[0][0] - $val[0][1]) * 2 / 10 : 0;
			$newScores += $scores;
		}
	}
	// Занос последнего боя в базу и обновление ранга, очков бойца
	$newScores += $myrow['scores'];
	$result_sc = mysql_query("SELECT rid FROM playerRangs WHERE minScores <= '$newScores' AND maxScores >= '$newScores'");
	$myrow_sc = mysql_fetch_array($result_sc);
	$rang = $myrow_sc['rid'];
	$update = mysql_query("UPDATE sostav SET scores = '$newScores', lastMatch = '$lastMatch[0]', rang = '$rang' WHERE id = '$myrow[id]'");
} while($myrow = mysql_fetch_array($result));
echo "200 OK";
?>