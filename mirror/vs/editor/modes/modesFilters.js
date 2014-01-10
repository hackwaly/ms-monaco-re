define(["require", "exports", "vs/base/filters"], function(a, b, c) {
  function e(a) {
    return function(b, c) {
      var d = a(b, c.label);
      return c.highlights = d || [], !! d
    }
  }

  function f(a, b) {
    return function(c, d) {
      return a(c, d) || b(c, d)
    }
  }

  function g(a, b) {
    return function(c, d) {
      return a(c, d) && b(c, d)
    }
  }

  function h(a) {
    var b = {};
    return function(c, d) {
      var e = a(d);
      return b[e] ? !1 : (b[e] = !0, !0)
    }
  }
  var d = c;
  b.StrictPrefix = e(d.matchesStrictPrefix), b.Prefix = e(d.matchesPrefix), b.CamelCase = e(d.matchesCamelCase), b.ContiguousSubString =
    e(d.matchesContiguousSubString), b.or = f, b.and = g, b.newDuplicateFilter = h, b.DefaultFilter = b.or(b.or(b.Prefix,
      b.CamelCase), b.ContiguousSubString)
})