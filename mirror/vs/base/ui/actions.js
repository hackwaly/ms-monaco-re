define("vs/base/ui/actions", ["require", "exports", "vs/base/lib/winjs.base", "vs/base/eventEmitter",
  "vs/base/ui/events"
], function(e, t, n, i, o) {
  function r(e) {
    return e ? e instanceof a ? !0 : "string" != typeof e.id ? !1 : "string" != typeof e.label ? !1 : "string" !=
      typeof e.class ? !1 : "boolean" != typeof e.enabled ? !1 : "boolean" != typeof e.checked ? !1 : "function" !=
      typeof e.run ? !1 : !0 : !1;
  }

  function s(e) {
    function t(t) {
      return function() {
        e.forEach(function(e) {
          e.checked = e === t;
        });
      };
    }
    return e.map(function(e) {
      return new u(e, t(e));
    });
  }
  t.isAction = r;
  var a = function(e) {
    function t(t, n, i, o, r) {
      if ("undefined" == typeof n) {
        n = "";
      }

      if ("undefined" == typeof i) {
        i = "";
      }

      if ("undefined" == typeof o) {
        o = !0;
      }

      if ("undefined" == typeof r) {
        r = null;
      }

      e.call(this);

      this._id = t;

      this._label = n;

      this._cssClass = i;

      this._enabled = o;

      this._actionCallback = r;
    }
    __extends(t, e);

    Object.defineProperty(t.prototype, "id", {
      get: function() {
        return this._id;
      },
      enumerable: !0,
      configurable: !0
    });

    Object.defineProperty(t.prototype, "label", {
      get: function() {
        return this._label;
      },
      set: function(e) {
        this._setLabel(e);
      },
      enumerable: !0,
      configurable: !0
    });

    t.prototype._setLabel = function(e) {
      if (this._label !== e) {
        this._label = e;
        this.emit(t.LABEL, {
          source: this
        });
      }
    };

    Object.defineProperty(t.prototype, "class", {
      get: function() {
        return this._cssClass;
      },
      set: function(e) {
        this._setClass(e);
      },
      enumerable: !0,
      configurable: !0
    });

    t.prototype._setClass = function(e) {
      if (this._cssClass !== e) {
        this._cssClass = e;
        this.emit(t.CLASS, {
          source: this
        });
      }
    };

    Object.defineProperty(t.prototype, "enabled", {
      get: function() {
        return this._enabled;
      },
      set: function(e) {
        this._setEnabled(e);
      },
      enumerable: !0,
      configurable: !0
    });

    t.prototype._setEnabled = function(e) {
      if (this._enabled !== e) {
        this._enabled = e;
        this.emit(t.ENABLED, {
          source: this
        });
      }
    };

    Object.defineProperty(t.prototype, "checked", {
      get: function() {
        return this._checked;
      },
      set: function(e) {
        this._setChecked(e);
      },
      enumerable: !0,
      configurable: !0
    });

    t.prototype._setChecked = function(e) {
      if (this._checked !== e) {
        this._checked = e;
        this.emit(t.CHECKED, {
          source: this
        });
      }
    };

    Object.defineProperty(t.prototype, "order", {
      get: function() {
        return this._order;
      },
      set: function(e) {
        this._order = e;
      },
      enumerable: !0,
      configurable: !0
    });

    Object.defineProperty(t.prototype, "actionCallback", {
      get: function() {
        return this._actionCallback;
      },
      set: function(e) {
        this._actionCallback = e;
      },
      enumerable: !0,
      configurable: !0
    });

    t.prototype.run = function(e) {
      return null !== this._actionCallback ? this._actionCallback(e) : n.Promise.as(!0);
    };

    t.LABEL = "label";

    t.CLASS = "class";

    t.ENABLED = "enabled";

    t.CHECKED = "checked";

    return t;
  }(i.EventEmitter);
  t.Action = a;
  var u = function(e) {
    function t(t, n) {
      e.call(this, t.id, t.label, t.class, t.enabled, null);

      this.delegate = t;

      this.runHandler = n;
    }
    __extends(t, e);

    Object.defineProperty(t.prototype, "id", {
      get: function() {
        return this.delegate.id;
      },
      enumerable: !0,
      configurable: !0
    });

    Object.defineProperty(t.prototype, "label", {
      get: function() {
        return this.delegate.label;
      },
      set: function(e) {
        this.delegate.label = e;
      },
      enumerable: !0,
      configurable: !0
    });

    Object.defineProperty(t.prototype, "class", {
      get: function() {
        return this.delegate.class;
      },
      set: function(e) {
        this.delegate.class = e;
      },
      enumerable: !0,
      configurable: !0
    });

    Object.defineProperty(t.prototype, "enabled", {
      get: function() {
        return this.delegate.enabled;
      },
      set: function(e) {
        this.delegate.enabled = e;
      },
      enumerable: !0,
      configurable: !0
    });

    Object.defineProperty(t.prototype, "checked", {
      get: function() {
        return this.delegate.checked;
      },
      set: function(e) {
        this.delegate.checked = e;
      },
      enumerable: !0,
      configurable: !0
    });

    t.prototype.run = function(e) {
      this.runHandler(e);

      return this.delegate.run(e);
    };

    t.prototype.addListener = function(e, t) {
      return this.delegate.addListener(e, t);
    };

    t.prototype.addBulkListener = function(e) {
      return this.delegate.addBulkListener(e);
    };

    t.prototype.addEmitter = function(e, t) {
      return this.delegate.addEmitter(e, t);
    };

    t.prototype.addEmitterTypeListener = function(e, t, n) {
      return this.delegate.addEmitterTypeListener(e, t, n);
    };

    t.prototype.emit = function(e, t) {
      this.delegate.emit(e, t);
    };

    return t;
  }(a);
  t.radioGroup = s;
  var l = function(e) {
    function t() {
      e.apply(this, arguments);
    }
    __extends(t, e);

    t.prototype.run = function(e, t) {
      var i = this;
      if (e.enabled) {
        this.emit(o.EventType.BEFORE_RUN, {
          action: e
        });
        return n.Promise.as(e.run(t)).then(function(t) {
          i.emit(o.EventType.RUN, {
            action: e,
            result: t
          });
        }, function(t) {
          i.emit(o.EventType.RUN, {
            action: e,
            error: t
          });
        });
      }
    };

    return t;
  }(i.EventEmitter);
  t.ActionRunner = l;
});