define(["require", "exports", "vs/base/lib/winjs.base", "vs/base/types", "vs/base/network"], function(a, b, c, d, e) {
  var f = c;

  var g = d;

  var h = e;

  var i = function() {
    function a() {
      this.table = {};
    }
    a.prototype.register = function(a) {
      if (g.isString(a)) {
        this.table[a] = arguments[1];
      } else
        for (var b in a) {
          var c = a[b];
          g.isFunction(c) && (this.table[b] = c.bind(a));
        }
    };

    a.prototype.dispatch = function(a) {
      if (!this.table[a.type]) {
        return f.Promise.wrapError(new Error("no handler/route for: " + a.type));
      }
      try {
        var b = this.deserialize(a.payload);

        var c = this.table[a.type].apply(this.table[a.type], b);
        return f.Promise.is(c) ? c : f.Promise.as(c);
      } catch (d) {
        return f.Promise.wrapError(d);
      }
    };

    a.prototype.deserialize = function(a) {
      var b = [];
      for (var c = 0; c < a.length; c++) {
        var d = a[c];
        !g.isUndefinedOrNull(d) && g.isString(d.$url) && (d = new h.URL(d.$url));

        b.push(d);
      }
      return b;
    };

    return a;
  }();
  b.DispatcherService = i;
});