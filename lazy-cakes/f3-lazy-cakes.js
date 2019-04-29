// lazy cakes
(function() {
function lazyCake(e) {
	var t = this;
	t.el = $(e);
	t.cake = t.el.children('.cake');
	t.top = 0;
	t.isLoaded = false;
	t.src = t.el.data('bg');
	t.img = $(document.createElement('img')).addClass('lazy-cake-temp');
	t.el.append(t.cake).append(t.img);

	t.resize = function() {
		t.top = t.el.offset().top;
		t.check();
	};
	t.check = function() {
		if(t.top < f3.s + f3.h) {
			t.load();
		}
	};
	t.load = function() {
		if(!t.isLoaded) {
			t.el.addClass('loading');
			t.img.attr({src:t.src}).load(function() {
				t.el.removeClass('loading');
				t.cake.css({
					backgroundImage: 'url('+t.src+')',
					opacity: 1,
				});
			});
			t.isLoaded = true;
		}
	};
}

var lazyCakes = [];
function lazyCakesStart() {
	lazyCakes = $('.lazy-cake').map(function(i, e) {
		return new lazyCake(e);
	});
  $(window).resize(throttle(100, lazyCakesResize)).scroll(throttle(100, lazyCakesScroll));
  $(window).load(lazyCakesResize);
	lazyCakesResize();
}
function lazyCakesResize() {
	lazyCakes.map(function(i, e) {e.resize();});
	lazyCakesScroll();
}
function lazyCakesScroll() {
	lazyCakes.map(function(i, e) {e.check();});
}

lazyCakesStart();
})();
