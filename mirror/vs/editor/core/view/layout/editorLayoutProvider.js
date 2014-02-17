define("vs/editor/core/view/layout/editorLayoutProvider", ["require", "exports"], function(e, t) {
  var n = function() {
    function e(e, t, n, i, o, r, s, a) {
      this.verticalScrollbarWidth = 10;

      this.horizontalScrollbarHeight = 10;

      this.outerWidth = e;

      this.outerHeight = t;

      this.lineHeight = n;

      this.showGlyphMargin = i;

      this.glyphMarginWidth = this.computeGlyphMarginWidth();

      this.showLineNumbers = o;

      this.lineNumbersMinChars = r;

      this.lineDecorationsWidth = s;

      this.lineCount = 0;

      this.maxDigitWidth = a;

      this.lineNumbersWidth = this.computeLineNumbersWidth();

      this.layoutInfo = this.layout();
    }
    e.prototype.setDimensions = function(e, t) {
      return this.outerWidth !== e || this.outerHeight !== t ? (this.outerWidth = e, this.outerHeight = t, this.layoutInfo =
        this.layout(), !0) : !1;
    };

    e.prototype.setScrollbarSize = function(e, t) {
      return this.verticalScrollbarWidth !== e || this.horizontalScrollbarHeight !== t ? (this.verticalScrollbarWidth =
        e, this.horizontalScrollbarHeight = t, this.layoutInfo = this.layout(), !0) : !1;
    };

    e.prototype.setGlyphMargin = function(e) {
      this.showGlyphMargin = e;

      return this.setGlyphMarginWidth(this.computeGlyphMarginWidth());
    };

    e.prototype.setLineHeight = function(e) {
      this.lineHeight = e;

      return this.setGlyphMarginWidth(this.computeGlyphMarginWidth());
    };

    e.prototype.computeGlyphMarginWidth = function() {
      return this.showGlyphMargin ? this.lineHeight : 0;
    };

    e.prototype.setGlyphMarginWidth = function(e) {
      return this.glyphMarginWidth !== e ? (this.glyphMarginWidth = e, this.layoutInfo = this.layout(), !0) : !1;
    };

    e.prototype.setLineDecorationsWidth = function(e) {
      return this.lineDecorationsWidth !== e ? (this.lineDecorationsWidth = e, this.layoutInfo = this.layout(), !0) : !
        1;
    };

    e.prototype.setShowLineNumbers = function(e) {
      this.showLineNumbers = e;

      return this.setLineNumbersWidth(this.computeLineNumbersWidth());
    };

    e.prototype.setLineNumbersMinChars = function(e) {
      this.lineNumbersMinChars = e;

      return this.setLineNumbersWidth(this.computeLineNumbersWidth());
    };

    e.prototype.setLineCount = function(e) {
      this.lineCount = e;

      return this.setLineNumbersWidth(this.computeLineNumbersWidth());
    };

    e.prototype.setMaxDigitWidth = function(e) {
      this.maxDigitWidth = e;

      return this.setLineNumbersWidth(this.computeLineNumbersWidth());
    };

    e.prototype.setLineNumbersWidth = function(e) {
      return this.lineNumbersWidth !== e ? (this.lineNumbersWidth = e, this.layoutInfo = this.layout(), !0) : !1;
    };

    e.prototype.getLayoutInfo = function() {
      return this.layoutInfo;
    };

    e.prototype.layout = function() {
      var e = this.outerWidth;

      var t = this.outerHeight;

      var n = this.lineNumbersWidth;

      var i = this.glyphMarginWidth;

      var o = t;

      var r = t;

      var s = this.lineDecorationsWidth;

      var a = t;

      var u = e - i - n - s;

      var l = t;

      var c = this.verticalScrollbarWidth;

      var d = this.horizontalScrollbarHeight;

      var h = 0;

      var p = h + i;

      var f = p + n;

      var g = f + s;
      return {
        width: e,
        height: t,
        glyphMarginLeft: h,
        glyphMarginWidth: i,
        glyphMarginHeight: r,
        lineNumbersLeft: p,
        lineNumbersWidth: n,
        lineNumbersHeight: o,
        decorationsLeft: f,
        decorationsWidth: s,
        decorationsHeight: a,
        contentLeft: g,
        contentWidth: u,
        contentHeight: l,
        verticalScrollbarWidth: c,
        horizontalScrollbarHeight: d
      };
    };

    e.prototype.digitCount = function(e) {
      for (var t = 0; e;) {
        e = Math.floor(e / 10);
        t++;
      }
      return t ? t : 1;
    };

    e.prototype.computeLineNumbersWidth = function() {
      if (this.showLineNumbers) {
        var e = Math.max(this.digitCount(this.lineCount), this.lineNumbersMinChars);
        return e * this.maxDigitWidth;
      }
      return 0;
    };

    return e;
  }();
  t.EditorLayoutProvider = n;
});