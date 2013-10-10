var App;

(function(window, document) {
  var Moon;
  Moon = function(target, args) {
    if (window === this) {
      return new Moon(target, args);
    }
    this._collection = Moon.fn.getMoonCollection(target);
    this._callback = void 0;
    this._stack = [];
    this._step = -1;
    this._prefixes = {};
    this._loop = 1;
    this._direction = true;
    return this;
  };
  Moon.fn = Moon.prototype = {
    _prefixes: {},
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
      var indexOfDash, pre, prefixes, propCap, propertie, _i, _len;
      if (Moon.fn._prefixes[prop] != null) {
        return Moon.fn._prefixes[prop];
      }
      prefixes = ["webkit", "moz", "ms", "O"];
      indexOfDash = prop.indexOf("-");
      while (indexOfDash > -1) {
        prop = prop.slice(0, indexOfDash) + prop.charAt(indexOfDash + 1).toUpperCase() + prop.slice(indexOfDash + 2);
        indexOfDash = prop.indexOf("-");
      }
      if (document.documentElement.style[prop] != null) {
        Moon.fn._prefixes[prop] = prop;
        return prop;
      }
      propCap = Moon.fn.cap(prop);
      for (_i = 0, _len = prefixes.length; _i < _len; _i++) {
        pre = prefixes[_i];
        propertie = pre + propCap;
        if (document.documentElement.style[propertie] != null) {
          Moon.fn._prefixes[prop] = propertie;
          return propertie;
        }
      }
    },
    cap: function(str) {
      return str.charAt(0).toUpperCase() + str.slice(1);
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
      this._stack.push(animationProps);
      return this;
    },
    play: function(callback) {
      this._callback = callback;
      this._play();
      return this;
    },
    _play: function() {
      var anm, el, key, nextTimeout, step, value, _i, _len, _ref,
        _this = this;
      this._step += 1;
      if (this._direction) {
        step = this._step;
      } else {
        step = this._stack.length - 1 - this._step;
      }
      anm = this._stack[step];
      if (anm != null) {
        if (typeof anm.beforeAnimation === "function") {
          anm.beforeAnimation();
        }
        _ref = this._collection;
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          el = _ref[_i];
          el.style[this.getPrefix("transition")] = "" + anm.duration + "ms all " + anm.easing + " " + anm.delay + "ms";
          for (key in anm) {
            value = anm[key];
            if (key === "duration" || key === "delay" || key === "easing" || key === "beforeAnimation" || key === "afterAnimation") {
              continue;
            }
            el.style[this.getPrefix(key)] = value;
          }
        }
        nextTimeout = setTimeout(function() {
          if (typeof anm.afterAnimation === "function") {
            anm.afterAnimation();
          }
          _this._play();
          return clearTimeout(nextTimeout);
        }, anm.delay + anm.duration);
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
    loop: function(looping) {
      this._loop = looping;
      return this;
    },
    reset: function() {
      this._callback = void 0;
      this._step = -1;
      this._stack = [];
      this._loop = 1;
      return this._direction = true;
    }
  };
  return window.Moon = Moon;
})(window, document);

