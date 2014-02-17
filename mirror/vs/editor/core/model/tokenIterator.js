define("vs/editor/core/model/tokenIterator", ["require", "exports"], function(e, t) {
  var n = function() {
    function e(e, t) {
      this._model = e;

      this._currentLineNumber = t.lineNumber;

      this._currentTokenIndex = 0;

      this._currentLineTokens = this._model._getInternalTokens(this._currentLineNumber);

      this._next = null;

      this._prev = null;
      for (var n = t.column - 1, i = Number.MAX_VALUE, o = this._currentLineTokens.length - 1; o >= 0; o--) {
        if (this._currentLineTokens[o].startIndex <= n && i >= n) {
          this._currentTokenIndex = o;

          this._next = this._current();

          this._prev = this._current();
          break;
        }
        i = this._currentLineTokens[o].startIndex;
      }
    }
    e.prototype._advanceNext = function() {
      if (this._prev = this._next, this._next = null, this._currentTokenIndex + 1 < this._currentLineTokens.length) {
        this._currentTokenIndex++;
        this._next = this._current();
      } else {
        for (; this._currentLineNumber + 1 <= this._model.getLineCount();)
          if (this._currentLineNumber++, this._currentLineTokens = this._model._getInternalTokens(this._currentLineNumber),
            this._currentLineTokens.length > 0) {
            this._currentTokenIndex = 0;

            this._next = this._current();
            break;
          }
        null === this._next && (this._currentLineTokens = this._model._getInternalTokens(this._currentLineNumber),
          this._currentTokenIndex = this._currentLineTokens.length, this._advancePrev(), this._next = null);
      }
    };

    e.prototype._advancePrev = function() {
      if (this._next = this._prev, this._prev = null, this._currentTokenIndex > 0) {
        this._currentTokenIndex--;
        this._prev = this._current();
      } else
        for (; this._currentLineNumber > 1;)
          if (this._currentLineNumber--, this._currentLineTokens = this._model._getInternalTokens(this._currentLineNumber),
            this._currentLineTokens.length > 0) {
            this._currentTokenIndex = this._currentLineTokens.length - 1;

            this._prev = this._current();
            break;
          }
    };

    e.prototype._current = function() {
      return {
        token: this._currentLineTokens[this._currentTokenIndex],
        lineNumber: this._currentLineNumber,
        startColumn: this._currentLineTokens[this._currentTokenIndex].startIndex + 1,
        endColumn: this._currentTokenIndex + 1 < this._currentLineTokens.length ? this._currentLineTokens[this._currentTokenIndex +
          1].startIndex + 1 : this._model.getLineContent(this._currentLineNumber).length + 1
      };
    };

    e.prototype.hasNext = function() {
      return null !== this._next;
    };

    e.prototype.next = function() {
      var e = this._next;
      this._advanceNext();

      return e;
    };

    e.prototype.hasPrev = function() {
      return null !== this._prev;
    };

    e.prototype.prev = function() {
      var e = this._prev;
      this._advancePrev();

      return e;
    };

    e.prototype._invalidate = function() {
      var e = function() {
        throw new Error("iteration isn't valid anymore");
      };
      this.hasNext = e;

      this.next = e;

      this.hasPrev = e;

      this.prev = e;
    };

    return e;
  }();
  t.TokenIterator = n;
});