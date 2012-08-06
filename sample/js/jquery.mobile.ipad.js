(function($) {
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
			var header = $(page).find('header[data-role=header]').html();
			$('#contentBody').html(html);
			$('#contentHeader').empty();
			if (header) {
				$('#contentHeader').html(header);
			} else {
				$('#contentHeader').append($('<h1></h1>').text(title));
			}
			if (backbtn) {
				var backHash = $('#index').data('mainpage');
				var backTitle = $('#index').data('mainpagetitle');
				app.pushContentBackStack({hash: backHash, title: backTitle});
				$('#index').data('mainpage', page).data('mainpagetitle', title);
				$('#contentHeader').find('a[data-icon=back]').remove();
				$('#contentHeader').prepend($('<a></a>').data('icon', 'back').data('rel', 'back').attr('href', backHash).text($.mobile.page.prototype.options.backBtnText));
			} else {
				$('#index').data('mainpage', page).data('mainpagetitle', title);
				$('#contentHeader').find('a[data-icon=back]').remove();
				app.clearContentBackStack();
			}
			$('#index').page('destroy').page();
		};
	})();
	app.loadMenuBody = (function() {
		return function(title, page) {
			var html = $(page).find('div[class=ipad-menu-body]').html();
			var header = $(page).find('header[data-role=header]').html();
			$('#menuBody').html(html);
			$('#menuHeader').empty();
			if (header) {
				$('#menuHeader').html(header);
			} else {
				$('#menuHeader').append($('<h1></h1>').text(title));
			}
			var backHash = $('#index').data('menupage');
			var backTitle = $('#index').data('menupagetitle');
			app.pushMenuBackStack({hash: backHash, title: backTitle});
			$('#index').data('menupage', page).data('menupagetitle', title);
			$('#menuHeader').find('a[data-icon=back]').remove();
			$('#menuHeader').prepend($('<a></a>').data('icon', 'back').data('rel', 'back').attr('href', backHash).text($.mobile.page.prototype.options.backBtnText));
			$('#index').page('destroy').page();
		};
	})();
	app.backContentBody = (function() {
		return function(page) {
			var html = $(page.hash).find('div[class=ipad-content-body]').html();
			$('#contentBody').html(html);
			$('#contentHeader').empty().append($('<h1></h1>').text(page.title));
			$('#index').data('mainpage', page.hash).data('mainpagetitle', page.title);
			var back = app.getContentBackStack();
			if (page && page.hash !== app.backStackConfig.main.hash) {
				$('#contentHeader').prepend($('<a></a>').data('icon', 'back').data('rel', 'back').attr('href', back.hash).text($.mobile.page.prototype.options.backBtnText));
			}
			$('#index').page('destroy').page();
		};
	})();
	app.backMenuBody = (function() {
		return function(page) {
			var html = $(page.hash).find('div[class=ipad-menu-body]').html();
			$('#menuBody').html(html);
			$('#menuHeader').empty().append($('<h1></h1>').text(page.title));
			$('#index').data('menupage', page.hash).data('menupagetitle', page.title);
			$('#menuHeader').find('a[data-icon=back]').remove();
			var back = app.getMenuBackStack();
			if (page && page.hash !== app.backStackConfig.menu.hash) {
				$('#menuHeader').prepend($('<a></a>').data('icon', 'back').data('rel', 'back').attr('href', back.hash).text($.mobile.page.prototype.options.backBtnText));
			}
			$('#index').page('destroy').page();
		};
	})();
	app.init = (function() {
		return function() {
			$('#contentBody').html($('#main').find('div[class=ipad-content-body]').html());
			$('#contentHeader h1').text(app.backStackConfig.main.title);
			$('#menuBody').html($('#menu').find('div[class=ipad-menu-body]').html());
			$('#menuHeader h1').text(app.backStackConfig.menu.title);
			$('#index').page();
		};
	})();
	app.initBackStack = (function() {
		return function(config) {
			app.backStackConfig = config;
		};
	})();
	$.ipad = app;
	
	$(document).on('click tap', '#menuBody a, #menuBody button', function(ev) {
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
	$(document).on('click tap', '#contentBody a, #contentBody button', function(ev) {
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
	$(document).on('click tap', '#menuHeader a', function(ev) {
		var target = $(this);
		var rel = target.data('rel');
		if (rel === 'back') {
			$.ipad.backMenuBody($.ipad.popMenuBackStack());
			return false;
		}
	});
	$(document).on('click tap', '#contentHeader a', function(ev) {
		var target = $(this);
		var rel = target.data('rel');
		if (rel === 'back') {
			$.ipad.backContentBody($.ipad.popContentBackStack());
			return false;
		}
	});
})(jQuery);