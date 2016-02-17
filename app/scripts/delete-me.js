'use strict';

$(document).ready(function () {
	var arrPage = [
		{ label: 'Главная', value: 'index' },
		{ label: 'test', value: 'test' },

		{ label: 'Вверх', value: '#' }
	];
	var textColor = "white",
	    bgColor = "#343434";

	$('<ol id="pages2342"></ol>').prependTo('body').css({
		'position': 'fixed',
		'left': -210, 'top': '5%',
		'width': 220,
		'margin': 0,
		'padding': '10px 20px 10px 40px',
		'background': bgColor,
		'zIndex': 54512, 'fontSize': 12,
		'color': textColor,
		'fontFamily': 'Arial, sans-serif',
		'lineHeight': '20px',
		'opacity': '0.6',
	});

	for (var i = 0; i < arrPage.length; i++) {
		$('#pages2342').append('<li><a href="' + arrPage[i].value + '.html">' + arrPage[i].label + '</a></li>');
	}
	$('#pages2342 li').css({
		'fontSize': 12,
		'color': textColor
	});

	$('#pages2342 a').css({
		'fontSize': 12,
		'color': textColor,
		'text-decoration': 'none'
	});

	$('#pages2342 li:last').prepend('^').append('^').css({
		'fontWeight': 'bold',
		'listStyle': 'none',
		'textAlign': 'center'
	}).find('a').attr('href', '#');

	$('<li><b id="arrow">&raquo;</b></li>').appendTo('#pages2342').css({
		'position': 'absolute',
		'top': '50%', 'right': 2,
		'height': 12,
		'listStyle': 'none'
	});

	$('#arrow').css({ 'fontSize': 12, 'color': textColor });
	$('#pages2342').hover(function () {
		$(this).css({ 'left': 0, 'opacity': '1' });
	}, function () {
		$(this).css({ 'left': -210, 'opacity': '0.6' });
	});
	$('#pages2342 a').hover(function () {
		$(this).css('color', 'orange');
	}, function () {
		$(this).css('color', textColor);
	});
});