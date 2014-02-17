define("vs/editor/contrib/find/replaceAllCommand", ["require", "exports", "vs/editor/core/range",
  "vs/editor/core/selection"
], function(e, t, n, i) {
  var o = function() {
    function e(e, t) {
      this._ranges = e;

      this._replaceStrings = t;
    }
    e.prototype.getEditOperations = function(e, t) {
      if (this._ranges.length > 0) {
        for (var i = [], o = 0; o < this._ranges.length; o++) i.push({
          range: this._ranges[o],
          text: this._replaceStrings[o]
        });
        i.sort(function(e, t) {
          return n.compareRangesUsingStarts(e.range, t.range);
        });
        for (var r = [], s = i[0], o = 1; o < i.length; o++) s.range.endLineNumber === i[o].range.startLineNumber &&
          s.range.endColumn === i[o].range.startColumn ? (s.range = s.range.plusRange(i[o].range), s.text = s.text +
            i[o].text) : (r.push(s), s = i[o]);
        r.push(s);
        for (var o = 0; o < r.length; o++) t.addEditOperation(r[o].range, r[o].text);
      }
    };

    e.prototype.computeCursorState = function(e, t) {
      var n = t.getInverseEditOperations();

      var o = n[n.length - 1].range;
      return new i.Selection(o.endLineNumber, o.endColumn, o.endLineNumber, o.endColumn);
    };

    return e;
  }();
  t.ReplaceAllCommand = o;
});