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