define(["require", "exports", "vs/base/types"], function(a, b, c) {
  function l() {
    return g
  }

  function m() {
    return self.parent !== self
  }

  function n() {
    return f
  }

  function o(a) {
    f = a
  }
  var d = c,
    e = navigator.userAgent,
    f = self.isTest || !1,
    g = self.document && self.document.URL.match(/[^\?]*\?[^\#]*pseudo=true/),
    h = !1;
  self.window ? h = !! self.window.Worker : h = !0;
  var i = e.indexOf("Trident") >= 0 && e.indexOf("IE") < 0,
    j = e.indexOf("IE") >= 0,
    k = e.indexOf("MSIE 9") >= 0;
  b.browser = {
    isWindows: e.indexOf("Windows") >= 0,
    isMacintosh: e.indexOf("Macintosh") >= 0,
    isOpera: e.indexOf("Opera") >= 0,
    isIE11: i,
    isIE10: j,
    isIE9: k,
    isIE: k || j || i,
    isFirefox: e.indexOf("Firefox") >= 0,
    isWebKit: e.indexOf("AppleWebKit") >= 0,
    isChrome: e.indexOf("Chrome") >= 0,
    isSafari: e.indexOf("Chrome") === -1 && e.indexOf("Safari") >= 0,
    canPushState: function() {
      return self && self.history && self.history.pushState
    },
    hasWorkers: h,
    hasCSSAnimationSupport: function() {
      if (this._hasCSSAnimationSupport === !0 || this._hasCSSAnimationSupport === !1) return this._hasCSSAnimationSupport;
      var a = !1,
        b = document.createElement("div"),
        c = ["animationName", "webkitAnimationName", "msAnimationName", "MozAnimationName", "OAnimationName"];
      for (var e = 0; e < c.length; e++) {
        var f = c[e];
        if (!d.isUndefinedOrNull(b.style[f]) || b.style.hasOwnProperty(f)) {
          a = !0;
          break
        }
      }
      return a ? this._hasCSSAnimationSupport = !0 : this._hasCSSAnimationSupport = !1, this._hasCSSAnimationSupport
    },
    canPlayVideo: function(a) {
      var b = document.createElement("video");
      if (b.canPlayType) {
        var c = b.canPlayType(a);
        return c === "maybe" || c === "probably"
      }
      return !1
    },
    canPlayAudio: function(a) {
      var b = document.createElement("audio");
      if (b.canPlayType) {
        var c = b.canPlayType(a);
        return c === "maybe" || c === "probably"
      }
      return !1
    },
    getInternetExplorerVersion: function() {
      var a = -1;
      if (navigator.appName === "Microsoft Internet Explorer") {
        var b = navigator.userAgent,
          c = new RegExp("MSIE ([0-9]{1,}[\\.0-9]{0,})");
        c.exec(b) != null && (a = parseFloat(RegExp.$1))
      }
      return a
    }
  }, b.enableWI = self.MonacoEnvironment ? self.MonacoEnvironment.enableWI : !0, b.enableTEST = self.MonacoEnvironment ?
    self.MonacoEnvironment.enableTEST : !0, b.enableTestCoverage = self.MonacoEnvironment ? self.MonacoEnvironment.enableTestCoverage : !
    1, b.enableOps = self.MonacoEnvironment ? self.MonacoEnvironment.enableOps : !1, b.enableDebug = self.MonacoEnvironment ?
    self.MonacoEnvironment.enableDebug : !1, b.enablePerformanceEvents = self.MonacoEnvironment ? self.MonacoEnvironment
    .enablePerformanceEvents : !1, b.enableTelemetry = self.MonacoEnvironment ? self.MonacoEnvironment.enableTelemetry : !
    1, b.showPerformanceBox = self.MonacoEnvironment ? self.MonacoEnvironment.showPerformanceBox : !1, b.enableGlobalCSSRuleChecker =
    self.MonacoEnvironment ? self.MonacoEnvironment.enableGlobalCSSRuleChecker : !1, b.enableNLSWarnings = self.MonacoEnvironment ?
    self.MonacoEnvironment.enableNLSWarnings : !1, b.enableEditorLanguageServiceIndicator = self.MonacoEnvironment ?
    self.MonacoEnvironment.enableEditorLanguageServiceIndicator : !1, b.enableClientVerboseErrorLogging = self.MonacoEnvironment ?
    self.MonacoEnvironment.enableClientVerboseErrorLogging : !1, b.isPseudoLanguage = l, b.isInIframe = m, b.isTesting =
    n, b.setTesting = o
})