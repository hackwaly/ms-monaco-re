define('vs/platform/markers/markers', [
  'require',
  'exports',
  'vs/base/assert',
  'vs/base/network'
], function(e, t, n, i) {
  function o(e) {
    var t = e;
    return 'string' == typeof t.type && 'number' == typeof t.severity && 'number' == typeof t.code && 'string' ==
      typeof t.text;
  }

  function r(e) {
    var n = e;
    return t.isITextMarker(e) && 'undefined' != typeof n.range;
  }

  function s(e) {
    var n = e;
    return t.isITextMarker(e) && 'number' == typeof n.offset && 'number' == typeof n.length;
  }

  function a(e) {
    var n = e;
    return t.isITextMarker(e) && 'number' == typeof n.lineNumber && 'number' == typeof n.column && 'number' == typeof n
      .length;
  }

  function u(e) {
    var n = e;
    return t.isITextMarker(e) && 'number' == typeof n.startLineNumber && 'number' == typeof n.startColumn && 'number' ==
      typeof n.endLineNumber && 'number' == typeof n.endColumn;
  }

  function l(e, t, n, i, o) {
    return {
      type: 'text',
      severity: e,
      code: t,
      text: n,
      offset: i,
      length: o
    };
  }

  function c(e, t, n, i) {
    return {
      type: 'text',
      severity: e,
      code: t,
      text: n,
      range: i
    };
  }

  function d(e) {
    return new y(e);
  }

  function h(e, t) {
    return t + '|' + e.toExternal();
  }

  function p(e, t) {
    return new b(e, t);
  }

  function f(e) {
    return b.fromJson(e);
  }

  function g(e, t) {
    var i = null;
    if (t) {
      if (n.ok(e.getAssociatedResource().toExternal() === t.getAssociatedResource().toExternal()), e.getId() === y.DEFAULT_GROUP)
        return i = new y(t.getAssociatedResource(), e.getMarkers()), t.getGroups().forEach(function(e) {
          i.addGroup(e);
        }), i;
      var o = new v(t, e.getId(), e.getMarkers()),
        r = t.getGroup(e.getId());
      return r ? (i = new y(t.getAssociatedResource(), t.getGroup(y.DEFAULT_GROUP).getMarkers()), t.getGroups().forEach(
        function(e) {
          e.getId() !== o.getId() && i.addGroup(e);
        }), i.addGroup(o), i) : (t.addGroup(o), t);
    }
    if (e.getId() === y.DEFAULT_GROUP)
      return new y(e.getAssociatedResource(), e.getMarkers());
    i = new y(e.getAssociatedResource());
    var s = new v(i, e.getId(), e.getMarkers());
    return i.addGroup(s), i;
  }
  t.isITextMarker = o, t.isIRangeTextMarker = r, t.isIOffsetLengthTextMarker = s, t.isILineLengthTextMarker = a, t.isILineColumnTextMarker =
    u, t.createTextMarker = l, t.createRangeTextMarker = c;
  var m = function() {
    function e(e) {
      'undefined' == typeof e && (e = []), this.markers = e;
    }
    return e.prototype.length = function() {
      return this.markers.length;
    }, e.prototype.markerAt = function(e) {
      return this.markers[e];
    }, e.prototype.getMarkers = function() {
      return this.markers.slice(0);
    }, e.prototype.forEach = function(e) {
      this.markers.forEach(e);
    }, e;
  }(),
    v = function(e) {
      function t(t, n, i) {
        'undefined' == typeof i && (i = []), e.call(this, i), this.owner = t, this.id = n;
      }
      return __extends(t, e), t.prototype.getAssociatedResource = function() {
        return this.owner.getAssociatedResource();
      }, t.prototype.getId = function() {
        return this.id;
      }, t;
    }(m),
    y = function(e) {
      function t(t, n) {
        'undefined' == typeof n && (n = []), e.call(this, n), this.resource = t, this.groups = [];
      }
      return __extends(t, e), t.prototype.getAssociatedResource = function() {
        return this.resource;
      }, t.prototype.getId = function() {
        return t.DEFAULT_GROUP;
      }, t.prototype.getMarkers = function() {
        var t = e.prototype.getMarkers.call(this);
        return this.groups.forEach(function(e) {
          t = t.concat(e.getMarkers());
        }), t;
      }, t.prototype.getGroups = function() {
        return this.groups.slice(0);
      }, t.prototype.getGroup = function(n) {
        if (t.DEFAULT_GROUP === n)
          return new v(this, this.getId(), e.prototype.getMarkers.call(this));
        for (var i = 0; i < this.groups.length; i++)
          if (this.groups[i].getId() === n)
            return this.groups[i];
        return null;
      }, t.prototype.addGroup = function(e) {
        n.ok(e.getId() !== t.DEFAULT_GROUP);
        var i = this.getGroup(e.getId());
        n.ok(null === i), this.groups.push(e);
      }, t.DEFAULT_GROUP = 'defaultGroup', t;
    }(m);
  t.createMarkerSet = d;
  var _ = [
    'type',
    'id'
  ],
    b = function() {
      function e(e, t) {
        this.resource = e, this.id = t, this.markers = [];
      }
      return e.prototype.getAssociatedResource = function() {
        return this.resource;
      }, e.prototype.getId = function() {
        return this.id;
      }, e.prototype.computeKey = function() {
        return this.id + '|' + this.resource.toExternal();
      }, e.prototype.length = function() {
        return this.markers.length;
      }, e.prototype.markerAt = function(e) {
        return this.markers[e];
      }, e.prototype.forEach = function(e) {
        this.markers.forEach(e);
      }, e.prototype.getMarkers = function() {
        return this.markers.slice(0);
      }, e.prototype.addMarker = function(e) {
        this.markers.push(e);
      }, e.prototype.toJson = function() {
        return {
          resource: this.resource.toExternal(),
          id: this.id,
          markers: this.markers.slice(0)
        };
      }, e.fromJson = function(t) {
        var n = new e(new i.URL(t.resource), t.id);
        n.markers = t.markers.slice(0);
        for (var o = {}, r = 0; r < n.markers.length; r++) {
          var s = n.markers[r];
          _.forEach(function(e) {
            var t = s[e],
              n = o[t];
            n ? s[e] = n : o[t] = t;
          });
        }
        return n;
      }, e;
    }();
  t.computeKey = h, t.createMarkerUpdate = p, t.createMarkerUpdateFromJson = f, t.processMarkerUpdate = g;
})