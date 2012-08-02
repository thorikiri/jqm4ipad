(function($) {
	$(document).bind('mobileinit', function() {
//		$.support.touchOverflow = true;
//		$.mobile.touchOverflowEnabled = true;
//		$.mobile.orientationChangeEnabled = false;
		
	});
	$(function() {
		$.ipad.init();
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
		$('#menuBody a, #menuBody button').live('click', function(ev) {
			var target = $(this);
			var hrefTarget = target.data('href-target');
			var title = target.text();
			var href = target.attr('href');
			if (hrefTarget === 'menu') {
				if (href && href !== '#') {
					$.ipad.loadMenuBody(title, href);
					return false;
				}
			} else if (hrefTarget === 'content') {
				if (href && href !== '#') {
					$.ipad.loadContentBody(title, href);
					return false;
				}
			}
			return true;
		});
		$('#contentBody a, #contentBody button').live('click', function(ev) {
			var target = $(this);
			var hrefTarget = target.data('href-target');
			var title = target.text();
			var href = target.attr('href');
			if (hrefTarget === 'content') {
				if (href && href !== '#') {
					$.ipad.loadContentBody(title, href, true);
					return false;
				}
			}
			return true;
		});
		$('#menuHeader a').live('click', function(ev) {
			var target = $(this);
			var rel = target.data('rel');
			if (rel === 'back') {
				$.ipad.backMenuBody($.ipad.popMenuBackStack());
				return false;
			}
		});
		$('#contentHeader a').live('click', function(ev) {
			var target = $(this);
			var rel = target.data('rel');
			if (rel === 'back') {
				$.ipad.backContentBody($.ipad.popContentBackStack());
				return false;
			}
		});
	});
})(jQuery);