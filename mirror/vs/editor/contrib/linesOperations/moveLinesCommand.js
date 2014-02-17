define("vs/editor/contrib/linesOperations/moveLinesCommand", ["require", "exports", "vs/editor/core/range",
  "vs/editor/core/selection"
], function(e, t, n, i) {
  var o = function() {
    function e(e, t) {
      this._selection = e;

      this._isMovingDown = t;
    }
    e.prototype.getEditOperations = function(e, t) {
      var o = e.getLineCount();
      if (!(this._isMovingDown && this._selection.endLineNumber === o || !this._isMovingDown && 1 === this._selection
        .startLineNumber)) {
        this._moveEndPositionDown = !1;
        var r = this._selection;
        if (r.startLineNumber < r.endLineNumber && 1 === r.endColumn && (this._moveEndPositionDown = !0, r = r.setEndPosition(
            r.endLineNumber - 1, e.getLineMaxColumn(r.endLineNumber - 1))), r.startLineNumber === r.endLineNumber &&
          1 === e.getLineMaxColumn(r.startLineNumber)) {
          var s = r.startLineNumber;

          var a = this._isMovingDown ? s + 1 : s - 1;
          if (1 === e.getLineMaxColumn(a)) {
            t.addEditOperation(new n.Range(1, 1, 1, 1), null);
          }

          {
            t.addEditOperation(new n.Range(s, 1, s, 1), e.getLineContent(a));
            t.addEditOperation(new n.Range(a, 1, a, e.getLineMaxColumn(a)), null);
          }

          r = new i.Selection(a, 1, a, 1);
        } else {
          var u;

          var l;
          if (this._isMovingDown) {
            u = r.endLineNumber + 1;
            l = e.getLineContent(u);
            t.addEditOperation(new n.Range(u - 1, e.getLineMaxColumn(u - 1), u, e.getLineMaxColumn(u)), null);
            t.addEditOperation(new n.Range(r.startLineNumber, 1, r.startLineNumber, 1), l + "\n");
          }

          {
            u = r.startLineNumber - 1;
            l = e.getLineContent(u);
            t.addEditOperation(new n.Range(u, 1, u + 1, 1), null);
            t.addEditOperation(new n.Range(r.endLineNumber, e.getLineMaxColumn(r.endLineNumber), r.endLineNumber, e.getLineMaxColumn(
              r.endLineNumber)), "\n" + l);
          }
        }
        this._selectionId = t.trackSelection(r);
      }
    };

    e.prototype.computeCursorState = function(e, t) {
      var n = t.getTrackedSelection(this._selectionId);
      this._moveEndPositionDown && (n = n.setEndPosition(n.endLineNumber + 1, 1));

      return n;
    };

    return e;
  }();
  t.MoveLinesCommand = o;
});