define(["require", "exports", "vs/base/errors"], function(a, b, c) {
  var d = c,
    e = function() {
      function a(a, b, c) {
        typeof c == "undefined" && (c = null), this._type = a, this._data = b, this._emitterType = c
      }
      return a.prototype.getType = function() {
        return this._type
      }, a.prototype.getData = function() {
        return this._data
      }, a.prototype.getEmitterType = function() {
        return this._emitterType
      }, a
    }();
  b.EmitterEvent = e;
  var f = function() {
    function a() {
      this._listeners = {}, this._bulkListeners = [], this._collectedEvents = [], this._deferredCnt = 0
    }
    return a.prototype.addListener = function(a, b) {
      if (a === "*") throw new Error("Use addBulkListener(listener) to register your listener!");
      this._listeners.hasOwnProperty(a) ? this._listeners[a].push(b) : this._listeners[a] = [b];
      var c = this;
      return function() {
        if (!c) return;
        c._removeListener(a, b), c = null, b = null
      }
    }, a.prototype.addListener2 = function(a, b) {
      var c = this.addListener(a, b);
      return {
        dispose: c
      }
    }, a.prototype.on = function(a, b) {
      return this.addListener(a, b)
    }, a.prototype.addOneTimeListener = function(a, b) {
      var c = this.addListener(a, function(a) {
        c(), b(a)
      });
      return c
    }, a.prototype.addBulkListener = function(a) {
      var b = this;
      return this._bulkListeners.push(a),
      function() {
        b._removeBulkListener(a)
      }
    }, a.prototype.addEmitter = function(a, b) {
      typeof b == "undefined" && (b = null);
      var c = this;
      return a.addBulkListener(function(a) {
        var d = a;
        if (b) {
          d = [];
          for (var f = 0, g = a.length; f < g; f++) d.push(new e(a[f].getType(), a[f].getData(), b))
        }
        c._deferredCnt === 0 ? c._emitEvents(d) : c._collectedEvents.push.apply(c._collectedEvents, d)
      })
    }, a.prototype.addEmitterTypeListener = function(a, b, c) {
      if (b) {
        if (a === "*") throw new Error("Bulk listeners cannot specify an emitter type");
        return this.addListener(a + "/" + b, c)
      }
      return this.addListener(a, c)
    }, a.prototype._removeListener = function(a, b) {
      if (this._listeners.hasOwnProperty(a)) {
        var c = this._listeners[a];
        for (var d = 0, e = c.length; d < e; d++)
          if (c[d] === b) {
            c.splice(d, 1);
            break
          }
      }
    }, a.prototype._removeBulkListener = function(a) {
      for (var b = 0, c = this._bulkListeners.length; b < c; b++)
        if (this._bulkListeners[b] === a) {
          this._bulkListeners.splice(b, 1);
          break
        }
    }, a.prototype._emitToSpecificTypeListeners = function(a, b) {
      if (this._listeners.hasOwnProperty(a)) {
        var c = this._listeners[a].slice(0);
        for (var e = 0, f = c.length; e < f; e++) try {
          c[e](b)
        } catch (g) {
          d.onUnexpectedError(g)
        }
      }
    }, a.prototype._emitToBulkListeners = function(a) {
      var b = this._bulkListeners.slice(0);
      for (var c = 0, e = b.length; c < e; c++) try {
        b[c](a)
      } catch (f) {
        d.onUnexpectedError(f)
      }
    }, a.prototype._emitEvents = function(a) {
      this._bulkListeners.length > 0 && this._emitToBulkListeners(a);
      for (var b = 0, c = a.length; b < c; b++) {
        var d = a[b];
        this._emitToSpecificTypeListeners(d.getType(), d.getData()), d.getEmitterType() && this._emitToSpecificTypeListeners(
          d.getType() + "/" + d.getEmitterType(), d.getData())
      }
    }, a.prototype.emit = function(a, b) {
      typeof b == "undefined" && (b = {});
      if (!this._listeners.hasOwnProperty(a) && this._bulkListeners.length === 0) return;
      var c = new e(a, b);
      this._deferredCnt === 0 ? this._emitEvents([c]) : this._collectedEvents.push(c)
    }, a.prototype.deferredEmit = function(a) {
      this._deferredCnt = this._deferredCnt + 1;
      var b = a();
      return this._deferredCnt = this._deferredCnt - 1, this._deferredCnt === 0 && this._emitCollected(), b
    }, a.prototype._emitCollected = function() {
      var a = this._collectedEvents;
      this._collectedEvents = [], a.length > 0 && this._emitEvents(a)
    }, a.prototype.dispose = function() {
      this._listeners = {}, this._bulkListeners = [], this._collectedEvents = [], this._deferredCnt = 0
    }, a
  }();
  b.EventEmitter = f
})