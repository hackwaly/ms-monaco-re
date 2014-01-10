/*---------------------------------------------------------
 * Copyright (C) Microsoft Corporation. All rights reserved.
 *--------------------------------------------------------*/
"use strict";
define("vs/base/worker/workerProtocol", ["require", "exports"], function(e, r) {
  r.MessageType = {
    INITIALIZE: "$initialize",
    REPLY: "$reply",
    PRINT: "$print"
  }, r.ReplyType = {
    COMPLETE: "complete",
    ERROR: "error",
    PROGRESS: "progress"
  }, r.PrintType = {
    LOG: "log",
    DEBUG: "debug",
    INFO: "info",
    WARN: "warn",
    ERROR: "error"
  }
}), define("vs/base/worker/workerServer", ["require", "exports", "vs/base/worker/workerProtocol"], function(e, r, s) {
  function t(e) {
    var r = {};
    return e.stacktrace ? r.stack = e.stacktrace.split("\n") : e.stack && (r.stack = e.stack.split("\n")), r.message =
      e.toString(), r
  }
  var n = e,
    o = function() {
      function r(e) {
        this._postMessage = e, this._workerId = 0, this._requestHandler = null, this._bindConsole()
      }
      return r.prototype._bindConsole = function() {
        self.console = {
          log: this._sendPrintMessage.bind(this, s.PrintType.LOG),
          debug: this._sendPrintMessage.bind(this, s.PrintType.DEBUG),
          info: this._sendPrintMessage.bind(this, s.PrintType.INFO),
          warn: this._sendPrintMessage.bind(this, s.PrintType.WARN),
          error: this._sendPrintMessage.bind(this, s.PrintType.ERROR)
        }
      }, r.prototype._sendPrintMessage = function(e) {
        for (var r = [], n = 0; n < arguments.length - 1; n++) r[n] = arguments[n + 1];
        var o = r.map(function(e) {
          return e instanceof Error ? t(e) : e
        }),
          i = {
            monacoWorker: !0,
            from: this._workerId,
            type: s.MessageType.PRINT,
            level: e,
            payload: 1 === o.length ? o[0] : o
          };
        this._postMessage(i)
      }, r.prototype._sendReply = function(e, r, n) {
        var o = {
          monacoWorker: !0,
          from: this._workerId,
          id: e,
          type: s.MessageType.REPLY,
          action: r,
          payload: n instanceof Error ? t(n) : n
        };
        this._postMessage(o)
      }, r.prototype.request = function(e, r) {
        if ("$" === e.charAt(0)) throw new Error("Illegal requestName: " + e);
        var s = {
          monacoWorker: !0,
          from: this._workerId,
          type: e,
          payload: r
        };
        this._postMessage(s)
      }, r.prototype.loadModule = function(r, s, t) {
        n.onError = t, e([r], function() {
          for (var e = [], r = 0; r < arguments.length - 0; r++) e[r] = arguments[r + 0];
          s(e[0]), n.onError = null
        })
      }, r.prototype.onmessage = function(e) {
        var r = this,
          t = this._sendReply.bind(this, e.id, s.ReplyType.COMPLETE),
          n = this._sendReply.bind(this, e.id, s.ReplyType.ERROR),
          o = this._sendReply.bind(this, e.id, s.ReplyType.PROGRESS);
        switch (e.type) {
          case s.MessageType.INITIALIZE:
            this._workerId = e.payload.id;
            var i = e.payload.loaderConfiguration;
            i && ("undefined" != typeof i.baseUrl && delete i.baseUrl, self.require.config(i));
            var a = e.payload.MonacoEnvironment;
            a && (self.MonacoEnvironment = a), this.loadModule(e.payload.moduleId, function(e) {
              r._requestHandler = e.value, t()
            }, n);
            break;
          default:
            this._handleMessage(e, t, n, o)
        }
      }, r.prototype._handleMessage = function(e, r, s, n) {
        if (!this._requestHandler) return s("Request handler not loaded"), void 0;
        if (e.type in this._requestHandler && "function" == typeof this._requestHandler[e.type]) try {
          this._requestHandler[e.type].call(this._requestHandler, this, r, s, n, e.payload)
        } catch (o) {
          s(t(o))
        } else this._requestHandler.request(this, r, s, n, e)
      }, r
    }();
  r.WorkerServer = o
});