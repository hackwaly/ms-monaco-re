define(["require", "exports"], function(a, b) {
  var c = function() {
    function a(a, b, c, d, e, f, g) {
      this.verticalScrollbarWidth = 10;

      this.horizontalScrollbarHeight = 10;

      this.outerWidth = a;

      this.outerHeight = b;

      this.lineHeight = c;

      this.showGlyphMargin = d;

      this.glyphMarginWidth = this.computeGlyphMarginWidth();

      this.showLineNumbers = e;

      this.lineNumbersMinChars = f;

      this.lineCount = 0;

      this.maxDigitWidth = g;

      this.lineNumbersWidth = this.computeLineNumbersWidth();

      this.layoutInfo = this.layout();
    }
    a.prototype.setDimensions = function(a, b) {
      return this.outerWidth !== a || this.outerHeight !== b ? (this.outerWidth = a, this.outerHeight = b, this.layoutInfo =
        this.layout(), !0) : !1;
    };

    a.prototype.setScrollbarSize = function(a, b) {
      return this.verticalScrollbarWidth !== a || this.horizontalScrollbarHeight !== b ? (this.verticalScrollbarWidth =
        a, this.horizontalScrollbarHeight = b, this.layoutInfo = this.layout(), !0) : !1;
    };

    a.prototype.setGlyphMargin = function(a) {
      this.showGlyphMargin = a;

      return this.setGlyphMarginWidth(this.computeGlyphMarginWidth());
    };

    a.prototype.setLineHeight = function(a) {
      this.lineHeight = a;

      return this.setGlyphMarginWidth(this.computeGlyphMarginWidth());
    };

    a.prototype.computeGlyphMarginWidth = function() {
      return this.showGlyphMargin ? this.lineHeight : 0;
    };

    a.prototype.setGlyphMarginWidth = function(a) {
      return this.glyphMarginWidth !== a ? (this.glyphMarginWidth = a, this.layoutInfo = this.layout(), !0) : !1;
    };

    a.prototype.setShowLineNumbers = function(a) {
      this.showLineNumbers = a;

      return this.setLineNumbersWidth(this.computeLineNumbersWidth());
    };

    a.prototype.setLineNumbersMinChars = function(a) {
      this.lineNumbersMinChars = a;

      return this.setLineNumbersWidth(this.computeLineNumbersWidth());
    };

    a.prototype.setLineCount = function(a) {
      this.lineCount = a;

      return this.setLineNumbersWidth(this.computeLineNumbersWidth());
    };

    a.prototype.setMaxDigitWidth = function(a) {
      this.maxDigitWidth = a;

      return this.setLineNumbersWidth(this.computeLineNumbersWidth());
    };

    a.prototype.setLineNumbersWidth = function(a) {
      return this.lineNumbersWidth !== a ? (this.lineNumbersWidth = a, this.layoutInfo = this.layout(), !0) : !1;
    };

    a.prototype.getLayoutInfo = function() {
      return this.layoutInfo;
    };

    a.prototype.layout = function() {
      var b = this.outerWidth;

      var c = this.outerHeight;

      var d = this.lineNumbersWidth;

      var e = this.glyphMarginWidth;

      var f = c;

      var g = c;

      var h = a.DECORATIONS_WIDTH;

      var i = c;

      var j = b - e - d - h;

      var k = c;

      var l = this.verticalScrollbarWidth;

      var m = this.horizontalScrollbarHeight;

      var n = 0;

      var o = n + e;

      var p = o + d;

      var q = p + h;
      return {
        width: b,
        height: c,
        glyphMarginLeft: n,
        glyphMarginWidth: e,
        glyphMarginHeight: g,
        lineNumbersLeft: o,
        lineNumbersWidth: d,
        lineNumbersHeight: f,
        decorationsLeft: p,
        decorationsWidth: h,
        decorationsHeight: i,
        contentLeft: q,
        contentWidth: j,
        contentHeight: k,
        verticalScrollbarWidth: l,
        horizontalScrollbarHeight: m
      };
    };

    a.prototype.digitCount = function(a) {
      var b = 0;
      while (a) {
        a = Math.floor(a / 10);
        b++;
      }
      return b ? b : 1;
    };

    a.prototype.computeLineNumbersWidth = function() {
      if (this.showLineNumbers) {
        var a = Math.max(this.digitCount(this.lineCount), this.lineNumbersMinChars);
        return a * this.maxDigitWidth;
      }
      return 0;
    };

    a.DECORATIONS_WIDTH = 10;

    return a;
  }();
  b.EditorLayoutProvider = c;
});