define("vs/editor/core/view/parts/viewCursors/viewCursors", ["require", "exports",
  "vs/editor/core/view/parts/viewCursors/viewCursor", "vs/editor/core/view/viewPart", "vs/css!./viewCursors"
], function(e, t, n, i) {
  var o;
  ! function(e) {
    e[e.Hidden = 0] = "Hidden";

    e[e.Visible = 1] = "Visible";

    e[e.Blink = 2] = "Blink";
  }(o || (o = {}));
  var r = function(e) {
    function t(t) {
      e.call(this, t);

      this._primaryCursor = new n.ViewCursor(this._context, !1);

      this._secondaryCursors = [];

      this._domNode = document.createElement("div");

      this._domNode.className = "cursors-layer";

      this._domNode.appendChild(this._primaryCursor.getDomNode());

      this._blinkTimer = -1;

      this._editorHasFocus = !1;

      this._updateBlinking();
    }
    __extends(t, e);

    t.prototype.dispose = function() {
      e.prototype.dispose.call(this);

      - 1 !== this._blinkTimer && (window.clearInterval(this._blinkTimer), this._blinkTimer = -1);
    };

    t.prototype.getDomNode = function() {
      return this._domNode;
    };

    t.prototype.onModelFlushed = function() {
      this._primaryCursor.onModelFlushed();
      for (var e = 0, t = this._secondaryCursors.length; t > e; e++) {
        var n = this._secondaryCursors[e].getDomNode();
        n.parentNode.removeChild(n);
      }
      this._secondaryCursors = [];

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

    t.prototype.onCursorPositionChanged = function(e) {
      if (this._primaryCursor.onCursorPositionChanged(e.position, e.isInEditableRange), this._updateBlinking(), this._secondaryCursors
        .length < e.secondaryPositions.length)
        for (var t = e.secondaryPositions.length - this._secondaryCursors.length, i = 0; t > i; i++) {
          var o = new n.ViewCursor(this._context, !0);
          this._primaryCursor.getDomNode().parentNode.insertBefore(o.getDomNode(), this._primaryCursor.getDomNode().nextSibling);

          this._secondaryCursors.push(o);
        } else if (this._secondaryCursors.length > e.secondaryPositions.length)
          for (var r = this._secondaryCursors.length - e.secondaryPositions.length, i = 0; r > i; i++) {
            this._secondaryCursors[0].getDomNode().parentNode.removeChild(this._secondaryCursors[0].getDomNode());
            this._secondaryCursors.splice(0, 1);
          }
      for (var i = 0; i < e.secondaryPositions.length; i++) {
        this._secondaryCursors[i].onCursorPositionChanged(e.secondaryPositions[i], e.isInEditableRange);
      }
      return !0;
    };

    t.prototype.onCursorSelectionChanged = function() {
      return !1;
    };

    t.prototype.onConfigurationChanged = function(e) {
      this._primaryCursor.onConfigurationChanged(e);
      for (var t = 0, n = this._secondaryCursors.length; n > t; t++) {
        this._secondaryCursors[t].onConfigurationChanged(e);
      }
      return !0;
    };

    t.prototype.onLayoutChanged = function() {
      return !0;
    };

    t.prototype.onScrollChanged = function() {
      return !0;
    };

    t.prototype.onZonesChanged = function() {
      return !0;
    };

    t.prototype.onScrollWidthChanged = function() {
      return !0;
    };

    t.prototype.onScrollHeightChanged = function() {
      return !1;
    };

    t.prototype.onViewFocusChanged = function(e) {
      this._editorHasFocus = e;

      this._updateBlinking();

      return !1;
    };

    t.prototype.getPosition = function() {
      return this._primaryCursor.getPosition();
    };

    t.prototype._getRenderType = function() {
      return this._editorHasFocus ? this._primaryCursor.getIsInEditableRange() && !this._context.configuration.editor
        .readOnly ? 2 : 1 : 0;
    };

    t.prototype._updateBlinking = function() {
      var e = this; - 1 !== this._blinkTimer && (window.clearInterval(this._blinkTimer), this._blinkTimer = -1);
      var n = this._getRenderType();
      1 === n || 2 === n ? this._show() : this._hide();

      2 === n && (this._blinkTimer = window.setInterval(function() {
        return e._blink();
      }, t.BLINK_INTERVAL));
    };

    t.prototype._blink = function() {
      this._isVisible ? this._hide() : this._show();
    };

    t.prototype._show = function() {
      this._primaryCursor.show();
      for (var e = 0, t = this._secondaryCursors.length; t > e; e++) {
        this._secondaryCursors[e].show();
      }
      this._isVisible = !0;
    };

    t.prototype._hide = function() {
      this._primaryCursor.hide();
      for (var e = 0, t = this._secondaryCursors.length; t > e; e++) {
        this._secondaryCursors[e].hide();
      }
      this._isVisible = !1;
    };

    t.prototype._render = function(e) {
      var t = this;
      this._primaryCursor.prepareRender(e);
      for (var n = 0, i = this._secondaryCursors.length; i > n; n++) {
        this._secondaryCursors[n].prepareRender(e);
      }
      this._requestModificationFrame(function() {
        t._primaryCursor.render(e);
        for (var n = 0, i = t._secondaryCursors.length; i > n; n++) {
          t._secondaryCursors[n].render(e);
        }
      });
    };

    t.BLINK_INTERVAL = 500;

    return t;
  }(i.ViewPart);
  t.ViewCursors = r;
});