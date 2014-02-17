define("vs/editor/core/codeEditorWidget", ["require", "exports", "vs/base/lib/winjs.base", "vs/editor/core/constants",
  "vs/editor/core/internalConstants", "vs/base/objects", "vs/base/types", "vs/platform/platform", "vs/base/dom/dom",
  "vs/base/eventEmitter", "vs/editor/core/config/configuration", "vs/editor/core/controller/cursor",
  "vs/editor/core/view/viewImpl", "vs/editor/core/view/model/characterHardWrappingLineMapper",
  "vs/editor/core/view/model/splitLinesCollection", "vs/editor/core/view/model/viewModel", "vs/editor/core/position",
  "vs/editor/core/range", "vs/editor/core/selection", "vs/base/performance/timer", "vs/editor/editorExtensions",
  "vs/base/ui/actions", "vs/editor/editor", "vs/css!./../css/editor", "vs/css!./../css/default-theme"
], function(e, t, n, i, o, r, s, a, u, l, c, d, h, p, f, g, m, v, y, _, b, C) {
  var w = 0;

  var E = function(e) {
    function t(t, n, i) {
      var o = this;
      e.call(this);
      var r = _.start(0, "CodeEditor.ctor");
      this.id = ++w;

      this.domElement = t;

      this._lifetimeListeners = [];

      n = n || {};
      var l = null;
      if (n.model) {
        l = n.model;
        delete n.model;
      }

      this.configuration = new c.Configuration(n, t, function(e) {
        return o.model ? o.model.guessIndentation(e) : null;
      });

      this.forcedWidgetFocusCount = 0;

      this.focusTracker = u.trackFocus(this.domElement);

      this.focusTracker.addFocusListener(function() {
        if (0 === o.forcedWidgetFocusCount) {
          o.emit("widgetFocus", {});
        }
      });

      this.focusTracker.addBlurListener(function() {
        if (0 === o.forcedWidgetFocusCount) {
          o.emit("widgetBlur", {});
        }
      });

      this.handlerService = null;

      this.injectorService = i;

      if (i && s.isFunction(i.injectTo)) {
        i.injectTo(this);
      }

      if (this.handlerService) {
        this.bindings = this.configuration.bindKeys(this.handlerService);
        this.bindings.deactivate();
        this._lifetimeListeners.push(this.addListener("blur", function() {
          return o.bindings.deactivate();
        }));
        this._lifetimeListeners.push(this.addListener("focus", function() {
          return o.bindings.activate();
        }));
      } else {
        this.bindings = null;
      }

      this._attachModel(l);

      this.contentWidgets = {};

      this.overlayWidgets = {};

      this.contributions = {};
      for (var d = a.Registry.as(b.Extensions.EditorContributions), h = d.getEditorContributions(), p = 0, f = h.length; f >
        p; p++) {
        var g = h[p];

        var m = g.createNew(this, g);
        if (i && s.isFunction(i.injectTo)) {
          i.injectTo(m);
        }

        this.contributions[m.getId()] = m;
      }
      r.stop();
    }
    __extends(t, e);

    t.prototype.getEditorType = function() {
      return i.EditorType.ICodeEditor;
    };

    t.prototype.injectHandlerService = function(e) {
      this.handlerService = e;
    };

    t.prototype.destroy = function() {
      this.dispose();
    };

    t.prototype.dispose = function() {
      for (; this._lifetimeListeners.length > 0;) {
        this._lifetimeListeners.pop()();
      }
      var t;
      for (t in this.contributions) {
        if (this.contributions.hasOwnProperty(t)) {
          this.contributions[t].dispose();
        }
      }
      this.contributions = {};

      this.contentWidgets = {};

      this.overlayWidgets = {};

      if (this.bindings) {
        this.bindings.dispose();
        this.bindings = null;
      }

      this.focusTracker.dispose();

      this._postDetachModelCleanup(this._detachModel());

      this.configuration.dispose();

      this.emit(i.EventType.Disposed, {});

      e.prototype.dispose.call(this);
    };

    t.prototype.updateOptions = function(e) {
      this.configuration.updateOptions(e);
    };

    t.prototype.getConfiguration = function() {
      return r.clone(this.configuration.editor);
    };

    t.prototype.getRawConfiguration = function() {
      return this.configuration.getRawOptions();
    };

    t.prototype.getIndentationOptions = function() {
      return r.clone(this.configuration.getIndentationOptions());
    };

    t.prototype.normalizeIndentation = function(e) {
      return this.configuration.normalizeIndentation(e);
    };

    t.prototype.getValue = function(e) {
      if ("undefined" == typeof e && (e = null), this.model) {
        var t = e && e.preserveBOM ? !0 : !1;

        var n = 0;
        e && e.lineEnding && "\n" === e.lineEnding ? n = 1 : e && e.lineEnding && "\r\n" === e.lineEnding && (n = 2);

        return this.model.getValue(n, t);
      }
      return "";
    };

    t.prototype.setValue = function(e) {
      if (this.model) {
        this.model.setValue(e);
      }
    };

    t.prototype.getView = function() {
      return this._view;
    };

    t.prototype.getModel = function() {
      return this.model;
    };

    t.prototype.setModel = function(e) {
      if ("undefined" == typeof e && (e = null), this.model !== e) {
        var t = this._detachModel();
        this._attachModel(e);

        this.emit(i.EventType.ModelChanged);

        this._postDetachModelCleanup(t);
      }
    };

    t.prototype.getDomNode = function() {
      return this.hasView ? this._view.domNode : null;
    };

    t.prototype.getPosition = function() {
      return this.cursor ? this.cursor.getPosition().clone() : null;
    };

    t.prototype.setPosition = function(e, t, n, i) {
      if ("undefined" == typeof t && (t = !1), "undefined" == typeof n && (n = !1), "undefined" == typeof i && (i = !
        1), this.cursor) {
        if (!m.isIPosition(e)) throw new Error("Invalid arguments");
        this.cursor.setSelections("api", [{
          selectionStartLineNumber: e.lineNumber,
          selectionStartColumn: e.column,
          positionLineNumber: e.lineNumber,
          positionColumn: e.column
        }]);

        if (t) {
          this.revealPosition(e, n, i);
        }
      }
    };

    t.prototype.revealPosition = function(e, t, n) {
      if ("undefined" == typeof t && (t = !1), "undefined" == typeof n && (n = !1), !m.isIPosition(e)) throw new Error(
        "Invalid arguments");
      this.revealRange({
        startLineNumber: e.lineNumber,
        startColumn: e.column,
        endLineNumber: e.lineNumber,
        endColumn: e.column
      }, t, n);
    };

    t.prototype.getSelection = function() {
      return this.cursor ? this.cursor.getSelection().clone() : null;
    };

    t.prototype.getSelections = function() {
      if (!this.cursor) {
        return null;
      }
      for (var e = this.cursor.getSelections(), t = [], n = 0, i = e.length; i > n; n++) {
        t[n] = e[n].clone();
      }
      return t;
    };

    t.prototype.setSelection = function(e, t, n, i) {
      if ("undefined" == typeof t) {
        t = !1;
      }

      if ("undefined" == typeof n) {
        n = !1;
      }

      if ("undefined" == typeof i) {
        i = !1;
      }
      var o = y.isISelection(e);

      var r = v.isIRange(e);
      if (!o && !r) throw new Error("Invalid arguments");
      if (o) {
        this._setSelectionImpl(e, t, n, i);
      } else if (r) {
        var s = {
          selectionStartLineNumber: e.startLineNumber,
          selectionStartColumn: e.startColumn,
          positionLineNumber: e.endLineNumber,
          positionColumn: e.endColumn
        };
        this._setSelectionImpl(s, t, n, i);
      }
    };

    t.prototype._setSelectionImpl = function(e, t, n, i) {
      if (this.cursor) {
        var o = new y.Selection(e.selectionStartLineNumber, e.selectionStartColumn, e.positionLineNumber, e.positionColumn);
        this.cursor.setSelections("api", [o]);

        if (t) {
          this.revealRange(o, n, i);
        }
      }
    };

    t.prototype.revealRange = function(e, t, n) {
      if ("undefined" == typeof t && (t = !1), "undefined" == typeof n && (n = !1), this.model && this.cursor) {
        if (!v.isIRange(e)) throw new Error("Invalid arguments");
        var o = this.model.validateRange(e);

        var r = {
          range: o,
          viewRange: null,
          revealVerticalInCenter: t,
          revealHorizontal: n
        };
        this.cursor.emit(i.EventType.CursorRevealRange, r);
      }
    };

    t.prototype.setSelections = function(e) {
      if (this.cursor) {
        if (!e || 0 === e.length) throw new Error("Invalid arguments");
        for (var t = 0, n = e.length; n > t; t++)
          if (!y.isISelection(e[t])) throw new Error("Invalid arguments");
        this.cursor.setSelections("api", e);
      }
    };

    t.prototype.setScrollTop = function(e) {
      if (this.hasView) {
        if ("number" != typeof e) throw new Error("Invalid arguments");
        this._view.getCodeEditorHelper().setScrollTop(e);
      }
    };

    t.prototype.getScrollTop = function() {
      return this.hasView ? this._view.getCodeEditorHelper().getScrollTop() : -1;
    };

    t.prototype.delegateVerticalScrollbarMouseDown = function(e) {
      if (this.hasView) {
        this._view.getCodeEditorHelper().delegateVerticalScrollbarMouseDown(e);
      }
    };

    t.prototype.setScrollLeft = function(e) {
      if (this.hasView) {
        if ("number" != typeof e) throw new Error("Invalid arguments");
        this._view.getCodeEditorHelper().setScrollLeft(e);
      }
    };

    t.prototype.getScrollLeft = function() {
      return this.hasView ? this._view.getCodeEditorHelper().getScrollLeft() : -1;
    };

    t.prototype.saveViewState = function() {
      if (!this.cursor || !this.hasView) {
        return null;
      }
      var e = this.cursor.saveState();

      var t = this._view.saveState();
      return {
        cursorState: e,
        viewState: t
      };
    };

    t.prototype.restoreViewState = function(e) {
      if (this.cursor && this.hasView) {
        var t = e;
        if (t && t.cursorState && t.viewState) {
          var n = t;

          var i = n.cursorState;
          if (s.isArray(i)) {
            this.cursor.restoreState(i);
          } else {
            this.cursor.restoreState([i]);
          }

          this._view.restoreState(n.viewState);
        }
      }
    };

    t.prototype.layout = function() {
      this.configuration.observeReferenceElement();
    };

    t.prototype.onVisible = function() {};

    t.prototype.onHide = function() {};

    t.prototype.focus = function() {
      if (this.hasView) {
        this._view.focus();
      }
    };

    t.prototype.beginForcedWidgetFocus = function() {
      this.forcedWidgetFocusCount++;
    };

    t.prototype.endForcedWidgetFocus = function() {
      this.forcedWidgetFocusCount--;
    };

    t.prototype.isFocused = function() {
      return this.hasView && this._view.isFocused();
    };

    t.prototype.getContribution = function(e) {
      return this.contributions[e] || null;
    };

    t.prototype.getActions = function() {
      var e;

      var t = [];
      for (e in this.contributions)
        if (this.contributions.hasOwnProperty(e)) {
          var n = this.contributions[e];
          if (C.isAction(n)) {
            t.push(n);
          }
        }
      return t;
    };

    t.prototype.getAction = function(e) {
      var t = this.contributions[e];
      return t && C.isAction(t) ? t : null;
    };

    t.prototype.trigger = function(e, t, i) {
      var o = this.getAction(t);
      if (null !== o) {
        if (o.enabled) {
          n.Promise.as(o.run()).done();
        }
      } else {
        this.configuration.handlerDispatcher.trigger(e, t, i);
      }
    };

    t.prototype.executeCommand = function(e, t) {
      return this.configuration.handlerDispatcher.trigger(e, o.Handler.ExecuteCommand, t);
    };

    t.prototype.executeCommands = function(e, t) {
      return this.configuration.handlerDispatcher.trigger(e, o.Handler.ExecuteCommands, t);
    };

    t.prototype.addContentWidget = function(e) {
      var t = {
        widget: e,
        position: e.getPosition()
      };
      this.contentWidgets[e.getId()] = t;

      if (this.hasView) {
        this._view.addContentWidget(t);
      }
    };

    t.prototype.layoutContentWidget = function(e) {
      var t = e.getId();
      if (this.contentWidgets.hasOwnProperty(t)) {
        var n = this.contentWidgets[t];
        n.position = e.getPosition();

        if (this.hasView) {
          this._view.layoutContentWidget(n);
        }
      }
    };

    t.prototype.removeContentWidget = function(e) {
      var t = e.getId();
      if (this.contentWidgets.hasOwnProperty(t)) {
        var n = this.contentWidgets[t];
        delete this.contentWidgets[t];

        if (this.hasView) {
          this._view.removeContentWidget(n);
        }
      }
    };

    t.prototype.addOverlayWidget = function(e) {
      var t = {
        widget: e,
        position: e.getPosition()
      };
      this.overlayWidgets[e.getId()] = t;

      if (this.hasView) {
        this._view.addOverlayWidget(t);
      }
    };

    t.prototype.layoutOverlayWidget = function(e) {
      var t = e.getId();
      if (this.overlayWidgets.hasOwnProperty(t)) {
        var n = this.overlayWidgets[t];
        n.position = e.getPosition();

        if (this.hasView) {
          this._view.layoutOverlayWidget(n);
        }
      }
    };

    t.prototype.removeOverlayWidget = function(e) {
      var t = e.getId();
      if (this.overlayWidgets.hasOwnProperty(t)) {
        var n = this.overlayWidgets[t];
        delete this.overlayWidgets[t];

        if (this.hasView) {
          this._view.removeOverlayWidget(n);
        }
      }
    };

    t.prototype.changeDecorations = function(e) {
      return this.model ? this.model.changeDecorations(e, this.id) : null;
    };

    t.prototype.getLineDecorations = function(e) {
      return this.model ? this.model.getLineDecorations(e, this.id, this.configuration.editor.readOnly) : null;
    };

    t.prototype.deltaDecorations = function(e, t) {
      return this.model ? this.model.deltaDecorations(e, t, this.id) : [];
    };

    t.prototype.changeViewZones = function(e) {
      if (this.hasView) {
        this._view.change(e);
      }
    };

    t.prototype.addTypingListener = function(e, t) {
      var n = this;
      return this.cursor ? (this.cursor.addTypingListener(e, t), function() {
        if (n.cursor) {
          n.cursor.removeTypingListener(e, t);
        }
      }) : null;
    };

    t.prototype.getTopForLineNumber = function(e) {
      return this.hasView ? this._view.getCodeEditorHelper().getVerticalOffsetForLineNumber(e) : -1;
    };

    t.prototype.getScrolledVisiblePosition = function(e) {
      if (!this.hasView) {
        return null;
      }
      var t = this.model.validatePosition(e);

      var n = this._view.getCodeEditorHelper();

      var i = n.getLayoutInfo();

      var o = n.getVerticalOffsetForLineNumber(t.lineNumber) - n.getScrollTop();

      var r = n.getOffsetForColumn(t.lineNumber, t.column) + i.glyphMarginWidth + i.lineNumbersWidth + i.decorationsWidth -
        n.getScrollLeft();
      return {
        top: o,
        left: r,
        height: this.configuration.editor.lineHeight
      };
    };

    t.prototype.getOffsetForColumn = function(e, t) {
      return this.hasView ? this._view.getCodeEditorHelper().getOffsetForColumn(e, t) : -1;
    };

    t.prototype.getLayoutInfo = function() {
      return this.hasView ? this._view.getCodeEditorHelper().getLayoutInfo() : null;
    };

    t.prototype._attachModel = function(e) {
      var t = this;
      if (this.model = e ? e : null, this.listenersToRemove = [], this._view = null, this.viewModel = null, this.cursor =
        null, this.model) {
        this.model.setStopLineTokenizationAfter(this.configuration.editor.stopLineTokenizationAfter);

        this.configuration.setIsDominatedByLongLines(this.model.isDominatedByLongLines(this.configuration.editor.longLineBoundary));

        this.configuration.resetIndentationOptions();
        var n = this.configuration.getWrappingColumn();

        var o = -1;
        if (n > 0) {
          o = n;
        }
        var r = new p.CharacterHardWrappingLineMapperFactory(this.configuration.editor.wordWrapBreakBeforeCharacters,
          this.configuration.editor.wordWrapBreakAfterCharacters, this.configuration.editor.wordWrapBreakObtrusiveCharacters
        );

        var s = new f.SplitLinesCollection(this.model, r, this.configuration.getIndentationOptions().tabSize, o);
        this.viewModel = new g.ViewModel(s, this.id, this.configuration, this.model);
        var a = {
          viewModel: this.viewModel,
          convertModelPositionToViewPosition: function(e, n) {
            return t.viewModel.convertModelPositionToViewPosition(e, n);
          },
          convertViewToModelPosition: function(e, n) {
            return t.viewModel.convertViewPositionToModelPosition(e, n);
          },
          validateViewPosition: function(e, n, i) {
            return t.viewModel.validateViewPosition(e, n, i);
          }
        };
        this.cursor = new d.Cursor(this.id, this.configuration, this.model, function(e) {
          return t._view.renderOnce(e);
        }, a);

        this.viewModel.addEventSource(this.cursor);

        this._view = new h.View(this.id, this.configuration, this.viewModel);

        if (this.injectorService) {
          this.injectorService.injectTo(this._view);
        }

        this.listenersToRemove.push(this._view.getInternalEventBus().addListener(i.EventType.ViewFocusGained,
          function() {
            t.emit("focus");

            t.emit("widgetFocus", {});
          }));

        this.listenersToRemove.push(this._view.getInternalEventBus().addListener("scroll", function(e) {
          return t.emit("scroll", e);
        }));

        this.listenersToRemove.push(this._view.getInternalEventBus().addListener(i.EventType.ViewFocusLost, function() {
          return t.emit("blur");
        }));

        this.listenersToRemove.push(this._view.getInternalEventBus().addListener(i.EventType.ContextMenu, function(e) {
          return t.emit(i.EventType.ContextMenu, e);
        }));

        this.listenersToRemove.push(this._view.getInternalEventBus().addListener(i.EventType.MouseDown, function(e) {
          return t.emit(i.EventType.MouseDown, e);
        }));

        this.listenersToRemove.push(this._view.getInternalEventBus().addListener(i.EventType.MouseUp, function(e) {
          return t.emit(i.EventType.MouseUp, e);
        }));

        this.listenersToRemove.push(this._view.getInternalEventBus().addListener(i.EventType.KeyUp, function(e) {
          return t.emit(i.EventType.KeyUp, e);
        }));

        this.listenersToRemove.push(this._view.getInternalEventBus().addListener(i.EventType.MouseMove, function(e) {
          return t.emit(i.EventType.MouseMove, e);
        }));

        this.listenersToRemove.push(this._view.getInternalEventBus().addListener(i.EventType.MouseLeave, function(e) {
          return t.emit(i.EventType.MouseLeave, e);
        }));

        this.listenersToRemove.push(this._view.getInternalEventBus().addListener(i.EventType.KeyDown, function(e) {
          return t.emit(i.EventType.KeyDown, e);
        }));

        this.listenersToRemove.push(this._view.getInternalEventBus().addListener(i.EventType.ViewLayoutChanged,
          function(e) {
            return t.emit(i.EventType.EditorLayout, e);
          }));

        this.listenersToRemove.push(this.model.addListener(i.EventType.ModelDecorationsChanged, function(e) {
          t.emit(i.EventType.ModelDecorationsChanged, e);
        }));

        this.listenersToRemove.push(this.model.addListener(i.EventType.ModelContentChanged, function(e) {
          if (e.changeType === i.EventType.ModelContentChangedFlush && e.modeChanged) {
            t.emit(i.EventType.ModelModeChanged);
          }

          t.emit("change", {});
        }));

        this.listenersToRemove.push(this.cursor.addListener(i.EventType.CursorPositionChanged, function(e) {
          return t.emit(i.EventType.CursorPositionChanged, e);
        }));

        this.listenersToRemove.push(this.cursor.addListener(i.EventType.CursorSelectionChanged, function(e) {
          return t.emit(i.EventType.CursorSelectionChanged, e);
        }));

        this.listenersToRemove.push(this.configuration.addListener(i.EventType.ConfigurationChanged, function(e) {
          return t.emit(i.EventType.ConfigurationChanged, e);
        }));

        this.listenersToRemove.push(this.model.addListener(i.EventType.ModelDispose, function() {
          t.setModel(null);
        }));

        this.domElement.appendChild(this._view.domNode);

        this._view.renderOnce(function() {
          var e;
          for (e in t.contentWidgets) {
            if (t.contentWidgets.hasOwnProperty(e)) {
              t._view.addContentWidget(t.contentWidgets[e]);
            }
          }
          for (e in t.overlayWidgets) {
            if (t.overlayWidgets.hasOwnProperty(e)) {
              t._view.addOverlayWidget(t.overlayWidgets[e]);
            }
          }
          t._view.render();

          t.hasView = !0;
        });
      } else {
        this.hasView = !1;
      }
    };

    t.prototype._postDetachModelCleanup = function(e) {
      if (e) {
        e.removeAllDecorationsWithOwnerId(this.id);
      }
    };

    t.prototype._detachModel = function() {
      this.hasView = !1;

      this.listenersToRemove.forEach(function(e) {
        e();
      });

      this.listenersToRemove = [];

      if (this.cursor) {
        this.cursor.dispose();
        this.cursor = null;
      }

      if (this._view) {
        this._view.dispose();
        this.domElement.removeChild(this._view.domNode);
        this._view = null;
      }

      if (this.viewModel) {
        this.viewModel.dispose();
        this.viewModel = null;
      }
      var e = this.model;
      this.model = null;

      return e;
    };

    return t;
  }(l.EventEmitter);
  t.CodeEditorWidget = E;
});