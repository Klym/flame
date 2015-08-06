var adminApp = angular.module("adminApp", ["ngRoute"])
.config(function($routeProvider, $locationProvider) {
	// Разрешаем изменять url без перезагрузки страницы
	$locationProvider.html5Mode(true);
	
	// Подгружаем выбранную страницу
	
	$routeProvider.when("/pages", {
		templateUrl: "views/tables/pages.html"
	});
	
	$routeProvider.when("/pages_update", {
		templateUrl: "views/forms/pages_update.html"
	});
	
	$routeProvider.when("/users", {
		templateUrl: "views/tables/users.html"
	});
	
	$routeProvider.when("/users_update", {
		templateUrl: "views/forms/users_update.html"
	});
	
	$routeProvider.when("/categories", {
		templateUrl: "views/tables/categories.html"
	});
	
	$routeProvider.when("/categories_update", {
		templateUrl: "views/forms/categories_update.html"
	});
	
	$routeProvider.when("/data", {
		templateUrl: "views/tables/data.html"
	});
	
	$routeProvider.when("/data_update", {
		templateUrl: "views/forms/data_update.html"
	});
	
	$routeProvider.when("/news", {
		templateUrl: "views/tables/news.html"
	});
	
	$routeProvider.when("/news_update", {
		templateUrl: "views/forms/news_update.html"
	});
	
	$routeProvider.when("/sostav", {
		templateUrl: "views/tables/sostav.html"
	});
	
	$routeProvider.when("/sostav_update", {
		templateUrl: "views/forms/sostav_update.html"
	});
	
	$routeProvider.otherwise({
		templateUrl: "views/main.html"
	});
});

// routeCtrl отвечает за маршрутизацию
adminApp.controller("routeCtrl", function($scope, $location, $rootScope) {
	$rootScope.limit = "3";				// Количество выводимых данных на главной
	$rootScope.selectedPage = "main";	// Текущая страница
	$rootScope.currentId;				// Текущий id данных
	
	// Перехватываем событие изменения страницы
	$scope.$on("changeRoute", function(event, args) {
		$location.path("/" + args.route);
		if (!args.notAnotherPage) {
			$rootScope.selectedPage = args.route;
			$rootScope.currentId = undefined;
		}
		if (args.id !== undefined) {
			$rootScope.currentId = args.id;
		}
	});
	
	// Запускаем событие изменения страницы, передаем в качестве параметра имя страницы
	$scope.changeRoute = function() {
		$scope.$emit("changeRoute", {
			route: event.target.attributes["data-page"].value
		});
	}
});

// navCtrl отвечает за панель навигации
adminApp.controller("navCtrl", function($scope, $rootScope) {
	// Перехватываем событие изменения количества данных в rootScope
	$rootScope.$on("changeCount", function(event, args) {
		// Отправляем вниз по дереву контроллеров кодовое имя данных и новое значение
		$scope.$broadcast("changeCount", {
			key: args.key,
			val: args.val
		});
	});
	
	// Принимаем событие изменения страницы в rootScope, для предотвращения рекурсии при отправке события вниз, создаем флажок
	$scope.flag = false;
	$rootScope.$on("changeRoute", function(event, args) {
		if ($scope.flag) // если событие было отправлено тут же в rootScope, то принимать его не будем
			return;
		$scope.flag = true;
		$rootScope.$broadcast("changeRoute", {			
			route: args.route
		});
	});
	
	// Количество данных в таблицах
	$scope.counts = { pages: 0, users: 0, categories: 0, dataItems: 0, news: 0, players: 0 };
	// Принимаем события изменения количества и записываем данные
	$scope.$on("changeCount", function(event, args) {
		$scope.counts[args.key] = args.val;
	});
	
	// изменение страницы
	$scope.changeRoute = function() {
		$scope.flag = false;	// говорим rootScope'у что данные пришли снизу
		$scope.$emit("changeRoute", {
			route: event.target.attributes["data-page"].value
		});
	}
});

