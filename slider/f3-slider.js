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
      this.onMouseMove = this.onMouseMove.bind(this);
      this.endMouseMove = this.endMouseMove.bind(this);
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
        mouseDrag: false,               // allows slider to be dragged with the mouse
        useKeys: false,                 // changes slides on arrow keys, can be changed later
        // wrap                         selector of the slider wrap
        // arrowPrev                    selector of the up arrow, searched in the whole document
        // arrowNext                    analogous
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
      this.isarrowPrevActive = true;
      this.isarrowNextActive = true;
      this.arrowPrev = $(this.options.arrowPrev);
      this.arrowNext = $(this.options.arrowNext);
      if (this.options.arrowNext === undefined) {
        this.arrowNext = this.wrap.find('.arrow-down');
      }
      if (this.options.arrowPrev === undefined) {
        this.arrowPrev = this.wrap.find('.arrow-up');
      }

      if (this.arrowNext.length > 0) {
        this.arrowNext.on({
          click: this.nextSlide.bind(this),
          touchstart: event => event.stopPropagation(),
        });
        new Hoverable(this.arrowNext);
      }
      if (this.arrowPrev.length > 0) {
        this.arrowPrev.on({
          click: this.prevSlide.bind(this),
          touchstart: event => event.stopPropagation(),
        });
        new Hoverable(this.arrowPrev);
      }
      $(window).on('keydown', event => {
        if (!this.options.useKeys) return;
        if (
          (!this.options.isVertical && event.which === 39) ||
          (this.options.isVertical && event.which === 40)
        ) {
          this.nextSlide();
        }
        else if (
          (!this.options.isVertical && event.which === 37) ||
          (this.options.isVertical && event.which === 38)
        ) {
          this.prevSlide();
        }
      });
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
        this.dragStart = {
          x: event.originalEvent.changedTouches[0].pageX,
          y: event.originalEvent.changedTouches[0].pageY,
        };
        this.onMoveStart();
        window.addEventListener('touchend', this.endDrag);
        window.addEventListener('touchmove', this.onDrag);
      });
      if (this.options.mouseDrag) {
        this.wrap.on('mousedown', event => {
          if (!this.isEnabled) return;
          event.preventDefault();
          if (this.isSliding) return;
          this.dragStart = {
            x: event.pageX,
            y: event.pageY,
          };
          this.onMoveStart();
          window.addEventListener('mouseup', this.endMouseMove);
          window.addEventListener('mousemove', this.onMouseMove);
        });
      }
    }

    onMoveStart() {
      this.isDragged = true;
      this.lastDrag = {
        lastSaveId: 0,
        values: [
          {
            x: this.dragStart.x,
            y: this.dragStart.y,
          },
        ],
      };
    }

    onDrag(event) {
      const currentPos = {
        x: event.changedTouches[0].pageX,
        y: event.changedTouches[0].pageY,
      };
      this.onMove(currentPos);
    }

    onMouseMove(event) {
      const currentPos = {
        x: event.pageX,
        y: event.pageY,
      };
      this.onMove(currentPos);
    }

    onMove(currentPos) {
      this.lastDrag.lastSaveId = (this.lastDrag.lastSaveId + 1) % 10;
      this.lastDrag.values[this.lastDrag.lastSaveId] = currentPos;
      const axis = this.options.isVertical ? 'y' : 'x';
      const diff = currentPos[axis] - this.dragStart[axis];
      this.position =
        this.slides[this.currentSlideId].offset - diff - this.slideOffset;

      if (this.options.isVertical) {
        this.bar.css({
          top: -this.position,
        });
      }
      else {
        this.bar.css({
          left: -this.position,
        });
      }
    }

    endDrag(event) {
      const dragEnd = {
        x: event.changedTouches[0].pageX,
        y: event.changedTouches[0].pageY,
      };
      this.endMove(dragEnd);
      window.removeEventListener('touchend', this.endDrag);
      window.removeEventListener('touchmove', this.onDrag);
    }

    endMouseMove(event) {
      const dragEnd = {
        x: event.pageX,
        y: event.pageY,
      };
      this.endMove(dragEnd);
      window.removeEventListener('mouseup', this.endMouseMove);
      window.removeEventListener('mousemove', this.onMouseMove);
    }

    endMove(dragEnd) {
      this.isDragged = false;
      const axis = this.options.isVertical ? 'y' : 'x';
      let oldestSavedId = 0;
      if (this.lastDrag.values.length === 10) {
        oldestSavedId = (this.lastDrag.lastSaveId + 1) % 10;
      }

      let currentPos = this.slides[this.currentSlideId].offset;
      currentPos -= dragEnd[axis] - this.dragStart[axis];

      let changedSlide = false;
      // previous position
      if (dragEnd[axis] > this.dragStart[axis]) {
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
          this.slideOffset += dragEnd[axis] - this.dragStart[axis];
        }
      }
      // next position
      else if (dragEnd[axis] < this.dragStart[axis]) {
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
          this.slideOffset += dragEnd[axis] - this.dragStart[axis];
        }
      }
      // same position
      if (!changedSlide) {
        let velocity = dragEnd[axis] - this.lastDrag.values[oldestSavedId][axis];
        this.slideOffset += velocity * 2;
        this.applyPos();
      }
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
        if (this.isarrowNextActive) {
          this.arrowNext.addClass('disabled');
          this.isarrowNextActive = false;
        }
      }
      else if (!this.isarrowNextActive) {
        this.arrowNext.removeClass('disabled');
        this.isarrowNextActive = true;
      }

      if (this.currentSlideId === 0) {
        if (this.isarrowPrevActive) {
          this.arrowPrev.addClass('disabled');
          this.isarrowPrevActive = false;
        }
      }
      else if (!this.isarrowPrevActive) {
        this.arrowPrev.removeClass('disabled');
        this.isarrowPrevActive = true;
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

// examples
createF3Slider({
  wrap: '#slider-1',
  slideOnWheel: true,
  mouseDrag: true,
  useKeys: true,
  arrowPrev: '.prev',
  arrowNext: '.next',
});
createF3Slider({
  wrap: '#slider-2',
  isVertical: true,
  slideOnWheel: true,
  mouseDrag: true,
  useKeys: true,
  arrowPrev: '.prev',
  arrowNext: '.next',
});
