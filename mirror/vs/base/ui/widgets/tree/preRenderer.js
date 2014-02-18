define(["require", "exports", "vs/base/dom/builder"], function(a, b, c) {
  var d = c;

  var e = d.$;

  var f = function() {
    function a(a) {
      this.dataSource = a;

      this.cache = {};
    }
    a.prototype.getHeight = function(a, b) {
      var c = this.getKey(a, b);

      var d = this.cache[c] || {};

      var e = document.createElement("div");
      e.className = "pre-render";

      d.cleanupFn = this.renderContents(a, b, e, d.cleanupFn || null);
      var f = a.withFakeRow(function(a) {
        a.appendChild(e);
        var b = a.clientHeight;
        a.removeChild(e);

        return b;
      });
      d.tree = a;

      d.element = b;

      d.container = e;

      this.cache[c] = d;

      return f;
    };

    a.prototype.render = function(a, b, c) {
      var d = this.getKey(a, b);

      var e = this.cache[d];
      if (!e) throw new Error("Binding not found.");
      c.appendChild(e.container);

      return this.cleanup.bind(this, a, b);
    };

    a.prototype.cleanup = function(a, b) {
      var c = this.getKey(a, b);
      this.cleanupBinding(this.cache[c]);

      delete this.cache[c];
    };

    a.prototype.cleanupBinding = function(a) {
      if (a) {
        if (a.cleanupFn) {
          a.cleanupFn(a.tree, a.element);
          delete a.cleanupFn;
        }
        if (a.container) {
          delete a.container;
        }
        delete a.tree;
        delete a.element;
      }
    };

    a.prototype.renderContents = function(a, b, c, d) {
      throw new Error("Implement me.");
    };

    a.prototype.getKey = function(a, b) {
      return this.dataSource.getId(a, b);
    };

    a.prototype.dispose = function() {
      var a = this;
      if (this.cache) {
        Object.keys(this.cache).forEach(function(b) {
          a.cleanupBinding(a.cache[b]);

          delete a.cache[b];
        });
        delete this.cache;
      }
    };

    a.BINDING = "monaco-tree-actionsRenderer";

    return a;
  }();
  b.PreRenderer = f;
});