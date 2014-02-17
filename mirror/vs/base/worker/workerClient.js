define("vs/base/worker/workerClient", ["require", "exports", "vs/base/lib/winjs.base", "vs/base/dom/dom",
  "vs/base/performance/timer", "vs/base/errors", "vs/base/worker/workerProtocol", "vs/base/env"
], function(e, t, n, i, o, r, s, a) {
  function u(t, n) {
    return e.toUrl("./" + t + "?" + encodeURIComponent(n));
  }
  t.WorkerMain = "workerMain.js";
  var l = a.getCrossOriginWorkerScriptUrl || u;

  var c = function() {
    function e(e, n, i) {
      this.id = e;

      this.worker = new Worker(l(t.WorkerMain, n));

      this.worker.onmessage = function(e) {
        i(JSON.parse(e.data));
      };
    }
    e.prototype.getId = function() {
      return this.id;
    };

    e.prototype.postMessage = function(e) {
      this.worker.postMessage(JSON.stringify(e));
    };

    e.prototype.terminate = function() {
      this.worker.terminate();
    };

    return e;
  }();

  var d = function() {
    function t(t, n) {
      var o = this;
      this.id = t;

      this.loaded = !1;

      this.beforeLoadMessages = [];

      this.iframe = document.createElement("iframe");

      this.iframe.id = this.iframeId();

      this.iframe.src = e.toUrl("./workerMainCompatibility.html");

      this.iframe.frameborder = this.iframe.height = this.iframe.width = "0";

      this.iframe.style.display = "none";

      i.addListener(this.iframe, "load", function() {
        return o.onLoaded();
      });

      this.onMessage = function(e) {
        var t = null;
        try {
          t = JSON.parse(e.data);
        } catch (i) {}
        t && n(t);
      };

      i.addListener(window, "message", this.onMessage);

      document.body.appendChild(this.iframe);
    }
    t.prototype.iframeId = function() {
      return "worker_iframe_" + this.id;
    };

    t.prototype.onLoaded = function() {
      for (this.loaded = !0; this.beforeLoadMessages.length > 0;) {
        this.postMessage(this.beforeLoadMessages.shift());
      }
    };

    t.prototype.getId = function() {
      return this.id;
    };

    t.prototype.postMessage = function(e) {
      this.loaded === !0 ? window.frames[this.iframeId()].postMessage(JSON.stringify(e), "*") : this.beforeLoadMessages
        .push(e);
    };

    t.prototype.terminate = function() {
      window.removeEventListener("message", this.onMessage);

      window.frames[this.iframeId()].close();
    };

    return t;
  }();

  var h = function() {
    function e(e) {
      this.label = e;
    }
    e.prototype.create = function(e, t) {
      var n = null;
      try {
        n = new c(e, this.label, t);
      } catch (i) {
        n = new d(e, t);
      }
      return n;
    };

    return e;
  }();
  t.DefaultWorkerFactory = h;
  var p = function() {
    function e(t, n) {
      var i = this;
      this._lastMessageId = 0;

      this._promises = {};

      this._messageHandlers = {};

      this._messagesQueue = [];

      this._processQueueTimeout = -1;

      this._waitingForWorkerReply = !1;

      this._lastTimerEvent = null;

      this._worker = t.create(++e.LAST_WORKER_ID, function(e) {
        return i._onmessage(e);
      });
      var o = null;

      var r = window.require;
      "function" == typeof r.getConfig ? o = r.getConfig() : "undefined" != typeof window.requirejs && (o = window.requirejs
        .s.contexts._.config);
      var a = window.MonacoEnvironment || null;
      this.onModuleLoaded = this._sendMessage(s.MessageType.INITIALIZE, {
        id: this._worker.getId(),
        moduleId: n,
        loaderConfiguration: o,
        MonacoEnvironment: a
      });

      this.onModuleLoaded.then(null, function() {
        return i._onError("Worker failed to load " + n);
      });
    }
    e.prototype.request = function(e, t, i) {
      var o = this;
      if ("$" === e.charAt(0)) throw new Error("Illegal requestName: " + e);
      var r;

      var s = !1;
      return new n.Promise(function(n, a, u) {
        o.onModuleLoaded.then(function() {
          s || (r = o._sendMessage(e, t, i).then(n, a, u));
        }, a, u);
      }, function() {
        r ? r.cancel() : s = !0;
      });
    };

    e.prototype.destroy = function() {
      this.dispose();
    };

    e.prototype.dispose = function() {
      var e = Object.keys(this._promises);
      if (e.length > 0) {
        console.warn("Terminating a worker with " + e.length + " pending promises:");

        console.warn(this._promises);
        for (var t in this._promises) {
          e.hasOwnProperty(t) && this._promises[t].error("Worker forcefully terminated");
        }
      }
      this._worker.terminate();
    };

    e.prototype.addMessageHandler = function(e, t) {
      this._messageHandlers[e] = t;
    };

    e.prototype.removeMessageHandler = function(e) {
      delete this._messageHandlers[e];
    };

    e.prototype._sendMessage = function(e, t, i) {
      "undefined" == typeof i && (i = (new Date).getTime());
      var o;

      var r;

      var s;

      var a = this;

      var u = {
        id: ++this._lastMessageId,
        type: e,
        timestamp: i,
        payload: t
      };

      var l = new n.Promise(function(e, t, n) {
        o = e;

        r = t;

        s = n;
      }, function() {
        a._removeMessage(u.id);
      });
      this._promises[u.id] = {
        complete: o,
        error: r,
        progress: s,
        type: e,
        payload: t
      };

      this._enqueueMessage(u);

      return l;
    };

    e.prototype._enqueueMessage = function(e) {
      var t;

      var n = -1;
      for (t = this._messagesQueue.length - 1; t >= 0; t--)
        if (this._messagesQueue[t].timestamp <= e.timestamp) {
          n = t;
          break;
        }
      this._messagesQueue.splice(n + 1, 0, e);

      this._processMessagesQueue();
    };

    e.prototype._removeMessage = function(e) {
      for (var t = 0, n = this._messagesQueue.length; n > t; t++)
        if (this._messagesQueue[t].id === e) {
          this._promises.hasOwnProperty(String(e)) && delete this._promises[String(e)];
          this._messagesQueue.splice(t, 1);
          this._processMessagesQueue();
          return void 0;
        }
    };

    e.prototype._processMessagesQueue = function() {
      var e = this;
      if (-1 !== this._processQueueTimeout && (clearTimeout(this._processQueueTimeout), this._processQueueTimeout = -
        1), 0 !== this._messagesQueue.length && !this._waitingForWorkerReply) {
        var t = this._messagesQueue[0].timestamp - (new Date).getTime();
        t = Math.max(0, t);

        this._processQueueTimeout = setTimeout(function() {
          if (e._processQueueTimeout = -1, 0 !== e._messagesQueue.length) {
            e._waitingForWorkerReply = !0;
            var t = e._messagesQueue.shift();
            e._lastTimerEvent = o.start(2, e.decodeMessageName(t));

            e._worker.postMessage(t);
          }
        }, t);
      }
    };

    e.prototype.decodeMessageName = function(e) {
      return e.type;
    };

    e.prototype._onmessage = function(e) {
      if (e.monacoWorker && (!e.from || e.from === this._worker.getId())) {
        switch (e.type) {
          case s.MessageType.REPLY:
            var t = e;
            if (this._waitingForWorkerReply = !1, this._lastTimerEvent && this._lastTimerEvent.stop(), !this._promises
              .hasOwnProperty(String(t.id))) {
              this._onError("Received unexpected message from Worker:", e);
              return void 0;
            }
            switch (t.action) {
              case s.ReplyType.COMPLETE:
                this._promises[t.id].complete(t.payload);

                delete this._promises[t.id];
                break;
              case s.ReplyType.ERROR:
                this._onError("Main Thread sent to worker the following message:", {
                  type: this._promises[t.id].type,
                  payload: this._promises[t.id].payload
                });

                this._onError("And the worker replied with an error:", t.payload);

                r.onUnexpectedError(t.payload);

                this._promises[t.id].error(t.payload);

                delete this._promises[t.id];
                break;
              case s.ReplyType.PROGRESS:
                this._promises[t.id].progress(t.payload);
            }
            break;
          case s.MessageType.PRINT:
            var n = e;
            switch (n.level) {
              case s.PrintType.LOG:
                console.log(n.payload);
                break;
              case s.PrintType.DEBUG:
                console.info(n.payload);
                break;
              case s.PrintType.INFO:
                console.info(n.payload);
                break;
              case s.PrintType.WARN:
                console.warn(n.payload);
                break;
              case s.PrintType.ERROR:
                console.error(n.payload);
                break;
              default:
                this._onError("Received unexpected message from Worker:", n);
            }
            break;
          default:
            if (e.type in this && "function" == typeof this[e.type]) {
              this[e.type](e.payload);
            } else {
              var i = this._messageHandlers[e.type];
              i && "function" == typeof i ? i(e.payload) : this._onError("Received unexpected message from Worker:",
                e);
            }
        }
        this._processMessagesQueue();
      }
    };

    e.prototype._onError = function(e, t) {
      console.error(e);

      console.info(t);
    };

    e.LAST_WORKER_ID = 1;

    return e;
  }();
  t.WorkerClient = p;
});