// Контроллеры, отвечающие за логику данных.

adminApp.controller("pageCtrl", function($scope, $http, showSuccessMessage, showErrorMessage, searchObj) {
	$scope.pages = pages;
	// Получаем данные AJAX'ом
	/*$http.get("test.json").success(function(data) {
		$scope.pages = data;
	});*/
	
	// Устанавливаем наблюдение за длинной массива данных, при его изменении отправляем новое значение контроллеру навигации
	$scope.$watch("pages.length", function (newValue) {
		$scope.$emit("changeCount", {
			key: "pages",
			val: newValue
		});
    });
	
	// Метод удаления данных из scope текущего контроллера
	$scope.del = function(id) {
		if (!confirm("Вы дейстивтельно хотите удалить эту страницу?")) return;
		// Готовим сообщения для вывода
		var currentId = searchObj.searchId($scope.pages, id);
		var successMessage = "Страница <strong>\"" + $scope.pages[currentId].title + "\"</strong> успешно удалена.";
		var errorMessage = "Ошибка! Страница <strong>\"" + $scope.pages[currentId].title + "\"</strong> не удалена.";
		// Удаляем объект из массива
		$scope.pages.splice(currentId, 1);
		// Вызываем сервис вывода сообщения
		showSuccessMessage.show(successMessage);
	}
	
	// Метод перенаправления на страницу редактирования данных
	$scope.goUpdate = function(id) {
		var currentId = searchObj.searchId($scope.pages, id);
		$scope.$emit("changeRoute", {
			route: "pages_update",
			id: currentId,			// id выбранного элемента массива
			notAnotherPage: true	// отвечает за изменение состояния данных о текущей странице
		});
	}
	
	// Метод отправки новых данных на сервер
	$scope.update = function() {
		// Отправка данных на сервер
		
		var successMessage = "Страница <strong>\"" + $scope.pages[$scope.currentId].title + "\"</strong> успешно обновлена.";
		var errorMessage = "Ошибка! Страница <strong>\"" + $scope.pages[$scope.currentId].title + "\"</strong> не обновлена.";
		showSuccessMessage.show(successMessage);
	}
});

