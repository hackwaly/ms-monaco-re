define("vs/editor/core/view/lines/viewLineParts", ["require", "exports", "vs/base/arrays"], function(e, t, n) {
  function i(e, t, n) {
    return n.length > 0 ? new r(e, t, n) : new o(t);
  }
  t.createLineParts = i;
  var o = function() {
    function e(e) {
      this.lineTokens = e;
    }
    e.prototype.getParts = function() {
      return this.lineTokens.getTokens();
    };

    e.prototype.equals = function(t) {
      if (t instanceof e) {
        var n = t;
        return this.lineTokens.equals(n.lineTokens);
      }
      return !1;
    };

    e.prototype.findIndexOfOffset = function(e) {
      return this.lineTokens.findIndexOfOffset(e);
    };

    return e;
  }();
  t.FastViewLineParts = o;
  var r = function() {
    function e(e, t, n) {
      for (var i, o, r, a = l.normalize(e, n), u = 0, c = a.length, d = t.getTokens(), h = [], p = 0, f = d.length; f >
        p; p++) {
        for (i = d[p].startIndex, o = f > p + 1 ? d[p + 1].startIndex : t.getTextLength(), r = d[p].type; c > u && a[
          u].startOffset < o;) {
          if (a[u].startOffset > i && (h.push(new s(i, r)), i = a[u].startOffset), h.push(new s(i, r + " " + a[u].className)),
            a[u].endOffset >= o) {
            i = o;
            break;
          }
          i = a[u].endOffset + 1;

          u++;
        }
        o > i && h.push(new s(i, r));
      }
      this.parts = h;

      this.lastPartIndex = h.length - 1;

      this.lastEndOffset = o;
    }
    e.prototype.getParts = function() {
      return this.parts;
    };

    e.prototype.equals = function(t) {
      if (t instanceof e) {
        var n = t;
        if (this.lastPartIndex !== n.lastPartIndex) return !1;
        if (this.lastEndOffset !== n.lastEndOffset) return !1;
        for (var i = 0, o = this.parts.length; o > i; i++) {
          if (this.parts[i].startIndex !== n.parts[i].startIndex) return !1;
          if (this.parts[i].type !== n.parts[i].type) return !1;
        }
        return !0;
      }
      return !1;
    };

    e.prototype.findIndexOfOffset = function(e) {
      return n.findIndexInSegmentsArray(this.parts, e);
    };

    return e;
  }();
  t.ViewLineParts = r;
  var s = function() {
    function e(e, t) {
      this.startIndex = e;

      this.type = t;
    }
    return e;
  }();

  var a = function() {
    function e(e, t, n) {
      this.startOffset = e;

      this.endOffset = t;

      this.className = n;
    }
    return e;
  }();
  t.DecorationSegment = a;
  var u = function() {
    function e() {
      this.stopOffsets = [];

      this.classNames = [];

      this.count = 0;
    }
    e.prototype.consumeLowerThan = function(e, t, n) {
      for (; this.count > 0 && this.stopOffsets[0] < e;) {
        for (var i = 0; i + 1 < this.count && this.stopOffsets[i] === this.stopOffsets[i + 1];) i++;
        n.push(new a(t, this.stopOffsets[i], this.classNames.join(" ")));

        t = this.stopOffsets[i] + 1;

        this.stopOffsets.splice(0, i + 1);

        this.classNames.splice(0, i + 1);

        this.count -= i + 1;
      }
      this.count > 0 && e > t && (n.push(new a(t, e - 1, this.classNames.join(" "))), t = e);

      return t;
    };

    e.prototype.insert = function(e, t) {
      if (0 === this.count || this.stopOffsets[this.count - 1] <= e) this.stopOffsets.push(e);

      this.classNames.push(t);
      else
        for (var n = 0; n < this.count; n++)
          if (this.stopOffsets[n] >= e) {
            this.stopOffsets.splice(n, 0, e);

            this.classNames.splice(n, 0, t);
            break;
          }
      this.count++;
    };

    return e;
  }();

  var l = function() {
    function e() {}
    e.normalize = function(t, n) {
      var i = [];
      if (0 === n.length) return i;
      var o;

      var r;

      var s;

      var a;

      var l;

      var c = new u;

      var d = 0;
      for (a = 0, l = n.length; l > a; a++) o = n[a];

      o.range.endLineNumber < t || o.range.startLineNumber > t || (r = o.range.startLineNumber === t ? o.range.startColumn -
        1 : 0, s = o.range.endLineNumber === t ? o.range.endColumn - 2 : e.MAX_LINE_LENGTH - 1, 0 > s || (d = c.consumeLowerThan(
          r, d, i), 0 === c.count && (d = r), c.insert(s, o.options.inlineClassName)));
      c.consumeLowerThan(e.MAX_LINE_LENGTH, d, i);

      return i;
    };

    e.MAX_LINE_LENGTH = 1e7;

    return e;
  }();
  t.LineDecorationsNormalizer = l;
});