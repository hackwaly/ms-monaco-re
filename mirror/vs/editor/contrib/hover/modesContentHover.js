var __extends = this.__extends || function(a, b) {
    function d() {
      this.constructor = a
    }
    for (var c in b) b.hasOwnProperty(c) && (a[c] = b[c]);
    d.prototype = b.prototype, a.prototype = new d
  };
define(["require", "exports", "vs/editor/core/range", "vs/base/lib/winjs.base",
  "vs/editor/contrib/hover/hoverOperation", "vs/editor/contrib/hover/hoverWidgets", "vs/base/dom/htmlContent"
], function(a, b, c, d, e, f, g) {
  var h = c,
    i = d,
    j = e,
    k = f,
    l = g,
    m = function() {
      function a(a) {
        this._editor = a, this._range = null
      }
      return a.prototype.setRange = function(a) {
        this._range = a, this._result = []
      }, a.prototype.computeAsync = function() {
        var a = this._editor.getModel().getMode(),
          b = a.extraInfoSupport;
        return b ? b.computeInfo(this._editor.getModel().getAssociatedResource(), {
          lineNumber: this._range.startLineNumber,
          column: this._range.startColumn
        }).then(function(a) {
          return a ? [a] : null
        }) : i.Promise.as(null)
      }, a.prototype.computeSync = function() {
        var a = this,
          b = this._range.startLineNumber,
          c = this._editor.getLineDecorations(b),
          d = this._editor.getModel().getLineMaxColumn(b),
          e = [];
        return c.forEach(function(c) {
          var f = c.range.startLineNumber === b ? c.range.startColumn : 1,
            g = c.range.endLineNumber === b ? c.range.endColumn : d;
          if (f <= a._range.startColumn && a._range.endColumn <= g && (c.options.hoverMessage || c.options.htmlMessage &&
            c.options.htmlMessage.length > 0)) {
            var i = {
              value: c.options.hoverMessage,
              range: new h.Range(a._range.startLineNumber, f, a._range.startLineNumber, g)
            };
            c.options.htmlMessage && (i.htmlContent = c.options.htmlMessage), e.push(i)
          }
        }), e
      }, a.prototype.onResult = function(a, b) {
        b ? this._result = a.concat(this._result) : this._result = this._result.concat(a)
      }, a.prototype.getResult = function() {
        return this._result.slice(0)
      }, a
    }(),
    n = function(a) {
      function b(c) {
        var d = this;
        a.call(this, b.ID, c), this._computer = new m(this._editor), this._hoverOperation = new j.HoverOperation(this
          ._computer, function(a) {
            return d._withResult(a)
          }, null, function(a) {
            return d._withResult(a)
          })
      }
      return __extends(b, a), b.prototype.startShowingAt = function(a) {
        if (this._lastRange && this._lastRange.equalsRange(a)) return;
        this._hoverOperation.cancel();
        if (this._isVisible)
          if (this._showAtPosition.lineNumber !== a.startLineNumber) this.hide();
          else {
            var b = [];
            for (var c = 0, d = this._messages.length; c < d; c++) {
              var e = this._messages[c],
                f = e.range;
              f.startColumn <= a.startColumn && f.endColumn >= a.endColumn && b.push(e)
            }
            b.length > 0 ? this._renderMessages(a, b) : this.hide()
          }
        this._lastRange = a, this._computer.setRange(a), this._hoverOperation.start()
      }, b.prototype.hide = function() {
        this._lastRange = null, this._hoverOperation.cancel(), a.prototype.hide.call(this)
      }, b.prototype._withResult = function(a) {
        this._messages = a, this._messages.length > 0 ? this._renderMessages(this._lastRange, this._messages) : this.hide()
      }, b.prototype._renderMessages = function(a, b) {
        var c, d, e, f = Number.MAX_VALUE,
          g = [],
          h = document.createDocumentFragment();
        b.forEach(function(a) {
          f = Math.min(f, a.range.startColumn);
          var b = document.createElement("div"),
            c = null,
            d = b;
          a.className && (c = document.createElement("span"), c.className = a.className, d = c, b.appendChild(c)),
            a.htmlContent && a.htmlContent.length > 0 ? a.htmlContent.forEach(function(a) {
              d.appendChild(l.renderHtml(a))
            }) : d.textContent = a.value, h.appendChild(b)
        }), this._domNode.textContent = "", this._domNode.appendChild(h), this.showAt({
          lineNumber: a.startLineNumber,
          column: f
        })
      }, b.ID = "editor.contrib.modesContentHoverWidget", b
    }(k.ContentHoverWidget);
  b.ModesContentHoverWidget = n
})