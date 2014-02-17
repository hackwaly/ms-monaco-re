define("vs/editor/core/controller/cursorCollection", ["require", "exports", "vs/editor/core/controller/oneCursor",
  "vs/editor/core/selection", "vs/base/errors"
], function(e, t, n, i, o) {
  var r = function() {
    function e(e, t, i, o) {
      this.editorId = e;

      this.model = t;

      this.configuration = i;

      this.viewModelHelper = o;

      this.modeConfiguration = this.getModeConfiguration();

      this.primaryCursor = new n.OneCursor(this.editorId, this.model, this.configuration, this.modeConfiguration,
        this.viewModelHelper);

      this.secondaryCursors = [];

      this.lastAddedCursorIndex = 0;
    }
    e.prototype.dispose = function() {
      this.primaryCursor.dispose();

      this.killSecondaryCursors();
    };

    e.prototype.getAll = function() {
      var e = [];
      e.push(this.primaryCursor);

      return e = e.concat(this.secondaryCursors);
    };

    e.prototype.getPosition = function(e) {
      return 0 === e ? this.primaryCursor.getPosition() : this.secondaryCursors[e - 1].getPosition();
    };

    e.prototype.getViewPosition = function(e) {
      return 0 === e ? this.primaryCursor.getViewPosition() : this.secondaryCursors[e - 1].getViewPosition();
    };

    e.prototype.getPositions = function() {
      var e = [];
      e.push(this.primaryCursor.getPosition());
      for (var t = 0, n = this.secondaryCursors.length; n > t; t++) {
        e.push(this.secondaryCursors[t].getPosition());
      }
      return e;
    };

    e.prototype.getViewPositions = function() {
      var e = [];
      e.push(this.primaryCursor.getViewPosition());
      for (var t = 0, n = this.secondaryCursors.length; n > t; t++) {
        e.push(this.secondaryCursors[t].getViewPosition());
      }
      return e;
    };

    e.prototype.getSelection = function(e) {
      return 0 === e ? this.primaryCursor.getSelection() : this.secondaryCursors[e - 1].getSelection();
    };

    e.prototype.getSelections = function() {
      var e = [];
      e.push(this.primaryCursor.getSelection());
      for (var t = 0, n = this.secondaryCursors.length; n > t; t++) {
        e.push(this.secondaryCursors[t].getSelection());
      }
      return e;
    };

    e.prototype.getViewSelections = function() {
      var e = [];
      e.push(this.primaryCursor.getViewSelection());
      for (var t = 0, n = this.secondaryCursors.length; n > t; t++) {
        e.push(this.secondaryCursors[t].getViewSelection());
      }
      return e;
    };

    e.prototype.setSelections = function(e) {
      this.primaryCursor.setSelection(e[0]);

      this._setSecondarySelections(e.slice(1));
    };

    e.prototype.killSecondaryCursors = function() {
      return this._setSecondarySelections([]) > 0;
    };

    e.prototype.normalize = function() {
      this._mergeCursorsIfNecessary();

      this.primaryCursor.adjustBracketDecorations();
      for (var e = 0, t = this.secondaryCursors.length; t > e; e++) {
        this.secondaryCursors[e].adjustBracketDecorations();
      }
    };

    e.prototype.addSecondaryCursor = function(e) {
      var t = new n.OneCursor(this.editorId, this.model, this.configuration, this.modeConfiguration, this.viewModelHelper);
      e && t.setSelection(e);

      this.secondaryCursors.push(t);

      this.lastAddedCursorIndex = this.secondaryCursors.length;
    };

    e.prototype.duplicateCursors = function() {
      var e = [];
      e.push(this.primaryCursor.duplicate());
      for (var t = 0, n = this.secondaryCursors.length; n > t; t++) {
        e.push(this.secondaryCursors[t].duplicate());
      }
      this.secondaryCursors = this.secondaryCursors.concat(e);

      this.lastAddedCursorIndex = this.secondaryCursors.length;
    };

    e.prototype.getLastAddedCursor = function() {
      return 0 === this.secondaryCursors.length || 0 === this.lastAddedCursorIndex ? this.primaryCursor : this.secondaryCursors[
        this.lastAddedCursorIndex - 1];
    };

    e.prototype._setSecondarySelections = function(e) {
      var t = this.secondaryCursors.length;

      var n = e.length;

      var i = n - t;
      if (n > t)
        for (var o = n - t, r = 0; o > r; r++) {
          this.addSecondaryCursor(null);
        } else if (t > n)
          for (var s = t - n, r = 0; s > r; r++) {
            this._removeSecondaryCursor(this.secondaryCursors.length - 1);
          }
      for (var r = 0; n > r; r++) {
        e[r] && this.secondaryCursors[r].setSelection(e[r]);
      }
      return i;
    };

    e.prototype._removeSecondaryCursor = function(e) {
      this.lastAddedCursorIndex >= e + 1 && this.lastAddedCursorIndex--;

      this.secondaryCursors[e].dispose();

      this.secondaryCursors.splice(e, 1);
    };

    e.prototype._mergeCursorsIfNecessary = function() {
      if (0 !== this.secondaryCursors.length) {
        for (var e = this.getAll(), t = [], n = 0; n < e.length; n++) {
          t.push({
            index: n,
            selection: e[n].getSelection()
          });
        }
        t.sort(function(e, t) {
          return e.selection.startLineNumber === t.selection.startLineNumber ? e.selection.startColumn - t.selection
            .startColumn : e.selection.startLineNumber - t.selection.startLineNumber;
        });
        for (var o = 0; o < t.length - 1; o++) {
          var r = t[o];

          var s = t[o + 1];

          var a = r.selection;

          var u = s.selection;
          if (u.getStartPosition().isBeforeOrEqual(a.getEndPosition())) {
            var l = r.index < s.index ? o : o + 1;

            var c = r.index < s.index ? o + 1 : o;

            var d = t[c].index;

            var h = t[l].index;

            var p = t[c].selection;

            var f = t[l].selection;
            if (!p.equalsSelection(f)) {
              var g;

              var m = p.plusRange(f);

              var v = p.selectionStartLineNumber === p.startLineNumber && p.selectionStartColumn === p.startColumn;

              var y = f.selectionStartLineNumber === f.startLineNumber && f.selectionStartColumn === f.startColumn;
              d === this.lastAddedCursorIndex ? (g = v, this.lastAddedCursorIndex = h) : g = y;
              var _;
              _ = g ? new i.Selection(m.startLineNumber, m.startColumn, m.endLineNumber, m.endColumn) : new i.Selection(
                m.endLineNumber, m.endColumn, m.startLineNumber, m.startColumn);

              t[l].selection = _;

              e[h].setSelection(_);
            }
            for (var b = 0; b < t.length; b++) {
              t[b].index > d && t[b].index--;
            }
            e.splice(d, 1);

            t.splice(c, 1);

            this._removeSecondaryCursor(d - 1);

            o--;
          }
        }
      }
    };

    e.prototype.getModeConfiguration = function() {
      var e;

      var t;

      var n = {
        electricChars: {},
        autoClosingPairsOpen: {},
        autoClosingPairsClose: {},
        surroundingPairs: {}
      };
      if (this.model.getMode().electricCharacterSupport) try {
        t = this.model.getMode().electricCharacterSupport.getElectricCharacters();
      } catch (i) {
        o.onUnexpectedError(i);

        t = null;
      }
      if (t)
        for (e = 0; e < t.length; e++) {
          n.electricChars[t[e]] = !0;
        }
      var r;
      if (this.model.getMode().characterPairSupport) try {
        r = this.model.getMode().characterPairSupport.getAutoClosingPairs();
      } catch (i) {
        o.onUnexpectedError(i);

        r = null;
      }
      if (r)
        for (e = 0; e < r.length; e++) {
          n.autoClosingPairsOpen[r[e].open] = r[e].close;
          n.autoClosingPairsClose[r[e].close] = r[e].open;
        }
      var s;
      if (this.model.getMode().characterPairSupport) try {
        s = this.model.getMode().characterPairSupport.getSurroundingPairs();
      } catch (i) {
        o.onUnexpectedError(i);

        s = null;
      }
      if (s)
        for (e = 0; e < s.length; e++) {
          n.surroundingPairs[s[e].open] = s[e].close;
        }
      return n;
    };

    return e;
  }();
  t.CursorCollection = r;
});