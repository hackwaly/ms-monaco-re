define('vs/base/performance/timer', [
  'require',
  'exports',
  'vs/base/env',
  'vs/base/eventEmitter',
  'vs/nls!vs/editor/worker/editorWorkerServer'
], function(e, t, n, i, o) {
  function r(e, t) {
    return d.start(e, t);
  }

  function s() {
    return d;
  }
  var a = !! self.msWriteProfilerMark;
  ! function(e) {
    e[e.EDITOR = 0] = 'EDITOR', e[e.LANGUAGES = 1] = 'LANGUAGES', e[e.WORKER = 2] = 'WORKER', e[e.WORKBENCH = 3] =
      'WORKBENCH';
  }(t.Topic || (t.Topic = {}));
  var u = (t.Topic, function() {
    function e() {}
    return e.prototype.start = function() {
      return this;
    }, e.prototype.stop = function() {}, e.prototype.timeTaken = function() {
      return -1;
    }, e;
  }());
  t.NullTimerEvent = u;
  var l = function() {
    function e(e, t, n, i) {
      if (this.timeKeeper = e, this.name = t, this.topic = n, this.stopTime = null, i)
        return this.startTime = i, void 0;
      if (this.startTime = new Date().getTime(), a) {
        var o = [
          'Monaco',
          this.topic,
          this.name,
          'start'
        ];
        self.msWriteProfilerMark(o.join('|'));
      }
    }
    return e.prototype.start = function(e) {
      if (this.stopTime)
        throw new Error(o.localize('vs_base_performance_timer', 0));
      return this.timeKeeper.start(this.topic, this.name + '.' + e);
    }, e.prototype.stop = function(e) {
      if (null === this.stopTime) {
        if (e)
          return this.stopTime = e, void 0;
        if (this.stopTime = new Date().getTime(), this.timeKeeper.emit('eventStop', this), a) {
          var t = [
            'Monaco',
            this.topic,
            this.name,
            'stop'
          ];
          self.msWriteProfilerMark(t.join('|'));
        }
      }
    }, e.prototype.timeTaken = function() {
      return this.stopTime ? this.stopTime - this.startTime : -1;
    }, e;
  }();
  t.TimerEvent = l;
  var c = function(e) {
    function i() {
      e.call(this), this.timeoutId = null, this.collectedEvents = [], this.eventCacheLimit = 1000, this.maxTimerLength =
        60000, this.cleanupInterval = 120000;
    }
    return __extends(i, e), i.prototype.enabled = function() {
      return n.enablePerformanceEvents;
    }, i.prototype.start = function(e, n) {
      if (this.enabled() === !1)
        return t.nullEvent;
      0 === e ? e = 'Editor' : 1 === e ? e = 'Languages' : 2 === e ? e = 'Worker' : 3 === e && (e = 'Workbench');
      var i = new l(this, n, e);
      return this.addEvent(i), this.cleanupTimers(), i;
    }, i.prototype.addEvent = function(e) {
      e.id = i.EVENT_ID, i.EVENT_ID++, this.collectedEvents.push(e), this.emit('eventStart', e), this.collectedEvents
        .length > this.eventCacheLimit && this.collectedEvents.shift();
    }, i.prototype.cleanupTimers = function() {
      var e = this;
      null === this.timeoutId && (this.timeoutId = setTimeout(function() {
        var t = Date.now();
        e.collectedEvents.forEach(function(n) {
          !n.stopTime && t - n.startTime >= e.maxTimerLength && n.stop();
        });
      }, this.cleanupInterval));
    }, i.prototype.dispose = function() {
      clearTimeout(this.timeoutId), e.prototype.dispose.call(this);
    }, i.prototype.getCollectedEvents = function() {
      return this.collectedEvents.slice(0);
    }, i.prototype.clearCollectedEvents = function() {
      this.collectedEvents = [];
    }, i.prototype.setInitialCollectedEvents = function(e, t) {
      var n = this;
      this.enabled() !== !1 && (t && (i.PARSE_TIME = t), e.forEach(function(e) {
        var t = new l(n, e.name, e.topic, e.startTime);
        t.stop(e.stopTime), n.addEvent(t);
      }));
    }, i.EVENT_ID = 1, i.PARSE_TIME = new Date().getTime(), i;
  }(i.EventEmitter);
  t.TimeKeeper = c;
  var d = new c();
  t.nullEvent = new u(), t.start = r, t.getTimeKeeper = s;
})