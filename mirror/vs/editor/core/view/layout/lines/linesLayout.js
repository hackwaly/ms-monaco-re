define(["require", "exports", "vs/editor/core/view/layout/lines/verticalObjects"], function(a, b, c) {
  var d = c,
    e = function() {
      function a(a, b, c) {
        this.configuration = a, this.model = b, this.verticalObjects = new d.VerticalObjects, this.wrappingWidth = c,
          this.verticalObjects.replaceLines(b, a.editor.viewWordWrap)
      }
      return a.prototype.addWhitespace = function(a, b) {
        return this.verticalObjects.insertWhitespace(a, b)
      }, a.prototype.changeWhitespace = function(a, b) {
        return this.verticalObjects.changeWhitespace(a, b)
      }, a.prototype.changeAfterLineNumberForWhitespace = function(a, b) {
        return this.verticalObjects.changeAfterLineNumberForWhitespace(a, b)
      }, a.prototype.removeWhitespace = function(a) {
        return this.verticalObjects.removeWhitespace(a)
      }, a.prototype.onConfigurationChanged = function(a) {
        a.viewWordWrapChanged && (this.configuration.editor.viewWordWrap ? this.verticalObjects.invalidateLineHeights() :
          this.verticalObjects.resetLineHeightsAndMarkAsValid())
      }, a.prototype.onWrappingWidthChanged = function(a) {
        this.wrappingWidth !== a && (this.wrappingWidth = a, this.configuration.editor.viewWordWrap && this.verticalObjects
          .invalidateLineHeights())
      }, a.prototype.onModelFlushed = function() {
        this.verticalObjects.replaceLines(this.model, this.configuration.editor.viewWordWrap)
      }, a.prototype.onModelLinesDeleted = function(a) {
        this.verticalObjects.onModelLinesDeleted(a.fromLineNumber, a.toLineNumber)
      }, a.prototype.onModelLineChanged = function(a) {
        this.verticalObjects.onModelLineChanged(a.lineNumber, this.configuration.editor.viewWordWrap)
      }, a.prototype.onModelLinesInserted = function(a) {
        this.verticalObjects.onModelLinesInserted(a.fromLineNumber, a.toLineNumber, this.configuration.editor.viewWordWrap)
      }, a.prototype.updateLineHeights = function(a, b) {
        this.verticalObjects.changeLines(a, b)
      }, a.prototype.getVerticalOffsetForLineNumber = function(a) {
        return this.verticalObjects.getVerticalOffsetForLineNumber(a, this.configuration.editor.lineHeight)
      }, a.prototype.getLinesTotalHeight = function() {
        return this.verticalObjects.getTotalHeight(this.configuration.editor.lineHeight)
      }, a.prototype.getTotalHeight = function(a, b) {
        var c = this.getLinesTotalHeight();
        return this.configuration.editor.scrollBeyondLastLine ? c += a.height - this.configuration.editor.lineHeight :
          c += b, Math.max(a.height, c)
      }, a.prototype.getLineNumberAtVerticalOffset = function(a) {
        return this.verticalObjects.getLineNumberAtOrAfterVerticalOffset(a, this.configuration.editor.lineHeight)
      }, a.prototype.heightInPxForLine = function(a) {
        return this.verticalObjects.getHeightForLineNumber(a, this.configuration.editor.lineHeight)
      }, a.prototype.getWhitespaceViewportData = function(a) {
        return this.verticalObjects.getWhitespacesInViewport(a.top, a.top + a.height, this.configuration.editor.lineHeight)
      }, a.prototype.getWhitespaceAtVerticalOffset = function(a) {
        return this.verticalObjects.getWhitespaceAtVerticalOffset(a, this.configuration.editor.lineHeight)
      }, a.prototype.getLinesViewportData = function(a, b) {
        return this.verticalObjects.getLinesViewportData(a, b.top, b.top + b.height, this.configuration.editor.lineHeight,
          this.model, this.wrappingWidth, this.configuration.editor.thinnestCharacterWidth, this.configuration.editor
          .stopRenderingLineAfter)
      }, a.VIRTUAL_LINES_AROUND = 0, a
    }();
  b.LinesLayout = e
})