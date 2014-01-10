var __extends = this.__extends || function(a, b) {
    function d() {
      this.constructor = a
    }
    for (var c in b) b.hasOwnProperty(c) && (a[c] = b[c]);
    d.prototype = b.prototype, a.prototype = new d
  };
define(["require", "exports", "vs/base/env", "vs/editor/core/position", "vs/base/dom/mouseEvent", "vs/base/dom/dom",
  "vs/editor/editor", "vs/editor/core/controller/mouseTarget", "vs/editor/core/view/viewEventHandler",
  "vs/base/lifecycle"
], function(a, b, c, d, e, f, g, h, i, j) {
  var k = c,
    l = d,
    m = e,
    n = f,
    o = g,
    p = h,
    q = i,
    r = j,
    s = function(a, b) {
      var c = null;
      b.rangeParent && (c = {
        rangeParent: b.rangeParent,
        rangeOffset: b.rangeOffset
      });
      var d = new m.MouseEvent(b, c);
      return d.preventDefault(), d
    }, t = function(a) {
      function b(c, d, e) {
        var f = this;
        a.call(this), this.context = c, this.viewController = d, this.viewHelper = e, this.mouseTargetFactory = new p
          .MouseTargetFactory(this.context, e), this.listenersToRemove = [], this.hideTextAreaTimeout = -1, this._hookUnbind = [],
          this._hookDispose = [], this.lastMouseEvent = null, this.lastMouseDownPosition = null, this.lastMouseDownPositionEqualCount =
          0, this.lastMouseDownCount = 0, this.lastSetMouseDownCountTime = 0, this.onScrollTimeout = -1, this.layoutWidth =
          0, this.layoutHeight = 0, this.listenersToRemove.push(n.addListener(this.viewHelper.viewDomNode,
            "contextmenu", function(a) {
              return f._onContextMenu(a)
            })), this.listenersToRemove.push(n.addThrottledListener(this.viewHelper.viewDomNode, "mousemove",
            function(a) {
              return f._onMouseMove(a)
            }, s, b.MOUSE_MOVE_MINIMUM_TIME)), this.listenersToRemove.push(n.addListener(this.viewHelper.viewDomNode,
            "mouseup", function(a) {
              return f._onMouseUp(a)
            })), this.listenersToRemove.push(n.addNonBubblingMouseOutListener(this.viewHelper.viewDomNode, function(a) {
            return f._onMouseLeave(a)
          })), this.listenersToRemove.push(n.addListener(this.viewHelper.viewDomNode, "mousedown", function(a) {
            return f._onMouseDown(a)
          })), this.context.addEventHandler(this)
      }
      return __extends(b, a), b.prototype.dispose = function() {
        this.context.removeEventHandler(this), this.listenersToRemove.forEach(function(a) {
          a()
        }), this.listenersToRemove = [], this._unhook(), this.hideTextAreaTimeout !== -1 && (window.clearTimeout(this
          .hideTextAreaTimeout), this.hideTextAreaTimeout = -1)
      }, b.prototype.onLayoutChanged = function(a) {
        return !1
      }, b.prototype.onScrollChanged = function(a) {
        return (this._hookUnbind.length > 0 || this._hookDispose.length > 0) && this._hookedOnScroll(a), !1
      }, b.prototype._onContextMenu = function(a) {
        var b = new m.MouseEvent(a),
          c = n.getDomNodePosition(this.viewHelper.linesContentDomNode),
          d = this.mouseTargetFactory.createMouseTarget(c, b, !0),
          e = {
            event: b,
            target: d
          };
        this.viewController.emitContextMenu(e)
      }, b.prototype._onMouseMove = function(a) {
        if (this._hookUnbind.length !== 0 || this._hookDispose.length !== 0) return;
        var b = n.getDomNodePosition(this.viewHelper.linesContentDomNode),
          c = this.mouseTargetFactory.createMouseTarget(b, a, !0),
          d = {
            event: a,
            target: c
          };
        this.viewController.emitMouseMove(d)
      }, b.prototype._onMouseLeave = function(a) {
        var b = {
          event: new m.MouseEvent(a),
          target: null
        };
        this.viewController.emitMouseLeave(b)
      }, b.prototype._onMouseUp = function(a) {
        var b = new m.MouseEvent(a),
          c = n.getDomNodePosition(this.viewHelper.linesContentDomNode),
          d = this.mouseTargetFactory.createMouseTarget(c, b, !0),
          e = {
            event: b,
            target: d
          };
        this.viewController.emitMouseUp(e)
      }, b.prototype._onMouseDown = function(a) {
        var b = this,
          c = new m.MouseEvent(a),
          d = n.getDomNodePosition(this.viewHelper.linesContentDomNode),
          e = this.mouseTargetFactory.createMouseTarget(d, c, !0),
          f = e.type === o.MouseTargetType.CONTENT_TEXT || e.type === o.MouseTargetType.CONTENT_EMPTY,
          g = e.type === o.MouseTargetType.GUTTER_GLYPH_MARGIN || e.type === o.MouseTargetType.GUTTER_LINE_NUMBERS ||
            e.type === o.MouseTargetType.GUTTER_LINE_DECORATIONS,
          h = e.type === o.MouseTargetType.GUTTER_LINE_NUMBERS,
          i = this.context.configuration.editor.selectOnLineNumbers;
        c.leftButton && (f || h && i) ? (k.browser.isIE10 ? c.browserEvent.fromElement ? (c.preventDefault(), this.viewHelper
            .textArea.focus()) : setTimeout(function() {
            b.viewHelper.textArea.focus()
          }) : (c.preventDefault(), this.viewHelper.textArea.focus()), this._updateMouse(e.type, c, c.shiftKey, c.detail),
          this._hook(e.type)) : g && c.preventDefault();
        var j = {
          event: c,
          target: e
        };
        this.viewController.emitMouseDown(j)
      }, b.prototype._onIE8DblClick = function(a) {
        var b = new m.MouseEvent(a),
          c = n.getDomNodePosition(this.viewHelper.linesContentDomNode),
          d = this.mouseTargetFactory.createMouseTarget(c, b, !0);
        if (d.type === o.MouseTargetType.CONTENT_TEXT || d.type === o.MouseTargetType.CONTENT_EMPTY) this._updateMouse(
          d.type, b, b.shiftKey, b.detail), b.preventDefault(), this.viewHelper.textArea.focus()
      }, b.prototype._hookedOnScroll = function(a) {
        var b = this;
        this.onScrollTimeout === -1 && (this.onScrollTimeout = window.setTimeout(function() {
          b.onScrollTimeout = -1, b._updateMouse(b._hookStartTargetType, null, !0)
        }, 10))
      }, b.prototype._hookedOnDocumentMouseMove = function(a) {
        this._updateMouse(this._hookStartTargetType, a, !0)
      }, b.prototype._hookedOnDocumentMouseUp = function(a) {
        var b = new m.MouseEvent(a);
        b.leftButton && this._unhook()
      }, b.prototype._hook = function(a) {
        var b = this;
        if (this._hookUnbind.length > 0 || this._hookDispose.length > 0) return;
        this._hookStartTargetType = a, this._hookUnbind.push(n.addThrottledListener(document, "mousemove", function(a) {
          return b._hookedOnDocumentMouseMove(a)
        }, s)), this._hookUnbind.push(n.addListener(document, "mouseup", function(a) {
          return b._hookedOnDocumentMouseUp(a)
        })), k.isInIframe() && (this._hookUnbind.push(n.addListener(document, "mouseout", function(a) {
          var c = new m.MouseEvent(a);
          c.target.tagName.toLowerCase() === "html" && b._unhook()
        })), this._hookUnbind.push(n.addListener(document, "mouseover", function(a) {
          var c = new m.MouseEvent(a);
          c.target.tagName.toLowerCase() === "html" && b._unhook()
        })), this._hookUnbind.push(n.addListener(document.body, "mouseleave", function(a) {
          b._unhook()
        })))
      }, b.prototype._unhook = function() {
        this._hookUnbind.forEach(function(a) {
          a()
        }), this._hookUnbind = [], this._hookDispose = r.disposeAll(this._hookDispose), this.onScrollTimeout !== -1 &&
          (window.clearTimeout(this.onScrollTimeout), this.onScrollTimeout = -1)
      }, b.prototype._getPositionOutsideEditor = function(a, b) {
        var c;
        return b.posy < a.top ? (c = this.viewHelper.getLineNumberAtVerticalOffset(Math.max(this.viewHelper.getScrollTop() -
          (a.top - b.posy), 0)), {
          lineNumber: c,
          column: 1
        }) : b.posy > a.top + a.height ? (c = this.viewHelper.getLineNumberAtVerticalOffset(this.viewHelper.getScrollTop() +
          (b.posy - a.top)), {
          lineNumber: c,
          column: this.context.model.getLineMaxColumn(c)
        }) : (c = this.viewHelper.getLineNumberAtVerticalOffset(this.viewHelper.getScrollTop() + (b.posy - a.top)), b
          .posx < a.left ? {
            lineNumber: c,
            column: 1
          } : b.posx > a.left + a.width ? {
            lineNumber: c,
            column: this.context.model.getLineMaxColumn(c)
          } : null)
      }, b.prototype._updateMouse = function(a, c, d, e) {
        typeof e == "undefined" && (e = 0), c = c || this.lastMouseEvent, this.lastMouseEvent = c;
        var f = n.getDomNodePosition(this.viewHelper.viewDomNode),
          g = this._getPositionOutsideEditor(f, c),
          h, i;
        if (g) h = g.lineNumber, i = g.column;
        else {
          var j = this.mouseTargetFactory.createMouseTarget(f, c, !0),
            k = j.position;
          if (!k) return;
          h = k.lineNumber, i = k.column
        } if (e) {
          var m = (new Date).getTime();
          m - this.lastSetMouseDownCountTime > b.CLEAR_MOUSE_DOWN_COUNT_TIME && (e = 1), this.lastSetMouseDownCountTime =
            m, e > this.lastMouseDownCount + 1 && (e = this.lastMouseDownCount + 1);
          var p = new l.Position(h, i);
          this.lastMouseDownPosition && this.lastMouseDownPosition.equals(p) ? this.lastMouseDownPositionEqualCount++ :
            this.lastMouseDownPositionEqualCount = 1, this.lastMouseDownPosition = p, this.lastMouseDownCount = Math.min(
              e, this.lastMouseDownPositionEqualCount), c.detail = this.lastMouseDownCount
        }
        if (a === o.MouseTargetType.GUTTER_LINE_NUMBERS) c.altKey ? d ? this.viewController.lastCursorLineSelect(
          "mouse", h, i) : this.viewController.createCursor("mouse", h, i, !0) : d ? this.viewController.lineSelectDrag(
          "mouse", h, i) : this.viewController.lineSelect("mouse", h, i);
        else if (this.lastMouseDownCount >= 4) this.viewController.selectAll("mouse");
        else if (this.lastMouseDownCount === 3) c.altKey ? d ? this.viewController.lastCursorLineSelectDrag("mouse",
          h, i) : this.viewController.lastCursorLineSelect("mouse", h, i) : d ? this.viewController.lineSelectDrag(
          "mouse", h, i) : this.viewController.lineSelect("mouse", h, i);
        else if (this.lastMouseDownCount === 2) {
          var q = f.left + this.viewHelper.visibleRangeForPosition2(h, i).left,
            r = "none";
          c.posx > q ? r = "right" : c.posx < q && (r = "left"), c.altKey ? this.viewController.lastCursorWordSelect(
            "mouse", h, i, r) : d ? this.viewController.wordSelectDrag("mouse", h, i, r) : this.viewController.wordSelect(
            "mouse", h, i, r)
        } else c.altKey ? d ? this.viewController.lastCursorMoveToSelect("mouse", h, i) : this.viewController.createCursor(
          "mouse", h, i, !1) : d ? this.viewController.moveToSelect("mouse", h, i) : this.viewController.moveTo(
          "mouse", h, i)
      }, b.CLEAR_MOUSE_DOWN_COUNT_TIME = 400, b.MOUSE_MOVE_MINIMUM_TIME = 100, b
    }(q.ViewEventHandler);
  b.MouseHandler = t
})