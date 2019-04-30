const createLightbox = (function() {
  class SingleLightbox {
    constructor(i, e, parent) {
      this.parent = parent;
      this.$element = $(e);
      this.id = i;
      this.imageSrc = this.$element.data('full-image');
      this.wasLoaded = false;

      this.$element.on('click', () => {
        this.parent.active();
        this.load();
      });
    }

    load() {
      this.parent.currentLb = this.id;
      this.parent.checkLb();
      let h = this.$element.data('height');
      let w = this.$element.data('width');
      if (w / h > f3.w / f3.h) {
        h *= f3.w / w;
        w = f3.w;
      }
      else {
        w *= f3.h / h;
        h = f3.h;
      }
      h *= 0.95;
      w *= 0.95;
      this.parent.$containerIn.addClass('loading').css({
        left: (f3.w - w) / 2,
        top: (f3.h - h) / 2,
        width: w,
        height: h,
      });
      if (this.wasLoaded) {
        this.show();
      }
      else {
        this.parent.$containerIn
          .find('.lazy-cake-temp')
          .attr({src: this.imageSrc})
          .load(() => {
            if (this.parent.currentLb === this.id) {
              this.show();
            }
            this.wasLoaded = true;
          });
      }
    }

    resize() {
      if (this.parent.onScreen) this.load();
      else this.parent.deactive();
    }

    show() {
      this.parent.$containerIn.find('.cake').css({
        backgroundImage: 'url(' + this.imageSrc + ')',
      });
      setTimeout(() => {
        if (this.parent.currentLb === this.id) {
          this.parent.$containerIn.find('.cake').css({
            opacity: 1,
          });
          this.parent.$containerIn.removeClass('loading');
        }
      }, 300);
    }
  }

  class Lightbox {
    constructor(options) {
      this.options = options;
      this.$container = $(this.options.container);
      this.$containerIn = this.$container.find('.lb');
      this.$items = $(this.options.items);
      this.arrows = this.options.arrows;
      this.onChange = this.options.onChange;
      this.onScreen = false;
      this.lightboxCollection = [];

      this.currentLb = 0;
      if (this.arrows) {
        this.arrowLeft = this.$container.find('.arrow-left');
        this.arrowRight = this.$container.find('.arrow-right');
        this.LeftHidden = false;
        this.isRightHidden = false;
      }

      this.$items.map((i, e) => {
        let singleLb = new SingleLightbox(i, e, this);
        this.lightboxCollection.push(singleLb);
      });

      this.$container.on('click', () => {
        this.deactive();
      });

      if (this.arrows) {
        $(document).on('keyup', e => {
          if (e.keyCode === 27) this.deactive();
          else if (e.keyCode === 37) this.prevLb();
          else if (e.keyCode === 39) this.nextLb();
        });

        this.arrowLeft.click(e => {
          e.stopPropagation();
          this.prevLb();
        });
        this.arrowRight.click(e => {
          e.stopPropagation();
          this.nextLb();
        });

        $(window).on('wheel', e => {
          if (e.originalEvent.deltaX > 0) this.prevLb();
          if (e.originalEvent.deltaX < 0) this.nextLb();
        });
      }

      window.addEventListener('layoutChange', () => {
        this.lightboxCollection.map(function(e, i) {
          e.resize();
        });
      });
    }

    active() {
      if (!this.onScreen) {
        this.onScreen = true;
        this.$container.addClass('active');
      }
    }

    deactive() {
      if (this.onScreen) {
        this.onScreen = false;
        this.$container.removeClass('active');
      }
    }

    resetLb() {
      this.$containerIn.find('.cake').css({
        backgroundImage: 'none',
      });
    }

    nextLb() {
      this.checkLb();
      if (this.onScreen && !this.isRightHidden) {
        this.lightboxCollection[this.currentLb + 1].load();
      }
    }
    prevLb() {
      this.checkLb();
      if (this.onScreen && !this.isLeftHidden) {
        this.lightboxCollection[this.currentLb - 1].load();
      }
    }

    checkLb() {
      if (this.arrows) {
        if (this.currentLb + 1 === this.lightboxCollection.length) {
          this.isRightHidden = true;
          this.arrowRight.addClass('hidden');
        }
        else if (this.isRightHidden) {
          this.isRightHidden = false;
          this.arrowRight.removeClass('hidden');
        }
        if (this.currentLb === 0) {
          this.isLeftHidden = true;
          this.arrowLeft.addClass('hidden');
        }
        else if (this.isLeftHidden) {
          this.isLeftHidden = false;
          this.arrowLeft.removeClass('hidden');
        }
      }
    }
  }

  return function(options) {
    const lb = new Lightbox(options);
    return lb;
  };
})();

createLightbox({
  items: '.element-lb',
  container: '#lb-container',
  onChange: function() {},
  arrows: true,
}); //delete on production

createLightbox({
  items: '.tmep',
  container: '#lb-container2',
  onChange: function() {},
  arrows: false,
}); //delete on production

createLightbox({
  items: '.element-lb3',
  container: '#lb-container3',
  onChange: function() {},
  arrows: true,
}); //delete on production
