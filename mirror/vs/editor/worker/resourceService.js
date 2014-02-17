define('vs/editor/worker/resourceService', [
  'require',
  'exports',
  'vs/base/eventEmitter',
  'vs/base/types',
  'vs/platform/services',
  'vs/editor/core/model/mirrorModel'
], function(e, t, n, i, o, r) {
  var s = function(e) {
    function t() {
      e.call(this), this.data = {}, this.linked = {}, this.unbinds = {};
    }
    return __extends(t, e), t.prototype.insert = function(e, t) {
      var n = this,
        i = this.remove(e, t),
        r = e.toString();
      return this.data[r] = t, this.unbinds[r] = [], this.unbinds[r].push(t.addBulkListener(function(t) {
        n.emit(o.ResourceEvents.CHANGED, {
          url: e,
          originalEvents: t
        });
      })), this.emit(o.ResourceEvents.ADDED, {
        url: e,
        addedElement: t,
        removedElement: i
      }), i;
    }, t.prototype.insertLinked = function(e, t, n) {
      if (this.contains(e)) {
        var o = e.toExternal();
        this.linked.hasOwnProperty(o) || (this.linked[o] = {}), this.linked[o][t] = n, i.isFunction(n.onChange) &&
          this.unbinds[o].push(this.data[o].addBulkListener(function(e) {
            n.onChange(e);
          }));
      }
    }, t.prototype.get = function(e) {
      return this.data[e.toString()] ? this.data[e.toString()] : null;
    }, t.prototype.getLinked = function(e, t) {
      var n = e.toExternal();
      return this.data[n] ? this.linked.hasOwnProperty(n) ? this.linked[n].hasOwnProperty(t) ? this.linked[n][t] :
        null : null : null;
    }, t.prototype.all = function() {
      var e = this;
      return Object.keys(this.data).map(function(t) {
        return e.data[t];
      });
    }, t.prototype.allLinked = function() {
      var e = this,
        t = [];
      return Object.keys(this.linked).forEach(function(n) {
        Object.keys(e.linked[n]).forEach(function(i) {
          t.push(e.linked[n][i]);
        });
      }), t;
    }, t.prototype.contains = function(e) {
      return !!this.data[e.toString()];
    }, t.prototype.remove = function(e, t) {
      if (!this.contains(e))
        return !1;
      for (var n = e.toString(), r = this.data[n][0]; this.unbinds[n].length > 0;)
        this.unbinds[n].pop()();
      for (var s in this.linked[n])
        if (this.linked.hasOwnProperty(s)) {
          var a = this.linked[n][s];
          i.isFunction(a.onRemove) && a.onRemove();
        }
      return delete this.unbinds[n], delete this.linked[n], delete this.data[n], this.emit(o.ResourceEvents.REMOVED, {
        url: e,
        removedElement: r,
        addedElement: t
      }), !0;
    }, t;
  }(n.EventEmitter);
  t.ResourceService = s;
  var a = function(e) {
    function t() {
      e.apply(this, arguments);
    }
    return __extends(t, e), t.prototype.injectDispatcherService = function(e) {
      e.register('modelInitialize', this.onModelInitialize.bind(this)), e.register('modelDestroy', this.onModelDestroy
        .bind(this)), e.register('modelEvents', this.onModelEvents.bind(this));
    }, t.prototype.onModelInitialize = function(e, t, n, i) {
      var o = new r.MirrorModel(e, t, i, n);
      this.insert(i, o);
    }, t.prototype.onModelDestroy = function(e) {
      this.remove(e);
    }, t.prototype.onModelEvents = function(e, t) {
      var n = this.get(e);
      n.onEvents(t);
    }, t;
  }(s);
  t.WorkerResourceService = a;
})