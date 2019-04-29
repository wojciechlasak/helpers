let lastScrollPos = 0;

function Sticky(e) {
  this.el = $(e);
  this.guide = $(this.el.data('guide'));
  this.guideOffset = 0;
  this.guideHeight = 0;
  this.height = 0;
  this.isFixed = true;
  this.lastTop = 0; // last value saved to css
  this.lastPos = 0; // last recorder position

  this.onResize = function() {
    this.guideOffset = this.guide.offset().top;
    this.guideHeight = this.guide.outerHeight();
    this.height = this.el.outerHeight();
    const newPos = Math.min(Math.max(this.guideOffset - f3.s, 0), this.guideOffset + this.guideHeight - this.height - f3.s);
    this.el.css({
      top: newPos,
    });
    this.lastTop = newPos;
    this.lastPos = newPos;
    this.onScroll();
  };

  this.onScroll = function() {
    let newPos = this.lastPos;
    let isFixed = true;
    // if scrolling down
    if (f3.s > lastScrollPos) {
      // if top of the guide is below the top of the window
      if (this.guideOffset > f3.s) {
        newPos = this.guideOffset;
        isFixed = false;
      }
      // if top of the guide is above the top of the window
      else {
        // if the guide's bottom is above the window's bottom
        if (this.guideOffset + this.guideHeight < f3.s + f3.h) {
          // if the sticky's bottom is above than the guide's bottom
          if (f3.s + this.height < this.guideOffset + this.guideHeight) {
            newPos = 0;
          }
          // if the sticky's bottom is below the guide's bottom
          else {
            newPos = this.guideOffset + this.guideHeight - this.height;
            isFixed = false;
          }
        }
        // if the guide's bottom is below the window's bottom
        else {
          // if the sticky's height is smaller than the window's height
          if (this.height < f3.h) {
            newPos = 0;
          }
          // if sticky's height is bigger than the window's height
          else {
            // if the bottom of the sticky if below the bottom of the window
            if (this.lastPos + this.height > f3.h) {
              newPos = this.lastPos + lastScrollPos;
              isFixed = false;
            }
            // if the bottom of the sticky if above the bottom of the window
            else {
              newPos = f3.h - this.height;
            }
          }
        }
      }
    }
    // if scrolling up
    else if (f3.s < lastScrollPos) {
      // if the top of the sticky is above the top of the screen
      if (this.lastPos < 0) {
        newPos = this.lastPos + lastScrollPos;
        isFixed = false;
      }
      // if the top of the sticky is below the top of the screen
      else {
        // if the top of the guide is below the top of the screen
        if (this.guideOffset > f3.s) {
          newPos = this.guideOffset;
          isFixed = false;
        }
        // if the top of the guide is above the top of the screen
        else {
          newPos = 0;
        }
      }
    }

    // apply position
    let css = {};
    if (isFixed) {
      if (!this.isFixed) {
        css.position = 'fixed';
        this.isFixed = true;
      }
    }
    else {
      if (this.isFixed) {
        css.position = 'absolute';
        this.isFixed = false;
      }
    }
    if (Math.abs(this.lastTop - newPos) > 0.5) {
      css.top = newPos;
      this.lastTop = newPos;
    }
    if (Object.getOwnPropertyNames(css).length) {
      this.el.css(css);
    }
    if (!this.isFixed) {
      newPos -= f3.s;
    }
    this.lastPos = newPos;
  };
}

let stickies = $('.sticky').map(function(i, e) {
  return new Sticky(e);
});

$(window)
  .on('scroll', throttle(16, function() {
    stickies.map(function(i, e) {e.onScroll();});
    lastScrollPos = f3.s;
  }));

window.addEventListener('afterLayoutChange', function() {
  stickies.map(function(i, e) {e.onResize();});
});


window.addEventListener('wpcf7invalid', function() {
  setTimeout(function() {
    stickies.map(function(i, e) {e.onResize();});
  }, 100);
});

window.addEventListener('wpcf7mailsent', function() {
  setTimeout(function() {
    stickies.map(function(i, e) {e.onResize();});
  }, 100);
});

window.addEventListener('wpcf7mailfailed', function() {
  setTimeout(function() {
    stickies.map(function(i, e) {e.onResize();});
  }, 100);
});
