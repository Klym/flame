// Сервис определения типа и порядка сортировки
adminApp.service("changeSortService", function() {
	var s;
	this.sortClass;
	
	this.setSortClasses = function(sorts) {
		this.sortProp = window.sessionStorage.getItem("sort");
		this.sortClass = new Array(sorts.length);
		s = sorts;
		for (var i = 0; i < this.sortClass.length; i++) {
			if (this.sortProp.substr(1) == sorts[i].code) {
				this.sortClass[i] = (this.sortProp[0] == '+') ? "sort" : "sort_back"
			} else {
				this.sortClass[i] = "no_sort";
			}
		}
	}
	
	this.changeSort = function(propNum) {
		for (var i = 0; i < this.sortClass.length; i++) {
			this.sortClass[i] = "no_sort";
		}
		if (this.sortProp[0] == '+' && this.sortProp.substr(1) == s[propNum].code) {
			this.sortProp = '-' + s[propNum].code;
			this.sortClass[propNum] = "sort_back"
			window.sessionStorage["sort"] = this.sortProp;
		} else {
			this.sortProp = '+' + s[propNum].code;
			this.sortClass[propNum] = "sort"
			window.sessionStorage["sort"] = this.sortProp;
		}
	}
});