define(["require", "exports", "vs/editor/core/controller/oneCursor", "vs/editor/core/selection", "vs/base/errors"],
  function(a, b, c, d, e) {
    var f = c,
      g = d,
      h = e,
      i = function() {
        function a(a, b, c, d) {
          this.editorId = a, this.model = b, this.configuration = c, this.viewModelHelper = d, this.modeConfiguration =
            this.getModeConfiguration(), this.primaryCursor = new f.OneCursor(this.editorId, this.model, this.configuration,
              this.modeConfiguration, this.viewModelHelper), this.secondaryCursors = [], this.lastAddedCursorIndex = 0
        }
        return a.prototype.dispose = function() {
          this.primaryCursor.dispose(), this.killSecondaryCursors()
        }, a.prototype.getAll = function() {
          var a = [];
          return a.push(this.primaryCursor), a = a.concat(this.secondaryCursors), a
        }, a.prototype.getPosition = function(a) {
          return a === 0 ? this.primaryCursor.getPosition() : this.secondaryCursors[a - 1].getPosition()
        }, a.prototype.getViewPosition = function(a) {
          return a === 0 ? this.primaryCursor.getViewPosition() : this.secondaryCursors[a - 1].getViewPosition()
        }, a.prototype.getPositions = function() {
          var a = [];
          a.push(this.primaryCursor.getPosition());
          for (var b = 0, c = this.secondaryCursors.length; b < c; b++) a.push(this.secondaryCursors[b].getPosition());
          return a
        }, a.prototype.getViewPositions = function() {
          var a = [];
          a.push(this.primaryCursor.getViewPosition());
          for (var b = 0, c = this.secondaryCursors.length; b < c; b++) a.push(this.secondaryCursors[b].getViewPosition());
          return a
        }, a.prototype.getSelection = function(a) {
          return a === 0 ? this.primaryCursor.getSelection() : this.secondaryCursors[a - 1].getSelection()
        }, a.prototype.getSelections = function() {
          var a = [];
          a.push(this.primaryCursor.getSelection());
          for (var b = 0, c = this.secondaryCursors.length; b < c; b++) a.push(this.secondaryCursors[b].getSelection());
          return a
        }, a.prototype.getViewSelections = function() {
          var a = [];
          a.push(this.primaryCursor.getViewSelection());
          for (var b = 0, c = this.secondaryCursors.length; b < c; b++) a.push(this.secondaryCursors[b].getViewSelection());
          return a
        }, a.prototype.setSelections = function(a) {
          this.primaryCursor.setSelection(a[0]), this._setSecondarySelections(a.slice(1))
        }, a.prototype.killSecondaryCursors = function() {
          return this._setSecondarySelections([]) > 0
        }, a.prototype.normalize = function() {
          this._mergeCursorsIfNecessary(), this.primaryCursor.adjustBracketDecorations();
          for (var a = 0, b = this.secondaryCursors.length; a < b; a++) this.secondaryCursors[a].adjustBracketDecorations()
        }, a.prototype.addSecondaryCursor = function(a) {
          var b = new f.OneCursor(this.editorId, this.model, this.configuration, this.modeConfiguration, this.viewModelHelper);
          a && b.setSelection(a), this.secondaryCursors.push(b), this.lastAddedCursorIndex = this.secondaryCursors.length
        }, a.prototype.getLastAddedCursor = function() {
          return this.secondaryCursors.length === 0 || this.lastAddedCursorIndex === 0 ? this.primaryCursor : this.secondaryCursors[
            this.lastAddedCursorIndex - 1]
        }, a.prototype._setSecondarySelections = function(a) {
          var b = this.secondaryCursors.length,
            c = a.length,
            d = c - b;
          if (b < c) {
            var e = c - b;
            for (var f = 0; f < e; f++) this.addSecondaryCursor(null)
          } else if (b > c) {
            var g = b - c;
            for (var f = 0; f < g; f++) this._removeSecondaryCursor(this.secondaryCursors.length - 1)
          }
          for (var f = 0; f < c; f++) a[f] && this.secondaryCursors[f].setSelection(a[f]);
          return d
        }, a.prototype._removeSecondaryCursor = function(a) {
          this.lastAddedCursorIndex >= a + 1 && this.lastAddedCursorIndex--, this.secondaryCursors[a].dispose(), this.secondaryCursors
            .splice(a, 1)
        }, a.prototype._mergeCursorsIfNecessary = function() {
          if (this.secondaryCursors.length === 0) return;
          var a = this.getAll(),
            b = [];
          for (var c = 0; c < a.length; c++) b.push({
            index: c,
            selection: a[c].getSelection()
          });
          b.sort(function(a, b) {
            return a.selection.startLineNumber === b.selection.startLineNumber ? a.selection.startColumn - b.selection
              .startColumn : a.selection.startLineNumber - b.selection.startLineNumber
          });
          for (var d = 0; d < b.length - 1; d++) {
            var e = b[d],
              f = b[d + 1],
              h = e.selection,
              i = f.selection;
            if (i.getStartPosition().isBeforeOrEqual(h.getEndPosition())) {
              var j = e.index < f.index ? d : d + 1,
                k = e.index < f.index ? d + 1 : d,
                l = b[k].index,
                m = b[j].index,
                n = b[k].selection,
                o = b[j].selection,
                p = n.plusRange(o),
                q = n.selectionStartLineNumber === n.startLineNumber && n.selectionStartColumn === n.startColumn,
                r = o.selectionStartLineNumber === o.startLineNumber && o.selectionStartColumn === o.startColumn,
                s;
              l === this.lastAddedCursorIndex ? (s = q, this.lastAddedCursorIndex = m) : s = r;
              var t;
              s ? t = new g.Selection(p.startLineNumber, p.startColumn, p.endLineNumber, p.endColumn) : t = new g.Selection(
                p.endLineNumber, p.endColumn, p.startLineNumber, p.startColumn), b[j].selection = t, a[m].setSelection(
                t);
              for (var u = 0; u < b.length; u++) b[u].index > l && b[u].index--;
              a.splice(l, 1), b.splice(k, 1), this._removeSecondaryCursor(l - 1), d--
            }
          }
        }, a.prototype.getModeConfiguration = function() {
          var a, b = {
              electricChars: {},
              autoClosingPairsOpen: {},
              autoClosingPairsClose: {},
              surroundingPairs: {}
            }, c;
          if (this.model.getMode().electricCharacterSupport) try {
            c = this.model.getMode().electricCharacterSupport.getElectricCharacters()
          } catch (d) {
            h.onUnexpectedError(d), c = null
          }
          if (c)
            for (a = 0; a < c.length; a++) b.electricChars[c[a]] = !0;
          var e;
          if (this.model.getMode().characterPairSupport) try {
            e = this.model.getMode().characterPairSupport.getAutoClosingPairs()
          } catch (d) {
            h.onUnexpectedError(d), e = null
          }
          if (e)
            for (a = 0; a < e.length; a++) b.autoClosingPairsOpen[e[a].open] = e[a].close, b.autoClosingPairsClose[e[a]
              .close] = e[a].open;
          var f;
          if (this.model.getMode().characterPairSupport) try {
            f = this.model.getMode().characterPairSupport.getSurroundingPairs()
          } catch (d) {
            h.onUnexpectedError(d), f = null
          }
          if (f)
            for (a = 0; a < f.length; a++) b.surroundingPairs[f[a].open] = f[a].close;
          return b
        }, a
      }();
    b.CursorCollection = i
  })