$(document).ready(function () {

	// mask for input tel
	$(".js-tel").mask("+7 (999) 999-99-99", { placeholder: "+7 (___) ___-__-__" });

	// cut text overflow
	$(".dot").dotdotdot();

	// if ($(window).width() < 960) {}

	// close on focus lost
	$(document).click(function (e) {
		var $trg = $(e.target);
		if (!$trg.closest(".parent-element").length && !$trg.hasClass('trigger-class') || $trg.hasClass('close-btn')) {
			$('.block').removeClass('active');
			$('.spoiler').slideUp(200);
		}
	});

	imgScale("img.scale");
	wrapToScale('.scaling');
});
$(window).load(function () {
	// preloader
	$('#status').fadeOut();
	$('#preloader').delay(350).fadeOut('slow');
	$('body').delay(350).css({
		'overflow': 'visible'
	});
});

function linkScroller() {
	var headerHeight = null;
	if ($(window).width() >= 960) {
		headerHeight = 83;
	} else {
		headerHeight = 0;
	}
	$('a[href*="#"]:not([href="#"])').click(function (e) {
		if (location.pathname.replace(/^\//, '') == this.pathname.replace(/^\//, '') && location.hostname == this.hostname) {
			var target = $(this.hash);
			target = target[0] ? target : $('[name=' + this.hash.slice(1) + ']');
			if (target[0]) {
				$('html, body').stop().animate({
					scrollTop: target.offset().top - headerHeight
				}, 1000);
				e.preventDefault();
			}
		}
	});
}
function imgScale(selector) {
	$(selector).imageScale({
		rescaleOnResize: true
	});
}
function wrapToScale(className) {
	var $items = $(className),
	    count = $items.length;
	$items.each(function () {
		if (!$(this).parent().hasClass('img-scaler__wrap')) {
			$(this).wrap('<div class="img-scaler"></div>').wrap('<div class="img-scaler__wrap"></div>');
		}
		if (! --count) imgScale(".img-scaler img");
	});
};
//# sourceMappingURL=main.js.map
