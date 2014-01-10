define(["require", "exports", "vs/base/dom/mockDom"], function(a, b, c) {
  function g() {
    return f
  }
  var d = c,
    e = function() {
      function a() {
        this.document = window.document, this.window = window
      }
      return a.prototype.mock = function() {
        this.document = new d.MockDocument, this.window = new d.MockWindow
      }, a.prototype.restore = function() {
        this.document = window.document, this.window = window
      }, a
    }(),
    f = new e;
  b.getService = g
})