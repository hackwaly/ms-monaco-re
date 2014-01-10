define(["require", "exports", "./types"], function(a, b, c) {
  function e(a) {
    if (!a || typeof a != "object") return a;
    var c = a instanceof Array ? [] : {};
    for (var d in a) a[d] && typeof a[d] == "object" ? c[d] = b.clone(a[d]) : c[d] = a[d];
    return c
  }

  function f(a, c, e) {
    return typeof e == "undefined" && (e = !0), d.isObject(a) ? (d.isObject(c) && Object.keys(c).forEach(function(f) {
      f in a ? e && (d.isObject(a[f]) && d.isObject(c[f]) ? b.mixin(a[f], c[f], e) : a[f] = c[f]) : a[f] = c[f]
    }), a) : c
  }

  function g(a, c) {
    if (a === c) return !0;
    if (a === null || a === undefined || c === null || c === undefined) return !1;
    if (typeof a != typeof c) return !1;
    if (typeof a != "object") return !1;
    if (a instanceof Array != c instanceof Array) return !1;
    var d, e;
    if (a instanceof Array) {
      if (a.length !== c.length) return !1;
      for (d = 0; d < a.length; d++)
        if (!b.equals(a[d], c[d])) return !1
    } else {
      var f = [];
      for (e in a) f.push(e);
      f.sort();
      var g = [];
      for (e in c) g.push(e);
      g.sort();
      if (!b.equals(f, g)) return !1;
      for (d = 0; d < f.length; d++)
        if (!b.equals(a[f[d]], c[f[d]])) return !1
    }
    return !0
  }

  function h(a) {
    var b = {};
    for (var c = 0; c < a.length; ++c) b[a[c]] = !0;
    return b
  }

  function i(a, c) {
    typeof c == "undefined" && (c = !1), c && (a = a.map(function(a) {
      return a.toLowerCase()
    }));
    var d = b.arrayToHash(a);
    return c ? function(a) {
      return d[a.toLowerCase()] !== undefined
    } : function(a) {
      return d[a] !== undefined
    }
  }

  function j(a, b) {
    b = b || function() {};
    var c = a.prototype;
    return b.prototype = Object.create(c), Object.defineProperty(b.prototype, "constructor", {
      value: b,
      writable: !0,
      configurable: !0,
      enumerable: !0
    }), b
  }
  var d = c;
  b.clone = e, b.mixin = f, b.equals = g, b.arrayToHash = h, b.createKeywordMatcher = i, b.derive = j
})