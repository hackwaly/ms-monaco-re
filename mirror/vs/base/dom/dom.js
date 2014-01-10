define(["require", "exports", "vs/base/env", "vs/base/types", "vs/base/eventEmitter", "vs/base/dom/mockDom"], function(
  a, b, c, d, e, f) {
  function k(a) {
    while (a.firstChild) a.removeChild(a.firstChild)
  }

  function l(a) {
    while (a) {
      if (a === document.body) return !0;
      a = a.parentNode
    }
    return !1
  }

  function m(a, b, c, d) {
    var e = function(a) {
      a = a || window.event, c(a)
    };
    return h.isFunction(a.addEventListener) ? (a.addEventListener(b, e, d || !1), function() {
      if (!e) return;
      a.removeEventListener(b, e, d || !1), e = null, a = null, c = null
    }) : (a.attachEvent("on" + b, e), function() {
      a.detachEvent("on" + b, e)
    })
  }

  function n(a, c, d, e) {
    var f = b.addListener(a, c, d, e);
    return {
      dispose: f
    }
  }

  function o(a, c) {
    return b.addListener(a, "mouseout", function(b) {
      var d = b.relatedTarget || b.toElement;
      while (d && d !== a) d = d.parentNode;
      if (d === a) return;
      c(b)
    })
  }

  function r(a, c, d, e, f) {
    typeof e == "undefined" && (e = q), typeof f == "undefined" && (f = 0);
    var g = null,
      h = 0,
      i = !1,
      j = !1,
      k = function() {
        h = (new Date).getTime(), d(g), g = null
      }, l = function() {
        j = !1;
        if (i) return;
        var a = (new Date).getTime() - h;
        a >= f ? k() : j || (j = !0, b.scheduleAtNextAnimationFrame(l))
      }, m = b.addListener(a, c, function(a) {
        g = e(g, a), j || (j = !0, b.scheduleAtNextAnimationFrame(l))
      });
    return function() {
      i = !0, m()
    }
  }

  function s(a, c, d, e, f) {
    typeof e == "undefined" && (e = q), typeof f == "undefined" && (f = p);
    var g = null,
      h = 0,
      i = -1,
      j = function() {
        i = -1, h = (new Date).getTime(), d(g), g = null
      }, k = b.addListener(a, c, function(a) {
        g = e(g, a);
        var b = (new Date).getTime() - h;
        b >= f ? (i !== -1 && window.clearTimeout(i), j()) : i === -1 && (i = window.setTimeout(j, f - b))
      });
    return function() {
      i !== -1 && window.clearTimeout(i), k()
    }
  }

  function t(a) {
    return document.defaultView && h.isFunction(document.defaultView.getComputedStyle) ? document.defaultView.getComputedStyle(
      a, null) : a.currentStyle
  }

  function v(a, c, d) {
    var e = b.getComputedStyle(a),
      f = "0";
    return e.getPropertyValue ? f = e.getPropertyValue(c) : f = e.getAttribute(d), u(a, f)
  }

  function x(a) {
    var c = a.offsetParent,
      d = a.offsetTop,
      e = a.offsetLeft;
    while ((a = a.parentNode) !== null && a !== document.body && a !== document.documentElement) {
      d -= a.scrollTop;
      var f = b.getComputedStyle(a);
      f && (e -= f.direction !== "rtl" ? a.scrollLeft : -a.scrollLeft), a === c && (e += w.getBorderLeftWidth(a), d +=
        w.getBorderTopWidth(a), d += a.offsetTop, e += a.offsetLeft, c = a.offsetParent)
    }
    return {
      left: e,
      top: d
    }
  }

  function y(a) {
    var c = b.getTopLeftOffset(a);
    return {
      left: c.left,
      top: c.top,
      width: a.clientWidth,
      height: a.clientHeight
    }
  }

  function z(a) {
    var b = w.getBorderLeftWidth(a) + w.getBorderRightWidth(a),
      c = w.getPaddingLeft(a) + w.getPaddingRight(a);
    return a.offsetWidth - b - c
  }

  function A(a) {
    var b = w.getMarginLeft(a) + w.getMarginRight(a);
    return a.offsetWidth + b
  }

  function B(a) {
    var b = w.getBorderTopWidth(a) + w.getBorderBottomWidth(a),
      c = w.getPaddingTop(a) + w.getPaddingBottom(a);
    return a.offsetHeight - b - c
  }

  function C(a) {
    var b = w.getMarginTop(a) + w.getMarginBottom(a);
    return a.offsetHeight + b
  }

  function D(a, b) {
    if (a === null) return 0;
    var c = a.offsetLeft,
      d = a.parentNode;
    while (d !== null) {
      c -= d.offsetLeft;
      if (d === b) break;
      d = d.parentNode
    }
    return c
  }

  function E(a, b) {
    if (a === null) return 0;
    var c = a.offsetTop,
      d = a.parentNode;
    while (d !== null) {
      c -= d.offsetTop;
      if (d === b) break;
      d = d.parentNode
    }
    return c
  }

  function F(a, b) {
    while (a) {
      if (a === b) return !0;
      a = a.parentNode
    }
    return !1
  }

  function H() {
    G = document.createElement("style"), G.type = "text/css", G.media = "screen", document.getElementsByTagName(
      "head")[0].appendChild(G)
  }

  function I(a, b) {
    if (g.isTesting()) return;
    if (!b) return;
    G || H(), G.sheet ? G.sheet.insertRule(a + "{" + b + "}", 0) : G.styleSheet.addRule(a, b)
  }

  function J(a) {
    return typeof HTMLElement == "object" ? a instanceof HTMLElement || a instanceof j.MockElement : a && typeof a ==
      "object" && a.nodeType === 1 && typeof a.nodeName == "string"
  }

  function K(a) {
    var c = !1,
      d = !1,
      e = new i.EventEmitter,
      f = [],
      g = null;
    g = {
      addFocusListener: function(a) {
        var b = e.addListener("focus", a);
        return f.push(b), b
      },
      addBlurListener: function(a) {
        var b = e.addListener("blur", a);
        return f.push(b), b
      },
      dispose: function() {
        while (f.length > 0) f.pop()()
      }
    };
    var h = function(a) {
      d = !1, c || (c = !0, e.emit("focus", {}))
    }, j = function(a) {
        c && (d = !0, window.setTimeout(function() {
          d && (d = !1, c = !1, e.emit("blur", {}))
        }, 0))
      };
    return f.push(b.addListener(a, b.EventType.FOCUS, h, !0)), f.push(b.addListener(a, b.EventType.BLUR, j, !0)), g
  }
  var g = c,
    h = d,
    i = e,
    j = f;
  b.clearNode = k, b.isInDOM = l, b.hasClass, b.addClass, b.removeClass, b.toggleClass,
  function() {
    function e(b, e) {
      var f = b.className;
      if (!f) {
        c = -1;
        return
      }
      e = e.trim();
      var g = f.length,
        h = e.length;
      if (h === 0) {
        c = -1;
        return
      }
      if (g < h) {
        c = -1;
        return
      }
      if (f === e) {
        c = 0, d = g;
        return
      }
      var i = -1,
        j;
      while ((i = f.indexOf(e, i + 1)) >= 0) {
        j = i + h;
        if ((i === 0 || f.charCodeAt(i - 1) === a) && f.charCodeAt(j) === a) {
          c = i, d = j + 1;
          return
        }
        if (i > 0 && f.charCodeAt(i - 1) === a && j === g) {
          c = i - 1, d = j;
          return
        }
        if (i === 0 && j === g) {
          c = 0, d = j;
          return
        }
      }
      c = -1
    }
    var a = " ".charCodeAt(0),
      c, d;
    b.hasClass = function(a, b) {
      return e(a, b), c !== -1
    }, b.addClass = function(a, b) {
      a.className ? (e(a, b), c === -1 && (a.className = a.className + " " + b)) : a.className = b
    }, b.removeClass = function(a, b) {
      e(a, b);
      if (c === -1) return;
      a.className = a.className.substring(0, c) + a.className.substring(d)
    }, b.toggleClass = function(a, d, f) {
      e(a, d), c !== -1 && !f && b.removeClass(a, d), c === -1 && f && b.addClass(a, d)
    }
  }(), b.addListener = m, b.addDisposableListener = n, b.addNonBubblingMouseOutListener = o, b.animationFrame =
    function() {
      var a = function(a) {
        return a((new Date).getTime()), 0
      }, b = self.requestAnimationFrame || self.msRequestAnimationFrame || self.webkitRequestAnimationFrame || self.mozRequestAnimationFrame ||
          self.oRequestAnimationFrame,
        c = function(a) {}, d = self.cancelAnimationFrame || self.cancelRequestAnimationFrame || self.msCancelAnimationFrame ||
          self.msCancelRequestAnimationFrame || self.webkitCancelAnimationFrame || self.webkitCancelRequestAnimationFrame ||
          self.mozCancelAnimationFrame || self.mozCancelRequestAnimationFrame || self.oCancelAnimationFrame || self.oCancelRequestAnimationFrame,
        e = !! b,
        f = b || a,
        g = d || d;
      return {
        isNative: e,
        request: function(a) {
          return f(a)
        },
        cancel: function(a) {
          return g(a)
        }
      }
  }(), b.scheduleAtNextAnimationFrame = function() {
    var a = [],
      c = !1,
      d = function() {
        c = !1;
        var b = a;
        a = [];
        for (var d = 0; d < b.length; d++) b[d]()
      };
    return function(e) {
      a.push(e), c || (c = !0, b.animationFrame.request(d))
    }
  }();
  var p = 16,
    q = function(a, b) {
      return b
    };
  b.addThrottledListener = function() {
    return b.animationFrame.isNative ? r : s
  }(), b.getComputedStyle = t;
  var u = function() {
    var a = /^-?\d+(px)?$/i,
      b = /^-?\d+/i;
    return function(c, d) {
      if (!a.test(d) && b.test(d)) {
        var e = c.style.left;
        c.style.left = d;
        var f = c.style.pixelLeft;
        return c.style.left = e, f
      }
      return parseInt(d, 10) || 0
    }
  }(),
    w = {
      getBorderLeftWidth: function(a) {
        return v(a, "border-left-width", "borderLeftWidth")
      },
      getBorderTopWidth: function(a) {
        return v(a, "border-top-width", "borderTopWidth")
      },
      getBorderRightWidth: function(a) {
        return v(a, "border-right-width", "borderRightWidth")
      },
      getBorderBottomWidth: function(a) {
        return v(a, "border-bottom-width", "borderBottomWidth")
      },
      getPaddingLeft: function(a) {
        return v(a, "padding-left", "paddingLeft")
      },
      getPaddingTop: function(a) {
        return v(a, "padding-top", "paddingTop")
      },
      getPaddingRight: function(a) {
        return v(a, "padding-right", "paddingRight")
      },
      getPaddingBottom: function(a) {
        return v(a, "padding-bottom", "paddingBottom")
      },
      getMarginLeft: function(a) {
        return v(a, "margin-left", "marginLeft")
      },
      getMarginTop: function(a) {
        return v(a, "margin-top", "marginTop")
      },
      getMarginRight: function(a) {
        return v(a, "margin-right", "marginRight")
      },
      getMarginBottom: function(a) {
        return v(a, "margin-bottom", "marginBottom")
      },
      __commaSentinel: !1
    };
  b.getTopLeftOffset = x, b.getDomNodePosition = y, b.getContentWidth = z, b.getTotalWidth = A, b.getContentHeight =
    B, b.getTotalHeight = C, b.getRelativeLeft = D, b.getRelativeTop = E, b.isAncestor = F;
  var G = null;
  b.createCSSRule = I, b.isHTMLElement = J, b.EventType = {
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
    ANIMATION_START: g.browser.isWebKit ? "webkitAnimationStart" : "animationstart",
    ANIMATION_END: g.browser.isWebKit ? "webkitAnimationEnd" : "animationend",
    ANIMATION_ITERATION: g.browser.isWebKit ? "webkitAnimationIteration" : "animationiteration"
  }, b.EventHelper = {
    stop: function(a, b) {
      a.preventDefault ? a.preventDefault() : a.returnValue = !1, b && (a.stopPropagation ? a.stopPropagation() : a.cancelBubble = !
        0)
    }
  }, b.trackFocus = K, b.UnitConverter = {
    _emInPx: -1,
    emToPixel: function(a) {
      if (this._emInPx < 0) {
        var c = document.createElement("div");
        c.style.position = "absolute", c.style.top = "10000px", c.style.left = "10000px", c.style.fontSize = "1em", c
          .innerHTML = "AbcDef", document.body.appendChild(c);
        var d = b.getTotalHeight(c);
        document.body.removeChild(c), this._emInPx = d
      }
      var e = a * this._emInPx,
        f = Math.round(e);
      return f
    }
  }
})