class Regulator {
  constructor(obj) {
    this.start = obj.start;
    this.step = obj.step;
    this.isAnimating = false;
    this.friction = parseInput(obj.friction, 1.1);
    this.amplification = parseInput(obj.amplification, 0.005);
    this.saturation = parseInput(obj.saturation, Infinity);
    this.transformEddx = obj.transformEddx;
    this.names = Object.getOwnPropertyNames(this.start);
    this.x = {};
    for (let i = 0; i < this.names.length; i++) {
      this.x[this.names[i]] = {
        value: this.start[this.names[i]],
        target: this.start[this.names[i]],
        isAnimating: false,
        dx: 0,
        eddx: 0,
        percent: 0,
      };
    }
  }

  startAnimation() {
    if (!this.isAnimating) {
      this.animationStep();
    }
  }

  animate(target) {
    const targetNames = Object.getOwnPropertyNames(target);
    let changesMade = false;
    for (let i = 0; i < targetNames.length; i++) {
      if (this.x[targetNames[i]].target !== target[targetNames[i]]) {
        changesMade = true;
        this.x[targetNames[i]].target = target[targetNames[i]];
        this.x[targetNames[i]].percent = 0;
        this.x[targetNames[i]].isAnimating = true;
      }
    }
    if (changesMade) {
      this.startAnimation();
    }
  }

  animationStep() {
    this.isAnimating = true;
    let nextStep = false;
    let response = {};
    for (let i = 0; i < this.names.length; i++) {
      const property = this.x[this.names[i]];
      if (property.isAnimating) {
        let diff = property.target - property.value;
        let eddx = this.transformEddx === undefined ?
          property.eddx :
          this.transformEddx(property.eddx, this.names[i]);
        diff += eddx;
        property.dx += Math.max(Math.min(diff, this.saturation), -this.saturation);
        property.value += property.dx * this.amplification;
        property.dx /= this.friction;
        diff = property.target - property.value;
        if (
          property.eddx !== 0 ||
          Math.abs(property.dx) > 0.001 ||
          Math.abs(diff) > 0.01
        ) {
          nextStep = true;
        }
      }
      response[this.names[i]] = property.value;
    }
    this.step(response, this);
    if (nextStep) {
      requestAnimationFrame(this.animationStep.bind(this));
    }
    else {
      this.isAnimating = false;
    }
  }

  eddx(target) {
    const targetNames = Object.getOwnPropertyNames(target);
    let changesMade = false;
    for (let i = 0; i < targetNames.length; i++) {
      changesMade = true;
      if (this.x[targetNames[i]].eddx !== target[targetNames[i]]) {
        this.x[targetNames[i]].eddx = target[targetNames[i]];
        this.x[targetNames[i]].isAnimating = true;
      }
    }
    if (changesMade) {
      this.startAnimation();
    }
  }
}

// examples
const spring1 = $('#spring-1');
const spring1Regulator = new Regulator({
  start: {pos: 25},
  step: values => spring1.css({left: values.pos + '%'}),
});
const spring2 = $('#spring-2');
const spring2Regulator = new Regulator({
  start: {pos: 25},
  step: values => spring2.css({left: values.pos + '%'}),
  amplification: 0.001,
  friction: 1.02,
});
const spring3 = $('#spring-3');
const spring3Regulator = new Regulator({
  start: {pos: 25},
  step: values => spring3.css({left: values.pos + '%'}),
  saturation: 5,
});
const spring4 = $('#spring-4');
const spring4Regulator = new Regulator({
  start: {pos: 25},
  step: values => spring4.css({left: values.pos + '%'}),
  amplification: 0.00015,
  friction: 1.01,
});
const spring5 = $('#spring-5');
const spring5Regulator = new Regulator({
  start: {pos: 50},
  step: values => spring5.css({left: values.pos + '%'}),
  amplification: 0.005,
  friction: 1.1,
  transformEddx: transformEddx5,
});
const spring6 = $('#spring-6');
const spring6Regulator = new Regulator({
  start: {pos: 25},
  step: values => spring6.css({left: values.pos + '%'}),
  amplification: 0.02,
  friction: 1.4,
});

$('#row-1').on('mouseenter', () => spring1Regulator.animate({pos: 75}));
$('#row-1').on('mouseleave', () => spring1Regulator.animate({pos: 25}));
$('#row-2').on('mouseenter', () => spring2Regulator.animate({pos: 75}));
$('#row-2').on('mouseleave', () => spring2Regulator.animate({pos: 25}));
$('#row-3').on('mouseenter', () => spring3Regulator.animate({pos: 75}));
$('#row-3').on('mouseleave', () => spring3Regulator.animate({pos: 25}));
$('#row-4').on('mouseenter', () => spring4Regulator.animate({pos: 75}));
$('#row-4').on('mouseleave', () => spring4Regulator.animate({pos: 25}));
$('#row-6').on('mouseenter', () => spring6Regulator.animate({pos: 75}));
$('#row-6').on('mouseleave', () => spring6Regulator.animate({pos: 25}));

setInterval(() => {
  const eddx = (Math.random() - 0.5) * 10;
  spring6Regulator.eddx({pos: eddx});
}, 100);

$('#all-springs').on('mouseenter', () => {
  spring1Regulator.animate({pos: 75});
  spring2Regulator.animate({pos: 75});
  spring3Regulator.animate({pos: 75});
  spring4Regulator.animate({pos: 75});
  spring6Regulator.animate({pos: 75});
});
$('#all-springs').on('mouseleave', () => {
  spring1Regulator.animate({pos: 25});
  spring2Regulator.animate({pos: 25});
  spring3Regulator.animate({pos: 25});
  spring4Regulator.animate({pos: 25});
  spring6Regulator.animate({pos: 25});
});


function transformEddx5(value, name) {
  if (name !== 'pos') return value;
  let pos = 1 / (this.x.pos.value - value / f3.w * 100);
  if (pos > 1) pos = 1;
  if (pos < -1) pos = -1;
  pos *= 20;
  return pos;
}
$('#row-5').on('mousemove', event => spring5Regulator.eddx({pos: event.pageX}));
$('#row-5').on('mouseleave', () => spring5Regulator.eddx({pos: 0}));
