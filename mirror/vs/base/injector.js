define(["require", "exports", "vs/base/assert", "vs/base/types", "vs/base/strings"], function(a, b, c, d, e) {
  function l(a) {
    var b = {};

    var c = a.prototype || a;
    while (c !== null) {
      var d = Object.keys(c);
      for (var e = 0, f = d.length; e < f; e++) {
        if (h.startsWith(d[e], i)) {
          b[d[e].substr(j, 1).toLocaleLowerCase() + d[e].substring(j + 1)] = !0;
        }
      }
      c = Object.getPrototypeOf(c);
    }
    return Object.keys(b);
  }
  var f = c;

  var g = d;

  var h = e;

  var i = "inject";

  var j = i.length;

  var k = function() {
    function a() {
      this.map = {};

      this.parent = null;
    }
    a.prototype.setParent = function(a) {
      this.parent = a;
    };

    a.prototype.registerService = function(a, b) {
      f.ok(!g.isUndefinedOrNull(a));

      f.ok(!g.isUndefinedOrNull(b));

      this.map[a.toLowerCase()] = b;

      return b;
    };

    a.prototype.injectTo = function(a) {
      var b = this;
      f.ok(!g.isUndefinedOrNull(a));
      if (g.isArray(a)) {
        a.forEach(function(a) {
          b.injectTo(a);
        });
        return;
      }
      for (var c in a) {
        if (c.indexOf(i) !== 0) continue;
        var d = a[c];
        if (!g.isFunction(d)) continue;
        c = c.substring(j).toLowerCase();
        var e = this.findService(c, a);
        if (g.isUndefinedOrNull(e)) continue;
        d.apply(a, [e]);
      }
    };

    a.prototype.createChild = function() {
      var b = new a;
      b.setParent(this);

      return b;
    };

    a.prototype.findService = function(a, b) {
      if (typeof b == "undefined") {
        b = null;
      }
      var c = this.map[a];
      (g.isUndefinedOrNull(c) || b === c) && this.parent !== null && (c = this.parent.findService(a, b));

      return c;
    };

    a.prototype.dispose = function() {
      this.map = null;

      this.parent = null;
    };

    return a;
  }();
  b.Container = k;

  b.computeInjectionDependencies = l;
});