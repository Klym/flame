// Сервис поиска элемента в массиве данных до id
adminApp.service("searchObj", function() {
	this.searchId = function(arr, id) {
		var currentId = -1;
		for (var i = 0; i < arr.length; i++) {
			if (arr[i].id == id) {
				currentId = i;
				break;
			}
		}
		return currentId;
	}
});