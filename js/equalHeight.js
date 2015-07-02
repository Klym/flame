/**
 * ----------------------------------------------
 * Flame Web-site (PHP/MySQL)
 * Copyright (c) Maksim <<Klym>> Klimenko
 * URL: http://clan-flame.ru
 * ----------------------------------------------
 */

function setEqualHeight(columns) {
	var tallestColumn = 0;
	for(var i = 0; i < columns.length; i++) {
		var height = columns[i].offsetHeight;
		if(height > tallestColumn) {
			tallestColumn = height;
		}
	}
	for(var i = 0; i < columns.length; i++) {
		columns[i].style.height = tallestColumn + 'px';
	}
}