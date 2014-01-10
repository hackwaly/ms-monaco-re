define(["require", "exports", "vs/editor/modes/modes", "vs/base/strings", "vs/base/arrays"], function(a, b, c, d, e) {
  function i(a, b, c) {
    var d = a[c];
    if (d !== "*") return null;
    if (a.indexOf("*/", c) > -1) return null;
    var e = null;
    for (var f = 0; f < b.length; f++) {
      var h = b[f];
      if (h.startIndex > c) break;
      e = h
    }
    return e ? g.startsWith(h.type, "comment.doc") ? a.substring(e.startIndex, c) !== "/*" ? null : {
      appendText: "*/"
    } : null : null
  }

  function j(a, b, c) {
    var d = h.findIndexInSegmentsArray(b, c),
      e = b[d],
      i, j;
    return e ? g.startsWith(e.type, "comment.doc") ? (i = a.indexOf("/**"), j = a.indexOf("*/"), i === -1 && j === -1 ? {
      indentAction: f.IndentAction.None,
      appendText: "* "
    } : i !== -1 && i + 3 <= c && j !== -1 && c <= j ? {
      indentAction: f.IndentAction.IndentOutdent,
      appendText: " * ",
      indentOutdentAppendText: " "
    } : i !== -1 && i + 3 <= c ? {
      indentAction: f.IndentAction.None,
      appendText: " * "
    } : null) : null : null
  }
  var f = c,
    g = d,
    h = e;
  b.onElectricCharacter = i, b.onEnter = j
})