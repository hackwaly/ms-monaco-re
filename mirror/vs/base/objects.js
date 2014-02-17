define("vs/base/objects", ["require", "exports", "./types"], function(e, t, n) {
  function i(e) {
    if (!e || "object" != typeof e) {
      return e;
    }
    var n = e instanceof Array ? [] : {};
    for (var i in e) {
      n[i] = e[i] && "object" == typeof e[i] ? t.clone(e[i]) : e[i];
    }
    return n;
  }

  function o(e, i, o) {
    "undefined" == typeof o && (o = !0);

    return n.isObject(e) ? (n.isObject(i) && Object.keys(i).forEach(function(r) {
      if (r in e) {
        if (o) {
          if (n.isObject(e[r]) && n.isObject(i[r])) {
            t.mixin(e[r], i[r], o);
          } {
            e[r] = i[r];
          }
        }
      }

      {
        e[r] = i[r];
      }
    }), e) : i;
  }

  function r(e, n) {
    return t.mixin(t.clone(n), e || {});
  }

  function s(e, n) {
    if (e === n) {
      return !0;
    }
    if (null === e || void 0 === e || null === n || void 0 === n) {
      return !1;
    }
    if (typeof e != typeof n) {
      return !1;
    }
    if ("object" != typeof e) {
      return !1;
    }
    if (e instanceof Array != n instanceof Array) {
      return !1;
    }
    var i;

    var o;
    if (e instanceof Array) {
      if (e.length !== n.length) {
        return !1;
      }
      for (i = 0; i < e.length; i++)
        if (!t.equals(e[i], n[i])) {
          return !1;
        }
    } else {
      var r = [];
      for (o in e) {
        r.push(o);
      }
      r.sort();
      var s = [];
      for (o in n) {
        s.push(o);
      }
      if (s.sort(), !t.equals(r, s)) {
        return !1;
      }
      for (i = 0; i < r.length; i++)
        if (!t.equals(e[r[i]], n[r[i]])) {
          return !1;
        }
    }
    return !0;
  }

  function a(e, t, n) {
    if ("undefined" == typeof e[t]) {
      e[t] = n;
    }
  }

  function u(e) {
    for (var t = {}, n = 0; n < e.length; ++n) {
      t[e[n]] = !0;
    }
    return t;
  }

  function l(e, n) {
    if ("undefined" == typeof n) {
      n = !1;
    }

    if (n) {
      e = e.map(function(e) {
        return e.toLowerCase();
      });
    }
    var i = t.arrayToHash(e);
    return n ? function(e) {
      return void 0 !== i[e.toLowerCase()] && i.hasOwnProperty(e.toLowerCase());
    } : function(e) {
      return void 0 !== i[e] && i.hasOwnProperty(e);
    };
  }

  function c(e, t) {
    t = t || function() {};
    var n = e.prototype;
    t.prototype = Object.create(n);

    Object.defineProperty(t.prototype, "constructor", {
      value: t,
      writable: !0,
      configurable: !0,
      enumerable: !0
    });

    return t;
  }
  t.clone = i;

  t.mixin = o;

  t.withDefaults = r;

  t.equals = s;

  t.ensureProperty = a;

  t.arrayToHash = u;

  t.createKeywordMatcher = l;

  t.derive = c;
});