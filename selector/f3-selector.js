/**
 * wraper '.select-wrap'
 * singleElement '.select-option'
 */

(function() {
  class Select {
    constructor(obj, id) {
      this.obj = $(obj);
      this.identifier = this.obj.attr('id');
      this.id = id;
      this.expanded = false;
      this.selected = 0;
      this.options = this.obj.find('.select-option')
        .map((index, element) => new Option(element, this, index));
      this.overlay = $(document.createElement('div'))
        .addClass('select-overlay');
      this.overlay.click(event => {
        this.expand();
      });
      this.obj.append(this.overlay);
      this.adjuster = $(document.createElement('div'))
        .addClass('select-adjuster');
      this.obj.prepend(this.adjuster);
      this.sumH = 0;
      this.timeouts = [];

      this.obj.find('.arrow-down').click(() => {
        if (!this.expanded) {
          this.expand();
        }
      });

      this.options.map((index, element) => {
        if (element.obj.hasClass('checked')) {
          this.select(element.id);
        }
      });
    }

    resize() {
      this.sumH = 0;
      this.options.map(function(i, e) {
        e.resize();
      });
      this.shrink();
    }

    select(id) {
      this.options[this.selected].obj.removeClass('checked');
      this.selected = id;
      this.options[this.selected].obj.addClass('checked');
      this.shrink();
    }

    adjust() {
      this.obj.css({
        height:	this.options[this.selected].height,
      });
      this.obj.parent().css({
        height:	this.options[this.selected].height,
      });
      this.adjuster.css({
        marginTop:	-this.options[this.selected].offset,
      });
    }

    expand() {
      this.obj.css({
        height:	this.sumH,
      });
      this.adjuster.css({
        marginTop:	0,
      });
      this.obj.addClass('expanded');
      clearTimeout(this.timeouts[0]);
      this.timeouts[0] = setTimeout(() => {
        $(document).on('click.f3Selector' + this.id, () => this.shrink());
      }, 300);
      this.expanded = true;
    }

    shrink() {
      clearTimeout(this.timeouts[1]);
      this.timeouts[1] = setTimeout(() => {
        this.obj.removeClass('expanded');
        $(document).off('.f3Selector' + this.id);
      }, 300);
      this.adjust();
      this.expanded = false;
    }
  }

  class Option {
    constructor(obj, parent, id) {
      this.obj = $(obj);
      this.identifier = this.obj.data('value');
      this.papa = parent;
      this.id = id;
      this.height = 0;
      this.offset = 0;

      this.obj.click(() => this.papa.select(this.id));
    }

    resize() {
      this.height = this.obj.outerHeight();
      this.offset = this.papa.sumH;
      this.papa.sumH += this.height;
    }
  }

  this.selects = $('.select-wrap')
    .map((index, element) => new Select(element, index));

  function resize() {
    this.selects.map((i, e) => {
      e.resize();
    });
  }

  window.addEventListener('layoutChange', resize);
})();
