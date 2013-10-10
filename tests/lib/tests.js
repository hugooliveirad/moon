var moonObject;

(function(window, document) {
  var Moon;
  Moon = function(target, args) {
    var self;
    self = this;
    if (window === self) {
      return new Moon(target, args);
    }
    self._collection = Moon.fn.getMoonCollection(target);
    self._callback = void 0;
    self._stack = [];
    self._step = -1;
    self._prefixes = {};
    self._prefixes["transition"] = Moon.fn.getPrefix("transition");
    return self;
  };
  Moon.fn = Moon.prototype = {
    getMoonCollection: function(target) {
      var aux, collection, el, selectedElements, tgt, _i, _len;
      collection = [];
      if (!(target instanceof Array)) {
        aux = target;
        target = [];
        target.push(aux);
      }
      for (_i = 0, _len = target.length; _i < _len; _i++) {
        tgt = target[_i];
        if (tgt instanceof NodeList || tgt instanceof HTMLCollection) {
          collection.push((function() {
            var _j, _len1, _results;
            _results = [];
            for (_j = 0, _len1 = tgt.length; _j < _len1; _j++) {
              el = tgt[_j];
              _results.push(el);
            }
            return _results;
          })());
        } else if (typeof tgt === "string") {
          selectedElements = document.querySelectorAll(tgt);
          collection.push((function() {
            var _j, _len1, _results;
            _results = [];
            for (_j = 0, _len1 = selectedElements.length; _j < _len1; _j++) {
              el = selectedElements[_j];
              _results.push(el);
            }
            return _results;
          })());
        } else if (!(tgt instanceof Array)) {
          collection.push(tgt);
        } else {
          collection.push((function() {
            var _j, _len1, _results;
            _results = [];
            for (_j = 0, _len1 = tgt.length; _j < _len1; _j++) {
              el = tgt[_j];
              _results.push(el);
            }
            return _results;
          })());
        }
      }
      return collection;
    },
    getPrefix: function(prop) {
      var indexOfDash, pre, prefixes, propertie, _i, _len;
      prefixes = ["webkit", "moz", "ms", "O"];
      indexOfDash = prop.indexOf("-");
      while (indexOfDash > -1) {
        prop = prop.slice(0, indexOfDash) + prop.charAt(indexOfDash + 1).toUpperCase() + prop.slice(indexOfDash + 2);
        indexOfDash = prop.indexOf("-");
      }
      if (document.documentElement.style[prop] != null) {
        return prop;
      }
      for (_i = 0, _len = prefixes.length; _i < _len; _i++) {
        pre = prefixes[_i];
        propertie = pre + Moon.fn.cap(prop);
        if (document.documentElement.style[propertie] != null) {
          return propertie;
        }
      }
    },
    cap: function(str) {
      return str.charAt(0).toUpperCase() + str.slice(1);
    },
    animate: function(args) {
      var animationProps, arg, self, value;
      self = this;
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
      self._stack.push(animationProps);
      return self;
    },
    play: function(callback) {
      var self;
      self = this;
      self._callback = callback;
      self._play();
      return self;
    },
    _play: function() {
      var anm, el, key, nextTimeout, self, value, _i, _len, _ref;
      self = this;
      self._step++;
      anm = self._stack[self._step];
      if (anm != null) {
        if (typeof anm.beforeAnimation === "function") {
          anm.beforeAnimation();
        }
        _ref = self._collection;
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          el = _ref[_i];
          el.style[self.getPrefix("transition")] = "" + anm.duration + "ms all " + anm.easing + " " + anm.delay + "ms";
          for (key in anm) {
            value = anm[key];
            if (key === "duration" || key === "delay" || key === "easing" || key === "beforeAnimation" || key === "afterAnimation") {
              continue;
            }
            el.style[self.getPrefix(key)] = value;
          }
        }
        nextTimeout = setTimeout(function() {
          if (typeof anm.afterAnimation === "function") {
            anm.afterAnimation();
          }
          self._play();
          return clearTimeout(nextTimeout);
        }, anm.delay + anm.duration);
      } else {
        if (self._callback != null) {
          self._callback();
        }
        self._callback = void 0;
        self._step = -1;
        self._stack = [];
      }
      return self;
    }
  };
  return window.Moon = Moon;
})(window, document);

moonObject = Moon("#target");

console.dir(moonObject);

test("Return values tests", function() {
  ok(moonObject === Moon.pt, "Moon() returns an instance of Moon.pt");
  ok(moonObject.animate({
    "opacity": "0"
  }) === Moon.pt, ".animate() returns an instance of Moon.pt");
  return ok(moonObject.play() === Moon.pt, "play() returns and instance of Moon.pt");
});

test("Moon()._collection behavior tests", function() {
  ok(Moon("#target")._collection.length === 1, "selection of just one element must affect only one element");
  ok(Moon(".target-class")._collection.length === 5, "selection of five elements must affect all");
  ok(Moon([".target-class", document.getElementById("target")])._collection.length === 6, "selections of five elements by class and one by id must affect every single one");
  return ok(Moon(document.getElementById("targets-wrapper").querySelectorAll("div"))._collection.length === 2, "selectors must can be used isolated and returns every selected element");
});

test("Callback, before and after functions", function() {
  var moonObj;
  return moonObj = Moon("#target").animate({
    "opacity": "0",
    "beforeAnimation": function(moon) {
      ok(1 === 1, "Before animation was called");
      return ok(moon === moonObj, "Expected Moon.pt object to be passed as an argument");
    },
    "afterAnimation": function(moon) {
      ok(1 === 1, "After animation was called");
      return ok(moon === moonObj, "Expected Moon.pt object to be passed as an argument");
    }
  }).play(function(moon) {
    ok(1 === 1, "Callback on the end of all animations was called");
    return ok(moon === moonObj, "Expected Moon.pt object to be passed as an argument");
  });
});
