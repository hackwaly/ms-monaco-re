define("vs/platform/handlerService", ["require", "exports", "vs/nls!vs/editor/editor.main", "vs/base/diagnostics",
  "vs/base/env", "vs/base/dom/dom", "vs/base/dom/keyboardEvent"
], function(e, t, n, i, o, r, s) {
  function a(e, t) {
    "undefined" == typeof t && (t = !1);
    var i = [];
    (e.ctrlCmd && !o.browser.isMacintosh || e.winCtrl && o.browser.isMacintosh) && i.push(t ? n.localize(
      "vs_platform_handlerService", 0) : "Ctrl");

    e.shift && i.push(t ? n.localize("vs_platform_handlerService", 1) : "Shift");

    e.alt && i.push(t ? n.localize("vs_platform_handlerService", 2) : "Alt");

    (e.ctrlCmd && o.browser.isMacintosh || e.winCtrl && !o.browser.isMacintosh) && i.push(t ? n.localize(
      "vs_platform_handlerService", 3) : "Meta");

    i.push(e.key);

    return t ? i.join("+") : i.join("-");
  }
  t.asString = a;
  var u = i.register("HandlerServiceActivationVerbose", function(e, t, n) {
    console.log(e + " > " + t.id + " > " + n);
  });

  var l = i.register("HandlerServiceFocusVisual", function(e, t) {
    e.style.outlineWidth = "5px";

    e.style.outlineStyle = "solid";

    e.style.outlineColor = t === !0 ? "yellowgreen" : t === !1 ? "red" : "gray";
  });

  var c = i.register("HandlerServiceFocusTextual", function(e) {
    console.log("got FOCUS @" + (new Date).getTime(), e);
  });

  var d = function() {
    function e(e, t) {
      this.keyBinding = e;

      this.onEmpty = t;

      this.data = [];
    }
    e.prototype.push = function(e, t) {
      "undefined" == typeof t && (t = {});
      var n;

      var i;

      var o = this;

      var r = this;
      n = function() {
        for (var n = [], o = 0; o < arguments.length - 0; o++) {
          n[o] = arguments[o + 0];
        }
        if (!this.active) {
          return !1;
        }
        var s = !1;
        try {
          s = e.apply(e, n);

          s === !0 && t.once && i.dispose();
        } catch (a) {
          throw i.dispose(), a;
        }
        u(r.keyBinding, t, "handled?" + s);

        return s;
      };

      n.$debugId = t.id;

      n.active = !0;

      this.data.unshift(n);

      return i = {
        activate: function() {
          u(o.keyBinding, t, "activated");

          n.active = !0;
        },
        deactivate: function() {
          u(o.keyBinding, t, "deactivated");

          n.active = !1;
        },
        dispose: function() {
          u(o.keyBinding, t, "disposed");
          var e = o.data.indexOf(n); - 1 !== e && (o.data.splice(e, 1), 0 === o.data.length && o.onEmpty());
        }
      };
    };

    e.prototype.trigger = function() {
      for (var e = [], t = 0; t < arguments.length - 0; t++) {
        e[t] = arguments[t + 0];
      }
      for (var n = 0; n < this.data.length; n++) {
        var i = this.data[n].apply(this.data[n], e);
        if (i === !0) {
          return !0;
        }
      }
      return !1;
    };

    return e;
  }();
  t.HandlerList = d;
  var h = function() {
    function e(e) {
      this.bindings = e;
    }
    e.prototype.activate = function() {
      this.bindings.forEach(function(e) {
        e.activate();
      });
    };

    e.prototype.deactivate = function() {
      this.bindings.forEach(function(e) {
        e.deactivate();
      });
    };

    e.prototype.dispose = function() {
      this.bindings.forEach(function(e) {
        e.dispose();
      });
    };

    return e;
  }();
  t.CompositeBinding = h;
  var p = function() {
    function e(e) {
      var t = this;
      this.map = {};

      this.unbind = r.addListener(e, r.EventType.KEY_DOWN, function(e) {
        var n = new s.KeyboardEvent(e);
        t.dispatch(n);
      });
    }
    e.prototype.dispatch = function(e) {
      var t = e.asString();

      var n = this.map[t];

      var i = !1;
      n instanceof d && (i = n.trigger(e));

      i && (e.preventDefault(), e.stopPropagation());

      return i;
    };

    e.prototype.ensureHandlerList = function(e) {
      var n = this;

      var i = t.asString(e);

      var o = this.map[i];
      o || (o = new d(i, function() {
        delete n.map[i];
      }), this.map[i] = o);

      return o;
    };

    e.prototype.bind = function(e, t, n) {
      "undefined" == typeof n && (n = {
        once: !1,
        id: "unkown"
      });

      return this.ensureHandlerList(e).push(t, n);
    };

    e.prototype.bindGroup = function(e, n) {
      "undefined" == typeof n && (n = {
        once: !1,
        id: "unkownGroup"
      });
      var i;

      var o = this;

      var r = [];

      var s = function(e, s) {
        var a = s;
        n.once && (a = function() {
          var o = !1;
          try {
            o = s.apply(s, arguments);

            o === !0 && (u(t.asString(e), n, "handled?true > GROUP disposal"), i.dispose());
          } catch (r) {
            throw i.dispose(), r;
          }
          return o;
        });

        r.push(o.bind(e, a));
      };
      e(s);

      return i = new h(r);
    };

    e.prototype.dispose = function() {
      this.unbind();

      this.map = null;
    };

    return e;
  }();
  t.HandlerService = p;
  var f = function() {
    function e(e) {
      this.delegate = e;

      this.bindings = [];
    }
    e.prototype.bind = function(e, t, n) {
      var i = this.delegate.bind(e, t, n);
      this.bindings.push(i);

      return i;
    };

    e.prototype.bindGroup = function(e, t) {
      var n = this.delegate.bindGroup(e, t);
      this.bindings.push(n);

      return n;
    };

    e.prototype.capture = function() {
      return new h(this.bindings);
    };

    return e;
  }();
  t.HandlerServiceWrapper = f;
  var g = function() {
    function e(e, t) {
      var n = this;
      this.domNode = e;

      this.scopeNode = t;

      this.handlerActive = !1;

      l(this.scopeNode);

      this.unbind = r.addListener(this.domNode, r.EventType.FOCUS, function(e) {
        c(e.target);

        n.update(r.isAncestor(e.target, n.scopeNode));
      }, !0);
    }
    e.prototype.injectHandlerService = function(e) {
      this.delegate = e;
    };

    e.prototype.update = function(e) {
      this.handlerActive !== e && (this.handlerActive = e);

      l(this.scopeNode, e);
    };

    e.prototype.bind = function(e, t, n) {
      return this.delegate.bind(e, this.wrapHandler(t), n);
    };

    e.prototype.bindGroup = function(e, t) {
      var n = this;
      return this.delegate.bindGroup(function(t) {
        var i = function(e, i) {
          t(e, n.wrapHandler(i));
        };
        e(i);
      }, t);
    };

    e.prototype.wrapHandler = function(e) {
      var t = this;

      var n = function() {
        return t.handlerActive !== !0 ? !1 : e.apply(e, arguments);
      };
      return n;
    };

    e.prototype.dispose = function() {
      this.unbind();
    };

    return e;
  }();
  t.FocusTrackingHandlerService = g;
});