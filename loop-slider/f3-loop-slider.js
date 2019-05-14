/**
 * crete new loop slider
 * @param {selector} container loop slider container
 * @param {selector} slingleSlide single element in slider
 * @param {object} options extra options
 * @param {number} options.interval number of slide's interval
 * @param {number} options.durationMultiplier increase duration of slide's animation
 * @returns {object} Slider
 */

const createLoopSlider = (function() {
  const loopSliderCollection = [];

  class SingleSlide {
    constructor(element) {
      this.$element = element;
      this.resize();
    }

    resize() {
      this.width = this.$element.outerWidth();
    }
  }

  class Slider {
    constructor(container, singleSlide, options) {
      this.$element = $(container);
      this.slides = [];
      this.width = this.$element.width();
      this.slidesWidth = 0;
      this.current = 0;
      this.clonesAmount = 0;

      this.options = options;
      this.interval = this.options.interval;
      this.durationMultiplier = this.options.durationMultiplier;

      this.$element.find(singleSlide).map((i, e) => {
        let singleSlide = new SingleSlide($(e));
        this.slides.push(new SingleSlide($(e)));
        this.slidesWidth += singleSlide.width;
      });
      this.slidesLength = this.slides.length;

      this.firstSlide = this.slides[0].$element;
      this.createClones();

      if (this.interval === undefined) {
        this.smoothAnimate();
      }
      if (this.durationMultiplier === undefined) {
        this.intervalAnimate();
      }
    }

    createClones() {
      for (
        this.clonesAmount;
        this.clonesAmount * this.slidesWidth < this.width;
        this.clonesAmount++
      ) {
        this.slides.forEach((e, i) => {
          this.firstSlide.before(e.$element.clone(true));
        });
      }
    }

    resize() {
      this.width = this.$element.width();
      this.createClones();
      this.slides.map(e => {
        e.resize();
      });
    }

    smoothAnimate() {
      this.$element.css({
        left: -this.slidesWidth,
      });
      this.$element.animate(
        {
          left: 0,
        },
        {
          duration: this.slidesWidth * this.durationMultiplier,
          complete: this.smoothAnimate.bind(this),
          easing: 'linear',
        }
      );
    }

    intervalAnimate() {
      this.$element.css({
        left: -this.slidesWidth,
      });
      setInterval(() => {
        let shouldLoop = false;
        this.current =
          (this.current - 1 + this.slidesLength) % this.slidesLength;
        this.$element.animate(
          {left: '+=' + this.slides[this.current].width},
          this.interval / 2,
          () => {
            shouldLoop = this.current === 0;
            if (shouldLoop) {
              this.$element.css({
                left: -this.slidesWidth,
              });
            }
          }
        );
      }, this.interval);
    }
  }

  $(window).on('resize', () => {
    loopSliderCollection.map(e => {
      e.resize();
    });
  });

  window.addEventListener('afterLayoutChange', function() {
    loopSliderCollection.map(e => {
      e.resize();
    });
  });

  return function(container, singleSlide, options) {
    if (options === undefined) options = {};
    const slider = new Slider(container, singleSlide, options);
    loopSliderCollection.push(slider);
    return slider;
  };
})();

createLoopSlider('.loop-slider-wrap', '.slider-single', {
  durationMultiplier: 10,
});
createLoopSlider('.loop-slider-wrap2', '.slider-single2', {
  interval: 1000,
});
