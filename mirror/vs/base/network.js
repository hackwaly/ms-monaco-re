define("vs/base/network", ["require", "exports", "./assert", "./hash", "./strings", "./types"], function(e, t, n, i, o,
  r) {
  function s(e) {
    var t = window.location.search;
    if (t) {
      t = t.substring(1);
      for (var n = t.split("&"), i = 0; i < n.length; i++) {
        var o = n[i];
        if (o.indexOf("=") >= 0) {
          var r = o.split("=");
          if (decodeURIComponent(r[0]) === e && r.length > 1) {
            return decodeURIComponent(r[1]);
          }
        } else if (decodeURIComponent(o) === e) {
          return "true";
        }
      }
    }
    return null;
  }

  function a(e, t, n) {
    var i = e.indexOf(t);

    var r = e.indexOf(n, i + t.length);
    if (i >= 0 && r >= 0) {
      var s = e.substring(i, r + n.length);

      var a = t + "//" + n;
      if (s !== a) {
        var u = new RegExp(o.escapeRegExpCharacters(s), "gi");
        return function(e) {
          return e ? e.replace(u, a) : e;
        };
      }
    }
    return function(e) {
      return e;
    };
  }
  var u = function() {
    function e(e) {
      n.ok( !! e, "spec must not be null");

      this._spec = e;
    }
    e.fromEncoded = function(t) {
      return new e(decodeURIComponent(t));
    };

    e.fromValue = function(t) {
      return new e(t);
    };

    e.prototype.equals = function(t) {
      return t instanceof e && t._spec === this._spec;
    };

    e.prototype.hashCode = function() {
      return i.computeMurmur2StringHashCode(this._spec);
    };

    e.prototype.toJSON = function() {
      return {
        $url: this._spec
      };
    };

    e.prototype.toExternal = function() {
      return this._spec;
    };

    e.prototype.toString = function() {
      return this._spec;
    };

    e.prototype.getScheme = function() {
      "undefined" == typeof this._scheme && (this._scheme = this._doGetScheme());

      return this._scheme;
    };

    e.prototype._doGetScheme = function() {
      var e = this._spec.indexOf(":");
      return -1 === e ? null : this._spec.substring(0, e);
    };

    e.prototype.getPath = function() {
      "undefined" == typeof this._path && (this._path = this._doGetPath());

      return this._path;
    };

    e.prototype._doGetPath = function() {
      for (var e = 0, t = -1, n = 0, i = this._spec.length; i > n; n++) {
        var o = this._spec.charAt(n);
        switch (o) {
          case "/":
            3 === ++e && (t = n);
            break;
          case "?":
          case "#":
            return -1 === t ? null : this._spec.substring(t, n);
        }
      }
      return -1 === t ? null : t === this._spec.length - 1 ? "" : this._spec.substring(t);
    };

    return e;
  }();
  t.URL = u;

  t.getQueryValue = s;

  t._createBasicAuthRemover = a;

  t.getBasicAuthRemover = r.runOnce(function() {
    var e = null;
    try {
      throw new Error;
    } catch (n) {
      e = n.stack;
    }
    if (e) {
      var i = e.split("\n")[0];
      return t._createBasicAuthRemover(i, self.location.protocol, self.location.hostname);
    }
    return function(e) {
      return e;
    };
  });

  (function(e) {
    e.inMemory = "inMemory";
  })(t.schemas || (t.schemas = {}));
  t.schemas;
});