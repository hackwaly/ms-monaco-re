define(["require", "exports", "vs/base/dom/builder"], function(a, b, c) {
  var d = c,
    e = d.$,
    f = function() {
      function a(a) {
        this.dataSource = a, this.cache = {}
      }
      return a.prototype.getHeight = function(a, b) {
        var c = this.getKey(a, b),
          d = this.cache[c] || {}, e = document.createElement("div");
        e.className = "pre-render", d.cleanupFn = this.renderContents(a, b, e, d.cleanupFn || null);
        var f = a.withFakeRow(function(a) {
          a.appendChild(e);
          var b = a.clientHeight;
          return a.removeChild(e), b
        });
        return d.tree = a, d.element = b, d.container = e, this.cache[c] = d, f
      }, a.prototype.render = function(a, b, c) {
        var d = this.getKey(a, b),
          e = this.cache[d];
        if (!e) throw new Error("Binding not found.");
        return c.appendChild(e.container), this.cleanup.bind(this, a, b)
      }, a.prototype.cleanup = function(a, b) {
        var c = this.getKey(a, b);
        this.cleanupBinding(this.cache[c]), delete this.cache[c]
      }, a.prototype.cleanupBinding = function(a) {
        a && (a.cleanupFn && (a.cleanupFn(a.tree, a.element), delete a.cleanupFn), a.container && delete a.container,
          delete a.tree, delete a.element)
      }, a.prototype.renderContents = function(a, b, c, d) {
        throw new Error("Implement me.")
      }, a.prototype.getKey = function(a, b) {
        return this.dataSource.getId(a, b)
      }, a.prototype.dispose = function() {
        var a = this;
        this.cache && (Object.keys(this.cache).forEach(function(b) {
          a.cleanupBinding(a.cache[b]), delete a.cache[b]
        }), delete this.cache)
      }, a.BINDING = "monaco-tree-actionsRenderer", a
    }();
  b.PreRenderer = f
})