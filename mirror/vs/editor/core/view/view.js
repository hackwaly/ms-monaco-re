var __extends = this.__extends || function(a, b) {
    function d() {
      this.constructor = a;
    }
    for (var c in b) b.hasOwnProperty(c) && (a[c] = b[c]);
    d.prototype = b.prototype;

    a.prototype = new d;
  };

define(["require", "exports", "vs/nls", "vs/base/dom/dom", "vs/base/eventEmitter", "vs/editor/core/constants",
  "vs/editor/core/view/viewContext", "vs/editor/core/controller/keyboardHandler",
  "vs/editor/core/controller/pointerHandler", "vs/editor/core/view/zones/zones",
  "vs/editor/core/view/lines/viewLines", "vs/editor/core/view/overviewRuler/overviewRuler",
  "vs/editor/core/view/overviewRuler/decorationsOverviewRuler", "vs/editor/core/view/viewCursors/viewCursors",
  "vs/editor/core/view/contentWidgets/contentWidgets", "vs/editor/core/view/overlayWidgets/overlayWidgets",
  "vs/editor/core/view/layout/layoutProvider", "vs/editor/core/view/viewEventHandler",
  "vs/editor/core/view/viewEventDispatcher", "vs/editor/core/range", "vs/base/env",
  "vs/editor/core/view/viewController", "vs/editor/core/view/viewOverlays",
  "vs/editor/core/view/selections/selections", "vs/editor/core/view/decorations/decorations",
  "vs/editor/core/view/glyphMargin/glyphMargin", "vs/editor/core/view/linesDecorations/linesDecorations",
  "vs/editor/core/view/lineNumbers/lineNumbers", "vs/base/lifecycle"
], function(a, b, c, d, e, f, g, h, i, j, k, l, m, n, o, p, q, r, s, t, u, v, w, x, y, z, A, B, C) {
  var D = c;

  var E = d;

  var F = e;

  var G = f;

  var H = g;

  var I = h;

  var J = i;

  var K = j;

  var L = k;

  var M = l;

  var N = m;

  var O = n;

  var P = o;

  var Q = p;

  var R = q;

  var S = r;

  var T = s;

  var U = t;

  var V = u;

  var W = v;

  var X = w;

  var Y = x;

  var Z = y;

  var $ = z;

  var _ = A;

  var ab = B;

  var bb = C;

  var cb = function(a) {
    function b(b, c, d, e) {
      var f = this;
      a.call(this);

      this.outgoingEventBus = new F.EventEmitter;
      var g = new W.ViewController(e, d, this.outgoingEventBus);
      this.listenersToRemove = [];

      this.listenersToDispose = [];

      this.eventDispatcher = new T.ViewEventDispatcher(function(a) {
        return f._renderOnce(a);
      });

      this.linesContent = document.createElement("div");

      this.linesContent.className = "lines-content";

      this.domNode = document.createElement("div");

      this.domNode.className = d.getEditorClassName();

      this.layoutProvider = new R.LayoutProvider(c, d, e, this.eventDispatcher, this.linesContent, this.domNode);

      this.eventDispatcher.addEventHandler(this.layoutProvider);

      this.context = new H.ViewContext(b, d, e, this.eventDispatcher, function(a) {
        return f.eventDispatcher.addEventHandler(a);
      }, function(a) {
        return f.eventDispatcher.removeEventHandler(a);
      });

      this.createTextArea();

      this.createViewParts();

      this.keyboardHandler = new I.KeyboardHandler(this.context, g, this.createKeyboardHandlerHelper());

      this.pointerHandler = new J.PointerHandler(this.context, g, this.createPointerHandlerHelper());

      this.hasFocus = !1;

      this.renderOnceCount = 0;

      this.isRendering = !1;

      this.codeEditorHelper = null;

      this.eventDispatcher.addEventHandler(this);

      this.listenersToRemove.push(e.addBulkListener(function(a) {
        return f.eventDispatcher.emitMany(a);
      }));
    }
    __extends(b, a);

    b.prototype.createTextArea = function() {
      var a = this;
      this.textArea = document.createElement("textarea");

      this.textArea.className = H.ClassNames.TEXTAREA;

      this.textArea.setAttribute("wrap", "off");

      this.textArea.setAttribute("autocorrect", "off");

      this.textArea.setAttribute("autocapitalize", "off");

      this.textArea.setAttribute("spellcheck", "false");

      this.textArea.setAttribute("aria-label", D.localize("editorViewAccessibleLabel", "Editor content"));

      this.textArea.style.top = "0px";

      this.textArea.style.left = "0px";

      this.accessiblilityOutput = document.createElement("div");

      this.accessiblilityOutput.className = "accessibility-output";

      this.accessiblilityOutput.setAttribute("aria-live", "assertive");

      this.accessiblilityOutput.setAttribute("aria-label", D.localize("editorViewAccessibleLabel", "Editor content"));

      this.accessiblilityOutput.setAttribute("role", "alert");

      this.listenersToDispose.push(E.addDisposableListener(this.textArea, "focus", function() {
        return a._setHasFocus(!0);
      }));

      this.listenersToDispose.push(E.addDisposableListener(this.textArea, "blur", function() {
        return a._setHasFocus(!1);
      }));

      this.textAreaCover = document.createElement("div");

      this.context.configuration.editor.glyphMargin ? this.textAreaCover.className = H.ClassNames.GLYPH_MARGIN + " " +
        H.ClassNames.TEXTAREA_COVER : this.context.configuration.editor.lineNumbers ? this.textAreaCover.className =
        H.ClassNames.LINE_NUMBERS + " " + H.ClassNames.TEXTAREA_COVER : this.textAreaCover.className =
        "monaco-editor-background " + H.ClassNames.TEXTAREA_COVER;

      this.textAreaCover.style.position = "absolute";

      this.textAreaCover.style.width = "4px";

      this.textAreaCover.style.height = "4px";

      this.textAreaCover.style.top = "0px";

      this.textAreaCover.style.left = "0px";
    };

    b.prototype.createViewParts = function() {
      var a = this;
      this.viewParts = [];

      this.viewLines = new L.ViewLines(this.context, this.layoutProvider);

      this.viewZones = new K.ViewZones(this.context, this.layoutProvider);

      this.viewParts.push(this.viewZones);
      var b = new N.DecorationsOverviewRuler(this.context, this.layoutProvider.getScrollHeight(), function(b) {
        return a.layoutProvider.getVerticalOffsetForLineNumber(b);
      });
      this.viewParts.push(b);
      var c = new X.ViewOverlays(this.context);
      this.viewParts.push(c);

      c.addDynamicOverlay(new $.GlyphMarginOverlay(this.context));

      c.addDynamicOverlay(new _.LinesDecorationsOverlay(this.context));

      c.addDynamicOverlay(new ab.LineNumbersOverlay(this.context));

      c.addDynamicOverlay(new Y.SelectionsOverlay(this.context));

      c.addDynamicOverlay(new Z.DecorationsOverlay(this.context));

      c.addOverlay(new O.ViewCursors(this.context));

      this.contentWidgets = new P.ViewContentWidgets(this.context);

      this.viewParts.push(this.contentWidgets);

      this.overlayWidgets = new Q.ViewOverlayWidgets(this.context);

      this.viewParts.push(this.overlayWidgets);

      this.linesContentContainer = this.layoutProvider.getScrollbarContainerDomNode();

      this.linesContentContainer.style.position = "absolute";
      if (b) {
        var d = this.layoutProvider.getOverviewRulerInsertData();
        d.parent.insertBefore(b.getDomNode(), d.insertBefore);
      }
      this.linesContent.appendChild(this.viewZones.domNode);

      this.linesContent.appendChild(this.viewLines.domNode);

      this.linesContent.appendChild(this.contentWidgets.domNode);

      this.domNode.appendChild(c.domNode);

      this.domNode.appendChild(this.linesContentContainer);

      this.domNode.appendChild(this.overlayWidgets.domNode);

      this.domNode.appendChild(this.textArea);

      this.domNode.appendChild(this.accessiblilityOutput);

      this.domNode.appendChild(this.textAreaCover);
    };

    b.prototype.createPointerHandlerHelper = function() {
      var a = this;
      return {
        viewDomNode: this.domNode,
        linesContentDomNode: this.linesContent,
        textArea: this.textArea,
        getScrollTop: function() {
          return a.layoutProvider.getScrollTop();
        },
        setScrollTop: function(b) {
          return a.layoutProvider.setScrollTop(b);
        },
        getScrollLeft: function() {
          return a.layoutProvider.getScrollLeft();
        },
        setScrollLeft: function(b) {
          return a.layoutProvider.setScrollLeft(b);
        },
        getLineNumberAtVerticalOffset: function(b) {
          return a.layoutProvider.getLineNumberAtVerticalOffset(b);
        },
        getWhitespaceAtVerticalOffset: function(b) {
          return a.layoutProvider.getWhitespaceAtVerticalOffset(b);
        },
        getPositionFromDOMInfo: function(b, c) {
          return a.viewLines.getPositionFromDOMInfo(b, c);
        },
        visibleRangeForPosition2: function(b, c) {
          var d = a.viewLines.visibleRangesForRange2(new U.Range(b, c, b, c), 0, 0, !1);
          if (!d) return null;
          d.next();
          var e = {
            top: d.getTop(),
            left: d.getLeft(),
            width: d.getWidth(),
            height: d.getHeight()
          };
          return e;
        },
        getLineWidth: function(b) {
          return a.viewLines.getLineWidth(b);
        }
      };
    };

    b.prototype.createKeyboardHandlerHelper = function() {
      var a = this;
      return {
        viewDomNode: this.domNode,
        textArea: this.textArea,
        accessiblilityOutput: this.accessiblilityOutput,
        visibleRangeForPositionRelativeToEditor: function(b, c) {
          var d = a.layoutProvider.getLinesViewportData(0);

          var e = a.viewLines.visibleRangesForRange2(new U.Range(b, c, b, c), d.visibleRangesDeltaTop, 0, !1);
          if (!e) return null;
          e.next();
          var f = {
            top: e.getTop(),
            left: e.getLeft(),
            width: e.getWidth(),
            height: e.getHeight()
          };
          return f;
        }
      };
    };

    b.prototype.onLayoutChanged = function(a) {
      this.domNode.style.width = a.width + "px";

      this.domNode.style.height = a.height + "px";

      this.linesContent.style.width = a.contentWidth + "px";

      this.linesContent.style.height = a.contentHeight + "px";

      this.linesContentContainer.style.left = a.contentLeft + "px";

      this.linesContentContainer.style.width = a.contentWidth + "px";

      this.linesContentContainer.style.height = a.contentHeight + "px";

      this.outgoingEventBus.emit(G.EventType.ViewLayoutChanged, a);

      return !1;
    };

    b.prototype.onConfigurationChanged = function(a) {
      this.domNode.className = this.context.configuration.getEditorClassName();

      return !1;
    };

    b.prototype.onScrollChanged = function(a) {
      this.outgoingEventBus.emit("scroll", {
        scrollTop: this.layoutProvider.getScrollTop(),
        scrollLeft: this.layoutProvider.getScrollLeft()
      });

      return !1;
    };

    b.prototype.onViewFocusChanged = function(a) {
      E.toggleClass(this.domNode, "focused", a);

      a ? this.outgoingEventBus.emit(G.EventType.ViewFocusGained, {}) : this.outgoingEventBus.emit(G.EventType.ViewFocusLost, {});

      return !1;
    };

    b.prototype.dispose = function() {
      this.eventDispatcher.removeEventHandler(this);

      this.outgoingEventBus.dispose();

      this.listenersToRemove.forEach(function(a) {
        a();
      });

      this.listenersToRemove = [];

      this.listenersToDispose = bb.disposeAll(this.listenersToDispose);

      this.keyboardHandler.dispose();

      this.pointerHandler.dispose();

      this.viewLines.dispose();
      for (var a = 0, b = this.viewParts.length; a < b; a++) this.viewParts[a].dispose();
      this.viewParts = [];

      this.layoutProvider.dispose();
    };

    b.prototype.getCodeEditorHelper = function() {
      var a = this;
      this.codeEditorHelper || (this.codeEditorHelper = {
        getScrollTop: function() {
          return a.layoutProvider.getScrollTop();
        },
        setScrollTop: function(b) {
          return a.layoutProvider.setScrollTop(b);
        },
        getScrollLeft: function() {
          return a.layoutProvider.getScrollLeft();
        },
        setScrollLeft: function(b) {
          return a.layoutProvider.setScrollLeft(b);
        },
        getLayoutInfo: function() {
          return a.layoutProvider.getLayoutInfo();
        },
        getVerticalOffsetForLineNumber: function(b) {
          return a.layoutProvider.getVerticalOffsetForLineNumber(b);
        },
        delegateVerticalScrollbarMouseDown: function(b) {
          return a.layoutProvider.delegateVerticalScrollbarMouseDown(b);
        },
        getOffsetForColumn: function(b, c) {
          var d = a.viewLines.visibleRangesForRange2(new U.Range(b, c, b, c), 0, 0, !1);
          return d ? (d.next(), d.getLeft()) : -1;
        }
      });

      return this.codeEditorHelper;
    };

    b.prototype.layout = function() {
      var a = this;
      this._renderOnce(function() {
        a.layoutProvider.layout();
      });
    };

    b.prototype.getInternalEventBus = function() {
      return this.outgoingEventBus;
    };

    b.prototype.saveState = function() {
      return this.layoutProvider.saveState();
    };

    b.prototype.restoreState = function(a) {
      return this.layoutProvider.restoreState(a);
    };

    b.prototype.focus = function() {
      this.textArea.focus();

      this._setHasFocus(!0);
    };

    b.prototype.createOverviewRuler = function(a, b, c) {
      var d = this;
      return new M.OverviewRuler(this.context, a, this.layoutProvider.getScrollHeight(), b, c, function(a) {
        return d.layoutProvider.getVerticalOffsetForLineNumber(a);
      });
    };

    b.prototype.change = function(a) {
      var b = this;
      this._renderOnce(function() {
        var c = !1;

        var d = {
          addZone: function(a) {
            c = !0;

            return b.viewZones.addZone(a);
          },
          removeZone: function(a) {
            c = b.viewZones.removeZone(a) || c;
          }
        };

        var e = a(d);
        d.addZone = null;

        d.removeZone = null;

        c && b.context.privateViewEventBus.emit(G.EventType.ViewZonesChanged, null);

        return e;
      });
    };

    b.prototype.addContentWidget = function(a) {
      var b = this;
      this._renderOnce(function() {
        b.contentWidgets.addWidget(a.widget);

        b.layoutContentWidget(a);
      });
    };

    b.prototype.layoutContentWidget = function(a) {
      var b = this;
      this._renderOnce(function() {
        var c = a.position ? a.position.position : null;

        var d = a.position ? a.position.preference : null;
        b.contentWidgets.setWidgetPosition(a.widget, c, d);
      });
    };

    b.prototype.removeContentWidget = function(a) {
      this.contentWidgets.removeWidget(a.widget);
    };

    b.prototype.addOverlayWidget = function(a) {
      this.overlayWidgets.addWidget(a.widget);

      this.layoutOverlayWidget(a);
    };

    b.prototype.layoutOverlayWidget = function(a) {
      var b = a.position ? a.position.preference : null;
      this.overlayWidgets.setWidgetPosition(a.widget, b);
    };

    b.prototype.removeOverlayWidget = function(a) {
      this.overlayWidgets.removeWidget(a.widget);
    };

    b.prototype.render = function() {
      this.layoutProvider.emitLayoutChangedEvent();
    };

    b.prototype.renderOnce = function(a) {
      return this._renderOnce(a);
    };

    b.prototype._renderOnce = function(a) {
      var b = this;
      return this.outgoingEventBus.deferredEmit(function() {
        b.renderOnceCount++;
        try {
          var c = a ? a() : null;
        } finally {
          b.renderOnceCount--;
        }
        if (b.renderOnceCount === 0 && !b.isRendering) try {
          b.isRendering = !0;

          b.actualRender();
        } finally {
          b.isRendering = !1;
        }
        return c;
      });
    };

    b.prototype.createRenderingContext = function(a) {
      var b = this;

      var c = 0;
      if (V.browser.isFirefox || V.browser.isWebKit) c = this.viewLines.getInnerSpansTopOffset(a.startLineNumber);
      var d = this.layoutProvider.getCurrentViewport();

      var e = {
        scrollWidth: this.layoutProvider.getScrollWidth(),
        scrollHeight: this.layoutProvider.getScrollHeight(),
        visibleRange: a.visibleRange,
        viewportWidth: d.width,
        viewportHeight: d.height,
        viewportLeft: d.left,
        getScrolledTopFromAbsoluteTop: function(a) {
          return b.layoutProvider.getScrolledTopFromAbsoluteTop(a);
        },
        getViewportVerticalOffsetForLineNumber: function(a) {
          var c = b.layoutProvider.getVerticalOffsetForLineNumber(a);

          var d = b.layoutProvider.getScrolledTopFromAbsoluteTop(c);
          return d;
        },
        heightInPxForLine: function(a) {
          return b.layoutProvider.heightInPxForLine(a);
        },
        visibleRangesForRange: function(d, e) {
          return b.viewLines.visibleRangesForRange2(d, a.visibleRangesDeltaTop, c, e);
        },
        visibleRangeForPosition: function(d) {
          var e = b.viewLines.visibleRangesForRange2(new U.Range(d.lineNumber, d.column, d.lineNumber, d.column), a.visibleRangesDeltaTop,
            c, !1);
          if (!e) return null;
          e.next();
          var f = {
            top: e.getTop(),
            left: e.getLeft(),
            width: e.getWidth(),
            height: e.getHeight()
          };
          return f;
        },
        visibleRangeForPosition2: function(d, e) {
          var f = b.viewLines.visibleRangesForRange2(new U.Range(d, e, d, e), a.visibleRangesDeltaTop, c, !1);
          if (!f) return null;
          f.next();
          var g = {
            top: f.getTop(),
            left: f.getLeft(),
            width: f.getWidth(),
            height: f.getHeight()
          };
          return g;
        },
        lineIsVisible: function(b) {
          return a.visibleRange.startLineNumber <= b && b <= a.visibleRange.endLineNumber;
        }
      };
      return e;
    };

    b.prototype.actualRender = function() {
      if (!E.isInDOM(this.domNode)) return;
      var a;

      var b;

      var c = this.viewLines.render();

      var d = [];

      var e = this.createRenderingContext(c);
      for (a = 0, b = this.viewParts.length; a < b; a++) d[a] = this.viewParts[a].prepareRender(e);
      for (a = 0, b = this.viewParts.length; a < b; a++) this.viewParts[a].render(d[a], e);
    };

    b.prototype._setHasFocus = function(a) {
      this.hasFocus !== a && (this.hasFocus = a, this.context.privateViewEventBus.emit(G.EventType.ViewFocusChanged,
        this.hasFocus));
    };

    return b;
  }(S.ViewEventHandler);
  b.View = cb;
});