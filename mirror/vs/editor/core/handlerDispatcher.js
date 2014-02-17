define("vs/editor/core/handlerDispatcher", ["require", "exports"], function(e, t) {
  var n = function() {
    function e(e, t) {
      this.source = e;

      this.data = t;
    }
    e.prototype.getSource = function() {
      return this.source;
    };

    e.prototype.getData = function() {
      return this.data;
    };

    return e;
  }();
  t.DispatcherEvent = n;
  var i = function() {
    function e() {
      this.registry = {};
    }
    e.prototype.setHandler = function(e, t) {
      this.registry[e] = t;
    };

    e.prototype.clearHandlers = function() {
      this.registry = {};
    };

    e.prototype.getHandler = function(e) {
      return this.registry.hasOwnProperty(e) ? this.registry[e] : null;
    };

    e.prototype.trigger = function(e, t, i) {
      var o = this.getHandler(t);

      var r = !1;
      if (o) {
        var s = new n(e, i);
        r = o(s);
      }
      return r;
    };

    return e;
  }();
  t.HandlerDispatcher = i;
});