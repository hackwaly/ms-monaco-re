define(["require", "exports"], function(a, b) {
  function c(a, b, c) {
    var d = 0,
      e = a.length - 1;
    while (d <= e) {
      var f = Math.floor((d + e) / 2),
        g = c(a[f], b);
      if (g < 0) d = f + 1;
      else {
        if (!(g > 0)) return f;
        e = f - 1
      }
    }
    return -1
  }

  function d(a) {
    var b = [];
    for (var c = 0, d = a.length; c < d; c++) b.push.apply(b, a[c]);
    return b
  }

  function e(a, b) {
    var c = 0,
      d = a.length - 1,
      e;
    while (c < d) e = c + Math.ceil((d - c) / 2), a[e].startIndex > b ? d = e - 1 : c = e;
    return c
  }
  b.binarySearch = c, b.merge = d, b.findIndexInSegmentsArray = e
})