adminApp.controller("userCtrl", function($scope, $http, showSuccessMessage, showErrorMessage, searchObj) {
	$scope.users = users;
	for (var i = 0; i < users.length; i++) {
		$scope.users[i].birthDate = new Date($scope.users[i].birthDate);
	}
	// Метод активации поля изменения пароля
	$scope.disableEditPass = true;
	$scope.enablePass = function(event) {
		var confirmation = window.confirm("Данное действие может привести к потере пароля пользователя.\nВы уверены что хотите изменить пароль?");
		if (confirmation) {
			$scope.disableEditPass = false;
			event.target.disabled = true;
		}
	}
	
	// Метод сброса текущего аватара и установка стандартного
	$scope.delAvatar = function(id) {
		var confirmation = confirm("Вы действительно хотите удалить аватар?");
		if (confirmation) {
			$scope.users[id].avatar = "net-avatara.jpg";
		}
	}
	// Ставим watcher на поле с аватаром, если оно стандартное, блокируем кнопку сброса
	$scope.delAvatarButton = false;
	$scope.$watch("users[currentId].avatar", function(newValue) {
		if (newValue == "net-avatara.jpg") {
			$scope.delAvatarButton = true;
		}
	});
	
	// Устанавливаем watcher на копию поля users.pol и users.activation при ее изменении меняем данные и в scope
	$scope.$watch("gender", function(newValue) {
		if ($scope.currentId != undefined) {
			$scope.users[$scope.currentId].pol = newValue.val;
		}
	});
	
	$scope.$watch("activated", function(newValue) {
		if ($scope.currentId != undefined) {
			$scope.users[$scope.currentId].activation = newValue.val;
		}
	});
	
	// Определяем массивы данных для select'ов
	$scope.genders = [{ key: "Мужской", val: 1 }, { key: "Женский", val: 2 }];
	$scope.activations = [{ key: "Не подтвержден", val: 0}, { key: "Подтвержден", val: 1 }];
	if ($scope.currentId != undefined) {
		$scope.gender = $scope.genders[($scope.users[$scope.currentId].pol == 1) ? 0 : 1];
		$scope.activated = $scope.activations[$scope.users[$scope.currentId].activation];
	}
	
	// Если мы работаем не с коллекцией данных и наследуемся от контроллера материалов
	if ($scope.currentId != undefined && $scope.data != undefined) {
		var authorIndex = searchObj.searchId($scope.users, $scope.data[$scope.currentId].author);
		$scope.authorLogin = $scope.users[authorIndex];
		
		// Устанавливаем watcher на копию поля data.author при ее изменении меняем данные и в scope
		$scope.$watch("authorLogin", function(newValue) {
			$scope.data[$scope.currentId].author = newValue.id;
		});
	}
	
	$scope.$watch("users.length", function (newValue) {
		$scope.$emit("changeCount", {
			key: "users",
			val: newValue
		});
    });
	
	$scope.del = function(id) {
		if (!confirm("Вы дейстивтельно хотите удалить этого пользователя?")) return;
		var currentId = searchObj.searchId($scope.users, id);
		var successMessage = "Пользователь <strong>\"" + $scope.users[currentId].login + "\"</strong> успешно удален.";
		var errorMessage = "Ошибка! Пользователь <strong>\"" + $scope.users[currentId].login + "\"</strong> не удален.";
		$scope.users.splice(currentId, 1);
		showSuccessMessage.show(successMessage);
	}
	
	
	$scope.goUpdate = function(id) {
		var currentId = searchObj.searchId($scope.users, id);	// Передаем index нашего пользователя в массиве текущему scope'у
		$scope.$emit("changeRoute", {
			route: "users_update",
			id: currentId,
			notAnotherPage: true
		});
	}
	
	$scope.update = function() {
		// Отправка данных на сервер
		
		var successMessage = "Пользователь <strong>\"" + $scope.users[$scope.currentId].login + "\"</strong> успешно обновлен.";
		var errorMessage = "Ошибка! Пользователь <strong>\"" + $scope.users[$scope.currentId].login + "\"</strong> не обновлен.";
		showSuccessMessage.show(successMessage);
	}
});

adminApp.controller("userGroupCtrl", function($scope, searchObj) {
	$scope.groups = userGroups;
	if ($scope.currentId != undefined) {
		var selectedId = searchObj.searchId($scope.groups, $scope.users[$scope.currentId].access);
		$scope.selected = $scope.groups[selectedId];
		// Устанавливаем watcher на копию поля users.access при ее изменении меняем данные и в scope
		$scope.$watch("selected", function(newValue) {
				$scope.users[$scope.currentId].access = newValue.id;
		});
	}
});


adminApp.controller("categoryCtrl", function($scope, showSuccessMessage, showErrorMessage, searchObj) {
	$scope.categories = categories;
	
	// Если мы работаем не с коллекцией данных и наследуемся от контроллера материалов
	if ($scope.currentId != undefined && $scope.data != undefined) {
		var selectedId = searchObj.searchId($scope.categories, $scope.data[$scope.currentId].cat);
		$scope.selectedCat = $scope.categories[selectedId];
		
		// Устанавливаем watcher на копию поля data.cat при ее изменении меняем данные и в scope
		$scope.$watch("selectedCat", function(newValue) {
			$scope.data[$scope.currentId].cat = newValue.id;
		});
	}
	
	$scope.$watch("categories.length", function (newValue) {
		$scope.$emit("changeCount", {
			key: "categories",
			val: newValue
		});
    });
	
	$scope.del = function(id) {
		if (!confirm("Вы дейстивтельно хотите удалить эту категорию?")) return;
		var currentId = searchObj.searchId($scope.categories, id);
		var successMessage = "Категория <strong>\"" + $scope.categories[currentId].title + "\"</strong> успешно удалена.";
		var errorMessage = "Ошибка! Категория <strong>\"" + $scope.categories[currentId].title + "\"</strong> не удалена.";
		$scope.categories.splice(currentId, 1);
		showSuccessMessage.show(successMessage);
	}
	
	$scope.goUpdate = function(id) {
		var currentId = searchObj.searchId($scope.categories, id);
		$scope.$emit("changeRoute", {
			route: "categories_update",
			id: currentId,
			notAnotherPage: true
		});
	}
	
	$scope.update = function() {
		// Отправка данных на сервер
		
		var successMessage = "Категория <strong>\"" + $scope.categories[$scope.currentId].title + "\"</strong> успешно обновлена.";
		var errorMessage = "Ошибка! Категория <strong>\"" + $scope.categories[$scope.currentId].title + "\"</strong> не обновлена.";
		showSuccessMessage.show(successMessage);
	}
});

