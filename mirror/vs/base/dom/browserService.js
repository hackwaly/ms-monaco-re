define(["require", "exports", "vs/base/dom/mockDom"], function(a, b, c) {
  function g() {
    return f;
  }
  var d = c;

  var e = function() {
    function a() {
      this.document = window.document;

      this.window = window;
    }
    a.prototype.mock = function() {
      this.document = new d.MockDocument;

      this.window = new d.MockWindow;
    };

    a.prototype.restore = function() {
      this.document = window.document;

      this.window = window;
    };

    return a;
  }();

  var f = new e;
  b.getService = g;
});