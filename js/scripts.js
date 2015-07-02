/**
 * ----------------------------------------------
 * Flame Web-site (PHP/MySQL)
 * Copyright (c) Maksim <<Klym>> Klimenko
 * URL: http://clan-flame.ru
 * ----------------------------------------------
 */
var IE='\v'=='v';
var divs = new Array();

if (typeof document.getElementsByClassName != 'function') {
	HTMLDocument.prototype.getElementsByClassName = Element.prototype.getElementsByClassName = function (className) {
    	if( !className ) return [];
		var elements = this.getElementsByTagName('*');
		var list = [];
		var expr = new RegExp( '(^|\\b)' + className + '(\\b|$)' );
		for (var i = 0; i < elements.length; i++)
			if (expr.test(elements[i].className))
            	list.push(elements[i]);
		return list;
	};
}

// Начало onload

window.onload = function() { // При загрузке документа
	if (IE) {
		var $ = document;
		var cssId = 'myCss';
		var head  = $.getElementsByTagName('head')[0];
		var link  = $.createElement('link');
		link.id   = cssId;
		link.rel  = 'stylesheet';
		link.type = 'text/css';
		link.href = 'css/IEstyle.css';
		link.media = 'all';
		head.appendChild(link);
	}
	
	String.prototype.trim = function(str) {
		return str.replace(/^\s+|\s+$/g, "");
	}
	
	var wrapper = document.getElementById("wrapper");
	wrapper.style.display = "block";
		
	// К gallery.js
	if (document.getElementById('gallery')) { // Если на странице найден обьект с идентификатором gallery	
		loadGallery();
		gallery();	// Запустить функцию gallery(Запускает слайдшоу)
	}
	
	// К chat.js
	if (document.getElementById("chat")) {
		setTimeout("printChat(); checkUpdates();",1500);
	}
	
	// К pda.js
	if (document.getElementById('loginForm')) {
		var form = document.getElementById('loginForm');
		var login = document.getElementById('login');
		var pass = document.getElementById('pass');
		login.onfocus = delEmail;
		login.onblur = returnEmail;
		pass.onfocus = delPass;
		pass.onblur = returnPass;
		form.onsubmit = chekForm;
	}
	if (document.getElementById("pda")) {
		setTimeout("getNowTime(); getNowDate()",1000);
	}
	
	if (document.getElementById("forgottenPass")) {
		var newpass = document.getElementById("forgottenPass");
		newpass.onclick = function() {
			window.open("../newPass.php","Восстановление забытого пароля","width=400, height=200");
		}
	}
	
	// К im.php
	if (document.getElementById("dialogs")) {
		var dtable = document.getElementById("dialogs");
		var dialogs = dtable.getElementsByTagName("tr");
		for (var i = 0; i < dialogs.length; i++) {
			dialogs[i].onclick = function() {
				var id = this.getElementsByClassName("dAva")[0].getElementsByClassName("did")[0].firstChild.nodeValue;
				window.location = "im.php?dialog=" + id;
			}
		}
	}
	
	if (document.getElementById("dMessages")) {
		var messagesAva = document.getElementsByClassName("messagesAva");
		var messagesBody = document.getElementsByClassName("messagesBody");
		for (var i = 0; i < messagesAva.length; i++) {
			var arr = new Array(messagesAva[i],messagesBody[i]);
			setEqualHeight(arr);
		}
		var messages = document.getElementById("dMessages");
		messages.scrollTop = messages.offsetHeight;
	}
	
	// К equalHeight.js
	if (document.getElementById('left')) {
		var left = document.getElementById('left');
		var right = document.getElementById('right');
		var content = document.getElementById('content');
		var columns = new Array(left,right,content);
		window.divs = columns;
		setEqualHeight(columns);
	}
	
	if (document.getElementsByClassName('rightUserBlock')[0] != undefined) {
		var rightUserBlock = document.getElementsByClassName('rightUserBlock');
		var leftUserBlock = document.getElementsByClassName('leftUserBlock');
		var blocks = new Array(leftUserBlock[0],rightUserBlock[0]);
		setEqualHeight(blocks);
	}

	// К displayMenuInfo.js
	if (document.getElementById('menuText')) {
		var display = document.getElementById('menuText');
		var displayText = display.firstChild;
		displayText.style.opacity = 0;
		displayText.style.display = 'none';
		var menu = document.getElementsByClassName('buttonText');
		for (var i = 0; i < menu.length; i++) {
			menu[i].onmouseover = displayMenuInfo;
			menu[i].firstChild.onmouseout = function(e) {
				if (IE) {
					event.cancelBubble = true;
				}
				else {
					e.cancelBubble = true;
				}
			}
			menu[i].onmouseout = function(e) {
				if (IE) {
					var relTarget = event.toElement;
				} else {
					var relTarget = e.relatedTarget;
				}
				if (relTarget !== this.firstChild.firstChild.firstChild) {
					hideInfo(display.firstChild, 1);
				}
			}
		}
	}
	
	if (document.getElementById("scriptWrap")) avatar();
	
	// К friend.js
	if (document.getElementsByClassName('addFriend')) {
		var addLink = document.getElementsByClassName('addFriend');
		for (var i = 0; i < addLink.length; i++) {
	 		addLink[i].onclick = addFriend;
		}
	}
	if (document.getElementsByClassName('delFriend')) {
		var delLink = document.getElementsByClassName('delFriend');
		for (var i = 0; i < delLink.length; i++) {
			delLink[i].onclick = delFriend;
		}
	}
	
	// К comment.js
	if(document.getElementById("sendButton")) {
		var sendButton = document.getElementById("sendButton");
		sendButton.onclick = sendComment;
	}
	
	if(document.getElementById("editUser")) {
		var editButton = document.getElementById("editUser");
		editButton.onclick = editUser;
	}
	
	// К sostav.php
	if (document.getElementById("updateStat")) {
		var updateButton = document.getElementById("updateStat").getElementsByTagName("input");
		updateButton[0].onclick = udpateStat;
	}
	
	// Рендеринг нестандартных шрифтов
	var replace = [".newsTitleImg",".catalogTitleBack",".leftBlockHeader",".rightBlockHeader",".buttonText","#sostav"]
	for (var i = 0; i < replace.length; i++) {
		Cufon.replace(replace[i]);
	}
}

