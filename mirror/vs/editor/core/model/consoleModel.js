define("vs/editor/core/model/consoleModel", ["require", "exports", "./model", "vs/editor/core/position",
  "vs/editor/core/range", "vs/editor/modes/modes"
], function(e, t, n, i, o) {
  var r = function(e) {
    function t(t, n, i, o) {
      if ("undefined" == typeof i) {
        i = null;
      }

      if ("undefined" == typeof o) {
        o = null;
      }

      e.call(this, "", n, i);

      this.promptText = "";

      this.modes = {};

      this.forceAppendOutputColumn = 0;

      this.foceCurrentMode = 0;

      this.appendOutput(t);
    }
    __extends(t, e);

    t.prototype.setValue = function(t, n) {
      if ("undefined" == typeof n) {
        n = null;
      }

      e.prototype.setValue.call(this, "", n);

      this.modes = {};

      this.forceAppendOutputColumn = 0;

      this.foceCurrentMode = 0;

      this.appendOutput(t);
    };

    t.prototype.pushEditOperations = function(t, n, i) {
      var o;

      var r;

      var s;

      var a = !1;
      for (r = 0, s = n.length; s > r; r++)
        if (o = n[r], o.text && o.text.indexOf("\n") >= 0) {
          a = !0;
          break;
        }
      return a ? t : e.prototype.pushEditOperations.call(this, t, n, i);
    };

    t.prototype.appendOutputPiece = function(e, t, n) {
      if (t.length > 0) {
        var r;

        var s;

        var a;

        var u = this.getEditableRange().getEndPosition();

        var l = u.lineNumber;

        var c = this.forceAppendOutputColumn > 0 ? this.forceAppendOutputColumn : u.column;

        var d = this.foceCurrentMode;

        var h = this.getLineContent(l);
        if (this.modes.hasOwnProperty(l.toString())) {
          r = this.modes[l.toString()];
        } else
          for (r = [], s = 0, a = h.length; a > s; s++) {
            r[s] = 0;
          }
        for (s = 0, a = t.length; a > s; s++)
          if ("\r" !== t.charAt(s)) {
            if (27 === t.charCodeAt(s)) {
              var p = s;

              var f = ++p < a ? t.charAt(p) : null;
              if (f && "[" === f) {
                var g = null;
                if (f = ++p < a ? t.charAt(p) : null, f && f >= "0" && "9" >= f && (g = f, f = ++p < a ? t.charAt(p) :
                  null), f && f >= "0" && "9" >= f && (g += f, f = ++p < a ? t.charAt(p) : null), null === g && (g =
                  "0"), "m" === f) {
                  d = parseInt(g, 10);

                  s = p;
                  continue;
                }
                if ("K" === f) {
                  h = h.substring(0, c - 1);

                  r.splice(c - 1, r.length - c + 1);

                  s = p;
                  continue;
                }
                if ("G" === f) {
                  s = p;
                  continue;
                }
              }
            }
            h = h.substring(0, c - 1) + t.charAt(s) + h.substr(c);

            r[c - 1] = d;

            c++;
          } else {
            c = 1;
          }
        u = e.insertText(new i.Position(l, 1), h, !0);

        e.deleteText(new o.Range(l, u.column, l, this.getLineMaxColumn(l)));

        this.modes[l.toString()] = r;

        this.forceAppendOutputColumn = c;

        this.foceCurrentMode = d;
      }
      if (n) {
        var m = this.getEditableRange().getEndPosition();
        e.insertText(new i.Position(m.lineNumber, m.column), "\n", !0);

        this.forceAppendOutputColumn = 0;
      }
    };

    t.prototype.appendOutput = function(e) {
      var t = this;
      this.change(function(n) {
        for (var i = 0, o = 0, r = e.length; r > o; o++) {
          if ("\n" === e.charAt(o)) {
            t.appendOutputPiece(n, e.substring(i, o), !0);
            i = o + 1;
          }
        }
        if (r > i) {
          t.appendOutputPiece(n, e.substr(i), !1);
        }
      });
    };

    t.prototype.appendPrompt = function() {
      var e = this.promptText;

      var t = this.getLineContent(this.getLineCount());
      if ("" !== t) {
        e = "\n" + e;
      }

      this.forceAppendOutputColumn = 0;

      this.foceCurrentMode = 0;

      this.appendOutput(e);
    };

    t.prototype.replacePrompt = function(e) {
      var t = this;

      var n = this.getEditableRange();
      if (this.promptText && this.promptText !== e && n.startColumn > this.promptText.length) {
        this.change(function(i) {
          var r = i.deleteText(new o.Range(n.startLineNumber, n.startColumn - t.promptText.length, n.startLineNumber,
            n.startColumn));
          i.insertText(r.position, e, !0);
        });
      }

      this.promptText = e || "";

      this.forceAppendOutputColumn = 0;
    };

    t.prototype._updateLineTokens = function(e, t) {
      var n = t.tokens;
      if (1 === n.length) {
        var i = e + 1;
        if (this.modes.hasOwnProperty(i.toString())) {
          var o = this.modes[i.toString()];

          var r = Number.MIN_VALUE;
          n = [];
          for (var s = 0; s < o.length; s++) {
            if (o[s] !== r) {
              n.push({
                startIndex: s,
                type: 0 === o[s] ? "" : "meta.code" + o[s] + ".terminal",
                bracket: 0
              });
            }
            r = o[s];
          }
        }
      }
      this._lines[e].setTokens(n);
    };

    return t;
  }(n.Model);
  t.ConsoleModel = r;
});