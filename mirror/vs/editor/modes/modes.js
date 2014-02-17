define('vs/editor/modes/modes', [
  'require',
  'exports',
  'vs/base/types'
], function(e, t, n) {
  function i(e) {
    return null === e || 'object' != typeof e ? !1 : 'string' != typeof e.label || 'string' != typeof e.codeSnippet ||
      'string' != typeof e.type ? !1 : n.isUndefinedOrNull(e.highlights) || n.isArray(e.highlights) ? n.isUndefinedOrNull(
        e.typeLabel) || 'string' == typeof e.typeLabel ? n.isUndefinedOrNull(e.documentationLabel) || 'string' ==
      typeof e.documentationLabel ? !0 : !1 : !1 : !1;
  }! function(e) {
    e[e.None = 0] = 'None', e[e.Open = 1] = 'Open', e[e.Close = -1] = 'Close';
  }(t.Bracket || (t.Bracket = {}));
  t.Bracket;
  t.isISuggestion = i,
  function(e) {
    e[e.None = 0] = 'None', e[e.Indent = 1] = 'Indent', e[e.IndentOutdent = 2] = 'IndentOutdent';
  }(t.IndentAction || (t.IndentAction = {}));
  t.IndentAction;
})