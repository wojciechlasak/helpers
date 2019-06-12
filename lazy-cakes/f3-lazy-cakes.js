// lazy cakes
const lazyCakes = (() => {
  class LazyCake {
    constructor(e) {
      this.el = $(e);
      this.cake = this.el.children('.cake');
      this.top = 0;
      this.isLoaded = false;
      this.src = this.el.data('bg');
      this.img = $(document.createElement('img')).addClass('lazy-cake-temp');
      this.el.append(this.cake).append(this.img);
    }

    resize() {
      this.top = this.el.offset().top;
      this.check();
    }

    check() {
      if (this.top < f3.s + f3.h) {
        this.load();
      }
    }

    load() {
      if (!this.isLoaded && this.el.height() !== 0) {
        this.el.addClass('loading');
        this.img.attr({src: this.src}).load(() => {
          this.el.removeClass('loading');
          this.cake.css({
            backgroundImage: 'url(' + this.src + ')',
            opacity: 1,
          });
        });
        this.isLoaded = true;
      }
    }
  }

  let lazyCakes = [];
  function lazyCakesStart() {
    $('.lazy-cake').map(function(i, e) {
      lazyCakes.push(new LazyCake(e));
    });
    f3.window.scroll(throttle(100, lazyCakesScroll));
    window.addEventListener('afterLayoutChange', lazyCakesResize);
  }
  function lazyCakesResize() {
    lazyCakes.map(function(e) {e.resize();});
    lazyCakesScroll();
  }
  function lazyCakesScroll() {
    lazyCakes.map(function(e) {e.check();});
  }

  lazyCakesStart();

  return {
    cakes: lazyCakes,
    add: selector => {
      lazyCakes.push(new LazyCake(selector));
    },
    recreate: () => {
      lazyCakes = [];
      $('.lazy-cake').map(function(i, e) {
        lazyCakes.push(new LazyCake(e));
      });
    },
  };
})();
