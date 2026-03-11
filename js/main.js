
(function($) {
	'use strict';

	var $window = $(window),
		$body = $('body'),
		$wrapper= $('#wrapper'),
		$header= $('#header'),
		$footer = $('#footer'),
		$main = $('#main'),
		$main_articles = $main.children('article');

	// Breakpoints.
	breakpoints({
		xlarge:   [ '1281px',  '1680px' ],
		large:    [ '981px',   '1280px' ],
		medium:   [ '737px',   '980px'  ],
		small:    [ '481px',   '736px'  ],
		xsmall:   [ '361px',   '480px'  ],
		xxsmall:  [ null,      '360px'  ]
	});

	// Play initial animations on page load.
	$window.on('load', function() {
		window.setTimeout(function() {
			$body.removeClass('is-preload');
		}, 100);
	});

	// Fix: Flexbox min-height bug on IE.
	if (browser.name == 'ie') {
		var flexboxFixTimeoutId;

		$window.on('resize.flexbox-fix', function() {
			clearTimeout(flexboxFixTimeoutId);

			flexboxFixTimeoutId = setTimeout(function() {
				if ($wrapper.prop('scrollHeight') > $window.height())
					$wrapper.css('height', 'auto');
				else
					$wrapper.css('height', '100vh');
			}, 250);

		}).triggerHandler('resize.flexbox-fix');
	}

	// Nav.
	var $nav = $header.children('nav'),
		$nav_li = $nav.find('li');

	// Add "middle" alignment classes if we're dealing with an even number of items.
	if ($nav_li.length % 2 == 0) {
		$nav.addClass('use-middle');
		$nav_li.eq(($nav_li.length / 2)).addClass('is-middle');
	}

	// Main.
	var delay = 325,
		locked = false;

	// Methods.
	$main._show = function(id, initial) {
		var $article = $main_articles.filter('#' + id);

		// No such article? Bail.
		if ($article.length == 0)
			return;

		// Handle lock.
		if (locked || (typeof initial != 'undefined' && initial === true)) {
			// Mark as switching.
			$body.addClass('is-switching');

			// Mark as visible.
			$body.addClass('is-article-visible');

			// Deactivate all articles
			$main_articles.removeClass('active');

			// Hide header, footer.
			$header.hide();
			$footer.hide();

			// Show main, article.
			$main.show();
			$article.show();

			// Activate article.
			$article.addClass('active');

			// Unlock.
			locked = false;

			// Unmark as switching.
			setTimeout(function() {
				$body.removeClass('is-switching');
			}, (initial ? 1000 : 0));

			return;
		}

		// Lock.
		locked = true;

		// Article already visible? Just swap articles.
		if ($body.hasClass('is-article-visible')) {
			var $currentArticle = $main_articles.filter('.active');
			$currentArticle.removeClass('active');

			setTimeout(function() {
				$currentArticle.hide();
				$article.show();

				setTimeout(function() {
					$article.addClass('active');

					// Window stuff.
					$window.scrollTop(0).triggerHandler('resize.flexbox-fix');

					// Unlock.
					setTimeout(function() {
						locked = false;
					}, delay);

				}, 25);

			}, delay);
		}
		// Otherwise, handle as normal.
		else {
			$body.addClass('is-article-visible');

			setTimeout(function() {
				$header.hide();
				$footer.hide();

				$main.show();
				$article.show();

				setTimeout(function() {
					$article.addClass('active');

					// Window stuff.
					$window.scrollTop(0).triggerHandler('resize.flexbox-fix');

					// Unlock.
					setTimeout(function() {
						locked = false;
					}, delay);

				}, 25);

			}, delay);
		}
	};

	$main._hide = function(addState) {
		var $article = $main_articles.filter('.active');

		// Article not visible? Bail.
		if (!$body.hasClass('is-article-visible'))
			return;

		// Add state?
		if (typeof addState != 'undefined' && addState === true)
			history.pushState(null, null, '#');

		// Handle lock.
		if (locked) {
			// Mark as switching.
			$body.addClass('is-switching');

			// Deactivate article.
			$article.removeClass('active');

			// Hide article, main.
			$article.hide();
			$main.hide();

			// Show footer, header.
			$footer.show();
			$header.show();

			// Unmark as visible.
			$body.removeClass('is-article-visible');

			// Unlock.
			locked = false;

			// Unmark as switching.
			$body.removeClass('is-switching');

			// Window stuff.
			$window.scrollTop(0).triggerHandler('resize.flexbox-fix');

			return;
		}

		// Lock.
		locked = true;

		// Deactivate article.
		$article.removeClass('active');

		// Hide article.
		setTimeout(function() {
			$article.hide();
			$main.hide();

			$footer.show();
			$header.show();

			setTimeout(function() {
				$body.removeClass('is-article-visible');

				// Window stuff.
				$window.scrollTop(0).triggerHandler('resize.flexbox-fix');

				// Unlock.
				setTimeout(function() {
					locked = false;
				}, delay);

			}, 25);

		}, delay);
	};

	// Articles.
	$main_articles.each(function() {
		var $this = $(this);

		// Close.
		$('<div class="close">Close</div>')
			.appendTo($this)
			.on('click', function() {
				location.hash = '';
			});

		// Prevent clicks from inside article from bubbling.
		$this.on('click', function(event) {
			event.stopPropagation();
		});
	});

	// Events.
	$body.on('click', function(event) {
		// Article visible? Hide.
		if ($body.hasClass('is-article-visible'))
			$main._hide(true);
	});

	$window.on('keyup', function(event) {
		switch (event.keyCode) {
			case 27:
				// Article visible? Hide.
				if ($body.hasClass('is-article-visible'))
					$main._hide(true);
				break;
			default:
				break;
		}
	});

	$window.on('hashchange', function(event) {
		// Empty hash?
		if (location.hash == '' || location.hash == '#') {
			event.preventDefault();
			event.stopPropagation();
			$main._hide();
		}
		// Otherwise, check for a matching article.
		else if ($main_articles.filter(location.hash).length > 0) {
			event.preventDefault();
			event.stopPropagation();
			$main._show(location.hash.substr(1));
		}
	});

	// Scroll restoration.
	if ('scrollRestoration' in history)
		history.scrollRestoration = 'manual';
	else {
		var oldScrollPos = 0,
			scrollPos = 0,
			$htmlbody = $('html,body');

		$window
			.on('scroll', function() {
				oldScrollPos = scrollPos;
				scrollPos = $htmlbody.scrollTop();
			})
			.on('hashchange', function() {
				$window.scrollTop(oldScrollPos);
			});
	}

	// Initialize.
	$main.hide();
	$main_articles.hide();

	// Initial article.
	if (location.hash != '' && location.hash != '#')
		$window.on('load', function() {
			$main._show(location.hash.substr(1), true);
		});

})(jQuery);

