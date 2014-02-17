define("vs/editor/core/view/viewEventDispatcher", ["require", "exports", "vs/base/eventEmitter"], function(e, t, n) {
  var i = function() {
    function e(e) {
      this.eventHandlerGateKeeper = e;

      this.eventHandlers = [];

      this.eventQueue = [];

      this.isConsumingQueue = !1;
    }
    e.prototype.addEventHandler = function(e) {
      this.eventHandlers.push(e);
    };

    e.prototype.removeEventHandler = function(e) {
      for (var t = 0; t < this.eventHandlers.length; t++)
        if (this.eventHandlers[t] === e) {
          this.eventHandlers.splice(t, 1);
          break;
        }
    };

    e.prototype.emit = function(e, t) {
      this.eventQueue.push(new n.EmitterEvent(e, t));

      this.isConsumingQueue || this.consumeQueue();
    };

    e.prototype.emitMany = function(e) {
      this.eventQueue = this.eventQueue.concat(e);

      this.isConsumingQueue || this.consumeQueue();
    };

    e.prototype.consumeQueue = function() {
      var e = this;
      this.eventHandlerGateKeeper(function() {
        try {
          e.isConsumingQueue = !0;
          for (var t, n, i, o; e.eventQueue.length > 0;)
            for (o = e.eventQueue, e.eventQueue = [], i = e.eventHandlers.slice(0), t = 0, n = i.length; n > t; t++) {
              i[t].handleEvents(o);
            }
        } finally {
          e.isConsumingQueue = !1;
        }
      });
    };

    return e;
  }();
  t.ViewEventDispatcher = i;
});