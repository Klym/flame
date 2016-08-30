// Директива определения категории материалов
adminApp.directive("defineCat", function(searchObj, $http, $cacheFactory) {
	return function (scope, element) {
		$http.get("getData.php?type=categories", {cache: $cacheFactory.get("categories")}).success(function(response) {
			scope.categories = response;
			var cat = searchObj.searchId(response, scope.dataItem.cat);
			element.append(document.createTextNode(response[cat].title));
		});
	}
});