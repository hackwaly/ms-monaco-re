define("vs/base/dom/touch", ["require", "exports", "vs/base/arrays", "vs/base/lifecycle", "vs/base/dom/dom"], function(
  e, t, n, i, o) {
  ! function(e) {
    e.Tap = "-monaco-gesturetap";

    e.Change = "-monaco-gesturechange";

    e.Start = "-monaco-gesturestart";

    e.End = "-monaco-gesturesend";
  }(t.EventType || (t.EventType = {}));
  var r = t.EventType;

  var s = function() {
    function e(e) {
      this.callOnTarget = [];

      this.activeTouches = {};

      this.target = e;
    }
    e.prototype.dispose = function() {
      this.target = null;
    };

    Object.defineProperty(e.prototype, "target", {
      set: function(e) {
        var t = this;
        i.cAll(this.callOnTarget);

        this.activeTouches = {};

        this._target = e;

        this._target && (this.callOnTarget.push(o.addListener(this._target, "touchstart", function(e) {
          return t.onTouchStart(e);
        })), this.callOnTarget.push(o.addListener(this._target, "touchend", function(e) {
          return t.onTouchEnd(e);
        })), this.callOnTarget.push(o.addListener(this._target, "touchmove", function(e) {
          return t.onTouchMove(e);
        })));
      },
      enumerable: !0,
      configurable: !0
    });

    e.newGestureEvent = function(e) {
      var t = document.createEvent("CustomEvent");
      t.initEvent(e, !1, !0);

      return t;
    };

    e.prototype.onTouchStart = function(t) {
      t.preventDefault();

      o.cancelAtNextAnimationFrame(this.handle);
      for (var n = 0, i = t.targetTouches.length; i > n; n++) {
        var s = t.targetTouches.item(n);
        this.activeTouches[s.identifier] = {
          id: s.identifier,
          initialTarget: s.target,
          initialTimeStamp: t.timeStamp,
          initialPageX: s.pageX,
          initialPageY: s.pageY,
          rollingTimestamps: [t.timeStamp],
          rollingPageX: [s.pageX],
          rollingPageY: [s.pageY]
        };
        var a = e.newGestureEvent(r.Start);
        this._target.dispatchEvent(a);
      }
    };

    e.prototype.onTouchEnd = function(t) {
      var i = this;
      t.preventDefault();
      for (var s = Object.keys(this.activeTouches).length, a = 0, u = t.changedTouches.length; u > a; a++) {
        var l = t.changedTouches.item(a);
        if (this.activeTouches.hasOwnProperty(String(l.identifier))) {
          var c = this.activeTouches[l.identifier];

          var d = Date.now() - c.initialTimeStamp;
          if (d < e.HOLD_DELAY && Math.abs(c.initialPageX - n.tail(c.rollingPageX)) < 30 && Math.abs(c.initialPageY -
            n.tail(c.rollingPageY)) < 30) {
            var h = e.newGestureEvent(r.Tap);
            h.initialTarget = c.initialTarget;

            h.pageX = n.tail(c.rollingPageX);

            h.pageY = n.tail(c.rollingPageY);

            this._target.dispatchEvent(h);
          } else if (1 === s) {
            var p = n.tail(c.rollingPageX);

            var f = n.tail(c.rollingPageY);

            var g = n.tail(c.rollingTimestamps) - c.rollingTimestamps[0];

            var m = p - c.rollingPageX[0];

            var v = f - c.rollingPageY[0];

            var y = m > 0 ? 1 : -1;

            var _ = v > 0 ? 1 : -1;

            var b = function(t, n, s, a, u) {
              i.handle = o.scheduleAtNextAnimationFrame(function() {
                var o = Date.now();

                var l = o - t;

                var c = 0;

                var d = 0;

                var h = !0;
                n += e.SCROLL_FRICTION * l;

                a += e.SCROLL_FRICTION * l;

                n > 0 && (h = !1, c = y * n * l);

                a > 0 && (h = !1, d = _ * a * l);
                var p = e.newGestureEvent(r.Change);
                p.translationX = c;

                p.translationY = d;

                i._target.dispatchEvent(p);

                h || b(o, n, s + c, a, u + d);
              });
            };
            b(t.timeStamp, Math.abs(m) / g, p, Math.abs(v) / g, f);
          }
          delete this.activeTouches[l.identifier];
        } else console.warn("end of an UNKNOWN touch", l);
      }
    };

    e.prototype.onTouchMove = function(t) {
      t.preventDefault();
      for (var i = 0, o = t.changedTouches.length; o > i; i++) {
        var s = t.changedTouches.item(i);
        if (this.activeTouches.hasOwnProperty(String(s.identifier))) {
          var a = this.activeTouches[s.identifier];

          var u = (Date.now() - a.initialTimeStamp, e.newGestureEvent(r.Change));
          u.translationX = s.pageX - n.tail(a.rollingPageX);

          u.translationY = s.pageY - n.tail(a.rollingPageY);

          this._target.dispatchEvent(u);

          a.rollingPageX.length > 3 && (a.rollingPageX.shift(), a.rollingPageY.shift(), a.rollingTimestamps.shift());

          a.rollingPageX.push(s.pageX);

          a.rollingPageY.push(s.pageY);

          a.rollingTimestamps.push(t.timeStamp);
        } else console.warn("end of an UNKNOWN touch", s);
      }
    };

    e.TAP_DELAY = 500;

    e.HOLD_DELAY = 2e3;

    e.SCROLL_FRICTION = -.005;

    return e;
  }();
  t.Gesture = s;
});