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
	for (var i = 0; i < $scope.users.length; i++) {
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
	
	// Определяем массивы данных для select'ов
	$scope.genders = { 1: "Мужской", 2: "Женский" };
	$scope.activations = [ "Не подтвержден", "Подтвержден" ];
		
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

adminApp.controller("userGroupCtrl", function($scope) {
	$scope.groups = userGroups;
});


adminApp.controller("categoryCtrl", function($scope, showSuccessMessage, showErrorMessage, searchObj) {
	$scope.categories = categories;
	
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
	for (var i = 0; i < $scope.data.length; i++) {
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

adminApp.controller("newsCtrl", function($scope, showSuccessMessage, showErrorMessage, searchObj) {
	$scope.news = news;
	for (var i = 0; i < $scope.news.length; i++) {
		$scope.news[i].date = new Date($scope.news[i].date);
	}
	// Типы новостей
	$scope.types = { 1: "Новость", 2: "Новость / Блог", 3: "Блог"};
	
	$scope.$watch("news.length", function (newValue) {
		$scope.$emit("changeCount", {
			key: "news",
			val: newValue
		});
    });
	
	$scope.del = function(id) {
		if (!confirm("Вы дейстивтельно хотите удалить эту новость?")) return;
		var currentId = searchObj.searchId($scope.news, id);
		var successMessage = "Новость <strong>\"" + $scope.news[currentId].title + "\"</strong> успешно удалена.";
		var errorMessage = "Ошибка! Новость <strong>\"" + $scope.news[currentId].title + "\"</strong> не удалена.";
		$scope.news.splice(currentId, 1);
		showSuccessMessage.show(successMessage);
	}
	
	$scope.goUpdate = function(id) {
		var currentId = searchObj.searchId($scope.news, id);
		$scope.$emit("changeRoute", {
			route: "news_update",
			id: currentId,
			notAnotherPage: true
		});
	}
	
	$scope.update = function() {
		// Отправка данных на сервер
		
		var successMessage = "Новость <strong>\"" + $scope.news[$scope.currentId].title + "\"</strong> успешно обновлена.";
		var errorMessage = "Ошибка! Новость <strong>\"" + $scope.news[$scope.currentId].title + "\"</strong> не обновлена.";
		showSuccessMessage.show(successMessage);
	}
});

adminApp.controller("sostavCtrl", function($scope, showSuccessMessage, showErrorMessage, searchObj) {
	$scope.players = players;
	
	$scope.$watch("players.length", function (newValue) {
		$scope.$emit("changeCount", {
			key: "players",
			val: newValue
		});
    });
	
	$scope.del = function(id) {
		if (!confirm("Вы дейстивтельно хотите удалить этого игрока?")) return;
		var currentId = searchObj.searchId($scope.players, id);
		var successMessage = "Игрок <strong>\"" + $scope.players[currentId].name + "\"</strong> успешно удален.";
		var errorMessage = "Ошибка! Игрок <strong>\"" + $scope.players[currentId].name + "\"</strong> не удален.";
		$scope.players.splice(currentId, 1);
		showSuccessMessage.show(successMessage);
	}
	
	$scope.goUpdate = function(id) {
		var currentId = searchObj.searchId($scope.players, id);
		$scope.$emit("changeRoute", {
			route: "sostav_update",
			id: currentId,
			notAnotherPage: true
		});
	}
	
	$scope.update = function() {
		// Отправка данных на сервер
		
		var successMessage = "Данные игрока <strong>\"" + $scope.players[$scope.currentId].name + "\"</strong> успешно обновлены.";
		var errorMessage = "Ошибка! Данные игрока <strong>\"" + $scope.players[$scope.currentId].name + "\"</strong> не обновлены.";
		showSuccessMessage.show(successMessage);
	}
});

adminApp.controller("rangCtrl", function($scope, searchObj) {
	$scope.rangs = rangs;
	
	// Меняем очки при изменении ранга
	$scope.changeScores = function(rangId) {
		var rang = searchObj.searchId($scope.rangs, rangId);
		$scope.players[$scope.currentId].scores = $scope.rangs[rang].minScores;
	}
	
	// Меняем ранг при изменении очков
	$scope.changeRang = function(newScores) {
		for (var i = 0; i < $scope.rangs.length; i++) {
			if (newScores >= $scope.rangs[i].minScores && newScores <= $scope.rangs[i].maxScores) {
				$scope.players[$scope.currentId].rang = $scope.rangs[i].id;
			}
		}
	}
});