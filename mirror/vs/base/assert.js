define("vs/base/assert", ["require", "exports"], function(e, t) {
  function n(e, t) {
    if (!e || null === e) throw new Error(t ? "Assertion failed (" + t + ")" : "Assertion Failed");
  }

  function i(e, t, n) {
    if (e !== t || !e || !t) throw new Error(n ? "Assertion failed (" + n + ")" : "Assertion Failed");
  }
  t.ok = n;

  t.equals = i;
});