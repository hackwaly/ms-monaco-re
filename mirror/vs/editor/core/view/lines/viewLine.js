var __extends = this.__extends || function(a, b) {
    function d() {
      this.constructor = a
    }
    for (var c in b) b.hasOwnProperty(c) && (a[c] = b[c]);
    d.prototype = b.prototype, a.prototype = new d
  };
define(["require", "exports", "vs/base/env", "vs/editor/core/view/viewContext",
  "vs/editor/core/view/lines/viewLineParts"
], function(a, b, c, d, e) {
  function t(a, b) {
    return a.top === b.top ? a.left - b.left : a.top - b.top
  }

  function u(a, b, c) {
    var d = a.findIndexOfOffset(b);
    return d <= c ? d : c
  }

  function v(a, b) {
    return window.screen && window.screen.deviceXDPI && (f.browser.isIE9 || f.browser.isIE10) ? new p(a, b) : f.browser
      .isWebKit ? new q(a, b) : new o(a, b)
  }
  var f = c,
    g = d,
    h = e,
    i = " ".charCodeAt(0),
    j = "	".charCodeAt(0),
    k = "<".charCodeAt(0),
    l = ">".charCodeAt(0),
    m = "&".charCodeAt(0),
    n = function() {
      function a(a, b, c, d) {
        this.top = a, this.left = b, this.width = c, this.height = d
      }
      return a
    }(),
    o = function() {
      function a(a, b) {
        this.context = a, b && (this.domNode = document.createElement("div"), this.domNode.className = g.ClassNames.VIEW_LINE),
          this.isInvalid = !0, this.isMaybeInvalid = !1, this.lineParts = null, this.html = null, this.charOffsetInPart = [],
          this.hasOverflowed = !1, this.lastRenderedPartIndex = 0
      }
      return a.prototype.getDomNode = function() {
        return this.domNode
      }, a.prototype.setDomNode = function(a) {
        this.domNode = a
      }, a.prototype.onContentChanged = function() {
        this.isInvalid = !0
      }, a.prototype.onLinesInsertedAbove = function() {
        this.isMaybeInvalid = !0
      }, a.prototype.onLinesDeletedAbove = function() {
        this.isMaybeInvalid = !0
      }, a.prototype.onLineChangedAbove = function() {
        this.isMaybeInvalid = !0
      }, a.prototype.onModelDecorationsChanged = function() {
        this.isMaybeInvalid = !0
      }, a.prototype.onConfigurationChanged = function(a) {
        this.isInvalid = !0
      }, a.prototype.shouldUpdateHTML = function(a) {
        var b = null;
        if (this.isMaybeInvalid || this.isInvalid) b = this.computeLineParts(a);
        return this.isMaybeInvalid && (!this.isInvalid && (!this.lineParts || !this.lineParts.equals(b)) && (this.isInvalid = !
          0), this.isMaybeInvalid = !1), this.isInvalid && (this.lineParts = b), this.isInvalid
      }, a.prototype.getLineOuterHTML = function(a, b, c) {
        var d = [];
        return d.push('<div lineNumber="'), d.push(b.toString()), d.push('" style="top:'), d.push(c.toString()), d.push(
          'px;" class="'), d.push(g.ClassNames.VIEW_LINE), d.push('">'), d = d.concat(this.getLineInnerHTML(a, b)), d
          .push("</div>"), d
      }, a.prototype.getLineInnerHTML = function(a, b) {
        return this.isInvalid && (this.html = this.renderLine(b, this.lineParts), this.isInvalid = !1), this.html
      }, a.prototype.layoutLine = function(a, b) {
        var c = this.domNode.getAttribute("lineNumber");
        c !== a.toString() && this.domNode.setAttribute("lineNumber", a.toString());
        var d = this.domNode.style.top;
        d !== b + "px" && (this.domNode.style.top = b + "px")
      }, a.prototype.computeLineParts = function(a) {
        return h.createLineParts(a, this.context.model.getLineTokens(a), this.context.model.getInlineDecorations(a))
      }, a.prototype.renderLine = function(a, b) {
        var c = [],
          d = this.context.model.getLineContent(a),
          e = this.context.configuration.editor.viewWordWrap;
        this.charOffsetInPart = [], this.hasOverflowed = !1, this.bustReadingCache(), c.push("<span>");
        if (d.length > 0) {
          var g, h, n = d.length,
            o, p = -1,
            q = 0,
            r = 0,
            s = 0,
            t = !0,
            u = "",
            v = this.context.configuration.editor.tabSize,
            w, x = this.context.configuration.editor.stopRenderingLineAfter,
            y = this.lineParts.getParts();
          x !== -1 && n > x - 1 && (u = d.substr(x - 1, 1), n = x - 1, this.hasOverflowed = !0);
          for (h = 0; h < n; h++) {
            h === q && (p++, q = p + 1 < y.length ? y[p + 1].startIndex : Number.MAX_VALUE, h > 0 && c.push("</span>"),
              c.push('<span class="'), o = "token " + y[p].type.replace(/[^a-z0-9\-]/gi, " "), c.push(o), c.push('">'),
              e && !t && !f.browser.isIE9 ? (c.push("&#8203;"), s = 1) : s = 0), this.charOffsetInPart[h] = s, g = d.charCodeAt(
              h);
            if (g === j) {
              w = v - (h + r) % v, r += w - 1, s += w - 1;
              while (w > 0) c.push(" "), w--
            } else g === i ? c.push(" ") : g === k ? (t = !1, c.push("&lt;")) : g === l ? (t = !1, c.push("&gt;")) :
              g === m ? (t = !1, c.push("&amp;")) : (t = !1, c.push(d.charAt(h)));
            s++
          }
          c.push("</span>"), this.charOffsetInPart[n] = s, this.lastRenderedPartIndex = p, u.length > 0 && (c.push(
            '<span class="'), c.push(o), c.push('" style="color:grey">'), c.push(u), c.push("…</span>"))
        } else c.push("<span>&nbsp;</span>");
        return c.push("</span>"), c
      }, a.prototype.getReadingTarget = function() {
        return this.domNode.firstChild
      }, a.prototype.bustReadingCache = function() {
        this.cachedWidth = -1
      }, a.prototype.getHeight = function() {
        return this.domNode.offsetHeight
      }, a.prototype.getWidth = function() {
        return this.cachedWidth === -1 && (this.cachedWidth = this.getReadingTarget().offsetWidth), this.cachedWidth
      }, a.prototype.getVisibleRangesForRange = function(a, b, c, d, e, f, g) {
        var h = this.context.configuration.editor.stopRenderingLineAfter;
        return h !== -1 && b > h && c > h ? null : (h !== -1 && b > h && (b = h), h !== -1 && c > h && (c = h), this.readVisibleRangesForRange(
          a, b, c, d, e, f, g))
      }, a.prototype.readVisibleRangesForRange = function(a, b, c, d, e, f, g) {
        var h;
        b === c ? h = this.readRawVisibleRangesForPosition(a, b, d, e, f, g) : h = this.readRawVisibleRangesForRange(
          a, b, c, d, e, f, g);
        if (!h || h.length === 0) return h;
        h.sort(t);
        var i = [],
          j = h[0],
          k;
        for (var l = 1, m = h.length; l < m; l++) k = h[l], j.top === k.top && j.height === k.height && j.left + j.width +
          .001 >= k.left ? j.width = Math.max(j.width, k.left + k.width - j.left) : (i.push(j), j = k);
        return i.push(j), i
      }, a.prototype.readRawVisibleRangesForPosition = function(a, b, c, d, e, f) {
        var g = this.lineParts,
          h = u(g, b - 1, this.lastRenderedPartIndex),
          i = this.charOffsetInPart[b - 1],
          j = this.getReadingTarget();
        return this.readRawVisibleRangesFrom(j, h, i, h, i, c, d, e, f)
      }, a.prototype.readRawVisibleRangesForRange = function(a, b, c, d, e, f, g) {
        if (!this.context.configuration.editor.viewWordWrap && b === 1 && c === this.charOffsetInPart.length) return this
          .readRawVisibleRangesForEntireLine(d, e, f);
        var h = this.lineParts,
          i = u(h, b - 1, this.lastRenderedPartIndex),
          j = this.charOffsetInPart[b - 1],
          k = u(h, c - 1, this.lastRenderedPartIndex),
          l = this.charOffsetInPart[c - 1],
          m = this.getReadingTarget();
        return this.readRawVisibleRangesFrom(m, i, j, k, l, d, e, f, g)
      }, a.prototype.readRawVisibleRangesForEntireLine = function(a, b, c) {
        var d = this.domNode.getBoundingClientRect();
        return [new n(d.top - a, 0, this.getReadingTarget().offsetWidth, d.height)]
      }, a.prototype.readRawVisibleRangesFrom = function(a, b, c, d, e, f, g, h, i) {
        var j = s.createRange();
        j.setStart(a.children[b].firstChild, c), j.setEnd(a.children[d].firstChild, e);
        var k = j.getClientRects(),
          l = null;
        return k.length > 0 && (l = this.createRawVisibleRangesFromClientRects(k, f + g, h)), s.detachRange(j, i), l
      }, a.prototype.createRawVisibleRangesFromClientRects = function(a, b, c) {
        var d = a.length,
          e, f, g = [];
        g = new Array(d);
        for (f = 0; f < d; f++) e = a[f], g[f] = new n(e.top - b, e.left - c, e.width, e.height);
        return g
      }, a.prototype.getColumnOfNodeOffset = function(a, b, c) {
        var d = -1;
        while (b) b = b.previousSibling, d++;
        var e = this.lineParts.getParts();
        if (d >= e.length) return this.context.configuration.editor.stopRenderingLineAfter;
        if (c === 0) return e[d].startIndex + 1;
        var f = e[d].startIndex,
          g, h;
        d + 1 < e.length ? (g = e[d + 1].startIndex, h = this.charOffsetInPart[g - 1] + this.charOffsetInPart[g]) : (
          g = this.context.model.getLineMaxColumn(a) - 1, h = this.charOffsetInPart[g]);
        var i = f,
          j, k = g;
        this.context.configuration.editor.stopRenderingLineAfter !== -1 && (k = Math.min(this.context.configuration.editor
          .stopRenderingLineAfter - 1, g));
        var l, m, n, o, p;
        while (i < k) {
          j = Math.floor((i + k) / 2), l = this.charOffsetInPart[j], j === g ? m = Number.MAX_VALUE : j + 1 === g ? m =
            h : m = this.charOffsetInPart[j + 1], j === f ? n = Number.MIN_VALUE : n = this.charOffsetInPart[j - 1],
            o = (n + l) / 2, p = (l + m) / 2;
          if (o < c && c <= p) return j + 1;
          c <= o ? k = j - 1 : i = j + 1
        }
        return i + 1
      }, a.prototype.getInnerSpansTopOffset = function() {
        return this.getReadingTarget().offsetTop
      }, a
    }(),
    p = function(a) {
      function b(b, c) {
        a.call(this, b, c)
      }
      return __extends(b, a), b.prototype.createRawVisibleRangesFromClientRects = function(a, b, c) {
        var d = a.length,
          e, f, g = [],
          h = screen.logicalYDPI / screen.deviceYDPI,
          i = screen.logicalXDPI / screen.deviceXDPI;
        g = new Array(d);
        for (f = 0; f < d; f++) e = a[f], g[f] = new n(e.top * h - b, e.left * i - c, e.width * i, e.height * h);
        return g
      }, b
    }(o),
    q = function(a) {
      function b(b, c) {
        a.call(this, b, c)
      }
      return __extends(b, a), b.prototype.readVisibleRangesForRange = function(b, c, d, e, f, g, h) {
        var i = a.prototype.readVisibleRangesForRange.call(this, b, c, d, e, f, g, h);
        if (!i || i.length === 0 || c === d || c === 1 && d === this.charOffsetInPart.length) return i;
        var j = this.readRawVisibleRangesForPosition(b, d - 1, e, f, g, h),
          k = this.readRawVisibleRangesForPosition(b, d, e, f, g, h);
        if (j && j.length > 0 && k && k.length > 0) {
          var l = j[0],
            m = k[0],
            n = !0;
          l.top === m.top && (n = l.left <= m.left);
          var o = i[i.length - 1];
          n && o.top === m.top && o.left < m.left ? o.width = m.left - o.left : o.top > m.top && i.splice(i.length -
            1, 1)
        }
        return i
      }, b
    }(o),
    r = function() {
      function a() {
        this._handyReadyRange = document.createRange()
      }
      return a.prototype.createRange = function() {
        return this._handyReadyRange
      }, a.prototype.detachRange = function(a, b) {
        a.selectNodeContents(b)
      }, a
    }(),
    s = new r;
  b.createLine = v
})