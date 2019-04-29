// lightbox
(function() {
  function showLb(i, e) {
    var t = this;
    t.el = $(e);
    t.id = i;
    t.src = t.el.data('full-image');
    t.wasLoaded = false;

    t.el.click(function() {
      t.load();
    });
    t.resize = function() {
      if ($('#lb-container').hasClass('active')) t.load();
      else closeLb();
    };

    t.load = function() {
      currentLb = t.id;
      checkLb();
      $('#lb-container').addClass('active');
      var h = t.el.data('height');
      var w = t.el.data('width');
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
      lb.addClass('loading').css({
        left: (f3.w - w) / 2,
        top: (f3.h - h) / 2,
        width: w,
        height: h,
      });
      if (t.wasLoaded) {
        t.show();
      }
      else {
        lb.find('.lazy-cake-temp')
          .attr({src: t.src})
          .load(function() {
            if (currentLb === t.id) {
              t.show();
            }
            t.wasLoaded = true;
          });
      }
    };

    t.show = function() {
      lb.find('.cake').css({
        backgroundImage: 'url(' + t.src + ')',
      });
      setTimeout(function() {
        if (currentLb === t.id) {
          lb.find('.cake').css({
            opacity: 1,
          });
          lb.removeClass('loading');
        }
      }, 300);
    };
  }
  var lb = $('#lb');
  var currentLb = 0;
  var isLeftHidden = false;
  var isRightHidden = false;
  var slbs = $('.show-lb').map(function(i, e) {
    return new showLb(i, e);
  });

  $('#lb-container').click(closeLb);

  function closeLb() {
    $('#lb-container').removeClass('active');
    setTimeout(function() {
      if (!$('#lb-container').hasClass('active')) {
        h = 100;
        w = 100;
        lb.css({
          left: (f3.w - w) / 2,
          top: (f3.h - h) / 2,
          width: w,
          height: h,
        });
        resetLb();
      }
    }, 300);
  }
  function resetLb() {
    lb.find('.cake').css({
      backgroundImage: 'none',
    });
  }
  function nextLb() {
    checkLb();
    if ($('#lb-container').hasClass('active') && !isRightHidden) {
      resetLb();
      slbs[currentLb + 1].load();
    }
  }
  function prevLb() {
    checkLb();
    if ($('#lb-container').hasClass('active') && !isLeftHidden) {
      resetLb();
      slbs[currentLb - 1].load();
    }
  }

  function checkLb() {
    if (currentLb + 1 === slbs.length) {
      isRightHidden = true;
      $('#lb-right').addClass('hidden');
    }
    else if (isRightHidden) {
      isRightHidden = false;
      $('#lb-right').removeClass('hidden');
    }
    if (currentLb === 0) {
      isLeftHidden = true;
      $('#lb-left').addClass('hidden');
    }
    else if (isLeftHidden) {
      isLeftHidden = false;
      $('#lb-left').removeClass('hidden');
    }
  }

  $(document).keyup(function(e) {
    if (e.keyCode === 27) closeLb();
    else if (e.keyCode === 37) prevLb();
    else if (e.keyCode === 39) nextLb();
  });
  $('#lb-left').click(function(e) {
    e.stopPropagation();
    prevLb();
  });
  $('#lb-right').click(function(e) {
    e.stopPropagation();
    nextLb();
  });

  $(window).on('wheel', function(e) {
    if (e.originalEvent.deltaX > 0) prevLb();
    if (e.originalEvent.deltaX < 0) nextLb();
  });

  window.addEventListener('layoutChange', function() {
    slbs.map(function(i, e) {
      e.resize();
    });
  });
})();
