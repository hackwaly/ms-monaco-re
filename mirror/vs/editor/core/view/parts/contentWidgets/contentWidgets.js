define("vs/editor/core/view/parts/contentWidgets/contentWidgets", ["require", "exports",
  "vs/editor/core/view/viewContext", "vs/editor/editor", "vs/editor/core/view/viewPart", "vs/css!./contentWidgets"
], function(e, t, n, i, o) {
  var r = function(e) {
    function t(t) {
      e.call(this, t);

      this._widgets = {};

      this._contentWidth = 0;

      this.domNode = document.createElement("div");

      this.domNode.className = n.ClassNames.CONTENT_WIDGETS;
    }
    __extends(t, e);

    t.prototype.dispose = function() {
      e.prototype.dispose.call(this);

      this._widgets = null;

      this.domNode = null;
    };

    t.prototype.onModelFlushed = function() {
      return !0;
    };

    t.prototype.onModelDecorationsChanged = function() {
      return !0;
    };

    t.prototype.onModelLinesDeleted = function() {
      return !0;
    };

    t.prototype.onModelLineChanged = function() {
      return !0;
    };

    t.prototype.onModelLinesInserted = function() {
      return !0;
    };

    t.prototype.onCursorPositionChanged = function() {
      return !1;
    };

    t.prototype.onCursorSelectionChanged = function() {
      return !1;
    };

    t.prototype.onCursorRevealRange = function() {
      return !1;
    };

    t.prototype.onConfigurationChanged = function() {
      return !0;
    };

    t.prototype.onLayoutChanged = function(e) {
      var t = this;
      this._contentWidth = e.contentWidth;

      this._requestModificationFrameBeforeRendering(function() {
        var e;
        for (e in t._widgets) {
          if (t._widgets.hasOwnProperty(e)) {
            t._widgets[e].widget.getDomNode().style.maxWidth = t._contentWidth + "px";
          }
        }
      });

      return !0;
    };

    t.prototype.onScrollChanged = function(e) {
      return e.vertical;
    };

    t.prototype.onZonesChanged = function() {
      return !0;
    };

    t.prototype.onScrollWidthChanged = function() {
      return !1;
    };

    t.prototype.onScrollHeightChanged = function() {
      return !1;
    };

    t.prototype.addWidget = function(e) {
      this._widgets[e.getId()] = {
        widget: e,
        position: null,
        preference: null,
        isVisible: !1
      };
      var t = e.getDomNode();
      t.style.position = "absolute";

      t.style.maxWidth = this._contentWidth + "px";

      t.style.top = "-1000px";

      t.setAttribute("widgetId", e.getId());

      this.domNode.appendChild(t);

      this.shouldRender = !0;
    };

    t.prototype.setWidgetPosition = function(e, t, n) {
      var i = this._widgets[e.getId()];
      i.position = t;

      i.preference = n;

      this.shouldRender = !0;
    };

    t.prototype.removeWidget = function(e) {
      var t = e.getId();
      if (this._widgets.hasOwnProperty(t)) {
        var n = this._widgets[t];
        delete this._widgets[t];
        var i = n.widget.getDomNode();
        i.parentNode.removeChild(i);

        this.shouldRender = !0;
      }
    };

    t.prototype._layoutBoxInViewport = function(e, t, n) {
      var i = n.visibleRangeForPosition(e);
      if (!i) {
        return null;
      }
      var o = t.clientWidth;

      var r = t.clientHeight;

      var s = i.top;

      var a = s;

      var u = i.top + i.height;

      var l = n.viewportHeight - u;

      var c = s - r;

      var d = a >= r;

      var h = u;

      var p = l >= r;

      var f = i.left;
      f + o > n.viewportLeft + n.viewportWidth && (f = n.viewportLeft + n.viewportWidth - o);

      f < n.viewportLeft && (f = n.viewportLeft);

      return {
        aboveTop: c,
        fitsAbove: d,
        belowTop: h,
        fitsBelow: p,
        left: f
      };
    };

    t.prototype._prepareRenderWidgetAtExactPosition = function(e, t) {
      var n = t.visibleRangeForPosition(e);
      return n ? {
        top: n.top,
        left: n.left
      } : null;
    };

    t.prototype._prepareRenderWidget = function(e, t) {
      var n = this;
      if (!e.position || !e.preference) {
        return null;
      }
      var i;

      var o;

      var r;

      var s = this._context.model.validateModelPosition(e.position);

      var a = this._context.model.convertModelPositionToViewPosition(s.lineNumber, s.column);

      var u = null;

      var l = function() {
        if (!u) {
          var i = e.widget.getDomNode();
          u = n._layoutBoxInViewport(a, i, t);
        }
      };
      for (o = 1; 2 >= o; o++)
        for (r = 0; r < e.preference.length; r++)
          if (i = e.preference[r], 1 === i) {
            if (l(), !u) {
              return null;
            }
            if (2 === o || u.fitsAbove) {
              return {
                top: u.aboveTop,
                left: u.left
              };
            }
          } else {
            if (2 !== i) {
              return this._prepareRenderWidgetAtExactPosition(a, t);
            }
            if (l(), !u) {
              return null;
            }
            if (2 === o || u.fitsBelow) {
              return {
                top: u.belowTop,
                left: u.left
              };
            }
          }
    };

    t.prototype._render = function(e, t) {
      var n;

      var i;

      var o = this;

      var r = {};
      for (i in this._widgets) {
        if (this._widgets.hasOwnProperty(i)) {
          n = this._prepareRenderWidget(this._widgets[i], e);
          if (n) {
            if (t) {
              t.renderedContentWidgets++;
            }
            r[i] = n;
          }
        }
      }
      this._requestModificationFrame(function() {
        var e;

        var t;

        var n;
        for (e in o._widgets) {
          if (o._widgets.hasOwnProperty(e)) {
            t = o._widgets[e];
            n = o._widgets[e].widget.getDomNode();
            if (r.hasOwnProperty(e)) {
              n.style.top = r[e].top + "px";
              n.style.left = r[e].left + "px";
              if (!t.isVisible) {
                t.isVisible = !0;
              }
            } else {
              if (t.isVisible) {
                t.isVisible = !1;
                n.style.top = "-1000px";
              }
            }
          }
        }
      });
    };

    return t;
  }(o.ViewPart);
  t.ViewContentWidgets = r;
});