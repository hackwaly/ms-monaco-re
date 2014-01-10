var __extends = this.__extends || function(a, b) {
    function d() {
      this.constructor = a
    }
    for (var c in b) b.hasOwnProperty(c) && (a[c] = b[c]);
    d.prototype = b.prototype, a.prototype = new d
  };
define(["require", "exports", "vs/base/lib/winjs.base", "vs/base/eventEmitter"], function(a, b, c, d) {
  function g(a) {
    return a ? a instanceof h ? !0 : typeof a.id != "string" ? !1 : typeof a.label != "string" ? !1 : typeof a.class !=
      "string" ? !1 : typeof a.enabled != "boolean" ? !1 : typeof a.checked != "boolean" ? !1 : typeof a.run !=
      "function" ? !1 : !0 : !1
  }

  function j(a) {
    function b(b) {
      return function() {
        a.forEach(function(a) {
          a.checked = a === b
        })
      }
    }
    return a.map(function(a) {
      return new i(a, b(a))
    })
  }
  var e = c,
    f = d;
  b.isAction = g;
  var h = function(a) {
    function b(b, c, d, e, f) {
      typeof c == "undefined" && (c = ""), typeof d == "undefined" && (d = ""), typeof e == "undefined" && (e = !0),
        typeof f == "undefined" && (f = null), a.call(this), this._id = b, this._label = c, this._cssClass = d, this._enabled =
        e, this._actionCallback = f
    }
    return __extends(b, a), Object.defineProperty(b.prototype, "id", {
      get: function() {
        return this._id
      },
      enumerable: !0,
      configurable: !0
    }), Object.defineProperty(b.prototype, "label", {
      get: function() {
        return this._label
      },
      set: function(a) {
        name !== a && (this._label = a, this.emit(b.LABEL, {
          source: this
        }))
      },
      enumerable: !0,
      configurable: !0
    }), Object.defineProperty(b.prototype, "class", {
      get: function() {
        return this._cssClass
      },
      set: function(a) {
        this._cssClass !== a && (this._cssClass = a, this.emit(b.CLASS, {
          source: this
        }))
      },
      enumerable: !0,
      configurable: !0
    }), Object.defineProperty(b.prototype, "enabled", {
      get: function() {
        return this._enabled
      },
      set: function(a) {
        this._enabled !== a && (this._enabled = a, this.emit(b.ENABLED, {
          source: this
        }))
      },
      enumerable: !0,
      configurable: !0
    }), Object.defineProperty(b.prototype, "checked", {
      get: function() {
        return this._checked
      },
      set: function(a) {
        this._checked !== a && (this._checked = a, this.emit(b.CHECKED, {
          source: this
        }))
      },
      enumerable: !0,
      configurable: !0
    }), Object.defineProperty(b.prototype, "order", {
      get: function() {
        return this._order
      },
      set: function(a) {
        this._order = a
      },
      enumerable: !0,
      configurable: !0
    }), Object.defineProperty(b.prototype, "actionCallback", {
      get: function() {
        return this._actionCallback
      },
      set: function(a) {
        this._actionCallback = a
      },
      enumerable: !0,
      configurable: !0
    }), b.prototype.run = function(a) {
      return this._actionCallback !== null ? this._actionCallback(a) : e.Promise.as(!0)
    }, b.LABEL = "label", b.CLASS = "class", b.ENABLED = "enabled", b.CHECKED = "checked", b
  }(f.EventEmitter);
  b.Action = h;
  var i = function(a) {
    function b(b, c) {
      a.call(this, b.id, b.label, b.class, b.enabled, null), this.delegate = b, this.runHandler = c
    }
    return __extends(b, a), Object.defineProperty(b.prototype, "id", {
      get: function() {
        return this.delegate.id
      },
      enumerable: !0,
      configurable: !0
    }), Object.defineProperty(b.prototype, "label", {
      get: function() {
        return this.delegate.label
      },
      set: function(a) {
        this.delegate.label = a
      },
      enumerable: !0,
      configurable: !0
    }), Object.defineProperty(b.prototype, "class", {
      get: function() {
        return this.delegate.class
      },
      set: function(a) {
        this.delegate.class = a
      },
      enumerable: !0,
      configurable: !0
    }), Object.defineProperty(b.prototype, "enabled", {
      get: function() {
        return this.delegate.enabled
      },
      set: function(a) {
        this.delegate.enabled = a
      },
      enumerable: !0,
      configurable: !0
    }), Object.defineProperty(b.prototype, "checked", {
      get: function() {
        return this.delegate.checked
      },
      set: function(a) {
        this.delegate.checked = a
      },
      enumerable: !0,
      configurable: !0
    }), b.prototype.run = function(a) {
      return this.runHandler(a), this.delegate.run(a)
    }, b.prototype.addListener = function(a, b) {
      return this.delegate.addListener(a, b)
    }, b.prototype.addBulkListener = function(a) {
      return this.delegate.addBulkListener(a)
    }, b.prototype.addEmitter = function(a, b) {
      return this.delegate.addEmitter(a, b)
    }, b.prototype.addEmitterTypeListener = function(a, b, c) {
      return this.delegate.addEmitterTypeListener(a, b, c)
    }, b.prototype.emit = function(a, b) {
      this.delegate.emit(a, b)
    }, b
  }(h);
  b.radioGroup = j
})