define(["require", "exports", "vs/editor/editor", "vs/editor/core/position"], function(a, b, c, d) {
  var e = c;

  var f = d;

  var g = function() {
    function a(a, b) {
      this._id = a;

      this._editor = b;

      this._isVisible = !1;

      this.containerDomNode = document.createElement("div");

      this.containerDomNode.className = "monaco-editor-hover monaco-editor-background";

      this.containerDomNode.style.display = "none";

      this._domNode = document.createElement("div");

      this._domNode.style.display = "inline-block";

      this.containerDomNode.appendChild(this._domNode);

      this._editor.addContentWidget(this);

      this._showAtPosition = null;
    }
    a.prototype.getId = function() {
      return this._id;
    };

    a.prototype.getDomNode = function() {
      return this.containerDomNode;
    };

    a.prototype.showAt = function(a) {
      this._showAtPosition = new f.Position(a.lineNumber, a.column);

      if (!this._isVisible) {
        this._isVisible = !0;
        this.containerDomNode.style.display = "block";
      }
      var b = parseInt(this.containerDomNode.style.maxWidth, 10);
      this.containerDomNode.style.width = b + "px";

      this.containerDomNode.style.height = "";

      this.containerDomNode.style.left = "0px";
      var c = Math.min(b, this._domNode.clientWidth + 5);

      var d = this._domNode.clientHeight + 1;
      this.containerDomNode.style.width = c + "px";

      this.containerDomNode.style.height = d + "px";

      this._editor.layoutContentWidget(this);
    };

    a.prototype.hide = function() {
      if (!this._isVisible) return;
      this._isVisible = !1;

      this.containerDomNode.style.display = "none";

      this._editor.layoutContentWidget(this);
    };

    a.prototype.getPosition = function() {
      return this._isVisible ? {
        position: this._showAtPosition,
        preference: [e.ContentWidgetPositionPreference.ABOVE, e.ContentWidgetPositionPreference.BELOW]
      } : null;
    };

    a.prototype.dispose = function() {
      this.hide();
    };

    return a;
  }();
  b.ContentHoverWidget = g;
  var h = function() {
    function a(a, b) {
      this._id = a;

      this._editor = b;

      this._isVisible = !1;

      this._domNode = document.createElement("div");

      this._domNode.className = "monaco-editor-hover monaco-editor-background";

      this._domNode.style.display = "none";

      this._showAtLineNumber = -1;

      this._editor.addOverlayWidget(this);
    }
    a.prototype.getId = function() {
      return this._id;
    };

    a.prototype.getDomNode = function() {
      return this._domNode;
    };

    a.prototype.showAt = function(a) {
      this._showAtLineNumber = a;

      if (!this._isVisible) {
        this._isVisible = !0;
        this._domNode.style.display = "block";
      }
      var b = this._editor.getLayoutInfo();

      var c = this._editor.getTopForLineNumber(this._showAtLineNumber);

      var d = this._editor.getScrollTop();
      this._domNode.style.left = b.glyphMarginLeft + b.glyphMarginWidth + "px";

      this._domNode.style.top = c - d + "px";
    };

    a.prototype.hide = function() {
      if (!this._isVisible) return;
      this._isVisible = !1;

      this._domNode.style.display = "none";
    };

    a.prototype.getPosition = function() {
      return null;
    };

    a.prototype.dispose = function() {
      this.hide();
    };

    return a;
  }();
  b.GlyphHoverWidget = h;
});