// Конец onload

// Начало chat

var checkInterval = 1000; 	// Частота проверок сообщений чата (mSec)
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

// Конец chat

// Начало banner

function showCode() {
	window.prompt("Скопируйте код: ", "<a href=\"http://clan-flame.ru/\" target=\"_blank\"><div align=\"center\"><img src=\"http://clan-flame.ru/img/banner.gif\"></div></a>");
}

// Начало comment

function Comment(type,text) {
	this.type = type;
	this.text = text;
}

function sendComment() {
	var parent = this.parentNode;
	var hidden = parent.getElementsByTagName('input');
	var type = hidden[0].value;
	var textarea = parent.getElementsByTagName('textarea');
	var text = String.prototype.trim(textarea[0].value);
	if (text == '') {
		alert("Вы не ввели текст комментария");
		return false;
	}
	textarea[0].value = ""; // Очищаем форму
	var comment = new Comment(type,text);
	var jsonData = JSON.stringify(comment);
	var request = new XMLHttpRequest();
	request.onreadystatechange = function() {
		if (request.readyState == 4) {
			var message = JSON.parse(request.responseText);
			if (message.result == "No data") {
				alert("Ошибка! Данные введины не корректно");
				return false;
			} 
			var count = document.getElementById("commentsCount");
			count.firstChild.nodeValue = parseInt(count.firstChild.nodeValue) + 1;
			var newComment = createComment(message,type); //Выводим коммент в реальном времени
			var contentBlock = document.getElementById('content') || document.getElementById('blogContent');
			var height = parseFloat(contentBlock.style.height);
			contentBlock.style.height = height + newComment.offsetHeight + 10 + 'px';
			divs.pop();
			divs.push(contentBlock);
			setEqualHeight(divs);
		}
	}
	request.open("POST","../sendcomment.php",true);
	request.setRequestHeader("Content-Type","text/plain");
	request.setRequestHeader("Content-Lenght",jsonData.lenght);
	request.send(jsonData);
	return false;
}

