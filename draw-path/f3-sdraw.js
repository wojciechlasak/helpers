/**
 * create new svg draw
 * 
 * @param {selector} element path
 * @param {number} pos fill percentage
 * @returns {object} SDraw
 */
const createSDraw = (() => {
  const sdraws = [];
  class SDraw {
    constructor(element, pos) {
      this.element = $(element);
      this.pos = pos;
      this.length = 0;
    }

    onResize() {
      this.length = this.element[0].getTotalLength();
      this.element.css({
        strokeDasharray: `${this.length * this.pos} ${this.length * (2 - this.pos)}`,
        strokeDashoffset: this.length * (3 - (1 - this.pos) / 2),
      });
    }

    draw() {
      this.element.animate({
        strokeDashoffset: this.length * (1.5 + this.pos / 2),
      }, 300);
    }

    undraw() {
      this.element.animate({
        strokeDashoffset: this.length * (2.5 + this.pos / 2),
      }, 300);
    }

    drawStep(progress) {
      this.element.css({
        strokeDashoffset: this.length * (2.5 + this.pos / 2 - progress),
      });
    }
  }
  window.addEventListener('afterLayoutChange', () => {
    sdraws.map(sdraw => {
      sdraw.onResize();
    }, 300);
  });

  return (element, part) => {
    if (part === undefined) part = 1;
    const newSDraw = new SDraw(element, part);
    sdraws.push(newSDraw);
    return newSDraw;
  };
})();

// examples
const draw = createSDraw('.draw');
$('svg').on('mouseenter', () => draw.draw());
$('svg').on('mouseleave', () => draw.undraw());

const drawRegulator = {
  draw: createSDraw('.draw-regulator', 0.5),
  regulator: new Regulator({
    start: {pos: 0},
    step: x => {
      drawRegulator.draw.drawStep(x.pos);
    },
  }),
};

$('svg').on('mouseenter', () => {
  drawRegulator.regulator.animate({pos: 1});
});
$('svg').on('mouseleave', () => {
  drawRegulator.regulator.animate({pos: 0});
});
