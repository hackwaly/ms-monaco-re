var __extends = this.__extends || function(a, b) {
    function d() {
      this.constructor = a;
    }
    for (var c in b) {
      if (b.hasOwnProperty(c)) {
        a[c] = b[c];
      }
    }
    d.prototype = b.prototype;

    a.prototype = new d;
  };

define(["require", "exports", "vs/editor/core/view/viewContext", "vs/editor/core/view/viewEventHandler",
  "vs/css!./lineNumbers"
], function(a, b, c, d) {
  var e = c;

  var f = d;

  var g = function(a) {
    function b(b) {
      a.call(this);

      this.context = b;

      this.lineNumbersLeft = 0;

      this.lineNumbersWidth = 0;

      this.previousRender = [];

      this.context.addEventHandler(this);
    }
    __extends(b, a);

    b.prototype.dispose = function() {
      this.context.removeEventHandler(this);

      this.context = null;

      this.previousRender = null;
    };

    b.prototype.onModelFlushed = function() {
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
      return !1;
    };

    b.prototype.onCursorSelectionChanged = function(a) {
      return !1;
    };

    b.prototype.onCursorRevealRange = function(a) {
      return !1;
    };

    b.prototype.onConfigurationChanged = function(a) {
      return !0;
    };

    b.prototype.onConfigurationFontChanged = function() {
      return !0;
    };

    b.prototype.onConfigurationLineHeightChanged = function() {
      return !0;
    };

    b.prototype.onLayoutChanged = function(a) {
      this.lineNumbersLeft = a.lineNumbersLeft;

      this.lineNumbersWidth = a.lineNumbersWidth;

      return !0;
    };

    b.prototype.onScrollChanged = function(a) {
      return a.vertical;
    };

    b.prototype.onZonesChanged = function() {
      return !0;
    };

    b.prototype.onScrollWidthChanged = function() {
      return !1;
    };

    b.prototype.onScrollHeightChanged = function(a) {
      return !1;
    };

    b.prototype.actualRender = function(a) {
      var b = [];
      if (!this.context.configuration.editor.lineNumbers) {
        return b;
      }
      var c;

      var d;
      b.push('<div class="');

      b.push(e.ClassNames.LINE_NUMBERS);

      b.push('" style="left:');

      b.push(this.lineNumbersLeft.toString());

      b.push("px;width:");

      b.push(this.lineNumbersWidth.toString());

      b.push("px;height:");

      b.push(a.scrollHeight.toString());

      b.push('px;">');
      for (d = a.visibleRange.startLineNumber; d <= a.visibleRange.endLineNumber; d++) {
        c = a.getViewportVerticalOffsetForLineNumber(d);
        b.push('<div style="top:');
        b.push(c.toString());
        b.push('px;">');
        b.push(this.context.model.getLineRenderLineNumber(d));
        b.push("</div>");
      }
      b.push("</div>");

      return b;
    };

    b.prototype.shouldCallRender = function() {
      return this.shouldRender;
    };

    b.prototype.render = function(a) {
      this.shouldRender && (this.previousRender = this.actualRender(a), this.shouldRender = !1);

      return this.previousRender;
    };

    return b;
  }(f.ViewEventHandler);
  b.LineNumbersOverlay = g;
});