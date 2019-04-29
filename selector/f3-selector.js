(function() {
  var tt = this;
  function Select(obj, id) {
    var t = this;
    t.obj = $(obj);
    t.identifier = t.obj.attr('id');
    t.id = id;
    t.expanded = false;
    t.selected = 0;
    t.options = t.obj.find('.select-option').map(function(i, e) {
      return new Option(e, t, i);
    });
    t.overlay = $(document.createElement('div')).addClass('select-overlay');
    t.overlay.click(function(e) {
      t.expand();
    });
    t.obj.append(t.overlay);
    t.adjuster = $(document.createElement('div')).addClass('select-adjuster');
    t.obj.prepend(t.adjuster);
    t.sumH = 0;
    t.timeouts = [];

    t.obj.find('.arrow-down').click(function() {
      if (!t.expanded) {
        t.expand();
      }
    });

    t.resize = function() {
      t.sumH = 0;
      t.options.map(function(i, e) {
        e.resize();
      });
      t.shrink();
    };
    t.select = function(id) {
      t.options[t.selected].obj.removeClass('checked');
      t.selected = id;
      t.options[t.selected].obj.addClass('checked');
      t.shrink();
    };
    t.adjust = function() {
      t.obj.css({
        height:	t.options[t.selected].height,
      });
      t.obj.parent().css({
        height:	t.options[t.selected].height,
      });
      t.adjuster.css({
        marginTop:	-t.options[t.selected].offset,
      });
    };
    t.expand = function() {
      t.obj.css({
        height:	t.sumH,
      });
      t.adjuster.css({
        marginTop:	0,
      });
      t.obj.addClass('expanded');
      t.obj.parents('.select-outer').addClass('expanded');
      clearTimeout(t.timeouts[0]);
      t.timeouts[0] = setTimeout(function() {
        $(document).on('click.f3Selector' + t.id, function() {
          t.shrink();
        });
      }, 300);
      t.expanded = true;
    };
    t.shrink = function() {
      clearTimeout(t.timeouts[1]);
      t.timeouts[1] = setTimeout(function() {
        t.obj.removeClass('expanded');
        t.obj.parents('.select-outer').removeClass('expanded');
        $(document).off('.f3Selector' + t.id);
      }, 300);
      t.adjust();
      t.expanded = false;
    };

    t.options.map(function(i, e) {
      if (e.obj.hasClass('checked')) {
        t.select(e.id);
      }
    });
  }

  function Option(obj, parent, id) {
    var t = this;
    t.obj = $(obj);
    t.identifier = t.obj.data('value');
    t.papa = parent;
    t.id = id;
    t.height = 0;
    t.offset = 0;

    t.obj.click(function() {
      t.papa.select(t.id);
    });

    t.resize = function() {
      t.height = t.obj.outerHeight();
      t.offset = t.papa.sumH;
      t.papa.sumH += t.height;
    };
  }

  tt.selects = $('.select-wrap').map(function(i, e) {
    return new Select(e, i);
  });

  function resize() {
    tt.selects.map(function(i, e) {
      e.resize();
    });
  }

  window.addEventListener('layoutChange', resize);
})();