function createComment(message,type) {
	var comments = document.getElementById("comments");
	var block = document.createElement("div");
	block.className = "comment";
	block.style.opacity = 0;
	var ava = document.createElement("div");
	ava.className = "commentAvatar";
	var img = document.createElement("img");
	img.src = "avatars/" + message.avatar;
	img.style.width = '75px';
	img.style.height = '75px';
	var info = document.createElement("div");
	if (type == 3) {
		info.className = "blogCommentInformation";
	} else {
		info.className = "commentInformation";
	}
	var login = document.createElement("div");
	login.className = "commentLogin";
	var a = document.createElement("a");
	a.href = "page.php?id=" + message.id; 
	var loginText = document.createElement("p");
	var date = document.createElement("div");
	date.className = "commentDate";
	var dateText = document.createElement("p");
	var textBlock = document.createElement("div");
	textBlock.className = "commentText";
	var textValue = document.createElement("p");
	var clear = document.createElement('div');
	clear.className = "clear";
	comments.appendChild(block);
	block.appendChild(ava);
	ava.appendChild(img);
	block.appendChild(info);
	info.appendChild(login);
	login.appendChild(a);
	a.appendChild(loginText);
	loginText.appendChild(document.createTextNode(message.login));
	info.appendChild(date);
	date.appendChild(dateText);
	dateText.appendChild(document.createTextNode(message.time));
	info.appendChild(textBlock);
	textBlock.appendChild(textValue);
	textValue.appendChild(document.createTextNode(message.text));
	block.appendChild(clear);
	fadeIn(block,50,0.05);
	return block;
}

// Конец comment

// Начало displayMenu
var opStep = 0.1;

function displayMenuInfo() {
	var arr = window.location.href.split("/");
	var ssyl = arr[0] + "//" + arr[2] + "/";
	var info = ["Главная страница сайта","Каталог файлов","Блог","","Инфо сайта","Состав клана Пламя"];
	var params = ["index.php","catalog.php","blog.php","","info.php","sostav.php"]
	var display = document.getElementById("menuText");
	for (var i = 0; i < info.length; i++) {
		if (this.firstChild == ssyl + params[i]) display.firstChild.innerHTML = info[i];
	}
	var computedStyle = display.firstChild.currentStyle || window.getComputedStyle(display.firstChild,null);
	if (computedStyle.display == 'none' && computedStyle.opacity == 0) {
		showInfo(display.firstChild, 0);
	}
	Cufon.replace(".menuText");
}

function showInfo(element,op) {
	var style = element.style;
	if (op < 1) {
		style.display = 'block';
		var opacity = op + opStep;
		style.opacity = opacity;
		setTimeout(function() {
			showInfo(element,opacity);
		},10);
	}
	else {
		element.style.opacity = 1;
	}
}

function hideInfo(element,op) {
	var style = element.style;
	style.opacity = 0;
	style.display = 'none';
}

// Конец dislpayMenu

// Начало editUser

var VRegExp = new RegExp(/^[ ]+/g);

// Класс записи
function User(login,password,repeatPass,name,fam,pol,day,month,year) {
	this.login = login;
	this.password = password;
	this.repeatPass = repeatPass;
	this.name = name;
	this.fam = fam;
	this.pol = pol;
	this.day = day;
	this.month = month;
	this.year = year;
}

function reverseStr(str) {
	return str.split("").reverse().join("");
}

