define("vs/editor/core/controller/oneCursor", ["require", "exports", "vs/editor/editor", "vs/base/strings",
  "vs/editor/modes/modes", "vs/editor/core/position", "vs/editor/core/range", "vs/editor/core/command/shiftCommand",
  "vs/editor/core/command/replaceCommand", "vs/editor/core/command/surroundSelectionCommand",
  "vs/editor/core/selection", "vs/base/errors", "vs/editor/core/controller/cursorMoveHelper"
], function(e, t, n, i, o, r, s, a, u, l, c, d, h) {
  var p = function() {
    function e(e, t, n, i, o) {
      this.editorId = e;

      this.model = t;

      this.configuration = n;

      this.modeConfiguration = i;

      this.viewModelHelper = o;

      this.helper = new f(this.model, this.configuration);

      this.position = new r.Position(1, 1);

      this.viewPosition = new r.Position(1, 1);

      this.positionMarkerId = null;

      this.inSelectionMode = !1;

      this.selectionStart = null;

      this.viewSelectionStart = null;

      this.selStartMarkerId = null;

      this.selEndMarkerId = null;

      this.leftoverVisibleColumns = 0;

      this.selectionStartLeftoverVisibleColumns = 0;

      this.bracketDecorations = [];

      this._cachedSelection = null;

      this._cachedViewSelection = null;

      this._stopSelectionMode();

      this._setPosition(1, 1, 1, 1, 0);
    }
    e.prototype.duplicate = function() {
      var t = new e(this.editorId, this.model, this.configuration, this.modeConfiguration, this.viewModelHelper);
      t.setSelection(this.getSelection());

      t.leftoverVisibleColumns = this.leftoverVisibleColumns;

      t.selectionStartLeftoverVisibleColumns = this.selectionStartLeftoverVisibleColumns;

      return t;
    };

    e.prototype.dispose = function() {
      if (this.positionMarkerId) {
        this.model._removeMarker(this.positionMarkerId);
        this.positionMarkerId = null;
      }

      if (this.selStartMarkerId) {
        this.model._removeMarker(this.selStartMarkerId);
        this.selStartMarkerId = null;
      }

      if (this.selEndMarkerId) {
        this.model._removeMarker(this.selEndMarkerId);
        this.selEndMarkerId = null;
      }

      this.bracketDecorations = this.model.deltaDecorations(this.bracketDecorations, [], this.editorId);
    };

    e.prototype.adjustBracketDecorations = function() {
      var e = null;

      var t = this.getSelection();
      if (t.isEmpty() && !this.configuration.editor.readOnly) {
        e = this.model.matchBracket(this.position, !0);
      }
      var n = [];
      if (e && e.brackets) {
        var i = {
          stickiness: 1,
          isOverlay: !1,
          className: "bracket-match"
        };
        n.push({
          range: e.brackets[0],
          options: i
        });

        n.push({
          range: e.brackets[1],
          options: i
        });
      }
      this.bracketDecorations = this.model.deltaDecorations(this.bracketDecorations, n, this.editorId);
    };

    e.computeSelection = function(e, t, n) {
      var i;

      var o;

      var r;

      var s;
      e ? t.isEmpty() ? (i = t.startLineNumber, o = t.startColumn, r = n.lineNumber, s = n.column) : n.isBeforeOrEqual(
        t.getStartPosition()) ? (i = t.endLineNumber, o = t.endColumn, r = n.lineNumber, s = n.column) : (i = t.startLineNumber,
        o = t.startColumn, r = n.lineNumber, s = n.column) : (i = n.lineNumber, o = n.column, r = n.lineNumber, s = n
        .column);

      return new c.Selection(i, o, r, s);
    };

    e.prototype.getSelection = function() {
      this._cachedSelection || (this._cachedSelection = e.computeSelection(this.inSelectionMode, this.selectionStart,
        this.position));

      return this._cachedSelection;
    };

    e.prototype.getViewSelection = function() {
      this._cachedViewSelection || (this._cachedViewSelection = e.computeSelection(this.inSelectionMode, this.viewSelectionStart,
        this.viewPosition));

      return this._cachedViewSelection;
    };

    e.prototype.setSelection = function(e) {
      var t = this.model.validatePosition({
        lineNumber: e.selectionStartLineNumber,
        column: e.selectionStartColumn
      });

      var n = this.model.validatePosition({
        lineNumber: e.positionLineNumber,
        column: e.positionColumn
      });
      t.equals(n) ? this._stopSelectionMode() : this._startSelectionModeFromPosition(t, this.viewModelHelper.convertModelPositionToViewPosition(
        t.lineNumber, t.column));
      var i = this.viewModelHelper.convertModelPositionToViewPosition(n.lineNumber, n.column);
      this._setPosition(n.lineNumber, n.column, i.lineNumber, i.column);
    };

    e.prototype.getPosition = function() {
      return this.position;
    };

    e.prototype.getViewPosition = function() {
      return this.viewPosition;
    };

    e.prototype._getValidViewPosition = function() {
      return this.viewModelHelper.validateViewPosition(this.viewPosition.lineNumber, this.viewPosition.column, this.position);
    };

    e.prototype._setPosition = function(e, t, n, i, o) {
      if ("undefined" == typeof o) {
        o = 0;
      }

      if (this.inSelectionMode && this.viewSelectionStart.isEmpty() && this.viewSelectionStart.startLineNumber === n &&
        this.viewSelectionStart.startColumn === i) {
        this._stopSelectionMode();
      }

      this.position = new r.Position(e, t);

      this.viewPosition = new r.Position(n, i);

      this.leftoverVisibleColumns = o;

      this.selectionStartLeftoverVisibleColumns = 0;

      this._cachedSelection = null;

      this._cachedViewSelection = null;

      this.positionMarkerId ? this.model._changeMarker(this.positionMarkerId, this.position.lineNumber, this.position
        .column) : this.positionMarkerId = this.model._addMarker(this.position.lineNumber, this.position.column, !0);
    };

    e.prototype._startSelectionModeFromPosition = function(e, t) {
      this.inSelectionMode = !0;

      this.selectionStart = new s.Range(e.lineNumber, e.column, e.lineNumber, e.column);

      this.viewSelectionStart = new s.Range(t.lineNumber, t.column, t.lineNumber, t.column);

      this._cachedSelection = null;

      this._cachedViewSelection = null;

      this._ensureSelectionMarkers();
    };

    e.prototype._startSelectionModeFromRange = function(e, t) {
      this.inSelectionMode = !0;

      this.selectionStart = e;

      this.viewSelectionStart = t;

      this._cachedSelection = null;

      this._cachedViewSelection = null;

      this._ensureSelectionMarkers();
    };

    e.prototype._stopSelectionMode = function() {
      this.inSelectionMode = !1;

      this.selectionStart = null;

      this.viewSelectionStart = null;

      this._cachedSelection = null;

      this._cachedViewSelection = null;

      this._ensureSelectionMarkers();
    };

    e.prototype._ensureSelectionMarkers = function() {
      this.inSelectionMode ? (this.selStartMarkerId ? this.model._changeMarker(this.selStartMarkerId, this.selectionStart
          .startLineNumber, this.selectionStart.startColumn) : this.selStartMarkerId = this.model._addMarker(this.selectionStart
          .startLineNumber, this.selectionStart.startColumn, !0), this.selEndMarkerId ? this.model._changeMarker(this
          .selEndMarkerId, this.selectionStart.endLineNumber, this.selectionStart.endColumn) : this.selEndMarkerId =
        this.model._addMarker(this.selectionStart.endLineNumber, this.selectionStart.endColumn, !0)) : (this.selStartMarkerId &&
        (this.model._removeMarker(this.selStartMarkerId), this.selStartMarkerId = null), this.selEndMarkerId && (this
          .model._removeMarker(this.selEndMarkerId), this.selEndMarkerId = null));
    };

    e.prototype._moveModelPosition = function(e, t, n, i, o, r, s) {
      var a = this.viewModelHelper.convertModelPositionToViewPosition(i, o);
      this._actualMove(e, t, n, i, o, a.lineNumber, a.column, r, s);
    };

    e.prototype._moveViewPosition = function(e, t, n, i, o, r, s) {
      var a = this.viewModelHelper.convertViewToModelPosition(i, o);
      this._actualMove(e, t, n, a.lineNumber, a.column, i, o, r, s);
    };

    e.prototype._actualMove = function(e, t, n, i, o, r, s, a, u) {
      if (t && (e.cursorPositionChangeReason = t), n && !this.inSelectionMode ? this._startSelectionModeFromPosition(
        this.position, this.viewPosition) : !n && this.inSelectionMode && this._stopSelectionMode(), u) {
        var l = this.model.getEditableRange();
        i < l.startLineNumber || i === l.startLineNumber && o < l.startColumn ? (i = l.startLineNumber, o = l.startColumn) :
          (i > l.endLineNumber || i === l.endLineNumber && o > l.endColumn) && (i = l.endLineNumber, o = l.endColumn);
      }
      this._setPosition(i, o, r, s, a);
    };

    e.prototype.recoverSelectionFromMarkers = function(e) {
      e.cursorPositionChangeReason = "recoverFromMarkers";

      e.shouldPushStackElementBefore = !0;

      e.shouldPushStackElementAfter = !0;

      e.shouldReveal = !1;

      e.shouldRevealHorizontal = !1;
      var t = this.model._getMarker(this.positionMarkerId);

      var n = new r.Position(t.lineNumber, t.column);

      var i = null;

      var o = null;

      var a = null;

      var u = null;
      if (this.selStartMarkerId && this.selEndMarkerId) {
        var l = this.model._getMarker(this.selStartMarkerId);

        var c = this.model._getMarker(this.selEndMarkerId);
        if (i = new s.Range(l.lineNumber, l.column, c.lineNumber, c.column), i.isEmpty()) {
          a = new r.Position(i.startLineNumber, i.startColumn);
          i = null;
          a.equals(n) ? a = null : u = this.viewModelHelper.convertModelPositionToViewPosition(a.lineNumber, a.column);
        } else {
          var d = this.viewModelHelper.convertModelPositionToViewPosition(i.startLineNumber, i.startColumn);

          var h = this.viewModelHelper.convertModelPositionToViewPosition(i.endLineNumber, i.endColumn);
          o = new s.Range(d.lineNumber, d.column, h.lineNumber, h.column);
        }
      }
      i ? this._startSelectionModeFromRange(i, o) : a ? this._startSelectionModeFromPosition(a, u) : this._stopSelectionMode();
      var p = this.viewModelHelper.convertModelPositionToViewPosition(n.lineNumber, n.column);
      this._setPosition(n.lineNumber, n.column, p.lineNumber, p.column);

      return !0;
    };

    e.prototype.jumpToBracket = function(e) {
      var t = this.bracketDecorations.length;
      if (2 !== t) {
        return !1;
      }
      for (var n = 0; 2 > n; n++) {
        var i = this.model.getDecorationRange(this.bracketDecorations[n]);

        var o = this.model.getDecorationRange(this.bracketDecorations[1 - n]);
        if (g.isPositionAtRangeEdges(this.position, i) || g.isPositionInsideRange(this.position, i)) {
          this._moveModelPosition(e, null, !1, o.startLineNumber, o.startColumn, 0, !1);
          return !0;
        }
      }
      return !1;
    };

    e.prototype.moveTo = function(e, t, n, i, o) {
      var r;

      var s = this.model.validatePosition(t);
      r = n ? this.viewModelHelper.validateViewPosition(n.lineNumber, n.column, s) : this.viewModelHelper.convertModelPositionToViewPosition(
        s.lineNumber, s.column);
      var a = "mouse" === i ? "explicit" : null;
      "api" === i && (o.shouldRevealVerticalInCenter = !0);

      this._moveViewPosition(o, a, e, r.lineNumber, r.column, 0, !1);

      return !0;
    };

    e.prototype.moveLeft = function(e, t) {
      var n;

      var i;
      if (this.inSelectionMode && !e) {
        var o = this.getViewSelection();

        var r = this.viewModelHelper.validateViewPosition(o.startLineNumber, o.startColumn, this.getSelection().getStartPosition());
        n = r.lineNumber;

        i = r.column;
      } else {
        var s = this._getValidViewPosition();

        var a = this.helper.getLeftOfPosition(this.viewModelHelper.viewModel, s.lineNumber, s.column);
        n = a.lineNumber;

        i = a.column;
      }
      this._moveViewPosition(t, "explicit", e, n, i, 0, !0);

      return !0;
    };

    e.prototype.moveWordLeft = function(e, t) {
      var n = this.position.lineNumber;

      var i = this.position.column;

      var o = !1;
      if (1 === i && n > 1) {
        o = !0;
        n -= 1;
        i = this.model.getLineMaxColumn(n);
      }
      var s = this.helper.findWord(new r.Position(n, i), "left", !0);
      i = s ? o || i > s.end + 1 ? s.end + 1 : s.start + 1 : 1;

      this._moveModelPosition(t, "explicit", e, n, i, 0, !0);

      return !0;
    };

    e.prototype.moveRight = function(e, t) {
      var n;

      var i;
      if (this.inSelectionMode && !e) {
        var o = this.getViewSelection();

        var r = this.viewModelHelper.validateViewPosition(o.endLineNumber, o.endColumn, this.getSelection().getEndPosition());
        n = r.lineNumber;

        i = r.column;
      } else {
        var s = this._getValidViewPosition();

        var a = this.helper.getRightOfPosition(this.viewModelHelper.viewModel, s.lineNumber, s.column);
        n = a.lineNumber;

        i = a.column;
      }
      this._moveViewPosition(t, "explicit", e, n, i, 0, !0);

      return !0;
    };

    e.prototype.moveWordRight = function(e, t) {
      var n = this.position.lineNumber;

      var i = this.position.column;

      var o = !1;
      if (i === this.model.getLineMaxColumn(n) && n < this.model.getLineCount()) {
        o = !0;
        n += 1;
        i = 1;
      }
      var s = this.helper.findWord(new r.Position(n, i), "right", !0);
      i = s ? o || i < s.start + 1 ? s.start + 1 : s.end + 1 : this.model.getLineMaxColumn(n);

      this._moveModelPosition(t, "explicit", e, n, i, 0, !0);

      return !0;
    };

    e.prototype.moveDown = function(e, t, n) {
      var i;

      var o;

      var r = t ? this.configuration.editor.pageSize : 1;
      if (this.inSelectionMode && !e) {
        var s = this.getViewSelection();

        var a = this.viewModelHelper.validateViewPosition(s.endLineNumber, s.endColumn, this.getSelection().getEndPosition());
        i = a.lineNumber;

        o = a.column;
      } else {
        var u = this._getValidViewPosition();
        i = u.lineNumber;

        o = u.column;
      }
      var l = this.helper.getPositionDown(this.viewModelHelper.viewModel, i, o, this.leftoverVisibleColumns, r);
      this._moveViewPosition(n, "explicit", e, l.lineNumber, l.column, l.leftoverVisibleColumns, !0);

      return !0;
    };

    e.prototype.translateDown = function(e) {
      var t = this.getViewSelection();

      var n = this.helper.getPositionDown(this.viewModelHelper.viewModel, t.selectionStartLineNumber, t.selectionStartColumn,
        this.selectionStartLeftoverVisibleColumns, 1);
      this._moveViewPosition(e, "explicit", !1, n.lineNumber, n.column, this.leftoverVisibleColumns, !0);
      var i = this.helper.getPositionDown(this.viewModelHelper.viewModel, t.positionLineNumber, t.positionColumn,
        this.leftoverVisibleColumns, 1);
      this._moveViewPosition(e, "explicit", !0, i.lineNumber, i.column, i.leftoverVisibleColumns, !0);

      this.selectionStartLeftoverVisibleColumns = n.leftoverVisibleColumns;

      return !0;
    };

    e.prototype.moveUp = function(e, t, n) {
      var i;

      var o;

      var r = t ? this.configuration.editor.pageSize : 1;
      if (this.inSelectionMode && !e) {
        var s = this.getViewSelection();

        var a = this.viewModelHelper.validateViewPosition(s.startLineNumber, s.startColumn, this.getSelection().getStartPosition());
        i = a.lineNumber;

        o = a.column;
      } else {
        var u = this._getValidViewPosition();
        i = u.lineNumber;

        o = u.column;
      }
      var l = this.helper.getPositionUp(this.viewModelHelper.viewModel, i, o, this.leftoverVisibleColumns, r);
      this._moveViewPosition(n, "explicit", e, l.lineNumber, l.column, l.leftoverVisibleColumns, !0);

      return !0;
    };

    e.prototype.translateUp = function(e) {
      var t = this.getViewSelection();

      var n = this.helper.getPositionUp(this.viewModelHelper.viewModel, t.selectionStartLineNumber, t.selectionStartColumn,
        this.selectionStartLeftoverVisibleColumns, 1);
      this._moveViewPosition(e, "explicit", !1, n.lineNumber, n.column, this.leftoverVisibleColumns, !0);
      var i = this.helper.getPositionUp(this.viewModelHelper.viewModel, t.positionLineNumber, t.positionColumn, this.leftoverVisibleColumns,
        1);
      this._moveViewPosition(e, "explicit", !0, i.lineNumber, i.column, i.leftoverVisibleColumns, !0);

      this.selectionStartLeftoverVisibleColumns = n.leftoverVisibleColumns;

      return !0;
    };

    e.prototype.moveToBeginningOfLine = function(e, t) {
      var n = this._getValidViewPosition();

      var i = n.lineNumber;

      var o = n.column;
      o = this.helper.getColumnAtBeginningOfLine(this.viewModelHelper.viewModel, i, o);

      this._moveViewPosition(t, "explicit", e, i, o, 0, !0);

      return !0;
    };

    e.prototype.moveToEndOfLine = function(e, t) {
      var n = this._getValidViewPosition();

      var i = n.lineNumber;

      var o = n.column;
      o = this.helper.getColumnAtEndOfLine(this.viewModelHelper.viewModel, i, o);

      this._moveViewPosition(t, "explicit", e, i, o, 0, !0);

      return !0;
    };

    e.prototype.moveToBeginningOfBuffer = function(e, t) {
      this._moveModelPosition(t, "explicit", e, 1, 1, 0, !0);

      return !0;
    };

    e.prototype.moveToEndOfBuffer = function(e, t) {
      var n = this.model.getLineCount();

      var i = this.model.getLineMaxColumn(n);
      this._moveModelPosition(t, "explicit", e, n, i, 0, !0);

      return !0;
    };

    e.prototype.selectAll = function(e) {
      var t;

      var n;

      var i;

      var o;

      var r = !0;
      if (this.model.hasEditableRange()) {
        var s = this.model.getEditableRange();

        var a = this.getSelection();
        if (!a.equalsRange(s)) {
          r = !1;
          t = s.startLineNumber;
          n = s.startColumn;
          i = s.endLineNumber;
          o = s.endColumn;
        }
      }
      r && (t = 1, n = 1, i = this.model.getLineCount(), o = this.model.getLineMaxColumn(i));

      this._moveModelPosition(e, null, !1, t, n, 0, !1);

      this._moveModelPosition(e, null, !0, i, o, 0, !1);

      e.shouldReveal = !1;

      e.shouldRevealHorizontal = !1;

      return !0;
    };

    e.prototype.line = function(e, t, n, i) {
      var o;

      var r = this.model.validatePosition(t);
      o = n ? this.viewModelHelper.validateViewPosition(n.lineNumber, n.column, r) : this.viewModelHelper.convertModelPositionToViewPosition(
        r.lineNumber, r.column);
      var a;

      var u;
      if (e && this.inSelectionMode) {
        a = o.lineNumber;
        u = r.isBeforeOrEqual(this.selectionStart.getStartPosition()) ? 1 : this.viewModelHelper.viewModel.getLineMaxColumn(
          a);
      } else {
        var l = new s.Range(o.lineNumber, 1, o.lineNumber, this.viewModelHelper.viewModel.getLineMaxColumn(o.lineNumber));

        var c = this.viewModelHelper.convertViewToModelPosition(l.startLineNumber, l.startColumn);

        var d = this.viewModelHelper.convertViewToModelPosition(l.endLineNumber, l.endColumn);
        this._startSelectionModeFromRange(new s.Range(c.lineNumber, c.column, d.lineNumber, d.column), l);

        a = l.endLineNumber;

        u = l.endColumn;
      }
      i.cursorPositionChangeReason = "explicit";

      i.shouldRevealHorizontal = !1;
      var h = this.viewModelHelper.convertViewToModelPosition(a, u);
      this._setPosition(h.lineNumber, h.column, a, u, 0);

      return !0;
    };

    e.prototype.word = function(e, t, n, i) {
      var o;

      var r;

      var a;

      var u;

      var l = this.model.validatePosition(t);

      var c = this.helper.findWord(l, n);
      if (e && this.inSelectionMode) {
        o = c ? c.start + 1 : l.column;
        r = c ? c.end + 1 : l.column;
        a = l.lineNumber;
        u = l.isBeforeOrEqual(this.selectionStart.getStartPosition()) ? o : r;
      } else {
        if (c) {
          o = c.start + 1;
          r = c.end + 1;
        } else {
          var d = this.model.getLineMaxColumn(l.lineNumber);
          l.column === d || "left" === n ? (o = l.column - 1, r = l.column) : (o = l.column, r = l.column + 1);

          if (1 >= o) {
            o = 1;
          }

          if (r >= d) {
            r = d;
          }
        }
        var h = new s.Range(l.lineNumber, o, l.lineNumber, r);

        var p = this.viewModelHelper.convertModelPositionToViewPosition(l.lineNumber, o);

        var f = this.viewModelHelper.convertModelPositionToViewPosition(l.lineNumber, r);
        this._startSelectionModeFromRange(h, new s.Range(p.lineNumber, p.column, f.lineNumber, f.column));

        a = h.endLineNumber;

        u = h.endColumn;
      }
      i.cursorPositionChangeReason = "explicit";
      var g = this.viewModelHelper.convertModelPositionToViewPosition(a, u);
      this._setPosition(a, u, g.lineNumber, g.column, 0);

      return !0;
    };

    e.prototype.cancelSelection = function() {
      return this.inSelectionMode ? (this._stopSelectionMode(), !0) : !1;
    };

    e.prototype._typeInterceptorEnter = function(e, t) {
      return "\n" !== e ? !1 : this._enter(!1, t);
    };

    e.prototype.lineInsertBefore = function(e) {
      var t = this.position.lineNumber;

      var n = 0;
      t > 1 && (t--, n = this.model.getLineMaxColumn(t));

      return this._enter(!1, e, new r.Position(t, n), new s.Range(t, n, t, n));
    };

    e.prototype.lineInsertAfter = function(e) {
      var t = this.model.getLineMaxColumn(this.position.lineNumber);
      return this._enter(!1, e, new r.Position(this.position.lineNumber, t), new s.Range(this.position.lineNumber, t,
        this.position.lineNumber, t));
    };

    e.prototype.lineBreakInsert = function(e) {
      return this._enter(!0, e);
    };

    e.prototype._enter = function(e, t, n, o) {
      if ("undefined" == typeof n) {
        n = this.position;
      }

      if ("undefined" == typeof o) {
        o = this.getSelection();
      }

      t.shouldPushStackElementBefore = !0;
      var r;

      var s = this.model.getLineContent(n.lineNumber);

      var a = this.model.getRawLineTokens(n.lineNumber);
      if (this.model.getMode().electricCharacterSupport) try {
        r = this.model.getMode().electricCharacterSupport.onEnter(s, a, n.column - 1);
      } catch (l) {
        d.onUnexpectedError(l);
      }
      var c = i.getLeadingWhitespace(s);
      if (c.length > n.column - 1 && (c = c.substring(0, n.column - 1)), r ? (r.appendText ? -1 === i.firstNonWhitespaceIndex(
          r.appendText) && (r.appendText = r.appendText) : r.appendText = 0 === r.indentAction ? "" : "	", r.indentOutdentAppendText ||
        (r.indentOutdentAppendText = "")) : r = {
        indentAction: 0,
        appendText: "",
        indentOutdentAppendText: ""
      }, 0 === r.indentAction) {
        this.actualType("\n" + this.helper.normalizeIndentation(c + r.appendText), e, t, o);
      } else if (1 === r.indentAction) {
        this.actualType("\n" + this.helper.normalizeIndentation(c + r.appendText), e, t, o);
      } else if (2 === r.indentAction) {
        var h = this.helper.normalizeIndentation(c);

        var p = this.helper.normalizeIndentation(c + r.appendText);

        var f = "\n" + p + "\n" + h + r.indentOutdentAppendText;
        t.executeCommand = e ? new u.ReplaceCommandWithoutChangingPosition(o, f) : new u.ReplaceCommandWithOffsetCursorState(
          o, f, -1, p.length - h.length);
      }
      return !0;
    };

    e.prototype._typeInterceptorAutoClosingCloseChar = function(e, t) {
      if (!this.configuration.editor.autoClosingBrackets) {
        return !1;
      }
      var n = this.getSelection();
      if (!n.isEmpty() || !this.modeConfiguration.autoClosingPairsClose.hasOwnProperty(e)) {
        return !1;
      }
      var i = this.model.getLineContent(this.position.lineNumber);

      var o = i[this.position.column - 1];
      if (o !== e) {
        return !1;
      }
      var r = new s.Range(this.position.lineNumber, this.position.column, this.position.lineNumber, this.position.column +
        1);
      t.executeCommand = new u.ReplaceCommand(r, e);

      return !0;
    };

    e.prototype._typeInterceptorAutoClosingOpenChar = function(e, t) {
      if (!this.configuration.editor.autoClosingBrackets) {
        return !1;
      }
      var n = this.getSelection();
      if (!n.isEmpty() || !this.modeConfiguration.autoClosingPairsOpen.hasOwnProperty(e)) {
        return !1;
      }
      if (!this.model.getMode().characterPairSupport) {
        return !1;
      }
      var i = this.model.getLineContent(this.position.lineNumber);

      var o = i[this.position.column - 1];

      var r = this.modeConfiguration.autoClosingPairsOpen[e];
      if (o && o !== r && !/\s/.test(o)) {
        return !1;
      }
      var s = this.model.getRawLineTokens(this.position.lineNumber);

      var a = !1;
      try {
        a = this.model.getMode().characterPairSupport.shouldAutoClosePair(e, i, s, this.position.column - 1);
      } catch (l) {
        d.onUnexpectedError(l);
      }
      return a ? (t.shouldPushStackElementBefore = !0, t.executeCommand = new u.ReplaceCommandWithOffsetCursorState(n,
        e + r, 0, -r.length), !0) : !1;
    };

    e.prototype._typeInterceptorSurroundSelection = function(e, t) {
      if (!this.configuration.editor.autoClosingBrackets) {
        return !1;
      }
      var n = this.getSelection();
      if (n.isEmpty() || !this.modeConfiguration.surroundingPairs.hasOwnProperty(e)) {
        return !1;
      }
      var i;

      var o;

      var r;

      var s;

      var a;

      var u;

      var c = !0;

      var d = "	".charCodeAt(0);

      var h = " ".charCodeAt(0);
      for (i = n.startLineNumber; i <= n.endLineNumber; i++)
        for (u = this.model.getLineContent(i), o = i === n.startLineNumber ? n.startColumn - 1 : 0, r = i === n.endLineNumber ?
          n.endColumn - 1 : u.length, s = o; r > s; s++) {
          a = u.charCodeAt(s);
          if (a !== d && a !== h) {
            c = !1;
            i = n.endLineNumber + 1;
            s = r;
          }
        }
      if (c) {
        return !1;
      }
      var p = this.modeConfiguration.surroundingPairs[e];
      t.shouldPushStackElementBefore = !0;

      t.shouldPushStackElementAfter = !0;

      t.executeCommand = new l.SurroundSelectionCommand(n, e, p);

      return !0;
    };

    e.prototype._typeInterceptorElectricChar = function(e, t) {
      var n = this;
      return this.modeConfiguration.electricChars.hasOwnProperty(e) ? (t.postOperationRunnable = function(e) {
        return n._typeInterceptorElectricCharRunnable(e);
      }, this.actualType(e, !1, t)) : !1;
    };

    e.prototype._typeInterceptorElectricCharRunnable = function(e) {
      var t;

      var n = this.model.getLineContent(this.position.lineNumber);

      var o = this.model.getRawLineTokens(this.position.lineNumber);
      if (this.model.getMode().electricCharacterSupport) try {
        t = this.model.getMode().electricCharacterSupport.onElectricCharacter(n, o, this.position.column - 2);
      } catch (r) {
        d.onUnexpectedError(r);
      }
      if (t) {
        var a = t.matchBracketType;

        var l = t.appendText;
        if (a) {
          var c = null;
          if (a && (c = this.model.findMatchingBracketUp(a, this.position)), c) {
            var h = c.startLineNumber;

            var p = this.model.getLineContent(h);

            var f = i.getLeadingWhitespace(p);

            var g = this.helper.normalizeIndentation(f);

            var m = this.model.getLineFirstNonWhitespaceColumn(this.position.lineNumber) || this.position.column;

            var v = n.substring(0, m - 1);
            if (v !== g) {
              var y = n.substring(m - 1, this.position.column - 1);

              var _ = g + y;

              var b = new s.Range(this.position.lineNumber, 1, this.position.lineNumber, this.position.column);
              e.shouldPushStackElementAfter = !0;

              e.executeCommand = new u.ReplaceCommand(b, _);
            }
          }
        } else if (l) {
          var C = -l.length;
          if (t.advanceCount) {
            C += t.advanceCount;
          }

          e.shouldPushStackElementAfter = !0;

          e.executeCommand = new u.ReplaceCommandWithOffsetCursorState(this.getSelection(), l, 0, C);
        }
      }
    };

    e.prototype.actualType = function(e, t, n, i) {
      "undefined" == typeof i && (i = this.getSelection());

      n.executeCommand = t ? new u.ReplaceCommandWithoutChangingPosition(i, e) : new u.ReplaceCommand(i, e);

      return !0;
    };

    e.prototype.type = function(e, t) {
      return this._typeInterceptorEnter(e, t) ? !0 : this._typeInterceptorAutoClosingCloseChar(e, t) ? !0 : this._typeInterceptorAutoClosingOpenChar(
        e, t) ? !0 : this._typeInterceptorSurroundSelection(e, t) ? !0 : this._typeInterceptorElectricChar(e, t) ? !0 :
        this.actualType(e, !1, t);
    };

    e.prototype.tab = function(e) {
      if (this.configuration.editor.tabFocusMode) {
        return !1;
      }
      var t = this.getSelection();
      if (t.isEmpty()) {
        var n = "";
        if (this.configuration.getIndentationOptions().insertSpaces)
          for (var i = this.helper.nextTabColumn(this.position.column - 1), o = this.position.column; i >= o; o++) {
            n += " ";
          } else {
            n = "	";
          }
        e.executeCommand = new u.ReplaceCommand(t, n);
      } else {
        e.shouldPushStackElementBefore = !0;
        e.shouldPushStackElementAfter = !0;
        this.indent(e);
      }
      return !0;
    };

    e.prototype.indent = function(e) {
      var t = this.getSelection();
      e.executeCommand = new a.ShiftCommand(this.configuration, !1, t);

      e.shouldRevealHorizontal = !1;

      return !0;
    };

    e.prototype.outdent = function(e) {
      if (this.configuration.editor.tabFocusMode) {
        return !1;
      }
      var t = this.getSelection();
      e.executeCommand = new a.ShiftCommand(this.configuration, !0, t);

      e.shouldRevealHorizontal = !1;

      return !0;
    };

    e.prototype.paste = function(e, t, n) {
      if (t && "\n" === e.charAt(e.length - 1) && e.indexOf("\n") === e.length - 1) {
        var i = new s.Range(this.position.lineNumber, 1, this.position.lineNumber, 1);
        n.executeCommand = new u.ReplaceCommand(i, e);

        return !0;
      }
      n.executeCommand = new u.ReplaceCommand(this.getSelection(), e);

      return !0;
    };

    e.prototype._autoClosingPairDelete = function(e) {
      if (!this.configuration.editor.autoClosingBrackets) {
        return !1;
      }
      var t = this.model.getLineContent(this.position.lineNumber);

      var n = t[this.position.column - 2];
      if (!this.modeConfiguration.autoClosingPairsOpen.hasOwnProperty(n)) {
        return !1;
      }
      var i = t[this.position.column - 1];

      var o = this.modeConfiguration.autoClosingPairsOpen[n];
      if (i !== o) {
        return !1;
      }
      var r = new s.Range(this.position.lineNumber, this.position.column - 1, this.position.lineNumber, this.position
        .column + 1);
      e.executeCommand = new u.ReplaceCommand(r, "");

      return !0;
    };

    e.prototype.deleteLeft = function(e) {
      if (this._autoClosingPairDelete(e)) {
        return !0;
      }
      var t = this.getSelection();
      if (t.isEmpty()) {
        var n = this.helper.getLeftOfPosition(this.model, this.position.lineNumber, this.position.column);
        t = new s.Range(n.lineNumber, n.column, this.position.lineNumber, this.position.column);
      }
      return t.isEmpty() ? !0 : (t.startLineNumber !== t.endLineNumber && (e.shouldPushStackElementBefore = !0), e.executeCommand =
        new u.ReplaceCommand(t, ""), !0);
    };

    e.prototype.deleteWordLeft = function(e) {
      if (this._autoClosingPairDelete(e)) {
        return !0;
      }
      var t = this.getSelection();
      if (t.isEmpty()) {
        var n = this.position.lineNumber;

        var i = this.position.column;
        if (1 === n && 1 === i) {
          return !0;
        }
        var o = this.helper.findWord(this.position, "left", !0);
        i = o ? o.end + 1 < i ? o.end + 1 : o.start + 1 : 1;
        var r = new s.Range(n, i, n, this.position.column);
        if (!r.isEmpty()) {
          e.executeCommand = new u.ReplaceCommand(r, "");
          return !0;
        }
      }
      return this.deleteLeft(e);
    };

    e.prototype.deleteRight = function(e) {
      var t = this.getSelection();
      if (t.isEmpty()) {
        var n = this.helper.getRightOfPosition(this.model, this.position.lineNumber, this.position.column);
        t = new s.Range(n.lineNumber, n.column, this.position.lineNumber, this.position.column);
      }
      return t.isEmpty() ? !0 : (t.startLineNumber !== t.endLineNumber && (e.shouldPushStackElementBefore = !0), e.executeCommand =
        new u.ReplaceCommand(t, ""), !0);
    };

    e.prototype.deleteWordRight = function(e) {
      var t = this.getSelection();
      if (t.isEmpty()) {
        var n = this.position.lineNumber;

        var i = this.position.column;

        var o = this.model.getLineCount();

        var a = this.model.getLineMaxColumn(n);
        if (n === o && i === a) {
          return !0;
        }
        var l = this.helper.findWord(new r.Position(n, i), "right", !0);
        i = l ? l.start + 1 > i ? l.start + 1 : l.end + 1 : a;
        var c = new s.Range(n, i, n, this.position.column);
        if (!c.isEmpty()) {
          e.executeCommand = new u.ReplaceCommand(c, "");
          return !0;
        }
      }
      return this.deleteRight(e);
    };

    e.prototype.deleteAllLeft = function(e) {
      if (this._autoClosingPairDelete(e)) {
        return !0;
      }
      var t = this.getSelection();
      if (t.isEmpty()) {
        var n = this.position.lineNumber;

        var i = this.position.column;
        if (1 === i) {
          return !0;
        }
        var o = new s.Range(n, 1, n, i);
        if (!o.isEmpty()) {
          e.executeCommand = new u.ReplaceCommand(o, "");
          return !0;
        }
      }
      return this.deleteLeft(e);
    };

    e.prototype.deleteAllRight = function(e) {
      var t = this.getSelection();
      if (t.isEmpty()) {
        var n = this.position.lineNumber;

        var i = this.position.column;

        var o = this.model.getLineMaxColumn(n);
        if (i === o) {
          return !0;
        }
        var r = new s.Range(n, i, n, o);
        if (!r.isEmpty()) {
          e.executeCommand = new u.ReplaceCommand(r, "");
          return !0;
        }
      }
      return this.deleteRight(e);
    };

    e.prototype.cut = function(e) {
      var t = this.getSelection();
      return t.isEmpty() ? !1 : (this.deleteLeft(e), !0);
    };

    return e;
  }();
  t.OneCursor = p;
  var f = function() {
    function e(e, t) {
      this.model = e;

      this.configuration = t;

      this.moveHelper = new h.ModelCursorMoveHelper(this.configuration);
    }
    e.prototype.getLeftOfPosition = function(e, t, n) {
      return this.moveHelper.getLeftOfPosition(e, t, n);
    };

    e.prototype.getRightOfPosition = function(e, t, n) {
      return this.moveHelper.getRightOfPosition(e, t, n);
    };

    e.prototype.getPositionUp = function(e, t, n, i, o) {
      return this.moveHelper.getPositionUp(e, t, n, i, o);
    };

    e.prototype.getPositionDown = function(e, t, n, i, o) {
      return this.moveHelper.getPositionDown(e, t, n, i, o);
    };

    e.prototype.getColumnAtBeginningOfLine = function(e, t, n) {
      return this.moveHelper.getColumnAtBeginningOfLine(e, t, n);
    };

    e.prototype.getColumnAtEndOfLine = function(e, t, n) {
      return this.moveHelper.getColumnAtEndOfLine(e, t, n);
    };

    e.prototype.normalizeIndentation = function(e) {
      return this.configuration.normalizeIndentation(e);
    };

    e.prototype.nextTabColumn = function(e) {
      return e + this.configuration.getIndentationOptions().tabSize - e % this.configuration.getIndentationOptions().tabSize;
    };

    e.prototype.findWord = function(e, t, n) {
      if ("undefined" == typeof n) {
        n = !1;
      }
      var i;

      var o;

      var r;

      var s = this.model.getWords(e.lineNumber, n, !0);
      if (n) {
        if (i = e.column - 1, "left" === t) {
          for (o = s.length - 1; o >= 0; o--)
            if (!(s[o].start >= i)) {
              return s[o];
            }
        } else
          for (o = 0, r = s.length; r > o; o++)
            if (!(s[o].end <= i)) {
              return s[o];
            }
      } else
        for (i = e.column, "left" === t ? 1 !== i && (i -= .1) : i !== this.model.getLineMaxColumn(e.lineNumber) && (
          i += .1), i -= 1, o = 0, r = s.length; r > o; o++)
          if (s[o].start <= i && i <= s[o].end) {
            return s[o];
          }
      return null;
    };

    return e;
  }();

  var g = function() {
    function e() {}
    e.rangeContainsPosition = function(e, t) {
      return t.lineNumber < e.startLineNumber || t.lineNumber > e.endLineNumber ? !1 : t.lineNumber === e.startLineNumber &&
        t.column < e.startColumn ? !1 : t.lineNumber === e.endLineNumber && t.column > e.endColumn ? !1 : !0;
    };

    e.isPositionInsideRange = function(e, t) {
      return e.lineNumber < t.startLineNumber ? !1 : e.lineNumber > t.endLineNumber ? !1 : e.lineNumber === t.startLineNumber &&
        e.column < t.startColumn ? !1 : e.lineNumber === t.endLineNumber && e.column > t.endColumn ? !1 : !0;
    };

    e.isPositionAtRangeEdges = function(e, t) {
      return e.lineNumber === t.startLineNumber && e.column === t.startColumn ? !0 : e.lineNumber === t.endLineNumber &&
        e.column === t.endColumn ? !0 : !1;
    };

    return e;
  }();
});