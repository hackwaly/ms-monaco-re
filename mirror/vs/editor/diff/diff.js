define(["vs/base/lib/winjs.base", "vs/editor/diff/diffChange"], function(a, b) {
  var c = b.DiffChange;

  var d = {
    Assert: function(a, b) {
      if (!a) throw new Error(b);
    }
  };

  var e = {
    Copy: function(a, b, c, d, e) {
      for (var f = 0; f < e; f++) {
        c[d + f] = a[b + f];
      }
    }
  };

  var f = 1447;

  var g = a.Class.define(function() {
    this.m_changes = [];

    this.m_originalStart = Number.MAX_VALUE;

    this.m_modifiedStart = Number.MAX_VALUE;

    this.m_originalCount = 0;

    this.m_modifiedCount = 0;
  }, {
    MarkNextChange: function() {
      if (this.m_originalCount > 0 || this.m_modifiedCount > 0) {
        this.m_changes.push(new c(this.m_originalStart, this.m_originalCount, this.m_modifiedStart, this.m_modifiedCount));
      }

      this.m_originalCount = 0;

      this.m_modifiedCount = 0;

      this.m_originalStart = Number.MAX_VALUE;

      this.m_modifiedStart = Number.MAX_VALUE;
    },
    AddOriginalElement: function(a, b) {
      this.m_originalStart = Math.min(this.m_originalStart, a);

      this.m_modifiedStart = Math.min(this.m_modifiedStart, b);

      this.m_originalCount++;
    },
    AddModifiedElement: function(a, b) {
      this.m_originalStart = Math.min(this.m_originalStart, a);

      this.m_modifiedStart = Math.min(this.m_modifiedStart, b);

      this.m_modifiedCount++;
    },
    getChanges: function() {
      (this.m_originalCount > 0 || this.m_modifiedCount > 0) && this.MarkNextChange();

      return this.m_changes;
    },
    getReverseChanges: function() {
      (this.m_originalCount > 0 || this.m_modifiedCount > 0) && this.MarkNextChange();

      this.m_changes.reverse();

      return this.m_changes;
    }
  });

  var h = a.Class.define(function(b, c, d) {
    this.OriginalSequence = b;

    this.ModifiedSequence = c;

    this.ContinueProcessingPredicate = d || null;

    this.m_originalIds = [];

    this.m_modifiedIds = [];

    this.m_forwardHistory = [];

    this.m_reverseHistory = [];

    this.ComputeUniqueIdentifiers();
  }, {
    ComputeUniqueIdentifiers: function() {
      var a = this.OriginalSequence.getLength();

      var b = this.ModifiedSequence.getLength();
      this.m_originalIds = new Array(a);

      this.m_modifiedIds = new Array(b);
      var c = {};

      var d = 1;

      var e;
      for (e = 0; e < a; e++) {
        var f = this.OriginalSequence.getElementHash(e);
        if (c.hasOwnProperty(f)) {
          this.m_originalIds[e] = c[f];
        } else {
          this.m_originalIds[e] = d++;
          c[f] = this.m_originalIds[e];
        }
      }
      for (e = 0; e < b; e++) {
        var g = this.ModifiedSequence.getElementHash(e);
        if (c.hasOwnProperty(g)) {
          this.m_modifiedIds[e] = c[g];
        } else {
          this.m_modifiedIds[e] = d++;
          c[g] = this.m_modifiedIds[e];
        }
      }
    },
    ElementsAreEqual: function(a, b) {
      return this.m_originalIds[a] === this.m_modifiedIds[b];
    },
    ComputeDiff: function() {
      return this._ComputeDiff(0, this.OriginalSequence.getLength() - 1, 0, this.ModifiedSequence.getLength() - 1);
    },
    _ComputeDiff: function(a, b, c, d) {
      var e = [!1];
      return this.ComputeDiffRecursive(a, b, c, d, e);
    },
    ComputeDiffRecursive: function(a, b, e, f, g) {
      g[0] = !1;
      while (a <= b && e <= f && this.ElementsAreEqual(a, e)) {
        a++;
        e++;
      }
      while (b >= a && f >= e && this.ElementsAreEqual(b, f)) {
        b--;
        f--;
      }
      if (a > b || e > f) {
        var h;
        e <= f ? (d.Assert(a === b + 1, "originalStart should only be one more than originalEnd"), h = [new c(a, 0,
          e, f - e + 1)]) : a <= b ? (d.Assert(e === f + 1,
          "modifiedStart should only be one more than modifiedEnd"), h = [new c(a, b - a + 1, e, 0)]) : (d.Assert(a ===
          b + 1, "originalStart should only be one more than originalEnd"), d.Assert(e === f + 1,
          "modifiedStart should only be one more than modifiedEnd"), h = []);

        return h;
      }
      var i = [0];

      var j = [0];

      var k = this.ComputeRecursionPoint(a, b, e, f, i, j, g);

      var l = i[0];

      var m = j[0];
      if (k !== null) {
        return k;
      }
      if (!g[0]) {
        var n = this.ComputeDiffRecursive(a, l, e, m, g);

        var o = [];
        g[0] ? o = [new c(l + 1, b - (l + 1) + 1, m + 1, f - (m + 1) + 1)] : o = this.ComputeDiffRecursive(l + 1, b,
          m + 1, f, g);

        return this.ConcatenateChanges(n, o);
      }
      return [new c(a, b - a + 1, e, f - e + 1)];
    },
    WALKTRACE: function(a, b, d, e, f, h, i, j, k, l, m, n, o, p, q, r, s, t) {
      var u = null;

      var v = null;

      var w = new g;

      var x = b;

      var y = d;

      var z = o[0] - r[0] - e;

      var A = Number.MIN_VALUE;

      var B = this.m_forwardHistory.length - 1;

      var C;
      do {
        C = z + a;
        if (C === x || C < y && k[C - 1] < k[C + 1]) {
          m = k[C + 1];
          p = m - z - e;
          if (m < A) {
            w.MarkNextChange();
          }
          A = m;
          w.AddModifiedElement(m + 1, p);
          z = C + 1 - a;
        } else {
          m = k[C - 1] + 1;
          p = m - z - e;
          if (m < A) {
            w.MarkNextChange();
          }
          A = m - 1;
          w.AddOriginalElement(m, p + 1);
          z = C - 1 - a;
        }
        if (B >= 0) {
          k = this.m_forwardHistory[B];
          a = k[0];
          x = 1;
          y = k.length - 1;
        }
      } while (--B >= -1);
      u = w.getReverseChanges();
      if (t[0]) {
        var D = o[0] + 1;

        var E = r[0] + 1;
        if (u !== null && u.length > 0) {
          var F = u[u.length - 1];
          D = Math.max(D, F.getOriginalEnd());

          E = Math.max(E, F.getModifiedEnd());
        }
        v = [new c(D, n - D + 1, E, q - E + 1)];
      } else {
        w = new g;

        x = h;

        y = i;

        z = o[0] - r[0] - j;

        A = Number.MAX_VALUE;

        B = s ? this.m_reverseHistory.length - 1 : this.m_reverseHistory.length - 2;
        do {
          C = z + f;
          if (C === x || C < y && l[C - 1] >= l[C + 1]) {
            m = l[C + 1] - 1;
            p = m - z - j;
            if (m > A) {
              w.MarkNextChange();
            }
            A = m + 1;
            w.AddOriginalElement(m + 1, p + 1);
            z = C + 1 - f;
          } else {
            m = l[C - 1];
            p = m - z - j;
            if (m > A) {
              w.MarkNextChange();
            }
            A = m;
            w.AddModifiedElement(m + 1, p + 1);
            z = C - 1 - f;
          }
          if (B >= 0) {
            l = this.m_reverseHistory[B];
            f = l[0];
            x = 1;
            y = l.length - 1;
          }
        } while (--B >= -1);
        v = w.getChanges();
      }
      return this.ConcatenateChanges(u, v);
    },
    ComputeRecursionPoint: function(a, b, d, g, h, i, j) {
      var k;

      var l;

      var m = 0;

      var n = 0;

      var o = 0;

      var p = 0;

      var q;
      a--;

      d--;

      h[0] = 0;

      i[0] = 0;

      this.m_forwardHistory = [];

      this.m_reverseHistory = [];
      var r = b - a + (g - d);

      var s = r + 1;

      var t = new Array(s);

      var u = new Array(s);

      var v = g - d;

      var w = b - a;

      var x = a - d;

      var y = b - g;

      var z = w - v;

      var A = z % 2 === 0;
      t[v] = a;

      u[w] = b;

      j[0] = !1;
      var B;

      var C;
      for (q = 1; q <= r / 2 + 1; q++) {
        var D = 0;

        var E = 0;
        m = this.ClipDiagonalBound(v - q, q, v, s);

        n = this.ClipDiagonalBound(v + q, q, v, s);
        for (B = m; B <= n; B += 2) {
          if (B === m || B < n && t[B - 1] < t[B + 1]) {
            k = t[B + 1];
          } else {
            k = t[B - 1] + 1;
          }

          l = k - (B - v) - x;

          C = k;
          while (k < b && l < g && this.ElementsAreEqual(k + 1, l + 1)) {
            k++;
            l++;
          }
          t[B] = k;

          if (k + l > D + E) {
            D = k;
            E = l;
          }
          if (!A && Math.abs(B - w) <= q - 1 && k >= u[B]) {
            h[0] = k;
            i[0] = l;
            return C <= u[B] && f > 0 && q <= f + 1 ? this.WALKTRACE(v, m, n, x, w, o, p, y, t, u, k, b, h, l, g, i,
              A, j) : null;
          }
        }
        var F = (D - a + (E - d) - q) / 2;
        if (this.ContinueProcessingPredicate !== null && !this.ContinueProcessingPredicate(D, this.OriginalSequence,
          F)) {
          j[0] = !0;
          h[0] = D;
          i[0] = E;
          return F > 0 && f > 0 && q <= f + 1 ? this.WALKTRACE(v, m, n, x, w, o, p, y, t, u, k, b, h, l, g, i, A, j) :
            (a++, d++, [new c(a, b - a + 1, d, g - d + 1)]);
        }
        o = this.ClipDiagonalBound(w - q, q, w, s);

        p = this.ClipDiagonalBound(w + q, q, w, s);
        for (B = o; B <= p; B += 2) {
          if (B === o || B < p && u[B - 1] >= u[B + 1]) {
            k = u[B + 1] - 1;
          } else {
            k = u[B - 1];
          }

          l = k - (B - w) - y;

          C = k;
          while (k > a && l > d && this.ElementsAreEqual(k, l)) {
            k--;
            l--;
          }
          u[B] = k;
          if (A && Math.abs(B - v) <= q && k <= t[B]) {
            h[0] = k;
            i[0] = l;
            return C >= t[B] && f > 0 && q <= f + 1 ? this.WALKTRACE(v, m, n, x, w, o, p, y, t, u, k, b, h, l, g, i,
              A, j) : null;
          }
        }
        if (q <= f) {
          var G = new Array(n - m + 2);
          G[0] = v - m + 1;

          e.Copy(t, m, G, 1, n - m + 1);

          this.m_forwardHistory.push(G);

          G = new Array(p - o + 2);

          G[0] = w - o + 1;

          e.Copy(u, o, G, 1, p - o + 1);

          this.m_reverseHistory.push(G);
        }
      }
      return this.WALKTRACE(v, m, n, x, w, o, p, y, t, u, k, b, h, l, g, i, A, j);
    },
    ConcatenateChanges: function(a, b) {
      var c = [];

      var d = null;
      return a.length === 0 || b.length === 0 ? b.length > 0 ? b : a : this.ChangesOverlap(a[a.length - 1], b[0], c) ?
        (d = new Array(a.length + b.length - 1), e.Copy(a, 0, d, 0, a.length - 1), d[a.length - 1] = c[0], e.Copy(b,
        1, d, a.length, b.length - 1), d) : (d = new Array(a.length + b.length), e.Copy(a, 0, d, 0, a.length), e.Copy(
        b, 0, d, a.length, b.length), d);
    },
    ChangesOverlap: function(a, b, e) {
      d.Assert(a.originalStart <= b.originalStart, "Left change is not less than or equal to right change");

      d.Assert(a.modifiedStart <= b.modifiedStart, "Left change is not less than or equal to right change");
      if (a.originalStart + a.originalLength >= b.originalStart || a.modifiedStart + a.modifiedLength >= b.modifiedStart) {
        var f = a.originalStart;

        var g = a.originalLength;

        var h = a.modifiedStart;

        var i = a.modifiedLength;
        a.originalStart + a.originalLength >= b.originalStart && (g = b.originalStart + b.originalLength - a.originalStart);

        a.modifiedStart + a.modifiedLength >= b.modifiedStart && (i = b.modifiedStart + b.modifiedLength - a.modifiedStart);

        e[0] = new c(f, g, h, i);

        return !0;
      }
      e[0] = null;

      return !1;
    },
    ClipDiagonalBound: function(a, b, c, d) {
      if (a >= 0 && a < d) {
        return a;
      }
      var e = c;

      var f = d - c - 1;

      var g = b % 2 === 0;
      if (a < 0) {
        var h = e % 2 === 0;
        return g === h ? 0 : 1;
      }
      var i = f % 2 === 0;
      return g === i ? d - 1 : d - 2;
    }
  });
  return {
    LcsDiff: h
  };
});