class Hoverable {
  constructor(element) {
    this.element = $(element);
    this.hasHoveredClass = false;
    this.isTouched = false;

    this.element.on({
      mouseenter: this.activate.bind(this),
      mouseleave: this.deactivate.bind(this),
      touchstart: () => {
        this.isTouched = true;
        clearTimeout(this.timeout);
        this.deactivate();
      },
      touchend: () => {
        clearTimeout(this.timeout);
        this.timeout = setTimeout(() => {
          this.isTouched = false;
        }, 100);
      },
    });
  }

  activate() {
    if (this.hasHoveredClass) return;
    if (this.isTouched) return;
    this.element.addClass('hovered');
    this.hasHoveredClass = true;
  }

  deactivate() {
    if (!this.hasHoveredClass) return;
    this.element.removeClass('hovered');
    this.hasHoveredClass = false;
  }
}
