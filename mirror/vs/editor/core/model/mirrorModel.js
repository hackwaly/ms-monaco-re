var __extends = this.__extends || function(a, b) {
    function d() {
      this.constructor = a
    }
    for (var c in b) b.hasOwnProperty(c) && (a[c] = b[c]);
    d.prototype = b.prototype, a.prototype = new d
  };
define(["require", "exports", "vs/base/network", "vs/base/eventEmitter", "vs/editor/core/constants",
  "vs/editor/core/view/model/prefixSumComputer"
], function(a, b, c, d, e, f) {
  var g = c,
    h = d,
    i = e,
    j = f,
    k = function(a) {
      function b(b, c, d, e, f) {
        a.call(this), this.wordsRegexp = null, e || (e = new g.URL(g.schemas.inMemory +
          "://localhost/vs/editor/core/model/mirrorModel/" + b)), f || (f = {}), this._id = b, this._versionId = c,
          this.associatedResource = e, this.extraProperties = f, this.lines = d.split("\n")
      }
      return __extends(b, a), b.prototype.destroy = function() {}, Object.defineProperty(b.prototype, "id", {
        get: function() {
          return this._id
        },
        enumerable: !0,
        configurable: !0
      }), Object.defineProperty(b.prototype, "versionId", {
        get: function() {
          return this._versionId
        },
        enumerable: !0,
        configurable: !0
      }), b.prototype.getAssociatedResource = function() {
        return this.associatedResource
      }, b.prototype.getProperty = function(a) {
        return this.extraProperties.hasOwnProperty(a) ? this.extraProperties[a] : null
      }, b.prototype.onEvents = function(a) {
        var b = !1;
        for (var c = 0, d = a.length; c < d; c++) {
          var e = a[c];
          switch (e.type) {
            case i.EventType.ModelContentChanged:
              this._versionId = e.versionId, this.lineStarts = null;
              switch (e.changeType) {
                case i.EventType.ModelContentChangedFlush:
                  this.emit(i.EventType.OnBeforeModelContentChangedFlush, e), this.lines = e.detail.split("\n"), b = !
                    0;
                  break;
                case i.EventType.ModelContentChangedLinesDeleted:
                  this.emit(i.EventType.OnBeforeModelContentChangedLinesDeleted, e), this._onLinesDeleted(e), b = !0;
                  break;
                case i.EventType.ModelContentChangedLinesInserted:
                  this.emit(i.EventType.OnBeforeModelContentChangedLinesInserted, e), this._onLinesInserted(e), b = !
                    0;
                  break;
                case i.EventType.ModelContentChangedLineChanged:
                  this.emit(i.EventType.OnBeforeModelContentChangedLineChanged, e), this._onLineChanged(e), b = !0
              }
              break;
            case i.EventType.ModelPropertiesChanged:
              this.extraProperties = e.properties;
              break;
            default:
              console.warn("Unknown model event: " + e.type)
          }
        }
        b && this.emit("changed", {})
      }, b.prototype._onLineChanged = function(a) {
        this.lines[a.lineNumber - 1] = a.detail
      }, b.prototype._onLinesDeleted = function(a) {
        var b = a.fromLineNumber - 1,
          c = a.toLineNumber - 1;
        this.lines.splice(b, c - b + 1)
      }, b.prototype._onLinesInserted = function(a) {
        var b, c, d = a.detail.split("\n");
        for (b = a.fromLineNumber - 1, c = 0; b < a.toLineNumber; b++, c++) this.lines.splice(b, 0, d[c])
      }, b.prototype.getValue = function() {
        return this.lines.join("\n")
      }, b.prototype.getValueInRange = function(a, b) {
        var c = b || "\n";
        if (a.startLineNumber === a.endLineNumber && a.startColumn === a.endColumn) return "";
        if (a.startLineNumber === a.endLineNumber) return this.lines[a.startLineNumber - 1].substring(a.startColumn -
          1, a.endColumn - 1);
        var d = a.startLineNumber - 1,
          e = a.endLineNumber - 1,
          f = this.lines[d],
          g = this.lines[e],
          h = [];
        for (var i = d + 1; i < e; i++) h.push(this.lines[i]);
        var j = f.substring(a.startColumn - 1, f.length);
        return h.length > 0 && (j += c + h.join(c)), j += c + g.substring(0, a.endColumn - 1), j
      }, b.prototype.getLineNumberFromOffset = function(a) {
        var b = 0;
        for (var c = 0, d = this.lines.length; c < d; c++) {
          b += this.lines[c].length + 1;
          if (b > a) return c + 1
        }
        return this.lines.length
      }, b.prototype.getOffsetFromPosition = function(a) {
        return this.getLineStart(a.lineNumber) + a.column - 1
      }, b.prototype.getLineStart = function(a) {
        if (!this.lineStarts) {
          var b = [0];
          for (var c = 1, d = this.lines.length; c < d; c++) b.push(this.lines[c - 1].length + 1);
          this.lineStarts = new j.PrefixSumComputer(b)
        }
        var e = Math.min(a, this.lines.length) - 1;
        return this.lineStarts.getAccumulatedValue(e)
      }, b.prototype.getLineContent = function(a) {
        return this.lines[a - 1]
      }, b.prototype.getRawLines = function() {
        return this.lines.slice(0)
      }, b.prototype.getLineCount = function() {
        return this.lines.length
      }, b.prototype.getLineMaxColumn = function(a) {
        return this.lines[a - 1].length + 1
      }, b.prototype.getAllWordsWithRange = function() {
        var a = [],
          b;
        for (b = 0; b < this.lines.length; b++) {
          var c = this.lines[b];
          this.wordenize(c).forEach(function(d) {
            var e = c.substring(d.start, d.end),
              f = {
                startLineNumber: b + 1,
                startColumn: d.start + 1,
                endLineNumber: b + 1,
                endColumn: d.end + 1
              };
            a.push({
              text: e,
              range: f
            })
          })
        }
        return a
      }, b.prototype.getAllWords = function() {
        var a = this,
          b = [];
        return this.lines.forEach(function(c) {
          a.wordenize(c).forEach(function(a) {
            b.push(c.substring(a.start, a.end))
          })
        }), b
      }, b.prototype.getAllUniqueWords = function(a) {
        var b = !1,
          c = {};
        return this.getAllWords().filter(function(d) {
          return a && !b && a === d ? (b = !0, !1) : c[d] ? !1 : (c[d] = !0, !0)
        })
      }, b.prototype.getWordAtPosition = function(a) {
        var b = Math.min(a.lineNumber, this.lines.length) - 1,
          c = this.lines[b];
        return this.getWord(c, a.column - 1, function(a, b, c) {
          return a.substring(b, c)
        })
      }, b.prototype.getWordUntilPosition = function(a) {
        var b = Math.min(a.lineNumber, this.lines.length) - 1,
          c = this.lines[b];
        return this.getWord(c, a.column - 1, function(b, c, d) {
          return c === -1 ? "" : b.substring(c, a.column - 1)
        })
      }, b.prototype.wordenize = function(a) {
        var b = [],
          c;
        if (this.wordsRegexp === null) {
          var d = this.getProperty("$WordDefinitionForMirrorModel");
          d ? this.wordsRegexp = new RegExp(d.source, d.flags) : this.wordsRegexp = /(-?\d*\.\d\w*)|(\w+)/g
        }
        while (c = this.wordsRegexp.exec(a)) b.push({
          start: c.index,
          end: c.index + c[0].length
        });
        return b
      }, b.prototype.getWord = function(a, b, c) {
        var d = this.wordenize(a);
        for (var e = 0; e < d.length && b >= d[e].start; e++)
          if (b <= d[e].end) return c(a, d[e].start, d[e].end);
        return c(a, -1, -1)
      }, b
    }(h.EventEmitter);
  b.MirrorModel = k
})