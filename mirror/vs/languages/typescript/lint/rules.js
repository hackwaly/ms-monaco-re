define('vs/languages/typescript/lint/rules', [
  'require',
  'exports',
  'vs/languages/typescript/lib/typescriptServices'
], function(e, t) {
  ! function(e) {
    function t(e) {
      for (var t = [], n = 0; n < arguments.length - 1; n++)
        t[n] = arguments[n + 1];
      for (var r = e.kind(), i = 0, o = t.length; o > i; i++)
        if (r === t[i])
          return !0;
      return !1;
    }

    function n(e) {
      var t = e.fullText(),
        n = e.leadingTriviaWidth(),
        r = e.trailingTriviaWidth();
      return 0 === n && 0 === r ? t : t.substr(n, t.length - (n + r));
    }
    e.isOfKind = t, e.text = n;
  }(t.syntaxHelper || (t.syntaxHelper = {}));
  t.syntaxHelper;
})