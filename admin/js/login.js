window.onload = function() {
	document.authorizeForm.onsubmit = function() {
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
		xhr.onreadystatechange = function() {
			if (xhr.readyState != 4) return;
			if (parseInt(xhr.responseText) === 200) {
				window.location.href = 'index.php';
			} else {
				var errorBlock = document.getElementById('error');
				if (errorBlock.firstChild == undefined) {
					errorBlock.appendChild(document.createTextNode(xhr.responseText));
				} else {
					errorBlock.firstChild.nodeValue = xhr.responseText;
				}
			}
		}
		xhr.open('POST', 'testreg.php', true);
		xhr.send(data);
		return false;
	};
}