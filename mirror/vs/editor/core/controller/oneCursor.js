define(["require", "exports", "vs/base/strings", "vs/editor/modes/modes", "vs/editor/core/position",
  "vs/editor/core/range", "vs/editor/core/command/shiftCommand", "vs/editor/core/command/replaceCommand",
  "vs/editor/core/command/surroundSelectionCommand", "vs/editor/core/selection", "vs/base/errors",
  "vs/editor/core/controller/cursorMoveHelper"
], function(a, b, c, d, e, f, g, h, i, j, k, l) {
  var m = c;

  var n = d;

  var o = e;

  var p = f;

  var q = g;

  var r = h;

  var s = i;

  var t = j;

  var u = k;

  var v = l;

  var w = function() {
    function a(a, b, c, d, e) {
      this.editorId = a;

      this.model = b;

      this.configuration = c;

      this.modeConfiguration = d;

      this.viewModelHelper = e;

      this.helper = new x(this.model, this.configuration);

      this.position = new o.Position(1, 1);

      this.viewPosition = new o.Position(1, 1);

      this.positionMarkerId = null;

      this.inSelectionMode = !1;

      this.selectionStart = null;

      this.viewSelectionStart = null;

      this.selStartMarkerId = null;

      this.selEndMarkerId = null;

      this.leftoverVisibleColumns = 0;

      this.bracketDecorations = [];

      this._cachedSelection = null;

      this._cachedViewSelection = null;

      this._stopSelectionMode();

      this._setPosition(1, 1, 1, 1, 0);
    }
    a.prototype.dispose = function() {
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

    a.prototype.adjustBracketDecorations = function() {
      var a = null;

      var b = this.getSelection();
      if (b.isEmpty() && !this.configuration.editor.readOnly) {
        a = this.model.matchBracket(this.position);
      }
      var c = [];
      if (a) {
        var d = {
          isOverlay: !1,
          className: "bracket-match"
        };
        c.push({
          range: a[0],
          options: d
        });

        c.push({
          range: a[1],
          options: d
        });
      }
      this.bracketDecorations = this.model.deltaDecorations(this.bracketDecorations, c, this.editorId);
    };

    a.computeSelection = function(a, b, c) {
      var d;

      var e;

      var f;

      var g;
      a ? b.isEmpty() ? (d = b.startLineNumber, e = b.startColumn, f = c.lineNumber, g = c.column) : c.isBeforeOrEqual(
        b.getStartPosition()) ? (d = b.endLineNumber, e = b.endColumn, f = c.lineNumber, g = c.column) : (d = b.startLineNumber,
        e = b.startColumn, f = c.lineNumber, g = c.column) : (d = c.lineNumber, e = c.column, f = c.lineNumber, g = c
        .column);

      return new t.Selection(d, e, f, g);
    };

    a.prototype.getSelection = function() {
      this._cachedSelection || (this._cachedSelection = a.computeSelection(this.inSelectionMode, this.selectionStart,
        this.position));

      return this._cachedSelection;
    };

    a.prototype.getViewSelection = function() {
      this._cachedViewSelection || (this._cachedViewSelection = a.computeSelection(this.inSelectionMode, this.viewSelectionStart,
        this.viewPosition));

      return this._cachedViewSelection;
    };

    a.prototype.setSelection = function(a) {
      var b = this.model.validatePosition({
        lineNumber: a.selectionStartLineNumber,
        column: a.selectionStartColumn
      });

      var c = this.model.validatePosition({
        lineNumber: a.positionLineNumber,
        column: a.positionColumn
      });
      if (b.equals(c)) {
        this._stopSelectionMode();
      } else {
        this._startSelectionModeFromPosition(b, this.viewModelHelper.convertModelPositionToViewPosition(b.lineNumber,
          b.column));
      }
      var d = this.viewModelHelper.convertModelPositionToViewPosition(c.lineNumber, c.column);
      this._setPosition(c.lineNumber, c.column, d.lineNumber, d.column);
    };

    a.prototype.getPosition = function() {
      return this.position;
    };

    a.prototype.getViewPosition = function() {
      return this.viewPosition;
    };

    a.prototype._getValidViewPosition = function() {
      return this.viewModelHelper.validateViewPosition(this.viewPosition.lineNumber, this.viewPosition.column, this.position);
    };

    a.prototype._setPosition = function(a, b, c, d, e) {
      if (typeof e == "undefined") {
        e = 0;
      }

      this.position = new o.Position(a, b);

      this.viewPosition = new o.Position(c, d);

      this.leftoverVisibleColumns = e;

      this._cachedSelection = null;

      this._cachedViewSelection = null;

      if (this.positionMarkerId) {
        this.model._changeMarker(this.positionMarkerId, this.position.lineNumber - 1, this.position.column);
      } else {
        this.positionMarkerId = this.model._addMarker(this.position.lineNumber - 1, this.position.column, "");
      }
    };

    a.prototype._startSelectionModeFromPosition = function(a, b) {
      this.inSelectionMode = !0;

      this.selectionStart = new p.Range(a.lineNumber, a.column, a.lineNumber, a.column);

      this.viewSelectionStart = new p.Range(b.lineNumber, b.column, b.lineNumber, b.column);

      this._cachedSelection = null;

      this._cachedViewSelection = null;

      this._ensureSelectionMarkers();
    };

    a.prototype._startSelectionModeFromRange = function(a, b) {
      this.inSelectionMode = !0;

      this.selectionStart = a;

      this.viewSelectionStart = b;

      this._cachedSelection = null;

      this._cachedViewSelection = null;

      this._ensureSelectionMarkers();
    };

    a.prototype._stopSelectionMode = function() {
      this.inSelectionMode = !1;

      this.selectionStart = null;

      this.viewSelectionStart = null;

      this._cachedSelection = null;

      this._cachedViewSelection = null;

      this._ensureSelectionMarkers();
    };

    a.prototype._ensureSelectionMarkers = function() {
      if (this.inSelectionMode) {
        if (this.selStartMarkerId) {
          this.model._changeMarker(this.selStartMarkerId, this.selectionStart.startLineNumber - 1, this.selectionStart
            .startColumn);
        } else {
          this.selStartMarkerId = this.model._addMarker(this.selectionStart.startLineNumber - 1, this.selectionStart.startColumn,
            "");
        }
        if (this.selEndMarkerId) {
          this.model._changeMarker(this.selEndMarkerId, this.selectionStart.endLineNumber - 1, this.selectionStart.endColumn);
        } else {
          this.selEndMarkerId = this.model._addMarker(this.selectionStart.endLineNumber - 1, this.selectionStart.endColumn,
            "");
        }
      } else {
        if (this.selStartMarkerId) {
          this.model._removeMarker(this.selStartMarkerId);
          this.selStartMarkerId = null;
        }
        if (this.selEndMarkerId) {
          this.model._removeMarker(this.selEndMarkerId);
          this.selEndMarkerId = null;
        }
      }
    };

    a.prototype._moveModelPosition = function(a, b, c, d, e, f, g) {
      var h = this.viewModelHelper.convertModelPositionToViewPosition(d, e);
      this._actualMove(a, b, c, d, e, h.lineNumber, h.column, f, g);
    };

    a.prototype._moveViewPosition = function(a, b, c, d, e, f, g) {
      var h = this.viewModelHelper.convertViewToModelPosition(d, e);
      this._actualMove(a, b, c, h.lineNumber, h.column, d, e, f, g);
    };

    a.prototype._actualMove = function(a, b, c, d, e, f, g, h, i) {
      if (b) {
        a.cursorPositionChangeReason = b;
      }

      if (c && !this.inSelectionMode) {
        this._startSelectionModeFromPosition(this.position, this.viewPosition);
      } else {
        if (!c && this.inSelectionMode) {
          this._stopSelectionMode();
        }
      }
      if (i) {
        var j = this.model.getEditableRange();
        if (d < j.startLineNumber || d === j.startLineNumber && e < j.startColumn) {
          d = j.startLineNumber;
          e = j.startColumn;
        } else if (d > j.endLineNumber || d === j.endLineNumber && e > j.endColumn) {
          d = j.endLineNumber;
          e = j.endColumn;
        }
      }
      this._setPosition(d, e, f, g, h);
    };

    a.prototype.recoverSelectionFromMarkers = function(a) {
      a.cursorPositionChangeReason = "recoverFromMarkers";

      a.shouldPushStackElementBefore = !0;

      a.shouldPushStackElementAfter = !0;

      a.shouldReveal = !1;

      a.shouldRevealHorizontal = !1;
      var b = this.model._getMarker(this.positionMarkerId);

      var c = new o.Position(b.lineNumber, b.column);

      var d = null;

      var e = null;

      var f = null;

      var g = null;
      if (this.selStartMarkerId && this.selEndMarkerId) {
        var h = this.model._getMarker(this.selStartMarkerId);

        var i = this.model._getMarker(this.selEndMarkerId);
        d = new p.Range(h.lineNumber, h.column, i.lineNumber, i.column);
        if (d.isEmpty()) {
          f = new o.Position(d.startLineNumber, d.startColumn);
          d = null;
          if (f.equals(c)) {
            f = null;
          } else {
            g = this.viewModelHelper.convertModelPositionToViewPosition(f.lineNumber, f.column);
          }
        } else {
          var j = this.viewModelHelper.convertModelPositionToViewPosition(d.startLineNumber, d.startColumn);

          var k = this.viewModelHelper.convertModelPositionToViewPosition(d.endLineNumber, d.endColumn);
          e = new p.Range(j.lineNumber, j.column, k.lineNumber, k.column);
        }
      }
      if (d) {
        this._startSelectionModeFromRange(d, e);
      } else {
        if (f) {
          this._startSelectionModeFromPosition(f, g);
        } else {
          this._stopSelectionMode();
        }
      }
      var l = this.viewModelHelper.convertModelPositionToViewPosition(c.lineNumber, c.column);
      this._setPosition(c.lineNumber, c.column, l.lineNumber, l.column);

      return !0;
    };

    a.prototype.jumpToBracket = function(a) {
      var b = this.bracketDecorations.length;
      if (b !== 2) {
        return !1;
      }
      for (var c = 0; c < 2; c++) {
        var d = this.model.getDecorationRange(this.bracketDecorations[c]);

        var e = this.model.getDecorationRange(this.bracketDecorations[1 - c]);
        if (y.isPositionAtRangeEdges(this.position, d) || y.isPositionInsideRange(this.position, d)) {
          this._moveModelPosition(a, null, !1, e.startLineNumber, e.startColumn, 0, !1);
          return !0;
        }
      }
      return !1;
    };

    a.prototype.moveTo = function(a, b, c, d, e) {
      var f = this.model.validatePosition(b);

      var g;
      if (c) {
        g = this.viewModelHelper.validateViewPosition(c.lineNumber, c.column, f);
      } else {
        g = this.viewModelHelper.convertModelPositionToViewPosition(f.lineNumber, f.column);
      }
      var h = d === "mouse" ? "explicit" : null;
      d === "api" && (e.shouldRevealVerticalInCenter = !0);

      this._moveViewPosition(e, h, a, g.lineNumber, g.column, 0, !1);

      return !0;
    };

    a.prototype.moveLeft = function(a, b) {
      var c;

      var d;
      if (this.inSelectionMode && !a) {
        var e = this.getViewSelection();

        var f = this.viewModelHelper.validateViewPosition(e.startLineNumber, e.startColumn, this.getSelection().getStartPosition());
        c = f.lineNumber;

        d = f.column;
      } else {
        var g = this._getValidViewPosition();

        var h = this.helper.getLeftOfPosition(this.viewModelHelper.viewModel, g.lineNumber, g.column);
        c = h.lineNumber;

        d = h.column;
      }
      this._moveViewPosition(b, "explicit", a, c, d, 0, !0);

      return !0;
    };

    a.prototype.moveWordLeft = function(a, b) {
      var c = this.position.lineNumber;

      var d = this.position.column;

      var e = !1;
      if (d === 1 && c > 1) {
        e = !0;
        c -= 1;
        d = this.model.getLineMaxColumn(c);
      }
      var f = this.helper.findWord(new o.Position(c, d), "left", !0);
      f ? e || d > f.end + 1 ? d = f.end + 1 : d = f.start + 1 : d = 1;

      this._moveModelPosition(b, "explicit", a, c, d, 0, !0);

      return !0;
    };

    a.prototype.moveRight = function(a, b) {
      var c;

      var d;
      if (this.inSelectionMode && !a) {
        var e = this.getViewSelection();

        var f = this.viewModelHelper.validateViewPosition(e.endLineNumber, e.endColumn, this.getSelection().getEndPosition());
        c = f.lineNumber;

        d = f.column;
      } else {
        var g = this._getValidViewPosition();

        var h = this.helper.getRightOfPosition(this.viewModelHelper.viewModel, g.lineNumber, g.column);
        c = h.lineNumber;

        d = h.column;
      }
      this._moveViewPosition(b, "explicit", a, c, d, 0, !0);

      return !0;
    };

    a.prototype.moveWordRight = function(a, b) {
      var c = this.position.lineNumber;

      var d = this.position.column;

      var e = !1;
      if (d === this.model.getLineMaxColumn(c) && c < this.model.getLineCount()) {
        e = !0;
        c += 1;
        d = 1;
      }
      var f = this.helper.findWord(new o.Position(c, d), "right", !0);
      f ? e || d < f.start + 1 ? d = f.start + 1 : d = f.end + 1 : d = this.model.getLineMaxColumn(c);

      this._moveModelPosition(b, "explicit", a, c, d, 0, !0);

      return !0;
    };

    a.prototype.moveDown = function(a, b, c) {
      var d = b ? this.configuration.editor.pageSize : 1;

      var e;

      var f;
      if (this.inSelectionMode && !a) {
        var g = this.getViewSelection();

        var h = this.viewModelHelper.validateViewPosition(g.endLineNumber, g.endColumn, this.getSelection().getEndPosition());
        e = h.lineNumber;

        f = h.column;
      } else {
        var i = this._getValidViewPosition();
        e = i.lineNumber;

        f = i.column;
      }
      var j = this.helper.getPositionDown(this.viewModelHelper.viewModel, e, f, this.leftoverVisibleColumns, d);
      this._moveViewPosition(c, "explicit", a, j.lineNumber, j.column, j.leftoverVisibleColumns, !0);

      return !0;
    };

    a.prototype.moveUp = function(a, b, c) {
      var d = b ? this.configuration.editor.pageSize : 1;

      var e;

      var f;
      if (this.inSelectionMode && !a) {
        var g = this.getViewSelection();

        var h = this.viewModelHelper.validateViewPosition(g.startLineNumber, g.startColumn, this.getSelection().getStartPosition());
        e = h.lineNumber;

        f = h.column;
      } else {
        var i = this._getValidViewPosition();
        e = i.lineNumber;

        f = i.column;
      }
      var j = this.helper.getPositionUp(this.viewModelHelper.viewModel, e, f, this.leftoverVisibleColumns, d);
      this._moveViewPosition(c, "explicit", a, j.lineNumber, j.column, j.leftoverVisibleColumns, !0);

      return !0;
    };

    a.prototype.moveToBeginningOfLine = function(a, b) {
      var c = this._getValidViewPosition();

      var d = c.lineNumber;

      var e = c.column;
      e = this.helper.getColumnAtBeginningOfLine(this.viewModelHelper.viewModel, d, e);

      this._moveViewPosition(b, "explicit", a, d, e, 0, !0);

      return !0;
    };

    a.prototype.moveToEndOfLine = function(a, b) {
      var c = this._getValidViewPosition();

      var d = c.lineNumber;

      var e = c.column;
      e = this.helper.getColumnAtEndOfLine(this.viewModelHelper.viewModel, d, e);

      this._moveViewPosition(b, "explicit", a, d, e, 0, !0);

      return !0;
    };

    a.prototype.moveToBeginningOfBuffer = function(a, b) {
      this._moveModelPosition(b, "explicit", a, 1, 1, 0, !0);

      return !0;
    };

    a.prototype.moveToEndOfBuffer = function(a, b) {
      var c = this.model.getLineCount();

      var d = this.model.getLineMaxColumn(c);
      this._moveModelPosition(b, "explicit", a, c, d, 0, !0);

      return !0;
    };

    a.prototype.selectAll = function(a) {
      var b = !0;

      var c;

      var d;

      var e;

      var f;
      if (this.model.hasEditableRange()) {
        var g = this.model.getEditableRange();

        var h = this.getSelection();
        if (!h.equalsRange(g)) {
          b = !1;
          c = g.startLineNumber;
          d = g.startColumn;
          e = g.endLineNumber;
          f = g.endColumn;
        }
      }
      b && (c = 1, d = 1, e = this.model.getLineCount(), f = this.model.getLineMaxColumn(e));

      this._moveModelPosition(a, null, !1, c, d, 0, !1);

      this._moveModelPosition(a, null, !0, e, f, 0, !1);

      a.shouldReveal = !1;

      a.shouldRevealHorizontal = !1;

      return !0;
    };

    a.prototype.line = function(a, b, c, d) {
      var e = this.model.validatePosition(b);

      var f;
      if (c) {
        f = this.viewModelHelper.validateViewPosition(c.lineNumber, c.column, e);
      } else {
        f = this.viewModelHelper.convertModelPositionToViewPosition(e.lineNumber, e.column);
      }
      var g;

      var h;
      if (!a || !this.inSelectionMode) {
        var i = new p.Range(f.lineNumber, 1, f.lineNumber, this.viewModelHelper.viewModel.getLineMaxColumn(f.lineNumber));

        var j = this.viewModelHelper.convertViewToModelPosition(i.startLineNumber, i.startColumn);

        var k = this.viewModelHelper.convertViewToModelPosition(i.endLineNumber, i.endColumn);
        this._startSelectionModeFromRange(new p.Range(j.lineNumber, j.column, k.lineNumber, k.column), i);

        g = i.endLineNumber;

        h = i.endColumn;
      } else {
        g = f.lineNumber;
        if (e.isBeforeOrEqual(this.selectionStart.getStartPosition())) {
          h = 1;
        } else {
          h = this.viewModelHelper.viewModel.getLineMaxColumn(g);
        }
      }
      d.cursorPositionChangeReason = "explicit";

      d.shouldRevealHorizontal = !1;
      var l = this.viewModelHelper.convertViewToModelPosition(g, h);
      this._setPosition(l.lineNumber, l.column, g, h, 0);

      return !0;
    };

    a.prototype.word = function(a, b, c, d) {
      var e = this.model.validatePosition(b);

      var f = this.helper.findWord(e, c);

      var g;

      var h;

      var i;

      var j;
      if (!a || !this.inSelectionMode) {
        if (f) {
          g = f.start + 1;
          h = f.end + 1;
        } else {
          var k = this.model.getLineMaxColumn(e.lineNumber);
          if (e.column === k || c === "left") {
            g = e.column - 1;
            h = e.column;
          } else {
            g = e.column;
            h = e.column + 1;
          }

          if (g <= 1) {
            g = 1;
          }

          if (h >= k) {
            h = k;
          }
        }
        var l = new p.Range(e.lineNumber, g, e.lineNumber, h);

        var m = this.viewModelHelper.convertModelPositionToViewPosition(e.lineNumber, g);

        var n = this.viewModelHelper.convertModelPositionToViewPosition(e.lineNumber, h);
        this._startSelectionModeFromRange(l, new p.Range(m.lineNumber, m.column, n.lineNumber, n.column));

        i = l.endLineNumber;

        j = l.endColumn;
      } else {
        g = f ? f.start + 1 : e.column;
        h = f ? f.end + 1 : e.column;
        i = e.lineNumber;
        if (e.isBeforeOrEqual(this.selectionStart.getStartPosition())) {
          j = g;
        } else {
          j = h;
        }
      }
      d.cursorPositionChangeReason = "explicit";
      var o = this.viewModelHelper.convertModelPositionToViewPosition(i, j);
      this._setPosition(i, j, o.lineNumber, o.column, 0);

      return !0;
    };

    a.prototype.cancelSelection = function(a) {
      return this.inSelectionMode ? (this._stopSelectionMode(), !0) : !0;
    };

    a.prototype._typeInterceptorEnter = function(a, b) {
      return a !== "\n" ? !1 : this._enter(!1, b);
    };

    a.prototype.lineInsertBefore = function(a) {
      var b = this.position.lineNumber;

      var c = 0;
      b > 1 && (b--, c = this.model.getLineMaxColumn(b));

      return this._enter(!1, a, new o.Position(b, c), new p.Range(b, c, b, c));
    };

    a.prototype.lineInsertAfter = function(a) {
      var b = this.model.getLineMaxColumn(this.position.lineNumber);
      return this._enter(!1, a, new o.Position(this.position.lineNumber, b), new p.Range(this.position.lineNumber, b,
        this.position.lineNumber, b));
    };

    a.prototype.lineBreakInsert = function(a) {
      return this._enter(!0, a);
    };

    a.prototype._enter = function(a, b, c, d) {
      if (typeof c == "undefined") {
        c = this.position;
      }

      if (typeof d == "undefined") {
        d = this.getSelection();
      }

      b.shouldPushStackElementBefore = !0;
      var e = this.model.getLineContent(c.lineNumber);

      var f = this.model.getRawLineTokens(c.lineNumber);

      var g;
      if (this.model.getMode().electricCharacterSupport) try {
        g = this.model.getMode().electricCharacterSupport.onEnter(e, f, c.column - 1);
      } catch (h) {
        u.onUnexpectedError(h);
      }
      var i = m.getLeadingWhitespace(e);
      if (i.length > c.column - 1) {
        i = i.substring(0, c.column - 1);
      }

      if (g) {
        if (g.appendText) {
          if (m.firstNonWhitespaceIndex(g.appendText) === -1) {
            g.appendText = this.helper.normalizeIndentation(g.appendText);
          }
        } else {
          g.appendText = "	";
        }
        if (!g.indentOutdentAppendText) {
          g.indentOutdentAppendText = "";
        }
      } else {
        g = {
          indentAction: n.IndentAction.None,
          appendText: "",
          indentOutdentAppendText: ""
        };
      }
      if (g.indentAction === n.IndentAction.None) {
        this.actualType("\n" + this.helper.normalizeIndentation(i) + g.appendText, a, b, d);
      } else if (g.indentAction === n.IndentAction.Indent) {
        this.actualType("\n" + this.helper.normalizeIndentation(i) + g.appendText, a, b, d);
      } else if (g.indentAction === n.IndentAction.IndentOutdent) {
        var j = this.helper.normalizeIndentation(i);

        var k = this.helper.normalizeIndentation(i) + g.appendText;

        var l = "\n" + k + "\n" + j + g.indentOutdentAppendText;
        if (a) {
          b.executeCommand = new r.ReplaceCommandWithoutChangingPosition(d, l);
        } else {
          b.executeCommand = new r.ReplaceCommandWithOffsetCursorState(d, l, -1, k.length - j.length);
        }
      }
      return !0;
    };

    a.prototype._typeInterceptorAutoClosingCloseChar = function(a, b) {
      if (!this.configuration.editor.autoClosingBrackets) {
        return !1;
      }
      var c = this.getSelection();
      if (!c.isEmpty() || !this.modeConfiguration.autoClosingPairsClose.hasOwnProperty(a)) {
        return !1;
      }
      var d = this.model.getLineContent(this.position.lineNumber);

      var e = d[this.position.column - 1];
      if (e !== a) {
        return !1;
      }
      var f = new p.Range(this.position.lineNumber, this.position.column, this.position.lineNumber, this.position.column +
        1);
      b.executeCommand = new r.ReplaceCommand(f, a);

      return !0;
    };

    a.prototype._typeInterceptorAutoClosingOpenChar = function(a, b) {
      if (!this.configuration.editor.autoClosingBrackets) {
        return !1;
      }
      var c = this.getSelection();
      if (!c.isEmpty() || !this.modeConfiguration.autoClosingPairsOpen.hasOwnProperty(a)) {
        return !1;
      }
      if (!this.model.getMode().characterPairSupport) {
        return !1;
      }
      var d = this.model.getLineContent(this.position.lineNumber);

      var e = d[this.position.column - 1];

      var f = this.modeConfiguration.autoClosingPairsOpen[a];
      if (e && e !== f && !/\s/.test(e)) {
        return !1;
      }
      var g = this.model.getRawLineTokens(this.position.lineNumber);

      var h = !1;
      try {
        h = this.model.getMode().characterPairSupport.shouldAutoClosePair(a, d, g, this.position.column - 1);
      } catch (i) {
        u.onUnexpectedError(i);
      }
      return h ? (b.shouldPushStackElementBefore = !0, b.executeCommand = new r.ReplaceCommandWithOffsetCursorState(c,
        a + f, 0, -f.length), !0) : !1;
    };

    a.prototype._typeInterceptorSurroundSelection = function(a, b) {
      if (!this.configuration.editor.autoClosingBrackets) {
        return !1;
      }
      var c = this.getSelection();
      if (c.isEmpty() || !this.modeConfiguration.surroundingPairs.hasOwnProperty(a)) {
        return !1;
      }
      var d = this.modeConfiguration.surroundingPairs[a];
      b.shouldPushStackElementBefore = !0;

      b.shouldPushStackElementAfter = !0;

      b.executeCommand = new s.SurroundSelectionCommand(c, a, d);

      return !0;
    };

    a.prototype._typeInterceptorElectricChar = function(a, b) {
      var c = this;
      return this.modeConfiguration.electricChars.hasOwnProperty(a) ? (b.postOperationRunnable = function(a) {
        return c._typeInterceptorElectricCharRunnable(a);
      }, this.actualType(a, !1, b)) : !1;
    };

    a.prototype._typeInterceptorElectricCharRunnable = function(a) {
      var b = this.model.getLineContent(this.position.lineNumber);

      var c = this.model.getRawLineTokens(this.position.lineNumber);

      var d;
      if (this.model.getMode().electricCharacterSupport) try {
        d = this.model.getMode().electricCharacterSupport.onElectricCharacter(b, c, this.position.column - 2);
      } catch (e) {
        u.onUnexpectedError(e);
      }
      if (d) {
        var f;

        var g = d.matchBracketType;

        var h = d.appendText;
        if (g) {
          var i = null;
          if (g) {
            i = this.model.findMatchingBracketUp(g, this.position);
          }
          if (i) {
            var j = i.startLineNumber;

            var k = this.model.getLineContent(j);

            var l = m.getLeadingWhitespace(k);

            var n = this.helper.normalizeIndentation(l);

            var o = this.model.getLineFirstNonWhitespaceColumn(this.position.lineNumber) || this.position.column;

            var q = b.substring(0, o - 1);
            if (q !== n) {
              var s = b.substring(o - 1, this.position.column - 1);

              var t = n + s;

              var v = new p.Range(this.position.lineNumber, 1, this.position.lineNumber, this.position.column);
              a.shouldPushStackElementAfter = !0;

              a.executeCommand = new r.ReplaceCommand(v, t);
            }
          }
        } else if (h) {
          var w = -h.length;
          if (d.advanceCount) {
            w += d.advanceCount;
          }

          a.shouldPushStackElementAfter = !0;

          a.executeCommand = new r.ReplaceCommandWithOffsetCursorState(this.getSelection(), h, 0, w);
        }
      }
    };

    a.prototype.actualType = function(a, b, c, d) {
      typeof d == "undefined" && (d = this.getSelection());

      b ? c.executeCommand = new r.ReplaceCommandWithoutChangingPosition(d, a) : c.executeCommand = new r.ReplaceCommand(
        d, a);

      return !0;
    };

    a.prototype.type = function(a, b) {
      return this._typeInterceptorEnter(a, b) ? !0 : this._typeInterceptorAutoClosingCloseChar(a, b) ? !0 : this._typeInterceptorAutoClosingOpenChar(
        a, b) ? !0 : this._typeInterceptorSurroundSelection(a, b) ? !0 : this._typeInterceptorElectricChar(a, b) ? !0 :
        this.actualType(a, !1, b);
    };

    a.prototype.tab = function(a) {
      if (this.configuration.editor.tabFocusMode) {
        return !1;
      }
      var b = this.getSelection();
      if (b.isEmpty()) {
        var c = "";
        if (this.configuration.editor.insertSpaces) {
          var d = this.helper.nextTabColumn(this.position.column - 1);
          for (var e = this.position.column; e <= d; e++) {
            c += " ";
          }
        } else {
          c = "	";
        }
        a.executeCommand = new r.ReplaceCommand(b, c);
      } else {
        a.shouldPushStackElementBefore = !0;
        a.shouldPushStackElementAfter = !0;
        this.indent(a);
      }
      return !0;
    };

    a.prototype.indent = function(a) {
      var b = this.getSelection();
      a.executeCommand = new q.ShiftCommand(this.configuration, !1, b);

      a.shouldRevealHorizontal = !1;

      return !0;
    };

    a.prototype.outdent = function(a) {
      if (this.configuration.editor.tabFocusMode) {
        return !1;
      }
      var b = this.getSelection();
      a.executeCommand = new q.ShiftCommand(this.configuration, !0, b);

      a.shouldRevealHorizontal = !1;

      return !0;
    };

    a.prototype.paste = function(a, b, c) {
      if (b && a.charAt(a.length - 1) === "\n" && a.indexOf("\n") === a.length - 1) {
        var d = new p.Range(this.position.lineNumber, 1, this.position.lineNumber, 1);
        c.executeCommand = new r.ReplaceCommand(d, a);

        return !0;
      }
      c.executeCommand = new r.ReplaceCommand(this.getSelection(), a);

      return !0;
    };

    a.prototype._autoClosingPairDelete = function(a) {
      if (!this.configuration.editor.autoClosingBrackets) {
        return !1;
      }
      var b = this.model.getLineContent(this.position.lineNumber);

      var c = b[this.position.column - 2];
      if (!this.modeConfiguration.autoClosingPairsOpen.hasOwnProperty(c)) {
        return !1;
      }
      var d = b[this.position.column - 1];

      var e = this.modeConfiguration.autoClosingPairsOpen[c];
      if (d !== e) {
        return !1;
      }
      var f = new p.Range(this.position.lineNumber, this.position.column - 1, this.position.lineNumber, this.position
        .column + 1);
      a.executeCommand = new r.ReplaceCommand(f, "");

      return !0;
    };

    a.prototype.deleteLeft = function(a) {
      if (this._autoClosingPairDelete(a)) {
        return !0;
      }
      var b = this.getSelection();
      if (b.isEmpty()) {
        var c = this.helper.getLeftOfPosition(this.model, this.position.lineNumber, this.position.column);
        b = new p.Range(c.lineNumber, c.column, this.position.lineNumber, this.position.column);
      }
      return b.isEmpty() ? !0 : (b.startLineNumber !== b.endLineNumber && (a.shouldPushStackElementBefore = !0), a.executeCommand =
        new r.ReplaceCommand(b, ""), !0);
    };

    a.prototype.deleteWordLeft = function(a) {
      if (this._autoClosingPairDelete(a)) {
        return !0;
      }
      var b = this.getSelection();
      if (b.isEmpty()) {
        var c = this.position.lineNumber;

        var d = this.position.column;
        if (c === 1 && d === 1) {
          return !0;
        }
        var e = this.helper.findWord(this.position, "left", !0);
        if (e) {
          if (e.end + 1 < d) {
            d = e.end + 1;
          } else {
            d = e.start + 1;
          }
        } else {
          d = 1;
        }
        var f = new p.Range(c, d, c, this.position.column);
        if (!f.isEmpty()) {
          a.executeCommand = new r.ReplaceCommand(f, "");
          return !0;
        }
      }
      return this.deleteLeft(a);
    };

    a.prototype.deleteRight = function(a) {
      var b = this.getSelection();
      if (b.isEmpty()) {
        var c = this.helper.getRightOfPosition(this.model, this.position.lineNumber, this.position.column);
        b = new p.Range(c.lineNumber, c.column, this.position.lineNumber, this.position.column);
      }
      return b.isEmpty() ? !0 : (b.startLineNumber !== b.endLineNumber && (a.shouldPushStackElementBefore = !0), a.executeCommand =
        new r.ReplaceCommand(b, ""), !0);
    };

    a.prototype.deleteWordRight = function(a) {
      var b = this.getSelection();
      if (b.isEmpty()) {
        var c = this.position.lineNumber;

        var d = this.position.column;

        var e = this.model.getLineCount();

        var f = this.model.getLineMaxColumn(c);
        if (c === e && d === f) {
          return !0;
        }
        var g = this.helper.findWord(new o.Position(c, d), "right", !0);
        if (g) {
          if (g.start + 1 > d) {
            d = g.start + 1;
          } else {
            d = g.end + 1;
          }
        } else {
          d = f;
        }
        var h = new p.Range(c, d, c, this.position.column);
        if (!h.isEmpty()) {
          a.executeCommand = new r.ReplaceCommand(h, "");
          return !0;
        }
      }
      return this.deleteRight(a);
    };

    a.prototype.deleteAllLeft = function(a) {
      if (this._autoClosingPairDelete(a)) {
        return !0;
      }
      var b = this.getSelection();
      if (b.isEmpty()) {
        var c = this.position.lineNumber;

        var d = this.position.column;
        if (d === 1) {
          return !0;
        }
        var e = new p.Range(c, 1, c, d);
        if (!e.isEmpty()) {
          a.executeCommand = new r.ReplaceCommand(e, "");
          return !0;
        }
      }
      return this.deleteLeft(a);
    };

    a.prototype.deleteAllRight = function(a) {
      var b = this.getSelection();
      if (b.isEmpty()) {
        var c = this.position.lineNumber;

        var d = this.position.column;

        var e = this.model.getLineMaxColumn(c);
        if (d === e) {
          return !0;
        }
        var f = new p.Range(c, d, c, e);
        if (!f.isEmpty()) {
          a.executeCommand = new r.ReplaceCommand(f, "");
          return !0;
        }
      }
      return this.deleteRight(a);
    };

    a.prototype.cut = function(a) {
      var b = this.getSelection();
      if (!b.isEmpty()) {
        this.deleteLeft(a);
      } else {
        var c = this.position.lineNumber;

        var d = 1;

        var e = this.position.lineNumber + 1;

        var f = 1;
        if (e > this.model.getLineCount()) {
          e--;
          f = this.model.getLineMaxColumn(e);
        }
        var g = new p.Range(c, d, e, f);
        if (!g.isEmpty()) {
          a.executeCommand = new r.ReplaceCommand(g, "");
        }
      }
      return !0;
    };

    return a;
  }();
  b.OneCursor = w;
  var x = function() {
    function a(a, b) {
      this.model = a;

      this.configuration = b;

      this.moveHelper = new v.ModelCursorMoveHelper(this.configuration);
    }
    a.prototype.getLeftOfPosition = function(a, b, c) {
      return this.moveHelper.getLeftOfPosition(a, b, c);
    };

    a.prototype.getRightOfPosition = function(a, b, c) {
      return this.moveHelper.getRightOfPosition(a, b, c);
    };

    a.prototype.getPositionUp = function(a, b, c, d, e) {
      return this.moveHelper.getPositionUp(a, b, c, d, e);
    };

    a.prototype.getPositionDown = function(a, b, c, d, e) {
      return this.moveHelper.getPositionDown(a, b, c, d, e);
    };

    a.prototype.getColumnAtBeginningOfLine = function(a, b, c) {
      return this.moveHelper.getColumnAtBeginningOfLine(a, b, c);
    };

    a.prototype.getColumnAtEndOfLine = function(a, b, c) {
      return this.moveHelper.getColumnAtEndOfLine(a, b, c);
    };

    a.prototype.normalizeIndentation = function(a) {
      return this.configuration.normalizeIndentation(a);
    };

    a.prototype.nextTabColumn = function(a) {
      return a + this.configuration.editor.tabSize - a % this.configuration.editor.tabSize;
    };

    a.prototype.findWord = function(a, b, c) {
      if (typeof c == "undefined") {
        c = !1;
      }
      var d = this.model.getWords(a.lineNumber, c);

      var e;

      var f;

      var g;
      if (c) {
        e = a.column - 1;
        if (b === "left")
          for (f = d.length - 1; f >= 0; f--) {
            if (d[f].start >= e) continue;
            return d[f];
          } else
            for (f = 0, g = d.length; f < g; f++) {
              if (d[f].end <= e) continue;
              return d[f];
            }
      } else {
        e = a.column;

        if (b === "left") {
          if (e !== 1) {
            e -= .1;
          }
        } else {
          if (e !== this.model.getLineMaxColumn(a.lineNumber)) {
            e += .1;
          }
        }

        e -= 1;
        for (f = 0, g = d.length; f < g; f++)
          if (d[f].start <= e && e <= d[f].end) {
            return d[f];
          }
      }
      return null;
    };

    return a;
  }();

  var y = function() {
    function a() {}
    a.rangeContainsPosition = function(a, b) {
      return b.lineNumber < a.startLineNumber || b.lineNumber > a.endLineNumber ? !1 : b.lineNumber === a.startLineNumber &&
        b.column < a.startColumn ? !1 : b.lineNumber === a.endLineNumber && b.column > a.endColumn ? !1 : !0;
    };

    a.isPositionInsideRange = function(a, b) {
      return a.lineNumber < b.startLineNumber ? !1 : a.lineNumber > b.endLineNumber ? !1 : a.lineNumber === b.startLineNumber &&
        a.column < b.startColumn ? !1 : a.lineNumber === b.endLineNumber && a.column > b.endColumn ? !1 : !0;
    };

    a.isPositionAtRangeEdges = function(a, b) {
      return a.lineNumber === b.startLineNumber && a.column === b.startColumn ? !0 : a.lineNumber === b.endLineNumber &&
        a.column === b.endColumn ? !0 : !1;
    };

    return a;
  }();
});