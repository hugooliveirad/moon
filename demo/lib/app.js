var Moon;

Moon = function(target, args) {
  return new Moon.pt.init(target, args);
};

Moon.pt = Moon.prototype = {
  _collection: [],
  _stack: [],
  _step: -1,
  _callback: void 0,
  init: function(target, args) {
    Moon.pt._collection = Moon.pt.getMoonCollection(target);
    return Moon.pt;
  },
  getMoonCollection: function(target) {
    var collection, el, selectedElements, tgt, _i, _j, _k, _l, _len, _len1, _len2, _len3;
    collection = [];
    if (!(target instanceof Array)) {
      collection.push(target);
    } else {
      for (_i = 0, _len = target.length; _i < _len; _i++) {
        tgt = target[_i];
        if (tgt instanceof NodeList || tgt instanceof HTMLCollection) {
          for (_j = 0, _len1 = target.length; _j < _len1; _j++) {
            el = target[_j];
            collection.push(el);
          }
        } else if (typeof tgt === "string") {
          selectedElements = document.querySelectorAll(tgt);
          for (_k = 0, _len2 = selectedElements.length; _k < _len2; _k++) {
            el = selectedElements[_k];
            collection.push(el);
          }
        } else if (!(tgt instanceof Array)) {
          collection.push(tgt);
        } else {
          for (_l = 0, _len3 = tgt.length; _l < _len3; _l++) {
            el = tgt[_l];
            collection.push(el);
          }
        }
      }
    }
    return collection;
  },
  getPrefix: function(prop) {
    var indexOfDash, pre, prefixes, _i, _len;
    prefixes = ["", "webkit", "moz", "ms", "O"];
    indexOfDash = prop.indexOf("-");
    while (indexOfDash > -1) {
      prop = prop.slice(0, indexOfDash) + prop.charAt(indexOfDash + 1).toUpperCase() + prop.slice(indexOfDash + 2);
      indexOfDash = prop.indexOf("-");
    }
    for (_i = 0, _len = prefixes.length; _i < _len; _i++) {
      pre = prefixes[_i];
      if (pre !== "") {
        prop = prop.charAt(0).toUpperCase() + prop.slice(1);
      }
      if (document.documentElement.style[pre + prop] != null) {
        return pre + prop;
      }
    }
  },
  animate: function(args) {
    var animationProps, arg, value;
    animationProps = {
      duration: 0,
      delay: 0,
      easing: "ease",
      beforeAnimation: void 0,
      afterAnimation: void 0
    };
    for (arg in args) {
      value = args[arg];
      animationProps[arg] = value;
    }
    Moon.pt._stack.push(animationProps);
    return Moon.pt;
  },
  play: function(callback) {
    Moon.pt._callback = callback;
    return Moon.pt._play();
  },
  _play: function() {
    var anm, el, key, nextTimeout, value, _i, _len, _ref;
    Moon.pt._step++;
    anm = Moon.pt._stack[Moon.pt._step];
    if (typeof anm !== "undefined" && anm !== null) {
      if (typeof anm.beforeAnimation === "function") {
        anm.beforeAnimation();
      }
      _ref = Moon.pt._collection;
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        el = _ref[_i];
        el.style[Moon.pt.getPrefix("transition")] = "" + anm.duration + "ms all " + anm.easing + " " + anm.delay + "ms";
        for (key in anm) {
          value = anm[key];
          if (key === "duration" || key === "delay" || key === "easing") {
            continue;
          }
          el.style[Moon.pt.getPrefix(key)] = value;
        }
      }
      return nextTimeout = setTimeout(function() {
        if (typeof anm.afterAnimation === "function") {
          anm.afterAnimation();
        }
        Moon.pt._play();
        return clearTimeout(nextTimeout);
      }, anm.delay + anm.duration);
    } else {
      Moon.pt._step = -1;
      if (Moon.pt._callback != null) {
        return Moon.pt._callback();
      }
    }
  }
};

Moon(["#target", document.querySelector("#target2")]).animate({
  "opacity": "1",
  "height": "500px",
  "width": "100px",
  "duration": 1000,
  "delay": 100,
  "beforeAnimation": function() {
    return console.log("beforeAnimation function running");
  },
  "afterAnimation": function() {
    return console.log("afterAnimation function running");
  }
}).animate({
  "opacity": ".5",
  "height": "300px",
  "width": "200px",
  "transform": "scale(1.3)",
  "background-color": "yellow",
  "duration": 1000,
  "delay": 2000,
  "beforeAnimation": function() {
    return console.log("beforeAnimation function running");
  },
  "afterAnimation": function() {
    return console.log("afterAnimation function running");
  }
}).play(function() {
  return console.log('callback');
});
