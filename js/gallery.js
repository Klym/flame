/**
 * ----------------------------------------------
 * Flame Web-site (PHP/MySQL)
 * Copyright (c) Maksim <<Klym>> Klimenko
 * URL: http://clan-flame.ru
 * ----------------------------------------------
 */
var opacityStep = 0.01;
var filter = 100;
var interval;
var interval2;

function nextImage(img) {
	if (img) {
		if (img.style.opacity >= opacityStep) {
			var opacity = img.style.opacity - opacityStep;
			img.style.opacity = opacity;
			filter = filter - 5;
			img.style.filter = 'alpha(opacity=' + filter + ')';
			setTimeout(function() {
				nextImage(img);
			},10);
		}
		else {
			filter = 100;
			var parent = img.parentNode.getElementsByTagName('IMG');
			if (img == parent[0]) {
				img.style.opacity = 1;
				img.style.filter = 'alpha(opacity=' + 100 + ')';
			}
			else {
				img.style.opacity = 0;
				img.style.filter = 'alpha(opacity=' + 0 + ')';
			}
		}
	}
}

function gallery() {
	var gallery = document.getElementById('gallery');
	var images = gallery.getElementsByTagName('IMG');
	for (var i = 0; i < images.length; i++) {
		images[i].style.opacity = 1;
		images[i].style.filter = 'alpha(opacity=' + 100 + ')';
	}
	var index = images.length;
	interval = setInterval(function() {
		index--;
		if (index <= 0) {
			images[0].style.zIndex = 1;
			for (var i = 0; i < images.length; i++) {
				images[i].style.opacity = 1;
				images[i].style.filter = 'alpha(opacity=' + 100 + ')';
			}
			index = images.length;
			nextImage(images[0]);
			setTimeout(function() {
				images[0].style.zIndex = "";
			},1000);
		}
		nextImage(images[index]);
	},5500);
	window.interval = interval;
}