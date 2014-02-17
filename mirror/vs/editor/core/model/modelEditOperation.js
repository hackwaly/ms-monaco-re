define("vs/editor/core/model/modelEditOperation", ["require", "exports", "vs/editor/core/range"], function(e, t, n) {
  var i = function() {
    function e() {}
    e.execute = function(t, n) {
      var i = t.change(function(i) {
        return e._apply(t, i, n.operations);
      });
      return {
        operations: i
      };
    };

    e._apply = function(t, n, i) {
      i.sort(e._compareOperations);
      for (var o = 1; o < i.length; o++)
        if (i[o - 1].range.getStartPosition().isBeforeOrEqual(i[o].range.getEndPosition())) throw new Error(
          "Overlapping ranges are not allowed!");
      var r = t.getEditableRange();

      var s = r.getStartPosition();

      var a = r.getEndPosition();
      for (o = 0; o < i.length; o++) {
        var u = i[o].range;
        if (!s.isBeforeOrEqual(u.getStartPosition()) || !u.getEndPosition().isBeforeOrEqual(a)) throw new Error(
          "Editing outside of editable range not allowed!");
      }
      var l = e._applyWithMarkers(t, n, i);

      var c = e._squashMarkers(t, l);
      for (c.sort(e._compareOperations), o = 1; o < c.length; o++)
        if (c[o - 1].range.getStartPosition().isBeforeOrEqual(c[o].range.getEndPosition())) throw new Error(
          "Inverse edit operations: Overlapping ranges are not allowed!");
      return c;
    };

    e._squashMarkers = function(e, t) {
      var i;

      var o;

      var r;

      var s;

      var a;

      var u;

      var l;

      var c;

      var d = [];
      for (i = 0, o = t.length; o > i; i++) c = t[i].identifier;

      a = t[i].text;

      r = t[i].selectionStartMarkerId;

      s = t[i].positionMarkerId;

      u = e._getMarker(r);

      l = e._getMarker(s);

      d.push({
        identifier: c,
        range: new n.Range(u.lineNumber, u.column, l.lineNumber, l.column),
        text: a
      });

      e._removeMarker(r);

      e._removeMarker(s);
      return d;
    };

    e._applyWithMarkers = function(e, t, n) {
      var i;

      var o;

      var r;

      var s;

      var a;

      var u;

      var l;

      var c;

      var d;

      var h;

      var p = [];
      for (i = 0, o = n.length; o > i; i++) h = n[i].identifier;

      s = n[i].range;

      r = n[i].text;

      s.isEmpty() && !r ? (d = {
        startLineNumber: 1,
        startColumn: 1,
        endLineNumber: 1,
        endColumn: 1
      }, c = "") : (s.isEmpty() ? (c = "", a = {
        lineNumber: s.startLineNumber,
        column: s.startColumn
      }) : (l = t.deleteText(s), c = l.deletedText, a = l.position), r ? (u = t.insertText(a, r), d = {
        startLineNumber: a.lineNumber,
        startColumn: a.column,
        endLineNumber: u.lineNumber,
        endColumn: u.column
      }) : d = {
        startLineNumber: a.lineNumber,
        startColumn: a.column,
        endLineNumber: a.lineNumber,
        endColumn: a.column
      });

      p.push({
        identifier: h,
        text: c,
        selectionStartMarkerId: e._addMarker(d.startLineNumber, d.startColumn, !0),
        positionMarkerId: e._addMarker(d.endLineNumber, d.endColumn, !1)
      });
      return p;
    };

    e._compareOperations = function(e, t) {
      return -n.compareRangesUsingEnds(e.range, t.range);
    };

    return e;
  }();
  t.ModelEditOperation = i;
});