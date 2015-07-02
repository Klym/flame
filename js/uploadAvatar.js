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