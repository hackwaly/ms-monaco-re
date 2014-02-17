define("vs/base/diff/diff", ["require", "exports", "vs/base/diff/diffChange"], function(e, t, n) {
  var i = function() {
    function e() {}
    e.Assert = function(e, t) {
      if (!e) throw new Error(t);
    };

    return e;
  }();
  t.Debug = i;
  var o = function() {
    function e() {}
    e.Copy = function(e, t, n, i, o) {
      for (var r = 0; o > r; r++) {
        n[i + r] = e[t + r];
      }
    };

    return e;
  }();
  t.MyArray = o;
  var r = 1447;

  var s = function() {
    function e() {
      this.m_changes = [];

      this.m_originalStart = Number.MAX_VALUE;

      this.m_modifiedStart = Number.MAX_VALUE;

      this.m_originalCount = 0;

      this.m_modifiedCount = 0;
    }
    e.prototype.MarkNextChange = function() {
      (this.m_originalCount > 0 || this.m_modifiedCount > 0) && this.m_changes.push(new n.DiffChange(this.m_originalStart,
        this.m_originalCount, this.m_modifiedStart, this.m_modifiedCount));

      this.m_originalCount = 0;

      this.m_modifiedCount = 0;

      this.m_originalStart = Number.MAX_VALUE;

      this.m_modifiedStart = Number.MAX_VALUE;
    };

    e.prototype.AddOriginalElement = function(e, t) {
      this.m_originalStart = Math.min(this.m_originalStart, e);

      this.m_modifiedStart = Math.min(this.m_modifiedStart, t);

      this.m_originalCount++;
    };

    e.prototype.AddModifiedElement = function(e, t) {
      this.m_originalStart = Math.min(this.m_originalStart, e);

      this.m_modifiedStart = Math.min(this.m_modifiedStart, t);

      this.m_modifiedCount++;
    };

    e.prototype.getChanges = function() {
      (this.m_originalCount > 0 || this.m_modifiedCount > 0) && this.MarkNextChange();

      return this.m_changes;
    };

    e.prototype.getReverseChanges = function() {
      (this.m_originalCount > 0 || this.m_modifiedCount > 0) && this.MarkNextChange();

      this.m_changes.reverse();

      return this.m_changes;
    };

    return e;
  }();

  var a = function() {
    function e(e, t, n) {
      "undefined" == typeof n && (n = null);

      this.OriginalSequence = e;

      this.ModifiedSequence = t;

      this.ContinueProcessingPredicate = n;

      this.m_originalIds = [];

      this.m_modifiedIds = [];

      this.m_forwardHistory = [];

      this.m_reverseHistory = [];

      this.ComputeUniqueIdentifiers();
    }
    e.prototype.ComputeUniqueIdentifiers = function() {
      var e = this.OriginalSequence.getLength();

      var t = this.ModifiedSequence.getLength();
      this.m_originalIds = new Array(e);

      this.m_modifiedIds = new Array(t);
      var n;

      var i = {};

      var o = 1;
      for (n = 0; e > n; n++) {
        var r = this.OriginalSequence.getElementHash(n);
        i.hasOwnProperty(r) ? this.m_originalIds[n] = i[r] : (this.m_originalIds[n] = o++, i[r] = this.m_originalIds[
          n]);
      }
      for (n = 0; t > n; n++) {
        var s = this.ModifiedSequence.getElementHash(n);
        i.hasOwnProperty(s) ? this.m_modifiedIds[n] = i[s] : (this.m_modifiedIds[n] = o++, i[s] = this.m_modifiedIds[
          n]);
      }
    };

    e.prototype.ElementsAreEqual = function(e, t) {
      return this.m_originalIds[e] === this.m_modifiedIds[t];
    };

    e.prototype.ComputeDiff = function() {
      return this._ComputeDiff(0, this.OriginalSequence.getLength() - 1, 0, this.ModifiedSequence.getLength() - 1);
    };

    e.prototype._ComputeDiff = function(e, t, n, i) {
      var o = [!1];
      return this.ComputeDiffRecursive(e, t, n, i, o);
    };

    e.prototype.ComputeDiffRecursive = function(e, t, o, r, s) {
      for (s[0] = !1; t >= e && r >= o && this.ElementsAreEqual(e, o);) {
        e++;
        o++;
      }
      for (; t >= e && r >= o && this.ElementsAreEqual(t, r);) {
        t--;
        r--;
      }
      if (e > t || o > r) {
        var a;
        r >= o ? (i.Assert(e === t + 1, "originalStart should only be one more than originalEnd"), a = [new n.DiffChange(
          e, 0, o, r - o + 1)]) : t >= e ? (i.Assert(o === r + 1,
          "modifiedStart should only be one more than modifiedEnd"), a = [new n.DiffChange(e, t - e + 1, o, 0)]) : (i
          .Assert(e === t + 1, "originalStart should only be one more than originalEnd"), i.Assert(o === r + 1,
            "modifiedStart should only be one more than modifiedEnd"), a = []);

        return a;
      }
      var u = [0];

      var l = [0];

      var c = this.ComputeRecursionPoint(e, t, o, r, u, l, s);

      var d = u[0];

      var h = l[0];
      if (null !== c) {
        return c;
      }
      if (!s[0]) {
        var p = this.ComputeDiffRecursive(e, d, o, h, s);

        var f = [];
        f = s[0] ? [new n.DiffChange(d + 1, t - (d + 1) + 1, h + 1, r - (h + 1) + 1)] : this.ComputeDiffRecursive(d +
          1, t, h + 1, r, s);

        return this.ConcatenateChanges(p, f);
      }
      return [new n.DiffChange(e, t - e + 1, o, r - o + 1)];
    };

    e.prototype.WALKTRACE = function(e, t, i, o, r, a, u, l, c, d, h, p, f, g, m, v, y, _) {
      var b;

      var C = null;

      var w = null;

      var E = new s;

      var S = t;

      var L = i;

      var T = f[0] - v[0] - o;

      var x = Number.MIN_VALUE;

      var N = this.m_forwardHistory.length - 1;
      do {
        b = T + e;
        b === S || L > b && c[b - 1] < c[b + 1] ? (h = c[b + 1], g = h - T - o, x > h && E.MarkNextChange(), x = h, E
          .AddModifiedElement(h + 1, g), T = b + 1 - e) : (h = c[b - 1] + 1, g = h - T - o, x > h && E.MarkNextChange(),
          x = h - 1, E.AddOriginalElement(h, g + 1), T = b - 1 - e);
        N >= 0 && (c = this.m_forwardHistory[N], e = c[0], S = 1, L = c.length - 1);
      } while (--N >= -1);
      if (C = E.getReverseChanges(), _[0]) {
        var M = f[0] + 1;

        var k = v[0] + 1;
        if (null !== C && C.length > 0) {
          var I = C[C.length - 1];
          M = Math.max(M, I.getOriginalEnd());

          k = Math.max(k, I.getModifiedEnd());
        }
        w = [new n.DiffChange(M, p - M + 1, k, m - k + 1)];
      } else {
        E = new s;

        S = a;

        L = u;

        T = f[0] - v[0] - l;

        x = Number.MAX_VALUE;

        N = y ? this.m_reverseHistory.length - 1 : this.m_reverseHistory.length - 2;
        do {
          b = T + r;
          b === S || L > b && d[b - 1] >= d[b + 1] ? (h = d[b + 1] - 1, g = h - T - l, h > x && E.MarkNextChange(), x =
            h + 1, E.AddOriginalElement(h + 1, g + 1), T = b + 1 - r) : (h = d[b - 1], g = h - T - l, h > x && E.MarkNextChange(),
            x = h, E.AddModifiedElement(h + 1, g + 1), T = b - 1 - r);
          N >= 0 && (d = this.m_reverseHistory[N], r = d[0], S = 1, L = d.length - 1);
        } while (--N >= -1);
        w = E.getChanges();
      }
      return this.ConcatenateChanges(C, w);
    };

    e.prototype.ComputeRecursionPoint = function(e, t, i, s, a, u, l) {
      var c;

      var d;

      var h;

      var p = 0;

      var f = 0;

      var g = 0;

      var m = 0;
      e--;

      i--;

      a[0] = 0;

      u[0] = 0;

      this.m_forwardHistory = [];

      this.m_reverseHistory = [];
      var v = t - e + (s - i);

      var y = v + 1;

      var _ = new Array(y);

      var b = new Array(y);

      var C = s - i;

      var w = t - e;

      var E = e - i;

      var S = t - s;

      var L = w - C;

      var T = L % 2 === 0;
      _[C] = e;

      b[w] = t;

      l[0] = !1;
      var x;

      var N;
      for (h = 1; v / 2 + 1 >= h; h++) {
        var M = 0;

        var k = 0;
        for (p = this.ClipDiagonalBound(C - h, h, C, y), f = this.ClipDiagonalBound(C + h, h, C, y), x = p; f >= x; x +=
          2) {
          for (c = x === p || f > x && _[x - 1] < _[x + 1] ? _[x + 1] : _[x - 1] + 1, d = c - (x - C) - E, N = c; t >
            c && s > d && this.ElementsAreEqual(c + 1, d + 1);) {
            c++;
            d++;
          }
          if (_[x] = c, c + d > M + k && (M = c, k = d), !T && Math.abs(x - w) <= h - 1 && c >= b[x]) {
            a[0] = c;
            u[0] = d;
            return N <= b[x] && r > 0 && r + 1 >= h ? this.WALKTRACE(C, p, f, E, w, g, m, S, _, b, c, t, a, d, s, u,
              T, l) : null;
          }
        }
        var I = (M - e + (k - i) - h) / 2;
        if (null !== this.ContinueProcessingPredicate && !this.ContinueProcessingPredicate(M, this.OriginalSequence,
          I)) {
          l[0] = !0;
          a[0] = M;
          u[0] = k;
          return I > 0 && r > 0 && r + 1 >= h ? this.WALKTRACE(C, p, f, E, w, g, m, S, _, b, c, t, a, d, s, u, T, l) :
            (e++, i++, [new n.DiffChange(e, t - e + 1, i, s - i + 1)]);
        }
        for (g = this.ClipDiagonalBound(w - h, h, w, y), m = this.ClipDiagonalBound(w + h, h, w, y), x = g; m >= x; x +=
          2) {
          for (c = x === g || m > x && b[x - 1] >= b[x + 1] ? b[x + 1] - 1 : b[x - 1], d = c - (x - w) - S, N = c; c >
            e && d > i && this.ElementsAreEqual(c, d);) {
            c--;
            d--;
          }
          if (b[x] = c, T && Math.abs(x - C) <= h && c <= _[x]) {
            a[0] = c;
            u[0] = d;
            return N >= _[x] && r > 0 && r + 1 >= h ? this.WALKTRACE(C, p, f, E, w, g, m, S, _, b, c, t, a, d, s, u,
              T, l) : null;
          }
        }
        if (r >= h) {
          var D = new Array(f - p + 2);
          D[0] = C - p + 1;

          o.Copy(_, p, D, 1, f - p + 1);

          this.m_forwardHistory.push(D);

          D = new Array(m - g + 2);

          D[0] = w - g + 1;

          o.Copy(b, g, D, 1, m - g + 1);

          this.m_reverseHistory.push(D);
        }
      }
      return this.WALKTRACE(C, p, f, E, w, g, m, S, _, b, c, t, a, d, s, u, T, l);
    };

    e.prototype.ConcatenateChanges = function(e, t) {
      var n = [];

      var i = null;
      return 0 === e.length || 0 === t.length ? t.length > 0 ? t : e : this.ChangesOverlap(e[e.length - 1], t[0], n) ?
        (i = new Array(e.length + t.length - 1), o.Copy(e, 0, i, 0, e.length - 1), i[e.length - 1] = n[0], o.Copy(t,
        1, i, e.length, t.length - 1), i) : (i = new Array(e.length + t.length), o.Copy(e, 0, i, 0, e.length), o.Copy(
        t, 0, i, e.length, t.length), i);
    };

    e.prototype.ChangesOverlap = function(e, t, o) {
      if (i.Assert(e.originalStart <= t.originalStart, "Left change is not less than or equal to right change"), i.Assert(
          e.modifiedStart <= t.modifiedStart, "Left change is not less than or equal to right change"), e.originalStart +
        e.originalLength >= t.originalStart || e.modifiedStart + e.modifiedLength >= t.modifiedStart) {
        var r = e.originalStart;

        var s = e.originalLength;

        var a = e.modifiedStart;

        var u = e.modifiedLength;
        e.originalStart + e.originalLength >= t.originalStart && (s = t.originalStart + t.originalLength - e.originalStart);

        e.modifiedStart + e.modifiedLength >= t.modifiedStart && (u = t.modifiedStart + t.modifiedLength - e.modifiedStart);

        o[0] = new n.DiffChange(r, s, a, u);

        return !0;
      }
      o[0] = null;

      return !1;
    };

    e.prototype.ClipDiagonalBound = function(e, t, n, i) {
      if (e >= 0 && i > e) {
        return e;
      }
      var o = n;

      var r = i - n - 1;

      var s = t % 2 === 0;
      if (0 > e) {
        var a = o % 2 === 0;
        return s === a ? 0 : 1;
      }
      var u = r % 2 === 0;
      return s === u ? i - 1 : i - 2;
    };

    return e;
  }();
  t.LcsDiff = a;
});