var __extends = this.__extends || function(a, b) {
    function d() {
      this.constructor = a;
    }
    for (var c in b) {
      b.hasOwnProperty(c) && (a[c] = b[c]);
    }
    d.prototype = b.prototype;

    a.prototype = new d;
  };

define(["require", "exports", "./model", "vs/editor/core/position", "vs/editor/core/range", "vs/editor/modes/modes"],
  function(a, b, c, d, e, f) {
    var g = c;

    var h = d;

    var i = e;

    var j = f;

    var k = function(a) {
      function b(b, c, d, e) {
        typeof d == "undefined" && (d = null);

        typeof e == "undefined" && (e = null);

        a.call(this, "", c, d);

        this.promptText = "";

        this.modes = {};

        this.forceAppendOutputColumn = 0;

        this.foceCurrentMode = 0;

        this.appendOutput(b);
      }
      __extends(b, a);

      b.prototype.setValue = function(b, c) {
        typeof c == "undefined" && (c = null);

        a.prototype.setValue.call(this, "", c);

        this.modes = {};

        this.forceAppendOutputColumn = 0;

        this.foceCurrentMode = 0;

        this.appendOutput(b);
      };

      b.prototype.appendOutputPiece = function(a, b, c) {
        if (b.length > 0) {
          var d = this.getEditableRange().getEndPosition();

          var e = d.lineNumber;

          var f = this.forceAppendOutputColumn > 0 ? this.forceAppendOutputColumn : d.column;

          var g = this.foceCurrentMode;

          var j;

          var k;

          var l;

          var m = this.getLineContent(e);
          if (this.modes.hasOwnProperty(e.toString())) {
            j = this.modes[e.toString()];
          } else {
            j = [];
            for (k = 0, l = m.length; k < l; k++) {
              j[k] = 0;
            }
          }
          for (var k = 0, l = b.length; k < l; k++) {
            if (b.charAt(k) === "\r") {
              f = 1;
              continue;
            }
            if (b.charCodeAt(k) === 27) {
              var n = k;

              var o = ++n < l ? b.charAt(n) : null;
              if (o && o === "[") {
                var p = null;
                o = ++n < l ? b.charAt(n) : null;

                o && o >= "0" && o <= "9" && (p = o, o = ++n < l ? b.charAt(n) : null);

                o && o >= "0" && o <= "9" && (p += o, o = ++n < l ? b.charAt(n) : null);

                p === null && (p = "0");
                if (o === "m") {
                  g = parseInt(p, 10);

                  k = n;
                  continue;
                }
                if (o === "K") {
                  m = m.substring(0, f - 1);

                  j.splice(f - 1, j.length - f + 1);

                  k = n;
                  continue;
                }
                if (o === "G") {
                  k = n;
                  continue;
                }
              }
            }
            m = m.substring(0, f - 1) + b.charAt(k) + m.substr(f);

            j[f - 1] = g;

            f++;
          }
          d = a.insertText(new h.Position(e, 1), m, !0);

          a.deleteText(new i.Range(e, d.column, e, this.getLineMaxColumn(e)));

          this.modes[e.toString()] = j;

          this.forceAppendOutputColumn = f;

          this.foceCurrentMode = g;
        }
        if (c) {
          var q = this.getEditableRange().getEndPosition();
          a.insertText(new h.Position(q.lineNumber, q.column), "\n", !0);

          this.forceAppendOutputColumn = 0;
        }
      };

      b.prototype.appendOutput = function(a) {
        var b = this;
        this.change(function(c) {
          var d = 0;
          for (var e = 0, f = a.length; e < f; e++) {
            a.charAt(e) === "\n" && (b.appendOutputPiece(c, a.substring(d, e), !0), d = e + 1);
          }
          d < f && b.appendOutputPiece(c, a.substr(d), !1);
        });
      };

      b.prototype.appendPrompt = function() {
        var a = this.promptText;

        var b = this.getLineContent(this.getLineCount());
        b !== "" && (a = "\n" + a);

        this.forceAppendOutputColumn = 0;

        this.foceCurrentMode = 0;

        this.appendOutput(a);
      };

      b.prototype.replacePrompt = function(a) {
        var b = this;

        var c = this.getEditableRange();
        this.promptText && this.promptText !== a && c.startColumn > this.promptText.length && this.change(function(d) {
          var e = d.deleteText(new i.Range(c.startLineNumber, c.startColumn - b.promptText.length, c.startLineNumber,
            c.startColumn));
          d.insertText(e.position, a, !0);
        });

        this.promptText = a || "";

        this.forceAppendOutputColumn = 0;
      };

      b.prototype.updateLineTokens = function(a, b) {
        var c = b.tokens;
        if (c.length === 1) {
          var d = a + 1;
          if (this.modes.hasOwnProperty(d.toString())) {
            var e = this.modes[d.toString()];

            var f = Number.MIN_VALUE;
            c = [];
            for (var g = 0; g < e.length; g++) {
              e[g] !== f && c.push({
                startIndex: g,
                type: e[g] === 0 ? "" : "meta.code" + e[g] + ".terminal",
                bracket: j.Bracket.None
              });
              f = e[g];
            }
          }
        }
        this.lines[a].setTokens(c);
      };

      return b;
    }(g.Model);
    b.TerminalModel = k;
  });