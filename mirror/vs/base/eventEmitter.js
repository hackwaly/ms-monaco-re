define("vs/base/eventEmitter", ["require", "exports", "vs/base/errors"], function(e, t, n) {
  var i = function() {
    function e(e, t, n) {
      if ("undefined" == typeof n) {
        n = null;
      }

      this._type = e;

      this._data = t;

      this._emitterType = n;
    }
    e.prototype.getType = function() {
      return this._type;
    };

    e.prototype.getData = function() {
      return this._data;
    };

    e.prototype.getEmitterType = function() {
      return this._emitterType;
    };

    return e;
  }();
  t.EmitterEvent = i;
  var o = function() {
    function e(e) {
      if ("undefined" == typeof e && (e = null), this._listeners = {}, this._bulkListeners = [], this._collectedEvents = [],
        this._deferredCnt = 0, e) {
        this._allowedEventTypes = {};
        for (var t = 0; t < e.length; t++) {
          this._allowedEventTypes[e[t]] = !0;
        }
      } else {
        this._allowedEventTypes = null;
      }
    }
    e.prototype.dispose = function() {
      this._listeners = {};

      this._bulkListeners = [];

      this._collectedEvents = [];

      this._deferredCnt = 0;

      this._allowedEventTypes = null;
    };

    e.prototype.addListener = function(e, t) {
      if ("*" === e) throw new Error("Use addBulkListener(listener) to register your listener!");
      if (this._allowedEventTypes && !this._allowedEventTypes.hasOwnProperty(e)) throw new Error(
        "This object will never emit this event type!");
      if (this._listeners.hasOwnProperty(e)) {
        this._listeners[e].push(t);
      }

      {
        this._listeners[e] = [t];
      }
      var n = this;
      return function() {
        if (n) {
          n._removeListener(e, t);
          n = null;
          t = null;
        }
      };
    };

    e.prototype.addListener2 = function(e, t) {
      var n = this.addListener(e, t);
      return {
        dispose: n
      };
    };

    e.prototype.on = function(e, t) {
      return this.addListener(e, t);
    };

    e.prototype.addOneTimeListener = function(e, t) {
      var n = this.addListener(e, function(e) {
        n();

        t(e);
      });
      return n;
    };

    e.prototype.addOneTimeDisposableListener = function(e, t) {
      var n = this.addOneTimeListener(e, t);
      return {
        dispose: n
      };
    };

    e.prototype.addBulkListener = function(e) {
      var t = this;
      this._bulkListeners.push(e);

      return function() {
        t._removeBulkListener(e);
      };
    };

    e.prototype.addBulkListener2 = function(e) {
      var t = this.addBulkListener(e);
      return {
        dispose: t
      };
    };

    e.prototype.addEmitter = function(e, t) {
      if ("undefined" == typeof t) {
        t = null;
      }
      var n = this;
      return e.addBulkListener(function(e) {
        var o = e;
        if (t) {
          o = [];
          for (var r = 0, s = e.length; s > r; r++) {
            o.push(new i(e[r].getType(), e[r].getData(), t));
          }
        }
        if (0 === n._deferredCnt) {
          n._emitEvents(o);
        }

        {
          n._collectedEvents.push.apply(n._collectedEvents, o);
        }
      });
    };

    e.prototype.addEmitter2 = function(e, t) {
      var n = this.addEmitter(e, t);
      return {
        dispose: n
      };
    };

    e.prototype.addEmitterTypeListener = function(e, t, n) {
      if (t) {
        if ("*" === e) throw new Error("Bulk listeners cannot specify an emitter type");
        return this.addListener(e + "/" + t, n);
      }
      return this.addListener(e, n);
    };

    e.prototype._removeListener = function(e, t) {
      if (this._listeners.hasOwnProperty(e))
        for (var n = this._listeners[e], i = 0, o = n.length; o > i; i++)
          if (n[i] === t) {
            n.splice(i, 1);
            break;
          }
    };

    e.prototype._removeBulkListener = function(e) {
      for (var t = 0, n = this._bulkListeners.length; n > t; t++)
        if (this._bulkListeners[t] === e) {
          this._bulkListeners.splice(t, 1);
          break;
        }
    };

    e.prototype._emitToSpecificTypeListeners = function(e, t) {
      if (this._listeners.hasOwnProperty(e))
        for (var i = this._listeners[e].slice(0), o = 0, r = i.length; r > o; o++) try {
          i[o](t);
        } catch (s) {
          n.onUnexpectedError(s);
        }
    };

    e.prototype._emitToBulkListeners = function(e) {
      for (var t = this._bulkListeners.slice(0), i = 0, o = t.length; o > i; i++) try {
        t[i](e);
      } catch (r) {
        n.onUnexpectedError(r);
      }
    };

    e.prototype._emitEvents = function(e) {
      if (this._bulkListeners.length > 0) {
        this._emitToBulkListeners(e);
      }
      for (var t = 0, n = e.length; n > t; t++) {
        var i = e[t];
        this._emitToSpecificTypeListeners(i.getType(), i.getData());

        if (i.getEmitterType()) {
          this._emitToSpecificTypeListeners(i.getType() + "/" + i.getEmitterType(), i.getData());
        }
      }
    };

    e.prototype.emit = function(e, t) {
      if ("undefined" == typeof t && (t = {}), this._allowedEventTypes && !this._allowedEventTypes.hasOwnProperty(e))
        throw new Error("Cannot emit this event type because it wasn't white-listed!");
      if (this._listeners.hasOwnProperty(e) || 0 !== this._bulkListeners.length) {
        var n = new i(e, t);
        if (0 === this._deferredCnt) {
          this._emitEvents([n]);
        }

        {
          this._collectedEvents.push(n);
        }
      }
    };

    e.prototype.deferredEmit = function(e) {
      this._deferredCnt = this._deferredCnt + 1;
      var t = e();
      this._deferredCnt = this._deferredCnt - 1;

      0 === this._deferredCnt && this._emitCollected();

      return t;
    };

    e.prototype._emitCollected = function() {
      var e = this._collectedEvents;
      this._collectedEvents = [];

      if (e.length > 0) {
        this._emitEvents(e);
      }
    };

    return e;
  }();
  t.EventEmitter = o;
});