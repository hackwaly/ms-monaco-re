define(["require", "exports", "vs/editor/core/range", "vs/editor/core/selection"], function(a, b, c, d) {
  var e = c;

  var f = d;

  var g = function() {
    function a(a) {
      this.selection = a;
    }
    a.prototype.getEditOperations = function(a, b) {
      if (a.getLineCount() === 1 && a.getLineMaxColumn(1) === 1) return;
      var c = this.selection.startLineNumber;

      var d = this.selection.startColumn;

      var f = this.selection.endLineNumber;

      var g = this.selection.endColumn;
      if (c < f && g === 1) {
        f -= 1;
      }

      d = 1;

      g = a.getLineMaxColumn(f);

      f < a.getLineCount() ? (f += 1, g = 1) : c > 1 && (c -= 1, d = a.getLineMaxColumn(c));

      b.addEditOperation(new e.Range(c, d, f, g), null);
    };

    a.prototype.computeCursorState = function(a, b) {
      var c = b.getInverseEditOperations();

      var d = c[0].range;
      return new f.Selection(d.endLineNumber, this.selection.positionColumn, d.endLineNumber, this.selection.positionColumn);
    };

    return a;
  }();
  b.DeleteLinesCommand = g;
});