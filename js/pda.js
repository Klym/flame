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
		tickTime(time, divTime);
	}
	request.open("HEAD","../gettime.php",true);
	request.send(null);
}

function checkZero(num) {
	return (num < 10 && String(num).length < 2) ? '0' + num : num;
}

function tickTime(time, divTime) {
	divTime.innerHTML = time;
	var parsedTime = time.split(":");
	if (++parsedTime[2] >= 60) {
		parsedTime[2] = 0;
		if (++parsedTime[1] >= 60) {
			parsedTime[1] = 0;
			if (++parsedTime[0] >= 24) {
				parsedTime[0] = 0;
			}
		}
	}
	for (var i = 0; i < 3; i++) {
		parsedTime[i] = checkZero(parsedTime[i]);
	}
	time = parsedTime.join(":");
	setTimeout(function() {
		tickTime(time, divTime);
	}, 1000);
}

function getNowDate() {
	var request = new XMLHttpRequest();
	request.onreadystatechange = function() {
		if (request.readyState != 4) return;
		var date = request.getResponseHeader("Current-Date");
		var divDate = document.getElementById("date");
		divDate.innerHTML = date;
	}
	request.open("HEAD","../gettime.php",true);
	request.send(null);
}