define("vs/base/time/schedulers", ["require", "exports"], function(e, t) {
  var n = function() {
    function e(e, t) {
      this.timeoutToken = -1;

      this.runner = e;

      this.timeout = t;

      this.timeoutHandler = this.onTimeout.bind(this);
    }
    e.prototype.dispose = function() {
      this.cancel();

      this.runner = null;
    };

    e.prototype.cancel = function() {
      if (-1 !== this.timeoutToken) {
        clearTimeout(this.timeoutToken);
        this.timeoutToken = -1;
      }
    };

    e.prototype.setRunner = function(e) {
      this.runner = e;
    };

    e.prototype.setTimeout = function(e) {
      this.timeout = e;
    };

    e.prototype.schedule = function() {
      this.cancel();

      this.timeoutToken = setTimeout(this.timeoutHandler, this.timeout);
    };

    e.prototype.onTimeout = function() {
      this.timeoutToken = -1;

      if (this.runner) {
        this.runner();
      }
    };

    return e;
  }();
  t.RunOnceScheduler = n;
});