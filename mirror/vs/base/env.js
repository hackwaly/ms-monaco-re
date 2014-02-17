define("vs/base/env", ["require", "exports", "vs/base/types"], function(e, t, n) {
  function i(e, t) {
    "undefined" == typeof t && (t = !1);

    return self.MonacoEnvironment ? self.MonacoEnvironment[e] : t;
  }

  function o() {
    return d;
  }

  function r() {
    return !self.document && "undefined" != typeof self.importScripts;
  }

  function s() {
    return self.parent !== self;
  }

  function a() {
    return c;
  }

  function u(e) {
    c = e;
  }
  var l = navigator.userAgent;

  var c = self.isTest || !1;

  var d = self.document && self.document.URL.match(/[^\?]*\?[^\#]*pseudo=true/);

  var h = !1;
  h = self.window ? !! self.window.Worker : !0;
  var p = l.indexOf("Trident") >= 0 && l.indexOf("MSIE") < 0;

  var f = l.indexOf("MSIE 10") >= 0;

  var g = l.indexOf("MSIE 9") >= 0;

  var m = !1;
  t.browser = {
    isWindows: l.indexOf("Windows") >= 0,
    isMacintosh: l.indexOf("Macintosh") >= 0,
    isOpera: l.indexOf("Opera") >= 0,
    isIE11orEarlier: p || f || g,
    isIE11: p,
    isIE10orEarlier: f || g,
    isIE10: f,
    isIE9: g,
    isFirefox: l.indexOf("Firefox") >= 0,
    isWebKit: l.indexOf("AppleWebKit") >= 0,
    isChrome: l.indexOf("Chrome") >= 0,
    isSafari: -1 === l.indexOf("Chrome") && l.indexOf("Safari") >= 0,
    isIPad: l.indexOf("iPad") >= 0,
    canPushState: function() {
      return !m && self && self.history && self.history.pushState;
    },
    disablePushState: function() {
      m = !0;
    },
    hasWorkers: h,
    hasCSSAnimationSupport: function() {
      if (this._hasCSSAnimationSupport === !0 || this._hasCSSAnimationSupport === !1) return this._hasCSSAnimationSupport;
      for (var e = !1, t = document.createElement("div"), i = ["animationName", "webkitAnimationName",
          "msAnimationName", "MozAnimationName", "OAnimationName"
        ], o = 0; o < i.length; o++) {
        var r = i[o];
        if (!n.isUndefinedOrNull(t.style[r]) || t.style.hasOwnProperty(r)) {
          e = !0;
          break;
        }
      }
      this._hasCSSAnimationSupport = e ? !0 : !1;

      return this._hasCSSAnimationSupport;
    },
    canPlayVideo: function(e) {
      var t = document.createElement("video");
      if (t.canPlayType) {
        var n = t.canPlayType(e);
        return "maybe" === n || "probably" === n;
      }
      return !1;
    },
    canPlayAudio: function(e) {
      var t = document.createElement("audio");
      if (t.canPlayType) {
        var n = t.canPlayType(e);
        return "maybe" === n || "probably" === n;
      }
      return !1;
    }
  };

  t.enableBuild = i("enableBuild");

  t.enableTestCoverage = i("enableTestCoverage");

  t.enableOps = i("enableOps");

  t.enableFeedback = i("enableFeedback");

  t.enablePerformanceEvents = i("enablePerformanceEvents");

  t.enableTelemetry = i("enableTelemetry");

  t.enablePrivateTelemetry = i("enablePrivateTelemetry");

  t.enableTestViewlet = i("enableTestViewlet");

  t.enableGlobalCSSRuleChecker = i("enableGlobalCSSRuleChecker");

  t.enableNLSWarnings = i("enableNLSWarnings");

  t.enableEditorLanguageServiceIndicator = i("enableEditorLanguageServiceIndicator");

  t.enablePerformanceTools = i("enablePerformanceTools");

  t.enableRunWorkspace = i("enableRunWorkspace");

  t.enableTFSConnection = i("enableTFSConnection");

  t.portalLink = i("portalLink", null);

  t.version = i("version", null);

  t.versionLabel = i("versionLabel", null);

  t.hideDerivedResources = i("hideDerivedResources");

  t.azureWebSiteName = i("azureWebSiteName", null);

  t.enableAzurePortalNavigation = i("enableAzurePortalNavigation");

  t.privacyLink = i("privacyLink", null);

  t.supportLink = i("supportLink", null);

  t.legalLink = i("legalLink", null);

  t.videosLink = i("videosLink", null);

  t.azureWebSiteComputeMode = i("azureWebSiteComputeMode", null);

  t.azureWebSiteMode = i("azureWebSiteMode", null);

  t.standaloneEditorTelemetryEndpoint = i("telemetryEndpoint", null);

  t.getCrossOriginWorkerScriptUrl = i("getWorkerUrl", null);

  t.isPseudoLanguage = o;

  t.isInWebWorker = r;

  t.isInIframe = s;

  t.isTesting = a;

  t.setTesting = u;
});