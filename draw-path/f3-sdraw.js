/*
name:		Svg path draw jQuery plugin
author:		F3 - http://free3.pl/
version:	0.9

data attributes
reverse
duration	-	ignored with use-regulator
trig-offset	-	ignored without trig
trig
safe-zone	-	ignored without use-regulator
friction	-	ignored without use-regulator
amplification	-	ignored without use-regulator
saturation	-	ignored without use-regulator
hover
delay
*/

function SdrawPaths(init) {
var obj = this;

obj.registerPath = function(e) {
	return new Path(e);
}
obj.registerPaths = function(e) {
	var paths = [];
	$(e).each(function() {paths.push(obj.registerPath(this));});
	return paths;
}

if(init) {
	obj.sdrawPaths = [];
	$('path.sdraw:not(.reg)').each(function() {obj.sdrawPaths.push(obj.registerPath(this));});
}

function Path(e) {
	var t = this;
	t.el = $(e);
	t.svg = t.el.parents('svg');
	t.offset = 0;
	t.len = t.el.get(0).getTotalLength();
	t.drawn = false;
	t.reverse = parseInput(t.el.data('reverse'), false);
	t.duration = parseInput(t.el.data('duration'), 500);
	t.trigOffset = parseInput(t.el.data('trig-offset'), 0.5);
	t.scaling = t.el.attr('vector-effect') === 'non-scaling-stroke';
	t.safeZone = parseInput(t.el.data('safe-zone'), 0);
	
	if(t.scaling) {
		t.viewboxW = t.svg[0].getAttribute('viewBox');
		t.viewboxW = parseFloat(t.viewboxW.split(' ')[2]);
	}
	
	t.useRegulator = parseInput(t.el.data('use-regulator'), false);
	if(t.useRegulator) {
		t.box = new Box({
			start	:	{x:0},
			step	:	function(el, x) {
				t.el.css({'strokeDashoffset': x['x']});
			},
			friction	:	t.el.data('friction'),
			amplification	:	t.el.data('amplification'),
			saturation	:	t.el.data('saturation'),
			callback	:	function() {
				t.drawn = t.drawing === 1;
				t.drawing = 0;
			},
		});
	}
	
	// set the hover trigger
	t.hover = $(t.el.data('hover'));
	
	// set the scroll trigger
	t.trig = $(t.el.data('trig'));
	
	// set delay for paths in a group
	t.group = t.el.parents('g.sdraw-group');
	t.index = t.group.length ? t.group.find('path.sdraw').index(t.el) : 1;
	t.delay = parseInput(t.el.data('delay'), t.group.length ? 500 : 0);
	
	// refresh trigger position and path length
	t.resize = function() {
		t.offset = t.trig.length ? t.trig.offset().top : -1;
		t.len = t.el.get(0).getTotalLength();
		if(t.scaling) t.len *= t.svg.width() / t.viewboxW;
		var offset = t.drawn ? (t.reverse ? t.len * (2 - t.safeZone) : -t.len * t.safeZone) : t.len * (1 - t.safeZone);
		if(t.useRegulator) {
			t.box.x['x'].value = offset;
			t.box.x['x'].target = t.box.x['x'].value;
		}
		t.el.css({
			'strokeDasharray'	:	t.len * (1 - t.safeZone * 2) + ' ' + t.len * (1 + t.safeZone * 2),
			'strokeDashoffset'	:	offset,
		});
	};
	
	// check if path should be drawn because of scroll
	t.check = function() {
		if(t.trig.length) {
			if(f3.s + f3.h * t.trigOffset > t.offset) t.fill();
			else t.erase();
		}
	};
	
	// draw the path
	t.fill = function() {
		if(t.drawing !== 1 && !t.drawn) {
			t.drawing = 1;
			clearTimeout(t.timeout);
			t.timeout = setTimeout(function() {
				if(t.useRegulator) {
					t.box.animate({x: t.reverse ? t.len * (2 - t.safeZone) : -t.len * t.safeZone});
				}
				else {
					t.el.stop().animate(
						{'strokeDashoffset': t.reverse ? t.len * 2 : 0},
						{
							duration	:	t.duration,
							complete	:	function() {
								t.drawing = 0;
								t.drawn = true;
							},
						}
					);
				}
			}, t.index * t.delay);
		}
	};
	
	// erase the path
	t.erase = function() {
		if(t.drawing !== -1 || t.drawn) {
			t.drawing = -1;
			clearTimeout(t.timeout);
			t.timeout = setTimeout(function() {
				if(t.useRegulator) {
					t.box.animate({x: t.len * (1 - t.safeZone)});
				}
				else {
					t.el.stop().animate(
						{'strokeDashoffset': t.len},
						{
							duration	:	t.duration,
							complete	:	function() {
								t.drawing = 0;
								t.drawn = false;
							},
						}
					);
				}
			}, t.index * t.delay);
		}
	};
	
	if(t.hover.length) {
		t.hover.mouseenter(t.fill);
		t.hover.mouseleave(t.erase);
	}
	
	t.resize();
	t.check();
}

if(init) {
	function sdrawRsesize() {
		for(var i=0; i<obj.sdrawPaths.length; i++) {
			obj.sdrawPaths[i].resize();
		}
		sdrawCheck();
	}
	function sdrawCheck() {
		for(var i=0; i<obj.sdrawPaths.length; i++) {
			obj.sdrawPaths[i].check();
		}
	}

	$(window).load(sdrawRsesize);
	$(window).resize(throttle(100, sdrawRsesize));
	$(window).scroll(throttle(100, sdrawCheck));
}
}


var sdraw = new SdrawPaths(true);
// var paths = sdraw.registerPaths($('path'));
// paths[0].fill();