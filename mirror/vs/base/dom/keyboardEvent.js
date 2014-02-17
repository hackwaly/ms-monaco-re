define("vs/base/dom/keyboardEvent", ["require", "vs/base/lib/winjs.base", "vs/base/env"], function(e, t, n) {
  "use strict";
  var i = function() {
    var e = {
      Backspace: 8,
      Tab: 9,
      Enter: 13,
      Shift: 16,
      Ctrl: 17,
      Alt: 18,
      PauseBreak: 19,
      CapsLock: 20,
      Escape: 27,
      Space: 32,
      PageUp: 33,
      PageDown: 34,
      End: 35,
      Home: 36,
      LeftArrow: 37,
      UpArrow: 38,
      RightArrow: 39,
      DownArrow: 40,
      Insert: 45,
      Delete: 46,
      0: 48,
      1: 49,
      2: 50,
      3: 51,
      4: 52,
      5: 53,
      6: 54,
      7: 55,
      8: 56,
      9: 57,
      A: 65,
      B: 66,
      C: 67,
      D: 68,
      E: 69,
      F: 70,
      G: 71,
      H: 72,
      I: 73,
      J: 74,
      K: 75,
      L: 76,
      M: 77,
      N: 78,
      O: 79,
      P: 80,
      Q: 81,
      R: 82,
      S: 83,
      T: 84,
      U: 85,
      V: 86,
      W: 87,
      X: 88,
      Y: 89,
      Z: 90,
      ContextMenu: 93,
      F1: 112,
      F2: 113,
      F3: 114,
      F4: 115,
      F5: 116,
      F6: 117,
      F7: 118,
      F8: 119,
      F9: 120,
      F10: 121,
      F11: 122,
      F12: 123,
      NumLock: 144,
      ScrollLock: 145,
      ";": 186,
      "=": 187,
      ",": 188,
      "-": 189,
      ".": 190,
      "/": 191,
      "`": 192,
      "[": 219,
      "\\": 220,
      "]": 221,
      "'": 222
    };
    if (n.browser.isIE11orEarlier) {
      e.Meta = 91;
    }

    {
      if (n.browser.isFirefox) {
        e["-"] = 109;
        e["="] = 107;
        e[";"] = 59;
        if (n.browser.isMacintosh) {
          e.Meta = 224;
        }
      } {
        if (n.browser.isOpera) {
          e["-"] = 109;
          e["="] = 61;
          e[";"] = 59;
          if (n.browser.isMacintosh) {
            e.Meta = 57392;
          }
        } {
          if (n.browser.isWebKit && n.browser.isMacintosh) {
            e.Meta = 91;
          }
        }
      }
    }
    var t = {};
    ! function() {
      for (var n in e) {
        if (e.hasOwnProperty(n)) {
          t[e[n]] = n;
        }
      }
    }();

    if (n.browser.isOpera) {
      t[189] = "-";
      t[187] = "=";
      t[186] = ";";
    }

    {
      if (n.browser.isWebKit && n.browser.isMacintosh) {
        t[93] = "Meta";
      }
    }
    var i = function(e, n) {
      return t.hasOwnProperty(e) ? t[e] : n;
    };

    var o = null;
    o = n.browser.isOpera ? function(e) {
      return "keypress" === e.type ? e.which <= 32 ? i(e.keyCode, String.fromCharCode(e.keyCode).toUpperCase()) :
        String.fromCharCode(e.which).toUpperCase() : i(e.keyCode, "unknown");
    } : function(e) {
      return e.charCode ? String.fromCharCode(e.charCode).toUpperCase() : i(e.keyCode, "unknown");
    };

    return {
      CHAR_TO_CODE: e,
      CODE_TO_CHAR: t,
      extractKey: o
    };
  }();

  var o = t.Class.define(function(e) {
    if (this.browserEvent = e, this.ctrlKey = e.ctrlKey, this.shiftKey = e.shiftKey, this.altKey = e.altKey, this.metaKey =
      e.metaKey, this.target = e.target || e.targetNode, this.key = i.extractKey(e), this.ctrlKey = this.ctrlKey ||
      "Ctrl" === this.key, this.altKey = this.altKey || "Alt" === this.key, this.shiftKey = this.shiftKey ||
      "Shift" === this.key, this.metaKey = this.metaKey || "Meta" === this.key, n.browser.isOpera && n.browser.isMacintosh
    ) {
      var t = this.metaKey;
      this.metaKey = this.ctrlKey;

      this.ctrlKey = t;

      if ("Ctrl" === this.key) {
        this.key = "Meta";
      }

      {
        if ("Meta" === this.key) {
          this.key = "Ctrl";
        }
      }
    }
  }, {
    preventDefault: function() {
      if (this.browserEvent.preventDefault) {
        this.browserEvent.preventDefault();
      }

      {
        this.browserEvent.returnValue = !1;
      }
    },
    stopPropagation: function() {
      if (this.browserEvent.stopPropagation) {
        this.browserEvent.stopPropagation();
      }

      {
        this.browserEvent.cancelBubble = !0;
      }
    },
    clone: function() {
      var e = this.asString();
      return {
        ctrlKey: this.ctrlKey,
        shiftKey: this.shiftKey,
        altKey: this.altKey,
        metaKey: this.metaKey,
        target: this.target,
        key: this.key,
        preventDefault: function() {},
        stopPropagation: function() {},
        asString: function() {
          return e;
        }
      };
    },
    asString: function() {
      var e = "";
      this.ctrlKey && (e += "Ctrl");

      this.shiftKey && (e += ("" === e ? "" : "-") + "Shift");

      this.altKey && (e += ("" === e ? "" : "-") + "Alt");

      this.metaKey && (e += ("" === e ? "" : "-") + "Meta");

      this.key && "Ctrl" !== this.key && "Shift" !== this.key && "Alt" !== this.key && "Meta" !== this.key && (e +=
        ("" === e ? "" : "-") + this.key);

      return e;
    }
  });
  return {
    KEYS: i.CHAR_TO_CODE,
    KeyboardEvent: o
  };
});