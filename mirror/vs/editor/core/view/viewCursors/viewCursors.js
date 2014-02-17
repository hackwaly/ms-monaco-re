var __extends = this.__extends || function(a, b) {
    function d() {
      this.constructor = a;
    }
    for (var c in b) {
      b.hasOwnProperty(c) && (a[c] = b[c]);
    }
    d.prototype = b.prototype;

    a.prototype = new d;
  };

define(["require", "exports", "vs/editor/core/view/viewEventHandler", "vs/editor/core/view/viewCursors/viewCursor",
  "vs/css!./viewCursors"
], function(a, b, c, d) {
  var e = c;

  var f = d;

  var g;
  (function(a) {
    a[a.Hidden = 0] = "Hidden";

    a[a.Visible = 1] = "Visible";

    a[a.Blink = 2] = "Blink";
  })(g || (g = {}));
  var h = function(a) {
    function b(b) {
      a.call(this);

      this.context = b;

      this.primaryCursor = new f.ViewCursor(this.context, !1);

      this.secondaryCursors = [];

      this.domNode = document.createElement("div");

      this.domNode.className = "cursors-layer";

      this.currentLine = document.createElement("div");

      this.currentLine.className = "current-line";

      this.currentLineIsVisible = !0;

      this.currentLine.style.width = "0px";

      this.currentLine.style.height = this.context.configuration.editor.lineHeight + "px";

      this.domNode.appendChild(this.currentLine);

      this.domNode.appendChild(this.primaryCursor.getDomNode());

      this.blinkTimer = -1;

      this.selectionIsEmpty = !0;

      this.editorHasFocus = !1;

      this.updateCurrentLine();

      this.updateBlinking();

      this.context.addEventHandler(this);
    }
    __extends(b, a);

    b.prototype.dispose = function() {
      this.context.removeEventHandler(this);

      this.blinkTimer !== -1 && (window.clearInterval(this.blinkTimer), this.blinkTimer = -1);
    };

    b.prototype.getDomNode = function() {
      return this.domNode;
    };

    b.prototype.onModelFlushed = function() {
      this.primaryCursor.onModelFlushed();
      for (var a = 0, b = this.secondaryCursors.length; a < b; a++) {
        var c = this.secondaryCursors[a].getDomNode();
        c.parentNode.removeChild(c);
      }
      this.secondaryCursors = [];

      return !0;
    };

    b.prototype.onModelDecorationsChanged = function(a) {
      return !1;
    };

    b.prototype.onModelLinesDeleted = function(a) {
      return !0;
    };

    b.prototype.onModelLineChanged = function(a) {
      return !0;
    };

    b.prototype.onModelLinesInserted = function(a) {
      return !0;
    };

    b.prototype.onCursorPositionChanged = function(a) {
      this.primaryCursor.onCursorPositionChanged(a.position, a.isInEditableRange);

      this.updateBlinking();

      this.updateCurrentLine();
      if (this.secondaryCursors.length < a.secondaryPositions.length) {
        var b = a.secondaryPositions.length - this.secondaryCursors.length;
        for (var c = 0; c < b; c++) {
          var d = new f.ViewCursor(this.context, !0);
          this.primaryCursor.getDomNode().parentNode.insertBefore(d.getDomNode(), this.primaryCursor.getDomNode().nextSibling);

          this.secondaryCursors.push(d);
        }
      } else if (this.secondaryCursors.length > a.secondaryPositions.length) {
        var e = this.secondaryCursors.length - a.secondaryPositions.length;
        for (var c = 0; c < e; c++) {
          this.secondaryCursors[0].getDomNode().parentNode.removeChild(this.secondaryCursors[0].getDomNode());
          this.secondaryCursors.splice(0, 1);
        }
      }
      for (var c = 0; c < a.secondaryPositions.length; c++) {
        this.secondaryCursors[c].onCursorPositionChanged(a.secondaryPositions[c], a.isInEditableRange);
      }
      return !0;
    };

    b.prototype.onCursorSelectionChanged = function(a) {
      this.selectionIsEmpty = a.selection.isEmpty();

      this.updateCurrentLine();

      return !1;
    };

    b.prototype.onConfigurationChanged = function(a) {
      this.primaryCursor.onConfigurationChanged(a);
      for (var b = 0, c = this.secondaryCursors.length; b < c; b++) {
        this.secondaryCursors[b].onConfigurationChanged(a);
      }
      return !0;
    };

    b.prototype.onConfigurationFontChanged = function() {
      return !0;
    };

    b.prototype.onConfigurationLineHeightChanged = function() {
      this.primaryCursor.onConfigurationLineHeightChanged();
      for (var a = 0, b = this.secondaryCursors.length; a < b; a++) {
        this.secondaryCursors[a].onConfigurationLineHeightChanged();
      }
      this.currentLine.style.height = this.context.configuration.editor.lineHeight + "px";

      return !0;
    };

    b.prototype.onLayoutChanged = function(a) {
      this.domNode.style.left = a.contentLeft + "px";

      return !0;
    };

    b.prototype.onScrollChanged = function(a) {
      return !0;
    };

    b.prototype.onZonesChanged = function() {
      return !0;
    };

    b.prototype.onScrollWidthChanged = function() {
      return !0;
    };

    b.prototype.onScrollHeightChanged = function(a) {
      return !1;
    };

    b.prototype.onViewFocusChanged = function(a) {
      this.editorHasFocus = a;

      this.updateBlinking();

      return !1;
    };

    b.prototype.getPosition = function() {
      return this.primaryCursor.getPosition();
    };

    b.prototype._shouldShowCurrentLine = function() {
      return this.selectionIsEmpty && this.primaryCursor.getIsInEditableRange() && !this.context.configuration.editor
        .readOnly;
    };

    b.prototype.updateCurrentLine = function() {
      this._shouldShowCurrentLine() ? this.currentLineIsVisible || (this.currentLine.style.display = "block", this.currentLineIsVisible = !
        0) : this.currentLineIsVisible && (this.currentLine.style.display = "none", this.currentLineIsVisible = !1);
    };

    b.prototype.getRenderType = function() {
      return this.editorHasFocus ? this.primaryCursor.getIsInEditableRange() && !this.context.configuration.editor.readOnly ?
        g.Blink : g.Visible : g.Hidden;
    };

    b.prototype.updateBlinking = function() {
      var a = this;
      this.blinkTimer !== -1 && (window.clearInterval(this.blinkTimer), this.blinkTimer = -1);
      var c = this.getRenderType();
      c === g.Visible || c === g.Blink ? this._show() : this._hide();

      c === g.Blink && (this.blinkTimer = window.setInterval(function() {
        return a._blink();
      }, b.BLINK_INTERVAL));
    };

    b.prototype._blink = function() {
      this.isVisible ? this._hide() : this._show();
    };

    b.prototype._show = function() {
      this.primaryCursor.show();
      for (var a = 0, b = this.secondaryCursors.length; a < b; a++) {
        this.secondaryCursors[a].show();
      }
      this.isVisible = !0;
    };

    b.prototype._hide = function() {
      this.primaryCursor.hide();
      for (var a = 0, b = this.secondaryCursors.length; a < b; a++) {
        this.secondaryCursors[a].hide();
      }
      this.isVisible = !1;
    };

    b.prototype.prepareRender = function(a) {
      if (!this.shouldRender) return;
      this.primaryCursor.prepareRender(a);
      for (var b = 0, c = this.secondaryCursors.length; b < c; b++) {
        this.secondaryCursors[b].prepareRender(a);
      }
    };

    b.prototype.render = function(a) {
      if (!this.shouldRender) return;
      this.shouldRender = !1;

      this.primaryCursor.render(a);
      for (var b = 0, c = this.secondaryCursors.length; b < c; b++) {
        this.secondaryCursors[b].render(a);
      }
      this.currentLine.style.top = this.primaryCursor.getPositionTop() + "px";

      this.currentLine.style.width = a.scrollWidth + "px";
    };

    b.BLINK_INTERVAL = 500;

    return b;
  }(e.ViewEventHandler);
  b.ViewCursors = h;
});