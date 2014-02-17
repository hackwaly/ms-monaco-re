define("vs/editor/core/view/model/viewModel", ["require", "exports", "vs/base/eventEmitter",
  "vs/editor/core/view/viewContext", "vs/editor/core/constants", "vs/editor/core/selection", "vs/editor/core/range",
  "vs/editor/core/view/model/viewModelDecorations", "vs/editor/core/view/model/viewModelCursors", "vs/base/strings",
  "vs/editor/core/position"
], function(e, t, n, i, o, r, s, a, u, l, c) {
  var d = function(e) {
    function t(t, n, i, o) {
      var r = this;
      e.call(this);

      this.lines = t;

      this.editorId = n;

      this.configuration = i;

      this.model = o;

      this.restoreCurrentCenteredModelRange = null;

      this.isHandlingExternalEvents = !1;

      this.decorations = new a.ViewModelDecorations(this.editorId, this.configuration, {
        convertModelRangeToViewRange: function(e, t) {
          return t ? r.convertWholeLineModelRangeToViewRange(e) : r.convertModelRangeToViewRange(e);
        }
      });

      this.decorations.reset(this.model);

      this.cursors = new u.ViewModelCursors(this.configuration, this);

      this.listenersToRemove = [];

      this.listenersToRemove.push(this.model.addBulkListener(function(e) {
        return r.onEvents(e);
      }));

      this.listenersToRemove.push(this.configuration.addBulkListener(function(e) {
        return r.onEvents(e);
      }));
    }
    __extends(t, e);

    t.prototype.dispose = function() {
      this.listenersToRemove.forEach(function(e) {
        e();
      });

      this.listenersToRemove = [];

      this.decorations.dispose();

      this.decorations = null;

      this.lines = null;

      this.configuration = null;

      this.model = null;
    };

    t.prototype.setTabSize = function(e) {
      var t = this;
      this.deferredEmit(function() {
        var n = t.lines.setTabSize(e, function(e, n) {
          return t.emit(e, n);
        });
        n && (t.emit(i.EventNames.LineMappingChangedEvent), t.decorations.onLineMappingChanged(function(e, n) {
          return t.emit(e, n);
        }), t.cursors.onLineMappingChanged(function(e, n) {
          return t.emit(e, n);
        }));
      });
    };

    t.prototype.restoreCenteredModelRange = function() {
      if (this.restoreCurrentCenteredModelRange) {
        var e = this.convertModelRangeToViewRange(this.restoreCurrentCenteredModelRange);
        this.restoreCurrentCenteredModelRange = null;
        var t = {
          range: e,
          revealVerticalInCenter: !0,
          revealHorizontal: !1
        };
        this.emit(i.EventNames.RevealRangeEvent, t);
      }
    };

    t.prototype.setWrappingColumn = function(e, t) {
      var n = this;
      this.restoreCurrentCenteredModelRange = null;
      var o = !1;
      this.deferredEmit(function() {
        if (t) {
          var r = new s.Range(t, 1, t, n.getLineMaxColumn(t));
          n.restoreCurrentCenteredModelRange = n.convertViewRangeToModelRange(r);
        }
        o = n.lines.setWrappingColumn(e, function(e, t) {
          return n.emit(e, t);
        });

        o ? (n.emit(i.EventNames.LineMappingChangedEvent), n.decorations.onLineMappingChanged(function(e, t) {
          return n.emit(e, t);
        }), n.cursors.onLineMappingChanged(function(e, t) {
          return n.emit(e, t);
        })) : n.restoreCurrentCenteredModelRange = null;

        n.isHandlingExternalEvents || n.restoreCenteredModelRange();
      });
    };

    t.prototype.addEventSource = function(e) {
      var t = this;
      this.listenersToRemove.push(e.addBulkListener(function(e) {
        return t.onEvents(e);
      }));
    };

    t.prototype.onEvents = function(e) {
      var t = this;
      this.isHandlingExternalEvents = !0;

      this.deferredEmit(function() {
        var n;

        var r;

        var s;

        var a;

        var u;

        var l = !1;

        var c = !1;
        for (n = 0, r = e.length; r > n; n++) switch (s = e[n], a = s.getData(), s.getType()) {
          case o.EventType.ModelContentChanged:
            switch (u = a, u.changeType) {
              case o.EventType.ModelContentChangedFlush:
                t.onModelFlushed(u);

                l = !0;
                break;
              case o.EventType.ModelContentChangedLinesDeleted:
                t.onModelLinesDeleted(u);

                l = !0;
                break;
              case o.EventType.ModelContentChangedLinesInserted:
                t.onModelLinesInserted(u);

                l = !0;
                break;
              case o.EventType.ModelContentChangedLineChanged:
                c = t.onModelLineChanged(u);
                break;
              default:
                console.info("ViewModel received unkown event: ");

                console.info(s);
            }
            break;
          case o.EventType.ModelTokensChanged:
            t.onModelTokensChanged(a);
            break;
          case o.EventType.ModelPropertiesChanged:
            break;
          case o.EventType.ModelDecorationsChanged:
            t.onModelDecorationsChanged(a);
            break;
          case o.EventType.ModelDispose:
            break;
          case o.EventType.CursorPositionChanged:
            t.onCursorPositionChanged(a);
            break;
          case o.EventType.CursorSelectionChanged:
            t.onCursorSelectionChanged(a);
            break;
          case o.EventType.CursorRevealRange:
            t.onCursorRevealRange(a);
            break;
          case o.EventType.ConfigurationChanged:
            t.setTabSize(t.configuration.getIndentationOptions().tabSize);

            t.emit(s.getType(), a);
            break;
          default:
            console.info("View received unkown event: ");

            console.info(s);
        }!l && c && (t.emit(i.EventNames.LineMappingChangedEvent), t.decorations.onLineMappingChanged(function(e, n) {
          return t.emit(e, n);
        }), t.cursors.onLineMappingChanged(function(e, n) {
          return t.emit(e, n);
        }));
      });

      this.restoreCenteredModelRange();

      this.isHandlingExternalEvents = !1;
    };

    t.prototype.onModelFlushed = function() {
      var e = this;
      this.lines.onModelFlushed(function(t, n) {
        return e.emit(t, n);
      });

      this.decorations.reset(this.model);
    };

    t.prototype.onModelDecorationsChanged = function(e) {
      var t = this;
      this.decorations.onModelDecorationsChanged(e, function(e, n) {
        return t.emit(e, n);
      });
    };

    t.prototype.onModelLinesDeleted = function(e) {
      var t = this;
      this.lines.onModelLinesDeleted(e.fromLineNumber, e.toLineNumber, function(e, n) {
        return t.emit(e, n);
      });
    };

    t.prototype.onModelTokensChanged = function(e) {
      var t = this.convertModelPositionToViewPosition(e.fromLineNumber, 1).lineNumber;

      var n = this.convertModelPositionToViewPosition(e.toLineNumber, this.model.getLineMaxColumn(e.toLineNumber)).lineNumber;

      var e = {
        fromLineNumber: t,
        toLineNumber: n
      };
      this.emit(i.EventNames.TokensChangedEvent, e);
    };

    t.prototype.onModelLineChanged = function(e) {
      var t = this;

      var n = this.lines.onModelLineChanged(e.lineNumber, e.detail, function(e, n) {
        return t.emit(e, n);
      });
      return n;
    };

    t.prototype.onModelLinesInserted = function(e) {
      var t = this;
      this.lines.onModelLinesInserted(e.fromLineNumber, e.toLineNumber, e.detail.split("\n"), function(e, n) {
        return t.emit(e, n);
      });
    };

    t.prototype.validateViewPosition = function(e, t, n) {
      1 > e && (e = 1);
      var i = this.getLineCount();
      e > i && (e = i);
      var o = this.getLineMaxColumn(e);
      1 > t && (t = 1);

      t > o && (t = o);
      var r = this.convertViewPositionToModelPosition(e, t);
      return r.equals(n) ? new c.Position(e, t) : this.convertModelPositionToViewPosition(n.lineNumber, n.column);
    };

    t.prototype.onCursorPositionChanged = function(e) {
      var t = this;
      this.cursors.onCursorPositionChanged(e, function(e, n) {
        return t.emit(e, n);
      });
    };

    t.prototype.onCursorSelectionChanged = function(e) {
      var t = this;
      this.cursors.onCursorSelectionChanged(e, function(e, n) {
        return t.emit(e, n);
      });
    };

    t.prototype.onCursorRevealRange = function(e) {
      var t = this;
      this.cursors.onCursorRevealRange(e, function(e, n) {
        return t.emit(e, n);
      });
    };

    t.prototype.getLineCount = function() {
      return this.lines.getOutputLineCount();
    };

    t.prototype.getLineContent = function(e) {
      return this.lines.getOutputLineContent(e);
    };

    t.prototype.getLineMaxColumn = function(e) {
      return this.lines.getOutputLineMaxColumn(e);
    };

    t.prototype.getLineFirstNonWhitespaceColumn = function(e) {
      var t = l.firstNonWhitespaceIndex(this.getLineContent(e));
      return -1 === t ? 0 : t + 1;
    };

    t.prototype.getLineLastNonWhitespaceColumn = function(e) {
      var t = l.lastNonWhitespaceIndex(this.getLineContent(e));
      return -1 === t ? 0 : t + 2;
    };

    t.prototype.getLineTokens = function(e) {
      return this.lines.getOutputLineTokens(e);
    };

    t.prototype.getInlineDecorations = function(e) {
      return this.decorations.getInlineDecorations(e);
    };

    t.prototype.getLineRenderLineNumber = function(e) {
      var t = this.convertViewPositionToModelPosition(e, 1);
      if (1 !== t.column) {
        return "";
      }
      var n = t.lineNumber;
      return "function" == typeof this.configuration.editor.lineNumbers ? this.configuration.editor.lineNumbers(n) :
        n.toString();
    };

    t.prototype.getDecorationsInRange = function(e) {
      return this.decorations.getDecorationsInRange(e);
    };

    t.prototype.getAllDecorations = function() {
      return this.decorations.getAllDecorations();
    };

    t.prototype.getValueInRange = function(e, t) {
      var n = this.convertViewRangeToModelRange(e);
      return this.model.getValueInRange(n, t);
    };

    t.prototype.getModelLineContent = function(e) {
      return this.model.getLineContent(e);
    };

    t.prototype.getSelections = function() {
      return this.cursors.getSelections();
    };

    t.prototype.getModelLineMaxColumn = function(e) {
      return this.model.getLineMaxColumn(e);
    };

    t.prototype.validateModelPosition = function(e) {
      return this.model.validatePosition(e);
    };

    t.prototype.convertViewPositionToModelPosition = function(e, t) {
      return this.lines.convertOutputPositionToInputPosition(e, t);
    };

    t.prototype.convertViewRangeToModelRange = function(e) {
      var t = this.convertViewPositionToModelPosition(e.startLineNumber, e.startColumn);

      var n = this.convertViewPositionToModelPosition(e.endLineNumber, e.endColumn);
      return new s.Range(t.lineNumber, t.column, n.lineNumber, n.column);
    };

    t.prototype.convertModelPositionToViewPosition = function(e, t) {
      return this.lines.convertInputPositionToOutputPosition(e, t);
    };

    t.prototype.convertModelSelectionToViewSelection = function(e) {
      var t = this.convertModelPositionToViewPosition(e.selectionStartLineNumber, e.selectionStartColumn);

      var n = this.convertModelPositionToViewPosition(e.positionLineNumber, e.positionColumn);
      return new r.Selection(t.lineNumber, t.column, n.lineNumber, n.column);
    };

    t.prototype.convertModelRangeToViewRange = function(e) {
      var t = this.convertModelPositionToViewPosition(e.startLineNumber, e.startColumn);

      var n = this.convertModelPositionToViewPosition(e.endLineNumber, e.endColumn);
      return new s.Range(t.lineNumber, t.column, n.lineNumber, n.column);
    };

    t.prototype.convertWholeLineModelRangeToViewRange = function(e) {
      var t = this.convertModelPositionToViewPosition(e.startLineNumber, 1);

      var n = this.convertModelPositionToViewPosition(e.endLineNumber, this.model.getLineMaxColumn(e.endLineNumber));
      return new s.Range(t.lineNumber, t.column, n.lineNumber, n.column);
    };

    return t;
  }(n.EventEmitter);
  t.ViewModel = d;
});