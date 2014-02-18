var __extends = this.__extends || function(a, b) {
    function d() {
      this.constructor = a;
    }
    for (var c in b) {
      if (b.hasOwnProperty(c)) {
        a[c] = b[c];
      }
    }
    d.prototype = b.prototype;

    a.prototype = new d;
  };

define(["require", "exports", "vs/base/eventEmitter", "vs/base/types", "vs/platform/services",
  "vs/editor/core/model/mirrorModel"
], function(a, b, c, d, e, f) {
  var g = c;

  var h = d;

  var i = e;

  var j = f;

  var k = function(a) {
    function b() {
      a.call(this);

      this.data = {};

      this.linked = {};

      this.unbinds = {};
    }
    __extends(b, a);

    b.prototype.insert = function(a, b) {
      var c = this;

      var d = this.remove(a, b);

      var e = a.toString();
      this.data[e] = b;

      this.unbinds[e] = [];

      this.unbinds[e].push(b.addBulkListener(function(b) {
        c.emit(i.ResourceEvents.CHANGED, {
          url: a,
          originalEvents: b
        });
      }));

      this.emit(i.ResourceEvents.ADDED, {
        url: a,
        addedElement: b,
        removedElement: d
      });

      return d;
    };

    b.prototype.insertLinked = function(a, b, c) {
      if (!this.contains(a)) return;
      var d = a.toExternal();
      if (!this.linked.hasOwnProperty(d)) {
        this.linked[d] = {};
      }

      this.linked[d][b] = c;

      if (h.isFunction(c.onChange)) {
        this.unbinds[d].push(this.data[d].addBulkListener(function(a) {
          c.onChange(a);
        }));
      }
    };

    b.prototype.get = function(a) {
      return this.data[a.toString()] ? this.data[a.toString()] : null;
    };

    b.prototype.getLinked = function(a, b) {
      var c = a.toExternal();
      return this.data[c] ? this.linked.hasOwnProperty(c) ? this.linked[c].hasOwnProperty(b) ? this.linked[c][b] :
        null : null : null;
    };

    b.prototype.all = function() {
      var a = this;
      return Object.keys(this.data).map(function(b) {
        return a.data[b];
      });
    };

    b.prototype.allLinked = function() {
      var a = this;

      var b = [];
      Object.keys(this.linked).forEach(function(c) {
        Object.keys(a.linked[c]).forEach(function(d) {
          b.push(a.linked[c][d]);
        });
      });

      return b;
    };

    b.prototype.contains = function(a) {
      return !!this.data[a.toString()];
    };

    b.prototype.remove = function(a, b) {
      if (!this.contains(a)) {
        return !1;
      }
      var c = a.toString();

      var d = this.data[c][0];

      var e = 1;
      while (this.unbinds[c].length > 0) {
        this.unbinds[c].pop()();
      }
      for (var f in this.linked[c])
        if (this.linked.hasOwnProperty(f)) {
          var g = this.linked[c][f];
          if (h.isFunction(g.onRemove)) {
            g.onRemove();
          }
        }
      delete this.unbinds[c];

      delete this.linked[c];

      delete this.data[c];

      this.emit(i.ResourceEvents.REMOVED, {
        url: a,
        removedElement: d,
        addedElement: b
      });

      return !0;
    };

    return b;
  }(g.EventEmitter);
  b.ResourceService = k;
  var l = function(a) {
    function b() {
      a.apply(this, arguments);
    }
    __extends(b, a);

    b.prototype.injectDispatcherService = function(a) {
      a.register("modelInitialize", this.onModelInitialize.bind(this));

      a.register("modelDestroy", this.onModelDestroy.bind(this));

      a.register("modelEvents", this.onModelEvents.bind(this));
    };

    b.prototype.onModelInitialize = function(a, b, c, d, e) {
      var f = new j.MirrorModel(a, b, c, e, d);
      this.insert(e, f);
    };

    b.prototype.onModelDestroy = function(a) {
      this.remove(a);
    };

    b.prototype.onModelEvents = function(a, b) {
      var c = this.get(a);
      c.onEvents(b);
    };

    return b;
  }(k);
  b.WorkerResourceService = l;
});