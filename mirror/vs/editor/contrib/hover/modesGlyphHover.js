var __extends = this.__extends || function(a, b) {
    function d() {
      this.constructor = a;
    }
    for (var c in b) {
      if (b.hasOwnProperty(c)) {
        a[c] = b[c];
      }
    }
    d.prototype = b.prototype;

    a.prototype = new d;
  };

define(["require", "exports", "vs/editor/contrib/hover/hoverOperation", "vs/editor/contrib/hover/hoverWidgets"],
  function(a, b, c, d) {
    var e = c;

    var f = d;

    var g = function() {
      function a(a) {
        this._editor = a;

        this._lineNumber = -1;
      }
      a.prototype.setLineNumber = function(a) {
        this._lineNumber = a;

        this._result = [];
      };

      a.prototype.computeSync = function() {
        var a = [];

        var b = this._editor.getLineDecorations(this._lineNumber);

        var c;

        var d;

        var e;
        for (c = 0, d = b.length; c < d; c++) {
          e = b[c];
          if (e.options.glyphMarginClassName && e.options.hoverMessage) {
            a.push({
              value: e.options.hoverMessage
            });
          }
        }
        return a;
      };

      a.prototype.onResult = function(a, b) {
        this._result = this._result.concat(a);
      };

      a.prototype.getResult = function() {
        return this._result;
      };

      return a;
    }();

    var h = function(a) {
      function b(c) {
        var d = this;
        a.call(this, b.ID, c);

        this._lastLineNumber === -1;

        this._computer = new g(this._editor);

        this._hoverOperation = new e.HoverOperation(this._computer, function(a) {
          return d._withResult(a);
        }, null, function(a) {
          return d._withResult(a);
        });
      }
      __extends(b, a);

      b.prototype.startShowingAt = function(a) {
        if (this._lastLineNumber === a) return;
        this._hoverOperation.cancel();

        this.hide();

        this._lastLineNumber = a;

        this._computer.setLineNumber(a);

        this._hoverOperation.start();
      };

      b.prototype.hide = function() {
        this._lastLineNumber = -1;

        this._hoverOperation.cancel();

        a.prototype.hide.call(this);
      };

      b.prototype._withResult = function(a) {
        this._messages = a;

        if (this._messages.length > 0) {
          this._renderMessages(this._lastLineNumber, this._messages);
        } else {
          this.hide();
        }
      };

      b.prototype._renderMessages = function(a, b) {
        var c;

        var d;

        var e;

        var f = [];

        var g = document.createDocumentFragment();
        b.forEach(function(a) {
          var b = document.createElement("div");

          var c = null;
          if (a.className) {
            c = document.createElement("span");
            c.textContent = a.value;
            c.className = a.className;
            b.appendChild(c);
          } else {
            b.textContent = a.value;
          }

          g.appendChild(b);
        });

        this._domNode.textContent = "";

        this._domNode.appendChild(g);

        this.showAt(a);
      };

      b.ID = "editor.contrib.modesGlyphHoverWidget";

      return b;
    }(f.GlyphHoverWidget);
    b.ModesGlyphHoverWidget = h;
  });