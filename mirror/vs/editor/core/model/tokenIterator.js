define(["require", "exports"], function(a, b) {
  var c = function() {
    function a(a, b) {
      this._model = a;

      this._currentLineNumber = b.lineNumber;

      this._currentTokenIndex = 0;

      this._currentLineTokens = this._model.getInternalTokens(this._currentLineNumber);

      this._next = null;

      this._prev = null;
      var c = b.column - 1;

      var d = Number.MAX_VALUE;
      for (var e = this._currentLineTokens.length - 1; e >= 0; e--) {
        if (this._currentLineTokens[e].startIndex <= c && c <= d) {
          this._currentTokenIndex = e;

          this._next = this._current();

          this._prev = this._current();
          break;
        }
        d = this._currentLineTokens[e].startIndex;
      }
    }
    a.prototype._advanceNext = function() {
      this._prev = this._next;

      this._next = null;
      if (this._currentTokenIndex + 1 < this._currentLineTokens.length) {
        this._currentTokenIndex++;
        this._next = this._current();
      } else {
        while (this._currentLineNumber + 1 <= this._model.getLineCount()) {
          this._currentLineNumber++;

          this._currentLineTokens = this._model.getInternalTokens(this._currentLineNumber);
          if (this._currentLineTokens.length > 0) {
            this._currentTokenIndex = 0;

            this._next = this._current();
            break;
          }
        }
        if (this._next === null) {
          this._currentLineTokens = this._model.getInternalTokens(this._currentLineNumber);
          this._currentTokenIndex = this._currentLineTokens.length;
          this._advancePrev();
          this._next = null;
        }
      }
    };

    a.prototype._advancePrev = function() {
      this._next = this._prev;

      this._prev = null;
      if (this._currentTokenIndex > 0) {
        this._currentTokenIndex--;
        this._prev = this._current();
      } else
        while (this._currentLineNumber > 1) {
          this._currentLineNumber--;

          this._currentLineTokens = this._model.getInternalTokens(this._currentLineNumber);
          if (this._currentLineTokens.length > 0) {
            this._currentTokenIndex = this._currentLineTokens.length - 1;

            this._prev = this._current();
            break;
          }
        }
    };

    a.prototype._current = function() {
      return {
        token: this._currentLineTokens[this._currentTokenIndex],
        lineNumber: this._currentLineNumber,
        startColumn: this._currentLineTokens[this._currentTokenIndex].startIndex + 1,
        endColumn: this._currentTokenIndex + 1 < this._currentLineTokens.length ? this._currentLineTokens[this._currentTokenIndex +
          1].startIndex + 1 : this._model.getLineContent(this._currentLineNumber).length + 1
      };
    };

    a.prototype.hasNext = function() {
      return this._next !== null;
    };

    a.prototype.next = function() {
      var a = this._next;
      this._advanceNext();

      return a;
    };

    a.prototype.hasPrev = function() {
      return this._prev !== null;
    };

    a.prototype.prev = function() {
      var a = this._prev;
      this._advancePrev();

      return a;
    };

    a.prototype._invalidate = function() {
      var a = function() {
        throw new Error("iteration isn't valid anymore");
      };
      this.hasNext = a;

      this.next = a;

      this.hasPrev = a;

      this.prev = a;
    };

    return a;
  }();
  b.TokenIterator = c;
});