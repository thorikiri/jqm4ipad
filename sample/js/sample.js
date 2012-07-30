(function($) {
	$(document).bind('mobileinit', function() {
//		$.support.touchOverflow = true;
//		$.mobile.touchOverflowEnabled = true;
//		$.mobile.orientationChangeEnabled = false;
		
	});
	var app = {};
	app.menuBackStack = [];
	app.contentBackStack = [];
	app.pushMenuBackStack = (function() {
		return function(page) {
			app.menuBackStack.push(page);
		};
	})();
	app.pushContentBackStack = (function() {
		return function(page) {
			app.contentBackStack.push(page);
		};
	});
	app.popMenuBackStack = (function() {
		return function() {
			if (app.menuBackStack.length === 0) {
				return '#menu';
			}
			return app.menuBackStack.pop();
		};
	})();
	app.getMenuBackStack = (function() {
		return function() {
			if (app.menuBackStack.length === 0) {
				return '#';
			}
			return app.menuBackStack[app.menuBackStack.length - 1];
		};
	})();
	app.popContentBackStack = (function() {
		return function() {
			if (app.contentBackStack.length === 0) {
				return '#main';
			}
			return app.contentBackStack.pop();
		};
	})();
	app.getContentBackStack = (function() {
		return function() {
			if (app.contentBackStack.length === 0) {
				return '#';
			}
			return app.contentBackStack[app.contentBackStack.length - 1];
		};
	})();
	app.loadContentBody = (function() {
		return function(title, page) {
			var html = $(page).find('div[class=ipad-content-body]').html();
			$('#contentBody').html(html);
			$('#contentHeader h1').text(title);
			$('#index').page('destroy').page();
		};
	})();
	app.loadMenuBody = (function() {
		return function(title, page) {
			var html = $(page).find('div[class=ipad-menu-body]').html();
			$('#menuBody').html(html);
			$('#menuHeader h1').text(title);
			var back = $('#index').data('menupage');
			app.pushMenuBackStack(back);
			$('#index').data('menupage', page);
			$('#menuHeader').find('a').remove();
			$('#menuHeader').append($('<a></a>').data('icon', 'back').data('rel', 'back').attr('href', back).text('Back'));
			$('#index').page('destroy').page();
		};
	})();
	app.backMenuBody = (function() {
		return function(title, page) {
			var html = $(page).find('div[class=ipad-menu-body]').html();
			$('#menuBody').html(html);
			$('#menuHeader h1').text(title);
			$('#index').data('menupage', page);
			$('#menuHeader').find('a').remove();
			var back = app.getMenuBackStack();
			if (page !== '#menu') {
				$('#menuHeader').append($('<a></a>').data('icon', 'back').data('rel', 'back').attr('href', back).text('Back'));
			}
			$('#index').page('destroy').page();
		};
	})();
	app.init = (function() {
		return function() {
			$('#contentBody').html($('#main').find('div[class=ipad-content-body]').html());
			$('#contentHeader h1').text('content');
			$('#menuBody').html($('#menu').find('div[class=ipad-menu-body]').html());
			$('#menuHeader h1').text('menu');
			$('#index').page();
		};
	})();
	$(function() {
		app.init();
		$('#menuBody a').live('click', function(ev) {
			var target = $(this);
			var hrefTarget = target.data('href-target');
			var title = target.text();
			var href = target.attr('href');
			if (hrefTarget === 'menu') {
				if (href && href !== '#') {
					app.loadMenuBody(title, target.attr('href'));
					return false;
				}
			} else {
				if (href && href !== '#') {
					app.loadContentBody(title, target.attr('href'));
					return false;
				}
			}
		});
		$('#menuHeader a').live('click', function(ev) {
			var target = $(this);
			var rel = target.data('rel');
			if (rel === 'back') {
				var title = 'back';
				app.backMenuBody(title, app.popMenuBackStack());
				return false;
			}
		});
	});
})(jQuery);