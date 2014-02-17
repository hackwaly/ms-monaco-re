define('vs/editor/core/model/editableTextModel', [
  'require',
  'exports',
  'vs/editor/core/model/textModelWithDecorations',
  'vs/editor/core/model/editStack',
  'vs/editor/editor',
  'vs/editor/core/model/modelLine',
  'vs/editor/core/position',
  'vs/editor/core/constants'
], function(e, t, n, i, o, r, s, a) {
  var u = function(e) {
    function t(t, n, o) {
      t.push(a.EventType.ModelContentChanged), e.call(this, t, n, o), this._commandManager = new i.EditStack(this),
        this._isUndoing = !1, this._isRedoing = !1, this._hasEditableRange = !1, this._editableRangeId = null;
    }
    return __extends(t, e), t.prototype.dispose = function() {
      this._commandManager = null, e.prototype.dispose.call(this);
    }, t.prototype._reset = function(t, n) {
      return this._commandManager = new i.EditStack(this), this._hasEditableRange = !1, this._editableRangeId = null,
        e.prototype._reset.call(this, t, n);
    }, t.prototype.change = function(e) {
      var t = this;
      return this._withDeferredEvents(function(n) {
        var i = {
          insertText: function(e, i, o) {
            return 'undefined' == typeof o && (o = !1), t._insertText(n.changedMarkers, e, i, o);
          },
          deleteText: function(e) {
            return t._deleteText(n.changedMarkers, e);
          }
        }, o = e(i);
        return i.insertText = null, i.deleteText = null, o;
      });
    }, t.prototype.pushStackElement = function() {
      this._commandManager.pushStackElement();
    }, t.prototype.pushEditOperations = function(e, t, n) {
      return this._commandManager.pushEditOperation(e, t, n);
    }, t.prototype.undo = function() {
      this._isUndoing = !0;
      var e = this._commandManager.undo();
      return this._isUndoing = !1, e;
    }, t.prototype.redo = function() {
      this._isRedoing = !0;
      var e = this._commandManager.redo();
      return this._isRedoing = !1, e;
    }, t.prototype.setEditableRange = function(e) {
      this._commandManager.clear(), this._hasEditableRange && (this.removeTrackedRange(this._editableRangeId), this._editableRangeId =
        null, this._hasEditableRange = !1), e && (this._hasEditableRange = !0, this._editableRangeId = this.addTrackedRange(
        e, 0));
    }, t.prototype.hasEditableRange = function() {
      return this._hasEditableRange;
    }, t.prototype.getEditableRange = function() {
      return this._hasEditableRange ? this.getTrackedRange(this._editableRangeId) : this.getFullModelRange();
    }, t.prototype.callInsertTextOnLine = function(e, t, n, i, o, r) {
      this._lines[t].insertText(e, n, i, o), r && (this._invalidateLine(t), this._increaseVersionId(), this.emitModelContentChangedLineChangedEvent(
        t + 1));
    }, t.prototype.callDeleteTextOnLine = function(e, t, n, i, o, r, s) {
      var a = this._lines[t].removeText(e, n, i, o, r);
      return s && (this._invalidateLine(t), this._increaseVersionId(), this.emitModelContentChangedLineChangedEvent(t +
        1)), a;
    }, t.prototype._updateLineNumbers = function(e, t) {
      var n, i, o, r, s, a, u, l = this._lines;
      for (i = t - 1, o = l.length; o > i; i++) {
        for (n = l[i], a = n.markers, r = 0, s = a.length; s > r; r++)
          u = a[r], e[u.id] = !0, u.oldLineNumber = u.oldLineNumber || n.lineNumber;
        n.lineNumber = i + 1;
      }
    }, t.prototype._insertText = function(e, t, n, i) {
      var o = this.validatePosition(t);
      if (0 === n.length)
        return o;
      for (var r = n.split('\n'), s = 0, a = r.length; a > s; s++)
        '\r' === r[s].charAt(r[s].length - 1) && (r[s] = r[s].substring(0, r[s].length - 1));
      return 1 === r.length ? this._insertTextOneLine(e, o, r[0], i) : this._insertTextMultiline(e, o, r, i);
    }, t.prototype._insertTextOneLine = function(e, t, n, i) {
      return this.callInsertTextOnLine(e, t.lineNumber - 1, t.column, {
        text: n,
        markers: null
      }, i, !0), new s.Position(t.lineNumber, t.column + n.length);
    }, t.prototype._insertTextMultiline = function(e, t, n, i) {
      var o, a, u = this.callDeleteTextOnLine(e, t.lineNumber - 1, t.column, Number.MAX_VALUE, !0, i, !1);
      this.callInsertTextOnLine(e, t.lineNumber - 1, t.column, {
        text: n[0],
        markers: null
      }, i, !0);
      var l = '';
      for (o = 1, a = n.length - 1; a > o; o++)
        l += n[o] + '\n', this._lines.splice(t.lineNumber + o - 1, 0, new r.ModelLine(t.lineNumber + o, n[o]));
      var c = t.lineNumber - 1 + n.length - 1;
      return this._lines.splice(c, 0, new r.ModelLine(c + 1, n[n.length - 1])), this.callInsertTextOnLine(e, c,
        Number.MAX_VALUE, u, i, !1), this._updateLineNumbers(e, c + 2), this._increaseVersionId(), this.emitModelContentChangedLinesInsertedEvent(
        t.lineNumber - 1 + 2, c + 1, l + this._lines[c].text), new s.Position(c + 1, 1 + n[n.length - 1].length);
    }, t.prototype._deleteText = function(e, t) {
      var n = this.validateRange(t);
      return n.isEmpty() ? {
        position: new s.Position(n.startLineNumber, n.startColumn),
        deletedText: ''
      } : n.startLineNumber === n.endLineNumber ? this._deleteTextOneLine(e, n) : this._deleteTextMultiline(e, n);
    }, t.prototype._deleteTextOneLine = function(e, t) {
      var n = this.callDeleteTextOnLine(e, t.startLineNumber - 1, t.startColumn, t.endColumn, !1, !1, !0);
      return {
        position: new s.Position(t.startLineNumber, t.startColumn),
        deletedText: n.text
      };
    }, t.prototype._deleteWholeLines = function(e, t, n, i) {
      var o, r, s, a, u, l = [],
        c = [];
      for (o = n; i >= o; o++) {
        for (l.push(this._lines[o].text), a = this._lines[o].markers, r = 0, s = a.length; s > r; r++)
          u = a[r], e[u.id] = !0, u.oldColumn = u.oldColumn || u.column, u.oldLineNumber = u.oldLineNumber || o + 1,
            u.column = t;
        c = c.concat(a);
      }
      return this._lines.splice(n, i - n + 1), {
        deletedText: l.join('\n'),
        deletedMarkers: c
      };
    }, t.prototype._deleteTextMultiline = function(e, t) {
      if (1 === t.startColumn) {
        var n = this._lines[t.startLineNumber - 1].state,
          i = this._deleteWholeLines(e, t.startColumn, t.startLineNumber - 1, t.endLineNumber - 2);
        this._increaseVersionId(), this.emitModelContentChangedLinesDeletedEvent(t.startLineNumber, t.endLineNumber -
          1);
        var o = this.callDeleteTextOnLine(e, t.startLineNumber - 1, 1, t.endColumn, !1, !1, !0).text;
        this._lines[t.startLineNumber - 1].addMarkers(i.deletedMarkers), this._lines[t.startLineNumber - 1].state = n,
          this._updateLineNumbers(e, t.startLineNumber);
        var r = i.deletedText + '\n' + o;
      } else {
        var a = this.callDeleteTextOnLine(e, t.startLineNumber - 1, t.startColumn, Number.MAX_VALUE, !1, !1, !1).text,
          u = this.callDeleteTextOnLine(e, t.endLineNumber - 1, t.endColumn, Number.MAX_VALUE, !0, !1, !1),
          i = this._deleteWholeLines(e, t.startColumn, t.startLineNumber, t.endLineNumber - 1);
        this._lines[t.startLineNumber - 1].addMarkers(i.deletedMarkers), this.callInsertTextOnLine(e, t.startLineNumber -
          1, Number.MAX_VALUE, u, !1, !0), this._updateLineNumbers(e, t.startLineNumber + 1), this._increaseVersionId(),
          this.emitModelContentChangedLinesDeletedEvent(t.startLineNumber + 1, t.endLineNumber);
        var r = a + '\n' + i.deletedText;
      }
      return {
        position: new s.Position(t.startLineNumber, t.startColumn),
        deletedText: r
      };
    }, t.prototype.emitModelContentChangedLineChangedEvent = function(e) {
      var t = {
        changeType: a.EventType.ModelContentChangedLineChanged,
        lineNumber: e,
        detail: this._lines[e - 1].text,
        versionId: this.getVersionId(),
        isUndoing: this._isUndoing,
        isRedoing: this._isRedoing
      };
      this.emit(a.EventType.ModelContentChanged, t);
    }, t.prototype.emitModelContentChangedLinesDeletedEvent = function(e, t) {
      var n = {
        changeType: a.EventType.ModelContentChangedLinesDeleted,
        fromLineNumber: e,
        toLineNumber: t,
        versionId: this.getVersionId(),
        isUndoing: this._isUndoing,
        isRedoing: this._isRedoing
      };
      this.emit(a.EventType.ModelContentChanged, n);
    }, t.prototype.emitModelContentChangedLinesInsertedEvent = function(e, t, n) {
      var i = {
        changeType: a.EventType.ModelContentChangedLinesInserted,
        fromLineNumber: e,
        toLineNumber: t,
        detail: n,
        versionId: this.getVersionId(),
        isUndoing: this._isUndoing,
        isRedoing: this._isRedoing
      };
      this.emit(a.EventType.ModelContentChanged, i);
    }, t;
  }(n.TextModelWithDecorations);
  t.EditableTextModel = u;
})