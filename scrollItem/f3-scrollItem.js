/**
 * create new scroll item
 * @param {selector} element element to scroll
 * @param {object} options extra options
 * @param {function} options.onScroll function(scrollItem)
 * @param {function} options.onStateChange function(prop, value, scrollItem)
 * @returns {object} scrollItem
 */
const createScrollItem = (function() {
  class ScrollItem {
    constructor(element, options) {
      this.el = $(element);
      this.offset = 0;
      this.height = 0;
      this.addClasses = options.addClasses;
      this.isAboveScreen = false;
      this.isCrossingScreenTop = false;
      this.isCrossingScreenBottom = false;
      this.isBelowScreen = false;
      this.isOnScreen = false;
      this.options = options;
      this.onStateChange = this.options.onStateChange;
      this.onScroll = this.options.onScroll;
    }
    _onResize() {
      this.offset = this.el.offset().top;
      this.height = this.el.outerHeight();
      this._onScroll();
    }
    _onScroll() {
      this.checkScreenRelation();
      if (this.onScroll !== void 0) {
        this.onScroll.call(this, this);
      }
    }
    checkScreenRelation() {
      if (this.offset + this.height < f3.s) {
        this.setPropClass('AboveScreen', true);
        this.setPropClass('CrossingScreenTop', false);
        this.setPropClass('CrossingScreenBottom', false);
        this.setPropClass('BelowScreen', false);
        this.setPropClass('OnScreen', false);
        return;
      }
      if (this.offset > f3.s + f3.h) {
        this.setPropClass('AboveScreen', false);
        this.setPropClass('CrossingScreenTop', false);
        this.setPropClass('CrossingScreenBottom', false);
        this.setPropClass('BelowScreen', true);
        this.setPropClass('OnScreen', false);
        return;
      }
      this.setPropClass('AboveScreen', false);
      this.setPropClass('BelowScreen', false);
      this.setPropClass('OnScreen', true);
      this.setPropClass('CrossingScreenTop', this.offset < f3.s &&
        this.offset + this.height > f3.s);
      this.setPropClass('CrossingScreenBottom', this.offset < f3.s + f3.h &&
        this.offset + this.height > f3.s + f3.h);
    }
    setPropClass(prop, value) {
      if (this['is' + prop] !== value) {
        this['is' + prop] = value;
        if (this.addClasses) {
          if (value)
            this.el.addClass(prop);
          else
            this.el.removeClass(prop);
        }
        if (this.onStateChange !== void 0) {
          this.onStateChange.call(this, prop, value, this);
        }
      }
    }
    screenPos(heightOffset) {
      if (heightOffset === void 0)
        heightOffset = 0;
      return (this.offset + this.height * heightOffset - f3.s) / f3.h;
    }
  }

  const scrollItemCollection = [];

  window.addEventListener('afterLayoutChange', function() {
    scrollItemCollection.map(function(e) {
      e._onResize();
    });
  });

  window.addEventListener('scroll', frameThrottle(function() {
    scrollItemCollection.map(function(e) {
      e._onScroll();
    });
  }));

  return function(element, options) {
    if (options === undefined) options = {};
    const scrollItem = new ScrollItem(element, options);
    scrollItemCollection.push(scrollItem);
    return scrollItem;
  };
})();
