function Regulator(obj) {
  this.start = obj.start;
  this.step = obj.step;
  this.isAnimating = false;
  this.duration = parseInput(obj.duration, 300);
  this.friction = parseInput(obj.friction, 1.1);
  this.amplification = parseInput(obj.amplification, 0.005);
  this.saturation = parseInput(obj.saturation, Infinity);
  this.names = Object.getOwnPropertyNames(this.start);
  this.x = {};
  for (let i = 0; i < this.names.length; i++) {
    this.x[this.names[i]] = {
      value:	this.start[this.names[i]],
      target:	this.start[this.names[i]],
      isAnimating:	false,
      dx:	0,
      percent:	0,
      startTimestamp:	0,
    };
  }

  this.startAnimation = function() {
    if (!this.isAnimating) {
      this.animationStep();
    }
  };

  this.animate = function(target) {
    const targetNames = Object.getOwnPropertyNames(target);
    let changesMade = false;
    for (let i = 0; i < targetNames.length; i++) {
      if (this.x[targetNames[i]].target !== target[targetNames[i]]) {
        changesMade = true;
        this.x[targetNames[i]].target = target[targetNames[i]];
        this.x[targetNames[i]].percent = 0;
        this.x[targetNames[i]].startTimestamp = new Date().getTime();
        this.x[targetNames[i]].isAnimating = true;
      }
    }
    if (changesMade) {
      this.startAnimation();
    }
  };

  this.animationStep = function() {
    this.isAnimating = true;
    let nextStep = false;
    let response = {};
    for (let i = 0; i < this.names.length; i++) {
      const property = this.x[this.names[i]];
      if (property.isAnimating) {
        let diff = property.target - property.value;
        property.dx += Math.max(Math.min(diff, this.saturation), -this.saturation);
        property.value += property.dx * this.amplification;
        property.dx /= this.friction;
        diff = property.target - property.value;
        if (Math.abs(property.dx) > 0.001 || Math.abs(diff) > 0.01) {
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
  };
}
