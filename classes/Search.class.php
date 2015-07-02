<?php
class Search {
	public $query;
	public $db;
	public $resultArr;
	private $keywords = array();
	private $data = array();
	
	function __construct($db) {
		$this->db = $db;
	}
	
	function dropBackWords($word) {
		$reg = "/(ый|ой|ая|ое|ые|ому|а|о|у|е|ого|ему|и|ы|ство|ых|ох|ия|ий|ь|я|он|ют|ат)$/ui";
		$word = preg_replace($reg,'',$word);
		return $word;
	}
	
	function stopWords() {
		$reg = "/(под|много|что|когда|где|или|которые|поэтому|все|для|будет|как)(\s|\W)/im";
		$this->query = preg_replace($reg,'',$this->query);
	}

	function explodeQuery() {
		self::stopWords();
		$words = explode(" ",$this->query);
		$i = 0;
		foreach($words as $word) {
			$word = trim($word);
			if (strlen($word) < 6) {
				unset($word);
			} else if (strlen($word) > 8) {
				$this->keywords[$i] = self::dropBackWords($word);
			} else {
				$this->keywords[$i] = $word;
			}
			$i++;
		}
	}
	
	function getQuery() {
		$this->query = Comment::checkData($this->query);
		self::explodeQuery();
		$sth = $this->db->DBH->query("SELECT data.cat AS cat, data.id AS id, title, meta_d, meta_k, description, text, view, DATE_FORMAT(data.date,'%d.%m.%Y') AS date,author,users.login AS authorLogin FROM data JOIN users ON data.author = users.id");
		if (!$sth) {
			throw new DataException("Ошибка базы данных","Запрос на выборку данных из базы не прошел. Напишите об этом администратору, Klymstalker@yandex.ua");
		}
		if ($sth->rowCount() != 0) {
			while($rows = $sth->fetch()) {
				$this->data[$rows['id']] = $rows;
			}
			self::searchResult();
		}
	}

	function searchResult() {
		foreach($this->data as $data) {
			$wordWeight = 0;
			foreach($this->keywords as $word) {
				$reg = "/\W(".$word.")/ui";
				$wordWeight += preg_match_all($reg,$data['title'],$out);
				$wordWeight += preg_match_all($reg,$data['meta_k'],$out);
				$wordWeight += preg_match_all($reg,$data['meta_d'],$out);
				$wordWeight += preg_match_all($reg,$data['description'],$out);
				$wordWeight += preg_match_all($reg,$data['text'],$out);
				$data['relevation'] += $wordWeight;
				$data['title'] = self::colorSearchWord($word,$data['title']);
				$data['description'] = self::colorSearchWord($word,$data['description']);
				$data['text'] = self::colorSearchWord($word,$data['text']);
			}
			if ($data['relevation'] != 0) {
				$this->resultArr[] = $data;
			} else {
				unset($data);
			}
		}
		if (count($this->resultArr) > 1) {
			foreach($this->resultArr as $key => $row) {
				$relevation[$key] = $row['relevation'];
			}
			array_multisort($relevation,SORT_DESC,$this->resultArr);
		}
	}

	function colorSearchWord($word,$string) {
		$replacement = "<span style='color:yellow;'>".$word."</span>";
		$result = str_replace($word,$replacement,$string);
		return $result;
	}
}
?>