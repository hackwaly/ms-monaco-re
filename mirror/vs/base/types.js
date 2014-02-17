define("vs/base/types", ["require", "exports"], function(e, t) {
  function n(e) {
    return Array.isArray ? Array.isArray(e) : e && "number" == typeof e.length && e.constructor === Array ? !0 : !1;
  }

  function i(e) {
    return "string" == typeof e || e instanceof String ? !0 : !1;
  }

  function o(e) {
    return "undefined" == typeof e || null === e ? !1 : "[object Object]" === Object.prototype.toString.call(e);
  }

  function r(e) {
    return ("number" == typeof e || e instanceof Number) && !isNaN(e) ? !0 : !1;
  }

  function s(e) {
    return e === !0 || e === !1;
  }

  function a(e) {
    return "undefined" == typeof e;
  }

  function u(e) {
    return t.isUndefined(e) || null === e;
  }

  function l(e) {
    if (!t.isObject(e)) return !1;
    for (var n in e)
      if (e.hasOwnProperty(n)) return !1;
    return !0;
  }

  function c(e) {
    return "[object Function]" === Object.prototype.toString.call(e);
  }

  function d() {
    for (var e = [], n = 0; n < arguments.length - 0; n++) e[n] = arguments[n + 0];
    return e && e.length > 0 && e.every(function(e) {
      return t.isFunction(e);
    });
  }

  function h(e) {
    for (var t = [], n = 0; n < arguments.length - 1; n++) t[n] = arguments[n + 1];
    var i = Object.create(e.prototype);
    e.apply(i, t);

    return i;
  }

  function p(e, n, i) {
    "undefined" == typeof i && (i = !0);
    var o;

    var r = {};
    for (o in e)(i || e.hasOwnProperty(o)) && t.isFunction(e[o]) && (r[o] = function(t) {
      return function() {
        return n(e, t, arguments);
      };
    }(o));
    return r;
  }

  function f(e) {
    var t = !1;

    var n = null;
    return function() {
      for (var i = [], o = 0; o < arguments.length - 0; o++) i[o] = arguments[o + 0];
      t || (t = !0, n = e.apply(self, i));

      return n;
    };
  }
  t.isArray = n;

  t.isString = i;

  t.isObject = o;

  t.isNumber = r;

  t.isBoolean = s;

  t.isUndefined = a;

  t.isUndefinedOrNull = u;

  t.isEmptyObject = l;

  t.isFunction = c;

  t.areFunctions = d;

  t.create = h;

  t.proxy = p;

  t.runOnce = f;
});