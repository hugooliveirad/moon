(function(window, document) {
  var Moon;
  Moon = function(target) {
    if (window === this) {
      return new Moon(target);
    }
    this._collection = Moon.fn._getMoonCollection(target);
    this._callback = void 0;
    this._stack = [];
    this._step = -1;
    this._loop = 1;
    this._direction = true;
    return this;
  };
  Moon.fn = Moon.prototype = {
    config: {
      duration: 1000,
      delay: 0,
      easing: "ease",
      before: void 0,
      after: void 0
    },
    _prefixes: {},
    _cssPrefixes: {},
    _vendorPrefixes: ["webkit-", "moz-", "ms-", "O-"],
    _getMoonCollection: function(target) {
      var aux, collection, el, selectedElements, tgt, _i, _j, _k, _l, _len, _len1, _len2, _len3;
      collection = [];
      if (!(target instanceof Array)) {
        aux = target;
        target = [];
        target.push(aux);
      }
      for (_i = 0, _len = target.length; _i < _len; _i++) {
        tgt = target[_i];
        if (tgt instanceof NodeList || tgt instanceof HTMLCollection) {
          for (_j = 0, _len1 = tgt.length; _j < _len1; _j++) {
            el = tgt[_j];
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
      return collection;
    },
    _getPrefix: function(prop) {
      var pre, property, _i, _len, _ref;
      if (Moon.fn._prefixes[prop] != null) {
        return Moon.fn._prefixes[prop];
      }
      prop = Moon.fn._camelize(prop);
      if (document.documentElement.style[prop] != null) {
        Moon.fn._prefixes[prop] = prop;
        return prop;
      }
      _ref = Moon.fn._vendorPrefixes;
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        pre = _ref[_i];
        property = Moon.fn._camelize(pre + prop);
        if (document.documentElement.style[property] != null) {
          Moon.fn._prefixes[prop] = property;
          return property;
        }
      }
    },
    _camelize: function(str) {
      return str.replace(/-([\D])/g, Moon.fn._camelizeReplaceCallback);
    },
    _camelizeReplaceCallback: function($1) {
      return $1.charAt(1).toUpperCase();
    },
    _getCssPrefix: function(prop) {
      var pre, propCam, property, propertyCam, _i, _len, _ref;
      if (Moon.fn._cssPrefixes[prop] != null) {
        return Moon.fn._cssPrefixes[prop];
      }
      propCam = Moon.fn._camelize(prop);
      if (document.documentElement.style[propCam] != null) {
        Moon.fn._cssPrefixes[prop] = prop;
        return prop;
      }
      _ref = Moon.fn._vendorPrefixes;
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        pre = _ref[_i];
        property = "-" + pre + prop;
        propertyCam = Moon.fn._camelize(pre + prop);
        if (document.documentElement.style[propertyCam] != null) {
          Moon.fn._cssPrefixes[prop] = property;
          return property;
        }
      }
    },
    animate: function(args) {
      var animationProps, arg, value;
      animationProps = {
        duration: Moon.fn.config.duration,
        delay: Moon.fn.config.delay,
        easing: Moon.fn.config.easing,
        before: Moon.fn.config.before,
        after: Moon.fn.config.after
      };
      for (arg in args) {
        value = args[arg];
        animationProps[arg] = value;
      }
      this._stack.push(animationProps);
      return this;
    },
    play: function(callback) {
      this._callback = callback || this._callback;
      this._play();
      return this;
    },
    _play: function() {
      var anm, auxDelay, auxDuration, el, getAnm, key, timeDiff, totalTime, value, _i, _len, _ref,
        _this = this;
      getAnm = function(step) {
        if (!_this._direction) {
          step = _this._stack.length - 1 - _this._step;
        }
        return _this._stack[step];
      };
      anm = void 0;
      if (this._paused != null) {
        anm = getAnm(this._step);
        timeDiff = this._paused - this._lastTimePlayed;
        totalTime = anm.delay + anm.duration;
        auxDelay = totalTime - timeDiff - anm.duration;
        auxDuration = totalTime - timeDiff;
        if (auxDelay < 0) {
          anm.delay = 0;
        } else {
          anm.delay = auxDelay;
        }
        if (auxDuration < anm.duration) {
          anm.duration = auxDuration;
        }
        this._paused = null;
      } else {
        this._step += 1;
        anm = getAnm(this._step);
      }
      if (anm != null) {
        if (typeof anm.before === "function") {
          anm.before();
        }
        _ref = this._collection;
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          el = _ref[_i];
          el.style[this._getPrefix("transition")] = "" + anm.duration + "ms all " + anm.easing + " " + anm.delay + "ms";
          for (key in anm) {
            value = anm[key];
            if (key === "duration" || key === "delay" || key === "easing" || key === "before" || key === "after") {
              continue;
            }
            el.style[this._getPrefix(key)] = value;
          }
        }
        this._nextTimeout = setTimeout(function() {
          clearTimeout(_this._nextTimeout);
          if (typeof anm.after === "function") {
            anm.after();
          }
          return _this._play();
        }, anm.delay + anm.duration);
        this._lastTimePlayed = new Date();
      } else {
        this._step = -1;
        if (typeof this._loop === "number") {
          this._loop -= 1;
          if (this._loop > 0) {
            this._play();
          } else {
            if (this._callback != null) {
              this._callback();
            }
            this.reset();
          }
        } else if (typeof this._loop === "string") {
          if (this._callback != null) {
            this._callback();
          }
          if (this._loop === "alternate") {
            this._direction = !this._direction;
            this._play();
          } else if (this._loop === "infinite") {
            this._play();
          }
        }
      }
      return this;
    },
    set: function(args) {
      var el, key, value, _i, _len, _ref;
      _ref = this._collection;
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        el = _ref[_i];
        for (key in args) {
          value = args[key];
          el.style[this._getPrefix(key)] = value;
        }
      }
      return this;
    },
    pause: function() {
      var computedStyle, el, key, prop, _i, _len, _ref, _ref1;
      this._paused = new Date();
      _ref = this._collection;
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        el = _ref[_i];
        computedStyle = window.getComputedStyle(el);
        _ref1 = this._stack[this._step];
        for (key in _ref1) {
          prop = _ref1[key];
          if (key === "duration" || key === "delay" || key === "easing" || key === "before" || key === "after") {
            continue;
          }
          el.style[this._getPrefix(key)] = computedStyle.getPropertyValue(this._getCssPrefix(key));
        }
        el.style[this._getPrefix("transition")] = "";
      }
      clearTimeout(this._nextTimeout);
      return this;
    },
    loop: function(looping) {
      this._loop = looping;
      return this;
    },
    reset: function() {
      this._callback = void 0;
      this._step = -1;
      this._stack = [];
      this._loop = 1;
      this._direction = true;
      this.set({
        "transition": null
      });
      return this;
    }
  };
  return window.Moon = Moon;
})(window, document);

