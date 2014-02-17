define('vs/editor/core/view/viewImpl', [
  'require',
  'exports',
  'vs/nls!vs/editor/editor.main',
  'vs/base/dom/dom',
  'vs/base/eventEmitter',
  'vs/editor/core/constants',
  'vs/editor/core/view/viewContext',
  'vs/editor/core/controller/keyboardHandler',
  'vs/editor/core/controller/pointerHandler',
  'vs/editor/core/view/parts/zones/zones',
  'vs/editor/core/view/lines/viewLines',
  'vs/editor/core/view/parts/overviewRuler/overviewRuler',
  'vs/editor/core/view/parts/overviewRuler/decorationsOverviewRuler',
  'vs/editor/core/view/parts/viewCursors/viewCursors',
  'vs/editor/core/view/parts/contentWidgets/contentWidgets',
  'vs/editor/core/view/parts/overlayWidgets/overlayWidgets',
  'vs/editor/core/view/layout/layoutProvider',
  'vs/editor/core/view/viewEventHandler',
  'vs/editor/core/view/viewEventDispatcher',
  'vs/editor/core/range',
  'vs/base/env',
  'vs/base/errors',
  'vs/editor/core/view/viewController',
  'vs/editor/core/view/viewOverlays',
  'vs/editor/core/view/overlays/currentLineHighlight/currentLineHighlight',
  'vs/editor/core/view/overlays/selections/selections',
  'vs/editor/core/view/overlays/decorations/decorations',
  'vs/editor/core/view/overlays/glyphMargin/glyphMargin',
  'vs/editor/core/view/overlays/linesDecorations/linesDecorations',
  'vs/editor/core/view/overlays/lineNumbers/lineNumbers',
  'vs/editor/core/view/overlays/scrollDecoration/scrollDecoration',
  'vs/base/lifecycle'
], function(e, t, n, i, o, r, s, a, u, l, c, d, h, p, f, g, m, v, y, _, b, C, w, E, S, x, L, T, N, M, D, I) {
  var R = function(e) {
    function t(t, n, i) {
      var r = this;
      e.call(this), this.outgoingEventBus = new o.EventEmitter();
      var l = new w.ViewController(i, n, this.outgoingEventBus);
      this.listenersToRemove = [], this.listenersToDispose = [], this.eventDispatcher = new y.ViewEventDispatcher(
        function(e) {
          return r._renderOnce(e);
        }), this.linesContent = document.createElement('div'), this.linesContent.className = s.ClassNames.LINES_CONTENT,
        this.domNode = document.createElement('div'), this.domNode.className = n.getEditorClassName(), this.overflowGuardContainer =
        document.createElement('div'), this.overflowGuardContainer.className = s.ClassNames.OVERFLOW_GUARD, this.layoutProvider =
        new m.LayoutProvider(n, i, this.eventDispatcher, this.linesContent, this.domNode), this.eventDispatcher.addEventHandler(
          this.layoutProvider), this.context = new s.ViewContext(t, n, i, this.eventDispatcher, function(e) {
          return r.eventDispatcher.addEventHandler(e);
        }, function(e) {
          return r.eventDispatcher.removeEventHandler(e);
        }), this.createTextArea(), this.createViewParts(), this.keyboardHandler = new a.KeyboardHandler(this.context,
          l, this.createKeyboardHandlerHelper()), this.pointerHandler = new u.PointerHandler(this.context, l, this.createPointerHandlerHelper()),
        this.hasFocus = !1, this.renderOnceCount = 0, this.isRendering = !1, this.codeEditorHelper = null, this.eventDispatcher
        .addEventHandler(this), this.listenersToRemove.push(i.addBulkListener(function(e) {
          return r.eventDispatcher.emitMany(e);
        }));
    }
    return __extends(t, e), t.prototype.createTextArea = function() {
      var e = this;
      this.textArea = document.createElement('textarea'), this.textArea.className = s.ClassNames.TEXTAREA, this.textArea
        .setAttribute('wrap', 'off'), this.textArea.setAttribute('autocorrect', 'off'), this.textArea.setAttribute(
          'autocapitalize', 'off'), this.textArea.setAttribute('spellcheck', 'false'), this.textArea.setAttribute(
          'aria-label', n.localize('vs_editor_core_view_viewImpl', 0)), this.textArea.setAttribute('role', 'textbox'),
        this.textArea.setAttribute('aria-multiline', 'true'), this.textArea.style.top = '0px', this.textArea.style.left =
        '0px', this.textArea.style.fontSize = this.context.configuration.editor.fontSize + 'px', this.textArea.style.lineHeight =
        this.context.configuration.editor.lineHeight + 'px', this.listenersToDispose.push(i.addDisposableListener(
          this.textArea, 'focus', function() {
            return e._setHasFocus(!0);
          })), this.listenersToDispose.push(i.addDisposableListener(this.textArea, 'blur', function() {
          return e._setHasFocus(!1);
        })), this.textAreaCover = document.createElement('div'), this.textAreaCover.className = this.context.configuration
        .editor.glyphMargin ? s.ClassNames.GLYPH_MARGIN + ' ' + s.ClassNames.TEXTAREA_COVER : this.context.configuration
        .editor.lineNumbers ? s.ClassNames.LINE_NUMBERS + ' ' + s.ClassNames.TEXTAREA_COVER :
        'monaco-editor-background ' + s.ClassNames.TEXTAREA_COVER, this.textAreaCover.style.position = 'absolute',
        this.textAreaCover.style.width = '1px', this.textAreaCover.style.height = '1px', this.textAreaCover.style.top =
        '0px', this.textAreaCover.style.left = '0px';
    }, t.prototype.createViewParts = function() {
      var e = this;
      this.viewParts = [], this.viewLines = new c.ViewLines(this.context, this.layoutProvider), this.viewZones = new l
        .ViewZones(this.context, this.layoutProvider), this.viewParts.push(this.viewZones);
      var t = new h.DecorationsOverviewRuler(this.context, this.layoutProvider.getScrollHeight(), function(t) {
        return e.layoutProvider.getVerticalOffsetForLineNumber(t);
      });
      this.viewParts.push(t);
      var n = new E.ViewOverlays(this.context);
      this.viewParts.push(n), n.addDynamicOverlay(new T.GlyphMarginOverlay(this.context)), n.addDynamicOverlay(new N.LinesDecorationsOverlay(
        this.context)), n.addDynamicOverlay(new M.LineNumbersOverlay(this.context)), n.addDynamicOverlay(new x.SelectionsOverlay(
        this.context)), n.addDynamicOverlay(new L.DecorationsOverlay(this.context)), n.addDynamicOverlay(new D.ScrollDecorationOverlay(
        this.context)), n.addOverlay(new S.CurrentLineHighlightOverlay(this.context)), this.contentWidgets = new f.ViewContentWidgets(
        this.context), this.viewParts.push(this.contentWidgets);
      var i = new p.ViewCursors(this.context);
      if (this.viewParts.push(i), this.overlayWidgets = new g.ViewOverlayWidgets(this.context), this.viewParts.push(
          this.overlayWidgets), this.linesContentContainer = this.layoutProvider.getScrollbarContainerDomNode(), this
        .linesContentContainer.style.position = 'absolute', t) {
        var o = this.layoutProvider.getOverviewRulerInsertData();
        o.parent.insertBefore(t.getDomNode(), o.insertBefore);
      }
      this.linesContent.appendChild(this.viewZones.domNode), this.linesContent.appendChild(this.viewLines.domNode),
        this.linesContent.appendChild(this.contentWidgets.domNode), this.linesContent.appendChild(i.getDomNode()),
        this.overflowGuardContainer.appendChild(n.domNode), this.overflowGuardContainer.appendChild(this.linesContentContainer),
        this.overflowGuardContainer.appendChild(this.overlayWidgets.domNode), this.overflowGuardContainer.appendChild(
          this.textArea), this.overflowGuardContainer.appendChild(this.textAreaCover), this.domNode.appendChild(this.overflowGuardContainer);
    }, t.prototype.createPointerHandlerHelper = function() {
      var e = this;
      return {
        viewDomNode: this.domNode,
        linesContentDomNode: this.linesContent,
        focusTextArea: function() {
          e.focus();
        },
        getScrollTop: function() {
          return e.layoutProvider.getScrollTop();
        },
        setScrollTop: function(t) {
          return e.layoutProvider.setScrollTop(t);
        },
        getScrollLeft: function() {
          return e.layoutProvider.getScrollLeft();
        },
        setScrollLeft: function(t) {
          return e.layoutProvider.setScrollLeft(t);
        },
        getLineNumberAtVerticalOffset: function(t) {
          return e.layoutProvider.getLineNumberAtVerticalOffset(t);
        },
        getWhitespaceAtVerticalOffset: function(t) {
          return e.layoutProvider.getWhitespaceAtVerticalOffset(t);
        },
        shouldSuppressMouseDownOnViewZone: function(t) {
          return e.viewZones.shouldSuppressMouseDownOnViewZone(t);
        },
        getPositionFromDOMInfo: function(t, n) {
          return e._renderNow(), e.viewLines.getPositionFromDOMInfo(t, n);
        },
        visibleRangeForPosition2: function(t, n) {
          e._renderNow();
          var i = e.viewLines.visibleRangesForRange2(new _.Range(t, n, t, n), 0, !1);
          return i ? i[0] : null;
        },
        getLineWidth: function(t) {
          return e._renderNow(), e.viewLines.getLineWidth(t);
        }
      };
    }, t.prototype.createKeyboardHandlerHelper = function() {
      var e = this;
      return {
        viewDomNode: this.domNode,
        textArea: this.textArea,
        visibleRangeForPositionRelativeToEditor: function(t, n) {
          e._renderNow();
          var i = e.layoutProvider.getLinesViewportData(),
            o = e.viewLines.visibleRangesForRange2(new _.Range(t, n, t, n), i.visibleRangesDeltaTop, !1);
          return o ? o[0] : null;
        }
      };
    }, t.prototype.onLayoutChanged = function(e) {
      return this.domNode.style.width = e.width + 'px', this.domNode.style.height = e.height + 'px', this.overflowGuardContainer
        .style.width = e.width + 'px', this.overflowGuardContainer.style.height = e.height + 'px', this.linesContent.style
        .width = e.contentWidth + 'px', this.linesContent.style.height = e.contentHeight + 'px', this.linesContentContainer
        .style.left = e.contentLeft + 'px', this.linesContentContainer.style.width = e.contentWidth + 'px', this.linesContentContainer
        .style.height = e.contentHeight + 'px', this.outgoingEventBus.emit(r.EventType.ViewLayoutChanged, e), !1;
    }, t.prototype.onConfigurationChanged = function() {
      return this.domNode.className = this.context.configuration.getEditorClassName(), this.textArea.style.fontSize =
        this.context.configuration.editor.fontSize + 'px', this.textArea.style.lineHeight = this.context.configuration
        .editor.lineHeight + 'px', !1;
    }, t.prototype.onScrollChanged = function() {
      return this.outgoingEventBus.emit('scroll', {
        scrollTop: this.layoutProvider.getScrollTop(),
        scrollLeft: this.layoutProvider.getScrollLeft()
      }), !1;
    }, t.prototype.onViewFocusChanged = function(e) {
      return i.toggleClass(this.domNode, 'focused', e), e ? this.outgoingEventBus.emit(r.EventType.ViewFocusGained, {}) :
        this.outgoingEventBus.emit(r.EventType.ViewFocusLost, {}), !1;
    }, t.prototype.dispose = function() {
      this.eventDispatcher.removeEventHandler(this), this.outgoingEventBus.dispose(), this.listenersToRemove.forEach(
        function(e) {
          e();
        }), this.listenersToRemove = [], this.listenersToDispose = I.disposeAll(this.listenersToDispose), this.keyboardHandler
        .dispose(), this.pointerHandler.dispose(), this.viewLines.dispose();
      for (var e = 0, t = this.viewParts.length; t > e; e++)
        this.viewParts[e].dispose();
      this.viewParts = [], this.layoutProvider.dispose();
    }, t.prototype.injectTelemetryService = function(e) {
      this.telemetryService = e;
    }, t.prototype.getCodeEditorHelper = function() {
      var e = this;
      return this.codeEditorHelper || (this.codeEditorHelper = {
        getScrollTop: function() {
          return e.layoutProvider.getScrollTop();
        },
        setScrollTop: function(t) {
          return e.layoutProvider.setScrollTop(t);
        },
        getScrollLeft: function() {
          return e.layoutProvider.getScrollLeft();
        },
        setScrollLeft: function(t) {
          return e.layoutProvider.setScrollLeft(t);
        },
        getLayoutInfo: function() {
          return e.layoutProvider.getLayoutInfo();
        },
        getVerticalOffsetForLineNumber: function(t) {
          return e.layoutProvider.getVerticalOffsetForLineNumber(t);
        },
        delegateVerticalScrollbarMouseDown: function(t) {
          return e.layoutProvider.delegateVerticalScrollbarMouseDown(t);
        },
        getOffsetForColumn: function(t, n) {
          e._renderNow();
          var i = e.viewLines.visibleRangesForRange2(new _.Range(t, n, t, n), 0, !1);
          return i ? i[0].left : -1;
        }
      }), this.codeEditorHelper;
    }, t.prototype.getInternalEventBus = function() {
      return this.outgoingEventBus;
    }, t.prototype.saveState = function() {
      return this.layoutProvider.saveState();
    }, t.prototype.restoreState = function(e) {
      return this.layoutProvider.restoreState(e);
    }, t.prototype.focus = function() {
      this.textArea.focus(), i.selectTextInInputElement(this.textArea), this._setHasFocus(!0);
    }, t.prototype.isFocused = function() {
      return this.hasFocus;
    }, t.prototype.createOverviewRuler = function(e, t, n) {
      var i = this;
      return new d.OverviewRuler(this.context, e, this.layoutProvider.getScrollHeight(), t, n, function(e) {
        return i.layoutProvider.getVerticalOffsetForLineNumber(e);
      });
    }, t.prototype.change = function(e) {
      var t = this;
      this._renderOnce(function() {
        var n = !1,
          i = {
            addZone: function(e) {
              return n = !0, t.viewZones.addZone(e);
            },
            removeZone: function(e) {
              n = t.viewZones.removeZone(e) || n;
            }
          }, o = e(i);
        return i.addZone = null, i.removeZone = null, n && t.context.privateViewEventBus.emit(r.EventType.ViewZonesChanged,
          null), o;
      });
    }, t.prototype.addContentWidget = function(e) {
      var t = this;
      this._renderOnce(function() {
        t.contentWidgets.addWidget(e.widget), t.layoutContentWidget(e);
      });
    }, t.prototype.layoutContentWidget = function(e) {
      var t = this;
      this._renderOnce(function() {
        var n = e.position ? e.position.position : null,
          i = e.position ? e.position.preference : null;
        t.contentWidgets.setWidgetPosition(e.widget, n, i);
      });
    }, t.prototype.removeContentWidget = function(e) {
      var t = this;
      this._renderOnce(function() {
        t.contentWidgets.removeWidget(e.widget);
      });
    }, t.prototype.addOverlayWidget = function(e) {
      var t = this;
      this._renderOnce(function() {
        t.overlayWidgets.addWidget(e.widget), t.layoutOverlayWidget(e);
      });
    }, t.prototype.layoutOverlayWidget = function(e) {
      var t = this;
      this._renderOnce(function() {
        var n = e.position ? e.position.preference : null;
        t.overlayWidgets.setWidgetPosition(e.widget, n);
      });
    }, t.prototype.removeOverlayWidget = function(e) {
      var t = this;
      this._renderOnce(function() {
        t.overlayWidgets.removeWidget(e.widget);
      });
    }, t.prototype.render = function() {
      this.layoutProvider.emitLayoutChangedEvent();
    }, t.prototype.renderOnce = function(e) {
      return this._renderOnce(e);
    }, t.prototype._renderOnce = function(e) {
      var t = this;
      return this.outgoingEventBus.deferredEmit(function() {
        t.renderOnceCount++;
        try {
          var n = e ? e() : null;
        } finally {
          t.renderOnceCount--;
        }
        if (0 === t.renderOnceCount && !t.isRendering)
          try {
            t.isRendering = !0, t._scheduleRender();
          } finally {
            t.isRendering = !1;
          }
        return n;
      });
    }, t.prototype._scheduleRender = function() {
      var e = this;
      this._shouldRender = !0, i.runAtThisOrScheduleAtNextAnimationFrame(function() {
        e._renderNow();
      });
    }, t.prototype._renderNow = function() {
      var e = this;
      this._shouldRender && (this._shouldRender = !1, this.outgoingEventBus.deferredEmit(function() {
        e.actualRender();
      }));
    }, t.prototype.createRenderingContext = function(e) {
      var t = this,
        n = this.layoutProvider.getCurrentViewport(),
        i = {
          scrollWidth: this.layoutProvider.getScrollWidth(),
          scrollHeight: this.layoutProvider.getScrollHeight(),
          visibleRange: e.visibleRange,
          viewportWidth: n.width,
          viewportHeight: n.height,
          viewportLeft: n.left,
          getScrolledTopFromAbsoluteTop: function(e) {
            return t.layoutProvider.getScrolledTopFromAbsoluteTop(e);
          },
          getViewportVerticalOffsetForLineNumber: function(e) {
            var n = t.layoutProvider.getVerticalOffsetForLineNumber(e),
              i = t.layoutProvider.getScrolledTopFromAbsoluteTop(n);
            return i;
          },
          heightInPxForLine: function(e) {
            return t.layoutProvider.heightInPxForLine(e);
          },
          visibleRangesForRange: function(n, i) {
            return t.viewLines.visibleRangesForRange2(n, e.visibleRangesDeltaTop, i);
          },
          visibleRangeForPosition: function(n) {
            var i = t.viewLines.visibleRangesForRange2(new _.Range(n.lineNumber, n.column, n.lineNumber, n.column), e
              .visibleRangesDeltaTop, !1);
            return i ? i[0] : null;
          },
          visibleRangeForPosition2: function(n, i) {
            var o = t.viewLines.visibleRangesForRange2(new _.Range(n, i, n, i), e.visibleRangesDeltaTop, !1);
            return o ? o[0] : null;
          },
          lineIsVisible: function(t) {
            return e.visibleRange.startLineNumber <= t && t <= e.visibleRange.endLineNumber;
          }
        };
      return i;
    }, t.prototype.actualRender = function() {
      if (i.isInDOM(this.domNode)) {
        var e, t, n = !1;
        b.enableTelemetry && (n = !0);
        var o = null,
          r = new Date().getTime();
        try {
          if (n) {
            var s = this.layoutProvider.getLayoutInfo();
            o = {
              lines: {
                editorWidth: s.width,
                editorHeight: s.height,
                totalVisibleLinesCount: 0,
                totalVisiblePartsCount: 0,
                totalVisibleCharactersCount: 0,
                renderedVisibleLinesCount: 0,
                renderedVisiblePartsCount: 0,
                renderedVisibleCharactersCount: 0,
                time: 0
              },
              parts: {
                renderedContentWidgets: 0,
                renderedOverlayWidgets: 0,
                renderedDecorationsPieces: 0,
                renderedMarginGlyphs: 0,
                renderedLinesDecorations: 0,
                renderedSelectionPieces: 0,
                renderedViewZones: 0,
                time: 0
              },
              time: 0
            };
          }
          var a = new Date().getTime();
          for (e = 0, t = this.viewParts.length; t > e; e++)
            this.viewParts[e].onBeforeForcedLayout();
          var u = this.viewLines.render(n ? o.lines : null);
          n && (o.lines.time = new Date().getTime() - a);
          var l = this.createRenderingContext(u),
            c = new Date().getTime();
          for (e = 0, t = this.viewParts.length; t > e; e++)
            this.viewParts[e].onReadAfterForcedLayout(l, n ? o.parts : null);
          for (e = 0, t = this.viewParts.length; t > e; e++)
            this.viewParts[e].onWriteAfterForcedLayout();
          n && (o.parts.time = new Date().getTime() - c, o.time = new Date().getTime() - r, o.time >= 100 && this.telemetryService &&
            this.telemetryService.publicLog('editorSlowRender', o));
        } catch (d) {
          C.onUnexpectedError(d);
        }
      }
    }, t.prototype._setHasFocus = function(e) {
      this.hasFocus !== e && (this.hasFocus = e, this.context.privateViewEventBus.emit(r.EventType.ViewFocusChanged,
        this.hasFocus));
    }, t;
  }(v.ViewEventHandler);
  t.View = R;
})