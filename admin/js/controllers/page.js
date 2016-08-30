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