// Директива определения группы пользователя
adminApp.directive("defineUserGroup", function(searchObj, $http, $cacheFactory) {
	return function(scope, element) {
		$http.get("getData.php?type=usergroups", {cache: true}).success(function(response) {
			scope.groups = response;	
			var ugid = searchObj.searchId(scope.groups, scope.user.access);
			element.append(document.createTextNode(scope.groups[ugid].title));
		});
	}
});