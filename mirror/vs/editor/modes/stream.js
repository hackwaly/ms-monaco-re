define(["require", "exports"], function(a, b) {
  var c = function() {
    function a(a) {
      this._source = a, this.sourceLength = a.length, this._pos = 0, this.whitespace = "	  ", this.whitespaceArr =
        this.stringToArray(this.whitespace), this.separators = "", this.separatorsArr = this.stringToArray(this.separators),
        this.tokenStart = -1, this.tokenEnd = -1
    }
    return a.prototype.stringToArray = function(a) {
      var b = 0,
        c;
      for (c = 0; c < a.length; c++) b = a.charCodeAt(c);
      var d = [];
      for (c = 0; c < b; c++) d[c] = !1;
      for (c = 0; c < a.length; c++) d[a.charCodeAt(c)] = !0;
      return d
    }, a.prototype.pos = function() {
      return this._pos
    }, a.prototype.eos = function() {
      return this._pos >= this.sourceLength
    }, a.prototype.peek = function() {
      if (this._pos >= this.sourceLength) throw new Error("Stream is at the end");
      return this._source[this._pos]
    }, a.prototype.next = function() {
      if (this._pos >= this.sourceLength) throw new Error("Stream is at the end");
      return this.tokenStart = -1, this.tokenEnd = -1, this._source[this._pos++]
    }, a.prototype.advance = function(a) {
      var b = this._pos;
      return this._pos += a, this.resetPeekedToken(), this._source.substring(b, this._pos)
    }, a.prototype.advanceToEOS = function() {
      var a = this._pos;
      return this._pos = this.sourceLength, this.resetPeekedToken(), this._source.substring(a, this._pos)
    }, a.prototype.goBack = function(a) {
      this._pos -= a, this.resetPeekedToken()
    }, a.prototype.createPeeker = function(a) {
      var b = this;
      if (a instanceof RegExp) return function() {
        var c = a.exec(b._source.substr(b._pos));
        if (c === null) return 0;
        if (c.index !== 0) throw new Error('Regular expression must begin with the character "^"');
        return c[0].length
      };
      if ((a instanceof String || typeof a == "string") && a) return function() {
        var c = a.length,
          d = b._pos + c <= b.sourceLength;
        for (var e = 0; d && e < c; e++) d = b._source.charCodeAt(b._pos + e) === a.charCodeAt(e);
        return d ? c : 0
      };
      throw new Error("Condition must be either a regular expression, function or a non-empty string")
    }, a.prototype.advanceIf = function(a) {
      var b = this._pos;
      if (b >= this.sourceLength) return "";
      var c = this._source;
      if (a instanceof RegExp) {
        var d = a.exec(c.substr(b));
        if (d) {
          if (d.index === 0) return this.advance(d[0].length);
          throw new Error('Regular expression must begin with the character "^"')
        }
      } else {
        if (typeof a != "string" || !a) throw new Error(
          "Condition must be either a regular expression, function or a non-empty string");
        var e = a.length,
          f = b + e <= this.sourceLength;
        for (var g = 0; f && g < e; g++) f = c.charCodeAt(b + g) === a.charCodeAt(g);
        if (f) return this.advance(a.length)
      }
      return ""
    }, a.prototype.advanceLoop = function(a, b, c) {
      if (this.eos()) return "";
      var d = this.createPeeker(a),
        e = this._pos,
        f = 0,
        g = null;
      b ? g = function(a) {
        return a > 0
      } : g = function(a) {
        return a === 0
      };
      while (!this.eos() && g(f = d())) f > 0 ? this.advance(f) : this.next();
      return c && !this.eos() && this.advance(f), this._source.substring(e, this._pos)
    }, a.prototype.advanceWhile = function(a) {
      return this.advanceLoop(a, !0, !1)
    }, a.prototype.advanceUntil = function(a, b) {
      return this.advanceLoop(a, !1, b)
    }, a.prototype.resetPeekedToken = function() {
      this.tokenStart = -1, this.tokenEnd = -1
    }, a.prototype.setTokenRules = function(a, b) {
      if (this.separators !== a || this.whitespace !== b) this.separators = a, this.separatorsArr = this.stringToArray(
        this.separators), this.whitespace = b, this.whitespaceArr = this.stringToArray(this.whitespace), this.resetPeekedToken()
    }, a.prototype.peekToken = function() {
      if (this.tokenStart !== -1) return this._source.substring(this.tokenStart, this.tokenEnd);
      var a = this._source,
        b = this.sourceLength,
        c = this.whitespaceArr,
        d = this.separatorsArr,
        e = this._pos;
      if (e >= b) throw new Error("Stream is at the end");
      while (c[a.charCodeAt(e)] && e < b) e++;
      var f = e;
      if (d[a.charCodeAt(f)] && f < b) f++;
      else
        while (!d[a.charCodeAt(f)] && !c[a.charCodeAt(f)] && f < b) f++;
      return this.tokenStart = e, this.tokenEnd = f, a.substring(e, f)
    }, a.prototype.nextToken = function() {
      if (this._pos >= this.sourceLength) throw new Error("Stream is at the end");
      var a;
      return this.tokenStart === -1 ? a = this.peekToken() : a = this._source.substring(this.tokenStart, this.tokenEnd),
        this._pos = this.tokenEnd, this.tokenStart = -1, this.tokenEnd = -1, a
    }, a.prototype.peekWhitespace = function() {
      var a = this._source,
        b = this.sourceLength,
        c = this.whitespaceArr,
        d = this._pos;
      while (c[a.charCodeAt(d)] && d < b) d++;
      return a.substring(this._pos, d)
    }, a.prototype.skipWhitespace = function() {
      var a = this._source,
        b = this.sourceLength,
        c = this.whitespaceArr,
        d = this._pos,
        e = this._pos;
      while (c[a.charCodeAt(e)] && e < b) e++;
      return d !== e ? (this._pos = e, this.tokenStart = -1, this.tokenEnd = -1, a.substring(d, e)) : ""
    }, a
  }();
  b.LineStream = c
})