define("vs/editor/core/view/lines/viewLayer", ["require", "exports", "vs/base/dom/dom",
  "vs/editor/core/view/viewEventHandler"
], function(e, t, n, i) {
  var o = function(e) {
    function t(t, n) {
      var i = this;
      e.call(this);

      this._context = t;

      this._layoutProvider = n;

      this.domNode = this._createDomNode();

      this._guardElement = this._createGuard();

      this.domNode.appendChild(this._guardElement);

      this._lines = [];

      this._rendLineNumberStart = 1;

      this._renderer = new r(function(e) {
        return i._createLine(e);
      });
    }
    __extends(t, e);

    t.prototype.dispose = function() {
      this._context = null;

      this._layoutProvider = null;

      this._lines = null;
    };

    t.prototype.onConfigurationChanged = function(e) {
      for (var t = 0; t < this._lines.length; t++) {
        this._lines[t].onConfigurationChanged(e);
      }
      return !0;
    };

    t.prototype.onLayoutChanged = function() {
      return !0;
    };

    t.prototype.onScrollChanged = function(e) {
      return e.vertical;
    };

    t.prototype.onZonesChanged = function() {
      return !0;
    };

    t.prototype.onModelFlushed = function() {
      this._lines = [];

      this._rendLineNumberStart = 1;

      n.clearNode(this.domNode);

      this.domNode.appendChild(this._guardElement);

      return !0;
    };

    t.prototype.onModelLinesDeleted = function(e) {
      var t;

      var n = Math.max(e.fromLineNumber - this._rendLineNumberStart, 0);

      var i = Math.min(e.toLineNumber - this._rendLineNumberStart, this._lines.length - 1);
      if (e.fromLineNumber < this._rendLineNumberStart && (e.toLineNumber < this._rendLineNumberStart ? this._rendLineNumberStart -=
        e.toLineNumber - e.fromLineNumber + 1 : this._rendLineNumberStart = e.fromLineNumber), i >= n) {
        for (t = n; i >= t; t++) {
          this.domNode.removeChild(this._lines[t].getDomNode());
        }
        this._lines.splice(n, i - n + 1);
      }
      for (t = n; t < this._lines.length; t++) {
        this._lines[t].onLinesDeletedAbove();
      }
      return !0;
    };

    t.prototype.onModelLineChanged = function(e) {
      var t = e.lineNumber - this._rendLineNumberStart;

      var n = !1;
      if (t >= 0 && t < this._lines.length) {
        this._lines[t].onContentChanged();
        n = !0;
      }
      for (var i = Math.max(t, 0); i < this._lines.length; i++) {
        this._lines[i].onLineChangedAbove();
        n = !0;
      }
      return n;
    };

    t.prototype.onModelLinesInserted = function(e) {
      var t;
      if (e.fromLineNumber <= this._rendLineNumberStart) {
        for (this._rendLineNumberStart += e.toLineNumber - e.fromLineNumber + 1, t = 0; t < this._lines.length; t++) {
          this._lines[t].onLinesInsertedAbove();
        }
        return !0;
      }
      if (e.fromLineNumber >= this._rendLineNumberStart + this._lines.length) {
        return !1;
      }
      var n = Math.min(e.fromLineNumber - this._rendLineNumberStart, this._lines.length - 1);

      var i = Math.min(e.toLineNumber - this._rendLineNumberStart, this._lines.length - 1);
      if (i >= n) {
        var o = this._lines[n].getDomNode();
        for (t = n; i >= t; t++) {
          var r = this._createLine(!0);
          this.domNode.insertBefore(r.getDomNode(), o);

          this._lines.splice(t, 0, r);
        }
        for (var s = i - n + 1, t = this._lines.length - s; t < this._lines.length; t++) {
          this.domNode.removeChild(this._lines[t].getDomNode());
        }
        this._lines.splice(this._lines.length - s, s);
      }
      for (t = i; t < this._lines.length; t++) {
        this._lines[t].onLinesInsertedAbove();
      }
      return !0;
    };

    t.prototype.onModelTokensChanged = function(e) {
      var t = e.fromLineNumber - this._rendLineNumberStart;

      var n = e.toLineNumber - this._rendLineNumberStart;
      if (0 > n || t >= this._lines.length) {
        return !1;
      }
      for (var i = Math.min(Math.max(t, 0), this._lines.length - 1), o = Math.min(Math.max(n, 0), this._lines.length -
          1), r = !1, s = i; o >= s; s++) {
        r = !0;
        this._lines[s].onTokensChanged();
      }
      return r;
    };

    t.prototype._renderLines = function(e, t) {
      var n = {
        domNode: this.domNode,
        guardElement: this._guardElement,
        rendLineNumberStart: this._rendLineNumberStart,
        lines: this._lines,
        linesLength: this._lines.length,
        frameData: t
      };

      var i = this._renderer.renderWithManyUpdates(n, e.startLineNumber, e.endLineNumber, e.relativeVerticalOffset);
      this._guardElement = i.guardElement;

      this._rendLineNumberStart = i.rendLineNumberStart;

      this._lines = i.lines;
    };

    t.prototype._createDomNode = function() {
      var e = document.createElement("div");
      e.className = "view-layer";

      e.style.position = "absolute";

      e.style.width = "1000000px";

      e.style.height = "1000000px";

      e.setAttribute("role", "presentation");

      e.setAttribute("aria-hidden", "true");

      return e;
    };

    t.prototype._createGuard = function() {
      return document.createElement("div");
    };

    t.prototype._createLine = function() {
      throw new Error("Implement me!");
    };

    return t;
  }(i.ViewEventHandler);
  t.ViewLayer = o;
  var r = function() {
    function e(e) {
      this._createLine = e;
    }
    e.prototype.renderWithManyUpdates = function(e, t, n, i) {
      return this._render(e, t, n, i);
    };

    e.prototype._render = function(e, t, n, i) {
      var o = {
        domNode: e.domNode,
        guardElement: e.guardElement,
        rendLineNumberStart: e.rendLineNumberStart,
        lines: e.lines.slice(0),
        linesLength: e.linesLength,
        frameData: e.frameData
      };
      this._renderUntouchedLines(o, Math.max(t - o.rendLineNumberStart, 0), Math.min(n - o.rendLineNumberStart, o.linesLength -
        1), i, t);
      var r;

      var s;

      var a;
      o.rendLineNumberStart > t ? (r = t, s = Math.min(n, o.rendLineNumberStart - 1), s >= r && (this._insertLinesBefore(
        o, r, s, i, t), o.linesLength += s - r + 1)) : o.rendLineNumberStart < t && (a = Math.min(o.linesLength, t -
        o.rendLineNumberStart), a > 0 && (this._removeLinesBefore(o, a), o.linesLength -= a));

      o.rendLineNumberStart = t;

      o.rendLineNumberStart + o.linesLength - 1 < n ? (r = o.rendLineNumberStart + o.linesLength, s = n, s >= r && (
        this._insertLinesAfter(o, r, s, i, t), o.linesLength += s - r + 1)) : o.rendLineNumberStart + o.linesLength -
        1 > n && (r = Math.max(0, n - o.rendLineNumberStart + 1), s = o.linesLength - 1, a = s - r + 1, a > 0 && (
          this._removeLinesAfter(o, a), o.linesLength -= a));

      this._finishRendering(o, i);

      return o;
    };

    e.prototype._renderUntouchedLines = function(e, t, n, i, o) {
      var r;

      var s;
      for (r = t; n >= r; r++) {
        s = e.rendLineNumberStart + r;
        e.lines[r].layoutLine(s, i[s - o]);
      }
    };

    e.prototype._insertLinesBefore = function(e, t, n) {
      var i;

      var o;

      var r = e.linesLength > 0 ? e.lines[0].getDomNode() : e.guardElement;

      var s = [];
      for (o = t; n >= o; o++) {
        i = this._createLine(!0);
        s.push(i);
        e.domNode.insertBefore(i.getDomNode(), r);
      }
      e.lines = s.concat(e.lines);
    };

    e.prototype._removeLinesBefore = function(e, t) {
      var n;
      for (n = 0; t > n; n++) {
        e.domNode.removeChild(e.lines[n].getDomNode());
      }
      e.lines.splice(0, t);
    };

    e.prototype._insertLinesAfter = function(e, t, n) {
      var i;

      var o;

      var r = e.guardElement;

      var s = [];
      for (o = t; n >= o; o++) {
        i = this._createLine(!0);
        s.push(i);
        e.domNode.insertBefore(i.getDomNode(), r);
      }
      e.lines = e.lines.concat(s);
    };

    e.prototype._removeLinesAfter = function(e, t) {
      var n;

      var i = e.linesLength - t;
      for (n = 0; t > n; n++) {
        e.domNode.removeChild(e.lines[i + n].getDomNode());
      }
      e.lines.splice(i, t);
    };

    e.prototype._finishRendering = function(e, t) {
      var n;

      var i;

      var o;

      var r = !1;

      var s = [];

      var a = [];

      var u = 0;

      var l = 0;

      var c = 0;

      var d = 0;

      var h = 0;

      var p = 0;
      for (n = 0; n < e.linesLength; n++) {
        i = e.lines[n];
        if (i.shouldUpdateHTML(n + e.rendLineNumberStart)) {
          a = a.concat(i.getLineOuterHTML(n + e.rendLineNumberStart, t[n]));
          s[n] = !0;
          r = !0;
          if (e.frameData) {
            o = i.getLineStatistics();
            l++;
            d += o.partsCount;
            p += o.charactersCount;
          }
        } else {
          if (e.frameData) {
            o = i.getLineStatistics();
            u++;
            c += o.partsCount;
            h += o.charactersCount;
          }
        }
      }
      if (e.frameData && (e.frameData.renderedVisibleLinesCount += l, e.frameData.totalVisibleLinesCount += l + u, e.frameData
        .renderedVisiblePartsCount += d, e.frameData.totalVisiblePartsCount += d + c, e.frameData.renderedVisibleCharactersCount +=
        p, e.frameData.totalVisibleCharactersCount += p + h), r) {
        var f = document.createElement("div");
        f.innerHTML = a.join("");
        var g;

        var m;
        for (n = 0; n < e.linesLength; n++) {
          i = e.lines[n];
          if (s[n]) {
            m = f.firstChild;
            g = i.getDomNode();
            g.parentNode.replaceChild(m, g);
            i.setDomNode(m);
          }
        }
      }
    };

    return e;
  }();
});