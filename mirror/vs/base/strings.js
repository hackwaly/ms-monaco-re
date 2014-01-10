define(["require", "exports", "vs/nls", "vs/base/types"], function(a, b, c, d) {
  function g(a, b) {
    var c = "" + a;
    while (c.length < b) c = "0" + c;
    return c
  }

  function h(a) {
    var b = [];
    for (var c = 0; c < arguments.length - 1; c++) b[c] = arguments[c + 1];
    if (b.length === 0) return a;
    var d = a,
      e = b.length;
    for (var f = 0; f < e; f++) d = d.replace(new RegExp("\\{" + f + "\\}", "g"), b[f]);
    return d
  }

  function i(a) {
    return a || (a = new Date), e.localize("format.date", "{0}-{1}-{2} {3}:{4}:{5}", b.pad(a.getMonth() + 1, 2), b.pad(
      a.getDate(), 2), b.pad(a.getFullYear(), 4), b.pad(a.getHours(), 2), b.pad(a.getMinutes(), 2), b.pad(a.getSeconds(),
      2))
  }

  function j(a) {
    return a || (a = new Date), e.localize("format.time", "{0}:{1}:{2}", b.pad(a.getHours(), 2), b.pad(a.getMinutes(),
      2), b.pad(a.getSeconds(), 2))
  }

  function k(a) {
    return a.replace(/[<|>|&]/g, function(a) {
      switch (a) {
        case "<":
          return "&lt;";
        case ">":
          return "&gt;";
        case "&":
          return "&amp;";
        default:
          return a
      }
    })
  }

  function l(a) {
    var b = document.createElement("div");
    return b.innerHTML = a, b.textContent || b.innerText || ""
  }

  function m(a, c) {
    typeof c == "undefined" && (c = " ");
    var d = b.ltrim(a, c);
    return b.rtrim(d, c)
  }

  function n(a, b) {
    var c = b.length;
    if (c === 0 || a.length === 0) return a;
    var d = 0,
      e = -1;
    while ((e = a.indexOf(b, d)) === d) d += c;
    return a.substring(d)
  }

  function o(a, b) {
    var c = b.length,
      d = a.length;
    if (c === 0 || d === 0) return a;
    var e = d,
      f = -1;
    for (;;) {
      f = a.lastIndexOf(b, e - 1);
      if (f === -1 || f + c !== e) break;
      if (f === 0) return "";
      e = f
    }
    return a.substring(0, e)
  }

  function p(a) {
    return a.replace(/(^\s+|\s+$)/g, "")
  }

  function q(a) {
    return a.replace(/\s+/g, " ")
  }

  function s(a) {
    var b = (new Date).getTime(),
      c = (b - a) / 1e3;
    if (c < 60) return e.localize("diff.seconds", "{0}s", Math.floor(c));
    var d = c / 60;
    if (d < 60) return e.localize("diff.minutes", "{0}m", Math.floor(d));
    var f = d / 60;
    if (f < 24) return e.localize("diff.hours", "{0}h", Math.floor(f));
    var g = f / 24;
    return e.localize("diff.days", "{0}d", Math.floor(g))
  }

  function t(a) {
    return a.replace(/[\-\\\{\}\+\?\|\^\$\.\,\[\]\(\)\#\s]/g, "\\$&").replace(/[\*]/g, ".*")
  }

  function u(a, b) {
    for (var c = 0, d = b.length; c < d; c++)
      if (a.charCodeAt(c) !== b.charCodeAt(c)) return !1;
    return !0
  }

  function v(a, b) {
    if (b.length > a.length) return !1;
    for (var c = 0, d = a.length - b.length; c < b.length; c++, d++)
      if (a.charCodeAt(d) !== b.charCodeAt(c)) return !1;
    return !0
  }

  function w(a, b, c, d) {
    return typeof d == "undefined" && (d = ""), a.substring(0, b) + d + a.substring(b + c)
  }

  function x(a, b, c, d) {
    if (a === "") throw new Error("Cannot create regex from empty string");
    b || (a = a.replace(/[\-\\\{\}\*\+\?\|\^\$\.\,\[\]\(\)\#\s]/g, "\\$&")), d && (a = "\\b" + a + "\\b");
    var e = "g";
    return c || (e += "i"), new RegExp(a, e)
  }

  function y(a) {
    var b = a.exec("");
    return b && a.lastIndex === 0
  }

  function z(a, b) {
    if (!a) return a;
    if (!b) return encodeURIComponent(a);
    var c = a.split("/");
    for (var d = 0, e = c.length; d < e; d++) c[d] = encodeURIComponent(c[d]);
    return c.join("/")
  }

  function A(a) {
    return /^\w[\w.]*$/.test(a)
  }

  function B(a) {
    return a.replace(/[\-\\\{\}\*\+\?\|\^\$\.\,\[\]\(\)\#\s]/g, "\\$&")
  }

  function C(a, b, c) {
    return b && (a = "^" + a), c && (a += "$"), a
  }

  function D(a, c) {
    if (b.regExpLeadsToEndlessLoop(new RegExp(a, c))) throw new Error("Regular expression /" + a +
      "/g results in infinitive matches")
  }

  function E(a) {
    return a ? (a.indexOf("/") === 0 && (a = a.substring(1)), b.encodeURIPart(a, !0)) : ""
  }

  function F(a) {
    return typeof a == "undefined" && (a = 8), I(a)
  }

  function I(a) {
    var b = "";
    for (var c = 0; c < a; c++) b += G[Math.floor(Math.random() * H)];
    return b
  }

  function J(a, b) {
    return "[" + a + "m" + b + "[0m"
  }

  function K(a) {
    for (var b = 0, c = a.length; b < c; b++)
      if (a.charAt(b) !== " " && a.charAt(b) !== "	") return b;
    return -1
  }

  function L(a) {
    for (var b = 0, c = a.length; b < c; b++)
      if (a.charAt(b) !== " " && a.charAt(b) !== "	") return a.substring(0, b);
    return a
  }

  function M(a) {
    for (var b = a.length - 1; b >= 0; b--)
      if (a.charAt(b) !== " " && a.charAt(b) !== "	") return b;
    return -1
  }

  function P(a, b) {
    if (!O) {
      O = !0;
      if (window.Intl && f.isFunction(window.Intl.Collator)) {
        var c = new window.Intl.Collator;
        f.isFunction(c.compare) && (N = c.compare)
      }
    }
    return N ? N.call(this, a, b) : a.localeCompare(b)
  }
  var e = c,
    f = d;
  b.pad = g, b.format = h, b.formatDate = i, b.formatTime = j, b.escape = k, b.stripHtml = l, b.trim = m, b.ltrim = n,
    b.rtrim = o, b.trimWhitespace = p, b.normalize = q;
  var r = {
    SECOND: 1e3,
    MINUTE: 6e4,
    HOUR: 36e5,
    DAY: 864e5
  };
  b.conciseformatDiff = s, b.convertSimple2RegExpPattern = t, b.startsWith = u, b.endsWith = v, b.splice = w, b.createRegExp =
    x, b.regExpLeadsToEndlessLoop = y, b.encodeURIPart = z, b.isCamelCasePattern = A, b.toRegExpPattern = B, b.anchorPattern =
    C, b.assertRegExp = D, b.normalizePath = E, b.generateUuid = F;
  var G = "0123456789abcdefghiklmnopkqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ",
    H = G.length;
  b.colorize = J, b.firstNonWhitespaceIndex = K, b.getLeadingWhitespace = L, b.lastNonWhitespaceIndex = M;
  var N, O = !1;
  b.localeCompare = P
})