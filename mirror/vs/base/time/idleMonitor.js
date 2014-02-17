define("vs/base/time/idleMonitor", ["require", "exports", "vs/base/dom/dom", "vs/base/lifecycle",
  "vs/base/eventEmitter"
], function(e, t, n, i, o) {
  ! function(e) {
    e[e.Idle = 0] = "Idle";

    e[e.Active = 1] = "Active";
  }(t.UserStatus || (t.UserStatus = {}));
  t.UserStatus;
  t.IDLE_TIME = 36e5;
  var r = function() {
    function e() {
      a.INSTANCE.increment();
    }
    e.prototype.addOneTimeActiveListener = function(e) {
      return a.INSTANCE.addOneTimeActiveListener(e);
    };

    e.prototype.addOneTimeIdleListener = function(e) {
      return a.INSTANCE.addOneTimeIdleListener(e);
    };

    e.prototype.getStatus = function() {
      return a.INSTANCE.getStatus();
    };

    e.prototype.dispose = function() {
      a.INSTANCE.decrement();
    };

    return e;
  }();
  t.IdleMonitor = r;
  var s = function() {
    function e() {
      this.referenceCount = 0;
    }
    e.prototype.increment = function() {
      0 === this.referenceCount && this.construct();

      this.referenceCount++;
    };

    e.prototype.decrement = function() {
      this.referenceCount > 0 && (this.referenceCount--, 0 === this.referenceCount && this.dispose());
    };

    e.prototype.construct = function() {
      throw new Error("Implement me");
    };

    e.prototype.dispose = function() {
      throw new Error("Implement me");
    };

    return e;
  }();

  var a = function(e) {
    function r() {
      e.apply(this, arguments);
    }
    __extends(r, e);

    r.prototype.construct = function() {
      var e = this;
      this.status = null;

      this.idleCheckTimeout = -1;

      this.toDispose = [];

      this.eventEmitter = new o.EventEmitter;

      this.toDispose.push(this.eventEmitter);

      this.toDispose.push(n.addDisposableListener(document, "mousemove", function() {
        return e.onUserActive();
      }));

      this.toDispose.push(n.addDisposableListener(document, "keydown", function() {
        return e.onUserActive();
      }));

      this.onUserActive();
    };

    r.prototype.dispose = function() {
      this.toDispose = i.disposeAll(this.toDispose);

      this.cancelIdleCheck();
    };

    r.prototype.getStatus = function() {
      return this.status;
    };

    r.prototype.addOneTimeActiveListener = function(e) {
      return this.eventEmitter.addOneTimeDisposableListener("onActive", e);
    };

    r.prototype.addOneTimeIdleListener = function(e) {
      return this.eventEmitter.addOneTimeDisposableListener("onIdle", e);
    };

    r.prototype.onUserActive = function() {
      this.lastActiveTime = (new Date).getTime();

      1 !== this.status && (this.status = 1, this.scheduleIdleCheck(), this.eventEmitter.emit("onActive"));
    };

    r.prototype.onUserIdle = function() {
      0 !== this.status && (this.status = 0, this.eventEmitter.emit("onIdle"));
    };

    r.prototype.scheduleIdleCheck = function() {
      var e = this;
      if (-1 === this.idleCheckTimeout) {
        var n = this.lastActiveTime + t.IDLE_TIME;
        this.idleCheckTimeout = setTimeout(function() {
          e.idleCheckTimeout = -1;

          e.checkIfUserIsIdle();
        }, n - (new Date).getTime());
      }
    };

    r.prototype.cancelIdleCheck = function() {
      -1 !== this.idleCheckTimeout && (clearTimeout(this.idleCheckTimeout), this.idleCheckTimeout = -1);
    };

    r.prototype.checkIfUserIsIdle = function() {
      var e = (new Date).getTime() - this.lastActiveTime;
      e >= t.IDLE_TIME ? this.onUserIdle() : this.scheduleIdleCheck();
    };

    r.INSTANCE = new r;

    return r;
  }(s);
});