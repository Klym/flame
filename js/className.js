if (typeof document.getElementsByClassName != 'function') {
	HTMLDocument.prototype.getElementsByClassName = Element.prototype.getElementsByClassName = function (className) {
    	if( !className ) return [];
		var elements = this.getElementsByTagName('*');
		var list = [];
		var expr = new RegExp( '(^|\\b)' + className + '(\\b|$)' );
		for (var i = 0; i < elements.length; i++)
			if (expr.test(elements[i].className))
            	list.push(elements[i]);
		return list;
	};
}