App = {
  init: function() {
    var a;
    a = App;
    a.animationWrapper = document.getElementById("animationWrapper");
    a.animationSelect = document.getElementById('animationSelector');
    a.animationSelect.addEventListener('change', function(e) {
      return a.controllers.activateAnimation(this.value);
    });
    return a.controllers.cleanAnimations();
  },
  controllers: {
    activateAnimation: function(index) {
      var a, count, tgt, total;
      a = App;
      index = parseInt(index, 10);
      a.controllers.cleanAnimations();
      switch (index) {
        case 0:
          tgt = a.controllers.createTargets(1);
          return setTimeout(function() {
            return Moon(tgt).animate({
              "transform": "scale(1.2) rotate(180deg)",
              "duration": 1500
            }).play();
          }, 1);
        case 1:
          tgt = a.controllers.createTargets(1);
          return setTimeout(function() {
            return Moon(tgt).animate({
              "transform": "scale(1.2) rotate(180deg)",
              "duration": 1500
            }).animate({
              "transform": "translate3d(-100px, 0, 0) scale(0.8)",
              "duration": 1500
            }).animate({
              "transform": "translate3d(300px, 0, 0) rotate(30deg)",
              "duration": 1500
            }).animate({
              "transform": "translate3d(0,0,0)",
              "duration": 1500
            }).play();
          }, 1);
        case 2:
          tgt = a.controllers.createTargets(2);
          return setTimeout(function() {
            return Moon(tgt).animate({
              "transform": "scale(1.2) rotate(180deg)",
              "duration": 1500
            }).animate({
              "transform": "translate3d(-100px, 0, 0) scale(0.8)",
              "duration": 1500
            }).animate({
              "transform": "translate3d(300px, 0, 0) rotate(30deg)",
              "duration": 1500
            }).animate({
              "transform": "translate3d(0,0,0)",
              "duration": 1500
            }).play();
          }, 1);
        case 3:
          tgt = a.controllers.createTargets(1);
          return setTimeout(function() {
            return Moon(tgt).animate({
              "transform": "scale(1.2) rotate(180deg)",
              "duration": 1500
            }).play(function() {
              return alert("callback called");
            });
          }, 1);
        case 4:
          tgt = a.controllers.createTargets(1);
          return setTimeout(function() {
            return Moon(tgt).animate({
              "transform": "scale(1.2) rotate(180deg)",
              "duration": 1500,
              "beforeAnimation": function() {
                return alert("Function called before animation");
              },
              "afterAnimation": function() {
                return alert("Function called after animation");
              }
            }).animate({
              "transform": "scale(1) rotate(0deg)",
              "duration": 1000,
              "beforeAnimation": function() {
                return alert("Function called before animation");
              },
              "afterAnimation": function() {
                return alert("Function called after animation");
              }
            }).play();
          }, 1);
        case 5:
          total = 1000;
          tgt = [];
          tgt.push(a.controllers.createTargets(total / 4, "mini"));
          tgt.push(a.controllers.createTargets(total / 4, "mini"));
          tgt.push(a.controllers.createTargets(total / 4, "mini"));
          tgt.push(a.controllers.createTargets(total / 4, "mini"));
          count = 0;
          return setTimeout(function() {
            var animation;
            animation = function() {
              console.log(count);
              Moon(tgt[count]).animate({
                "transform": "translate3d(" + ((Math.random() - 0.5) * 100) + "px, " + ((Math.random() - 0.5) * 100) + "px, 0) scale3d(" + (Math.random() + 0.5) + ", " + (Math.random() + 0.5) + ", " + (Math.random() + 0.5) + ")",
                "duration": 100
              }).play();
              count++;
              if (count > 3) {
                count = 0;
              }
              return requestAnimationFrame(animation);
            };
            return animation();
          }, 10);
      }
    },
    cleanAnimations: function() {
      var a, _results;
      a = App;
      _results = [];
      while (a.animationWrapper.firstChild) {
        _results.push(a.animationWrapper.removeChild(a.animationWrapper.firstChild));
      }
      return _results;
    },
    createTargets: function(num, cls) {
      var a, i, tgt, tgtFrag, tgtsCreated, _i;
      a = App;
      tgtsCreated = [];
      tgtFrag = document.createDocumentFragment();
      for (i = _i = 1; 1 <= num ? _i <= num : _i >= num; i = 1 <= num ? ++_i : --_i) {
        tgt = document.createElement('div');
        tgt.classList.add('target');
        if (cls != null) {
          tgt.classList.add(cls);
        }
        tgtFrag.appendChild(tgt);
        tgtsCreated.push(tgt);
      }
      a.animationWrapper.appendChild(tgtFrag);
      return tgtsCreated;
    }
  }
};

window.onload = App.init;
