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