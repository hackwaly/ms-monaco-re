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

define(["require", "exports", "vs/editor/core/constants", "vs/editor/core/view/layout/lines/linesLayout",
  "vs/editor/core/view/viewEventHandler", "vs/editor/core/view/layout/elementSizeObserver",
  "vs/editor/core/view/layout/characterSizeProvider", "vs/editor/core/view/layout/editorLayoutProvider",
  "vs/editor/core/view/layout/scroll/scrollManager"
], function(a, b, c, d, e, f, g, h, i) {
  var j = c;

  var k = d;

  var l = e;

  var m = f;

  var n = g;

  var o = h;

  var p = i;

  var q = function(a) {
    function b(b, c, d, e, f, g) {
      var h = this;
      a.call(this);

      this.configuration = c;

      this.privateViewEventBus = e;

      this.model = d;

      this.scrollManager = new p.ScrollManager(c, e, f, g);

      this.charSizeProvider = new n.CharacterSizeProvider(this.configuration);

      this.editorLayoutProvider = new o.EditorLayoutProvider(-1, -1, this.configuration.editor.lineHeight, this.configuration
        .editor.glyphMargin, this.configuration.editor.lineNumbers, this.configuration.editor.lineNumbersMinChars,
        this.charSizeProvider.maxDigitWidth());

      this.editorLayoutProvider.setLineCount(this.model.getLineCount());

      this.editorLayoutProvider.setScrollbarSize(this.scrollManager.getVerticalScrollbarWidth(), this.scrollManager.getHorizontalScrollbarHeight());

      this.elementSizeObserver = new m.ElementSizeObserver(b, function(a, b) {
        return h._onContainerSizeChanged(a, b);
      });

      if (this.configuration.editor.automaticLayout) {
        this.elementSizeObserver.startObserving();
      }

      this.linesLayout = new k.LinesLayout(c, d, this.getLayoutInfo().contentWidth);

      this._updatePageSize();

      this._updateHeight();
    }
    __extends(b, a);

    b.prototype.dispose = function() {
      this.elementSizeObserver.dispose();

      this.scrollManager.dispose();
    };

    b.prototype.layout = function() {
      this.elementSizeObserver.observe();
    };

    b.prototype.updateLineCount = function() {
      var a = this.editorLayoutProvider.setLineCount(this.model.getLineCount());
      if (a) {
        this._emitLayoutChangedEvent();
      }
    };

    b.prototype.onZonesChanged = function() {
      this._updateHeight();

      return !1;
    };

    b.prototype.onModelFlushed = function() {
      this.linesLayout.onModelFlushed();

      this.updateLineCount();

      this._updateHeight();

      return !1;
    };

    b.prototype.onModelLinesDeleted = function(a) {
      this.linesLayout.onModelLinesDeleted(a);

      this.updateLineCount();

      this._updateHeight();

      return !1;
    };

    b.prototype.onModelLineChanged = function(a) {
      this.linesLayout.onModelLineChanged(a);

      return !1;
    };

    b.prototype.onModelLinesInserted = function(a) {
      this.linesLayout.onModelLinesInserted(a);

      this.updateLineCount();

      this._updateHeight();

      return !1;
    };

    b.prototype.onConfigurationChanged = function(a) {
      var b = this.editorLayoutProvider.setShowLineNumbers(this.configuration.editor.lineNumbers);
      b = this.editorLayoutProvider.setLineNumbersMinChars(this.configuration.editor.lineNumbersMinChars) || b;

      b = this.editorLayoutProvider.setGlyphMargin(this.configuration.editor.glyphMargin) || b;

      this._updateWrappingColumn(this.getLayoutInfo());

      b && this._emitLayoutChangedEvent();

      this.linesLayout.onConfigurationChanged(a);

      this._updateHeight();

      return !1;
    };

    b.prototype.onConfigurationLineHeightChanged = function() {
      this._updatePageSize();
      var a = this.editorLayoutProvider.setLineHeight(this.configuration.editor.lineHeight);
      a && this._emitLayoutChangedEvent();

      this._updateHeight();

      return !1;
    };

    b.prototype.onConfigurationFontChanged = function() {
      var a = this.charSizeProvider.doMeasurements();
      if (a) {
        var b = this.editorLayoutProvider.setMaxDigitWidth(this.charSizeProvider.maxDigitWidth());
        if (b) {
          this._emitLayoutChangedEvent();
        }
      }
      this._updateWrappingColumn(this.getLayoutInfo());

      return !1;
    };

    b.prototype._updateHeight = function() {
      var a = this.scrollManager.getScrollHeight();
      this.scrollManager.setScrollHeight(this.getTotalHeight());
      var b = this.scrollManager.getScrollHeight();
      if (a !== b) {
        this.privateViewEventBus.emit(j.EventType.ViewScrollHeightChanged, b);
      }
    };

    b.prototype._updateWrappingColumn = function(a) {
      var b = this.configuration.getWrappingColumn();

      var c = -1;
      if (b === 0) {
        c = Math.max(1, Math.floor(a.contentWidth / this.configuration.editor.thinnestCharacterWidth));
      } else {
        if (b > 0) {
          c = b;
        }
      }

      this.model.setWrappingColumn(c);
    };

    b.prototype._onContainerSizeChanged = function(a, b) {
      var c = this.editorLayoutProvider.setDimensions(a, b);
      if (c) {
        this._updatePageSize();
        this._emitLayoutChangedEvent();
      }
    };

    b.prototype._updatePageSize = function() {
      var a = this.editorLayoutProvider.getLayoutInfo();
      this.configuration.editor.pageSize = Math.floor(a.height / this.configuration.editor.lineHeight) - 2;
    };

    b.prototype.getLayoutInfo = function() {
      var a = this.editorLayoutProvider.getLayoutInfo();

      var b = this.scrollManager.getOverviewRulerLayoutInfo();
      a.overviewRuler = {
        top: b.top,
        width: b.width,
        height: a.height - b.top - b.bottom,
        right: 0
      };

      return a;
    };

    b.prototype.getCurrentViewport = function() {
      var a = this.editorLayoutProvider.getLayoutInfo();
      return {
        top: this.scrollManager.getScrollTop(),
        left: this.scrollManager.getScrollLeft(),
        width: a.contentWidth,
        height: a.contentHeight
      };
    };

    b.prototype._emitLayoutChangedEvent = function() {
      this.scrollManager.onSizeProviderLayoutChanged();
      var a = this.getLayoutInfo();
      if (this.linesLayout) {
        this.linesLayout.onWrappingWidthChanged(a.contentWidth);
      }

      this.scrollManager.setWidth(a.contentWidth);

      this.scrollManager.setHeight(a.contentHeight);

      this._updateWrappingColumn(a);

      this.privateViewEventBus.emit(j.EventType.ViewLayoutChanged, a);
    };

    b.prototype.emitLayoutChangedEvent = function() {
      this._emitLayoutChangedEvent();
    };

    b.prototype._computeScrollWidth = function(a, c) {
      var d = this.configuration.getWrappingColumn();

      var e = d === 0;
      return !this.configuration.editor.viewWordWrap && !e ? Math.max(a + b.LINES_HORIZONTAL_EXTRA_PX, c) : Math.max(
        a, c);
    };

    b.prototype.onMaxLineWidthChanged = function(a) {
      var b = this._computeScrollWidth(a, this.getCurrentViewport().width);

      var c = this.scrollManager.getScrollWidth();
      this.scrollManager.setScrollWidth(b);
      var b = this.scrollManager.getScrollWidth();
      if (b !== c) {
        this.privateViewEventBus.emit(j.EventType.ViewScrollWidthChanged);
        this._updateHeight();
      }
    };

    b.prototype.saveState = function() {
      return {
        scrollTop: this.scrollManager.getScrollTop(),
        scrollLeft: this.scrollManager.getScrollLeft(),
        linesDomNodeWidth: this.scrollManager.getScrollWidth()
      };
    };

    b.prototype.restoreState = function(a) {
      this.scrollManager.setScrollTop(a.scrollTop);

      this.scrollManager.setScrollLeft(a.scrollLeft);
    };

    b.prototype.addWhitespace = function(a, b) {
      return this.linesLayout.addWhitespace(a, b);
    };

    b.prototype.changeWhitespace = function(a, b) {
      return this.linesLayout.changeWhitespace(a, b);
    };

    b.prototype.changeAfterLineNumberForWhitespace = function(a, b) {
      return this.linesLayout.changeAfterLineNumberForWhitespace(a, b);
    };

    b.prototype.removeWhitespace = function(a) {
      return this.linesLayout.removeWhitespace(a);
    };

    b.prototype.getVerticalOffsetForLineNumber = function(a) {
      return this.linesLayout.getVerticalOffsetForLineNumber(a);
    };

    b.prototype.updateLineHeights = function(a, b) {
      this.linesLayout.updateLineHeights(a, b);

      this._updateHeight();
    };

    b.prototype.heightInPxForLine = function(a) {
      return this.linesLayout.heightInPxForLine(a);
    };

    b.prototype.getLineNumberAtVerticalOffset = function(a) {
      return this.linesLayout.getLineNumberAtVerticalOffset(a);
    };

    b.prototype.getLinesTotalHeight = function() {
      return this.linesLayout.getLinesTotalHeight();
    };

    b.prototype.getTotalHeight = function() {
      var a = 0;
      this.scrollManager.getScrollWidth() > this.scrollManager.getWidth() && (a = this.scrollManager.getHorizontalScrollbarHeight());

      return this.linesLayout.getTotalHeight(this.getCurrentViewport(), a);
    };

    b.prototype.getWhitespaceAtVerticalOffset = function(a) {
      return this.linesLayout.getWhitespaceAtVerticalOffset(a);
    };

    b.prototype.getLinesViewportData = function(a) {
      return this.linesLayout.getLinesViewportData(a, this.getCurrentViewport());
    };

    b.prototype.getWhitespaceViewportData = function() {
      return this.linesLayout.getWhitespaceViewportData(this.getCurrentViewport());
    };

    b.prototype.getOverviewRulerInsertData = function() {
      var a = this.scrollManager.getOverviewRulerLayoutInfo();
      return {
        parent: a.parent,
        insertBefore: a.insertBefore
      };
    };

    b.prototype.getScrollbarContainerDomNode = function() {
      return this.scrollManager.getScrollbarContainerDomNode();
    };

    b.prototype.delegateVerticalScrollbarMouseDown = function(a) {
      this.scrollManager.delegateVerticalScrollbarMouseDown(a);
    };

    b.prototype.getScrollHeight = function() {
      return this.scrollManager.getScrollHeight();
    };

    b.prototype.getScrollWidth = function() {
      return this.scrollManager.getScrollWidth();
    };

    b.prototype.getScrollLeft = function() {
      return this.scrollManager.getScrollLeft();
    };

    b.prototype.setScrollLeft = function(a) {
      this.scrollManager.setScrollLeft(a);
    };

    b.prototype.getScrollTop = function() {
      return this.scrollManager.getScrollTop();
    };

    b.prototype.setScrollTop = function(a) {
      this.scrollManager.setScrollTop(a);
    };

    b.prototype.getScrolledTopFromAbsoluteTop = function(a) {
      return this.scrollManager.getScrolledTopFromAbsoluteTop(a);
    };

    b.LINES_HORIZONTAL_EXTRA_PX = 30;

    return b;
  }(l.ViewEventHandler);
  b.LayoutProvider = q;
});