define("vs/editor/core/config/configuration", ["require", "exports", "vs/nls!vs/editor/editor.main", "vs/base/env",
  "vs/editor/core/config/config", "vs/base/objects", "vs/base/types", "vs/platform/platform",
  "vs/platform/configurationRegistry", "vs/editor/core/handlerDispatcher", "vs/base/eventEmitter",
  "vs/editor/core/constants", "vs/editor/modes/modesExtensions", "vs/base/strings", "vs/base/dom/dom",
  "vs/editor/core/config/elementSizeObserver"
], function(e, t, n, i, o, r, s, a, u, l, c, d, h, p, f, g) {
  function m(e) {
    return Boolean(e);
  }

  function v(e, t, n) {
    var i = parseInt(e, 10);
    "number" == typeof t && (i = Math.max(t, i));

    "number" == typeof n && (i = Math.min(n, i));

    return i;
  }
  var y = function() {
    function e(e) {
      this._keyBindings = r.clone(o.Config.keyBindings);

      this._editor = r.clone(o.Config.editor);

      this._mergeOptionsIn(e);
    }
    e.prototype.getKeyBindings = function() {
      return this._keyBindings;
    };

    e.prototype.getEditorOptions = function() {
      return this._editor;
    };

    e.prototype._mergeOptionsIn = function(e) {
      this._editor = r.mixin(this._editor, e || {});
    };

    e.prototype.updateOptions = function(e) {
      var t = Object.keys(e);
      t.push("stopLineTokenizationAfter");

      t.push("stopRenderingLineAfter");
      for (var n = {}, i = 0, o = t.length; o > i; i++) {
        n[t[i]] = r.clone(this._editor[t[i]]);
      }
      this._mergeOptionsIn(e);
      for (var s = [], i = 0, o = t.length; o > i; i++) {
        var a = n[t[i]];

        var u = this._editor[t[i]];
        if (!r.equals(a, u)) {
          s.push(t[i]);
        }
      }
      return s;
    };

    return e;
  }();

  var _ = function() {
    function e() {}
    e.readConfiguration = function(t) {
      e.CACHE.hasOwnProperty(t) || (e.CACHE[t] = this._actualReadConfiguration(t));

      return e.CACHE[t];
    };

    e._testElementId = function(e) {
      return "editorSizeProvider" + e;
    };

    e._createTestElement = function(t, n) {
      var i = document.createElement("span");
      i.id = e._testElementId(t);
      for (var o = " " === n ? "&nbsp;" : n, r = 0; 8 > r; r++) {
        o += o;
      }
      i.textContent = o;

      return i;
    };

    e._createTestElements = function(t) {
      var n = document.createElement("div");
      n.className = t;

      n.style.position = "absolute";

      n.style.top = "-50000px";

      n.style.width = "50000px";
      for (var i = 0, o = e._USUAL_CHARS.length; o > i; i++) {
        n.appendChild(document.createElement("br"));
        n.appendChild(e._createTestElement(i, e._USUAL_CHARS[i]));
      }
      var r = e._testElementId(e._USUAL_CHARS.length);

      var s = document.createElement("div");
      s.id = r;

      s.appendChild(document.createTextNode("heightTestContent"));

      n.appendChild(document.createElement("br"));

      n.appendChild(s);

      return n;
    };

    e._readTestElementWidth = function(t) {
      return document.getElementById(e._testElementId(t)).offsetWidth / 256;
    };

    e._readFromTestElements = function() {
      for (var t = [], n = 0, i = e._USUAL_CHARS.length; i > n; n++) {
        t.push(e._readTestElementWidth(n));
      }
      return t;
    };

    e._actualReadConfiguration = function(t) {
      var n = e._createTestElements(t);
      document.body.appendChild(n);
      var i = e._readFromTestElements();

      var o = document.getElementById(e._testElementId(0));

      var r = f.getComputedStyle(o);

      var s = e._getFontFromComputedStyle(r);

      var a = parseInt(r.fontSize, 10);

      var u = document.getElementById(e._testElementId(e._USUAL_CHARS.length));

      var l = u.clientHeight;
      document.body.removeChild(n);
      for (var c = 0, d = 0, h = 0, p = e._USUAL_CHARS.length; p > h; h++) {
        var g = e._USUAL_CHARS.charAt(h);
        if (g >= "0" && "9" >= g) {
          c = Math.max(c, i[h]);
        }

        {
          if ("|" === g) {
            d = i[h];
          }
        }
      }
      return {
        thinnestCharacterWidth: d,
        maxDigitWidth: c,
        lineHeight: l,
        font: s,
        fontSize: a
      };
    };

    e._getFontFromComputedStyle = function(e) {
      return e.font ? e.font : e.fontFamily + " " + e.fontSize + " " + e.fontSizeAdjust + " " + e.fontStretch + " " +
        e.fontStyle + " " + e.fontVariant + " " + e.fontWeight + " ";
    };

    e._USUAL_CHARS = "0123456789|";

    e.CACHE = {};

    return e;
  }();

  var b = function(e) {
    function t(t, n, i) {
      if ("undefined" == typeof n) {
        n = null;
      }

      if ("undefined" == typeof i) {
        i = null;
      }
      var o = this;
      e.call(this, [d.EventType.ConfigurationChanged]);

      this._configWithDefaults = new y(t);

      this._indentationGuesser = i;

      this._computedIndentationOptions = null;

      this._isDominatedByLongLines = !1;

      this.handlerDispatcher = new l.HandlerDispatcher;

      this._elementSizeObserver = new g.ElementSizeObserver(n, function() {
        var e = o.editor;
        o.editor = o._computeInternalOptions();
        var t = o._createConfigurationChangedEvent([]);
        t.observedOuterWidth = o.editor.observedOuterWidth !== e.observedOuterWidth;

        t.observedOuterHeight = o.editor.observedOuterHeight !== e.observedOuterHeight;

        o.emit(d.EventType.ConfigurationChanged, t);
      });

      if (this._configWithDefaults.getEditorOptions().automaticLayout) {
        this._elementSizeObserver.startObserving();
      }

      this.editor = this._computeInternalOptions();
    }
    __extends(t, e);

    t.prototype.observeReferenceElement = function() {
      this._elementSizeObserver.observe();
    };

    t.prototype.dispose = function() {
      this._elementSizeObserver.dispose();

      e.prototype.dispose.call(this);
    };

    t.prototype.getRawOptions = function() {
      return this._configWithDefaults.getEditorOptions();
    };

    t.prototype._computeInternalOptions = function() {
      var e;

      var t = this._configWithDefaults.getEditorOptions();

      var n = v(t.wrappingColumn, -1);
      e = "undefined" != typeof t.stopLineTokenizationAfter ? v(t.stopLineTokenizationAfter, -1) : n >= 0 ? -1 : 1e4;
      var i;
      i = "undefined" != typeof t.stopRenderingLineAfter ? v(t.stopRenderingLineAfter, -1) : n >= 0 ? -1 : 1e4;
      var o = this._getEditorClassName(t.theme);

      var r = _.readConfiguration(o);

      var s = this._elementSizeObserver.getWidth();

      var a = this._elementSizeObserver.getHeight();
      return {
        observedOuterWidth: s,
        observedOuterHeight: a,
        lineNumbers: t.lineNumbers,
        selectOnLineNumbers: m(t.selectOnLineNumbers),
        lineNumbersMinChars: v(t.lineNumbersMinChars, 1),
        glyphMargin: m(t.glyphMargin),
        lineDecorationsWidth: v(t.lineDecorationsWidth, 0),
        revealHorizontalRightPadding: v(t.revealHorizontalRightPadding, 0),
        roundedSelection: m(t.roundedSelection),
        theme: t.theme,
        readOnly: m(t.readOnly),
        scrollbar: t.scrollbar,
        overviewRulerLanes: v(t.overviewRulerLanes, 0, 3),
        hideCursorInOverviewRuler: m(t.hideCursorInOverviewRuler),
        scrollBeyondLastLine: m(t.scrollBeyondLastLine),
        automaticLayout: m(t.automaticLayout),
        wrappingColumn: n,
        wordWrapBreakBeforeCharacters: t.wordWrapBreakBeforeCharacters,
        wordWrapBreakAfterCharacters: t.wordWrapBreakAfterCharacters,
        wordWrapBreakObtrusiveCharacters: t.wordWrapBreakObtrusiveCharacters,
        tabFocusMode: m(t.tabFocusMode),
        stopLineTokenizationAfter: e,
        stopRenderingLineAfter: i,
        longLineBoundary: v(t.longLineBoundary),
        hover: m(t.hover),
        contextmenu: m(t.contextmenu),
        quickSuggestions: m(t.quickSuggestions),
        quickSuggestionsDelay: v(t.quickSuggestionsDelay),
        iconsInSuggestions: m(t.iconsInSuggestions),
        autoClosingBrackets: m(t.autoClosingBrackets),
        formatOnType: m(t.formatOnType),
        suggestOnTriggerCharacters: m(t.suggestOnTriggerCharacters),
        lineHeight: r.lineHeight,
        pageSize: 0,
        thinnestCharacterWidth: r.thinnestCharacterWidth,
        maxDigitWidth: r.maxDigitWidth,
        font: r.font,
        fontSize: r.fontSize,
        isDominatedByLongLines: this._isDominatedByLongLines
      };
    };

    t.prototype.bindKeys = function(e) {
      var t = this;

      var n = this._configWithDefaults.getKeyBindings();

      var i = e.bindGroup(function(e) {
        for (var i in n)
          if (n.hasOwnProperty(i))
            for (var o = t.handlerDispatcher.trigger.bind(t.handlerDispatcher, "keyboard", i), r = n[i], s = 0; s <
              r.length; s++) {
              var a = r[s];
              e(a, o, {
                id: i
              });
            }
      });
      return i;
    };

    t.prototype._createConfigurationChangedEvent = function(e) {
      var t = {
        observedOuterWidth: !1,
        observedOuterHeight: !1,
        lineHeight: !1,
        pageSize: !1,
        thinnestCharacterWidth: !1,
        maxDigitWidth: !1,
        font: !1,
        fontSize: !1,
        isDominatedByLongLines: !1,
        lineNumbers: !1,
        selectOnLineNumbers: !1,
        lineNumbersMinChars: !1,
        glyphMargin: !1,
        lineDecorationsWidth: !1,
        revealHorizontalRightPadding: !1,
        roundedSelection: !1,
        theme: !1,
        readOnly: !1,
        scrollbar: !1,
        overviewRulerLanes: !1,
        hideCursorInOverviewRuler: !1,
        scrollBeyondLastLine: !1,
        automaticLayout: !1,
        wrappingColumn: !1,
        wordWrapBreakBeforeCharacters: !1,
        wordWrapBreakAfterCharacters: !1,
        wordWrapBreakObtrusiveCharacters: !1,
        tabFocusMode: !1,
        stopLineTokenizationAfter: !1,
        stopRenderingLineAfter: !1,
        longLineBoundary: !1,
        hover: !1,
        contextmenu: !1,
        quickSuggestions: !1,
        quickSuggestionsDelay: !1,
        iconsInSuggestions: !1,
        autoClosingBrackets: !1,
        formatOnType: !1,
        suggestOnTriggerCharacters: !1
      };
      if (e.length > 0)
        for (var n = 0; n < e.length; n++) {
          t[e[n]] = !0;
        }
      return t;
    };

    t.prototype.updateOptions = function(e) {
      var t = this._configWithDefaults.updateOptions(e);
      this.editor = this._computeInternalOptions();

      this._computedIndentationOptions = null;

      if (t.length > 0) {
        this.emit(d.EventType.ConfigurationChanged, this._createConfigurationChangedEvent(t));
      }
    };

    t.prototype._getEditorClassName = function(e) {
      var t = "";
      i.browser.isIE11orEarlier ? t += "ie " : i.browser.isFirefox && (t += "ff ");

      i.browser.isIE9 && (t += "ie9 ");

      i.browser.isMacintosh && (t += "mac ");

      return "monaco-editor " + t + e;
    };

    t.prototype.getEditorClassName = function() {
      return this._getEditorClassName(this.editor.theme);
    };

    t.prototype.setIsDominatedByLongLines = function(e) {
      this._isDominatedByLongLines = e;

      this.editor.isDominatedByLongLines = e;
    };

    t.prototype.resetIndentationOptions = function() {
      this._computedIndentationOptions = null;
    };

    t.prototype._computeIndentationOptions = function() {
      var e = this._configWithDefaults.getEditorOptions();
      if ("auto" !== e.tabSize && "auto" !== e.insertSpaces) {
        return {
          insertSpaces: e.insertSpaces,
          tabSize: e.tabSize
        };
      }
      var t = null;
      if (this._indentationGuesser) {
        t = "auto" !== e.tabSize ? this._indentationGuesser(e.tabSize) : this._indentationGuesser(4);
      }
      var n = !1;

      var i = 4;
      "auto" === e.tabSize && "auto" === e.insertSpaces ? t && (n = t.insertSpaces, i = t.tabSize) : "auto" === e.tabSize ?
        (n = e.insertSpaces, t && (i = t.tabSize)) : (i = e.tabSize, t && (n = t.insertSpaces));

      return {
        insertSpaces: n,
        tabSize: i
      };
    };

    t.prototype.getIndentationOptions = function() {
      this._computedIndentationOptions || (this._computedIndentationOptions = this._computeIndentationOptions());

      return this._computedIndentationOptions;
    };

    t.prototype.getWrappingColumn = function() {
      return this.editor.isDominatedByLongLines && this.editor.wrappingColumn > 0 ? 0 : this.editor.wrappingColumn;
    };

    t.prototype._normalizeIndentationFromWhitespace = function(e) {
      var t;

      var n = this.getIndentationOptions();

      var i = 0;
      for (t = 0; t < e.length; t++) {
        if ("	" === e.charAt(t)) {
          i += n.tabSize;
        } {
          i++;
        }
      }
      var o = "";
      if (!n.insertSpaces) {
        var r = Math.floor(i / n.tabSize);
        for (i %= n.tabSize, t = 0; r > t; t++) {
          o += "	";
        }
      }
      for (t = 0; i > t; t++) {
        o += " ";
      }
      return o;
    };

    t.prototype.normalizeIndentation = function(e) {
      var t = p.firstNonWhitespaceIndex(e); - 1 === t && (t = e.length);

      return this._normalizeIndentationFromWhitespace(e.substring(0, t)) + e.substring(t);
    };

    t.prototype.getOneIndent = function() {
      var e = this.getIndentationOptions();
      if (e.insertSpaces) {
        for (var t = "", n = 0; n < e.tabSize; n++) {
          t += " ";
        }
        return t;
      }
      return "	";
    };

    return t;
  }(c.EventEmitter);
  t.Configuration = b;
  var C = function() {
    function e() {}
    e.apply = function(t, n) {
      return t.getConfiguration().then(function(t) {
        if (t) {
          var i = n;
          if (!s.isArray(n)) {
            i = [n];
          }
          for (var o = 0; o < i.length; o++) {
            var r = i[o];
            if (r && s.isFunction(r.updateOptions)) {
              var u = r.getEditorType();
              switch (u) {
                case d.EditorType.ICodeEditor:
                case d.EditorType.IDiffEditor:
                  var l = t[e.EDITOR_SECTION];
                  if (l) {
                    delete l.readOnly;
                    r.updateOptions(l);
                  }
                  break;
                case d.EditorType.ITerminal:
                  var c = t[e.TERMINAL_SECTION];
                  if (c) {
                    r.updateOptions(c);
                  }
              }
            }
            if (t[e.LANGUAGES_SECTION]) {
              var p = t[e.LANGUAGES_SECTION];

              var f = a.Registry.as(h.Extensions.EditorModes);
              for (var g in p)
                if (p.hasOwnProperty(g)) {
                  var m = p[g];
                  f.configureModeById(g, m);
                }
            }
          }
        }
      });
    };

    e.EDITOR_SECTION = "editor";

    e.TERMINAL_SECTION = "console";

    e.LANGUAGES_SECTION = h.LANGUAGE_CONFIGURATION;

    return e;
  }();
  t.EditorConfiguration = C;
  var w = a.Registry.as(u.Extensions.Configuration);
  w.registerConfiguration({
    id: C.EDITOR_SECTION,
    type: "object",
    title: n.localize("vs_editor_core_config_configuration", 0),
    description: n.localize("vs_editor_core_config_configuration", 1),
    properties: {
      lineNumbers: {
        type: "boolean",
        "default": o.Config.editor.lineNumbers,
        description: n.localize("vs_editor_core_config_configuration", 2)
      },
      glyphMargin: {
        type: "boolean",
        "default": o.Config.editor.glyphMargin,
        description: n.localize("vs_editor_core_config_configuration", 3)
      },
      tabSize: {
        oneOf: [{
          type: "number"
        }, {
          type: "string",
          "enum": ["auto"]
        }],
        "default": o.Config.editor.tabSize,
        minimum: 1,
        description: n.localize("vs_editor_core_config_configuration", 4)
      },
      insertSpaces: {
        oneOf: [{
          type: "boolean"
        }, {
          type: "string",
          "enum": ["auto"]
        }],
        "default": o.Config.editor.insertSpaces,
        description: n.localize("vs_editor_core_config_configuration", 5)
      },
      roundedSelection: {
        type: "boolean",
        "default": o.Config.editor.roundedSelection,
        description: n.localize("vs_editor_core_config_configuration", 6)
      },
      scrollBeyondLastLine: {
        type: "boolean",
        "default": o.Config.editor.scrollBeyondLastLine,
        description: n.localize("vs_editor_core_config_configuration", 7)
      },
      wrappingColumn: {
        type: "integer",
        "default": o.Config.editor.wrappingColumn,
        minimum: -1,
        description: n.localize("vs_editor_core_config_configuration", 8)
      },
      quickSuggestions: {
        type: "boolean",
        "default": o.Config.editor.quickSuggestions,
        description: n.localize("vs_editor_core_config_configuration", 9)
      },
      quickSuggestionsDelay: {
        type: "integer",
        "default": o.Config.editor.quickSuggestionsDelay,
        minimum: 0,
        description: n.localize("vs_editor_core_config_configuration", 10)
      },
      autoClosingBrackets: {
        type: "boolean",
        "default": o.Config.editor.autoClosingBrackets,
        description: n.localize("vs_editor_core_config_configuration", 11)
      },
      formatOnType: {
        type: "boolean",
        "default": o.Config.editor.formatOnType,
        description: n.localize("vs_editor_core_config_configuration", 12)
      },
      suggestOnTriggerCharacters: {
        type: "boolean",
        "default": o.Config.editor.suggestOnTriggerCharacters,
        description: n.localize("vs_editor_core_config_configuration", 13)
      },
      overviewRulerLanes: {
        type: "integer",
        "default": 3,
        description: n.localize("vs_editor_core_config_configuration", 14)
      },
      hideCursorInOverviewRuler: {
        type: "boolean",
        "default": o.Config.editor.hideCursorInOverviewRuler,
        description: n.localize("vs_editor_core_config_configuration", 15)
      }
    }
  });

  w.registerConfiguration({
    id: C.TERMINAL_SECTION,
    type: "object",
    title: n.localize("vs_editor_core_config_configuration", 16),
    description: n.localize("vs_editor_core_config_configuration", 17),
    properties: {
      lineNumbers: {
        type: "boolean",
        "default": !1,
        description: n.localize("vs_editor_core_config_configuration", 18)
      },
      roundedSelection: {
        type: "boolean",
        "default": !0,
        description: n.localize("vs_editor_core_config_configuration", 19)
      },
      wrappingColumn: {
        type: "integer",
        "default": 0,
        minimum: -1,
        description: n.localize("vs_editor_core_config_configuration", 20)
      },
      quickSuggestionsDelay: {
        type: "integer",
        "default": 50,
        minimum: 0,
        description: n.localize("vs_editor_core_config_configuration", 21)
      },
      scrollBeyondLastLine: {
        type: "boolean",
        "default": !0,
        description: n.localize("vs_editor_core_config_configuration", 22)
      },
      hideCursorInOverviewRuler: {
        type: "boolean",
        "default": !0,
        description: n.localize("vs_editor_core_config_configuration", 23)
      }
    }
  });
});