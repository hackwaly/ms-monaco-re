define("vs/editor/core/controller/cursor", ["require", "exports", "vs/nls!vs/editor/editor.main",
  "vs/editor/core/internalConstants", "vs/editor/core/constants", "vs/editor/core/range", "vs/editor/core/selection",
  "vs/base/eventEmitter", "vs/editor/core/handlerDispatcher", "vs/editor/editor",
  "vs/editor/core/controller/cursorCollection", "vs/base/errors", "vs/editor/core/position"
], function(e, t, n, i, o, r, s, a, u, l, c, d, h) {
  var p = function(e) {
    function t(t, n, i, r, s) {
      var a = this;
      e.call(this, [o.EventType.CursorPositionChanged, o.EventType.CursorSelectionChanged, o.EventType.CursorRevealRange]);

      this.editorId = t;

      this.configuration = n;

      this.model = i;

      this.renderOnce = r;

      this.viewModelHelper = s;

      if (!this.viewModelHelper) {
        this.viewModelHelper = {
          viewModel: this.model,
          convertModelPositionToViewPosition: function(e, t) {
            return new h.Position(e, t);
          },
          convertViewToModelPosition: function(e, t) {
            return new h.Position(e, t);
          },
          validateViewPosition: function(e, t, n) {
            return n;
          }
        };
      }

      this.cursors = new c.CursorCollection(this.editorId, this.model, this.configuration, this.viewModelHelper);

      this.typingListeners = {};

      this._isHandling = !1;

      this.modelUnbind = this.model.addListener(o.EventType.ModelContentChanged, function(e) {
        a._onModelContentChanged(e);
      });

      this._registerHandlers();
    }
    __extends(t, e);

    t.prototype.dispose = function() {
      this.modelUnbind();

      this.modelUnbind = null;

      this.model = null;

      this.cursors.dispose();

      this.cursors = null;

      this.configuration.handlerDispatcher.clearHandlers();

      this.configuration = null;

      this.renderOnce = null;

      this.viewModelHelper = null;

      e.prototype.dispose.call(this);
    };

    t.prototype.saveState = function() {
      for (var e, t = this.cursors.getSelections(), n = [], i = 0; i < t.length; i++) {
        e = t[i];
        n.push({
          inSelectionMode: !e.isEmpty(),
          selectionStart: {
            lineNumber: e.selectionStartLineNumber,
            column: e.selectionStartColumn
          },
          position: {
            lineNumber: e.positionLineNumber,
            column: e.positionColumn
          }
        });
      }
      return n;
    };

    t.prototype.restoreState = function(e) {
      for (var t, n = this, i = [], o = 0; o < e.length; o++) {
        t = e[o];
        var r = 1;

        var s = 1;
        if (t.position && t.position.lineNumber) {
          r = t.position.lineNumber;
        }

        if (t.position && t.position.column) {
          s = t.position.column;
        }
        var a = r;

        var l = s;
        if (t.selectionStart && t.selectionStart.lineNumber) {
          a = t.selectionStart.lineNumber;
        }

        if (t.selectionStart && t.selectionStart.column) {
          l = t.selectionStart.column;
        }

        i.push({
          selectionStartLineNumber: a,
          selectionStartColumn: l,
          positionLineNumber: r,
          positionColumn: s
        });
      }
      this._onHandler("restoreState", function() {
        n.cursors.setSelections(i);

        return !1;
      }, new u.DispatcherEvent("restoreState", null));
    };

    t.prototype.setEditableRange = function(e) {
      this.model.setEditableRange(e);
    };

    t.prototype.getEditableRange = function() {
      return this.model.getEditableRange();
    };

    t.prototype.addTypingListener = function(e, t) {
      if (!this.typingListeners.hasOwnProperty(e)) {
        this.typingListeners[e] = [];
      }

      this.typingListeners[e].push(t);
    };

    t.prototype.removeTypingListener = function(e, t) {
      if (this.typingListeners.hasOwnProperty(e))
        for (var n = this.typingListeners[e], i = 0; i < n.length; i++)
          if (n[i] === t) {
            n.splice(i, 1);
            return void 0;
          }
    };

    t.prototype._onModelContentChanged = function(e) {
      var t = this;
      if (e.changeType === o.EventType.ModelContentChangedFlush) {
        this.cursors.dispose();
        this.cursors = new c.CursorCollection(this.editorId, this.model, this.configuration, this.viewModelHelper);
        this.emitCursorPositionChanged("", "");
        this.emitCursorSelectionChanged("", "");
        this.emitCursorRevealRange(!1, !0);
      } else {
        if (!this._isHandling) {
          this._onHandler("recoverSelectionFromMarkers", function(e) {
            var n = t._invokeForAll(e, function(e, t, n) {
              return t.recoverSelectionFromMarkers(n);
            });
            e.shouldPushStackElementBefore = !1;

            e.shouldPushStackElementAfter = !1;

            return n;
          }, new u.DispatcherEvent("modelChange", null));
        }
      }
    };

    t.prototype.getSelection = function() {
      return this.cursors.getSelection(0);
    };

    t.prototype.getSelections = function() {
      return this.cursors.getSelections();
    };

    t.prototype.getPosition = function() {
      return this.cursors.getPosition(0);
    };

    t.prototype.setSelections = function(e, t) {
      var n = this;
      this._onHandler("setSelections", function(e) {
        e.shouldReveal = !1;

        n.cursors.setSelections(t);

        return !1;
      }, new u.DispatcherEvent(e, null));
    };

    t.prototype._createAndInterpretHandlerCtx = function(e, t, n) {
      var i = {
        cursorPositionChangeReason: "",
        shouldReveal: !0,
        shouldRevealVerticalInCenter: !1,
        shouldRevealHorizontal: !0,
        eventSource: e,
        eventData: t,
        executeCommands: [],
        postOperationRunnables: [],
        shouldPushStackElementBefore: !1,
        shouldPushStackElementAfter: !1
      };
      n(i);

      this._interpretHandlerContext(i);

      this.cursors.normalize();
    };

    t.prototype._onHandler = function(e, t, n) {
      var i = this;
      if (this._isHandling) throw new Error("Why am I recursive?");
      this._isHandling = !0;

      this.charactersTyped = "";
      var o = !1;
      try {
        this.renderOnce(function() {
          var e;

          var r;

          var s;

          var a;

          var u = i.cursors.getSelections();

          var l = i.cursors.getViewSelections();

          var c = n.getSource();
          i._createAndInterpretHandlerCtx(c, n.getData(), function(n) {
            o = t(n);

            e = n.cursorPositionChangeReason;

            r = n.shouldReveal;

            s = n.shouldRevealVerticalInCenter;

            a = n.shouldRevealHorizontal;
          });
          for (var d = 0; d < i.charactersTyped.length; d++) {
            var h = i.charactersTyped.charAt(d);
            if (i.typingListeners.hasOwnProperty(h))
              for (var p = i.typingListeners[h].slice(0), f = 0, g = p.length; g > f; f++) {
                p[f]();
              }
          }
          var m = i.cursors.getSelections();

          var v = i.cursors.getViewSelections();

          var y = !1;
          if (u.length !== m.length) {
            y = !0;
          } else {
            for (var d = 0, _ = u.length; !y && _ > d; d++) {
              if (!u[d].equalsSelection(m[d])) {
                y = !0;
              }
            }
            for (var d = 0, _ = l.length; !y && _ > d; d++) {
              if (!l[d].equalsSelection(v[d])) {
                y = !0;
              }
            }
          }
          if (y) {
            i.emitCursorPositionChanged(c, e);
            if (r) {
              i.emitCursorRevealRange(s, a);
            }
            i.emitCursorSelectionChanged(c, e);
          }
        });
      } catch (r) {
        d.onUnexpectedError(r);
      }
      this._isHandling = !1;

      return o;
    };

    t.prototype._interpretHandlerContext = function(e) {
      if (e.shouldPushStackElementBefore) {
        this.model.pushStackElement();
        e.shouldPushStackElementBefore = !1;
      }

      this._internalExecuteCommands(e.executeCommands, e.postOperationRunnables);

      e.executeCommands = [];

      if (e.shouldPushStackElementAfter) {
        this.model.pushStackElement();
        e.shouldPushStackElementAfter = !1;
      }
      for (var t = !1, n = 0, i = e.postOperationRunnables.length; i > n; n++)
        if (e.postOperationRunnables[n]) {
          t = !0;
          break;
        }
      if (t) {
        var o = e.postOperationRunnables.slice(0);
        e.postOperationRunnables = [];

        this._invokeForAll(e, function(e, t, n) {
          o[e] && o[e](n);

          return !1;
        });

        this._interpretHandlerContext(e);
      }
    };

    t.prototype._interpretCommandResult = function(e) {
      return e ? (this.cursors.setSelections(e), !0) : !1;
    };

    t.prototype._getEditOperationsFromCommand = function(e, t, i) {
      var o = this;

      var r = [];

      var s = 0;

      var a = function(e, n) {
        r.push({
          identifier: {
            major: t,
            minor: s++
          },
          range: e,
          text: n
        });
      };

      var u = !1;

      var l = function(t) {
        var n;

        var i;
        if (t.isEmpty()) {
          var r = o.model.getLineMaxColumn(t.startLineNumber);
          if (t.startColumn === r) {
            n = !0;
            i = !0;
          } else {
            n = !1;
            i = !1;
          }
        } else {
          if (0 === t.getDirection()) {
            n = !1;
            i = !0;
          } else {
            n = !0;
            i = !1;
          }
        }
        var s = e.selectionStartMarkers.length;
        e.selectionStartMarkers[s] = o.model._addMarker(t.selectionStartLineNumber, t.selectionStartColumn, n);

        e.positionMarkers[s] = o.model._addMarker(t.positionLineNumber, t.positionColumn, i);

        return s.toString();
      };

      var c = {
        addEditOperation: a,
        trackSelection: l
      };
      try {
        i.getEditOperations(this.model, c);
      } catch (h) {
        d.onUnexpectedError(h, n.localize("vs_editor_core_controller_cursor", 0));

        return {
          operations: [],
          hadTrackedRange: !1
        };
      }
      return {
        operations: r,
        hadTrackedRange: u
      };
    };

    t.prototype._getEditOperations = function(e, t) {
      for (var n, i, o = [], r = [], s = 0; s < t.length; s++) {
        if (t[s]) {
          n = this._getEditOperationsFromCommand(e, s, t[s]);
          o = o.concat(n.operations);
          r[s] = n.hadTrackedRange;
          i = i || r[s];
        } else {
          r[s] = !1;
        }
      }
      return {
        operations: o,
        hadTrackedRanges: r,
        anyoneHadTrackedRange: i
      };
    };

    t.prototype._getLoserCursorMap = function(e) {
      e = e.slice(0);

      e.sort(function(e, t) {
        return -r.compareRangesUsingEnds(e.range, t.range);
      });
      for (var t, n, i, o = {}, s = 1; s < e.length; s++)
        if (t = e[s - 1], n = e[s], t.range.getStartPosition().isBeforeOrEqual(n.range.getEndPosition())) {
          i = t.identifier.major > n.identifier.major ? t.identifier.major : n.identifier.major;

          o[i.toString()] = !0;
          for (var a = 0; a < e.length; a++) {
            if (e[a].identifier.major === i) {
              e.splice(a, 1);
              if (s > a) {
                s--;
              }
              a--;
            }
          }
          if (s > 0) {
            s--;
          }
        }
      return o;
    };

    t.prototype._internalExecuteCommands = function(e, t) {
      for (var n = {
        selectionStartMarkers: [],
        positionMarkers: []
      }, i = this._innerExecuteCommands(n, e, t), o = 0; o < n.selectionStartMarkers.length; o++) {
        this.model._removeMarker(n.selectionStartMarkers[o]);
        this.model._removeMarker(n.positionMarkers[o]);
      }
      return i;
    };

    t.prototype._arrayIsEmpty = function(e) {
      var t;

      var n;
      for (t = 0, n = e.length; n > t; t++)
        if (e[t]) {
          return !1;
        }
      return !0;
    };

    t.prototype._innerExecuteCommands = function(e, t, n) {
      var i = this;
      if (this.configuration.editor.readOnly) {
        return !1;
      }
      if (this._arrayIsEmpty(t)) {
        return !1;
      }
      var o = this.cursors.getSelections();

      var r = this._getEditOperations(e, t);
      if (0 === r.operations.length && !r.anyoneHadTrackedRange) {
        return !1;
      }
      for (var a = r.operations, u = this.model.getEditableRange(), l = u.getStartPosition(), c = u.getEndPosition(),
          d = 0; d < a.length; d++) {
        var h = a[d].range;
        if (!l.isBeforeOrEqual(h.getStartPosition()) || !h.getEndPosition().isBeforeOrEqual(c)) {
          return !1;
        }
      }
      var p = this._getLoserCursorMap(a);
      if (p.hasOwnProperty("0")) {
        console.warn("Ignoring commands");
        return !1;
      }
      for (var f = [], d = 0; d < a.length; d++) {
        if (!p.hasOwnProperty(a[d].identifier.major.toString())) {
          f.push(a[d]);
        }
      }
      var g;

      var m = this.model.pushEditOperations(o, f, function(n) {
        for (var a = [], u = 0; u < o.length; u++) {
          a[u] = [];
        }
        for (var u = 0; u < n.length; u++) {
          var l = n[u];
          a[l.identifier.major].push(l);
        }
        for (var c = function(e, t) {
          return e.identifier.minor - t.identifier.minor;
        }, d = [], u = 0; u < o.length; u++) {
          if (a[u].length > 0 || r.hadTrackedRanges[u]) {
            a[u].sort(c);
            d[u] = t[u].computeCursorState(i.model, {
              getInverseEditOperations: function() {
                return a[u];
              },
              getTrackedSelection: function(t) {
                var n = parseInt(t, 10);

                var o = i.model._getMarker(e.selectionStartMarkers[n]);

                var r = i.model._getMarker(e.positionMarkers[n]);
                return new s.Selection(o.lineNumber, o.column, r.lineNumber, r.column);
              }
            });
          } else {
            d[u] = o[u];
          }
        }
        return d;
      });

      var v = [];
      for (g in p) {
        if (p.hasOwnProperty(g)) {
          v.push(parseInt(g, 10));
        }
      }
      v.sort(function(e, t) {
        return t - e;
      });
      for (var d = 0; d < v.length; d++) {
        m.splice(v[d], 1);
        n.splice(v[d], 1);
      }
      return this._interpretCommandResult(m);
    };

    t.prototype.emitCursorPositionChanged = function(e, t) {
      var n = this.cursors.getPositions();

      var i = n[0];

      var r = n.slice(1);

      var s = this.cursors.getViewPositions();

      var a = s[0];

      var u = s.slice(1);

      var l = !0;
      if (this.model.hasEditableRange()) {
        var c = this.model.getEditableRange();
        if (!c.containsPosition(i)) {
          l = !1;
        }
      }
      var d = {
        position: i,
        viewPosition: a,
        secondaryPositions: r,
        secondaryViewPositions: u,
        reason: t,
        source: e,
        isInEditableRange: l
      };
      this.emit(o.EventType.CursorPositionChanged, d);
    };

    t.prototype.emitCursorSelectionChanged = function(e, t) {
      var n = this.cursors.getSelections();

      var i = n[0];

      var r = n.slice(1);

      var s = {
        selection: i,
        secondarySelections: r,
        source: e,
        reason: t
      };
      this.emit(o.EventType.CursorSelectionChanged, s);
    };

    t.prototype.emitCursorRevealRange = function(e, t) {
      var n = this.cursors.getPosition(0);

      var i = this.cursors.getViewPosition(0);

      var s = new r.Range(n.lineNumber, n.column, n.lineNumber, n.column);

      var a = new r.Range(i.lineNumber, i.column, i.lineNumber, i.column);

      var u = {
        range: s,
        viewRange: a,
        revealVerticalInCenter: e,
        revealHorizontal: t
      };
      this.emit(o.EventType.CursorRevealRange, u);
    };

    t.prototype._registerHandlers = function() {
      var e = this;

      var t = i.Handler;

      var n = {};
      n[t.JumpToBracket] = function(t) {
        return e._jumpToBracket(t);
      };

      n[t.MoveTo] = function(t) {
        return e._moveTo(!1, t);
      };

      n[t.MoveToSelect] = function(t) {
        return e._moveTo(!0, t);
      };

      n[t.AddCursorUp] = function(t) {
        return e._addCursorUp(t);
      };

      n[t.AddCursorDown] = function(t) {
        return e._addCursorDown(t);
      };

      n[t.CreateCursor] = function(t) {
        return e._createCursor(t);
      };

      n[t.LastCursorMoveToSelect] = function(t) {
        return e._lastCursorMoveTo(t);
      };

      n[t.CursorLeft] = function(t) {
        return e._moveLeft(!1, t);
      };

      n[t.CursorLeftSelect] = function(t) {
        return e._moveLeft(!0, t);
      };

      n[t.CursorWordLeft] = function(t) {
        return e._moveWordLeft(!1, t);
      };

      n[t.CursorWordLeftSelect] = function(t) {
        return e._moveWordLeft(!0, t);
      };

      n[t.CursorRight] = function(t) {
        return e._moveRight(!1, t);
      };

      n[t.CursorRightSelect] = function(t) {
        return e._moveRight(!0, t);
      };

      n[t.CursorWordRight] = function(t) {
        return e._moveWordRight(!1, t);
      };

      n[t.CursorWordRightSelect] = function(t) {
        return e._moveWordRight(!0, t);
      };

      n[t.CursorUp] = function(t) {
        return e._moveUp(!1, !1, t);
      };

      n[t.CursorUpSelect] = function(t) {
        return e._moveUp(!0, !1, t);
      };

      n[t.CursorDown] = function(t) {
        return e._moveDown(!1, !1, t);
      };

      n[t.CursorDownSelect] = function(t) {
        return e._moveDown(!0, !1, t);
      };

      n[t.CursorPageUp] = function(t) {
        return e._moveUp(!1, !0, t);
      };

      n[t.CursorPageUpSelect] = function(t) {
        return e._moveUp(!0, !0, t);
      };

      n[t.CursorPageDown] = function(t) {
        return e._moveDown(!1, !0, t);
      };

      n[t.CursorPageDownSelect] = function(t) {
        return e._moveDown(!0, !0, t);
      };

      n[t.CursorHome] = function(t) {
        return e._moveToBeginningOfLine(!1, t);
      };

      n[t.CursorHomeSelect] = function(t) {
        return e._moveToBeginningOfLine(!0, t);
      };

      n[t.CursorEnd] = function(t) {
        return e._moveToEndOfLine(!1, t);
      };

      n[t.CursorEndSelect] = function(t) {
        return e._moveToEndOfLine(!0, t);
      };

      n[t.CursorTop] = function(t) {
        return e._moveToBeginningOfBuffer(!1, t);
      };

      n[t.CursorTopSelect] = function(t) {
        return e._moveToBeginningOfBuffer(!0, t);
      };

      n[t.CursorBottom] = function(t) {
        return e._moveToEndOfBuffer(!1, t);
      };

      n[t.CursorBottomSelect] = function(t) {
        return e._moveToEndOfBuffer(!0, t);
      };

      n[t.SelectAll] = function(t) {
        return e._selectAll(t);
      };

      n[t.LineSelect] = function(t) {
        return e._line(!1, t);
      };

      n[t.LineSelectDrag] = function(t) {
        return e._line(!0, t);
      };

      n[t.LastCursorLineSelect] = function(t) {
        return e._lastCursorLine(!1, t);
      };

      n[t.LastCursorLineSelectDrag] = function(t) {
        return e._lastCursorLine(!0, t);
      };

      n[t.LineInsertBefore] = function(t) {
        return e._lineInsertBefore(t);
      };

      n[t.LineInsertAfter] = function(t) {
        return e._lineInsertAfter(t);
      };

      n[t.LineBreakInsert] = function(t) {
        return e._lineBreakInsert(t);
      };

      n[t.WordSelect] = function(t) {
        return e._word(!1, t);
      };

      n[t.WordSelectDrag] = function(t) {
        return e._word(!0, t);
      };

      n[t.LastCursorWordSelect] = function(t) {
        return e._lastCursorWord(t);
      };

      n[t.Escape] = function(t) {
        return e._cancelSelection(t);
      };

      n[t.Type] = function(t) {
        return e._type(t);
      };

      n[t.Tab] = function(t) {
        return e._tab(t);
      };

      n[t.Indent] = function(t) {
        return e._indent(t);
      };

      n[t.Outdent] = function(t) {
        return e._outdent(t);
      };

      n[t.Paste] = function(t) {
        return e._paste(t);
      };

      n[t.DeleteLeft] = function(t) {
        return e._deleteLeft(t);
      };

      n[t.DeleteWordLeft] = function(t) {
        return e._deleteWordLeft(t);
      };

      n[t.DeleteRight] = function(t) {
        return e._deleteRight(t);
      };

      n[t.DeleteWordRight] = function(t) {
        return e._deleteWordRight(t);
      };

      n[t.DeleteAllLeft] = function(t) {
        return e._deleteAllLeft(t);
      };

      n[t.DeleteAllRight] = function(t) {
        return e._deleteAllRight(t);
      };

      n[t.Cut] = function(t) {
        return e._cut(t);
      };

      n[t.Undo] = function(t) {
        return e._undo(t);
      };

      n[t.Redo] = function(t) {
        return e._redo(t);
      };

      n[t.ExecuteCommand] = function(t) {
        return e._externalExecuteCommand(t);
      };

      n[t.ExecuteCommands] = function(t) {
        return e._externalExecuteCommands(t);
      };
      var o;

      var r = function(t, n) {
        return function(i) {
          return e._onHandler(t, n, i);
        };
      };
      for (o in n) {
        if (n.hasOwnProperty(o)) {
          this.configuration.handlerDispatcher.setHandler(o, r(o, n[o]));
        }
      }
    };

    t.prototype._invokeForAll = function(e, t, n, i) {
      if ("undefined" == typeof n) {
        n = !0;
      }

      if ("undefined" == typeof i) {
        i = !0;
      }
      var o;

      var r = !1;

      var s = this.cursors.getAll();
      e.shouldPushStackElementBefore = n;

      e.shouldPushStackElementAfter = i;
      for (var a = 0; a < s.length; a++) {
        o = {
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
        r = t(a, s[a], o) || r;
        if (0 === a) {
          e.cursorPositionChangeReason = o.cursorPositionChangeReason;
          e.shouldRevealHorizontal = o.shouldRevealHorizontal;
          e.shouldReveal = o.shouldReveal;
          e.shouldRevealVerticalInCenter = o.shouldRevealVerticalInCenter;
        }
        e.shouldPushStackElementBefore = e.shouldPushStackElementBefore || o.shouldPushStackElementBefore;
        e.shouldPushStackElementAfter = e.shouldPushStackElementAfter || o.shouldPushStackElementAfter;
        e.executeCommands[a] = o.executeCommand;
        e.postOperationRunnables[a] = o.postOperationRunnable;
      }
      return r;
    };

    t.prototype._jumpToBracket = function(e) {
      this.cursors.killSecondaryCursors();

      return this._invokeForAll(e, function(e, t, n) {
        return t.jumpToBracket(n);
      });
    };

    t.prototype._moveTo = function(e, t) {
      this.cursors.killSecondaryCursors();

      return this._invokeForAll(t, function(n, i, o) {
        return i.moveTo(e, t.eventData.position, t.eventData.viewPosition, t.eventSource, o);
      });
    };

    t.prototype._createCursor = function(e) {
      if (this.configuration.editor.readOnly || this.model.hasEditableRange()) {
        return !1;
      }
      this.cursors.addSecondaryCursor({
        selectionStartLineNumber: 1,
        selectionStartColumn: 1,
        positionLineNumber: 1,
        positionColumn: 1
      });
      var t = this.cursors.getLastAddedCursor();
      this._invokeForAll(e, function(n, i, o) {
        return i === t ? e.eventData.wholeLine ? i.line(!1, e.eventData.position, e.eventData.viewPosition, o) : i.moveTo(!
          1, e.eventData.position, e.eventData.viewPosition, e.eventSource, o) : !1;
      });

      e.shouldReveal = !1;

      e.shouldRevealHorizontal = !1;

      return !0;
    };

    t.prototype._lastCursorMoveTo = function(e) {
      if (this.configuration.editor.readOnly || this.model.hasEditableRange()) {
        return !1;
      }
      var t = this.cursors.getLastAddedCursor();
      this._invokeForAll(e, function(n, i, o) {
        return i === t ? i.moveTo(!0, e.eventData.position, e.eventData.viewPosition, e.eventSource, o) : !1;
      });

      e.shouldReveal = !1;

      e.shouldRevealHorizontal = !1;

      return !0;
    };

    t.prototype._addCursorUp = function(e) {
      if (this.configuration.editor.readOnly) {
        return !1;
      }
      var t = this.cursors.getSelections().length;
      this.cursors.duplicateCursors();

      return this._invokeForAll(e, function(e, n, i) {
        return e >= t ? n.translateUp(i) : !1;
      });
    };

    t.prototype._addCursorDown = function(e) {
      if (this.configuration.editor.readOnly) {
        return !1;
      }
      var t = this.cursors.getSelections().length;
      this.cursors.duplicateCursors();

      return this._invokeForAll(e, function(e, n, i) {
        return e >= t ? n.translateDown(i) : !1;
      });
    };

    t.prototype._moveLeft = function(e, t) {
      return this._invokeForAll(t, function(t, n, i) {
        return n.moveLeft(e, i);
      });
    };

    t.prototype._moveWordLeft = function(e, t) {
      return this._invokeForAll(t, function(t, n, i) {
        return n.moveWordLeft(e, i);
      });
    };

    t.prototype._moveRight = function(e, t) {
      return this._invokeForAll(t, function(t, n, i) {
        return n.moveRight(e, i);
      });
    };

    t.prototype._moveWordRight = function(e, t) {
      return this._invokeForAll(t, function(t, n, i) {
        return n.moveWordRight(e, i);
      });
    };

    t.prototype._moveDown = function(e, t, n) {
      return this._invokeForAll(n, function(n, i, o) {
        return i.moveDown(e, t, o);
      });
    };

    t.prototype._moveUp = function(e, t, n) {
      return this._invokeForAll(n, function(n, i, o) {
        return i.moveUp(e, t, o);
      });
    };

    t.prototype._moveToBeginningOfLine = function(e, t) {
      return this._invokeForAll(t, function(t, n, i) {
        return n.moveToBeginningOfLine(e, i);
      });
    };

    t.prototype._moveToEndOfLine = function(e, t) {
      return this._invokeForAll(t, function(t, n, i) {
        return n.moveToEndOfLine(e, i);
      });
    };

    t.prototype._moveToBeginningOfBuffer = function(e, t) {
      return this._invokeForAll(t, function(t, n, i) {
        return n.moveToBeginningOfBuffer(e, i);
      });
    };

    t.prototype._moveToEndOfBuffer = function(e, t) {
      return this._invokeForAll(t, function(t, n, i) {
        return n.moveToEndOfBuffer(e, i);
      });
    };

    t.prototype._selectAll = function(e) {
      this.cursors.killSecondaryCursors();

      return this._invokeForAll(e, function(e, t, n) {
        return t.selectAll(n);
      });
    };

    t.prototype._line = function(e, t) {
      this.cursors.killSecondaryCursors();

      return this._invokeForAll(t, function(n, i, o) {
        return i.line(e, t.eventData.position, t.eventData.viewPosition, o);
      });
    };

    t.prototype._lastCursorLine = function(e, t) {
      if (this.configuration.editor.readOnly || this.model.hasEditableRange()) {
        return !1;
      }
      var n = this.cursors.getLastAddedCursor();
      this._invokeForAll(t, function(i, o, r) {
        return o === n ? o.line(e, t.eventData.position, t.eventData.viewPosition, r) : !1;
      });

      t.shouldReveal = !1;

      t.shouldRevealHorizontal = !1;

      return !0;
    };

    t.prototype._lineInsertBefore = function(e) {
      return this._invokeForAll(e, function(e, t, n) {
        return t.lineInsertBefore(n);
      });
    };

    t.prototype._lineInsertAfter = function(e) {
      return this._invokeForAll(e, function(e, t, n) {
        return t.lineInsertAfter(n);
      });
    };

    t.prototype._lineBreakInsert = function(e) {
      return this._invokeForAll(e, function(e, t, n) {
        return t.lineBreakInsert(n);
      });
    };

    t.prototype._word = function(e, t) {
      this.cursors.killSecondaryCursors();

      return this._invokeForAll(t, function(n, i, o) {
        return i.word(e, t.eventData.position, t.eventData.preference || "none", o);
      });
    };

    t.prototype._lastCursorWord = function(e) {
      if (this.configuration.editor.readOnly || this.model.hasEditableRange()) {
        return !1;
      }
      var t = this.cursors.getLastAddedCursor();
      this._invokeForAll(e, function(n, i, o) {
        return i === t ? i.word(!0, e.eventData.position, e.eventData.preference || "none", o) : !1;
      });

      e.shouldReveal = !1;

      e.shouldRevealHorizontal = !1;

      return !0;
    };

    t.prototype._cancelSelection = function(e) {
      return this.cursors.killSecondaryCursors() ? !0 : this._invokeForAll(e, function(e, t, n) {
        return t.cancelSelection(n);
      });
    };

    t.prototype._type = function(e) {
      var t = this;

      var n = e.eventData.text;
      if ("keyboard" === e.eventSource) {
        var i;

        var o;

        var r;
        for (i = 0, o = n.length; o > i; i++) {
          r = n.charAt(i);
          this.charactersTyped += r;
          this._createAndInterpretHandlerCtx(e.eventSource, e.eventData, function(n) {
            t._invokeForAll(n, function(e, t, n) {
              return t.type(r, n);
            }, !1, !1);

            e.cursorPositionChangeReason = n.cursorPositionChangeReason;

            e.shouldReveal = n.shouldReveal;

            e.shouldRevealVerticalInCenter = n.shouldRevealVerticalInCenter;

            e.shouldRevealHorizontal = n.shouldRevealHorizontal;
          });
        }
      } else {
        this._invokeForAll(e, function(e, t, i) {
          return t.actualType(n, !1, i);
        });
      }
      return !0;
    };

    t.prototype._tab = function(e) {
      return this._invokeForAll(e, function(e, t, n) {
        return t.tab(n);
      }, !1, !1);
    };

    t.prototype._indent = function(e) {
      return this._invokeForAll(e, function(e, t, n) {
        return t.indent(n);
      });
    };

    t.prototype._outdent = function(e) {
      return this._invokeForAll(e, function(e, t, n) {
        return t.outdent(n);
      });
    };

    t.prototype._paste = function(e) {
      return this._invokeForAll(e, function(t, n, i) {
        return n.paste(e.eventData.text, e.eventData.pasteOnNewLine, i);
      });
    };

    t.prototype._deleteLeft = function(e) {
      return this._invokeForAll(e, function(e, t, n) {
        return t.deleteLeft(n);
      }, !1, !1);
    };

    t.prototype._deleteWordLeft = function(e) {
      return this._invokeForAll(e, function(e, t, n) {
        return t.deleteWordLeft(n);
      }, !1, !1);
    };

    t.prototype._deleteRight = function(e) {
      return this._invokeForAll(e, function(e, t, n) {
        return t.deleteRight(n);
      }, !1, !1);
    };

    t.prototype._deleteWordRight = function(e) {
      return this._invokeForAll(e, function(e, t, n) {
        return t.deleteWordRight(n);
      }, !1, !1);
    };

    t.prototype._deleteAllLeft = function(e) {
      return this._invokeForAll(e, function(e, t, n) {
        return t.deleteAllLeft(n);
      }, !1, !1);
    };

    t.prototype._deleteAllRight = function(e) {
      return this._invokeForAll(e, function(e, t, n) {
        return t.deleteAllRight(n);
      }, !1, !1);
    };

    t.prototype._cut = function(e) {
      return this._invokeForAll(e, function(e, t, n) {
        return t.cut(n);
      });
    };

    t.prototype._undo = function(e) {
      e.cursorPositionChangeReason = "undo";

      this._interpretCommandResult(this.model.undo());

      return !0;
    };

    t.prototype._redo = function(e) {
      e.cursorPositionChangeReason = "redo";

      this._interpretCommandResult(this.model.redo());

      return !0;
    };

    t.prototype._externalExecuteCommand = function(e) {
      this.cursors.killSecondaryCursors();

      return this._invokeForAll(e, function(t, n, i) {
        i.shouldPushStackElementBefore = !0;

        i.shouldPushStackElementAfter = !0;

        i.executeCommand = e.eventData;

        return !1;
      });
    };

    t.prototype._externalExecuteCommands = function(e) {
      return this._invokeForAll(e, function(t, n, i) {
        i.shouldPushStackElementBefore = !0;

        i.shouldPushStackElementAfter = !0;

        i.executeCommand = e.eventData[t];

        return !1;
      });
    };

    return t;
  }(a.EventEmitter);
  t.Cursor = p;
});