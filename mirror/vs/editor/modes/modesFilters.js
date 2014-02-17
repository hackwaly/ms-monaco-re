define('vs/editor/modes/modesFilters', [
  'require',
  'exports',
  'vs/base/filters'
], function(e, t, n) {
  function i(e) {
    return function(t, n) {
      var i = e(t, n.label);
      return n.highlights = i || [], !! i;
    };
  }

  function o(e, t) {
    return function(n, i) {
      return e(n, i) || t(n, i);
    };
  }

  function r(e, t) {
    return function(n, i) {
      return e(n, i) && t(n, i);
    };
  }

  function s(e) {
    var t = {};
    return function(n, i) {
      var o = e(i);
      return t[o] ? !1 : (t[o] = !0, !0);
    };
  }
  t.StrictPrefix = i(n.matchesStrictPrefix), t.Prefix = i(n.matchesPrefix), t.CamelCase = i(n.matchesCamelCase), t.ContiguousSubString =
    i(n.matchesContiguousSubString), t.or = o, t.and = r, t.newDuplicateFilter = s, t.DefaultFilter = t.or(t.or(t.Prefix,
      t.CamelCase), t.ContiguousSubString);
})