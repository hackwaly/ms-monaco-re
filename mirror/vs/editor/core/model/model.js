var __extends = this.__extends || function(a, b) {
    function d() {
      this.constructor = a
    }
    for (var c in b) b.hasOwnProperty(c) && (a[c] = b[c]);
    d.prototype = b.prototype, a.prototype = new d
  };
define(["require", "exports", "vs/nls", "vs/editor/core/config", "vs/base/strings", "vs/base/objects",
  "vs/base/network", "vs/editor/core/constants", "vs/base/eventEmitter", "vs/editor/core/position",
  "vs/editor/core/range", "./trackedRanges", "./modelDecorations", "./tokenIterator", "vs/platform/markers/markers",
  "vs/editor/modes/nullMode", "vs/editor/core/model/editStack", "vs/editor/editor", "vs/base/errors",
  "vs/base/arrays"
], function(a, b, c, d, e, f, g, h, i, j, k, l, m, n, o, p, q, r, s, t) {
  var u = c,
    v = d,
    w = e,
    x = f,
    y = g,
    z = h,
    A = i,
    B = j,
    C = k,
    D = l,
    E = m,
    F = n,
    G = o,
    H = p,
    I = q,
    J = r,
    K = s,
    L = t,
    M = 0,
    N = 1e3,
    O = 5e4,
    P = 65279,
    Q = "\r".charCodeAt(0),
    R = "\n".charCodeAt(0),
    S = function() {
      function a(a, b) {
        typeof b == "undefined" && (b = []), this.text = a, this.state = null, this.tokens = null, this.lineTokens =
          null, this.modeTransitions = null, this.isInvalid = !1, this.markers = b
      }
      return a.prototype.getTokens = function() {
        return this.tokens
      }, a.prototype.setTokens = function(a) {
        this.tokens = a, this.lineTokens = new T(this.tokens, this.text.length)
      }, a.prototype.getLineTokens = function() {
        return this.lineTokens
      }, a
    }(),
    T = function() {
      function a(a, b) {
        this.tokens = a, this.textLength = b
      }
      return a.prototype.getTokens = function() {
        return this.tokens
      }, a.prototype.getTextLength = function() {
        return this.textLength
      }, a.prototype.equals = function(a) {
        return this === a
      }, a.prototype.findIndexOfOffset = function(a) {
        return L.findIndexInSegmentsArray(this.tokens, a)
      }, a
    }(),
    U = function() {
      function a() {
        this.oldDecorationRange = {}, this.oldDecorationOptions = {}, this.newOrChangedDecorations = {}, this.removedDecorations = {}
      }
      return a.prototype.addNewDecoration = function(a) {
        this.newOrChangedDecorations[a] = !0
      }, a.prototype.addRemovedDecoration = function(a, b, c, d) {
        this.newOrChangedDecorations.hasOwnProperty(a) && delete this.newOrChangedDecorations[a], this.oldDecorationRange
          .hasOwnProperty(a) || (this.oldDecorationRange[a] = c), this.oldDecorationOptions.hasOwnProperty(a) || (
            this.oldDecorationOptions[a] = d), this.removedDecorations[a] = !0
      }, a.prototype.addMovedDecoration = function(a, b) {
        this.oldDecorationRange.hasOwnProperty(a) || (this.oldDecorationRange[a] = b), this.newOrChangedDecorations[a] = !
          0
      }, a.prototype.addUpdatedDecoration = function(a, b) {
        this.oldDecorationOptions.hasOwnProperty(a) || (this.oldDecorationOptions[a] = b), this.newOrChangedDecorations[
          a] = !0
      }, a
    }(),
    V = function(a) {
      function b(c, d, e, f) {
        typeof e == "undefined" && (e = null), typeof f == "undefined" && (f = null), a.call(this), this.stopLineTokenizationAfter =
          v.Config.editor.stopLineTokenizationAfter, this.markerService = f, M++, this.id = "$model" + M, this._versionId =
          1;
        if (typeof e == "undefined" || e === null) e = new y.URL("inMemory://localhost/vs/editor/core/model/" + M);
        this.associatedResource = e, this.markerDecorationIds = {}, this.commandManager = new I.EditStack(this), this
          .lines = this._constructLines(c), this.linesLength = this.lines.length, !d || this.linesLength > O ? this.mode =
          new H.NullMode : this.mode = d, this.isUndoing = !1, this.isRedoing = !1;
        var g = null;
        if (this.mode.tokenizationSupport) try {
          g = this.mode.tokenizationSupport.getInitialState()
        } catch (h) {
          K.onUnexpectedError(h, b.MODE_TOKENIZATION_FAILED_MSG), this.mode = new H.NullMode
        }
        g || (g = new H.NullState(this.mode, null)), this.lines[0].state = g, this.lastState = null, this.revalidateTokensTimeout = -
          1, this.modeTokenizationFailedTimeout = -1, this.invalidLineStartIndex = 0, this.trackedRanges = new D.TrackedRanges(
            this), this.modelDecorations = new E.ModelDecorations(this, this.trackedRanges), this.lastMarkerId = 0,
          this.markerIdToLineIndex = {}, this._hasEditableRange = !1, this._editableRangeId = null, this.workerBind(),
          this._beginBackgroundTokenization(), this.extraProperties = {}, this.addWordRegExpProperty(), this._executeWithDeferredEventsCnt =
          0, this._currentDeferredEventBuilder = null
      }
      return __extends(b, a), b.prototype.destroy = function() {
        this.emit(z.EventType.ModelDispose), this.workerUnbind(), this.revalidateTokensTimeout !== -1 && window.clearTimeout(
          this.revalidateTokensTimeout), this.modeTokenizationFailedTimeout !== -1 && window.clearTimeout(this.modeTokenizationFailedTimeout),
          this.lines = null, this.trackedRanges = null, this.modelDecorations = null, this.commandManager = null, a.prototype
          .dispose.call(this)
      }, b.prototype.setStopLineTokenizationAfter = function(a) {
        this.stopLineTokenizationAfter = a
      }, b.prototype.setEditableRange = function(a) {
        this.commandManager.clear(), this._hasEditableRange && (this.removeTrackedRange(this._editableRangeId), this._editableRangeId =
          null, this._hasEditableRange = !1), a && (this._hasEditableRange = !0, this._editableRangeId = this.addTrackedRange(
          a))
      }, b.prototype.hasEditableRange = function() {
        return this._hasEditableRange
      }, b.prototype.getFullModelRange = function() {
        var a = this.getLineCount();
        return new C.Range(1, 1, a, this.getLineMaxColumn(a))
      }, b.prototype.getEditableRange = function() {
        return this._hasEditableRange ? this.getTrackedRange(this._editableRangeId) : this.getFullModelRange()
      }, b.prototype.workerBind = function() {
        this.mode.bindModel(this)
      }, b.prototype.workerUnbind = function() {
        this.mode.unbindModel(this)
      }, b.prototype.getVersionId = function() {
        return this._versionId
      }, b.prototype.getAssociatedResource = function() {
        return this.associatedResource
      }, b.prototype.setModeOrValue = function(a, c, d, e) {
        if (!c && !e) return;
        c && (this.lines = this._constructLines(a), this.linesLength = this.lines.length, this.linesLength > O && (d =
          new H.NullMode, e = !0)), e && (this.workerUnbind(), this.mode = d), c && (this.commandManager = new I.EditStack(
          this));
        var f = null;
        if (this.mode.tokenizationSupport) try {
          f = this.mode.tokenizationSupport.getInitialState()
        } catch (g) {
          K.onUnexpectedError(g, b.MODE_TOKENIZATION_FAILED_MSG), e || this.workerUnbind(), this.mode = new H.NullMode,
            e = !0
        }
        f || (f = new H.NullState(this.mode, null)), this.lines[0].state = f, this.lastState = null, this.revalidateTokensTimeout !== -
          1 && (window.clearTimeout(this.revalidateTokensTimeout), this.revalidateTokensTimeout = -1), this.modeTokenizationFailedTimeout !== -
          1 && (window.clearTimeout(this.modeTokenizationFailedTimeout), this.modeTokenizationFailedTimeout = -1),
          this.invalidLineStartIndex = 0, this.modelDecorations.clear(), this.trackedRanges.clear(), this.markerIdToLineIndex = {},
          this._hasEditableRange = !1, this._editableRangeId = null, c && this._versionId++, this.emitModelContentChangedFlushEvent(
            e), e && this.workerBind(), this._beginBackgroundTokenization()
      }, b.prototype.setMode = function(a) {
        this.setModeOrValue(null, !1, a, a && a !== this.mode)
      }, b.prototype.setValue = function(a, b) {
        typeof b == "undefined" && (b = null), this.setModeOrValue(a, !0, b, b && b !== this.mode)
      }, b.prototype.isDominatedByLongLines = function(a) {
        var b = 0,
          c = 0,
          d, e, f = this.lines,
          g;
        for (d = 0, e = this.linesLength; d < e; d++) g = f[d].text.length, g >= a ? c += g : b += g;
        return c > b
      }, b.prototype.addWordRegExpProperty = function() {
        var a = this.massageWordDefinitionOf(this.mode);
        this.setProperty("$WordDefinitionForMirrorModel", {
          source: a.source,
          flags: (a.global ? "g" : "") + (a.ignoreCase ? "i" : "") + (a.multiline ? "m" : "")
        })
      }, b.prototype.getEndOfLine = function(a) {
        switch (a) {
          case J.EndOfLinePreference.LF:
            return "\n";
          case J.EndOfLinePreference.CRLF:
            return "\r\n";
          case J.EndOfLinePreference.TextDefined:
            return this.getEOL()
        }
        throw new Error("Unknown EOL preference")
      }, b.prototype.getValue = function(a, b) {
        typeof b == "undefined" && (b = !1);
        var c = {
          startLineNumber: 1,
          startColumn: 1,
          endLineNumber: this.linesLength,
          endColumn: this.getLineMaxColumn(this.linesLength)
        };
        return b ? this.BOM + this.getValueInRange(c, a) : this.getValueInRange(c, a)
      }, b.prototype.getValueInRange = function(a, b) {
        typeof b == "undefined" && (b = J.EndOfLinePreference.TextDefined);
        var c = this.validateRange(a);
        if (c.isEmpty()) return "";
        if (c.startLineNumber === c.endLineNumber) return this.lines[c.startLineNumber - 1].text.substring(c.startColumn -
          1, c.endColumn - 1);
        var d = this.getEndOfLine(b),
          e = c.startLineNumber - 1,
          f = c.endLineNumber - 1,
          g = this.lines[e],
          h = this.lines[f],
          i, j, k = [];
        i = g.text.substring(c.startColumn - 1, g.text.length);
        for (var l = e + 1; l < f; l++) j = this.lines[l], k.push(i), i = j.text;
        return k.push(i), k.push(h.text.substring(0, c.endColumn - 1)), k.join(d)
      }, b.prototype.setProperty = function(a, b) {
        this.extraProperties[a] = b, this.emitModelPropertiesChangedEvent()
      }, b.prototype.getProperty = function(a) {
        return this.extraProperties.hasOwnProperty(a) ? this.extraProperties[a] : null
      }, b.prototype.getProperties = function() {
        return x.clone(this.extraProperties)
      }, b.prototype.getMode = function() {
        return this.mode
      }, b.prototype.getLineCount = function() {
        return this.linesLength
      }, b.prototype.getLineContent = function(a) {
        return this.lines[a - 1].text
      }, b.prototype.getEOL = function() {
        return this.EOL
      }, b.prototype.getLineMaxColumn = function(a) {
        return this.lines[a - 1].text.length + 1
      }, b.prototype.getLineFirstNonWhitespaceColumn = function(a) {
        var b = w.firstNonWhitespaceIndex(this.lines[a - 1].text);
        return b === -1 ? 0 : b + 1
      }, b.prototype.getLineLastNonWhitespaceColumn = function(a) {
        var b = w.lastNonWhitespaceIndex(this.lines[a - 1].text);
        return b === -1 ? 0 : b + 2
      }, b.prototype.getLineTokens = function(a) {
        return this._updateTokensUntilLine(a), this.lines[a - 1].getLineTokens()
      }, b.prototype.getInternalTokens = function(a) {
        return this._updateTokensUntilLine(a), this.lines[a - 1].getTokens().slice(0)
      }, b.prototype.getRawLineTokens = function(a) {
        return this._updateTokensUntilLine(a), {
          tokens: this.lines[a - 1].getTokens().slice(0),
          modeTransitions: this.lines[a - 1].modeTransitions.slice(0),
          endState: a < this.linesLength ? this.lines[a - 1].state : this.lastState,
          actualStopOffset: 0
        }
      }, b.prototype.getLineModeTransitions = function(a) {
        return this._updateTokensUntilLine(a), this.lines[a - 1].modeTransitions
      }, b.prototype.getStateBeforeLine = function(a) {
        return this._updateTokensUntilLine(a - 1), this.lines[a - 1].state
      }, b.prototype.getStateAfterLine = function(a) {
        return this._updateTokensUntilLine(a), a < this.linesLength ? this.lines[a - 1].state : this.lastState
      }, b.prototype.getModeAtPosition = function(a, b) {
        if (b === 1) return this.getStateBeforeLine(a).getMode();
        if (b === this.getLineMaxColumn(a)) return this.getStateAfterLine(a).getMode();
        var c = this.getLineModeTransitions(a),
          d = L.findIndexInSegmentsArray(c, b - 1);
        return c[d].mode
      }, b.prototype.pushStackElement = function() {
        this.commandManager.pushStackElement()
      }, b.prototype.pushEditOperations = function(a, b, c) {
        return this.commandManager.pushEditOperation(a, b, c)
      }, b.prototype.undo = function() {
        this.isUndoing = !0;
        var a = this.commandManager.undo();
        return this.isUndoing = !1, a
      }, b.prototype.redo = function() {
        this.isRedoing = !0;
        var a = this.commandManager.redo();
        return this.isRedoing = !1, a
      }, b.prototype._emitEventsFromEventBuilder = function(a) {
        var b, c = [],
          d = [],
          e = [],
          f, g;
        for (b in a.newOrChangedDecorations) a.newOrChangedDecorations.hasOwnProperty(b) && (e.push(b), f = this.modelDecorations
          .getDecorationData(b), f.isForValidation = f.options.className === z.ClassName.EditorErrorDecoration || f.options
          .className === z.ClassName.EditorWarningDecoration, c.push(f), a.oldDecorationRange.hasOwnProperty(b) && (g =
            a.oldDecorationRange[b], g.startLineNumber = g.startLineNumber || f.range.startLineNumber, g.startColumn =
            g.startColumn || f.range.startColumn, g.endLineNumber = g.endLineNumber || f.range.endLineNumber, g.endColumn =
            g.endColumn || f.range.endColumn));
        for (b in a.removedDecorations) a.removedDecorations.hasOwnProperty(b) && (e.push(b), d.push(b));
        if (e.length > 0) {
          var h = {
            ids: e,
            addedOrChangedDecorations: c,
            removedDecorations: d,
            oldOptions: a.oldDecorationOptions,
            oldRanges: a.oldDecorationRange
          };
          this.emitModelDecorationsChangedEvent(h)
        }
      }, b.prototype._executeWithDeferredEvents = function(a) {
        var b = this;
        return this.deferredEmit(function() {
          b._executeWithDeferredEventsCnt === 0 && (b._currentDeferredEventBuilder = new U), b._executeWithDeferredEventsCnt =
            b._executeWithDeferredEventsCnt + 1;
          var c = a(b._currentDeferredEventBuilder);
          return b._executeWithDeferredEventsCnt = b._executeWithDeferredEventsCnt - 1, b._executeWithDeferredEventsCnt ===
            0 && (b._emitEventsFromEventBuilder(b._currentDeferredEventBuilder), b._currentDeferredEventBuilder =
              null), c
        })
      }, b.prototype.change = function(a) {
        var b = this;
        return this._executeWithDeferredEvents(function(c) {
          var d = {}, e = {
              insertText: function(a, c, e) {
                return typeof e == "undefined" && (e = !1), b._insertText(d, a, c, e)
              },
              deleteText: function(a) {
                return b._deleteText(d, a)
              }
            }, f = a(e);
          e.insertText = null, e.deleteText = null;
          var g = b.trackedRanges.onChangedMarkers(d);
          return b.modelDecorations.onChangedRanges(c, g), f
        })
      }, b.prototype.addTrackedRange = function(a) {
        return this.trackedRanges.add(a)
      }, b.prototype.changeTrackedRange = function(a, b) {
        this.trackedRanges.change(a, b)
      }, b.prototype.removeTrackedRange = function(a) {
        this.trackedRanges.remove(a)
      }, b.prototype.getTrackedRange = function(a) {
        return this.trackedRanges.getRange(a)
      }, b.prototype.changeDecorations = function(a, b) {
        typeof b == "undefined" && (b = 0);
        var c = this;
        return this._executeWithDeferredEvents(function(d) {
          return c.modelDecorations.change(d, b, a)
        })
      }, b.prototype.deltaDecorations = function(a, b, c) {
        typeof c == "undefined" && (c = 0);
        var d = this;
        return this._executeWithDeferredEvents(function(e) {
          return d.modelDecorations.change(e, c, function(c) {
            return c.deltaDecorations(a, b)
          })
        })
      }, b.prototype.removeAllDecorationsWithOwnerId = function(a) {
        this.modelDecorations.removeAllDecorationsWithOwnerId(a)
      }, b.prototype.getDecorationOptions = function(a) {
        return this.modelDecorations.getOptions(a)
      }, b.prototype.getDecorationRange = function(a) {
        return this.modelDecorations.getRange(a)
      }, b.prototype.getLineDecorations = function(a, b, c) {
        return typeof b == "undefined" && (b = 0), typeof c == "undefined" && (c = !1), this.getLinesDecorations(a, a,
          b, c)
      }, b.prototype.getLinesDecorations = function(a, b, c, d) {
        typeof c == "undefined" && (c = 0), typeof d == "undefined" && (d = !1);
        var e = this.modelDecorations.getLinesDecorations(a, b, c);
        return d ? this._filterOutValidationDecorations(e) : e
      }, b.prototype.getDecorationsInRange = function(a, b, c) {
        var d = this.validateRange(a),
          e = this.modelDecorations.getLinesDecorations(a.startLineNumber, a.endLineNumber, b);
        return c ? this._filterOutValidationDecorations(e) : e
      }, b.prototype._filterOutValidationDecorations = function(a) {
        var b = [],
          c, d, e;
        for (c = 0, d = a.length; c < d; c++) e = a[c].options.className, e !== z.ClassName.EditorErrorDecoration &&
          e !== z.ClassName.EditorWarningDecoration && b.push(a[c]);
        return b
      }, b.prototype.getAllDecorations = function(a, b) {
        typeof a == "undefined" && (a = 0), typeof b == "undefined" && (b = !1);
        var c = this.modelDecorations.getAll(a);
        return b ? this._filterOutValidationDecorations(c) : c
      }, b.prototype._constructLines = function(a) {
        var c = b.splitText(a);
        return this.BOM = c.BOM, this.EOL = c.EOL, c.lines
      }, b.splitText = function(a) {
        var b = 0,
          c = "";
        a.length > 0 && a.charCodeAt(0) === P && (c = a.charAt(0), b = 1);
        var d, e = -1,
          f, g, h = 0,
          i = 0,
          j, k = [];
        i = b;
        for (d = b, g = a.length; d < g; d++) f = a.charCodeAt(d), f === R && (e === Q ? (h++, j = a.substring(i, d -
          1)) : j = a.substring(i, d), i = d + 1, k.push(new S(j))), e = f;
        k.push(new S(a.substring(i)));
        var l = k.length - 1,
          m = "";
        return l === 0 || h > l / 2 ? m = "\r\n" : m = "\n", {
          BOM: c,
          EOL: m,
          lines: k
        }
      }, b.prototype.massageWordDefinitionOf = function(a) {
        var b = H.NullMode.DEFAULT_WORD_REGEXP;
        if (a.tokenTypeClassificationSupport) {
          try {
            b = a.tokenTypeClassificationSupport.getWordDefinition()
          } catch (c) {
            K.onUnexpectedError(c)
          }
          if (b instanceof RegExp) {
            if (!b.global) {
              var d = "g";
              b.ignoreCase && (d += "i"), b.multiline && (d += "m"), b = new RegExp(b.source, d)
            }
          } else b = H.NullMode.DEFAULT_WORD_REGEXP
        }
        return b.lastIndex = 0, b
      }, b.prototype.getSyntaxTokensHashMap = function() {
        var a = {}, b = [];
        try {
          b = this.mode.tokenTypeClassificationSupport.getNonWordTokenTypes()
        } catch (c) {
          K.onUnexpectedError(c)
        }
        for (var d = 0, e = b.length; d < e; d++) a[b[d]] = !0;
        return a
      }, b.prototype._iterateWords = function(a, b, c) {
        var d = this.getLineContent(a),
          e = this.getStateBeforeLine(a),
          f = this.getInternalTokens(a),
          g = this.getLineModeTransitions(a),
          h, i, j, k, l, m = {};
        b && this.mode.tokenTypeClassificationSupport && (m = this.getSyntaxTokensHashMap());
        if (d.length !== 0) {
          var n = 0,
            o = n + 1 < g.length ? g[n + 1].startIndex : d.length,
            p = this.massageWordDefinitionOf(g[n].mode);
          for (h = 0, i = 0, j = f.length; h < j; h++) {
            l = h === j - 1 ? d.length : f[h + 1].startIndex, i >= o && (n++, o = n + 1 < g.length ? g[n + 1].startIndex :
              d.length, p = this.massageWordDefinitionOf(g[n].mode));
            if (!b || !m.hasOwnProperty(f[h].type)) {
              var q = d.substring(i, l),
                r = q.match(p) || [],
                s, t = 0;
              for (k = 0; k < r.length; k++) {
                var u = r[k].trim();
                if (u.length > 0) {
                  s = q.indexOf(u, t), t = s + u.length;
                  var v = c({
                    start: i + s,
                    end: i + t
                  }, d);
                  if (v) return v
                }
              }
            }
            i = l
          }
        }
      }, b.prototype.getWordAtTokens = function(a, b) {
        var c = this.getInternalTokens(a.lineNumber),
          d, e, f, g = this.getLineContent(a.lineNumber),
          h, i;
        for (d = 0, e = b.length; d < e; d++) {
          f = b[d], i = c[f].startIndex, f < c.length - 1 ? h = g.substring(i, c[f + 1].startIndex) : h = g.substring(
            i);
          var j = this.getModeAtPosition(a.lineNumber, a.column),
            k = this.massageWordDefinitionOf(j),
            l = h.match(k) || [],
            m, n, o, p, q, r;
          for (q = 0; q < l.length; q++) {
            r = l[q].trim();
            if (r.length > 0) {
              m = h.indexOf(r, n), n = m + r.length, o = i + m + 1, p = i + n + 1;
              if (o <= a.column && a.column <= p) return {
                word: r,
                startColumn: o,
                endColumn: p
              }
            }
          }
        }
        return null
      }, b.prototype.getWordAtPosition = function(a, b) {
        var c = this.getInternalTokens(a.lineNumber),
          d = [];
        if (c.length > 0) {
          var e = L.findIndexInSegmentsArray(c, a.column - 1),
            f = null;
          b ? (f = this.getSyntaxTokensHashMap(), f.hasOwnProperty(c[e].type) || d.push(e)) : d.push(e), e > 0 && c[e]
            .startIndex === a.column - 1 && (b ? f.hasOwnProperty(c[e - 1].type) || d.push(e - 1) : d.push(e - 1))
        }
        return d.length === 0 ? null : this.getWordAtTokens(a, d)
      }, b.prototype.getWords = function(a, b) {
        var c = [];
        return this._iterateWords(a, b, function(a) {
          c.push(a)
        }), c
      }, b.prototype.findMatches = function(a, b, c, d, e) {
        if (a === "") return [];
        var f = null;
        try {
          f = w.createRegExp(a, c, d, e)
        } catch (g) {
          return []
        }
        if (w.regExpLeadsToEndlessLoop(f)) return [];
        var h;
        return b ? h = this.getEditableRange() : h = this.getFullModelRange(), this.doFindMatches(h, f)
      }, b.prototype.doFindMatches = function(a, b) {
        var c = [],
          d, e = 0;
        if (a.startLineNumber === a.endLineNumber) return d = this.lines[a.startLineNumber - 1].text.substring(a.startColumn -
          1, a.endColumn - 1), e = this.findMatchesInLine(b, d, a.startLineNumber, a.startColumn - 1, e, c), c;
        d = this.lines[a.startLineNumber - 1].text.substring(a.startColumn - 1), e = this.findMatchesInLine(b, d, a.startLineNumber,
          a.startColumn - 1, e, c);
        for (var f = a.startLineNumber + 1; f < a.endLineNumber && e <= N; f++) e = this.findMatchesInLine(b, this.lines[
          f - 1].text, f, 0, e, c);
        return e <= N && (d = this.lines[a.endLineNumber - 1].text.substring(0, a.endColumn - 1), e = this.findMatchesInLine(
          b, d, a.endLineNumber, 0, e, c)), c
      }, b.prototype.findMatchesInLine = function(a, b, c, d, e, f) {
        var g;
        do {
          g = a.exec(b);
          if (g) {
            f.push(new C.Range(c, g.index + 1 + d, c, g.index + 1 + g[0].length + d)), e++;
            if (e > N) return e
          }
        } while (g);
        return e
      }, b.prototype._addMarker = function(a, b, c) {
        var d = this.validatePosition(new B.Position(a + 1, b)),
          e = {
            id: (++this.lastMarkerId).toString(),
            column: d.column,
            type: c
          };
        return this.lines[d.lineNumber - 1].markers.push(e), this.markerIdToLineIndex[e.id] = d.lineNumber - 1, e.id
      }, b.prototype.__findMarkerInMarkersArray = function(a, b) {
        for (var c = 0; c < a.length; c++)
          if (a[c].id === b) return c;
        return -1
      }, b.prototype._changeMarker = function(a, b, c) {
        if (this.markerIdToLineIndex.hasOwnProperty(a)) {
          var d = this.markerIdToLineIndex[a],
            e = this.lines[d].markers,
            f = this.__findMarkerInMarkersArray(e, a);
          if (f >= 0) {
            var g = e[f],
              h = this.validatePosition(new B.Position(b + 1, c));
            h.lineNumber - 1 !== d && (e.splice(f, 1), this.lines[h.lineNumber - 1].markers.push(g), this.markerIdToLineIndex[
              g.id] = h.lineNumber - 1), g.column = h.column
          }
        }
      }, b.prototype._getMarker = function(a) {
        if (this.markerIdToLineIndex.hasOwnProperty(a)) {
          var b = this.markerIdToLineIndex[a],
            c = this.lines[b].markers,
            d = this.__findMarkerInMarkersArray(c, a);
          if (d >= 0) return {
            lineNumber: b + 1,
            column: c[d].column
          }
        }
        return null
      }, b.prototype._getMarkerLineNumber = function(a) {
        return this.markerIdToLineIndex.hasOwnProperty(a) ? this.markerIdToLineIndex[a] + 1 : -1
      }, b.prototype._getMarkerColumn = function(a, b) {
        var c = this.lines[a - 1].markers,
          d = this.__findMarkerInMarkersArray(c, b);
        return c[d].column
      }, b.prototype._getLineMarkers = function(a) {
        return this.lines[a - 1].markers.slice(0)
      }, b.prototype._removeMarker = function(a) {
        if (this.markerIdToLineIndex.hasOwnProperty(a)) {
          var b = this.markerIdToLineIndex[a],
            c = this.lines[b].markers,
            d = this.__findMarkerInMarkersArray(c, a);
          d >= 0 && c.splice(d, 1), delete this.markerIdToLineIndex[a]
        }
      }, b.prototype.validatePosition = function(a) {
        var b = a.lineNumber ? a.lineNumber : 1,
          c = a.column ? a.column : 1;
        b < 1 && (b = 1), b > this.linesLength && (b = this.linesLength), c < 1 && (c = 1);
        var d = this.getLineMaxColumn(b);
        return c > d && (c = d), new B.Position(b, c)
      }, b.prototype.validateRange = function(a) {
        var b = this.validatePosition(new B.Position(a.startLineNumber, a.startColumn)),
          c = this.validatePosition(new B.Position(a.endLineNumber, a.endColumn));
        return new C.Range(b.lineNumber, b.column, c.lineNumber, c.column)
      }, b.prototype._sign = function(a) {
        return a < 0 ? -1 : a > 0 ? 1 : 0
      }, b.prototype._findMatchingBracketUp = function(a, b, c, d) {
        var e, f, g, h, i = d;
        for (e = b; e >= 0; e--) {
          f = this.lines[e];
          var j = f.getTokens();
          for (h = (e === b ? c : j.length) - 1; h >= 0; h--)
            if (j[h].type === a) {
              i += this._sign(j[h].bracket);
              if (i === 0) return g = h === j.length - 1 ? f.text.length : j[h + 1].startIndex, new C.Range(e + 1, j[
                h].startIndex + 1, e + 1, g + 1)
            }
        }
        return null
      }, b.prototype._findMatchingBracketDown = function(a, b, c) {
        var d, e, f, g, h, i, j = 1;
        for (d = b, f = this.linesLength; d < f; d++) {
          this._updateTokensUntilLine(d + 1), e = this.lines[d];
          var k = e.getTokens();
          for (h = d === b ? c + 1 : 0, i = k.length; h < i; h++)
            if (k[h].type === a) {
              j += this._sign(k[h].bracket);
              if (j === 0) return g = h === k.length - 1 ? e.text.length : k[h + 1].startIndex, new C.Range(d + 1, k[
                h].startIndex + 1, d + 1, g + 1)
            }
        }
        return null
      }, b.prototype.tokenIterator = function(a, b) {
        var c = new F.TokenIterator(this, this.validatePosition(a)),
          d = b(c);
        return c._invalidate(), d
      }, b.prototype.findMatchingBracketUp = function(a, b) {
        this._updateTokensUntilLine(b.lineNumber);
        var c = this.lines[b.lineNumber - 1],
          d, e, f, g, h = b.column - 1,
          i = -1,
          j = c.getTokens();
        for (d = 0, e = j.length; i === -1 && d < e; d++) f = j[d], g = d === e - 1 ? c.text.length : j[d + 1].startIndex,
          f.startIndex <= h && h <= g && (i = d);
        return this._findMatchingBracketUp(a, b.lineNumber - 1, i + 1, 0)
      }, b.prototype.matchBracket = function(a) {
        this._updateTokensUntilLine(a.lineNumber);
        var b = this.lines[a.lineNumber - 1],
          c, d, e = null;
        if (b.text.length > 0) {
          var f = a.column - 1,
            g, h, i, j = b.getTokens();
          for (c = 0, d = j.length; e === null && c < d; c++) g = j[c], h = c === d - 1 ? b.text.length : j[c + 1].startIndex,
            g.startIndex <= f && f <= h && (g.bracket < 0 && (i = this._findMatchingBracketUp(g.type, a.lineNumber -
                1, c, -1), i && (e = [new C.Range(a.lineNumber, g.startIndex + 1, a.lineNumber, h + 1), i])), e ===
              null && g.bracket > 0 && (i = this._findMatchingBracketDown(g.type, a.lineNumber - 1, c), i && (e = [
                new C.Range(a.lineNumber, g.startIndex + 1, a.lineNumber, h + 1), i
              ])))
        }
        return e
      }, b.prototype._revalidateTokensNow = function() {
        this.revalidateTokensTimeout = -1, this.invalidLineStartIndex < this.linesLength && (this._updateTokensUntilLine(
          Math.min(this.linesLength, this.invalidLineStartIndex + 1e3)), this._beginBackgroundTokenization())
      }, b.prototype._beginBackgroundTokenization = function() {
        var a = this;
        this.revalidateTokensTimeout === -1 && (this.revalidateTokensTimeout = window.setTimeout(function() {
          a._revalidateTokensNow()
        }, 300))
      }, b.prototype.updateLineTokens = function(a, b) {
        this.lines[a].setTokens(b.tokens)
      }, b.prototype.onModeTokenizationFailed = function() {
        var a = this;
        this.modeTokenizationFailedTimeout === -1 && (this.modeTokenizationFailedTimeout = window.setTimeout(function() {
          a.setMode(new H.NullMode)
        }, 200))
      }, b.prototype._updateTokensUntilLine = function(a) {
        var c = this.linesLength,
          d = a - 1,
          e = this.stopLineTokenizationAfter;
        e === -1 && (e = 1e9);
        for (var f = this.invalidLineStartIndex; f <= d; f++) {
          var g = f + 1,
            h = null,
            i = this.lines[f].text;
          if (this.mode.tokenizationSupport) {
            try {
              h = this.mode.tokenizationSupport.tokenize(this.lines[f].text, this.lines[f].state, 0, e)
            } catch (j) {
              K.onUnexpectedError(j, b.MODE_TOKENIZATION_FAILED_MSG), this.onModeTokenizationFailed()
            }
            h && h.actualStopOffset < i.length && (h.tokens.push({
              startIndex: h.actualStopOffset,
              type: "",
              bracket: 0
            }), h.endState = this.lines[f].state)
          }
          h || (h = H.nullTokenize(this.mode, i, this.lines[f].state)), this.updateLineTokens(f, h), this.lines[f].modeTransitions =
            h.modeTransitions, this.lines[f].isInvalid && (this.lines[f].isInvalid = !1);
          if (g < c)
            if (this.lines[g].state !== null && h.endState.equals(this.lines[g].state)) {
              var k = f + 1;
              while (k < c) {
                if (this.lines[k].isInvalid) break;
                if (k + 1 < c) {
                  if (this.lines[k + 1].state === null) break
                } else if (this.lastState === null) break;
                k++
              }
              this.invalidLineStartIndex = Math.max(this.invalidLineStartIndex, k), f = k - 1
            } else this.lines[g].state = h.endState;
            else this.lastState = h.endState
        }
        this.invalidLineStartIndex = Math.max(this.invalidLineStartIndex, d + 1)
      }, b.prototype._changeLine = function(a, b) {
        this.lines[a].text = b, this._invalidateLine(a), this._versionId++, this.emitModelContentChangedLineChangedEvent(
          a + 1)
      }, b.prototype._invalidateLine = function(a) {
        this.lines[a].isInvalid = !0, a < this.invalidLineStartIndex && (this.invalidLineStartIndex < this.linesLength &&
          (this.lines[this.invalidLineStartIndex].isInvalid = !0), this.invalidLineStartIndex = a, this._beginBackgroundTokenization()
        )
      }, b.prototype._beforeMarkerChange = function(a, b) {
        if (!b.hasOwnProperty(a.id)) {
          var c = {
            id: a.id,
            oldLineIndex: this.markerIdToLineIndex[a.id],
            oldColumn: a.column
          };
          b[a.id] = c
        }
      }, b.prototype._shouldMoveMarkerOnTextInsert = function(a, b, c, d) {
        return b > c ? !0 : b === c ? d || a === "end" : !1
      }, b.prototype._insertTextOneLine = function(a, b, c, d) {
        var e = b.lineNumber - 1,
          f = b.column,
          g = this.lines[e],
          h = g.text;
        this._changeLine(e, h.substring(0, f - 1) + c + h.substring(f - 1, h.length));
        var i = new B.Position(e + 1, f + c.length),
          j;
        for (var k = 0, l = g.markers.length; k < l; k++) j = g.markers[k], this._shouldMoveMarkerOnTextInsert(j.type,
          j.column, f, d) && (this._beforeMarkerChange(j, a), j.column += c.length);
        return i
      }, b.prototype._insertTextMultiline = function(a, b, c, d) {
        var e = b.lineNumber - 1,
          f = b.column,
          g, h, i = this.lines[e].text,
          j = i.substring(f - 1, i.length);
        this._changeLine(e, i.substring(0, f - 1) + c[0]);
        var k = "";
        for (g = 1, h = c.length - 1; g < h; g++) k += c[g] + "\n", this.lines.splice(e + g, 0, new S(c[g]));
        var l = e + c.length - 1,
          m = c[c.length - 1],
          n = m + j,
          o = [];
        this.lines.splice(l, 0, new S(n, o)), this.linesLength = this.lines.length;
        var p = this.lines[e].markers,
          q;
        for (g = 0; g < p.length; g++) q = p[g], this._shouldMoveMarkerOnTextInsert(q.type, q.column, f, d) && (this._beforeMarkerChange(
          q, a), p.splice(g, 1), o.push(q), q.column += m.length - f + 1, this.markerIdToLineIndex[q.id] = l, g--);
        var r, s, t;
        for (g = l + 1; g < this.linesLength; g++) {
          t = this.lines[g].markers;
          for (r = 0, s = t.length; r < s; r++) q = t[r], this._beforeMarkerChange(q, a), this.markerIdToLineIndex[q.id] =
            g
        }
        return c.length > 1 && (this._versionId++, this.emitModelContentChangedLinesInsertedEvent(e + 2, l + 1, k + n)),
          new B.Position(l + 1, 1 + m.length)
      }, b.prototype._insertText = function(a, b, c, d) {
        var e = this.validatePosition(b);
        if (c.length === 0) return e;
        var f = c.split("\n");
        for (var g = 0, h = f.length; g < h; g++) f[g].charAt(f[g].length - 1) === "\r" && (f[g] = f[g].substring(0,
          f[g].length - 1));
        return f.length === 1 ? this._insertTextOneLine(a, e, f[0], d) : this._insertTextMultiline(a, e, f, d)
      }, b.prototype._deleteTextOneLine = function(a, b) {
        var c = b.startLineNumber - 1,
          d = this.lines[c],
          e = this.lines[c].text,
          f = e.substring(b.startColumn - 1, b.endColumn - 1);
        this._changeLine(c, e.substring(0, b.startColumn - 1) + e.substring(b.endColumn - 1, e.length));
        var g;
        for (var h = 0, i = d.markers.length; h < i; h++) g = d.markers[h], g.column >= b.endColumn ? (this._beforeMarkerChange(
          g, a), g.column -= b.endColumn - b.startColumn) : g.column >= b.startColumn && (this._beforeMarkerChange(g,
          a), g.column = b.startColumn);
        return {
          position: new B.Position(b.startLineNumber, b.startColumn),
          deletedText: f
        }
      }, b.prototype._deleteTextMultiline = function(a, b) {
        var c = b.startLineNumber - 1,
          d = b.endLineNumber - 1,
          e = this.lines[d],
          f = e.text,
          g = f.substring(b.endColumn - 1, f.length),
          h = this.lines[c],
          i = h.text;
        this._changeLine(c, i.substring(0, b.startColumn - 1) + g);
        var j, k, l = i.substring(b.startColumn - 1, i.length);
        for (j = c + 1; j < d; j++) l += "\n" + this.lines[j].text;
        l += "\n" + f.substring(0, b.endColumn - 1);
        var m = d - c,
          n = this.lines.splice(c + 1, m);
        this.linesLength = this.lines.length;
        var o;
        for (j = 0, k = h.markers.length; j < k; j++) o = h.markers[j], o.column > b.startColumn && (this._beforeMarkerChange(
          o, a), o.column = b.startColumn);
        for (j = 0; j < e.markers.length; j++) o = e.markers[j], o.column >= b.endColumn && (this._beforeMarkerChange(
          o, a), e.markers.splice(j, 1), h.markers.push(o), o.column -= b.endColumn - b.startColumn, this.markerIdToLineIndex[
          o.id] = c, j--);
        var p = [];
        for (j = 0, k = n.length; j < k; j++) p = p.concat(n[j].markers);
        for (j = 0, k = p.length; j < k; j++) o = p[j], this._beforeMarkerChange(o, a), o.column = b.startColumn,
          this.markerIdToLineIndex[o.id] = c;
        h.markers = h.markers.concat(p);
        var q, r, s;
        for (j = c + 1; j < this.linesLength; j++) {
          s = this.lines[j].markers;
          for (q = 0, r = s.length; q < r; q++) o = s[q], this._beforeMarkerChange(o, a), this.markerIdToLineIndex[o.id] =
            j
        }
        return this._versionId++, this.emitModelContentChangedLinesDeletedEvent(c + 2, d + 1), {
          position: new B.Position(b.startLineNumber, b.startColumn),
          deletedText: l
        }
      }, b.prototype._deleteText = function(a, b) {
        var c = this.validateRange(b);
        return c.isEmpty() ? {
          position: new B.Position(c.startLineNumber, c.startColumn),
          deletedText: ""
        } : c.startLineNumber === c.endLineNumber ? this._deleteTextOneLine(a, c) : this._deleteTextMultiline(a, c)
      }, b.prototype._publishMarkerUpdate = function(a) {
        var b = G.createMarkerUpdateFromJson(a);
        this.markerService !== null && this.markerService.change(function(a) {
          a.processMarkerUpdate(b)
        });
        var c = b.getId(),
          d = this.markerDecorationIds[c] || [],
          e = [],
          f = b.getMarkers();
        for (var g = 0; g < f.length; g++) {
          var h = f[g];
          typeof h.range == "object" && e.push({
            range: h.range,
            options: this._createDecorationOption(h)
          })
        }
        this.markerDecorationIds[b.getId()] = this.deltaDecorations(d, e)
      }, b.prototype._createDecorationOption = function(a) {
        var b = a.severity === G.Severity.Error;
        return {
          isOverlay: !0,
          className: b ? z.ClassName.EditorErrorDecoration : z.ClassName.EditorWarningDecoration,
          hoverMessage: a.text,
          showInOverviewRuler: b ? "rgba(255,18,18,0.7)" : "rgba(18,136,18,0.7)",
          glyphMarginClassName: b ? "glyph-error" : "glyph-warning"
        }
      }, b.prototype.emitModelContentChangedFlushEvent = function(a) {
        var b = {
          changeType: z.EventType.ModelContentChangedFlush,
          detail: this.getValue(J.EndOfLinePreference.LF),
          modeChanged: a,
          versionId: this._versionId,
          isUndoing: !1,
          isRedoing: !1
        };
        this.emit(z.EventType.ModelContentChanged, b)
      }, b.prototype.emitModelContentChangedLineChangedEvent = function(a) {
        var b = {
          changeType: z.EventType.ModelContentChangedLineChanged,
          lineNumber: a,
          detail: this.lines[a - 1].text,
          versionId: this._versionId,
          isUndoing: this.isUndoing,
          isRedoing: this.isRedoing
        };
        this.emit(z.EventType.ModelContentChanged, b)
      }, b.prototype.emitModelContentChangedLinesDeletedEvent = function(a, b) {
        var c = {
          changeType: z.EventType.ModelContentChangedLinesDeleted,
          fromLineNumber: a,
          toLineNumber: b,
          versionId: this._versionId,
          isUndoing: this.isUndoing,
          isRedoing: this.isRedoing
        };
        this.emit(z.EventType.ModelContentChanged, c)
      }, b.prototype.emitModelContentChangedLinesInsertedEvent = function(a, b, c) {
        var d = {
          changeType: z.EventType.ModelContentChangedLinesInserted,
          fromLineNumber: a,
          toLineNumber: b,
          detail: c,
          versionId: this._versionId,
          isUndoing: this.isUndoing,
          isRedoing: this.isRedoing
        };
        this.emit(z.EventType.ModelContentChanged, d)
      }, b.prototype.emitModelPropertiesChangedEvent = function() {
        var a = {
          properties: this.extraProperties
        };
        this.emit(z.EventType.ModelPropertiesChanged, a)
      }, b.prototype.emitModelDecorationsChangedEvent = function(a) {
        this.emit(z.EventType.ModelDecorationsChanged, a)
      }, b.MODE_TOKENIZATION_FAILED_MSG = u.localize("mode.tokenizationSupportFailed",
        "The mode has failed while tokenizing the input."), b
    }(A.EventEmitter);
  b.Model = V
})