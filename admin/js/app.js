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