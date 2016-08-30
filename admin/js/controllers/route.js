// routeCtrl отвечает за маршрутизацию
adminApp.controller("routeCtrl", function($scope, $location, $rootScope, $cacheFactory) {
	$rootScope.selectedPage = "main";	// Текущая страница
	$rootScope.currentId;				// Текущий id данных
	
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