var adminApp = angular.module("adminApp", ["ngRoute"])
.config(function($routeProvider, $locationProvider) {
	// Разрешаем изменять url без перезагрузки страницы
	$locationProvider.html5Mode(true);
		
	// Подгружаем выбранную страницу
	
	$routeProvider.when("/pages", {
		templateUrl: "views/tables/pages.html"
	});
	
	$routeProvider.when("/pages_add", {
		templateUrl: "views/forms/pages_add.html"
	});
	
	$routeProvider.when("/pages_update", {
		templateUrl: "views/forms/pages_update.html"
	});
	
	$routeProvider.when("/users", {
		templateUrl: "views/tables/users.html"
	});
	
	$routeProvider.when("/users_add", {
		templateUrl: "views/forms/users_add.html"
	});
	
	$routeProvider.when("/users_update", {
		templateUrl: "views/forms/users_update.html"
	});
	
	$routeProvider.when("/categories", {
		templateUrl: "views/tables/categories.html"
	});
	
	$routeProvider.when("/categories_add", {
		templateUrl: "views/forms/categories_add.html"
	});
	
	$routeProvider.when("/categories_update", {
		templateUrl: "views/forms/categories_update.html"
	});
	
	$routeProvider.when("/data", {
		templateUrl: "views/tables/data.html"
	});
	
	$routeProvider.when("/data_add", {
		templateUrl: "views/forms/data_add.html"
	});
	
	$routeProvider.when("/data_update", {
		templateUrl: "views/forms/data_update.html"
	});
	
	$routeProvider.when("/news", {
		templateUrl: "views/tables/news.html"
	});
	
	$routeProvider.when("/news_add", {
		templateUrl: "views/forms/news_add.html"
	});
	
	$routeProvider.when("/news_update", {
		templateUrl: "views/forms/news_update.html"
	});
	
	$routeProvider.when("/players", {
		templateUrl: "views/tables/sostav.html"
	});
	
	$routeProvider.when("/sostav_add", {
		templateUrl: "views/forms/sostav_add.html"
	});
	
	$routeProvider.when("/sostav_update", {
		templateUrl: "views/forms/sostav_update.html"
	});
	
	$routeProvider.when("/logout", {
		templateUrl: "logout.php"
	});
	
	$routeProvider.otherwise({
		templateUrl: "views/main.html"
	});
});

