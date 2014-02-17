define('vs/platform/telemetry/telemetryService', [
  'require',
  'exports',
  'vs/base/strings',
  'vs/base/performance/timer',
  'vs/base/errors',
  'vs/base/types',
  'vs/base/env',
  'vs/base/time/idleMonitor',
  'vs/base/network'
], function(e, t, n, i, o, r, s, a, u) {
  var l = function() {
    function e(t, r) {
      'undefined' == typeof t && (t = !0), 'undefined' == typeof r && (r = null), this.eventQueue = [], this.publicOnly =
        t, this.sessionID = n.generateUuid() + Date.now(), this.eventMaxQueueSize = e.EVENT_QUEUE_LIMIT, this.eventBatchSize =
        e.EVENT_BATCH_SIZE, this.failureCount = 0, this.sendingEvents = !1, this.waitIntervalId = null, this.timeKeeper =
        new i.TimeKeeper(), this.toUnbind = [], this.toUnbind.push(this.timeKeeper.addListener('eventStop', this.onTelemetryTimerEventStop
          .bind(this))), this.toUnbind.push(o.errorHandler.addListener(this.onErrorEvent.bind(this))), r || s.isInWebWorker() === !
        1 && (r = new a.IdleMonitor()), this.idleMonitor = r, this.authFilter = u.getBasicAuthRemover();
    }
    return e.prototype.dispose = function() {
      for (; this.toUnbind.length;)
        this.toUnbind.pop()();
      this.timeKeeper.dispose(), this.idleMonitor && this.idleMonitor.dispose(), this.oldOnError && (self.onerror =
        this.oldOnError);
    }, e.prototype.onTelemetryTimerEventStop = function(e) {
      var t = e.data || {};
      t.duration = e.timeTaken(), 'public' === e.topic ? this.publicLog(e.name, t) : this.log(e.name, t);
    }, e.prototype.onErrorEvent = function(e, t, n) {
      'undefined' == typeof t && (t = null), 'undefined' == typeof n && (n = null), this.publicLog('UnhandledError', {
        friendlyMessage: t,
        name: e.name,
        message: e.message || e,
        stack: this.authFilter(e.stack)
      });
    }, e.prototype.enableGlobalErrorHandler = function() {
      r.isFunction(self.onerror) && (this.oldOnError = self.onerror);
      var e = this,
        t = function(t, n, i, o, r) {
          e.onUncaughtError(t, n, i, o, r), e.oldOnError && e.oldOnError.apply(this, arguments);
        };
      self.onerror = t;
    }, e.prototype.onUncaughtError = function(e, t, n, i, o) {
      var r = {
        message: e,
        filename: this.authFilter(t),
        line: n,
        column: i
      };
      o && (r.error = {
        name: o.name,
        message: o.message,
        stack: this.authFilter(o.stack)
      }), this.publicLog('UncaughtError', r);
    }, e.prototype.injectRequestService = function(e) {
      this.requestService = e;
    }, e.prototype.injectExperimentService = function(e) {
      this.experimentService = e;
    }, e.prototype.start = function(e, t, n) {
      var i = n ? 'public' : 'private',
        o = this.timeKeeper.start(i, e);
      return t && (o.data = t), o;
    }, e.prototype.log = function(e, t) {
      this.publicOnly || this.handleEvent('restricted', e, t);
    }, e.prototype.publicLog = function(e, t) {
      this.handleEvent('public', e, t);
    }, e.prototype.handleEvent = function(e, t, n) {
      this.eventQueue.length >= this.eventMaxQueueSize || (n = n || {}, n.source = 'client', n.version = {
        clientVersion: s.version
      }, this.eventQueue.push({
        name: t,
        kind: e,
        timestamp: new Date(),
        data: JSON.stringify(n),
        activeExperiments: this.getEnabledExperiments(),
        sessionID: this.sessionID
      }), this.sendingEvents || this.failureCount > 0 || (this.eventQueue.length > this.eventBatchSize ? (
        clearTimeout(this.waitIntervalId), this.waitIntervalId = null, this.sendEvents()) : this.sendSoon()));
    }, e.prototype.sendSoon = function() {
      var t = this;
      null === this.waitIntervalId && (this.waitIntervalId = setTimeout(function() {
        t.waitIntervalId = null, t.sendEvents();
      }, e.EVENT_INTERVAL * Math.pow(2, this.failureCount)));
    }, e.prototype.sendEvents = function() {
      var e = this;
      if (!this.idleMonitor || 0 !== this.idleMonitor.getStatus()) {
        this.sendingEvents = !0;
        var t = this.eventQueue.splice(0, this.eventBatchSize);
        this.submitToServer(t).then(function() {
          e.failureCount = 0;
        }, function() {
          e.eventQueue.unshift.apply(e.eventQueue, t), e.failureCount++;
        }).done(function() {
          e.sendingEvents = !1, e.eventQueue.length > 0 && e.sendSoon();
        });
      }
    }, e.prototype.submitToServer = function(e) {
      var t = JSON.stringify(e),
        n = this.requestService.getRequestUrl('telemetry'),
        i = {
          type: 'POST',
          url: n,
          data: t,
          headers: {
            'Content-Type': 'application/json'
          }
        };
      return this.requestService.makeRequest(i);
    }, e.prototype.getQueueLength = function() {
      return this.eventQueue.length;
    }, e.prototype.getEnabledExperiments = function() {
      return this.experimentService ? this.experimentService.getEnabled().join(';') : '';
    }, e.EVENT_QUEUE_LIMIT = 10000, e.EVENT_INTERVAL = 30000, e.EVENT_BATCH_SIZE = 100, e;
  }();
  t.TelemetryService = l;
  var c = function() {
    function e() {}
    return e.prototype.log = function() {}, e.prototype.publicLog = function() {}, e.prototype.start = function() {
      return i.nullEvent;
    }, e;
  }();
  t.NullTelemetryService = c, t.nullService = new c();
})