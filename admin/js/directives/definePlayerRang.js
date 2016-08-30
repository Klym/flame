// Директива определения ранга игрока
adminApp.directive("definePlayerRang", function($http, searchObj) {
	return function(scope, element) {
		$http.get("getData.php?type=rangs", {cache: true}).success(function(response) {
			var rangid = searchObj.searchId(response, scope.player.rang);
			element.append(document.createTextNode(response[rangid].rangName));
		});
	}
});