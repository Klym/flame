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