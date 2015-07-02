/**
 * ----------------------------------------------
 * Flame Web-site (PHP/MySQL)
 * Copyright (c) Maksim <<Klym>> Klimenko
 * URL: http://clan-flame.ru
 * ----------------------------------------------
 */

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