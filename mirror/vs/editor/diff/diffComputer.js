define("vs/editor/diff/diffComputer", ["require", "exports", "vs/base/diff/diff"], function(e, t, n) {
  function i(e) {
    if (e.length <= 1) {
      return e;
    }
    var t;

    var n;

    var i;

    var o;

    var s;

    var a;

    var u = [e[0]];

    var l = u[0];
    for (t = 1, n = e.length; n > t; t++) {
      a = e[t];
      i = a.originalStart - (l.originalStart + l.originalLength);
      o = a.modifiedStart - (l.modifiedStart + l.modifiedLength);
      s = Math.min(i, o);
      r > s ? (l.originalLength = a.originalStart + a.originalLength - l.originalStart, l.modifiedLength = a.modifiedStart +
        a.modifiedLength - l.modifiedStart) : (u.push(a), l = a);
    }
    return u;
  }
  var o = 2e3;

  var r = 3;

  var s = function() {
    function e(e, t, n) {
      this.buffer = e;

      this.startMarkers = t;

      this.endMarkers = n;
    }
    e.prototype.getLength = function() {
      return this.startMarkers.length;
    };

    e.prototype.getElementHash = function(e) {
      return this.buffer.substring(this.startMarkers[e].offset, this.endMarkers[e].offset);
    };

    e.prototype.getStartLineNumber = function(e) {
      return e === this.startMarkers.length ? this.startMarkers[e - 1].lineNumber + 1 : this.startMarkers[e].lineNumber;
    };

    e.prototype.getStartColumn = function(e) {
      return this.startMarkers[e].column;
    };

    e.prototype.getEndLineNumber = function(e) {
      return this.endMarkers[e].lineNumber;
    };

    e.prototype.getEndColumn = function(e) {
      return this.endMarkers[e].column;
    };

    return e;
  }();

  var a = function(e) {
    function t(t, n) {
      var i;

      var o;

      var r;

      var s;

      var a;

      var u = "";

      var l = [];

      var c = [];
      for (r = 0, i = 0, o = t.length; o > i; i++) {
        u += t[i];
        s = 1;
        a = t[i].length + 1;
        n && (s = this._getFirstNonBlankColumn(t[i], 1), a = this._getLastNonBlankColumn(t[i], 1));
        l.push({
          offset: r + s - 1,
          lineNumber: i + 1,
          column: s
        });
        c.push({
          offset: r + a - 1,
          lineNumber: i + 1,
          column: a
        });
        r += t[i].length;
      }
      e.call(this, u, l, c);
    }
    __extends(t, e);

    t.prototype._getFirstNonBlankColumn = function(e, t) {
      for (var n = 0, i = e.length; i > n; n++)
        if (" " !== e.charAt(n) && "	" !== e.charAt(n)) {
          return n + 1;
        }
      return t;
    };

    t.prototype._getLastNonBlankColumn = function(e, t) {
      for (var n = e.length - 1; n >= 0; n--)
        if (" " !== e.charAt(n) && "	" !== e.charAt(n)) {
          return n + 2;
        }
      return t;
    };

    t.prototype.getCharSequence = function(e, t) {
      var n;

      var i;

      var o;

      var r;

      var a = [];

      var u = [];
      for (n = e; t >= n; n++)
        for (o = this.startMarkers[n], r = this.endMarkers[n], i = o.offset; i < r.offset; i++) {
          a.push({
            offset: i,
            lineNumber: o.lineNumber,
            column: o.column + (i - o.offset)
          });
          u.push({
            offset: i + 1,
            lineNumber: o.lineNumber,
            column: o.column + (i - o.offset) + 1
          });
        }
      return new s(this.buffer, a, u);
    };

    return t;
  }(s);

  var u = function() {
    function e(e, t, n) {
      0 === e.originalLength ? (this.originalStartLineNumber = 0, this.originalStartColumn = 0, this.originalEndLineNumber =
        0, this.originalEndColumn = 0) : (this.originalStartLineNumber = t.getStartLineNumber(e.originalStart), this.originalStartColumn =
        t.getStartColumn(e.originalStart), this.originalEndLineNumber = t.getEndLineNumber(e.originalStart + e.originalLength -
          1), this.originalEndColumn = t.getEndColumn(e.originalStart + e.originalLength - 1));

      0 === e.modifiedLength ? (this.modifiedStartLineNumber = 0, this.modifiedStartColumn = 0, this.modifiedEndLineNumber =
        0, this.modifiedEndColumn = 0) : (this.modifiedStartLineNumber = n.getStartLineNumber(e.modifiedStart), this.modifiedStartColumn =
        n.getStartColumn(e.modifiedStart), this.modifiedEndLineNumber = n.getEndLineNumber(e.modifiedStart + e.modifiedLength -
          1), this.modifiedEndColumn = n.getEndColumn(e.modifiedStart + e.modifiedLength - 1));
    }
    return e;
  }();

  var l = function() {
    function e(e, t, o, r, s) {
      if (0 === e.originalLength ? (this.originalStartLineNumber = t.getStartLineNumber(e.originalStart) - 1, this.originalEndLineNumber =
          0) : (this.originalStartLineNumber = t.getStartLineNumber(e.originalStart), this.originalEndLineNumber = t.getEndLineNumber(
          e.originalStart + e.originalLength - 1)), 0 === e.modifiedLength ? (this.modifiedStartLineNumber = o.getStartLineNumber(
          e.modifiedStart) - 1, this.modifiedEndLineNumber = 0) : (this.modifiedStartLineNumber = o.getStartLineNumber(
          e.modifiedStart), this.modifiedEndLineNumber = o.getEndLineNumber(e.modifiedStart + e.modifiedLength - 1)),
        0 !== e.originalLength && 0 !== e.modifiedLength && r()) {
        var a = t.getCharSequence(e.originalStart, e.originalStart + e.originalLength - 1);

        var l = o.getCharSequence(e.modifiedStart, e.modifiedStart + e.modifiedLength - 1);

        var c = new n.LcsDiff(a, l, r);

        var d = c.ComputeDiff();
        s && (d = i(d));

        this.charChanges = [];
        for (var h = 0, p = d.length; p > h; h++) {
          this.charChanges.push(new u(d[h], a, l));
        }
      }
    }
    return e;
  }();

  var c = function() {
    function e(e, t, n, i) {
      this.shouldPostProcessCharChanges = n || !1;

      this.shouldIgnoreTrimWhitespace = i || !1;

      this.maximumRunTimeMs = o;

      this.original = new a(e, this.shouldIgnoreTrimWhitespace);

      this.modified = new a(t, this.shouldIgnoreTrimWhitespace);
    }
    e.prototype.computeDiff = function() {
      this.computationStartTime = (new Date).getTime();
      for (var e = new n.LcsDiff(this.original, this.modified, this._continueProcessingPredicate.bind(this)), t = e.ComputeDiff(),
          i = [], o = 0, r = t.length; r > o; o++) {
        i.push(new l(t[o], this.original, this.modified, this._continueProcessingPredicate.bind(this), this.shouldPostProcessCharChanges));
      }
      return i;
    };

    e.prototype._continueProcessingPredicate = function() {
      if (0 === this.maximumRunTimeMs) {
        return !0;
      }
      var e = (new Date).getTime();
      return e - this.computationStartTime < this.maximumRunTimeMs;
    };

    return e;
  }();
  t.DiffComputer = c;
});