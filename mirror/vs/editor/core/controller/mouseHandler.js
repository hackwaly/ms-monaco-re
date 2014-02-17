define("vs/editor/core/controller/mouseHandler", ["require", "exports", "vs/base/env", "vs/editor/core/position",
  "vs/base/dom/mouseEvent", "vs/base/dom/dom", "vs/editor/editor", "vs/editor/core/controller/mouseTarget",
  "vs/editor/core/view/viewEventHandler", "vs/base/lifecycle", "vs/base/dom/globalMouseMoveMonitor"
], function(e, t, n, i, o, r, s, a, u, l, c) {
  var d = function(e, t) {
    var n = new o.StandardMouseEvent(t);
    n.preventDefault();

    return n;
  };

  var h = function(e) {
    function t(n, i, o) {
      var s = this;
      e.call(this);

      this.context = n;

      this.viewController = i;

      this.viewHelper = o;

      this.mouseTargetFactory = new a.MouseTargetFactory(this.context, o);

      this.listenersToRemove = [];

      this.hideTextAreaTimeout = -1;

      this.toDispose = [];

      this.mouseMoveMonitor = new c.GlobalMouseMoveMonitor;

      this.toDispose.push(this.mouseMoveMonitor);

      this.lastMouseEvent = null;

      this.lastMouseDownPosition = null;

      this.lastMouseDownPositionEqualCount = 0;

      this.lastMouseDownCount = 0;

      this.lastSetMouseDownCountTime = 0;

      this.onScrollTimeout = -1;

      this.layoutWidth = 0;

      this.layoutHeight = 0;

      this.listenersToRemove.push(r.addListener(this.viewHelper.viewDomNode, "contextmenu", function(e) {
        return s._onContextMenu(e);
      }));

      this.listenersToRemove.push(r.addThrottledListener(this.viewHelper.viewDomNode, "mousemove", function(e) {
        return s._onMouseMove(e);
      }, d, t.MOUSE_MOVE_MINIMUM_TIME));

      this.listenersToRemove.push(r.addListener(this.viewHelper.viewDomNode, "mouseup", function(e) {
        return s._onMouseUp(e);
      }));

      this.listenersToRemove.push(r.addNonBubblingMouseOutListener(this.viewHelper.viewDomNode, function(e) {
        return s._onMouseLeave(e);
      }));

      this.listenersToRemove.push(r.addListener(this.viewHelper.viewDomNode, "mousedown", function(e) {
        return s._onMouseDown(e);
      }));

      this.context.addEventHandler(this);
    }
    __extends(t, e);

    t.prototype.dispose = function() {
      this.context.removeEventHandler(this);

      this.listenersToRemove.forEach(function(e) {
        e();
      });

      this.listenersToRemove = [];

      this.toDispose = l.disposeAll(this.toDispose);

      this._unhook();

      - 1 !== this.hideTextAreaTimeout && (window.clearTimeout(this.hideTextAreaTimeout), this.hideTextAreaTimeout = -
        1);
    };

    t.prototype.onLayoutChanged = function() {
      return !1;
    };

    t.prototype.onScrollChanged = function(e) {
      this.mouseMoveMonitor.isMonitoring() && this._hookedOnScroll(e);

      return !1;
    };

    t.prototype._onContextMenu = function(e) {
      var t = new o.StandardMouseEvent(e);

      var n = r.getDomNodePosition(this.viewHelper.linesContentDomNode);

      var i = this.mouseTargetFactory.createMouseTarget(n, t, !0);

      var s = {
        event: t,
        target: i
      };
      this.viewController.emitContextMenu(s);
    };

    t.prototype._onMouseMove = function(e) {
      if (!this.mouseMoveMonitor.isMonitoring()) {
        var t = r.getDomNodePosition(this.viewHelper.linesContentDomNode);

        var n = this.mouseTargetFactory.createMouseTarget(t, e, !0);

        var i = {
          event: e,
          target: n
        };
        this.viewController.emitMouseMove(i);
      }
    };

    t.prototype._onMouseLeave = function(e) {
      var t = {
        event: new o.StandardMouseEvent(e),
        target: null
      };
      this.viewController.emitMouseLeave(t);
    };

    t.prototype._onMouseUp = function(e) {
      var t = new o.StandardMouseEvent(e);

      var n = r.getDomNodePosition(this.viewHelper.linesContentDomNode);

      var i = this.mouseTargetFactory.createMouseTarget(n, t, !0);

      var s = {
        event: t,
        target: i
      };
      this.viewController.emitMouseUp(s);
    };

    t.prototype._onMouseDown = function(e) {
      var t = this;

      var i = new o.StandardMouseEvent(e);

      var s = r.getDomNodePosition(this.viewHelper.linesContentDomNode);

      var a = this.mouseTargetFactory.createMouseTarget(s, i, !0);

      var u = 6 === a.type || 7 === a.type;

      var l = 2 === a.type || 3 === a.type || 4 === a.type;

      var c = 3 === a.type;

      var d = this.context.configuration.editor.selectOnLineNumbers;

      var h = 8 === a.type || 5 === a.type;
      i.leftButton && (u || c && d) ? (n.browser.isIE11orEarlier ? i.browserEvent.fromElement ? (i.preventDefault(),
          this.viewHelper.focusTextArea()) : setTimeout(function() {
          t.viewHelper.focusTextArea();
        }) : (i.preventDefault(), this.viewHelper.focusTextArea()), this._updateMouse(a.type, i, i.shiftKey, i.detail),
        this._hook(a.type)) : l ? i.preventDefault() : h && this.viewHelper.shouldSuppressMouseDownOnViewZone(a.detail) &&
        i.preventDefault();
      var p = {
        event: i,
        target: a
      };
      this.viewController.emitMouseDown(p);
    };

    t.prototype._hookedOnScroll = function() {
      var e = this; - 1 === this.onScrollTimeout && (this.onScrollTimeout = window.setTimeout(function() {
        e.onScrollTimeout = -1;

        e._updateMouse(e.monitoringStartTargetType, null, !0);
      }, 10));
    };

    t.prototype._hook = function(e) {
      var t = this;
      this.mouseMoveMonitor.isMonitoring() || (this.monitoringStartTargetType = e, this.mouseMoveMonitor.startMonitoring(
        d, function(e) {
          t._updateMouse(t.monitoringStartTargetType, e, !0);
        }, function() {
          t._unhook();
        }));
    };

    t.prototype._unhook = function() {
      -1 !== this.onScrollTimeout && (window.clearTimeout(this.onScrollTimeout), this.onScrollTimeout = -1);
    };

    t.prototype._getPositionOutsideEditor = function(e, t) {
      var n;
      return t.posy < e.top ? (n = this.viewHelper.getLineNumberAtVerticalOffset(Math.max(this.viewHelper.getScrollTop() -
        (e.top - t.posy), 0)), {
        lineNumber: n,
        column: 1
      }) : t.posy > e.top + e.height ? (n = this.viewHelper.getLineNumberAtVerticalOffset(this.viewHelper.getScrollTop() +
        (t.posy - e.top)), {
        lineNumber: n,
        column: this.context.model.getLineMaxColumn(n)
      }) : (n = this.viewHelper.getLineNumberAtVerticalOffset(this.viewHelper.getScrollTop() + (t.posy - e.top)), t.posx <
        e.left ? {
          lineNumber: n,
          column: 1
        } : t.posx > e.left + e.width ? {
          lineNumber: n,
          column: this.context.model.getLineMaxColumn(n)
        } : null);
    };

    t.prototype._updateMouse = function(e, n, o, s) {
      "undefined" == typeof s && (s = 0);

      n = n || this.lastMouseEvent;

      this.lastMouseEvent = n;
      var a;

      var u;

      var l = r.getDomNodePosition(this.viewHelper.viewDomNode);

      var c = this._getPositionOutsideEditor(l, n);
      if (c) {
        a = c.lineNumber;
        u = c.column;
      } else {
        var d = this.mouseTargetFactory.createMouseTarget(l, n, !0);

        var h = d.position;
        if (!h) return;
        a = h.lineNumber;

        u = h.column;
      }
      if (s) {
        var p = (new Date).getTime();
        p - this.lastSetMouseDownCountTime > t.CLEAR_MOUSE_DOWN_COUNT_TIME && (s = 1);

        this.lastSetMouseDownCountTime = p;

        s > this.lastMouseDownCount + 1 && (s = this.lastMouseDownCount + 1);
        var f = new i.Position(a, u);
        this.lastMouseDownPosition && this.lastMouseDownPosition.equals(f) ? this.lastMouseDownPositionEqualCount++ :
          this.lastMouseDownPositionEqualCount = 1;

        this.lastMouseDownPosition = f;

        this.lastMouseDownCount = Math.min(s, this.lastMouseDownPositionEqualCount);

        n.detail = this.lastMouseDownCount;
      }
      if (3 === e) {
        n.altKey ? o ? this.viewController.lastCursorLineSelect("mouse", a, u) : this.viewController.createCursor(
          "mouse", a, u, !0) : o ? this.viewController.lineSelectDrag("mouse", a, u) : this.viewController.lineSelect(
          "mouse", a, u);
      } else if (this.lastMouseDownCount >= 4) {
        this.viewController.selectAll("mouse");
      } else if (3 === this.lastMouseDownCount) {
        n.altKey ? o ? this.viewController.lastCursorLineSelectDrag("mouse", a, u) : this.viewController.lastCursorLineSelect(
          "mouse", a, u) : o ? this.viewController.lineSelectDrag("mouse", a, u) : this.viewController.lineSelect(
          "mouse", a, u);
      } else if (2 === this.lastMouseDownCount) {
        var g = l.left + this.viewHelper.visibleRangeForPosition2(a, u).left;

        var m = "none";
        n.posx > g ? m = "right" : n.posx < g && (m = "left");

        n.altKey ? this.viewController.lastCursorWordSelect("mouse", a, u, m) : o ? this.viewController.wordSelectDrag(
          "mouse", a, u, m) : this.viewController.wordSelect("mouse", a, u, m);
      } else {
        n.altKey ? o ? this.viewController.lastCursorMoveToSelect("mouse", a, u) : this.viewController.createCursor(
          "mouse", a, u, !1) : o ? this.viewController.moveToSelect("mouse", a, u) : this.viewController.moveTo(
          "mouse", a, u);
      }
    };

    t.CLEAR_MOUSE_DOWN_COUNT_TIME = 400;

    t.MOUSE_MOVE_MINIMUM_TIME = 100;

    return t;
  }(u.ViewEventHandler);
  t.MouseHandler = h;
});