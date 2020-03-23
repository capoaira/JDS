if (document.location.pathname.match(/konfigurator/)) {
	console.log('config')
	'use strict';
	var mouseX;
	var mouseY;
	var anzahlRahmen = 0;
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
		// Mousedown für PC, touchstart für Smartphones
		$('#rahmenNr' + anzahlRahmen).mousedown(function() {
			$('#menue').css('visibility', 'hidden');
			toDragElem = this;
			stopCount = false;
			count();
		});
		$('#rahmenNr' + anzahlRahmen).on('touchstart', function() {
			console.log('touchstart');
			$('#menue').css('visibility', 'hidden');
			toDragElem = this;
			stopCount = false;
			count();
		});
		$('#rahmenNr' + anzahlRahmen).mouseup(function() {
			toDragElem = null;
			stopCount = true;
			$('#menue').css('visibility', 'visible');
			if (countdown < 2) {
				if ($('#menue').css('display') == 'none' || currentObj !== this) {
					buildMenu(this);
				} else {
					$('#menue').css('display', 'none');
					$('#menue').css('visibility', 'hidden');
					currentObj = null;
				}
			} else {
				buildMenu(this);
			}
		});
		$('#rahmenNr' + anzahlRahmen).on('touchend', function() {
			toDragElem = null;
			stopCount = true;
			$('#menue').css('visibility', 'visible');
			if (countdown < 2) {
				if ($('#menue').css('display') == 'none' || currentObj !== this) {
					buildMenu(this);
				} else {
					$('#menue').css('display', 'none');
					$('#menue').css('visibility', 'hidden');
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

	function getCoords(e) {
		mouseX = e.clientX;
		mouseY = e.clientY;
	}

	function drag(obj) {
		$(obj).css('left', (mouseX - $(obj).width()/2) + 'px');
		$(obj).css('top', (mouseY - $(obj).height()/2) + 'px');
	}

	function buildMenu(obj) {
		$('#menue').css('display', 'block');
		currentObj = obj;
		$('#width option').removeAttr('selected');
		$('#height option').removeAttr('selected');
		$('#color option').removeAttr('selected');
		$('#lightColor option').removeAttr('selected');

		$('#width option[value*="' + $(currentObj).css('width') + '"]').attr('selected', 'selected');
		$('#height option[value*="' + $(currentObj).css('height') + '"]').attr('selected', 'selected');
		$('#color option[value*="' + $(currentObj).css('border-color') + '"]').attr('selected', 'selected');
		$('#lightColor option[value*="' + $(currentObj).attr('data-lightColor') + '"]').attr('selected', 'selected');
	}

	function deleteRahmen() {
		$(currentObj).remove();
		$('#menue').css('display', 'none');
		$('#menue').css('visibility', 'hidden');
	}

	function clearAll() {
		for (let i=1; i<=anzahlRahmen; i++) {
			if ($('#rahmenNr' + i)[0]) $('#rahmenNr' + i).remove();
		}
		anzahlRahmen = 0;
		$('#menue').css('display', 'none');
		$('#menue').css('visibility', 'hidden');
	}

	$(document).ready(function() {
		$('#vorschau').mousemove(getCoords);
		$('#vorschau').on('touchmove', getCoords);
		$('#vorschau').mousemove(function() {
			if (toDragElem !== null) {
				drag(toDragElem);
			}
		});
		$('#vorschau').on('touchmove', function() {
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
}
