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
	$rootScope.currentId;
	
	// Перехватываем событие изменения страницы
	$scope.$on("changeRoute", function(event, args) {
		$location.path("/" + args.route);
		if (!args.notAnotherPage) {
			$rootScope.selectedPage = args.route;
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

var pages = [{ id: 1, title: "Главная страница", meta_d: "Добро пожаловать на сайт клана Пламя", meta_k: "Пламя, Flame, клан, главная, новости, сайт клана Пламя, сталкер, Survarium, постапокалипсис", pageCode: "index" },
			 { id: 2, title: "О нас", meta_d: "информация о сайте, о клане Пламя", pageCode: "info" },
			 { id: 5, title: "Каталог", meta_d: "Каталог файлов Пламя", pageCode: "catalog" },
			 { id: 6, title: "Регистрация", meta_d: "Регистрация на сайте клана Пламя", pageCode: "registration" }];
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
	$scope.update = function(id) {
		// Отправка данных на сервер
		
		var successMessage = "Страница <strong>\"" + $scope.pages[id].title + "\"</strong> успешно обновлена.";
		var errorMessage = "Ошибка! Страница <strong>\"" + $scope.pages[id].title + "\"</strong> не обновлена.";
		showSuccessMessage.show(successMessage);
	}
});

var users = [{ id: 1, name: "Максим", fam: "Клименко", pol: 1, login: "Клым", password: "6cc9c9721f21eb862447d382fd7f7968", email: "Klymstalker@yandex.ua", access: 1, regDate: new Date("2014-10-10 22:29:18"), birthDate: new Date("1997-07-06"), avatar: "a1434289074.jpg", activation: 1 },
			 { id: 2, name: "Олег", fam: "Перятинский", login: "Хитрец", email: "peryatinsky@yandex.ru", access: 1},
			 { id: 5, name: "Андрей", fam: "Оганджанов", login: "Dron", email: "grom-dro@yandex.ru",  access: 3 },
			 { id: 6, name: "Артем", fam: "Шахов", login: "BurBon", email: "podgory@list.ru",  access: 3 }];
adminApp.controller("userCtrl", function($scope, $http, showSuccessMessage, showErrorMessage, searchObj) {
	$scope.users = users;
	
	$scope.disableEditPass = true;
	$scope.enablePass = function(event) {
		var confirmation = window.confirm("Данное действие может привести к потере пароля пользователя.\nВы уверены что хотите изменить пароль?");
		if (confirmation) {
			$scope.disableEditPass = false;
			 event.target.disabled = true;
		}
	}
	
	$scope.delAvatar = function(event, id) {
		$scope.users[id].avatar = "net-avatara.jpg";
		event.target.disabled = true;
	}
	
	$scope.genders = { 1: "Мужской", 2: "Женский" };
	$scope.activations = ["Не подтвержден", "Подтвержден"];
	
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
		var currentId = searchObj.searchId($scope.users, id);
		$scope.$emit("changeRoute", {
			route: "users_update",
			id: currentId,
			notAnotherPage: true
		});
	}
	
	$scope.update = function(id) {
		// Отправка данных на сервер
		
		var successMessage = "Страница <strong>\"" + $scope.users[id].title + "\"</strong> успешно обновлена.";
		var errorMessage = "Ошибка! Страница <strong>\"" + $scope.users[id].title + "\"</strong> не обновлена.";
		showSuccessMessage.show(successMessage);
	}
});

var userGroups = [{ id: 1, title: "Администраторы", color: "orange" },
				  { id: 2, title: "Сталкеры", color: "#E0E0E0" },
				  { id: 3, title: "Пламя", color: "#6891FF" }];
adminApp.controller("userGroupCtrl", function($scope, $rootScope, searchObj) {
	$scope.groups = userGroups;
	
	var selectedId = searchObj.searchId($scope.groups, $scope.users[$rootScope.currentId].access);
	$scope.selected = $scope.groups[selectedId];
	
});

var categories = [{ title: "Моды Сталкер", meta_d: "Модификации к игре сталкер", meta_k: "моды, дополнения" },
				  { title: "Видеоуроки Сталкер", meta_d: "Видеоуроки по созданию серверов, по установке игры", meta_k: "сервера, установка, сталкер, сетевая игра" },
				  { title: "Фильмы сталкер", meta_d: "Видеоуроки по созданию серверов, по установке игры", meta_k: "фильмы , сталкер" }];		 
adminApp.controller("categoryCtrl", function($scope, showSuccessMessage, showErrorMessage) {
	$scope.categories = categories;

	$scope.$watch("categories.length", function (newValue) {
		$scope.$emit("changeCount", {
			key: "categories",
			val: newValue
		});
    });
	
	$scope.del = function(id) {
		if (!confirm("Вы дейстивтельно хотите удалить эту категорию?")) return;
		var successMessage = "Категория <strong>\"" + $scope.categories[id].title + "\"</strong> успешно удалена.";
		var errorMessage = "Ошибка! Категория <strong>\"" + $scope.categories[id].title + "\"</strong> не удалена.";
		$scope.categories.splice(id, 1);
		showSuccessMessage.show(successMessage);
	}
});

var data = [{ title: "S.T.A.L.K.E.R - Зов Припяти", cat: "Игры Сталкер", meta_d: "Сталкер Зов Припяти", date: "03.10.2014" },
		    { title: "Создание сервера для сетевой игры", cat: "Видеоуроки Сталкер", meta_d: "Пошаговая инструкция установки сервера для Сталкер Чистое Небо", date: "03.10.2014" },
		    { title: "Локации и аномалии в Survarium", cat: "Survarium (Сурвариум)", meta_d: "Локации и аномалии в Survarium", date: "04.05.2014" }];
adminApp.controller("dataCtrl", function($scope, showSuccessMessage, showErrorMessage) {
	$scope.data = data;
	
	$scope.$watch("data.length", function (newValue) {
		$scope.$emit("changeCount", {
			key: "dataItems",
			val: newValue
		});
    });
	
	$scope.del = function(id) {
		if (!confirm("Вы дейстивтельно хотите удалить эту заметку?")) return;
		var successMessage = "Заметка <strong>\"" + $scope.data[id].title + "\"</strong> успешно удалена.";
		var errorMessage = "Ошибка! Заметка <strong>\"" + $scope.data[id].title + "\"</strong> не удалена.";
		$scope.data.splice(id, 1);
		showSuccessMessage.show(successMessage);
	}
});

var news = [{ title: "Сталкер Мод «Flame-Zone»", date: "24.12.2014", typeName: "Новость" },
		    { title: "Пикник на обочине. Хроника посещения", date: "14.04.2014", typeName: "Новость / Блог" },
		    { title: "[Легенды Зоны] В петле", date: "28.04.2014", typeName: "Блог" }];
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

var players = [{ name: "Хитрец", scores: "500000", rangName: "Военачальник" },
			   { name: "Клым", scores: "480000", rangName: "Командующий" },
			   { name: "Дрoн", scores: "176375", rangName: "Бывалый Воин" }];
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