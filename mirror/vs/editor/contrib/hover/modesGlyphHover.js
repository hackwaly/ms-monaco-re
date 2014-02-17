define("vs/editor/contrib/hover/modesGlyphHover", ["require", "exports", "vs/editor/contrib/hover/hoverOperation",
  "vs/editor/contrib/hover/hoverWidgets"
], function(e, t, n, i) {
  var o = function() {
    function e(e) {
      this._editor = e;

      this._lineNumber = -1;
    }
    e.prototype.setLineNumber = function(e) {
      this._lineNumber = e;

      this._result = [];
    };

    e.prototype.clearResult = function() {
      this._result = [];
    };

    e.prototype.computeSync = function() {
      var e;

      var t;

      var n;

      var i = [];

      var o = this._editor.getLineDecorations(this._lineNumber);
      for (e = 0, t = o.length; t > e; e++) {
        n = o[e];
        if (n.options.glyphMarginClassName && n.options.hoverMessage) {
          i.push({
            value: n.options.hoverMessage
          });
        }
      }
      return i;
    };

    e.prototype.onResult = function(e) {
      this._result = this._result.concat(e);
    };

    e.prototype.getResult = function() {
      return this._result;
    };

    return e;
  }();

  var r = function(e) {
    function t(i) {
      var r = this;
      e.call(this, t.ID, i);

      - 1 === this._lastLineNumber;

      this._computer = new o(this._editor);

      this._hoverOperation = new n.HoverOperation(this._computer, function(e) {
        return r._withResult(e);
      }, null, function(e) {
        return r._withResult(e);
      });
    }
    __extends(t, e);

    t.prototype.onModelDecorationsChanged = function() {
      if (this._isVisible) {
        this._hoverOperation.cancel();
        this._computer.clearResult();
        this._hoverOperation.start();
      }
    };

    t.prototype.startShowingAt = function(e) {
      if (this._lastLineNumber !== e) {
        this._hoverOperation.cancel();
        this.hide();
        this._lastLineNumber = e;
        this._computer.setLineNumber(e);
        this._hoverOperation.start();
      }
    };

    t.prototype.hide = function() {
      this._lastLineNumber = -1;

      this._hoverOperation.cancel();

      e.prototype.hide.call(this);
    };

    t.prototype._withResult = function(e) {
      this._messages = e;

      if (this._messages.length > 0) {
        this._renderMessages(this._lastLineNumber, this._messages);
      } else {
        this.hide();
      }
    };

    t.prototype._renderMessages = function(e, t) {
      var n = document.createDocumentFragment();
      t.forEach(function(e) {
        var t = document.createElement("div");

        var i = null;
        if (e.className) {
          i = document.createElement("span");
          i.textContent = e.value;
          i.className = e.className;
          t.appendChild(i);
        } else {
          t.textContent = e.value;
        }

        n.appendChild(t);
      });

      this._domNode.textContent = "";

      this._domNode.appendChild(n);

      this.showAt(e);
    };

    t.ID = "editor.contrib.modesGlyphHoverWidget";

    return t;
  }(i.GlyphHoverWidget);
  t.ModesGlyphHoverWidget = r;
});