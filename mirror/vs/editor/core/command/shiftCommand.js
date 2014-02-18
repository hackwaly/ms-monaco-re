define(["require", "exports", "vs/editor/core/range"], function(a, b, c) {
  var d = c;

  var e = function() {
    function a(a, b, c) {
      this._configuration = a;

      this._isUnshift = b;

      this._selection = c;
    }
    a.prototype.getEditOperations = function(a, b) {
      var c = this._selection.startLineNumber;

      var e = this._selection.endLineNumber;
      if (this._selection.endColumn === 1 && c !== e) {
        e -= 1;
      }
      var f;
      if (this._isUnshift) {
        var g = this._configuration.editor.tabSize;
        for (f = c; f <= e; f++) {
          var h = a.getLineContent(f);

          var i;
          if (h.charAt(0) === "	") {
            i = 1;
          } else
            for (i = 0; i < h.length && i < g; i++) {
              if (h.charAt(i) === "	") {
                i++;
                break;
              }
              if (h.charAt(i) !== " ") break;
            }
          if (i !== 0) {
            b.addEditOperation(new d.Range(f, 1, f, i + 1), null);
          }
        }
      } else {
        var j = this._configuration.getOneIndent();
        for (f = c; f <= e; f++) {
          b.addEditOperation(new d.Range(f, 1, f, 1), j);
        }
      }
      this._selectionId = b.trackSelection(this._selection);
    };

    a.prototype.computeCursorState = function(a, b) {
      return b.getTrackedSelection(this._selectionId);
    };

    return a;
  }();
  b.ShiftCommand = e;
});