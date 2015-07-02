/**
 * ----------------------------------------------
 * Flame Web-site (PHP/MySQL)
 * Copyright (c) Maksim <<Klym>> Klimenko
 * URL: http://clan-flame.ru
 * ----------------------------------------------
 */

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