/*
version:	1.0
*/

(function() {
  fadeSliders = [];
  class Slider {
    constructor(element) {
      this.applyCss(element);
      this.interval = this.element.data('interval');
      this.interval = this.interval !== undefined ?
        parseInt(this.interval) : false;
      if (this.interval) {
        this.intervalHandle = setInterval(this.next.bind(this), this.interval);
      }

      this.h = 0;
      this.c = 0;
      this.id = this.element.attr('id');
      this.scrollItem = createScrollItem(this.element);
      this.refresh();

      this.slides.eq(0).addClass('current-slide');
      this.prepareArrows();
      this.prepareBullets();
    }

    applyCss(element) {
      this.element = $(element);
      this.bar = $(document.createElement('div'))
        .addClass('slider-bar')
        .css({position: 'relative'})
        .appendTo(this.element);
      this.slides = this.element
        .find('.slider-single')
        .css({
          position: 'absolute',
          width: '100%',
        })
        .appendTo(this.bar);
    }

    prepareArrows() {
      this.arrows = this.element.data('arrows');
      if (this.arrows === undefined) {
        this.arrows = this.element.find('.slider-arrows');
      }
      else {
        this.arrows = $(this.arrows);
      }
      if (this.arrows.length > 0) {
        this.left = this.arrows.find('.slider-left');
        this.right = this.arrows.find('.slider-right');
        this.left.click(() => {
          if (this.interval) {
            clearInterval(this.intervalHandle);
          }
          this.prev();
        });
        this.right.click(() => {
          if (this.interval) {
            clearInterval(this.intervalHandle);
          }
          this.next();
        });
      }
    }

    prepareBullets() {
      this.bullets = this.element.data('bullets');
      if (this.bullets === undefined) {
        const bulletList = $(document.createElement('div'))
          .addClass('slider-bullets')
          .appendTo(this.element);
        this.bullets = [];
        this.slides.map((index, slide) => {
          this.bullets.push($(document.createElement('div'))
            .addClass('slider-bullet')
            .appendTo(bulletList));
        });
      }
      else {
        this.bullets = $(this.bullets + ' .slider-bullet');
      }
      if (this.bullets.length > 0) {
        this.bullets.map((bullet, index) => {
          bullet.click(() => {
            this.goTo(index);
            if (this.interval) {
              clearInterval(this.intervalHandle);
            }
          });
        });
      }
      if (this.bullets.length <= 1) {
        this.bullets.hide(0);
      }
      else {
        this.bullets[0].addClass('bullet-current');
      }
    }

    refresh() {
      this.bar.css({height: 0});
      let h = 0;
      this.slides.each((index, element) => {
        h = Math.max($(element).height(), h);
      });
      this.h = h;
      this.setHeight();
      this.scrollItem._onResize();
    }

    setHeight() {
      this.bar.css({height: this.h});
    }

    goTo(n) {
      if (this.c !== n) {
        const previous = this.c;
        this.slides.filter('.current-slide').removeClass('current-slide');
        this.slides.eq(n).addClass('current-slide');
        this.bullets[previous].removeClass('bullet-current');
        this.bullets[n].addClass('bullet-current');
        this.c = n;
        window.dispatchEvent(new CustomEvent('fadeSliderChange', {
          detail: {slider: this, prev: previous},
        }));
      }
    }

    onLoad() {
      window.dispatchEvent(new CustomEvent('fadeSliderChange', {
        detail: {slider: this, prev: -1},
      }));
    }

    next() {
      this.goTo((this.c + 1) % this.slides.length);
    }

    prev() {
      let target = this.c - 1;
      if (target < 0)
        target = this.slides.length - 1;
      this.goTo(target);
    }
  }


  $('.fade-slider-wrap').each((index, element) => {
    const slider = new Slider(element);
    if (
      slider.id === undefined ||
			fadeSliders[slider.id] !== undefined
    ) {
      slider.id = index;
    }
    fadeSliders[slider.id] = slider;
  });

  function refresh() {
    for (const slider in fadeSliders) {
      fadeSliders[slider].refresh();
    }
  }

  function load() {
    for (const slider in fadeSliders) {
      fadeSliders[slider].onLoad();
    }
  }

  $(window).on('load', load);
  window.addEventListener('layoutChange', refresh);
  window.addEventListener('keydown', event => {
    if (event.which !== 39 && event.which !== 37) return;
    if (fadeSliders.length === 0) return;
    let closest;
    let closestDiff = Infinity;
    for (const slider of fadeSliders) {
      const diff = Math.abs(slider.scrollItem.screenPos(0.5) - 0.5);
      if (diff < closestDiff) {
        closestDiff = diff;
        closest = slider;
      }
      else {
        break;
      }
    }
    if (event.which === 39) {
      closest.next();
    }
    else if (event.which === 37) {
      closest.prev();
    }
  });
})();
