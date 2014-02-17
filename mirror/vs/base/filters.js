define('vs/base/filters', [
  'require',
  'exports',
  'vs/base/strings'
], function(e, t, n) {
  function i() {
    for (var e = [], t = 0; t < arguments.length - 0; t++)
      e[t] = arguments[t + 0];
    return function(t, n) {
      for (var i = 0, o = e.length; o > i; i++) {
        var r = e[i](t, n);
        if (r)
          return r;
      }
      return null;
    };
  }

  function o() {
    for (var e = [], t = 0; t < arguments.length - 0; t++)
      e[t] = arguments[t + 0];
    return function(t, n) {
      for (var i = [], o = 0, r = e.length; r > o; o++) {
        var s = e[o](t, n);
        if (!s)
          return null;
        i = i.concat(s);
      }
      return i;
    };
  }

  function r(e, t, n) {
    if (0 === n.length || n.length < t.length)
      return null;
    e && (t = t.toLowerCase(), n = n.toLowerCase());
    for (var i = 0; i < t.length; i++)
      if (t[i] !== n[i])
        return null;
    return t.length > 0 ? [{
      start: 0,
      end: t.length
    }] : [];
  }

  function s(e, t) {
    var n = t.toLowerCase().indexOf(e.toLowerCase());
    return -1 === n ? null : [{
      start: n,
      end: n + e.length
    }];
  }

  function a(e, t) {
    return u(e.toLowerCase(), t.toLowerCase(), 0, 0);
  }

  function u(e, t, n, i) {
    if (n === e.length)
      return [];
    if (i === t.length)
      return null;
    if (e[n] === t[i]) {
      var o = null;
      if (o = u(e, t, n + 1, i + 1))
        return h({
          start: i,
          end: i + 1
        }, o);
    }
    return u(e, t, n, i + 1);
  }

  function l(e, t) {
    if (0 === t.length)
      return null;
    for (var n = null, i = 0; i < t.length && null === (n = f(e.toLowerCase(), t, 0, i));)
      i = p(t, i + 1);
    return n;
  }

  function c(e) {
    var t = e.charCodeAt(0);
    return t >= 65 && 90 >= t;
  }

  function d(e) {
    var t = e.charCodeAt(0);
    return t >= 48 && 57 >= t;
  }

  function h(e, t) {
    return 0 === t.length ? t = [e] : e.end === t[0].start ? t[0].start = e.start : t.unshift(e), t;
  }

  function p(e, t) {
    for (var n = t; n < e.length; n++) {
      var i = e[n];
      if (c(i) || d(i))
        return n;
    }
    return e.length;
  }

  function f(e, t, n, i) {
    if (n === e.length)
      return [];
    if (i === t.length)
      return null;
    if (e[n] !== t[i].toLowerCase())
      return null;
    var o = null,
      r = i + 1;
    for (o = f(e, t, n + 1, i + 1); !o && (r = p(t, r)) < t.length;)
      o = f(e, t, n + 1, r), r++;
    return null === o ? null : h({
      start: i,
      end: i + 1
    }, o);
  }
  t.or = i, t.and = o, t.matchesStrictPrefix = function(e, t) {
    return r(!1, e, t);
  }, t.matchesPrefix = function(e, t) {
    return r(!0, e, t);
  }, t.matchesContiguousSubString = s, t.matchesSubString = a, t.matchesCamelCase = l;
  var g = function() {
    function e() {}
    return e.matches = function(t, i) {
      var o = e.RegExpCache[t];
      o || (o = new RegExp(n.convertSimple2RegExpPattern(t), 'i'), e.RegExpCache[t] = o);
      var r = o.exec(i);
      return r ? [{
        start: r.index,
        end: r.index + r[0].length
      }] : e.DefaultFilter(t, i);
    }, e.DefaultFilter = t.or(t.matchesPrefix, t.matchesCamelCase, t.matchesContiguousSubString), e.RegExpCache = {},
      e;
  }();
  t.CombinedMatcher = g;
})