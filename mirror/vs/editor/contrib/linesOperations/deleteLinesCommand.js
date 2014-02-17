define("vs/editor/contrib/linesOperations/deleteLinesCommand", ["require", "exports", "vs/editor/core/range",
  "vs/editor/core/selection"
], function(e, t, n, i) {
  function o(e) {
    var t = e.endLineNumber;
    e.startLineNumber < e.endLineNumber && 1 === e.endColumn && (t -= 1);

    return new r(e.startLineNumber, t, e.positionColumn);
  }
  t.createFromSelection = o;
  var r = function() {
    function e(e, t, n) {
      this.startLineNumber = e;

      this.endLineNumber = t;

      this.restoreCursorToColumn = n;
    }
    e.prototype.getEditOperations = function(e, t) {
      if (1 !== e.getLineCount() || 1 !== e.getLineMaxColumn(1)) {
        var i = this.startLineNumber;

        var o = this.endLineNumber;

        var r = 1;

        var s = e.getLineMaxColumn(o);
        if (o < e.getLineCount()) {
          o += 1;
          s = 1;
        }

        {
          if (i > 1) {
            i -= 1;
            r = e.getLineMaxColumn(i);
          }
        }

        t.addEditOperation(new n.Range(i, r, o, s), null);
      }
    };

    e.prototype.computeCursorState = function(e, t) {
      var n = t.getInverseEditOperations();

      var o = n[0].range;
      return new i.Selection(o.endLineNumber, this.restoreCursorToColumn, o.endLineNumber, this.restoreCursorToColumn);
    };

    return e;
  }();
  t.DeleteLinesCommand = r;
});