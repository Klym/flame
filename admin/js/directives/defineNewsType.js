// Директива определения типа новости
adminApp.directive("defineNewsType", function() {
	return function(scope, element) {
		var type = scope.types[scope.newsItem.type];
		element.append(document.createTextNode(type));
	}
});