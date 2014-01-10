define(["require", "exports"], function(a, b) {
  function c() {
    var a = [];
    for (var b = 0; b < arguments.length - 0; b++) a[b] = arguments[b + 0];
    return function(b, c) {
      for (var d = 0, e = a.length; d < e; d++) {
        var f = a[d](b, c);
        if (f) return f
      }
      return null
    }
  }

  function d() {
    var a = [];
    for (var b = 0; b < arguments.length - 0; b++) a[b] = arguments[b + 0];
    return function(b, c) {
      var d = [];
      for (var e = 0, f = a.length; e < f; e++) {
        var g = a[e](b, c);
        if (!g) return null;
        d = d.concat(g)
      }
      return d
    }
  }

  function e(a, b, c) {
    if (c.length === 0 || c.length < b.length) return null;
    a && (b = b.toLowerCase(), c = c.toLowerCase());
    for (var d = 0; d < b.length; d++)
      if (b[d] !== c[d]) return null;
    return b.length > 0 ? [{
      start: 0,
      end: b.length
    }] : []
  }

  function f(a, b) {
    var c = b.toLowerCase().indexOf(a.toLowerCase());
    return c === -1 ? null : [{
      start: c,
      end: c + a.length
    }]
  }

  function g(a, b) {
    return h(a.toLowerCase(), b.toLowerCase(), 0, 0)
  }

  function h(a, b, c, d) {
    if (c === a.length) return [];
    if (d === b.length) return null;
    if (a[c] === b[d]) {
      var e = null;
      if (e = h(a, b, c + 1, d + 1)) return l({
        start: d,
        end: d + 1
      }, e)
    }
    return h(a, b, c, d + 1)
  }

  function i(a, b) {
    if (b.length === 0) return null;
    var c = null,
      d = 0;
    while (d < b.length && (c = n(a.toLowerCase(), b, 0, d)) === null) d = m(b, d + 1);
    return c
  }

  function j(a) {
    var b = a.charCodeAt(0);
    return 65 <= b && b <= 90
  }

  function k(a) {
    var b = a.charCodeAt(0);
    return 48 <= b && b <= 57
  }

  function l(a, b) {
    return b.length === 0 ? b = [a] : a.end === b[0].start ? b[0].start = a.start : b.unshift(a), b
  }

  function m(a, b) {
    for (var c = b; c < a.length; c++) {
      var d = a[c];
      if (j(d) || k(d)) return c
    }
    return a.length
  }

  function n(a, b, c, d) {
    if (c === a.length) return [];
    if (d === b.length) return null;
    if (a[c] !== b[d].toLowerCase()) return null;
    var e = null,
      f = d + 1;
    e = n(a, b, c + 1, d + 1);
    while (!e && (f = m(b, f)) < b.length) e = n(a, b, c + 1, f), f++;
    return e === null ? null : l({
      start: d,
      end: d + 1
    }, e)
  }
  b.or = c, b.and = d, b.matchesStrictPrefix = function(a, b) {
    return e(!1, a, b)
  }, b.matchesPrefix = function(a, b) {
    return e(!0, a, b)
  }, b.matchesContiguousSubString = f, b.matchesSubString = g, b.matchesCamelCase = i
})