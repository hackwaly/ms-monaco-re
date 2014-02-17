define('vs/base/injector', [
  'require',
  'exports',
  'vs/base/assert',
  'vs/base/types'
], function(e, t, n, i) {
  var o = 'inject',
    r = o.length,
    s = function() {
      function e() {
        this.map = {}, this.parent = null;
      }
      return e.prototype.setParent = function(e) {
        this.parent = e;
      }, e.prototype.registerService = function(e, t) {
        return n.ok(!i.isUndefinedOrNull(e)), n.ok(!i.isUndefinedOrNull(t)), this.map[e.toLowerCase()] = t, t;
      }, e.prototype.injectTo = function(e) {
        var t = this;
        n.ok(!i.isUndefinedOrNull(e));
        var s = !1;
        if (i.isArray(e))
          return e.forEach(function(e) {
            s = t.injectTo(e) || s;
          }), s;
        for (var a in e)
          if (0 === a.indexOf(o)) {
            var u = e[a];
            if (i.isFunction(u)) {
              a = a.substring(r).toLowerCase();
              var l = this.findService(a, e);
              i.isUndefinedOrNull(l) || (u.apply(e, [l]), s = !0);
            }
          }
        return s;
      }, e.prototype.createChild = function() {
        var t = new e();
        return t.setParent(this), t;
      }, e.prototype.findService = function(e, t) {
        'undefined' == typeof t && (t = null);
        var n = this.map[e];
        return !i.isUndefinedOrNull(n) && t !== n || null === this.parent || (n = this.parent.findService(e, t)), n;
      }, e.prototype.dispose = function() {
        this.map = null, this.parent = null;
      }, e;
    }();
  t.Container = s;
})