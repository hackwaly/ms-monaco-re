var __extends = this.__extends || function(a, b) {
    function d() {
      this.constructor = a
    }
    for (var c in b) b.hasOwnProperty(c) && (a[c] = b[c]);
    d.prototype = b.prototype, a.prototype = new d
  };
define(["require", "exports", "vs/base/lib/winjs.base", "vs/editor/core/constants", "vs/base/objects", "vs/base/types",
  "vs/platform/platform", "vs/base/dom/dom", "vs/base/eventEmitter", "vs/editor/core/configuration",
  "vs/editor/core/controller/cursor", "vs/editor/core/view/view",
  "vs/editor/core/view/model/characterHardWrappingLineMapper", "vs/editor/core/view/model/splitLinesCollection",
  "vs/editor/core/view/model/viewModel", "vs/editor/core/position", "vs/editor/core/range",
  "vs/editor/core/selection", "vs/base/performance/timer", "vs/editor/editorExtensions", "vs/base/ui/actions",
  "vs/editor/editor", "vs/css!./../css/editor", "vs/css!./../css/default-theme"
], function(a, b, c, d, e, f, g, h, i, j, k, l, m, n, o, p, q, r, s, t, u, v) {
  var w = c,
    x = d,
    y = e,
    z = f,
    A = g,
    B = h,
    C = i,
    D = j,
    E = k,
    F = l,
    G = m,
    H = n,
    I = o,
    J = p,
    K = q,
    L = r,
    M = s,
    N = t,
    O = u,
    P = v,
    Q = 0,
    R = function(a) {
      function b(b, c, d) {
        var e = this;
        a.call(this);
        var f = M.start(M.Topic.EDITOR, "CodeEditor.ctor");
        this.id = ++Q, this.domElement = b, this.lifetimeListeners = [], c = c || {};
        var g = null;
        c.model && (g = c.model, delete c.model), this.configuration = new D.Configuration(c), this.focusTracker = B.trackFocus(
          this.domElement), this.focusTracker.addFocusListener(function() {
          e.emit("widgetFocus", {})
        }), this.focusTracker.addBlurListener(function() {
          e.emit("widgetBlur", {})
        }), this.handlerService = null, this.injectorService = d, d && z.isFunction(d.injectTo) && d.injectTo(this),
          this.handlerService ? (this.bindings = this.configuration.bindKeys(this.handlerService), this.bindings.deactivate(),
            this.lifetimeListeners.push(this.addListener("blur", function() {
              return e.bindings.deactivate()
            })), this.lifetimeListeners.push(this.addListener("focus", function() {
              return e.bindings.activate()
            }))) : this.bindings = null, this._attachModel(g), this.contentWidgets = {}, this.overlayWidgets = {},
          this.contributions = {};
        var h = A.Registry.as(N.Extensions.EditorContributions),
          i = h.getEditorContributions();
        for (var j = 0, k = i.length; j < k; j++) {
          var l = i[j],
            m = l.createNew(this, l);
          d && z.isFunction(d.injectTo) && d.injectTo(m), this.contributions[m.getId()] = m
        }
        f.stop()
      }
      return __extends(b, a), b.prototype.getEditorType = function() {
        return x.EditorType.ICodeEditor
      }, b.prototype.injectHandlerService = function(a) {
        this.handlerService = a
      }, b.prototype.destroy = function() {
        while (this.lifetimeListeners.length > 0) this.lifetimeListeners.pop()();
        var b;
        for (b in this.contributions) this.contributions.hasOwnProperty(b) && this.contributions[b].dispose();
        this.contributions = {}, this.contentWidgets = {}, this.overlayWidgets = {}, this.bindings && (this.bindings.dispose(),
          this.bindings = null), this.focusTracker.dispose(), this._detachModel(), this.configuration.dispose(), this
          .emit(x.EventType.Disposed, {}), a.prototype.dispose.call(this)
      }, b.prototype.updateOptions = function(a) {
        a = a || {}, this.configuration.updateOptions(a)
      }, b.prototype.getConfiguration = function() {
        return y.clone(this.configuration.editor)
      }, b.prototype.normalizeIndentation = function(a) {
        return this.configuration.normalizeIndentation(a)
      }, b.prototype.getValue = function(a) {
        typeof a == "undefined" && (a = null);
        if (this.model) {
          var b = a && a.preserveBOM ? !0 : !1,
            c = P.EndOfLinePreference.TextDefined;
          return a && a.lineEnding && a.lineEnding === "\n" ? c = P.EndOfLinePreference.LF : a && a.lineEnding && a.lineEnding ===
            "\r\n" && (c = P.EndOfLinePreference.CRLF), this.model.getValue(c, b)
        }
        return ""
      }, b.prototype.setValue = function(a) {
        this.model && this.model.setValue(a)
      }, b.prototype.getView = function() {
        return this.view
      }, b.prototype.getModel = function() {
        return this.model
      }, b.prototype.setModel = function(a) {
        typeof a == "undefined" && (a = null);
        if (this.model === a) return;
        this._detachModel(), this._attachModel(a), this.emit(x.EventType.ModelChanged)
      }, b.prototype.getDomNode = function() {
        return this.hasView ? this.view.domNode : null
      }, b.prototype.getPosition = function() {
        return this.cursor ? this.cursor.getPosition().clone() : null
      }, b.prototype.setPosition = function(a, b, c, d) {
        typeof b == "undefined" && (b = !1), typeof c == "undefined" && (c = !1), typeof d == "undefined" && (d = !1);
        if (!this.cursor) return;
        if (!J.isIPosition(a)) throw new Error("Invalid arguments");
        this.cursor.setSelections("api", [{
          selectionStartLineNumber: a.lineNumber,
          selectionStartColumn: a.column,
          positionLineNumber: a.lineNumber,
          positionColumn: a.column
        }]), b && this.revealPosition(a, c, d)
      }, b.prototype.revealPosition = function(a, b, c) {
        typeof b == "undefined" && (b = !1), typeof c == "undefined" && (c = !1);
        if (!J.isIPosition(a)) throw new Error("Invalid arguments");
        this.revealRange({
          startLineNumber: a.lineNumber,
          startColumn: a.column,
          endLineNumber: a.lineNumber,
          endColumn: a.column
        }, b, c)
      }, b.prototype.getSelection = function() {
        return this.cursor ? this.cursor.getSelection().clone() : null
      }, b.prototype.getSelections = function() {
        if (!this.cursor) return null;
        var a = this.cursor.getSelections(),
          b = [];
        for (var c = 0, d = a.length; c < d; c++) b[c] = a[c].clone();
        return b
      }, b.prototype.setSelection = function(a, b, c, d) {
        typeof b == "undefined" && (b = !1), typeof c == "undefined" && (c = !1), typeof d == "undefined" && (d = !1);
        var e = L.isISelection(a),
          f = K.isIRange(a);
        if (!e && !f) throw new Error("Invalid arguments");
        if (e) this._setSelectionImpl(a, b, c, d);
        else if (f) {
          var g = {
            selectionStartLineNumber: a.startLineNumber,
            selectionStartColumn: a.startColumn,
            positionLineNumber: a.endLineNumber,
            positionColumn: a.endColumn
          };
          this._setSelectionImpl(g, b, c, d)
        }
      }, b.prototype._setSelectionImpl = function(a, b, c, d) {
        if (!this.cursor) return;
        var e = new L.Selection(a.selectionStartLineNumber, a.selectionStartColumn, a.positionLineNumber, a.positionColumn);
        this.cursor.setSelections("api", [e]), b && this.revealRange(e, c, d)
      }, b.prototype.revealRange = function(a, b, c) {
        typeof b == "undefined" && (b = !1), typeof c == "undefined" && (c = !1);
        if (!this.model || !this.cursor) return;
        if (!K.isIRange(a)) throw new Error("Invalid arguments");
        var d = this.model.validateRange(a),
          e = {
            range: d,
            viewRange: null,
            revealVerticalInCenter: b,
            revealHorizontal: c
          };
        this.cursor.emit(x.EventType.CursorRevealRange, e)
      }, b.prototype.setSelections = function(a) {
        if (!this.cursor) return;
        if (!a || a.length === 0) throw new Error("Invalid arguments");
        for (var b = 0, c = a.length; b < c; b++)
          if (!L.isISelection(a[b])) throw new Error("Invalid arguments");
        this.cursor.setSelections("api", a)
      }, b.prototype.setScrollTop = function(a) {
        if (!this.hasView) return;
        if (typeof a != "number") throw new Error("Invalid arguments");
        this.view.getCodeEditorHelper().setScrollTop(a)
      }, b.prototype.getScrollTop = function() {
        return this.hasView ? this.view.getCodeEditorHelper().getScrollTop() : -1
      }, b.prototype.delegateVerticalScrollbarMouseDown = function(a) {
        if (!this.hasView) return;
        this.view.getCodeEditorHelper().delegateVerticalScrollbarMouseDown(a)
      }, b.prototype.setScrollLeft = function(a) {
        if (!this.hasView) return;
        if (typeof a != "number") throw new Error("Invalid arguments");
        this.view.getCodeEditorHelper().setScrollLeft(a)
      }, b.prototype.getScrollLeft = function() {
        return this.hasView ? this.view.getCodeEditorHelper().getScrollLeft() : -1
      }, b.prototype.saveViewState = function() {
        if (!this.cursor || !this.hasView) return null;
        var a = this.cursor.saveState(),
          b = this.view.saveState();
        return {
          cursorState: a,
          viewState: b
        }
      }, b.prototype.restoreViewState = function(a) {
        if (!this.cursor || !this.hasView) return;
        var b = a;
        if (b && b.cursorState && b.viewState) {
          var c = b,
            d = c.cursorState;
          z.isArray(d) ? this.cursor.restoreState(d) : this.cursor.restoreState([d]), this.view.restoreState(c.viewState)
        }
      }, b.prototype.layout = function() {
        this.hasView && this.view.layout()
      }, b.prototype.onVisible = function() {}, b.prototype.onHide = function() {}, b.prototype.focus = function() {
        if (!this.hasView) return;
        this.view.focus()
      }, b.prototype.getContribution = function(a) {
        return this.contributions[a] || null
      }, b.prototype.getActions = function() {
        var a = [],
          b;
        for (b in this.contributions)
          if (this.contributions.hasOwnProperty(b)) {
            var c = this.contributions[b];
            O.isAction(c) && a.push(c)
          }
        return a
      }, b.prototype.getAction = function(a) {
        var b = this.contributions[a];
        return b && O.isAction(b) ? b : null
      }, b.prototype.trigger = function(a, b, c) {
        var d = this.getAction(b);
        d !== null ? d.enabled && w.Promise.as(d.run()).done() : this.configuration.handlerDispatcher.trigger(a, b, c)
      }, b.prototype.executeCommand = function(a, b) {
        return this.configuration.handlerDispatcher.trigger(a, x.Handler.ExecuteCommand, b)
      }, b.prototype.executeCommands = function(a, b) {
        return this.configuration.handlerDispatcher.trigger(a, x.Handler.ExecuteCommands, b)
      }, b.prototype.addContentWidget = function(a) {
        var b = {
          widget: a,
          position: a.getPosition()
        };
        this.contentWidgets[a.getId()] = b, this.hasView && this.view.addContentWidget(b)
      }, b.prototype.layoutContentWidget = function(a) {
        var b = a.getId();
        if (this.contentWidgets.hasOwnProperty(b)) {
          var c = this.contentWidgets[b];
          c.position = a.getPosition(), this.hasView && this.view.layoutContentWidget(c)
        }
      }, b.prototype.removeContentWidget = function(a) {
        var b = a.getId();
        if (this.contentWidgets.hasOwnProperty(b)) {
          var c = this.contentWidgets[b];
          delete this.contentWidgets[b], this.hasView && this.view.removeContentWidget(c)
        }
      }, b.prototype.addOverlayWidget = function(a) {
        var b = {
          widget: a,
          position: a.getPosition()
        };
        this.overlayWidgets[a.getId()] = b, this.hasView && this.view.addOverlayWidget(b)
      }, b.prototype.layoutOverlayWidget = function(a) {
        var b = a.getId();
        if (this.overlayWidgets.hasOwnProperty(b)) {
          var c = this.overlayWidgets[b];
          c.position = a.getPosition(), this.hasView && this.view.layoutOverlayWidget(c)
        }
      }, b.prototype.removeOverlayWidget = function(a) {
        var b = a.getId();
        if (this.overlayWidgets.hasOwnProperty(b)) {
          var c = this.overlayWidgets[b];
          delete this.overlayWidgets[b], this.hasView && this.view.removeOverlayWidget(c)
        }
      }, b.prototype.changeDecorations = function(a) {
        return this.model ? this.model.changeDecorations(a, this.id) : null
      }, b.prototype.getLineDecorations = function(a) {
        return this.model ? this.model.getLineDecorations(a, this.id, this.configuration.editor.readOnly) : null
      }, b.prototype.deltaDecorations = function(a, b) {
        return this.model ? this.model.deltaDecorations(a, b, this.id) : null
      }, b.prototype.changeViewZones = function(a) {
        if (!this.hasView) return;
        this.view.change(a)
      }, b.prototype.addTypingListener = function(a, b) {
        var c = this;
        return this.cursor ? (this.cursor.addTypingListener(a, b), function() {
          c.cursor && c.cursor.removeTypingListener(a, b)
        }) : null
      }, b.prototype.getTopForLineNumber = function(a) {
        return this.hasView ? this.view.getCodeEditorHelper().getVerticalOffsetForLineNumber(a) : -1
      }, b.prototype.getOffsetForColumn = function(a, b) {
        return this.hasView ? this.view.getCodeEditorHelper().getOffsetForColumn(a, b) : -1
      }, b.prototype.getLayoutInfo = function() {
        return this.hasView ? this.view.getCodeEditorHelper().getLayoutInfo() : null
      }, b.prototype._attachModel = function(a) {
        var b = this;
        this.model = a ? a : null, this.listenersToRemove = [], this.view = null, this.viewModel = null, this.cursor =
          null;
        if (this.model) {
          this.model.setStopLineTokenizationAfter(this.configuration.editor.stopLineTokenizationAfter), this.configuration
            .setIsDominatedByLongLines(this.model.isDominatedByLongLines(this.configuration.editor.longLineBoundary));
          var c = this.configuration.getWrappingColumn(),
            d = -1;
          c > 0 && (d = c);
          var e = new G.CharacterHardWrappingLineMapperFactory(this.configuration.editor.wordWrapBreakBeforeCharacters,
            this.configuration.editor.wordWrapBreakAfterCharacters, this.configuration.editor.wordWrapBreakObtrusiveCharacters
          ),
            f = new H.SplitLinesCollection(this.model, e, this.configuration.editor.tabSize, d);
          this.viewModel = new I.ViewModel(f, this.id, this.configuration, this.model);
          var g = {
            viewModel: this.viewModel,
            convertModelPositionToViewPosition: function(a, c) {
              return b.viewModel.convertModelPositionToViewPosition(a, c)
            },
            convertViewToModelPosition: function(a, c) {
              return b.viewModel.convertViewPositionToModelPosition(a, c)
            },
            validateViewPosition: function(a, c, d) {
              return b.viewModel.validateViewPosition(a, c, d)
            }
          };
          this.cursor = new E.Cursor(this.id, this.configuration, this.model, function(a) {
            return b.view.renderOnce(a)
          }, g), this.viewModel.addEventSource(this.cursor), this.view = new F.View(this.id, this.domElement, this.configuration,
            this.viewModel), this.listenersToRemove.push(this.view.getInternalEventBus().addListener(x.EventType.ViewFocusGained,
            function(a) {
              b.emit("focus"), b.emit("widgetFocus", {})
            })), this.listenersToRemove.push(this.view.getInternalEventBus().addListener("scroll", function(a) {
            return b.emit("scroll", a)
          })), this.listenersToRemove.push(this.view.getInternalEventBus().addListener(x.EventType.ViewFocusLost,
            function(a) {
              return b.emit("blur")
            })), this.listenersToRemove.push(this.view.getInternalEventBus().addListener(x.EventType.ContextMenu,
            function(a) {
              return b.emit(x.EventType.ContextMenu, a)
            })), this.listenersToRemove.push(this.view.getInternalEventBus().addListener(x.EventType.MouseDown,
            function(a) {
              return b.emit(x.EventType.MouseDown, a)
            })), this.listenersToRemove.push(this.view.getInternalEventBus().addListener(x.EventType.MouseUp,
            function(a) {
              return b.emit(x.EventType.MouseUp, a)
            })), this.listenersToRemove.push(this.view.getInternalEventBus().addListener(x.EventType.KeyUp, function(
            a) {
            return b.emit(x.EventType.KeyUp, a)
          })), this.listenersToRemove.push(this.view.getInternalEventBus().addListener(x.EventType.MouseMove,
            function(a) {
              return b.emit(x.EventType.MouseMove, a)
            })), this.listenersToRemove.push(this.view.getInternalEventBus().addListener(x.EventType.MouseLeave,
            function(a) {
              return b.emit(x.EventType.MouseLeave, a)
            })), this.listenersToRemove.push(this.view.getInternalEventBus().addListener(x.EventType.KeyDown,
            function(a) {
              return b.emit(x.EventType.KeyDown, a)
            })), this.listenersToRemove.push(this.view.getInternalEventBus().addListener(x.EventType.ViewLayoutChanged,
            function(a) {
              return b.emit(x.EventType.EditorLayout, a)
            })), this.listenersToRemove.push(this.model.addListener(x.EventType.ModelContentChanged, function(a) {
            a.changeType === x.EventType.ModelContentChangedFlush && a.modeChanged && b.emit(x.EventType.ModelModeChanged),
              b.emit("change", {})
          })), this.listenersToRemove.push(this.cursor.addListener(x.EventType.CursorPositionChanged, function(a) {
            return b.emit(x.EventType.CursorPositionChanged, a)
          })), this.listenersToRemove.push(this.cursor.addListener(x.EventType.CursorSelectionChanged, function(a) {
            return b.emit(x.EventType.CursorSelectionChanged, a)
          })), this.listenersToRemove.push(this.configuration.addListener(x.EventType.ConfigurationChanged, function(
            a) {
            return b.emit(x.EventType.ConfigurationChanged, a)
          })), this.listenersToRemove.push(this.model.addListener(x.EventType.ModelDispose, function() {
            b.setModel(null)
          })), this.domElement.appendChild(this.view.domNode), this.view.renderOnce(function() {
            var a;
            for (a in b.contentWidgets) b.contentWidgets.hasOwnProperty(a) && b.view.addContentWidget(b.contentWidgets[
              a]);
            for (a in b.overlayWidgets) b.overlayWidgets.hasOwnProperty(a) && b.view.addOverlayWidget(b.overlayWidgets[
              a]);
            b.view.render(), b.hasView = !0
          })
        } else this.hasView = !1
      }, b.prototype._detachModel = function() {
        this.hasView = !1, this.listenersToRemove.forEach(function(a) {
          a()
        }), this.listenersToRemove = [], this.cursor && (this.cursor.dispose(), this.cursor = null), this.view && (
          this.view.dispose(), this.domElement.removeChild(this.view.domNode), this.view = null), this.viewModel && (
          this.viewModel.dispose(), this.viewModel = null), this.model && (this.model.removeAllDecorationsWithOwnerId(
          this.id), this.model = null)
      }, b
    }(C.EventEmitter);
  b.CodeEditorWidget = R
})