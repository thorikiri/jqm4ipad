(function($) {
	$(document).bind('mobileinit', function() {
//		$.support.touchOverflow = true;
//		$.mobile.touchOverflowEnabled = true;
//		$.mobile.orientationChangeEnabled = false;
		
	});
	$(function() {
		$.ipad.initBackStack({
			menu: {
				hash: '#menu',
				title: 'Menu'
			},
			main: {
				hash: '#main',
				title: 'content'
			}
		});
		$.ipad.init();
	});
})(jQuery);