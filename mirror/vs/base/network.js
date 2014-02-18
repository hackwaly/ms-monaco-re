define(["require", "exports", "./assert"], function(a, b, c) {
  function f(a) {
    var b = window.location.search;
    if (b) {
      b = b.substring(1);
      var c = b.split("&");
      for (var d = 0; d < c.length; d++) {
        var e = c[d];
        if (e.indexOf("=") >= 0) {
          var f = e.split("=");
          if (decodeURIComponent(f[0]) === a && f.length > 1) {
            return decodeURIComponent(f[1]);
          }
        } else if (decodeURIComponent(e) === a) {
          return "true";
        }
      }
    }
    return null;
  }
  var d = c;

  var e = function() {
    function a(a) {
      d.ok( !! a, "spec must not be null");

      this.spec = a;

      this.scheme = undefined;
    }
    a.prototype.toJSON = function() {
      return {
        $url: this.spec
      };
    };

    a.prototype.toExternal = function() {
      return this.spec;
    };

    a.prototype.toString = function() {
      return this.spec;
    };

    a.prototype.getScheme = function() {
      this.scheme === undefined && (this.scheme = this.doGetScheme());

      return this.scheme;
    };

    a.prototype.doGetScheme = function() {
      var a = this.spec.indexOf(":");
      return a === -1 ? null : this.spec.substring(0, a);
    };

    a.prototype.getPath = function() {
      var a = 0;

      var b = -1;
      for (var c = 0, d = this.spec.length; c < d; c++) {
        var e = this.spec.charAt(c);
        switch (e) {
          case "/":
            if (++a === 3) {
              b = c;
            }
            break;
          case "?":
          case "#":
            if (b === -1) {
              return null;
            }
            return this.spec.substring(b, c);
        }
      }
      return b === -1 ? null : b === this.spec.length - 1 ? "" : this.spec.substring(b);
    };

    return a;
  }();
  b.URL = e;

  b.getQueryValue = f;

  (function(a) {
    a.inMemory = "inMemory";
  })(b.schemas || (b.schemas = {}));
  var g = b.schemas;
});