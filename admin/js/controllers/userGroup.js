adminApp.controller("userGroupCtrl", function($scope, $http, $cacheFactory) {	
	$http.get("getData.php?type=usergroups", {cache: true}).success(function(response) {
		$scope.groups = response;
	});
});