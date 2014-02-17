define("vs/editor/core/model/textModelWithTokens", ["require", "exports", "vs/nls!vs/editor/editor.main",
  "vs/editor/core/model/textModel", "vs/editor/modes/nullMode", "vs/base/errors", "vs/editor/core/constants",
  "vs/base/arrays", "vs/editor/core/config/config", "vs/editor/core/model/tokenIterator",
  "vs/editor/core/model/textModelWithTokensHelpers"
], function(e, t, n, i, o, r, s, a, u, l, c) {
  var d = function(e) {
    function t(t, n, i) {
      t.push(s.EventType.ModelTokensChanged);

      e.call(this, t, n);

      this._stopLineTokenizationAfter = u.Config.editor.stopLineTokenizationAfter;

      this._mode = i ? i : new o.NullMode;

      this._revalidateTokensTimeout = -1;

      this._modeTokenizationFailedTimeout = -1;

      this._initializeTokenizationState();
    }
    __extends(t, e);

    t.prototype.dispose = function() {
      this._clearTimers();

      this._mode = null;

      this._lastState = null;

      e.prototype.dispose.call(this);
    };

    t.prototype._reset = function(t, n) {
      this._clearTimers();
      var i = this._mode;

      var o = e.prototype._reset.call(this, t);
      null !== n && (this._mode = n);

      this._initializeTokenizationState();

      i !== this._mode && (o.modeChanged = !0);

      return o;
    };

    t.prototype._clearTimers = function() {
      if (-1 !== this._revalidateTokensTimeout) {
        window.clearTimeout(this._revalidateTokensTimeout);
        this._revalidateTokensTimeout = -1;
      }

      if (-1 !== this._modeTokenizationFailedTimeout) {
        window.clearTimeout(this._modeTokenizationFailedTimeout);
        this._modeTokenizationFailedTimeout = -1;
      }
    };

    t.prototype._initializeTokenizationState = function() {
      var e = null;
      if (this._mode.tokenizationSupport) try {
        e = this._mode.tokenizationSupport.getInitialState();
      } catch (n) {
        r.onUnexpectedError(n, t.MODE_TOKENIZATION_FAILED_MSG);

        this._mode = new o.NullMode;
      }
      if (!e) {
        e = new o.NullState(this._mode, null);
      }

      this._lines[0].state = e;

      this._lastState = null;

      this._invalidLineStartIndex = 0;

      this._beginBackgroundTokenization();
    };

    t.prototype.setStopLineTokenizationAfter = function(e) {
      this._stopLineTokenizationAfter = e;
    };

    t.prototype.getLineTokens = function(e, t) {
      "undefined" == typeof t && (t = !1);

      t || this._updateTokensUntilLine(e, !0);

      return this._lines[e - 1].lineTokens;
    };

    t.prototype.getRawLineTokens = function(e) {
      this._updateTokensUntilLine(e, !0);

      return {
        tokens: this._lines[e - 1].lineTokens.getTokens().slice(0),
        modeTransitions: this._lines[e - 1].modeTransitions.slice(0),
        endState: e < this._lines.length ? this._lines[e - 1].state : this._lastState,
        actualStopOffset: 0
      };
    };

    t.prototype._getInternalTokens = function(e) {
      this._updateTokensUntilLine(e, !0);

      return this._lines[e - 1].lineTokens.getTokens().slice(0);
    };

    t.prototype.setValue = function(e, t) {
      if ("undefined" == typeof t && (t = null), null !== e || null !== t) {
        var n = this._reset(e, t);
        this._emitModelContentChangedFlushEvent(n);
      }
    };

    t.prototype.getMode = function() {
      return this._mode;
    };

    t.prototype.setMode = function(e) {
      if (null !== e) {
        var t = this._reset(null, e);
        this._emitModelContentChangedFlushEvent(t);
      }
    };

    t.prototype.getModeAtPosition = function(e, t) {
      if (1 === t) {
        return this.getStateBeforeLine(e).getMode();
      }
      if (t === this.getLineMaxColumn(e)) {
        return this.getStateAfterLine(e).getMode();
      }
      var n = this._getLineModeTransitions(e);

      var i = a.findIndexInSegmentsArray(n, t - 1);
      return n[i].mode;
    };

    t.prototype._invalidateLine = function(e) {
      this._lines[e].isInvalid = !0;

      if (e < this._invalidLineStartIndex) {
        if (this._invalidLineStartIndex < this._lines.length) {
          this._lines[this._invalidLineStartIndex].isInvalid = !0;
        }
        this._invalidLineStartIndex = e;
        this._beginBackgroundTokenization();
      }
    };

    t.prototype._updateLineTokens = function(e, t) {
      this._lines[e].setTokens(t.tokens);
    };

    t.prototype._beginBackgroundTokenization = function() {
      var e = this;
      if (-1 === this._revalidateTokensTimeout) {
        this._revalidateTokensTimeout = window.setTimeout(function() {
          e._revalidateTokensNow();
        }, 50);
      }
    };

    t.prototype._revalidateTokensNow = function() {
      this._revalidateTokensTimeout = -1;
      for (var e, t = 50, n = this._invalidLineStartIndex + 1, i = Math.min(this._lines.length, this._invalidLineStartIndex +
          1e6), o = 0, r = 0, s = 0, a = this._stopLineTokenizationAfter, u = (new Date).getTime(), l = n; i >= l; l++) {
        if (e = (new Date).getTime() - u, e > t) {
          i = l - 1;
          break;
        }
        if (r = this._lines[l - 1].text.length, -1 !== a && r > a && (r = a), o > 0 && (s = e / o * r, e + s > t)) {
          i = l - 1;
          break;
        }
        this._updateTokensUntilLine(l, !1);

        o += r;
      }
      if (i >= n) {
        this.emitModelTokensChangedEvent(n, i);
      }

      if (this._invalidLineStartIndex < this._lines.length) {
        this._beginBackgroundTokenization();
      }
    };

    t.prototype.getStateBeforeLine = function(e) {
      this._updateTokensUntilLine(e - 1, !0);

      return this._lines[e - 1].state;
    };

    t.prototype.getStateAfterLine = function(e) {
      this._updateTokensUntilLine(e, !0);

      return e < this._lines.length ? this._lines[e - 1].state : this._lastState;
    };

    t.prototype._getLineModeTransitions = function(e) {
      this._updateTokensUntilLine(e, !0);

      return this._lines[e - 1].modeTransitions;
    };

    t.prototype._updateTokensUntilLine = function(e, n) {
      var i = this._lines.length;

      var s = e - 1;

      var a = this._stopLineTokenizationAfter;
      if (-1 === a) {
        a = 1e9;
      }
      for (var u = this._invalidLineStartIndex + 1, l = e, c = this._invalidLineStartIndex; s >= c; c++) {
        var d = c + 1;

        var h = null;

        var p = this._lines[c].text;
        if (this._mode.tokenizationSupport) {
          try {
            h = this._mode.tokenizationSupport.tokenize(this._lines[c].text, this._lines[c].state, 0, a);
          } catch (f) {
            r.onUnexpectedError(f, t.MODE_TOKENIZATION_FAILED_MSG);

            this._onModeTokenizationFailed();
          }
          if (h && h.actualStopOffset < p.length) {
            h.tokens.push({
              startIndex: h.actualStopOffset,
              type: "",
              bracket: 0
            });
            h.endState = this._lines[c].state;
          }
        }
        if (h || (h = o.nullTokenize(this._mode, p, this._lines[c].state)), this._updateLineTokens(c, h), this._lines[
            c].modeTransitions = h.modeTransitions, this._lines[c].isInvalid && (this._lines[c].isInvalid = !1), i >
          d)
          if (null !== this._lines[d].state && h.endState.equals(this._lines[d].state)) {
            for (var g = c + 1; i > g && !this._lines[g].isInvalid;) {
              if (i > g + 1) {
                if (null === this._lines[g + 1].state) break;
              } else if (null === this._lastState) break;
              g++;
            }
            this._invalidLineStartIndex = Math.max(this._invalidLineStartIndex, g);

            c = g - 1;
          } else {
            this._lines[d].state = h.endState;
          } else {
            this._lastState = h.endState;
          }
      }
      if (n && l >= u) {
        this.emitModelTokensChangedEvent(u, l);
      }

      this._invalidLineStartIndex = Math.max(this._invalidLineStartIndex, s + 1);
    };

    t.prototype._onModeTokenizationFailed = function() {
      var e = this;
      if (-1 === this._modeTokenizationFailedTimeout) {
        this._modeTokenizationFailedTimeout = window.setTimeout(function() {
          e._modeTokenizationFailedTimeout = -1;

          e.setMode(new o.NullMode);
        }, 200);
      }
    };

    t.prototype.emitModelTokensChangedEvent = function(e, t) {
      var n = {
        fromLineNumber: e,
        toLineNumber: t
      };
      this.emit(s.EventType.ModelTokensChanged, n);
    };

    t.prototype._lineIsTokenized = function(e) {
      return this._invalidLineStartIndex > e - 1;
    };

    t.prototype._getNonWordTokenTypes = function() {
      var e = [];
      try {
        e = this._mode.tokenTypeClassificationSupport.getNonWordTokenTypes();
      } catch (t) {
        r.onUnexpectedError(t);
      }
      return e;
    };

    t.prototype._getWordDefinition = function() {
      return c.WordHelper.massageWordDefinitionOf(this._mode);
    };

    t.prototype.getWordAtPosition = function(e, t, n) {
      "undefined" == typeof n && (n = !1);

      return c.WordHelper.getWordAtPosition(this, this.validatePosition(e), t, n);
    };

    t.prototype.getWords = function(e, t, n) {
      "undefined" == typeof n && (n = !1);

      return c.WordHelper.getWords(this, this.validateLineNumber(e), t, n);
    };

    t.prototype.tokenIterator = function(e, t) {
      var n = new l.TokenIterator(this, this.validatePosition(e));

      var i = t(n);
      n._invalidate();

      return i;
    };

    t.prototype.findMatchingBracketUp = function(e, t) {
      return c.BracketsHelper.findMatchingBracketUp(this, e, this.validatePosition(t));
    };

    t.prototype.matchBracket = function(e, t) {
      "undefined" == typeof t && (t = !1);

      return c.BracketsHelper.matchBracket(this, this.validatePosition(e), t);
    };

    t.MODE_TOKENIZATION_FAILED_MSG = n.localize("vs_editor_core_model_textModelWithTokens", 0);

    return t;
  }(i.TextModel);
  t.TextModelWithTokens = d;
});