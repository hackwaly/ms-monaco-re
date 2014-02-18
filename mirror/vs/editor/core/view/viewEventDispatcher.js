define(["require", "exports", "vs/base/eventEmitter"], function(a, b, c) {
  var d = c;

  var e = function() {
    function a(a) {
      this.eventHandlerGateKeeper = a;

      this.eventHandlers = [];

      this.eventQueue = [];

      this.isConsumingQueue = !1;
    }
    a.prototype.addEventHandler = function(a) {
      this.eventHandlers.push(a);
    };

    a.prototype.removeEventHandler = function(a) {
      for (var b = 0; b < this.eventHandlers.length; b++)
        if (this.eventHandlers[b] === a) {
          this.eventHandlers.splice(b, 1);
          break;
        }
    };

    a.prototype.emit = function(a, b) {
      this.eventQueue.push(new d.EmitterEvent(a, b));

      if (!this.isConsumingQueue) {
        this.consumeQueue();
      }
    };

    a.prototype.emitMany = function(a) {
      this.eventQueue = this.eventQueue.concat(a);

      if (!this.isConsumingQueue) {
        this.consumeQueue();
      }
    };

    a.prototype.consumeQueue = function() {
      var a = this;
      this.eventHandlerGateKeeper(function() {
        try {
          a.isConsumingQueue = !0;
          var b;

          var c;

          var d;

          var e;
          while (a.eventQueue.length > 0) {
            e = a.eventQueue;

            a.eventQueue = [];

            d = a.eventHandlers.slice(0);
            for (b = 0, c = d.length; b < c; b++) {
              d[b].handleEvents(e);
            }
          }
        } finally {
          a.isConsumingQueue = !1;
        }
      });
    };

    return a;
  }();
  b.ViewEventDispatcher = e;
});