function editUser() {
	var forResult = document.getElementById("forResult");
	if (forResult.style.display == "block") return false;
	var userArr = new Array();
	var parent = this.parentNode;
	var inputs = parent.getElementsByTagName("input");
	var selects = parent.getElementsByTagName("select");
	for (var i = 0; i < inputs.length; i++) {
		if (inputs[i].type != "radio") {
			userArr.push(inputs[i].value.replace(VRegExp, ''));
		} else {
			if (inputs[i].checked == true) {
				userArr.push(inputs[i].value);
			}
		}
	}
	for (var i = 0; i < selects.length; i++) {
		userArr.push(selects[i].value);
	}
	userArr.splice(6,1);
	try {
		checkUserInfo(userArr);
	} catch (e) {
		showEditInfo(e.message);
		return false;
	}
	if ((userArr[1] != '' && userArr[2] != '') && userArr[1] == userArr[2]) {
		userArr[1] = reverseStr(MD5(userArr[1]));
		userArr[2] = reverseStr(MD5(userArr[2]));
	}
	var user = new User;
	var l = 0;
	for (var prop in user) {
		user[prop] = userArr[l++];
	}
	var data = JSON.stringify(user);
	var req = new XMLHttpRequest();
	req.onreadystatechange = function() {
		if (req.readyState == 4) {
			inputs[1].value = '';
			inputs[2].value = '';
			var result = JSON.parse(req.responseText);
			if (result['result'] == "200 OK") {
				showEditInfo("Информация успешно сохранена");
			} else {
				showEditInfo(result['result']);
			}
		}
	}
	req.open("POST","../editUser.php",true);
	req.setRequestHeader("Content-Type","text/plain");
	req.setRequestHeader("Content-Lenght",data.lenght);
	req.send(data);
	return false;
}

function checkUserInfo(userArr) {
	if ((userArr[1] == '' ^ userArr[2] == '') || userArr[1] != userArr[2]) {
		throw new Error("Пароли не совпадают");
	}
	if ((userArr[1] != '' && userArr[2] != '') && userArr[1].length < 3) {			
		throw new Error("Пароль не может состоять менее чем из 3 симолов.");
	}
	for (var i = 0; i < userArr.length; i++) {
		if ((i != 1 && i != 2) && userArr[i] == '') {
			throw new Error("Вы ввели не всю информацию");
		}
	}
	if (userArr[0].length < 3 || userArr[0].length > 15) {
		throw new Error("Логин не может состоять более чем из 15 символов и менее чем из 3 симолов.");
	}
}

function showEditInfo(infoText) {
	var rightUserBlock = document.getElementsByClassName("rightUserBlock");
	var height = rightUserBlock[0].offsetHeight;
	var forResult = document.getElementById("forResult");
	var p = document.createElement("p");
	var text = document.createTextNode(infoText);
	p.appendChild(text);
	forResult.appendChild(p);
	forResult.style.opacity = 0;
	forResult.style.display = "block";
	fadeIn(forResult,50,0.05);
	rightUserBlock[0].style.height = (height + 65) + "px";
	setTimeout(function() {
		fadeOut(forResult,50,0.05);
		setTimeout(function() {
			forResult.removeChild(p);
			rightUserBlock[0].style.height = height + "px";
		},1500);
	},3000);
}

// Конец editUser

// Начало equalHeight

function setEqualHeight(columns) {
	var tallestColumn = 0;
	for(var i = 0; i < columns.length; i++) {
		var height = columns[i].offsetHeight;
		if(height > tallestColumn) {
			tallestColumn = height;
		}
	}
	for(var i = 0; i < columns.length; i++) {
		columns[i].style.height = tallestColumn + 'px';
	}
}

// Конец equalHeight

// Начало friends

function addFriend() {
	var data = [1,this.name];
	var button = this;
	var sendData = JSON.stringify(data);
	var request = new XMLHttpRequest();
	request.onreadystatechange = function() {
		if (request.readyState == 4) {
			var parent = button.parentNode;
			if (document.getElementById('count')) {
				createInterface(1,parent);
			}
			else {
				if (request.responseText == "confirmed") {
					parent.removeChild(button);
					var delButton = document.createElement('a');
					delButton.id = "delFriend";
					delButton.href = "#";
					delButton.name = data[1];
					delButton.appendChild(document.createTextNode("Убрать из друзей"));
					parent.appendChild(delButton);
					delButton.onclick = delFriend;
				}
				else {
					var fplogin = document.getElementsByClassName('fpLogin');
					var uslogin = document.getElementsByClassName('userLogin');
					var login = fplogin[0] || uslogin[0];
					var pol;
					var getpol = document.getElementById('userPol');
					if (getpol.firstChild.nodeValue == 'Мужчина' || getpol.firstChild.nodeValue == 1) {
						pol = ['','го'];
					}
					else {
						pol = ['а','ё'];
					}
					parent.removeChild(button);
					var span = document.createElement('span');
					span.className = 'notConfirm';
					span.appendChild(document.createTextNode(login.firstChild.nodeValue + ' не подтвердил'+ pol[0] +', что вы е'+ pol[1] +' друг'));
					parent.appendChild(span);
					var rightUserBlock = document.getElementsByClassName('rightUserBlock');
					var leftUserBlock = document.getElementsByClassName('leftUserBlock');
					var blocks = new Array(leftUserBlock[0],rightUserBlock[0]);
					setEqualHeight(blocks);
				}
			}
		}
	}
	request.open("POST","../operations.php",true);
	request.send(sendData);
	return false;
}

