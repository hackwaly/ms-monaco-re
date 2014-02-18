define(["require", "exports", "vs/base/time/schedulers", "vs/base/errors"], function(a, b, c, d) {
  var e = c;

  var f = d;

  var g;
  (function(a) {
    a[a.IDLE = 0] = "IDLE";

    a[a.FIRST_WAIT = 1] = "FIRST_WAIT";

    a[a.SECOND_WAIT = 2] = "SECOND_WAIT";

    a[a.WAITING_FOR_ASYNC_COMPUTATION = 3] = "WAITING_FOR_ASYNC_COMPUTATION";
  })(g || (g = {}));
  var h = function() {
    function a(a, b, c, d) {
      var f = this;
      this._computer = a;

      this._state = g.IDLE;

      this._firstWaitScheduler = new e.RunOnceScheduler(function() {
        return f._triggerAsyncComputation();
      }, this._getHoverTimeMillis() / 2);

      this._secondWaitScheduler = new e.RunOnceScheduler(function() {
        return f._triggerSyncComputation();
      }, this._getHoverTimeMillis() / 2);

      this._asyncComputationPromise = null;

      this._asyncComputationPromiseDone = !1;

      this._completeCallback = b;

      this._errorCallback = c;

      this._progressCallback = d;
    }
    a.prototype.getComputer = function() {
      return this._computer;
    };

    a.prototype._getHoverTimeMillis = function() {
      return this._computer.getHoverTimeMillis ? this._computer.getHoverTimeMillis() : a.HOVER_TIME;
    };

    a.prototype._triggerAsyncComputation = function() {
      var a = this;
      this._state = g.SECOND_WAIT;

      this._secondWaitScheduler.schedule();

      if (this._computer.computeAsync) {
        this._asyncComputationPromiseDone = !1;
        this._asyncComputationPromise = this._computer.computeAsync();
        this._asyncComputationPromise.then(function(b) {
          a._asyncComputationPromiseDone = !0;

          a._withAsyncResult(b);
        }).done(null, function() {
          return a._onError;
        });
      } else {
        this._asyncComputationPromiseDone = !0;
      }
    };

    a.prototype._triggerSyncComputation = function() {
      if (this._computer.computeSync) {
        this._computer.onResult(this._computer.computeSync(), !0);
      }

      if (this._asyncComputationPromiseDone) {
        this._state = g.IDLE;
        this._onComplete(this._computer.getResult());
      } else {
        this._state = g.WAITING_FOR_ASYNC_COMPUTATION;
        this._onProgress(this._computer.getResult());
      }
    };

    a.prototype._withAsyncResult = function(a) {
      if (a) {
        this._computer.onResult(a, !1);
      }

      if (this._state === g.WAITING_FOR_ASYNC_COMPUTATION) {
        this._state = g.IDLE;
        this._onComplete(this._computer.getResult());
      }
    };

    a.prototype._onComplete = function(a) {
      if (this._completeCallback) {
        this._completeCallback(a);
      }
    };

    a.prototype._onError = function(a) {
      if (this._errorCallback) {
        this._errorCallback(a);
      } else {
        f.onUnexpectedError(a);
      }
    };

    a.prototype._onProgress = function(a) {
      if (this._progressCallback) {
        this._progressCallback(a);
      }
    };

    a.prototype.start = function() {
      if (this._state === g.IDLE) {
        this._state = g.FIRST_WAIT;
        this._firstWaitScheduler.schedule();
      }
    };

    a.prototype.cancel = function() {
      if (this._state === g.FIRST_WAIT) {
        this._firstWaitScheduler.cancel();
      }

      if (this._state === g.SECOND_WAIT) {
        this._secondWaitScheduler.cancel();
        if (this._asyncComputationPromise) {
          this._asyncComputationPromise.cancel();
        }
      }

      if (this._state === g.WAITING_FOR_ASYNC_COMPUTATION && this._asyncComputationPromise) {
        this._asyncComputationPromise.cancel();
      }

      this._state = g.IDLE;
    };

    a.HOVER_TIME = 300;

    return a;
  }();
  b.HoverOperation = h;
});