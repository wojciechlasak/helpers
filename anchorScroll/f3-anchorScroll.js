const createAnchorScroll = (function() {
  const navScrollCollection = [];
  let wraperNav;

  class NavScroll {
    constructor($t, id, anchor, title, img, options) {
      this.$t = $t;
      this.id = id;
      this.anchor = anchor;
      this.title = title;
      this.img = img;
      this.scrollItem = createScrollItem(this.anchor);
      this.disable = false;

      this.options = options;
      this.onScroll = this.options.onScroll;

      this.$t.on('click', () => {
        goTo(this.id);
      });
    }
  }

  function goTo(id) {
    let scrollItem = navScrollCollection[id].scrollItem;
    let anchorTop = scrollItem.offset;
    anchorTop = Math.min(
      anchorTop - 50,
      anchorTop - f3.h / 2 + scrollItem.height / 2,
      f3.documentH - f3.h
    );
    anchorTop = Math.max(anchorTop, 0);
    $('html, body')
      .stop()
      .animate(
        {
          scrollTop: anchorTop,
        },
        500
      );
  }

  function checkIsAllOnScreen() {
    let indexOfLast = navScrollCollection.length - 1;
    if (
      Math.abs(navScrollCollection[0].scrollItem.offset -
          navScrollCollection[indexOfLast].scrollItem.offset -
          navScrollCollection[indexOfLast].scrollItem.height / 2) < f3.h
    ) {
      if (!this.disable) {
        this.disable = true;
        wraperNav.addClass('disable');
      }
    }
    else {
      if (this.disable) {
        this.disable = false;
        wraperNav.removeClass('disable');
      }
    }
  }

  function setCurrentAnchor() {
    const bestIndex = navScrollCollection.reduce(
      function(
        bestIndex,
        current,
        i,
        arr
      ) {
        return Math.abs(current.scrollItem.screenPos(0.5) - 0.5) <
        Math.abs(arr[bestIndex].scrollItem.screenPos(0.5) - 0.5)
          ? i
          : bestIndex;
      },
      0
    );
    navScrollCollection.map(function(current, i) {
      current.$t.removeClass('current');
    });
    if (navScrollCollection[bestIndex] !== 0) {
      navScrollCollection[bestIndex].$t.addClass('current');
    }
    if (this.onScroll !== undefined) {
      this.onScroll.call(this, this);
    }
  }

  $(window)
    .on('load', () => {
      setCurrentAnchor();
      checkIsAllOnScreen();
    })
    .on('scroll', throttle(100, setCurrentAnchor))
    .on('resize', checkIsAllOnScreen);

  window.addEventListener('afterLayoutChange', setCurrentAnchor);

  return function(_wraperNav, sectionNav, section, options) {
    wraperNav = $(_wraperNav);
    wraperNav.find(sectionNav).map(function() {
      const title = $(this).data('anchor');
      const anchor = $(section).filter(function() {
        return $(this).data('ref') === title;
      });
      navScroll = new NavScroll(
        $(this),
        navScrollCollection.length,
        anchor,
        title,
        $(this).find('img'),
        options
      );
      navScrollCollection.push(navScroll);
    });
    return navScroll;
  };
})();

createAnchorScroll('#nav', '.nav-single', '.anchor'); //delete on production
