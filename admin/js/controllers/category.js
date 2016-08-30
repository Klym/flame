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