var adminApp = angular.module("adminApp", ["ngRoute"])
.config(function($routeProvider, $locationProvider) {
	// Разрешаем изменять url без перезагрузки страницы
	$locationProvider.html5Mode(true);
	
	// Подгружаем выбранную страницу
	
	$routeProvider.when("/pages", {
		templateUrl: "views/pages.html"
	});
	
	$routeProvider.when("/users", {
		templateUrl: "views/users.html"
	});
	
	$routeProvider.when("/categories", {
		templateUrl: "views/categories.html"
	});
	
	$routeProvider.when("/data", {
		templateUrl: "views/data.html"
	});
	
	$routeProvider.when("/news", {
		templateUrl: "views/news.html"
	});
	
	$routeProvider.when("/sostav", {
		templateUrl: "views/sostav.html"
	});
	
	$routeProvider.otherwise({
		templateUrl: "views/main.html"
	});
});

// routeCtrl отвечает за маршрутизацию
adminApp.controller("routeCtrl", function($scope, $location, $rootScope) {
	$rootScope.limit = "3";				// Количество выводимых данных на главной
	$rootScope.selectedPage = "main";	// Текущая страница
	
	// Перехватываем событие изменения страницы
	$scope.$on("changeRoute", function(event, args) {
		$location.path("/" + args.route);
		$rootScope.selectedPage = args.route;
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
// Каждый контроллер отправляет событие изменения количества данных контроллеру навигации

var pages = [{ title: "Главная страница", meta_d: "Добро пожаловать на сайт клана Пламя", pageCode: "index" },
			 { title: "О нас", meta_d: "информация о сайте, о клане Пламя", pageCode: "info" },
			 { title: "Каталог", meta_d: "Каталог файлов Пламя", pageCode: "catalog" },
			 { title: "Регистрация", meta_d: "Регистрация на сайте клана Пламя", pageCode: "registration" }];
adminApp.controller("pageCtrl", function($scope, showSuccessMessage, showErrorMessage) {
	$scope.pages = pages;
	
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
		var successMessage = "Страница <strong>\"" + $scope.pages[id].title + "\"</strong> успешно удалена.";
		var errorMessage = "Ошибка! Страница <strong>\"" + $scope.pages[id].title + "\"</strong> не удалена.";
		// Удаляем объект из массива
		$scope.pages.splice(id, 1);
		// Вызываем сервис вывода сообщения
		showSuccessMessage.show(successMessage);
	}
});

var users = [{ name: "Максим", fam: "Клименко", login: "Клым", email: "Klymstalker@yandex.ua", groupName: "Администраторы" },
			 { name: "Олег", fam: "Перятинский", login: "Хитрец", email: "peryatinsky@yandex.ru", groupName: "Администраторы" },
			 { name: "Андрей", fam: "Оганджанов", login: "Dron", email: "grom-dro@yandex.ru", groupName: "Пламя" },
			 { name: "Артем", fam: "Шахов", login: "BurBon", email: "podgory@list.ru", groupName: "Пламя" }];
adminApp.controller("userCtrl", function($scope, showSuccessMessage, showErrorMessage) {
	$scope.users = users;
	
	$scope.$watch("users.length", function (newValue) {
		$scope.$emit("changeCount", {
			key: "users",
			val: newValue
		});
    });
	
	$scope.del = function(id) {
		if (!confirm("Вы дейстивтельно хотите удалить этого пользователя?")) return;
		var successMessage = "Пользователь <strong>\"" + $scope.users[id].login + "\"</strong> успешно удален.";
		var errorMessage = "Ошибка! Пользователь <strong>\"" + $scope.users[id].login + "\"</strong> не удален.";
		$scope.users.splice(id, 1);
		showSuccessMessage.show(successMessage);
	}
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