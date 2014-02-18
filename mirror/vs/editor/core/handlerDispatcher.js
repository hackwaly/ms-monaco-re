define(["require", "exports"], function(a, b) {
  var c = function() {
    function a(a, b) {
      this.source = a;

      this.data = b;
    }
    a.prototype.getSource = function() {
      return this.source;
    };

    a.prototype.getData = function() {
      return this.data;
    };

    return a;
  }();
  b.DispatcherEvent = c;
  var d = function() {
    function a() {
      this.registry = {};
    }
    a.prototype.setHandler = function(a, b) {
      this.registry[a] = b;
    };

    a.prototype.clearHandlers = function() {
      this.registry = {};
    };

    a.prototype.getHandler = function(a) {
      return this.registry.hasOwnProperty(a) ? this.registry[a] : null;
    };

    a.prototype.trigger = function(a, b, d) {
      var e = this.getHandler(b);

      var f = !1;
      if (e) {
        var g = new c(a, d);
        f = e(g);
      }
      return f;
    };

    return a;
  }();
  b.HandlerDispatcher = d;
});