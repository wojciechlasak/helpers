(function() {
  function windowSize(el) {
    this.el = $(el);
    this.width = 0;
    this.lastHeight = 0;
    this.forceSize = this.el.data('force-size') === true;
    this.maxRatio = this.el.data('max-ratio');
  }

  function windowSizesResize() {
    windowSizes.map(function() {
      this.width = this.el.width();
      let newHeight = f3.h;
      if (this.maxRatio) {
        newHeight = Math.min(newHeight, this.width / this.maxRatio);
      }
      if (this.forceSize) {
        this.el.css({height: 'auto'});
        newHeight = Math.max(this.el.height(), newHeight);
        this.el.css({height: newHeight});
      }
      else {
        this.el.css({minHeight: newHeight});
      }
      this.lastHeight = newHeight;
    });
  }

  const windowSizes = $('.window-size').map(function() {
    return new windowSize(this);
  });

  window.addEventListener('layoutChange', windowSizesResize);
})();
