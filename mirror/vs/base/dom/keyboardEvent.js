define(["require", "vs/base/lib/winjs.base", "vs/base/env", "vs/base/dom/dom"], function(a, b, c, d) {
  var e = function() {
    var a = {
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
    c.browser.isIE10 ? a.Meta = 91 : c.browser.isFirefox ? (a["-"] = 109, a["="] = 107, a[";"] = 59, c.browser.isMacintosh &&
      (a.Meta = 224)) : c.browser.isOpera ? (a["-"] = 109, a["="] = 61, a[";"] = 59, c.browser.isMacintosh && (a.Meta =
      57392)) : c.browser.isWebKit && c.browser.isMacintosh && (a.Meta = 91);
    var b = {};
    (function() {
      for (var c in a) a.hasOwnProperty(c) && (b[a[c]] = c)
    })(), c.browser.isOpera ? (b[189] = "-", b[187] = "=", b[186] = ";") : c.browser.isWebKit && c.browser.isMacintosh &&
      (b[93] = "Meta");
    var d = function(a, c) {
      return b.hasOwnProperty(a) ? b[a] : c
    }, e = null;
    return c.browser.isOpera ? e = function(a) {
      return a.type === "keypress" ? a.which <= 32 ? d(a.keyCode, String.fromCharCode(a.keyCode).toUpperCase()) :
        String.fromCharCode(a.which).toUpperCase() : d(a.keyCode, "unknown")
    } : e = function(a) {
      return a.charCode ? String.fromCharCode(a.charCode).toUpperCase() : d(a.keyCode, "unknown")
    }, {
      CHAR_TO_CODE: a,
      CODE_TO_CHAR: b,
      extractKey: e
    }
  }(),
    f = b.Class.define(function(b) {
      this.browserEvent = b, this.ctrlKey = b.ctrlKey, this.shiftKey = b.shiftKey, this.altKey = b.altKey, this.metaKey =
        b.metaKey, this.target = b.target || b.targetNode, this.key = e.extractKey(b), this.ctrlKey = this.ctrlKey ||
        this.key === "Ctrl", this.altKey = this.altKey || this.key === "Alt", this.shiftKey = this.shiftKey || this
        .key === "Shift", this.metaKey = this.metaKey || this.key === "Meta";
      if (c.browser.isOpera && c.browser.isMacintosh) {
        var d = this.metaKey;
        this.metaKey = this.ctrlKey, this.ctrlKey = d, this.key === "Ctrl" ? this.key = "Meta" : this.key ===
          "Meta" && (this.key = "Ctrl")
      }
    }, {
      preventDefault: function() {
        this.browserEvent.preventDefault ? this.browserEvent.preventDefault() : this.browserEvent.returnValue = !1
      },
      stopPropagation: function() {
        this.browserEvent.stopPropagation ? this.browserEvent.stopPropagation() : this.browserEvent.cancelBubble = !
          0
      },
      clone: function() {
        var a = this.asString();
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
            return a
          }
        }
      },
      asString: function() {
        var a = "";
        return this.ctrlKey && (a += "Ctrl"), this.shiftKey && (a += (a === "" ? "" : "-") + "Shift"), this.altKey &&
          (a += (a === "" ? "" : "-") + "Alt"), this.metaKey && (a += (a === "" ? "" : "-") + "Meta"), this.key &&
          this.key !== "Ctrl" && this.key !== "Shift" && this.key !== "Alt" && this.key !== "Meta" && (a += (a ===
            "" ? "" : "-") + this.key), a
      }
    }),
    g = b.Class.define(function(b) {
      this._listeners = {}, this._previousKeyDown = null, this._previousEventType = null, this.listenersToRemove = [],
        this.listenersToRemove.push(d.addListener(b, "keydown", this._onKeyDown.bind(this))), this.listenersToRemove
        .push(d.addListener(b, "keypress", this._onKeyPress.bind(this))), this.listenersToRemove.push(d.addListener(
          b, "keyup", this._onKeyUp.bind(this)))
    }, {
      destroy: function() {
        this.listenersToRemove.forEach(function(a) {
          a()
        }), this.listenersToRemove = []
      },
      addListener: function(a, b) {
        return this._listeners[a] = b,
        function() {
          this._listeners[a] = null
        }.bind(this)
      },
      _fire: function(a, b) {
        this._listeners.hasOwnProperty(a) && this._listeners[a](b)
      },
      _onKeyDown: function(a) {
        var b = new f(a);
        this._previousKeyDown = b.clone(), this._previousEventType = "keydown", this._fire("keydown", b)
      },
      _onKeyPress: function(a) {
        var b = new f(a);
        this._previousKeyDown && (b.shiftKey && this._previousKeyDown.asString() !== b.asString() && (b.shiftKey = !
          1), this._previousEventType === "keypress" && this._fire("keydown", this._previousKeyDown)), this._previousEventType =
          "keypress", this._fire("keypress", b)
      },
      _onKeyUp: function(a) {
        this._fire("keyup", new f(a))
      }
    });
  return {
    KEYS: e.CHAR_TO_CODE,
    KeyboardEvent: f,
    KeyboardController: g
  }
})