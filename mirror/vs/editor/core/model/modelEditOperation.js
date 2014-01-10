define(["require", "exports", "vs/editor/core/range"], function(a, b, c) {
  var d = c,
    e = function() {
      function a() {}
      return a.execute = function(b, c) {
        var d = b.change(function(d) {
          return a._apply(b, d, c.operations)
        });
        return {
          operations: d
        }
      }, a._apply = function(b, c, d) {
        d.sort(a._compareOperations);
        for (var e = 1; e < d.length; e++)
          if (d[e - 1].range.getStartPosition().isBeforeOrEqual(d[e].range.getEndPosition())) throw new Error(
            "Overlapping ranges are not allowed!");
        var f = b.getEditableRange(),
          g = f.getStartPosition(),
          h = f.getEndPosition();
        for (e = 0; e < d.length; e++) {
          var i = d[e].range;
          if (!g.isBeforeOrEqual(i.getStartPosition()) || !i.getEndPosition().isBeforeOrEqual(h)) throw new Error(
            "Editing outside of editable range not allowed!")
        }
        var j = a._applyWithMarkers(b, c, d),
          k = a._squashMarkers(b, j);
        k.sort(a._compareOperations);
        for (e = 1; e < k.length; e++)
          if (k[e - 1].range.getStartPosition().isBeforeOrEqual(k[e].range.getEndPosition())) throw new Error(
            "Inverse edit operations: Overlapping ranges are not allowed!");
        return k
      }, a._squashMarkers = function(a, b) {
        var c, e, f = [],
          g, h, i, j, k, l;
        for (c = 0, e = b.length; c < e; c++) l = b[c].identifier, i = b[c].text, g = b[c].selectionStartMarkerId, h =
          b[c].positionMarkerId, j = a._getMarker(g), k = a._getMarker(h), f.push({
            identifier: l,
            range: new d.Range(j.lineNumber, j.column, k.lineNumber, k.column),
            text: i
          }), a._removeMarker(g), a._removeMarker(h);
        return f
      }, a._applyWithMarkers = function(a, b, c) {
        var d = [],
          e, f, g, h, i, j, k, l, m, n;
        for (e = 0, f = c.length; e < f; e++) n = c[e].identifier, h = c[e].range, g = c[e].text, h.isEmpty() && !g ?
          (m = {
          startLineNumber: 1,
          startColumn: 1,
          endLineNumber: 1,
          endColumn: 1
        }, l = "") : (h.isEmpty() ? (l = "", i = {
          lineNumber: h.startLineNumber,
          column: h.startColumn
        }) : (k = b.deleteText(h), l = k.deletedText, i = k.position), g ? (j = b.insertText(i, g), m = {
          startLineNumber: i.lineNumber,
          startColumn: i.column,
          endLineNumber: j.lineNumber,
          endColumn: j.column
        }) : m = {
          startLineNumber: i.lineNumber,
          startColumn: i.column,
          endLineNumber: i.lineNumber,
          endColumn: i.column
        }), d.push({
          identifier: n,
          text: l,
          selectionStartMarkerId: a._addMarker(m.startLineNumber - 1, m.startColumn, "start"),
          positionMarkerId: a._addMarker(m.endLineNumber - 1, m.endColumn, "end")
        });
        return d
      }, a._compareOperations = function(a, b) {
        return -d.RangeUtils.compareRangesUsingEnds(a.range, b.range)
      }, a
    }();
  b.ModelEditOperation = e
})