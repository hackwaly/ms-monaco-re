define(["require", "exports", "vs/base/arrays"], function(a, b, c) {
  var d = c,
    e = function() {
      function a(a, b, c) {
        this._original = a, this._startOffset = b, this._endOffset = c, this.tokens = [];
        var e = a.getTokens();
        if (e.length > 0) {
          var f = d.findIndexInSegmentsArray(e, b),
            g, h, i;
          this.tokens.push({
            startIndex: 0,
            type: e[f].type
          });
          for (h = f + 1, i = e.length; h < i; h++) {
            g = e[h];
            if (g.startIndex >= c) break;
            this.tokens.push({
              startIndex: g.startIndex - b,
              type: g.type
            })
          }
        }
      }
      return a.prototype.getTokens = function() {
        return this.tokens
      }, a.prototype.getTextLength = function() {
        return this._endOffset - this._startOffset
      }, a.prototype.equals = function(b) {
        if (b instanceof a) {
          var c = b;
          return this._startOffset !== c._startOffset ? !1 : this._endOffset !== c._endOffset ? !1 : this._original.equals(
            c._original)
        }
        return !1
      }, a.prototype.findIndexOfOffset = function(a) {
        return d.findIndexInSegmentsArray(this.tokens, a)
      }, a
    }();
  b.FilteredLineTokens = e
})