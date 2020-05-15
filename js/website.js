/** 
	This helps to design the Website https://dgps2020260418.jimdofree.com/ and is located in the head of the jimdo page
*/

$(document).ready(function() {
	if (document.location.pathname.match(/shop\/konfigurator/)) {
			$('.jqbga-slider--image--wrap, .jtpl-section-main.cc-content-parent, .jtpl-section-aside.sidebar-options, .cc-FloatingButtonBarContainer.cc-FloatingButtonBarContainer-right').css('display', 'none !important');
			$('.jtpl-title')[0].innerHTML = '<iframe src="https://capoaira.github.io/JDS/config.html" style="width:100%; height: ' + ($(document).height()-$('.jtpl-header').height()) + 'px"></iframe>';
			$('.jtpl-title').removeClass('jtpl-title');
	}
});
