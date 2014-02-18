define(["require", "exports", "vs/editor/core/range", "vs/editor/core/selection", "vs/editor/core/view/viewContext"],
  function(a, b, c, d, e) {
    var f = c;

    var g = d;

    var h = e;

    var i = function() {
      function a(a, b) {
        this.configuration = a;

        this.converter = b;

        this.lastCursorPositionChangedEvent = null;

        this.lastCursorSelectionChangedEvent = null;
      }
      a.prototype.getSelections = function() {
        if (this.lastCursorSelectionChangedEvent) {
          var a = [];
          a.push(this.converter.convertModelSelectionToViewSelection(this.lastCursorSelectionChangedEvent.selection));
          for (var b = 0, c = this.lastCursorSelectionChangedEvent.secondarySelections.length; b < c; b++) {
            a.push(this.converter.convertModelSelectionToViewSelection(this.lastCursorSelectionChangedEvent.secondarySelections[
              b]));
          }
          return a;
        }
        return [new g.Selection(1, 1, 1, 1)];
      };

      a.prototype.onCursorPositionChanged = function(a, b) {
        this.lastCursorPositionChangedEvent = a;
        var c = this.converter.validateViewPosition(a.viewPosition.lineNumber, a.viewPosition.column, a.position);

        var d = this.configuration.editor.stopRenderingLineAfter;
        if (d !== -1 && c.column > d) {
          c = c.clone();
          c.column = d;
        }
        var e = [];
        for (var f = 0, g = a.secondaryPositions.length; f < g; f++) {
          e[f] = this.converter.validateViewPosition(a.secondaryViewPositions[f].lineNumber, a.secondaryViewPositions[f]
            .column, a.secondaryPositions[f]);
          if (d !== -1 && e[f].column > d) {
            e[f] = e[f].clone();
            e[f].column = d;
          }
        }
        var i = {
          position: c,
          secondaryPositions: e,
          isInEditableRange: a.isInEditableRange
        };
        b(h.EventNames.CursorPositionChangedEvent, i);
      };

      a.prototype.onCursorSelectionChanged = function(a, b) {
        this.lastCursorSelectionChangedEvent = a;
        var c = this.converter.convertModelSelectionToViewSelection(a.selection);

        var d = [];
        for (var e = 0, f = a.secondarySelections.length; e < f; e++) {
          d[e] = this.converter.convertModelSelectionToViewSelection(a.secondarySelections[e]);
        }
        var g = {
          selection: c,
          secondarySelections: d
        };
        b(h.EventNames.CursorSelectionChangedEvent, g);
      };

      a.prototype.onCursorRevealRange = function(a, b) {
        var c = null;
        if (a.viewRange) {
          var d = this.converter.validateViewPosition(a.viewRange.startLineNumber, a.viewRange.startColumn, a.range.getStartPosition());

          var e = this.converter.validateViewPosition(a.viewRange.endLineNumber, a.viewRange.endColumn, a.range.getEndPosition());
          c = new f.Range(d.lineNumber, d.column, e.lineNumber, e.column);
        } else {
          c = this.converter.convertModelRangeToViewRange(a.range);
        }
        var g = {
          range: c,
          revealVerticalInCenter: a.revealVerticalInCenter,
          revealHorizontal: a.revealHorizontal
        };
        b(h.EventNames.RevealRangeEvent, g);
      };

      a.prototype.onLineMappingChanged = function(a) {
        if (this.lastCursorPositionChangedEvent) {
          this.onCursorPositionChanged(this.lastCursorPositionChangedEvent, a);
        }

        if (this.lastCursorSelectionChangedEvent) {
          this.onCursorSelectionChanged(this.lastCursorSelectionChangedEvent, a);
        }
      };

      return a;
    }();
    b.ViewModelCursors = i;
  });