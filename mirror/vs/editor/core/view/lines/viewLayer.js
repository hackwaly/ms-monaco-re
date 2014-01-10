var __extends = this.__extends || function(a, b) {
    function d() {
      this.constructor = a
    }
    for (var c in b) b.hasOwnProperty(c) && (a[c] = b[c]);
    d.prototype = b.prototype, a.prototype = new d
  };
define(["require", "exports", "vs/base/dom/dom", "vs/editor/core/view/viewEventHandler"], function(a, b, c, d) {
  var e = c,
    f = d,
    g = function(a) {
      function b(b, c) {
        var d = this;
        a.call(this), this._context = b, this._layoutProvider = c, this.domNode = this._createDomNode(), this._guardElement =
          this._createGuard(), this.domNode.appendChild(this._guardElement), this._lines = [], this._rendLineNumberStart =
          1;
        var e = function(a) {
          return d._createLine(a)
        };
        this._manyUpdatesCounter = new j, this._manyUpdatesRenderer = new i(e), this._oneUpdateRenderer = new k(e)
      }
      return __extends(b, a), b.prototype.dispose = function() {
        this._context = null, this._layoutProvider = null, this._lines = null
      }, b.prototype.onConfigurationLineHeightChanged = function() {
        return !0
      }, b.prototype.onLayoutChanged = function(a) {
        return !0
      }, b.prototype.onScrollChanged = function(a) {
        return a.vertical
      }, b.prototype.onZonesChanged = function() {
        return !0
      }, b.prototype.onModelFlushed = function() {
        return this._lines = [], this._rendLineNumberStart = 1, e.clearNode(this.domNode), this.domNode.appendChild(
          this._guardElement), !0
      }, b.prototype.onModelLinesDeleted = function(a) {
        var b = Math.max(a.fromLineNumber - this._rendLineNumberStart, 0),
          c = Math.min(a.toLineNumber - this._rendLineNumberStart, this._lines.length - 1),
          d;
        a.fromLineNumber < this._rendLineNumberStart && (a.toLineNumber < this._rendLineNumberStart ? this._rendLineNumberStart -=
          a.toLineNumber - a.fromLineNumber + 1 : this._rendLineNumberStart = a.fromLineNumber);
        if (b <= c) {
          for (d = b; d <= c; d++) this.domNode.removeChild(this._lines[d].getDomNode());
          this._lines.splice(b, c - b + 1)
        }
        for (d = b; d < this._lines.length; d++) this._lines[d].onLinesDeletedAbove();
        return !0
      }, b.prototype.onModelLineChanged = function(a) {
        var b = a.lineNumber - this._rendLineNumberStart,
          c = !1;
        b >= 0 && b < this._lines.length && (this._lines[b].onContentChanged(), c = !0);
        for (var d = Math.max(b, 0); d < this._lines.length; d++) this._lines[d].onLineChangedAbove(), c = !0;
        return c
      }, b.prototype.onModelLinesInserted = function(a) {
        var b;
        if (a.fromLineNumber <= this._rendLineNumberStart) {
          this._rendLineNumberStart += a.toLineNumber - a.fromLineNumber + 1;
          for (b = 0; b < this._lines.length; b++) this._lines[b].onLinesInsertedAbove();
          return !0
        }
        if (a.fromLineNumber >= this._rendLineNumberStart + this._lines.length) return !1;
        var c = Math.min(a.fromLineNumber - this._rendLineNumberStart, this._lines.length - 1),
          d = Math.min(a.toLineNumber - this._rendLineNumberStart, this._lines.length - 1);
        if (c <= d) {
          var e = this._lines[c].getDomNode();
          for (b = c; b <= d; b++) {
            var f = this._createLine(!0);
            this.domNode.insertBefore(f.getDomNode(), e), this._lines.splice(b, 0, f)
          }
          var g = d - c + 1;
          for (var b = this._lines.length - g; b < this._lines.length; b++) this.domNode.removeChild(this._lines[b].getDomNode());
          this._lines.splice(this._lines.length - g, g)
        }
        for (b = d; b < this._lines.length; b++) this._lines[b].onLinesInsertedAbove();
        return !0
      }, b.prototype.onConfigurationChanged = function(a) {
        for (var b = 0; b < this._lines.length; b++) this._lines[b].onConfigurationChanged(a);
        return a.viewWordWrapChanged && (this._context.configuration.editor.viewWordWrap ? this.domNode.style.width =
          "100%" : this.domNode.style.width = "1000000px"), !0
      }, b.prototype._renderLines = function(a) {
        var c = {
          domNode: this.domNode,
          guardElement: this._guardElement,
          rendLineNumberStart: this._rendLineNumberStart,
          lines: this._lines,
          linesLength: this._lines.length,
          renderData: null
        }, d = !1;
        if (b.USE_ONE_UPDATE_RENDERER) {
          var e = this._manyUpdatesCounter.estimateEffort(c, a.startLineNumber, a.endLineNumber);
          d = c.linesLength / 3 < e.setInnerHTML
        }
        var f;
        d ? f = this._oneUpdateRenderer.renderWithOneUpdate(c, a.startLineNumber, a.endLineNumber, a.relativeVerticalOffset) :
          f = this._manyUpdatesRenderer.renderWithManyUpdates(c, a.startLineNumber, a.endLineNumber, a.relativeVerticalOffset),
          this._guardElement = f.guardElement, this._rendLineNumberStart = f.rendLineNumberStart, this._lines = f.lines
      }, b.prototype._createDomNode = function() {
        var a = document.createElement("div");
        return a.className = "view-layer", a.style.position = "absolute", this._context.configuration.editor.viewWordWrap ?
          a.style.width = "100%" : a.style.width = "1000000px", a.style.height = "1000000px", a.setAttribute("role",
            "presentation"), a.setAttribute("aria-hidden", "true"), a
      }, b.prototype._createGuard = function() {
        return document.createElement("div")
      }, b.prototype._createLine = function(a) {
        throw new Error("Implement me!")
      }, b.USE_ONE_UPDATE_RENDERER = !1, b
    }(f.ViewEventHandler);
  b.ViewLayer = g;
  var h = function() {
    function a() {}
    return a.prototype._render = function(a, b, c, d) {
      var e = {
        domNode: a.domNode,
        guardElement: a.guardElement,
        rendLineNumberStart: a.rendLineNumberStart,
        lines: a.lines.slice(0),
        linesLength: a.linesLength,
        renderData: a.renderData
      };
      this._renderUntouchedLines(e, Math.max(b - e.rendLineNumberStart, 0), Math.min(c - e.rendLineNumberStart, e.linesLength -
        1), d, b);
      var f, g, h, i;
      return e.rendLineNumberStart > b ? (g = b, h = Math.min(c, e.rendLineNumberStart - 1), g <= h && (this._insertLinesBefore(
        e, g, h, d, b), e.linesLength += h - g + 1)) : e.rendLineNumberStart < b && (i = Math.min(e.linesLength, b -
        e.rendLineNumberStart), i > 0 && (this._removeLinesBefore(e, i), e.linesLength -= i)), e.rendLineNumberStart =
        b, e.rendLineNumberStart + e.linesLength - 1 < c ? (g = e.rendLineNumberStart + e.linesLength, h = c, g <= h &&
          (this._insertLinesAfter(e, g, h, d, b), e.linesLength += h - g + 1)) : e.rendLineNumberStart + e.linesLength -
        1 > c && (g = Math.max(0, c - e.rendLineNumberStart + 1), h = e.linesLength - 1, i = h - g + 1, i > 0 && (
          this._removeLinesAfter(e, i), e.linesLength -= i)), this._finishRendering(e, d), e
    }, a.prototype._renderUntouchedLines = function(a, b, c, d, e) {}, a.prototype._insertLinesBefore = function(a, b,
      c, d, e) {}, a.prototype._removeLinesBefore = function(a, b) {}, a.prototype._insertLinesAfter = function(a, b,
      c, d, e) {}, a.prototype._removeLinesAfter = function(a, b) {}, a.prototype._finishRendering = function(a, b) {},
      a
  }(),
    i = function(a) {
      function b(b) {
        a.call(this), this._createLine = b
      }
      return __extends(b, a), b.prototype.renderWithManyUpdates = function(a, b, c, d) {
        return this._render(a, b, c, d)
      }, b.prototype._renderUntouchedLines = function(a, b, c, d, e) {
        var f, g;
        for (f = b; f <= c; f++) g = a.rendLineNumberStart + f, a.lines[f].layoutLine(g, d[g - e])
      }, b.prototype._insertLinesBefore = function(a, b, c, d, e) {
        var f = a.linesLength > 0 ? a.lines[0].getDomNode() : a.guardElement,
          g = [],
          h, i;
        for (i = b; i <= c; i++) h = this._createLine(!0), g.push(h), a.domNode.insertBefore(h.getDomNode(), f);
        a.lines = g.concat(a.lines)
      }, b.prototype._removeLinesBefore = function(a, b) {
        var c;
        for (c = 0; c < b; c++) a.domNode.removeChild(a.lines[c].getDomNode());
        a.lines.splice(0, b)
      }, b.prototype._insertLinesAfter = function(a, b, c, d, e) {
        var f = a.guardElement,
          g = [],
          h, i;
        for (i = b; i <= c; i++) h = this._createLine(!0), g.push(h), a.domNode.insertBefore(h.getDomNode(), f);
        a.lines = a.lines.concat(g)
      }, b.prototype._removeLinesAfter = function(a, b) {
        var c, d = a.linesLength - b;
        for (c = 0; c < b; c++) a.domNode.removeChild(a.lines[d + c].getDomNode());
        a.lines.splice(d, b)
      }, b.prototype._finishRendering = function(a, b) {
        var c, d, e = !1,
          f = [],
          g = [];
        for (c = 0; c < a.linesLength; c++) d = a.lines[c], d.shouldUpdateHTML(c + a.rendLineNumberStart) && (g = g.concat(
          d.getLineOuterHTML(a.renderData, c + a.rendLineNumberStart, b[c])), f[c] = !0, e = !0);
        if (e) {
          var h = document.createElement("div");
          h.innerHTML = g.join("");
          var i, j;
          for (c = 0; c < a.linesLength; c++) d = a.lines[c], f[c] && (j = h.firstChild, i = d.getDomNode(), i.parentNode
            .replaceChild(j, i), d.setDomNode(j))
        }
      }, b
    }(h),
    j = function(a) {
      function b() {
        a.apply(this, arguments)
      }
      return __extends(b, a), b.prototype.estimateEffort = function(a, b, c) {
        return this.insertCount = 0, this.removeCount = 0, this.setInnerHTMLCount = 0, this._render(a, b, c, null), {
          domInsert: this.insertCount,
          domRemove: this.removeCount,
          setInnerHTML: this.setInnerHTMLCount
        }
      }, b.prototype._renderUntouchedLines = function(a, b, c, d) {
        var e;
        for (e = b; e <= c; e++) a.lines[e].shouldUpdateHTML(e + a.rendLineNumberStart) && this.setInnerHTMLCount++
      }, b.prototype._insertLinesBefore = function(a, b, c, d) {
        this.insertCount += c - b + 1, this.setInnerHTMLCount += c - b + 1
      }, b.prototype._removeLinesBefore = function(a, b) {
        this.removeCount += b
      }, b.prototype._insertLinesAfter = function(a, b, c, d) {
        this.insertCount += c - b + 1, this.setInnerHTMLCount += c - b + 1
      }, b.prototype._removeLinesAfter = function(a, b) {
        this.removeCount += b
      }, b.prototype._finishRendering = function(a, b) {}, b
    }(h),
    k = function(a) {
      function b(b) {
        a.call(this), this._createLine = b
      }
      return __extends(b, a), b.prototype.renderWithOneUpdate = function(a, b, c, d) {
        return this._render(a, b, c, d)
      }, b.prototype._insertLinesBefore = function(a, b, c, d) {
        var e = [],
          f, g;
        for (g = b; g <= c; g++) f = this._createLine(!1), e.push(f);
        a.lines = e.concat(a.lines)
      }, b.prototype._removeLinesBefore = function(a, b) {
        a.lines.splice(0, b)
      }, b.prototype._insertLinesAfter = function(a, b, c, d) {
        var e = [],
          f, g;
        for (g = b; g <= c; g++) f = this._createLine(!1), e.push(f);
        a.lines = a.lines.concat(e)
      }, b.prototype._removeLinesAfter = function(a, b) {
        var c = a.linesLength - b;
        a.lines.splice(c, b)
      }, b.prototype._finishRendering = function(a, b) {
        var c, d = [];
        for (c = 0; c < a.linesLength; c++) d = d.concat(a.lines[c].getLineOuterHTML(a.renderData, c + a.rendLineNumberStart,
          b[c]));
        d.push("<div></div>"), a.domNode.innerHTML = d.join("");
        var e = a.domNode.children;
        for (c = 0; c < a.linesLength; c++) a.lines[c].setDomNode(e[c]);
        a.guardElement = e[a.linesLength]
      }, b
    }(h)
})