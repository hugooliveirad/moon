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
    this._prefixes = {};
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
      var anm, auxDelay, auxDuration, el, getAnm, key, nextTimeout, timeDiff, totalTime, value, _i, _len, _ref,
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
        console.log(auxDelay + " | " + auxDuration);
        if (auxDelay < 0) {
          anm.delay = 0;
        } else {
          anm.delay = auxDelay;
        }
        if (auxDuration < anm.duration) {
          anm.duration = auxDuration;
        }
        console.log(anm.delay + " | " + anm.duration);
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
        nextTimeout = setTimeout(function() {
          if (_this._paused != null) {
            clearTimeout(nextTimeout);
            return void 0;
          }
          if (typeof anm.after === "function") {
            anm.after();
          }
          _this._play();
          return clearTimeout(nextTimeout);
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
      var el, key, value, _i, _len, _ref, _results;
      _ref = this._collection;
      _results = [];
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        el = _ref[_i];
        _results.push((function() {
          var _results1;
          _results1 = [];
          for (key in args) {
            value = args[key];
            _results1.push(el.style[this._getPrefix(key)] = value);
          }
          return _results1;
        }).call(this));
      }
      return _results;
    },
    pause: function() {
      var computedStyle, el, key, prop, _i, _len, _ref, _ref1, _results;
      this._paused = new Date();
      _ref = this._collection;
      _results = [];
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
        _results.push(el.style[this._getPrefix("transition")] = "");
      }
      return _results;
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
      return this.set({
        "transition": null
      });
    }
  };
  return window.Moon = Moon;
})(window, document);
