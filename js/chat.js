/**
 * ----------------------------------------------
 * Flame Web-site (PHP/MySQL)
 * Copyright (c) Maksim <<Klym>> Klimenko
 * URL: http://clan-flame.ru
 * ----------------------------------------------
 */

var checkInterval = 10000; 	// Частота проверок сообщений чата (mSec)
var checkTimer;				// Таймер проверки
var lastModified;			// Последний id чата
var lastUpdate;				// Последний id чата для определения новых сообщений в базе
var lastId;					// последний id чата для решение проблемы повторений

// Функция возвращает id последнего сообщения чата
function getLastModified(type) {
	// Выполним запрос HEAD к скрипту чата
	var req = new XMLHttpRequest();
	req.onreadystatechange = function() {
		if (req.readyState == 4) {
			var lastId = req.getResponseHeader("Last-Modified");
			if (type == 1) {
				window.lastModified = lastId;
			} else if (type == 0) {
				window.lastUpdate = lastId;
			}
		}
	}
	req.open("HEAD","../getlastmsgs.php",true);
	req.send(null);
}

getLastModified(0);

// Функция вывода всех сообщений чата через 1.5 сек. после загрузки страницы
function printChat() {
	// Удаление индикатора загрузки
	var divResult = document.getElementById('messages');
	while(divResult.hasChildNodes()) {
		divResult.removeChild(divResult.lastChild);
	}
	var type = JSON.stringify(1);
	var request = new XMLHttpRequest();
	request.onreadystatechange = function() {
		if (request.readyState == 4) {
			var messages = JSON.parse(request.responseText);
			// Элемент для отображения
			var divResult = document.getElementById('messages');
			if (messages == '') {
				var empty = document.createElement("div");
				empty.className = "chatEmpty";
				empty.innerHTML = "Сообщений нет";
				divResult.appendChild(empty);
			}
			printMessages(messages,0);
		}
	}
	request.open("POST","../getlastmsgs.php",true);
	request.send(type);
}

// Функция проверяет изменения в чате
function checkUpdates() {
	getLastModified(1);
	if (lastUpdate < lastModified) {
		// Запрос новых данных из чата
		getLastModified(0);
		var request = new XMLHttpRequest();
		request.onreadystatechange = function() {
			if (request.readyState == 4) {
				var messages = JSON.parse(request.responseText);
				if (document.getElementsByClassName('chatEmpty').length > 0) {
					var noMessages = document.getElementsByClassName('chatEmpty');
					noMessages[0].parentNode.removeChild(noMessages[0]);
				}
				// Отображение записей чата
				if (messages[0].id != lastId) {
					printMessages(messages,1);
				}
			}
		}
		request.open("GET","../getlastmsgs.php",true);
		request.send(null);
	}
	// Таймер на следующую проверку
	checkTimer = window.setTimeout("checkUpdates()",checkInterval);
}

function printMessages(messages,type) {
	var divResult = document.getElementById('messages');
	for (var i = 0; i < messages.length; i++) {
		window.lastId = messages[i].id;
		// Элемент для размещения записи
		var divMessage = document.createElement("div");
		divMessage.className = "chatContent";
		// Ссылка на автора
		var divAuthor = document.createElement("div");
		divAuthor.className = "chatAuthor";
		var linkAuthor = document.createElement("a");
		linkAuthor.href = "page.php?id=" + messages[i].authorId;
		linkAuthor.appendChild(document.createTextNode(messages[i].authorLogin));
		divAuthor.appendChild(linkAuthor);
		// Дата добавления
		var divDate = document.createElement("div");
		divDate.className = "chatDate";
		divDate.appendChild(document.createTextNode(messages[i].date));
		// Текст сообщения
		var divText = document.createElement("div");
		divText.className = "chatText";
		divText.appendChild(document.createTextNode(messages[i].message));
		divMessage.appendChild(divAuthor);
		divMessage.appendChild(divDate);
		divMessage.appendChild(divText);
		if (type == 0) {
			divResult.appendChild(divMessage);
		} else if (type == 1) {
			divResult.insertBefore(divMessage,divResult.firstChild);
		}
	}
}

// Класс записи
function Message(text) {
	this.text = text;
}

// Добавление новой записи
function addMessage() {
	// Элементы управления
	var txtMessage = document.getElementById("textMessage");
	// Проверка заполнения элементов
	var text = String.prototype.trim(txtMessage.value);
	if (text == "") {
		alert("Вы не ввели текст сообщения");
		return;
	}
	// Создание объекта записи
	var message = new Message(text);
	// Сериализация в JSON
	var jsonData = JSON.stringify(message);
	txtMessage.value = '';
	// Передача данных
	var req = new XMLHttpRequest();
	req.onreadystatechange = function() {
		if (req.readyState != 4) return;
		// Завершение передачи... Сброс таймера и показ сообщения
		window.clearTimeout(checkTimer);
		getLastModified(0);
		var message = JSON.parse(req.responseText);
		printMessages(message,1);
		checkUpdates();
	}
	req.open("POST","../addmessage.php",true);
	req.setRequestHeader("Content-Type","text/plain");
	req.setRequestHeader("Content-Lenght",jsonData.lenght);
	req.send(jsonData);
}