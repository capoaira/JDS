$(document).ready(function() {
	$(".menue-btn").click(function() {
		if ($(".menue-list").hasClass("open")) {
			$(".menue-list").removeClass("open");
		} else {
			$(".menue-list").addClass("open");
		}
	});
});
