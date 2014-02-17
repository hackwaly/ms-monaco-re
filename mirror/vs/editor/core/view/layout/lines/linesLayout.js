define("vs/editor/core/view/layout/lines/linesLayout", ["require", "exports",
  "vs/editor/core/view/layout/lines/verticalObjects"
], function(e, t, n) {
  var i = function() {
    function e(e, t) {
      this.configuration = e;

      this.model = t;

      this.verticalObjects = new n.VerticalObjects;

      this.verticalObjects.replaceLines(t.getLineCount());
    }
    e.prototype.insertWhitespace = function(e, t) {
      return this.verticalObjects.insertWhitespace(e, t);
    };

    e.prototype.changeWhitespace = function(e, t) {
      return this.verticalObjects.changeWhitespace(e, t);
    };

    e.prototype.changeAfterLineNumberForWhitespace = function(e, t) {
      return this.verticalObjects.changeAfterLineNumberForWhitespace(e, t);
    };

    e.prototype.removeWhitespace = function(e) {
      return this.verticalObjects.removeWhitespace(e);
    };

    e.prototype.onModelFlushed = function() {
      this.verticalObjects.replaceLines(this.model.getLineCount());
    };

    e.prototype.onModelLinesDeleted = function(e) {
      this.verticalObjects.onModelLinesDeleted(e.fromLineNumber, e.toLineNumber);
    };

    e.prototype.onModelLinesInserted = function(e) {
      this.verticalObjects.onModelLinesInserted(e.fromLineNumber, e.toLineNumber);
    };

    e.prototype.getVerticalOffsetForLineNumber = function(e) {
      return this.verticalObjects.getVerticalOffsetForLineNumber(e, this.configuration.editor.lineHeight);
    };

    e.prototype.getLinesTotalHeight = function() {
      return this.verticalObjects.getTotalHeight(this.configuration.editor.lineHeight);
    };

    e.prototype.getTotalHeight = function(e, t) {
      var n = this.getLinesTotalHeight();
      n += this.configuration.editor.scrollBeyondLastLine ? e.height - this.configuration.editor.lineHeight : t;

      return Math.max(e.height, n);
    };

    e.prototype.getLineNumberAtOrAfterVerticalOffset = function(e) {
      return this.verticalObjects.getLineNumberAtOrAfterVerticalOffset(e, this.configuration.editor.lineHeight);
    };

    e.prototype.getHeightForLineNumber = function() {
      return this.configuration.editor.lineHeight;
    };

    e.prototype.getWhitespaceViewportData = function(e) {
      return this.verticalObjects.getWhitespaceViewportData(e.top, e.top + e.height, this.configuration.editor.lineHeight);
    };

    e.prototype.getWhitespaceAtVerticalOffset = function(e) {
      return this.verticalObjects.getWhitespaceAtVerticalOffset(e, this.configuration.editor.lineHeight);
    };

    e.prototype.getLinesViewportData = function(e) {
      return this.verticalObjects.getLinesViewportData(e.top, e.top + e.height, this.configuration.editor.lineHeight);
    };

    e.prototype.getCenteredLineInViewport = function(e) {
      return this.verticalObjects.getCenteredLineInViewport(e.top, e.top + e.height, this.configuration.editor.lineHeight);
    };

    return e;
  }();
  t.LinesLayout = i;
});