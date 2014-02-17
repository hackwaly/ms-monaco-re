define("vs/languages/javascript/jsdoc", ["require", "exports", "vs/editor/modes/modes", "vs/base/strings",
  "vs/base/arrays"
], function(e, t, n, i, r) {
  function o(e, t, n) {
    var r = e[n];
    if ("*" !== r) return null;
    if (e.indexOf("*/", n) > -1) return null;
    for (var o = null, s = 0; s < t.length; s++) {
      var a = t[s];
      if (a.startIndex > n) break;
      o = a;
    }
    return o ? i.startsWith(a.type, "comment.doc") ? "/*" !== e.substring(o.startIndex, n) ? null : {
      appendText: "*/"
    } : null : null;
  }

  function s(e, t, n) {
    var o;

    var s;

    var a = r.findIndexInSegmentsArray(t, n);

    var u = t[a];
    return u ? i.startsWith(u.type, "comment.doc") ? (o = e.indexOf("/**"), s = e.indexOf("*/"), -1 === o && -1 === s ? {
      indentAction: 0,
      appendText: "* "
    } : -1 !== o && n >= o + 3 && -1 !== s && s >= n ? {
      indentAction: 2,
      appendText: " * ",
      indentOutdentAppendText: " "
    } : -1 !== o && n >= o + 3 ? {
      indentAction: 0,
      appendText: " * "
    } : null) : null : null;
  }
  t.onElectricCharacter = o;

  t.onEnter = s;
});