function delFriend() {
	var data = [0,this.name];
	var button = this;
	var sendData = JSON.stringify(data);
	var request = new XMLHttpRequest();
	request.onreadystatechange = function() {
		if (request.readyState == 4) {
			var parent = button.parentNode;
			if (document.getElementById('firendsCount')) {
				parent.removeChild(button);
				var message = document.createElement('p');
				var login = parent.parentNode.getElementsByClassName('friendLogin');
				message.appendChild(document.createTextNode("Пользователь " + login[0].firstChild.firstChild.nodeValue + " успешно удален из друзей"));
				message.style.color = '#0CC';
				var getNumber = document.getElementById('firendsCount');
				var count = getNumber.firstChild.nodeValue - 1;
				getNumber.firstChild.nodeValue = count;
				parent.appendChild(message);
			}
			if (document.getElementById('count') && !(document.getElementById('firendsCount'))) {
				createInterface(0,parent);
			}
			if (!(document.getElementById('count')) && !(document.getElementById('firendsCount')) && document.getElementsByClassName('userStatus') != '') {
				parent.removeChild(button);
				var addlink = document.createElement('a');
				addlink.href = "#";
				addlink.id = "addFriend";
				addlink.name = data[1];
				addlink.appendChild(document.createTextNode("Добавить в друзья"));
				parent.appendChild(addlink);
				addlink.onclick = addFriend;
			}
		}
	}
	request.open("POST","../operations.php",true);
	request.send(sendData);
	return false;
}

function createInterface(status,parent) {
	while(parent.childNodes.length > 0) {
		parent.removeChild(parent.firstChild);
	}
	var message = document.createElement('p');
	var text;
	if (status == 1) {
		text = "Заявка принята";
	}
	else {
		text = "Заявка отклонена";
	}
	message.appendChild(document.createTextNode(text));
	message.style.color = '#0CC';
	parent.appendChild(message);
	var getNumber = document.getElementById('count');
	var count = getNumber.firstChild.nodeValue - 1;
	if (count != 0) {
		getNumber.firstChild.nodeValue = count;
	}
	else {
		var link = getNumber.parentNode;
		while(link.childNodes.length > 0) {
			link.removeChild(link.firstChild);
		}
		link.appendChild(document.createTextNode("Заявки в друзья"));
	}
}

// Конец friend

// Начало functions

var showT,hideT; // Таймауты функций
// Анимационные функции появления и исчезания элементов
function show(element,maxHeight,delay,step) {
	var height = element.offsetHeight;
	if (height < maxHeight) {
		element.style.height = height + step + "px";
		window.clearTimeout(hideT);
		showT = setTimeout(function() {
			show(element,maxHeight,delay,step);
		},delay);
	}
}

function hide(element,delay,step) {
	var height = element.offsetHeight;
	if (height > 0) {
		element.style.height = height - step + "px";
		window.clearTimeout(showT);
		hideT = setTimeout(function() {
			hide(element,delay,step);
		},delay);
	}
}

function fadeIn(element,delay,step) {
	var opacity = parseFloat(element.style.opacity);
	if (opacity < 1) {
		element.style.opacity = opacity + step;
		setTimeout(function() {
			fadeIn(element,delay,step);
		},delay);
	}
}

