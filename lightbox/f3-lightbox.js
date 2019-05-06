const createLightbox = (function() {
  class SingleLightbox {
    constructor(i, e, parent) {
      this.parent = parent;
      this.$element = $(e);
      this.id = i;
      this.onScreen = false;

      this.$element.on('click', () => {
        this.parent.active(this.id);
      });
    }
  }

  class Lightbox {
    constructor(options) {
      this.options = options;
      this.$container = $(this.options.container);
      this.$containerIn = this.$container.find('.lb');
      this.$items = $(this.options.items);
      this.hasArrows = this.options.hasArrows === undefined ? false : this.options.hasArrows;
      this.hasExit = this.options.hasExit === undefined ? false : this.options.hasExit;
      this.onScreen = false;
      this.lightboxCollection = [];
      this.currentLb = 0;

      if (this.hasArrows) {
        this.arrowLeft = this.$container.find('.arrow-left');
        this.arrowRight = this.$container.find('.arrow-right');
        this.isLeftHidden = false;
        this.isRightHidden = false;
      }

      if (this.hasExit) {
        this.exit = this.$container.find('.close-lb');

        this.exit.on('click', () => {
          this.deactive();
        });
      }

      this.$items.map((i, e) => {
        let singleLb = new SingleLightbox(i, e, this);
        this.lightboxCollection.push(singleLb);
      });

      this.$container.on('click', () => {
        this.deactive();
      });

      this.$containerIn.on('click', e => {
        e.stopPropagation();
      });

      $(document).on('keyup', e => {
        if (e.keyCode === 27) this.deactive();
      });

      if (this.hasArrows) {
        $(document).on('keyup', e => {
          if (e.keyCode === 37) this.prevLb();
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
      }

      window.addEventListener('layoutChange', () => {
        this.resize();
      });
    }

    active(id) {
      if (!this.onScreen) {
        this.onScreen = true;
        this.$container.removeClass('hidden');
        setTimeout(() => {
          this.$container.addClass('active');
        }, 0);

        this.currentLb = id;
        this.checkArrows();

        if (this.options.onActivate !== undefined) {
          this.options.onActivate.call(this.lightboxCollection[id]);
        }
      }
    }

    deactive() {
      if (this.onScreen) {
        this.onScreen = false;
        this.$container.removeClass('active');
        setTimeout(() => {
          this.$container.addClass('hidden');
        }, 300);
        if (this.options.onDeactive !== undefined) {
          this.options.onDeActivate.call(this);
        }
      }
    }

    change(id) {
      this.lightboxCollection[this.currentLb].onScreen = false;
      this.currentLb = id;
      this.checkArrows();

      if (this.options.onChange !== undefined) {
        this.options.onChange.call(this.lightboxCollection[this.currentLb]);
      }
    }

    resize() {
      if (this.options.onResize !== undefined) {
        this.options.onResize.call(this.lightboxCollection[this.currentLb]);
      }
    }

    nextLb() {
      if (this.onScreen && !this.isRightHidden) {
        this.change(this.currentLb + 1);
      }
    }
    prevLb() {
      if (this.onScreen && !this.isLeftHidden) {
        this.change(this.currentLb - 1);
      }
    }

    checkArrows() {
      if (this.hasArrows && this.onScreen) {
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

function onImageChange() {
  var imageSrc =
    imageSrc === undefined ? this.$element.data('full-image') : imageSrc;

  this.parent.$containerIn.find('.cake').css({
    backgroundImage: 'none',
  });

  this.parent.$containerIn.addClass('loading');

  this.parent.$containerIn
    .find('.lazy-cake-temp')
    .attr({src: imageSrc})
    .load(() => {
      this.parent.$containerIn.find('.cake').css({
        backgroundImage: 'url(' + imageSrc + ')',
      });
      setTimeout(() => {
        if (this.parent.currentLb === this.id) {
          this.parent.$containerIn.find('.cake').css({
            opacity: 1,
          });
          this.parent.$containerIn.removeClass('loading');
        }
      }, 300);
    });
  this.onScreen = true;
}

function onImageActivate() {
  onImageResize.call(this);
  onImageChange.call(this);
}

function onImageResize() {
  var h = h === undefined ? this.$element.data('height') : h;
  var w = w === undefined ? this.$element.data('width') : w;

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
  this.parent.$containerIn.css({
    left: (f3.w - w) / 2,
    top: (f3.h - h) / 2,
    width: w,
    height: h,
  });
}

function onTextChange() {
  var $texts =
    $texts === undefined ? this.parent.$container.find('.text') : $texts;

  $texts.removeClass('show');
  this.parent.$container.find(`#text-${this.id + 1}`).addClass('show');
}

createLightbox({
  items: '.element-lb1',
  container: '#lb-container1',
  onChange: onImageChange,
  onActivate: onImageActivate,
  //onDeactivate: function() {},
  onResize: onImageResize,
  hasArrows: true,
}); //delete on production

createLightbox({
  items: '.element-lb2',
  container: '#lb-container2',
  onChange: onTextChange,
  onActivate: onTextChange,
  hasArrows: true,
  hasExit: true,

}); //delete on production

createLightbox({
  items: '.element-lb3',
  container: '#lb-container3',
  onChange: onImageChange,
  onActivate: onImageActivate,
  onResize: onImageResize,
  hasArrows: true,
}); //delete on production
