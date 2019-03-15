// Screen Loading 
$(window).on("load",function()
	{
		$(".loading_overlay .spinner").fadeOut(500 ,function(){
			$("body").css("overflow","auto");
			$(this).parent().fadeOut(500,function(){
				$(this).remove();
			});
		});
	});


// Scroll top
var scrollButton = $(".scroll_top");
$(window).scroll(function(){
	$(this).scrollTop() > 700 ? scrollButton.show() : scrollButton.hide();
});

scrollButton.click(function(){
	$("html,body").animate({scrollTop : 0},2000);
});