function fadeOut(element,delay,step) {
	var opacity = parseFloat(element.style.opacity);
	if (opacity > step) {
		element.style.opacity = opacity - step;
		setTimeout(function() {
			fadeOut(element,delay,step);
		},delay);
	} else {
		element.style.display = "none";
	}
}

// Конец functions

// Начало gallery

var opacityStep = 0.01;
var filter = 100;
var interval;
var interval2;

function loadGallery() {
	var gallery = document.getElementById("gallery");
	for (var i = 6; i >= 1; i--) {
		var img = document.createElement("img");
		img.alt = "Шапка";
		img.src = "img/gallery/"+ i +".jpg";
		gallery.appendChild(img);
	}
}

function nextImage(img) {
	if (img) {
		if (img.style.opacity >= opacityStep) {
			var opacity = img.style.opacity - opacityStep;
			img.style.opacity = opacity;
			filter = filter - 5;
			img.style.filter = 'alpha(opacity=' + filter + ')';
			setTimeout(function() {
				nextImage(img);
			},10);
		}
		else {
			filter = 100;
			var parent = img.parentNode.getElementsByTagName('IMG');
			if (img == parent[0]) {
				img.style.opacity = 1;
				img.style.filter = 'alpha(opacity=' + 100 + ')';
			}
			else {
				img.style.opacity = 0;
				img.style.filter = 'alpha(opacity=' + 0 + ')';
			}
		}
	}
}

function gallery() {
	var gallery = document.getElementById('gallery');
	var images = gallery.getElementsByTagName('IMG');
	for (var i = 0; i < images.length; i++) {
		images[i].style.opacity = 1;
		images[i].style.filter = 'alpha(opacity=' + 100 + ')';
	}
	var index = images.length;
	interval = setInterval(function() {
		index--;
		if (index <= 0) {
			images[0].style.zIndex = 1;
			for (var i = 0; i < images.length; i++) {
				images[i].style.opacity = 1;
				images[i].style.filter = 'alpha(opacity=' + 100 + ')';
			}
			index = images.length;
			nextImage(images[0]);
			setTimeout(function() {
				images[0].style.zIndex = "";
			},1000);
		}
		nextImage(images[index]);
	},5500);
	window.interval = interval;
}

// Конец gallery

// Начало pda

function delEmail() {
	if (this.value == "E-Mail") {
		this.value = '';
	}
}

function returnEmail() {
	if (this.value == '') {
		this.value = "E-Mail";
	}
}

function delPass() {
	if (this.value == "Пароль") {
		this.value = '';
		this.type = "password";
	}
}

function returnPass() {
	if (this.value == '') {
		this.type = "text";
		this.value = "Пароль";
	}
}

function searchSubmit(form) {
	document.location = "search.php?keywords=" + form.keywords.value;
	return false;
}

function chekForm() {
	if (login.value == 'E-Mail' || (pass.value == "Пароль" && pass.type == "text")) {
		alert("Вы не ввели все необходимые данные для авторизации");
		return false;
	}
	if (pass.value.length < 3) {
		alert("Пароль должен состоять не менее чем из 3 символов");
		return false;
	}
}

function getNowTime() {
	var request = new XMLHttpRequest();
	request.onreadystatechange = function() {
		if (request.readyState != 4) return;
		var time = request.getResponseHeader("Current-Time");
		var divTime = document.getElementById("time");
		divTime.innerHTML = time;
		setTimeout("getNowTime()",1000);
	}
	request.open("HEAD","../gettime.php",true);
	request.send(null);
}

function getNowDate() {
	var request = new XMLHttpRequest();
	request.onreadystatechange = function() {
		if (request.readyState != 4) return;
		var date = request.getResponseHeader("Current-Date");
		var divDate = document.getElementById("date");
		divDate.innerHTML = date;
		setTimeout("getNowDate()",2000);
	}
	request.open("HEAD","../gettime.php",true);
	request.send(null);
}

// Конец pda

// Начало uploadAvatar

