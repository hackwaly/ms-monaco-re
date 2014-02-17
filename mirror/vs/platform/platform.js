define("vs/platform/platform", ["require", "exports", "vs/base/errors", "vs/base/lib/winjs.base", "vs/base/types",
  "vs/base/assert"
], function(e, t, n, i, o, r) {
  var s = function() {
    function e(e) {
      this.ctor = e;
    }
    e.prototype.createNew = function() {
      for (var e = [], t = 0; t < arguments.length - 0; t++) e[t] = arguments[t + 0];
      e.unshift(this.ctor);
      var n = o.create.apply(this, e);
      this.assertType(n);

      return n;
    };

    e.prototype.assertType = function() {};

    e.prototype.describes = function(e) {
      return e && e.constructor === this.ctor;
    };

    e.prototype.getCtor = function() {
      return this.ctor;
    };

    return e;
  }();
  t.BaseDescriptor = s;
  var a = function() {
    function t(e, t, n) {
      "undefined" == typeof n && (n = []);

      r.ok(!o.isUndefinedOrNull(e), "deferred desc must have a moduleId");

      r.ok(!o.isUndefinedOrNull(t), "deferred desc must have a ctorName");

      this.moduleId = e;

      this.ctorName = t;

      this.payload = n;
    }
    t.prototype.getModuleId = function() {
      return this.moduleId;
    };

    t.prototype.getCtorName = function() {
      return this.ctorName;
    };

    t.prototype.getPayload = function() {
      return this.payload;
    };

    t.prototype.assertType = function() {};

    t.prototype.loadAndCreate = function(t) {
      var o;

      var r = this;
      return new i.Promise(function(n, i) {
        e([r.moduleId], function(e) {
          if (o) return i(o);
          try {
            var s = r.doCreate(e, t);
            n(s);
          } catch (a) {
            i(a);
          }
        });
      }, function() {
        o = n.canceled();
      });
    };

    t.prototype.syncLoadAndCreate = function(t) {
      var n;

      var i = null;
      try {
        n = e(this.moduleId);
      } catch (o) {
        return null;
      }
      return i = this.doCreate(n, t);
    };

    t.prototype.doCreate = function(e, t) {
      if (o.isUndefinedOrNull(e[this.ctorName])) throw new Error("module " + this.moduleId + " does not export " +
        this.ctorName);
      var n = this.payload.slice(0);
      n.unshift(e[this.ctorName]);
      var i = o.create.apply(null, n);
      t && t.injectTo(i);

      this.assertType(i);

      return i;
    };

    t.prototype.equals = function(e) {
      return e ? this.moduleId === e.moduleId && this.ctorName === e.ctorName : !1;
    };

    return t;
  }();
  t.DeferredDescriptor = a;
  var u = function(t) {
    function r(e, n, i, r) {
      t.call(this, n, i, r);

      this.entryModuleIds = o.isString(e) ? [e] : e;
    }
    __extends(r, t);

    r.prototype.loadAndCreate = function(t) {
      var r;

      var s = this;
      return new i.Promise(function(n, i) {
        e(s.entryModuleIds, function() {
          e([s.getModuleId()], function(e) {
            if (r) return i(r);
            o.isUndefinedOrNull(e[s.getCtorName()]) && i(new Error("module " + s.getModuleId() +
              " does not export " + s.getCtorName()));
            var a = s.getPayload().slice(0);
            a.unshift(e[s.getCtorName()]);
            var u = o.create.apply(null, a);
            t && t.injectTo(u);

            s.assertType(u);

            n(u);
          });
        });
      }, function() {
        r = n.canceled();
      });
    };

    r.prototype.syncLoadAndCreate = function() {
      throw new Error("Unsupported");
    };

    return r;
  }(a);
  t.EntryPointAwareDeferredDescriptor = u;
  var l = function() {
    function e() {
      this.data = {};
    }
    e.prototype.add = function(e, t) {
      r.ok(o.isString(e));

      r.ok(o.isObject(t));

      r.ok(!this.data.hasOwnProperty(e), "There is already an extension with this id");

      this.data[e] = t;
    };

    e.prototype.knows = function(e) {
      return this.data.hasOwnProperty(e);
    };

    e.prototype.as = function(e) {
      return this.data[e] || null;
    };

    return e;
  }();
  t.Registry = new l;
});