if ("undefined" == typeof WinJS) {
  ! function(e) {
    if (!e.setImmediate) {
      e.setImmediate = function(t) {
        return e.setTimeout(t, 0);
      };
    }
  }(this);
  (function(e, t) {
    "use strict";

    function n(e, n) {
      var i;

      var o;

      var r;

      var s = Object.keys(n);
      for (o = 0, r = s.length; r > o; o++) {
        var a = s[o];

        var u = 95 !== a.charCodeAt(0);

        var l = n[a];
        !l || "object" != typeof l || l.value === t && "function" != typeof l.get && "function" != typeof l.set ? u ?
          e[a] = l : (i = i || {}, i[a] = {
            value: l,
            enumerable: u,
            configurable: !0,
            writable: !0
          }) : (l.enumerable === t && (l.enumerable = u), i = i || {}, i[a] = l);
      }
      if (i) {
        Object.defineProperties(e, i);
      }
    }! function(t) {
      function i(e, t, i) {
        for (var o = e, r = t.split("."), s = 0, a = r.length; a > s; s++) {
          var u = r[s];
          if (!o[u]) {
            Object.defineProperty(o, u, {
              value: {},
              writable: !1,
              enumerable: !0,
              configurable: !0
            });
          }

          o = o[u];
        }
        i && n(o, i);

        return o;
      }

      function o(t, n) {
        return i(e, t, n);
      }
      if (!e[t]) {
        e[t] = Object.create(Object.prototype);
      }
      var r = e[t];
      if (!r.Namespace) {
        r.Namespace = Object.create(Object.prototype);
      }

      Object.defineProperties(r.Namespace, {
        defineWithParent: {
          value: i,
          writable: !0,
          enumerable: !0,
          configurable: !0
        },
        define: {
          value: o,
          writable: !0,
          enumerable: !0,
          configurable: !0
        }
      });
    }("WinJS");

    (function(e) {
      function t(t, i, o) {
        t = t || function() {};

        e.Utilities.markSupportedForProcessing(t);

        i && n(t.prototype, i);

        o && n(t, o);

        return t;
      }

      function i(i, o, r, s) {
        if (i) {
          o = o || function() {};
          var a = i.prototype;
          o.prototype = Object.create(a);

          e.Utilities.markSupportedForProcessing(o);

          Object.defineProperty(o.prototype, "constructor", {
            value: o,
            writable: !0,
            configurable: !0,
            enumerable: !0
          });

          r && n(o.prototype, r);

          s && n(o, s);

          return o;
        }
        return t(o, r, s);
      }

      function o(e) {
        e = e || function() {};
        var t;

        var i;
        for (t = 1, i = arguments.length; i > t; t++) {
          n(e.prototype, arguments[t]);
        }
        return e;
      }
      e.Namespace.define("WinJS.Class", {
        define: t,
        derive: i,
        mix: o
      });
    })(WinJS);
  })(this);
  (function(e, t) {
    "use strict";

    function n(e) {
      return e;
    }

    function i(e, t, n) {
      return e.split(".").reduce(function(e, t) {
        return e ? n(e[t]) : null;
      }, t);
    }
    var o = !! e.Windows;

    var r = {
      notSupportedForProcessing: "Value is not supported within a declarative processing context, if you want it to be supported mark it using WinJS.Utilities.markSupportedForProcessing. The value was: '{0}'"
    };
    t.Namespace.define("WinJS.Utilities", {
      _setHasWinRT: {
        value: function(e) {
          o = e;
        },
        configurable: !1,
        writable: !1,
        enumerable: !1
      },
      hasWinRT: {
        get: function() {
          return o;
        },
        configurable: !1,
        enumerable: !0
      },
      _getMemberFiltered: i,
      getMember: function(t, o) {
        return t ? i(t, o || e, n) : null;
      },
      ready: function(n, i) {
        return new t.Promise(function(o, r) {
          function s() {
            if (n) try {
              n();

              o();
            } catch (e) {
              r(e);
            } else {
              o();
            }
          }
          var a = t.Utilities.testReadyState;
          if (!a) {
            a = e.document ? document.readyState : "complete";
          }

          "complete" === a || e.document && null !== document.body ? i ? e.setImmediate(s) : s() : e.addEventListener(
            "DOMContentLoaded", s, !1);
        });
      },
      strictProcessing: {
        get: function() {
          return !0;
        },
        configurable: !1,
        enumerable: !0
      },
      markSupportedForProcessing: {
        value: function(e) {
          e.supportedForProcessing = !0;

          return e;
        },
        configurable: !1,
        writable: !1,
        enumerable: !0
      },
      requireSupportedForProcessing: {
        value: function(n) {
          var i = !0;
          switch (i = i && !(n === e), i = i && !(n === e.location), i = i && !(n instanceof HTMLIFrameElement), i =
            i && !("function" == typeof n && !n.supportedForProcessing), e.frames.length) {
            case 0:
              break;
            case 1:
              i = i && !(n === e.frames[0]);
              break;
            default:
              for (var o = 0, s = e.frames.length; i && s > o; o++) {
                i = i && !(n === e.frames[o]);
              }
          }
          if (i) {
            return n;
          }
          throw new t.ErrorFromName("WinJS.Utilities.requireSupportedForProcessing", t.Resources._formatString(r.notSupportedForProcessing,
            n));
        },
        configurable: !1,
        writable: !1,
        enumerable: !0
      }
    });

    t.Namespace.define("WinJS", {
      validation: !1,
      strictProcessing: {
        value: function() {},
        configurable: !1,
        writable: !1,
        enumerable: !1
      }
    });
  })(this, WinJS);
  (function() {
    "use strict";

    function e(e, t, n) {
      var r = e;
      "function" == typeof r && (r = r());

      return (n && o.test(n) ? "" : n ? n + ": " : "") + (t ? t.replace(i, ":") + ": " : "") + r;
    }

    function t(e, t, n) {
      var i = WinJS.Utilities.formatLog(e, t, n);
      console[n && o.test(n) ? n : "log"](i);
    }

    function n(e) {
      return e.replace(/[-[\]{}()*+?.,\\^$|#]/g, "\\$&");
    }
    var i = /\s+/g;

    var o = /^(error|warn|info|log)$/;
    WinJS.Namespace.define("WinJS.Utilities", {
      startLog: function(e) {
        e = e || {};

        if ("string" == typeof e) {
          e = {
            tags: e
          };
        }
        var o = e.type && new RegExp("^(" + n(e.type).replace(i, " ").split(" ").join("|") + ")$");

        var r = e.excludeTags && new RegExp("(^|\\s)(" + n(e.excludeTags).replace(i, " ").split(" ").join("|") +
          ")(\\s|$)", "i");

        var s = e.tags && new RegExp("(^|\\s)(" + n(e.tags).replace(i, " ").split(" ").join("|") + ")(\\s|$)", "i");

        var a = e.action || t;
        if (!(o || r || s || WinJS.log)) {
          WinJS.log = a;
          return void 0;
        }
        var u = function(e, t, n) {
          if (!(o && !o.test(n) || r && r.test(t) || s && !s.test(t))) {
            a(e, t, n);
          }

          if (u.next) {
            u.next(e, t, n);
          }
        };
        u.next = WinJS.log;

        WinJS.log = u;
      },
      stopLog: function() {
        delete WinJS.log;
      },
      formatLog: e
    });
  })();
  (function(e) {
    "use strict";

    function t(e) {
      var t = "_on" + e + "state";
      return {
        get: function() {
          var e = this[t];
          return e && e.userHandler;
        },
        set: function(n) {
          var i = this[t];
          n ? (i || (i = {
            wrapper: function(e) {
              return i.userHandler(e);
            },
            userHandler: n
          }, Object.defineProperty(this, t, {
            value: i,
            enumerable: !1,
            writable: !0,
            configurable: !0
          }), this.addEventListener(e, i.wrapper, !1)), i.userHandler = n) : i && (this.removeEventListener(e, i.wrapper, !
            1), this[t] = null);
        },
        enumerable: !0
      };
    }

    function n() {
      for (var e = {}, n = 0, i = arguments.length; i > n; n++) {
        var o = arguments[n];
        e["on" + o] = t(o);
      }
      return e;
    }
    var i = e.Class.define(function(e, t, n) {
      this.detail = t;

      this.target = n;

      this.timeStamp = Date.now();

      this.type = e;
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
          return this.target;
        }
      },
      defaultPrevented: {
        get: function() {
          return this._preventDefaultCalled;
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
        this._preventDefaultCalled = !0;
      },
      stopImmediatePropagation: function() {
        this._stopImmediatePropagationCalled = !0;
      },
      stopPropagation: function() {}
    }, {
      supportedForProcessing: !1
    });

    var o = {
      _listeners: null,
      addEventListener: function(e, t, n) {
        n = n || !1;

        this._listeners = this._listeners || {};
        for (var i = this._listeners[e] = this._listeners[e] || [], o = 0, r = i.length; r > o; o++) {
          var s = i[o];
          if (s.useCapture === n && s.listener === t) return;
        }
        i.push({
          listener: t,
          useCapture: n
        });
      },
      dispatchEvent: function(e, t) {
        var n = this._listeners && this._listeners[e];
        if (n) {
          var o = new i(e, t, this);
          n = n.slice(0, n.length);
          for (var r = 0, s = n.length; s > r && !o._stopImmediatePropagationCalled; r++) {
            n[r].listener(o);
          }
          return o.defaultPrevented || !1;
        }
        return !1;
      },
      removeEventListener: function(e, t, n) {
        n = n || !1;
        var i = this._listeners && this._listeners[e];
        if (i)
          for (var o = 0, r = i.length; r > o; o++) {
            var s = i[o];
            if (s.listener === t && s.useCapture === n) {
              i.splice(o, 1);

              if (0 === i.length) {
                delete this._listeners[e];
              }
              break;
            }
          }
      }
    };
    e.Namespace.define("WinJS.Utilities", {
      _createEventProperty: t,
      createEventProperties: n,
      eventMixin: o
    });
  })(WinJS);
  (function(e, t, n) {
    "use strict";
    var i;

    var o = !1;

    var r = "contextchanged";

    var s = t.Class.mix(t.Class.define(null, {}, {
      supportedForProcessing: !1
    }), t.Utilities.eventMixin);

    var a = new s;

    var u = {
      malformedFormatStringInput: "Malformed, did you mean to escape your '{0}'?"
    };
    t.Namespace.define("WinJS.Resources", {
      addEventListener: function(e, n, i) {
        if (t.Utilities.hasWinRT && !o && e === r) try {
          Windows.ApplicationModel.Resources.Core.ResourceManager.current.defaultContext.qualifierValues.addEventListener(
            "mapchanged", function(e) {
              t.Resources.dispatchEvent(r, {
                qualifier: e.key,
                changed: e.target[e.key]
              });
            }, !1);

          o = !0;
        } catch (s) {}
        a.addEventListener(e, n, i);
      },
      removeEventListener: a.removeEventListener.bind(a),
      dispatchEvent: a.dispatchEvent.bind(a),
      _formatString: function(e) {
        var n = arguments;
        n.length > 1 && (e = e.replace(/({{)|(}})|{(\d+)}|({)|(})/g, function(e, i, o, r, s, a) {
          if (s || a) throw t.Resources._formatString(u.malformedFormatStringInput, s || a);
          return i && "{" || o && "}" || n[(0 | r) + 1];
        }));

        return e;
      },
      _getStringWinRT: function(e) {
        if (!i) {
          var t = Windows.ApplicationModel.Resources.Core.ResourceManager.current.mainResourceMap;
          try {
            i = t.getSubtree("Resources");
          } catch (o) {}
          if (!i) {
            i = t;
          }
        }
        var r;

        var s;

        var a;
        try {
          a = i.getValue(e);

          if (a) {
            r = a.valueAsString;
            if (r === n) {
              r = a.toString();
            }
          }
        } catch (o) {}
        if (!r) {
          return {
            value: e,
            empty: !0
          };
        }
        try {
          s = a.getQualifierValue("Language");
        } catch (o) {
          return {
            value: r
          };
        }
        return {
          value: r,
          lang: s
        };
      },
      _getStringJS: function(t) {
        var n = e.strings && e.strings[t];
        "string" == typeof n && (n = {
          value: n
        });

        return n || {
          value: t,
          empty: !0
        };
      }
    });

    Object.defineProperties(t.Resources, t.Utilities.createEventProperties(r));
    var l;
    t.Resources.getString = function(e) {
      l = l || (t.Utilities.hasWinRT ? t.Resources._getStringWinRT : t.Resources._getStringJS);

      return l(e);
    };
  })(this, WinJS);
  (function(e, t) {
    "use strict";

    function n() {}

    function i(e, t) {
      var n;
      n = t && "object" == typeof t && "function" == typeof t.then ? k : R;

      e._value = t;

      e._setState(n);
    }

    function o(e, t, n, i, o, r) {
      return {
        exception: e,
        error: t,
        promise: n,
        handler: r,
        id: i,
        parent: o
      };
    }

    function r(e, t, n, i) {
      var r = n._isException;

      var s = n._errorId;
      return o(r ? t : null, r ? null : t, e, s, n, i);
    }

    function s(e, t, n) {
      var i = n._isException;

      var r = n._errorId;
      m(e, r, i);

      return o(i ? t : null, i ? null : t, e, r, n);
    }

    function a(e, t) {
      var n = ++H;
      m(e, n);

      return o(null, t, e, n);
    }

    function u(e, t) {
      var n = ++H;
      m(e, n, !0);

      return o(t, null, e, n);
    }

    function l(e, t, n, i) {
      g(e, {
        c: t,
        e: n,
        p: i
      });
    }

    function c(e, t, n, i) {
      e._value = t;

      p(e, t, n, i);

      e._setState(A);
    }

    function d(e, t) {
      var n = e._value;

      var i = e._listeners;
      if (i) {
        e._listeners = null;
        var o;

        var r;
        for (o = 0, r = Array.isArray(i) ? i.length : 1; r > o; o++) {
          var s = 1 === r ? i : i[o];

          var a = s.c;

          var u = s.promise;
          if (u) {
            try {
              u._setCompleteValue(a ? a(n) : n);
            } catch (l) {
              u._setExceptionValue(l);
            }
            if (u._state !== k && u._listeners) {
              t.push(u);
            }
          } else {
            z.prototype.done.call(e, a);
          }
        }
      }
    }

    function h(e, t) {
      var n = e._value;

      var i = e._listeners;
      if (i) {
        e._listeners = null;
        var o;

        var s;
        for (o = 0, s = Array.isArray(i) ? i.length : 1; s > o; o++) {
          var a = 1 === s ? i : i[o];

          var u = a.e;

          var l = a.promise;
          if (l) {
            try {
              u ? (u.handlesOnError || p(l, n, r, e, u), l._setCompleteValue(u(n))) : l._setChainedErrorValue(n, e);
            } catch (c) {
              l._setExceptionValue(c);
            }
            if (l._state !== k && l._listeners) {
              t.push(l);
            }
          } else {
            B.prototype.done.call(e, null, u);
          }
        }
      }
    }

    function p(e, t, n, i, o) {
      if (E._listeners[S]) {
        if (t instanceof Error && t.message === L) return;
        E.dispatchEvent(S, n(e, t, i, o));
      }
    }

    function f(e, t) {
      var n = e._listeners;
      if (n) {
        var i;

        var o;
        for (i = 0, o = Array.isArray(n) ? n.length : 1; o > i; i++) {
          var r = 1 === o ? n : n[i];

          var s = r.p;
          if (s) try {
            s(t);
          } catch (a) {}
          if (!(r.c || r.e || !r.promise)) {
            r.promise._progress(t);
          }
        }
      }
    }

    function g(e, t) {
      var n = e._listeners;
      n ? (n = Array.isArray(n) ? n : [n], n.push(t)) : n = t;

      e._listeners = n;
    }

    function m(e, t, n) {
      e._isException = n || !1;

      e._errorId = t;
    }

    function v(e, t, n, i) {
      e._value = t;

      p(e, t, n, i);

      e._setState(W);
    }

    function y(e, t) {
      var n;
      n = t && "object" == typeof t && "function" == typeof t.then ? k : P;

      e._value = t;

      e._setState(n);
    }

    function _(e, t, n, i) {
      var o = new U(e);
      g(e, {
        promise: o,
        c: t,
        e: n,
        p: i
      });

      return o;
    }

    function b(e) {
      var t;
      return new WinJS.Promise(function(n) {
        e ? t = setTimeout(n, e) : setImmediate(n);
      }, function() {
        if (t) {
          clearTimeout(t);
        }
      });
    }

    function C(e, t) {
      var n = function() {
        t.cancel();
      };

      var i = function() {
        e.cancel();
      };
      e.then(n);

      t.then(i, i);

      return t;
    }
    if (e.Debug) {
      e.Debug.setNonUserCodeExceptions = !0;
    }
    var w = WinJS.Class.mix(WinJS.Class.define(null, {}, {
      supportedForProcessing: !1
    }), WinJS.Utilities.eventMixin);

    var E = new w;
    E._listeners = {};
    var S = "error";

    var L = "Canceled";

    var T = !1;

    var x = {
      promise: 1,
      thenPromise: 2,
      errorPromise: 4,
      exceptionPromise: 8,
      completePromise: 16
    };
    x.all = x.promise | x.thenPromise | x.errorPromise | x.exceptionPromise | x.completePromise;
    var N;

    var M;

    var k;

    var I;

    var D;

    var O;

    var R;

    var P;

    var A;

    var W;

    var H = 1;
    N = {
      name: "created",
      enter: function(e) {
        e._setState(M);
      },
      cancel: n,
      done: n,
      then: n,
      _completed: n,
      _error: n,
      _notify: n,
      _progress: n,
      _setCompleteValue: n,
      _setErrorValue: n
    };

    M = {
      name: "working",
      enter: n,
      cancel: function(e) {
        e._setState(D);
      },
      done: l,
      then: _,
      _completed: i,
      _error: c,
      _notify: n,
      _progress: f,
      _setCompleteValue: y,
      _setErrorValue: v
    };

    k = {
      name: "waiting",
      enter: function(e) {
        var t = e._value;

        var n = function(i) {
          t._errorId ? e._chainedError(i, t) : (p(e, i, r, t, n), e._error(i));
        };
        n.handlesOnError = !0;

        t.then(e._completed.bind(e), n, e._progress.bind(e));
      },
      cancel: function(e) {
        e._setState(I);
      },
      done: l,
      then: _,
      _completed: i,
      _error: c,
      _notify: n,
      _progress: f,
      _setCompleteValue: y,
      _setErrorValue: v
    };

    I = {
      name: "waiting_canceled",
      enter: function(e) {
        e._setState(O);
        var t = e._value;
        if (t.cancel) {
          t.cancel();
        }
      },
      cancel: n,
      done: l,
      then: _,
      _completed: i,
      _error: c,
      _notify: n,
      _progress: f,
      _setCompleteValue: y,
      _setErrorValue: v
    };

    D = {
      name: "canceled",
      enter: function(e) {
        e._setState(O);

        e._cancelAction();
      },
      cancel: n,
      done: l,
      then: _,
      _completed: i,
      _error: c,
      _notify: n,
      _progress: f,
      _setCompleteValue: y,
      _setErrorValue: v
    };

    O = {
      name: "canceling",
      enter: function(e) {
        var t = new Error(L);
        t.name = t.message;

        e._value = t;

        e._setState(A);
      },
      cancel: n,
      done: n,
      then: n,
      _completed: n,
      _error: n,
      _notify: n,
      _progress: n,
      _setCompleteValue: n,
      _setErrorValue: n
    };

    R = {
      name: "complete_notify",
      enter: function(e) {
        if (e.done = z.prototype.done, e.then = z.prototype.then, e._listeners)
          for (var t, n = [e]; n.length;) {
            t = n.pop();
            t._state._notify(t, n);
          }
        e._setState(P);
      },
      cancel: n,
      done: null,
      then: null,
      _completed: n,
      _error: n,
      _notify: d,
      _progress: n,
      _setCompleteValue: n,
      _setErrorValue: n
    };

    P = {
      name: "success",
      enter: function(e) {
        e.done = z.prototype.done;

        e.then = z.prototype.then;

        e._cleanupAction();
      },
      cancel: n,
      done: null,
      then: null,
      _completed: n,
      _error: n,
      _notify: d,
      _progress: n,
      _setCompleteValue: n,
      _setErrorValue: n
    };

    A = {
      name: "error_notify",
      enter: function(e) {
        if (e.done = B.prototype.done, e.then = B.prototype.then, e._listeners)
          for (var t, n = [e]; n.length;) {
            t = n.pop();
            t._state._notify(t, n);
          }
        e._setState(W);
      },
      cancel: n,
      done: null,
      then: null,
      _completed: n,
      _error: n,
      _notify: h,
      _progress: n,
      _setCompleteValue: n,
      _setErrorValue: n
    };

    W = {
      name: "error",
      enter: function(e) {
        e.done = B.prototype.done;

        e.then = B.prototype.then;

        e._cleanupAction();
      },
      cancel: n,
      done: null,
      then: null,
      _completed: n,
      _error: n,
      _notify: h,
      _progress: n,
      _setCompleteValue: n,
      _setErrorValue: n
    };
    var V;

    var F = WinJS.Class.define(null, {
      _listeners: null,
      _nextState: null,
      _state: null,
      _value: null,
      cancel: function() {
        this._state.cancel(this);

        this._run();
      },
      done: function(e, t, n) {
        this._state.done(this, e, t, n);
      },
      then: function(e, t, n) {
        return this._state.then(this, e, t, n);
      },
      _chainedError: function(e, t) {
        var n = this._state._error(this, e, s, t);
        this._run();

        return n;
      },
      _completed: function(e) {
        var t = this._state._completed(this, e);
        this._run();

        return t;
      },
      _error: function(e) {
        var t = this._state._error(this, e, a);
        this._run();

        return t;
      },
      _progress: function(e) {
        this._state._progress(this, e);
      },
      _setState: function(e) {
        this._nextState = e;
      },
      _setCompleteValue: function(e) {
        this._state._setCompleteValue(this, e);

        this._run();
      },
      _setChainedErrorValue: function(e, t) {
        var n = this._state._setErrorValue(this, e, s, t);
        this._run();

        return n;
      },
      _setExceptionValue: function(e) {
        var t = this._state._setErrorValue(this, e, u);
        this._run();

        return t;
      },
      _run: function() {
        for (; this._nextState;) {
          this._state = this._nextState;
          this._nextState = null;
          this._state.enter(this);
        }
      }
    }, {
      supportedForProcessing: !1
    });

    var U = WinJS.Class.derive(F, function(e) {
      if (T && (T === !0 || T & x.thenPromise)) {
        this._stack = WinJS.Promise._getStack();
      }

      this._creator = e;

      this._setState(N);

      this._run();
    }, {
      _creator: null,
      _cancelAction: function() {
        if (this._creator) {
          this._creator.cancel();
        }
      },
      _cleanupAction: function() {
        this._creator = null;
      }
    }, {
      supportedForProcessing: !1
    });

    var B = WinJS.Class.define(function(e) {
      if (T && (T === !0 || T & x.errorPromise)) {
        this._stack = WinJS.Promise._getStack();
      }

      this._value = e;

      p(this, e, a);
    }, {
      cancel: function() {},
      done: function(e, t) {
        var n = this._value;
        if (t) try {
          if (!t.handlesOnError) {
            p(null, n, r, this, t);
          }
          var i = t(n);
          i && "object" == typeof i && "function" == typeof i.done && i.done();

          return void 0;
        } catch (o) {
          n = o;
        }
        if (!(n instanceof Error && n.message === L)) {
          setImmediate(function() {
            throw n;
          });
        }
      },
      then: function(e, t) {
        if (!t) {
          return this;
        }
        var n;

        var i = this._value;
        try {
          if (!t.handlesOnError) {
            p(null, i, r, this, t);
          }

          n = new z(t(i));
        } catch (o) {
          n = o === i ? this : new q(o);
        }
        return n;
      }
    }, {
      supportedForProcessing: !1
    });

    var q = WinJS.Class.derive(B, function(e) {
      if (T && (T === !0 || T & x.exceptionPromise)) {
        this._stack = WinJS.Promise._getStack();
      }

      this._value = e;

      p(this, e, u);
    }, {}, {
      supportedForProcessing: !1
    });

    var z = WinJS.Class.define(function(e) {
      if (T && (T === !0 || T & x.completePromise) && (this._stack = WinJS.Promise._getStack()), e && "object" ==
        typeof e && "function" == typeof e.then) {
        var t = new U(null);
        t._setCompleteValue(e);

        return t;
      }
      this._value = e;
    }, {
      cancel: function() {},
      done: function(e) {
        if (e) try {
          var t = e(this._value);
          if (t && "object" == typeof t && "function" == typeof t.done) {
            t.done();
          }
        } catch (n) {
          setImmediate(function() {
            throw n;
          });
        }
      },
      then: function(e) {
        try {
          var t = e ? e(this._value) : this._value;
          return t === this._value ? this : new z(t);
        } catch (n) {
          return new q(n);
        }
      }
    }, {
      supportedForProcessing: !1
    });

    var j = WinJS.Class.derive(F, function(e, t) {
      if (T && (T === !0 || T & x.promise)) {
        this._stack = WinJS.Promise._getStack();
      }

      this._oncancel = t;

      this._setState(N);

      this._run();
      try {
        var n = this._completed.bind(this);

        var i = this._error.bind(this);

        var o = this._progress.bind(this);
        e(n, i, o);
      } catch (r) {
        this._setExceptionValue(r);
      }
    }, {
      _oncancel: null,
      _cancelAction: function() {
        if (!this._oncancel) throw new Error("Promise did not implement oncancel");
        try {
          this._oncancel();
        } catch (e) {
          {
            e.message;

            e.stack;
          }
          E.dispatchEvent("error", e);
        }
      },
      _cleanupAction: function() {
        this._oncancel = null;
      }
    }, {
      addEventListener: function(e, t, n) {
        E.addEventListener(e, t, n);
      },
      any: function(e) {
        return new j(function(t, n) {
          {
            var i = Object.keys(e);
            Array.isArray(e) ? [] : {};
          }
          if (0 === i.length) {
            t();
          }
          var o = 0;
          i.forEach(function(r) {
            j.as(e[r]).then(function() {
              t({
                key: r,
                value: e[r]
              });
            }, function(s) {
              return s instanceof Error && s.name === L ? (++o === i.length && t(WinJS.Promise.cancel), void 0) :
                (n({
                key: r,
                value: e[r]
              }), void 0);
            });
          });
        }, function() {
          var t = Object.keys(e);
          t.forEach(function(t) {
            var n = j.as(e[t]);
            if ("function" == typeof n.cancel) {
              n.cancel();
            }
          });
        });
      },
      as: function(e) {
        return e && "object" == typeof e && "function" == typeof e.then ? e : new z(e);
      },
      cancel: {
        get: function() {
          return V = V || new B(new WinJS.ErrorFromName(L));
        }
      },
      dispatchEvent: function(e, t) {
        return E.dispatchEvent(e, t);
      },
      is: function(e) {
        return e && "object" == typeof e && "function" == typeof e.then;
      },
      join: function(e) {
        return new j(function(n, i, o) {
          var r = Object.keys(e);

          var s = Array.isArray(e) ? [] : {};

          var a = Array.isArray(e) ? [] : {};

          var u = 0;

          var l = r.length;

          var c = function(e) {
            if (0 === --l) {
              var t = Object.keys(s).length;
              if (0 === t) {
                n(a);
              } else {
                var u = 0;
                r.forEach(function(e) {
                  var t = s[e];
                  if (t instanceof Error && t.name === L) {
                    u++;
                  }
                });

                u === t ? n(WinJS.Promise.cancel) : i(s);
              }
            } else {
              o({
                Key: e,
                Done: !0
              });
            }
          };
          r.forEach(function(n) {
            var i = e[n];
            i === t ? u++ : j.then(i, function(e) {
              a[n] = e;

              c(n);
            }, function(e) {
              s[n] = e;

              c(n);
            });
          });

          l -= u;

          return 0 === l ? (n(a), void 0) : void 0;
        }, function() {
          Object.keys(e).forEach(function(t) {
            var n = j.as(e[t]);
            if ("function" == typeof n.cancel) {
              n.cancel();
            }
          });
        });
      },
      removeEventListener: function(e, t, n) {
        E.removeEventListener(e, t, n);
      },
      supportedForProcessing: !1,
      then: function(e, t, n, i) {
        return j.as(e).then(t, n, i);
      },
      thenEach: function(e, t, n, i) {
        var o = Array.isArray(e) ? [] : {};
        Object.keys(e).forEach(function(r) {
          o[r] = j.as(e[r]).then(t, n, i);
        });

        return j.join(o);
      },
      timeout: function(e, t) {
        var n = b(e);
        return t ? C(n, t) : n;
      },
      wrap: function(e) {
        return new z(e);
      },
      wrapError: function(e) {
        return new B(e);
      },
      _veryExpensiveTagWithStack: {
        get: function() {
          return T;
        },
        set: function(e) {
          T = e;
        }
      },
      _veryExpensiveTagWithStack_tag: x,
      _getStack: function() {
        if (Debug.debuggerEnabled) try {
          throw new Error;
        } catch (e) {
          return e.stack;
        }
      }
    });
    Object.defineProperties(j, WinJS.Utilities.createEventProperties(S));
    var G = WinJS.Class.derive(F, function(e) {
      this._oncancel = e;

      this._setState(N);

      this._run();
    }, {
      _cancelAction: function() {
        if (this._oncancel) {
          this._oncancel();
        }
      },
      _cleanupAction: function() {
        this._oncancel = null;
      }
    }, {
      supportedForProcessing: !1
    });

    var K = WinJS.Class.define(function(e) {
      this._promise = new G(e);
    }, {
      promise: {
        get: function() {
          return this._promise;
        }
      },
      cancel: function() {
        this._promise.cancel();
      },
      complete: function(e) {
        this._promise._completed(e);
      },
      error: function(e) {
        this._promise._error(e);
      },
      progress: function(e) {
        this._promise._progress(e);
      }
    }, {
      supportedForProcessing: !1
    });
    WinJS.Namespace.define("WinJS", {
      Promise: j,
      _Signal: K
    });
  })(this);
  (function(e, t) {
    "use strict";
    t.Namespace.define("WinJS", {
      ErrorFromName: t.Class.derive(Error, function(e, t) {
        this.name = e;

        this.message = t || e;
      }, {}, {
        supportedForProcessing: !1
      })
    });
  })(this, WinJS);
  (function() {
    "use strict";
    WinJS.Namespace.define("WinJS", {
      xhr: function(e) {
        var t;
        return new WinJS.Promise(function(n, i, o) {
          t = new XMLHttpRequest;

          t.onreadystatechange = function() {
            if (!t._canceled) {
              4 === t.readyState ? (t.status >= 200 && t.status < 300 || 1223 === t.status ? n(t) : i(t), t.onreadystatechange =
                function() {}) : o(t);
            }
          };

          t.open(e.type || "GET", e.url, !0, e.user, e.password);

          t.responseType = e.responseType || "";

          Object.keys(e.headers || {}).forEach(function(n) {
            t.setRequestHeader(n, e.headers[n]);
          });

          t.setRequestHeader("X-Requested-With", "XMLHttpRequest");

          if (e.customRequestInitializer) {
            e.customRequestInitializer(t);
          }

          t.send(e.data);
        }, function() {
          t._canceled = !0;

          t.abort();
        });
      }
    });
  })();
  (function(e) {
    "use strict";
    var t;

    var n;

    var i;

    var o;

    var r;

    var s;

    var a = {
      nonStaticHTML: "Unable to add dynamic content. A script attempted to inject dynamic content, or elements previously modified dynamically, that might be unsafe. For example, using the innerHTML property or the document.write method to add a script element will generate this exception. If the content is safe and from a trusted source, use a method to explicitly manipulate elements and attributes, such as createElement, or use setInnerHTMLUnsafe (or other unsafe method)."
    };
    t = n = function(e, t) {
      e.innerHTML = t;
    };

    i = o = function(e, t) {
      e.outerHTML = t;
    };

    r = s = function(e, t, n) {
      e.insertAdjacentHTML(t, n);
    };
    var u = e.MSApp;
    if (u) {
      n = function(e, t) {
        u.execUnsafeLocalFunction(function() {
          e.innerHTML = t;
        });
      };
      o = function(e, t) {
        u.execUnsafeLocalFunction(function() {
          e.outerHTML = t;
        });
      };
      s = function(e, t, n) {
        u.execUnsafeLocalFunction(function() {
          e.insertAdjacentHTML(t, n);
        });
      };
    } else if (e.msIsStaticHTML) {
      var l = function(t) {
        if (!e.msIsStaticHTML(t)) throw new WinJS.ErrorFromName("WinJS.Utitilies.NonStaticHTML", a.nonStaticHTML);
      };
      t = function(e, t) {
        l(t);

        e.innerHTML = t;
      };

      i = function(e, t) {
        l(t);

        e.outerHTML = t;
      };

      r = function(e, t, n) {
        l(n);

        e.insertAdjacentHTML(t, n);
      };
    }
    WinJS.Namespace.define("WinJS.Utilities", {
      setInnerHTML: t,
      setInnerHTMLUnsafe: n,
      setOuterHTML: i,
      setOuterHTMLUnsafe: o,
      insertAdjacentHTML: r,
      insertAdjacentHTMLUnsafe: s
    });
  })(this);
}

define("vs/base/lib/raw.winjs.base", [], {});

define("vs/base/types", ["require", "exports"], function(e, t) {
  function n(e) {
    return Array.isArray ? Array.isArray(e) : e && "number" == typeof e.length && e.constructor === Array ? !0 : !1;
  }

  function i(e) {
    return "string" == typeof e || e instanceof String ? !0 : !1;
  }

  function o(e) {
    return "undefined" == typeof e || null === e ? !1 : "[object Object]" === Object.prototype.toString.call(e);
  }

  function r(e) {
    return ("number" == typeof e || e instanceof Number) && !isNaN(e) ? !0 : !1;
  }

  function s(e) {
    return e === !0 || e === !1;
  }

  function a(e) {
    return "undefined" == typeof e;
  }

  function u(e) {
    return t.isUndefined(e) || null === e;
  }

  function l(e) {
    if (!t.isObject(e)) {
      return !1;
    }
    for (var n in e)
      if (e.hasOwnProperty(n)) {
        return !1;
      }
    return !0;
  }

  function c(e) {
    return "[object Function]" === Object.prototype.toString.call(e);
  }

  function d() {
    for (var e = [], n = 0; n < arguments.length - 0; n++) {
      e[n] = arguments[n + 0];
    }
    return e && e.length > 0 && e.every(function(e) {
      return t.isFunction(e);
    });
  }

  function h(e) {
    for (var t = [], n = 0; n < arguments.length - 1; n++) {
      t[n] = arguments[n + 1];
    }
    var i = Object.create(e.prototype);
    e.apply(i, t);

    return i;
  }

  function p(e, n, i) {
    if ("undefined" == typeof i) {
      i = !0;
    }
    var o;

    var r = {};
    for (o in e) {
      if ((i || e.hasOwnProperty(o)) && t.isFunction(e[o])) {
        r[o] = function(t) {
          return function() {
            return n(e, t, arguments);
          };
        }(o);
      }
    }
    return r;
  }

  function f(e) {
    var t = !1;

    var n = null;
    return function() {
      for (var i = [], o = 0; o < arguments.length - 0; o++) {
        i[o] = arguments[o + 0];
      }
      t || (t = !0, n = e.apply(self, i));

      return n;
    };
  }
  t.isArray = n;

  t.isString = i;

  t.isObject = o;

  t.isNumber = r;

  t.isBoolean = s;

  t.isUndefined = a;

  t.isUndefinedOrNull = u;

  t.isEmptyObject = l;

  t.isFunction = c;

  t.areFunctions = d;

  t.create = h;

  t.proxy = p;

  t.runOnce = f;
});

define("vs/base/objects", ["require", "exports", "./types"], function(e, t, n) {
  function i(e) {
    if (!e || "object" != typeof e) {
      return e;
    }
    var n = e instanceof Array ? [] : {};
    for (var i in e) {
      n[i] = e[i] && "object" == typeof e[i] ? t.clone(e[i]) : e[i];
    }
    return n;
  }

  function o(e, i, o) {
    "undefined" == typeof o && (o = !0);

    return n.isObject(e) ? (n.isObject(i) && Object.keys(i).forEach(function(r) {
      r in e ? o && (n.isObject(e[r]) && n.isObject(i[r]) ? t.mixin(e[r], i[r], o) : e[r] = i[r]) : e[r] = i[r];
    }), e) : i;
  }

  function r(e, n) {
    return t.mixin(t.clone(n), e || {});
  }

  function s(e, n) {
    if (e === n) {
      return !0;
    }
    if (null === e || void 0 === e || null === n || void 0 === n) {
      return !1;
    }
    if (typeof e != typeof n) {
      return !1;
    }
    if ("object" != typeof e) {
      return !1;
    }
    if (e instanceof Array != n instanceof Array) {
      return !1;
    }
    var i;

    var o;
    if (e instanceof Array) {
      if (e.length !== n.length) {
        return !1;
      }
      for (i = 0; i < e.length; i++)
        if (!t.equals(e[i], n[i])) {
          return !1;
        }
    } else {
      var r = [];
      for (o in e) {
        r.push(o);
      }
      r.sort();
      var s = [];
      for (o in n) {
        s.push(o);
      }
      if (s.sort(), !t.equals(r, s)) {
        return !1;
      }
      for (i = 0; i < r.length; i++)
        if (!t.equals(e[r[i]], n[r[i]])) {
          return !1;
        }
    }
    return !0;
  }

  function a(e, t, n) {
    if ("undefined" == typeof e[t]) {
      e[t] = n;
    }
  }

  function u(e) {
    for (var t = {}, n = 0; n < e.length; ++n) {
      t[e[n]] = !0;
    }
    return t;
  }

  function l(e, n) {
    if ("undefined" == typeof n) {
      n = !1;
    }

    if (n) {
      e = e.map(function(e) {
        return e.toLowerCase();
      });
    }
    var i = t.arrayToHash(e);
    return n ? function(e) {
      return void 0 !== i[e.toLowerCase()] && i.hasOwnProperty(e.toLowerCase());
    } : function(e) {
      return void 0 !== i[e] && i.hasOwnProperty(e);
    };
  }

  function c(e, t) {
    t = t || function() {};
    var n = e.prototype;
    t.prototype = Object.create(n);

    Object.defineProperty(t.prototype, "constructor", {
      value: t,
      writable: !0,
      configurable: !0,
      enumerable: !0
    });

    return t;
  }
  t.clone = i;

  t.mixin = o;

  t.withDefaults = r;

  t.equals = s;

  t.ensureProperty = a;

  t.arrayToHash = u;

  t.createKeywordMatcher = l;

  t.derive = c;
});

define("vs/base/assert", ["require", "exports"], function(e, t) {
  function n(e, t) {
    if (!e || null === e) throw new Error(t ? "Assertion failed (" + t + ")" : "Assertion Failed");
  }

  function i(e, t, n) {
    if (e !== t || !e || !t) throw new Error(n ? "Assertion failed (" + n + ")" : "Assertion Failed");
  }
  t.ok = n;

  t.equals = i;
});

define("vs/base/uuid", ["require", "exports", "vs/base/assert"], function(e, t, n) {
  function i(e) {
    return Math.floor(e * Math.random());
  }

  function o() {
    var e = i(3);
    return u[e];
  }

  function r() {
    var e = [i(4294967295), i(65535), l + i(4095), o() + i(4095), i(0xffffffffffff)];
    return new a(e);
  }

  function s(e) {
    var t = e.split("-");

    var n = [];
    if (5 !== t.length || 8 !== t[0].length || 4 !== t[1].length || 4 !== t[2].length || 4 !== t[3].length || 12 !==
      t[4].length) throw new Error("invalid uuid");
    n = t.map(function(e) {
      var t = parseInt(e, 16);
      if (isNaN(t)) throw new Error("invalid uuid");
      return t;
    });

    return new a(n);
  }
  var a = function() {
    function e(e) {
      this.numbers = e;

      n.ok(e[2] >= 16384 && e[2] < 20480, "illegal version bit");

      n.ok(e[3] >= 32768 && e[3] < 49152, "illegal timehigh bit");
    }
    e.prototype.equals = function(e) {
      return this.asHex() === e.asHex();
    };

    e.toHexString = function(e, t) {
      for (var n = e.toString(16), i = t - n.length; i-- > 0;) {
        n = "0" + n;
      }
      return n;
    };

    e.prototype.asHex = function() {
      this.asHexCached || (this.asHexCached = [e.toHexString(this.numbers[0], 8), e.toHexString(this.numbers[1], 4),
        e.toHexString(this.numbers[2], 4), e.toHexString(this.numbers[3], 4), e.toHexString(this.numbers[4], 12)
      ].join("-"));

      return this.asHexCached;
    };

    e.prototype.toString = function() {
      return this.asHex();
    };

    return e;
  }();

  var u = [36863, 40959, 45055, 49151];

  var l = 16384;
  t.v4 = r;

  t.parse = s;
});

define("vs/base/strings", ["require", "exports", "vs/nls!vs/editor/worker/editorWorkerServer", "vs/base/uuid",
  "vs/base/types"
], function(e, t, n, i, o) {
  function r(e, t) {
    for (var n = "" + e; n.length < t;) {
      n = "0" + n;
    }
    return n;
  }

  function s(e) {
    for (var t = [], n = 0; n < arguments.length - 1; n++) {
      t[n] = arguments[n + 1];
    }
    if (0 === t.length) {
      return e;
    }
    for (var i = e, o = t.length, r = 0; o > r; r++) {
      i = i.replace(new RegExp("\\{" + r + "\\}", "g"), t[r]);
    }
    return i;
  }

  function a(e) {
    e || (e = new Date);

    return n.localize("vs_base_strings", 0, t.pad(e.getMonth() + 1, 2), t.pad(e.getDate(), 2), t.pad(e.getFullYear(),
      4), t.pad(e.getHours(), 2), t.pad(e.getMinutes(), 2), t.pad(e.getSeconds(), 2));
  }

  function u(e) {
    e || (e = new Date);

    return n.localize("vs_base_strings", 1, t.pad(e.getHours(), 2), t.pad(e.getMinutes(), 2), t.pad(e.getSeconds(), 2));
  }

  function l(e) {
    return e.replace(/[<|>|&]/g, function(e) {
      switch (e) {
        case "<":
          return "&lt;";
        case ">":
          return "&gt;";
        case "&":
          return "&amp;";
        default:
          return e;
      }
    });
  }

  function c(e) {
    return e.replace(/[\-\\\{\}\*\+\?\|\^\$\.\,\[\]\(\)\#\s]/g, "\\$&");
  }

  function d(e, n, i) {
    return e.replace(new RegExp(t.escapeRegExpCharacters(n.toString()), "g"), i);
  }

  function h(e) {
    var t = document.createElement("div");
    t.innerHTML = e;

    return t.textContent || t.innerText || "";
  }

  function p(e, n) {
    if ("undefined" == typeof n) {
      n = " ";
    }
    var i = t.ltrim(e, n);
    return t.rtrim(i, n);
  }

  function f(e, t) {
    var n = t.length;
    if (0 === n || 0 === e.length) {
      return e;
    }
    for (var i = 0, o = -1;
      (o = e.indexOf(t, i)) === i;) {
      i += n;
    }
    return e.substring(i);
  }

  function g(e, t) {
    var n = t.length;

    var i = e.length;
    if (0 === n || 0 === i) {
      return e;
    }
    for (var o = i, r = -1;;) {
      if (r = e.lastIndexOf(t, o - 1), -1 === r || r + n !== o) break;
      if (0 === r) {
        return "";
      }
      o = r;
    }
    return e.substring(0, o);
  }

  function m(e) {
    return e.replace(/(^\s+|\s+$)/g, "");
  }

  function v(e) {
    return e.replace(/\s+/g, " ");
  }

  function y(e) {
    var t = (new Date).getTime();

    var i = (t - e) / 1e3;
    if (60 > i) {
      return n.localize("vs_base_strings", 2, Math.floor(i));
    }
    var o = i / 60;
    if (60 > o) {
      return n.localize("vs_base_strings", 3, Math.floor(o));
    }
    var r = o / 60;
    if (24 > r) {
      return n.localize("vs_base_strings", 4, Math.floor(r));
    }
    var s = r / 24;
    return n.localize("vs_base_strings", 5, Math.floor(s));
  }

  function _(e) {
    return e.replace(/[\-\\\{\}\+\?\|\^\$\.\,\[\]\(\)\#\s]/g, "\\$&").replace(/[\*]/g, ".*");
  }

  function b(e, t) {
    for (var n = 0, i = t.length; i > n; n++)
      if (e.charCodeAt(n) !== t.charCodeAt(n)) {
        return !1;
      }
    return !0;
  }

  function C(e, t) {
    if (t.length > e.length) {
      return !1;
    }
    for (var n = 0, i = e.length - t.length; n < t.length; n++, i++)
      if (e.charCodeAt(i) !== t.charCodeAt(n)) {
        return !1;
      }
    return !0;
  }

  function w(e, t, n, i) {
    "undefined" == typeof i && (i = "");

    return e.substring(0, t) + i + e.substring(t + n);
  }

  function E(e, t, n, i) {
    if ("" === e) throw new Error("Cannot create regex from empty string");
    if (!t) {
      e = e.replace(/[\-\\\{\}\*\+\?\|\^\$\.\,\[\]\(\)\#\s]/g, "\\$&");
    }

    if (i) {
      if (!/\B/.test(e.charAt(0))) {
        e = "\\b" + e;
      }
      if (!/\B/.test(e.charAt(e.length - 1))) {
        e += "\\b";
      }
    }
    var o = "g";
    n || (o += "i");

    return new RegExp(e, o);
  }

  function S(e) {
    var t = e.exec("");
    return t && 0 === e.lastIndex;
  }

  function L(e, t) {
    if (!e) {
      return e;
    }
    if (t) {
      for (var n = e.split("/"), i = 0, o = n.length; o > i; i++) {
        n[i] = encodeURIComponent(n[i]);
      }
      return n.join("/");
    }
    return encodeURIComponent(e);
  }

  function T(e) {
    return /^\w[\w.]*$/.test(e);
  }

  function x(e) {
    return e.replace(/[\-\\\{\}\*\+\?\|\^\$\.\,\[\]\(\)\#\s]/g, "\\$&");
  }

  function N(e, t, n) {
    t && (e = "^" + e);

    n && (e += "$");

    return e;
  }

  function M(e, n) {
    if (t.regExpLeadsToEndlessLoop(new RegExp(e, n))) throw new Error("Regular expression /" + e +
      "/g results in infinitive matches");
  }

  function k(e) {
    return e ? (0 === e.indexOf("/") && (e = e.substring(1)), t.encodeURIPart(e, !0)) : "";
  }

  function I() {
    return i.v4().asHex();
  }

  function D(e, t) {
    return "[" + e + "m" + t + "[0m";
  }

  function O(e) {
    for (var t = 0, n = e.length; n > t; t++)
      if (" " !== e.charAt(t) && "	" !== e.charAt(t)) {
        return t;
      }
    return -1;
  }

  function R(e) {
    for (var t = 0, n = e.length; n > t; t++)
      if (" " !== e.charAt(t) && "	" !== e.charAt(t)) {
        return e.substring(0, t);
      }
    return e;
  }

  function P(e) {
    for (var t = e.length - 1; t >= 0; t--)
      if (" " !== e.charAt(t) && "	" !== e.charAt(t)) {
        return t;
      }
    return -1;
  }

  function A(e, t) {
    if (!z && (z = !0, window.Intl && o.isFunction(window.Intl.Collator))) {
      var n = new window.Intl.Collator;
      if (o.isFunction(n.compare)) {
        q = n.compare;
      }
    }
    return q ? q.call(this, e, t) : e.localeCompare(t);
  }

  function W(e) {
    return e >= 97 && 122 >= e || e >= 65 && 90 >= e;
  }

  function H(e, t) {
    var n = e.length;

    var i = t.length;
    if (n !== i) {
      return !1;
    }
    for (var o = 0; n > o; o++) {
      var r = e.charCodeAt(o);

      var s = t.charCodeAt(o);
      if (r !== s)
        if (W(r) && W(s)) {
          var a = Math.abs(r - s);
          if (0 !== a && 32 !== a) {
            return !1;
          }
        } else if (String.fromCharCode(r).toLocaleLowerCase() !== String.fromCharCode(s).toLocaleLowerCase()) {
        return !1;
      }
    }
    return !0;
  }

  function V(e, t, n) {
    if ("undefined" == typeof n) {
      n = 4;
    }
    var i = Math.abs(e.length - t.length);
    if (i > n) {
      return 0;
    }
    var o;

    var r;

    var s = [];

    var a = [];
    for (o = 0; o < t.length + 1; ++o) {
      a.push(0);
    }
    for (o = 0; o < e.length + 1; ++o) {
      s.push(a);
    }
    for (o = 1; o < e.length + 1; ++o)
      for (r = 1; r < t.length + 1; ++r) {
        s[o][r] = e[o - 1] === t[r - 1] ? s[o - 1][r - 1] + 1 : Math.max(s[o - 1][r], s[o][r - 1]);
      }
    return s[e.length][t.length] - Math.sqrt(i);
  }

  function F(e) {
    for (var t = {
      ch: 0,
      children: []
    }, n = 0, i = e.length; i > n; n++)
      for (var o = t, r = e[n], s = 0, a = r.length; a > s; s++) {
        o = B(o, r.charCodeAt(s));
      }
    return function(e) {
      for (var n = t, i = 0, o = e.length; n.children && o > i; i++)
        if (n = U(n, e.charCodeAt(i)), !n) {
          return !1;
        }
      return !n.children;
    };
  }

  function U(e, t) {
    if (!e.children) {
      return null;
    }
    for (var n = 0, i = e.children.length; i > n; n++)
      if (e.children[n].ch === t) {
        return e.children[n];
      }
    return null;
  }

  function B(e, t) {
    if (e.children) {
      for (var n = e.children.length, i = 0; n > i; i++)
        if (e.children[i].ch === t) {
          return e.children[i];
        }
      e.children.push({
        ch: t,
        children: null
      });

      return e.children[n];
    }
    e.children = [{
      ch: t,
      children: null
    }];

    return e.children[0];
  }
  t.empty = "";

  t.pad = r;

  t.format = s;

  t.formatDate = a;

  t.formatTime = u;

  t.escape = l;

  t.escapeRegExpCharacters = c;

  t.replaceAll = d;

  t.stripHtml = h;

  t.trim = p;

  t.ltrim = f;

  t.rtrim = g;

  t.trimWhitespace = m;

  t.normalize = v;
  t.conciseformatDiff = y;

  t.convertSimple2RegExpPattern = _;

  t.startsWith = b;

  t.endsWith = C;

  t.splice = w;

  t.createRegExp = E;

  t.regExpLeadsToEndlessLoop = S;

  t.encodeURIPart = L;

  t.isCamelCasePattern = T;

  t.toRegExpPattern = x;

  t.anchorPattern = N;

  t.assertRegExp = M;

  t.normalizePath = k;

  t.generateUuid = I;

  t.colorize = D;

  t.firstNonWhitespaceIndex = O;

  t.getLeadingWhitespace = R;

  t.lastNonWhitespaceIndex = P;
  var q;

  var z = !1;
  t.localeCompare = A;

  t.equalsIgnoreCase = H;

  t.difference = V;

  t.prefixMatcher = F;
});

define("vs/base/hash", ["require", "exports"], function(e, t) {
  function n(e) {
    for (var t = 1540483477, n = 24, i = 0, o = e.length, r = o, s = 0 ^ r, a = i; r >= 2;) {
      var u = e.charCodeAt(a);

      var l = e.charCodeAt(a + 1);

      var c = u | l << 16;
      c *= t;

      c ^= c >> n;

      c *= t;

      s *= t;

      s ^= c;

      a += 2;

      r -= 2;
    }
    1 === r && (s ^= e.charCodeAt(a), s *= t);

    s ^= s >> 13;

    s *= t;

    return s ^= s >> 15;
  }

  function i(e, t) {
    return (t << 5) + t + e & 2147483647;
  }
  t.computeMurmur2StringHashCode = n;

  t.combine = i;
});

define("vs/base/network", ["require", "exports", "./assert", "./hash", "./strings", "./types"], function(e, t, n, i, o,
  r) {
  function s(e) {
    var t = window.location.search;
    if (t) {
      t = t.substring(1);
      for (var n = t.split("&"), i = 0; i < n.length; i++) {
        var o = n[i];
        if (o.indexOf("=") >= 0) {
          var r = o.split("=");
          if (decodeURIComponent(r[0]) === e && r.length > 1) {
            return decodeURIComponent(r[1]);
          }
        } else if (decodeURIComponent(o) === e) {
          return "true";
        }
      }
    }
    return null;
  }

  function a(e, t, n) {
    var i = e.indexOf(t);

    var r = e.indexOf(n, i + t.length);
    if (i >= 0 && r >= 0) {
      var s = e.substring(i, r + n.length);

      var a = t + "//" + n;
      if (s !== a) {
        var u = new RegExp(o.escapeRegExpCharacters(s), "gi");
        return function(e) {
          return e ? e.replace(u, a) : e;
        };
      }
    }
    return function(e) {
      return e;
    };
  }
  var u = function() {
    function e(e) {
      n.ok( !! e, "spec must not be null");

      this._spec = e;
    }
    e.fromEncoded = function(t) {
      return new e(decodeURIComponent(t));
    };

    e.fromValue = function(t) {
      return new e(t);
    };

    e.prototype.equals = function(t) {
      return t instanceof e && t._spec === this._spec;
    };

    e.prototype.hashCode = function() {
      return i.computeMurmur2StringHashCode(this._spec);
    };

    e.prototype.toJSON = function() {
      return {
        $url: this._spec
      };
    };

    e.prototype.toExternal = function() {
      return this._spec;
    };

    e.prototype.toString = function() {
      return this._spec;
    };

    e.prototype.getScheme = function() {
      "undefined" == typeof this._scheme && (this._scheme = this._doGetScheme());

      return this._scheme;
    };

    e.prototype._doGetScheme = function() {
      var e = this._spec.indexOf(":");
      return -1 === e ? null : this._spec.substring(0, e);
    };

    e.prototype.getPath = function() {
      "undefined" == typeof this._path && (this._path = this._doGetPath());

      return this._path;
    };

    e.prototype._doGetPath = function() {
      for (var e = 0, t = -1, n = 0, i = this._spec.length; i > n; n++) {
        var o = this._spec.charAt(n);
        switch (o) {
          case "/":
            if (3 === ++e) {
              t = n;
            }
            break;
          case "?":
          case "#":
            return -1 === t ? null : this._spec.substring(t, n);
        }
      }
      return -1 === t ? null : t === this._spec.length - 1 ? "" : this._spec.substring(t);
    };

    return e;
  }();
  t.URL = u;

  t.getQueryValue = s;

  t._createBasicAuthRemover = a;

  t.getBasicAuthRemover = r.runOnce(function() {
    var e = null;
    try {
      throw new Error;
    } catch (n) {
      e = n.stack;
    }
    if (e) {
      var i = e.split("\n")[0];
      return t._createBasicAuthRemover(i, self.location.protocol, self.location.hostname);
    }
    return function(e) {
      return e;
    };
  });

  (function(e) {
    e.inMemory = "inMemory";
  })(t.schemas || (t.schemas = {}));
  t.schemas;
});

define("vs/base/injector", ["require", "exports", "vs/base/assert", "vs/base/types"], function(e, t, n, i) {
  var o = "inject";

  var r = o.length;

  var s = function() {
    function e() {
      this.map = {};

      this.parent = null;
    }
    e.prototype.setParent = function(e) {
      this.parent = e;
    };

    e.prototype.registerService = function(e, t) {
      n.ok(!i.isUndefinedOrNull(e));

      n.ok(!i.isUndefinedOrNull(t));

      this.map[e.toLowerCase()] = t;

      return t;
    };

    e.prototype.injectTo = function(e) {
      var t = this;
      n.ok(!i.isUndefinedOrNull(e));
      var s = !1;
      if (i.isArray(e)) {
        e.forEach(function(e) {
          s = t.injectTo(e) || s;
        });
        return s;
      }
      for (var a in e)
        if (0 === a.indexOf(o)) {
          var u = e[a];
          if (i.isFunction(u)) {
            a = a.substring(r).toLowerCase();
            var l = this.findService(a, e);
            if (!i.isUndefinedOrNull(l)) {
              u.apply(e, [l]);
              s = !0;
            }
          }
        }
      return s;
    };

    e.prototype.createChild = function() {
      var t = new e;
      t.setParent(this);

      return t;
    };

    e.prototype.findService = function(e, t) {
      if ("undefined" == typeof t) {
        t = null;
      }
      var n = this.map[e];
      !i.isUndefinedOrNull(n) && t !== n || null === this.parent || (n = this.parent.findService(e, t));

      return n;
    };

    e.prototype.dispose = function() {
      this.map = null;

      this.parent = null;
    };

    return e;
  }();
  t.Container = s;
});

var __extends = this.__extends || function(e, t) {
    function n() {
      this.constructor = e;
    }
    for (var i in t) {
      if (t.hasOwnProperty(i)) {
        e[i] = t[i];
      }
    }
    n.prototype = t.prototype;

    e.prototype = new n;
  };

define("vs/base/dom/mockDom", ["require", "exports"], function(e, t) {
  var n = function() {
    function e() {
      this.eventMap = {};
    }
    e.prototype.removeEventListener = function(e, t) {
      if (e in this.eventMap) {
        var n = this.eventMap[e];
        n.splice(n.indexOf(t), 1);
      }
    };

    e.prototype.addEventListener = function(e, t) {
      e in this.eventMap ? this.eventMap[e].push(t) : this.eventMap[e] = [t];
    };

    e.prototype.dispatchEvent = function(e) {
      this.eventMap[e.type].forEach(function(t) {
        t(e);
      });

      return e.defaultPrevented;
    };

    return e;
  }();
  t.MockEventTarget = n;
  var i = function(e) {
    function t(t) {
      e.call(this);

      this.ENTITY_REFERENCE_NODE = Node.ENTITY_REFERENCE_NODE;

      this.ATTRIBUTE_NODE = Node.ATTRIBUTE_NODE;

      this.DOCUMENT_FRAGMENT_NODE = Node.DOCUMENT_FRAGMENT_NODE;

      this.TEXT_NODE = Node.TEXT_NODE;

      this.ELEMENT_NODE = Node.ELEMENT_NODE;

      this.COMMENT_NODE = Node.COMMENT_NODE;

      this.DOCUMENT_POSITION_DISCONNECTED = Node.DOCUMENT_POSITION_DISCONNECTED;

      this.DOCUMENT_POSITION_CONTAINED_BY = Node.DOCUMENT_POSITION_CONTAINED_BY;

      this.DOCUMENT_POSITION_CONTAINS = Node.DOCUMENT_POSITION_CONTAINS;

      this.DOCUMENT_TYPE_NODE = Node.DOCUMENT_TYPE_NODE;

      this.DOCUMENT_POSITION_IMPLEMENTATION_SPECIFIC = Node.DOCUMENT_POSITION_IMPLEMENTATION_SPECIFIC;

      this.DOCUMENT_NODE = Node.DOCUMENT_NODE;

      this.ENTITY_NODE = Node.ENTITY_NODE;

      this.PROCESSING_INSTRUCTION_NODE = Node.PROCESSING_INSTRUCTION_NODE;

      this.CDATA_SECTION_NODE = Node.CDATA_SECTION_NODE;

      this.NOTATION_NODE = Node.NOTATION_NODE;

      this.DOCUMENT_POSITION_FOLLOWING = Node.DOCUMENT_POSITION_FOLLOWING;

      this.DOCUMENT_POSITION_PRECEDING = Node.DOCUMENT_POSITION_PRECEDING;

      this.nodeName = t;

      this._childNodes = [];

      this._attributes = [];
    }
    __extends(t, e);

    Object.defineProperty(t.prototype, "attributes", {
      get: function() {
        return this._attributes;
      },
      enumerable: !0,
      configurable: !0
    });

    Object.defineProperty(t.prototype, "lastChild", {
      get: function() {
        return this._childNodes[this._childNodes.length - 1];
      },
      enumerable: !0,
      configurable: !0
    });

    Object.defineProperty(t.prototype, "firstChild", {
      get: function() {
        return this._childNodes[0];
      },
      enumerable: !0,
      configurable: !0
    });

    Object.defineProperty(t.prototype, "childNodes", {
      get: function() {
        var e = this._childNodes;
        e.item || (e.item = function(e) {
          return this[e];
        }.bind(e));

        return e;
      },
      enumerable: !0,
      configurable: !0
    });

    Object.defineProperty(t.prototype, "textContent", {
      get: function() {
        var e = this;
        return this._childNodes.filter(function(t) {
          return t.nodeType === e.TEXT_NODE;
        }).map(function(e) {
          return e.wholeText;
        }).join("");
      },
      set: function(e) {
        this._childNodes = [];

        this.appendChild(this.ownerDocument.createTextNode(e));
      },
      enumerable: !0,
      configurable: !0
    });

    t.prototype.removeChild = function(e) {
      var t = this._childNodes.indexOf(e);
      if (t >= 0) {
        var n = this._childNodes.splice(t, 1);
        return n[0];
      }
      return null;
    };

    t.prototype.appendChild = function(e) {
      this._childNodes.push(e);

      return e;
    };

    t.prototype.isSupported = function() {
      throw new Error("Not implemented!");
    };

    t.prototype.isEqualNode = function() {
      throw new Error("Not implemented!");
    };

    t.prototype.lookupPrefix = function() {
      throw new Error("Not implemented!");
    };

    t.prototype.isDefaultNamespace = function() {
      throw new Error("Not implemented!");
    };

    t.prototype.compareDocumentPosition = function() {
      throw new Error("Not implemented!");
    };

    t.prototype.normalize = function() {
      throw new Error("Not implemented!");
    };

    t.prototype.isSameNode = function(e) {
      return this === e;
    };

    t.prototype.hasAttributes = function() {
      return this.attributes.length > 0;
    };

    t.prototype.lookupNamespaceURI = function() {
      throw new Error("Not implemented!");
    };

    t.prototype.cloneNode = function() {
      throw new Error("Not implemented!");
    };

    t.prototype.hasChildNodes = function() {
      return this.childNodes.length > 0;
    };

    t.prototype.replaceChild = function() {
      throw new Error("Not implemented!");
    };

    t.prototype.insertBefore = function() {
      throw new Error("Not implemented!");
    };

    return t;
  }(n);
  t.MockNode = i;
  var o = function(e) {
    function t(t) {
      e.call(this, t);

      this.name = t;

      this.expando = !1;
    }
    __extends(t, e);

    Object.defineProperty(t.prototype, "specified", {
      get: function() {
        return !!this.value;
      },
      enumerable: !0,
      configurable: !0
    });

    return t;
  }(i);
  t.MockAttribute = o;
  var r = function(e) {
    function t(t) {
      e.call(this, t);

      this.tagName = t;
    }
    __extends(t, e);

    t.prototype.getAttribute = function(e) {
      var t = this._attributes.filter(function(t) {
        return t.name === e;
      });
      return t.length ? t[0].value : "";
    };

    t.prototype.getElementsByTagNameNS = function() {
      throw new Error("Not implemented!");
    };

    t.prototype.hasAttributeNS = function() {
      throw new Error("Not implemented!");
    };

    t.prototype.getBoundingClientRect = function() {
      throw new Error("Not implemented!");
    };

    t.prototype.getAttributeNS = function() {
      throw new Error("Not implemented!");
    };

    t.prototype.getAttributeNodeNS = function() {
      throw new Error("Not implemented!");
    };

    t.prototype.setAttributeNodeNS = function() {
      throw new Error("Not implemented!");
    };

    t.prototype.hasAttribute = function(e) {
      var t = this._attributes.filter(function(t) {
        return t.name === e;
      });
      return t.length > 0;
    };

    t.prototype.removeAttribute = function(e) {
      this._attributes = this._attributes.filter(function(t) {
        return t.name !== e;
      });
    };

    t.prototype.setAttributeNS = function() {
      throw new Error("Not implemented!");
    };

    t.prototype.getAttributeNode = function() {
      throw new Error("Not implemented!");
    };

    t.prototype.getElementsByTagName = function() {
      throw new Error("Not implemented!");
    };

    t.prototype.setAttributeNode = function() {
      throw new Error("Not implemented!");
    };

    t.prototype.getClientRects = function() {
      throw new Error("Not implemented!");
    };

    t.prototype.removeAttributeNode = function() {
      throw new Error("Not implemented!");
    };

    t.prototype.setAttribute = function(e, t) {
      if (this.hasAttribute(e)) {
        this.removeAttribute(e);
      }
      var n = this.ownerDocument.createAttribute(e);
      n.ownerElement = this;

      n.value = t;

      this._attributes.push(n);
    };

    t.prototype.removeAttributeNS = function() {
      throw new Error("Not implemented!");
    };

    t.prototype.querySelectorAll = function() {
      throw new Error("Not implemented!");
    };

    t.prototype.querySelector = function() {
      throw new Error("Not implemented!");
    };

    Object.defineProperty(t.prototype, "childElementCount", {
      get: function() {
        var e = this;
        return this._childNodes.filter(function(t) {
          return t.nodeType === e.ELEMENT_NODE;
        }).length;
      },
      enumerable: !0,
      configurable: !0
    });

    Object.defineProperty(t.prototype, "lastElementChild", {
      get: function() {
        var e = this;

        var t = this._childNodes.filter(function(t) {
          return t.nodeType === e.ELEMENT_NODE;
        });
        return t[t.length - 1];
      },
      enumerable: !0,
      configurable: !0
    });

    Object.defineProperty(t.prototype, "firstElementChild", {
      get: function() {
        var e = this;

        var t = this._childNodes.filter(function(t) {
          return t.nodeType === e.ELEMENT_NODE;
        });
        return t[0];
      },
      enumerable: !0,
      configurable: !0
    });

    t.prototype.msMatchesSelector = function() {
      throw new Error("Not implemented!");
    };

    t.prototype.fireEvent = function() {
      throw new Error("Not implemented!");
    };

    t.prototype.msZoomTo = function() {};

    t.prototype.msRequestFullscreen = function() {};

    t.prototype.msGetUntransformedBounds = function() {
      throw new Error("Not implemented!");
    };

    t.prototype.msGetRegionContent = function() {
      throw new Error("Not implemented!");
    };

    t.prototype.msReleasePointerCapture = function() {
      throw new Error("Not implemented!");
    };

    t.prototype.msSetPointerCapture = function() {
      throw new Error("Not implemented!");
    };

    return t;
  }(i);
  t.MockElement = r;
  var s = function(e) {
    function t(t) {
      e.call(this, t);

      this.nodeType = this.TEXT_NODE;

      this.length = t.length;

      this.data = t;
    }
    __extends(t, e);

    t.prototype.deleteData = function() {
      throw new Error("Not implemented!");
    };

    t.prototype.replaceData = function() {
      throw new Error("Not implemented!");
    };

    t.prototype.appendData = function() {
      throw new Error("Not implemented!");
    };

    t.prototype.insertData = function() {
      throw new Error("Not implemented!");
    };

    t.prototype.substringData = function() {
      throw new Error("Not implemented!");
    };

    return t;
  }(i);
  t.MockCharacterData = s;
  var a = function(e) {
    function t(t) {
      e.call(this, t);

      this.wholeText = t;
    }
    __extends(t, e);

    t.prototype.splitText = function() {
      throw new Error("Not implemented!");
    };

    t.prototype.replaceWholeText = function() {
      throw new Error("Not implemented!");
    };

    t.prototype.swapNode = function() {
      throw new Error("Not implemented!");
    };

    t.prototype.removeNode = function() {
      throw new Error("Not implemented!");
    };

    t.prototype.replaceNode = function() {
      throw new Error("Not implemented!");
    };

    return t;
  }(s);
  t.MockText = a;
  var u = function(e) {
    function t(t) {
      e.call(this, t);

      this.style = {};

      this.nodeType = this.ELEMENT_NODE;
    }
    __extends(t, e);

    Object.defineProperty(t.prototype, "className", {
      get: function() {
        return this.getAttribute("class");
      },
      set: function(e) {
        this.setAttribute("class", e);
      },
      enumerable: !0,
      configurable: !0
    });

    Object.defineProperty(t.prototype, "id", {
      get: function() {
        return this.getAttribute("id");
      },
      set: function(e) {
        this.setAttribute("id", e);
      },
      enumerable: !0,
      configurable: !0
    });

    Object.defineProperty(t.prototype, "children", {
      get: function() {
        var e = this;

        var t = this._childNodes.filter(function(t) {
          return t.nodeType === e.ELEMENT_NODE;
        });
        t.item || (t.item = function(e) {
          return this[e];
        }.bind(t));

        return t;
      },
      enumerable: !0,
      configurable: !0
    });

    Object.defineProperty(t.prototype, "outerHTML", {
      get: function() {
        var e = new y(this);
        return e.toString(!0);
      },
      enumerable: !0,
      configurable: !0
    });

    Object.defineProperty(t.prototype, "innerHTML", {
      get: function() {
        var e = new y(this);
        return e.toString();
      },
      set: function(e) {
        var t = this;

        var n = new v(this.ownerDocument);

        var i = n.parse(e);
        i.forEach(function(e) {
          t.appendChild(e);
        });
      },
      enumerable: !0,
      configurable: !0
    });

    return t;
  }(r);
  t.MockHTMLElement = u;
  var l = function() {
    function e() {}
    e.prototype.createElement = function(e) {
      var t = new u(e);
      t.ownerDocument = this;

      return t;
    };

    e.prototype.createTextNode = function(e) {
      var t = new a(e);
      t.ownerDocument = this;

      return t;
    };

    e.prototype.createAttribute = function(e) {
      var t = new o(e);
      t.ownerDocument = this;

      return t;
    };

    return e;
  }();
  t.MockDocument = l;
  var c = function() {
    function e() {}
    return e;
  }();
  t.MockWindow = c;
  var d = function() {
    function e(e) {
      this.name = "error";

      this.message = e;
    }
    e.prototype.consumeCharacter = function() {
      return this;
    };

    e.prototype.onTransition = function() {};

    return e;
  }();

  var h = function() {
    function e() {
      this.name = "text";

      this.textContent = "";
    }
    e.prototype.consumeCharacter = function(e) {
      var t = e.next();
      switch (t) {
        case "<":
          return new p;
        case ">":
          return new d("Unexpected >");
        default:
          this.textContent += t;

          return this;
      }
    };

    e.prototype.onTransition = function(e) {
      if (this.textContent) {
        var t = e.document.createTextNode(this.textContent);
        e.currentNode ? e.currentNode.appendChild(t) : e.root.push(t);
      }
    };

    return e;
  }();

  var p = function() {
    function e() {
      this.name = "tag";

      this.tagName = "";

      this.isClosing = !1;

      this.attributes = {};
    }
    e.prototype.consumeCharacter = function(e) {
      var t = e.next();
      switch (t) {
        case "/":
          this.isClosing = !0;

          return this;
        case ">":
          return this.tagName ? new h : new d("No tag name specified");
        case " ":
          return this.tagName ? this.isClosing ? new d("Closing tags cannot have attributes") : new f(this) : new d(
            "Tag name must be first.");
        default:
          this.tagName += t;

          return this;
      }
    };

    e.prototype.onTransition = function(e, t) {
      var n = this;
      if (this.tagName && "attribute" !== t)
        if (this.isClosing) {
          if (e.openElements[e.openElements.length - 1].tagName !== this.tagName) throw new Error(
            "Mismatched closing tag:" + this.tagName);
          e.openElements.pop();

          e.currentNode = e.openElements.length ? e.openElements[e.openElements.length - 1] : null;
        } else {
          var i = e.document.createElement(this.tagName);
          Object.keys(this.attributes).forEach(function(e) {
            i.setAttribute(e, n.attributes[e]);
          });

          e.currentNode ? e.currentNode.appendChild(i) : e.root.push(i);

          e.openElements.push(i);

          e.currentNode = i;
        }
    };

    return e;
  }();

  var f = function() {
    function e(e) {
      this.name = "attribute";

      this.tag = e;

      this.inValue = !1;

      this.attributeName = "";
    }
    e.prototype.consumeCharacter = function(e) {
      var t = e.next();
      switch (t) {
        case " ":
          return this.inValue ? this.tag : this;
        case "=":
          this.inValue = !0;

          return new g(this);
        case ">":
          e.back();

          return this.tag;
        default:
          this.inValue === !1 && (this.attributeName += t);

          return this;
      }
    };

    e.prototype.onTransition = function(e, t) {
      if ("attributeValue" !== t) {
        this.tag.attributes[this.attributeName] = this.attributeValue;
      }
    };

    return e;
  }();

  var g = function() {
    function e(e) {
      this.name = "attributeValue";

      this.attribute = e;

      this.value = "";

      this.quote = !1;
    }
    e.prototype.consumeCharacter = function(e) {
      var t = e.next();
      switch (t) {
        case '"':
          return this.quote === !1 ? (this.quote = !0, this) : this.attribute;
        default:
          return this.quote === !1 ? new d('Expected " character') : (this.value += t, this);
      }
    };

    e.prototype.onTransition = function() {
      this.attribute.attributeValue = this.value;
    };

    return e;
  }();

  var m = function() {
    function e(e) {
      this.index = 0;

      this.text = e;
    }
    e.prototype.more = function() {
      return this.index < this.text.length;
    };

    e.prototype.next = function() {
      if (this.index >= this.text.length) throw new Error("Past end of string!");
      return this.text[this.index++];
    };

    e.prototype.back = function() {
      this.index--;
    };

    return e;
  }();

  var v = function() {
    function e(e) {
      this.document = e;

      this.root = [];

      this.openElements = [];

      this.currentNode = null;

      this.activeState = new h;
    }
    e.prototype.parse = function(e) {
      for (var t = new m(e); t.more();) {
        var n = this.activeState.consumeCharacter(t);
        if (n !== this.activeState) {
          this.activeState.onTransition(this, n.name);
          this.activeState = n;
        }
      }
      if ("error" === this.activeState.name) throw new Error(this.activeState.message);
      if (0 !== this.openElements.length) throw new Error("Elements not closed: " + this.openElements.map(function(e) {
        return e.tagName;
      }).join());
      return this.root;
    };

    return e;
  }();

  var y = function() {
    function e(e) {
      this.root = e;
    }
    e.prototype.print = function(e) {
      var t = "";
      switch (e.nodeType) {
        case e.ELEMENT_NODE:
          t += this.printElement(e);
          break;
        case e.TEXT_NODE:
          t += this.printText(e);
      }
      return t;
    };

    e.prototype.printChildren = function(e) {
      var t = "";
      if (e.hasChildNodes())
        for (var n = 0; n < e.childNodes.length; n++) {
          t += this.print(e.childNodes.item(n));
        }
      return t;
    };

    e.prototype.printElement = function(e) {
      var t = ["<"];
      if (t.push(e.tagName), e.hasAttributes()) {
        var n = e.attributes;
        t.push(n.reduce(function(e, t) {
          var n = [e, t.name];
          t.value && n.push('="', t.value, '"');

          return n.join("");
        }, " "));
      }
      t.push(">");

      t.push(this.printChildren(e));

      t.push("</");

      t.push(e.tagName);

      t.push(">");

      return t.join("");
    };

    e.prototype.printText = function(e) {
      return e.wholeText;
    };

    e.prototype.toString = function(e) {
      return e ? this.print(this.root) : this.printChildren(this.root);
    };

    return e;
  }();
});

define("vs/base/dom/iframe", ["require", "exports"], function(e, t) {
  function n(e) {
    if (!e.parent || e.parent === e) {
      return null;
    }
    try {
      var t = e.location;

      var n = e.parent.location;
      if (t.protocol !== n.protocol || t.hostname !== n.hostname || t.port !== n.port) {
        a = !0;
        return null;
      }
    } catch (i) {
      a = !0;

      return null;
    }
    return e.parent;
  }

  function i(e, t) {
    for (var n, i = e.document.getElementsByTagName("iframe"), o = 0, r = i.length; r > o; o++)
      if (n = i[o], n.contentWindow === t) {
        return n;
      }
    return null;
  }

  function o() {
    if (!u) {
      u = [];
      var e;

      var t = window;
      do {
        e = n(t);
        e ? u.push({
          window: t,
          iframeElement: i(e, t)
        }) : u.push({
          window: t,
          iframeElement: null
        });
        t = e;
      } while (t);
    }
    return u.slice(0);
  }

  function r() {
    u || t.getSameOriginWindowChain();

    return a;
  }

  function s(e, n) {
    if (!n || e === n) {
      return {
        top: 0,
        left: 0
      };
    }
    for (var i = 0, o = 0, r = t.getSameOriginWindowChain(), s = 0; s < r.length; s++) {
      var a = r[s];
      if (a.window === n) break;
      if (!a.iframeElement) break;
      var u = a.iframeElement.getBoundingClientRect();
      i += u.top;

      o += u.left;
    }
    return {
      top: i,
      left: o
    };
  }
  var a = !1;

  var u = null;
  t.getSameOriginWindowChain = o;

  t.hasDifferentOriginAncestor = r;

  t.getPositionOfChildWindowRelativeToAncestorWindow = s;
});

define("vs/base/lifecycle", ["require", "exports"], function(e, t) {
  function n(e) {
    for (var t = 0, n = e.length; n > t; t++) {
      if (e[t]) {
        e[t].dispose();
      }
    }
    return [];
  }

  function i() {
    for (var e = [], n = 0; n < arguments.length - 0; n++) {
      e[n] = arguments[n + 0];
    }
    return {
      dispose: function() {
        return t.disposeAll(e);
      }
    };
  }

  function o(e) {
    for (; e.length > 0;) {
      e.pop()();
    }
    return e;
  }
  t.disposeAll = n;

  t.combinedDispose = i;

  t.cAll = o;
});

var __extends = this.__extends || function(e, t) {
    function n() {
      this.constructor = e;
    }
    for (var i in t) {
      if (t.hasOwnProperty(i)) {
        e[i] = t[i];
      }
    }
    n.prototype = t.prototype;

    e.prototype = new n;
  };

define("vs/platform/markers/markers", ["require", "exports", "vs/base/assert", "vs/base/network"], function(e, t, n, i) {
  function o(e) {
    var t = e;
    return "string" == typeof t.type && "number" == typeof t.severity && "number" == typeof t.code && "string" ==
      typeof t.text;
  }

  function r(e) {
    var n = e;
    return t.isITextMarker(e) && "undefined" != typeof n.range;
  }

  function s(e) {
    var n = e;
    return t.isITextMarker(e) && "number" == typeof n.offset && "number" == typeof n.length;
  }

  function a(e) {
    var n = e;
    return t.isITextMarker(e) && "number" == typeof n.lineNumber && "number" == typeof n.column && "number" == typeof n
      .length;
  }

  function u(e) {
    var n = e;
    return t.isITextMarker(e) && "number" == typeof n.startLineNumber && "number" == typeof n.startColumn && "number" ==
      typeof n.endLineNumber && "number" == typeof n.endColumn;
  }

  function l(e, t, n, i, o) {
    return {
      type: "text",
      severity: e,
      code: t,
      text: n,
      offset: i,
      length: o
    };
  }

  function c(e, t, n, i) {
    return {
      type: "text",
      severity: e,
      code: t,
      text: n,
      range: i
    };
  }

  function d(e) {
    return new y(e);
  }

  function h(e, t) {
    return t + "|" + e.toExternal();
  }

  function p(e, t) {
    return new b(e, t);
  }

  function f(e) {
    return b.fromJson(e);
  }

  function g(e, t) {
    var i = null;
    if (t) {
      if (n.ok(e.getAssociatedResource().toExternal() === t.getAssociatedResource().toExternal()), e.getId() === y.DEFAULT_GROUP) {
        i = new y(t.getAssociatedResource(), e.getMarkers());
        t.getGroups().forEach(function(e) {
          i.addGroup(e);
        });
        return i;
      }
      var o = new v(t, e.getId(), e.getMarkers());

      var r = t.getGroup(e.getId());
      return r ? (i = new y(t.getAssociatedResource(), t.getGroup(y.DEFAULT_GROUP).getMarkers()), t.getGroups().forEach(
        function(e) {
          if (e.getId() !== o.getId()) {
            i.addGroup(e);
          }
        }), i.addGroup(o), i) : (t.addGroup(o), t);
    }
    if (e.getId() === y.DEFAULT_GROUP) {
      return new y(e.getAssociatedResource(), e.getMarkers());
    }
    i = new y(e.getAssociatedResource());
    var s = new v(i, e.getId(), e.getMarkers());
    i.addGroup(s);

    return i;
  }
  t.isITextMarker = o;

  t.isIRangeTextMarker = r;

  t.isIOffsetLengthTextMarker = s;

  t.isILineLengthTextMarker = a;

  t.isILineColumnTextMarker = u;

  t.createTextMarker = l;

  t.createRangeTextMarker = c;
  var m = function() {
    function e(e) {
      if ("undefined" == typeof e) {
        e = [];
      }

      this.markers = e;
    }
    e.prototype.length = function() {
      return this.markers.length;
    };

    e.prototype.markerAt = function(e) {
      return this.markers[e];
    };

    e.prototype.getMarkers = function() {
      return this.markers.slice(0);
    };

    e.prototype.forEach = function(e) {
      this.markers.forEach(e);
    };

    return e;
  }();

  var v = function(e) {
    function t(t, n, i) {
      if ("undefined" == typeof i) {
        i = [];
      }

      e.call(this, i);

      this.owner = t;

      this.id = n;
    }
    __extends(t, e);

    t.prototype.getAssociatedResource = function() {
      return this.owner.getAssociatedResource();
    };

    t.prototype.getId = function() {
      return this.id;
    };

    return t;
  }(m);

  var y = function(e) {
    function t(t, n) {
      if ("undefined" == typeof n) {
        n = [];
      }

      e.call(this, n);

      this.resource = t;

      this.groups = [];
    }
    __extends(t, e);

    t.prototype.getAssociatedResource = function() {
      return this.resource;
    };

    t.prototype.getId = function() {
      return t.DEFAULT_GROUP;
    };

    t.prototype.getMarkers = function() {
      var t = e.prototype.getMarkers.call(this);
      this.groups.forEach(function(e) {
        t = t.concat(e.getMarkers());
      });

      return t;
    };

    t.prototype.getGroups = function() {
      return this.groups.slice(0);
    };

    t.prototype.getGroup = function(n) {
      if (t.DEFAULT_GROUP === n) {
        return new v(this, this.getId(), e.prototype.getMarkers.call(this));
      }
      for (var i = 0; i < this.groups.length; i++)
        if (this.groups[i].getId() === n) {
          return this.groups[i];
        }
      return null;
    };

    t.prototype.addGroup = function(e) {
      n.ok(e.getId() !== t.DEFAULT_GROUP);
      var i = this.getGroup(e.getId());
      n.ok(null === i);

      this.groups.push(e);
    };

    t.DEFAULT_GROUP = "defaultGroup";

    return t;
  }(m);
  t.createMarkerSet = d;
  var _ = ["type", "id"];

  var b = function() {
    function e(e, t) {
      this.resource = e;

      this.id = t;

      this.markers = [];
    }
    e.prototype.getAssociatedResource = function() {
      return this.resource;
    };

    e.prototype.getId = function() {
      return this.id;
    };

    e.prototype.computeKey = function() {
      return this.id + "|" + this.resource.toExternal();
    };

    e.prototype.length = function() {
      return this.markers.length;
    };

    e.prototype.markerAt = function(e) {
      return this.markers[e];
    };

    e.prototype.forEach = function(e) {
      this.markers.forEach(e);
    };

    e.prototype.getMarkers = function() {
      return this.markers.slice(0);
    };

    e.prototype.addMarker = function(e) {
      this.markers.push(e);
    };

    e.prototype.toJson = function() {
      return {
        resource: this.resource.toExternal(),
        id: this.id,
        markers: this.markers.slice(0)
      };
    };

    e.fromJson = function(t) {
      var n = new e(new i.URL(t.resource), t.id);
      n.markers = t.markers.slice(0);
      for (var o = {}, r = 0; r < n.markers.length; r++) {
        var s = n.markers[r];
        _.forEach(function(e) {
          var t = s[e];

          var n = o[t];
          n ? s[e] = n : o[t] = t;
        });
      }
      return n;
    };

    return e;
  }();
  t.computeKey = h;

  t.createMarkerUpdate = p;

  t.createMarkerUpdateFromJson = f;

  t.processMarkerUpdate = g;
});

define("vs/platform/markers/markersWorker", ["require", "exports", "vs/base/assert", "./markers"], function(e, t, n, i) {
  function o(e, t) {
    return new s(e, t);
  }
  var r = function() {
    function e(e) {
      this.markers = e;
    }
    e.prototype.getAssociatedResource = function() {
      return this.markers.getAssociatedResource();
    };

    e.prototype.getId = function() {
      return this.markers.getId();
    };

    e.prototype.forEach = function(e) {
      this.markers.forEach(e);
    };

    e.prototype.length = function() {
      return this.markers.length();
    };

    e.prototype.at = function(e) {
      return this.markers.markerAt(e);
    };

    return e;
  }();

  var s = function() {
    function e(e, t) {
      var n = this;
      this.targets = e;

      this.publisher = t;

      this.markerUpdates = {};

      this.modelInfos = {};

      this.models = {};

      this.globalChangeCount = 0;

      this.markerUpdateChangeCounts = {};

      e.forEach(function(e) {
        var t = e.getAssociatedResource().toExternal();
        n.modelInfos[t] = {
          version: e.getVersionId()
        };

        n.models[t] = e;
      });
    }
    e.prototype.readMarkers = function(t, n, o) {
      var s;

      var a;
      "undefined" == typeof o ? (s = e.DEFAULT_GROUP, a = n) : (s = n, a = o);
      var u = this.markerUpdates[i.computeKey(t, s)];
      u ? a(new r(u)) : a(null);
    };

    e.prototype.batchChanges = function(e) {
      try {
        this.globalChangeCount++;

        e(this);
      } finally {
        this.globalChangeCount--;

        if (0 === this.globalChangeCount) {
          this._publishReadyMarkerUpdates();
        }
      }
    };

    e.prototype.changeMarkers = function(t, i, o) {
      var r;

      var s;
      "undefined" == typeof o ? (r = e.DEFAULT_GROUP, s = i) : (r = i, s = o);

      n.ok("*" !== r, "Parameter ownerId can't be '*'");
      var a = this._getMarkerUpdate(t, r);

      var u = {
        getAssociatedResource: function() {
          return a.getAssociatedResource();
        },
        getId: function() {
          return a.getId();
        },
        addMarker: function(e) {
          a.addMarker(e);
        }
      };
      try {
        this._increaseMarkerUpdateChangeCount(a);

        s(u);
      } finally {
        this._decreaseMarkerUpdateChangeCount(a);
      }
    };

    e.prototype._getMarkerUpdate = function(e, t) {
      var n = i.computeKey(e, t);

      var o = this.markerUpdates[n];
      o || (o = i.createMarkerUpdate(e, t), this.markerUpdates[n] = o);

      return o;
    };

    e.prototype._removeMarkerUpdate = function(e) {
      var t = e.computeKey();
      delete this.markerUpdates[t];
    };

    e.prototype._increaseMarkerUpdateChangeCount = function(e) {
      var t = e.computeKey();

      var n = this.markerUpdateChangeCounts[t];
      this.markerUpdateChangeCounts[t] = "undefined" == typeof n ? 1 : ++n;
    };

    e.prototype._decreaseMarkerUpdateChangeCount = function(e) {
      var t = e.computeKey();

      var n = this.markerUpdateChangeCounts[t];
      n > 1 ? this.markerUpdateChangeCounts[t] = --n : (delete this.markerUpdateChangeCounts[t], 0 === this.globalChangeCount &&
        this._publishMarkerUpdate(e));
    };

    e.prototype._getMarkerUpdateChangeCount = function(e) {
      return this.markerUpdateChangeCounts[e.computeKey()];
    };

    e.prototype._publishMarkerUpdate = function(e) {
      var t = [];
      t.push(this._convertToJson(e));

      this.publisher.sendMessage("publishMarkerUpdates", t);

      this._removeMarkerUpdate(e);
    };

    e.prototype._publishReadyMarkerUpdates = function() {
      var e = this;

      var t = [];
      Object.keys(this.markerUpdates).forEach(function(n) {
        var i = e.markerUpdates[n];

        var o = e._getMarkerUpdateChangeCount(i);
        if ("undefined" == typeof o) {
          t.push(e._convertToJson(i));
        }
      });

      this.publisher.sendMessage("publishMarkerUpdates", t);
    };

    e.prototype._toRangeTextMarker = function(e, t) {
      var n;

      var o;

      var r;

      var s;
      if (i.isIOffsetLengthTextMarker(t)) {
        var a = t;

        var u = a.offset;

        var l = Math.max(0, a.length);

        var c = e.getRangeFromOffsetAndLength(u, l);
        n = c.startLineNumber;

        o = c.startColumn;

        r = c.endLineNumber;

        s = c.endColumn;
      } else if (i.isILineLengthTextMarker(t)) {
        var d = t;
        n = d.lineNumber;

        o = d.column;

        r = d.lineNumber;

        s = d.column + d.length;
      } else if (i.isILineColumnTextMarker(t)) {
        var h = t;
        n = h.startLineNumber;

        o = h.startColumn;

        r = h.endLineNumber;

        s = h.endColumn;
      } else {
        if (!i.isIRangeTextMarker(t)) throw new Error("Cannot normalize to IRangeTextMarker unknown marker type");
        var p = t;
        n = p.range.startLineNumber;

        o = p.range.startColumn;

        r = p.range.endLineNumber;

        s = p.range.endColumn;
      }
      return {
        range: {
          startLineNumber: n,
          startColumn: o,
          endLineNumber: r,
          endColumn: s
        },
        severity: t.severity,
        code: t.code,
        text: t.text,
        type: t.type,
        optionalId: t.optionalId
      };
    };

    e.prototype._convertToJson = function(e) {
      var t = e.toJson();

      var n = e.getAssociatedResource().toExternal();

      var o = this.modelInfos[n];

      var r = this.models[n];
      if (!o || !r) throw new Error("Unknown model for " + n);
      for (var s = [], a = 0, u = t.markers.length; u > a; a++) {
        var l = t.markers[a];
        if (!i.isITextMarker(l)) throw new Error("Unknown marker type");
        var c = l;
        s.push(this._toRangeTextMarker(r, c));
      }
      return {
        resource: t.resource,
        id: t.id,
        model: {
          versionId: o.version
        },
        markers: s
      };
    };

    e.DEFAULT_GROUP = "defaultGroup";

    return e;
  }();
  t.MarkerPublisher = s;

  t.createPublisher = o;
});

define("vs/editor/core/constants", ["require", "exports"], function(e, t) {
  t.EditorType = {
    ICodeEditor: "vs.editor.ICodeEditor",
    IDiffEditor: "vs.editor.IDiffEditor",
    ITerminal: "vs.editor.ITerminal"
  };

  t.ClassName = {
    EditorWarningDecoration: "greensquiggly",
    EditorErrorDecoration: "redsquiggly"
  };

  t.EventType = {
    Disposed: "disposed",
    ConfigurationChanged: "configurationChanged",
    ModelDispose: "modelDispose",
    ModelChanged: "modelChanged",
    ModelModeChanged: "modelsModeChanged",
    ModelTokensChanged: "modelTokensChanged",
    ModelContentChanged: "contentChanged",
    ModelContentChangedFlush: "flush",
    ModelContentChangedLinesDeleted: "linesDeleted",
    ModelContentChangedLinesInserted: "linesInserted",
    ModelContentChangedLineChanged: "lineChanged",
    OnBeforeModelContentChangedFlush: "onBeforeFlush",
    OnBeforeModelContentChangedLinesDeleted: "onBeforeLinesDeleted",
    OnBeforeModelContentChangedLinesInserted: "onBeforeLinesInserted",
    OnBeforeModelContentChangedLineChanged: "onBeforeLineChanged",
    ModelPropertiesChanged: "propertiesChanged",
    ModelDecorationsChanged: "decorationsChanged",
    CursorPositionChanged: "positionChanged",
    CursorSelectionChanged: "selectionChanged",
    CursorRevealRange: "revealRange",
    ViewFocusGained: "focusGained",
    ViewFocusLost: "focusLost",
    ViewFocusChanged: "focusChanged",
    ViewScrollWidthChanged: "scrollWidthChanged",
    ViewScrollHeightChanged: "scrollHeightChanged",
    ViewScrollChanged: "scrollChanged",
    ViewZonesChanged: "zonesChanged",
    ViewLayoutChanged: "viewLayoutChanged",
    ContextMenu: "contextMenu",
    MouseDown: "mousedown",
    MouseUp: "mouseup",
    MouseMove: "mousemove",
    MouseLeave: "mouseleave",
    KeyDown: "keydown",
    KeyUp: "keyup",
    EditorLayout: "editorLayout",
    DiffUpdated: "diffUpdated"
  };
});

define("vs/editor/core/view/model/prefixSumComputer", ["require", "exports"], function(e, t) {
  var n = function() {
    function e(e) {
      this.values = e;

      this.prefixSum = [];
      for (var t = 0, n = this.values.length; n > t; t++) {
        this.prefixSum[t] = 0;
      }
      this.prefixSumValidIndex = -1;
    }
    e.prototype.getCount = function() {
      return this.values.length;
    };

    e.prototype.insertValue = function(e, t) {
      this.values.splice(e, 0, t);

      this.prefixSum.splice(e, 0, 0);

      if (e - 1 < this.prefixSumValidIndex) {
        this.prefixSumValidIndex = e - 1;
      }
    };

    e.prototype.changeValue = function(e, t) {
      if (this.values[e] !== t) {
        this.values[e] = t;
        if (e - 1 < this.prefixSumValidIndex) {
          this.prefixSumValidIndex = e - 1;
        }
      }
    };

    e.prototype.removeValues = function(e, t) {
      this.values.splice(e, t);

      this.prefixSum.splice(e, t);

      if (e - 1 < this.prefixSumValidIndex) {
        this.prefixSumValidIndex = e - 1;
      }
    };

    e.prototype.getTotalValue = function() {
      return 0 === this.values.length ? 0 : this.getAccumulatedValue(this.values.length - 1);
    };

    e.prototype.getAccumulatedValue = function(e) {
      if (0 > e) {
        return 0;
      }
      if (e <= this.prefixSumValidIndex) {
        return this.prefixSum[e];
      }
      var t = this.prefixSumValidIndex + 1;
      if (0 === t) {
        this.prefixSum[0] = this.values[0];
        t++;
      }
      for (var n = t; e >= n; n++) {
        this.prefixSum[n] = this.prefixSum[n - 1] + this.values[n];
      }
      this.prefixSumValidIndex = Math.max(this.prefixSumValidIndex, e);

      return this.prefixSum[e];
    };

    e.prototype.getIndexOf = function(e, t) {
      for (var n, i, o, r = 0, s = this.values.length - 1; s >= r;)
        if (n = r + (s - r) / 2 | 0, o = this.getAccumulatedValue(n), i = o - this.values[n], i > e) {
          s = n - 1;
        } else {
          if (!(e >= o)) break;
          r = n + 1;
        }
      t.index = n;

      t.remainder = e - i;
    };

    return e;
  }();
  t.PrefixSumComputer = n;
});

define("vs/editor/editor", ["require", "exports"], function(e, t) {
  ! function(e) {
    e[e.LTR = 0] = "LTR";

    e[e.RTL = 1] = "RTL";
  }(t.SelectionDirection || (t.SelectionDirection = {}));
  t.SelectionDirection;
  ! function(e) {
    e[e.Left = 1] = "Left";

    e[e.Center = 2] = "Center";

    e[e.Right = 4] = "Right";

    e[e.Full = 7] = "Full";
  }(t.OverviewRulerLane || (t.OverviewRulerLane = {}));
  t.OverviewRulerLane;
  ! function(e) {
    e[e.TextDefined = 0] = "TextDefined";

    e[e.LF = 1] = "LF";

    e[e.CRLF = 2] = "CRLF";
  }(t.EndOfLinePreference || (t.EndOfLinePreference = {}));
  t.EndOfLinePreference;
  ! function(e) {
    e[e.AlwaysGrowsWhenTypingAtEdges = 0] = "AlwaysGrowsWhenTypingAtEdges";

    e[e.NeverGrowsWhenTypingAtEdges = 1] = "NeverGrowsWhenTypingAtEdges";

    e[e.GrowsOnlyWhenTypingBefore = 2] = "GrowsOnlyWhenTypingBefore";

    e[e.GrowsOnlyWhenTypingAfter = 3] = "GrowsOnlyWhenTypingAfter";
  }(t.TrackedRangeStickiness || (t.TrackedRangeStickiness = {}));
  t.TrackedRangeStickiness;
  ! function(e) {
    e[e.EXACT = 0] = "EXACT";

    e[e.ABOVE = 1] = "ABOVE";

    e[e.BELOW = 2] = "BELOW";
  }(t.ContentWidgetPositionPreference || (t.ContentWidgetPositionPreference = {}));
  t.ContentWidgetPositionPreference;
  ! function(e) {
    e[e.TOP_RIGHT_CORNER = 0] = "TOP_RIGHT_CORNER";

    e[e.TOP_CENTER = 1] = "TOP_CENTER";
  }(t.OverlayWidgetPositionPreference || (t.OverlayWidgetPositionPreference = {}));
  t.OverlayWidgetPositionPreference;
  ! function(e) {
    e[e.UNKNOWN = 0] = "UNKNOWN";

    e[e.TEXTAREA = 1] = "TEXTAREA";

    e[e.GUTTER_GLYPH_MARGIN = 2] = "GUTTER_GLYPH_MARGIN";

    e[e.GUTTER_LINE_NUMBERS = 3] = "GUTTER_LINE_NUMBERS";

    e[e.GUTTER_LINE_DECORATIONS = 4] = "GUTTER_LINE_DECORATIONS";

    e[e.GUTTER_VIEW_ZONE = 5] = "GUTTER_VIEW_ZONE";

    e[e.CONTENT_TEXT = 6] = "CONTENT_TEXT";

    e[e.CONTENT_EMPTY = 7] = "CONTENT_EMPTY";

    e[e.CONTENT_VIEW_ZONE = 8] = "CONTENT_VIEW_ZONE";

    e[e.CONTENT_WIDGET = 9] = "CONTENT_WIDGET";

    e[e.OVERVIEW_RULER = 10] = "OVERVIEW_RULER";

    e[e.SCROLLBAR = 11] = "SCROLLBAR";

    e[e.OVERLAY_WIDGET = 12] = "OVERLAY_WIDGET";
  }(t.MouseTargetType || (t.MouseTargetType = {}));
  t.MouseTargetType;
});

define("vs/editor/core/position", ["require", "exports"], function(e, t) {
  function n(e) {
    return e && "number" == typeof e.lineNumber && "number" == typeof e.column;
  }
  t.isIPosition = n;

  (function(e) {
    function t(e) {
      return {
        startLineNumber: e.lineNumber,
        startColumn: e.column,
        endLineNumber: e.lineNumber,
        endColumn: e.column
      };
    }

    function n(e) {
      return {
        lineNumber: e.startLineNumber,
        column: e.startColumn
      };
    }

    function i(e) {
      return {
        lineNumber: e.endLineNumber,
        column: e.endColumn
      };
    }
    e.asEmptyRange = t;

    e.startPosition = n;

    e.endPosition = i;
  })(t.PositionUtils || (t.PositionUtils = {}));
  var i = (t.PositionUtils, function() {
    function e(e, t) {
      this.lineNumber = e;

      this.column = t;
    }
    e.prototype.equals = function(e) {
      return !!e && this.lineNumber === e.lineNumber && this.column === e.column;
    };

    e.prototype.isBefore = function(e) {
      return this.lineNumber < e.lineNumber ? !0 : e.lineNumber < this.lineNumber ? !1 : this.column < e.column;
    };

    e.prototype.isBeforeOrEqual = function(e) {
      return this.lineNumber < e.lineNumber ? !0 : e.lineNumber < this.lineNumber ? !1 : this.column <= e.column;
    };

    e.prototype.clone = function() {
      return new e(this.lineNumber, this.column);
    };

    e.prototype.toString = function() {
      return "(" + this.lineNumber + "," + this.column + ")";
    };

    return e;
  }());
  t.Position = i;
});

define("vs/editor/core/range", ["require", "exports", "vs/editor/core/position"], function(e, t, n) {
  function i(e) {
    return e && "number" == typeof e.startLineNumber && "number" == typeof e.startColumn && "number" == typeof e.endLineNumber &&
      "number" == typeof e.endColumn;
  }

  function o(e) {
    return e.startLineNumber === e.endLineNumber && e.startColumn === e.endColumn;
  }

  function r(e, t) {
    return t.lineNumber < e.startLineNumber || t.lineNumber > e.endLineNumber ? !1 : t.lineNumber === e.startLineNumber &&
      t.column < e.startColumn ? !1 : t.lineNumber === e.endLineNumber && t.column > e.endColumn ? !1 : !0;
  }

  function s(e, t) {
    return t.startLineNumber < e.startLineNumber || t.endLineNumber < e.startLineNumber ? !1 : t.startLineNumber > e.endLineNumber ||
      t.endLineNumber > e.endLineNumber ? !1 : t.startLineNumber === e.startLineNumber && t.startColumn < e.startColumn ? !
      1 : t.endLineNumber === e.endLineNumber && t.endColumn > e.endColumn ? !1 : !0;
  }

  function a(e, t) {
    var n = e.startLineNumber;

    var i = e.startColumn;

    var o = e.endLineNumber;

    var r = e.endColumn;

    var s = t.startLineNumber;

    var a = t.startColumn;

    var u = t.endLineNumber;

    var l = t.endColumn;
    s > n ? (n = s, i = a) : n === s && (i = Math.max(i, a));

    o > u ? (o = u, r = l) : o === u && (r = Math.min(r, l));

    return n > o ? null : n === o && i > r ? null : new g(n, i, o, r);
  }

  function u(e, t) {
    var n;

    var i;

    var o;

    var r;
    t.startLineNumber < e.startLineNumber ? (n = t.startLineNumber, i = t.startColumn) : t.startLineNumber === e.startLineNumber ?
      (n = t.startLineNumber, i = Math.min(t.startColumn, e.startColumn)) : (n = e.startLineNumber, i = e.startColumn);

    t.endLineNumber > e.endLineNumber ? (o = t.endLineNumber, r = t.endColumn) : t.endLineNumber === e.endLineNumber ?
      (o = t.endLineNumber, r = Math.max(t.endColumn, e.endColumn)) : (o = e.endLineNumber, r = e.endColumn);

    return new g(n, i, o, r);
  }

  function l(e, t) {
    return !!e && !! t && e.startLineNumber === t.startLineNumber && e.startColumn === t.startColumn && e.endLineNumber ===
      t.endLineNumber && e.endColumn === t.endColumn;
  }

  function c(e, t) {
    return e.startLineNumber === t.startLineNumber ? e.startColumn === t.startColumn ? e.endLineNumber === t.endLineNumber ?
      e.endColumn - t.endColumn : e.endLineNumber - t.endLineNumber : e.startColumn - t.startColumn : e.startLineNumber -
      t.startLineNumber;
  }

  function d(e, t) {
    return e.endLineNumber === t.endLineNumber ? e.endColumn === t.endColumn ? e.startLineNumber === t.startLineNumber ?
      e.startColumn - t.startColumn : e.startLineNumber - t.startLineNumber : e.endColumn - t.endColumn : e.endLineNumber -
      t.endLineNumber;
  }

  function h(e) {
    return e.endLineNumber > e.startLineNumber;
  }

  function p(e) {
    return 17 * e.startLineNumber + 23 * e.startColumn + 29 * e.endLineNumber + 37 * e.endColumn;
  }

  function f(e) {
    return new g(e.startLineNumber, e.startColumn, e.endLineNumber, e.endColumn);
  }
  t.isIRange = i;

  t.isEmpty = o;

  t.containsPosition = r;

  t.containsRange = s;

  t.intersectRanges = a;

  t.plusRange = u;

  t.equalsRange = l;

  t.compareRangesUsingStarts = c;

  t.compareRangesUsingEnds = d;

  t.spansMultipleLines = h;

  t.hashCode = p;
  var g = function() {
    function e(e, t, n, i) {
      e > n || e === n && t > i ? (this.startLineNumber = n, this.startColumn = i, this.endLineNumber = e, this.endColumn =
        t) : (this.startLineNumber = e, this.startColumn = t, this.endLineNumber = n, this.endColumn = i);
    }
    e.prototype.isEmpty = function() {
      return t.isEmpty(this);
    };

    e.prototype.containsPosition = function(e) {
      return t.containsPosition(this, e);
    };

    e.prototype.containsRange = function(e) {
      return t.containsRange(this, e);
    };

    e.prototype.plusRange = function(e) {
      return t.plusRange(this, e);
    };

    e.prototype.intersectRanges = function(e) {
      return t.intersectRanges(this, e);
    };

    e.prototype.equalsRange = function(e) {
      return t.equalsRange(this, e);
    };

    e.prototype.getEndPosition = function() {
      return new n.Position(this.endLineNumber, this.endColumn);
    };

    e.prototype.getStartPosition = function() {
      return new n.Position(this.startLineNumber, this.startColumn);
    };

    e.prototype.cloneRange = function() {
      return new e(this.startLineNumber, this.startColumn, this.endLineNumber, this.endColumn);
    };

    e.prototype.toString = function() {
      return "[" + this.startLineNumber + "," + this.startColumn + " -> " + this.endLineNumber + "," + this.endColumn +
        "]";
    };

    e.prototype.setEndPosition = function(t, n) {
      return new e(this.startLineNumber, this.startColumn, t, n);
    };

    e.prototype.setStartPosition = function(t, n) {
      return new e(t, n, this.endLineNumber, this.endColumn);
    };

    return e;
  }();
  t.Range = g;

  t.create = f;
});

define("vs/editor/modes/modes", ["require", "exports", "vs/base/types"], function(e, t, n) {
  function i(e) {
    return null === e || "object" != typeof e ? !1 : "string" != typeof e.label || "string" != typeof e.codeSnippet ||
      "string" != typeof e.type ? !1 : n.isUndefinedOrNull(e.highlights) || n.isArray(e.highlights) ? n.isUndefinedOrNull(
        e.typeLabel) || "string" == typeof e.typeLabel ? n.isUndefinedOrNull(e.documentationLabel) || "string" ==
      typeof e.documentationLabel ? !0 : !1 : !1 : !1;
  }! function(e) {
    e[e.None = 0] = "None";

    e[e.Open = 1] = "Open";

    e[e.Close = -1] = "Close";
  }(t.Bracket || (t.Bracket = {}));
  t.Bracket;
  t.isISuggestion = i;

  (function(e) {
    e[e.None = 0] = "None";

    e[e.Indent = 1] = "Indent";

    e[e.IndentOutdent = 2] = "IndentOutdent";
  })(t.IndentAction || (t.IndentAction = {}));
  t.IndentAction;
});

define("vs/base/arrays", ["require", "exports"], function(e, t) {
  function n(e, t) {
    "undefined" == typeof t && (t = 0);

    return e[e.length - (1 + t)];
  }

  function i(e, t) {
    for (var n = 0, i = e.length; i > n; n++) {
      t(e[n], function() {
        e.splice(n, 1);

        n--;

        i--;
      });
    }
  }

  function o(e, t) {
    if ("undefined" == typeof t) {
      t = null;
    }
    for (var n = new Array(e); e-- > 0;) {
      n.push(t);
    }
    return n;
  }

  function r(e, t, n) {
    for (var i = 0, o = e.length - 1; o >= i;) {
      var r = Math.floor((i + o) / 2);

      var s = n(e[r], t);
      if (0 > s) {
        i = r + 1;
      } else {
        if (!(s > 0)) {
          return r;
        }
        o = r - 1;
      }
    }
    return -1;
  }

  function s(e) {
    for (var t = new Array, n = 0, i = e.length; i > n; n++) {
      t.push.apply(t, e[n]);
    }
    return t;
  }

  function a(e, t) {
    for (var n, i = 0, o = e.length - 1; o > i;) {
      n = i + Math.ceil((o - i) / 2);
      e[n].startIndex > t ? o = n - 1 : i = n;
    }
    return i;
  }

  function u(e) {
    for (var t = [], n = 0; n < e.length; n++) {
      var i = e[n];
      if (i) {
        t.push(i);
      }
    }
    return t;
  }

  function l(e, t) {
    return e.indexOf(t) >= 0;
  }

  function c(e, t, n) {
    var i = e[t];

    var o = e[n];
    e[t] = o;

    e[n] = i;
  }

  function d(e, t, n) {
    e.splice(n, 0, e.splice(t, 1)[0]);
  }
  t.tail = n;

  t.forEach = i;

  t.fill = o;

  t.binarySearch = r;

  t.merge = s;

  t.findIndexInSegmentsArray = a;

  t.coalesce = u;

  t.contains = l;

  t.swap = c;

  t.move = d;
});

define("vs/editor/core/model/modelLine", ["require", "exports", "vs/editor/modes/modes", "vs/base/arrays"], function(e,
  t, n, i) {
  var o = function() {
    function e(e, t) {
      this.lineNumber = e;

      this.text = t;

      this.state = null;

      this.modeTransitions = null;

      this.isInvalid = !1;

      this.markers = [];

      this._recreateLineTokens(null);
    }
    e.prototype._recreateLineTokens = function(t) {
      0 === this.text.length ? t = e.DEFAULT_TOKENS_EMPTY_TEXT : t && 0 !== t.length || (t = e.DEFAULT_TOKENS_NON_EMPTY_TEXT);

      this.lineTokens = new r(t, this.text.length);
    };

    e.prototype.insertText = function(t, n, i, o) {
      var r = this.text;

      var s = r.length + 1;

      var a = this.lineTokens.getTokens();

      var u = i.text.length;
      n = Math.max(1, n);

      n = Math.min(n, s);
      var l;

      var c;
      if (u > 0) {
        var d = r.substring(0, n - 1) + i.text + r.substring(n - 1, r.length);
        if (a !== e.DEFAULT_TOKENS_NON_EMPTY_TEXT && a !== e.DEFAULT_TOKENS_EMPTY_TEXT) {
          var h;
          for (l = 0, c = a.length; c > l; l++) {
            h = a[l];
            if (h.startIndex >= n - 1 && h.startIndex > 0) {
              h.startIndex += u;
            }
          }
        }
        var p;
        for (l = 0, c = this.markers.length; c > l; l++) {
          p = this.markers[l];
          if (p.column > n || p.column === n && (o || !p.stickToPreviousCharacter)) {
            t[p.id] = !0;
            p.oldLineNumber = p.oldLineNumber || this.lineNumber;
            p.oldColumn = p.oldColumn || p.column;
            p.column += u;
          }
        }
        this.text = d;

        this._recreateLineTokens(a);
      }
      if (i.markers)
        for (l = 0, c = i.markers.length; c > l; l++) {
          p = i.markers[l];
          t[p.id] = !0;
          p.oldLineNumber = p.oldLineNumber || this.lineNumber;
          p.oldColumn = p.oldColumn || p.column;
          p.line = this;
          p.column += n - 1;
          this.markers.push(p);
        }
    };

    e.prototype.removeText = function(t, n, i, o, r) {
      var s = i;

      var a = "";

      var u = [];

      var l = this.text;

      var c = l.length + 1;

      var d = this.lineTokens.getTokens();
      n = Math.max(1, n);

      i = Math.max(1, i);

      n = Math.min(n, c);

      i = Math.min(i, c);
      var h;
      if (i > n && i > 1 && c > n) {
        a = l.substring(n - 1, i - 1);
        var p = l.substring(0, n - 1) + l.substring(i - 1, l.length);
        if (d !== e.DEFAULT_TOKENS_NON_EMPTY_TEXT && d !== e.DEFAULT_TOKENS_EMPTY_TEXT) {
          var f;

          var g;
          for (h = 0; h < d.length; h++) {
            var f = d[h].startIndex;

            var g = f;
            f >= i - 1 ? g = f - a.length : f >= n - 1 && (g = n - 1);

            g >= p.length ? (d.splice(h, 1), h--) : (d[h].startIndex = g, h > 0 && d[h - 1].startIndex >= g && (d.splice(
              h - 1, 1), h--));
          }
        }
        this.text = p;

        this._recreateLineTokens(d);
      }
      var m;
      for (h = 0; h < this.markers.length; h++) {
        m = this.markers[h];
        m.column > s || m.column === s && (r || !m.stickToPreviousCharacter) ? (t[m.id] = !0, m.oldLineNumber = m.oldLineNumber ||
          this.lineNumber, m.oldColumn = m.oldColumn || m.column, m.column -= a.length) : (m.column > n || m.column ===
          n && (r || !m.stickToPreviousCharacter)) && (t[m.id] = !0, m.oldLineNumber = m.oldLineNumber || this.lineNumber,
          m.oldColumn = m.oldColumn || m.column, o ? (m.line = null, m.column -= n - 1, this.markers.splice(h, 1), h--,
            u.push(m)) : m.column = n);
      }
      return {
        text: a,
        markers: u
      };
    };

    e.prototype.addMarker = function(e) {
      e.line = this;

      this.markers.push(e);
    };

    e.prototype.addMarkers = function(e) {
      var t;

      var n;
      for (t = 0, n = e.length; n > t; t++) {
        e[t].line = this;
      }
      this.markers = this.markers.concat(e);
    };

    e.prototype.removeMarker = function(e) {
      var t = this._indexOfMarkerId(e.id);
      if (t >= 0) {
        this.markers.splice(t, 1);
      }

      e.line = null;
    };

    e.prototype._indexOfMarkerId = function(e) {
      var t;

      var n;

      var i = this.markers;
      for (t = 0, n = i.length; n > t; t++)
        if (i[t].id === e) {
          return t;
        }
      return -1;
    };

    e.prototype.setTokens = function(e) {
      this._recreateLineTokens(e);
    };

    e.DEFAULT_TOKENS_NON_EMPTY_TEXT = [{
      startIndex: 0,
      type: "",
      bracket: 0
    }];

    e.DEFAULT_TOKENS_EMPTY_TEXT = [];

    return e;
  }();
  t.ModelLine = o;
  var r = function() {
    function e(e, t) {
      this.tokens = e;

      this.textLength = t;
    }
    e.prototype.getTokens = function() {
      return this.tokens;
    };

    e.prototype.getTextLength = function() {
      return this.textLength;
    };

    e.prototype.equals = function(e) {
      return this === e;
    };

    e.prototype.findIndexOfOffset = function(e) {
      return i.findIndexInSegmentsArray(this.tokens, e);
    };

    return e;
  }();
  t.LineTokens = r;
});

define("vs/base/env", ["require", "exports", "vs/base/types"], function(e, t, n) {
  function i(e, t) {
    "undefined" == typeof t && (t = !1);

    return self.MonacoEnvironment ? self.MonacoEnvironment[e] : t;
  }

  function o() {
    return d;
  }

  function r() {
    return !self.document && "undefined" != typeof self.importScripts;
  }

  function s() {
    return self.parent !== self;
  }

  function a() {
    return c;
  }

  function u(e) {
    c = e;
  }
  var l = navigator.userAgent;

  var c = self.isTest || !1;

  var d = self.document && self.document.URL.match(/[^\?]*\?[^\#]*pseudo=true/);

  var h = !1;
  h = self.window ? !! self.window.Worker : !0;
  var p = l.indexOf("Trident") >= 0 && l.indexOf("MSIE") < 0;

  var f = l.indexOf("MSIE 10") >= 0;

  var g = l.indexOf("MSIE 9") >= 0;

  var m = !1;
  t.browser = {
    isWindows: l.indexOf("Windows") >= 0,
    isMacintosh: l.indexOf("Macintosh") >= 0,
    isOpera: l.indexOf("Opera") >= 0,
    isIE11orEarlier: p || f || g,
    isIE11: p,
    isIE10orEarlier: f || g,
    isIE10: f,
    isIE9: g,
    isFirefox: l.indexOf("Firefox") >= 0,
    isWebKit: l.indexOf("AppleWebKit") >= 0,
    isChrome: l.indexOf("Chrome") >= 0,
    isSafari: -1 === l.indexOf("Chrome") && l.indexOf("Safari") >= 0,
    isIPad: l.indexOf("iPad") >= 0,
    canPushState: function() {
      return !m && self && self.history && self.history.pushState;
    },
    disablePushState: function() {
      m = !0;
    },
    hasWorkers: h,
    hasCSSAnimationSupport: function() {
      if (this._hasCSSAnimationSupport === !0 || this._hasCSSAnimationSupport === !1) {
        return this._hasCSSAnimationSupport;
      }
      for (var e = !1, t = document.createElement("div"), i = ["animationName", "webkitAnimationName",
          "msAnimationName", "MozAnimationName", "OAnimationName"
        ], o = 0; o < i.length; o++) {
        var r = i[o];
        if (!n.isUndefinedOrNull(t.style[r]) || t.style.hasOwnProperty(r)) {
          e = !0;
          break;
        }
      }
      this._hasCSSAnimationSupport = e ? !0 : !1;

      return this._hasCSSAnimationSupport;
    },
    canPlayVideo: function(e) {
      var t = document.createElement("video");
      if (t.canPlayType) {
        var n = t.canPlayType(e);
        return "maybe" === n || "probably" === n;
      }
      return !1;
    },
    canPlayAudio: function(e) {
      var t = document.createElement("audio");
      if (t.canPlayType) {
        var n = t.canPlayType(e);
        return "maybe" === n || "probably" === n;
      }
      return !1;
    }
  };

  t.enableBuild = i("enableBuild");

  t.enableTestCoverage = i("enableTestCoverage");

  t.enableOps = i("enableOps");

  t.enableFeedback = i("enableFeedback");

  t.enablePerformanceEvents = i("enablePerformanceEvents");

  t.enableTelemetry = i("enableTelemetry");

  t.enablePrivateTelemetry = i("enablePrivateTelemetry");

  t.enableTestViewlet = i("enableTestViewlet");

  t.enableGlobalCSSRuleChecker = i("enableGlobalCSSRuleChecker");

  t.enableNLSWarnings = i("enableNLSWarnings");

  t.enableEditorLanguageServiceIndicator = i("enableEditorLanguageServiceIndicator");

  t.enablePerformanceTools = i("enablePerformanceTools");

  t.enableRunWorkspace = i("enableRunWorkspace");

  t.enableTFSConnection = i("enableTFSConnection");

  t.portalLink = i("portalLink", null);

  t.version = i("version", null);

  t.versionLabel = i("versionLabel", null);

  t.hideDerivedResources = i("hideDerivedResources");

  t.azureWebSiteName = i("azureWebSiteName", null);

  t.enableAzurePortalNavigation = i("enableAzurePortalNavigation");

  t.privacyLink = i("privacyLink", null);

  t.supportLink = i("supportLink", null);

  t.legalLink = i("legalLink", null);

  t.videosLink = i("videosLink", null);

  t.azureWebSiteComputeMode = i("azureWebSiteComputeMode", null);

  t.azureWebSiteMode = i("azureWebSiteMode", null);

  t.standaloneEditorTelemetryEndpoint = i("telemetryEndpoint", null);

  t.getCrossOriginWorkerScriptUrl = i("getWorkerUrl", null);

  t.isPseudoLanguage = o;

  t.isInWebWorker = r;

  t.isInIframe = s;

  t.isTesting = a;

  t.setTesting = u;
});

define("vs/base/errors", ["require", "exports", "vs/nls!vs/editor/worker/editorWorkerServer", "./objects", "./env",
  "./types"
], function(e, t, n, i, o, r) {
  function s(e) {
    t.errorHandler.setUnexpectedErrorHandler(e);
  }

  function a(e, n) {
    if ("undefined" == typeof n) {
      n = null;
    }

    t.errorHandler.onUnexpectedError(e, n);
  }

  function u(e, t) {
    var i = e.errorCode;

    var o = e.errorMessage;
    return null !== i && null !== o ? n.localize("vs_base_errors", 0, i, o) : null !== o ? o : t && null !== e.responseText ?
      e.responseText : null;
  }

  function l(e, t) {
    var i = u(e, t);
    return 401 === e.status ? null !== i ? n.localize("vs_base_errors", 1, i) : n.localize("vs_base_errors", 2) : i ?
      i : e.status > 0 && null !== e.statusText ? t && null !== e.responseText && e.responseText.length > 0 ? n.localize(
        "vs_base_errors", 3, e.statusText, e.status, e.responseText) : n.localize("vs_base_errors", 4, e.statusText,
        e.status) : t && null !== e.responseText && e.responseText.length > 0 ? n.localize("vs_base_errors", 5, e.responseText) :
      n.localize("vs_base_errors", 6);
  }

  function c(e, t) {
    return l(new C(e), t);
  }

  function d(e, t) {
    return t && e.message && (e.stack || e.stacktrace) ? n.localize("vs_base_errors", 7, e.message, e.stack || e.stacktrace) :
      e.message ? e.message : n.localize("vs_base_errors", 8);
  }

  function h(e, t) {
    if ("undefined" == typeof t && (t = !1), !e) {
      return n.localize("vs_base_errors", 9);
    }
    if (r.isString(e)) {
      return e;
    }
    if (e instanceof C) {
      return l(e, t);
    }
    if (!r.isUndefinedOrNull(e.status)) {
      return c(e, t);
    }
    if (e.detail) {
      var i = e.detail;
      if (i.error) {
        if (i.error && !r.isUndefinedOrNull(i.error.status)) {
          return c(i.error, t);
        }
        if (!r.isArray(i.error)) {
          return d(i.error, t);
        }
        for (var o = 0; o < i.error.length; o++)
          if (i.error[o] && !r.isUndefinedOrNull(i.error[o].status)) {
            return c(i.error[o], t);
          }
      }
      if (i.exception) {
        return r.isUndefinedOrNull(i.exception.status) ? d(i.exception, t) : c(i.exception, t);
      }
    }
    return e.stack ? d(e, t) : e.message ? e.message : n.localize("vs_base_errors", 10);
  }

  function p(e) {
    if (e)
      if (r.isArray(e)) {
        for (var t = 0; t < e.length; t++)
          if (e[t] && e[t].status) {
            return e[t].status;
          }
      } else if (e.status) {
      return e.status;
    }
    return -1;
  }

  function f(e) {
    return e instanceof Error && "Canceled" === e.name && "Canceled" === e.message;
  }

  function g() {
    return new Error("Canceled");
  }

  function m() {
    return new Error("not implemented");
  }

  function v(e) {
    return e ? new Error("illegeal argument: " + e) : new Error("illegeal argument");
  }

  function y(e) {
    return e ? new Error("illegeal state: " + e) : new Error("illegeal state");
  }

  function _() {
    return new Error(n.localize("vs_base_errors", 11));
  }
  var b = function() {
    function e() {
      this.listeners = [];

      this.unexpectedErrorHandler = function(e) {
        setTimeout(function() {
          if (o.isTesting() && e.stack) throw new Error(e.stack);
          throw e;
        }, 0);
      };
    }
    e.prototype.addListener = function(e) {
      var t = this;
      this.listeners.push(e);

      return function() {
        t._removeListener(e);
      };
    };

    e.prototype.emit = function(e, t, n) {
      if ("undefined" == typeof t) {
        t = null;
      }

      if ("undefined" == typeof n) {
        n = null;
      }

      this.listeners.forEach(function(i) {
        i(e, t, n);
      });
    };

    e.prototype._removeListener = function(e) {
      this.listeners.splice(this.listeners.indexOf(e), 1);
    };

    e.prototype.setUnexpectedErrorHandler = function(e) {
      this.unexpectedErrorHandler = e;
    };

    e.prototype.getUnexpectedErrorHandler = function() {
      return this.unexpectedErrorHandler;
    };

    e.prototype.onUnexpectedError = function(e, n) {
      if ("undefined" == typeof n) {
        n = null;
      }

      this.unexpectedErrorHandler(e, n);

      this.emit(e, n, t.toErrorMessage(e, !0));
    };

    return e;
  }();
  t.ErrorHandler = b;

  t.errorHandler = new b;

  t.setUnexpectedErrorHandler = s;

  t.onUnexpectedError = a;
  var C = function() {
    function e(e) {
      if (this.status = e.status, this.statusText = e.statusText, this.responseText = e.responseText, this.errorMessage =
        null, this.errorCode = null, this.errorObject = null, this.responseText) try {
        var n = JSON.parse(this.responseText);
        this.errorMessage = n.message;

        this.errorCode = n.code;

        this.errorObject = n;
      } catch (i) {}
      this.message = t.toErrorMessage(this, !1);
    }
    return e;
  }();
  t.ConnectionError = C;

  i.derive(Error, C);

  t.toErrorMessage = h;

  t.getHttpStatus = p;

  t.isPromiseCanceledError = f;

  t.canceled = g;

  t.notImplemented = m;

  t.illegalArgument = v;

  t.illegalState = y;

  t.loaderError = _;
});

require.config({
  shim: {
    "vs/base/lib/raw.winjs.base": {}
  }
});

define("vs/base/lib/winjs.base", ["./raw.winjs.base", "vs/base/errors"], function(e, t) {
  "use strict";

  function n(e) {
    var n = e.detail;

    var i = n.id;
    return n.parent ? (n.handler && o && delete o[i], void 0) : (o[i] = n, 1 === Object.keys(o).length && setTimeout(
      function() {
        var e = o;
        o = {};

        Object.keys(e).forEach(function(n) {
          var i = e[n];
          i.exception ? t.onUnexpectedError(i.exception) : i.error && t.onUnexpectedError(i.error);

          console.log("WARNING: Promise with no error callback:" + i.id);

          console.log(i);

          if (i.exception) {
            console.log(i.exception.stack);
          }
        });
      }, 0), void 0);
  }

  function i(e, t, n) {
    var i;

    var o;

    var r;

    var s = new WinJS.Promise(function(e, t, n) {
      i = e;

      o = t;

      r = n;
    }, function() {
      e.cancel();
    });
    e.then(function(e) {
      if (t) {
        t(e);
      }

      i(e);
    }, function(e) {
      if (n) {
        n(e);
      }

      o(e);
    }, r);

    return s;
  }
  var o = {};
  WinJS.Promise.addEventListener("error", n);

  return {
    decoratePromise: i,
    Class: WinJS.Class,
    xhr: WinJS.xhr,
    Promise: WinJS.Promise,
    TPromise: WinJS.Promise,
    Utilities: WinJS.Utilities
  };
});

define("vs/editor/worker/dispatcherService", ["require", "exports", "vs/base/lib/winjs.base", "vs/base/types",
  "vs/base/network"
], function(e, t, n, i, o) {
  var r = function() {
    function e() {
      this.table = {};
    }
    e.prototype.register = function(e) {
      if (i.isString(e)) {
        this.table[e] = arguments[1];
      } else
        for (var t in e) {
          var n = e[t];
          if (i.isFunction(n)) {
            this.table[t] = n.bind(e);
          }
        }
    };

    e.prototype.dispatch = function(e) {
      if (!this.table[e.type]) {
        return n.Promise.wrapError(new Error("no handler/route for: " + e.type));
      }
      try {
        var t = this.deserialize(e.payload);

        var i = this.table[e.type].apply(this.table[e.type], t);
        return n.Promise.is(i) ? i : n.Promise.as(i);
      } catch (o) {
        return n.Promise.wrapError(o);
      }
    };

    e.prototype.deserialize = function(e) {
      for (var t = [], n = 0; n < e.length; n++) {
        var r = e[n];
        if (!i.isUndefinedOrNull(r) && i.isString(r.$url)) {
          r = new o.URL(r.$url);
        }

        t.push(r);
      }
      return t;
    };

    return e;
  }();
  t.DispatcherService = r;
});

var __extends = this.__extends || function(e, t) {
    function n() {
      this.constructor = e;
    }
    for (var i in t) {
      if (t.hasOwnProperty(i)) {
        e[i] = t[i];
      }
    }
    n.prototype = t.prototype;

    e.prototype = new n;
  };

define("vs/base/async", ["require", "exports", "vs/base/errors", "vs/base/lib/winjs.base"], function(e, t, n, i) {
  function o(e, t) {
    return new i.Promise(function(i, o, r) {
      e.done(function(e) {
        try {
          t(e);
        } catch (o) {
          n.onUnexpectedError(o);
        }
        i(e);
      }, function(e) {
        try {
          t(e);
        } catch (i) {
          n.onUnexpectedError(i);
        }
        o(e);
      }, function(e) {
        r(e);
      });
    }, function() {
      e.cancel();
    });
  }

  function r(e) {
    function t() {
      return e.length ? e.pop()() : null;
    }

    function n(e) {
      if (e) {
        o.push(e);
      }
      var r = t();
      return r ? r.then(n) : i.Promise.as(o);
    }
    var o = [];
    e = e.reverse();

    return i.Promise.as(null).then(n);
  }

  function s(e) {
    var t;

    var n = this;

    var i = !1;
    return function() {
      return i ? t : (i = !0, t = e.apply(n, arguments));
    };
  }
  var a = function() {
    function e() {
      this.activePromise = null;

      this.queuedPromise = null;

      this.queuedPromiseFactory = null;
    }
    e.prototype.queue = function(e) {
      var t = this;
      if (this.activePromise) {
        if (this.queuedPromiseFactory = e, !this.queuedPromise) {
          var n = function() {
            t.queuedPromise = null;
            var e = t.queue(t.queuedPromiseFactory);
            t.queuedPromiseFactory = null;

            return e;
          };
          this.queuedPromise = this.activePromise.then(n, n);
        }
        return new i.Promise(function(e, n) {
          t.queuedPromise.then(e, n);
        }, function() {});
      }
      this.activePromise = e();

      return this.activePromise.then(function(e) {
        t.activePromise = null;

        return e;
      }, function(e) {
        t.activePromise = null;

        return i.Promise.wrapError(e);
      });
    };

    return e;
  }();
  t.Throttler = a;
  var u = function() {
    function e(e) {
      this.defaultDelay = e;

      this.timeoutPromise = null;

      this.completionPromise = null;

      this.onSuccess = null;

      this.task = null;
    }
    e.prototype.trigger = function(e, t) {
      if ("undefined" == typeof t) {
        t = this.defaultDelay;
      }
      var n = this;
      this.task = e;

      this.cancelTimeout();

      this.completionPromise || (this.completionPromise = (new i.Promise(function(e) {
        n.onSuccess = e;
      }, function() {})).then(function() {
        n.completionPromise = null;

        n.onSuccess = null;
        var e = n.task();
        n.task = null;

        return e;
      }));

      this.timeoutPromise = i.Promise.timeout(t);

      this.timeoutPromise.then(function() {
        n.timeoutPromise = null;

        n.onSuccess(null);
      });

      return this.completionPromise;
    };

    e.prototype.isTriggered = function() {
      return !!this.timeoutPromise;
    };

    e.prototype.cancel = function() {
      this.cancelTimeout();

      if (this.completionPromise) {
        this.completionPromise.cancel();
        this.completionPromise = null;
      }
    };

    e.prototype.cancelTimeout = function() {
      if (this.timeoutPromise) {
        this.timeoutPromise.cancel();
        this.timeoutPromise = null;
      }
    };

    return e;
  }();
  t.Delayer = u;
  var l = function(e) {
    function t(t) {
      e.call(this, t);

      this.throttler = new a;
    }
    __extends(t, e);

    t.prototype.trigger = function(t, n) {
      var i = this;
      return e.prototype.trigger.call(this, function() {
        return i.throttler.queue(t);
      }, n);
    };

    return t;
  }(u);
  t.ThrottledDelayer = l;

  t.always = o;

  t.sequence = r;

  t.once = s;
});

define("vs/base/eventEmitter", ["require", "exports", "vs/base/errors"], function(e, t, n) {
  var i = function() {
    function e(e, t, n) {
      if ("undefined" == typeof n) {
        n = null;
      }

      this._type = e;

      this._data = t;

      this._emitterType = n;
    }
    e.prototype.getType = function() {
      return this._type;
    };

    e.prototype.getData = function() {
      return this._data;
    };

    e.prototype.getEmitterType = function() {
      return this._emitterType;
    };

    return e;
  }();
  t.EmitterEvent = i;
  var o = function() {
    function e(e) {
      if ("undefined" == typeof e && (e = null), this._listeners = {}, this._bulkListeners = [], this._collectedEvents = [],
        this._deferredCnt = 0, e) {
        this._allowedEventTypes = {};
        for (var t = 0; t < e.length; t++) {
          this._allowedEventTypes[e[t]] = !0;
        }
      } else {
        this._allowedEventTypes = null;
      }
    }
    e.prototype.dispose = function() {
      this._listeners = {};

      this._bulkListeners = [];

      this._collectedEvents = [];

      this._deferredCnt = 0;

      this._allowedEventTypes = null;
    };

    e.prototype.addListener = function(e, t) {
      if ("*" === e) throw new Error("Use addBulkListener(listener) to register your listener!");
      if (this._allowedEventTypes && !this._allowedEventTypes.hasOwnProperty(e)) throw new Error(
        "This object will never emit this event type!");
      this._listeners.hasOwnProperty(e) ? this._listeners[e].push(t) : this._listeners[e] = [t];
      var n = this;
      return function() {
        if (n) {
          n._removeListener(e, t);
          n = null;
          t = null;
        }
      };
    };

    e.prototype.addListener2 = function(e, t) {
      var n = this.addListener(e, t);
      return {
        dispose: n
      };
    };

    e.prototype.on = function(e, t) {
      return this.addListener(e, t);
    };

    e.prototype.addOneTimeListener = function(e, t) {
      var n = this.addListener(e, function(e) {
        n();

        t(e);
      });
      return n;
    };

    e.prototype.addOneTimeDisposableListener = function(e, t) {
      var n = this.addOneTimeListener(e, t);
      return {
        dispose: n
      };
    };

    e.prototype.addBulkListener = function(e) {
      var t = this;
      this._bulkListeners.push(e);

      return function() {
        t._removeBulkListener(e);
      };
    };

    e.prototype.addBulkListener2 = function(e) {
      var t = this.addBulkListener(e);
      return {
        dispose: t
      };
    };

    e.prototype.addEmitter = function(e, t) {
      if ("undefined" == typeof t) {
        t = null;
      }
      var n = this;
      return e.addBulkListener(function(e) {
        var o = e;
        if (t) {
          o = [];
          for (var r = 0, s = e.length; s > r; r++) {
            o.push(new i(e[r].getType(), e[r].getData(), t));
          }
        }
        0 === n._deferredCnt ? n._emitEvents(o) : n._collectedEvents.push.apply(n._collectedEvents, o);
      });
    };

    e.prototype.addEmitter2 = function(e, t) {
      var n = this.addEmitter(e, t);
      return {
        dispose: n
      };
    };

    e.prototype.addEmitterTypeListener = function(e, t, n) {
      if (t) {
        if ("*" === e) throw new Error("Bulk listeners cannot specify an emitter type");
        return this.addListener(e + "/" + t, n);
      }
      return this.addListener(e, n);
    };

    e.prototype._removeListener = function(e, t) {
      if (this._listeners.hasOwnProperty(e))
        for (var n = this._listeners[e], i = 0, o = n.length; o > i; i++)
          if (n[i] === t) {
            n.splice(i, 1);
            break;
          }
    };

    e.prototype._removeBulkListener = function(e) {
      for (var t = 0, n = this._bulkListeners.length; n > t; t++)
        if (this._bulkListeners[t] === e) {
          this._bulkListeners.splice(t, 1);
          break;
        }
    };

    e.prototype._emitToSpecificTypeListeners = function(e, t) {
      if (this._listeners.hasOwnProperty(e))
        for (var i = this._listeners[e].slice(0), o = 0, r = i.length; r > o; o++) try {
          i[o](t);
        } catch (s) {
          n.onUnexpectedError(s);
        }
    };

    e.prototype._emitToBulkListeners = function(e) {
      for (var t = this._bulkListeners.slice(0), i = 0, o = t.length; o > i; i++) try {
        t[i](e);
      } catch (r) {
        n.onUnexpectedError(r);
      }
    };

    e.prototype._emitEvents = function(e) {
      if (this._bulkListeners.length > 0) {
        this._emitToBulkListeners(e);
      }
      for (var t = 0, n = e.length; n > t; t++) {
        var i = e[t];
        this._emitToSpecificTypeListeners(i.getType(), i.getData());

        if (i.getEmitterType()) {
          this._emitToSpecificTypeListeners(i.getType() + "/" + i.getEmitterType(), i.getData());
        }
      }
    };

    e.prototype.emit = function(e, t) {
      if ("undefined" == typeof t && (t = {}), this._allowedEventTypes && !this._allowedEventTypes.hasOwnProperty(e))
        throw new Error("Cannot emit this event type because it wasn't white-listed!");
      if (this._listeners.hasOwnProperty(e) || 0 !== this._bulkListeners.length) {
        var n = new i(e, t);
        0 === this._deferredCnt ? this._emitEvents([n]) : this._collectedEvents.push(n);
      }
    };

    e.prototype.deferredEmit = function(e) {
      this._deferredCnt = this._deferredCnt + 1;
      var t = e();
      this._deferredCnt = this._deferredCnt - 1;

      0 === this._deferredCnt && this._emitCollected();

      return t;
    };

    e.prototype._emitCollected = function() {
      var e = this._collectedEvents;
      this._collectedEvents = [];

      if (e.length > 0) {
        this._emitEvents(e);
      }
    };

    return e;
  }();
  t.EventEmitter = o;
});

var __extends = this.__extends || function(e, t) {
    function n() {
      this.constructor = e;
    }
    for (var i in t) {
      if (t.hasOwnProperty(i)) {
        e[i] = t[i];
      }
    }
    n.prototype = t.prototype;

    e.prototype = new n;
  };

define("vs/editor/core/model/textModel", ["require", "exports", "vs/base/eventEmitter", "vs/editor/editor",
  "vs/editor/core/model/modelLine", "vs/base/strings", "vs/editor/core/position", "vs/editor/core/range",
  "vs/editor/core/constants"
], function(e, t, n, i, o, r, s, a, u) {
  var l = 65279;

  var c = ("\r".charCodeAt(0), "\n".charCodeAt(0), " ".charCodeAt(0));

  var d = "	".charCodeAt(0);

  var h = function(e) {
    function t(t, n) {
      t.push(u.EventType.ModelContentChanged);

      e.call(this, t);

      this._constructLines(n);

      this._versionId = 1;
    }
    __extends(t, e);

    t.prototype.getVersionId = function() {
      return this._versionId;
    };

    t.prototype._increaseVersionId = function() {
      this._versionId++;
    };

    t.prototype._setVersionId = function(e) {
      this._versionId = e;
    };

    t.prototype.dispose = function() {
      this._lines = null;

      this._EOL = null;

      this._BOM = null;

      e.prototype.dispose.call(this);
    };

    t.prototype._reset = function(e) {
      null !== e && (this._constructLines(e), this._versionId++);

      return {
        changeType: u.EventType.ModelContentChangedFlush,
        detail: this.getValue(1),
        modeChanged: !1,
        versionId: this._versionId,
        isUndoing: !1,
        isRedoing: !1
      };
    };

    t.prototype.setValue = function(e) {
      var t = this._reset(e);
      this._emitModelContentChangedFlushEvent(t);
    };

    t.prototype.getValue = function(e, t) {
      if ("undefined" == typeof t) {
        t = !1;
      }
      var n = this.getFullModelRange();

      var i = this.getValueInRange(n, e);
      return t ? this._BOM + i : i;
    };

    t.prototype.getValueInRange = function(e, t) {
      if ("undefined" == typeof t) {
        t = 0;
      }
      var n = this.validateRange(e);
      if (n.isEmpty()) {
        return "";
      }
      if (n.startLineNumber === n.endLineNumber) {
        return this._lines[n.startLineNumber - 1].text.substring(n.startColumn - 1, n.endColumn - 1);
      }
      var i = this._getEndOfLine(t);

      var o = n.startLineNumber - 1;

      var r = n.endLineNumber - 1;

      var s = [];
      s.push(this._lines[o].text.substring(n.startColumn - 1));
      for (var a = o + 1; r > a; a++) {
        s.push(this._lines[a].text);
      }
      s.push(this._lines[r].text.substring(0, n.endColumn - 1));

      return s.join(i);
    };

    t.prototype.isDominatedByLongLines = function(e) {
      var t;

      var n;

      var i;

      var o = 0;

      var r = 0;

      var s = this._lines;
      for (t = 0, n = this._lines.length; n > t; t++) {
        i = s[t].text.length;
        i >= e ? r += i : o += i;
      }
      return r > o;
    };

    t.prototype._extractIndentationFactors = function() {
      var e;

      var t;

      var n;

      var i;

      var o;

      var r;

      var s;

      var a;

      var u;

      var l;

      var h;

      var p = this._lines;

      var f = 0;

      var g = "";

      var m = 0;

      var v = [];

      var y = 0;

      var _ = [];
      for (e = 0, t = p.length; t > e; e++) {
        for (s = p[e].text, a = !1, u = 0, h = 0, l = 0, n = 0, i = s.length; i > n; n++)
          if (o = s.charCodeAt(n), o === d) {
            l++;
          } else {
            if (o !== c) {
              a = !0;

              u = n;
              break;
            }
            h++;
          }
        if (1 === h && (h = 0), (l > 0 || h > 0) && (f++, l > 0 && y++, h > 0 && (_[h] = (_[h] || 0) + 1)), a) {
          h = 0;
          var b = !0;
          for (n = 0; m > n && u > n; n++) {
            r = g.charCodeAt(n);
            o = s.charCodeAt(n);
            if (b && r !== o) {
              b = !1;
            }
            if (!b) {
              if (r === c) {
                h++;
              }
              if (o === c) {
                h++;
              }
            }
          }
          for (; m > n; n++) {
            r = g.charCodeAt(n);
            if (r === c) {
              h++;
            }
          }
          for (; u > n; n++) {
            o = s.charCodeAt(n);
            if (o === c) {
              h++;
            }
          }
          if (1 === h) {
            h = 0;
          }

          if (h > 0) {
            v[h] = (v[h] || 0) + 1;
          }

          m = u;

          g = s;
        }
      }
      return {
        linesWithIndentationCount: f,
        linesIndentedWithTabs: y,
        relativeSpaceCounts: v,
        absoluteSpaceCounts: _
      };
    };

    t.prototype.guessIndentation = function(e) {
      var t;

      var n;

      var i = this._extractIndentationFactors();

      var o = i.linesWithIndentationCount;

      var r = i.linesIndentedWithTabs;

      var s = i.absoluteSpaceCounts;

      var a = i.relativeSpaceCounts;

      var u = 0;
      for (t = 1, n = s.length; n > t; t++) {
        u += s[t] || 0;
      }
      if (r >= u) {
        return {
          insertSpaces: !1,
          tabSize: e
        };
      }
      if (6 > o && r > 0) {
        return {
          insertSpaces: !1,
          tabSize: e
        };
      }
      var l;

      var c;

      var d;

      var h;

      var p = [];
      for (l = 2, n = s.length; n > l; l++)
        if (s[l]) {
          for (c = 0, d = 0, h = l; n > h; h += l) {
            s[h] ? c += s[h] : d += l / h;
          }
          p[l] = c / (1 + d);
        }
      var f = 1;

      var g = 0;
      for (l = Math.max(a.length, p.length); l >= 2; l--) {
        c = (p[l] || 0) + (a[l] || 0);
        if (c > g) {
          f = l;
          g = c;
        }
      }
      return {
        insertSpaces: !0,
        tabSize: f
      };
    };

    t.prototype.getLineCount = function() {
      return this._lines.length;
    };

    t.prototype.getLineContent = function(e) {
      return this._lines[e - 1].text;
    };

    t.prototype.getEOL = function() {
      return this._EOL;
    };

    t.prototype.getLineMaxColumn = function(e) {
      return this._lines[e - 1].text.length + 1;
    };

    t.prototype.getLineFirstNonWhitespaceColumn = function(e) {
      var t = r.firstNonWhitespaceIndex(this._lines[e - 1].text);
      return -1 === t ? 0 : t + 1;
    };

    t.prototype.getLineLastNonWhitespaceColumn = function(e) {
      var t = r.lastNonWhitespaceIndex(this._lines[e - 1].text);
      return -1 === t ? 0 : t + 2;
    };

    t.prototype.validateLineNumber = function(e) {
      1 > e && (e = 1);

      e > this._lines.length && (e = this._lines.length);

      return e;
    };

    t.prototype.validatePosition = function(e) {
      var t = e.lineNumber ? e.lineNumber : 1;

      var n = e.column ? e.column : 1;
      if (1 > t) {
        t = 1;
      }

      if (t > this._lines.length) {
        t = this._lines.length;
      }

      if (1 > n) {
        n = 1;
      }
      var i = this.getLineMaxColumn(t);
      n > i && (n = i);

      return new s.Position(t, n);
    };

    t.prototype.validateRange = function(e) {
      var t = this.validatePosition(new s.Position(e.startLineNumber, e.startColumn));

      var n = this.validatePosition(new s.Position(e.endLineNumber, e.endColumn));
      return new a.Range(t.lineNumber, t.column, n.lineNumber, n.column);
    };

    t.prototype.getFullModelRange = function() {
      var e = this.getLineCount();
      return new a.Range(1, 1, e, this.getLineMaxColumn(e));
    };

    t.prototype._emitModelContentChangedFlushEvent = function(e) {
      this.emit(u.EventType.ModelContentChanged, e);
    };

    t._splitText = function(e) {
      for (var t = 0, n = -1; - 1 !== (n = e.indexOf("\r\n", n + 1));) {
        t++;
      }
      var i = e.split(/\r?\n/);

      var r = "";
      if (i[0].length > 0 && i[0].charCodeAt(0) === l) {
        r = String.fromCharCode(l);
        i[0] = i[0].substr(1);
      }
      var s;

      var a;

      var u = [];
      for (s = 0, a = i.length; a > s; s++) {
        u.push(new o.ModelLine(s + 1, i[s]));
      }
      var c = u.length - 1;

      var d = "";
      d = 0 === c || t > c / 2 ? "\r\n" : "\n";

      return {
        BOM: r,
        EOL: d,
        lines: u
      };
    };

    t.prototype._constructLines = function(e) {
      var n = t._splitText(e);
      this._BOM = n.BOM;

      this._EOL = n.EOL;

      this._lines = n.lines;
    };

    t.prototype._getEndOfLine = function(e) {
      switch (e) {
        case 1:
          return "\n";
        case 2:
          return "\r\n";
        case 0:
          return this.getEOL();
      }
      throw new Error("Unknown EOL preference");
    };

    return t;
  }(n.EventEmitter);
  t.TextModel = h;
});

var __extends = this.__extends || function(e, t) {
    function n() {
      this.constructor = e;
    }
    for (var i in t) {
      if (t.hasOwnProperty(i)) {
        e[i] = t[i];
      }
    }
    n.prototype = t.prototype;

    e.prototype = new n;
  };

define("vs/editor/core/model/mirrorModel", ["require", "exports", "vs/editor/core/constants",
  "vs/editor/core/view/model/prefixSumComputer", "vs/editor/core/model/textModel", "vs/editor/core/model/modelLine"
], function(e, t, n, i, o, r) {
  var s = function(e) {
    function t(t, n, i, o, r) {
      e.call(this, t, i);

      this.wordsRegexp = null;

      if (!r) {
        r = {};
      }

      this._setVersionId(n);

      this._associatedResource = o;

      this._extraProperties = r;
    }
    __extends(t, e);

    t.prototype._constructLines = function(t) {
      e.prototype._constructLines.call(this, t);

      this._EOL = "\n";
    };

    t.prototype.destroy = function() {
      this.dispose();
    };

    t.prototype.dispose = function() {
      e.prototype.dispose.call(this);
    };

    t.prototype.getAssociatedResource = function() {
      return this._associatedResource;
    };

    t.prototype.getProperty = function(e) {
      return this._extraProperties.hasOwnProperty(e) ? this._extraProperties[e] : null;
    };

    t.prototype._ensurePrefixSum = function() {
      if (!this._lineStarts) {
        for (var e = [], t = this.getEOL().length, n = 0, o = this._lines.length; o > n; n++) {
          e.push(this._lines[n].text.length + t);
        }
        this._lineStarts = new i.PrefixSumComputer(e);
      }
    };

    t.prototype.getRangeFromOffsetAndLength = function(e, t) {
      var n = this.getPositionFromOffset(e);

      var i = this.getPositionFromOffset(e + t);
      return {
        startLineNumber: n.lineNumber,
        startColumn: n.column,
        endLineNumber: i.lineNumber,
        endColumn: i.column
      };
    };

    t.prototype.getOffsetAndLengthFromRange = function(e) {
      var t = this.getOffsetFromPosition({
        lineNumber: e.startLineNumber,
        column: e.startColumn
      });

      var n = this.getOffsetFromPosition({
        lineNumber: e.endLineNumber,
        column: e.endColumn
      });
      return {
        offset: t,
        length: n - t
      };
    };

    t.prototype.getPositionFromOffset = function(e) {
      this._ensurePrefixSum();
      var t = {
        index: 0,
        remainder: 0
      };
      this._lineStarts.getIndexOf(e, t);

      return {
        lineNumber: t.index + 1,
        column: this.getEOL().length + t.remainder
      };
    };

    t.prototype.getOffsetFromPosition = function(e) {
      return this.getLineStart(e.lineNumber) + e.column - 1;
    };

    t.prototype.getLineStart = function(e) {
      this._ensurePrefixSum();
      var t = Math.min(e, this._lines.length) - 1;
      return this._lineStarts.getAccumulatedValue(t - 1);
    };

    t.prototype.getRawLines = function() {
      return this._lines.map(function(e) {
        return e.text;
      });
    };

    t.prototype.getAllWordsWithRange = function() {
      var e;

      var t = [];
      for (e = 0; e < this._lines.length; e++) {
        var n = this._lines[e];
        this.wordenize(n.text).forEach(function(i) {
          var o = n.text.substring(i.start, i.end);

          var r = {
            startLineNumber: e + 1,
            startColumn: i.start + 1,
            endLineNumber: e + 1,
            endColumn: i.end + 1
          };
          t.push({
            text: o,
            range: r
          });
        });
      }
      return t;
    };

    t.prototype.getAllWords = function() {
      var e = this;

      var t = [];
      this._lines.forEach(function(n) {
        e.wordenize(n.text).forEach(function(e) {
          t.push(n.text.substring(e.start, e.end));
        });
      });

      return t;
    };

    t.prototype.getAllUniqueWords = function(e) {
      var t = !1;

      var n = {};
      return this.getAllWords().filter(function(i) {
        return e && !t && e === i ? (t = !0, !1) : n[i] ? !1 : (n[i] = !0, !0);
      });
    };

    t.prototype.getWordAtPosition = function(e) {
      var t = Math.min(e.lineNumber, this._lines.length) - 1;

      var n = this._lines[t];
      return this.getWord(n.text, e.column - 1, function(e, t, n) {
        return e.substring(t, n);
      });
    };

    t.prototype.getWordUntilPosition = function(e) {
      var t = Math.min(e.lineNumber, this._lines.length) - 1;

      var n = this._lines[t];
      return this.getWord(n.text, e.column - 1, function(t, n) {
        return -1 === n ? "" : t.substring(n, e.column - 1);
      });
    };

    t.prototype.wordenize = function(e) {
      var t;

      var n = [];
      if (null === this.wordsRegexp) {
        var i = this.getProperty("$WordDefinitionForMirrorModel");
        this.wordsRegexp = i ? new RegExp(i.source, i.flags) : /(-?\d*\.\d\w*)|(\w+)/g;
      }
      for (; t = this.wordsRegexp.exec(e);) {
        n.push({
          start: t.index,
          end: t.index + t[0].length
        });
      }
      return n;
    };

    t.prototype.getWord = function(e, t, n) {
      for (var i = this.wordenize(e), o = 0; o < i.length && t >= i[o].start; o++)
        if (t <= i[o].end) {
          return n(e, i[o].start, i[o].end);
        }
      return n(e, -1, -1);
    };

    return t;
  }(o.TextModel);
  t.AbstractMirrorModel = s;
  var a = function(e) {
    function t(t, i, o, r) {
      e.call(this, [n.EventType.OnBeforeModelContentChangedFlush, n.EventType.OnBeforeModelContentChangedLinesDeleted,
        n.EventType.OnBeforeModelContentChangedLinesInserted, n.EventType.OnBeforeModelContentChangedLineChanged,
        "changed"
      ], t, i, o, r);
    }
    __extends(t, e);

    t.prototype.onEvents = function(e) {
      for (var t = !1, i = 0, o = e.length; o > i; i++) {
        var r = e[i];
        switch (r.type) {
          case n.EventType.ModelContentChanged:
            var s = r;
            switch (this._lineStarts = null, this._setVersionId(s.versionId), s.changeType) {
              case n.EventType.ModelContentChangedFlush:
                this.emit(n.EventType.OnBeforeModelContentChangedFlush, r);

                this._onLinesFlushed(s);

                t = !0;
                break;
              case n.EventType.ModelContentChangedLinesDeleted:
                this.emit(n.EventType.OnBeforeModelContentChangedLinesDeleted, r);

                this._onLinesDeleted(s);

                t = !0;
                break;
              case n.EventType.ModelContentChangedLinesInserted:
                this.emit(n.EventType.OnBeforeModelContentChangedLinesInserted, r);

                this._onLinesInserted(s);

                t = !0;
                break;
              case n.EventType.ModelContentChangedLineChanged:
                this.emit(n.EventType.OnBeforeModelContentChangedLineChanged, r);

                this._onLineChanged(s);

                t = !0;
            }
            break;
          case n.EventType.ModelPropertiesChanged:
            this._extraProperties = r.properties;
            break;
          default:
            console.warn("Unknown model event: " + r.type);
        }
      }
      if (t) {
        this.emit("changed", {});
      }
    };

    t.prototype._onLinesFlushed = function(e) {
      this._lineStarts = null;

      this._constructLines(e.detail);
    };

    t.prototype._onLineChanged = function(e) {
      if (this._lineStarts) {
        var t = this.getEOL().length;

        var n = e.detail.length + t;
        this._lineStarts.changeValue(e.lineNumber - 1, n);
      }
      this._lines[e.lineNumber - 1].text = e.detail;
    };

    t.prototype._onLinesDeleted = function(e) {
      var t = e.fromLineNumber - 1;

      var n = e.toLineNumber - 1;
      if (this._lineStarts) {
        this._lineStarts.removeValues(t, n - t + 1);
      }

      this._lines.splice(t, n - t + 1);
    };

    t.prototype._onLinesInserted = function(e) {
      var t;

      var n;

      var i = this.getEOL().length;

      var o = e.detail.split("\n");
      for (t = e.fromLineNumber - 1, n = 0; t < e.toLineNumber; t++, n++) {
        if (this._lineStarts) {
          this._lineStarts.insertValue(t, o[n].length + i);
        }
        this._lines.splice(t, 0, new r.ModelLine(0, o[n]));
      }
    };

    return t;
  }(s);
  t.MirrorModel = a;
});

var __extends = this.__extends || function(e, t) {
    function n() {
      this.constructor = e;
    }
    for (var i in t) {
      if (t.hasOwnProperty(i)) {
        e[i] = t[i];
      }
    }
    n.prototype = t.prototype;

    e.prototype = new n;
  };

define("vs/base/collections", ["require", "exports", "vs/base/errors"], function(e, t, n) {
  function i(e, t, n) {
    if ("undefined" == typeof n) {
      n = null;
    }
    var i = String(t);
    return e.hasOwnProperty(i) ? e[i] : n;
  }

  function o(e, t, n) {
    var i = String(t);
    return e.hasOwnProperty(i) ? e[i] : (e[i] = n, n);
  }

  function r(e, t) {
    return e.hasOwnProperty(t);
  }

  function s(e) {
    return Object.keys(e);
  }

  function a(e) {
    var t = [];
    for (var n in e) {
      if (e.hasOwnProperty(n)) {
        t.push(e[n]);
      }
    }
    return t;
  }

  function u(e, t) {
    for (var n in e)
      if (e.hasOwnProperty(n)) {
        var i = t({
          key: n,
          value: e[n]
        }, function() {
          delete e[n];
        });
        if (i === !1) return;
      }
  }

  function l(e, t) {
    var n = new _(Math.min(4, Math.ceil(e.length / 4)));
    e.forEach(function(e) {
      var i = t(e);

      var o = n.lookup(i);
      if (!o) {
        o = [];
        n.add(i, o);
      }

      o.push(e);
    });

    return n;
  }

  function c(e) {
    return new f(e);
  }

  function d(e) {
    var n = e.length;
    return 0 === n ? t.EmptyIterable : 1 === n ? e[0] : {
      forEach: function(t) {
        for (var i = 0; n > i; i++) {
          e[i].forEach(t);
        }
      }
    };
  }

  function h(e) {
    return {
      forEach: function(t) {
        t(e);
      }
    };
  }
  t.lookup = i;

  t.lookupOrInsert = o;

  t.contains = r;

  t.keys = s;

  t.values = a;

  t.forEach = u;

  t.groupBy = l;

  t.fromArray = c;

  t.EmptyIterable = {
    forEach: function() {}
  };

  t.combine = d;

  t.singleton = h;
  var p = function() {
    function e() {}
    e.prototype.toArray = function(e, t) {
      "undefined" == typeof e && (e = new Array);

      "undefined" == typeof t && (t = 0);

      this.forEach(function(n) {
        e[t] = n;

        t += 1;
      });

      return e;
    };

    Object.defineProperty(e.prototype, "length", {
      get: function() {
        var e = 0;
        this.forEach(function() {
          e += 1;
        });

        return e;
      },
      enumerable: !0,
      configurable: !0
    });

    e.prototype.forEach = function() {
      throw n.notImplemented();
    };

    return e;
  }();
  t.AbstractCollection = p;
  var f = function(e) {
    function t(t) {
      e.call(this);

      this.data = t;
    }
    __extends(t, e);

    t.prototype.forEach = function(e) {
      for (var t = 0; t < this.data.length; t++) {
        var n = this.data[t];
        if (e(n) === !1) return;
      }
    };

    return t;
  }(p);
  t.ArrayCollection = f;
  var g = function(e) {
    function t() {
      e.apply(this, arguments);

      this._dict = new _;
    }
    __extends(t, e);

    t.prototype.forEach = function(e) {
      this._dict.forEach(function(t) {
        e(t.key);
      });
    };

    Object.defineProperty(t.prototype, "length", {
      get: function() {
        return this._dict.length;
      },
      enumerable: !0,
      configurable: !0
    });

    t.prototype.clear = function() {
      this._dict.clear();
    };

    t.prototype.add = function(e) {
      this._dict.add(e, !0);
    };

    t.prototype.remove = function(e) {
      var t = this.length;
      this._dict.remove(e);

      return t !== this.length;
    };

    t.prototype.contains = function(e) {
      return this._dict.containsKey(e);
    };

    return t;
  }(p);
  t.HashSet = g;
  var m = function(e) {
    function t(t) {
      e.call(this);

      this._dict = new v(t);
    }
    __extends(t, e);

    t.prototype.forEach = function(e) {
      this._dict.forEach(function(t) {
        e(t.key);
      });
    };

    Object.defineProperty(t.prototype, "length", {
      get: function() {
        return this._dict.length;
      },
      enumerable: !0,
      configurable: !0
    });

    t.prototype.clear = function() {
      this._dict.clear();
    };

    t.prototype.add = function(e) {
      this._dict.add(e, !0);
    };

    t.prototype.remove = function(e) {
      var t = this.length;
      this._dict.remove(e);

      return t !== this.length;
    };

    t.prototype.contains = function(e) {
      return this._dict.containsKey(e);
    };

    return t;
  }(p);
  t.DelegateHashSet = m;
  var v = function(e) {
    function t(t) {
      e.call(this);

      this.hashFn = t;

      this._data = {};

      this._count = 0;
    }
    __extends(t, e);

    t.prototype.forEach = function(e) {
      for (var t in this._data)
        if (this._data.hasOwnProperty(t)) {
          var n = this._data[t];
          if (e(n) === !1) return;
        }
    };

    Object.defineProperty(t.prototype, "length", {
      get: function() {
        return this._count;
      },
      enumerable: !0,
      configurable: !0
    });

    Object.defineProperty(t.prototype, "keys", {
      get: function() {
        var e = new Array;
        this.forEach(function(t) {
          e.push(t.key);
        });

        return new f(e);
      },
      enumerable: !0,
      configurable: !0
    });

    Object.defineProperty(t.prototype, "values", {
      get: function() {
        var e = new Array;
        this.forEach(function(t) {
          e.push(t.value);
        });

        return new f(e);
      },
      enumerable: !0,
      configurable: !0
    });

    t.prototype.clear = function() {
      this._data = {};

      this._count = 0;
    };

    t.prototype.add = function(e, t) {
      var n = this.hashFn(e);
      if (!this._data.hasOwnProperty(n)) {
        this._count += 1;
      }

      this._data[n] = {
        key: e,
        value: t
      };
    };

    t.prototype.lookup = function(e) {
      var t = this.hashFn(e);
      return this._data.hasOwnProperty(t) ? this._data[t].value : null;
    };

    t.prototype.remove = function(e) {
      var t = this.hashFn(e);
      if (this._data.hasOwnProperty(t)) {
        this._count -= 1;
        delete this._data[t];
      }
    };

    t.prototype.containsKey = function(e) {
      return this._data.hasOwnProperty(this.hashFn(e));
    };

    return t;
  }(p);
  t.DelegateDictionary = v;
  var y = function(e) {
    function t() {
      e.call(this, function(e) {
        return String(e);
      });
    }
    __extends(t, e);

    return t;
  }(v);
  t.StringDictionary = y;
  var _ = function(e) {
    function t(t) {
      if ("undefined" == typeof t) {
        t = 10;
      }

      e.call(this);

      this.size = t;

      this._elements = new Array(this.size);

      this._count = 0;
    }
    __extends(t, e);

    t.wrap = function(e) {
      return null === e ? t.NULL_PLACEHOLDER : "undefined" == typeof e ? t.UNDEFINED_PLACEHOLDER : e;
    };

    t.unwrap = function(e) {
      return e === t.NULL_PLACEHOLDER ? null : e === t.UNDEFINED_PLACEHOLDER ? void 0 : e;
    };

    t.prototype.forEach = function(e) {
      for (var n = 0; n < this._elements.length; n++) {
        var i = this._elements[n];
        if ("undefined" != typeof i)
          for (var o = 0; o < i.length; o++) {
            var r = {
              key: t.unwrap(i[o].key),
              value: i[o].value
            };
            if (e(r) === !1) return;
          }
      }
    };

    Object.defineProperty(t.prototype, "length", {
      get: function() {
        return this._count;
      },
      enumerable: !0,
      configurable: !0
    });

    Object.defineProperty(t.prototype, "keys", {
      get: function() {
        var e = new Array;
        this.forEach(function(n) {
          e.push(t.unwrap(n.key));
        });

        return new f(e);
      },
      enumerable: !0,
      configurable: !0
    });

    Object.defineProperty(t.prototype, "values", {
      get: function() {
        var e = new Array;
        this.forEach(function(t) {
          e.push(t.value);
        });

        return new f(e);
      },
      enumerable: !0,
      configurable: !0
    });

    t.prototype.clear = function() {
      this._elements.length = 0;

      this._elements.length = this.size;

      this._count = 0;
    };

    t.prototype.add = function(e, n) {
      e = t.wrap(e);
      var i = this.indexOf(e);

      var o = this._elements[i];
      if ("undefined" == typeof o) {
        this._elements[i] = [{
          key: e,
          value: n
        }];
        this._count += 1;
      } else {
        for (var r = 0; r < o.length; r++)
          if (e.equals(o[r].key)) {
            o[r].key = e;
            o[r].value = n;
            return void 0;
          }
        o.push({
          key: e,
          value: n
        });

        this._count += 1;
      }
    };

    t.prototype.lookup = function(e) {
      e = t.wrap(e);
      var n = this.indexOf(e);

      var i = this._elements[n];
      if ("undefined" != typeof i)
        for (var o = 0; o < i.length; o++)
          if (e.equals(i[o].key)) {
            return i[o].value;
          }
      return null;
    };

    t.prototype.remove = function(e) {
      e = t.wrap(e);
      var n = this.indexOf(e);

      var i = this._elements[n];
      if ("undefined" != typeof i)
        for (var o = 0; o < i.length; o++)
          if (e.equals(i[o].key)) {
            i.splice(o, 1);
            this._count -= 1;
            return !0;
          }
      return !1;
    };

    t.prototype.containsKey = function(e) {
      e = t.wrap(e);
      var n = this.indexOf(e);

      var i = this._elements[n];
      if ("undefined" != typeof i)
        for (var o = 0; o < i.length; o++)
          if (e.equals(i[o].key)) {
            return !0;
          }
      return !1;
    };

    t.prototype.indexOf = function(e) {
      return e.hashCode() % this._elements.length;
    };

    t.UNDEFINED_PLACEHOLDER = {
      hashCode: function() {
        return 0;
      },
      equals: function(e) {
        return t.UNDEFINED_PLACEHOLDER === e;
      }
    };

    t.NULL_PLACEHOLDER = {
      hashCode: function() {
        return 0;
      },
      equals: function(e) {
        return t.NULL_PLACEHOLDER === e;
      }
    };

    return t;
  }(p);
  t.Dictionary = _;
});

var __extends = this.__extends || function(e, t) {
    function n() {
      this.constructor = e;
    }
    for (var i in t) {
      if (t.hasOwnProperty(i)) {
        e[i] = t[i];
      }
    }
    n.prototype = t.prototype;

    e.prototype = new n;
  };

define("vs/base/performance/timer", ["require", "exports", "vs/base/env", "vs/base/eventEmitter",
  "vs/nls!vs/editor/worker/editorWorkerServer"
], function(e, t, n, i, o) {
  function r(e, t) {
    return d.start(e, t);
  }

  function s() {
    return d;
  }
  var a = !! self.msWriteProfilerMark;
  ! function(e) {
    e[e.EDITOR = 0] = "EDITOR";

    e[e.LANGUAGES = 1] = "LANGUAGES";

    e[e.WORKER = 2] = "WORKER";

    e[e.WORKBENCH = 3] = "WORKBENCH";
  }(t.Topic || (t.Topic = {}));
  var u = (t.Topic, function() {
    function e() {}
    e.prototype.start = function() {
      return this;
    };

    e.prototype.stop = function() {};

    e.prototype.timeTaken = function() {
      return -1;
    };

    return e;
  }());
  t.NullTimerEvent = u;
  var l = function() {
    function e(e, t, n, i) {
      if (this.timeKeeper = e, this.name = t, this.topic = n, this.stopTime = null, i) {
        this.startTime = i;
        return void 0;
      }
      if (this.startTime = (new Date).getTime(), a) {
        var o = ["Monaco", this.topic, this.name, "start"];
        self.msWriteProfilerMark(o.join("|"));
      }
    }
    e.prototype.start = function(e) {
      if (this.stopTime) throw new Error(o.localize("vs_base_performance_timer", 0));
      return this.timeKeeper.start(this.topic, this.name + "." + e);
    };

    e.prototype.stop = function(e) {
      if (null === this.stopTime) {
        if (e) {
          this.stopTime = e;
          return void 0;
        }
        if (this.stopTime = (new Date).getTime(), this.timeKeeper.emit("eventStop", this), a) {
          var t = ["Monaco", this.topic, this.name, "stop"];
          self.msWriteProfilerMark(t.join("|"));
        }
      }
    };

    e.prototype.timeTaken = function() {
      return this.stopTime ? this.stopTime - this.startTime : -1;
    };

    return e;
  }();
  t.TimerEvent = l;
  var c = function(e) {
    function i() {
      e.call(this);

      this.timeoutId = null;

      this.collectedEvents = [];

      this.eventCacheLimit = 1e3;

      this.maxTimerLength = 6e4;

      this.cleanupInterval = 12e4;
    }
    __extends(i, e);

    i.prototype.enabled = function() {
      return n.enablePerformanceEvents;
    };

    i.prototype.start = function(e, n) {
      if (this.enabled() === !1) {
        return t.nullEvent;
      }
      0 === e ? e = "Editor" : 1 === e ? e = "Languages" : 2 === e ? e = "Worker" : 3 === e && (e = "Workbench");
      var i = new l(this, n, e);
      this.addEvent(i);

      this.cleanupTimers();

      return i;
    };

    i.prototype.addEvent = function(e) {
      e.id = i.EVENT_ID;

      i.EVENT_ID++;

      this.collectedEvents.push(e);

      this.emit("eventStart", e);

      if (this.collectedEvents.length > this.eventCacheLimit) {
        this.collectedEvents.shift();
      }
    };

    i.prototype.cleanupTimers = function() {
      var e = this;
      if (null === this.timeoutId) {
        this.timeoutId = setTimeout(function() {
          var t = Date.now();
          e.collectedEvents.forEach(function(n) {
            if (!n.stopTime && t - n.startTime >= e.maxTimerLength) {
              n.stop();
            }
          });
        }, this.cleanupInterval);
      }
    };

    i.prototype.dispose = function() {
      clearTimeout(this.timeoutId);

      e.prototype.dispose.call(this);
    };

    i.prototype.getCollectedEvents = function() {
      return this.collectedEvents.slice(0);
    };

    i.prototype.clearCollectedEvents = function() {
      this.collectedEvents = [];
    };

    i.prototype.setInitialCollectedEvents = function(e, t) {
      var n = this;
      if (this.enabled() !== !1) {
        if (t) {
          i.PARSE_TIME = t;
        }
        e.forEach(function(e) {
          var t = new l(n, e.name, e.topic, e.startTime);
          t.stop(e.stopTime);

          n.addEvent(t);
        });
      }
    };

    i.EVENT_ID = 1;

    i.PARSE_TIME = (new Date).getTime();

    return i;
  }(i.EventEmitter);
  t.TimeKeeper = c;
  var d = new c;
  t.nullEvent = new u;

  t.start = r;

  t.getTimeKeeper = s;
});

var __extends = this.__extends || function(e, t) {
    function n() {
      this.constructor = e;
    }
    for (var i in t) {
      if (t.hasOwnProperty(i)) {
        e[i] = t[i];
      }
    }
    n.prototype = t.prototype;

    e.prototype = new n;
  };

define("vs/platform/services", ["require", "exports", "vs/base/lib/winjs.base", "vs/base/async", "vs/base/strings",
  "vs/base/network", "vs/base/eventEmitter", "vs/base/performance/timer", "vs/base/objects", "vs/base/hash",
  "vs/base/errors"
], function(e, t, n, i, o, r, s, a, u, l, c) {
  var d = function() {
    function e(e) {
      this._staticArguments = e;
    }
    e.prototype.appendStaticArguments = function(e) {
      this._staticArguments.push.apply(this._staticArguments, e);
    };

    e.prototype.staticArguments = function(e) {
      return isNaN(e) ? this._staticArguments.slice(0) : this._staticArguments[e];
    };

    e.prototype._validate = function(e) {
      if (!e) throw c.illegalArgument("can not be falsy");
    };

    return e;
  }();
  t.AbstractDescriptor = d;
  var h = function(e) {
    function t(t) {
      for (var n = [], i = 0; i < arguments.length - 1; i++) {
        n[i] = arguments[i + 1];
      }
      e.call(this, n);

      this._ctor = t;
    }
    __extends(t, e);

    Object.defineProperty(t.prototype, "ctor", {
      get: function() {
        return this._ctor;
      },
      enumerable: !0,
      configurable: !0
    });

    t.prototype.equals = function(e) {
      return e === this ? !0 : e instanceof t ? e.ctor === this.ctor : !1;
    };

    t.prototype.hashCode = function() {
      return 61 * (1 + this.ctor.length);
    };

    return t;
  }(d);
  t.SyncDescriptor = h;
  var p = function(e) {
    function t(t, n) {
      for (var i = [], o = 0; o < arguments.length - 2; o++) {
        i[o] = arguments[o + 2];
      }
      e.call(this, i);

      this._moduleName = t;

      this._functionName = n;
    }
    __extends(t, e);

    Object.defineProperty(t.prototype, "moduleName", {
      get: function() {
        return this._moduleName;
      },
      enumerable: !0,
      configurable: !0
    });

    Object.defineProperty(t.prototype, "functionName", {
      get: function() {
        return this._functionName;
      },
      enumerable: !0,
      configurable: !0
    });

    t.prototype.equals = function(e) {
      return e === this ? !0 : e instanceof t ? e.moduleName === this.moduleName && e.functionName === this.functionName : !
        1;
    };

    t.prototype.hashCode = function() {
      return l.computeMurmur2StringHashCode(this.moduleName) * l.computeMurmur2StringHashCode(this.functionName);
    };

    return t;
  }(d);
  t.AsyncDescriptor = p;
  var f = function() {
    function e(e, t, n) {
      if ("undefined" == typeof n) {
        n = {};
      }

      this.workspace = e;

      this.configuration = t;

      this.options = n;
    }
    e.prototype.getWorkspace = function() {
      return this.workspace;
    };

    e.prototype.getConfiguration = function() {
      return this.configuration;
    };

    e.prototype.getOptions = function() {
      return this.options;
    };

    return e;
  }();
  t.BaseContextService = f;
  var g = function() {
    function e() {}
    e.prototype.injectTelemetryService = function(e) {
      this._telemetryService = e;
    };

    Object.defineProperty(e.prototype, "telemetryService", {
      get: function() {
        return this._telemetryService;
      },
      enumerable: !0,
      configurable: !0
    });

    e.prototype.injectContextService = function(e) {
      if (!this.contextService)
        if (this.contextService = e, this.contextService.getConfiguration()) {
          this.origin = this.contextService.getConfiguration().paths.PUBLIC_WORKSPACE_URL;
          var t = (new r.URL(this.origin)).getPath();
          if (t && t.length > 0) {
            this.origin = this.origin.substring(0, this.origin.length - t.length + 1);
          }

          if (!o.endsWith(this.origin, "/")) {
            this.origin += "/";
          }
        } else {
          this.origin = "/";
        }
    };

    e.prototype.getRequestUrl = function(e, t, n) {
      var i = this.contextService.getWorkspace();
      if (i[e]) {
        var r = i[e] + o.normalizePath(t);
        return n ? this.origin + o.ltrim(r, "/") : r;
      }
      return null;
    };

    e.prototype.getPath = function(e, t) {
      var n = this.getRequestUrl(e, "/", !0);
      if (!n) {
        return null;
      }
      var i = t.toExternal().indexOf(n);
      return 0 === i ? t.toExternal().substr(n.length - 1) : null;
    };

    e.prototype.getAdditionalHeaders = function() {
      return this.contextService.getConfiguration().additionalHeaders || {};
    };

    e.prototype.supportsPrivateChannel = function() {
      return !1;
    };

    e.prototype.establishPrivateChannel = function() {
      return n.Promise.wrapError("Not Implemented");
    };

    e.prototype.supportsRemoteEvents = function() {
      return !1;
    };

    e.prototype.addRemoteListener = function() {
      throw new Error("Not Implemented");
    };

    e.prototype.makeRequest = function(e) {
      var t = a.nullEvent;
      e.headers = u.mixin(e.headers, this.getAdditionalHeaders());

      this._telemetryService && (t = this._telemetryService.start("WorkbenchXHR", {
        url: e.url
      }, !1));

      return i.always(n.xhr(e), function(e) {
        if (t.data) {
          t.data.status = e.status;
        }

        t.stop();
      });
    };

    e.prototype.makeChunkedRequest = function(e) {
      function t(e) {
        for (var t, n, i = 0, o = {};;) {
          if (t = e.indexOf(":", i), n = e.indexOf("\n", t + 1), 0 > t || 0 > n) break;
          o[e.substring(i, t).trim()] = e.substring(t + 1, n).trim();

          i = n + 1;
        }
        return o;
      }

      function i(e) {
        if (c) {
          r("canceled");
          return void 0;
        }
        var n = e.indexOf("\r\n\r\n", u);
        if (-1 !== n) {
          for (var i = []; - 1 !== n;) {
            var o = t(e.substring(u, n));

            var a = Number(o["Content-Length"]);
            if (n + 4 + a > e.length) break;
            var d = {
              header: o,
              body: e.substr(n + 4, a)
            };
            l.push(d);

            i.push(d);

            u = n + 4 + a;

            n = e.indexOf("\r\n\r\n", u);
          }
          s(i);
        }
      }
      var o;

      var r;

      var s;

      var a = this;

      var u = 0;

      var l = [];

      var c = !1;
      return new n.Promise(function(t, n, u) {
        o = t;

        r = n;

        s = u;

        a.makeRequest(e).done(function(e) {
          i(e.responseText);

          o(l);
        }, function(e) {
          r(e);
        }, function(e) {
          if (3 === e.readyState) {
            i(e.responseText);
          }
        });
      }, function() {
        c = !0;
      });
    };

    return e;
  }();
  t.BaseRequestService = g;

  (function(e) {
    e[e.GLOBAL = 0] = "GLOBAL";

    e[e.WORKSPACE = 1] = "WORKSPACE";
  })(t.StorageScope || (t.StorageScope = {}));
  t.StorageScope;
  ! function(e) {
    e[e.LEFT = 0] = "LEFT";

    e[e.CENTER = 1] = "CENTER";

    e[e.RIGHT = 2] = "RIGHT";
  }(t.Position || (t.Position = {}));
  t.Position;
  t.POSITIONS = [0, 1, 2];
  var m = function() {
    function e(e) {
      this._selection = e || [];
    }
    Object.defineProperty(e.prototype, "selection", {
      get: function() {
        return this._selection;
      },
      enumerable: !0,
      configurable: !0
    });

    e.prototype.isEmpty = function() {
      return 0 === this._selection.length;
    };

    e.EMPTY = new e([]);

    return e;
  }();
  t.Selection = m;
  var v = function(e) {
    function t() {
      e.apply(this, arguments);
    }
    __extends(t, e);

    t.prototype.toArray = function() {
      return this.selection;
    };

    return t;
  }(m);
  t.StructuredSelection = v;

  (function(e) {
    e[e.Info = 0] = "Info";

    e[e.Warning = 1] = "Warning";

    e[e.Error = 2] = "Error";
  })(t.Severity || (t.Severity = {}));
  var y = (t.Severity, function() {
    function e() {}
    e.SERVICE_CHANGED = "service-changed";

    e.SET_CHANGED = "set-changed";

    e.SET_ADDED = "set-added";

    e.SET_REMOVED = "set-removed";

    return e;
  }());
  t.MarkerServiceConstants = y;
  var _ = function() {
    function e() {}
    e.UPDATED = "update";

    return e;
  }();
  t.ExperimentServiceEventTypes = _;
  var b = function(e) {
    function t(t, n, i) {
      e.call(this);

      this._id = t;

      this._name = n;

      this._description = i;

      this._enabled = !1;
    }
    __extends(t, e);

    Object.defineProperty(t.prototype, "id", {
      get: function() {
        return this._id;
      },
      enumerable: !0,
      configurable: !0
    });

    Object.defineProperty(t.prototype, "name", {
      get: function() {
        return this._name;
      },
      enumerable: !0,
      configurable: !0
    });

    Object.defineProperty(t.prototype, "description", {
      get: function() {
        return this._description;
      },
      enumerable: !0,
      configurable: !0
    });

    Object.defineProperty(t.prototype, "enabled", {
      get: function() {
        return this._enabled;
      },
      set: function(e) {
        if (this._enabled !== e) {
          this._enabled = e;
          this.emit("enabled", this);
        }
      },
      enumerable: !0,
      configurable: !0
    });

    return t;
  }(s.EventEmitter);
  t.Experiment = b;
  var C = function() {
    function e() {}
    e.UPDATED = "update";

    e.FILE_CHANGE = "fileChange";

    return e;
  }();
  t.ConfigurationServiceEventTypes = C;

  t.ResourceEvents = {
    ADDED: "resource.added",
    REMOVED: "resource.removed",
    CHANGED: "resource.changed"
  };
});

define("vs/platform/instantiation/instantiationService", ["require", "exports", "vs/base/lib/winjs.base",
  "vs/base/errors", "vs/base/strings", "vs/base/types", "vs/platform/services", "vs/base/collections",
  "vs/base/injector"
], function(e, t, n, i, o, r, s, a, u) {
  function l(e) {
    return new d(e);
  }
  t.create = l;
  var c = function() {
    function e(e) {
      var t = this;
      this._services = e;

      this._active = 0;

      this._diContainer = new u.Container;

      a.forEach(this._services, function(e) {
        t._diContainer.registerService(e.key, e.value);

        Object.defineProperty(t, e.key, {
          get: function() {
            if (0 === t._active) throw i.illegalState("the services map can only be used during construction");
            if (!e.value) throw i.illegalArgument(o.format("service with '{0}' not found", e.key));
            return e.value;
          },
          set: function() {
            throw i.illegalState("services cannot be changed");
          },
          configurable: !1,
          enumerable: !1
        });
      });
    }
    Object.defineProperty(e.prototype, "services", {
      get: function() {
        return this._services;
      },
      enumerable: !0,
      configurable: !0
    });

    e.prototype.createInstance = function(e, t) {
      var n = [e.ctor, this];
      n.push.apply(n, e.staticArguments());

      n.push.apply(n, t);
      try {
        this._active += 1;
        var i = r.create.apply(null, n);
        this._diContainer.injectTo(i);

        e._validate(i);

        return i;
      } finally {
        this._active -= 1;
      }
    };

    return e;
  }();

  var d = function() {
    function t(e) {
      e.instantiationService = this;

      this._servicesMap = new c(e);
    }
    t.prototype.createChild = function(e) {
      var n = {};
      a.forEach(this._servicesMap.services, function(e) {
        n[e.key] = e.value;
      });

      a.forEach(e, function(e) {
        n[e.key] = e.value;
      });

      return new t(n);
    };

    t.prototype.createInstance = function(e) {
      for (var t = new Array(arguments.length - 1), n = 1, i = arguments.length; i > n; n++) {
        t[n - 1] = arguments[n];
      }
      return e instanceof s.SyncDescriptor ? this._servicesMap.createInstance(e, t) : e instanceof s.AsyncDescriptor ?
        this._createInstanceAsync(e, t) : this._servicesMap.createInstance(new s.SyncDescriptor(e), t);
    };

    t.prototype._createInstanceAsync = function(t, o) {
      var r;

      var a = this;
      return new n.TPromise(function(n, u) {
        e.onError = u;

        e([t.moduleName], function(e) {
          if (r && u(r), !e) {
            return u(i.illegalArgument("module not found: " + t.moduleName));
          }
          if ("function" != typeof e[t.functionName]) {
            return u(i.illegalArgument("not a function: " + t.functionName));
          }
          try {
            o.unshift.apply(o, t.staticArguments());

            n(a._servicesMap.createInstance(new s.SyncDescriptor(e[t.functionName]), o));
          } catch (l) {
            return u(l);
          }
        });
      }, function() {
        r = i.canceled();
      });
    };

    return t;
  }();
});

define("vs/platform/injectorService", ["require", "exports", "vs/base/collections", "vs/base/injector",
  "vs/base/assert", "./instantiation/instantiationService"
], function(e, t, n, i, o, r) {
  function s(e) {
    var t = new i.Container;

    var n = new c(t);

    var o = r.create(e);
    n._instantiationService = o;

    n._diContainer.registerService(c._instantiationServiceName, o);

    a(e, t);

    u(e, t);

    return n;
  }

  function a(e, t) {
    o.ok(!n.contains(e, c._injectorServiceName), "injectorService is NOT allowed to be added because it is implict");

    Object.keys(e).forEach(function(n) {
      var i = e[n];
      t.registerService(n, i);
    });
  }

  function u(e, t) {
    Object.keys(e).forEach(function(n) {
      var i = e[n];
      t.injectTo(i);

      l(i);
    });
  }

  function l(e) {
    return Array.isArray(e) ? (e.forEach(function(e) {
      l(e);
    }), void 0) : ("function" == typeof e[c._fnInjectionDone] && e[c._fnInjectionDone].apply(e), void 0);
  }
  var c = function() {
    function e(t) {
      this._diContainer = t;

      this._diContainer.registerService(e._injectorServiceName, this);
    }
    e.prototype.injectTo = function(e) {
      this._diContainer.injectTo(e);

      l(e);
    };

    e.prototype.createChild = function(t) {
      var n = this._diContainer.createChild();
      a(t, n);
      var i = new e(n);
      i._instantiationService = this._instantiationService.createChild(t);

      n.registerService(e._injectorServiceName, i);

      n.registerService(e._instantiationServiceName, i._instantiationService);

      u(t, n);

      return i;
    };

    e._injectorServiceName = "injectorService";

    e._instantiationServiceName = "instantiationService";

    e._fnInjectionDone = "injectionDone";

    return e;
  }();
  t.create = s;
});

var __extends = this.__extends || function(e, t) {
    function n() {
      this.constructor = e;
    }
    for (var i in t) {
      if (t.hasOwnProperty(i)) {
        e[i] = t[i];
      }
    }
    n.prototype = t.prototype;

    e.prototype = new n;
  };

define("vs/editor/worker/resourceService", ["require", "exports", "vs/base/eventEmitter", "vs/base/types",
  "vs/platform/services", "vs/editor/core/model/mirrorModel"
], function(e, t, n, i, o, r) {
  var s = function(e) {
    function t() {
      e.call(this);

      this.data = {};

      this.linked = {};

      this.unbinds = {};
    }
    __extends(t, e);

    t.prototype.insert = function(e, t) {
      var n = this;

      var i = this.remove(e, t);

      var r = e.toString();
      this.data[r] = t;

      this.unbinds[r] = [];

      this.unbinds[r].push(t.addBulkListener(function(t) {
        n.emit(o.ResourceEvents.CHANGED, {
          url: e,
          originalEvents: t
        });
      }));

      this.emit(o.ResourceEvents.ADDED, {
        url: e,
        addedElement: t,
        removedElement: i
      });

      return i;
    };

    t.prototype.insertLinked = function(e, t, n) {
      if (this.contains(e)) {
        var o = e.toExternal();
        if (!this.linked.hasOwnProperty(o)) {
          this.linked[o] = {};
        }

        this.linked[o][t] = n;

        if (i.isFunction(n.onChange)) {
          this.unbinds[o].push(this.data[o].addBulkListener(function(e) {
            n.onChange(e);
          }));
        }
      }
    };

    t.prototype.get = function(e) {
      return this.data[e.toString()] ? this.data[e.toString()] : null;
    };

    t.prototype.getLinked = function(e, t) {
      var n = e.toExternal();
      return this.data[n] ? this.linked.hasOwnProperty(n) ? this.linked[n].hasOwnProperty(t) ? this.linked[n][t] :
        null : null : null;
    };

    t.prototype.all = function() {
      var e = this;
      return Object.keys(this.data).map(function(t) {
        return e.data[t];
      });
    };

    t.prototype.allLinked = function() {
      var e = this;

      var t = [];
      Object.keys(this.linked).forEach(function(n) {
        Object.keys(e.linked[n]).forEach(function(i) {
          t.push(e.linked[n][i]);
        });
      });

      return t;
    };

    t.prototype.contains = function(e) {
      return !!this.data[e.toString()];
    };

    t.prototype.remove = function(e, t) {
      if (!this.contains(e)) {
        return !1;
      }
      for (var n = e.toString(), r = this.data[n][0]; this.unbinds[n].length > 0;) {
        this.unbinds[n].pop()();
      }
      for (var s in this.linked[n])
        if (this.linked.hasOwnProperty(s)) {
          var a = this.linked[n][s];
          if (i.isFunction(a.onRemove)) {
            a.onRemove();
          }
        }
      delete this.unbinds[n];

      delete this.linked[n];

      delete this.data[n];

      this.emit(o.ResourceEvents.REMOVED, {
        url: e,
        removedElement: r,
        addedElement: t
      });

      return !0;
    };

    return t;
  }(n.EventEmitter);
  t.ResourceService = s;
  var a = function(e) {
    function t() {
      e.apply(this, arguments);
    }
    __extends(t, e);

    t.prototype.injectDispatcherService = function(e) {
      e.register("modelInitialize", this.onModelInitialize.bind(this));

      e.register("modelDestroy", this.onModelDestroy.bind(this));

      e.register("modelEvents", this.onModelEvents.bind(this));
    };

    t.prototype.onModelInitialize = function(e, t, n, i) {
      var o = new r.MirrorModel(e, t, i, n);
      this.insert(i, o);
    };

    t.prototype.onModelDestroy = function(e) {
      this.remove(e);
    };

    t.prototype.onModelEvents = function(e, t) {
      var n = this.get(e);
      n.onEvents(t);
    };

    return t;
  }(s);
  t.WorkerResourceService = a;
});

var __extends = this.__extends || function(e, t) {
    function n() {
      this.constructor = e;
    }
    for (var i in t) {
      if (t.hasOwnProperty(i)) {
        e[i] = t[i];
      }
    }
    n.prototype = t.prototype;

    e.prototype = new n;
  };

define("vs/base/dom/mouseEvent", ["require", "exports", "vs/base/env", "vs/base/dom/iframe"], function(e, t, n, i) {
  function o(e) {
    var t = window.MonacoScrollDivisor || 120;
    return e / t;
  }
  var r = function() {
    function e(e) {
      this.browserEvent = e;

      this.leftButton = 0 === e.button;

      this.middleButton = 1 === e.button;

      this.rightButton = 2 === e.button;

      this.target = e.target || e.targetNode || e.srcElement;

      this.detail = e.detail || 1;

      if ("dblclick" === e.type) {
        this.detail = 2;
      }

      this.posx = 0;

      this.posy = 0;

      this.ctrlKey = e.ctrlKey;

      this.shiftKey = e.shiftKey;

      this.altKey = e.altKey;

      this.metaKey = e.metaKey;

      e.clientX || e.clientY ? (this.posx = e.clientX + document.body.scrollLeft + document.documentElement.scrollLeft,
        this.posy = e.clientY + document.body.scrollTop + document.documentElement.scrollTop) : (e.pageX || e.pageY) &&
        (this.posx = e.pageX, this.posy = e.pageY);
      var t = i.getPositionOfChildWindowRelativeToAncestorWindow(self, e.view);
      this.posx -= t.left;

      this.posy -= t.top;
    }
    e.prototype.preventDefault = function() {
      this.browserEvent.preventDefault ? this.browserEvent.preventDefault() : this.browserEvent.returnValue = !1;
    };

    e.prototype.stopPropagation = function() {
      this.browserEvent.stopPropagation ? this.browserEvent.stopPropagation() : this.browserEvent.cancelBubble = !0;
    };

    return e;
  }();
  t.StandardMouseEvent = r;
  var s = function(e) {
    function t(t) {
      e.call(this, t);

      this.dataTransfer = t.dataTransfer;
    }
    __extends(t, e);

    return t;
  }(r);
  t.DragMouseEvent = s;
  var a = function(e) {
    function t(t) {
      e.call(this, t);
    }
    __extends(t, e);

    return t;
  }(s);
  t.DropMouseEvent = a;
  var u = function() {
    function e(e, t, i) {
      if ("undefined" == typeof t && (t = 0), "undefined" == typeof i && (i = 0), this.browserEvent = e || null, this
        .target = e ? e.target || e.targetNode || e.srcElement : null, this.deltaY = i, this.deltaX = t, e) {
        var r = e;

        var s = e;
        "undefined" != typeof r.wheelDeltaY ? this.deltaY = o(r.wheelDeltaY) : "undefined" != typeof s.VERTICAL_AXIS &&
          s.axis === s.VERTICAL_AXIS && (this.deltaY = -s.detail / 3);

        "undefined" != typeof r.wheelDeltaX ? this.deltaX = n.browser.isSafari && n.browser.isWindows ? -o(r.wheelDeltaX) :
          o(r.wheelDeltaX) : "undefined" != typeof s.HORIZONTAL_AXIS && s.axis === s.HORIZONTAL_AXIS && (this.deltaX = -
            e.detail / 3);

        if (0 === this.deltaY && 0 === this.deltaX && e.wheelDelta) {
          this.deltaY = o(e.wheelDelta);
        }
      }
    }
    e.prototype.preventDefault = function() {
      if (this.browserEvent) {
        this.browserEvent.preventDefault ? this.browserEvent.preventDefault() : this.browserEvent.returnValue = !1;
      }
    };

    e.prototype.stopPropagation = function() {
      if (this.browserEvent) {
        this.browserEvent.stopPropagation ? this.browserEvent.stopPropagation() : this.browserEvent.cancelBubble = !0;
      }
    };

    return e;
  }();
  t.StandardMouseWheelEvent = u;
});

define("vs/base/dom/keyboardEvent", ["require", "vs/base/lib/winjs.base", "vs/base/env"], function(e, t, n) {
  "use strict";
  var i = function() {
    var e = {
      Backspace: 8,
      Tab: 9,
      Enter: 13,
      Shift: 16,
      Ctrl: 17,
      Alt: 18,
      PauseBreak: 19,
      CapsLock: 20,
      Escape: 27,
      Space: 32,
      PageUp: 33,
      PageDown: 34,
      End: 35,
      Home: 36,
      LeftArrow: 37,
      UpArrow: 38,
      RightArrow: 39,
      DownArrow: 40,
      Insert: 45,
      Delete: 46,
      0: 48,
      1: 49,
      2: 50,
      3: 51,
      4: 52,
      5: 53,
      6: 54,
      7: 55,
      8: 56,
      9: 57,
      A: 65,
      B: 66,
      C: 67,
      D: 68,
      E: 69,
      F: 70,
      G: 71,
      H: 72,
      I: 73,
      J: 74,
      K: 75,
      L: 76,
      M: 77,
      N: 78,
      O: 79,
      P: 80,
      Q: 81,
      R: 82,
      S: 83,
      T: 84,
      U: 85,
      V: 86,
      W: 87,
      X: 88,
      Y: 89,
      Z: 90,
      ContextMenu: 93,
      F1: 112,
      F2: 113,
      F3: 114,
      F4: 115,
      F5: 116,
      F6: 117,
      F7: 118,
      F8: 119,
      F9: 120,
      F10: 121,
      F11: 122,
      F12: 123,
      NumLock: 144,
      ScrollLock: 145,
      ";": 186,
      "=": 187,
      ",": 188,
      "-": 189,
      ".": 190,
      "/": 191,
      "`": 192,
      "[": 219,
      "\\": 220,
      "]": 221,
      "'": 222
    };
    n.browser.isIE11orEarlier ? e.Meta = 91 : n.browser.isFirefox ? (e["-"] = 109, e["="] = 107, e[";"] = 59, n.browser
      .isMacintosh && (e.Meta = 224)) : n.browser.isOpera ? (e["-"] = 109, e["="] = 61, e[";"] = 59, n.browser.isMacintosh &&
      (e.Meta = 57392)) : n.browser.isWebKit && n.browser.isMacintosh && (e.Meta = 91);
    var t = {};
    ! function() {
      for (var n in e) {
        if (e.hasOwnProperty(n)) {
          t[e[n]] = n;
        }
      }
    }();

    n.browser.isOpera ? (t[189] = "-", t[187] = "=", t[186] = ";") : n.browser.isWebKit && n.browser.isMacintosh && (
      t[93] = "Meta");
    var i = function(e, n) {
      return t.hasOwnProperty(e) ? t[e] : n;
    };

    var o = null;
    o = n.browser.isOpera ? function(e) {
      return "keypress" === e.type ? e.which <= 32 ? i(e.keyCode, String.fromCharCode(e.keyCode).toUpperCase()) :
        String.fromCharCode(e.which).toUpperCase() : i(e.keyCode, "unknown");
    } : function(e) {
      return e.charCode ? String.fromCharCode(e.charCode).toUpperCase() : i(e.keyCode, "unknown");
    };

    return {
      CHAR_TO_CODE: e,
      CODE_TO_CHAR: t,
      extractKey: o
    };
  }();

  var o = t.Class.define(function(e) {
    if (this.browserEvent = e, this.ctrlKey = e.ctrlKey, this.shiftKey = e.shiftKey, this.altKey = e.altKey, this.metaKey =
      e.metaKey, this.target = e.target || e.targetNode, this.key = i.extractKey(e), this.ctrlKey = this.ctrlKey ||
      "Ctrl" === this.key, this.altKey = this.altKey || "Alt" === this.key, this.shiftKey = this.shiftKey ||
      "Shift" === this.key, this.metaKey = this.metaKey || "Meta" === this.key, n.browser.isOpera && n.browser.isMacintosh
    ) {
      var t = this.metaKey;
      this.metaKey = this.ctrlKey;

      this.ctrlKey = t;

      "Ctrl" === this.key ? this.key = "Meta" : "Meta" === this.key && (this.key = "Ctrl");
    }
  }, {
    preventDefault: function() {
      this.browserEvent.preventDefault ? this.browserEvent.preventDefault() : this.browserEvent.returnValue = !1;
    },
    stopPropagation: function() {
      this.browserEvent.stopPropagation ? this.browserEvent.stopPropagation() : this.browserEvent.cancelBubble = !0;
    },
    clone: function() {
      var e = this.asString();
      return {
        ctrlKey: this.ctrlKey,
        shiftKey: this.shiftKey,
        altKey: this.altKey,
        metaKey: this.metaKey,
        target: this.target,
        key: this.key,
        preventDefault: function() {},
        stopPropagation: function() {},
        asString: function() {
          return e;
        }
      };
    },
    asString: function() {
      var e = "";
      this.ctrlKey && (e += "Ctrl");

      this.shiftKey && (e += ("" === e ? "" : "-") + "Shift");

      this.altKey && (e += ("" === e ? "" : "-") + "Alt");

      this.metaKey && (e += ("" === e ? "" : "-") + "Meta");

      this.key && "Ctrl" !== this.key && "Shift" !== this.key && "Alt" !== this.key && "Meta" !== this.key && (e +=
        ("" === e ? "" : "-") + this.key);

      return e;
    }
  });
  return {
    KEYS: i.CHAR_TO_CODE,
    KeyboardEvent: o
  };
});

define("vs/base/dom/dom", ["require", "exports", "vs/base/env", "vs/base/types", "vs/base/eventEmitter",
  "vs/base/dom/mockDom", "vs/base/dom/mouseEvent", "vs/base/dom/keyboardEvent", "vs/base/errors"
], function(e, t, n, i, o, r, s, a, u) {
  function l(e) {
    for (; e.firstChild;) {
      e.removeChild(e.firstChild);
    }
  }

  function c(e) {
    for (; e;) {
      if (e === document.body) {
        return !0;
      }
      e = e.parentNode;
    }
    return !1;
  }

  function d(e, t, n, o) {
    var r = function(e) {
      e = e || window.event;

      n(e);
    };
    return i.isFunction(e.addEventListener) ? (e.addEventListener(t, r, o || !1), function() {
      if (r) {
        e.removeEventListener(t, r, o || !1);
        r = null;
        e = null;
        n = null;
      }
    }) : (e.attachEvent("on" + t, r), function() {
      e.detachEvent("on" + t, r);
    });
  }

  function h(e, n, i, o) {
    var r = t.addListener(e, n, i, o);
    return {
      dispose: r
    };
  }

  function p(e) {
    return function(t) {
      return e(new s.StandardMouseEvent(t));
    };
  }

  function f(e) {
    return function(t) {
      return e(new a.KeyboardEvent(t));
    };
  }

  function g(e, n) {
    return t.addListener(e, "mouseout", function(t) {
      for (var i = t.relatedTarget || t.toElement; i && i !== e;) {
        i = i.parentNode;
      }
      if (i !== e) {
        n(t);
      }
    });
  }

  function m(e, n) {
    var i = t.addNonBubblingMouseOutListener(e, n);
    return {
      dispose: i
    };
  }

  function v(e, n, i, o, r) {
    if ("undefined" == typeof o) {
      o = B;
    }

    if ("undefined" == typeof r) {
      r = 0;
    }
    var s = null;

    var a = 0;

    var u = !1;

    var l = !1;

    var c = function() {
      a = (new Date).getTime();

      i(s);

      s = null;
    };

    var d = function() {
      if (l = !1, !u) {
        var e = (new Date).getTime() - a;
        e >= r ? c() : l || (l = !0, t.scheduleAtNextAnimationFrame(d, Number.MAX_VALUE));
      }
    };

    var h = t.addListener(e, n, function(e) {
      s = o(s, e);

      if (!l) {
        l = !0;
        t.scheduleAtNextAnimationFrame(d, Number.MAX_VALUE);
      }
    });
    return function() {
      u = !0;

      h();
    };
  }

  function y(e, n, i, o, r) {
    if ("undefined" == typeof o) {
      o = B;
    }

    if ("undefined" == typeof r) {
      r = U;
    }
    var s = null;

    var a = 0;

    var u = -1;

    var l = function() {
      u = -1;

      a = (new Date).getTime();

      i(s);

      s = null;
    };

    var c = t.addListener(e, n, function(e) {
      s = o(s, e);
      var t = (new Date).getTime() - a;
      t >= r ? (-1 !== u && window.clearTimeout(u), l()) : -1 === u && (u = window.setTimeout(l, r - t));
    });
    return function() {
      if (-1 !== u) {
        window.clearTimeout(u);
      }

      c();
    };
  }

  function _(e, t, n, i, o) {
    return F.isNative ? v(e, t, n, i, o) : y(e, t, n, i, o);
  }

  function b(e, n, i, o, r) {
    var s = t.addThrottledListener(e, n, i, o, r);
    return {
      dispose: s
    };
  }

  function C(e) {
    return document.defaultView && i.isFunction(document.defaultView.getComputedStyle) ? document.defaultView.getComputedStyle(
      e, null) : e.currentStyle;
  }

  function w(e, n, i) {
    var o = t.getComputedStyle(e);

    var r = "0";
    r = o.getPropertyValue ? o.getPropertyValue(n) : o.getAttribute(i);

    return q(e, r);
  }

  function E(e) {
    for (var n = e.offsetParent, i = e.offsetTop, o = e.offsetLeft; null !== (e = e.parentNode) && e !== document.body &&
      e !== document.documentElement;) {
      i -= e.scrollTop;
      var r = t.getComputedStyle(e);
      if (r) {
        o -= "rtl" !== r.direction ? e.scrollLeft : -e.scrollLeft;
      }

      if (e === n) {
        o += z.getBorderLeftWidth(e);
        i += z.getBorderTopWidth(e);
        i += e.offsetTop;
        o += e.offsetLeft;
        n = e.offsetParent;
      }
    }
    return {
      left: o,
      top: i
    };
  }

  function S(e) {
    var n = t.getTopLeftOffset(e);
    return {
      left: n.left,
      top: n.top,
      width: e.clientWidth,
      height: e.clientHeight
    };
  }

  function L(e) {
    var t = z.getBorderLeftWidth(e) + z.getBorderRightWidth(e);

    var n = z.getPaddingLeft(e) + z.getPaddingRight(e);
    return e.offsetWidth - t - n;
  }

  function T(e) {
    var t = z.getMarginLeft(e) + z.getMarginRight(e);
    return e.offsetWidth + t;
  }

  function x(e) {
    var t = z.getBorderTopWidth(e) + z.getBorderBottomWidth(e);

    var n = z.getPaddingTop(e) + z.getPaddingBottom(e);
    return e.offsetHeight - t - n;
  }

  function N(e) {
    var t = z.getMarginTop(e) + z.getMarginBottom(e);
    return e.offsetHeight + t;
  }

  function M(e, t) {
    if (null === e) {
      return 0;
    }
    for (var n = e.offsetLeft, i = e.parentNode; null !== i && (n -= i.offsetLeft, i !== t);) {
      i = i.parentNode;
    }
    return n;
  }

  function k(e, t) {
    if (null === e) {
      return 0;
    }
    for (var n = e.offsetTop, i = e.parentNode; null !== i && (n -= i.offsetTop, i !== t);) {
      i = i.parentNode;
    }
    return n;
  }

  function I(e, t) {
    for (; e;) {
      if (e === t) {
        return !0;
      }
      e = e.parentNode;
    }
    return !1;
  }

  function D() {
    j = document.createElement("style");

    j.type = "text/css";

    j.media = "screen";

    document.getElementsByTagName("head")[0].appendChild(j);
  }

  function O() {
    return j && j.sheet && j.sheet.rules ? j.sheet.rules : j && j.sheet && j.sheet.cssRules ? j.sheet.cssRules : [];
  }

  function R(e, t) {
    if (t) {
      if (!j) {
        D();
      }
      j.sheet.insertRule(e + "{" + t + "}", 0);
    }
  }

  function P(e) {
    if (!j) {
      return null;
    }
    for (var t = O(), n = 0; n < t.length; n++) {
      var i = t[n];

      var o = i.selectorText.replace(/::/gi, ":");
      if (o === e) {
        return i;
      }
    }
    return null;
  }

  function A(e) {
    if (j) {
      for (var t = O(), n = [], i = 0; i < t.length; i++) {
        var o = t[i];

        var r = o.selectorText.replace(/::/gi, ":");
        if (0 === r.indexOf(e)) {
          n.push(i);
        }
      }
      for (var i = n.length - 1; i >= 0; i--) {
        j.sheet.deleteRule(n[i]);
      }
    }
  }

  function W(e) {
    return "object" == typeof HTMLElement ? e instanceof HTMLElement || e instanceof r.MockElement : e && "object" ==
      typeof e && 1 === e.nodeType && "string" == typeof e.nodeName;
  }

  function H(e) {
    try {
      e.select();

      if (e.setSelectionRange) {
        e.setSelectionRange(0, 9999);
      }
    } catch (t) {}
  }

  function V(e) {
    var i = !1;

    var r = !1;

    var s = new o.EventEmitter;

    var a = [];

    var u = null;
    u = {
      addFocusListener: function(e) {
        var t = s.addListener("focus", e);
        a.push(t);

        return t;
      },
      addBlurListener: function(e) {
        var t = s.addListener("blur", e);
        a.push(t);

        return t;
      },
      dispose: function() {
        for (; a.length > 0;) {
          a.pop()();
        }
      }
    };
    var l = function() {
      r = !1;

      if (!i) {
        i = !0;
        s.emit("focus", {});
      }
    };

    var c = function() {
      if (i) {
        r = !0;
        n.isTesting() ? r && (r = !1, i = !1, s.emit("blur", {})) : window.setTimeout(function() {
          if (r) {
            r = !1;
            i = !1;
            s.emit("blur", {});
          }
        }, 0);
      }
    };
    a.push(t.addListener(e, t.EventType.FOCUS, l, !0));

    a.push(t.addListener(e, t.EventType.BLUR, c, !0));

    return u;
  }
  t.clearNode = l;

  t.isInDOM = c;

  t.hasClass;

  t.addClass;

  t.removeClass;

  t.toggleClass;

  (function() {
    function e(e, t) {
      var r = e.className;
      if (!r) {
        n = -1;
        return void 0;
      }
      t = t.trim();
      var s = r.length;

      var a = t.length;
      if (0 === a) {
        n = -1;
        return void 0;
      }
      if (a > s) {
        n = -1;
        return void 0;
      }
      if (r === t) {
        n = 0;
        i = s;
        return void 0;
      }
      for (var u, l = -1;
        (l = r.indexOf(t, l + 1)) >= 0;) {
        if (u = l + a, (0 === l || r.charCodeAt(l - 1) === o) && r.charCodeAt(u) === o) {
          n = l;
          i = u + 1;
          return void 0;
        }
        if (l > 0 && r.charCodeAt(l - 1) === o && u === s) {
          n = l - 1;
          i = u;
          return void 0;
        }
        if (0 === l && u === s) {
          n = 0;
          i = u;
          return void 0;
        }
      }
      n = -1;
    }
    var n;

    var i;

    var o = " ".charCodeAt(0);
    t.hasClass = function(t, i) {
      e(t, i);

      return -1 !== n;
    };

    t.addClass = function(t, i) {
      t.className ? (e(t, i), -1 === n && (t.className = t.className + " " + i)) : t.className = i;
    };

    t.removeClass = function(t, o) {
      e(t, o);

      if (-1 !== n) {
        t.className = t.className.substring(0, n) + t.className.substring(i);
      }
    };

    t.toggleClass = function(i, o, r) {
      e(i, o);

      if (!(-1 === n || r)) {
        t.removeClass(i, o);
      }

      if (-1 === n && r) {
        t.addClass(i, o);
      }
    };
  })();

  t.addListener = d;

  t.addDisposableListener = h;

  t.addStandardDisposableListener = function(e, t, n, i) {
    var o = n;
    "click" === t ? o = p(n) : ("keydown" === t || "keypress" === t || "keyup" === t) && (o = f(n));

    e.addEventListener(t, o, i || !1);

    return {
      dispose: function() {
        if (o) {
          e.removeEventListener(t, o, i || !1);
          o = null;
          e = null;
          n = null;
        }
      }
    };
  };

  t.addNonBubblingMouseOutListener = g;

  t.addDisposableNonBubblingMouseOutListener = m;
  var F = function() {
    var e = function(e) {
      e((new Date).getTime());

      return 0;
    };

    var t = self.requestAnimationFrame || self.msRequestAnimationFrame || self.webkitRequestAnimationFrame || self.mozRequestAnimationFrame ||
      self.oRequestAnimationFrame;

    var n = self.cancelAnimationFrame || self.cancelRequestAnimationFrame || self.msCancelAnimationFrame || self.msCancelRequestAnimationFrame ||
      self.webkitCancelAnimationFrame || self.webkitCancelRequestAnimationFrame || self.mozCancelAnimationFrame ||
      self.mozCancelRequestAnimationFrame || self.oCancelAnimationFrame || self.oCancelRequestAnimationFrame;

    var i = !! t;

    var o = t || e;

    var r = n || n;
    return {
      isNative: i,
      request: function(e) {
        return o(e);
      },
      cancel: function(e) {
        return r(e);
      }
    };
  }();
  t.runAtThisOrScheduleAtNextAnimationFrame;

  t.scheduleAtNextAnimationFrame;

  t.cancelAtNextAnimationFrame;

  (function() {
    function e() {
      o = !1;

      i.sort(function(e, t) {
        return t.priority - e.priority;
      });
      var e = i;
      n += i.length;

      i = [];
      try {
        r = !0;
        for (var t = 0; t < e.length; t++)
          if (!e[t].cancelled) try {
            e[t].runner();
          } catch (s) {
            u.onUnexpectedError(s);
          }
      } finally {
        r = !1;
      }
    }
    var n = 0;

    var i = [];

    var o = !1;

    var r = !1;
    t.scheduleAtNextAnimationFrame = function(t, r) {
      if ("undefined" == typeof r) {
        r = 0;
      }
      var s = i.length;
      i.push({
        cancelled: !1,
        runner: t,
        priority: r
      });

      o || (o = !0, F.request(e));

      return s + n;
    };

    t.runAtThisOrScheduleAtNextAnimationFrame = function(e, n) {
      return r ? (e(), -1) : t.scheduleAtNextAnimationFrame(e, n);
    };

    t.cancelAtNextAnimationFrame = function(e) {
      if ("undefined" != typeof e) {
        var t = e - n;
        if (!(0 > t || t >= i.length)) {
          i[t].cancelled = !0;
        }
      }
    };
  })();
  var U = 16;

  var B = function(e, t) {
    return t;
  };
  t.addThrottledListener = _;

  t.addDisposableThrottledListener = b;

  t.getComputedStyle = C;
  var q = function() {
    var e = /^-?\d+(px)?$/i;

    var t = /^-?\d+/i;
    return function(n, i) {
      if (!e.test(i) && t.test(i)) {
        var o = n.style.left;
        n.style.left = i;
        var r = n.style.pixelLeft;
        n.style.left = o;

        return r;
      }
      return parseInt(i, 10) || 0;
    };
  }();

  var z = {
    getBorderLeftWidth: function(e) {
      return w(e, "border-left-width", "borderLeftWidth");
    },
    getBorderTopWidth: function(e) {
      return w(e, "border-top-width", "borderTopWidth");
    },
    getBorderRightWidth: function(e) {
      return w(e, "border-right-width", "borderRightWidth");
    },
    getBorderBottomWidth: function(e) {
      return w(e, "border-bottom-width", "borderBottomWidth");
    },
    getPaddingLeft: function(e) {
      return w(e, "padding-left", "paddingLeft");
    },
    getPaddingTop: function(e) {
      return w(e, "padding-top", "paddingTop");
    },
    getPaddingRight: function(e) {
      return w(e, "padding-right", "paddingRight");
    },
    getPaddingBottom: function(e) {
      return w(e, "padding-bottom", "paddingBottom");
    },
    getMarginLeft: function(e) {
      return w(e, "margin-left", "marginLeft");
    },
    getMarginTop: function(e) {
      return w(e, "margin-top", "marginTop");
    },
    getMarginRight: function(e) {
      return w(e, "margin-right", "marginRight");
    },
    getMarginBottom: function(e) {
      return w(e, "margin-bottom", "marginBottom");
    },
    __commaSentinel: !1
  };
  t.getTopLeftOffset = E;

  t.getDomNodePosition = S;

  t.getContentWidth = L;

  t.getTotalWidth = T;

  t.getContentHeight = x;

  t.getTotalHeight = N;

  t.getRelativeLeft = M;

  t.getRelativeTop = k;

  t.isAncestor = I;
  var j = null;
  t.createCSSRule = R;

  t.getCSSRule = P;

  t.removeCSSRulesWithPrefix = A;

  t.isHTMLElement = W;

  t.EventType = {
    CLICK: "click",
    DBLCLICK: "dblclick",
    MOUSE_UP: "mouseup",
    MOUSE_DOWN: "mousedown",
    MOUSE_OVER: "mouseover",
    MOUSE_MOVE: "mousemove",
    MOUSE_OUT: "mouseout",
    CONTEXT_MENU: "contextmenu",
    KEY_DOWN: "keydown",
    KEY_PRESS: "keypress",
    KEY_UP: "keyup",
    LOAD: "load",
    UNLOAD: "unload",
    ABORT: "abort",
    ERROR: "error",
    RESIZE: "resize",
    SCROLL: "scroll",
    SELECT: "select",
    CHANGE: "change",
    SUBMIT: "submit",
    RESET: "reset",
    FOCUS: "focus",
    BLUR: "blur",
    INPUT: "input",
    STORAGE: "storage",
    DRAG_START: "dragstart",
    DRAG: "drag",
    DRAG_ENTER: "dragenter",
    DRAG_LEAVE: "dragleave",
    DRAG_OVER: "dragover",
    DROP: "drop",
    DRAG_END: "dragend",
    ANIMATION_START: n.browser.isWebKit ? "webkitAnimationStart" : "animationstart",
    ANIMATION_END: n.browser.isWebKit ? "webkitAnimationEnd" : "animationend",
    ANIMATION_ITERATION: n.browser.isWebKit ? "webkitAnimationIteration" : "animationiteration"
  };

  t.EventHelper = {
    stop: function(e, t) {
      e.preventDefault ? e.preventDefault() : e.returnValue = !1;

      if (t) {
        e.stopPropagation ? e.stopPropagation() : e.cancelBubble = !0;
      }
    }
  };

  t.selectTextInInputElement = H;

  t.trackFocus = V;

  t.UnitConverter = {
    _emInPx: -1,
    emToPixel: function(e) {
      if (this._emInPx < 0) {
        var n = document.createElement("div");
        n.style.position = "absolute";

        n.style.top = "10000px";

        n.style.left = "10000px";

        n.style.fontSize = "1em";

        n.innerHTML = "AbcDef";

        document.body.appendChild(n);
        var i = t.getTotalHeight(n);
        document.body.removeChild(n);

        this._emInPx = i;
      }
      var o = e * this._emInPx;

      var r = Math.round(o);
      return r;
    }
  };
});

var __extends = this.__extends || function(e, t) {
    function n() {
      this.constructor = e;
    }
    for (var i in t) {
      if (t.hasOwnProperty(i)) {
        e[i] = t[i];
      }
    }
    n.prototype = t.prototype;

    e.prototype = new n;
  };

define("vs/base/time/idleMonitor", ["require", "exports", "vs/base/dom/dom", "vs/base/lifecycle",
  "vs/base/eventEmitter"
], function(e, t, n, i, o) {
  ! function(e) {
    e[e.Idle = 0] = "Idle";

    e[e.Active = 1] = "Active";
  }(t.UserStatus || (t.UserStatus = {}));
  t.UserStatus;
  t.IDLE_TIME = 36e5;
  var r = function() {
    function e() {
      a.INSTANCE.increment();
    }
    e.prototype.addOneTimeActiveListener = function(e) {
      return a.INSTANCE.addOneTimeActiveListener(e);
    };

    e.prototype.addOneTimeIdleListener = function(e) {
      return a.INSTANCE.addOneTimeIdleListener(e);
    };

    e.prototype.getStatus = function() {
      return a.INSTANCE.getStatus();
    };

    e.prototype.dispose = function() {
      a.INSTANCE.decrement();
    };

    return e;
  }();
  t.IdleMonitor = r;
  var s = function() {
    function e() {
      this.referenceCount = 0;
    }
    e.prototype.increment = function() {
      if (0 === this.referenceCount) {
        this.construct();
      }

      this.referenceCount++;
    };

    e.prototype.decrement = function() {
      if (this.referenceCount > 0) {
        this.referenceCount--;
        if (0 === this.referenceCount) {
          this.dispose();
        }
      }
    };

    e.prototype.construct = function() {
      throw new Error("Implement me");
    };

    e.prototype.dispose = function() {
      throw new Error("Implement me");
    };

    return e;
  }();

  var a = function(e) {
    function r() {
      e.apply(this, arguments);
    }
    __extends(r, e);

    r.prototype.construct = function() {
      var e = this;
      this.status = null;

      this.idleCheckTimeout = -1;

      this.toDispose = [];

      this.eventEmitter = new o.EventEmitter;

      this.toDispose.push(this.eventEmitter);

      this.toDispose.push(n.addDisposableListener(document, "mousemove", function() {
        return e.onUserActive();
      }));

      this.toDispose.push(n.addDisposableListener(document, "keydown", function() {
        return e.onUserActive();
      }));

      this.onUserActive();
    };

    r.prototype.dispose = function() {
      this.toDispose = i.disposeAll(this.toDispose);

      this.cancelIdleCheck();
    };

    r.prototype.getStatus = function() {
      return this.status;
    };

    r.prototype.addOneTimeActiveListener = function(e) {
      return this.eventEmitter.addOneTimeDisposableListener("onActive", e);
    };

    r.prototype.addOneTimeIdleListener = function(e) {
      return this.eventEmitter.addOneTimeDisposableListener("onIdle", e);
    };

    r.prototype.onUserActive = function() {
      this.lastActiveTime = (new Date).getTime();

      if (1 !== this.status) {
        this.status = 1;
        this.scheduleIdleCheck();
        this.eventEmitter.emit("onActive");
      }
    };

    r.prototype.onUserIdle = function() {
      if (0 !== this.status) {
        this.status = 0;
        this.eventEmitter.emit("onIdle");
      }
    };

    r.prototype.scheduleIdleCheck = function() {
      var e = this;
      if (-1 === this.idleCheckTimeout) {
        var n = this.lastActiveTime + t.IDLE_TIME;
        this.idleCheckTimeout = setTimeout(function() {
          e.idleCheckTimeout = -1;

          e.checkIfUserIsIdle();
        }, n - (new Date).getTime());
      }
    };

    r.prototype.cancelIdleCheck = function() {
      if (-1 !== this.idleCheckTimeout) {
        clearTimeout(this.idleCheckTimeout);
        this.idleCheckTimeout = -1;
      }
    };

    r.prototype.checkIfUserIsIdle = function() {
      var e = (new Date).getTime() - this.lastActiveTime;
      e >= t.IDLE_TIME ? this.onUserIdle() : this.scheduleIdleCheck();
    };

    r.INSTANCE = new r;

    return r;
  }(s);
});

define("vs/platform/telemetry/telemetryService", ["require", "exports", "vs/base/strings", "vs/base/performance/timer",
  "vs/base/errors", "vs/base/types", "vs/base/env", "vs/base/time/idleMonitor", "vs/base/network"
], function(e, t, n, i, o, r, s, a, u) {
  var l = function() {
    function e(t, r) {
      if ("undefined" == typeof t) {
        t = !0;
      }

      if ("undefined" == typeof r) {
        r = null;
      }

      this.eventQueue = [];

      this.publicOnly = t;

      this.sessionID = n.generateUuid() + Date.now();

      this.eventMaxQueueSize = e.EVENT_QUEUE_LIMIT;

      this.eventBatchSize = e.EVENT_BATCH_SIZE;

      this.failureCount = 0;

      this.sendingEvents = !1;

      this.waitIntervalId = null;

      this.timeKeeper = new i.TimeKeeper;

      this.toUnbind = [];

      this.toUnbind.push(this.timeKeeper.addListener("eventStop", this.onTelemetryTimerEventStop.bind(this)));

      this.toUnbind.push(o.errorHandler.addListener(this.onErrorEvent.bind(this)));

      if (!r) {
        if (s.isInWebWorker() === !1) {
          r = new a.IdleMonitor;
        }
      }

      this.idleMonitor = r;

      this.authFilter = u.getBasicAuthRemover();
    }
    e.prototype.dispose = function() {
      for (; this.toUnbind.length;) {
        this.toUnbind.pop()();
      }
      this.timeKeeper.dispose();

      if (this.idleMonitor) {
        this.idleMonitor.dispose();
      }

      if (this.oldOnError) {
        self.onerror = this.oldOnError;
      }
    };

    e.prototype.onTelemetryTimerEventStop = function(e) {
      var t = e.data || {};
      t.duration = e.timeTaken();

      "public" === e.topic ? this.publicLog(e.name, t) : this.log(e.name, t);
    };

    e.prototype.onErrorEvent = function(e, t, n) {
      if ("undefined" == typeof t) {
        t = null;
      }

      if ("undefined" == typeof n) {
        n = null;
      }

      this.publicLog("UnhandledError", {
        friendlyMessage: t,
        name: e.name,
        message: e.message || e,
        stack: this.authFilter(e.stack)
      });
    };

    e.prototype.enableGlobalErrorHandler = function() {
      if (r.isFunction(self.onerror)) {
        this.oldOnError = self.onerror;
      }
      var e = this;

      var t = function(t, n, i, o, r) {
        e.onUncaughtError(t, n, i, o, r);

        if (e.oldOnError) {
          e.oldOnError.apply(this, arguments);
        }
      };
      self.onerror = t;
    };

    e.prototype.onUncaughtError = function(e, t, n, i, o) {
      var r = {
        message: e,
        filename: this.authFilter(t),
        line: n,
        column: i
      };
      if (o) {
        r.error = {
          name: o.name,
          message: o.message,
          stack: this.authFilter(o.stack)
        };
      }

      this.publicLog("UncaughtError", r);
    };

    e.prototype.injectRequestService = function(e) {
      this.requestService = e;
    };

    e.prototype.injectExperimentService = function(e) {
      this.experimentService = e;
    };

    e.prototype.start = function(e, t, n) {
      var i = n ? "public" : "private";

      var o = this.timeKeeper.start(i, e);
      t && (o.data = t);

      return o;
    };

    e.prototype.log = function(e, t) {
      if (!this.publicOnly) {
        this.handleEvent("restricted", e, t);
      }
    };

    e.prototype.publicLog = function(e, t) {
      this.handleEvent("public", e, t);
    };

    e.prototype.handleEvent = function(e, t, n) {
      if (!(this.eventQueue.length >= this.eventMaxQueueSize)) {
        n = n || {};
        n.source = "client";
        n.version = {
          clientVersion: s.version
        };
        this.eventQueue.push({
          name: t,
          kind: e,
          timestamp: new Date,
          data: JSON.stringify(n),
          activeExperiments: this.getEnabledExperiments(),
          sessionID: this.sessionID
        });
        if (!(this.sendingEvents || this.failureCount > 0)) {
          this.eventQueue.length > this.eventBatchSize ? (clearTimeout(this.waitIntervalId), this.waitIntervalId =
            null, this.sendEvents()) : this.sendSoon();
        }
      }
    };

    e.prototype.sendSoon = function() {
      var t = this;
      if (null === this.waitIntervalId) {
        this.waitIntervalId = setTimeout(function() {
          t.waitIntervalId = null;

          t.sendEvents();
        }, e.EVENT_INTERVAL * Math.pow(2, this.failureCount));
      }
    };

    e.prototype.sendEvents = function() {
      var e = this;
      if (!this.idleMonitor || 0 !== this.idleMonitor.getStatus()) {
        this.sendingEvents = !0;
        var t = this.eventQueue.splice(0, this.eventBatchSize);
        this.submitToServer(t).then(function() {
          e.failureCount = 0;
        }, function() {
          e.eventQueue.unshift.apply(e.eventQueue, t);

          e.failureCount++;
        }).done(function() {
          e.sendingEvents = !1;

          if (e.eventQueue.length > 0) {
            e.sendSoon();
          }
        });
      }
    };

    e.prototype.submitToServer = function(e) {
      var t = JSON.stringify(e);

      var n = this.requestService.getRequestUrl("telemetry");

      var i = {
        type: "POST",
        url: n,
        data: t,
        headers: {
          "Content-Type": "application/json"
        }
      };
      return this.requestService.makeRequest(i);
    };

    e.prototype.getQueueLength = function() {
      return this.eventQueue.length;
    };

    e.prototype.getEnabledExperiments = function() {
      return this.experimentService ? this.experimentService.getEnabled().join(";") : "";
    };

    e.EVENT_QUEUE_LIMIT = 1e4;

    e.EVENT_INTERVAL = 3e4;

    e.EVENT_BATCH_SIZE = 100;

    return e;
  }();
  t.TelemetryService = l;
  var c = function() {
    function e() {}
    e.prototype.log = function() {};

    e.prototype.publicLog = function() {};

    e.prototype.start = function() {
      return i.nullEvent;
    };

    return e;
  }();
  t.NullTelemetryService = c;

  t.nullService = new c;
});

define("vs/base/diff/diffChange", ["require", "exports"], function(e, t) {
  t.DifferenceType = {
    Add: 0,
    Remove: 1,
    Change: 2
  };
  var n = function() {
    function e(e, t, n, i) {
      this.originalStart = e;

      this.originalLength = t;

      this.modifiedStart = n;

      this.modifiedLength = i;
    }
    e.prototype.getChangeType = function() {
      return 0 === this.originalLength ? t.DifferenceType.Add : 0 === this.modifiedLength ? t.DifferenceType.Remove :
        t.DifferenceType.Change;
    };

    e.prototype.getOriginalEnd = function() {
      return this.originalStart + this.originalLength;
    };

    e.prototype.getModifiedEnd = function() {
      return this.modifiedStart + this.modifiedLength;
    };

    return e;
  }();
  t.DiffChange = n;
});

define("vs/base/diff/diff", ["require", "exports", "vs/base/diff/diffChange"], function(e, t, n) {
  var i = function() {
    function e() {}
    e.Assert = function(e, t) {
      if (!e) throw new Error(t);
    };

    return e;
  }();
  t.Debug = i;
  var o = function() {
    function e() {}
    e.Copy = function(e, t, n, i, o) {
      for (var r = 0; o > r; r++) {
        n[i + r] = e[t + r];
      }
    };

    return e;
  }();
  t.MyArray = o;
  var r = 1447;

  var s = function() {
    function e() {
      this.m_changes = [];

      this.m_originalStart = Number.MAX_VALUE;

      this.m_modifiedStart = Number.MAX_VALUE;

      this.m_originalCount = 0;

      this.m_modifiedCount = 0;
    }
    e.prototype.MarkNextChange = function() {
      if (this.m_originalCount > 0 || this.m_modifiedCount > 0) {
        this.m_changes.push(new n.DiffChange(this.m_originalStart, this.m_originalCount, this.m_modifiedStart, this.m_modifiedCount));
      }

      this.m_originalCount = 0;

      this.m_modifiedCount = 0;

      this.m_originalStart = Number.MAX_VALUE;

      this.m_modifiedStart = Number.MAX_VALUE;
    };

    e.prototype.AddOriginalElement = function(e, t) {
      this.m_originalStart = Math.min(this.m_originalStart, e);

      this.m_modifiedStart = Math.min(this.m_modifiedStart, t);

      this.m_originalCount++;
    };

    e.prototype.AddModifiedElement = function(e, t) {
      this.m_originalStart = Math.min(this.m_originalStart, e);

      this.m_modifiedStart = Math.min(this.m_modifiedStart, t);

      this.m_modifiedCount++;
    };

    e.prototype.getChanges = function() {
      (this.m_originalCount > 0 || this.m_modifiedCount > 0) && this.MarkNextChange();

      return this.m_changes;
    };

    e.prototype.getReverseChanges = function() {
      (this.m_originalCount > 0 || this.m_modifiedCount > 0) && this.MarkNextChange();

      this.m_changes.reverse();

      return this.m_changes;
    };

    return e;
  }();

  var a = function() {
    function e(e, t, n) {
      if ("undefined" == typeof n) {
        n = null;
      }

      this.OriginalSequence = e;

      this.ModifiedSequence = t;

      this.ContinueProcessingPredicate = n;

      this.m_originalIds = [];

      this.m_modifiedIds = [];

      this.m_forwardHistory = [];

      this.m_reverseHistory = [];

      this.ComputeUniqueIdentifiers();
    }
    e.prototype.ComputeUniqueIdentifiers = function() {
      var e = this.OriginalSequence.getLength();

      var t = this.ModifiedSequence.getLength();
      this.m_originalIds = new Array(e);

      this.m_modifiedIds = new Array(t);
      var n;

      var i = {};

      var o = 1;
      for (n = 0; e > n; n++) {
        var r = this.OriginalSequence.getElementHash(n);
        i.hasOwnProperty(r) ? this.m_originalIds[n] = i[r] : (this.m_originalIds[n] = o++, i[r] = this.m_originalIds[
          n]);
      }
      for (n = 0; t > n; n++) {
        var s = this.ModifiedSequence.getElementHash(n);
        i.hasOwnProperty(s) ? this.m_modifiedIds[n] = i[s] : (this.m_modifiedIds[n] = o++, i[s] = this.m_modifiedIds[
          n]);
      }
    };

    e.prototype.ElementsAreEqual = function(e, t) {
      return this.m_originalIds[e] === this.m_modifiedIds[t];
    };

    e.prototype.ComputeDiff = function() {
      return this._ComputeDiff(0, this.OriginalSequence.getLength() - 1, 0, this.ModifiedSequence.getLength() - 1);
    };

    e.prototype._ComputeDiff = function(e, t, n, i) {
      var o = [!1];
      return this.ComputeDiffRecursive(e, t, n, i, o);
    };

    e.prototype.ComputeDiffRecursive = function(e, t, o, r, s) {
      for (s[0] = !1; t >= e && r >= o && this.ElementsAreEqual(e, o);) {
        e++;
        o++;
      }
      for (; t >= e && r >= o && this.ElementsAreEqual(t, r);) {
        t--;
        r--;
      }
      if (e > t || o > r) {
        var a;
        r >= o ? (i.Assert(e === t + 1, "originalStart should only be one more than originalEnd"), a = [new n.DiffChange(
          e, 0, o, r - o + 1)]) : t >= e ? (i.Assert(o === r + 1,
          "modifiedStart should only be one more than modifiedEnd"), a = [new n.DiffChange(e, t - e + 1, o, 0)]) : (i
          .Assert(e === t + 1, "originalStart should only be one more than originalEnd"), i.Assert(o === r + 1,
            "modifiedStart should only be one more than modifiedEnd"), a = []);

        return a;
      }
      var u = [0];

      var l = [0];

      var c = this.ComputeRecursionPoint(e, t, o, r, u, l, s);

      var d = u[0];

      var h = l[0];
      if (null !== c) {
        return c;
      }
      if (!s[0]) {
        var p = this.ComputeDiffRecursive(e, d, o, h, s);

        var f = [];
        f = s[0] ? [new n.DiffChange(d + 1, t - (d + 1) + 1, h + 1, r - (h + 1) + 1)] : this.ComputeDiffRecursive(d +
          1, t, h + 1, r, s);

        return this.ConcatenateChanges(p, f);
      }
      return [new n.DiffChange(e, t - e + 1, o, r - o + 1)];
    };

    e.prototype.WALKTRACE = function(e, t, i, o, r, a, u, l, c, d, h, p, f, g, m, v, y, _) {
      var b;

      var C = null;

      var w = null;

      var E = new s;

      var S = t;

      var L = i;

      var T = f[0] - v[0] - o;

      var x = Number.MIN_VALUE;

      var N = this.m_forwardHistory.length - 1;
      do {
        b = T + e;
        b === S || L > b && c[b - 1] < c[b + 1] ? (h = c[b + 1], g = h - T - o, x > h && E.MarkNextChange(), x = h, E
          .AddModifiedElement(h + 1, g), T = b + 1 - e) : (h = c[b - 1] + 1, g = h - T - o, x > h && E.MarkNextChange(),
          x = h - 1, E.AddOriginalElement(h, g + 1), T = b - 1 - e);
        if (N >= 0) {
          c = this.m_forwardHistory[N];
          e = c[0];
          S = 1;
          L = c.length - 1;
        }
      } while (--N >= -1);
      if (C = E.getReverseChanges(), _[0]) {
        var M = f[0] + 1;

        var k = v[0] + 1;
        if (null !== C && C.length > 0) {
          var I = C[C.length - 1];
          M = Math.max(M, I.getOriginalEnd());

          k = Math.max(k, I.getModifiedEnd());
        }
        w = [new n.DiffChange(M, p - M + 1, k, m - k + 1)];
      } else {
        E = new s;

        S = a;

        L = u;

        T = f[0] - v[0] - l;

        x = Number.MAX_VALUE;

        N = y ? this.m_reverseHistory.length - 1 : this.m_reverseHistory.length - 2;
        do {
          b = T + r;
          b === S || L > b && d[b - 1] >= d[b + 1] ? (h = d[b + 1] - 1, g = h - T - l, h > x && E.MarkNextChange(), x =
            h + 1, E.AddOriginalElement(h + 1, g + 1), T = b + 1 - r) : (h = d[b - 1], g = h - T - l, h > x && E.MarkNextChange(),
            x = h, E.AddModifiedElement(h + 1, g + 1), T = b - 1 - r);
          if (N >= 0) {
            d = this.m_reverseHistory[N];
            r = d[0];
            S = 1;
            L = d.length - 1;
          }
        } while (--N >= -1);
        w = E.getChanges();
      }
      return this.ConcatenateChanges(C, w);
    };

    e.prototype.ComputeRecursionPoint = function(e, t, i, s, a, u, l) {
      var c;

      var d;

      var h;

      var p = 0;

      var f = 0;

      var g = 0;

      var m = 0;
      e--;

      i--;

      a[0] = 0;

      u[0] = 0;

      this.m_forwardHistory = [];

      this.m_reverseHistory = [];
      var v = t - e + (s - i);

      var y = v + 1;

      var _ = new Array(y);

      var b = new Array(y);

      var C = s - i;

      var w = t - e;

      var E = e - i;

      var S = t - s;

      var L = w - C;

      var T = L % 2 === 0;
      _[C] = e;

      b[w] = t;

      l[0] = !1;
      var x;

      var N;
      for (h = 1; v / 2 + 1 >= h; h++) {
        var M = 0;

        var k = 0;
        for (p = this.ClipDiagonalBound(C - h, h, C, y), f = this.ClipDiagonalBound(C + h, h, C, y), x = p; f >= x; x +=
          2) {
          for (c = x === p || f > x && _[x - 1] < _[x + 1] ? _[x + 1] : _[x - 1] + 1, d = c - (x - C) - E, N = c; t >
            c && s > d && this.ElementsAreEqual(c + 1, d + 1);) {
            c++;
            d++;
          }
          if (_[x] = c, c + d > M + k && (M = c, k = d), !T && Math.abs(x - w) <= h - 1 && c >= b[x]) {
            a[0] = c;
            u[0] = d;
            return N <= b[x] && r > 0 && r + 1 >= h ? this.WALKTRACE(C, p, f, E, w, g, m, S, _, b, c, t, a, d, s, u,
              T, l) : null;
          }
        }
        var I = (M - e + (k - i) - h) / 2;
        if (null !== this.ContinueProcessingPredicate && !this.ContinueProcessingPredicate(M, this.OriginalSequence,
          I)) {
          l[0] = !0;
          a[0] = M;
          u[0] = k;
          return I > 0 && r > 0 && r + 1 >= h ? this.WALKTRACE(C, p, f, E, w, g, m, S, _, b, c, t, a, d, s, u, T, l) :
            (e++, i++, [new n.DiffChange(e, t - e + 1, i, s - i + 1)]);
        }
        for (g = this.ClipDiagonalBound(w - h, h, w, y), m = this.ClipDiagonalBound(w + h, h, w, y), x = g; m >= x; x +=
          2) {
          for (c = x === g || m > x && b[x - 1] >= b[x + 1] ? b[x + 1] - 1 : b[x - 1], d = c - (x - w) - S, N = c; c >
            e && d > i && this.ElementsAreEqual(c, d);) {
            c--;
            d--;
          }
          if (b[x] = c, T && Math.abs(x - C) <= h && c <= _[x]) {
            a[0] = c;
            u[0] = d;
            return N >= _[x] && r > 0 && r + 1 >= h ? this.WALKTRACE(C, p, f, E, w, g, m, S, _, b, c, t, a, d, s, u,
              T, l) : null;
          }
        }
        if (r >= h) {
          var D = new Array(f - p + 2);
          D[0] = C - p + 1;

          o.Copy(_, p, D, 1, f - p + 1);

          this.m_forwardHistory.push(D);

          D = new Array(m - g + 2);

          D[0] = w - g + 1;

          o.Copy(b, g, D, 1, m - g + 1);

          this.m_reverseHistory.push(D);
        }
      }
      return this.WALKTRACE(C, p, f, E, w, g, m, S, _, b, c, t, a, d, s, u, T, l);
    };

    e.prototype.ConcatenateChanges = function(e, t) {
      var n = [];

      var i = null;
      return 0 === e.length || 0 === t.length ? t.length > 0 ? t : e : this.ChangesOverlap(e[e.length - 1], t[0], n) ?
        (i = new Array(e.length + t.length - 1), o.Copy(e, 0, i, 0, e.length - 1), i[e.length - 1] = n[0], o.Copy(t,
        1, i, e.length, t.length - 1), i) : (i = new Array(e.length + t.length), o.Copy(e, 0, i, 0, e.length), o.Copy(
        t, 0, i, e.length, t.length), i);
    };

    e.prototype.ChangesOverlap = function(e, t, o) {
      if (i.Assert(e.originalStart <= t.originalStart, "Left change is not less than or equal to right change"), i.Assert(
          e.modifiedStart <= t.modifiedStart, "Left change is not less than or equal to right change"), e.originalStart +
        e.originalLength >= t.originalStart || e.modifiedStart + e.modifiedLength >= t.modifiedStart) {
        var r = e.originalStart;

        var s = e.originalLength;

        var a = e.modifiedStart;

        var u = e.modifiedLength;
        e.originalStart + e.originalLength >= t.originalStart && (s = t.originalStart + t.originalLength - e.originalStart);

        e.modifiedStart + e.modifiedLength >= t.modifiedStart && (u = t.modifiedStart + t.modifiedLength - e.modifiedStart);

        o[0] = new n.DiffChange(r, s, a, u);

        return !0;
      }
      o[0] = null;

      return !1;
    };

    e.prototype.ClipDiagonalBound = function(e, t, n, i) {
      if (e >= 0 && i > e) {
        return e;
      }
      var o = n;

      var r = i - n - 1;

      var s = t % 2 === 0;
      if (0 > e) {
        var a = o % 2 === 0;
        return s === a ? 0 : 1;
      }
      var u = r % 2 === 0;
      return s === u ? i - 1 : i - 2;
    };

    return e;
  }();
  t.LcsDiff = a;
});

var __extends = this.__extends || function(e, t) {
    function n() {
      this.constructor = e;
    }
    for (var i in t) {
      if (t.hasOwnProperty(i)) {
        e[i] = t[i];
      }
    }
    n.prototype = t.prototype;

    e.prototype = new n;
  };

define("vs/editor/diff/diffComputer", ["require", "exports", "vs/base/diff/diff"], function(e, t, n) {
  function i(e) {
    if (e.length <= 1) {
      return e;
    }
    var t;

    var n;

    var i;

    var o;

    var s;

    var a;

    var u = [e[0]];

    var l = u[0];
    for (t = 1, n = e.length; n > t; t++) {
      a = e[t];
      i = a.originalStart - (l.originalStart + l.originalLength);
      o = a.modifiedStart - (l.modifiedStart + l.modifiedLength);
      s = Math.min(i, o);
      r > s ? (l.originalLength = a.originalStart + a.originalLength - l.originalStart, l.modifiedLength = a.modifiedStart +
        a.modifiedLength - l.modifiedStart) : (u.push(a), l = a);
    }
    return u;
  }
  var o = 2e3;

  var r = 3;

  var s = function() {
    function e(e, t, n) {
      this.buffer = e;

      this.startMarkers = t;

      this.endMarkers = n;
    }
    e.prototype.getLength = function() {
      return this.startMarkers.length;
    };

    e.prototype.getElementHash = function(e) {
      return this.buffer.substring(this.startMarkers[e].offset, this.endMarkers[e].offset);
    };

    e.prototype.getStartLineNumber = function(e) {
      return e === this.startMarkers.length ? this.startMarkers[e - 1].lineNumber + 1 : this.startMarkers[e].lineNumber;
    };

    e.prototype.getStartColumn = function(e) {
      return this.startMarkers[e].column;
    };

    e.prototype.getEndLineNumber = function(e) {
      return this.endMarkers[e].lineNumber;
    };

    e.prototype.getEndColumn = function(e) {
      return this.endMarkers[e].column;
    };

    return e;
  }();

  var a = function(e) {
    function t(t, n) {
      var i;

      var o;

      var r;

      var s;

      var a;

      var u = "";

      var l = [];

      var c = [];
      for (r = 0, i = 0, o = t.length; o > i; i++) {
        u += t[i];
        s = 1;
        a = t[i].length + 1;
        if (n) {
          s = this._getFirstNonBlankColumn(t[i], 1);
          a = this._getLastNonBlankColumn(t[i], 1);
        }
        l.push({
          offset: r + s - 1,
          lineNumber: i + 1,
          column: s
        });
        c.push({
          offset: r + a - 1,
          lineNumber: i + 1,
          column: a
        });
        r += t[i].length;
      }
      e.call(this, u, l, c);
    }
    __extends(t, e);

    t.prototype._getFirstNonBlankColumn = function(e, t) {
      for (var n = 0, i = e.length; i > n; n++)
        if (" " !== e.charAt(n) && "	" !== e.charAt(n)) {
          return n + 1;
        }
      return t;
    };

    t.prototype._getLastNonBlankColumn = function(e, t) {
      for (var n = e.length - 1; n >= 0; n--)
        if (" " !== e.charAt(n) && "	" !== e.charAt(n)) {
          return n + 2;
        }
      return t;
    };

    t.prototype.getCharSequence = function(e, t) {
      var n;

      var i;

      var o;

      var r;

      var a = [];

      var u = [];
      for (n = e; t >= n; n++)
        for (o = this.startMarkers[n], r = this.endMarkers[n], i = o.offset; i < r.offset; i++) {
          a.push({
            offset: i,
            lineNumber: o.lineNumber,
            column: o.column + (i - o.offset)
          });
          u.push({
            offset: i + 1,
            lineNumber: o.lineNumber,
            column: o.column + (i - o.offset) + 1
          });
        }
      return new s(this.buffer, a, u);
    };

    return t;
  }(s);

  var u = function() {
    function e(e, t, n) {
      0 === e.originalLength ? (this.originalStartLineNumber = 0, this.originalStartColumn = 0, this.originalEndLineNumber =
        0, this.originalEndColumn = 0) : (this.originalStartLineNumber = t.getStartLineNumber(e.originalStart), this.originalStartColumn =
        t.getStartColumn(e.originalStart), this.originalEndLineNumber = t.getEndLineNumber(e.originalStart + e.originalLength -
          1), this.originalEndColumn = t.getEndColumn(e.originalStart + e.originalLength - 1));

      0 === e.modifiedLength ? (this.modifiedStartLineNumber = 0, this.modifiedStartColumn = 0, this.modifiedEndLineNumber =
        0, this.modifiedEndColumn = 0) : (this.modifiedStartLineNumber = n.getStartLineNumber(e.modifiedStart), this.modifiedStartColumn =
        n.getStartColumn(e.modifiedStart), this.modifiedEndLineNumber = n.getEndLineNumber(e.modifiedStart + e.modifiedLength -
          1), this.modifiedEndColumn = n.getEndColumn(e.modifiedStart + e.modifiedLength - 1));
    }
    return e;
  }();

  var l = function() {
    function e(e, t, o, r, s) {
      if (0 === e.originalLength ? (this.originalStartLineNumber = t.getStartLineNumber(e.originalStart) - 1, this.originalEndLineNumber =
          0) : (this.originalStartLineNumber = t.getStartLineNumber(e.originalStart), this.originalEndLineNumber = t.getEndLineNumber(
          e.originalStart + e.originalLength - 1)), 0 === e.modifiedLength ? (this.modifiedStartLineNumber = o.getStartLineNumber(
          e.modifiedStart) - 1, this.modifiedEndLineNumber = 0) : (this.modifiedStartLineNumber = o.getStartLineNumber(
          e.modifiedStart), this.modifiedEndLineNumber = o.getEndLineNumber(e.modifiedStart + e.modifiedLength - 1)),
        0 !== e.originalLength && 0 !== e.modifiedLength && r()) {
        var a = t.getCharSequence(e.originalStart, e.originalStart + e.originalLength - 1);

        var l = o.getCharSequence(e.modifiedStart, e.modifiedStart + e.modifiedLength - 1);

        var c = new n.LcsDiff(a, l, r);

        var d = c.ComputeDiff();
        if (s) {
          d = i(d);
        }

        this.charChanges = [];
        for (var h = 0, p = d.length; p > h; h++) {
          this.charChanges.push(new u(d[h], a, l));
        }
      }
    }
    return e;
  }();

  var c = function() {
    function e(e, t, n, i) {
      this.shouldPostProcessCharChanges = n || !1;

      this.shouldIgnoreTrimWhitespace = i || !1;

      this.maximumRunTimeMs = o;

      this.original = new a(e, this.shouldIgnoreTrimWhitespace);

      this.modified = new a(t, this.shouldIgnoreTrimWhitespace);
    }
    e.prototype.computeDiff = function() {
      this.computationStartTime = (new Date).getTime();
      for (var e = new n.LcsDiff(this.original, this.modified, this._continueProcessingPredicate.bind(this)), t = e.ComputeDiff(),
          i = [], o = 0, r = t.length; r > o; o++) {
        i.push(new l(t[o], this.original, this.modified, this._continueProcessingPredicate.bind(this), this.shouldPostProcessCharChanges));
      }
      return i;
    };

    e.prototype._continueProcessingPredicate = function() {
      if (0 === this.maximumRunTimeMs) {
        return !0;
      }
      var e = (new Date).getTime();
      return e - this.computationStartTime < this.maximumRunTimeMs;
    };

    return e;
  }();
  t.DiffComputer = c;
});

define("vs/base/filters", ["require", "exports", "vs/base/strings"], function(e, t, n) {
  function i() {
    for (var e = [], t = 0; t < arguments.length - 0; t++) {
      e[t] = arguments[t + 0];
    }
    return function(t, n) {
      for (var i = 0, o = e.length; o > i; i++) {
        var r = e[i](t, n);
        if (r) {
          return r;
        }
      }
      return null;
    };
  }

  function o() {
    for (var e = [], t = 0; t < arguments.length - 0; t++) {
      e[t] = arguments[t + 0];
    }
    return function(t, n) {
      for (var i = [], o = 0, r = e.length; r > o; o++) {
        var s = e[o](t, n);
        if (!s) {
          return null;
        }
        i = i.concat(s);
      }
      return i;
    };
  }

  function r(e, t, n) {
    if (0 === n.length || n.length < t.length) {
      return null;
    }
    if (e) {
      t = t.toLowerCase();
      n = n.toLowerCase();
    }
    for (var i = 0; i < t.length; i++)
      if (t[i] !== n[i]) {
        return null;
      }
    return t.length > 0 ? [{
      start: 0,
      end: t.length
    }] : [];
  }

  function s(e, t) {
    var n = t.toLowerCase().indexOf(e.toLowerCase());
    return -1 === n ? null : [{
      start: n,
      end: n + e.length
    }];
  }

  function a(e, t) {
    return u(e.toLowerCase(), t.toLowerCase(), 0, 0);
  }

  function u(e, t, n, i) {
    if (n === e.length) {
      return [];
    }
    if (i === t.length) {
      return null;
    }
    if (e[n] === t[i]) {
      var o = null;
      if (o = u(e, t, n + 1, i + 1)) {
        return h({
          start: i,
          end: i + 1
        }, o);
      }
    }
    return u(e, t, n, i + 1);
  }

  function l(e, t) {
    if (0 === t.length) {
      return null;
    }
    for (var n = null, i = 0; i < t.length && null === (n = f(e.toLowerCase(), t, 0, i));) {
      i = p(t, i + 1);
    }
    return n;
  }

  function c(e) {
    var t = e.charCodeAt(0);
    return t >= 65 && 90 >= t;
  }

  function d(e) {
    var t = e.charCodeAt(0);
    return t >= 48 && 57 >= t;
  }

  function h(e, t) {
    0 === t.length ? t = [e] : e.end === t[0].start ? t[0].start = e.start : t.unshift(e);

    return t;
  }

  function p(e, t) {
    for (var n = t; n < e.length; n++) {
      var i = e[n];
      if (c(i) || d(i)) {
        return n;
      }
    }
    return e.length;
  }

  function f(e, t, n, i) {
    if (n === e.length) {
      return [];
    }
    if (i === t.length) {
      return null;
    }
    if (e[n] !== t[i].toLowerCase()) {
      return null;
    }
    var o = null;

    var r = i + 1;
    for (o = f(e, t, n + 1, i + 1); !o && (r = p(t, r)) < t.length;) {
      o = f(e, t, n + 1, r);
      r++;
    }
    return null === o ? null : h({
      start: i,
      end: i + 1
    }, o);
  }
  t.or = i;

  t.and = o;

  t.matchesStrictPrefix = function(e, t) {
    return r(!1, e, t);
  };

  t.matchesPrefix = function(e, t) {
    return r(!0, e, t);
  };

  t.matchesContiguousSubString = s;

  t.matchesSubString = a;

  t.matchesCamelCase = l;
  var g = function() {
    function e() {}
    e.matches = function(t, i) {
      var o = e.RegExpCache[t];
      if (!o) {
        o = new RegExp(n.convertSimple2RegExpPattern(t), "i");
        e.RegExpCache[t] = o;
      }
      var r = o.exec(i);
      return r ? [{
        start: r.index,
        end: r.index + r[0].length
      }] : e.DefaultFilter(t, i);
    };

    e.DefaultFilter = t.or(t.matchesPrefix, t.matchesCamelCase, t.matchesContiguousSubString);

    e.RegExpCache = {};

    return e;
  }();
  t.CombinedMatcher = g;
});

define("vs/editor/modes/modesFilters", ["require", "exports", "vs/base/filters"], function(e, t, n) {
  function i(e) {
    return function(t, n) {
      var i = e(t, n.label);
      n.highlights = i || [];

      return !!i;
    };
  }

  function o(e, t) {
    return function(n, i) {
      return e(n, i) || t(n, i);
    };
  }

  function r(e, t) {
    return function(n, i) {
      return e(n, i) && t(n, i);
    };
  }

  function s(e) {
    var t = {};
    return function(n, i) {
      var o = e(i);
      return t[o] ? !1 : (t[o] = !0, !0);
    };
  }
  t.StrictPrefix = i(n.matchesStrictPrefix);

  t.Prefix = i(n.matchesPrefix);

  t.CamelCase = i(n.matchesCamelCase);

  t.ContiguousSubString = i(n.matchesContiguousSubString);

  t.or = o;

  t.and = r;

  t.newDuplicateFilter = s;

  t.DefaultFilter = t.or(t.or(t.Prefix, t.CamelCase), t.ContiguousSubString);
});

define("vs/editor/worker/modesWorker", ["require", "exports", "vs/base/lib/winjs.base", "vs/editor/diff/diffComputer",
  "vs/editor/modes/modesFilters", "vs/editor/core/model/textModel"
], function(e, t, n, i, o, r) {
  var s = function() {
    function e() {
      this.workerParticipants = [];

      this.autoValidateDelay = 500;
    }
    e.prototype.injectPublisherService = function(e) {
      this.publisher = e;
    };

    e.prototype.injectResourceService = function(e) {
      this.resourceService = e;
    };

    e.prototype.injectDispatcherService = function(e) {
      this.dispatchService = e;

      this.dispatchService.register(this);
    };

    e.prototype.injectMarkerService = function(e) {
      this.markerService = e;
    };

    e.prototype.setExtraData = function() {};

    e.prototype.addWorkerParticipant = function(e) {
      this.workerParticipants.push(e);
    };

    e.prototype.validate = function(e) {
      var t = this;
      this.markerService.createPublisher().batchChanges(function(n) {
        t.doValidate(e, n);

        t.triggerValidateParticipation(e, n);
      });

      return n.Promise.as(null);
    };

    e.prototype.triggerValidateParticipation = function(e, t, n) {
      if ("undefined" == typeof n) {
        n = null;
      }
      var i = this.resourceService.get(e);
      this.workerParticipants.forEach(function(e) {
        try {
          if ("function" != typeof e.validate) return;
          e.validate(i, t, n);
        } catch (o) {}
      });
    };

    e.prototype.doValidate = function() {};

    e.prototype.suggest = function(e, t) {
      var i = this;

      var o = [];

      var r = this.resourceService.get(e);

      var s = r.getWordUntilPosition(t);

      var a = {
        currentWord: s,
        suggestions: []
      };
      o.push(this.doSuggest(e, t));

      this.workerParticipants.forEach(function(e) {
        try {
          if ("function" == typeof e.suggest) {
            o.push(e.suggest(t, r));
          }
        } catch (n) {}
      });

      return n.Promise.join(o).then(function(e) {
        for (var t = i.getSuggestionFilterMain(), n = 0; n < e.length; n++) {
          e[n].forEach(function(e) {
            if (t(s, e)) {
              a.suggestions.push(e);
            }
          });
        }
        return a;
      }, function() {
        a.currentWord = "";

        a.suggestions = [];

        return a;
      });
    };

    e.prototype.doSuggest = function(e, t) {
      var i = [];
      i.push.apply(i, this.suggestWords(e, t));

      i.push.apply(i, this.suggestSnippets(e, t));

      return n.Promise.as(i);
    };

    e.prototype.suggestWords = function(e, t) {
      var n = this.resourceService.get(e);

      var i = n.getWordUntilPosition(t);

      var o = n.getAllUniqueWords(i);
      return o.filter(function(e) {
        return !/^-?\d*\.?\d/.test(e);
      }).map(function(e) {
        return {
          type: "text",
          label: e,
          codeSnippet: e
        };
      });
    };

    e.prototype.suggestSnippets = function() {
      return [];
    };

    e.prototype.getSuggestionFilterMain = function() {
      var e = this.getSuggestionFilter();
      this.workerParticipants.forEach(function(t) {
        if ("function" == typeof t.filter) {
          e = o.and(e, t.filter);
        }
      });

      return e;
    };

    e.prototype.getSuggestionFilter = function() {
      return e.filter;
    };

    e.prototype.findOccurrences = function(e, t) {
      var i = this.resourceService.get(e);

      var o = i.getWordAtPosition(t);

      var r = [];
      i.getAllWordsWithRange().forEach(function(e) {
        if (e.text === o) {
          r.push({
            range: e.range
          });
        }
      });

      return n.TPromise.as(r.slice(0, 1e3));
    };

    e.prototype.computeDiff = function(e, t) {
      var o = this.resourceService.get(e);

      var r = this.resourceService.get(t);
      if (null !== o && null !== r) {
        var s = o.getRawLines();

        var a = r.getRawLines();

        var u = new i.DiffComputer(s, a, !0, !0);
        return n.TPromise.as(u.computeDiff());
      }
      return n.TPromise.as(null);
    };

    e.prototype.computeDirtyDiff = function(e) {
      var t = this.resourceService.get(e);

      var o = t.getProperty("original");
      if (o && null !== t) {
        var s = r.TextModel._splitText(o);

        var a = s.lines.map(function(e) {
          return e.text;
        });

        var u = t.getRawLines();

        var l = new i.DiffComputer(a, u, !1, !0);
        return n.TPromise.as(l.computeDiff());
      }
      return n.TPromise.as([]);
    };

    e.prototype.navigateValueSet = function(e, t, i) {
      var o = this.doNavigateValueSet(e, t, i, !0);
      return n.TPromise.as(o && o.value && o.range ? o : null);
    };

    e.prototype.doNavigateValueSet = function(e, t, n, i) {
      var o;

      var r = this.resourceService.get(e);

      var s = {
        range: null,
        value: null
      };
      if (i) {
        if (t.startColumn === t.endColumn) {
          t.endColumn += 1;
        }
        o = r.getValueInRange(t);
        s.range = t;
      } else {
        var a = {
          lineNumber: t.startLineNumber,
          column: t.startColumn
        };

        var u = r.getWordUntilPosition(a);
        if (o = r.getWordAtPosition(a), 0 !== o.indexOf(u)) {
          return null;
        }
        if (o.length < t.endColumn - t.startColumn) {
          return null;
        }
        s.range = t;

        s.range.startColumn = a.column - u.length;

        s.range.endColumn = s.range.startColumn + o.length;
      }
      var l = this.numberReplace(o, n);
      if (null !== l) {
        s.value = l;
      } else {
        var c = this.textReplace(o, n);
        if (null !== c) {
          s.value = c;
        } else if (i) {
          return this.doNavigateValueSet(e, t, n, !1);
        }
      }
      return s;
    };

    e.prototype.numberReplace = function(e, t) {
      var n = Math.pow(10, e.length - (e.lastIndexOf(".") + 1));

      var i = Number(e);

      var o = parseFloat(e);
      return isNaN(i) || isNaN(o) || i !== o ? null : 0 !== i || t ? (i = Math.floor(i * n), i += t ? n : -n, String(
        i / n)) : null;
    };

    e.prototype.textReplace = function() {
      return null;
    };

    e.prototype.valueSetsReplace = function(e, t, n) {
      for (var i = null; e.length > 0 && null === i;) {
        i = this.valueSetReplace(e.pop(), t, n);
      }
      return i;
    };

    e.prototype.valueSetReplace = function(e, t, n) {
      var i = e.indexOf(t);
      return i >= 0 ? (i += n ? 1 : -1, 0 > i ? i = e.length - 1 : i %= e.length, e[i]) : null;
    };

    e.prototype.getActionsAtPosition = function(e, t) {
      var i = this.resourceService.get(e);

      var o = i.getWordAtPosition(t);
      return o ? n.Promise.as(["editor.actions.changeAll"]) : n.Promise.as([]);
    };

    e.prototype.createLink = function(e, t, n, i) {
      return {
        range: {
          startLineNumber: t,
          startColumn: n + 1,
          endLineNumber: t,
          endColumn: i + 1
        },
        url: e.substring(n, i)
      };
    };

    e.prototype.computeLinks = function(e) {
      var t;

      var i;

      var o = this.resourceService.get(e);

      var r = [];

      var s = [];

      var a = 1;

      var u = 9;

      var l = 10;
      s[1] = {
        h: 2,
        H: 2
      };

      s[2] = {
        t: 3,
        T: 3
      };

      s[3] = {
        t: 4,
        T: 4
      };

      s[4] = {
        p: 5,
        P: 5
      };

      s[5] = {
        s: 6,
        S: 6,
        ":": 7
      };

      s[6] = {
        ":": 7
      };

      s[7] = {
        "/": 8
      };

      s[8] = {
        "/": 9
      };
      var c = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789-?=&#@:+%";

      var d = [];

      var h = 0;
      for (t = 0; t < c.length; t++) {
        h = Math.max(h, c.charCodeAt(t));
      }
      h = Math.max("<".charCodeAt(0), "(".charCodeAt(0), "[".charCodeAt(0), "{".charCodeAt(0));
      for (var t = 0; h >= t; t++) {
        d[t] = String.fromCharCode(t);
      }
      for (t = 0; t < c.length; t++) {
        d[c.charCodeAt(t)] = null;
      }
      d["<".charCodeAt(0)] = ">";

      d["(".charCodeAt(0)] = ")";

      d["[".charCodeAt(0)] = "]";

      d["{".charCodeAt(0)] = "}";
      var p;

      var f;

      var g;

      var m;

      var v;

      var y;

      var _;

      var b;

      var C;
      for (t = 1, i = o.getLineCount(); i >= t; t++) {
        for (p = o.getLineContent(t), f = 0, g = p.length, m = null, v = 0, y = a; g > f;) {
          _ = p.charAt(f);
          C = !1;
          y === l ? (" " === _ || "	" === _ || _ === m) && (r.push(this.createLink(p, t, v, f)), C = !0) : y === u ?
            " " === _ || "	" === _ || _ === m ? C = !0 : y = l : s[y].hasOwnProperty(_) ? y = s[y][_] : C = !0;
          if (C) {
            y = a;
            v = f + 1;
            b = p.charCodeAt(f);
            m = b < d.length ? d[b] : _;
          }
          f++;
        }
        if (y === l) {
          r.push(this.createLink(p, t, v, g));
        }
      }
      return n.TPromise.as(r);
    };

    e.filter = o.DefaultFilter;

    return e;
  }();
  t.AbstractWorkerMode = s;
});

define("vs/editor/worker/editorWorkerServer", ["require", "exports", "vs/base/lib/winjs.base", "vs/base/types",
  "vs/platform/services", "vs/platform/injectorService", "vs/platform/telemetry/telemetryService",
  "./resourceService", "./dispatcherService", "vs/platform/markers/markersWorker", "vs/editor/core/model/mirrorModel",
  "vs/base/env", "vs/editor/worker/modesWorker"
], function(e, t, n, i, o, r, s, a, u, l, c, d) {
  var h = function() {
    function e() {}
    e.prototype.injectPublisherService = function(e) {
      this.publisher = e;
    };

    e.prototype.injectResourceService = function(e) {
      this.resourceService = e;
    };

    e.prototype.createPublisher = function() {
      for (var e = this.resourceService.all(), t = [], n = 0, i = e.length; i > n; n++) {
        if (e[n] instanceof c.MirrorModel) {
          t.push(e[n]);
        }
      }
      return new l.MarkerPublisher(t, this.publisher);
    };

    return e;
  }();

  var p = function() {
    function t() {
      var e = this;
      this.dispatcherService = new u.DispatcherService;

      this.modePromise = new n.Promise(function(t) {
        e.modeCompleteCallback = t;
      });
    }
    t.prototype.initialize = function(t, i, u, l, c) {
      var p = this;
      try {
        var f = {
          sendMessage: function(e, n) {
            t.request(e, n);
          }
        };

        var g = !c.workspace || !c.workspace.telemetry;
        g = g && d.enableTelemetry;
        var m = r.create({
          contextService: new o.BaseContextService(c.workspace, c.configuration, c.options),
          requestService: new o.BaseRequestService,
          resourceService: new a.WorkerResourceService,
          dispatcherService: this.dispatcherService,
          publisherService: f,
          markerService: new h,
          telemetryService: g ? s.nullService : new s.TelemetryService(!d.enablePrivateTelemetry)
        });
        e([c.languageModeModuleId], function(e) {
          if (m.injectTo(e.value), "function" == typeof e.value.setExtraData && e.value.setExtraData(c.extraData ||
            null), "function" == typeof e.value.configure && e.value.configure(c.configData || null).done(null,
            function(e) {
              u(p._transformError(e));
            }), c.participants && c.participants.length > 0) {
            for (var o = [], r = function(n) {
                return function(i, o, r) {
                  p._loadWorkerParticipant(t, e.value, i, o, r, n);
                };
              }, s = 0; s < c.participants.length; s++) {
              o.push(new n.Promise(r(c.participants[s])));
            }
            n.Promise.join(o).then(function() {
              p.modeCompleteCallback(e.value);

              i(null);
            }, function(t) {
              u(p._transformError(t));

              p.modeCompleteCallback(e.value);

              i(null);
            });
          } else {
            p.modeCompleteCallback(e.value);
            i(null);
          }
        });
      } catch (v) {
        u(this._transformError(v));
      }
    };

    t.prototype.request = function(e, t, n, i, o) {
      o.mainThread = e;

      this.dispatcherService.dispatch(o).then(t, n, i);
    };

    t.prototype.addWorkerParticipant = function(e, t, n, i, o) {
      var r = this;
      this.modePromise.then(function(s) {
        r._loadWorkerParticipant(e, s, t, n, i, o);
      }).done(null, n);
    };

    t.prototype._loadWorkerParticipant = function(e, t, n, o, r, s) {
      e.loadModule(s.moduleId, function(e) {
        if (i.isUndefinedOrNull(e[s.ctorName])) {
          var r = "module " + s._moduleId + " doesn't export " + s.ctorName;
          o(new Error(r));
        }
        var a = i.create(e[s.ctorName]);
        t.addWorkerParticipant(a);

        n(null);
      }, o);
    };

    t.prototype._transformError = function(e) {
      var t = {};
      e.stacktrace ? t.stack = e.stacktrace.split("\n") : e.stack && (t.stack = e.stack.split("\n"));

      t.message = e.toString();

      return t;
    };

    return t;
  }();
  t.EditorWorkerServer = p;

  t.value = new p;
});

define("vs/base/severity", ["require", "exports", "vs/base/strings"], function(e, t, n) {
  function i(e) {
    return e ? n.equalsIgnoreCase(r, e) ? o.Error : n.equalsIgnoreCase(s, e) || n.equalsIgnoreCase(a, e) ? o.Warning :
      n.equalsIgnoreCase(u, e) ? o.Info : 0 : 0;
  }! function(e) {
    e[e.Ignore = 0] = "Ignore";

    e[e.Info = 1] = "Info";

    e[e.Warning = 2] = "Warning";

    e[e.Error = 4] = "Error";
  }(t.Severity || (t.Severity = {}));
  var o = t.Severity;

  var r = "error";

  var s = "warning";

  var a = "warn";

  var u = "info";
  t.fromValue = i;
});