(function(window, document) {
  var Tests;
  Tests = {
    init: function() {
      Tests.targets = document.querySelectorAll(".target");
      return Tests.test();
    },
    test: function() {
      test("Moon main function", function() {
        var instances, singleInstance;
        singleInstance = Moon("#target");
        ok(singleInstance instanceof Moon, "Moon should return a instance of itself");
        notStrictEqual(singleInstance._collection, null, "Moon instance must have a collection");
        notStrictEqual(singleInstance._callback, null, "Moon instance must have a callback");
        notStrictEqual(singleInstance._stack, null, "Moon instance must have a stack");
        notStrictEqual(singleInstance._step, null, "Moon instance must have a step");
        notStrictEqual(singleInstance._loop, null, "Moon instance must have a loop");
        notStrictEqual(singleInstance._direction, null, "Moon instance must have a direction");
        instances = {};
        instances.singleElement = Moon(Tests.targets[0]);
        instances.nodeList = Moon(Tests.targets);
        instances.selectorSingle = Moon("#target-1");
        instances.selectorMulti = Moon(".target");
        instances.arraySameType = Moon(["#target-1", "#target-2"]);
        instances.arrayDiffType = Moon(["#target-1", Tests.targets, Tests.targets[0]]);
        equal(instances.singleElement._collection.length, 1, "Expected 1");
        equal(instances.nodeList._collection.length, 5, "Expected 5");
        equal(instances.selectorSingle._collection.length, 1, "Expected 1");
        equal(instances.selectorMulti._collection.length, 5, "Expected 5");
        equal(instances.arraySameType._collection.length, 2, "Expected 2");
        return equal(instances.arrayDiffType._collection.length, 7, "Expected 7");
      });
      test("Moon _camelize method", function() {
        var testingCamelize;
        testingCamelize = Moon.fn._camelize("webkit-animation-timing-function");
        return strictEqual(testingCamelize, "webkitAnimationTimingFunction", "should return camelized property");
      });
      test("Moon _getPrefix method", function() {
        var testingPrefix;
        testingPrefix = Moon.fn._getPrefix("animation-timing-function");
        return notStrictEqual(document.documentElement.style[testingPrefix], null, "should return a valid property");
      });
      test("Moon _getCssPrefix method", function() {
        var testignCssPrefix, testignCssPrefixCamelized;
        testignCssPrefix = Moon.fn._getCssPrefix("animation-timing-function");
        testignCssPrefixCamelized = Moon.fn._camelize(testignCssPrefix);
        notStrictEqual(document.documentElement.style[testignCssPrefixCamelized], null, "should return a valid CSS property");
        notStrictEqual(testignCssPrefix.indexOf("-"), -1, "should return hyphen-divided property");
        return strictEqual(testignCssPrefix, testignCssPrefix.toLowerCase(), "should return lower-case property");
      });
      test("Moon animate method", function() {
        var myAnimation;
        myAnimation = Moon("#target-1").animate({
          "opacity": "0",
          "duration": 100,
          "easing": "ease-in-out"
        }).animate({
          "opacity": "1"
        });
        notEqual(myAnimation._stack[0], null, "animation stack should be declared");
        strictEqual(myAnimation._stack[0].opacity, "0", "animation property should be the declared");
        strictEqual(myAnimation._stack[0].duration, 100, "animation property should be the declared");
        strictEqual(myAnimation._stack[0].easing, "ease-in-out", "animation property should be the declared");
        strictEqual(myAnimation._stack[0].delay, Moon.fn.config.delay, "animation property should be the default");
        strictEqual(myAnimation._stack[0].before, Moon.fn.config.before, "animation property should be the default");
        strictEqual(myAnimation._stack[0].after, Moon.fn.config.after, "animation property should be the default");
        strictEqual(myAnimation._stack[1].opacity, "1", "animation chaining should change the declared properties");
        return notStrictEqual(myAnimation._stack[1].opacity, myAnimation._stack[0].opacity, "animation chaining should independently change properties");
      });
      asyncTest("Moon play", function() {
        var callback, counter, myAnimation;
        expect(2);
        counter = 0;
        callback = function() {
          return counter += 1;
        };
        myAnimation = Moon("#target-1").animate({
          "opacity": "0",
          "duration": 0
        }).play(callback);
        strictEqual(myAnimation._callback, callback, "animation callback should be the declared");
        return setTimeout(function() {
          strictEqual(counter, 1, "animation callback should run once");
          return start();
        }, 5);
      });
      test("Moon set", function() {
        var myAnimation;
        myAnimation = Moon("#target-1").set({
          "opacity": "0"
        });
        return equal(myAnimation._collection[0].style.opacity, "0", "set should set the property");
      });
      asyncTest("Moon pause", function() {
        var myAnimation, steps;
        expect(2);
        myAnimation = Moon("#target-1").animate({
          "opacity": "0",
          "duration": 500
        }).animate({
          "opacity": "1",
          "duration": 500
        }).play();
        steps = [];
        return setTimeout(function() {
          myAnimation.pause();
          return setTimeout(function() {
            steps.push(myAnimation._step);
            myAnimation.play();
            return setTimeout(function() {
              steps.push(myAnimation._step);
              strictEqual(steps[0], 0, "step should remain the same after pause");
              strictEqual(steps[1], 1, "animation should continue after used play");
              return start();
            }, 300);
          }, 300);
        }, 300);
      });
      return asyncTest("Moon loop", function() {
        var looping, loopingVars;
        expect(8);
        looping = [];
        looping[0] = Moon("#target-1").animate({
          "opacity": "0",
          "duration": 500
        }).animate({
          "opacity": "1",
          "duration": 500
        }).loop(2).play();
        looping[1] = Moon("#target-2").animate({
          "opacity": "0",
          "duration": 500
        }).animate({
          "opacity": "1",
          "duration": 500
        }).loop("infinite").play();
        looping[2] = Moon("#target-3").animate({
          "opacity": "0",
          "duration": 500
        }).animate({
          "opacity": "1",
          "duration": 500
        }).loop("alternate").play();
        loopingVars = [];
        setTimeout(function() {
          loopingVars.push(looping[0]._step);
          loopingVars.push(looping[1]._step);
          loopingVars.push(looping[2]._step);
          return loopingVars.push(looping[2]._direction);
        }, 1100);
        return setTimeout(function() {
          loopingVars.push(looping[0]._step);
          loopingVars.push(looping[1]._step);
          loopingVars.push(looping[2]._step);
          loopingVars.push(looping[2]._direction);
          strictEqual(loopingVars[0], 0, "count looping step at second iteraction expected to be 0");
          strictEqual(loopingVars[1], 0, "infinite looping step at second iteraction expected to be 0");
          strictEqual(loopingVars[2], 0, "alternate looping step at second iteraction expected to be 0");
          strictEqual(loopingVars[3], false, "alternate looping direction at second iteraction expected to be false");
          strictEqual(loopingVars[4], -1, "count looping step at third iteraction expected to be -1");
          strictEqual(loopingVars[5], 0, "infinite looping step at third iteraction expected to be 0");
          strictEqual(loopingVars[6], 0, "alternate looping step at third iteraction expected to be 0");
          strictEqual(loopingVars[7], true, "alternate looping direction at third iteraction expected to be true");
          return start();
        }, 2100);
      });
    }
  };
  return Tests.init();
})(window, document);
