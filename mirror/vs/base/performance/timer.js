var __extends = this.__extends || function(a, b) {
    function d() {
      this.constructor = a
    }
    for (var c in b) b.hasOwnProperty(c) && (a[c] = b[c]);
    d.prototype = b.prototype, a.prototype = new d
  };
define(["require", "exports", "vs/base/env", "vs/base/eventEmitter", "vs/nls"], function(a, b, c, d, e) {
  function o(a, b) {
    return n.start(a, b)
  }

  function p() {
    return n
  }
  var f = c,
    g = d,
    h = e,
    i = !! self.msWriteProfilerMark;
  (function(a) {
    a[a.EDITOR = 0] = "EDITOR", a[a.LANGUAGES = 1] = "LANGUAGES", a[a.WORKER = 2] = "WORKER", a[a.WORKBENCH = 3] =
      "WORKBENCH"
  })(b.Topic || (b.Topic = {}));
  var j = b.Topic,
    k = function() {
      function a() {}
      return a.prototype.start = function(a) {
        return this
      }, a.prototype.stop = function() {
        return
      }, a.prototype.timeTaken = function() {
        return -1
      }, a
    }();
  b.NullTimerEvent = k;
  var l = function() {
    function a(a, b, c, d) {
      this.timeKeeper = a, this.name = b, this.topic = c, this.stopTime = null;
      if (d) {
        this.startTime = d;
        return
      }
      this.startTime = (new Date).getTime();
      if (i) {
        var e = ["Monaco", this.topic, this.name, "start"];
        self.msWriteProfilerMark(e.join("|"))
      }
    }
    return a.prototype.start = function(a) {
      if (this.stopTime) throw new Error(h.localize("startAfterStopError",
        "Cannot start a new timer from a stopped one."));
      return this.timeKeeper.start(this.topic, this.name + "." + a)
    }, a.prototype.stop = function(a) {
      if (this.stopTime !== null) return;
      if (a) {
        this.stopTime = a;
        return
      }
      this.stopTime = (new Date).getTime(), this.timeKeeper.emit("eventStop", this);
      if (i) {
        var b = ["Monaco", this.topic, this.name, "stop"];
        self.msWriteProfilerMark(b.join("|"))
      }
    }, a.prototype.timeTaken = function() {
      return this.stopTime ? this.stopTime - this.startTime : -1
    }, a
  }();
  b.TimerEvent = l;
  var m = function(a) {
    function c() {
      a.call(this), this.timeoutId = null, this.collectedEvents = [], this.eventCacheLimit = 1e3, this.maxTimerLength =
        6e4, this.cleanupInterval = 12e4
    }
    return __extends(c, a), c.prototype.enabled = function() {
      return f.enablePerformanceEvents
    }, c.prototype.start = function(a, c) {
      if (this.enabled() === !1) return b.nullEvent;
      a === j.EDITOR ? a = "Editor" : a === j.LANGUAGES ? a = "Languages" : a === j.WORKER ? a = "Worker" : a === j.WORKBENCH &&
        (a = "Workbench");
      var d = new l(this, c, a);
      return this.addEvent(d), this.cleanupTimers(), d
    }, c.prototype.addEvent = function(a) {
      a.id = c.EVENT_ID, c.EVENT_ID++, this.collectedEvents.push(a), this.emit("eventStart", a), this.collectedEvents
        .length > this.eventCacheLimit && this.collectedEvents.shift()
    }, c.prototype.cleanupTimers = function() {
      var a = this;
      this.timeoutId === null && (this.timeoutId = setTimeout(function() {
        var b = Date.now();
        a.collectedEvents.forEach(function(c) {
          !c.stopTime && b - c.startTime >= a.maxTimerLength && c.stop()
        })
      }, this.cleanupInterval))
    }, c.prototype.dispose = function() {
      clearTimeout(this.timeoutId), a.prototype.dispose.call(this)
    }, c.prototype.getCollectedEvents = function() {
      return this.collectedEvents.slice(0)
    }, c.prototype.clearCollectedEvents = function() {
      this.collectedEvents = []
    }, c.prototype.setInitialCollectedEvents = function(a, b) {
      var d = this;
      if (this.enabled() === !1) return;
      b && (c.PARSE_TIME = b), a.forEach(function(a) {
        var b = new l(d, a.name, a.topic, a.startTime);
        b.stop(a.stopTime), d.addEvent(b)
      })
    }, c.EVENT_ID = 1, c.PARSE_TIME = (new Date).getTime(), c
  }(g.EventEmitter);
  b.TimeKeeper = m;
  var n = new m;
  b.nullEvent = new k, b.start = o, b.getTimeKeeper = p
})