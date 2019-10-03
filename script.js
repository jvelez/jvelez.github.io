$(document).ready(function()
{
	//ANIMATE NAVBAR CSS
	$(window).scroll(function (event) {
    	var scroll = $(window).scrollTop();
		if(scroll>32) {
			$('.navbar').css('background-color', 'rgba(0,0,0,0.7)');
			$('.navbar').css('box-shadow', '0px 0px 5px rgba(0,0,0,0.6)');
			$('.navbar-item').css('color', 'white');
		} else {
			$('.navbar').css('background-color', 'transparent');
			$('.navbar').css('box-shadow', '0px 0px 0px transparent');
			$('.navbar-item').css('color', 'rgb(0,72,128)');
		}
	});

	//SCROLL TO SEGMENTS
	$(".navbar-item, .bouncer").click(function() {
		var id = "#segment_"+$(this).attr('id');
		$('html, body').animate({ 
			scrollTop: $(id).offset().top + 'px'
		}, '0.5s');
	});
});
