/**
 * ----------------------------------------------
 * Flame Web-site (PHP/MySQL)
 * Copyright (c) Maksim <<Klym>> Klimenko
 * URL: http://clan-flame.ru
 * ----------------------------------------------
 */

function getUrlVars() {
	var vars = [];
	var hash;
	var hashes = window.location.href.slice(window.location.href.indexOf('?') + 1).split('&');
	for(var i = 0; i < hashes.length; i++) {
		hash = hashes[i].split('=');
		vars.push(hash[0]);
		vars[hash[0]] = hash[1];
	}
	return vars;
}

function Comment(id,type,text) {
	this.id = id;
	this.type = type;
	this.text = text;
}

function sendComment() {
	var parent = this.parentNode;
	var hidden = parent.getElementsByTagName('input');
	var get = getUrlVars();
	var id = get.id;
	var type = hidden[0].value;
	var textarea = parent.getElementsByTagName('textarea');
	var text = String.prototype.trim(textarea[0].value);
	if (text == '') {
		alert("Вы не ввели текст комментария");
		return false;
	}
	textarea[0].value = ""; // Очищаем форму
	var comment = new Comment(id,type,text);
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
