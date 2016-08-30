window.onload = function() {
	var timeout;
	document.authorizeForm.onsubmit = function() {
		window.clearTimeout(timeout);
		var login = this.login.value;
		var password = this.password.value
		if (login === '' || password === '') {
			alert('Введите логин и пароль.');
			return false;
		}
		var obj = {};
		obj.login = login;
		obj.password = password;
		var data = JSON.stringify(obj);
		var xhr = new XMLHttpRequest();
		var errorBlock = document.getElementById('error');
		errorBlock.style.color = "rgb(160, 137, 137)";
		if (errorBlock.firstChild == undefined) {
			errorBlock.appendChild(document.createTextNode("Подождите..."));
		} else {
			errorBlock.firstChild.nodeValue = "Подождите...";
		}
		xhr.onreadystatechange = function() {
			if (xhr.readyState != 4) return;
			if (parseInt(xhr.responseText) === 200) {
				window.location.href = 'index.php';
			} else {
				errorBlock.style.color = "#F00";
				if (errorBlock.firstChild == undefined) {
					errorBlock.appendChild(document.createTextNode(xhr.responseText));
				} else {
					errorBlock.firstChild.nodeValue = xhr.responseText;
				}
				timeout = window.setTimeout(function() {
					errorBlock.removeChild(errorBlock.firstChild);
				}, 3500);
			}
		}
		xhr.open('POST', 'testreg.php', true);
		xhr.send(data);
		return false;
	};
}