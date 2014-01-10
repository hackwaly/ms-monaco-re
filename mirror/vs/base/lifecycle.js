define(["require", "exports"], function(a, b) {
  function c(a) {
    for (var b = 0, c = a.length; b < c; b++) a[b].dispose();
    return []
  }

  function d() {
    var a = [];
    for (var c = 0; c < arguments.length - 0; c++) a[c] = arguments[c + 0];
    return {
      dispose: function() {
        return b.disposeAll(a)
      }
    }
  }

  function e(a) {
    while (a.length > 0) a.pop()()
  }
  b.disposeAll = c, b.combinedDispose = d, b.cAll = e
})