define("vs/editor/core/view/viewContext", ["require", "exports"], function(e, t) {
  t.ClassNames = {
    TEXTAREA_COVER: "textAreaCover",
    TEXTAREA: "inputarea",
    LINES_CONTENT: "lines-content",
    OVERFLOW_GUARD: "overflow-guard",
    VIEW_LINES: "view-lines",
    VIEW_LINE: "view-line",
    SCROLLABLE_ELEMENT: "editor-scrollable",
    CONTENT_WIDGETS: "contentWidgets",
    OVERLAY_WIDGETS: "overlayWidgets",
    LINES_DECORATIONS: "lines-decorations",
    LINE_NUMBERS: "line-numbers",
    GLYPH_MARGIN: "glyph-margin",
    SCROLL_DECORATION: "scroll-decoration"
  };

  t.EventNames = {
    ModelFlushedEvent: "modelFlushedEvent",
    LinesDeletedEvent: "linesDeletedEvent",
    LinesInsertedEvent: "linesInsertedEvent",
    LineChangedEvent: "lineChangedEvent",
    TokensChangedEvent: "tokensChangedEvent",
    DecorationsChangedEvent: "decorationsChangedEvent",
    CursorPositionChangedEvent: "cursorPositionChangedEvent",
    CursorSelectionChangedEvent: "cursorSelectionChangedEvent",
    RevealRangeEvent: "revealRangeEvent",
    LineMappingChangedEvent: "lineMappingChangedEvent"
  };
  var n = function() {
    function e(e, t, n, i, o, r) {
      this.editorId = e;

      this.configuration = t;

      this.model = n;

      this.privateViewEventBus = i;

      this.addEventHandler = o;

      this.removeEventHandler = r;
    }
    return e;
  }();
  t.ViewContext = n;
});