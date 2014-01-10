/*!
  © Microsoft. All rights reserved.

  This library is supported for use in Windows Store apps only.

  Build: 1.0.8514.0.win8_rtm.120711-1900
  
  Version: Microsoft.WinJS.1.0
*/
typeof WinJS == "undefined" && (function(a) {
  a.msSetImmediate || (a.msSetImmediate = function(b) {
    return a.setTimeout(b, 0)
  }), a.setImmediate || (a.setImmediate = function(b) {
    return a.setTimeout(b, 0)
  })
}(this), function(b, c) {
  function d(a, b) {
    var d = Object.keys(b),
      e, f, g;
    for (f = 0, g = d.length; f < g; f++) {
      var h = d[f],
        i = h.charCodeAt(0) !== 95,
        j = b[h];
      if (j && typeof j == "object")
        if (j.value !== c || typeof j.get == "function" || typeof j.set == "function") {
          j.enumerable === c && (j.enumerable = i), e = e || {}, e[h] = j;
          continue
        }
      if (!i) {
        e = e || {}, e[h] = {
          value: j,
          enumerable: i,
          configurable: !0,
          writable: !0
        };
        continue
      }
      a[h] = j
    }
    e && Object.defineProperties(a, e)
  }(function(a) {
    function e(a, b, c) {
      var e = a,
        f = b.split(".");
      for (var g = 0, h = f.length; g < h; g++) {
        var i = f[g];
        e[i] || Object.defineProperty(e, i, {
          value: {},
          writable: !1,
          enumerable: !0,
          configurable: !0
        }), e = e[i]
      }
      return c && d(e, c), e
    }

    function f(a, c) {
      return e(b, a, c)
    }
    b[a] || (b[a] = Object.create(Object.prototype));
    var c = b[a];
    c.Namespace || (c.Namespace = Object.create(Object.prototype)), Object.defineProperties(c.Namespace, {
      defineWithParent: {
        value: e,
        writable: !0,
        enumerable: !0,
        configurable: !0
      },
      define: {
        value: f,
        writable: !0,
        enumerable: !0,
        configurable: !0
      }
    })
  })("WinJS"),
  function(a) {
    function b(b, c, e) {
      return b = b || function() {}, a.Utilities.markSupportedForProcessing(b), c && d(b.prototype, c), e && d(b, e),
        b
    }

    function c(c, e, f, g) {
      if (c) {
        e = e || function() {};
        var h = c.prototype;
        return e.prototype = Object.create(h), a.Utilities.markSupportedForProcessing(e), Object.defineProperty(e.prototype,
          "constructor", {
            value: e,
            writable: !0,
            configurable: !0,
            enumerable: !0
          }), f && d(e.prototype, f), g && d(e, g), e
      }
      return b(e, f, g)
    }

    function e(a) {
      a = a || function() {};
      var b, c;
      for (b = 1, c = arguments.length; b < c; b++) d(a.prototype, arguments[b]);
      return a
    }
    a.Namespace.define("WinJS.Class", {
      define: b,
      derive: c,
      mix: e
    })
  }(WinJS)
}(this), function(b, c) {
  function f(a) {
    return a
  }

  function g(a, b, c) {
    return a.split(".").reduce(function(a, b) {
      return a ? c(a[b]) : null
    }, b)
  }
  var d = !! b.Windows,
    e = {
      notSupportedForProcessing: "Value is not supported within a declarative processing context, if you want it to be supported mark it using WinJS.Utilities.markSupportedForProcessing. The value was: '{0}'"
    };
  c.Namespace.define("WinJS.Utilities", {
    _setHasWinRT: {
      value: function(a) {
        d = a
      },
      configurable: !1,
      writable: !1,
      enumerable: !1
    },
    hasWinRT: {
      get: function() {
        return d
      },
      configurable: !1,
      enumerable: !0
    },
    _getMemberFiltered: g,
    getMember: function(a, c) {
      return a ? g(a, c || b, f) : null
    },
    ready: function(a, d) {
      return new c.Promise(function(e, f) {
        function g() {
          if (a) try {
            a(), e()
          } catch (b) {
            f(b)
          } else e()
        }
        var h = c.Utilities.testReadyState;
        h || (b.document ? h = document.readyState : h = "complete"), h === "complete" || b.document && document.body !==
          null ? d ? msSetImmediate(g) : g() : b.addEventListener("DOMContentLoaded", g, !1)
      })
    },
    strictProcessing: {
      get: function() {
        return !0
      },
      configurable: !1,
      enumerable: !0
    },
    markSupportedForProcessing: {
      value: function(a) {
        return a.supportedForProcessing = !0, a
      },
      configurable: !1,
      writable: !1,
      enumerable: !0
    },
    requireSupportedForProcessing: {
      value: function(a) {
        var d = !0;
        d = d && a !== b, d = d && a !== b.location, d = d && !(a instanceof HTMLIFrameElement), d = d && (typeof a !=
          "function" || !! a.supportedForProcessing);
        switch (b.frames.length) {
          case 0:
            break;
          case 1:
            d = d && a !== b.frames[0];
            break;
          default:
            for (var f = 0, g = b.frames.length; d && f < g; f++) d = d && a !== b.frames[f]
        }
        if (d) return a;
        throw new c.ErrorFromName("WinJS.Utilities.requireSupportedForProcessing", c.Resources._formatString(e.notSupportedForProcessing,
          a))
      },
      configurable: !1,
      writable: !1,
      enumerable: !0
    }
  }), c.Namespace.define("WinJS", {
    validation: !1,
    strictProcessing: {
      value: function() {},
      configurable: !1,
      writable: !1,
      enumerable: !1
    }
  })
}(this, WinJS), function() {
  function d(a, d, e) {
    var f = a;
    return typeof f == "function" && (f = f()), (e && c.test(e) ? "" : e ? e + ": " : "") + (d ? d.replace(b, ":") +
      ": " : "") + f
  }

  function e(a, b, d) {
    var e = WinJS.Utilities.formatLog(a, b, d);
    console[d && c.test(d) ? d : "log"](e)
  }

  function f(a) {
    return a.replace(/[-[\]{}()*+?.,\\^$|#]/g, "\\$&")
  }
  var b = /\s+/g,
    c = /^(error|warn|info|log)$/;
  WinJS.Namespace.define("WinJS.Utilities", {
    startLog: function(a) {
      a = a || {}, typeof a == "string" && (a = {
        tags: a
      });
      var c = a.type && new RegExp("^(" + f(a.type).replace(b, " ").split(" ").join("|") + ")$"),
        d = a.excludeTags && new RegExp("(^|\\s)(" + f(a.excludeTags).replace(b, " ").split(" ").join("|") +
          ")(\\s|$)", "i"),
        g = a.tags && new RegExp("(^|\\s)(" + f(a.tags).replace(b, " ").split(" ").join("|") + ")(\\s|$)", "i"),
        h = a.action || e;
      if (!c && !d && !g && !WinJS.log) {
        WinJS.log = h;
        return
      }
      var i = function(a, b, e) {
        c && !c.test(e) || d && d.test(b) || g && !g.test(b) || h(a, b, e), i.next && i.next(a, b, e)
      };
      i.next = WinJS.log, WinJS.log = i
    },
    stopLog: function() {
      delete WinJS.log
    },
    formatLog: d
  })
}(), function(b, c) {
  function d(a) {
    var b = "_on" + a + "state";
    return {
      get: function() {
        var a = this[b];
        return a && a.userHandler
      },
      set: function(c) {
        var d = this[b];
        c ? (d || (d = {
          wrapper: function(a) {
            return d.userHandler(a)
          },
          userHandler: c
        }, Object.defineProperty(this, b, {
          value: d,
          enumerable: !1,
          writable: !0,
          configurable: !0
        }), this.addEventListener(a, d.wrapper, !1)), d.userHandler = c) : d && (this.removeEventListener(a, d.wrapper, !
          1), this[b] = null)
      },
      enumerable: !0
    }
  }

  function e(a) {
    var b = {};
    for (var c = 0, e = arguments.length; c < e; c++) {
      var f = arguments[c];
      b["on" + f] = d(f)
    }
    return b
  }
  var f = b.Class.define(function(b, c, d) {
    this.detail = c, this.target = d, this.timeStamp = Date.now(), this.type = b
  }, {
    bubbles: {
      value: !1,
      writable: !1
    },
    cancelable: {
      value: !1,
      writable: !1
    },
    currentTarget: {
      get: function() {
        return this.target
      }
    },
    defaultPrevented: {
      get: function() {
        return this._preventDefaultCalled
      }
    },
    trusted: {
      value: !1,
      writable: !1
    },
    eventPhase: {
      value: 0,
      writable: !1
    },
    target: null,
    timeStamp: null,
    type: null,
    preventDefault: function() {
      this._preventDefaultCalled = !0
    },
    stopImmediatePropagation: function() {
      this._stopImmediatePropagationCalled = !0
    },
    stopPropagation: function() {}
  }, {
    supportedForProcessing: !1
  }),
    g = {
      _listeners: null,
      addEventListener: function(a, b, c) {
        c = c || !1, this._listeners = this._listeners || {};
        var d = this._listeners[a] = this._listeners[a] || [];
        for (var e = 0, f = d.length; e < f; e++) {
          var g = d[e];
          if (g.useCapture === c && g.listener === b) return
        }
        d.push({
          listener: b,
          useCapture: c
        })
      },
      dispatchEvent: function(a, b) {
        var c = this._listeners && this._listeners[a];
        if (c) {
          var d = new f(a, b, this);
          c = c.slice(0, c.length);
          for (var e = 0, g = c.length; e < g && !d._stopImmediatePropagationCalled; e++) c[e].listener(d);
          return d.defaultPrevented || !1
        }
        return !1
      },
      removeEventListener: function(a, b, c) {
        c = c || !1;
        var d = this._listeners && this._listeners[a];
        if (d)
          for (var e = 0, f = d.length; e < f; e++) {
            var g = d[e];
            if (g.listener === b && g.useCapture === c) {
              d.splice(e, 1), d.length === 0 && delete this._listeners[a];
              break
            }
          }
      }
    };
  b.Namespace.define("WinJS.Utilities", {
    _createEventProperty: d,
    createEventProperties: e,
    eventMixin: g
  })
}(WinJS), function(b, c, d) {
  var e, f = !1,
    g = "contextchanged",
    h = c.Class.mix(c.Class.define(null, {}, {
      supportedForProcessing: !1
    }), c.Utilities.eventMixin),
    i = new h,
    j = {
      malformedFormatStringInput: "Malformed, did you mean to escape your '{0}'?"
    };
  c.Namespace.define("WinJS.Resources", {
    addEventListener: function(a, b, d) {
      if (c.Utilities.hasWinRT && !f && a === g) try {
        Windows.ApplicationModel.Resources.Core.ResourceManager.current.defaultContext.qualifierValues.addEventListener(
          "mapchanged", function(a) {
            c.Resources.dispatchEvent(g, {
              qualifier: a.key,
              changed: a.target[a.key]
            })
          }, !1), f = !0
      } catch (e) {}
      i.addEventListener(a, b, d)
    },
    removeEventListener: i.removeEventListener.bind(i),
    dispatchEvent: i.dispatchEvent.bind(i),
    _formatString: function(a) {
      var b = arguments;
      return b.length > 1 && (a = a.replace(/({{)|(}})|{(\d+)}|({)|(})/g, function(a, d, e, f, g, h) {
        if (g || h) throw c.Resources._formatString(j.malformedFormatStringInput, g || h);
        return d && "{" || e && "}" || b[(f | 0) + 1]
      })), a
    },
    _getStringWinRT: function(a) {
      if (!e) {
        var b = Windows.ApplicationModel.Resources.Core.ResourceManager.current.mainResourceMap;
        try {
          e = b.getSubtree("Resources")
        } catch (c) {}
        e || (e = b)
      }
      var f, g, h;
      try {
        h = e.getValue(a), h && (f = h.valueAsString, f === d && (f = h.toString()))
      } catch (c) {}
      if (!f) return {
        value: a,
        empty: !0
      };
      try {
        g = h.getQualifierValue("Language")
      } catch (c) {
        return {
          value: f
        }
      }
      return {
        value: f,
        lang: g
      }
    },
    _getStringJS: function(a) {
      var c = b.strings && b.strings[a];
      return typeof c == "string" && (c = {
        value: c
      }), c || {
        value: a,
        empty: !0
      }
    }
  }), Object.defineProperties(c.Resources, c.Utilities.createEventProperties(g));
  var k;
  c.Resources.getString = function(a) {
    return k = k || (c.Utilities.hasWinRT ? c.Resources._getStringWinRT : c.Resources._getStringJS), k(a)
  }
}(this, WinJS), function(b, c) {
  function u() {}

  function w(a, b) {
    var c;
    b && typeof b == "object" && typeof b.then == "function" ? c = m : c = q, a._value = b, a._setState(c)
  }

  function x(a, b, c, d, e, f) {
    return {
      exception: a,
      error: b,
      promise: c,
      handler: f,
      id: d,
      parent: e
    }
  }

  function y(a, b, c, d) {
    var e = c._isException,
      f = c._errorId;
    return x(e ? b : null, e ? null : b, a, f, c, d)
  }

  function z(a, b, c) {
    var d = c._isException,
      e = c._errorId;
    return J(a, e, d), x(d ? b : null, d ? null : b, a, e, c)
  }

  function A(a, b) {
    var c = ++j;
    return J(a, c), x(null, b, a, c)
  }

  function B(a, b) {
    var c = ++j;
    return J(a, c, !0), x(b, null, a, c)
  }

  function C(a, b, c, d) {
    I(a, {
      c: b,
      e: c,
      p: d
    })
  }

  function D(a, b, c, d) {
    a._value = b, G(a, b, c, d), a._setState(s)
  }

  function E(a, b) {
    var c = a._value,
      d = a._listeners;
    if (!d) return;
    a._listeners = null;
    var e, f;
    for (e = 0, f = Array.isArray(d) ? d.length : 1; e < f; e++) {
      var g = f === 1 ? d : d[e],
        h = g.c,
        i = g.promise;
      if (i) {
        try {
          i._setCompleteValue(h ? h(c) : c)
        } catch (j) {
          i._setExceptionValue(j)
        }
        i._state !== m && i._listeners && b.push(i)
      } else Q.prototype.done.call(a, h)
    }
  }

  function F(a, b) {
    var c = a._value,
      d = a._listeners;
    if (!d) return;
    a._listeners = null;
    var e, f;
    for (e = 0, f = Array.isArray(d) ? d.length : 1; e < f; e++) {
      var g = f === 1 ? d : d[e],
        h = g.e,
        i = g.promise;
      if (i) {
        try {
          h ? (h.handlesOnError || G(i, c, y, a, h), i._setCompleteValue(h(c))) : i._setChainedErrorValue(c, a)
        } catch (j) {
          i._setExceptionValue(j)
        }
        i._state !== m && i._listeners && b.push(i)
      } else O.prototype.done.call(a, null, h)
    }
  }

  function G(a, b, c, d, h) {
    if (e._listeners[f]) {
      if (b instanceof Error && b.message === g) return;
      e.dispatchEvent(f, c(a, b, d, h))
    }
  }

  function H(a, b) {
    var c = a._listeners;
    if (c) {
      var d, e;
      for (d = 0, e = Array.isArray(c) ? c.length : 1; d < e; d++) {
        var f = e === 1 ? c : c[d],
          g = f.p;
        if (g) try {
          g(b)
        } catch (h) {}!f.c && !f.e && f.promise && f.promise._progress(b)
      }
    }
  }

  function I(a, b) {
    var c = a._listeners;
    c ? (c = Array.isArray(c) ? c : [c], c.push(b)) : c = b, a._listeners = c
  }

  function J(a, b, c) {
    a._isException = c || !1, a._errorId = b
  }

  function K(a, b, c, d) {
    a._value = b, G(a, b, c, d), a._setState(t)
  }

  function L(a, b) {
    var c;
    b && typeof b == "object" && typeof b.then == "function" ? c = m : c = r, a._value = b, a._setState(c)
  }

  function M(a, b, c, d) {
    var e = new N(a);
    return I(a, {
      promise: e,
      c: b,
      e: c,
      p: d
    }), e
  }

  function R(a) {
    var b;
    return new WinJS.Promise(function(c) {
      a ? b = setTimeout(c, a) : setImmediate(c)
    }, function() {
      b && clearTimeout(b)
    })
  }

  function S(a, b) {
    var c = function() {
      b.cancel()
    }, d = function() {
        a.cancel()
      };
    return a.then(c), b.then(d, d), b
  }
  b.Debug && (b.Debug.setNonUserCodeExceptions = !0);
  var d = WinJS.Class.mix(WinJS.Class.define(null, {}, {
    supportedForProcessing: !1
  }), WinJS.Utilities.eventMixin),
    e = new d;
  e._listeners = {};
  var f = "error",
    g = "Canceled",
    h = !1,
    i = {
      promise: 1,
      thenPromise: 2,
      errorPromise: 4,
      exceptionPromise: 8,
      completePromise: 16
    };
  i.all = i.promise | i.thenPromise | i.errorPromise | i.exceptionPromise | i.completePromise;
  var j = 1,
    k, l, m, n, o, p, q, r, s, t;
  k = {
    name: "created",
    enter: function(a) {
      a._setState(l)
    },
    cancel: u,
    done: u,
    then: u,
    _completed: u,
    _error: u,
    _notify: u,
    _progress: u,
    _setCompleteValue: u,
    _setErrorValue: u
  }, l = {
    name: "working",
    enter: u,
    cancel: function(a) {
      a._setState(o)
    },
    done: C,
    then: M,
    _completed: w,
    _error: D,
    _notify: u,
    _progress: H,
    _setCompleteValue: L,
    _setErrorValue: K
  }, m = {
    name: "waiting",
    enter: function(a) {
      var b = a._value,
        c = function(d) {
          b._errorId ? a._chainedError(d, b) : (G(a, d, y, b, c), a._error(d))
        };
      c.handlesOnError = !0, b.then(a._completed.bind(a), c, a._progress.bind(a))
    },
    cancel: function(a) {
      a._setState(n)
    },
    done: C,
    then: M,
    _completed: w,
    _error: D,
    _notify: u,
    _progress: H,
    _setCompleteValue: L,
    _setErrorValue: K
  }, n = {
    name: "waiting_canceled",
    enter: function(a) {
      a._setState(p);
      var b = a._value;
      b.cancel && b.cancel()
    },
    cancel: u,
    done: C,
    then: M,
    _completed: w,
    _error: D,
    _notify: u,
    _progress: H,
    _setCompleteValue: L,
    _setErrorValue: K
  }, o = {
    name: "canceled",
    enter: function(a) {
      a._setState(p), a._cancelAction()
    },
    cancel: u,
    done: C,
    then: M,
    _completed: w,
    _error: D,
    _notify: u,
    _progress: H,
    _setCompleteValue: L,
    _setErrorValue: K
  }, p = {
    name: "canceling",
    enter: function(a) {
      var b = new Error(g);
      b.name = b.message, a._value = b, a._setState(s)
    },
    cancel: u,
    done: u,
    then: u,
    _completed: u,
    _error: u,
    _notify: u,
    _progress: u,
    _setCompleteValue: u,
    _setErrorValue: u
  }, q = {
    name: "complete_notify",
    enter: function(a) {
      a.done = Q.prototype.done, a.then = Q.prototype.then;
      if (a._listeners) {
        var b = [a],
          c;
        while (b.length) c = b.pop(), c._state._notify(c, b)
      }
      a._setState(r)
    },
    cancel: u,
    done: null,
    then: null,
    _completed: u,
    _error: u,
    _notify: E,
    _progress: u,
    _setCompleteValue: u,
    _setErrorValue: u
  }, r = {
    name: "success",
    enter: function(a) {
      a.done = Q.prototype.done, a.then = Q.prototype.then, a._cleanupAction()
    },
    cancel: u,
    done: null,
    then: null,
    _completed: u,
    _error: u,
    _notify: E,
    _progress: u,
    _setCompleteValue: u,
    _setErrorValue: u
  }, s = {
    name: "error_notify",
    enter: function(a) {
      a.done = O.prototype.done, a.then = O.prototype.then;
      if (a._listeners) {
        var b = [a],
          c;
        while (b.length) c = b.pop(), c._state._notify(c, b)
      }
      a._setState(t)
    },
    cancel: u,
    done: null,
    then: null,
    _completed: u,
    _error: u,
    _notify: F,
    _progress: u,
    _setCompleteValue: u,
    _setErrorValue: u
  }, t = {
    name: "error",
    enter: function(a) {
      a.done = O.prototype.done, a.then = O.prototype.then, a._cleanupAction()
    },
    cancel: u,
    done: null,
    then: null,
    _completed: u,
    _error: u,
    _notify: F,
    _progress: u,
    _setCompleteValue: u,
    _setErrorValue: u
  };
  var v = WinJS.Class.define(null, {
    _listeners: null,
    _nextState: null,
    _state: null,
    _value: null,
    cancel: function() {
      this._state.cancel(this), this._run()
    },
    done: function(b, c, d) {
      this._state.done(this, b, c, d)
    },
    then: function(b, c, d) {
      return this._state.then(this, b, c, d)
    },
    _chainedError: function(a, b) {
      var c = this._state._error(this, a, z, b);
      return this._run(), c
    },
    _completed: function(a) {
      var b = this._state._completed(this, a);
      return this._run(), b
    },
    _error: function(a) {
      var b = this._state._error(this, a, A);
      return this._run(), b
    },
    _progress: function(a) {
      this._state._progress(this, a)
    },
    _setState: function(a) {
      this._nextState = a
    },
    _setCompleteValue: function(a) {
      this._state._setCompleteValue(this, a), this._run()
    },
    _setChainedErrorValue: function(a, b) {
      var c = this._state._setErrorValue(this, a, z, b);
      return this._run(), c
    },
    _setExceptionValue: function(a) {
      var b = this._state._setErrorValue(this, a, B);
      return this._run(), b
    },
    _run: function() {
      while (this._nextState) this._state = this._nextState, this._nextState = null, this._state.enter(this)
    }
  }, {
    supportedForProcessing: !1
  }),
    N = WinJS.Class.derive(v, function(a) {
      h && (h === !0 || h & i.thenPromise) && (this._stack = WinJS.Promise._getStack()), this._creator = a, this._setState(
        k), this._run()
    }, {
      _creator: null,
      _cancelAction: function() {
        this._creator && this._creator.cancel()
      },
      _cleanupAction: function() {
        this._creator = null
      }
    }, {
      supportedForProcessing: !1
    }),
    O = WinJS.Class.define(function(b) {
      h && (h === !0 || h & i.errorPromise) && (this._stack = WinJS.Promise._getStack()), this._value = b, G(this,
        b, A)
    }, {
      cancel: function() {},
      done: function(b, c) {
        var d = this._value;
        if (c) try {
          c.handlesOnError || G(null, d, y, this, c);
          var e = c(d);
          e && typeof e == "object" && typeof e.done == "function" && e.done();
          return
        } catch (f) {
          d = f
        }
        if (d instanceof Error && d.message === g) return;
        setImmediate(function() {
          throw d
        })
      },
      then: function(b, c) {
        if (!c) return this;
        var d, e = this._value;
        try {
          c.handlesOnError || G(null, e, y, this, c), d = new Q(c(e))
        } catch (f) {
          f === e ? d = this : d = new P(f)
        }
        return d
      }
    }, {
      supportedForProcessing: !1
    }),
    P = WinJS.Class.derive(O, function(b) {
      h && (h === !0 || h & i.exceptionPromise) && (this._stack = WinJS.Promise._getStack()), this._value = b, G(
        this, b, B)
    }, {}, {
      supportedForProcessing: !1
    }),
    Q = WinJS.Class.define(function(b) {
      h && (h === !0 || h & i.completePromise) && (this._stack = WinJS.Promise._getStack());
      if (b && typeof b == "object" && typeof b.then == "function") {
        var c = new N(null);
        return c._setCompleteValue(b), c
      }
      this._value = b
    }, {
      cancel: function() {},
      done: function(b) {
        if (!b) return;
        try {
          var c = b(this._value);
          c && typeof c == "object" && typeof c.done == "function" && c.done()
        } catch (d) {
          setImmediate(function() {
            throw d
          })
        }
      },
      then: function(b) {
        try {
          var c = b ? b(this._value) : this._value;
          return c === this._value ? this : new Q(c)
        } catch (d) {
          return new P(d)
        }
      }
    }, {
      supportedForProcessing: !1
    }),
    T, U = WinJS.Class.derive(v, function(b, c) {
      h && (h === !0 || h & i.promise) && (this._stack = WinJS.Promise._getStack()), this._oncancel = c, this._setState(
        k), this._run();
      try {
        var d = this._completed.bind(this),
          e = this._error.bind(this),
          f = this._progress.bind(this);
        b(d, e, f)
      } catch (g) {
        this._setExceptionValue(g)
      }
    }, {
      _oncancel: null,
      _cancelAction: function() {
        if (this._oncancel) try {
          this._oncancel()
        } catch (a) {}
      },
      _cleanupAction: function() {
        this._oncancel = null
      }
    }, {
      addEventListener: function(b, c, d) {
        e.addEventListener(b, c, d)
      },
      any: function(b) {
        return new U(function(a, c, d) {
          var e = Object.keys(b),
            f = Array.isArray(b) ? [] : {};
          e.length === 0 && a();
          var h = 0;
          e.forEach(function(d) {
            U.as(b[d]).then(function() {
              a({
                key: d,
                value: b[d]
              })
            }, function(f) {
              if (f instanceof Error && f.name === g) {
                ++h === e.length && a(WinJS.Promise.cancel);
                return
              }
              c({
                key: d,
                value: b[d]
              })
            })
          })
        }, function() {
          var a = Object.keys(b);
          a.forEach(function(a) {
            var c = U.as(b[a]);
            typeof c.cancel == "function" && c.cancel()
          })
        })
      },
      as: function(b) {
        return b && typeof b == "object" && typeof b.then == "function" ? b : new Q(b)
      },
      cancel: {
        get: function() {
          return T = T || new O(new WinJS.ErrorFromName(g))
        }
      },
      dispatchEvent: function(b, c) {
        return e.dispatchEvent(b, c)
      },
      is: function(b) {
        return b && typeof b == "object" && typeof b.then == "function"
      },
      join: function(b) {
        return new U(function(a, d, e) {
          var f = Object.keys(b),
            h = Array.isArray(b) ? [] : {}, i = Array.isArray(b) ? [] : {}, j = 0,
            k = f.length,
            l = function(b) {
              if (--k === 0) {
                var c = Object.keys(h).length;
                if (c === 0) a(i);
                else {
                  var j = 0;
                  f.forEach(function(a) {
                    var b = h[a];
                    b instanceof Error && b.name === g && j++
                  }), j === c ? a(WinJS.Promise.cancel) : d(h)
                }
              } else e({
                Key: b,
                Done: !0
              })
            };
          f.forEach(function(a) {
            var d = b[a];
            d === c ? j++ : U.then(d, function(b) {
              i[a] = b, l(a)
            }, function(b) {
              h[a] = b, l(a)
            })
          }), k -= j;
          if (k === 0) {
            a(i);
            return
          }
        }, function() {
          Object.keys(b).forEach(function(a) {
            var c = U.as(b[a]);
            typeof c.cancel == "function" && c.cancel()
          })
        })
      },
      removeEventListener: function(b, c, d) {
        e.removeEventListener(b, c, d)
      },
      supportedForProcessing: !1,
      then: function(b, c, d, e) {
        return U.as(b).then(c, d, e)
      },
      thenEach: function(b, c, d, e) {
        var f = Array.isArray(b) ? [] : {};
        return Object.keys(b).forEach(function(a) {
          f[a] = U.as(b[a]).then(c, d, e)
        }), U.join(f)
      },
      timeout: function(b, c) {
        var d = R(b);
        return c ? S(d, c) : d
      },
      wrap: function(b) {
        return new Q(b)
      },
      wrapError: function(b) {
        return new O(b)
      },
      _veryExpensiveTagWithStack: {
        get: function() {
          return h
        },
        set: function(a) {
          h = a
        }
      },
      _veryExpensiveTagWithStack_tag: i,
      _getStack: function() {
        if (Debug.debuggerEnabled) try {
          throw new Error
        } catch (a) {
          return a.stack
        }
      }
    });
  Object.defineProperties(U, WinJS.Utilities.createEventProperties(f));
  var V = WinJS.Class.derive(v, function(a) {
    this._oncancel = a, this._setState(k), this._run()
  }, {
    _cancelAction: function() {
      this._oncancel && this._oncancel()
    },
    _cleanupAction: function() {
      this._oncancel = null
    }
  }, {
    supportedForProcessing: !1
  }),
    W = WinJS.Class.define(function(b) {
      this._promise = new V(b)
    }, {
      promise: {
        get: function() {
          return this._promise
        }
      },
      cancel: function() {
        this._promise.cancel()
      },
      complete: function(b) {
        this._promise._completed(b)
      },
      error: function(b) {
        this._promise._error(b)
      },
      progress: function(b) {
        this._promise._progress(b)
      }
    }, {
      supportedForProcessing: !1
    });
  WinJS.Namespace.define("WinJS", {
    Promise: U,
    _Signal: W
  })
}(this), function(b, c) {
  c.Namespace.define("WinJS", {
    ErrorFromName: c.Class.derive(Error, function(a, b) {
      this.name = a, this.message = b || a
    }, {}, {
      supportedForProcessing: !1
    })
  })
}(this, WinJS), function() {
  WinJS.Namespace.define("WinJS", {
    xhr: function(a) {
      var b;
      return new WinJS.Promise(function(c, d, e) {
        b = new XMLHttpRequest, b.onreadystatechange = function() {
          if (b._canceled) return;
          b.readyState === 4 ? (b.status >= 200 && b.status < 300 || b.status === 1223 ? c(b) : d(b), b.onreadystatechange =
            function() {}) : e(b)
        }, b.open(a.type || "GET", a.url, !0, a.user, a.password), b.responseType = a.responseType || "", Object.keys(
          a.headers || {}).forEach(function(c) {
          b.setRequestHeader(c, a.headers[c])
        }), b.setRequestHeader("X-Requested-With", "XMLHttpRequest"), a.customRequestInitializer && a.customRequestInitializer(
          b), b.send(a.data)
      }, function() {
        b._canceled = !0, b.abort()
      })
    }
  })
}(), function(b, c) {
  var d, e, f, g, h, i, j = {
      nonStaticHTML: "Unable to add dynamic content. A script attempted to inject dynamic content, or elements previously modified dynamically, that might be unsafe. For example, using the innerHTML property or the document.write method to add a script element will generate this exception. If the content is safe and from a trusted source, use a method to explicitly manipulate elements and attributes, such as createElement, or use setInnerHTMLUnsafe (or other unsafe method)."
    };
  d = e = function(a, b) {
    a.innerHTML = b
  }, f = g = function(a, b) {
    a.outerHTML = b
  }, h = i = function(a, b, c) {
    a.insertAdjacentHTML(b, c)
  };
  var k = b.MSApp;
  if (k) e = function(a, b) {
    k.execUnsafeLocalFunction(function() {
      a.innerHTML = b
    })
  }, g = function(a, b) {
    k.execUnsafeLocalFunction(function() {
      a.outerHTML = b
    })
  }, i = function(a, b, c) {
    k.execUnsafeLocalFunction(function() {
      a.insertAdjacentHTML(b, c)
    })
  };
  else if (b.msIsStaticHTML) {
    var l = function(a) {
      if (!b.msIsStaticHTML(a)) throw new WinJS.ErrorFromName("WinJS.Utitilies.NonStaticHTML", j.nonStaticHTML)
    };
    d = function(a, b) {
      l(b), a.innerHTML = b
    }, f = function(a, b) {
      l(b), a.outerHTML = b
    }, h = function(a, b, c) {
      l(c), a.insertAdjacentHTML(b, c)
    }
  }
  WinJS.Namespace.define("WinJS.Utilities", {
    setInnerHTML: d,
    setInnerHTMLUnsafe: e,
    setOuterHTML: f,
    setOuterHTMLUnsafe: g,
    insertAdjacentHTML: h,
    insertAdjacentHTMLUnsafe: i
  })
}(this))