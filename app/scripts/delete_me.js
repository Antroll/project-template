$(document).ready(function()
{
	var arrPage = [
		{label: 'Главная', value: 'index'},

		{label: 'Вверх', value: '#'}

	];

	$('<ol id="pages2342"></ol>').prependTo('body').css({'position':'fixed', 'left':-200,'top':'5%', 'width':220,'margin':0,
		'padding':'10px 20px 10px 40px', 'background':'rgb(200,200,200)','zIndex':54512, 'fontSize':12,'color':'black',
		'fontFamily':'Arial, sans-serif', 'lineHeight':'20px'});

	for (var i=0;i<arrPage.length;i++){
		$('#pages2342').append('<li><a href="' +arrPage[i].value+ '.html">' +arrPage[i].label+ '</a></li>')
	}

	$('#pages2342 a').css({'fontSize':12,'color':'black'});

	$('#pages2342 li:last').prepend('^').append('^').css({'fontWeight':'bold', 'listStyle':'none','textAlign':'center'})
		.find('a').attr('href','#');
	$('<li><b id="arrow">&raquo;</b></li>').appendTo('#pages2342').css({'position':'absolute','top':'50%','right':5,'height':12, 'listStyle':'none'});
	$('#arrow').css({'fontSize':12,'color':'black'});
	$('#pages2342').hover(function(){
			$(this).css('left',0);
		},
		function(){
			$(this).css('left',-200);
		});
});