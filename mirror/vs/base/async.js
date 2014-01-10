var __extends = this.__extends || function(a, b) {
    function d() {
      this.constructor = a
    }
    for (var c in b) b.hasOwnProperty(c) && (a[c] = b[c]);
    d.prototype = b.prototype, a.prototype = new d
  };
define(["require", "exports", "vs/base/errors", "vs/base/lib/winjs.base"], function(a, b, c, d) {
  function j(a, b) {
    return new f.Promise(function(c, d, f) {
      a.done(function(a) {
        try {
          b(a)
        } catch (d) {
          e.onUnexpectedError(d)
        }
        c(a)
      }, function(a) {
        try {
          b(a)
        } catch (c) {
          e.onUnexpectedError(c)
        }
        c(a)
      }, function(a) {
        f(a)
      })
    })
  }
  var e = c,
    f = d,
    g = function() {
      function a() {
        this.activePromise = null, this.queuedPromise = null, this.queuedPromiseFactory = null
      }
      return a.prototype.queue = function(a) {
        var b = this;
        if (this.activePromise) {
          this.queuedPromiseFactory = a;
          if (!this.queuedPromise) {
            var c = function() {
              b.queuedPromise = null;
              var a = b.queue(b.queuedPromiseFactory);
              return b.queuedPromiseFactory = null, a
            };
            this.queuedPromise = this.activePromise.then(c, c)
          }
          return new f.Promise(function(a, c) {
            b.queuedPromise.then(a, c)
          })
        }
        return this.activePromise = a(), this.activePromise.then(function(a) {
          return b.activePromise = null, a
        }, function(a) {
          return b.activePromise = null, f.Promise.wrapError(a)
        })
      }, a
    }();
  b.Throttler = g;
  var h = function() {
    function a(a) {
      this.defaultDelay = a, this.timeoutPromise = null, this.completionPromise = null, this.onSuccess = null, this.task =
        null
    }
    return a.prototype.trigger = function(a, b) {
      typeof b == "undefined" && (b = this.defaultDelay);
      var c = this;
      return this.task = a, this.cancelTimeout(), this.completionPromise || (this.completionPromise = (new f.Promise(
        function(a) {
          c.onSuccess = a
        })).then(function() {
        c.completionPromise = null, c.onSuccess = null;
        var a = c.task();
        return c.task = null, a
      })), this.timeoutPromise = f.Promise.timeout(b), this.timeoutPromise.then(function() {
        c.timeoutPromise = null, c.onSuccess(null)
      }), this.completionPromise
    }, a.prototype.isTriggered = function() {
      return !!this.timeoutPromise
    }, a.prototype.cancel = function() {
      this.cancelTimeout(), this.completionPromise && (this.completionPromise.cancel(), this.completionPromise = null)
    }, a.prototype.cancelTimeout = function() {
      this.timeoutPromise && (this.timeoutPromise.cancel(), this.timeoutPromise = null)
    }, a
  }();
  b.Delayer = h;
  var i = function(a) {
    function b(b) {
      a.call(this, b), this.throttler = new g
    }
    return __extends(b, a), b.prototype.trigger = function(b, c) {
      var d = this;
      return a.prototype.trigger.call(this, function() {
        return d.throttler.queue(b)
      }, c)
    }, b
  }(h);
  b.ThrottledDelayer = i, b.always = j
})