// routeCtrl отвечает за маршрутизацию
adminApp.controller("routeCtrl", function($scope, $location, $rootScope, $cacheFactory, consts) {
	$rootScope.selectedPage = "main";	// Текущая страница
	$rootScope.currentId;				// Текущий id данных
	
	// !!! Индикатор загрузки не используется
	$rootScope.arrCount = consts.COUNT;		// Количество возможных массивов
	$rootScope.showLoader = false;			// Флажок показа индикатора загрузки
	$rootScope.loaded = 0;					// Количество загрузившихся массивов

	$scope.limit = 3;						// Количество выводимых данных
	$scope.limits = [5, 10, 25, 50, 100];	// Массив возможных лимитов
	
	// Создаем кэш для хранения данных из БД
	$cacheFactory("counts");
	$cacheFactory("pages");
	$cacheFactory("users");
	$cacheFactory("categories");
	$cacheFactory("data");
	$cacheFactory("news");
	$cacheFactory("sostav");
	
	// Записываем в харнилище значение страницы в pagination и свойство сортировки
	window.sessionStorage.setItem("nav", 1);
	window.sessionStorage.setItem("sort",  "+id");
	
	// Метод изменения количества выводимых данных
	$scope.changeLimit = function(newLimit) {
		$scope.limit = newLimit;
	}
	
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
	
	$scope.$watch("selectedPage", function(newPage) {
		$scope.limit = (newPage == "main") ? 3 : $scope.limits[0];
		window.sessionStorage.nav = 1;
		window.sessionStorage.sort = "+id";
	});
	
	// Запускаем событие изменения страницы, передаем в качестве параметра имя страницы
	$scope.changeRoute = function() {
		$scope.$emit("changeRoute", {
			route: event.target.attributes["data-page"].value
		});
	}
	
	// Отлавливаем событий переключения страницы. Будет использовано для фильтра данных
	$scope.$on("changePage", function(event, args) {
		$scope.page = args.page;
	});
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
	$rootScope.counts = { pages: 0, users: 0, categories: 0, data: 0, news: 0, players: 0 };
	
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

adminApp.controller("pageCtrl", function($scope, $rootScope, $http, $cacheFactory, showSuccessMessage, showErrorMessage, searchObj, changeSortService) {	
	
	// Получаем кэш количества и кэш данных
	var countCache = $cacheFactory.get("counts");
	var dataCache = $cacheFactory.get("pages");
	
	// Получаем количество данных с сервера и кэшируем их
	$http.get("getCount.php?type=pages", {cache: countCache}).success(function(response) {
		$scope.$emit("changeCount", {
			key: "pages",
 			val: response
		});
		$scope.$broadcast("changeCount", {
			val: response
		});
    });
	
	// Получаем массив данных на странице просмотра, либо конкретную запись на странице редактирования
	var params = ($rootScope.currentId != undefined) ? "id=" + $rootScope.currentId + "" : "from=0&to=5";
	$http.get("getData.php?type=pages&" + params, {cache: dataCache}).success(function(response) {
		$scope.pages = response;
	});
	
	// Событие изменения колиества выводимых данных на странице
	$scope.$on("changeLimit", function(event, args) {
		$http.get("getData.php?type=pages&from=0&to=" + $scope.limit + "", {cache: dataCache}).success(function(response) {
			$scope.pages = response;
		});
	});
	
	// Событие переключения страницы
	$scope.$on("changePage", function(event, args) {
 		var from = $scope.limit * (args.page - 1);
 		var count = parseInt($scope.limit);
		$http.get("getData.php?type=pages&from=" + from + "&to=" + count + "", {cache: dataCache}).success(function(response) {
			$scope.pages = response;
		});
 	});
	
	// Заголовки таблицы
	$scope.sorts = [{ code: "title", name: "Название" }, { code: "meta_d", name: "Описание" }, { code: "page", name: "Страница" }];
	
	// Устанавливаем классы для заголовков таблицы
	changeSortService.setSortClasses($scope.sorts);
	$scope.sortClass = changeSortService.sortClass;
	
	// Метод изменения типа и порядка сортировки
	$scope.changeSort = function(propNum) {
		changeSortService.changeSort(propNum);
		$scope.sortProp = changeSortService.sortProp;
	}
	
	// Блокировка кнопки добавления, обновления и удаления. По умолчанию: разблокирована.
	$scope.buttonDisable = false;
	
	// Метод перенавправления на страницу добавления данных
	$scope.goAdd = function() {		
		$scope.$emit("changeRoute", {
			route: "pages_add",
			notAnotherPage: true
		});
	}
	
	// Метод добавления новых данных
	$scope.add = function() {
		$scope.pages.push($scope.newPage);	// Запихиваем данные в стэк
		$scope.buttonDisable = true;
		
		// Отправляем данные на сервер
		var promise = $http.post("putData.php?type=pages", JSON.stringify($scope.newPage));
		promise.then(fulfilled, rejected);
		
		function fulfilled(response) {
			// Ожидаем от сервера возврат идентификатора нового объекта
			if (isNaN(response.data.result)) {
				console.log(response.data);
				rejected();
			} else {
				// Устанавливаем id добавленному объекту
				$scope.pages[$scope.pages.length - 1].id = parseInt(response.data.result);
				// Очищаем кэш и увеличиваем количество
				dataCache.removeAll();
				countCache.removeAll();
				$rootScope.counts.pages++;
				var successMessage = "Страница <strong>\"" + $scope.newPage.title + "\"</strong> успешно добавлена.";
				showSuccessMessage.show(successMessage);
			}
		}
		
		function rejected() {
			var errorMessage = "Ошибка! Страница <strong>\"" + $scope.newPage.title + "\"</strong> не добавлена.";
			showErrorMessage.show(errorMessage);
		}
	}
	
	// Метод удаления данных из scope текущего контроллера
	$scope.del = function(id) {
		if (!confirm("Вы дейстивтельно хотите удалить эту страницу?")) return;
		var currentId = searchObj.searchId($scope.pages, id);
		$scope.buttonDisable = true;
		
		var promise = $http.get("deleteData.php?id=" + id + "&type=pages");
		promise.then(fulfilled, rejected);
		
		function fulfilled(response) {
			if (response.data.result != "200 OK") {
				console.log(response.data);
				rejected();
			} else {
				$scope.buttonDisable = false;
				// Готовим сообщение для вывода
				var successMessage = "Страница <strong>\"" + $scope.pages[currentId].title + "\"</strong> успешно удалена.";
				// Удаляем объект из массива
				$scope.pages.splice(currentId, 1);
				// Очищаем кэш 
				dataCache.removeAll();
				countCache.removeAll();
				// Инициируем событие обновления количества данных для контроллера навигации
				$rootScope.counts.pages--;
				$scope.$broadcast("changeCount", {
					key: "pages",
					val: $rootScope.counts.pages
				});
				// Вызываем сервис вывода сообщения
				showSuccessMessage.show(successMessage);
			}
		}
		
		function rejected() {
			$scope.buttonDisable = false;
			var errorMessage = "Ошибка! Страница <strong>\"" + $scope.pages[currentId].title + "\"</strong> не удалена.";
			showErrorMessage.show(errorMessage);
		}		
	}
	
	// Метод перенаправления на страницу редактирования данных
	$scope.goUpdate = function(id) {
		$scope.$emit("changeRoute", {
			route: "pages_update",
			id: id,					// id выбранного элемента массива
			notAnotherPage: true	// отвечает за изменение состояния данных о текущей странице
		});
	}
	
	// Метод отправки новых данных на сервер
	$scope.update = function() {
		$scope.buttonDisable = true;
		// Отправка данных на сервер
		var promise = $http.post("updateData.php?type=pages", JSON.stringify($scope.pages[0]));
		promise.then(fulfilled, rejected);
		
		function fulfilled(response) {
			if (response.data.result != "200 OK") {
				console.log(response.data);
				rejected();
			} else {
				$scope.buttonDisable = false;
				dataCache.removeAll();
				var successMessage = "Страница <strong>\"" + $scope.pages[0].title + "\"</strong> успешно обновлена.";
				showSuccessMessage.show(successMessage);
			}
		}
		
		function rejected() {
			$scope.buttonDisable = false;
			var errorMessage = "Ошибка! Страница <strong>\"" + $scope.pages[0].title + "\"</strong> не обновлена.";
			showErrorMessage.show(errorMessage);
		}
	}
});

adminApp.controller("userCtrl", function($scope, $rootScope, $http, $cacheFactory, showSuccessMessage, showErrorMessage, searchObj, changeSortService) {
	
	var countCache = $cacheFactory.get("counts");
	var dataCache = $cacheFactory.get("users");
	
	$http.get("getCount.php?type=users", {cache: countCache}).success(function(response) {
		$scope.$emit("changeCount", {
			key: "users",
 			val: response
		});
		$scope.$broadcast("changeCount", {
			val: response
		});
    });
	
	// Если страница data или news, то достать всех пользователей(админов, указано на стороне сервера!)
	var params = '';
	if ($rootScope.selectedPage != 'data' && $rootScope.selectedPage != 'news') {
		var params = ($rootScope.currentId != undefined) ? "id=" + $rootScope.currentId + "" : "from=0&to=5";
	}
	$http.get("getData.php?type=users&" + params, {cache: dataCache}).success(function(response) {
		$scope.users = response;
		for (var i = 0; i < $scope.users.length; i++) {
			$scope.users[i].birthDate = new Date($scope.users[i].birthDate);
			$scope.users[i].access = +$scope.users[i].access;
		}
	});
	
	$scope.$on("changeLimit", function(event, args) {
		$http.get("getData.php?type=users&from=0&to=" + $scope.limit + "", {cache: dataCache}).success(function(response) {
			$scope.users = response;
		});
	});
	
	$scope.$on("changePage", function(event, args) {
 		var from = $scope.limit * (args.page - 1);
 		var count = parseInt($scope.limit);
		$http.get("getData.php?type=users&from=" + from + "&to=" + count + "", {cache: dataCache}).success(function(response) {
			$scope.users = response;
		});
 	});
	
	$scope.sorts = [{ code: "login", name: "Логин" }, { code: "email", name: "E-Mail" }, { code: "access", name: "Группа" }, { code: "regDate", name: "Дата регистрации" }];
	
	changeSortService.setSortClasses($scope.sorts);
	$scope.sortClass = changeSortService.sortClass;
		
	$scope.changeSort = function(propNum) {
		changeSortService.changeSort(propNum);
		$scope.sortProp = changeSortService.sortProp;
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
	$scope.$watch("users[0].avatar", function(newValue) {
		if (newValue == "net-avatara.jpg") {
			$scope.delAvatarButton = true;
		}
	});
	
	// Определяем массивы данных для select'ов
	$scope.genders = { 1: "Мужской", 2: "Женский" };
	$scope.activations = [ "Не подтвержден", "Подтвержден" ];
	
	$scope.buttonDisable = false;
	// Стандартные данные нового пользователя
	$scope.newUser = { access: 2, pol: 1, avatar: "net-avatara.jpg", activation: 1 };

	$scope.goAdd = function() {
		$scope.block = false;
		
		$scope.$emit("changeRoute", {
			route: "users_add",
			notAnotherPage: true
		});
	}
	
	$scope.add = function() {
		$scope.newUser.regDate = new Date();
		$scope.newUser.password = MD5($scope.newUser.password); // Шифруем пароль
		$scope.users.push($scope.newUser);
		$scope.buttonDisable = true;
		
		// Отправляем данные на сервер
		var promise = $http.post("putData.php?type=users", JSON.stringify($scope.newUser));
		promise.then(fulfilled, rejected);
		
		function fulfilled(response) {
			// Ожидаем от сервера возврат идентификатора нового объекта
			if (isNaN(response.data.result)) {
				console.log(response.data);
				rejected();
			} else {
				// Устанавливаем id добавленному объекту
				$scope.users[$scope.users.length - 1].id = parseInt(response.data.result);
				dataCache.removeAll();
				countCache.removeAll();
				$rootScope.counts.users++;
				var successMessage = "Пользователь <strong>\"" + $scope.newUser.login + "\"</strong> успешно зарегистрирован.";
				showSuccessMessage.show(successMessage);
			}
		}
		
		function rejected() {
			var errorMessage = "Ошибка! Пользователь <strong>\"" + $scope.newUser.login + "\"</strong> не зарегистрирован.";
			showErrorMessage.show(errorMessage);
		}
	}
	
	$scope.del = function(id) {
		if (!confirm("Вы дейстивтельно хотите удалить этого пользователя?")) return;
		var currentId = searchObj.searchId($scope.users, id);
		$scope.buttonDisable = true;
		
		var promise = $http.get("deleteData.php?id=" + id + "&type=users");
		promise.then(fulfilled, rejected);
		
		function fulfilled(response) {
			if (response.data.result != "200 OK") {
				console.log(response.data);
				rejected();
			} else {
				$scope.buttonDisable = false;
				var successMessage = "Пользователь <strong>\"" + $scope.users[currentId].login + "\"</strong> успешно удален.";
				$scope.users.splice(currentId, 1);
				dataCache.removeAll();
				countCache.removeAll();
				$rootScope.counts.users--;
				$scope.$broadcast("changeCount", {
					key: "users",
					val: $rootScope.counts.users
				});
				showSuccessMessage.show(successMessage);
			}
		}
		
		function rejected() {
			$scope.buttonDisable = false;
			var errorMessage = "Ошибка! Пользователь <strong>\"" + $scope.users[currentId].login + "\"</strong> не удален.";
			showErrorMessage.show(errorMessage);
		}
	}
	
	$scope.goUpdate = function(id) {
		$scope.$emit("changeRoute", {
			route: "users_update",
			id: id,
			notAnotherPage: true
		});
	}
	
	$scope.update = function() {
		$scope.buttonDisable = true;
		// Отправка данных на сервер и помещение в кэш
		var promise = $http.post("updateData.php?type=users", JSON.stringify($scope.users[0]));
		promise.then(fulfilled, rejected);
		
		function fulfilled(response) {
			if (response.data.result != "200 OK") {
				console.log(response.data);
				rejected();
			} else {
				$scope.buttonDisable = false;
				dataCache.removeAll();
				var successMessage = "Пользователь <strong>\"" + $scope.users[0].login + "\"</strong> успешно обновлен.";
				showSuccessMessage.show(successMessage);
			}
		}
		
		function rejected() {
			$scope.buttonDisable = false;
			var errorMessage = "Ошибка! Пользователь <strong>\"" + $scope.users[0].login + "\"</strong> не обновлен.";
			showErrorMessage.show(errorMessage);
		}
	}
});

adminApp.controller("userGroupCtrl", function($scope, $http, $cacheFactory) {	
	$http.get("getData.php?type=usergroups", {cache: true}).success(function(response) {
		$scope.groups = response;
	});
});

adminApp.controller("categoryCtrl", function($scope, $rootScope, $http, $cacheFactory, showSuccessMessage, showErrorMessage, searchObj, changeSortService) {
	
	var countCache = $cacheFactory.get("counts");
	var dataCache = $cacheFactory.get("categories");
	
	$http.get("getCount.php?type=categories", {cache: countCache}).success(function(response) {
		$scope.$emit("changeCount", {
			key: "categories",
 			val: response
		});
		$scope.$broadcast("changeCount", {
			val: response
		});
    });
	
	// Если страница data, то достать все категории
	var params = '';
	if ($rootScope.selectedPage != 'data') {
		var params = ($rootScope.currentId != undefined) ? "id=" + $rootScope.currentId + "" : "from=0&to=5";
	}
	$http.get("getData.php?type=categories&" + params, {cache: dataCache}).success(function(response) {
		$scope.categories = response;
	});
	
	$scope.$on("changeLimit", function(event, args) {
		$http.get("getData.php?type=categories&from=0&to=" + $scope.limit + "", {cache: dataCache}).success(function(response) {
			$scope.categories = response;
		});
	});
	
	$scope.$on("changePage", function(event, args) {
 		var from = $scope.limit * (args.page - 1);
 		var count = parseInt($scope.limit);
		$http.get("getData.php?type=categories&from=" + from + "&to=" + count + "", {cache: dataCache}).success(function(response) {
			$scope.categories = response;
		});
 	});
	
	// Удостоверимся что мы не наследуемся от контроллера data
	if ($scope.data == undefined) {
		$scope.sorts = [{ code: "title", name: "Название" }, { code: "meta_d", name: "Описание" }, { code: "meta_k", name: "Ключевые слова" }];
		
		changeSortService.setSortClasses($scope.sorts);
		$scope.sortClass = changeSortService.sortClass;
			
		$scope.changeSort = function(propNum) {
			changeSortService.changeSort(propNum);
			$scope.sortProp = changeSortService.sortProp;
		}
	}
		
	$scope.newCategory = {};
	$scope.buttonDisable = false;
	
	$scope.goAdd = function() {
		$scope.$emit("changeRoute", {
			route: "categories_add",
			notAnotherPage: true
		});
	}
	
	$scope.add = function() {
		$scope.categories.push($scope.newCategory);
		$scope.buttonDisable = true;
		
		// Отправляем данные на сервер
		var promise = $http.post("putData.php?type=categories", JSON.stringify($scope.newCategory));
		promise.then(fulfilled, rejected);
		
		function fulfilled(response) {
			// Ожидаем от сервера возврат идентификатора нового объекта
			if (isNaN(response.data.result)) {
				console.log(response.data);
				rejected();
			} else {
				// Устанавливаем id добавленному объекту
				$scope.categories[$scope.categories.length - 1].id = parseInt(response.data.result);
				dataCache.removeAll();
				countCache.removeAll();
				$rootScope.counts.categories++;
				var successMessage = "Категория <strong>\"" + $scope.newCategory.title + "\"</strong> успешно добавлена.";
				showSuccessMessage.show(successMessage);
			}
		}
		
		function rejected() {
			var errorMessage = "Ошибка! Категория <strong>\"" + $scope.newCategory.title + "\"</strong> не добавлена.";
			showErrorMessage.show(errorMessage);
		}
	}
	
	$scope.del = function(id) {
		if (!confirm("Вы дейстивтельно хотите удалить эту категорию?")) return;
		var currentId = searchObj.searchId($scope.categories, id);
		$scope.buttonDisable = true;
		
		var promise = $http.get("deleteData.php?id=" + id + "&type=categories");
		promise.then(fulfilled, rejected);
		
		function fulfilled(response) {
			if (response.data.result != "200 OK") {
				console.log(response.data);
				rejected();
			} else {
				$scope.buttonDisable = false;
				var successMessage = "Категория <strong>\"" + $scope.categories[currentId].title + "\"</strong> успешно удалена.";
				$scope.categories.splice(currentId, 1);
				dataCache.removeAll();
				countCache.removeAll();
				$rootScope.counts.categories--;
				$scope.$broadcast("changeCount", {
					key: "categories",
					val: $rootScope.counts.categories
				});
				showSuccessMessage.show(successMessage);
			}
		}
		
		function rejected() {
			$scope.buttonDisable = false;
			var errorMessage = "Ошибка! Категория <strong>\"" + $scope.categories[currentId].title + "\"</strong> не удалена.";
			showErrorMessage.show(errorMessage);
		}
	}
	
	$scope.goUpdate = function(id) {
		$scope.$emit("changeRoute", {
			route: "categories_update",
			id: id,
			notAnotherPage: true
		});
	}
	
	$scope.update = function() {
		$scope.buttonDisable = true;
		// Отправка данных на сервер и помещение в кэш
		var promise = $http.post("updateData.php?type=categories", JSON.stringify($scope.categories[0]));
		promise.then(fulfilled, rejected);
		
		function fulfilled(response) {
			if (response.data.result != "200 OK") {
				console.log(response.data);
				rejected();
			} else {
				$scope.buttonDisable = false;
				dataCache.removeAll();
				var successMessage = "Категория <strong>\"" + $scope.categories[0].title + "\"</strong> успешно обновлена.";
				showSuccessMessage.show(successMessage);
			}
		}
		
		function rejected() {
			$scope.buttonDisable = false;
			var errorMessage = "Ошибка! Категория <strong>\"" + $scope.categories[0].title + "\"</strong> не обновлена.";
			showErrorMessage.show(errorMessage);
		}
	}
});

adminApp.controller("dataCtrl", function($scope, $rootScope, $http, $cacheFactory, showSuccessMessage, showErrorMessage, searchObj, changeSortService) {
	
	var countCache = $cacheFactory.get("counts");
	var dataCache = $cacheFactory.get("data");
	
	$http.get("getCount.php?type=data", {cache: countCache}).success(function(response) {
		$scope.$emit("changeCount", {
			key: "data",
			val: response
		});
		$scope.$broadcast("changeCount", {
			val: response
		});
	});
	
	var params = ($rootScope.currentId != undefined) ? "id=" + $rootScope.currentId + "" : "from=0&to=5";
	$http.get("getData.php?type=data&" + params, {cache: dataCache}).success(function(response) {
		$scope.data = response;
		for (var i = 0; i < $scope.data.length; i++) {
			// Перевод типа из строки в необходимый вьюхе
			$scope.data[i].date = new Date($scope.data[i].date);
			$scope.data[i].cat = +$scope.data[i].cat;
			$scope.data[i].author = +$scope.data[i].author;
		}
	});
		
	$scope.$on("changeLimit", function(event, args) {
		$http.get("getData.php?type=data&from=0&to=" + $scope.limit + "", {cache: dataCache}).success(function(response) {
			$scope.data = response;
		});
	});
	
	$scope.$on("changePage", function(event, args) {
 		var from = $scope.limit * (args.page - 1);
 		var count = parseInt($scope.limit);
		$http.get("getData.php?type=data&from=" + from + "&to=" + count + "", {cache: dataCache}).success(function(response) {
			$scope.data = response;
		});
 	});
	
	$scope.sorts = [{ code: "title", name: "Название" },  { code: "cat", name: "Категория" }, { code: "meta_d", name: "Описание" }];
	
	changeSortService.setSortClasses($scope.sorts);
	$scope.sortClass = changeSortService.sortClass;
		
	$scope.changeSort = function(propNum) {
		changeSortService.changeSort(propNum);
		$scope.sortProp = changeSortService.sortProp;
	}
	
	$scope.newDataItem = { view: 0, date: new Date() };
	$scope.buttonDisable = false;
	
	$scope.goAdd = function() {
		$scope.$emit("changeRoute", {
			route: "data_add",
			notAnotherPage: true
		});
	}
	
	$scope.add = function() {
		$scope.data.push($scope.newDataItem);
		$scope.buttonDisable = true;
		
		// Отправляем данные на сервер
		var promise = $http.post("putData.php?type=data", JSON.stringify($scope.newDataItem));
		promise.then(fulfilled, rejected);
		
		function fulfilled(response) {
			// Ожидаем от сервера возврат идентификатора нового объекта
			if (isNaN(response.data.result)) {
				console.log(response.data);
				rejected();
			} else {
				// Устанавливаем id добавленному объекту
				$scope.data[$scope.data.length - 1].id = parseInt(response.data.result);
				dataCache.removeAll();
				countCache.removeAll();
				$rootScope.counts.data++;
				var successMessage = "Заметка <strong>\"" + $scope.newDataItem.title + "\"</strong> успешно добавлена.";
				showSuccessMessage.show(successMessage);
			}
		}
		
		function rejected() {
			var errorMessage = "Ошибка! Заметка <strong>\"" + $scope.newDataItem.title + "\"</strong> не добавлена.";
			showErrorMessage.show(errorMessage);
		}
	}
	
	$scope.del = function(id) {
		if (!confirm("Вы дейстивтельно хотите удалить эту заметку?")) return;
		var currentId = searchObj.searchId($scope.data, id);
		$scope.buttonDisable = true;
		
		var promise = $http.get("deleteData.php?id=" + id + "&type=data");
		promise.then(fulfilled, rejected);
		
		function fulfilled(response) {
			if (response.data.result != "200 OK") {
				console.log(response.data);
				rejected();
			} else {
				$scope.buttonDisable = false;
				var successMessage = "Заметка <strong>\"" + $scope.data[currentId].title + "\"</strong> успешно удалена.";
				$scope.data.splice(currentId, 1);
				dataCache.removeAll();
				countCache.removeAll();
				$rootScope.counts.data--;
				$scope.$broadcast("changeCount", {
					key: "data",
					val: $rootScope.counts.data
				});
				showSuccessMessage.show(successMessage);
			}
		}
		
		function rejected() {
			$scope.buttonDisable = false;
			var errorMessage = "Ошибка! Заметка <strong>\"" + $scope.data[currentId].title + "\"</strong> не удалена.";
			showErrorMessage.show(errorMessage);
		}
	}
	
	$scope.goUpdate = function(id) {
		$scope.$emit("changeRoute", {
			route: "data_update",
			id: id,
			notAnotherPage: true
		});
	}
	
	$scope.update = function() {
		$scope.buttonDisable = true;
		// Отправка данных на сервер и помещение в кэш
		var promise = $http.post("updateData.php?type=data", JSON.stringify($scope.data[0]));
		promise.then(fulfilled, rejected);
		
		function fulfilled(response) {
			if (response.data.result != "200 OK") {
				console.log(response.data);
				rejected();
			} else {
				$scope.buttonDisable = false;
				dataCache.removeAll();
				var successMessage = "Заметка <strong>\"" + $scope.data[0].title + "\"</strong> успешно обновлена.";
				showSuccessMessage.show(successMessage);
			}
		}
		
		function rejected() {
			$scope.buttonDisable = false;
			var errorMessage = "Ошибка! Заметка <strong>\"" + $scope.data[0].title + "\"</strong> не обновлена.";
			showErrorMessage.show(errorMessage);
		}
	}	
});

adminApp.controller("newsCtrl", function($scope, $rootScope, $http, $cacheFactory, showSuccessMessage, showErrorMessage, searchObj, changeSortService) {
	
	var countCache = $cacheFactory.get("counts");
	var dataCache = $cacheFactory.get("news");
	
	$http.get("getCount.php?type=news", {cache: countCache}).success(function(response) {
		$scope.$emit("changeCount", {
			key: "news",
			val: response
		});
		$scope.$broadcast("changeCount", {
			val: response
		});
	});
	
	var params = ($rootScope.currentId != undefined) ? "id=" + $rootScope.currentId + "" : "from=0&to=5";
	$http.get("getData.php?type=news&" + params, {cache: dataCache}).success(function(response) {
		$scope.news = response;
		for (var i = 0; i < $scope.news.length; i++) {
			// Перевод типа из строки в необходимый вьюхе
			$scope.news[i].date = new Date($scope.news[i].date);
			$scope.news[i].type = +$scope.news[i].type;
			$scope.news[i].author = +$scope.news[i].author;
		}
	});
		
	$scope.$on("changeLimit", function(event, args) {
		$http.get("getData.php?type=news&from=0&to=" + $scope.limit + "", {cache: dataCache}).success(function(response) {
			$scope.news = response;
		});
	});
	
	$scope.$on("changePage", function(event, args) {
 		var from = $scope.limit * (args.page - 1);
 		var count = parseInt($scope.limit);
		$http.get("getData.php?type=news&from=" + from + "&to=" + count + "", {cache: dataCache}).success(function(response) {
			$scope.news = response;
		});
 	});
	
	$scope.sorts = [{ code: "title", name: "Название" },  { code: "date", name: "Дата" }, { code: "type", name: "Тип" }];
	
	changeSortService.setSortClasses($scope.sorts);
	$scope.sortClass = changeSortService.sortClass;
		
	$scope.changeSort = function(propNum) {
		changeSortService.changeSort(propNum);
		$scope.sortProp = changeSortService.sortProp;
	}
	
	// Типы новостей
	$scope.types = { 1: "Новость", 2: "Новость / Блог", 3: "Блог"};
	
	$scope.newNewsItem = { view: 0, date: new Date() };
	$scope.buttonDisable = false;
	
	$scope.goAdd = function() {
		$scope.$emit("changeRoute", {
			route: "news_add",
			notAnotherPage: true
		});
	}
	
	$scope.add = function() {
		$scope.news.push($scope.newNewsItem);
		$scope.buttonDisable = true;
		
		// Отправляем данные на сервер
		var promise = $http.post("putData.php?type=news", JSON.stringify($scope.newNewsItem));
		promise.then(fulfilled, rejected);
		
		function fulfilled(response) {
			// Ожидаем от сервера возврат идентификатора нового объекта
			if (isNaN(response.data.result)) {
				console.log(response.data);
				rejected();
			} else {
				// Устанавливаем id добавленному объекту
				$scope.news[$scope.news.length - 1].id = parseInt(response.data.result);
				dataCache.removeAll();
				countCache.removeAll();
				$rootScope.counts.news++;
				var successMessage = "Новость <strong>\"" + $scope.newNewsItem.title + "\"</strong> успешно добавлена.";
				showSuccessMessage.show(successMessage);
			}
		}
		
		function rejected() {
			var errorMessage = "Ошибка! Новость <strong>\"" + $scope.newNewsItem.title + "\"</strong> не добавлена.";
			showErrorMessage.show(errorMessage);
		}
	}
	
	$scope.del = function(id) {
		if (!confirm("Вы дейстивтельно хотите удалить эту новость?")) return;
		var currentId = searchObj.searchId($scope.news, id);
		$scope.buttonDisable = true;
		
		var promise = $http.get("deleteData.php?id=" + id + "&type=news");
		promise.then(fulfilled, rejected);
		
		function fulfilled(response) {
			if (response.data.result != "200 OK") {
				console.log(response.data);
				rejected();
			} else {
				$scope.buttonDisable = false;
				var successMessage = "Новость <strong>\"" + $scope.news[currentId].title + "\"</strong> успешно удалена.";
				$scope.news.splice(currentId, 1);
				dataCache.removeAll();
				countCache.removeAll();
				$rootScope.counts.data--;
				$scope.$broadcast("changeCount", {
					key: "news",
					val: $rootScope.counts.news
				});
				showSuccessMessage.show(successMessage);
			}
		}
		
		function rejected() {
			$scope.buttonDisable = false;
			var errorMessage = "Ошибка! Новость <strong>\"" + $scope.news[currentId].title + "\"</strong> не удалена.";
			showErrorMessage.show(errorMessage);
		}
	}
		
	$scope.goUpdate = function(id) {
		$scope.$emit("changeRoute", {
			route: "news_update",
			id: id,
			notAnotherPage: true
		});
	}
	
	$scope.update = function() {
		$scope.buttonDisable = true;
		// Отправка данных на сервер и помещение в кэш
		var promise = $http.post("updateData.php?type=news", JSON.stringify($scope.news[0]));
		promise.then(fulfilled, rejected);
		
		function fulfilled(response) {
			if (response.data.result != "200 OK") {
				console.log(response.data);
				rejected();
			} else {
				$scope.buttonDisable = false;
				dataCache.removeAll();
				var successMessage = "Новость <strong>\"" + $scope.news[0].title + "\"</strong> успешно обновлена.";
				showSuccessMessage.show(successMessage);
			}
		}
		
		function rejected() {
			$scope.buttonDisable = false;
			var errorMessage = "Ошибка! Новость <strong>\"" + $scope.news[0].title + "\"</strong> не обновлена.";
			showErrorMessage.show(errorMessage);
		}
	}	
});

adminApp.controller("sostavCtrl", function($scope, $rootScope, $http, $cacheFactory, showSuccessMessage, showErrorMessage, searchObj, changeSortService) {
	
	var countCache = $cacheFactory.get("counts");
	var dataCache = $cacheFactory.get("data");
	
	$http.get("getCount.php?type=sostav", {cache: countCache}).success(function(response) {
		$scope.$emit("changeCount", {
			key: "players",
			val: response
		});
		$scope.$broadcast("changeCount", {
			val: response
		});
	});
	
	var params = ($rootScope.currentId != undefined) ? "id=" + $rootScope.currentId + "" : "from=0&to=5";
	$http.get("getData.php?type=sostav&" + params, {cache: dataCache}).success(function(response) {
		$scope.players = response;
		for (var i = 0; i < $scope.players.length; i++) {
			// Преобразуем строковые значения в числовые
			$scope.players[i].scores = +$scope.players[i].scores;
			$scope.players[i].rang = +$scope.players[i].rang;
		}
	});
		
	$scope.$on("changeLimit", function(event, args) {
		$http.get("getData.php?type=sostav&from=0&to=" + $scope.limit + "", {cache: dataCache}).success(function(response) {
			$scope.players = response;
		});
	});
	
	$scope.$on("changePage", function(event, args) {
 		var from = $scope.limit * (args.page - 1);
 		var count = parseInt($scope.limit);
		$http.get("getData.php?type=sostav&from=" + from + "&to=" + count + "", {cache: dataCache}).success(function(response) {
			$scope.players = response;
		});
 	});
	
	$scope.sorts = [{ code: "name", name: "Имя" },  { code: "scores", name: "Очки" }, { code: "rang", name: "Ранг" }];
	
	changeSortService.setSortClasses($scope.sorts);
	$scope.sortClass = changeSortService.sortClass;
		
	$scope.changeSort = function(propNum) {
		changeSortService.changeSort(propNum);
		$scope.sortProp = changeSortService.sortProp;
	}
	
	$scope.buttonDisable = false;
	
	$scope.newPlayer = { scores: 0, rang: 1, dol: 8 };
	
	$scope.goAdd = function() {
		$scope.$emit("changeRoute", {
			route: "sostav_add",
			notAnotherPage: true
		});
	}
	
	$scope.add = function() {
		$scope.players.push($scope.newPlayer);
		$scope.buttonDisable = true;
		
		// Отправляем данные на сервер
		var promise = $http.post("putData.php?type=sostav", JSON.stringify($scope.newPlayer));
		promise.then(fulfilled, rejected);
		
		function fulfilled(response) {
			// Ожидаем от сервера возврат идентификатора нового объекта
			if (isNaN(response.data.result)) {
				console.log(response.data);
				rejected();
			} else {
				// Устанавливаем id добавленному объекту
				$scope.players[$scope.players.length - 1].id = parseInt(response.data.result);
				dataCache.removeAll();
				countCache.removeAll();
				$rootScope.counts.players++;
				var successMessage = "Игрок <strong>\"" + $scope.newPlayer.name + "\"</strong> успешно добавлен.";
				showSuccessMessage.show(successMessage);
			}
		}
		
		function rejected() {
			var errorMessage = "Ошибка! Игрок <strong>\"" + $scope.newPlayer.name + "\"</strong> не добавлен.";
			showErrorMessage.show(errorMessage);
		}
	}
	
	$scope.del = function(id) {
		if (!confirm("Вы дейстивтельно хотите удалить этого игрока?")) return;
		var currentId = searchObj.searchId($scope.players, id);
		$scope.buttonDisable = true;
		
		var promise = $http.get("deleteData.php?id=" + id + "&type=sostav");
		promise.then(fulfilled, rejected);
		
		function fulfilled(response) {
			if (response.data.result != "200 OK") {
				console.log(response.data);
				rejected();
			} else {
				$scope.buttonDisable = false;
				var successMessage = "Игрок <strong>\"" + $scope.players[currentId].name + "\"</strong> успешно удален.";
				$scope.players.splice(currentId, 1);
				dataCache.removeAll();
				countCache.removeAll();
				$rootScope.counts.players--;
				$scope.$broadcast("changeCount", {
					key: "players",
					val: $rootScope.counts.players
				});
				showSuccessMessage.show(successMessage);
			}
		}
		
		function rejected() {
			$scope.buttonDisable = false;
			var errorMessage = "Ошибка! Игрок <strong>\"" + $scope.players[currentId].name + "\"</strong> не удален.";
			showErrorMessage.show(errorMessage);
		}
	}
	
	$scope.goUpdate = function(id) {
		$scope.$emit("changeRoute", {
			route: "sostav_update",
			id: id,
			notAnotherPage: true
		});
	}
	
	$scope.update = function() {
		$scope.buttonDisable = true;
		// Отправка данных на сервер и помещение в кэш
		var promise = $http.post("updateData.php?type=sostav", JSON.stringify($scope.players[0]));
		promise.then(fulfilled, rejected);
		
		function fulfilled(response) {
			if (response.data.result != "200 OK") {
				console.log(response.data);
				rejected();
			} else {
				$scope.buttonDisable = false;
				dataCache.removeAll();
				var successMessage = "Данные игрока <strong>\"" + $scope.players[0].name + "\"</strong> успешно обновлены.";
				showSuccessMessage.show(successMessage);
			}
		}
		
		function rejected() {
			$scope.buttonDisable = false;
			var errorMessage = "Ошибка! Данные игрока <strong>\"" + $scope.players[0].name + "\"</strong> не обновлены.";
			showErrorMessage.show(errorMessage);
		}
	}
});

adminApp.controller("rangCtrl", function($http, $scope, searchObj) {
	
	$http.get("getData.php?type=rangs", {cache: true}).success(function(response) {
		$scope.rangs = response;
		// Удаляем последний(системный) ранг
		delete $scope.rangs[$scope.rangs.length - 1];
		$scope.rangs.length--;
		for (var i = 0; i < $scope.rangs.length; i++) {
			// Преобразуем строковые значения в числовые
			$scope.rangs[i].id = +$scope.rangs[i].id;
			$scope.rangs[i].minScores = parseFloat($scope.rangs[i].minScores);
			$scope.rangs[i].maxScores = parseFloat($scope.rangs[i].maxScores);
		}
	});
	
	// Меняем очки при изменении ранга
	$scope.changeScores = function(rangId) {
		var rang = searchObj.searchId($scope.rangs, rangId);
		if ($scope.players[0]) {
			$scope.players[0].scores = $scope.rangs[rang].minScores;
		} else {
			$scope.newPlayer.scores = $scope.rangs[rang].minScores;
		}
	}
	
	// Меняем ранг при изменении очков
	$scope.changeRang = function(newScores) {
		for (var i = 0; i < $scope.rangs.length; i++) {
			if (newScores >= $scope.rangs[i].minScores && newScores <= $scope.rangs[i].maxScores) {
				if ($scope.players[0]) {
					$scope.players[0].rang = $scope.rangs[i].id;
				} else {
					$scope.newPlayer.rang = $scope.rangs[i].id;
				}
			}
		}
	}
});

// Контроллер отвечающий за постраничную навигацию
adminApp.controller("paginationCtrl", function($scope, $rootScope) {
	// Читаем данные текущей страницы с хранилища
	$scope.selected = window.sessionStorage.getItem("nav");
	
	// Ставим под наблюдение значение количества выводимых данных
	$scope.$watch("limit", function(newLimit, oldLimit) {
		if ($scope.selectedPage != "main" && newLimit != oldLimit) {
			// При его изменении вычисляем количество страниц
			$scope.count = Math.ceil($rootScope.counts[$scope.selectedPage] / newLimit);
			$scope.selected = 1;
			window.sessionStorage.nav = 1;
			
			$scope.$emit("changeLimit");
			
			// Если страница одна блокируем кнопку след. страницы
			if ($scope.count == 1) {
				$scope.prevDis = "disabled";
				$scope.nextDis = "disabled";
			}
			if ($scope.count > 1) {
				$scope.nextDis = '';
			}
		}
	});
	
	// Ловим событие изменения количествва данных
	$scope.$on("changeCount", function(event, args) {
		// Пересчитываем количество страниц
		$scope.count = Math.ceil(args.val / $scope.limit);
		// Если страница одна блокируем кнопку след. страницы
		if ($scope.count == 1) {
			$scope.prevDis = "disabled";
			$scope.nextDis = "disabled";
		}
	});
	
	// Если мы были на последней странице, а их количество изменилось, переставляем ее на 1 меньше
	$scope.$watch("count", function(newCount) {
		if ($scope.selected > newCount) {
			$scope.selected--;
			window.sessionStorage.nav--;
		}
	});
	
	// Метод изменения текущей страницы
	$scope.changePage = function(index) {
		$scope.selected = index;
		window.sessionStorage.nav = index;
	}
	
	// В зависимости от текущей страницы отпределяем классы конопок предыдущей и следующей страниц
	$scope.$watch("selected", function(newPage) {
		$scope.prevDis = newPage == 1 ? 'disabled' : '';
		$scope.nextDis = $scope.selected == $scope.count ? 'disabled' : '';
		// Отправляем событие переключения страницы. Будет использовано для фильтрации данных
		$scope.$emit("changePage", {
			page: newPage
		});
	});
	
	// Метод переходна на следующую страницу
	$scope.nextPage = function() {
		if ($scope.selected !=  $scope.count) {
			window.sessionStorage.nav++;
			$scope.selected++;
		}
	}
	
	// Метод переходна на предыдущую страницу
	$scope.prevPage = function() {
		if ($scope.selected != 1) {
			window.sessionStorage.nav--;
			$scope.selected--;
		}
	}
	
	// Метод перехода на первую страницу
	$scope.toFirst = function() {
		$scope.selected = 1;
	}
	
	// Метод перехода на последнюю страницу
	$scope.toLast = function() {
		$scope.selected = $scope.count;
	}
});