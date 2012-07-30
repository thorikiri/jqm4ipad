(function($) {
	$(document).bind('mobileinit', function() {
//		$.support.touchOverflow = true;
//		$.mobile.touchOverflowEnabled = true;
//		$.mobile.orientationChangeEnabled = false;
		
	});
	var app = {};
	app.menuBackStack = [];
	app.contentBackStack = [];
	app.backStackConfig = {};
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
				return app.backStackConfig.menu;
			}
			return app.menuBackStack.pop();
		};
	})();
	app.getMenuBackStack = (function() {
		return function() {
			if (app.menuBackStack.length === 0) {
				return {
					hash: '#',
					title: ''};
			}
			return app.menuBackStack[app.menuBackStack.length - 1];
		};
	})();
	app.popContentBackStack = (function() {
		return function() {
			if (app.contentBackStack.length === 0) {
				return app.backStackConfig.main;
			}
			return app.contentBackStack.pop();
		};
	})();
	app.getContentBackStack = (function() {
		return function() {
			if (app.contentBackStack.length === 0) {
				return {
					hash: '#',
					title: ''};
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
			var backHash = $('#index').data('menupage');
			var backTitle = $('#index').data('menupagetitle');
			app.pushMenuBackStack({hash: backHash, title: backTitle});
			$('#index').data('menupage', page).data('menupagetitle', title);
			$('#menuHeader').find('a').remove();
			$('#menuHeader').append($('<a></a>').data('icon', 'back').data('rel', 'back').attr('href', backHash).text('Back'));
			$('#index').page('destroy').page();
		};
	})();
	app.backMenuBody = (function() {
		return function(page) {
			var html = $(page.hash).find('div[class=ipad-menu-body]').html();
			$('#menuBody').html(html);
			$('#menuHeader h1').text(page.title);
			$('#index').data('menupage', page.hash).data('menupagetitle', page.title);
			$('#menuHeader').find('a').remove();
			var back = app.getMenuBackStack();
			if (page && page.hash !== app.backStackConfig.menu.hash) {
				$('#menuHeader').append($('<a></a>').data('icon', 'back').data('rel', 'back').attr('href', back.hash).text('Back'));
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
	app.initBackStack = (function() {
		return function(config) {
			app.backStackConfig = config;
		};
	})();
	$(function() {
		app.init();
		app.initBackStack({
			menu: {
				hash: '#menu',
				title: 'Menu'
			},
			main: {
				hash: '#main',
				title: 'content'
			}
		});
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
				app.backMenuBody(app.popMenuBackStack());
				return false;
			}
		});
	});
})(jQuery);