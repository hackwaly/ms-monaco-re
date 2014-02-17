define("vs/base/lifecycle", ["require", "exports"], function(e, t) {
  function n(e) {
    for (var t = 0, n = e.length; n > t; t++) e[t] && e[t].dispose();
    return [];
  }

  function i() {
    for (var e = [], n = 0; n < arguments.length - 0; n++) e[n] = arguments[n + 0];
    return {
      dispose: function() {
        return t.disposeAll(e);
      }
    };
  }

  function o(e) {
    for (; e.length > 0;) e.pop()();
    return e;
  }
  t.disposeAll = n;

  t.combinedDispose = i;

  t.cAll = o;
});