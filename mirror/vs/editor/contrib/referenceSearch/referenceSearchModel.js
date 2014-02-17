define("vs/editor/contrib/referenceSearch/referenceSearchModel", ["require", "exports", "vs/base/collections",
  "vs/base/network", "vs/base/strings", "vs/base/hash", "vs/base/eventEmitter", "vs/editor/core/range"
], function(e, t, n, i, o, r, s, a) {
  ! function(e) {
    e.OnReferenceRangeChanged = "refrence.rangeChanged";

    e.CurrentReferenceChanged = "reference.currentChanged";
  }(t.EventType || (t.EventType = {}));
  var u = t.EventType;

  var l = function() {
    function e(e, t) {
      this._parent = e;

      this._id = o.generateUuid();

      this._range = t.range;

      this._preview = t.preview;
    }
    e.prototype.equals = function(t) {
      return t === this ? !0 : t instanceof e ? t.resource.equals(this.resource) ? a.equalsRange(t.range, this.range) ? !
        0 : !1 : !1 : !1;
    };

    e.prototype.hashCode = function() {
      return this.resource.hashCode() + a.hashCode(this.range);
    };

    Object.defineProperty(e.prototype, "id", {
      get: function() {
        return this._id;
      },
      enumerable: !0,
      configurable: !0
    });

    Object.defineProperty(e.prototype, "model", {
      get: function() {
        return this._parent;
      },
      enumerable: !0,
      configurable: !0
    });

    Object.defineProperty(e.prototype, "parent", {
      get: function() {
        return this._parent;
      },
      enumerable: !0,
      configurable: !0
    });

    Object.defineProperty(e.prototype, "resource", {
      get: function() {
        return this._parent.resource;
      },
      enumerable: !0,
      configurable: !0
    });

    Object.defineProperty(e.prototype, "name", {
      get: function() {
        return this._parent.name;
      },
      enumerable: !0,
      configurable: !0
    });

    Object.defineProperty(e.prototype, "directory", {
      get: function() {
        return this._parent.directory;
      },
      enumerable: !0,
      configurable: !0
    });

    Object.defineProperty(e.prototype, "range", {
      get: function() {
        return this._range;
      },
      set: function(e) {
        this._range = e;

        this.parent.parent.emit(u.OnReferenceRangeChanged, this);
      },
      enumerable: !0,
      configurable: !0
    });

    Object.defineProperty(e.prototype, "preview", {
      get: function() {
        return this._preview;
      },
      enumerable: !0,
      configurable: !0
    });

    return e;
  }();
  t.OneReference = l;
  var c = function() {
    function e(e, t, n) {
      this._parent = e;

      this._resource = t;

      this._path = n;

      this._children = [];
    }
    Object.defineProperty(e.prototype, "id", {
      get: function() {
        return this._resource.toExternal();
      },
      enumerable: !0,
      configurable: !0
    });

    e.prototype.hashCode = function() {
      return r.computeMurmur2StringHashCode(this._resource.toExternal());
    };

    e.prototype.equals = function(t) {
      return t === this ? !0 : t instanceof e ? t.resource.equals(this.resource) ? !0 : !1 : !1;
    };

    Object.defineProperty(e.prototype, "parent", {
      get: function() {
        return this._parent;
      },
      enumerable: !0,
      configurable: !0
    });

    Object.defineProperty(e.prototype, "children", {
      get: function() {
        return this._children;
      },
      enumerable: !0,
      configurable: !0
    });

    Object.defineProperty(e.prototype, "resource", {
      get: function() {
        return this._resource;
      },
      enumerable: !0,
      configurable: !0
    });

    Object.defineProperty(e.prototype, "name", {
      get: function() {
        return this._path.substring(this._path.lastIndexOf("/") + 1);
      },
      enumerable: !0,
      configurable: !0
    });

    Object.defineProperty(e.prototype, "directory", {
      get: function() {
        var e = this._path.lastIndexOf("/");
        return e > 0 ? this._path.substring(0, e) : "/";
      },
      enumerable: !0,
      configurable: !0
    });

    return e;
  }();
  t.FileReferences = c;
  var d = function(e) {
    function t(t, r) {
      var s = this;
      e.call(this, [u.CurrentReferenceChanged, u.OnReferenceRangeChanged]);

      this._requestService = r;
      var a = n.groupBy(n.fromArray(t), function(e) {
        var t = new i.URL(e.resourceUrl);
        return new c(s, t, s._requestService.getPath("root", t) || t.getPath());
      });
      a.forEach(function(e) {
        for (var t = 0, n = e.value.length; n > t; t++) e.key.children.push(new l(e.key, e.value[t]));
      });

      this._references = a.keys.toArray();

      this._references.sort(function(e, t) {
        return o.localeCompare(e.directory, t.directory) || o.localeCompare(e.name, t.name);
      });
    }
    __extends(t, e);

    Object.defineProperty(t.prototype, "children", {
      get: function() {
        return this._references;
      },
      enumerable: !0,
      configurable: !0
    });

    Object.defineProperty(t.prototype, "currentReference", {
      get: function() {
        return this._currentReference;
      },
      set: function(e) {
        this._currentReference = e;

        this.emit(u.CurrentReferenceChanged, this);
      },
      enumerable: !0,
      configurable: !0
    });

    t.prototype.nextReference = function(e) {
      var t = e.parent.children.indexOf(e);

      var n = e.parent.children.length;

      var i = e.parent.parent.children.length;
      return n > t + 1 || 1 === i ? e.parent.children[(t + 1) % n] : (t = e.parent.parent.children.indexOf(e.parent),
        t = (t + 1) % i, e.parent.parent.children[t].children[0]);
    };

    t.prototype.findReference = function(e, t) {
      for (var n = 0, i = this._references.length; i > n; n++) {
        var o = this._references[n];
        if (o.resource.equals(e)) {
          var r;
          if (o.children.some(function(e) {
            return a.containsPosition(e.range, t) ? (r = e, !0) : !1;
          }), r) return r;
        }
      }
      return null;
    };

    return t;
  }(s.EventEmitter);
  t.Model = d;
});