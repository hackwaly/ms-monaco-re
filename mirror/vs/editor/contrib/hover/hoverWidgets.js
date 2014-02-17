define("vs/editor/contrib/hover/hoverWidgets", ["require", "exports", "vs/editor/editor", "vs/editor/core/position"],
  function(e, t, n, i) {
    var o = function() {
      function e(e, t) {
        this._id = e;

        this._editor = t;

        this._isVisible = !1;

        this._containerDomNode = document.createElement("div");

        this._containerDomNode.className = "monaco-editor-hover monaco-editor-background";

        this._containerDomNode.style.display = "none";

        this._domNode = document.createElement("div");

        this._domNode.style.display = "inline-block";

        this._containerDomNode.appendChild(this._domNode);

        this._editor.addContentWidget(this);

        this._showAtPosition = null;
      }
      e.prototype.getId = function() {
        return this._id;
      };

      e.prototype.getDomNode = function() {
        return this._containerDomNode;
      };

      e.prototype.showAt = function(e) {
        this._showAtPosition = new i.Position(e.lineNumber, e.column);

        this._isVisible || (this._isVisible = !0, this._containerDomNode.style.display = "block");
        var t = parseInt(this._containerDomNode.style.maxWidth, 10);
        this._containerDomNode.style.width = t + "px";

        this._containerDomNode.style.height = "";

        this._containerDomNode.style.left = "0px";
        var n = Math.min(t, this._domNode.clientWidth + 5);

        var o = this._domNode.clientHeight + 1;
        this._containerDomNode.style.width = n + "px";

        this._containerDomNode.style.height = o + "px";

        this._editor.layoutContentWidget(this);

        this._editor.getOffsetForColumn(this._showAtPosition.lineNumber, this._showAtPosition.column);
      };

      e.prototype.hide = function() {
        this._isVisible && (this._isVisible = !1, this._containerDomNode.style.display = "none", this._editor.layoutContentWidget(
          this));
      };

      e.prototype.getPosition = function() {
        return this._isVisible ? {
          position: this._showAtPosition,
          preference: [1, 2]
        } : null;
      };

      e.prototype.dispose = function() {
        this.hide();
      };

      return e;
    }();
    t.ContentHoverWidget = o;
    var r = function() {
      function e(e, t) {
        this._id = e;

        this._editor = t;

        this._isVisible = !1;

        this._domNode = document.createElement("div");

        this._domNode.className = "monaco-editor-hover monaco-editor-background";

        this._domNode.style.display = "none";

        this._domNode.setAttribute("aria-hidden", "true");

        this._domNode.setAttribute("role", "presentation");

        this._showAtLineNumber = -1;

        this._editor.addOverlayWidget(this);
      }
      e.prototype.getId = function() {
        return this._id;
      };

      e.prototype.getDomNode = function() {
        return this._domNode;
      };

      e.prototype.showAt = function(e) {
        this._showAtLineNumber = e;

        this._isVisible || (this._isVisible = !0, this._domNode.style.display = "block");
        var t = this._editor.getLayoutInfo();

        var n = this._editor.getTopForLineNumber(this._showAtLineNumber);

        var i = this._editor.getScrollTop();
        this._domNode.style.left = t.glyphMarginLeft + t.glyphMarginWidth + "px";

        this._domNode.style.top = n - i + "px";
      };

      e.prototype.hide = function() {
        this._isVisible && (this._isVisible = !1, this._domNode.style.display = "none");
      };

      e.prototype.getPosition = function() {
        return null;
      };

      e.prototype.dispose = function() {
        this.hide();
      };

      return e;
    }();
    t.GlyphHoverWidget = r;
  });