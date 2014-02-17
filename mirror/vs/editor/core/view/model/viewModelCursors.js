define("vs/editor/core/view/model/viewModelCursors", ["require", "exports", "vs/editor/core/range",
  "vs/editor/core/selection", "vs/editor/core/view/viewContext"
], function(e, t, n, i, o) {
  var r = function() {
    function e(e, t) {
      this.configuration = e;

      this.converter = t;

      this.lastCursorPositionChangedEvent = null;

      this.lastCursorSelectionChangedEvent = null;
    }
    e.prototype.getSelections = function() {
      if (this.lastCursorSelectionChangedEvent) {
        var e = [];
        e.push(this.converter.convertModelSelectionToViewSelection(this.lastCursorSelectionChangedEvent.selection));
        for (var t = 0, n = this.lastCursorSelectionChangedEvent.secondarySelections.length; n > t; t++) {
          e.push(this.converter.convertModelSelectionToViewSelection(this.lastCursorSelectionChangedEvent.secondarySelections[
            t]));
        }
        return e;
      }
      return [new i.Selection(1, 1, 1, 1)];
    };

    e.prototype.onCursorPositionChanged = function(e, t) {
      this.lastCursorPositionChangedEvent = e;
      var n = this.converter.validateViewPosition(e.viewPosition.lineNumber, e.viewPosition.column, e.position);

      var i = this.configuration.editor.stopRenderingLineAfter;
      if (-1 !== i && n.column > i) {
        n = n.clone();
        n.column = i;
      }
      for (var r = [], s = 0, a = e.secondaryPositions.length; a > s; s++) {
        r[s] = this.converter.validateViewPosition(e.secondaryViewPositions[s].lineNumber, e.secondaryViewPositions[s]
          .column, e.secondaryPositions[s]);
        if (-1 !== i && r[s].column > i) {
          r[s] = r[s].clone();
          r[s].column = i;
        }
      }
      var u = {
        position: n,
        secondaryPositions: r,
        isInEditableRange: e.isInEditableRange
      };
      t(o.EventNames.CursorPositionChangedEvent, u);
    };

    e.prototype.onCursorSelectionChanged = function(e, t) {
      this.lastCursorSelectionChangedEvent = e;
      for (var n = this.converter.convertModelSelectionToViewSelection(e.selection), i = [], r = 0, s = e.secondarySelections
          .length; s > r; r++) {
        i[r] = this.converter.convertModelSelectionToViewSelection(e.secondarySelections[r]);
      }
      var a = {
        selection: n,
        secondarySelections: i
      };
      t(o.EventNames.CursorSelectionChangedEvent, a);
    };

    e.prototype.onCursorRevealRange = function(e, t) {
      var i = null;
      if (e.viewRange) {
        var r = this.converter.validateViewPosition(e.viewRange.startLineNumber, e.viewRange.startColumn, e.range.getStartPosition());

        var s = this.converter.validateViewPosition(e.viewRange.endLineNumber, e.viewRange.endColumn, e.range.getEndPosition());
        i = new n.Range(r.lineNumber, r.column, s.lineNumber, s.column);
      } else {
        i = this.converter.convertModelRangeToViewRange(e.range);
      }
      var a = {
        range: i,
        revealVerticalInCenter: e.revealVerticalInCenter,
        revealHorizontal: e.revealHorizontal
      };
      t(o.EventNames.RevealRangeEvent, a);
    };

    e.prototype.onLineMappingChanged = function(e) {
      if (this.lastCursorPositionChangedEvent) {
        this.onCursorPositionChanged(this.lastCursorPositionChangedEvent, e);
      }

      if (this.lastCursorSelectionChangedEvent) {
        this.onCursorSelectionChanged(this.lastCursorSelectionChangedEvent, e);
      }
    };

    return e;
  }();
  t.ViewModelCursors = r;
});