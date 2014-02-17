define("vs/base/dom/browserService", ["require", "exports", "vs/base/dom/mockDom"], function(e, t, n) {
  function i() {
    return r;
  }
  var o = function() {
    function e() {
      this.document = window.document;

      this.window = window;
    }
    e.prototype.mock = function() {
      this.document = new n.MockDocument;

      this.window = new n.MockWindow;
    };

    e.prototype.restore = function() {
      this.document = window.document;

      this.window = window;
    };

    return e;
  }();

  var r = new o;
  t.getService = i;
});