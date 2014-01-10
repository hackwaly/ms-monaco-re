define(["require", "exports", "vs/base/types"], function(a, b, c) {
  function f(a) {
    return a === null || typeof a != "object" ? !1 : typeof a.label != "string" || typeof a.codeSnippet != "string" ||
      typeof a.type != "string" ? !1 : !d.isUndefinedOrNull(a.highlights) && !d.isArray(a.highlights) ? !1 : !d.isUndefinedOrNull(
        a.typeLabel) && typeof a.typeLabel != "string" ? !1 : !d.isUndefinedOrNull(a.documentationLabel) && typeof a.documentationLabel !=
      "string" ? !1 : !0
  }
  var d = c;
  (function(a) {
    a[a.None = 0] = "None", a[a.Open = 1] = "Open", a[a.Close = -1] = "Close"
  })(b.Bracket || (b.Bracket = {}));
  var e = b.Bracket;
  b.isISuggestion = f,
  function(a) {
    a[a.None = 0] = "None", a[a.Indent = 1] = "Indent", a[a.IndentOutdent = 2] = "IndentOutdent"
  }(b.IndentAction || (b.IndentAction = {}));
  var g = b.IndentAction
})