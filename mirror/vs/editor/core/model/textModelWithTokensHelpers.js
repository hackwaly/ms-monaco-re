define("vs/editor/core/model/textModelWithTokensHelpers", ["require", "exports", "vs/base/arrays",
  "vs/editor/modes/nullMode", "vs/base/errors", "vs/editor/core/range"
], function(e, t, n, i, o, r) {
  var s = function() {
    function e() {}
    e.massageWordDefinitionOf = function(e) {
      var t = i.NullMode.DEFAULT_WORD_REGEXP;
      if (e.tokenTypeClassificationSupport) {
        try {
          t = e.tokenTypeClassificationSupport.getWordDefinition();
        } catch (n) {
          o.onUnexpectedError(n);
        }
        if (t instanceof RegExp) {
          if (!t.global) {
            var r = "g";
            t.ignoreCase && (r += "i");

            t.multiline && (r += "m");

            t = new RegExp(t.source, r);
          }
        } else t = i.NullMode.DEFAULT_WORD_REGEXP;
      }
      t.lastIndex = 0;

      return t;
    };

    e.getWords = function(t, n, i, o) {
      if ("undefined" == typeof o && (o = !1), o && !t._lineIsTokenized(n)) return e._getWordsInText(t.getLineContent(
        n), e.massageWordDefinitionOf(t.getMode()));
      var r;

      var s;

      var a;

      var u;

      var l;

      var c = [];

      var d = t.getLineContent(n);

      var h = t._getInternalTokens(n);

      var p = t._getLineModeTransitions(n);

      var f = {};
      if (i && (f = e._getNonWordTokenhMap(t)), 0 !== d.length) {
        var g = 0;

        var m = g + 1 < p.length ? p[g + 1].startIndex : Number.MAX_VALUE;

        var v = e.massageWordDefinitionOf(p[g].mode);
        for (r = 0, s = 0, a = h.length; a > r; r++) {
          if (l = r === a - 1 ? d.length : h[r + 1].startIndex, s >= m && (g++, m = g + 1 < p.length ? p[g + 1].startIndex :
            Number.MAX_VALUE, v = e.massageWordDefinitionOf(p[g].mode)), !i || !f.hasOwnProperty(h[r].type)) {
            var y;

            var _ = d.substring(s, l);

            var b = _.match(v) || [];

            var C = 0;
            for (u = 0; u < b.length; u++) {
              var w = b[u].trim();
              w.length > 0 && (y = _.indexOf(w, C), C = y + w.length, c.push({
                start: s + y,
                end: s + C
              }));
            }
          }
          s = l;
        }
      }
      return c;
    };

    e._getWordsInText = function(e, t) {
      var n;

      var i;

      var o;

      var r;

      var s;

      var a;

      var u = e.match(t) || [];

      var l = [];
      for (n = 0; n < u.length; n++) a = u[n].trim();

      a.length > 0 && (i = e.indexOf(a, o), o = i + a.length, r = i, s = o, l.push({
        start: r,
        end: s
      }));
      return l;
    };

    e.getWordAtPosition = function(t, i, o, r) {
      if ("undefined" == typeof r && (r = !1), r && !t._lineIsTokenized(i.lineNumber)) return e._getWordAtText(i.column,
        e.massageWordDefinitionOf(t.getMode()), t.getLineContent(i.lineNumber), 0);
      var s = t._getInternalTokens(i.lineNumber);

      var a = -1;

      var u = -1;
      if (s.length > 0 && (a = n.findIndexInSegmentsArray(s, i.column - 1), a > 0 && s[a].startIndex === i.column - 1 &&
        (u = a - 1)), o && (-1 !== a || -1 !== u)) {
        var l = e._getNonWordTokenhMap(t); - 1 !== a && l.hasOwnProperty(s[a].type) && (a = -1);

        - 1 !== u && l.hasOwnProperty(s[u].type) && (u = -1);
      }
      var c;

      var d = e.massageWordDefinitionOf(t.getModeAtPosition(i.lineNumber, i.column));

      var h = t.getLineContent(i.lineNumber);

      var p = null;
      p || -1 === a || (c = h.substring(s[a].startIndex, a + 1 < s.length ? s[a + 1].startIndex : Number.MAX_VALUE),
        p = e._getWordAtText(i.column, d, c, s[a].startIndex));

      p || -1 === u || (c = h.substring(s[u].startIndex, u + 1 < s.length ? s[u + 1].startIndex : Number.MAX_VALUE),
        p = e._getWordAtText(i.column, d, c, s[u].startIndex));

      return p;
    };

    e._getWordAtText = function(e, t, n, i) {
      var o;

      var r;

      var s;

      var a;

      var u;

      var l;

      var c = n.match(t) || [];
      for (o = 0; o < c.length; o++)
        if (l = c[o].trim(), l.length > 0 && (r = n.indexOf(l, s), s = r + l.length, a = i + r + 1, u = i + s + 1, e >=
          a && u >= e)) return {
          word: l,
          startColumn: a,
          endColumn: u
        };
      return null;
    };

    e._getNonWordTokenhMap = function(e) {
      var t;

      var n;

      var i = e._getNonWordTokenTypes();

      var o = {};
      for (t = 0, n = i.length; n > t; t++) o[i[t]] = !0;
      return o;
    };

    return e;
  }();
  t.WordHelper = s;
  var a = function() {
    function e() {}
    e._sign = function(e) {
      return 0 > e ? -1 : e > 0 ? 1 : 0;
    };

    e._findMatchingBracketUp = function(t, n, i, o, s) {
      var a;

      var u;

      var l;

      var c = s;
      for (a = i; a >= 1; a--) {
        var d = t._getInternalTokens(a);

        var h = t.getLineContent(a);
        for (l = (a === i ? o : d.length) - 1; l >= 0; l--)
          if (d[l].type === n && (c += e._sign(d[l].bracket), 0 === c)) u = l === d.length - 1 ? h.length : d[l + 1].startIndex;

        return new r.Range(a, d[l].startIndex + 1, a, u + 1);
      }
      return null;
    };

    e._findMatchingBracketDown = function(t, n, i, o, s) {
      var a;

      var u;

      var l;

      var c;

      var d;

      var h = 1;
      for (a = i, u = t.getLineCount(); u >= a; a++) {
        if (s && !t._lineIsTokenized(a)) return {
          range: null,
          isAccurate: !1
        };
        var p = t._getInternalTokens(a);

        var f = t.getLineContent(a);
        for (c = a === i ? o + 1 : 0, d = p.length; d > c; c++)
          if (p[c].type === n && (h += e._sign(p[c].bracket), 0 === h)) l = c === p.length - 1 ? f.length : p[c + 1].startIndex;

        return {
          range: new r.Range(a, p[c].startIndex + 1, a, l + 1),
          isAccurate: !0
        };
      }
      return {
        range: null,
        isAccurate: !0
      };
    };

    e.findMatchingBracketUp = function(t, n, i) {
      var o;

      var r;

      var s;

      var a;

      var u = i.column - 1;

      var l = -1;

      var c = t._getInternalTokens(i.lineNumber);

      var d = t.getLineContent(i.lineNumber);
      for (o = 0, r = c.length; - 1 === l && r > o; o++) s = c[o];

      a = o === r - 1 ? d.length : c[o + 1].startIndex;

      s.startIndex <= u && a >= u && (l = o);
      return e._findMatchingBracketUp(t, n, i.lineNumber, l + 1, 0);
    };

    e.matchBracket = function(t, n, i) {
      if (i && !t._lineIsTokenized(n.lineNumber)) return {
        brackets: null,
        isAccurate: !1
      };
      var o;

      var s;

      var a = t.getLineContent(n.lineNumber);

      var u = {
        brackets: null,
        isAccurate: !0
      };
      if (a.length > 0) {
        var l;

        var c;

        var d = n.column - 1;

        var h = t._getInternalTokens(n.lineNumber);
        for (o = 0, s = h.length; null === u.brackets && s > o; o++)
          if (l = h[o], c = o === s - 1 ? a.length : h[o + 1].startIndex, l.startIndex <= d && c >= d) {
            if (l.bracket < 0) {
              var p = e._findMatchingBracketUp(t, l.type, n.lineNumber, o, -1);
              p && (u.brackets = [new r.Range(n.lineNumber, l.startIndex + 1, n.lineNumber, c + 1), p]);
            }
            if (null === u.brackets && l.bracket > 0) {
              var f = e._findMatchingBracketDown(t, l.type, n.lineNumber, o, i);
              u.isAccurate = f.isAccurate;

              f.range && (u.brackets = [new r.Range(n.lineNumber, l.startIndex + 1, n.lineNumber, c + 1), f.range]);
            }
          }
      }
      return u;
    };

    return e;
  }();
  t.BracketsHelper = a;
});