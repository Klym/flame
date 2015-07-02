/**
 * ----------------------------------------------
 * Flame Web-site (PHP/MySQL)
 * Copyright (c) Maksim <<Klym>> Klimenko
 * URL: http://clan-flame.ru
 * ----------------------------------------------
 */

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