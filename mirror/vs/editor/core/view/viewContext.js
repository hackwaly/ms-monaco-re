define(["require", "exports"], function(a, b) {
  b.ClassNames = {
    TEXTAREA_COVER: "textAreaCover",
    TEXTAREA: "inputarea",
    VIEW_LINES: "view-lines",
    VIEW_LINE: "view-line",
    SCROLLABLE_ELEMENT: "editor-scrollable",
    CONTENT_WIDGETS: "contentWidgets",
    OVERLAY_WIDGETS: "overlayWidgets",
    LINES_DECORATIONS: "lines-decorations",
    LINE_NUMBERS: "line-numbers",
    GLYPH_MARGIN: "glyph-margin"
  }, b.EventNames = {
    ModelFlushedEvent: "modelFlushedEvent",
    LinesDeletedEvent: "linesDeletedEvent",
    LinesInsertedEvent: "linesInsertedEvent",
    LineChangedEvent: "lineChangedEvent",
    DecorationsChangedEvent: "decorationsChangedEvent",
    CursorPositionChangedEvent: "cursorPositionChangedEvent",
    CursorSelectionChangedEvent: "cursorSelectionChangedEvent",
    RevealRangeEvent: "revealRangeEvent",
    LineMappingChangedEvent: "lineMappingChangedEvent"
  };
  var c = function() {
    function a(a, b, c, d, e, f) {
      this.editorId = a, this.configuration = b, this.model = c, this.privateViewEventBus = d, this.addEventHandler =
        e, this.removeEventHandler = f
    }
    return a
  }();
  b.ViewContext = c
})