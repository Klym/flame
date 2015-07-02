/**
 * ----------------------------------------------
 * Flame Web-site (PHP/MySQL)
 * Copyright (c) Maksim <<Klym>> Klimenko
 * URL: http://clan-flame.ru
 * ----------------------------------------------
 */
var IE='\v'=='v';
var divs = new Array();

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
		gallery();	// Запустить функцию gallery(Запускает слайдшоу)
	}
	
	// К chat.js
	if (document.getElementById("chat")) {
		setTimeout("printChat(); checkUpdates()",1500);
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
	var updateStat = document.getElementById("updateStat");
	updateStat.update.onclick = function() {
		alert(5);
	}
	
	// Рендеринг нестандартных шрифтов
	var replace = [".newsTitleImg",".catalogTitleBack",".leftBlockHeader",".rightBlockHeader",".buttonText","#sostav"]
	for (var i = 0; i < replace.length; i++) {
		Cufon.replace(replace[i]);
	}
}