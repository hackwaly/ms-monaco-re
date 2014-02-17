define("vs/editor/core/view/model/filteredLineTokens", ["require", "exports", "vs/base/arrays"], function(e, t, n) {
  var i = function() {
    function e(e, t, i) {
      this._original = e;

      this._startOffset = t;

      this._endOffset = i;

      this.tokens = [];
      var o = e.getTokens();
      if (o.length > 0) {
        var r;

        var s;

        var a;

        var u = n.findIndexInSegmentsArray(o, t);
        for (this.tokens.push({
          startIndex: 0,
          type: o[u].type
        }), s = u + 1, a = o.length; a > s && (r = o[s], !(r.startIndex >= i)); s++) this.tokens.push({
          startIndex: r.startIndex - t,
          type: r.type
        });
      }
    }
    e.prototype.getTokens = function() {
      return this.tokens;
    };

    e.prototype.getTextLength = function() {
      return this._endOffset - this._startOffset;
    };

    e.prototype.equals = function(t) {
      if (t instanceof e) {
        var n = t;
        return this._startOffset !== n._startOffset ? !1 : this._endOffset !== n._endOffset ? !1 : this._original.equals(
          n._original);
      }
      return !1;
    };

    e.prototype.findIndexOfOffset = function(e) {
      return n.findIndexInSegmentsArray(this.tokens, e);
    };

    return e;
  }();
  t.FilteredLineTokens = i;
});