define("vs/platform/services", ["require", "exports", "vs/base/lib/winjs.base", "vs/base/async", "vs/base/strings",
  "vs/base/network", "vs/base/eventEmitter", "vs/base/performance/timer", "vs/base/objects", "vs/base/hash",
  "vs/base/errors"
], function(e, t, n, i, o, r, s, a, u, l, c) {
  var d = function() {
    function e(e) {
      this._staticArguments = e;
    }
    e.prototype.appendStaticArguments = function(e) {
      this._staticArguments.push.apply(this._staticArguments, e);
    };

    e.prototype.staticArguments = function(e) {
      return isNaN(e) ? this._staticArguments.slice(0) : this._staticArguments[e];
    };

    e.prototype._validate = function(e) {
      if (!e) throw c.illegalArgument("can not be falsy");
    };

    return e;
  }();
  t.AbstractDescriptor = d;
  var h = function(e) {
    function t(t) {
      for (var n = [], i = 0; i < arguments.length - 1; i++) {
        n[i] = arguments[i + 1];
      }
      e.call(this, n);

      this._ctor = t;
    }
    __extends(t, e);

    Object.defineProperty(t.prototype, "ctor", {
      get: function() {
        return this._ctor;
      },
      enumerable: !0,
      configurable: !0
    });

    t.prototype.equals = function(e) {
      return e === this ? !0 : e instanceof t ? e.ctor === this.ctor : !1;
    };

    t.prototype.hashCode = function() {
      return 61 * (1 + this.ctor.length);
    };

    return t;
  }(d);
  t.SyncDescriptor = h;
  var p = function(e) {
    function t(t, n) {
      for (var i = [], o = 0; o < arguments.length - 2; o++) {
        i[o] = arguments[o + 2];
      }
      e.call(this, i);

      this._moduleName = t;

      this._functionName = n;
    }
    __extends(t, e);

    Object.defineProperty(t.prototype, "moduleName", {
      get: function() {
        return this._moduleName;
      },
      enumerable: !0,
      configurable: !0
    });

    Object.defineProperty(t.prototype, "functionName", {
      get: function() {
        return this._functionName;
      },
      enumerable: !0,
      configurable: !0
    });

    t.prototype.equals = function(e) {
      return e === this ? !0 : e instanceof t ? e.moduleName === this.moduleName && e.functionName === this.functionName : !
        1;
    };

    t.prototype.hashCode = function() {
      return l.computeMurmur2StringHashCode(this.moduleName) * l.computeMurmur2StringHashCode(this.functionName);
    };

    return t;
  }(d);
  t.AsyncDescriptor = p;
  var f = function() {
    function e(e, t, n) {
      if ("undefined" == typeof n) {
        n = {};
      }

      this.workspace = e;

      this.configuration = t;

      this.options = n;
    }
    e.prototype.getWorkspace = function() {
      return this.workspace;
    };

    e.prototype.getConfiguration = function() {
      return this.configuration;
    };

    e.prototype.getOptions = function() {
      return this.options;
    };

    return e;
  }();
  t.BaseContextService = f;
  var g = function() {
    function e() {}
    e.prototype.injectTelemetryService = function(e) {
      this._telemetryService = e;
    };

    Object.defineProperty(e.prototype, "telemetryService", {
      get: function() {
        return this._telemetryService;
      },
      enumerable: !0,
      configurable: !0
    });

    e.prototype.injectContextService = function(e) {
      if (!this.contextService)
        if (this.contextService = e, this.contextService.getConfiguration()) {
          this.origin = this.contextService.getConfiguration().paths.PUBLIC_WORKSPACE_URL;
          var t = (new r.URL(this.origin)).getPath();
          if (t && t.length > 0) {
            this.origin = this.origin.substring(0, this.origin.length - t.length + 1);
          }

          if (!o.endsWith(this.origin, "/")) {
            this.origin += "/";
          }
        } else {
          this.origin = "/";
        }
    };

    e.prototype.getRequestUrl = function(e, t, n) {
      var i = this.contextService.getWorkspace();
      if (i[e]) {
        var r = i[e] + o.normalizePath(t);
        return n ? this.origin + o.ltrim(r, "/") : r;
      }
      return null;
    };

    e.prototype.getPath = function(e, t) {
      var n = this.getRequestUrl(e, "/", !0);
      if (!n) {
        return null;
      }
      var i = t.toExternal().indexOf(n);
      return 0 === i ? t.toExternal().substr(n.length - 1) : null;
    };

    e.prototype.getAdditionalHeaders = function() {
      return this.contextService.getConfiguration().additionalHeaders || {};
    };

    e.prototype.supportsPrivateChannel = function() {
      return !1;
    };

    e.prototype.establishPrivateChannel = function() {
      return n.Promise.wrapError("Not Implemented");
    };

    e.prototype.supportsRemoteEvents = function() {
      return !1;
    };

    e.prototype.addRemoteListener = function() {
      throw new Error("Not Implemented");
    };

    e.prototype.makeRequest = function(e) {
      var t = a.nullEvent;
      e.headers = u.mixin(e.headers, this.getAdditionalHeaders());

      this._telemetryService && (t = this._telemetryService.start("WorkbenchXHR", {
        url: e.url
      }, !1));

      return i.always(n.xhr(e), function(e) {
        if (t.data) {
          t.data.status = e.status;
        }

        t.stop();
      });
    };

    e.prototype.makeChunkedRequest = function(e) {
      function t(e) {
        for (var t, n, i = 0, o = {};;) {
          if (t = e.indexOf(":", i), n = e.indexOf("\n", t + 1), 0 > t || 0 > n) break;
          o[e.substring(i, t).trim()] = e.substring(t + 1, n).trim();

          i = n + 1;
        }
        return o;
      }

      function i(e) {
        if (c) {
          r("canceled");
          return void 0;
        }
        var n = e.indexOf("\r\n\r\n", u);
        if (-1 !== n) {
          for (var i = []; - 1 !== n;) {
            var o = t(e.substring(u, n));

            var a = Number(o["Content-Length"]);
            if (n + 4 + a > e.length) break;
            var d = {
              header: o,
              body: e.substr(n + 4, a)
            };
            l.push(d);

            i.push(d);

            u = n + 4 + a;

            n = e.indexOf("\r\n\r\n", u);
          }
          s(i);
        }
      }
      var o;

      var r;

      var s;

      var a = this;

      var u = 0;

      var l = [];

      var c = !1;
      return new n.Promise(function(t, n, u) {
        o = t;

        r = n;

        s = u;

        a.makeRequest(e).done(function(e) {
          i(e.responseText);

          o(l);
        }, function(e) {
          r(e);
        }, function(e) {
          if (3 === e.readyState) {
            i(e.responseText);
          }
        });
      }, function() {
        c = !0;
      });
    };

    return e;
  }();
  t.BaseRequestService = g;

  (function(e) {
    e[e.GLOBAL = 0] = "GLOBAL";

    e[e.WORKSPACE = 1] = "WORKSPACE";
  })(t.StorageScope || (t.StorageScope = {}));
  t.StorageScope;
  ! function(e) {
    e[e.LEFT = 0] = "LEFT";

    e[e.CENTER = 1] = "CENTER";

    e[e.RIGHT = 2] = "RIGHT";
  }(t.Position || (t.Position = {}));
  t.Position;
  t.POSITIONS = [0, 1, 2];
  var m = function() {
    function e(e) {
      this._selection = e || [];
    }
    Object.defineProperty(e.prototype, "selection", {
      get: function() {
        return this._selection;
      },
      enumerable: !0,
      configurable: !0
    });

    e.prototype.isEmpty = function() {
      return 0 === this._selection.length;
    };

    e.EMPTY = new e([]);

    return e;
  }();
  t.Selection = m;
  var v = function(e) {
    function t() {
      e.apply(this, arguments);
    }
    __extends(t, e);

    t.prototype.toArray = function() {
      return this.selection;
    };

    return t;
  }(m);
  t.StructuredSelection = v;

  (function(e) {
    e[e.Info = 0] = "Info";

    e[e.Warning = 1] = "Warning";

    e[e.Error = 2] = "Error";
  })(t.Severity || (t.Severity = {}));
  var y = (t.Severity, function() {
    function e() {}
    e.SERVICE_CHANGED = "service-changed";

    e.SET_CHANGED = "set-changed";

    e.SET_ADDED = "set-added";

    e.SET_REMOVED = "set-removed";

    return e;
  }());
  t.MarkerServiceConstants = y;
  var _ = function() {
    function e() {}
    e.UPDATED = "update";

    return e;
  }();
  t.ExperimentServiceEventTypes = _;
  var b = function(e) {
    function t(t, n, i) {
      e.call(this);

      this._id = t;

      this._name = n;

      this._description = i;

      this._enabled = !1;
    }
    __extends(t, e);

    Object.defineProperty(t.prototype, "id", {
      get: function() {
        return this._id;
      },
      enumerable: !0,
      configurable: !0
    });

    Object.defineProperty(t.prototype, "name", {
      get: function() {
        return this._name;
      },
      enumerable: !0,
      configurable: !0
    });

    Object.defineProperty(t.prototype, "description", {
      get: function() {
        return this._description;
      },
      enumerable: !0,
      configurable: !0
    });

    Object.defineProperty(t.prototype, "enabled", {
      get: function() {
        return this._enabled;
      },
      set: function(e) {
        if (this._enabled !== e) {
          this._enabled = e;
          this.emit("enabled", this);
        }
      },
      enumerable: !0,
      configurable: !0
    });

    return t;
  }(s.EventEmitter);
  t.Experiment = b;
  var C = function() {
    function e() {}
    e.UPDATED = "update";

    e.FILE_CHANGE = "fileChange";

    return e;
  }();
  t.ConfigurationServiceEventTypes = C;

  t.ResourceEvents = {
    ADDED: "resource.added",
    REMOVED: "resource.removed",
    CHANGED: "resource.changed"
  };
});