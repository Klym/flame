function avatar() {
	var img = document.getElementById("img");
	var newAvatar = document.getElementById("newAvatar");
	var element = document.getElementById("element");
	if (img.offsetWidth >= 440) {
		img.style.width = 440 + "px";
		document.cropForm.width.value = 440;
	} else {
		document.cropForm.width.value = img.offsetWidth;
	}
	if (img.offsetWidth > img.offsetHeight) {
		document.cropForm.size.value = img.offsetHeight;
	} else {
		newAvatar.style.height = element.offsetHeight/img.offsetWidth*150 + "px";
		document.cropForm.size.value = img.offsetWidth;
	}
	var scriptWrap = document.getElementById("scriptWrap");
	scriptWrap.style.width = img.offsetWidth + "px";
	scriptWrap.style.height = scriptWrap.offsetHeight + "px";
	var imageWidth = element.offsetWidth;
	var imageHeight = element.offsetHeight;
	var x0,y0,moveX,moveY,offsetRight;
	var newBlock = document.createElement("div");
	var topLeftSq = document.createElement("div");
	var topRightSq = document.createElement("div");
	var bottomLeftSq = document.createElement("div");
	var bottomRightSq = document.createElement("div");
	var leftB = document.createElement("div");
	var topB = document.createElement("div");
	var rightB = document.createElement("div");
	var bottomB = document.createElement("div");
	var leftV = document.getElementById("leftV");
	var topV = document.getElementById("topV");
	var rightV = document.getElementById("rightV");
	var bottomV = document.getElementById("bottomV");
	leftB.id = "leftB";
	topB.id = "topB";
	rightB.id = "rightB";
	bottomB.id = "bottomB";
	topLeftSq.id = "topLeftSq";
	topRightSq.id = "topRightSq";
	bottomLeftSq.id = "bottomLeftSq";
	bottomRightSq.id = "bottomRightSq";
	newBlock.id = "newBlock";
	element.parentNode.appendChild(newBlock);
	element.onmousedown = function(event) {
		event = event || window.event;
		while(newBlock.childNodes.length > 0) {
			newBlock.removeChild(newBlock.firstChild);
		}
		leftV.style.display = "none";
		topV.style.display = "none";
		rightV.style.display = "none";
		bottomV.style.display = "none";
		x0 = event.offsetX==undefined?event.layerX:event.offsetX;
		y0 = event.offsetY==undefined?event.layerY:event.offsetY;
		newBlock.style.width = 0;
		newBlock.style.height = 0;
		newBlock.style.left = x0 + "px";
		newBlock.style.top = y0 + "px";
		newBlock.style.display = "none";
		element.onmousemove = function(event) {
			newBlock.style.display = "block";
			leftV.style.display = "block";
			topV.style.display = "block";
			rightV.style.display = "block";
			bottomV.style.display = "block";
			newBlock.appendChild(leftB);
			newBlock.appendChild(topB);
			newBlock.appendChild(rightB);
			newBlock.appendChild(bottomB);
			event = event || window.event;
			moveX = event.offsetX==undefined?event.layerX:event.offsetX;
			moveY = event.offsetY==undefined?event.layerY:event.offsetY;
			var width = moveX - x0;
			if (width < 0)
				newBlock.style.left = moveX + "px";
			else
				newBlock.style.left = x0 + "px";
			if (Math.abs(width) + parseInt(newBlock.style.top) <= imageHeight) {
				newBlock.style.width = Math.abs(width) + "px";
				if (moveX <= x0 && moveY >= y0) {
					if (Math.abs(width) + y0 > imageHeight) {
						newBlock.style.width = imageHeight - y0 + "px";
					}
				}
			} else {
				newBlock.style.width = imageHeight - newBlock.offsetTop + "px";
			}
			if (moveY < y0) {
				if (y0 - Math.abs(width) > 0) {
					if (parseInt(newBlock.style.bottom) + Math.abs(width) > imageHeight) {
						width = imageHeight - parseInt(newBlock.style.bottom);
						if (moveX <= x0) newBlock.style.left = x0 - Math.abs(width) + "px";
					}
					newBlock.style.width = Math.abs(width) + "px";
					newBlock.style.top = y0 - parseInt(newBlock.style.width) + "px";
				} else {
					newBlock.style.top = null;
					newBlock.style.bottom = imageHeight - y0 + "px";
					newBlock.style.width = y0 + "px";
					if (moveX < x0) newBlock.style.left = x0 - y0 + "px";
				}
			} else {
				if (y0 + Math.abs(width) > imageHeight) {
					newBlock.style.width = imageHeight - y0 + "px";
					if (moveX <= x0) newBlock.style.left = x0 - parseInt(newBlock.style.width) + "px";
				}
				else {
					newBlock.style.width = Math.abs(width) + "px";
					if (moveX <= x0) newBlock.style.left = moveX + "px";
				}
				newBlock.style.top = y0 + "px";
			}
			newBlock.style.height = newBlock.style.width;
			changeResultImg();
			return false;
		}
		newBlock.onmousemove = function(event) {
			element.onmouseout = function(event) {
				return false;
			}
			event = event || window.event;
			var moveInX = event.offsetX==undefined?event.layerX:event.offsetX;			
			var blockWidth = this.offsetWidth;
			if (moveX > x0) {
				if (moveInX <= 1)
					this.style.width = parseInt(this.style.width) - 1 + "px";
				else
					this.style.width = moveInX + "px";
			}
			else {
				this.style.left = moveInX + x0 - blockWidth + "px";
				this.style.width = blockWidth - moveInX + "px";				
			}
			if ((moveX < x0 && moveY < y0) || (moveY < y0 && moveX > x0)) this.style.top = this.offsetTop +  blockWidth - parseInt(this.style.width) + "px";
			this.style.height = this.style.width;
			changeResultImg();
			return false;
		}
		return false;
	}
	document.onmouseup = function(event) {
		newBlock.appendChild(topLeftSq);
		newBlock.appendChild(bottomRightSq);
		newBlock.appendChild(topRightSq);
		newBlock.appendChild(bottomLeftSq);
		element.onmousemove = function() {
			return false;
		}
		newBlock.onmousemove = function() {
			return false;
		}
		topLeftSq.onmousemove = function() {
			return false;
		}
		topRightSq.onmousemove = function() {
			return false;
		}
		bottomLeftSq.onmousemove = function() {
			return false;
		}
		bottomRightSq.onmousemove = function() {
			return false;
		}
	}
	element.onmouseup = function(event) {
		newBlock.appendChild(topLeftSq);
		newBlock.appendChild(bottomRightSq);
		event = event || window.event;
		element.onmousemove = function(event) {
			return false;
		}
	}
	function test() {
		newBlock.style.width = newBlock.style.height;
		if ((x0 + parseInt(newBlock.style.width)) > parseInt(element.style.width)) {
			newBlock.style.width = parseInt(element.style.width) - x0 + "px";
			newBlock.style.height = newBlock.style.width;
		}
		if ((y0 + parseInt(newBlock.style.height)) > parseInt(element.style.height)) {
			newBlock.style.height = parseInt(element.style.height) - y0 + "px";
			newBlock.style.width = newBlock.style.height;
		}
	}
	newBlock.onmousedown = function(event) {
		event = event || window.event;
		var x = event.offsetX==undefined?event.layerX:event.offsetX;
		var y = event.offsetY==undefined?event.layerY:event.offsetY;
		var left,top;
		newBlock.onmousemove = function(event) {
			event = event || window.event;
			var moveX = event.offsetX==undefined?event.layerX:event.offsetX;
			var moveY = event.offsetY==undefined?event.layerY:event.offsetY;
			left = newBlock.offsetLeft + moveX - x;
			top = newBlock.offsetTop + moveY - y;
			var squares = [topLeftSq,topRightSq,bottomLeftSq,bottomRightSq];
			var offsetLeft = parseInt(newBlock.style.left);
			var offsetTop = parseInt(newBlock.style.top);
			for (var i = 0; i < squares.length; i++) {
				if (event.target == squares[i]) {
					switch(i) {
						case 0:
							left = offsetLeft + moveX - 7; top = offsetTop +  moveY -7;
						break;
						case 1:
							left = offsetLeft + moveX; top = offsetTop +moveY - 7;
						break;
						case 2:
							left = offsetLeft + moveX - 7; top = offsetTop + moveY;
						break;
						case 3:
							left = offsetLeft + moveX; top = offsetTop + moveY;
						break;
					}
					checkOut();
					changeResultImg();
					return false;
				}
			}
			if (moveX > 0 && moveY > 0)
				checkOut();
			else {
				if (moveX <= 0) newBlock.style.left = offsetLeft + 1 + "px";
				if (moveY <= 0) newBlock.style.top = offsetTop + 1 + "px";
			}
			changeResultImg();
			return false;
		}
		element.onmousemove = function(event) {
			event = event || window.event;
			var newX = event.offsetX==undefined?event.layerX:event.offsetX;
			var newY = event.offsetY==undefined?event.layerY:event.offsetY;
			left = newX - x;
			top = newY - y;
			checkOut();
			changeResultImg();
			return false;
		}
		function checkOut() {
			if (left + newBlock.offsetWidth < imageWidth) {
				if (left >= 0)
					newBlock.style.left = left + "px";
				else
					newBlock.style.left = 0;
			} else {
				newBlock.style.left = null;
				newBlock.style.right = 0;
			}
			if (top + newBlock.offsetHeight < imageHeight) {
				if (top >= 0)
					newBlock.style.top = top + "px";
				else
					newBlock.style.top = 0;
			} else {
				newBlock.style.top = null;
				newBlock.style.bottom = 0;
			}
		}
		return false;
	}
	topLeftSq.onmousedown = function(event) {
		event = event || window.event;
		event.cancelBubble = true;
		var moveInSqX;
		offsetRight = imageWidth - (newBlock.offsetLeft + newBlock.offsetWidth);
		var offsetBottom = imageHeight - (newBlock.offsetTop + newBlock.offsetWidth);
		newBlock.style.top = null;
		newBlock.style.left = null;
		newBlock.style.right = offsetRight + "px";
		newBlock.style.bottom = offsetBottom + "px";
		topLeftSq.onmousemove = function(event) {
			event = event || window.event;
			event.cancelBubble = true;
			moveInSqX = event.offsetX==undefined?event.layerX:event.offsetX;
			width = parseInt(newBlock.style.width) - moveInSqX + 4;
			checkOutSq();
			changeResultImg();
			return false;
		}
		newBlock.onmousemove = function(event) {
			event = event || window.event;
			event.cancelBubble = true;
			var newX = event.offsetX==undefined?event.layerX:event.offsetX;
			if (event.target == bottomLeftSq) return false;
			newBlock.style.width = parseInt(newBlock.style.width) - newX + "px";
			newBlock.style.height = newBlock.style.width;
			changeResultImg();
			return false;
		}
		element.onmousemove = changeWidthOffset;
		return false;
	}
	topRightSq.onmousedown = function(event) {
		event = event || window.event;
		event.cancelBubble = true;
		var moveInSqX;
		var offsetBottom = imageHeight - (newBlock.offsetTop + newBlock.offsetWidth);
		newBlock.style.left = newBlock.offsetLeft + "px";
		newBlock.style.bottom = + offsetBottom + "px";
		newBlock.style.top = null;
		newBlock.style.right = null;
		topRightSq.onmousemove = function(event) {
			event = event || window.event;
			event.cancelBubble = true;
			moveInSqX = event.offsetX==undefined?event.layerX:event.offsetX;
			width = parseInt(newBlock.style.width) - 4 + moveInSqX;
			checkOutSq();
			changeResultImg();
			return false;
		}
		newBlock.onmousemove = function(event) {
			event = event || window.event;
			var newX = event.offsetX==undefined?event.layerX:event.offsetX;
			if (event.target == bottomRightSq) return false;
			if (newX <= 1)
				newBlock.style.width = parseInt(newBlock.style.width) - 1 + "px";
			else
				newBlock.style.width = newX + 4 + "px";

			newBlock.style.height = newBlock.style.width;
			changeResultImg();
			return false;
		}
		element.onmousemove = changeWidth;
		return false;
	}
	bottomLeftSq.onmousedown = function(event) {
		event = event || window.event;
		event.cancelBubble = true;
		var moveInSqX;
		offsetRight = imageWidth - (newBlock.offsetLeft + newBlock.offsetWidth);
		newBlock.style.top = newBlock.offsetTop + "px";
		newBlock.style.right = offsetRight + "px";
		newBlock.style.left = null;
		newBlock.style.bottom = null;
		bottomLeftSq.onmousemove = function(event) {
			event = event || window.event;
			event.cancelBubble = true;
			moveInSqX = event.offsetX==undefined?event.layerX:event.offsetX;
			width = parseInt(newBlock.style.width) - moveInSqX + 4;
			checkOutSq();
			changeResultImg();
			return false;
		}
		newBlock.onmousemove = function(event) {
			event = event || window.event;
			var newX = event.offsetX==undefined?event.layerX:event.offsetX;
			if (event.target == topLeftSq) return false;
			newBlock.style.width = parseInt(newBlock.style.width) - newX + "px";
			newBlock.style.height = newBlock.style.width;
			changeResultImg();
			return false;
		}
		element.onmousemove = changeWidthOffset;
		return false;
	}
	bottomRightSq.onmousedown = function(event) {
		event = event || window.event;
		event.cancelBubble = true;
		var moveInSqX;
		newBlock.style.left = newBlock.offsetLeft + "px";
		newBlock.style.top = newBlock.offsetTop + "px";
		newBlock.style.right = null;
		newBlock.style.bottom = null;
		bottomRightSq.onmousemove = function(event) {
			event = event || window.event;
			event.cancelBubble = true;
			moveInSqX = event.offsetX==undefined?event.layerX:event.offsetX;
			width = parseInt(newBlock.style.width) - 4 + moveInSqX;
			checkOutSq();
			changeResultImg();
			return false;
		}
		newBlock.onmousemove = function(event) {
			event = event || window.event;
			var newX = event.offsetX==undefined?event.layerX:event.offsetX;
			if (event.target == topRightSq) return false;
			if (newX <= 1)
				newBlock.style.width = parseInt(newBlock.style.width) - 1 + "px";
			else
				newBlock.style.width = newX + "px";
			newBlock.style.height = newBlock.style.width;
			changeResultImg();
			return false;
		}
		element.onmousemove = changeWidth;
		return false;
	}
	function checkOutSq() {
		if ((width + newBlock.offsetTop <= imageHeight || newBlock.style.bottom) && (width + newBlock.offsetLeft <= imageWidth || newBlock.style.right)) {
			if (!newBlock.style.bottom || (newBlock.style.bottom && parseInt(newBlock.style.bottom) + width <= imageHeight)) {
				if (!newBlock.style.right || (newBlock.style.right && parseInt(newBlock.style.right) + width <= imageWidth)) {
					newBlock.style.width = width + "px";
				}
			} else if (newBlock.style.bottom && parseInt(newBlock.style.bottom) + width > imageHeight) {
				newBlock.style.width = imageHeight - parseInt(newBlock.style.bottom) + "px";
			}
		} else if (width + newBlock.offsetTop > imageHeight) {
			newBlock.style.width = imageHeight - newBlock.offsetTop + "px";
		}
		newBlock.style.height = newBlock.style.width;
	}
	function changeWidth(event) {
		event = event || window.event;
		var newX = event.offsetX==undefined?event.layerX:event.offsetX;
		width = newX - parseInt(newBlock.style.left);
		checkOutSq();
		changeResultImg();
		return false;
	}
	function changeWidthOffset(event) {
		event = event || window.event;
		var newX = event.offsetX==undefined?event.layerX:event.offsetX;
		width = imageWidth - offsetRight - newX;
		checkOutSq();
		changeResultImg();
		return false;
	}
	function changeResultImg() {
		newAvatar.style.height = imageHeight/newBlock.offsetHeight*150 + "px";
		newAvatar.style.marginLeft = -newBlock.offsetLeft*newAvatar.offsetWidth/imageWidth + "px";
		newAvatar.style.marginTop = -newBlock.offsetTop*newAvatar.offsetHeight/imageHeight + "px";
				
		leftV.style.zIndex = 2;
		topV.style.zIndex = 2;
		rightV.style.zIndex = 2;
		bottomV.style.zIndex = 2;
		
		leftV.style.width = newBlock.offsetLeft + "px";
		
		topV.style.width = imageWidth - newBlock.offsetLeft + "px";
		if (newBlock.offsetTop >= 0)
			topV.style.height = newBlock.offsetTop + "px";
		else
			topV.style.height = 0;
		topV.style.left = newBlock.offsetLeft + "px";
		
		if (newBlock.offsetTop >= 0)
			rightV.style.top = newBlock.offsetTop + "px";
		else
			rightV.style.top = 0;
		rightV.style.width = imageWidth - newBlock.offsetLeft - newBlock.offsetWidth + "px";
		rightV.style.height = imageHeight - parseInt(rightV.style.top) + "px";
		
		bottomV.style.left = newBlock.offsetLeft + "px";
		bottomV.style.width = newBlock.offsetWidth + "px";
		bottomV.style.height = imageHeight - newBlock.offsetTop - newBlock.offsetWidth + "px";
		
		// Заносим результаты работы функции в скрытые поля формы
		document.cropForm.x.value = newBlock.offsetLeft;
		document.cropForm.y.value = newBlock.offsetTop;
		document.cropForm.size.value = newBlock.offsetHeight;
	}
}