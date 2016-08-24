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

// Сервис определения типа и порядка сортировки
adminApp.service("changeSortService", function() {
	var s;
	this.sortClass;
	
	this.setSortClasses = function(sorts) {
		this.sortProp = window.sessionStorage.getItem("sort");
		this.sortClass = new Array(sorts.length);
		s = sorts;
		for (var i = 0; i < this.sortClass.length; i++) {
			if (this.sortProp.substr(1) == sorts[i].code) {
				this.sortClass[i] = (this.sortProp[0] == '+') ? "sort" : "sort_back"
			} else {
				this.sortClass[i] = "no_sort";
			}
		}
	}
	
	this.changeSort = function(propNum) {
		for (var i = 0; i < this.sortClass.length; i++) {
			this.sortClass[i] = "no_sort";
		}
		if (this.sortProp[0] == '+' && this.sortProp.substr(1) == s[propNum].code) {
			this.sortProp = '-' + s[propNum].code;
			this.sortClass[propNum] = "sort_back"
			window.sessionStorage["sort"] = this.sortProp;
		} else {
			this.sortProp = '+' + s[propNum].code;
			this.sortClass[propNum] = "sort"
			window.sessionStorage["sort"] = this.sortProp;
		}
	}
});

// Константа определяет количество возможных массивов
adminApp.constant("consts", function() {
	return {
		COUNT: 6
	}
}());

// Директива определения группы пользователя
adminApp.directive("defineUserGroup", function(searchObj, $http, $cacheFactory) {
	return function(scope, element) {
		$http.get("getData.php?type=usergroups", {cache: true}).success(function(response) {
			scope.groups = response;		
			var ugid = searchObj.searchId(scope.groups, scope.user.access);
			element.append(document.createTextNode(scope.groups[ugid].title));
		});
	}
});

// Директива определения категории материалов
adminApp.directive("defineCat", function(searchObj, $http, $cacheFactory) {
	return function (scope, element) {
		$http.get("getData.php?type=categories", {cache: $cacheFactory.get("categories")}).success(function(response) {
			var cat = searchObj.searchId(response, scope.dataItem.cat);
			element.append(document.createTextNode(response[cat].title));
		});
	}
});

// Директива определения типа новости
adminApp.directive("defineNewsType", function() {
	return function(scope, element) {
		var type = scope.types[scope.newsItem.type];
		element.append(document.createTextNode(type));
	}
});

// Директива определения ранга игрока
adminApp.directive("definePlayerRang", function($http, searchObj) {
	return function(scope, element) {
		$http.get("getData.php?type=rangs", {cache: true}).success(function(response) {
			var rangid = searchObj.searchId(response, scope.player.rang);
			element.append(document.createTextNode(response[rangid].rangName));
		});
	}
});

// Фильтр получающий массив выводимых страниц в постраничной навигации
adminApp.filter("getPaginationPages", function() {
	return function (items, params) {
		if (angular.isNumber(items) && angular.isObject(params)) {
			// Узнаем по сколько номеров выводить на странице
			var count;
			if (items < 105) {
				count = 10;
			} else if (items < 1000) {
				count = 9;
			} else {
				count = 7;
			}
			// Создаем массив который будет фильтровать
			var temp = new Array(items);
			for (var i = 0; i < temp.length; i++) {
				temp[i] = i;
			}
			// Высчитываем с которой страницы нужно начинать выводить номера
			var from = (params.selected <= count / 2) ? 0 : params.selected - count / 2;
			if (params.selected + count / 2 >= temp.length) {
				from -= params.selected + count / 2 - temp.length;
				from = (from < 0) ? 0 : from;
			}
			// Обрезаем нужную нам часть массива
			return temp.splice(from, count);
		} else {
			return items;
		}
	}
});