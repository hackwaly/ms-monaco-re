define("vs/editor/modes/autoIndentation/autoIndentation", ["require", "exports", "vs/editor/modes/modes"], function(e,
  t) {
  var n = function() {
    function e(e) {
      this.brackets = e;
    }
    e.prototype.getElectricBrackets = function() {
      for (var e, t = [], n = 0; n < this.brackets.length; n++) {
        e = this.brackets[n];
        if (e.isElectric) {
          t.push(e.close);
        }
      }
      return t;
    };

    e.prototype.onEnter = function(e, t, n) {
      for (var i = 0; i < t.length && t[i].startIndex < n;) {
        i++;
      }
      for (var o = t[i - 1]; i > 0 && "" === o.type;) {
        i--;
        o = t[i - 1];
      }
      if (i > 0 && this.tokenTypeIsBracket(o.type) && 1 === o.bracket) {
        for (var r = t[i]; i < t.length && "" === r.type;) {
          i++;
          r = t[i];
        }
        return void 0 !== r && r.type === o.type && -1 === r.bracket ? {
          indentAction: 2
        } : {
          indentAction: 1
        };
      }
      return null;
    };

    e.prototype.onElectricCharacter = function(e, t, n) {
      var i;
      for (i = 0; n > i; i++)
        if (" " !== e[i] && "	" !== e[i]) {
          return null;
        }
      return {
        matchBracketType: this.tokenTypeFromChar(e[n])
      };
    };

    e.prototype.tokenTypeFromChar = function(e) {
      for (var t, n = 0; n < this.brackets.length; n++)
        if (t = this.brackets[n], e === t.open || e === t.close) {
          return t.tokenType;
        }
      return null;
    };

    e.prototype.bracketTypeFromChar = function(e) {
      for (var t, n = 0; n < this.brackets.length; n++) {
        if (t = this.brackets[n], e === t.open) {
          return 1;
        }
        if (e === t.close) {
          return -1;
        }
      }
      return null;
    };

    e.prototype.tokenTypeIsBracket = function(e) {
      for (var t = 0; t < this.brackets.length; t++)
        if (e === this.brackets[t].tokenType) {
          return !0;
        }
      return !1;
    };

    e.prototype.characterIsBracket = function(e) {
      for (var t, n = 0; n < this.brackets.length; n++)
        if (t = this.brackets[n], e === t.open || e === t.close) {
          return !0;
        }
      return !1;
    };

    return e;
  }();
  t.Brackets = n;
});