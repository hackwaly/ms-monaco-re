define(["require", "exports", "vs/base/arrays"], function(a, b, c) {
  function f(a, b, c) {
    return c.length > 0 ? new h(a, b, c) : new g(b);
  }
  var d = c;

  var e = 1e6;
  b.createLineParts = f;
  var g = function() {
    function a(a) {
      this.lineTokens = a;
    }
    a.prototype.getParts = function() {
      return this.lineTokens.getTokens();
    };

    a.prototype.equals = function(b) {
      if (b instanceof a) {
        var c = b;
        return this.lineTokens.equals(c.lineTokens);
      }
      return !1;
    };

    a.prototype.findIndexOfOffset = function(a) {
      return this.lineTokens.findIndexOfOffset(a);
    };

    return a;
  }();
  b.FastViewLineParts = g;
  var h = function() {
    function a(a, b, c) {
      var d = l.normalize(a, c);

      var e = 0;

      var f = d.length;

      var g = b.getTokens();

      var h;

      var j;

      var k;

      var m = [];
      for (var n = 0, o = g.length; n < o; n++) {
        h = g[n].startIndex;

        j = n + 1 < o ? g[n + 1].startIndex : b.getTextLength();

        k = g[n].type;
        while (e < f && d[e].startOffset < j) {
          if (d[e].startOffset > h) {
            m.push(new i(h, k));
            h = d[e].startOffset;
          }

          m.push(new i(h, k + " " + d[e].className));
          if (d[e].endOffset >= j) {
            h = j;
            break;
          }
          h = d[e].endOffset + 1;

          e++;
        }
        if (h < j) {
          m.push(new i(h, k));
        }
      }
      this.parts = m;

      this.lastPartIndex = m.length - 1;

      this.lastEndOffset = j;
    }
    a.prototype.getParts = function() {
      return this.parts;
    };

    a.prototype.equals = function(b) {
      if (b instanceof a) {
        var c = b;
        if (this.lastPartIndex !== c.lastPartIndex) {
          return !1;
        }
        if (this.lastEndOffset !== c.lastEndOffset) {
          return !1;
        }
        for (var d = 0, e = this.parts.length; d < e; d++) {
          if (this.parts[d].startIndex !== c.parts[d].startIndex) {
            return !1;
          }
          if (this.parts[d].type !== c.parts[d].type) {
            return !1;
          }
        }
        return !0;
      }
      return !1;
    };

    a.prototype.findIndexOfOffset = function(a) {
      return d.findIndexInSegmentsArray(this.parts, a);
    };

    return a;
  }();
  b.ViewLineParts = h;
  var i = function() {
    function a(a, b) {
      this.startIndex = a;

      this.type = b;
    }
    return a;
  }();

  var j = function() {
    function a(a, b, c) {
      this.startOffset = a;

      this.endOffset = b;

      this.className = c;
    }
    return a;
  }();

  var k = function() {
    function a() {
      this.stopOffsets = [];

      this.classNames = [];

      this.count = 0;
    }
    a.prototype.consumeLowerThan = function(a, b, c) {
      while (this.count > 0 && this.stopOffsets[0] < a) {
        var d = 0;
        while (d + 1 < this.count && this.stopOffsets[d] === this.stopOffsets[d + 1]) {
          d++;
        }
        c.push(new j(b, this.stopOffsets[d], this.classNames.join(" ")));

        b = this.stopOffsets[d] + 1;

        this.stopOffsets.splice(0, d + 1);

        this.classNames.splice(0, d + 1);

        this.count -= d + 1;
      }
      return b;
    };

    a.prototype.insert = function(a, b) {
      if (this.count === 0 || this.stopOffsets[this.count - 1] <= a) {
        this.stopOffsets.push(a);
        this.classNames.push(b);
      } else
        for (var c = 0; c < this.count; c++)
          if (this.stopOffsets[c] >= a) {
            this.stopOffsets.splice(c, 0, a);

            this.classNames.splice(c, 0, b);
            break;
          }
      this.count++;
      return;
    };

    return a;
  }();

  var l = function() {
    function a() {}
    a.normalize = function(a, b) {
      var c = [];
      if (b.length === 0) {
        return c;
      }
      var d = new k;

      var f = 0;

      var g;

      var h;

      var i;

      var j;

      var l;
      for (j = 0, l = b.length; j < l; j++) {
        g = b[j];

        h = g.range.startLineNumber === a ? g.range.startColumn - 1 : 0;

        i = g.range.endLineNumber === a ? g.range.endColumn - 2 : e - 1;
        if (i < 0) continue;
        f = d.consumeLowerThan(h, f, c);

        if (d.count === 0) {
          f = h;
        }

        d.insert(i, g.options.inlineClassName);
      }
      d.consumeLowerThan(e, f, c);

      return c;
    };

    return a;
  }();
});