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