define("vs/languages/typescript/resources/dependencyResolverGraph", ["require", "exports", "vs/base/lib/winjs.base",
  "vs/base/strings", "vs/base/env", "vs/base/collections", "vs/base/network", "./remoteModels",
  "../service/references", "./dependencyResolverFiles", "./dependencyResolver"
], function(e, t, n, r, i, o, s, a, l, c, u) {
  var p;
  ! function(e) {
    function t(e) {
      for (var t, n, r = 0, i = {};;) {
        if (t = e.indexOf(":", r), n = e.indexOf("\n", t + 1), 0 > t || 0 > n) break;
        i[e.substring(r, t).trim()] = e.substring(t + 1, n).trim();

        r = n + 1;
      }
      return i;
    }

    function r(e, r) {
      function o(e) {
        if (p) {
          a("canceled");
          return void 0;
        }
        var n = e.indexOf("\r\n\r\n", c);
        if (-1 !== n) {
          var r = t(e.substring(c, n));

          var i = Number(r["Content-Length"]);
          if (!(n + 4 + i > e.length)) {
            u.push({
              header: r,
              body: e.substr(n + 4, i)
            });
            l(u[u.length - 1]);
            c = n + 4 + i;
            o(e);
          }
        }
      }
      var s;

      var a;

      var l;

      var c = 0;

      var u = [];

      var p = !1;

      var h = new n.Promise(function(e, t, n) {
        s = e;

        a = t;

        l = n;
      }, function() {
        p = !0;
      });
      e.makeRequest(r).then(function(e) {
        o(e.responseText);

        s(u);
      }, function(e) {
        a(e);
      }, function(e) {
        if (!i.browser.isIE10orEarlier) {
          if (3 === e.readyState) {
            o(e.responseText);
          }
        }
      }).done(null, function(e) {
        a(e);
      });

      return h;
    }
    e.parseHeader = t;

    e.fetchChunkedData = r;
  }(p || (p = {}));
  var h = function(e) {
    function t(t, n, i, o, s) {
      e.call(this, o, s);

      this._moduleType = t;

      this._basePath = n;

      this._markerService = i;

      this._moduleType = this._moduleType || r.empty;

      this._basePath = this._basePath || r.empty;
    }
    __extends(t, e);

    t.prototype._doFetchDependencies = function(e) {
      var t;

      var r = this;

      var i = this._requestUrl(e, "typeScriptDependencyGraph");
      return this._requestService.makeRequest({
        url: i
      }).then(function(t) {
        var n = r._parseGraph(JSON.parse(t.responseText));

        var i = c.collectDependenciesAndErrors(n, e);

        var s = r._requestService.getPath("root", e);
        r._markerService.createPublisher().changeMarkers(e, function(e) {
          o.lookup(i.errors, s, []).forEach(function(t) {
            return e.addMarker(t);
          });
        });

        return i.resources;
      }).then(function(e) {
        t = e;
        for (var i = [], o = 0; o < e.length; o++) {
          if (!r._resourceService.contains(e[o])) {
            i.push(r._requestService.getPath("root", e[o]));
          }
        }
        return 0 === i.length ? n.Promise.as(e) : p.fetchChunkedData(r._requestService, {
          type: "POST",
          url: r._requestService.getRequestUrl("typeScriptFiles"),
          headers: {
            "Content-Type": "application/json"
          },
          data: JSON.stringify(i)
        });
      }).then(function() {
        return t;
      }, function() {
        return t;
      }, function(e) {
        if ("undefined" == typeof e.header.IsError) {
          var t = e.header.Path;

          var n = s.URL.fromEncoded(r._requestService.getRequestUrl("root", t, !0));

          var i = new a.RemoteModel(n, e.body);
          if (!r._resourceService.contains(n)) {
            r._resourceService.insert(n, i);
          }
        }
      });
    };

    t.prototype._requestUrl = function(e, t) {
      var n = this._requestService.getPath("root", e);

      var i = [];
      i.push(this._requestService.getRequestUrl(t, n));

      i.push(r.format("?type={0}", encodeURIComponent(this._moduleType)));

      i.push(r.format("&baseurl={0}", encodeURIComponent(this._basePath)));

      return i.join(r.empty);
    };

    t.prototype._parseGraph = function(e) {
      for (var t = this._requestService.getRequestUrl("root", "", !0), n = Object.keys(e.i), r = 0; r < n.length; r++) {
        if (0 !== e.i[n[r]].indexOf("error:")) {
          e.i[n[r]] = t + e.i[n[r]].substring(1);
        }
      }
      return l.Graph.fromJSON(e);
    };

    return t;
  }(u.AbstractDependencyResolver);
  t.GraphBasedResolver = h;
});