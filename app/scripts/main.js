$(document).ready(function () {

	// mask for input tel
	$(".js-tel").mask("+7 (999) 999-99-99", { placeholder: "+7 (___) ___-__-__" });

	// cut text overflow
	$(".dot").dotdotdot();

	// check window witdh
	// if ($(window).width() < 960) {}
	console.log('g');

	// close on focus lost
	$(document).click(function(e) {
		var $trg = $(e.target);
		if (!$trg.closest(".parent-element").length && !$trg.hasClass('trigger-class') || $trg.hasClass('close-btn')) {
			$('.block').removeClass('active');
			$('.spoiler').slideUp(200);
		}
	});

});
$(window).load(function() {
	// preloader
	$('#status').fadeOut();
	$('#preloader').delay(350).fadeOut('slow');
	$('body').delay(350).css({
		'overflow': 'visible'
	});
});

function linkScroller(){
	var headerHeight = null;
	if ($(window).width() >= 960) {
		headerHeight = 83;
	} else {
		headerHeight = 0;
	}
	$('a[href*="#"]:not([href="#"])').click(function(e) {
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
function accordion(spoilerTitle, accordionTrue) {
	if ($(spoilerTitle).hasClass('active')) {
		$(spoilerTitle).parent().next().slideDown(0);
	};
	$(document).on('click', spoilerTitle, function (e) {
		var $t = $(this),
		    $parent = $t.parent(),
		    $parentClass = $parent.attr('class'),
		    $spoiler = $parent.next(),
		    $spoilerClass = $spoiler.attr('class');

		e.preventDefault();

		if (accordionTrue) {
			$('.' + $spoilerClass).slideUp(200);
		};

		if ($t.hasClass('active')) {
			$spoiler.slideUp(200);
			$parent.removeClass('active');
			$t.removeClass('active');
		} else {

			if (accordionTrue) {
				$(spoilerTitle).removeClass('active');
				$('.' + $parentClass).removeClass('active');
			} else {
				$parent.removeClass('active');
				$t.removeClass('active');
			}

			$parent.addClass('active');
			$t.addClass('active');
			$spoiler.slideDown(200);
		}
	});
}