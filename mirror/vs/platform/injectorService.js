define("vs/platform/injectorService", ["require", "exports", "vs/base/collections", "vs/base/injector",
  "vs/base/assert", "./instantiation/instantiationService"
], function(e, t, n, i, o, r) {
  function s(e) {
    var t = new i.Container;

    var n = new c(t);

    var o = r.create(e);
    n._instantiationService = o;

    n._diContainer.registerService(c._instantiationServiceName, o);

    a(e, t);

    u(e, t);

    return n;
  }

  function a(e, t) {
    o.ok(!n.contains(e, c._injectorServiceName), "injectorService is NOT allowed to be added because it is implict");

    Object.keys(e).forEach(function(n) {
      var i = e[n];
      t.registerService(n, i);
    });
  }

  function u(e, t) {
    Object.keys(e).forEach(function(n) {
      var i = e[n];
      t.injectTo(i);

      l(i);
    });
  }

  function l(e) {
    return Array.isArray(e) ? (e.forEach(function(e) {
      l(e);
    }), void 0) : ("function" == typeof e[c._fnInjectionDone] && e[c._fnInjectionDone].apply(e), void 0);
  }
  var c = function() {
    function e(t) {
      this._diContainer = t;

      this._diContainer.registerService(e._injectorServiceName, this);
    }
    e.prototype.injectTo = function(e) {
      this._diContainer.injectTo(e);

      l(e);
    };

    e.prototype.createChild = function(t) {
      var n = this._diContainer.createChild();
      a(t, n);
      var i = new e(n);
      i._instantiationService = this._instantiationService.createChild(t);

      n.registerService(e._injectorServiceName, i);

      n.registerService(e._instantiationServiceName, i._instantiationService);

      u(t, n);

      return i;
    };

    e._injectorServiceName = "injectorService";

    e._instantiationServiceName = "instantiationService";

    e._fnInjectionDone = "injectionDone";

    return e;
  }();
  t.create = s;
});