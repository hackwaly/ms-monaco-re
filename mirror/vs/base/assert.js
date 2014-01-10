define(["require", "exports", "vs/base/strings"], function(a, b, c) {
  function e(a, b) {
    if (!a || a === null) throw new Error(b ? d.format("Assertion failed ({0})", b) : "Assertion Failed")
  }

  function f(a, b, c) {
    if (a !== b || !a || !b) throw new Error(c ? d.format("Assertion failed ({0})", c) : "Assertion Failed")
  }
  var d = c;
  b.ok = e, b.equals = f
})