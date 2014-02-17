define("vs/editor/core/controller/pointerHandler", ["require", "exports", "vs/base/dom/mouseEvent", "vs/base/dom/dom",
  "vs/base/dom/touch", "vs/editor/core/controller/mouseHandler"
], function(e, t, n, i, o, r) {
  var s = function(e) {
    function t(t, n, o) {
      var r = this;
      e.call(this, t, n, o);
      var s = function(e, t) {
        var n = {
          translationY: t.translationY,
          translationX: t.translationX
        };
        e && (n.translationY += e.translationY, n.translationX += e.translationX);

        return n;
      };
      this.viewHelper.linesContentDomNode.style.msTouchAction = "none";

      this.viewHelper.linesContentDomNode.style.msContentZooming = "none";

      this._installGestureHandlerTimeout = window.setTimeout(function() {
        if (r._installGestureHandlerTimeout = -1, window.MSGesture) {
          var e = new MSGesture;
          e.target = r.viewHelper.linesContentDomNode;

          r.viewHelper.linesContentDomNode.addEventListener("MSPointerDown", function(t) {
            var n = t.pointerType;
            r._lastPointerType = n === (t.MSPOINTER_TYPE_MOUSE || "mouse") ? "mouse" : n === (t.MSPOINTER_TYPE_TOUCH ||
              "touch") ? "touch" : "pen";

            if ("mouse" !== r._lastPointerType) {
              e.addPointer(t.pointerId);
            }
          });

          r.listenersToRemove.push(i.addThrottledListener(r.viewHelper.linesContentDomNode, "MSGestureChange",
            function(e) {
              return r._onGestureChange(e);
            }, s));

          r.listenersToRemove.push(i.addListener(r.viewHelper.linesContentDomNode, "MSGestureTap", function(e) {
            return r._onCaptureGestureTap(e);
          }, !0));
        }
      }, 100);

      this._lastPointerType = "mouse";
    }
    __extends(t, e);

    t.prototype._onMouseDown = function(t) {
      if ("mouse" === this._lastPointerType) {
        e.prototype._onMouseDown.call(this, t);
      }
    };

    t.prototype._onCaptureGestureTap = function(e) {
      var t = this;

      var o = new n.StandardMouseEvent(e);

      var r = i.getDomNodePosition(this.viewHelper.linesContentDomNode);

      var s = this.mouseTargetFactory.createMouseTarget(r, o, !1);
      if (s.position) {
        this.viewController.moveTo("mouse", s.position.lineNumber, s.position.column);
      }

      o.browserEvent.fromElement ? (o.preventDefault(), this.viewHelper.focusTextArea()) : setTimeout(function() {
        t.viewHelper.focusTextArea();
      });
    };

    t.prototype._onGestureChange = function(e) {
      this.viewHelper.setScrollTop(this.viewHelper.getScrollTop() - e.translationY);

      this.viewHelper.setScrollLeft(this.viewHelper.getScrollLeft() - e.translationX);
    };

    t.prototype.dispose = function() {
      window.clearTimeout(this._installGestureHandlerTimeout);

      e.prototype.dispose.call(this);
    };

    return t;
  }(r.MouseHandler);

  var a = function(e) {
    function t(t, n, r) {
      var s = this;
      e.call(this, t, n, r);

      this.gesture = new o.Gesture(this.viewHelper.linesContentDomNode);

      this.listenersToRemove.push(i.addListener(this.viewHelper.linesContentDomNode, o.EventType.Tap, function(e) {
        return s.onTap(e);
      }));

      this.listenersToRemove.push(i.addListener(this.viewHelper.linesContentDomNode, o.EventType.Change, function(e) {
        return s.onChange(e);
      }));
    }
    __extends(t, e);

    t.prototype.dispose = function() {
      this.gesture.dispose();

      e.prototype.dispose.call(this);
    };

    t.prototype.onTap = function(e) {
      e.preventDefault();

      this.viewHelper.focusTextArea();
      var t = i.getDomNodePosition(this.viewHelper.linesContentDomNode);

      var o = new n.StandardMouseEvent(e);

      var r = this.mouseTargetFactory.createMouseTarget(t, o, !1);
      if (r.position) {
        this.viewController.moveTo("mouse", r.position.lineNumber, r.position.column);
      }
    };

    t.prototype.onChange = function(e) {
      this.viewHelper.setScrollTop(this.viewHelper.getScrollTop() - e.translationY);

      this.viewHelper.setScrollLeft(this.viewHelper.getScrollLeft() - e.translationX);
    };

    return t;
  }(r.MouseHandler);

  var u = function() {
    function e(e, t, n) {
      this.handler = window.navigator.msPointerEnabled ? new s(e, t, n) : window.TouchEvent ? new a(e, t, n) : new r.MouseHandler(
        e, t, n);
    }
    e.prototype.onScrollChanged = function(e) {
      this.handler.onScrollChanged(e);
    };

    e.prototype.dispose = function() {
      this.handler.dispose();
    };

    return e;
  }();
  t.PointerHandler = u;
});