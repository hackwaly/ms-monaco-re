define('vs/editor/worker/dispatcherService', [
  'require',
  'exports',
  'vs/base/lib/winjs.base',
  'vs/base/types',
  'vs/base/network'
], function(e, t, n, i, o) {
  var r = function() {
    function e() {
      this.table = {};
    }
    return e.prototype.register = function(e) {
      if (i.isString(e))
        this.table[e] = arguments[1];
      else
        for (var t in e) {
          var n = e[t];
          i.isFunction(n) && (this.table[t] = n.bind(e));
        }
    }, e.prototype.dispatch = function(e) {
      if (!this.table[e.type])
        return n.Promise.wrapError(new Error('no handler/route for: ' + e.type));
      try {
        var t = this.deserialize(e.payload),
          i = this.table[e.type].apply(this.table[e.type], t);
        return n.Promise.is(i) ? i : n.Promise.as(i);
      } catch (o) {
        return n.Promise.wrapError(o);
      }
    }, e.prototype.deserialize = function(e) {
      for (var t = [], n = 0; n < e.length; n++) {
        var r = e[n];
        !i.isUndefinedOrNull(r) && i.isString(r.$url) && (r = new o.URL(r.$url)), t.push(r);
      }
      return t;
    }, e;
  }();
  t.DispatcherService = r;
})