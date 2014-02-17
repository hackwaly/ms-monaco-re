define("vs/editor/core/command/shiftCommand", ["require", "exports", "vs/editor/core/range"], function(e, t, n) {
  var i = function() {
    function e(e, t, n) {
      this._configuration = e;

      this._isUnshift = t;

      this._selection = n;
    }
    e.prototype.getEditOperations = function(e, t) {
      var i = this._selection.startLineNumber;

      var o = this._selection.endLineNumber;
      1 === this._selection.endColumn && i !== o && (o -= 1);
      var r;
      if (this._isUnshift) {
        var s = this._configuration.getIndentationOptions().tabSize;
        for (r = i; o >= r; r++) {
          var a;

          var u = e.getLineContent(r);
          if ("	" === u.charAt(0)) {
            a = 1;
          } else
            for (a = 0; a < u.length && s > a; a++) {
              if ("	" === u.charAt(a)) {
                a++;
                break;
              }
              if (" " !== u.charAt(a)) break;
            }
          0 !== a && t.addEditOperation(new n.Range(r, 1, r, a + 1), null);
        }
      } else {
        var l = this._configuration.getOneIndent();
        for (r = i; o >= r; r++) {
          t.addEditOperation(new n.Range(r, 1, r, 1), l);
        }
      }
      this._selectionId = t.trackSelection(this._selection);
    };

    e.prototype.computeCursorState = function(e, t) {
      return t.getTrackedSelection(this._selectionId);
    };

    return e;
  }();
  t.ShiftCommand = i;
});