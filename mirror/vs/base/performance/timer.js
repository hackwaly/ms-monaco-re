define("vs/base/performance/timer", ["require", "exports", "vs/base/env", "vs/base/eventEmitter",
  "vs/nls!vs/editor/worker/editorWorkerServer"
], function(e, t, n, i, o) {
  function r(e, t) {
    return d.start(e, t);
  }

  function s() {
    return d;
  }
  var a = !! self.msWriteProfilerMark;
  ! function(e) {
    e[e.EDITOR = 0] = "EDITOR";

    e[e.LANGUAGES = 1] = "LANGUAGES";

    e[e.WORKER = 2] = "WORKER";

    e[e.WORKBENCH = 3] = "WORKBENCH";
  }(t.Topic || (t.Topic = {}));
  var u = (t.Topic, function() {
    function e() {}
    e.prototype.start = function() {
      return this;
    };

    e.prototype.stop = function() {};

    e.prototype.timeTaken = function() {
      return -1;
    };

    return e;
  }());
  t.NullTimerEvent = u;
  var l = function() {
    function e(e, t, n, i) {
      if (this.timeKeeper = e, this.name = t, this.topic = n, this.stopTime = null, i) {
        this.startTime = i;
        return void 0;
      }
      if (this.startTime = (new Date).getTime(), a) {
        var o = ["Monaco", this.topic, this.name, "start"];
        self.msWriteProfilerMark(o.join("|"));
      }
    }
    e.prototype.start = function(e) {
      if (this.stopTime) throw new Error(o.localize("vs_base_performance_timer", 0));
      return this.timeKeeper.start(this.topic, this.name + "." + e);
    };

    e.prototype.stop = function(e) {
      if (null === this.stopTime) {
        if (e) {
          this.stopTime = e;
          return void 0;
        }
        if (this.stopTime = (new Date).getTime(), this.timeKeeper.emit("eventStop", this), a) {
          var t = ["Monaco", this.topic, this.name, "stop"];
          self.msWriteProfilerMark(t.join("|"));
        }
      }
    };

    e.prototype.timeTaken = function() {
      return this.stopTime ? this.stopTime - this.startTime : -1;
    };

    return e;
  }();
  t.TimerEvent = l;
  var c = function(e) {
    function i() {
      e.call(this);

      this.timeoutId = null;

      this.collectedEvents = [];

      this.eventCacheLimit = 1e3;

      this.maxTimerLength = 6e4;

      this.cleanupInterval = 12e4;
    }
    __extends(i, e);

    i.prototype.enabled = function() {
      return n.enablePerformanceEvents;
    };

    i.prototype.start = function(e, n) {
      if (this.enabled() === !1) {
        return t.nullEvent;
      }
      0 === e ? e = "Editor" : 1 === e ? e = "Languages" : 2 === e ? e = "Worker" : 3 === e && (e = "Workbench");
      var i = new l(this, n, e);
      this.addEvent(i);

      this.cleanupTimers();

      return i;
    };

    i.prototype.addEvent = function(e) {
      e.id = i.EVENT_ID;

      i.EVENT_ID++;

      this.collectedEvents.push(e);

      this.emit("eventStart", e);

      if (this.collectedEvents.length > this.eventCacheLimit) {
        this.collectedEvents.shift();
      }
    };

    i.prototype.cleanupTimers = function() {
      var e = this;
      if (null === this.timeoutId) {
        this.timeoutId = setTimeout(function() {
          var t = Date.now();
          e.collectedEvents.forEach(function(n) {
            if (!n.stopTime && t - n.startTime >= e.maxTimerLength) {
              n.stop();
            }
          });
        }, this.cleanupInterval);
      }
    };

    i.prototype.dispose = function() {
      clearTimeout(this.timeoutId);

      e.prototype.dispose.call(this);
    };

    i.prototype.getCollectedEvents = function() {
      return this.collectedEvents.slice(0);
    };

    i.prototype.clearCollectedEvents = function() {
      this.collectedEvents = [];
    };

    i.prototype.setInitialCollectedEvents = function(e, t) {
      var n = this;
      if (this.enabled() !== !1) {
        if (t) {
          i.PARSE_TIME = t;
        }
        e.forEach(function(e) {
          var t = new l(n, e.name, e.topic, e.startTime);
          t.stop(e.stopTime);

          n.addEvent(t);
        });
      }
    };

    i.EVENT_ID = 1;

    i.PARSE_TIME = (new Date).getTime();

    return i;
  }(i.EventEmitter);
  t.TimeKeeper = c;
  var d = new c;
  t.nullEvent = new u;

  t.start = r;

  t.getTimeKeeper = s;
});