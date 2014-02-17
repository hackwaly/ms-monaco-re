define("vs/editor/core/model/textModel", ["require", "exports", "vs/base/eventEmitter", "vs/editor/editor",
  "vs/editor/core/model/modelLine", "vs/base/strings", "vs/editor/core/position", "vs/editor/core/range",
  "vs/editor/core/constants"
], function(e, t, n, i, o, r, s, a, u) {
  var l = 65279;

  var c = ("\r".charCodeAt(0), "\n".charCodeAt(0), " ".charCodeAt(0));

  var d = "	".charCodeAt(0);

  var h = function(e) {
    function t(t, n) {
      t.push(u.EventType.ModelContentChanged);

      e.call(this, t);

      this._constructLines(n);

      this._versionId = 1;
    }
    __extends(t, e);

    t.prototype.getVersionId = function() {
      return this._versionId;
    };

    t.prototype._increaseVersionId = function() {
      this._versionId++;
    };

    t.prototype._setVersionId = function(e) {
      this._versionId = e;
    };

    t.prototype.dispose = function() {
      this._lines = null;

      this._EOL = null;

      this._BOM = null;

      e.prototype.dispose.call(this);
    };

    t.prototype._reset = function(e) {
      null !== e && (this._constructLines(e), this._versionId++);

      return {
        changeType: u.EventType.ModelContentChangedFlush,
        detail: this.getValue(1),
        modeChanged: !1,
        versionId: this._versionId,
        isUndoing: !1,
        isRedoing: !1
      };
    };

    t.prototype.setValue = function(e) {
      var t = this._reset(e);
      this._emitModelContentChangedFlushEvent(t);
    };

    t.prototype.getValue = function(e, t) {
      if ("undefined" == typeof t) {
        t = !1;
      }
      var n = this.getFullModelRange();

      var i = this.getValueInRange(n, e);
      return t ? this._BOM + i : i;
    };

    t.prototype.getValueInRange = function(e, t) {
      if ("undefined" == typeof t) {
        t = 0;
      }
      var n = this.validateRange(e);
      if (n.isEmpty()) {
        return "";
      }
      if (n.startLineNumber === n.endLineNumber) {
        return this._lines[n.startLineNumber - 1].text.substring(n.startColumn - 1, n.endColumn - 1);
      }
      var i = this._getEndOfLine(t);

      var o = n.startLineNumber - 1;

      var r = n.endLineNumber - 1;

      var s = [];
      s.push(this._lines[o].text.substring(n.startColumn - 1));
      for (var a = o + 1; r > a; a++) {
        s.push(this._lines[a].text);
      }
      s.push(this._lines[r].text.substring(0, n.endColumn - 1));

      return s.join(i);
    };

    t.prototype.isDominatedByLongLines = function(e) {
      var t;

      var n;

      var i;

      var o = 0;

      var r = 0;

      var s = this._lines;
      for (t = 0, n = this._lines.length; n > t; t++) {
        i = s[t].text.length;
        i >= e ? r += i : o += i;
      }
      return r > o;
    };

    t.prototype._extractIndentationFactors = function() {
      var e;

      var t;

      var n;

      var i;

      var o;

      var r;

      var s;

      var a;

      var u;

      var l;

      var h;

      var p = this._lines;

      var f = 0;

      var g = "";

      var m = 0;

      var v = [];

      var y = 0;

      var _ = [];
      for (e = 0, t = p.length; t > e; e++) {
        for (s = p[e].text, a = !1, u = 0, h = 0, l = 0, n = 0, i = s.length; i > n; n++)
          if (o = s.charCodeAt(n), o === d) {
            l++;
          } else {
            if (o !== c) {
              a = !0;

              u = n;
              break;
            }
            h++;
          }
        if (1 === h && (h = 0), (l > 0 || h > 0) && (f++, l > 0 && y++, h > 0 && (_[h] = (_[h] || 0) + 1)), a) {
          h = 0;
          var b = !0;
          for (n = 0; m > n && u > n; n++) {
            r = g.charCodeAt(n);
            o = s.charCodeAt(n);
            if (b && r !== o) {
              b = !1;
            }
            if (!b) {
              if (r === c) {
                h++;
              }
              if (o === c) {
                h++;
              }
            }
          }
          for (; m > n; n++) {
            r = g.charCodeAt(n);
            if (r === c) {
              h++;
            }
          }
          for (; u > n; n++) {
            o = s.charCodeAt(n);
            if (o === c) {
              h++;
            }
          }
          if (1 === h) {
            h = 0;
          }

          if (h > 0) {
            v[h] = (v[h] || 0) + 1;
          }

          m = u;

          g = s;
        }
      }
      return {
        linesWithIndentationCount: f,
        linesIndentedWithTabs: y,
        relativeSpaceCounts: v,
        absoluteSpaceCounts: _
      };
    };

    t.prototype.guessIndentation = function(e) {
      var t;

      var n;

      var i = this._extractIndentationFactors();

      var o = i.linesWithIndentationCount;

      var r = i.linesIndentedWithTabs;

      var s = i.absoluteSpaceCounts;

      var a = i.relativeSpaceCounts;

      var u = 0;
      for (t = 1, n = s.length; n > t; t++) {
        u += s[t] || 0;
      }
      if (r >= u) {
        return {
          insertSpaces: !1,
          tabSize: e
        };
      }
      if (6 > o && r > 0) {
        return {
          insertSpaces: !1,
          tabSize: e
        };
      }
      var l;

      var c;

      var d;

      var h;

      var p = [];
      for (l = 2, n = s.length; n > l; l++)
        if (s[l]) {
          for (c = 0, d = 0, h = l; n > h; h += l) {
            s[h] ? c += s[h] : d += l / h;
          }
          p[l] = c / (1 + d);
        }
      var f = 1;

      var g = 0;
      for (l = Math.max(a.length, p.length); l >= 2; l--) {
        c = (p[l] || 0) + (a[l] || 0);
        if (c > g) {
          f = l;
          g = c;
        }
      }
      return {
        insertSpaces: !0,
        tabSize: f
      };
    };

    t.prototype.getLineCount = function() {
      return this._lines.length;
    };

    t.prototype.getLineContent = function(e) {
      return this._lines[e - 1].text;
    };

    t.prototype.getEOL = function() {
      return this._EOL;
    };

    t.prototype.getLineMaxColumn = function(e) {
      return this._lines[e - 1].text.length + 1;
    };

    t.prototype.getLineFirstNonWhitespaceColumn = function(e) {
      var t = r.firstNonWhitespaceIndex(this._lines[e - 1].text);
      return -1 === t ? 0 : t + 1;
    };

    t.prototype.getLineLastNonWhitespaceColumn = function(e) {
      var t = r.lastNonWhitespaceIndex(this._lines[e - 1].text);
      return -1 === t ? 0 : t + 2;
    };

    t.prototype.validateLineNumber = function(e) {
      1 > e && (e = 1);

      e > this._lines.length && (e = this._lines.length);

      return e;
    };

    t.prototype.validatePosition = function(e) {
      var t = e.lineNumber ? e.lineNumber : 1;

      var n = e.column ? e.column : 1;
      if (1 > t) {
        t = 1;
      }

      if (t > this._lines.length) {
        t = this._lines.length;
      }

      if (1 > n) {
        n = 1;
      }
      var i = this.getLineMaxColumn(t);
      n > i && (n = i);

      return new s.Position(t, n);
    };

    t.prototype.validateRange = function(e) {
      var t = this.validatePosition(new s.Position(e.startLineNumber, e.startColumn));

      var n = this.validatePosition(new s.Position(e.endLineNumber, e.endColumn));
      return new a.Range(t.lineNumber, t.column, n.lineNumber, n.column);
    };

    t.prototype.getFullModelRange = function() {
      var e = this.getLineCount();
      return new a.Range(1, 1, e, this.getLineMaxColumn(e));
    };

    t.prototype._emitModelContentChangedFlushEvent = function(e) {
      this.emit(u.EventType.ModelContentChanged, e);
    };

    t._splitText = function(e) {
      for (var t = 0, n = -1; - 1 !== (n = e.indexOf("\r\n", n + 1));) {
        t++;
      }
      var i = e.split(/\r?\n/);

      var r = "";
      if (i[0].length > 0 && i[0].charCodeAt(0) === l) {
        r = String.fromCharCode(l);
        i[0] = i[0].substr(1);
      }
      var s;

      var a;

      var u = [];
      for (s = 0, a = i.length; a > s; s++) {
        u.push(new o.ModelLine(s + 1, i[s]));
      }
      var c = u.length - 1;

      var d = "";
      d = 0 === c || t > c / 2 ? "\r\n" : "\n";

      return {
        BOM: r,
        EOL: d,
        lines: u
      };
    };

    t.prototype._constructLines = function(e) {
      var n = t._splitText(e);
      this._BOM = n.BOM;

      this._EOL = n.EOL;

      this._lines = n.lines;
    };

    t.prototype._getEndOfLine = function(e) {
      switch (e) {
        case 1:
          return "\n";
        case 2:
          return "\r\n";
        case 0:
          return this.getEOL();
      }
      throw new Error("Unknown EOL preference");
    };

    return t;
  }(n.EventEmitter);
  t.TextModel = h;
});