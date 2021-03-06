if (document.location.pathname.match(/(konfigurator|config\.html)/)) {
	'use strict';
	var mouseX;
	var mouseY;
	var anzahlRahmen = 0;
	var alleRahmen = 0;
	var toDragElem = null;
	var countdown = 0;
	var stopCount = true;
	var currentObj = null;
	var wandBreite, wandHoehe;
	var cmHoehe, cmBreite;		// Gib an, wie viele px ein cm sind
	
	// width, height, color sind in der jetzigen Version nichts sagen, da wir nur ein Produkt mit festen maßen anbieten.
	function addRahmen(width, height, color, move_widht = 0, move_height = 0, turn = false) {
		if (anzahlRahmen >=3) return;
		anzahlRahmen++;
		alleRahmen++;
		var html = '<div id="rahmenNr' + alleRahmen + '" '
				 + 'class="rahmen" style="'
				 + 'height:' + height*cmBreite + 'px; '
				 + 'width:' + width*cmHoehe + 'px;" '
				 + 'border-color="' + color + '"></div>';
		$('#vorschau').append(html);
		$('#rahmenNr' + alleRahmen).css('left', $('#vorschau').position().left + $('#vorschau').width()/2 + move_widht);
		$('#rahmenNr' + alleRahmen).css('top', $('#vorschau').position().top + $('#vorschau').height()/2 + move_height);
		// Mousedown für PC, touchstart für Smartphones
		$('#rahmenNr' + alleRahmen).on('mousedown', FMousedown);
		$('#rahmenNr' + alleRahmen).on('mouseup', FMouseup);
		$('#rahmenNr' + alleRahmen).on('touchstart', FMousedown);
		$('#rahmenNr' + alleRahmen).on('touchend', FMouseup);
		if (turn) turnElem($('#rahmenNr' + alleRahmen));
		
		function FMousedown() {
			$('#menue').css('visibility', 'hidden');
			$(this).addClass('dragging');
			toDragElem = this;
			stopCount = false;
			count();
		}
		function FMouseup() {
			toDragElem = null;
			stopCount = true;
			$(this).removeClass('dragging');
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
		}
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
		$('#color option').removeAttr('selected');

		$('#color option[value*="' + $(currentObj).css('border-color') + '"]').attr('selected', 'selected');
	}

	function deleteRahmen() {
		$(currentObj).remove();
		$('#menue').css('display', 'none');
		$('#menue').css('visibility', 'hidden');
		anzahlRahmen--;
	}
	
	function turnElem(obj) {
		if (!obj) obj = currentObj;
		var breite = $(obj).css('width');
		var hoehe = $(obj).css('height');
		$(obj).css('width', hoehe);
		$(obj).css('height', breite);
	}

	function clearAll() {
		for (let i=1; i<=alleRahmen; i++) {
			if ($('#rahmenNr' + i)[0]) $('#rahmenNr' + i).remove();
		}
		anzahlRahmen = 0;
		alleRahmen = 0;
		$('#menue').css('display', 'none');
		$('#menue').css('visibility', 'hidden');
	}

	$(document).ready(function() {
		$('#files').change(dateiauswahl);
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
		$('#color').change(function() {
			$(currentObj).css('border-color', $('#color').val());
		});
	});
	
	function dateiauswahl(evt) {
		$('.step1 a').removeClass('active');
		$('.step1 a').addClass('inactive');
		var dateien = evt.target.files; // FileList object
		// Auslesen der gespeicherten Dateien durch Schleife
		for (var i = 0, f; f = dateien[i]; i++) {
			// nur Bild-Dateien
			if (!f.type.match('image.*')) {
				continue;
			}
			var reader = new FileReader();
			reader.onload = (function (theFile) {
				return function (e) {
					var img = document.createElement('img');
					img.src = e.target.result;
					img.style.display = 'none';
					$('#vorschau').append(img)
					function isImgLoad(waitcount) {
						if ($(img).height() > 1 && $(img).width() > 1) {
							if ($(img).height() >  $('#vorschau').height()) {
								$(img).css('height', $('#vorschau').height() + 'px');
							}
							if ($(img).width() >  $('#vorschau').width()) {
								$(img).css('width', $('#vorschau').width() + 'px');
							}
							$('#vorschau').css('background-image', 'url(' + e.target.result + ')');
							$('#vorschau').css('min-width', $(img).width() + 'px');
							$('#vorschau').css('width', $(img).width() + 'px');
							$('#vorschau').css('min-height', $(img).height() + 'px');
							$('#vorschau').css('height', $(img).height() + 'px');
							$('#vorschau img').remove();
							$('.step1 a').removeClass('inactive');
							$('.step1 a').addClass('active');
							$('.hinweis').css('display', 'none');
						} else {
							waitcount++;
							if (waitcount <= 10) {
								window.setTimeout(function() {isImgLoad(waitcount);}, 100);
							} else {
								$('#vorschau img').remove();
								alert('Leider ist beim Hochladen etwas schief gegengen, bitte versuche es erneut. Die Seite wird gleich nochmal neu geladen.');
								window.setTimeout(function() {document.location = 'https://capoaira.github.io/JDS/config.html' || 'file:///C:/Users/Jannes/JDS/config.html';}, 2000);
							}
						}
					}
					isImgLoad(0);
				};
			})(f);
			// Bilder als Data URL auslesen.
			reader.readAsDataURL(f);
		}
	}
	function step1save() {
		if ($('.step1 a').hasClass('active')) {
			$('.step1').css('display', 'none');
			$('.step2').css('display', 'unset');
			function shouldBeActive() {
				if ($('#breite').val() >= 150 && $('#hoehe').val() >= 150) {
					$('.step2 a').removeClass('inactive');
					$('.step2 a').addClass('active');
				} else {
					$('.step2 a').removeClass('active');
					$('.step2 a').addClass('inactive');
				}
			}
			$('#breite').change(shouldBeActive);
			$('#hoehe').change(shouldBeActive);
		}
	}
	
	function step2save() {
		if ($('.step2 a').hasClass('active')) {
			wandBreite = $('#breite').val();
			wandHoehe = $('#hoehe').val();
			var isMousedown = false;
			var startX, startY;
			var endX, endY;
			$('.step2').css('display', 'none');
			$('.step3').css('display', 'unset');
			$('.step3 a').click(step3save);
			$('#vorschau').css('cursor', 'crosshair');
			$('#vorschau').on('mousedown', FMousedown);
			$('#vorschau').on('mousemove', FMousemove);
			$('#vorschau').on('mouseup', FMouseup);
			$('#vorschau').on('touchstart', FMousedown);
			$('#vorschau').on('touchmove', FMousemove);
			$('#vorschau').on('touchend', FMouseup);
			
			function FMousedown() {
				isMousedown = true;
				startX = mouseX;
				startY = mouseY;
				$('.step3 a').removeClass('active');
				$('.step3 a').addClass('inactive');
				$('.marker').css('display', 'unset');
				$('.marker').css('width', '0px');
				$('.marker').css('height', '0px');
				$('.marker').css('left', startX);
				$('.marker').css('top', startY);
			}
			
			function FMousemove() {
				if (isMousedown) {
					if (startX > mouseX) {
						$('.marker').css('width', startX - mouseX + 'px');
						$('.marker').css('left',  mouseX + 'px');
					} else {
						$('.marker').css('width', mouseX - startX + 'px');
					}
					if (startY > mouseY) {
						$('.marker').css('height', startY - mouseY + 'px');
						$('.marker').css('top',  mouseY + 'px');
					} else {
						$('.marker').css('height', mouseY - startY + 'px');
					}
				}
			}
			
			function FMouseup() {
				isMousedown = false;
				endX = mouseX;
				endY = mouseY;
				$('.step3 a').removeClass('inactive');
				$('.step3 a').addClass('active');
			}
			
			function step3save() {
				if (!isMousedown && $('.step3 a').hasClass('active')) {
					// ToDo zoomen um nur die Wand zu haben, dann local_wandBreite durch $('#vorschau').width() ersetzten
					// Berechne die Maße der Wand in px
					var local_wandBreite = (startX > endX ? startX - endX : endX - startX);
					var local_wandHoehe = (startY > endY ? startY - endY : endY - startY);
					// Berechne wie viele px ein cm sind
					cmBreite = local_wandBreite/wandBreite; // Gib an, wie viele px ein cm sind
					cmHoehe = local_wandHoehe/wandHoehe;
					cmBreite = (cmBreite+cmHoehe)/2;
					cmHoehe = (cmBreite+cmHoehe)/2;
					$('#vorschau').css('cursor', 'auto');
					$('.step4').css('display', 'unset')
					$('.step3').css('display', 'none');
					$('#vorschau').off('mousedown', FMousedown);
					$('#vorschau').off('mousemove', FMousemove);
					$('#vorschau').off('mouseup', FMouseup);
					$('#vorschau').off('touchstart', FMousedown);
					$('#vorschau').off('touchmove', FMousemove);
					$('#vorschau').off('touchend', FMouseup);
				}
			}
		}
	}
}
