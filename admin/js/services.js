// Сервис показа сообщения о статусе произведенного действия
var baseMessageService = function() {
	this.show = function(msg) {
		var span = document.createElement("span");
		span.setAttribute("aria-hidden", "true");
		span.appendChild(document.createTextNode("x"));
		
		var button = document.createElement("button");
		button.setAttribute("type", "button");
		button.setAttribute("class", "close");
		button.setAttribute("data-dismiss", "alert");
		button.setAttribute("aria-label", "Close");
		button.appendChild(span);
		
		var message = document.createElement("div");
		message.setAttribute("class", "alert alert-" + this.type + " alert-dismissible fade in");
		message.setAttribute("role", "alert");		
		message.innerHTML = msg;
		message.appendChild(button);
		$(".col-md-12").prepend(message);
		
		setTimeout(function() {
			$(message).alert('close');
		}, 3000);
	}
}

var successMessageService = function() {};
successMessageService.prototype = new baseMessageService();
successMessageService.prototype.type = "info";

var errorMessageService = function() {};
errorMessageService.prototype = new baseMessageService();
errorMessageService.prototype.type = "danger";

// Сервис поиска элемента в массиве данных до id
var searchObj = function() {
	this.searchId = function(arr, id) {
		var currentId = -1;
		for (var i = 0; i < arr.length; i++) {
			if (arr[i].id == id) {
				currentId = i;
				break;
			}
		}
		return currentId;
	}
}

adminApp.service("showSuccessMessage", successMessageService)
		.service("showErrorMessage", errorMessageService)
		.service("searchObj", searchObj);