class SingleSlider {
  constructor(element) {
    this.$element = element;
    this.resize();
  }

  resize() {
    this.width = this.$element.outerWidth();
  }
}

class Slider {
  constructor(interval) {
    this.$element = $('.loop-slider-wrap');
    this.slides = [];
    this.width = this.$element.width();
    this.slidesWidth = 0;
    this.current = 0;
    this.clonesAmount = 0;

    this.$element.find('.slider-single').map((i, e) => {
      let singleSlider = new SingleSlider($(e));
      this.slides.push(new SingleSlider($(e)));
      this.slidesWidth += singleSlider.width;
    });
    this.slidesLength = this.slides.length;

    this.firstSlide = this.slides[0].$element;
    this.createClones();

    if (interval === undefined) {
      this.smoothAnimate();
    }
    else {
      this.interval = interval;
      this.intervalAnimate();
    }
  }

  createClones() {
    for (this.clonesAmount; this.clonesAmount * this.slidesWidth < this.width; this.clonesAmount++) {
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
        duration: this.slidesWidth * 10,
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
      this.current = (this.current - 1 + this.slidesLength) % this.slidesLength;
      this.$element.animate(
        {left: '+=' + this.slides[this.current].width},this.interval/2,
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

let slider = new Slider(500);

$(window).on('resize', () => {
  slider.resize();
});
