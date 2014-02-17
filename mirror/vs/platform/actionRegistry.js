define("vs/platform/actionRegistry", ["require", "exports", "vs/platform/platform", "vs/platform/services",
  "vs/base/ui/actions", "vs/base/lib/winjs.base", "vs/base/assert"
], function(e, t, n, i, o, r, s) {
  var a = function(e) {
    function t(t, n, i) {
      for (var o = [], r = 0; r < arguments.length - 3; r++) {
        o[r] = arguments[r + 3];
      }
      e.call(this, t);

      this.id = n;

      this.label = i;

      this.keybindings = o.slice(0);
    }
    __extends(t, e);

    t.prototype.createNew = function() {
      for (var t = [], n = 0; n < arguments.length - 0; n++) {
        t[n] = arguments[n + 0];
      }
      return e.prototype.createNew.apply(this, t);
    };

    return t;
  }(n.BaseDescriptor);
  t.ActionDescriptor = a;
  var u = function(e) {
    function t(t, n, i) {
      for (var o = [], r = 0; r < arguments.length - 3; r++) {
        o[r] = arguments[r + 3];
      }
      e.call(this, t, n, i, o);
    }
    __extends(t, e);

    Object.defineProperty(t.prototype, "id", {
      get: function() {
        return this.staticArguments(0);
      },
      enumerable: !0,
      configurable: !0
    });

    Object.defineProperty(t.prototype, "label", {
      get: function() {
        return this.staticArguments(1);
      },
      enumerable: !0,
      configurable: !0
    });

    Object.defineProperty(t.prototype, "keybindings", {
      get: function() {
        return this.staticArguments(2);
      },
      enumerable: !0,
      configurable: !0
    });

    return t;
  }(i.SyncDescriptor);
  t.SyncActionDescriptor = u;
  var l = function(e) {
    function t(t, n, i) {
      for (var o = [], r = 0; r < arguments.length - 3; r++) {
        o[r] = arguments[r + 3];
      }
      e.call(this, n, i);

      this._entryPointModule = t;

      this.appendStaticArguments(o);
    }
    __extends(t, e);

    Object.defineProperty(t.prototype, "entryPointModule", {
      get: function() {
        return this._entryPointModule;
      },
      enumerable: !0,
      configurable: !0
    });

    return t;
  }(i.AsyncDescriptor);
  t.IShouldNotUseAnAsyncDescriptorWithEntryPoint = l;
  var c = function(t) {
    function n(e, n, i, o, r, s) {
      if ("undefined" == typeof o) {
        o = "";
      }

      if ("undefined" == typeof r) {
        r = "";
      }

      if ("undefined" == typeof s) {
        s = !0;
      }

      t.call(this, i, o, r, s);

      this._instantiationService = e;

      this._descriptor = n;
    }
    __extends(n, t);

    Object.defineProperty(n.prototype, "cachedAction", {
      get: function() {
        return this._cachedAction;
      },
      set: function(e) {
        this._cachedAction = e;
      },
      enumerable: !0,
      configurable: !0
    });

    Object.defineProperty(n.prototype, "id", {
      get: function() {
        return this._cachedAction instanceof o.Action ? this._cachedAction.id : this._id;
      },
      enumerable: !0,
      configurable: !0
    });

    Object.defineProperty(n.prototype, "label", {
      get: function() {
        return this._cachedAction instanceof o.Action ? this._cachedAction.label : this._label;
      },
      set: function(e) {
        this._cachedAction instanceof o.Action ? this._cachedAction.label = e : this._setLabel(e);
      },
      enumerable: !0,
      configurable: !0
    });

    Object.defineProperty(n.prototype, "class", {
      get: function() {
        return this._cachedAction instanceof o.Action ? this._cachedAction.class : this._cssClass;
      },
      set: function(e) {
        this._cachedAction instanceof o.Action ? this._cachedAction.class = e : this._setClass(e);
      },
      enumerable: !0,
      configurable: !0
    });

    Object.defineProperty(n.prototype, "enabled", {
      get: function() {
        return this._cachedAction instanceof o.Action ? this._cachedAction.enabled : this._enabled;
      },
      set: function(e) {
        this._cachedAction instanceof o.Action ? this._cachedAction.enabled = e : this._setEnabled(e);
      },
      enumerable: !0,
      configurable: !0
    });

    Object.defineProperty(n.prototype, "order", {
      get: function() {
        return this._cachedAction instanceof o.Action ? this._cachedAction.order : this._order;
      },
      set: function(e) {
        this._cachedAction instanceof o.Action ? this._cachedAction.order = e : this._order = e;
      },
      enumerable: !0,
      configurable: !0
    });

    n.prototype.run = function(e) {
      return this._cachedAction ? this._cachedAction.run() : this._createAction().then(function(t) {
        return t.run(e);
      });
    };

    n.prototype._createAction = function() {
      var t = this;

      var n = r.TPromise.as(void 0);
      this._descriptor instanceof l && (n = new r.TPromise(function(n) {
        e([t._descriptor.entryPointModule], function() {
          n(void 0);
        });
      }));

      return n.then(function() {
        return t._instantiationService.createInstance(t._descriptor);
      }).then(function(e) {
        s.ok(e instanceof o.Action, "Action must be an instanceof Base Action");

        t._cachedAction = e;

        t._emitterUnbind = t.addEmitter(t._cachedAction);

        return e;
      });
    };

    n.prototype.dispose = function() {
      if (this._emitterUnbind) {
        this._emitterUnbind();
      }

      if (this._cachedAction) {
        this._cachedAction.dispose();
      }

      t.prototype.dispose.call(this);
    };

    return n;
  }(o.Action);
  t.DeferredAction = c;
});