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

// Директива определения группы пользователя
adminApp.directive("defineUserGroup", function(searchObj) {
	return function(scope, element) {
		var ugid = searchObj.searchId(scope.groups, scope.user.access);
		element.append(document.createTextNode(scope.groups[ugid].title));
	}
});

// Директива определения категории материалов
adminApp.directive("defineCat", function(searchObj) {
	return function (scope, element) {
		var cat = searchObj.searchId(scope.categories, scope.dataItem.cat);
		element.append(document.createTextNode(scope.categories[cat].title));
	}
});

// Фильтр получающий массив админов
adminApp.filter("getAdmins", function() {
	return function (users) {
		if (angular.isArray(users)) {
			var filtered = [];
			for (var i = 0; i < users.length; i++) {
				if (users[i].access == 1) {
					filtered.push(users[i]);				
				}
			}
			return filtered;
		} else {
			return users;
		}
	}
});