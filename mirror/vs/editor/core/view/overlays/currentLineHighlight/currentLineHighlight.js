define("vs/editor/core/view/overlays/currentLineHighlight/currentLineHighlight", ["require", "exports",
  "vs/editor/core/view/viewEventHandler", "vs/css!./currentLineHighlight"
], function(e, t, n) {
  var i = function(e) {
    function t(t) {
      e.call(this);

      this._context = t;

      this._currentLine = document.createElement("div");

      this._currentLine.className = "current-line";

      this._currentLineIsVisible = !0;

      this._currentLine.style.width = "0px";

      this._currentLine.style.height = this._context.configuration.editor.lineHeight + "px";

      this._selectionIsEmpty = !0;

      this._primaryCursorIsInEditableRange = !0;

      this._updatePrimaryCursorPosition({
        lineNumber: 1,
        column: 1
      });

      this._updateCurrentLine();

      this._context.addEventHandler(this);
    }
    __extends(t, e);

    t.prototype._updatePrimaryCursorPosition = function(e) {
      this._primaryCursorPosition = e;

      this._primaryCursorPositionTop = -1e3;
    };

    t.prototype.dispose = function() {
      this._context.removeEventHandler(this);
    };

    t.prototype.getDomNode = function() {
      return this._currentLine;
    };

    t.prototype.onModelFlushed = function() {
      this._primaryCursorIsInEditableRange = !0;

      this._selectionIsEmpty = !0;

      this._updatePrimaryCursorPosition({
        lineNumber: 1,
        column: 1
      });

      return !0;
    };

    t.prototype.onModelLinesDeleted = function() {
      return !0;
    };

    t.prototype.onModelLinesInserted = function() {
      return !0;
    };

    t.prototype.onCursorPositionChanged = function(e) {
      this._primaryCursorIsInEditableRange = e.isInEditableRange;

      this._updatePrimaryCursorPosition(e.position);

      this._updateCurrentLine();

      return !0;
    };

    t.prototype.onCursorSelectionChanged = function(e) {
      this._selectionIsEmpty = e.selection.isEmpty();

      this._updateCurrentLine();

      return !1;
    };

    t.prototype.onConfigurationChanged = function(e) {
      e.lineHeight && (this._currentLine.style.height = this._context.configuration.editor.lineHeight + "px");

      return !0;
    };

    t.prototype.onLayoutChanged = function(e) {
      this._currentLine.style.left = e.contentLeft + "px";

      this._currentLine.style.width = e.contentWidth + "px";

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

    t.prototype._shouldShowCurrentLine = function() {
      return this._selectionIsEmpty && this._primaryCursorIsInEditableRange && !this._context.configuration.editor.readOnly;
    };

    t.prototype._updateCurrentLine = function() {
      if (this._shouldShowCurrentLine()) {
        if (!this._currentLineIsVisible) {
          this._currentLine.style.display = "block";
          this._currentLineIsVisible = !0;
        }
      }

      {
        if (this._currentLineIsVisible) {
          this._currentLine.style.display = "none";
          this._currentLineIsVisible = !1;
        }
      }
    };

    t.prototype.prepareRender = function(e) {
      if (this.shouldRender) {
        var t = e.visibleRangeForPosition(this._primaryCursorPosition);
        this._primaryCursorPositionTop = t ? t.top : -1e3;
      }
    };

    t.prototype.render = function() {
      if (this.shouldRender) {
        this.shouldRender = !1;
        this._currentLine.style.top = this._primaryCursorPositionTop + "px";
      }
    };

    return t;
  }(n.ViewEventHandler);
  t.CurrentLineHighlightOverlay = i;
});