var __extends = this.__extends || function(a, b) {
    function d() {
      this.constructor = a;
    }
    for (var c in b) {
      if (b.hasOwnProperty(c)) {
        a[c] = b[c];
      }
    }
    d.prototype = b.prototype;

    a.prototype = new d;
  };

define(["require", "exports", "vs/nls", "vs/base/env", "./config", "vs/base/objects", "vs/base/types",
  "vs/platform/platform", "vs/platform/configurationRegistry", "./handlerDispatcher", "vs/base/eventEmitter",
  "vs/base/dom/measurementHelper", "./constants", "vs/editor/modes/modesExtensions"
], function(a, b, c, d, e, f, g, h, i, j, k, l, m, n) {
  var o = c;

  var p = d;

  var q = e;

  var r = f;

  var s = g;

  var t = h;

  var u = i;

  var v = j;

  var w = k;

  var x = l;

  var y = m;

  var z = n;

  var A = {};

  var B = function(a) {
    function b(b) {
      a.call(this);

      this.keyBindings = r.clone(q.Config.keyBindings);

      this.editor = r.clone(q.Config.editor);

      this._mergeOptionsIn(b);

      this.handlerDispatcher = new v.HandlerDispatcher;

      this._readCSSConfiguration();
    }
    __extends(b, a);

    b.prototype._mergeOptionsIn = function(a) {
      a = a || {};
      if (a.keyBindings)
        for (var b in a.keyBindings) {
          if (a.keyBindings.hasOwnProperty(b)) {
            this.keyBindings[b] = this.keyBindings[b] || [];
            this.keyBindings[b].push(a.keyBindings[b]);
          }
        }
      if (a.keyBindings) {
        delete a.keyBindings;
      }
      var c = typeof a.stopLineTokenizationAfter != "undefined";

      var d = typeof a.stopRenderingLineAfter != "undefined";
      this.editor = r.mixin(this.editor, a);

      if (!c && this.editor.wrappingColumn >= 0) {
        this.editor.stopLineTokenizationAfter = -1;
      }

      if (!d && this.editor.wrappingColumn >= 0) {
        this.editor.stopRenderingLineAfter = -1;
      }

      this._validateOptions();
    };

    b.prototype._validateOptions = function() {
      this.editor.tabSize = Math.max(1, this._ensureInteger(this.editor.tabSize));

      this.editor.lineNumbersMinChars = Math.max(1, this._ensureInteger(this.editor.lineNumbersMinChars));
    };

    b.prototype._ensureInteger = function(a) {
      return Math.round(parseInt(a, 10));
    };

    b.prototype.bindKeys = function(a) {
      var b = this;

      var c = a.bindGroup(function(a) {
        for (var c in b.keyBindings)
          if (b.keyBindings.hasOwnProperty(c)) {
            var d = b.handlerDispatcher.trigger.bind(b.handlerDispatcher, "keyboard", c);

            var e = b.keyBindings[c];
            for (var f = 0; f < e.length; f++) {
              var g = e[f];
              a(g, d, {
                id: c
              });
            }
          }
      });
      return c;
    };

    b.prototype.dispose = function() {
      a.prototype.dispose.call(this);
    };

    b.prototype.updateOptions = function(a) {
      var b = this.editor.wrappingColumn;

      var c = !! this.editor.viewWordWrap;
      this._mergeOptionsIn(a);
      var d = !! this.editor.viewWordWrap;

      var e = this.editor.wrappingColumn;
      this._readCSSConfiguration();
      var f = {
        wrappingColumnChanged: b !== e,
        viewWordWrapChanged: c !== d
      };
      this.emit(y.EventType.ConfigurationChanged, f);
    };

    b.prototype.getEditorClassName = function() {
      var a = "";
      p.browser.isIE10 ? a += "ie " : p.browser.isFirefox && (a += "ff ");

      p.browser.isMacintosh && (a += "mac ");

      return "monaco-editor " + a + this.editor.theme;
    };

    b.prototype.setIsDominatedByLongLines = function(a) {
      this.editor.isDominatedByLongLines = a;
    };

    b.prototype.getWrappingColumn = function() {
      return this.editor.isDominatedByLongLines && this.editor.wrappingColumn > 0 ? 0 : this.editor.wrappingColumn;
    };

    b.prototype.normalizeIndentation = function(a) {
      var b = 0;

      var c;
      for (c = 0; c < a.length; c++) {
        a.charAt(c) === "	" ? b += this.editor.tabSize : b++;
      }
      var d = "";
      if (!this.editor.insertSpaces) {
        var e = Math.floor(b / this.editor.tabSize);
        b %= this.editor.tabSize;
        for (c = 0; c < e; c++) {
          d += "	";
        }
      }
      for (c = 0; c < b; c++) {
        d += " ";
      }
      return d;
    };

    b.prototype.getOneIndent = function() {
      if (this.editor.insertSpaces) {
        var a = "";
        for (var b = 0; b < this.editor.tabSize; b++) {
          a += " ";
        }
        return a;
      }
      return "	";
    };

    b.prototype._readCSSConfiguration = function() {
      var a = this;
      this._withCSSConfiguration(function(b) {
        if (a.editor.font !== b.font) {
          a.editor.font = b.font;
          a.editor.thinnestCharacterWidth = b.thinnestCharacterWidth;
          a.emit(y.EventType.ConfigurationFontChanged, {
            font: a.editor.font
          });
        }

        if (a.editor.lineHeight !== b.lineHeight) {
          a.editor.lineHeight = b.lineHeight;
          a.emit(y.EventType.ConfigurationLineHeightChanged, a.editor.lineHeight);
        }
      });
    };

    b.prototype._withCSSConfiguration = function(a) {
      var b = this;

      var c = this.getEditorClassName();
      if (A.hasOwnProperty(c)) {
        a(A[c]);
      } else {
        var d = new x.MeasurementHelper;
        d.measure(function(d) {
          d.measure(d.create("div", c, "||||||||||"), function(d, e) {
            var f = {
              thinnestCharacterWidth: d.clientWidth / 10,
              lineHeight: d.clientHeight,
              font: b._readFontFromComputedStyle(e)
            };
            A[c] = f;

            a(A[c]);
          });
        });
      }
    };

    b.prototype._readFontFromComputedStyle = function(a) {
      return a.font ? a.font : a.fontFamily + " " + a.fontSize + " " + a.fontSizeAdjust + " " + a.fontStretch + " " +
        a.fontStyle + " " + a.fontVariant + " " + a.fontWeight + " ";
    };

    return b;
  }(w.EventEmitter);
  b.Configuration = B;
  var C = function() {
    function a() {}
    a.apply = function(b, c) {
      return b.getConfiguration().then(function(b) {
        if (!b) return;
        if (c && s.isFunction(c.updateOptions) && b[a.EDITOR_SECTION]) {
          delete b.readOnly;
          c.updateOptions(b[a.EDITOR_SECTION]);
        }
        if (b[a.LANGUAGES_SECTION]) {
          var d = b[a.LANGUAGES_SECTION];

          var e = t.Registry.as(z.Extensions.EditorModes);
          for (var f in d)
            if (d.hasOwnProperty(f)) {
              var g = d[f];
              e.configureModeById(f, g);
            }
        }
      });
    };

    a.EDITOR_SECTION = "editor";

    a.LANGUAGES_SECTION = z.LANGUAGE_CONFIGURATION;

    return a;
  }();
  b.EditorConfiguration = C;
  var D = t.Registry.as(u.Extensions.Configuration);
  D.registerConfiguration({
    path: [C.EDITOR_SECTION],
    configuration: {
      id: "editorConfiguration",
      type: "object",
      title: o.localize("editorConfigurationTitle", "Editor configuration"),
      description: o.localize("editorConfigurationDescription", "This is used to configure the editor."),
      properties: {
        lineNumbers: {
          type: "boolean",
          "default": "true",
          description: o.localize("lineNumbers", "Controls visibility of line numbers")
        },
        glyphMargin: {
          type: "boolean",
          description: o.localize("glyphMargin", "Controls visibility of the glyph margin")
        },
        tabSize: {
          type: "integer",
          "default": "4",
          description: o.localize("tabSize", "Controls the size of tabs")
        },
        insertSpaces: {
          type: "boolean",
          description: o.localize("insertSpaces", "Controls if the editor will insert spaces for tabs")
        },
        roundedSelection: {
          type: "boolean",
          "default": "true",
          description: o.localize("roundedSelection", "Controls if selections have rounded corners")
        },
        scrollBeyondLastLine: {
          type: "boolean",
          "default": "true",
          description: o.localize("scrollBeyondLastLine", "Controls if the editor will scroll beyond the last line")
        },
        wrappingColumn: {
          type: "integer",
          "default": "300",
          description: o.localize("wrappingColumn",
            "Controls after how many characters the editor will wrap to the next line")
        },
        quickSuggestions: {
          type: "boolean",
          "default": "true",
          description: o.localize("quickSuggestions",
            "Controls if quick suggestions should show up or not while typing")
        },
        quickSuggestionsDelay: {
          type: "integer",
          "default": "500",
          description: o.localize("quickSuggestionsDelay",
            "Controls the delay in ms after which quick suggestions will show up")
        },
        autoClosingBrackets: {
          type: "boolean",
          "default": "true",
          description: o.localize("autoClosingBrackets",
            "Controls if the editor should automatically close brackets after opening them")
        },
        formatOnType: {
          type: "boolean",
          description: o.localize("formatOnType",
            "Controls if the editor should automatically format the line after typing")
        },
        suggestOnTriggerCharacters: {
          type: "boolean",
          "default": "true",
          description: o.localize("suggestOnTriggerCharacters",
            "Controls if suggestions should automatically show up when typing trigger characters")
        },
        gotoDefinitionWithMouse: {
          type: "boolean",
          "default": "true",
          description: o.localize("gotoDefinitionWithMouse",
            "Controls if goto definition is supported using the mouse")
        }
      }
    }
  });
});