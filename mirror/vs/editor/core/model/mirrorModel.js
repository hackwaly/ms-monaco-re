define("vs/editor/core/model/mirrorModel", ["require", "exports", "vs/editor/core/constants",
  "vs/editor/core/view/model/prefixSumComputer", "vs/editor/core/model/textModel", "vs/editor/core/model/modelLine"
], function(e, t, n, i, o, r) {
  var s = function(e) {
    function t(t, n, i, o, r) {
      e.call(this, t, i);

      this.wordsRegexp = null;

      if (!r) {
        r = {};
      }

      this._setVersionId(n);

      this._associatedResource = o;

      this._extraProperties = r;
    }
    __extends(t, e);

    t.prototype._constructLines = function(t) {
      e.prototype._constructLines.call(this, t);

      this._EOL = "\n";
    };

    t.prototype.destroy = function() {
      this.dispose();
    };

    t.prototype.dispose = function() {
      e.prototype.dispose.call(this);
    };

    t.prototype.getAssociatedResource = function() {
      return this._associatedResource;
    };

    t.prototype.getProperty = function(e) {
      return this._extraProperties.hasOwnProperty(e) ? this._extraProperties[e] : null;
    };

    t.prototype._ensurePrefixSum = function() {
      if (!this._lineStarts) {
        for (var e = [], t = this.getEOL().length, n = 0, o = this._lines.length; o > n; n++) {
          e.push(this._lines[n].text.length + t);
        }
        this._lineStarts = new i.PrefixSumComputer(e);
      }
    };

    t.prototype.getRangeFromOffsetAndLength = function(e, t) {
      var n = this.getPositionFromOffset(e);

      var i = this.getPositionFromOffset(e + t);
      return {
        startLineNumber: n.lineNumber,
        startColumn: n.column,
        endLineNumber: i.lineNumber,
        endColumn: i.column
      };
    };

    t.prototype.getOffsetAndLengthFromRange = function(e) {
      var t = this.getOffsetFromPosition({
        lineNumber: e.startLineNumber,
        column: e.startColumn
      });

      var n = this.getOffsetFromPosition({
        lineNumber: e.endLineNumber,
        column: e.endColumn
      });
      return {
        offset: t,
        length: n - t
      };
    };

    t.prototype.getPositionFromOffset = function(e) {
      this._ensurePrefixSum();
      var t = {
        index: 0,
        remainder: 0
      };
      this._lineStarts.getIndexOf(e, t);

      return {
        lineNumber: t.index + 1,
        column: this.getEOL().length + t.remainder
      };
    };

    t.prototype.getOffsetFromPosition = function(e) {
      return this.getLineStart(e.lineNumber) + e.column - 1;
    };

    t.prototype.getLineStart = function(e) {
      this._ensurePrefixSum();
      var t = Math.min(e, this._lines.length) - 1;
      return this._lineStarts.getAccumulatedValue(t - 1);
    };

    t.prototype.getRawLines = function() {
      return this._lines.map(function(e) {
        return e.text;
      });
    };

    t.prototype.getAllWordsWithRange = function() {
      var e;

      var t = [];
      for (e = 0; e < this._lines.length; e++) {
        var n = this._lines[e];
        this.wordenize(n.text).forEach(function(i) {
          var o = n.text.substring(i.start, i.end);

          var r = {
            startLineNumber: e + 1,
            startColumn: i.start + 1,
            endLineNumber: e + 1,
            endColumn: i.end + 1
          };
          t.push({
            text: o,
            range: r
          });
        });
      }
      return t;
    };

    t.prototype.getAllWords = function() {
      var e = this;

      var t = [];
      this._lines.forEach(function(n) {
        e.wordenize(n.text).forEach(function(e) {
          t.push(n.text.substring(e.start, e.end));
        });
      });

      return t;
    };

    t.prototype.getAllUniqueWords = function(e) {
      var t = !1;

      var n = {};
      return this.getAllWords().filter(function(i) {
        return e && !t && e === i ? (t = !0, !1) : n[i] ? !1 : (n[i] = !0, !0);
      });
    };

    t.prototype.getWordAtPosition = function(e) {
      var t = Math.min(e.lineNumber, this._lines.length) - 1;

      var n = this._lines[t];
      return this.getWord(n.text, e.column - 1, function(e, t, n) {
        return e.substring(t, n);
      });
    };

    t.prototype.getWordUntilPosition = function(e) {
      var t = Math.min(e.lineNumber, this._lines.length) - 1;

      var n = this._lines[t];
      return this.getWord(n.text, e.column - 1, function(t, n) {
        return -1 === n ? "" : t.substring(n, e.column - 1);
      });
    };

    t.prototype.wordenize = function(e) {
      var t;

      var n = [];
      if (null === this.wordsRegexp) {
        var i = this.getProperty("$WordDefinitionForMirrorModel");
        this.wordsRegexp = i ? new RegExp(i.source, i.flags) : /(-?\d*\.\d\w*)|(\w+)/g;
      }
      for (; t = this.wordsRegexp.exec(e);) {
        n.push({
          start: t.index,
          end: t.index + t[0].length
        });
      }
      return n;
    };

    t.prototype.getWord = function(e, t, n) {
      for (var i = this.wordenize(e), o = 0; o < i.length && t >= i[o].start; o++)
        if (t <= i[o].end) {
          return n(e, i[o].start, i[o].end);
        }
      return n(e, -1, -1);
    };

    return t;
  }(o.TextModel);
  t.AbstractMirrorModel = s;
  var a = function(e) {
    function t(t, i, o, r) {
      e.call(this, [n.EventType.OnBeforeModelContentChangedFlush, n.EventType.OnBeforeModelContentChangedLinesDeleted,
        n.EventType.OnBeforeModelContentChangedLinesInserted, n.EventType.OnBeforeModelContentChangedLineChanged,
        "changed"
      ], t, i, o, r);
    }
    __extends(t, e);

    t.prototype.onEvents = function(e) {
      for (var t = !1, i = 0, o = e.length; o > i; i++) {
        var r = e[i];
        switch (r.type) {
          case n.EventType.ModelContentChanged:
            var s = r;
            switch (this._lineStarts = null, this._setVersionId(s.versionId), s.changeType) {
              case n.EventType.ModelContentChangedFlush:
                this.emit(n.EventType.OnBeforeModelContentChangedFlush, r);

                this._onLinesFlushed(s);

                t = !0;
                break;
              case n.EventType.ModelContentChangedLinesDeleted:
                this.emit(n.EventType.OnBeforeModelContentChangedLinesDeleted, r);

                this._onLinesDeleted(s);

                t = !0;
                break;
              case n.EventType.ModelContentChangedLinesInserted:
                this.emit(n.EventType.OnBeforeModelContentChangedLinesInserted, r);

                this._onLinesInserted(s);

                t = !0;
                break;
              case n.EventType.ModelContentChangedLineChanged:
                this.emit(n.EventType.OnBeforeModelContentChangedLineChanged, r);

                this._onLineChanged(s);

                t = !0;
            }
            break;
          case n.EventType.ModelPropertiesChanged:
            this._extraProperties = r.properties;
            break;
          default:
            console.warn("Unknown model event: " + r.type);
        }
      }
      if (t) {
        this.emit("changed", {});
      }
    };

    t.prototype._onLinesFlushed = function(e) {
      this._lineStarts = null;

      this._constructLines(e.detail);
    };

    t.prototype._onLineChanged = function(e) {
      if (this._lineStarts) {
        var t = this.getEOL().length;

        var n = e.detail.length + t;
        this._lineStarts.changeValue(e.lineNumber - 1, n);
      }
      this._lines[e.lineNumber - 1].text = e.detail;
    };

    t.prototype._onLinesDeleted = function(e) {
      var t = e.fromLineNumber - 1;

      var n = e.toLineNumber - 1;
      if (this._lineStarts) {
        this._lineStarts.removeValues(t, n - t + 1);
      }

      this._lines.splice(t, n - t + 1);
    };

    t.prototype._onLinesInserted = function(e) {
      var t;

      var n;

      var i = this.getEOL().length;

      var o = e.detail.split("\n");
      for (t = e.fromLineNumber - 1, n = 0; t < e.toLineNumber; t++, n++) {
        if (this._lineStarts) {
          this._lineStarts.insertValue(t, o[n].length + i);
        }
        this._lines.splice(t, 0, new r.ModelLine(0, o[n]));
      }
    };

    return t;
  }(s);
  t.MirrorModel = a;
});