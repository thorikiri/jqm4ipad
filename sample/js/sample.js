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
	app.clearMenuBackStack = (function() {
		return function() {
			app.menuBackStack = [];
		};
	})();
	app.pushContentBackStack = (function() {
		return function(page) {
			app.contentBackStack.push(page);
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
	app.clearContentBackStack = (function() {
		return function() {
			app.contentBackStack = [];
		};
	})();
	app.loadContentBody = (function() {
		return function(title, page, backbtn) {
			var html = $(page).find('div[class=ipad-content-body]').html();
			$('#contentBody').html(html);
			$('#contentHeader h1').text(title);
			if (backbtn) {
				var backHash = $('#index').data('mainpage');
				var backTitle = $('#index').data('mainpagetitle');
				app.pushContentBackStack({hash: backHash, title: backTitle});
				$('#index').data('mainpage', page).data('mainpagetitle', title);
				$('#contentHeader').find('a').remove();
				$('#contentHeader').append($('<a></a>').data('icon', 'back').data('rel', 'back').attr('href', backHash).text('Back'));
			} else {
				$('#index').data('mainpage', page).data('mainpagetitle', title);
				$('#contentHeader').find('a').remove();
				app.clearContentBackStack();
			}
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
	app.backContentBody = (function() {
		return function(page) {
			var html = $(page.hash).find('div[class=ipad-content-body]').html();
			$('#contentBody').html(html);
			$('#contentHeader h1').text(page.title);
			$('#index').data('mainpage', page.hash).data('mainpagetitle', page.title);
			$('#contentHeader').find('a').remove();
			var back = app.getContentBackStack();
			if (page && page.hash !== app.backStackConfig.main.hash) {
				$('#contentHeader').append($('<a></a>').data('icon', 'back').data('rel', 'back').attr('href', back.hash).text('Back'));
			}
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
		$('#menuBody a, #menuBody button').live('click', function(ev) {
			var target = $(this);
			var hrefTarget = target.data('href-target');
			var title = target.text();
			var href = target.attr('href');
			if (hrefTarget === 'menu') {
				if (href && href !== '#') {
					app.loadMenuBody(title, href);
					return false;
				}
			} else if (hrefTarget === 'content') {
				if (href && href !== '#') {
					app.loadContentBody(title, href);
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
					app.loadContentBody(title, href, true);
					return false;
				}
			}
			return true;
		});
		$('#menuHeader a').live('click', function(ev) {
			var target = $(this);
			var rel = target.data('rel');
			if (rel === 'back') {
				app.backMenuBody(app.popMenuBackStack());
				return false;
			}
		});
		$('#contentHeader a').live('click', function(ev) {
			var target = $(this);
			var rel = target.data('rel');
			if (rel === 'back') {
				app.backContentBody(app.popContentBackStack());
				return false;
			}
		});
	});
})(jQuery);