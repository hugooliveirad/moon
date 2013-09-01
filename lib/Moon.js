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
    var collection, el, selectedElements, _i, _j, _len, _len1;
    collection = [];
    if (target instanceof NodeList || target instanceof HTMLCollection) {
      for (_i = 0, _len = target.length; _i < _len; _i++) {
        el = target[_i];
        collection.push(el);
      }
    } else if (typeof target === "string") {
      selectedElements = document.querySelectorAll(target);
      for (_j = 0, _len1 = selectedElements.length; _j < _len1; _j++) {
        el = selectedElements[_j];
        collection.push(el);
      }
    } else if (!(target instanceof Array)) {
      collection.push(target);
    } else {
      collection = target;
    }
    return collection;
  },
  getPrefix: function(prop) {
    var pre, prefixes, _i, _len;
    prefixes = ["", "webkit", "moz", "ms", "O"];
    for (_i = 0, _len = prefixes.length; _i < _len; _i++) {
      pre = prefixes[_i];
      if (pre !== "") {
        prop = prop.charAt(0).toUpperCase() + prop.slice(1);
      }
      if (document.documentElement.style[pre + prop] != null) {
        console.log(pre + prop);
        return pre + prop;
      }
    }
  },
  animate: function(args) {
    var animationProps, arg, value;
    animationProps = {
      duration: 0,
      delay: 0,
      easing: "ease"
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
      _ref = Moon.pt._collection;
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        el = _ref[_i];
        el.style[Moon.pt.getPrefix("transition")] = "" + anm.duration + "ms all " + anm.easing + " " + anm.delay + "ms";
        for (key in anm) {
          value = anm[key];
          if (key === "duration" || key === "delay") {
            continue;
          }
          el.style[Moon.pt.getPrefix(key)] = value;
        }
      }
      return nextTimeout = setTimeout(function() {
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