// Starry Sky Background - Merged from app.js
(function(){'use strict';const CONFIG={SKY:{color:'#1b1f22',radius:1.5,focal:.4,count:.3,speedDefault:5e-4,speedHover:.01}};const StarrySkyMgr={initialized:false,init:function(){if(this.initialized)return;const canvas=document.getElementById('starry-sky');if(!canvas)return;try{'undefined'!=typeof StarrySky&&(StarrySky.init(canvas),this.applyConfig(),StarrySky.render(),this.bindEvents(),this.initialized=true)}catch(e){console.error('[StarrySky Error]',e)}},applyConfig:function(){'undefined'!=typeof StarrySky&&(StarrySky.setSkyColor(CONFIG.SKY.color),StarrySky.setStarRadius(CONFIG.SKY.radius),StarrySky.setFocalDistanceLevel(CONFIG.SKY.focal),StarrySky.setStarCountLevel(CONFIG.SKY.count),StarrySky.setStarSpeedLevel(CONFIG.SKY.speedDefault))},bindEvents:function(){const logo=document.querySelector('.logo');logo&&(logo.addEventListener('mouseenter',()=>{StarrySky.setStarSpeedLevel(CONFIG.SKY.speedHover)}),logo.addEventListener('mouseleave',()=>{StarrySky.setStarSpeedLevel(CONFIG.SKY.speedDefault)}))}};document.readyState!=='loading'?StarrySkyMgr.init():document.addEventListener('DOMContentLoaded',()=>StarrySkyMgr.init(),{once:true});})();

// **隐藏标签
// setTimeout(function(){
// $("#video").hide();  //标签ID
// },
// 11000);  //时间
