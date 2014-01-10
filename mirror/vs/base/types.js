define(["require", "exports"], function(a, b) {
  function c(a) {
    return Array.isArray ? Array.isArray(a) : a && typeof a.length == "number" && a.constructor === Array ? !0 : !1
  }

  function d(a) {
    return typeof a == "string" || a instanceof String ? !0 : !1
  }

  function e(a) {
    return typeof a == "undefined" || a === null ? !1 : Object.prototype.toString.call(a) === "[object Object]"
  }

  function f(a) {
    return (typeof a == "number" || a instanceof Number) && !isNaN(a) ? !0 : !1
  }

  function g(a) {
    return typeof a == "undefined"
  }

  function h(a) {
    return b.isUndefined(a) || a === null
  }

  function i(a) {
    if (!b.isObject(a)) return !1;
    for (var c in a)
      if (a.hasOwnProperty(c)) return !1;
    return !0
  }

  function j(a) {
    return Object.prototype.toString.call(a) === "[object Function]"
  }

  function k(a) {
    var b = [];
    for (var c = 0; c < arguments.length - 1; c++) b[c] = arguments[c + 1];
    var d = Object.create(a.prototype);
    return a.apply(d, b), d
  }

  function l(a, c, d) {
    typeof d == "undefined" && (d = !0);
    var e, f = {};
    for (e in a)(d || a.hasOwnProperty(e)) && b.isFunction(a[e]) && (f[e] = function(b) {
      return function() {
        return c(a, b, arguments)
      }
    }(e));
    return f
  }
  b.isArray = c, b.isString = d, b.isObject = e, b.isNumber = f, b.isUndefined = g, b.isUndefinedOrNull = h, b.isEmptyObject =
    i, b.isFunction = j, b.create = k, b.proxy = l
})