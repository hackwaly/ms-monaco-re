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
        if (e >= r) {
          c();
        } else {
          if (!l) {
            l = !0;
            t.scheduleAtNextAnimationFrame(d, Number.MAX_VALUE);
          }
        }
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
      if (t >= r) {
        if (-1 !== u) {
          window.clearTimeout(u);
        }
        l();
      } else {
        if (-1 === u) {
          u = window.setTimeout(l, r - t);
        }
      }
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
        if (n.isTesting()) {
          if (r) {
            r = !1;
            i = !1;
            s.emit("blur", {});
          }
        } else {
          window.setTimeout(function() {
            if (r) {
              r = !1;
              i = !1;
              s.emit("blur", {});
            }
          }, 0);
        }
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
      if (t.className) {
        e(t, i);
        if (-1 === n) {
          t.className = t.className + " " + i;
        }
      } else {
        t.className = i;
      }
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
      if (e.preventDefault) {
        e.preventDefault();
      } else {
        e.returnValue = !1;
      }

      if (t) {
        if (e.stopPropagation) {
          e.stopPropagation();
        } else {
          e.cancelBubble = !0;
        }
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