define("vs/languages/javascript/jsdoc", ["require", "exports", "vs/editor/modes/modes", "vs/base/strings",
  "vs/base/arrays"
], function(e, t, n, r, i) {
  function o(e, t, n) {
    var i = e[n];
    if ("*" !== i) {
      return null;
    }
    if (e.indexOf("*/", n) > -1) {
      return null;
    }
    for (var o = null, s = 0; s < t.length; s++) {
      var a = t[s];
      if (a.startIndex > n) break;
      o = a;
    }
    return o ? r.startsWith(a.type, "comment.doc") ? "/*" !== e.substring(o.startIndex, n) ? null : {
      appendText: "*/"
    } : null : null;
  }

  function s(e, t, n) {
    var o;

    var s;

    var a = i.findIndexInSegmentsArray(t, n);

    var l = t[a];
    return l ? r.startsWith(l.type, "comment.doc") ? (o = e.indexOf("/**"), s = e.indexOf("*/"), -1 === o && -1 === s ? {
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