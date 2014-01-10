var __extends = this.__extends || function(a, b) {
    function d() {
      this.constructor = a
    }
    for (var c in b) b.hasOwnProperty(c) && (a[c] = b[c]);
    d.prototype = b.prototype, a.prototype = new d
  };
define(["require", "exports", "vs/base/eventEmitter", "vs/editor/core/view/viewContext", "vs/editor/core/constants",
  "vs/editor/core/selection", "vs/editor/core/range", "vs/editor/core/view/model/viewModelDecorations",
  "vs/editor/core/view/model/viewModelCursors", "vs/base/strings", "vs/editor/core/position"
], function(a, b, c, d, e, f, g, h, i, j, k) {
  var l = c,
    m = d,
    n = e,
    o = f,
    p = g,
    q = h,
    r = i,
    s = j,
    t = k,
    u = function(a) {
      function b(b, c, d, e) {
        var f = this;
        a.call(this), this.lines = b, this.editorId = c, this.configuration = d, this.model = e, this.decorations =
          new q.ViewModelDecorations(this.editorId, this.configuration, this), this.decorations.reset(this.model),
          this.cursors = new r.ViewModelCursors(this.configuration, this), this.listenersToRemove = [], this.listenersToRemove
          .push(this.model.addBulkListener(function(a) {
            return f.onEvents(a)
          })), this.listenersToRemove.push(this.configuration.addBulkListener(function(a) {
            return f.onEvents(a)
          }))
      }
      return __extends(b, a), b.prototype.dispose = function() {
        this.listenersToRemove.forEach(function(a) {
          a()
        }), this.listenersToRemove = [], this.decorations.dispose(), this.decorations = null, this.lines = null, this
          .configuration = null, this.model = null
      }, b.prototype.setTabSize = function(a) {
        var b = this;
        this.deferredEmit(function() {
          var c = b.lines.setTabSize(a, function(a, c) {
            return b.emit(a, c)
          });
          c && (b.emit(m.EventNames.LineMappingChangedEvent), b.decorations.onLineMappingChanged(function(a, c) {
            return b.emit(a, c)
          }), b.cursors.onLineMappingChanged(function(a, c) {
            return b.emit(a, c)
          }))
        })
      }, b.prototype.setWrappingColumn = function(a) {
        var b = this;
        this.deferredEmit(function() {
          var c = b.lines.setWrappingColumn(a, function(a, c) {
            return b.emit(a, c)
          });
          c && (b.emit(m.EventNames.LineMappingChangedEvent), b.decorations.onLineMappingChanged(function(a, c) {
            return b.emit(a, c)
          }), b.cursors.onLineMappingChanged(function(a, c) {
            return b.emit(a, c)
          }))
        })
      }, b.prototype.addEventSource = function(a) {
        var b = this;
        this.listenersToRemove.push(a.addBulkListener(function(a) {
          return b.onEvents(a)
        }))
      }, b.prototype.onEvents = function(a) {
        var b = this;
        this.deferredEmit(function() {
          var c, d, e, f, g, h = !1,
            i = !1;
          for (c = 0, d = a.length; c < d; c++) {
            e = a[c], f = e.getData();
            switch (e.getType()) {
              case n.EventType.ModelContentChanged:
                g = f;
                switch (g.changeType) {
                  case n.EventType.ModelContentChangedFlush:
                    b.onModelFlushed(g), h = !0;
                    break;
                  case n.EventType.ModelContentChangedLinesDeleted:
                    b.onModelLinesDeleted(g), h = !0;
                    break;
                  case n.EventType.ModelContentChangedLinesInserted:
                    b.onModelLinesInserted(g), h = !0;
                    break;
                  case n.EventType.ModelContentChangedLineChanged:
                    i = b.onModelLineChanged(g);
                    break;
                  default:
                    console.info("ViewModel received unkown event: "), console.info(e)
                }
                break;
              case n.EventType.ModelPropertiesChanged:
                break;
              case n.EventType.ModelDecorationsChanged:
                b.onModelDecorationsChanged(f);
                break;
              case n.EventType.ModelDispose:
                break;
              case n.EventType.CursorPositionChanged:
                b.onCursorPositionChanged(f);
                break;
              case n.EventType.CursorSelectionChanged:
                b.onCursorSelectionChanged(f);
                break;
              case n.EventType.CursorRevealRange:
                b.onCursorRevealRange(f);
                break;
              case n.EventType.ConfigurationChanged:
                b.setTabSize(b.configuration.editor.tabSize), b.emit(e.getType(), f);
                break;
              case n.EventType.ConfigurationLineHeightChanged:
                b.emit(e.getType(), e.getData());
                break;
              case n.EventType.ConfigurationFontChanged:
                b.emit(e.getType(), e.getData());
                break;
              default:
                console.info("View received unkown event: "), console.info(e)
            }
          }!h && i && (b.emit(m.EventNames.LineMappingChangedEvent), b.decorations.onLineMappingChanged(function(a,
            c) {
            return b.emit(a, c)
          }), b.cursors.onLineMappingChanged(function(a, c) {
            return b.emit(a, c)
          }))
        })
      }, b.prototype.onModelFlushed = function(a) {
        var b = this;
        this.lines.onModelFlushed(function(a, c) {
          return b.emit(a, c)
        }), this.decorations.reset(this.model)
      }, b.prototype.onModelDecorationsChanged = function(a) {
        var b = this;
        this.decorations.onModelDecorationsChanged(a, function(a, c) {
          return b.emit(a, c)
        })
      }, b.prototype.onModelLinesDeleted = function(a) {
        var b = this;
        this.lines.onModelLinesDeleted(a.fromLineNumber, a.toLineNumber, function(a, c) {
          return b.emit(a, c)
        })
      }, b.prototype.onModelLineChanged = function(a) {
        var b = this,
          c = this.lines.onModelLineChanged(a.lineNumber, a.detail, function(a, c) {
            return b.emit(a, c)
          });
        return c
      }, b.prototype.onModelLinesInserted = function(a) {
        var b = this;
        this.lines.onModelLinesInserted(a.fromLineNumber, a.toLineNumber, a.detail.split("\n"), function(a, c) {
          return b.emit(a, c)
        })
      }, b.prototype.validateViewPosition = function(a, b, c) {
        a < 1 && (a = 1);
        var d = this.getLineCount();
        a > d && (a = d);
        var e = this.getLineMaxColumn(a);
        b < 1 && (b = 1), b > e && (b = e);
        var f = this.convertViewPositionToModelPosition(a, b);
        return f.equals(c) ? new t.Position(a, b) : this.convertModelPositionToViewPosition(c.lineNumber, c.column)
      }, b.prototype.onCursorPositionChanged = function(a) {
        var b = this;
        this.cursors.onCursorPositionChanged(a, function(a, c) {
          return b.emit(a, c)
        })
      }, b.prototype.onCursorSelectionChanged = function(a) {
        var b = this;
        this.cursors.onCursorSelectionChanged(a, function(a, c) {
          return b.emit(a, c)
        })
      }, b.prototype.onCursorRevealRange = function(a) {
        var b = this;
        this.cursors.onCursorRevealRange(a, function(a, c) {
          return b.emit(a, c)
        })
      }, b.prototype.getLineCount = function() {
        return this.lines.getOutputLineCount()
      }, b.prototype.getLineContent = function(a) {
        return this.lines.getOutputLineContent(a)
      }, b.prototype.getLineMaxColumn = function(a) {
        return this.lines.getOutputLineMaxColumn(a)
      }, b.prototype.getLineFirstNonWhitespaceColumn = function(a) {
        var b = s.firstNonWhitespaceIndex(this.getLineContent(a));
        return b === -1 ? 0 : b + 1
      }, b.prototype.getLineLastNonWhitespaceColumn = function(a) {
        var b = s.lastNonWhitespaceIndex(this.getLineContent(a));
        return b === -1 ? 0 : b + 2
      }, b.prototype.getLineTokens = function(a) {
        return this.lines.getOutputLineTokens(a)
      }, b.prototype.getInlineDecorations = function(a) {
        return this.decorations.getInlineDecorations(a)
      }, b.prototype.getLineRenderLineNumber = function(a) {
        var b = this.convertViewPositionToModelPosition(a, 1);
        if (b.column !== 1) return "";
        var c = b.lineNumber;
        return typeof this.configuration.editor.lineNumbers == "function" ? this.configuration.editor.lineNumbers(c) :
          c.toString()
      }, b.prototype.getDecorationsInRange = function(a) {
        return this.decorations.getDecorationsInRange(a)
      }, b.prototype.getAllDecorations = function() {
        return this.decorations.getAllDecorations()
      }, b.prototype.getValueInRange = function(a, b) {
        var c = this.convertViewRangeToModelRange(a);
        return this.model.getValueInRange(c, b)
      }, b.prototype.getModelLineContent = function(a) {
        return this.model.getLineContent(a)
      }, b.prototype.getSelections = function() {
        return this.cursors.getSelections()
      }, b.prototype.validateModelPosition = function(a) {
        return this.model.validatePosition(a)
      }, b.prototype.convertViewPositionToModelPosition = function(a, b) {
        return this.lines.convertOutputPositionToInputPosition(a, b)
      }, b.prototype.convertViewRangeToModelRange = function(a) {
        var b = this.convertViewPositionToModelPosition(a.startLineNumber, a.startColumn),
          c = this.convertViewPositionToModelPosition(a.endLineNumber, a.endColumn);
        return new p.Range(b.lineNumber, b.column, c.lineNumber, c.column)
      }, b.prototype.convertModelPositionToViewPosition = function(a, b) {
        return this.lines.convertInputPositionToOutputPosition(a, b)
      }, b.prototype.convertModelSelectionToViewSelection = function(a) {
        var b = this.convertModelPositionToViewPosition(a.selectionStartLineNumber, a.selectionStartColumn),
          c = this.convertModelPositionToViewPosition(a.positionLineNumber, a.positionColumn);
        return new o.Selection(b.lineNumber, b.column, c.lineNumber, c.column)
      }, b.prototype.convertModelRangeToViewRange = function(a) {
        var b = this.convertModelPositionToViewPosition(a.startLineNumber, a.startColumn),
          c = this.convertModelPositionToViewPosition(a.endLineNumber, a.endColumn);
        return new p.Range(b.lineNumber, b.column, c.lineNumber, c.column)
      }, b
    }(l.EventEmitter);
  b.ViewModel = u
})