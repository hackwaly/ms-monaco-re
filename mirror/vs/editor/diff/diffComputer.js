define(["vs/base/lib/winjs.base", "vs/editor/diff/diff"], function(a, b) {
  function i(a) {
    if (a.length <= 1) return a;
    var b = [a[0]],
      c, e, f, g, h, i = b[0],
      j;
    for (c = 1, e = a.length; c < e; c++) j = a[c], f = j.originalStart - (i.originalStart + i.originalLength), g = j
      .modifiedStart - (i.modifiedStart + i.modifiedLength), h = Math.min(f, g), h < d ? (i.originalLength = j.originalStart +
        j.originalLength - i.originalStart, i.modifiedLength = j.modifiedStart + j.modifiedLength - i.modifiedStart) :
      (b.push(j), i = j);
    return b
  }
  var c = 2e3,
    d = 3,
    e = b.LcsDiff,
    f = a.Class.define(function(b, c, d) {
      this.buffer = b, this.startMarkers = c, this.endMarkers = d
    }, {
      getLength: function() {
        return this.startMarkers.length
      },
      getElementHash: function(a) {
        return this.buffer.substring(this.startMarkers[a].offset, this.endMarkers[a].offset)
      },
      getStartLineNumber: function(a) {
        return a === this.startMarkers.length ? this.startMarkers[a - 1].lineNumber + 1 : this.startMarkers[a].lineNumber
      },
      getStartColumn: function(a) {
        return this.startMarkers[a].column
      },
      getEndLineNumber: function(a) {
        return this.endMarkers[a].lineNumber
      },
      getEndColumn: function(a) {
        return this.endMarkers[a].column
      }
    }),
    g = a.Class.derive(f, function(b, c) {
      var d, e, g, h = "",
        i = [],
        j = [],
        k, l;
      for (g = 0, d = 0, e = b.length; d < e; d++) h += b[d], k = 1, l = b[d].length + 1, c && (k = this._getFirstNonBlankColumn(
        b[d], 1), l = this._getLastNonBlankColumn(b[d], 1)), i.push({
        offset: g + k - 1,
        lineNumber: d + 1,
        column: k
      }), j.push({
        offset: g + l - 1,
        lineNumber: d + 1,
        column: l
      }), g += b[d].length;
      f.call(this, h, i, j)
    }, {
      _getFirstNonBlankColumn: function(a, b) {
        for (var c = 0, d = a.length; c < d; c++)
          if (a.charAt(c) !== " " && a.charAt(c) !== "	") return c + 1;
        return b
      },
      _getLastNonBlankColumn: function(a, b) {
        for (var c = a.length - 1; c >= 0; c--)
          if (a.charAt(c) !== " " && a.charAt(c) !== "	") return c + 2;
        return b
      },
      getCharSequence: function(a, b) {
        var c = [],
          d = [],
          e, g, h, i;
        for (e = a; e <= b; e++) {
          h = this.startMarkers[e], i = this.endMarkers[e];
          for (g = h.offset; g < i.offset; g++) c.push({
            offset: g,
            lineNumber: h.lineNumber,
            column: h.column + (g - h.offset)
          }), d.push({
            offset: g + 1,
            lineNumber: h.lineNumber,
            column: h.column + (g - h.offset) + 1
          })
        }
        return new f(this.buffer, c, d)
      }
    }),
    h = a.Class.define(function(b, c, d) {
      b.originalLength === 0 ? (this.originalStartLineNumber = 0, this.originalStartColumn = 0, this.originalEndLineNumber =
        0, this.originalEndColumn = 0) : (this.originalStartLineNumber = c.getStartLineNumber(b.originalStart),
        this.originalStartColumn = c.getStartColumn(b.originalStart), this.originalEndLineNumber = c.getEndLineNumber(
          b.originalStart + b.originalLength - 1), this.originalEndColumn = c.getEndColumn(b.originalStart + b.originalLength -
          1)), b.modifiedLength === 0 ? (this.modifiedStartLineNumber = 0, this.modifiedStartColumn = 0, this.modifiedEndLineNumber =
        0, this.modifiedEndColumn = 0) : (this.modifiedStartLineNumber = d.getStartLineNumber(b.modifiedStart),
        this.modifiedStartColumn = d.getStartColumn(b.modifiedStart), this.modifiedEndLineNumber = d.getEndLineNumber(
          b.modifiedStart + b.modifiedLength - 1), this.modifiedEndColumn = d.getEndColumn(b.modifiedStart + b.modifiedLength -
          1))
    }),
    j = a.Class.define(function(b, c, d, f, g) {
      b.originalLength === 0 ? (this.originalStartLineNumber = c.getStartLineNumber(b.originalStart) - 1, this.originalEndLineNumber =
        0) : (this.originalStartLineNumber = c.getStartLineNumber(b.originalStart), this.originalEndLineNumber = c.getEndLineNumber(
        b.originalStart + b.originalLength - 1)), b.modifiedLength === 0 ? (this.modifiedStartLineNumber = d.getStartLineNumber(
        b.modifiedStart) - 1, this.modifiedEndLineNumber = 0) : (this.modifiedStartLineNumber = d.getStartLineNumber(
        b.modifiedStart), this.modifiedEndLineNumber = d.getEndLineNumber(b.modifiedStart + b.modifiedLength - 1));
      if (b.originalLength !== 0 && b.modifiedLength !== 0 && f()) {
        var j = c.getCharSequence(b.originalStart, b.originalStart + b.originalLength - 1),
          k = d.getCharSequence(b.modifiedStart, b.modifiedStart + b.modifiedLength - 1),
          l = new e(j, k, f),
          m = l.ComputeDiff();
        g && (m = i(m)), this.charChanges = [];
        for (var n = 0, o = m.length; n < o; n++) this.charChanges.push(new h(m[n], j, k))
      }
    }),
    k = a.Class.define(function(b, d, e, f) {
      this.shouldPostProcessCharChanges = e || !1, this.shouldIgnoreTrimWhitespace = f || !1, this.maximumRunTimeMs =
        c, this.original = new g(b, this.shouldIgnoreTrimWhitespace), this.modified = new g(d, this.shouldIgnoreTrimWhitespace)
    }, {
      computeDiff: function() {
        this.computationStartTime = (new Date).getTime();
        var a = new e(this.original, this.modified, this._continueProcessingPredicate.bind(this)),
          b = a.ComputeDiff(),
          c = [];
        for (var d = 0, f = b.length; d < f; d++) c.push(new j(b[d], this.original, this.modified, this._continueProcessingPredicate
          .bind(this), this.shouldPostProcessCharChanges));
        return c
      },
      _continueProcessingPredicate: function() {
        if (this.maximumRunTimeMs === 0) return !0;
        var a = (new Date).getTime();
        return a - this.computationStartTime < this.maximumRunTimeMs
      }
    });
  return {
    DiffComputer: k
  }
})