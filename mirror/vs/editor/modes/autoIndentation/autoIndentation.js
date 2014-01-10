define(["require", "exports", "vs/editor/modes/modes"], function(a, b, c) {
  var d = c,
    e = function() {
      function a(a) {
        this.brackets = a
      }
      return a.prototype.getElectricBrackets = function() {
        var a = [],
          b;
        for (var c = 0; c < this.brackets.length; c++) b = this.brackets[c], b.isElectric && a.push(b.close);
        return a
      }, a.prototype.onEnter = function(a, b, c) {
        var e = 0;
        while (e < b.length && b[e].startIndex < c) e++;
        var f = b[e - 1];
        while (e > 0 && f.type === "") e--, f = b[e - 1];
        if (e > 0 && this.tokenTypeIsBracket(f.type) && f.bracket === d.Bracket.Open) {
          var g = b[e];
          while (e < b.length && g.type === "") e++, g = b[e];
          return g !== undefined && g.type === f.type && g.bracket === d.Bracket.Close ? {
            indentAction: d.IndentAction.IndentOutdent
          } : {
            indentAction: d.IndentAction.Indent
          }
        }
        return null
      }, a.prototype.onElectricCharacter = function(a, b, c) {
        var d;
        for (d = 0; d < c; d++)
          if (a[d] !== " " && a[d] !== "	") return null;
        return {
          matchBracketType: this.tokenTypeFromChar(a[c])
        }
      }, a.prototype.tokenTypeFromChar = function(a) {
        var b;
        for (var c = 0; c < this.brackets.length; c++) {
          b = this.brackets[c];
          if (a === b.open || a === b.close) return b.tokenType
        }
        return null
      }, a.prototype.bracketTypeFromChar = function(a) {
        var b;
        for (var c = 0; c < this.brackets.length; c++) {
          b = this.brackets[c];
          if (a === b.open) return d.Bracket.Open;
          if (a === b.close) return d.Bracket.Close
        }
        return null
      }, a.prototype.tokenTypeIsBracket = function(a) {
        for (var b = 0; b < this.brackets.length; b++)
          if (a === this.brackets[b].tokenType) return !0;
        return !1
      }, a.prototype.characterIsBracket = function(a) {
        var b;
        for (var c = 0; c < this.brackets.length; c++) {
          b = this.brackets[c];
          if (a === b.open || a === b.close) return !0
        }
        return !1
      }, a
    }();
  b.Brackets = e
})