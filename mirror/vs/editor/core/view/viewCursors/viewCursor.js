define(["require", "exports"], function(a, b) {
  var c = function() {
    function a(a, b) {
      this.context = a;

      this.isInEditableRange = !0;

      this.domNode = this._createCursorDomNode(b);

      this.isVisible = !0;

      this.updatePosition({
        lineNumber: 1,
        column: 1
      });
    }
    a.prototype._createCursorDomNode = function(a) {
      var b = document.createElement("div");
      b.className = "cursor";

      a && (b.className += " secondary");

      b.style.height = this.context.configuration.editor.lineHeight + "px";

      b.style.top = "0px";

      b.style.left = "0px";

      b.setAttribute("role", "presentation");

      b.setAttribute("aria-hidden", "true");

      return b;
    };

    a.prototype.getDomNode = function() {
      return this.domNode;
    };

    a.prototype.getIsInEditableRange = function() {
      return this.isInEditableRange;
    };

    a.prototype.getPositionTop = function() {
      return this.positionTop;
    };

    a.prototype.getPosition = function() {
      return this.position;
    };

    a.prototype.show = function() {
      this.isVisible || (this.domNode.style.display = "block", this.isVisible = !0);
    };

    a.prototype.hide = function() {
      this.isVisible && (this.domNode.style.display = "none", this.isVisible = !1);
    };

    a.prototype.onConfigurationLineHeightChanged = function() {
      this.domNode.style.height = this.context.configuration.editor.lineHeight + "px";

      return !0;
    };

    a.prototype.onModelFlushed = function() {
      this.updatePosition({
        lineNumber: 1,
        column: 1
      });

      this.isInEditableRange = !0;

      return !0;
    };

    a.prototype.onCursorPositionChanged = function(a, b) {
      this.updatePosition(a);

      this.isInEditableRange = b;

      return !0;
    };

    a.prototype.onConfigurationChanged = function(a) {
      return !0;
    };

    a.prototype.prepareRender = function(a) {
      var b = a.visibleRangeForPosition(this.position);
      b ? (this.positionTop = b.top, this.positionLeft = b.left) : this.positionTop = -1e3;
    };

    a.prototype.render = function(a) {
      this.domNode.style.left = this.positionLeft - a.viewportLeft + "px";

      this.domNode.style.top = this.positionTop + "px";
    };

    a.prototype.updatePosition = function(a) {
      this.position = a;

      this.domNode.setAttribute("lineNumber", this.position.lineNumber.toString());

      this.domNode.setAttribute("column", this.position.column.toString());

      this.positionTop = -1e3;

      this.positionLeft = -1e3;
    };

    return a;
  }();
  b.ViewCursor = c;
});