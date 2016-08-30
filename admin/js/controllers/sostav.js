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