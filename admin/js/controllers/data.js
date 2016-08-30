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