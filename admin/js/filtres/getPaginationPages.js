// Фильтр получающий массив выводимых страниц в постраничной навигации
adminApp.filter("getPaginationPages", function() {
	return function (items, params) {
		if (angular.isNumber(items) && angular.isObject(params)) {
			// Узнаем по сколько номеров выводить на странице
			var count;
			if (items < 105) {
				count = 10;
			} else if (items < 1000) {
				count = 9;
			} else {
				count = 7;
			}
			// Создаем массив который будет фильтровать
			var temp = new Array(items);
			for (var i = 0; i < temp.length; i++) {
				temp[i] = i;
			}
			// Высчитываем с которой страницы нужно начинать выводить номера
			var from = (params.selected <= count / 2) ? 0 : params.selected - count / 2;
			if (params.selected + count / 2 >= temp.length) {
				from -= params.selected + count / 2 - temp.length;
				from = (from < 0) ? 0 : from;
			}
			// Обрезаем нужную нам часть массива
			return temp.splice(from, count);
		} else {
			return items;
		}
	}
});