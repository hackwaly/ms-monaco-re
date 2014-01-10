define(["require", "exports", "vs/editor/core/constants", "vs/editor/core/view/viewContext"], function(a, b, c, d) {
  var e = c,
    f = d,
    g = function() {
      function a() {
        this.shouldRender = !0
      }
      return a.prototype.onLineMappingChanged = function() {
        return !1
      }, a.prototype.onModelFlushed = function() {
        return !1
      }, a.prototype.onModelDecorationsChanged = function(a) {
        return !1
      }, a.prototype.onModelLinesDeleted = function(a) {
        return !1
      }, a.prototype.onModelLineChanged = function(a) {
        return !1
      }, a.prototype.onModelLinesInserted = function(a) {
        return !1
      }, a.prototype.onCursorPositionChanged = function(a) {
        return !1
      }, a.prototype.onCursorSelectionChanged = function(a) {
        return !1
      }, a.prototype.onCursorRevealRange = function(a) {
        return !1
      }, a.prototype.onConfigurationChanged = function(a) {
        return !1
      }, a.prototype.onConfigurationFontChanged = function() {
        return !1
      }, a.prototype.onConfigurationLineHeightChanged = function() {
        return !1
      }, a.prototype.onLayoutChanged = function(a) {
        return !1
      }, a.prototype.onScrollChanged = function(a) {
        return !1
      }, a.prototype.onZonesChanged = function() {
        return !1
      }, a.prototype.onScrollWidthChanged = function() {
        return !1
      }, a.prototype.onScrollHeightChanged = function(a) {
        return !1
      }, a.prototype.onViewFocusChanged = function(a) {
        return !1
      }, a.prototype.handleEvents = function(a) {
        var b, c, d, g, h;
        for (b = 0, c = a.length; b < c; b++) {
          d = a[b], g = d.getData();
          switch (d.getType()) {
            case f.EventNames.LineMappingChangedEvent:
              this.shouldRender = this.onLineMappingChanged() || this.shouldRender;
              break;
            case f.EventNames.ModelFlushedEvent:
              this.shouldRender = this.onModelFlushed() || this.shouldRender;
              break;
            case f.EventNames.LinesDeletedEvent:
              this.shouldRender = this.onModelLinesDeleted(g) || this.shouldRender;
              break;
            case f.EventNames.LinesInsertedEvent:
              this.shouldRender = this.onModelLinesInserted(g) || this.shouldRender;
              break;
            case f.EventNames.LineChangedEvent:
              this.shouldRender = this.onModelLineChanged(g) || this.shouldRender;
              break;
            case f.EventNames.DecorationsChangedEvent:
              this.shouldRender = this.onModelDecorationsChanged(g) || this.shouldRender;
              break;
            case f.EventNames.CursorPositionChangedEvent:
              this.shouldRender = this.onCursorPositionChanged(g) || this.shouldRender;
              break;
            case f.EventNames.CursorSelectionChangedEvent:
              this.shouldRender = this.onCursorSelectionChanged(g) || this.shouldRender;
              break;
            case f.EventNames.RevealRangeEvent:
              this.shouldRender = this.onCursorRevealRange(g) || this.shouldRender;
              break;
            case e.EventType.ConfigurationChanged:
              this.shouldRender = this.onConfigurationChanged(g) || this.shouldRender;
              break;
            case e.EventType.ConfigurationLineHeightChanged:
              this.shouldRender = this.onConfigurationLineHeightChanged() || this.shouldRender;
              break;
            case e.EventType.ConfigurationFontChanged:
              this.shouldRender = this.onConfigurationFontChanged() || this.shouldRender;
              break;
            case e.EventType.ViewLayoutChanged:
              this.shouldRender = this.onLayoutChanged(g) || this.shouldRender;
              break;
            case e.EventType.ViewScrollChanged:
              this.shouldRender = this.onScrollChanged(g) || this.shouldRender;
              break;
            case e.EventType.ViewZonesChanged:
              this.shouldRender = this.onZonesChanged() || this.shouldRender;
              break;
            case e.EventType.ViewScrollWidthChanged:
              this.shouldRender = this.onScrollWidthChanged() || this.shouldRender;
              break;
            case e.EventType.ViewScrollHeightChanged:
              this.shouldRender = this.onScrollHeightChanged(g) || this.shouldRender;
              break;
            case e.EventType.ViewFocusChanged:
              this.shouldRender = this.onViewFocusChanged(g) || this.shouldRender;
              break;
            default:
              console.info("View received unkown event: "), console.info(d)
          }
        }
      }, a
    }();
  b.ViewEventHandler = g
})