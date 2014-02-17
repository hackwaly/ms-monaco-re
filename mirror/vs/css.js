"use strict";

var __extends = this.__extends || function(e, t) {
    function n() {
      this.constructor = e;
    }
    for (var r in t) {
      if (t.hasOwnProperty(r)) {
        e[r] = t[r];
      }
    }
    n.prototype = t.prototype;

    e.prototype = new n;
  };

var _cssPluginGlobal = this;

var CSSLoaderPlugin;

! function(e) {
  var t = _cssPluginGlobal;

  var n = function() {
    function e() {
      this._pendingLoads = 0;
    }
    e.prototype.attachListeners = function(e, t, n, r) {
      var o = function() {
        t.removeEventListener("load", s);

        t.removeEventListener("error", i);
      };

      var s = function() {
        o();

        n();
      };

      var i = function(e) {
        o();

        r(e);
      };
      t.addEventListener("load", s);

      t.addEventListener("error", i);
    };

    e.prototype._onLoad = function(e, t) {
      this._pendingLoads--;

      t();
    };

    e.prototype._onLoadError = function(e, t, n) {
      this._pendingLoads--;

      t(n);
    };

    e.prototype._insertLinkNode = function(e) {
      this._pendingLoads++;
      var t = document.head || document.getElementsByTagName("head")[0];

      var n = t.getElementsByTagName("link") || document.head.getElementsByTagName("script");
      n.length > 0 ? t.insertBefore(e, n[n.length - 1]) : t.appendChild(e);
    };

    e.prototype.createLinkTag = function(e, t, n, r) {
      var o = this;

      var s = document.createElement("link");
      s.setAttribute("rel", "stylesheet");

      s.setAttribute("type", "text/css");

      s.setAttribute("data-name", e);
      var i = function() {
        return o._onLoad(e, n);
      };

      var a = function(t) {
        return o._onLoadError(e, r, t);
      };
      this.attachListeners(e, s, i, a);

      s.setAttribute("href", t);

      return s;
    };

    e.prototype._linkTagExists = function(e, t) {
      var n;

      var r;

      var o;

      var s;

      var i = document.getElementsByTagName("link");
      for (n = 0, r = i.length; r > n; n++)
        if (o = i[n].getAttribute("data-name"), s = i[n].getAttribute("href"), o === e || s === t) {
          return !0;
        }
      return !1;
    };

    e.prototype.load = function(e, t, n, r) {
      if (this._linkTagExists(e, t)) {
        n();
        return void 0;
      }
      var o = this.createLinkTag(e, t, n, r);
      this._insertLinkNode(o);
    };

    return e;
  }();

  var r = function(e) {
    function t() {
      e.call(this);

      this._blockedLoads = [];

      this._mergeStyleSheetsTimeout = -1;
    }
    __extends(t, e);

    t.prototype.load = function(e, t, n, r) {
      if (this._linkTagExists(e, t)) {
        n();
        return void 0;
      }
      var o = this.createLinkTag(e, t, n, r);
      this._styleSheetCount() < 31 ? this._insertLinkNode(o) : (this._blockedLoads.push(o), this._handleBlocked());
    };

    t.prototype._styleSheetCount = function() {
      var e = document.getElementsByTagName("link").length;

      var t = document.getElementsByTagName("style").length;
      return e + t;
    };

    t.prototype._onLoad = function(t, n) {
      e.prototype._onLoad.call(this, t, n);

      this._handleBlocked();
    };

    t.prototype._onLoadError = function(t, n, r) {
      e.prototype._onLoadError.call(this, t, n, r);

      this._handleBlocked();
    };

    t.prototype._handleBlocked = function() {
      var e = this;

      var t = this._blockedLoads.length;
      if (t > 0 && -1 === this._mergeStyleSheetsTimeout) {
        this._mergeStyleSheetsTimeout = window.setTimeout(function() {
          return e._mergeStyleSheets();
        }, 0);
      }
    };

    t.prototype._mergeStyleSheet = function(e, t, n, r) {
      for (var o = r.rules.length - 1; o >= 0; o--) {
        t.insertRule(a.rewriteUrls(n, e, r.rules[o].cssText), 0);
      }
    };

    t.prototype._mergeStyleSheets = function() {
      this._mergeStyleSheetsTimeout = -1;
      var e;

      var t = this._blockedLoads.length;

      var n = document.getElementsByTagName("link");

      var r = n.length;

      var o = [];
      for (e = 0; r > e; e++) {
        if ("loaded" === n[e].readyState || "complete" === n[e].readyState) {
          o.push({
            linkNode: n[e],
            rulesLength: n[e].styleSheet.rules.length
          });
        }
      }
      var s = o.length;

      var i = Math.min(Math.floor(s / 2), t);
      o.sort(function(e, t) {
        return t.rulesLength - e.rulesLength;
      });
      var a;

      var l;
      for (e = 0; i > e; e++) {
        a = o.length - 1 - e;
        l = e % (o.length - i);
        this._mergeStyleSheet(o[l].linkNode.href, o[l].linkNode.styleSheet, o[a].linkNode.href, o[a].linkNode.styleSheet);
        o[a].linkNode.parentNode.removeChild(o[a].linkNode);
        r--;
      }
      for (var u = this._styleSheetCount(); 31 > u && this._blockedLoads.length > 0;) {
        this._insertLinkNode(this._blockedLoads.shift());
        u++;
      }
    };

    return t;
  }(n);

  var o = function(e) {
    function t() {
      e.call(this);
    }
    __extends(t, e);

    t.prototype.attachListeners = function(e, t, n) {
      t.onload = function() {
        t.onload = null;

        n();
      };
    };

    return t;
  }(r);

  var s = function() {
    function e() {
      this.fs = require.nodeRequire("fs");
    }
    e.prototype.load = function(t, n, r) {
      var o = this.fs.readFileSync(n, "utf8");
      if (o.charCodeAt(0) === e.BOM_CHAR_CODE) {
        o = o.substring(1);
      }

      r(o);
    };

    e.BOM_CHAR_CODE = 65279;

    return e;
  }();

  var i = function() {
    function e(e) {
      this.cssLoader = e;
    }
    e.prototype.load = function(t, n, r, o) {
      o = o || {};
      var s = n.toUrl(t + ".css");
      this.cssLoader.load(t, s, function(n) {
        if (o.isBuild) {
          e.BUILD_MAP[t] = n;
        }

        r({});
      }, function() {
        if ("function" == typeof r.error) {
          r.error("Could not find " + s + " or it was empty");
        }
      });
    };

    e.prototype.write = function(n, r, o) {
      var s = o.getEntryPoint();
      t.entryPoints = t.entryPoints || {};

      t.entryPoints[s] = t.entryPoints[s] || [];

      t.entryPoints[s].push({
        moduleName: r,
        contents: e.BUILD_MAP[r]
      });

      o.asModule(n + "!" + r, "define(['vs/css!" + s + "'], {});");
    };

    e.prototype.writeFile = function(e, n, r, o) {
      if (t.entryPoints && t.entryPoints.hasOwnProperty(n)) {
        for (var s = r.toUrl(n + ".css"), i = ["/*---------------------------------------------------------",
            " * Copyright (C) Microsoft Corporation. All rights reserved.",
            " *--------------------------------------------------------*/"
          ], l = t.entryPoints[n], u = 0; u < l.length; u++) {
          i.push(a.rewriteUrls(l[u].moduleName, n, l[u].contents));
        }
        o(s, i.join("\r\n"));
      }
    };

    e.BUILD_MAP = {};

    return e;
  }();
  e.CSSPlugin = i;
  var a = function() {
    function e() {}
    e.startsWith = function(e, t) {
      return e.length >= t.length && e.substr(0, t.length) === t;
    };

    e.pathOf = function(e) {
      var t = e.lastIndexOf("/");
      return -1 !== t ? e.substr(0, t + 1) : "";
    };

    e.joinPaths = function(t, n) {
      function r(t, n) {
        return e.startsWith(t, n) ? Math.max(n.length, t.indexOf("/", n.length)) : 0;
      }

      function o(e, t) {
        if ("./" !== t) {
          if ("../" === t) {
            var n = e.length > 0 ? e[e.length - 1] : null;
            if (n && "/" === n) return;
            if (n && "../" !== n) {
              e.pop();
              return void 0;
            }
          }
          e.push(t);
        }
      }

      function s(e, t) {
        for (; t.length > 0;) {
          var n = t.indexOf("/");

          var r = n >= 0 ? t.substring(0, n + 1) : t;
          t = n >= 0 ? t.substring(n + 1) : "";

          o(e, r);
        }
      }
      var i = 0;
      i = i || r(t, "//");

      i = i || r(t, "http://");

      i = i || r(t, "https://");
      var a = [];
      s(a, t.substr(i));

      n.length > 0 && "/" === n.charAt(0) && (a = []);

      s(a, n);

      return t.substring(0, i) + a.join("");
    };

    e.commonPrefix = function(e, t) {
      for (var n = Math.min(e.length, t.length), r = 0; n > r && e.charCodeAt(r) === t.charCodeAt(r); r++);
      return e.substring(0, r);
    };

    e.commonFolderPrefix = function(t, n) {
      var r = e.commonPrefix(t, n);

      var o = r.lastIndexOf("/");
      return -1 === o ? "" : r.substring(0, o + 1);
    };

    e.relativePath = function(t, n) {
      if (e.startsWith(n, "/") || e.startsWith(n, "http://") || e.startsWith(n, "https://")) {
        return n;
      }
      var r = e.commonFolderPrefix(t, n);
      t = t.substr(r.length);

      n = n.substr(r.length);
      for (var o = t.split("/").length, s = "", i = 1; o > i; i++) {
        s += "../";
      }
      return s + n;
    };

    e.rewriteUrls = function(t, n, r) {
      return r.replace(/url\(\s*([^\)]+)\s*\)?/g, function() {
        for (var r = [], o = 0; o < arguments.length - 1; o++) {
          r[o] = arguments[o + 1];
        }
        var s = r[0];
        for (('"' === s.charAt(0) || "'" === s.charAt(0)) && (s = s.substring(1)); s.length > 0 && (" " === s.charAt(
          s.length - 1) || "	" === s.charAt(s.length - 1));) {
          s = s.substring(0, s.length - 1);
        }
        if (('"' === s.charAt(s.length - 1) || "'" === s.charAt(s.length - 1)) && (s = s.substring(0, s.length - 1)), !
          e.startsWith(s, "data:") && !e.startsWith(s, "http://") && !e.startsWith(s, "https://")) {
          var i = e.joinPaths(e.pathOf(t), s);
          s = e.relativePath(n, i);
        }
        return "url(" + s + ")";
      });
    };

    return e;
  }();
  e.Utilities = a;

  (function() {
    var e = null;
    e = "undefined" != typeof process && process.versions && process.versions.node ? new s : navigator.userAgent.indexOf(
      "MSIE 9") >= 0 ? new r : navigator.userAgent.indexOf("MSIE 8") >= 0 ? new o : new n;

    define("vs/css", new i(e));
  })();
}(CSSLoaderPlugin || (CSSLoaderPlugin = {}));