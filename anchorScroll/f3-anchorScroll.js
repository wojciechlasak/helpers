/*scroll*/
(function() {
  window.scrollEnable = true;

  function createObjects(wraper, section, sectionNav) {
    const array = [];
    $(wraper)
      .find(section)
      .map(function() {
        const title = $(this).data('anchor');
        const anchor = $(sectionNav).filter(function() {
          return $(this).data('ref') === title;
        });
        array.push(new Section($(this), anchor, title, $(this).find('img')));
      });
    return array;
  }

  function Section(t, anchor, title, img) {
    this.t = t;
    this.title = title;
    this.anchor = anchor;
    this.img = img;

    this.t.on(
      'click',
      function() {
        if (offer === true) {
          $('#offer-nav, #offer-nav-mobile-arrow').removeClass('nav-show');
        }
        else if (career === true) {
          $('#career-nav, #career-nav-mobile-arrow').removeClass('nav-show');
        }
        if (!$(this.t).hasClass('disabled-scroll')) {
          let top = this.anchor.offset().top;
          top = Math.min(top - 50, top - f3.h / 2 + this.anchor.height() / 2, $(document).height() - f3.h);
          top = Math.max(top, 50);
          $('html, body')
            .stop()
            .animate(
              {
                scrollTop: top,
              },
              500
            );
        }
      }.bind(this)
    );
  }

  let sectionArray = [];
  let offer = false;
  let career = false;
  if ($('#offer-nav').length !== 0) {
    sectionArray = createObjects(
      '#offer-nav',
      '.offer-nav-single',
      '.offer-anchor'
    );
    offer = true;
  }
  else if ($('#shops-list-single-container').length !== 0) {
    sectionArray = createObjects(
      '#shops-list-single-container',
      '.shops-list-street-container',
      '.shop-single'
    );
  }
  else if ($('#career-nav').length !== 0) {
    sectionArray = createObjects(
      '#career-list, #career-nav',
      '.career-list-single, .career-nav-single',
      '.career-single'
    );
    career = true;
  }

  Section.prototype.resize = function() {
    this.h = this.anchor.offset().top;
    this.size = this.anchor.height();
  };

  function sectionResize() {
    for (let i = 0; i < sectionArray.length; i++) {
      sectionArray[i].resize();
    }
    sectionCurrent();
  }

  function sectionCurrent() {
    if (scrollEnable) {
      const bestIndex = sectionArray.reduce(
        function(
          bestIndex,
          current,
          i,
          arr
        ) {
          return Math.abs(f3.s + f3.h / 2 - current.h - current.size / 2) <
          Math.abs(f3.s + f3.h / 2 - arr[bestIndex].h - arr[bestIndex].size / 2)
            ? i
            : bestIndex;
        },
        0
      );
      sectionArray.map(function(current, i) {
        current.t.removeClass('current');
      });
      if (sectionArray[bestIndex] !== 0) {
        sectionArray[bestIndex].t.addClass('current');
      }
      if (offer === true) {
        $('#offer-nav-mobile-top-img').html(sectionArray[bestIndex].img.clone());
        $('#offer-nav-mobile-top-title').html(sectionArray[bestIndex].title);
      }
      else if (career === true) {
        $('#career-nav-mobile-top-title').html(sectionArray[bestIndex].title);
      }
    }
  }

  sectionResize();

  $(window)
    .load(sectionCurrent)
    .on('scroll', throttle(100, sectionCurrent));

  window.addEventListener('afterLayoutChange', sectionResize);
})();
