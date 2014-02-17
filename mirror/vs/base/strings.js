define("vs/base/strings", ["require", "exports", "vs/nls!vs/editor/worker/editorWorkerServer", "vs/base/uuid",
  "vs/base/types"
], function(e, t, n, i, o) {
  function r(e, t) {
    for (var n = "" + e; n.length < t;) {
      n = "0" + n;
    }
    return n;
  }

  function s(e) {
    for (var t = [], n = 0; n < arguments.length - 1; n++) {
      t[n] = arguments[n + 1];
    }
    if (0 === t.length) {
      return e;
    }
    for (var i = e, o = t.length, r = 0; o > r; r++) {
      i = i.replace(new RegExp("\\{" + r + "\\}", "g"), t[r]);
    }
    return i;
  }

  function a(e) {
    e || (e = new Date);

    return n.localize("vs_base_strings", 0, t.pad(e.getMonth() + 1, 2), t.pad(e.getDate(), 2), t.pad(e.getFullYear(),
      4), t.pad(e.getHours(), 2), t.pad(e.getMinutes(), 2), t.pad(e.getSeconds(), 2));
  }

  function u(e) {
    e || (e = new Date);

    return n.localize("vs_base_strings", 1, t.pad(e.getHours(), 2), t.pad(e.getMinutes(), 2), t.pad(e.getSeconds(), 2));
  }

  function l(e) {
    return e.replace(/[<|>|&]/g, function(e) {
      switch (e) {
        case "<":
          return "&lt;";
        case ">":
          return "&gt;";
        case "&":
          return "&amp;";
        default:
          return e;
      }
    });
  }

  function c(e) {
    return e.replace(/[\-\\\{\}\*\+\?\|\^\$\.\,\[\]\(\)\#\s]/g, "\\$&");
  }

  function d(e, n, i) {
    return e.replace(new RegExp(t.escapeRegExpCharacters(n.toString()), "g"), i);
  }

  function h(e) {
    var t = document.createElement("div");
    t.innerHTML = e;

    return t.textContent || t.innerText || "";
  }

  function p(e, n) {
    if ("undefined" == typeof n) {
      n = " ";
    }
    var i = t.ltrim(e, n);
    return t.rtrim(i, n);
  }

  function f(e, t) {
    var n = t.length;
    if (0 === n || 0 === e.length) {
      return e;
    }
    for (var i = 0, o = -1;
      (o = e.indexOf(t, i)) === i;) {
      i += n;
    }
    return e.substring(i);
  }

  function g(e, t) {
    var n = t.length;

    var i = e.length;
    if (0 === n || 0 === i) {
      return e;
    }
    for (var o = i, r = -1;;) {
      if (r = e.lastIndexOf(t, o - 1), -1 === r || r + n !== o) break;
      if (0 === r) {
        return "";
      }
      o = r;
    }
    return e.substring(0, o);
  }

  function m(e) {
    return e.replace(/(^\s+|\s+$)/g, "");
  }

  function v(e) {
    return e.replace(/\s+/g, " ");
  }

  function y(e) {
    var t = (new Date).getTime();

    var i = (t - e) / 1e3;
    if (60 > i) {
      return n.localize("vs_base_strings", 2, Math.floor(i));
    }
    var o = i / 60;
    if (60 > o) {
      return n.localize("vs_base_strings", 3, Math.floor(o));
    }
    var r = o / 60;
    if (24 > r) {
      return n.localize("vs_base_strings", 4, Math.floor(r));
    }
    var s = r / 24;
    return n.localize("vs_base_strings", 5, Math.floor(s));
  }

  function _(e) {
    return e.replace(/[\-\\\{\}\+\?\|\^\$\.\,\[\]\(\)\#\s]/g, "\\$&").replace(/[\*]/g, ".*");
  }

  function b(e, t) {
    for (var n = 0, i = t.length; i > n; n++)
      if (e.charCodeAt(n) !== t.charCodeAt(n)) {
        return !1;
      }
    return !0;
  }

  function C(e, t) {
    if (t.length > e.length) {
      return !1;
    }
    for (var n = 0, i = e.length - t.length; n < t.length; n++, i++)
      if (e.charCodeAt(i) !== t.charCodeAt(n)) {
        return !1;
      }
    return !0;
  }

  function w(e, t, n, i) {
    "undefined" == typeof i && (i = "");

    return e.substring(0, t) + i + e.substring(t + n);
  }

  function E(e, t, n, i) {
    if ("" === e) throw new Error("Cannot create regex from empty string");
    if (!t) {
      e = e.replace(/[\-\\\{\}\*\+\?\|\^\$\.\,\[\]\(\)\#\s]/g, "\\$&");
    }

    if (i) {
      if (!/\B/.test(e.charAt(0))) {
        e = "\\b" + e;
      }
      if (!/\B/.test(e.charAt(e.length - 1))) {
        e += "\\b";
      }
    }
    var o = "g";
    n || (o += "i");

    return new RegExp(e, o);
  }

  function S(e) {
    var t = e.exec("");
    return t && 0 === e.lastIndex;
  }

  function L(e, t) {
    if (!e) {
      return e;
    }
    if (t) {
      for (var n = e.split("/"), i = 0, o = n.length; o > i; i++) {
        n[i] = encodeURIComponent(n[i]);
      }
      return n.join("/");
    }
    return encodeURIComponent(e);
  }

  function T(e) {
    return /^\w[\w.]*$/.test(e);
  }

  function x(e) {
    return e.replace(/[\-\\\{\}\*\+\?\|\^\$\.\,\[\]\(\)\#\s]/g, "\\$&");
  }

  function N(e, t, n) {
    t && (e = "^" + e);

    n && (e += "$");

    return e;
  }

  function M(e, n) {
    if (t.regExpLeadsToEndlessLoop(new RegExp(e, n))) throw new Error("Regular expression /" + e +
      "/g results in infinitive matches");
  }

  function k(e) {
    return e ? (0 === e.indexOf("/") && (e = e.substring(1)), t.encodeURIPart(e, !0)) : "";
  }

  function I() {
    return i.v4().asHex();
  }

  function D(e, t) {
    return "[" + e + "m" + t + "[0m";
  }

  function O(e) {
    for (var t = 0, n = e.length; n > t; t++)
      if (" " !== e.charAt(t) && "	" !== e.charAt(t)) {
        return t;
      }
    return -1;
  }

  function R(e) {
    for (var t = 0, n = e.length; n > t; t++)
      if (" " !== e.charAt(t) && "	" !== e.charAt(t)) {
        return e.substring(0, t);
      }
    return e;
  }

  function P(e) {
    for (var t = e.length - 1; t >= 0; t--)
      if (" " !== e.charAt(t) && "	" !== e.charAt(t)) {
        return t;
      }
    return -1;
  }

  function A(e, t) {
    if (!z && (z = !0, window.Intl && o.isFunction(window.Intl.Collator))) {
      var n = new window.Intl.Collator;
      if (o.isFunction(n.compare)) {
        q = n.compare;
      }
    }
    return q ? q.call(this, e, t) : e.localeCompare(t);
  }

  function W(e) {
    return e >= 97 && 122 >= e || e >= 65 && 90 >= e;
  }

  function H(e, t) {
    var n = e.length;

    var i = t.length;
    if (n !== i) {
      return !1;
    }
    for (var o = 0; n > o; o++) {
      var r = e.charCodeAt(o);

      var s = t.charCodeAt(o);
      if (r !== s)
        if (W(r) && W(s)) {
          var a = Math.abs(r - s);
          if (0 !== a && 32 !== a) {
            return !1;
          }
        } else if (String.fromCharCode(r).toLocaleLowerCase() !== String.fromCharCode(s).toLocaleLowerCase()) {
        return !1;
      }
    }
    return !0;
  }

  function V(e, t, n) {
    if ("undefined" == typeof n) {
      n = 4;
    }
    var i = Math.abs(e.length - t.length);
    if (i > n) {
      return 0;
    }
    var o;

    var r;

    var s = [];

    var a = [];
    for (o = 0; o < t.length + 1; ++o) {
      a.push(0);
    }
    for (o = 0; o < e.length + 1; ++o) {
      s.push(a);
    }
    for (o = 1; o < e.length + 1; ++o)
      for (r = 1; r < t.length + 1; ++r) {
        s[o][r] = e[o - 1] === t[r - 1] ? s[o - 1][r - 1] + 1 : Math.max(s[o - 1][r], s[o][r - 1]);
      }
    return s[e.length][t.length] - Math.sqrt(i);
  }

  function F(e) {
    for (var t = {
      ch: 0,
      children: []
    }, n = 0, i = e.length; i > n; n++)
      for (var o = t, r = e[n], s = 0, a = r.length; a > s; s++) {
        o = B(o, r.charCodeAt(s));
      }
    return function(e) {
      for (var n = t, i = 0, o = e.length; n.children && o > i; i++)
        if (n = U(n, e.charCodeAt(i)), !n) {
          return !1;
        }
      return !n.children;
    };
  }

  function U(e, t) {
    if (!e.children) {
      return null;
    }
    for (var n = 0, i = e.children.length; i > n; n++)
      if (e.children[n].ch === t) {
        return e.children[n];
      }
    return null;
  }

  function B(e, t) {
    if (e.children) {
      for (var n = e.children.length, i = 0; n > i; i++)
        if (e.children[i].ch === t) {
          return e.children[i];
        }
      e.children.push({
        ch: t,
        children: null
      });

      return e.children[n];
    }
    e.children = [{
      ch: t,
      children: null
    }];

    return e.children[0];
  }
  t.empty = "";

  t.pad = r;

  t.format = s;

  t.formatDate = a;

  t.formatTime = u;

  t.escape = l;

  t.escapeRegExpCharacters = c;

  t.replaceAll = d;

  t.stripHtml = h;

  t.trim = p;

  t.ltrim = f;

  t.rtrim = g;

  t.trimWhitespace = m;

  t.normalize = v;
  t.conciseformatDiff = y;

  t.convertSimple2RegExpPattern = _;

  t.startsWith = b;

  t.endsWith = C;

  t.splice = w;

  t.createRegExp = E;

  t.regExpLeadsToEndlessLoop = S;

  t.encodeURIPart = L;

  t.isCamelCasePattern = T;

  t.toRegExpPattern = x;

  t.anchorPattern = N;

  t.assertRegExp = M;

  t.normalizePath = k;

  t.generateUuid = I;

  t.colorize = D;

  t.firstNonWhitespaceIndex = O;

  t.getLeadingWhitespace = R;

  t.lastNonWhitespaceIndex = P;
  var q;

  var z = !1;
  t.localeCompare = A;

  t.equalsIgnoreCase = H;

  t.difference = V;

  t.prefixMatcher = F;
});