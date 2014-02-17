define('vs/platform/instantiation/instantiationService', [
  'require',
  'exports',
  'vs/base/lib/winjs.base',
  'vs/base/errors',
  'vs/base/strings',
  'vs/base/types',
  'vs/platform/services',
  'vs/base/collections',
  'vs/base/injector'
], function(e, t, n, i, o, r, s, a, u) {
  function l(e) {
    return new d(e);
  }
  t.create = l;
  var c = function() {
    function e(e) {
      var t = this;
      this._services = e, this._active = 0, this._diContainer = new u.Container(), a.forEach(this._services, function(
        e) {
        t._diContainer.registerService(e.key, e.value), Object.defineProperty(t, e.key, {
          get: function() {
            if (0 === t._active)
              throw i.illegalState('the services map can only be used during construction');
            if (!e.value)
              throw i.illegalArgument(o.format('service with \'{0}\' not found', e.key));
            return e.value;
          },
          set: function() {
            throw i.illegalState('services cannot be changed');
          },
          configurable: !1,
          enumerable: !1
        });
      });
    }
    return Object.defineProperty(e.prototype, 'services', {
      get: function() {
        return this._services;
      },
      enumerable: !0,
      configurable: !0
    }), e.prototype.createInstance = function(e, t) {
      var n = [
        e.ctor,
        this
      ];
      n.push.apply(n, e.staticArguments()), n.push.apply(n, t);
      try {
        this._active += 1;
        var i = r.create.apply(null, n);
        return this._diContainer.injectTo(i), e._validate(i), i;
      } finally {
        this._active -= 1;
      }
    }, e;
  }(),
    d = function() {
      function t(e) {
        e.instantiationService = this, this._servicesMap = new c(e);
      }
      return t.prototype.createChild = function(e) {
        var n = {};
        return a.forEach(this._servicesMap.services, function(e) {
          n[e.key] = e.value;
        }), a.forEach(e, function(e) {
          n[e.key] = e.value;
        }), new t(n);
      }, t.prototype.createInstance = function(e) {
        for (var t = new Array(arguments.length - 1), n = 1, i = arguments.length; i > n; n++)
          t[n - 1] = arguments[n];
        return e instanceof s.SyncDescriptor ? this._servicesMap.createInstance(e, t) : e instanceof s.AsyncDescriptor ?
          this._createInstanceAsync(e, t) : this._servicesMap.createInstance(new s.SyncDescriptor(e), t);
      }, t.prototype._createInstanceAsync = function(t, o) {
        var r, a = this;
        return new n.TPromise(function(n, u) {
          e.onError = u, e([t.moduleName], function(e) {
            if (r && u(r), !e)
              return u(i.illegalArgument('module not found: ' + t.moduleName));
            if ('function' != typeof e[t.functionName])
              return u(i.illegalArgument('not a function: ' + t.functionName));
            try {
              o.unshift.apply(o, t.staticArguments()), n(a._servicesMap.createInstance(new s.SyncDescriptor(e[t.functionName]),
                o));
            } catch (l) {
              return u(l);
            }
          });
        }, function() {
          r = i.canceled();
        });
      }, t;
    }();
})