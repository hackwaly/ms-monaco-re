define("vs/editor/contrib/hover/modesContentHover", ["require", "exports", "vs/editor/core/range",
  "vs/base/lib/winjs.base", "vs/editor/contrib/hover/hoverOperation", "vs/editor/contrib/hover/hoverWidgets",
  "vs/base/dom/htmlContent"
], function(e, t, n, i, o, r, s) {
  var a = function() {
    function e(e) {
      this._editor = e;

      this._range = null;
    }
    e.prototype.setRange = function(e) {
      this._range = e;

      this._result = [];
    };

    e.prototype.clearResult = function() {
      this._result = [];
    };

    e.prototype.computeAsync = function() {
      var e = this._editor.getModel().getMode();

      var t = e.extraInfoSupport;
      return t ? t.computeInfo(this._editor.getModel().getAssociatedResource(), {
        lineNumber: this._range.startLineNumber,
        column: this._range.startColumn
      }).then(function(e) {
        if (e) {
          var t = "undefined" != typeof e.range;

          var n = "undefined" != typeof e.value;

          var i = "undefined" != typeof e.htmlContent && e.htmlContent && e.htmlContent.length > 0;
          if (t && (n || i)) {
            return [e];
          }
        }
        return null;
      }) : i.TPromise.as(null);
    };

    e.prototype.computeSync = function() {
      var e = this;

      var t = this._range.startLineNumber;

      var i = this._editor.getLineDecorations(t);

      var o = this._editor.getModel().getLineMaxColumn(t);

      var r = [];
      i.forEach(function(i) {
        var s = i.range.startLineNumber === t ? i.range.startColumn : 1;

        var a = i.range.endLineNumber === t ? i.range.endColumn : o;
        if (s <= e._range.startColumn && e._range.endColumn <= a && (i.options.hoverMessage || i.options.htmlMessage &&
          i.options.htmlMessage.length > 0)) {
          var u = {
            value: i.options.hoverMessage,
            range: new n.Range(e._range.startLineNumber, s, e._range.startLineNumber, a)
          };
          if (i.options.htmlMessage) {
            u.htmlContent = i.options.htmlMessage;
          }

          r.push(u);
        }
      });

      return r;
    };

    e.prototype.onResult = function(e, t) {
      this._result = t ? e.concat(this._result) : this._result.concat(e);
    };

    e.prototype.getResult = function() {
      return this._result.slice(0);
    };

    return e;
  }();

  var u = function(e) {
    function t(n) {
      var i = this;
      e.call(this, t.ID, n);

      this._computer = new a(this._editor);

      this._highlightDecorations = [];

      this._hoverOperation = new o.HoverOperation(this._computer, function(e) {
        return i._withResult(e, !0);
      }, null, function(e) {
        return i._withResult(e, !1);
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
      if (!this._lastRange || !this._lastRange.equalsRange(e)) {
        if (this._hoverOperation.cancel(), this._isVisible)
          if (this._showAtPosition.lineNumber !== e.startLineNumber) {
            this.hide();
          } else {
            for (var t = [], n = 0, i = this._messages.length; i > n; n++) {
              var o = this._messages[n];

              var r = o.range;
              if (r.startColumn <= e.startColumn && r.endColumn >= e.endColumn) {
                t.push(o);
              }
            }
            if (t.length > 0) {
              this._renderMessages(e, t);
            } else {
              this.hide();
            }
          }
        this._lastRange = e;

        this._computer.setRange(e);

        this._hoverOperation.start();
      }
    };

    t.prototype.hide = function() {
      this._lastRange = null;

      this._hoverOperation.cancel();

      e.prototype.hide.call(this);

      this._highlightDecorations = this._editor.deltaDecorations(this._highlightDecorations, []);
    };

    t.prototype._withResult = function(e, t) {
      this._messages = e;

      if (this._messages.length > 0) {
        this._renderMessages(this._lastRange, this._messages);
      } else {
        if (t) {
          this.hide();
        }
      }
    };

    t.prototype._renderMessages = function(e, t) {
      var i = Number.MAX_VALUE;

      var o = t[0].range;

      var r = document.createDocumentFragment();
      t.forEach(function(e) {
        if (e.range) {
          i = Math.min(i, e.range.startColumn);

          o = n.plusRange(o, e.range);
          var t = document.createElement("div");

          var a = null;

          var u = t;
          if (e.className) {
            a = document.createElement("span");
            a.className = e.className;
            u = a;
            t.appendChild(a);
          }

          if (e.htmlContent && e.htmlContent.length > 0) {
            e.htmlContent.forEach(function(e) {
              u.appendChild(s.renderHtml(e));
            });
          } else {
            u.textContent = e.value;
          }

          r.appendChild(t);
        }
      });

      this._domNode.textContent = "";

      this._domNode.appendChild(r);

      this.showAt({
        lineNumber: e.startLineNumber,
        column: i
      });

      this._highlightDecorations = this._editor.deltaDecorations(this._highlightDecorations, [{
        range: o,
        options: {
          className: "hoverHighlight"
        }
      }]);
    };

    t.ID = "editor.contrib.modesContentHoverWidget";

    return t;
  }(r.ContentHoverWidget);
  t.ModesContentHoverWidget = u;
});