function createAvatarInterface() {
	var maxHeight = 30;
	var form;
	var ava = document.getElementsByClassName("userAvatar");
	var changeAva = document.createElement("div");
	var p = document.createElement("p");
	var p2 = document.createElement("p");
	var text = document.createTextNode("Загрузить новый аватар");
	var text2 = document.createTextNode("Удалить аватар");
	var changeAvaOpacity = document.createElement("div");
	changeAvaOpacity.id = "changeAvaOpacity";
	changeAva.id = "changeAva";
	ava[0].appendChild(changeAva);
	changeAva.appendChild(p);
	p.appendChild(text);
	var arr = window.location.href.split("/");
	var src = arr[0] + "//" + arr[2] + "/" + "avatars/net-avatara.jpg";
	if (ava[0].firstChild.nextSibling.src != src) {
		p2.appendChild(text2);
		changeAva.appendChild(p2);
		p2.style.top = 26 + "px";
		maxHeight = 50;
	}
	changeAva.appendChild(changeAvaOpacity);
	ava[0].onmouseover = function() {
		show(changeAva,maxHeight,1,2);
	}
	ava[0].onmouseout = function() {	
		hide(changeAva,1,2);
	}
	p.addEventListener("click",uploadAvatar,true);
	p2.addEventListener("click",deleteAvatar,true);

	function uploadAvatar() {
		this.removeEventListener("click",uploadAvatar,true);
		var rightBlock = document.getElementsByClassName("userData")[0];
		form = document.createElement("form");
		var input = document.createElement("input");
		var button = document.createElement("input");
		var cancel = document.createElement("input");
		form.id = "uploadAvatar";
		form.action = "uploadAvatar.php";
		form.method = "post";
		form.enctype = "multipart/form-data";
		form.style.position = "relative";
		form.style.top = "30px";
		input.type = "file";
		input.name = "filename";
		button.type = "submit";
		button.value = "Загрузить";
		cancel.type = "button";
		cancel.value = "Отмена";
		cancel.addEventListener("click",hideForm,true);
		form.appendChild(input);
		form.appendChild(document.createElement("br"));
		form.appendChild(button);
		form.appendChild(cancel);
		rightBlock.appendChild(form);
		function hideForm() {
			form.parentNode.removeChild(form);
			p.addEventListener("click",uploadAvatar,true);
		}
	}

	function deleteAvatar() {
		var question = confirm("Вы действительно хотите удалить аватар?");
		if (question) {
			var request = new XMLHttpRequest();
			request.onreadystatechange = function() {
				if (request.readyState != 4) return;
				if (request.responseText == "200 OK") {
					var avatar = document.getElementById("avatar");
					avatar.firstChild.nextSibling.firstChild.src = "avatars/net-avatara.jpg";
					ava[0].firstChild.nextSibling.src = "avatars/net-avatara.jpg";
					showEditInfo("Аватар успешно удален");
					changeAva.parentNode.removeChild(changeAva);
					if (form) form.parentNode.removeChild(form);
					createAvatarInterface();
				} else showEditInfo("Ошибка базы данных. Аватар не удален");
			}
			request.open("POST","../deleteAvatar.php",true);
			request.send(null);
		}
	}
}

// Конец uploadAvatar

// Начало sostav

function udpateStat() {
	var request = new XMLHttpRequest();
	request.onreadystatechange = function() {
		if (request.readyState != 4) return;
		if (request.responseText == "200 OK") {
			window.location = "sostav.php";
		} else {
			console.log(request.responseText);
			alert("Ошибка. Не удалось обновить статистику игроков");
		}
	}
	request.open("POST","../updateStat.php",false);
	request.send(null);
}

// Конец sostav

// Начало dialog

function addDialogMessage() {
	var textarea = document.getElementById("dialogForm");
	var text = String.prototype.trim(textarea.value);
	if (text == '') {
		alert("Вы не ввели текст сообшения.");
		return false;
	}
	textarea.value = '';
	var dialogMessage = new Message(text);
	var jsonData = JSON.stringify(dialogMessage);
	var req = new XMLHttpRequest();
	req.onreadystatechange = function() {
		if (req.readyState != 4) return;
		console.log(req.responseText);
	}
	req.open("POST","../addDialogMessage.php",true);
	req.setRequestHeader("Content-Type","text/plain");
	req.setRequestHeader("Content-Lenght",jsonData.lenght);
	req.send(jsonData);
}

// Конец dialog