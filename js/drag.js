'use strict';
var mouseX;
var mouseY;
var toDragElem = null;
var countdown = 0;
var stopCount = true;
var currentObj = null;

function addRahmen(height, width, color, lightColor) {
	anzahlRahmen++;
	var html = '<div id="rahmenNr' + anzahlRahmen + '" '
			 + 'class="rahmen" style="'
			 + 'height:' + height + 'px; '
			 + 'width:' + width + 'px;" '
			 + 'border-color="' + color + '" '
			 + 'data-lightColor="' + lightColor + '"></div>';
	$('#vorschau').append(html);
	$('#rahmenNr' + anzahlRahmen).css('left', $('#vorschau').position().left + $('#vorschau').width()/2);
	$('#rahmenNr' + anzahlRahmen).css('top', $('#vorschau').position().top + $('#vorschau').height()/2);
	$('#rahmenNr' + anzahlRahmen).mousedown(function() {
		$('form').css('visibility', 'hidden');
		toDragElem = this;
		stopCount = false;
		count();
	});
	$('#rahmenNr' + anzahlRahmen).mouseup(function() {
		toDragElem = null;
		stopCount = true;
		$('form').css('visibility', 'visible');
		if (countdown < 2) {
			if ($('form').css('display') == 'none' && currentObj !== this) {
				buildMenu(this);
			} else {
				$('form').css('display', 'none');
				$('form').css('visibility', 'hidden');
				currentObj = null;
			}
		} else {
			buildMenu(this);
		}
	});
}

function count() {
	if (!stopCount) {
		window.setTimeout(function() {
			countdown++;
			count();
		}, 100);
	} else {
		countdown = 0;
	}
}

function drag(obj) {
	$(obj).css('left', (mouseX - $(obj).width()/2) + 'px');
	$(obj).css('top', (mouseY - $(obj).height()/2) + 'px');
}

function getCoords(e) {
	mouseX = e.clientX;
	mouseY = e.clientY;
}

function buildMenu(obj) {
	$('form').css('display', 'block');
	currentObj = obj;
	$('#width option[value="' + $(obj).attr('width') + '"]').attr('selected', 'selected')
	$('#height option[value="' + $(obj).attr('height') + '"]').attr('selected', 'selected')
}

$(document).ready(function() {
	$('#vorschau').mousemove(getCoords);
	$('#vorschau').mousemove(function() {
		if (toDragElem !== null) {
			drag(toDragElem);
		}
	});
	$('#width').change(function() {
		$(currentObj).css('width', $('#width').val());
	});
	$('#height').change(function() {
		$(currentObj).css('height', $('#height').val());
	});
	$('#color').change(function() {
		$(currentObj).css('border-color', $('#color').val());
	});
	$('#lightColor').change(function() {
		$(currentObj).attr('data-lightColor', $('#lightColor').val());
	});
});

function log(msg) {
	console.log(msg);
}
