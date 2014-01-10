define(["require", "exports", "vs/base/time/schedulers", "vs/base/errors"], function(a, b, c, d) {
  var e = c,
    f = d,
    g;
  (function(a) {
    a[a.IDLE = 0] = "IDLE", a[a.FIRST_WAIT = 1] = "FIRST_WAIT", a[a.SECOND_WAIT = 2] = "SECOND_WAIT", a[a.WAITING_FOR_ASYNC_COMPUTATION =
      3] = "WAITING_FOR_ASYNC_COMPUTATION"
  })(g || (g = {}));
  var h = function() {
    function a(a, b, c, d) {
      var f = this;
      this._computer = a, this._state = g.IDLE, this._firstWaitScheduler = new e.RunOnceScheduler(function() {
        return f._triggerAsyncComputation()
      }, this._getHoverTimeMillis() / 2), this._secondWaitScheduler = new e.RunOnceScheduler(function() {
        return f._triggerSyncComputation()
      }, this._getHoverTimeMillis() / 2), this._asyncComputationPromise = null, this._asyncComputationPromiseDone = !
        1, this._completeCallback = b, this._errorCallback = c, this._progressCallback = d
    }
    return a.prototype.getComputer = function() {
      return this._computer
    }, a.prototype._getHoverTimeMillis = function() {
      return this._computer.getHoverTimeMillis ? this._computer.getHoverTimeMillis() : a.HOVER_TIME
    }, a.prototype._triggerAsyncComputation = function() {
      var a = this;
      this._state = g.SECOND_WAIT, this._secondWaitScheduler.schedule(), this._computer.computeAsync ? (this._asyncComputationPromiseDone = !
        1, this._asyncComputationPromise = this._computer.computeAsync(), this._asyncComputationPromise.then(function(
          b) {
          a._asyncComputationPromiseDone = !0, a._withAsyncResult(b)
        }).done(null, function() {
          return a._onError
        })) : this._asyncComputationPromiseDone = !0
    }, a.prototype._triggerSyncComputation = function() {
      this._computer.computeSync && this._computer.onResult(this._computer.computeSync(), !0), this._asyncComputationPromiseDone ?
        (this._state = g.IDLE, this._onComplete(this._computer.getResult())) : (this._state = g.WAITING_FOR_ASYNC_COMPUTATION,
        this._onProgress(this._computer.getResult()))
    }, a.prototype._withAsyncResult = function(a) {
      a && this._computer.onResult(a, !1), this._state === g.WAITING_FOR_ASYNC_COMPUTATION && (this._state = g.IDLE,
        this._onComplete(this._computer.getResult()))
    }, a.prototype._onComplete = function(a) {
      this._completeCallback && this._completeCallback(a)
    }, a.prototype._onError = function(a) {
      this._errorCallback ? this._errorCallback(a) : f.onUnexpectedError(a)
    }, a.prototype._onProgress = function(a) {
      this._progressCallback && this._progressCallback(a)
    }, a.prototype.start = function() {
      this._state === g.IDLE && (this._state = g.FIRST_WAIT, this._firstWaitScheduler.schedule())
    }, a.prototype.cancel = function() {
      this._state === g.FIRST_WAIT && this._firstWaitScheduler.cancel(), this._state === g.SECOND_WAIT && (this._secondWaitScheduler
        .cancel(), this._asyncComputationPromise && this._asyncComputationPromise.cancel()), this._state === g.WAITING_FOR_ASYNC_COMPUTATION &&
        this._asyncComputationPromise && this._asyncComputationPromise.cancel(), this._state = g.IDLE
    }, a.HOVER_TIME = 300, a
  }();
  b.HoverOperation = h
})