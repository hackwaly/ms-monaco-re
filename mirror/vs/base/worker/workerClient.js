define(["require", "exports", "vs/base/lib/winjs.base", "vs/base/dom/dom", "vs/base/performance/timer"], function(a, b,
  c, d, e) {
  var f = c,
    g = d,
    h = e;
  b.WorkerMain = "workerMain.js";
  var i = function() {
    function c(c, d, e) {
      this.id = c, this.worker = new Worker(a.toUrl("./" + b.WorkerMain + "?" + encodeURIComponent(d))), this.worker.onmessage =
        function(a) {
          e(JSON.parse(a.data))
      }
    }
    return c.prototype.getId = function() {
      return this.id
    }, c.prototype.postMessage = function(a) {
      this.worker.postMessage(JSON.stringify(a))
    }, c.prototype.terminate = function() {
      this.worker.terminate()
    }, c
  }(),
    j = function() {
      function b(b, c) {
        var d = this;
        this.id = b, this._loaded = !1, this._beforeLoadMessages = [], this.iframe = document.createElement("iframe"),
          this.iframe.id = this._iframeId(), this.iframe.src = a.toUrl("./workerMainCompatibility.html"), this.iframe
          .frameborder = this.iframe.height = this.iframe.width = "0", this.iframe.style.display = "none", g.addListener(
            this.iframe, "load", function() {
              return d._onLoaded()
            }), this._onMessage = function(a) {
            var b = null;
            try {
              b = JSON.parse(a.data)
            } catch (d) {}
            b && c(b)
        }, g.addListener(window, "message", this._onMessage), document.body.appendChild(this.iframe)
      }
      return b.prototype._iframeId = function() {
        return "worker_iframe_" + this.id
      }, b.prototype._onLoaded = function() {
        this._loaded = !0;
        while (this._beforeLoadMessages.length > 0) this.postMessage(this._beforeLoadMessages.shift())
      }, b.prototype.getId = function() {
        return this.id
      }, b.prototype.postMessage = function(a) {
        this._loaded === !0 ? window.frames[this._iframeId()].postMessage(JSON.stringify(a), "*") : this._beforeLoadMessages
          .push(a)
      }, b.prototype.terminate = function() {
        window.removeEventListener("message", this._onMessage), window.frames[this._iframeId()].close()
      }, b
    }(),
    k = function() {
      function b(b, c) {
        var d = this;
        this.id = b, this.queuedMessages = [], this.messageHandler = function(a) {
          d.queuedMessages.push(a)
        }, a(["vs/base/worker/workerServer"], function(a) {
          var b = new a.WorkerServer(function(a) {
            c(a)
          });
          while (d.queuedMessages.length > 0) b.onmessage(d.queuedMessages.shift());
          d.messageHandler = function(a) {
            b.onmessage(a)
          }
        })
      }
      return b.prototype.getId = function() {
        return this.id
      }, b.prototype.postMessage = function(a) {
        this.messageHandler(a)
      }, b.prototype.terminate = function() {
        this.queuedMessages = null, this.messageHandler = null
      }, b
    }(),
    l = function() {
      function a(a) {
        this.label = a
      }
      return a.prototype.create = function(a, b) {
        var c = null;
        try {
          c = new i(a, this.label, b)
        } catch (d) {
          c = new j(a, b)
        }
        return c
      }, a
    }();
  b.DefaultWorkerFactory = l;
  var m = function() {
    function a(b, c) {
      var d = this;
      this.lastMessageId = 0, this.promises = {}, this.messageHandlers = {}, this._messagesQueue = [], this._processQueueTimeout = -
        1, this._waitingForWorkerReply = !1, this._lastTimerEvent = null, this.worker = b.create(++a.LAST_WORKER_ID,
          function(a) {
            return d._onmessage(a)
          }), this.onModuleLoaded = this._sendMessage("$initialize", {
          id: this.worker.getId(),
          moduleId: c
        }), this.onModuleLoaded.then(null, function() {
          return d.onError("Worker failed to load " + c)
        })
    }
    return a.prototype.request = function(a, b, c) {
      var d = this;
      if (a.charAt(0) === "$") throw new Error("Illegal requestName: " + a);
      var e = !1,
        g;
      return new f.Promise(function(f, h, i) {
        d.onModuleLoaded.then(function() {
          e || (g = d._sendMessage(a, b, c).then(f, h, i))
        }, h, i)
      }, function() {
        g ? g.cancel() : e = !0
      })
    }, a.prototype.destroy = function() {
      var a = Object.keys(this.promises);
      if (a.length > 0) {
        console.warn("Terminating a worker with " + a.length + " pending promises:"), console.warn(this.promises);
        for (var b in this.promises) a.hasOwnProperty(b) && this.promises[b].error("Worker forcefully terminated")
      }
      this.worker.terminate()
    }, a.prototype.addMessageHandler = function(a, b) {
      this.messageHandlers[a] = b
    }, a.prototype.removeMessageHandler = function(a) {
      delete this.messageHandlers[a]
    }, a.prototype._sendMessage = function(a, b, c) {
      typeof c == "undefined" && (c = (new Date).getTime());
      var d = this,
        e = {
          id: ++this.lastMessageId,
          type: a,
          timestamp: c,
          payload: b
        }, g, h, i, j = new f.Promise(function(a, b, c) {
          g = a, h = b, i = c
        }, function() {
          d._removeMessage(e.id)
        });
      return this.promises[e.id] = {
        complete: g,
        error: h,
        progress: i,
        type: a,
        payload: b
      }, this._enqueueMessage(e), j
    }, a.prototype._enqueueMessage = function(a) {
      var b = -1,
        c;
      for (c = this._messagesQueue.length - 1; c >= 0; c--)
        if (this._messagesQueue[c].timestamp <= a.timestamp) {
          b = c;
          break
        }
      this._messagesQueue.splice(b + 1, 0, a), this._processMessagesQueue()
    }, a.prototype._removeMessage = function(a) {
      for (var b = 0, c = this._messagesQueue.length; b < c; b++)
        if (this._messagesQueue[b].id === a) {
          this.promises.hasOwnProperty(String(a)) && delete this.promises[String(a)], this._messagesQueue.splice(b, 1),
            this._processMessagesQueue();
          return
        }
    }, a.prototype._processMessagesQueue = function() {
      var a = this;
      this._processQueueTimeout !== -1 && (clearTimeout(this._processQueueTimeout), this._processQueueTimeout = -1);
      if (this._messagesQueue.length === 0) return;
      if (this._waitingForWorkerReply) return;
      var b = this._messagesQueue[0].timestamp - (new Date).getTime();
      b = Math.max(0, b), this._processQueueTimeout = setTimeout(function() {
        a._processQueueTimeout = -1;
        if (a._messagesQueue.length === 0) return;
        a._waitingForWorkerReply = !0;
        var b = a._messagesQueue.shift();
        a._lastTimerEvent = h.start(h.Topic.WORKER, a._decodeMessageName(b)), a.worker.postMessage(b)
      }, b)
    }, a.prototype._decodeMessageName = function(a) {
      return a.type
    }, a.prototype._onmessage = function(a) {
      if (!a.monacoWorker) return;
      if (a.from && a.from !== this.worker.getId()) return;
      switch (a.type) {
        case "$reply":
          this._waitingForWorkerReply = !1, this._lastTimerEvent && this._lastTimerEvent.stop();
          if (!this.promises.hasOwnProperty(String(a.id))) {
            this.onError("Received unexpected message from Worker:", a);
            return
          }
          switch (a.action) {
            case "complete":
              this.promises[a.id].complete(a.payload), delete this.promises[a.id];
              break;
            case "error":
              this.onError("Main Thread sent to worker the following message:", {
                type: this.promises[a.id].type,
                payload: this.promises[a.id].payload
              }), this.onError("And the worker replied with an error:", a.payload), this.promises[a.id].error(a.payload),
                delete this.promises[a.id];
              break;
            case "progress":
              this.promises[a.id].progress(a.payload)
          }
          break;
        case "$schedule":
          this._sendMessage("$schedule", {
            scheduleId: a.scheduleId
          }, a.timestamp);
          break;
        case "$print":
          switch (a.level) {
            case "log":
              console.log(a.payload);
              break;
            case "debug":
              console.info(a.payload);
              break;
            case "info":
              console.info(a.payload);
              break;
            case "warn":
              console.warn(a.payload);
              break;
            case "error":
              console.error(a.payload);
              break;
            default:
              this.onError("Received unexpected message from Worker:", a)
          }
          break;
        default:
          if (a.type in this && typeof this[a.type] == "function") this[a.type](a.payload);
          else {
            var b = this.messageHandlers[a.type];
            b && typeof b == "function" ? b(a.payload) : this.onError("Received unexpected message from Worker:", a)
          }
      }
      this._processMessagesQueue()
    }, a.prototype.onError = function(a, b) {
      console.error(a), console.info(b)
    }, a.LAST_WORKER_ID = 1, a
  }();
  b.WorkerClient = m
})