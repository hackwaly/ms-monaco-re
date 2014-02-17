define("vs/languages/typescript/resources/dependencyResolver", ["require", "exports", "vs/base/lib/winjs.base",
  "vs/base/lifecycle", "vs/base/hash", "vs/base/collections", "vs/platform/services",
  "vs/editor/core/model/mirrorModel", "vs/languages/typescript/service/references"
], function(e, t, n, r, i, o, s, a, l) {
  ! function(e) {
    e.OnReferencesChanged = "onReferencesChanged";
  }(t.Events || (t.Events = {}));
  var c = t.Events;

  var u = function() {
    function e() {}
    e.prototype.fetchDependencies = function() {
      return e._Empty;
    };

    e.prototype.dispose = function() {};

    e._Empty = n.TPromise.as(o.EmptyIterable);

    return e;
  }();
  t.NullDependencyResolver = u;
  var p = function() {
    function e(e) {
      this._delegates = e;
    }
    e.prototype.fetchDependencies = function(e) {
      var t = this._delegates.map(function(t) {
        return t.fetchDependencies(e);
      });
      return n.Promise.join(t).then(function(e) {
        return o.combine(e);
      });
    };

    e.prototype.dispose = function() {
      r.disposeAll(this._delegates);
    };

    return e;
  }();
  t.CompositeDependencyResolver = p;
  var h = function() {
    function e(e, t) {
      this._resourceService = e;

      this._requestService = t;
    }
    e.prototype.dispose = function() {};

    e.prototype.fetchDependencies = function(t) {
      return t && this._requestService.getPath("root", t) ? this._resourceService.get(t) instanceof a.MirrorModel ?
        this._doFetchDependencies(t, this._resourceService.get(t)) : e._Empty : e._Empty;
    };

    e.prototype._doFetchDependencies = function() {
      return e._Empty;
    };

    e._Empty = n.TPromise.as(o.EmptyIterable);

    return e;
  }();
  t.AbstractDependencyResolver = h;
  var d = function() {
    function e(e, t, n) {
      var r = this;
      this._delegate = e;

      this._eventbus = t;

      this._resourceService = n;

      this._cache = new o.Dictionary;

      this._callOnDispose = new Array;

      this._callOnDispose.push(this._resourceService.addListener2(s.ResourceEvents.REMOVED, function(e) {
        return r._cache.remove(e.url);
      }));
    }
    e.prototype.dispose = function() {
      r.disposeAll(this._callOnDispose);

      this._cache.forEach(function(e) {
        return e.value.listener.dispose();
      });

      this._cache.clear();
    };

    e.prototype.fetchDependencies = function(e) {
      var t = this;
      if (!this._cache.containsKey(e)) {
        var n = this._resourceService.get(e);
        this._cache.add(e, {
          stateId: this._computeState(n),
          request: this._delegate.fetchDependencies(e),
          listener: n.addListener2("changed", function() {
            return t._validateCache(n);
          })
        });
      }
      return this._cache.lookup(e).request;
    };

    e.prototype._validateCache = function(e) {
      var t = this;

      var n = this._cache.lookup(e.getAssociatedResource());
      clearTimeout(n.scheduledUpdate);

      n.scheduledUpdate = setTimeout(function() {
        n.stateId !== t._computeState(e) && (n.listener.dispose(), t._cache.remove(e.getAssociatedResource()), t._eventbus
          .emit(c.OnReferencesChanged, {
            resource: e.getAssociatedResource()
          }));
      }, 1500);
    };

    e.prototype._computeState = function(e) {
      for (var t = l.collect(e.getValue()), n = 11, r = 0, o = t.length; o > r; r++) n = i.combine(i.computeMurmur2StringHashCode(
        t[r].path) + 59 * t[r].offset + 61 * t[r].length, n);
      return n;
    };

    return e;
  }();
  t.CachingDependencyResolver = d;
});