adminApp.controller("dataCtrl", function($scope, showSuccessMessage, showErrorMessage, searchObj) {
	$scope.data = data;
	for (var i = 0; i < data.length; i++) {
		$scope.data[i].date = new Date($scope.data[i].date);
	}
	$scope.$watch("data.length", function (newValue) {
		$scope.$emit("changeCount", {
			key: "dataItems",
			val: newValue
		});
    });
	
	$scope.del = function(id) {
		if (!confirm("Вы дейстивтельно хотите удалить эту заметку?")) return;
		var currentId = searchObj.searchId($scope.data, id);
		var successMessage = "Заметка <strong>\"" + $scope.data[currentId].title + "\"</strong> успешно удалена.";
		var errorMessage = "Ошибка! Заметка <strong>\"" + $scope.data[currentId].title + "\"</strong> не удалена.";
		$scope.data.splice(currentId, 1);
		showSuccessMessage.show(successMessage);
	}
	
	$scope.goUpdate = function(id) {
		var currentId = searchObj.searchId($scope.data, id);
		$scope.$emit("changeRoute", {
			route: "data_update",
			id: currentId,
			notAnotherPage: true
		});
	}
	
	$scope.update = function() {
		// Отправка данных на сервер
		
		var successMessage = "Заметка <strong>\"" + $scope.data[$scope.currentId].title + "\"</strong> успешно обновлена.";
		var errorMessage = "Ошибка! Заметка <strong>\"" + $scope.data[$scope.currentId].title + "\"</strong> не обновлена.";
		showSuccessMessage.show(successMessage);
	}
});

adminApp.controller("newsCtrl", function($scope, showSuccessMessage, showErrorMessage) {
	$scope.news = news;
	
	$scope.$watch("news.length", function (newValue) {
		$scope.$emit("changeCount", {
			key: "news",
			val: newValue
		});
    });
	
	$scope.del = function(id) {
		if (!confirm("Вы дейстивтельно хотите удалить эту новость?")) return;
		var successMessage = "Новость <strong>\"" + $scope.news[id].title + "\"</strong> успешно удалена.";
		var errorMessage = "Ошибка! Новость <strong>\"" + $scope.news[id].title + "\"</strong> не удалена.";
		$scope.news.splice(id, 1);
		showSuccessMessage.show(successMessage);
	}
});

adminApp.controller("sostavCtrl", function($scope, showSuccessMessage, showErrorMessage) {
	$scope.players = players;
	
	$scope.$watch("players.length", function (newValue) {
		$scope.$emit("changeCount", {
			key: "players",
			val: newValue
		});
    });
	
	$scope.del = function(id) {
		if (!confirm("Вы дейстивтельно хотите удалить этого игрока?")) return;
		var successMessage = "Игрок <strong>\"" + $scope.players[id].name + "\"</strong> успешно удален.";
		var errorMessage = "Ошибка! Игрок <strong>\"" + $scope.players[id].name + "\"</strong> не удален.";
		$scope.players.splice(id, 1);
		showSuccessMessage.show(successMessage);
	}
});