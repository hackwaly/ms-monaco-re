define("vs/editor/core/view/layout/layoutProvider", ["require", "exports", "vs/editor/core/constants",
  "vs/editor/core/view/layout/lines/linesLayout", "vs/editor/core/view/viewEventHandler",
  "vs/editor/core/view/layout/editorLayoutProvider", "vs/editor/core/view/layout/scroll/scrollManager"
], function(e, t, n, i, o, r, s) {
  var a = function(e) {
    function t(t, n, o, a, u) {
      e.call(this);

      this.configuration = t;

      this.privateViewEventBus = o;

      this.model = n;

      this.scrollManager = new s.ScrollManager(t, o, a, u);

      this.editorLayoutProvider = new r.EditorLayoutProvider(this.configuration.editor.observedOuterWidth, this.configuration
        .editor.observedOuterHeight, this.configuration.editor.lineHeight, this.configuration.editor.glyphMargin,
        this.configuration.editor.lineNumbers, this.configuration.editor.lineNumbersMinChars, this.configuration.editor
        .lineDecorationsWidth, this.configuration.editor.maxDigitWidth);

      this.editorLayoutProvider.setLineCount(this.model.getLineCount());

      this.editorLayoutProvider.setScrollbarSize(this.scrollManager.getVerticalScrollbarWidth(), this.scrollManager.getHorizontalScrollbarHeight());

      this._updateWrappingColumn(this.getLayoutInfo(), 0);

      this.linesLayout = new i.LinesLayout(t, n);

      this._updatePageSize();

      this._updateHeight();
    }
    __extends(t, e);

    t.prototype.dispose = function() {
      this.scrollManager.dispose();
    };

    t.prototype.updateLineCount = function() {
      var e = this.editorLayoutProvider.setLineCount(this.model.getLineCount());
      if (e) {
        this._emitLayoutChangedEvent();
      }
    };

    t.prototype.onZonesChanged = function() {
      this._updateHeight();

      return !1;
    };

    t.prototype.onModelFlushed = function() {
      this.linesLayout.onModelFlushed();

      this.updateLineCount();

      this._updateHeight();

      return !1;
    };

    t.prototype.onModelLinesDeleted = function(e) {
      this.linesLayout.onModelLinesDeleted(e);

      this.updateLineCount();

      this._updateHeight();

      return !1;
    };

    t.prototype.onModelLineChanged = function() {
      return !1;
    };

    t.prototype.onModelLinesInserted = function(e) {
      this.linesLayout.onModelLinesInserted(e);

      this.updateLineCount();

      this._updateHeight();

      return !1;
    };

    t.prototype.onConfigurationChanged = function() {
      var e = this.linesLayout.getCenteredLineInViewport(this.getCurrentViewport());
      this._updatePageSize();
      var t = this.editorLayoutProvider.setDimensions(this.configuration.editor.observedOuterWidth, this.configuration
        .editor.observedOuterHeight);
      t = this.editorLayoutProvider.setShowLineNumbers(this.configuration.editor.lineNumbers) || t;

      t = this.editorLayoutProvider.setLineNumbersMinChars(this.configuration.editor.lineNumbersMinChars) || t;

      t = this.editorLayoutProvider.setGlyphMargin(this.configuration.editor.glyphMargin) || t;

      t = this.editorLayoutProvider.setLineDecorationsWidth(this.configuration.editor.lineDecorationsWidth) || t;

      t = this.editorLayoutProvider.setLineHeight(this.configuration.editor.lineHeight) || t;

      t = this.editorLayoutProvider.setMaxDigitWidth(this.configuration.editor.maxDigitWidth) || t;

      this._updateWrappingColumn(this.getLayoutInfo(), e);

      t && this._emitLayoutChangedEvent();

      this._updateHeight();

      return !1;
    };

    t.prototype._updateHeight = function() {
      var e = this.scrollManager.getScrollHeight();
      this.scrollManager.setScrollHeight(this.getTotalHeight());
      var t = this.scrollManager.getScrollHeight();
      if (e !== t) {
        this.privateViewEventBus.emit(n.EventType.ViewScrollHeightChanged, t);
      }
    };

    t.prototype._updateWrappingColumn = function(e, t) {
      var n = this.configuration.getWrappingColumn();

      var i = -1;
      if (0 === n) {
        i = Math.max(1, Math.floor((e.contentWidth - e.verticalScrollbarWidth) / this.configuration.editor.thinnestCharacterWidth));
      }

      {
        if (n > 0) {
          i = n;
        }
      }

      this.model.setWrappingColumn(i, t);
    };

    t.prototype._updatePageSize = function() {
      var e = this.editorLayoutProvider.getLayoutInfo();
      this.configuration.editor.pageSize = Math.floor(e.height / this.configuration.editor.lineHeight) - 2;
    };

    t.prototype.getLayoutInfo = function() {
      var e = this.editorLayoutProvider.getLayoutInfo();

      var t = this.scrollManager.getOverviewRulerLayoutInfo();
      e.overviewRuler = {
        top: t.top,
        width: t.width,
        height: e.height - t.top - t.bottom,
        right: 0
      };

      return e;
    };

    t.prototype.getCurrentViewport = function() {
      var e = this.editorLayoutProvider.getLayoutInfo();
      return {
        top: this.scrollManager.getScrollTop(),
        left: this.scrollManager.getScrollLeft(),
        width: e.contentWidth,
        height: e.contentHeight
      };
    };

    t.prototype._emitLayoutChangedEvent = function(e) {
      if ("undefined" == typeof e) {
        e = 0;
      }

      this.scrollManager.onSizeProviderLayoutChanged();
      var t = this.getLayoutInfo();
      this.scrollManager.setWidth(t.contentWidth);

      this.scrollManager.setHeight(t.contentHeight);

      this._updateWrappingColumn(t, e);

      this.privateViewEventBus.emit(n.EventType.ViewLayoutChanged, t);
    };

    t.prototype.emitLayoutChangedEvent = function() {
      this._emitLayoutChangedEvent();
    };

    t.prototype._computeScrollWidth = function(e, n) {
      var i = this.configuration.getWrappingColumn();

      var o = 0 === i;
      return o ? Math.max(e, n) : Math.max(e + t.LINES_HORIZONTAL_EXTRA_PX, n);
    };

    t.prototype.onMaxLineWidthChanged = function(e) {
      var t = this._computeScrollWidth(e, this.getCurrentViewport().width);

      var i = this.scrollManager.getScrollWidth();
      this.scrollManager.setScrollWidth(t);
      var t = this.scrollManager.getScrollWidth();
      if (t !== i) {
        this.privateViewEventBus.emit(n.EventType.ViewScrollWidthChanged);
        this._updateHeight();
      }
    };

    t.prototype.saveState = function() {
      return {
        scrollTop: this.scrollManager.getScrollTop(),
        scrollLeft: this.scrollManager.getScrollLeft(),
        linesDomNodeWidth: this.scrollManager.getScrollWidth()
      };
    };

    t.prototype.restoreState = function(e) {
      this.scrollManager.setScrollTop(e.scrollTop);

      this.scrollManager.setScrollLeft(e.scrollLeft);
    };

    t.prototype.addWhitespace = function(e, t) {
      return this.linesLayout.insertWhitespace(e, t);
    };

    t.prototype.changeWhitespace = function(e, t) {
      return this.linesLayout.changeWhitespace(e, t);
    };

    t.prototype.changeAfterLineNumberForWhitespace = function(e, t) {
      return this.linesLayout.changeAfterLineNumberForWhitespace(e, t);
    };

    t.prototype.removeWhitespace = function(e) {
      return this.linesLayout.removeWhitespace(e);
    };

    t.prototype.getVerticalOffsetForLineNumber = function(e) {
      return this.linesLayout.getVerticalOffsetForLineNumber(e);
    };

    t.prototype.heightInPxForLine = function(e) {
      return this.linesLayout.getHeightForLineNumber(e);
    };

    t.prototype.getLineNumberAtVerticalOffset = function(e) {
      return this.linesLayout.getLineNumberAtOrAfterVerticalOffset(e);
    };

    t.prototype.getTotalHeight = function() {
      var e = 0;
      this.scrollManager.getScrollWidth() > this.scrollManager.getWidth() && (e = this.scrollManager.getHorizontalScrollbarHeight());

      return this.linesLayout.getTotalHeight(this.getCurrentViewport(), e);
    };

    t.prototype.getWhitespaceAtVerticalOffset = function(e) {
      return this.linesLayout.getWhitespaceAtVerticalOffset(e);
    };

    t.prototype.getLinesViewportData = function() {
      return this.linesLayout.getLinesViewportData(this.getCurrentViewport());
    };

    t.prototype.getWhitespaceViewportData = function() {
      return this.linesLayout.getWhitespaceViewportData(this.getCurrentViewport());
    };

    t.prototype.getOverviewRulerInsertData = function() {
      var e = this.scrollManager.getOverviewRulerLayoutInfo();
      return {
        parent: e.parent,
        insertBefore: e.insertBefore
      };
    };

    t.prototype.getScrollbarContainerDomNode = function() {
      return this.scrollManager.getScrollbarContainerDomNode();
    };

    t.prototype.delegateVerticalScrollbarMouseDown = function(e) {
      this.scrollManager.delegateVerticalScrollbarMouseDown(e);
    };

    t.prototype.getScrollHeight = function() {
      return this.scrollManager.getScrollHeight();
    };

    t.prototype.getScrollWidth = function() {
      return this.scrollManager.getScrollWidth();
    };

    t.prototype.getScrollLeft = function() {
      return this.scrollManager.getScrollLeft();
    };

    t.prototype.setScrollLeft = function(e) {
      this.scrollManager.setScrollLeft(e);
    };

    t.prototype.getScrollTop = function() {
      return this.scrollManager.getScrollTop();
    };

    t.prototype.setScrollTop = function(e) {
      this.scrollManager.setScrollTop(e);
    };

    t.prototype.getScrolledTopFromAbsoluteTop = function(e) {
      return this.scrollManager.getScrolledTopFromAbsoluteTop(e);
    };

    t.LINES_HORIZONTAL_EXTRA_PX = 30;

    return t;
  }(o.ViewEventHandler);
  t.LayoutProvider = a;
});