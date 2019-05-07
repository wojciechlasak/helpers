const $ = jQuery;
// ver 1.8.1
function throttle(ms, callback) {
  let lastCall = 0;
  let timeout;
  return function(a) {
    const now = new Date().getTime(),
      diff = now - lastCall;
    if (diff >= ms) {
      lastCall = now;
      callback(a);
    }
    else {
      clearTimeout(timeout);
      timeout = setTimeout(
        (function(a) {
          return function() {
            callback(a);
          };
        })(a),
        ms
      );
    }
  };
}

const frameThrottle = (function() {
  const callbackObjects = [];
  let requestCount = 0;
  function _onFrame() {
    callbackObjects.map(function(callbackObject) {
      if (callbackObject.isRequested) {
        callbackObject.isRequested = false;
        requestCount--;
        callbackObject.callback.call(this, callbackObject.attributes);
      }
    });
    if (requestCount > 0) {
      requestAnimationFrame(_onFrame);
    }
  }
  requestAnimationFrame(_onFrame);

  function request(callbackId, a) {
    if (requestCount === 0) {
      requestAnimationFrame(_onFrame);
    }
    if (!callbackObjects[callbackId].isRequested) {
      callbackObjects[callbackId].isRequested = true;
      requestCount++;
    }
    callbackObjects[callbackId].attributes = a;
  }

  return function(callback) {
    let callbackId = callbackObjects.length;
    callbackObjects[callbackId] = {
      isRequested: false,
      callback: callback,
    };
    return function(a) {
      request(callbackId, a);
    };
  };
})();

f3 = {
  s: 0,
  h: 0,
  w: 0,
  window: $(window),
  document: $(document),
  documentH: 0,
  scrollCheck: function() {
    f3.s = window.scrollY;
  },
  sizeCheck: function() {
    f3.h = f3.window.height();
    f3.w = f3.window.width();
    f3.documentH = f3.document.height();
    f3.scrollCheck();
    window.dispatchEvent(new CustomEvent('layoutChange'));
    window.dispatchEvent(new CustomEvent('afterLayoutChange'));
  },
};
window.addEventListener('scroll', frameThrottle(f3.scrollCheck));
window.addEventListener('resize', throttle(100, f3.sizeCheck));
f3.window.load(f3.sizeCheck);
f3.document.ready(f3.sizeCheck);

function parseInput(input, def) {
  return undefined === input ? def : input;
}
