jQuery.extend(jQuery.easing, {easeOutQuad: function(x, t, b, c, d) {
  return -c * (t /= d) * (t - 2) + b;
}});

const createF3Slider = (function() {
  class F3Slider {
    constructor(options) {
      this.id = ++F3Slider.lastId;
      this.wrap = $(options.wrap);
      if (this.wrap.length !== 1) return;

      this.prepareOptions(options);
      this.currentSlideId = this.options.initialSlide;  // id of the current slide
      this.slideOffset = 0;                             // number of pixels from current slide top
      this.position = 0;                                // current scroll amount in pixels
      this.size = 0;                                    // size of the entire scroll bar
      this.wrapSize = 0;                                // size of the wrap
      this.isSliding = false;                           // is slider currently being animated
      this.isDragged = false;                           // is slider currently being dragged
      this.isEnabled = options.isEnabled;
      if (this.isEnabled === undefined) this.isEnabled = true;

      this.prepareArrows();
      this.prepareSlides();
      this.prepareWheel();
      this.prepareDrag();

      this.checkSize = this.checkSize.bind(this);
      window.addEventListener('afterLayoutChange', this.checkSize);
    }

    prepareOptions(options) {
      this.options = {
        slideOnWheel: false,
        shouldHaveBullets: true,
        slideSelector: '.single-slide', // selector of a single slide, searched inside wrap
        isVertical: false,              // direction of the slider
        initialSlide: 0,                // id of the initially selected slide
        duration: 300,                  // duration of the sliding animation
        // wrap                         selector of the slider wrap
        // arrowUp                      selector of the up arrow, searched in the whole document
        // arrowDown                    analogous
        // onActivate                   callback to be called when a slide activates
        // onDeactivate                 analogous
      };
      for (const optionName in options) {
        this.options[optionName] = options[optionName];
      }
    }

    prepareSlides() {
      this.bar = $(document.createElement('div'))
        .addClass('f3-slider-bar')
        .appendTo(this.wrap);
      this.slides = [];
      if (this.options.shouldHaveBullets) {
        if (
          this.options.bulletContainer === undefined ||
          this.slider.bulletContainer.length === 0
        ) {
          this.bulletContainer = $(document.createElement('div'))
            .addClass('f3-slider-bullet-container')
            .appendTo(this.wrap)
            .on('touchstart', event => {
              if (!this.isEnabled) return;
              event.stopPropagation();
            });
        }
        else {
          this.bulletContainer = $(this.options.bulletContainer);
        }
      }
      this.wrap.find(this.options.slideSelector).map((index, element) => {
        const slide = new F3SliderSlide(element, this);
        slide.element.appendTo(this.bar);
        this.slides.push(slide);
      });
      this.wrap.css({
        position: 'relative',
        overflow: 'hidden',
      });
      this.bar.css({
        position: 'absolute',
        height: 100 + '%',
        width: 100 + '%',
        left: 0,
      });
      if (!this.options.isVertical) {
        this.bar.css({
          width: this.slides.length * 100 + '%',
          display: 'flex',
        });
        this.slides.map(slide =>
          slide.element.css({
            width: 100 / this.slides.length + '%',
            minHeight: 100 + '%',
          }));
      }
    }

    prepareArrows() {
      this.isArrowUpActive = true;
      this.isArrowDownActive = true;
      this.arrowUp = $(this.options.arrowUp);
      this.arrowDown = $(this.options.arrowDown);
      if (this.options.arrowDown === undefined) {
        this.arrowDown = this.wrap.find('.arrow-down');
      }
      if (this.options.arrowUp === undefined) {
        this.arrowUp = this.wrap.find('.arrow-up');
      }

      if (this.arrowDown.length > 0) {
        this.arrowDown.on({
          click: this.nextSlide.bind(this),
          touchstart: event => event.stopPropagation(),
        });
        new Hoverable(this.arrowDown);
      }
      if (this.arrowUp.length > 0) {
        this.arrowUp.on({
          click: this.prevSlide.bind(this),
          touchstart: event => event.stopPropagation(),
        });
        new Hoverable(this.arrowUp);
      }
    }

    prepareWheel() {
      if (this.options.slideOnWheel) {
        this.wrap.on('wheel', event => {
          if (!this.isEnabled) return;

          event.stopPropagation();
          if (this.isSliding) return;

          if (event.originalEvent.deltaY > 0) {
            const slideBottom = this.slides[this.currentSlideId].size;
            const wrapBottom = this.wrapSize - this.slideOffset;
            if (slideBottom <= wrapBottom + 1) {
              this.nextSlide();
            }
            else {
              this.slideOffset = Math.max(
                this.slideOffset - 150,
                -this.slides[this.currentSlideId].size + this.wrapSize
              );
              this.applyPos();
            }
          }
          else if (event.originalEvent.deltaY < 0) {
            if (0 <= this.slideOffset + 1) {
              this.prevSlide();
            }
            else {
              this.slideOffset = Math.min(this.slideOffset + 150, 0);
              this.applyPos();
            }
          }
        });
      }
    }

    prepareDrag() {
      this.endDrag = this.endDrag.bind(this);
      this.onDrag = this.onDrag.bind(this);
      this.wrap.on('touchstart', event => {
        if (!this.isEnabled) return;
        event.preventDefault();

        if (this.isSliding) return;
        this.isDragged = true;
        this.dragStart = {
          x: event.originalEvent.changedTouches[0].pageX,
          y: event.originalEvent.changedTouches[0].pageY,
        };
        this.lastDrag = {
          lastSaveId: 0,
          values: [{
            x: this.dragStart.x,
            y: this.dragStart.y,
          }],
        };
        window.addEventListener('touchend', this.endDrag);
        window.addEventListener('touchmove', this.onDrag);
      });
    }

    onDrag(event) {
      const currentPos = {
        x: event.changedTouches[0].pageX,
        y: event.changedTouches[0].pageY,
      };

      this.lastDrag.lastSaveId = (this.lastDrag.lastSaveId + 1) % 10;
      this.lastDrag.values[this.lastDrag.lastSaveId] = currentPos;
      const diff = currentPos.y - this.dragStart.y;
      this.position =
        this.slides[this.currentSlideId].offset - diff - this.slideOffset;

      this.bar.css({
        top: -this.position,
      });
    }

    endDrag(event) {
      this.isDragged = false;
      const dragEnd = {
        x: event.changedTouches[0].pageX,
        y: event.changedTouches[0].pageY,
      };
      let oldestSavedId = 0;
      if (this.lastDrag.values.length === 10) {
        oldestSavedId = (this.lastDrag.lastSaveId + 1) % 10;
      }

      let currentPos = this.slides[this.currentSlideId].offset;
      currentPos -= dragEnd.y - this.dragStart.y;

      let changedSlide = false;
      // previous position
      if (dragEnd.y > this.dragStart.y) {
        let found = 0;
        for (let i = 0; i < this.slides.length; i++) {
          if (this.slides[i].offset > currentPos - this.slideOffset) {
            found = Math.max(i - 1, 0);
            break;
          }
        }
        if (this.currentSlideId !== found || found <= 0) {
          this.currentSlideId = found;
          this.slideOffset = 0;
          this.applyPos(undefined, true);
          changedSlide = true;
        }
        else {
          this.slideOffset += dragEnd.y - this.dragStart.y;
        }
      }
      // next position
      else if (dragEnd.y < this.dragStart.y) {
        let found = this.slides.length - 1;
        for (let i = 0; i < this.slides.length; i++) {
          const slideBottom = this.slides[i].offset + this.slides[i].size;
          const wrapBottom = currentPos + this.wrapSize - this.slideOffset;
          if (slideBottom > wrapBottom) {
            found = i;
            break;
          }
        }
        if (this.currentSlideId !== found || found >= this.slides.length - 1) {
          this.currentSlideId = found;
          this.slideOffset = 0;
          this.applyPos();
          changedSlide = true;
        }
        else {
          this.slideOffset += dragEnd.y - this.dragStart.y;
        }
      }
      // same position
      if (!changedSlide) {
        let velocity = dragEnd.y - this.lastDrag.values[oldestSavedId].y;
        this.slideOffset += velocity * 2;
        this.applyPos();
      }
      window.removeEventListener('touchend', this.endDrag);
      window.removeEventListener('touchmove', this.onDrag);
    }

    checkSize() {
      if (this.options.isVertical) {
        this.wrapSize = this.wrap.height();
      }
      else {
        this.wrapSize = this.wrap.width();
      }
      this.slideOffset = 0;
      this.size = 0;
      this.slides.map(slide => {
        this.size += slide.checkSize(this.size);
      });
      this.applyPos(0);
    }

    prevSlide() {
      if (this.currentSlideId <= 0) return;
      if (this.isSliding) return;
      this.currentSlideId--;
      this.slideOffset = 0;
      this.applyPos(undefined, true);
    }

    nextSlide() {
      if (this.currentSlideId >= this.slides.length - 1) return;
      if (this.isSliding) return;
      this.currentSlideId++;
      this.slideOffset = 0;
      this.applyPos();
    }

    applyPos(duration, toEnd) {
      this.isSliding = true;
      if (duration === undefined) {
        duration = this.options.duration;
      }
      if (toEnd) {
        this.slideOffset =
          -this.slides[this.currentSlideId].size + this.wrapSize;
      }
      this.position =
        this.slides[this.currentSlideId].offset - this.slideOffset;
      this.slides[this.currentSlideId].activate();
      this.handleArrows();

      const css = {};
      if (this.options.isVertical) {
        css.top = -this.position;
      }
      else {
        css.left = -this.position;
      }
      this.bar.animate(css, {
        duration: duration,
        easing: 'easeOutQuad',
        complete: () => {
          this.isSliding = false;
        },
      });
    }

    handleArrows() {
      if (this.currentSlideId === this.slides.length - 1) {
        if (this.isArrowDownActive) {
          this.arrowDown.addClass('disabled');
          this.isArrowDownActive = false;
        }
      }
      else if (!this.isArrowDownActive) {
        this.arrowDown.removeClass('disabled');
        this.isArrowDownActive = true;
      }

      if (this.currentSlideId === 0) {
        if (this.isArrowUpActive) {
          this.arrowUp.addClass('disabled');
          this.isArrowUpActive = false;
        }
      }
      else if (!this.isArrowUpActive) {
        this.arrowUp.removeClass('disabled');
        this.isArrowUpActive = true;
      }
    }
  }
  F3Slider.lastId = -1;

  class F3SliderSlide {
    constructor(element, slider) {
      this.element = $(element);
      if (this.element.length !== 1) return;

      this.slider = slider;
      this.id = this.slider.slides.length;
      this.active = false;
      this.size = 0;
      this.offset = 0;
      if (this.slider.bulletContainer) {
        this.bullet = new F3SliderBullet(this.slider, this);
      }

      if (this.slider.currentSlideId === this.id) {
        this.activate();
      }
    }

    checkSize(offset) {
      this.offset = offset;
      if (this.slider.options.isVertical) {
        this.size = this.element.outerHeight();
      }
      else {
        this.size = this.element.outerWidth();
      }

      return this.size;
    }

    goTo() {
      this.slider.currentSlideId = this.id;
      this.slider.applyPos();
    }

    activate() {
      if (!this.active) {
        this.slider.slides.map(slide => {
          slide.deactivate();
        });
        this.bullet && this.bullet.element.addClass('active');
        this.element.addClass('active');
        this.active = true;
        if (this.slider.options.onActivate !== undefined) {
          this.slider.options.onActivate.call(this, this, this.slider);
        }
      }
    }

    deactivate() {
      if (this.active) {
        this.bullet && this.bullet.element.removeClass('active');
        this.element.removeClass('active');
        this.active = false;
        if (this.slider.options.onDeactivate !== undefined) {
          this.slider.options.onDeactivate.call(this, this, this.slider);
        }
      }
    }
  }

  class F3SliderBullet {
    constructor(slider, slide) {
      this.slider = slider;
      this.slide = slide;
      this.element = $(document.createElement('div'))
        .addClass('f3-slider-bullet')
        .appendTo(this.slider.bulletContainer)
        .click(this.slide.goTo.bind(this.slide));
      new Hoverable(this.element);
      if (this.slide.active) {
        this.element.addClass('active');
      }
    }
  }

  return function(options) {
    return new F3Slider(options);
  };
})();
