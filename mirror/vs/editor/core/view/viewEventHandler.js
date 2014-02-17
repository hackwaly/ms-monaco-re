define("vs/editor/core/view/viewEventHandler", ["require", "exports", "vs/editor/core/constants",
  "vs/editor/core/view/viewContext"
], function(e, t, n, i) {
  var o = function() {
    function e() {
      this.shouldRender = !0;
    }
    e.prototype.onLineMappingChanged = function() {
      return !1;
    };

    e.prototype.onModelFlushed = function() {
      return !1;
    };

    e.prototype.onModelDecorationsChanged = function() {
      return !1;
    };

    e.prototype.onModelLinesDeleted = function() {
      return !1;
    };

    e.prototype.onModelLineChanged = function() {
      return !1;
    };

    e.prototype.onModelLinesInserted = function() {
      return !1;
    };

    e.prototype.onModelTokensChanged = function() {
      return !1;
    };

    e.prototype.onCursorPositionChanged = function() {
      return !1;
    };

    e.prototype.onCursorSelectionChanged = function() {
      return !1;
    };

    e.prototype.onCursorRevealRange = function() {
      return !1;
    };

    e.prototype.onConfigurationChanged = function() {
      return !1;
    };

    e.prototype.onLayoutChanged = function() {
      return !1;
    };

    e.prototype.onScrollChanged = function() {
      return !1;
    };

    e.prototype.onZonesChanged = function() {
      return !1;
    };

    e.prototype.onScrollWidthChanged = function() {
      return !1;
    };

    e.prototype.onScrollHeightChanged = function() {
      return !1;
    };

    e.prototype.onViewFocusChanged = function() {
      return !1;
    };

    e.prototype.handleEvents = function(e) {
      var t;

      var o;

      var r;

      var s;
      for (t = 0, o = e.length; o > t; t++) switch (r = e[t], s = r.getData(), r.getType()) {
        case i.EventNames.LineMappingChangedEvent:
          this.shouldRender = this.onLineMappingChanged() || this.shouldRender;
          break;
        case i.EventNames.ModelFlushedEvent:
          this.shouldRender = this.onModelFlushed() || this.shouldRender;
          break;
        case i.EventNames.LinesDeletedEvent:
          this.shouldRender = this.onModelLinesDeleted(s) || this.shouldRender;
          break;
        case i.EventNames.LinesInsertedEvent:
          this.shouldRender = this.onModelLinesInserted(s) || this.shouldRender;
          break;
        case i.EventNames.LineChangedEvent:
          this.shouldRender = this.onModelLineChanged(s) || this.shouldRender;
          break;
        case i.EventNames.TokensChangedEvent:
          this.shouldRender = this.onModelTokensChanged(s) || this.shouldRender;
          break;
        case i.EventNames.DecorationsChangedEvent:
          this.shouldRender = this.onModelDecorationsChanged(s) || this.shouldRender;
          break;
        case i.EventNames.CursorPositionChangedEvent:
          this.shouldRender = this.onCursorPositionChanged(s) || this.shouldRender;
          break;
        case i.EventNames.CursorSelectionChangedEvent:
          this.shouldRender = this.onCursorSelectionChanged(s) || this.shouldRender;
          break;
        case i.EventNames.RevealRangeEvent:
          this.shouldRender = this.onCursorRevealRange(s) || this.shouldRender;
          break;
        case n.EventType.ConfigurationChanged:
          this.shouldRender = this.onConfigurationChanged(s) || this.shouldRender;
          break;
        case n.EventType.ViewLayoutChanged:
          this.shouldRender = this.onLayoutChanged(s) || this.shouldRender;
          break;
        case n.EventType.ViewScrollChanged:
          this.shouldRender = this.onScrollChanged(s) || this.shouldRender;
          break;
        case n.EventType.ViewZonesChanged:
          this.shouldRender = this.onZonesChanged() || this.shouldRender;
          break;
        case n.EventType.ViewScrollWidthChanged:
          this.shouldRender = this.onScrollWidthChanged() || this.shouldRender;
          break;
        case n.EventType.ViewScrollHeightChanged:
          this.shouldRender = this.onScrollHeightChanged(s) || this.shouldRender;
          break;
        case n.EventType.ViewFocusChanged:
          this.shouldRender = this.onViewFocusChanged(s) || this.shouldRender;
          break;
        default:
          console.info("View received unkown event: ");

          console.info(r);
      }
    };

    return e;
  }();
  t.ViewEventHandler = o;
});