define("vs/editor/modes/stream", ["require", "exports"], function(e, t) {
  var n = function() {
    function e(e) {
      this._source = e;

      this.sourceLength = e.length;

      this._pos = 0;

      this.whitespace = "	  ";

      this.whitespaceArr = this.stringToArray(this.whitespace);

      this.separators = "";

      this.separatorsArr = this.stringToArray(this.separators);

      this.tokenStart = -1;

      this.tokenEnd = -1;
    }
    e.prototype.stringToArray = function(t) {
      e.STRING_TO_ARRAY_CACHE.hasOwnProperty(t) || (e.STRING_TO_ARRAY_CACHE[t] = this.actualStringToArray(t));

      return e.STRING_TO_ARRAY_CACHE[t];
    };

    e.prototype.actualStringToArray = function(e) {
      for (var t = 0, n = 0; n < e.length; n++) {
        t = e.charCodeAt(n);
      }
      var i = [];
      for (n = 0; t > n; n++) {
        i[n] = !1;
      }
      for (n = 0; n < e.length; n++) {
        i[e.charCodeAt(n)] = !0;
      }
      return i;
    };

    e.prototype.pos = function() {
      return this._pos;
    };

    e.prototype.eos = function() {
      return this._pos >= this.sourceLength;
    };

    e.prototype.peek = function() {
      if (this._pos >= this.sourceLength) throw new Error("Stream is at the end");
      return this._source[this._pos];
    };

    e.prototype.next = function() {
      if (this._pos >= this.sourceLength) throw new Error("Stream is at the end");
      this.tokenStart = -1;

      this.tokenEnd = -1;

      return this._source[this._pos++];
    };

    e.prototype.advance = function(e) {
      var t = this._pos;
      this._pos += e;

      this.resetPeekedToken();

      return this._source.substring(t, this._pos);
    };

    e.prototype.advanceToEOS = function() {
      var e = this._pos;
      this._pos = this.sourceLength;

      this.resetPeekedToken();

      return this._source.substring(e, this._pos);
    };

    e.prototype.goBack = function(e) {
      this._pos -= e;

      this.resetPeekedToken();
    };

    e.prototype.createPeeker = function(e) {
      var t = this;
      if (e instanceof RegExp) {
        return function() {
          var n = e.exec(t._source.substr(t._pos));
          if (null === n) {
            return 0;
          }
          if (0 !== n.index) throw new Error('Regular expression must begin with the character "^"');
          return n[0].length;
        };
      }
      if ((e instanceof String || "string" == typeof e) && e) {
        return function() {
          for (var n = e.length, i = t._pos + n <= t.sourceLength, o = 0; i && n > o; o++) {
            i = t._source.charCodeAt(t._pos + o) === e.charCodeAt(o);
          }
          return i ? n : 0;
        };
      }
      throw new Error("Condition must be either a regular expression, function or a non-empty string");
    };

    e.prototype.advanceIfStringCaseInsensitive = function(e) {
      var t;

      var n = this._pos;

      var i = this._source;

      var o = e.length;
      if (1 > o || n + o > this.sourceLength) {
        return "";
      }
      for (t = 0; o > t; t++)
        if (i.charAt(n + t).toLowerCase() !== e.charAt(t).toLowerCase()) {
          return "";
        }
      return this.advance(o);
    };

    e.prototype.advanceIfString = function(e) {
      var t;

      var n = this._pos;

      var i = this._source;

      var o = e.length;
      if (1 > o || n + o > this.sourceLength) {
        return "";
      }
      for (t = 0; o > t; t++)
        if (i.charCodeAt(n + t) !== e.charCodeAt(t)) {
          return "";
        }
      return this.advance(o);
    };

    e.prototype.advanceIfCharCode = function(e) {
      return this._pos < this.sourceLength && this._source.charCodeAt(this._pos) === e ? this.advance(1) : "";
    };

    e.prototype.advanceIfRegExp = function(e) {
      if (this._pos >= this.sourceLength) {
        return "";
      }
      var t = e.exec(this._source.substr(this._pos));
      if (t) {
        if (0 === t.index) {
          return this.advance(t[0].length);
        }
        throw new Error('Regular expression must begin with the character "^"');
      }
      return "";
    };

    e.prototype.advanceLoop = function(e, t, n) {
      if (this.eos()) {
        return "";
      }
      var i = this.createPeeker(e);

      var o = this._pos;

      var r = 0;

      var s = null;
      for (s = t ? function(e) {
        return e > 0;
      } : function(e) {
        return 0 === e;
      }; !this.eos() && s(r = i());) {
        if (r > 0) {
          this.advance(r);
        } else {
          this.next();
        }
      }
      n && !this.eos() && this.advance(r);

      return this._source.substring(o, this._pos);
    };

    e.prototype.advanceWhile = function(e) {
      return this.advanceLoop(e, !0, !1);
    };

    e.prototype.advanceUntil = function(e, t) {
      return this.advanceLoop(e, !1, t);
    };

    e.prototype.resetPeekedToken = function() {
      this.tokenStart = -1;

      this.tokenEnd = -1;
    };

    e.prototype.setTokenRules = function(e, t) {
      if (this.separators !== e || this.whitespace !== t) {
        this.separators = e;
        this.separatorsArr = this.stringToArray(this.separators);
        this.whitespace = t;
        this.whitespaceArr = this.stringToArray(this.whitespace);
        this.resetPeekedToken();
      }
    };

    e.prototype.peekToken = function() {
      if (-1 !== this.tokenStart) {
        return this._source.substring(this.tokenStart, this.tokenEnd);
      }
      var e = this._source;

      var t = this.sourceLength;

      var n = this.whitespaceArr;

      var i = this.separatorsArr;

      var o = this._pos;
      if (o >= t) throw new Error("Stream is at the end");
      for (; n[e.charCodeAt(o)] && t > o;) {
        o++;
      }
      var r = o;
      if (i[e.charCodeAt(r)] && t > r) {
        r++;
      } else
        for (; !i[e.charCodeAt(r)] && !n[e.charCodeAt(r)] && t > r;) {
          r++;
        }
      this.tokenStart = o;

      this.tokenEnd = r;

      return e.substring(o, r);
    };

    e.prototype.nextToken = function() {
      if (this._pos >= this.sourceLength) throw new Error("Stream is at the end");
      var e;
      e = -1 === this.tokenStart ? this.peekToken() : this._source.substring(this.tokenStart, this.tokenEnd);

      this._pos = this.tokenEnd;

      this.tokenStart = -1;

      this.tokenEnd = -1;

      return e;
    };

    e.prototype.peekWhitespace = function() {
      for (var e = this._source, t = this.sourceLength, n = this.whitespaceArr, i = this._pos; n[e.charCodeAt(i)] &&
        t > i;) {
        i++;
      }
      return e.substring(this._pos, i);
    };

    e.prototype.skipWhitespace = function() {
      for (var e = this._source, t = this.sourceLength, n = this.whitespaceArr, i = this._pos, o = this._pos; n[e.charCodeAt(
        o)] && t > o;) {
        o++;
      }
      return i !== o ? (this._pos = o, this.tokenStart = -1, this.tokenEnd = -1, e.substring(i, o)) : "";
    };

    e.STRING_TO_ARRAY_CACHE = {};

    return e;
  }();
  t.LineStream = n;
});