var showT,hideT; // Таймауты функций
// Анимационные функции появления и исчезания элементов
function show(element,maxHeight,delay,step) {
	var height = element.offsetHeight;
	if (height < maxHeight) {
		element.style.height = height + step + "px";
		window.clearTimeout(hideT);
		showT = setTimeout(function() {
			show(element,maxHeight,delay,step);
		},delay);
	}
}

function hide(element,delay,step) {
	var height = element.offsetHeight;
	if (height > 0) {
		element.style.height = height - step + "px";
		window.clearTimeout(showT);
		hideT = setTimeout(function() {
			hide(element,delay,step);
		},delay);
	}
}

function fadeIn(element,delay,step) {
	var opacity = parseFloat(element.style.opacity);
	if (opacity < 1) {
		element.style.opacity = opacity + step;
		setTimeout(function() {
			fadeIn(element,delay,step);
		},delay);
	}
}

function fadeOut(element,delay,step) {
	var opacity = parseFloat(element.style.opacity);
	if (opacity > step) {
		element.style.opacity = opacity - step;
		setTimeout(function() {
			fadeOut(element,delay,step);
		},delay);
	} else {
		element.style.display = "none";
	}
}