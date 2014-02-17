define("vs/editor/contrib/hover/hoverOperation", ["require", "exports", "vs/base/time/schedulers", "vs/base/errors"],
  function(e, t, n, i) {
    var o;
    ! function(e) {
      e[e.IDLE = 0] = "IDLE";

      e[e.FIRST_WAIT = 1] = "FIRST_WAIT";

      e[e.SECOND_WAIT = 2] = "SECOND_WAIT";

      e[e.WAITING_FOR_ASYNC_COMPUTATION = 3] = "WAITING_FOR_ASYNC_COMPUTATION";
    }(o || (o = {}));
    var r = function() {
      function e(e, t, i, o) {
        var r = this;
        this._computer = e;

        this._state = 0;

        this._firstWaitScheduler = new n.RunOnceScheduler(function() {
          return r._triggerAsyncComputation();
        }, this._getHoverTimeMillis() / 2);

        this._secondWaitScheduler = new n.RunOnceScheduler(function() {
          return r._triggerSyncComputation();
        }, this._getHoverTimeMillis() / 2);

        this._asyncComputationPromise = null;

        this._asyncComputationPromiseDone = !1;

        this._completeCallback = t;

        this._errorCallback = i;

        this._progressCallback = o;
      }
      e.prototype.getComputer = function() {
        return this._computer;
      };

      e.prototype._getHoverTimeMillis = function() {
        return this._computer.getHoverTimeMillis ? this._computer.getHoverTimeMillis() : e.HOVER_TIME;
      };

      e.prototype._triggerAsyncComputation = function() {
        var e = this;
        this._state = 2;

        this._secondWaitScheduler.schedule();

        if (this._computer.computeAsync) {
          this._asyncComputationPromiseDone = !1;
          this._asyncComputationPromise = this._computer.computeAsync();
          this._asyncComputationPromise.then(function(t) {
            e._asyncComputationPromiseDone = !0;

            e._withAsyncResult(t);
          }).done(null, function() {
            return e._onError;
          });
        } else {
          this._asyncComputationPromiseDone = !0;
        }
      };

      e.prototype._triggerSyncComputation = function() {
        if (this._computer.computeSync) {
          this._computer.onResult(this._computer.computeSync(), !0);
        }

        if (this._asyncComputationPromiseDone) {
          this._state = 0;
          this._onComplete(this._computer.getResult());
        } else {
          this._state = 3;
          this._onProgress(this._computer.getResult());
        }
      };

      e.prototype._withAsyncResult = function(e) {
        if (e) {
          this._computer.onResult(e, !1);
        }

        if (3 === this._state) {
          this._state = 0;
          this._onComplete(this._computer.getResult());
        }
      };

      e.prototype._onComplete = function(e) {
        if (this._completeCallback) {
          this._completeCallback(e);
        }
      };

      e.prototype._onError = function(e) {
        if (this._errorCallback) {
          this._errorCallback(e);
        } else {
          i.onUnexpectedError(e);
        }
      };

      e.prototype._onProgress = function(e) {
        if (this._progressCallback) {
          this._progressCallback(e);
        }
      };

      e.prototype.start = function() {
        if (0 === this._state) {
          this._state = 1;
          this._firstWaitScheduler.schedule();
        }
      };

      e.prototype.cancel = function() {
        if (1 === this._state) {
          this._firstWaitScheduler.cancel();
        }

        if (2 === this._state) {
          this._secondWaitScheduler.cancel();
          if (this._asyncComputationPromise) {
            this._asyncComputationPromise.cancel();
          }
        }

        if (3 === this._state && this._asyncComputationPromise) {
          this._asyncComputationPromise.cancel();
        }

        this._state = 0;
      };

      e.HOVER_TIME = 300;

      return e;
    }();
    t.HoverOperation = r;
  });