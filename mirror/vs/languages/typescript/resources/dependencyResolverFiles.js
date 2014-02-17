define("vs/languages/typescript/resources/dependencyResolverFiles", ["require", "exports", "vs/base/lib/winjs.base",
  "vs/base/network", "vs/base/severity", "vs/base/collections", "vs/base/paths", "./remoteModels",
  "../service/references", "./dependencyResolver", "vs/platform/markers/markers"
], function(e, t, n, r, i, o, s, a, l, c, u) {
  function p(e, t) {
    var n = {
      resources: new Array,
      errors: {}
    };
    e.traverse(t.toExternal(), function(t) {
      var s = t.getName();

      var a = 0 === s.indexOf("error:");
      if (a) {
        e.removeNode(s);
        var l = JSON.parse(s.substr(6));
        if (1 === l.referenceType) {
          var c = o.lookupOrInsert(n.errors, l.path, []);
          c.push(u.createTextMarker(i.Severity.Error, 1, l.message, l.offset, l.length));
        }
      } else n.resources.push(r.URL.fromValue(s));
    });

    return n;
  }
  var h = function() {
    function e(e, t) {
      this._resourceService = e;

      this._requestService = t;
    }
    e.prototype.load = function(e, t) {
      var i = this;
      if (!(t instanceof l.TripleSlashReference)) return n.Promise.wrapError(
        "only triple slash references are supported");
      var o = new r.URL(s.join(s.dirname(e), s.normalize(t.path)));

      var c = this._requestService.getPath("root", o);

      var u = new r.URL(this._requestService.getRequestUrl("root", c, !0));
      if (this._resourceService.contains(u)) {
        var p = this._resourceService.get(u);
        return n.Promise.as(new l.File(u.toExternal(), p.getValue()));
      }
      return this._requestService.makeRequest({
        url: u.toExternal()
      }).then(function(e) {
        var t = new l.File(u.toExternal(), e.responseText);

        var n = new a.RemoteModel(u, e.responseText);
        i._resourceService.contains(u) || i._resourceService.insert(u, n);

        return t;
      });
    };

    e.prototype.dispose = function() {};

    return e;
  }();

  var d = function(e) {
    function n(t, n, r) {
      e.call(this, n, r);

      this._markerService = t;

      this._loader = new h(this._resourceService, this._requestService);
    }
    __extends(n, e);

    n.prototype.dispose = function() {
      this._loader.dispose();
    };

    n.prototype._doFetchDependencies = function(e) {
      var r = this;

      var i = this._resourceService.get(e);

      var s = new l.File(i.getAssociatedResource().toExternal(), i.getValue());

      var a = this._requestService.getPath("root", i.getAssociatedResource());
      return l.buildDependencyGraph(this._loader, [s], n._Options).then(function(n) {
        var i = t.collectDependenciesAndErrors(n, e);
        r._markerService.createPublisher().changeMarkers(e, function(e) {
          o.lookup(i.errors, a, []).forEach(function(t) {
            return e.addMarker(t);
          });
        });

        return i.resources;
      });
    };

    n._Options = {
      nodeName: function(e) {
        return e;
      }
    };

    return n;
  }(c.AbstractDependencyResolver);
  t.FileBasedResolver = d;

  t.collectDependenciesAndErrors = p;
  var m = function() {
    function t(e, t, n, r) {
      this._baselibs = e;

      this._resourceService = t;

      this._requestService = n;

      this._delegate = r;
    }
    t.prototype.dispose = function() {
      this._delegate.dispose();
    };

    t.prototype.fetchDependencies = function() {
      var e = this;

      var t = new Array;

      var r = [t];
      return n.TPromise.join(this._baselibs.map(function(n) {
        return e._resolveBaseLibrary(n).then(function(n) {
          n && t.push(n);

          return e._delegate.fetchDependencies(n);
        }).then(function(e) {
          r.push(e);
        });
      })).then(function() {
        return o.combine(r);
      });
    };

    t.prototype._resolveBaseLibrary = function(r) {
      var i = this;
      return this._resourceService.contains(r) ? n.TPromise.as(r) : 0 === r.toExternal().indexOf(t.MODULE_PREFIX) ?
        new n.TPromise(function(t) {
          e([r.toExternal()], function(e) {
            var n = new a.DefaultLibModel(r, e);
            i._resourceService.insert(r, n);

            t(r);
          });
        }) : this._requestService.makeRequest({
          url: r.toExternal()
        }).then(function(e) {
          var t = new a.DefaultLibModel(r, e.responseText);
          i._resourceService.insert(r, t);

          return r;
        }, function() {
          console.warn("TS - " + r.toExternal() + " can not be loaded as base lib");

          return null;
        });
    };

    t.MODULE_PREFIX = "vs/text!";

    return t;
  }();
  t.BaselibDependencyResolver = m;
});