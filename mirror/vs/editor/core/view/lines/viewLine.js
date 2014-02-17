define("vs/editor/core/view/lines/viewLine", ["require", "exports", "vs/base/env", "vs/editor/core/view/viewContext",
  "vs/editor/core/view/lines/viewLineParts"
], function(e, t, n, i, o) {
  function r(e, t) {
    return e.top === t.top ? e.left - t.left : e.top - t.top;
  }

  function s(e, t, n) {
    var i = e.findIndexOfOffset(t);
    return n >= i ? i : n;
  }

  function a(e, t) {
    return window.screen && window.screen.deviceXDPI && (navigator.userAgent.indexOf("Trident/6.0") >= 0 || navigator
      .userAgent.indexOf("Trident/5.0") >= 0) ? new d(e, t) : n.browser.isWebKit ? new h(e, t) : new c(e, t);
  }

  function u(e) {
    var t = e.lineContent;

    var n = {
      charOffsetInPart: [],
      hasOverflowed: !1,
      lastRenderedPartIndex: 0,
      partsCount: 0,
      output: []
    };

    var i = 0;
    if (n.output.push("<span>"), t.length > 0) {
      var o;

      var r;

      var s;

      var a;

      var u = t.length;

      var l = -1;

      var c = 0;

      var d = 0;

      var h = 0;

      var p = "";

      var b = e.tabSize;

      var C = e.stopRenderingLineAfter;

      var w = e.parts;
      for (-1 !== C && u > C - 1 && (p = t.substr(C - 1, 1), u = C - 1, n.hasOverflowed = !0), r = 0; u > r; r++) {
        switch (r === c && (l++, c = l + 1 < w.length ? w[l + 1].startIndex : Number.MAX_VALUE, r > 0 && n.output.push(
            "</span>"), i++, n.output.push('<span class="'), s = "token " + w[l].type.replace(/[^a-z0-9\-]/gi, " "),
          n.output.push(s), n.output.push('">'), h = 0), n.charOffsetInPart[r] = h, o = t.charCodeAt(r)) {
          case g:
            for (a = b - (r + d) % b, d += a - 1, h += a - 1; a > 0;) n.output.push(" ");

            a--;
            break;
          case f:
            n.output.push(" ");
            break;
          case m:
            n.output.push("&lt;");
            break;
          case v:
            n.output.push("&gt;");
            break;
          case y:
            n.output.push("&amp;");
            break;
          case 0:
            n.output.push("&#00;");
            break;
          case _:
            n.output.push("&#8203");
            break;
          default:
            n.output.push(t.charAt(r));
        }
        h++;
      }
      n.output.push("</span>");

      n.charOffsetInPart[u] = h;

      n.lastRenderedPartIndex = l;

      p.length > 0 && (n.output.push('<span class="'), n.output.push(s), n.output.push('" style="color:grey">'), n.output
        .push(p), n.output.push("&hellip;</span>"));
    } else n.output.push("<span>&nbsp;</span>");
    n.output.push("</span>");

    n.partsCount = i;

    return n;
  }
  var l = function() {
    function e(e, t, n, i) {
      this.top = e;

      this.left = t;

      this.width = n;

      this.height = i;
    }
    return e;
  }();

  var c = function() {
    function e(e, t) {
      this._context = e;

      t && (this._domNode = document.createElement("div"), this._domNode.className = i.ClassNames.VIEW_LINE);

      this._isInvalid = !0;

      this._isMaybeInvalid = !1;

      this._lineParts = null;

      this._cachedInnerHTML = null;

      this._charOffsetInPart = [];

      this._hasOverflowed = !1;

      this._lastRenderedPartIndex = 0;
    }
    e.prototype.getDomNode = function() {
      return this._domNode;
    };

    e.prototype.setDomNode = function(e) {
      this._domNode = e;
    };

    e.prototype.onContentChanged = function() {
      this._isInvalid = !0;
    };

    e.prototype.onLinesInsertedAbove = function() {
      this._isMaybeInvalid = !0;
    };

    e.prototype.onLinesDeletedAbove = function() {
      this._isMaybeInvalid = !0;
    };

    e.prototype.onLineChangedAbove = function() {
      this._isMaybeInvalid = !0;
    };

    e.prototype.onTokensChanged = function() {
      this._isMaybeInvalid = !0;
    };

    e.prototype.onModelDecorationsChanged = function() {
      this._isMaybeInvalid = !0;
    };

    e.prototype.onConfigurationChanged = function() {
      this._isInvalid = !0;
    };

    e.prototype.shouldUpdateHTML = function(e) {
      var t = null;
      (this._isMaybeInvalid || this._isInvalid) && (t = this._computeLineParts(e));

      this._isMaybeInvalid && (this._isInvalid || this._lineParts && this._lineParts.equals(t) || (this._isInvalid = !
        0), this._isMaybeInvalid = !1);

      this._isInvalid && (this._lineParts = t);

      return this._isInvalid;
    };

    e.prototype.getLineOuterHTML = function(e, t) {
      var n = [];
      n.push('<div lineNumber="');

      n.push(e.toString());

      n.push('" style="top:');

      n.push(t.toString());

      n.push("px;height:");

      n.push(this._context.configuration.editor.lineHeight.toString());

      n.push('px;" class="');

      n.push(i.ClassNames.VIEW_LINE);

      n.push('">');

      n = n.concat(this._getLineInnerHTML(e));

      n.push("</div>");

      return n;
    };

    e.prototype.getLineStatistics = function() {
      return {
        partsCount: this._partsCount,
        charactersCount: this._charOffsetInPart.length
      };
    };

    e.prototype._getLineInnerHTML = function(e) {
      this._isInvalid && (this._cachedInnerHTML = this._renderMyLine(e, this._lineParts), this._isInvalid = !1);

      return this._cachedInnerHTML;
    };

    e.prototype.layoutLine = function(e, t) {
      var n = this._domNode.getAttribute("lineNumber");
      n !== e.toString() && this._domNode.setAttribute("lineNumber", e.toString());
      var i = this._domNode.style.top;
      i !== t + "px" && (this._domNode.style.top = t + "px");
      var o = this._domNode.style.height;
      o !== this._context.configuration.editor.lineHeight + "px" && (this._domNode.style.height = this._context.configuration
        .editor.lineHeight + "px");
    };

    e.prototype._computeLineParts = function(e) {
      return o.createLineParts(e, this._context.model.getLineTokens(e), this._context.model.getInlineDecorations(e));
    };

    e.prototype._renderMyLine = function(e, n) {
      this._bustReadingCache();
      var i = t.renderLine({
        lineContent: this._context.model.getLineContent(e),
        tabSize: this._context.configuration.getIndentationOptions().tabSize,
        stopRenderingLineAfter: this._context.configuration.editor.stopRenderingLineAfter,
        parts: n.getParts()
      });
      this._charOffsetInPart = i.charOffsetInPart;

      this._hasOverflowed = i.hasOverflowed;

      this._lastRenderedPartIndex = i.lastRenderedPartIndex;

      this._partsCount = i.partsCount;

      return i.output;
    };

    e.prototype._getReadingTarget = function() {
      return this._domNode.firstChild;
    };

    e.prototype._bustReadingCache = function() {
      this._cachedWidth = -1;
    };

    e.prototype.getHeight = function() {
      return this._domNode.offsetHeight;
    };

    e.prototype.getWidth = function() {
      -1 === this._cachedWidth && (this._cachedWidth = this._getReadingTarget().offsetWidth);

      return this._cachedWidth;
    };

    e.prototype.getVisibleRangesForRange = function(e, t, n, i, o, r) {
      var s = this._context.configuration.editor.stopRenderingLineAfter;
      return -1 !== s && t > s && n > s ? null : (-1 !== s && t > s && (t = s), -1 !== s && n > s && (n = s), this._readVisibleRangesForRange(
        e, t, n, i, o, r));
    };

    e.prototype._readVisibleRangesForRange = function(e, t, n, i, o, s) {
      var a;
      if (a = t === n ? this._readRawVisibleRangesForPosition(e, t, i, o, s) : this._readRawVisibleRangesForRange(e,
        t, n, i, o, s), !a || a.length <= 1) return a;
      a.sort(r);
      for (var u, l = [], c = a[0], d = 1, h = a.length; h > d; d++) u = a[d];

      c.left + c.width + .001 >= u.left ? c.width = Math.max(c.width, u.left + u.width - c.left) : (l.push(c), c = u);
      l.push(c);

      return l;
    };

    e.prototype._readRawVisibleRangesForPosition = function(e, t, n, i, o) {
      if (0 === this._charOffsetInPart.length) {
        var r = this._readRawVisibleRangesForEntireLine(n, i);
        r[0].width = 0;

        return r;
      }
      var a = s(this._lineParts, t - 1, this._lastRenderedPartIndex);

      var u = this._charOffsetInPart[t - 1];
      return this._readRawVisibleRangesFrom(this._getReadingTarget(), a, u, a, u, n, i, o);
    };

    e.prototype._readRawVisibleRangesForRange = function(e, t, n, i, o, r) {
      if (1 === t && n === this._charOffsetInPart.length) return this._readRawVisibleRangesForEntireLine(i, o);
      var a = s(this._lineParts, t - 1, this._lastRenderedPartIndex);

      var u = this._charOffsetInPart[t - 1];

      var l = s(this._lineParts, n - 1, this._lastRenderedPartIndex);

      var c = this._charOffsetInPart[n - 1];
      return this._readRawVisibleRangesFrom(this._getReadingTarget(), a, u, l, c, i, o, r);
    };

    e.prototype._readRawVisibleRangesForEntireLine = function(e) {
      var t = this._domNode.getBoundingClientRect();
      return [new l(t.top - e, 0, this._getReadingTarget().offsetWidth, t.height)];
    };

    e.prototype._readRawVisibleRangesFrom = function(e, t, n, i, o, r, s, a) {
      var u = p.createRange();
      u.setStart(e.children[t].firstChild, n);

      u.setEnd(e.children[i].firstChild, o);
      var l = u.getClientRects();

      var c = null;
      l.length > 0 && (c = this._createRawVisibleRangesFromClientRects(l, r, s));

      p.detachRange(u, a);

      return c;
    };

    e.prototype._createRawVisibleRangesFromClientRects = function(e, t, n) {
      var i;

      var o;

      var r = e.length;

      var s = [];
      for (o = 0; r > o; o++) i = e[o];

      s.push(new l(i.top - t, Math.max(0, i.left - n), i.width, i.height));
      return s;
    };

    e.prototype.getColumnOfNodeOffset = function(e, t, n) {
      for (var i = -1; t;) t = t.previousSibling;

      i++;
      var o = this._lineParts.getParts();
      if (i >= o.length) return this._context.configuration.editor.stopRenderingLineAfter;
      if (0 === n) return o[i].startIndex + 1;
      var r;

      var s;

      var a = o[i].startIndex;
      i + 1 < o.length ? (r = o[i + 1].startIndex, s = this._charOffsetInPart[r - 1] + this._charOffsetInPart[r]) : (
        r = this._context.model.getLineMaxColumn(e) - 1, s = this._charOffsetInPart[r]);
      var u;

      var l = a;

      var c = r; - 1 !== this._context.configuration.editor.stopRenderingLineAfter && (c = Math.min(this._context.configuration
        .editor.stopRenderingLineAfter - 1, r));
      for (var d, h, p, f, g; c > l;) {
        if (u = Math.floor((l + c) / 2), d = this._charOffsetInPart[u], h = u === r ? Number.MAX_VALUE : u + 1 === r ?
          s : this._charOffsetInPart[u + 1], p = u === a ? Number.MIN_VALUE : this._charOffsetInPart[u - 1], f = (p +
            d) / 2, g = (d + h) / 2, n > f && g >= n) return u + 1;
        f >= n ? c = u - 1 : l = u + 1;
      }
      return l + 1;
    };

    return e;
  }();

  var d = function(e) {
    function t(t, n) {
      e.call(this, t, n);
    }
    __extends(t, e);

    t.prototype._createRawVisibleRangesFromClientRects = function(e, t, n) {
      var i;

      var o;

      var r = e.length;

      var s = [];

      var a = screen.logicalYDPI / screen.deviceYDPI;

      var u = screen.logicalXDPI / screen.deviceXDPI;
      for (s = new Array(r), o = 0; r > o; o++) i = e[o];

      s[o] = new l(i.top * a - t, Math.max(0, i.left * u - n), i.width * u, i.height * a);
      return s;
    };

    return t;
  }(c);

  var h = function(e) {
    function t(t, n) {
      e.call(this, t, n);
    }
    __extends(t, e);

    t.prototype._readVisibleRangesForRange = function(t, n, i, o, r, s) {
      var a = e.prototype._readVisibleRangesForRange.call(this, t, n, i, o, r, s);
      if (!a || 0 === a.length || n === i || 1 === n && i === this._charOffsetInPart.length) return a;
      var u = this._readRawVisibleRangesForPosition(t, i - 1, o, r, s);

      var l = this._readRawVisibleRangesForPosition(t, i, o, r, s);
      if (u && u.length > 0 && l && l.length > 0) {
        var c = u[0];

        var d = l[0];

        var h = !0;
        c.top === d.top && (h = c.left <= d.left);
        var p = a[a.length - 1];
        h && p.top === d.top && p.left < d.left ? p.width = d.left - p.left : p.top > d.top && a.splice(a.length - 1,
          1);
      }
      return a;
    };

    return t;
  }(c);

  var p = function() {
    function e() {}
    e.createRange = function() {
      e._handyReadyRange || (e._handyReadyRange = document.createRange());

      return e._handyReadyRange;
    };

    e.detachRange = function(e, t) {
      e.selectNodeContents(t);
    };

    return e;
  }();
  t.createLine = a;
  var f = " ".charCodeAt(0);

  var g = "	".charCodeAt(0);

  var m = "<".charCodeAt(0);

  var v = ">".charCodeAt(0);

  var y = "&".charCodeAt(0);

  var _ = "\r".charCodeAt(0);
  t.renderLine = u;
});