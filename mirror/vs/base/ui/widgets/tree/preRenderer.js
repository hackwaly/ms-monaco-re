define("vs/base/ui/widgets/tree/preRenderer", ["require", "exports", "vs/base/dom/builder"], function(e, t, n) {
  var i = (n.$, function() {
    function e(e) {
      this.dataSource = e;

      this.cache = {};
    }
    e.prototype.getHeight = function(e, t) {
      var n = this.getKey(e, t);

      var i = this.cache[n] || {};

      var o = document.createElement("div");
      o.className = "pre-render";

      i.cleanupFn = this.renderContents(e, t, o, i.cleanupFn || null);
      var r = e.withFakeRow(function(e) {
        e.appendChild(o);
        var t = e.clientHeight;
        e.removeChild(o);

        return t;
      });
      i.tree = e;

      i.element = t;

      i.container = o;

      this.cache[n] = i;

      return r;
    };

    e.prototype.render = function(e, t, n) {
      var i = this.getKey(e, t);

      var o = this.cache[i];
      if (!o) throw new Error("Binding not found.");
      n.appendChild(o.container);

      return this.cleanup.bind(this, e, t);
    };

    e.prototype.cleanup = function(e, t) {
      var n = this.getKey(e, t);
      this.cleanupBinding(this.cache[n]);

      delete this.cache[n];
    };

    e.prototype.cleanupBinding = function(e) {
      if (e) {
        if (e.cleanupFn) {
          e.cleanupFn(e.tree, e.element);
          delete e.cleanupFn;
        }
        if (e.container) {
          delete e.container;
        }
        delete e.tree;
        delete e.element;
      }
    };

    e.prototype.renderContents = function() {
      throw new Error("Implement me.");
    };

    e.prototype.getKey = function(e, t) {
      return this.dataSource.getId(e, t);
    };

    e.prototype.dispose = function() {
      var e = this;
      if (this.cache) {
        Object.keys(this.cache).forEach(function(t) {
          e.cleanupBinding(e.cache[t]);

          delete e.cache[t];
        });
        delete this.cache;
      }
    };

    e.BINDING = "monaco-tree-actionsRenderer";

    return e;
  }());
  t.PreRenderer = i;
});