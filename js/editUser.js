/**
 * ----------------------------------------------
 * Flame Web-site (PHP/MySQL)
 * Copyright (c) Maksim <<Klym>> Klimenko
 * URL: http://clan-flame.ru
 * ----------------------------------------------
 */

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