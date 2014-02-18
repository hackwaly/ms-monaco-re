var __extends = this.__extends || function(a, b) {
    function d() {
      this.constructor = a;
    }
    for (var c in b) {
      if (b.hasOwnProperty(c)) {
        a[c] = b[c];
      }
    }
    d.prototype = b.prototype;

    a.prototype = new d;
  };

define(["require", "exports", "vs/nls", "vs/editor/core/constants", "vs/editor/core/range", "vs/editor/core/selection",
  "vs/base/eventEmitter", "vs/editor/core/handlerDispatcher", "vs/editor/editor",
  "vs/editor/core/controller/cursorCollection", "vs/base/errors", "vs/editor/core/position"
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

  var w = function(a) {
    function b(b, c, d, e, f) {
      var g = this;
      a.call(this);

      this.editorId = b;

      this.configuration = c;

      this.model = d;

      this.renderOnce = e;

      this.viewModelHelper = f;

      if (!this.viewModelHelper) {
        this.viewModelHelper = {
          viewModel: this.model,
          convertModelPositionToViewPosition: function(a, b) {
            return new v.Position(a, b);
          },
          convertViewToModelPosition: function(a, b) {
            return new v.Position(a, b);
          },
          validateViewPosition: function(a, b, c) {
            return c;
          }
        };
      }

      this.cursors = new t.CursorCollection(this.editorId, this.model, this.configuration, this.viewModelHelper);

      this.typingListeners = {};

      this._isHandling = !1;

      this.modelUnbind = this.model.addListener(n.EventType.ModelContentChanged, function(a) {
        g._onModelContentChanged(a);
      });

      this._registerHandlers();
    }
    __extends(b, a);

    b.prototype.dispose = function() {
      this.modelUnbind();

      this.modelUnbind = null;

      this.model = null;

      this.cursors.dispose();

      this.cursors = null;

      this.configuration.handlerDispatcher.clearHandlers();

      this.configuration = null;

      this.renderOnce = null;

      this.viewModelHelper = null;

      a.prototype.dispose.call(this);
    };

    b.prototype.saveState = function() {
      var a = this.cursors.getSelections();

      var b = [];

      var c;
      for (var d = 0; d < a.length; d++) {
        c = a[d];
        b.push({
          inSelectionMode: !c.isEmpty(),
          selectionStart: {
            lineNumber: c.selectionStartLineNumber,
            column: c.selectionStartColumn
          },
          position: {
            lineNumber: c.positionLineNumber,
            column: c.positionColumn
          }
        });
      }
      return b;
    };

    b.prototype.restoreState = function(a) {
      var b = this;

      var c = [];

      var d;
      for (var e = 0; e < a.length; e++) {
        d = a[e];
        var f = d.inSelectionMode;

        var g = 1;

        var h = 1;
        if (d.position && d.position.lineNumber) {
          g = d.position.lineNumber;
        }

        if (d.position && d.position.column) {
          h = d.position.column;
        }
        var i = g;

        var j = h;
        if (d.selectionStart && d.selectionStart.lineNumber) {
          i = d.selectionStart.lineNumber;
        }

        if (d.selectionStart && d.selectionStart.column) {
          j = d.selectionStart.column;
        }

        c.push({
          selectionStartLineNumber: i,
          selectionStartColumn: j,
          positionLineNumber: g,
          positionColumn: h
        });
      }
      this._onHandler("restoreState", function(a) {
        b.cursors.setSelections(c);

        return !1;
      }, new r.DispatcherEvent("restoreState", null));
    };

    b.prototype.setEditableRange = function(a) {
      this.model.setEditableRange(a);
    };

    b.prototype.getEditableRange = function() {
      return this.model.getEditableRange();
    };

    b.prototype.addTypingListener = function(a, b) {
      if (!this.typingListeners.hasOwnProperty(a)) {
        this.typingListeners[a] = [];
      }

      this.typingListeners[a].push(b);
    };

    b.prototype.removeTypingListener = function(a, b) {
      if (this.typingListeners.hasOwnProperty(a)) {
        var c = this.typingListeners[a];
        for (var d = 0; d < c.length; d++)
          if (c[d] === b) {
            c.splice(d, 1);
            return;
          }
      }
    };

    b.prototype._onModelContentChanged = function(a) {
      var b = this;
      if (a.changeType === n.EventType.ModelContentChangedFlush) {
        this.cursors.dispose();
        this.cursors = new t.CursorCollection(this.editorId, this.model, this.configuration, this.viewModelHelper);
        this.emitCursorPositionChanged("", "");
        this.emitCursorSelectionChanged("", "");
        this.emitCursorRevealRange(!1, !0);
      } else {
        if (!this._isHandling) {
          this._onHandler("recoverSelectionFromMarkers", function(a) {
            var c = b._invokeForAll(a, function(a, b, c) {
              return b.recoverSelectionFromMarkers(c);
            });
            a.shouldPushStackElementBefore = !1;

            a.shouldPushStackElementAfter = !1;

            return c;
          }, new r.DispatcherEvent("modelChange", null));
        }
      }
    };

    b.prototype.getSelection = function() {
      return this.cursors.getSelection(0);
    };

    b.prototype.getSelections = function() {
      return this.cursors.getSelections();
    };

    b.prototype.getPosition = function() {
      return this.cursors.getPosition(0);
    };

    b.prototype.setSelections = function(a, b) {
      var c = this;
      this._onHandler("setSelections", function(a) {
        a.shouldReveal = !1;

        c.cursors.setSelections(b);

        return !1;
      }, new r.DispatcherEvent(a, null));
    };

    b.prototype._createAndInterpretHandlerCtx = function(a, b, c) {
      var d = {
        cursorPositionChangeReason: "",
        shouldReveal: !0,
        shouldRevealVerticalInCenter: !1,
        shouldRevealHorizontal: !0,
        eventSource: a,
        eventData: b,
        executeCommands: [],
        postOperationRunnables: [],
        shouldPushStackElementBefore: !1,
        shouldPushStackElementAfter: !1
      };
      c(d);

      this._interpretHandlerContext(d);

      this.cursors.normalize();
    };

    b.prototype._onHandler = function(a, b, c) {
      var d = this;
      if (this._isHandling) throw new Error("Why am I recursive?");
      this._isHandling = !0;

      this.charactersTyped = "";
      var e = !1;
      this.renderOnce(function() {
        var a = d.cursors.getSelections();

        var f = d.cursors.getViewSelections();

        var g = c.getSource();

        var h;

        var i;

        var j;

        var k;
        d._createAndInterpretHandlerCtx(g, c.getData(), function(a) {
          e = b(a);

          h = a.cursorPositionChangeReason;

          i = a.shouldReveal;

          j = a.shouldRevealVerticalInCenter;

          k = a.shouldRevealHorizontal;
        });
        for (var l = 0; l < d.charactersTyped.length; l++) {
          var m = d.charactersTyped.charAt(l);
          if (d.typingListeners.hasOwnProperty(m)) {
            var n = d.typingListeners[m].slice(0);
            for (var o = 0, p = n.length; o < p; o++) {
              n[o]();
            }
          }
        }
        var q = d.cursors.getSelections();

        var r = d.cursors.getViewSelections();

        var s = !1;
        if (a.length !== q.length) {
          s = !0;
        } else {
          for (var l = 0, t = a.length; !s && l < t; l++) {
            if (!a[l].equalsSelection(q[l])) {
              s = !0;
            }
          }
          for (var l = 0, t = f.length; !s && l < t; l++) {
            if (!f[l].equalsSelection(r[l])) {
              s = !0;
            }
          }
        }
        if (s) {
          d.emitCursorPositionChanged(g, h);
          if (i) {
            d.emitCursorRevealRange(j, k);
          }
          d.emitCursorSelectionChanged(g, h);
        }
      });

      this._isHandling = !1;

      return e;
    };

    b.prototype._interpretHandlerContext = function(a) {
      if (a.shouldPushStackElementBefore) {
        this.model.pushStackElement();
        a.shouldPushStackElementBefore = !1;
      }

      this._internalExecuteCommands(a.executeCommands, a.postOperationRunnables);

      a.executeCommands = [];

      if (a.shouldPushStackElementAfter) {
        this.model.pushStackElement();
        a.shouldPushStackElementAfter = !1;
      }
      var b = !1;
      for (var c = 0, d = a.postOperationRunnables.length; c < d; c++)
        if (a.postOperationRunnables[c]) {
          b = !0;
          break;
        }
      if (b) {
        var e = a.postOperationRunnables.slice(0);
        a.postOperationRunnables = [];

        this._invokeForAll(a, function(a, b, c) {
          e[a] && e[a](c);

          return !1;
        });

        this._interpretHandlerContext(a);
      }
    };

    b.prototype._interpretCommandResult = function(a) {
      return a ? (this.cursors.setSelections(a), !0) : !1;
    };

    b.prototype._getEditOperationsFromCommand = function(a, b, c) {
      var d = this;

      var e = [];

      var f = [];

      var g = 0;

      var h = function(a, c) {
        if (!a.isEmpty() || c) {
          e.push({
            identifier: {
              major: b,
              minor: g++
            },
            range: a,
            text: c
          });
        }
      };

      var i = !1;

      var j = function(b) {
        var c;

        var e;
        i = !0;
        if (b.isEmpty()) {
          var f = d.model.getLineMaxColumn(b.startLineNumber);
          if (b.startColumn === f) {
            c = "start";
            e = "start";
          } else {
            c = "end";
            e = "end";
          }
        } else {
          if (b.getDirection() === s.SelectionDirection.LTR) {
            c = "end";
            e = "start";
          } else {
            c = "start";
            e = "end";
          }
        }
        var g = a.selectionStartMarkers.length;
        a.selectionStartMarkers[g] = d.model._addMarker(b.selectionStartLineNumber - 1, b.selectionStartColumn, c);

        a.positionMarkers[g] = d.model._addMarker(b.positionLineNumber - 1, b.positionColumn, e);

        return g.toString();
      };

      var k = {
        addEditOperation: h,
        trackSelection: j
      };
      try {
        c.getEditOperations(this.model, k);
      } catch (l) {
        u.onUnexpectedError(l, m.localize("corrupt.commands", "Unexpected exception while executing command."));

        return {
          operations: [],
          hadTrackedRange: !1
        };
      }
      return {
        operations: e,
        hadTrackedRange: i
      };
    };

    b.prototype._getEditOperations = function(a, b) {
      var c;

      var d = [];

      var e = [];

      var f;
      for (var g = 0; g < b.length; g++) {
        if (b[g]) {
          c = this._getEditOperationsFromCommand(a, g, b[g]);
          d = d.concat(c.operations);
          e[g] = c.hadTrackedRange;
          f = f || e[g];
        } else {
          e[g] = !1;
        }
      }
      return {
        operations: d,
        hadTrackedRanges: e,
        anyoneHadTrackedRange: f
      };
    };

    b.prototype._getLooserCursorMap = function(a) {
      a = a.slice(0);

      a.sort(function(a, b) {
        return -o.RangeUtils.compareRangesUsingEnds(a.range, b.range);
      });
      var b = {};

      var c;

      var d;

      var e;
      for (var f = 1; f < a.length; f++) {
        c = a[f - 1];

        d = a[f];
        if (c.range.getStartPosition().isBeforeOrEqual(d.range.getEndPosition())) {
          if (c.identifier.major > d.identifier.major) {
            e = c.identifier.major;
          } else {
            e = d.identifier.major;
          }

          b[e.toString()] = !0;
          for (var g = 0; g < a.length; g++) {
            if (a[g].identifier.major === e) {
              a.splice(g, 1);
              if (g < f) {
                f--;
              }
              g--;
            }
          }
          if (f > 0) {
            f--;
          }
        }
      }
      return b;
    };

    b.prototype._internalExecuteCommands = function(a, b) {
      var c = {
        selectionStartMarkers: [],
        positionMarkers: []
      };

      var d = this._innerExecuteCommands(c, a, b);
      for (var e = 0; e < c.selectionStartMarkers.length; e++) {
        this.model._removeMarker(c.selectionStartMarkers[e]);
        this.model._removeMarker(c.positionMarkers[e]);
      }
      return d;
    };

    b.prototype._arrayIsEmpty = function(a) {
      var b;

      var c;
      for (b = 0, c = a.length; b < c; b++)
        if (a[b]) {
          return !1;
        }
      return !0;
    };

    b.prototype._innerExecuteCommands = function(a, b, c) {
      var d = this;
      if (this.configuration.editor.readOnly) {
        return !1;
      }
      if (this._arrayIsEmpty(b)) {
        return !1;
      }
      var e = this.cursors.getSelections();

      var f = this._getEditOperations(a, b);
      if (f.operations.length === 0 && !f.anyoneHadTrackedRange) {
        return !1;
      }
      var g = f.operations;

      var h = this.model.getEditableRange();

      var i = h.getStartPosition();

      var j = h.getEndPosition();
      for (var k = 0; k < g.length; k++) {
        var l = g[k].range;
        if (!i.isBeforeOrEqual(l.getStartPosition()) || !l.getEndPosition().isBeforeOrEqual(j)) {
          return !1;
        }
      }
      var m = this._getLooserCursorMap(g);
      if (m.hasOwnProperty("0")) {
        console.warn("Ignoring commands");
        return !1;
      }
      var n = [];
      for (var k = 0; k < g.length; k++) {
        if (!m.hasOwnProperty(g[k].identifier.major.toString())) {
          n.push(g[k]);
        }
      }
      var o = this.model.pushEditOperations(e, n, function(c) {
        var g = [];
        for (var h = 0; h < e.length; h++) {
          g[h] = [];
        }
        for (var h = 0; h < c.length; h++) {
          var i = c[h];
          g[i.identifier.major].push(i);
        }
        var j = function(a, b) {
          return a.identifier.minor - b.identifier.minor;
        };

        var k = [];
        for (var h = 0; h < e.length; h++) {
          if (g[h].length > 0 || f.hadTrackedRanges[h]) {
            g[h].sort(j);
            k[h] = b[h].computeCursorState(d.model, {
              getInverseEditOperations: function() {
                return g[h];
              },
              getTrackedSelection: function(b) {
                var c = parseInt(b, 10);

                var e = d.model._getMarker(a.selectionStartMarkers[c]);

                var f = d.model._getMarker(a.positionMarkers[c]);
                return new p.Selection(e.lineNumber, e.column, f.lineNumber, f.column);
              }
            });
          } else {
            k[h] = e[h];
          }
        }
        return k;
      });

      var q;

      var r = [];
      for (q in m) {
        if (m.hasOwnProperty(q)) {
          r.push(parseInt(q, 10));
        }
      }
      r.sort(function(a, b) {
        return b - a;
      });
      for (var k = 0; k < r.length; k++) {
        o.splice(r[k], 1);
        c.splice(r[k], 1);
      }
      return this._interpretCommandResult(o);
    };

    b.prototype.emitCursorPositionChanged = function(a, b) {
      var c = this.cursors.getPositions();

      var d = c[0];

      var e = c.slice(1);

      var f = this.cursors.getViewPositions();

      var g = f[0];

      var h = f.slice(1);

      var i = !0;
      if (this.model.hasEditableRange()) {
        var j = this.model.getEditableRange();
        if (!j.containsPosition(d)) {
          i = !1;
        }
      }
      var k = {
        position: d,
        viewPosition: g,
        secondaryPositions: e,
        secondaryViewPositions: h,
        reason: b,
        source: a,
        isInEditableRange: i
      };
      this.emit(n.EventType.CursorPositionChanged, k);
    };

    b.prototype.emitCursorSelectionChanged = function(a, b) {
      var c = this.cursors.getSelections();

      var d = c[0];

      var e = c.slice(1);

      var f = {
        selection: d,
        secondarySelections: e,
        source: a,
        reason: b
      };
      this.emit(n.EventType.CursorSelectionChanged, f);
    };

    b.prototype.emitCursorRevealRange = function(a, b) {
      var c = this.cursors.getPosition(0);

      var d = this.cursors.getViewPosition(0);

      var e = new o.Range(c.lineNumber, c.column, c.lineNumber, c.column);

      var f = new o.Range(d.lineNumber, d.column, d.lineNumber, d.column);

      var g = {
        range: e,
        viewRange: f,
        revealVerticalInCenter: a,
        revealHorizontal: b
      };
      this.emit(n.EventType.CursorRevealRange, g);
    };

    b.prototype._registerHandlers = function() {
      var a = this;

      var b = n.Handler;

      var c = {};
      c[b.JumpToBracket] = function(b) {
        return a._jumpToBracket(b);
      };

      c[b.MoveTo] = function(b) {
        return a._moveTo(!1, b);
      };

      c[b.MoveToSelect] = function(b) {
        return a._moveTo(!0, b);
      };

      c[b.AddCursorUp] = function(b) {
        return a._addCursorUp(b);
      };

      c[b.AddCursorDown] = function(b) {
        return a._addCursorDown(b);
      };

      c[b.CreateCursor] = function(b) {
        return a._createCursor(b);
      };

      c[b.LastCursorMoveToSelect] = function(b) {
        return a._lastCursorMoveTo(b);
      };

      c[b.CursorLeft] = function(b) {
        return a._moveLeft(!1, b);
      };

      c[b.CursorLeftSelect] = function(b) {
        return a._moveLeft(!0, b);
      };

      c[b.CursorWordLeft] = function(b) {
        return a._moveWordLeft(!1, b);
      };

      c[b.CursorWordLeftSelect] = function(b) {
        return a._moveWordLeft(!0, b);
      };

      c[b.CursorRight] = function(b) {
        return a._moveRight(!1, b);
      };

      c[b.CursorRightSelect] = function(b) {
        return a._moveRight(!0, b);
      };

      c[b.CursorWordRight] = function(b) {
        return a._moveWordRight(!1, b);
      };

      c[b.CursorWordRightSelect] = function(b) {
        return a._moveWordRight(!0, b);
      };

      c[b.CursorUp] = function(b) {
        return a._moveUp(!1, !1, b);
      };

      c[b.CursorUpSelect] = function(b) {
        return a._moveUp(!0, !1, b);
      };

      c[b.CursorDown] = function(b) {
        return a._moveDown(!1, !1, b);
      };

      c[b.CursorDownSelect] = function(b) {
        return a._moveDown(!0, !1, b);
      };

      c[b.CursorPageUp] = function(b) {
        return a._moveUp(!1, !0, b);
      };

      c[b.CursorPageUpSelect] = function(b) {
        return a._moveUp(!0, !0, b);
      };

      c[b.CursorPageDown] = function(b) {
        return a._moveDown(!1, !0, b);
      };

      c[b.CursorPageDownSelect] = function(b) {
        return a._moveDown(!0, !0, b);
      };

      c[b.CursorHome] = function(b) {
        return a._moveToBeginningOfLine(!1, b);
      };

      c[b.CursorHomeSelect] = function(b) {
        return a._moveToBeginningOfLine(!0, b);
      };

      c[b.CursorEnd] = function(b) {
        return a._moveToEndOfLine(!1, b);
      };

      c[b.CursorEndSelect] = function(b) {
        return a._moveToEndOfLine(!0, b);
      };

      c[b.CursorTop] = function(b) {
        return a._moveToBeginningOfBuffer(!1, b);
      };

      c[b.CursorTopSelect] = function(b) {
        return a._moveToBeginningOfBuffer(!0, b);
      };

      c[b.CursorBottom] = function(b) {
        return a._moveToEndOfBuffer(!1, b);
      };

      c[b.CursorBottomSelect] = function(b) {
        return a._moveToEndOfBuffer(!0, b);
      };

      c[b.SelectAll] = function(b) {
        return a._selectAll(b);
      };

      c[b.LineSelect] = function(b) {
        return a._line(!1, b);
      };

      c[b.LineSelectDrag] = function(b) {
        return a._line(!0, b);
      };

      c[b.LastCursorLineSelect] = function(b) {
        return a._lastCursorLine(!1, b);
      };

      c[b.LastCursorLineSelectDrag] = function(b) {
        return a._lastCursorLine(!0, b);
      };

      c[b.LineInsertBefore] = function(b) {
        return a._lineInsertBefore(b);
      };

      c[b.LineInsertAfter] = function(b) {
        return a._lineInsertAfter(b);
      };

      c[b.LineBreakInsert] = function(b) {
        return a._lineBreakInsert(b);
      };

      c[b.WordSelect] = function(b) {
        return a._word(!1, b);
      };

      c[b.WordSelectDrag] = function(b) {
        return a._word(!0, b);
      };

      c[b.LastCursorWordSelect] = function(b) {
        return a._lastCursorWord(b);
      };

      c[b.Escape] = function(b) {
        return a._cancelSelection(b);
      };

      c[b.Type] = function(b) {
        return a._type(b);
      };

      c[b.Tab] = function(b) {
        return a._tab(b);
      };

      c[b.Indent] = function(b) {
        return a._indent(b);
      };

      c[b.Outdent] = function(b) {
        return a._outdent(b);
      };

      c[b.Paste] = function(b) {
        return a._paste(b);
      };

      c[b.DeleteLeft] = function(b) {
        return a._deleteLeft(b);
      };

      c[b.DeleteWordLeft] = function(b) {
        return a._deleteWordLeft(b);
      };

      c[b.DeleteRight] = function(b) {
        return a._deleteRight(b);
      };

      c[b.DeleteWordRight] = function(b) {
        return a._deleteWordRight(b);
      };

      c[b.DeleteAllLeft] = function(b) {
        return a._deleteAllLeft(b);
      };

      c[b.DeleteAllRight] = function(b) {
        return a._deleteAllRight(b);
      };

      c[b.Cut] = function(b) {
        return a._cut(b);
      };

      c[b.Undo] = function(b) {
        return a._undo(b);
      };

      c[b.Redo] = function(b) {
        return a._redo(b);
      };

      c[b.ExecuteCommand] = function(b) {
        return a._externalExecuteCommand(b);
      };

      c[b.ExecuteCommands] = function(b) {
        return a._externalExecuteCommands(b);
      };
      var d = function(b, c) {
        return function(d) {
          return a._onHandler(b, c, d);
        };
      };

      var e;
      for (e in c) {
        if (c.hasOwnProperty(e)) {
          this.configuration.handlerDispatcher.setHandler(e, d(e, c[e]));
        }
      }
    };

    b.prototype._invokeForAll = function(a, b, c, d) {
      if (typeof c == "undefined") {
        c = !0;
      }

      if (typeof d == "undefined") {
        d = !0;
      }
      var e = !1;

      var f = this.cursors.getAll();

      var g;
      a.shouldPushStackElementBefore = c;

      a.shouldPushStackElementAfter = d;
      for (var h = 0; h < f.length; h++) {
        g = {
          cursorPositionChangeReason: "",
          cursorPositionChangeSource: "",
          shouldReveal: !0,
          shouldRevealVerticalInCenter: !1,
          shouldRevealHorizontal: !0,
          executeCommand: null,
          postOperationRunnable: null,
          shouldPushStackElementBefore: !1,
          shouldPushStackElementAfter: !1
        };
        e = b(h, f[h], g) || e;
        if (h === 0) {
          a.cursorPositionChangeReason = g.cursorPositionChangeReason;
          a.shouldRevealHorizontal = g.shouldRevealHorizontal;
          a.shouldReveal = g.shouldReveal;
          a.shouldRevealVerticalInCenter = g.shouldRevealVerticalInCenter;
        }
        a.shouldPushStackElementBefore = a.shouldPushStackElementBefore || g.shouldPushStackElementBefore;
        a.shouldPushStackElementAfter = a.shouldPushStackElementAfter || g.shouldPushStackElementAfter;
        a.executeCommands[h] = g.executeCommand;
        a.postOperationRunnables[h] = g.postOperationRunnable;
      }
      return e;
    };

    b.prototype._jumpToBracket = function(a) {
      this.cursors.killSecondaryCursors();

      return this._invokeForAll(a, function(a, b, c) {
        return b.jumpToBracket(c);
      });
    };

    b.prototype._moveTo = function(a, b) {
      this.cursors.killSecondaryCursors();

      return this._invokeForAll(b, function(c, d, e) {
        return d.moveTo(a, b.eventData.position, b.eventData.viewPosition, b.eventSource, e);
      });
    };

    b.prototype._createCursor = function(a) {
      if (this.configuration.editor.readOnly || this.model.hasEditableRange()) {
        return !1;
      }
      this.cursors.addSecondaryCursor({
        selectionStartLineNumber: 1,
        selectionStartColumn: 1,
        positionLineNumber: 1,
        positionColumn: 1
      });
      var b = this.cursors.getLastAddedCursor();
      this._invokeForAll(a, function(c, d, e) {
        return d === b ? a.eventData.wholeLine ? d.line(!1, a.eventData.position, a.eventData.viewPosition, e) : d.moveTo(!
          1, a.eventData.position, a.eventData.viewPosition, a.eventSource, e) : !1;
      });

      a.shouldReveal = !1;

      a.shouldRevealHorizontal = !1;

      return !0;
    };

    b.prototype._lastCursorMoveTo = function(a) {
      if (this.configuration.editor.readOnly || this.model.hasEditableRange()) {
        return !1;
      }
      var b = this.cursors.getLastAddedCursor();
      this._invokeForAll(a, function(c, d, e) {
        return d === b ? d.moveTo(!0, a.eventData.position, a.eventData.viewPosition, a.eventSource, e) : !1;
      });

      a.shouldReveal = !1;

      a.shouldRevealHorizontal = !1;

      return !0;
    };

    b.prototype._addCursorUp = function(a) {
      if (this.configuration.editor.readOnly) {
        return !1;
      }
      var b = this.cursors.getSelections();

      var c = b.length;
      for (var d = 0; d < c; d++) {
        this.cursors.addSecondaryCursor(b[d]);
      }
      return this._invokeForAll(a, function(a, b, d) {
        return a >= c ? b.moveUp(!1, !1, d) : !1;
      });
    };

    b.prototype._addCursorDown = function(a) {
      if (this.configuration.editor.readOnly) {
        return !1;
      }
      var b = this.cursors.getSelections();

      var c = b.length;
      for (var d = 0; d < c; d++) {
        this.cursors.addSecondaryCursor(b[d]);
      }
      return this._invokeForAll(a, function(a, b, d) {
        return a >= c ? b.moveDown(!1, !1, d) : !1;
      });
    };

    b.prototype._moveLeft = function(a, b) {
      return this._invokeForAll(b, function(b, c, d) {
        return c.moveLeft(a, d);
      });
    };

    b.prototype._moveWordLeft = function(a, b) {
      return this._invokeForAll(b, function(b, c, d) {
        return c.moveWordLeft(a, d);
      });
    };

    b.prototype._moveRight = function(a, b) {
      return this._invokeForAll(b, function(b, c, d) {
        return c.moveRight(a, d);
      });
    };

    b.prototype._moveWordRight = function(a, b) {
      return this._invokeForAll(b, function(b, c, d) {
        return c.moveWordRight(a, d);
      });
    };

    b.prototype._moveDown = function(a, b, c) {
      return this._invokeForAll(c, function(c, d, e) {
        return d.moveDown(a, b, e);
      });
    };

    b.prototype._moveUp = function(a, b, c) {
      return this._invokeForAll(c, function(c, d, e) {
        return d.moveUp(a, b, e);
      });
    };

    b.prototype._moveToBeginningOfLine = function(a, b) {
      return this._invokeForAll(b, function(b, c, d) {
        return c.moveToBeginningOfLine(a, d);
      });
    };

    b.prototype._moveToEndOfLine = function(a, b) {
      return this._invokeForAll(b, function(b, c, d) {
        return c.moveToEndOfLine(a, d);
      });
    };

    b.prototype._moveToBeginningOfBuffer = function(a, b) {
      return this._invokeForAll(b, function(b, c, d) {
        return c.moveToBeginningOfBuffer(a, d);
      });
    };

    b.prototype._moveToEndOfBuffer = function(a, b) {
      return this._invokeForAll(b, function(b, c, d) {
        return c.moveToEndOfBuffer(a, d);
      });
    };

    b.prototype._selectAll = function(a) {
      this.cursors.killSecondaryCursors();

      return this._invokeForAll(a, function(a, b, c) {
        return b.selectAll(c);
      });
    };

    b.prototype._line = function(a, b) {
      this.cursors.killSecondaryCursors();

      return this._invokeForAll(b, function(c, d, e) {
        return d.line(a, b.eventData.position, b.eventData.viewPosition, e);
      });
    };

    b.prototype._lastCursorLine = function(a, b) {
      if (this.configuration.editor.readOnly || this.model.hasEditableRange()) {
        return !1;
      }
      var c = this.cursors.getLastAddedCursor();
      this._invokeForAll(b, function(d, e, f) {
        return e === c ? e.line(a, b.eventData.position, b.eventData.viewPosition, f) : !1;
      });

      b.shouldReveal = !1;

      b.shouldRevealHorizontal = !1;

      return !0;
    };

    b.prototype._lineInsertBefore = function(a) {
      return this._invokeForAll(a, function(a, b, c) {
        return b.lineInsertBefore(c);
      });
    };

    b.prototype._lineInsertAfter = function(a) {
      return this._invokeForAll(a, function(a, b, c) {
        return b.lineInsertAfter(c);
      });
    };

    b.prototype._lineBreakInsert = function(a) {
      return this._invokeForAll(a, function(a, b, c) {
        return b.lineBreakInsert(c);
      });
    };

    b.prototype._word = function(a, b) {
      this.cursors.killSecondaryCursors();

      return this._invokeForAll(b, function(c, d, e) {
        return d.word(a, b.eventData.position, b.eventData.preference || "none", e);
      });
    };

    b.prototype._lastCursorWord = function(a) {
      if (this.configuration.editor.readOnly || this.model.hasEditableRange()) {
        return !1;
      }
      var b = this.cursors.getLastAddedCursor();
      this._invokeForAll(a, function(c, d, e) {
        return d === b ? d.word(!0, a.eventData.position, a.eventData.preference || "none", e) : !1;
      });

      a.shouldReveal = !1;

      a.shouldRevealHorizontal = !1;

      return !0;
    };

    b.prototype._cancelSelection = function(a) {
      return this.cursors.killSecondaryCursors() ? !0 : this._invokeForAll(a, function(a, b, c) {
        return b.cancelSelection(c);
      });
    };

    b.prototype._type = function(a) {
      var b = this;

      var c = a.eventData.text;
      if (a.eventSource === "keyboard") {
        var d;

        var e;

        var f;

        var g;

        var h;
        for (d = 0, f = c.length; d < f; d++) {
          h = c.charAt(d);
          this.charactersTyped += h;
          this._createAndInterpretHandlerCtx(a.eventSource, a.eventData, function(c) {
            b._invokeForAll(c, function(a, b, c) {
              return b.type(h, c);
            }, !1, !1);

            a.cursorPositionChangeReason = c.cursorPositionChangeReason;

            a.shouldReveal = c.shouldReveal;

            a.shouldRevealVerticalInCenter = c.shouldRevealVerticalInCenter;

            a.shouldRevealHorizontal = c.shouldRevealHorizontal;
          });
        }
      } else {
        this._invokeForAll(a, function(a, b, d) {
          return b.actualType(c, !1, d);
        });
      }
      return !0;
    };

    b.prototype._tab = function(a) {
      return this._invokeForAll(a, function(a, b, c) {
        return b.tab(c);
      }, !1, !1);
    };

    b.prototype._indent = function(a) {
      return this._invokeForAll(a, function(a, b, c) {
        return b.indent(c);
      });
    };

    b.prototype._outdent = function(a) {
      return this._invokeForAll(a, function(a, b, c) {
        return b.outdent(c);
      });
    };

    b.prototype._paste = function(a) {
      return this._invokeForAll(a, function(b, c, d) {
        return c.paste(a.eventData.text, a.eventData.sameSource, d);
      });
    };

    b.prototype._deleteLeft = function(a) {
      return this._invokeForAll(a, function(a, b, c) {
        return b.deleteLeft(c);
      }, !1, !1);
    };

    b.prototype._deleteWordLeft = function(a) {
      return this._invokeForAll(a, function(a, b, c) {
        return b.deleteWordLeft(c);
      }, !1, !1);
    };

    b.prototype._deleteRight = function(a) {
      return this._invokeForAll(a, function(a, b, c) {
        return b.deleteRight(c);
      }, !1, !1);
    };

    b.prototype._deleteWordRight = function(a) {
      return this._invokeForAll(a, function(a, b, c) {
        return b.deleteWordRight(c);
      }, !1, !1);
    };

    b.prototype._deleteAllLeft = function(a) {
      return this._invokeForAll(a, function(a, b, c) {
        return b.deleteAllLeft(c);
      }, !1, !1);
    };

    b.prototype._deleteAllRight = function(a) {
      return this._invokeForAll(a, function(a, b, c) {
        return b.deleteAllRight(c);
      }, !1, !1);
    };

    b.prototype._cut = function(a) {
      return this._invokeForAll(a, function(a, b, c) {
        return b.cut(c);
      });
    };

    b.prototype._undo = function(a) {
      a.cursorPositionChangeReason = "undo";

      this._interpretCommandResult(this.model.undo());

      return !0;
    };

    b.prototype._redo = function(a) {
      a.cursorPositionChangeReason = "redo";

      this._interpretCommandResult(this.model.redo());

      return !0;
    };

    b.prototype._externalExecuteCommand = function(a) {
      this.cursors.killSecondaryCursors();

      return this._invokeForAll(a, function(b, c, d) {
        d.shouldPushStackElementBefore = !0;

        d.shouldPushStackElementAfter = !0;

        d.executeCommand = a.eventData;

        return !1;
      });
    };

    b.prototype._externalExecuteCommands = function(a) {
      return this._invokeForAll(a, function(b, c, d) {
        d.shouldPushStackElementBefore = !0;

        d.shouldPushStackElementAfter = !0;

        d.executeCommand = a.eventData[b];

        return !1;
      });
    };

    return b;
  }(q.EventEmitter);
  b.Cursor = w;
});