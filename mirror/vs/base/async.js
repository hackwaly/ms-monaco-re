define("vs/base/async", ["require", "exports", "vs/base/errors", "vs/base/lib/winjs.base"], function(e, t, n, i) {
  function o(e, t) {
    return new i.Promise(function(i, o, r) {
      e.done(function(e) {
        try {
          t(e);
        } catch (o) {
          n.onUnexpectedError(o);
        }
        i(e);
      }, function(e) {
        try {
          t(e);
        } catch (i) {
          n.onUnexpectedError(i);
        }
        o(e);
      }, function(e) {
        r(e);
      });
    }, function() {
      e.cancel();
    });
  }

  function r(e) {
    function t() {
      return e.length ? e.pop()() : null;
    }

    function n(e) {
      e && o.push(e);
      var r = t();
      return r ? r.then(n) : i.Promise.as(o);
    }
    var o = [];
    e = e.reverse();

    return i.Promise.as(null).then(n);
  }

  function s(e) {
    var t;

    var n = this;

    var i = !1;
    return function() {
      return i ? t : (i = !0, t = e.apply(n, arguments));
    };
  }
  var a = function() {
    function e() {
      this.activePromise = null;

      this.queuedPromise = null;

      this.queuedPromiseFactory = null;
    }
    e.prototype.queue = function(e) {
      var t = this;
      if (this.activePromise) {
        if (this.queuedPromiseFactory = e, !this.queuedPromise) {
          var n = function() {
            t.queuedPromise = null;
            var e = t.queue(t.queuedPromiseFactory);
            t.queuedPromiseFactory = null;

            return e;
          };
          this.queuedPromise = this.activePromise.then(n, n);
        }
        return new i.Promise(function(e, n) {
          t.queuedPromise.then(e, n);
        }, function() {});
      }
      this.activePromise = e();

      return this.activePromise.then(function(e) {
        t.activePromise = null;

        return e;
      }, function(e) {
        t.activePromise = null;

        return i.Promise.wrapError(e);
      });
    };

    return e;
  }();
  t.Throttler = a;
  var u = function() {
    function e(e) {
      this.defaultDelay = e;

      this.timeoutPromise = null;

      this.completionPromise = null;

      this.onSuccess = null;

      this.task = null;
    }
    e.prototype.trigger = function(e, t) {
      "undefined" == typeof t && (t = this.defaultDelay);
      var n = this;
      this.task = e;

      this.cancelTimeout();

      this.completionPromise || (this.completionPromise = (new i.Promise(function(e) {
        n.onSuccess = e;
      }, function() {})).then(function() {
        n.completionPromise = null;

        n.onSuccess = null;
        var e = n.task();
        n.task = null;

        return e;
      }));

      this.timeoutPromise = i.Promise.timeout(t);

      this.timeoutPromise.then(function() {
        n.timeoutPromise = null;

        n.onSuccess(null);
      });

      return this.completionPromise;
    };

    e.prototype.isTriggered = function() {
      return !!this.timeoutPromise;
    };

    e.prototype.cancel = function() {
      this.cancelTimeout();

      this.completionPromise && (this.completionPromise.cancel(), this.completionPromise = null);
    };

    e.prototype.cancelTimeout = function() {
      this.timeoutPromise && (this.timeoutPromise.cancel(), this.timeoutPromise = null);
    };

    return e;
  }();
  t.Delayer = u;
  var l = function(e) {
    function t(t) {
      e.call(this, t);

      this.throttler = new a;
    }
    __extends(t, e);

    t.prototype.trigger = function(t, n) {
      var i = this;
      return e.prototype.trigger.call(this, function() {
        return i.throttler.queue(t);
      }, n);
    };

    return t;
  }(u);
  t.ThrottledDelayer = l;

  t.always = o;

  t.sequence = r;

  t.once = s;
});