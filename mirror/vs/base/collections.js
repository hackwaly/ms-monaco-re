define("vs/base/collections", ["require", "exports", "vs/base/errors"], function(e, t, n) {
  function i(e, t, n) {
    "undefined" == typeof n && (n = null);
    var i = String(t);
    return e.hasOwnProperty(i) ? e[i] : n;
  }

  function o(e, t, n) {
    var i = String(t);
    return e.hasOwnProperty(i) ? e[i] : (e[i] = n, n);
  }

  function r(e, t) {
    return e.hasOwnProperty(t);
  }

  function s(e) {
    return Object.keys(e);
  }

  function a(e) {
    var t = [];
    for (var n in e) e.hasOwnProperty(n) && t.push(e[n]);
    return t;
  }

  function u(e, t) {
    for (var n in e)
      if (e.hasOwnProperty(n)) {
        var i = t({
          key: n,
          value: e[n]
        }, function() {
          delete e[n];
        });
        if (i === !1) return;
      }
  }

  function l(e, t) {
    var n = new _(Math.min(4, Math.ceil(e.length / 4)));
    e.forEach(function(e) {
      var i = t(e);

      var o = n.lookup(i);
      o || (o = [], n.add(i, o));

      o.push(e);
    });

    return n;
  }

  function c(e) {
    return new f(e);
  }

  function d(e) {
    var n = e.length;
    return 0 === n ? t.EmptyIterable : 1 === n ? e[0] : {
      forEach: function(t) {
        for (var i = 0; n > i; i++) e[i].forEach(t);
      }
    };
  }

  function h(e) {
    return {
      forEach: function(t) {
        t(e);
      }
    };
  }
  t.lookup = i;

  t.lookupOrInsert = o;

  t.contains = r;

  t.keys = s;

  t.values = a;

  t.forEach = u;

  t.groupBy = l;

  t.fromArray = c;

  t.EmptyIterable = {
    forEach: function() {}
  };

  t.combine = d;

  t.singleton = h;
  var p = function() {
    function e() {}
    e.prototype.toArray = function(e, t) {
      "undefined" == typeof e && (e = new Array);

      "undefined" == typeof t && (t = 0);

      this.forEach(function(n) {
        e[t] = n;

        t += 1;
      });

      return e;
    };

    Object.defineProperty(e.prototype, "length", {
      get: function() {
        var e = 0;
        this.forEach(function() {
          e += 1;
        });

        return e;
      },
      enumerable: !0,
      configurable: !0
    });

    e.prototype.forEach = function() {
      throw n.notImplemented();
    };

    return e;
  }();
  t.AbstractCollection = p;
  var f = function(e) {
    function t(t) {
      e.call(this);

      this.data = t;
    }
    __extends(t, e);

    t.prototype.forEach = function(e) {
      for (var t = 0; t < this.data.length; t++) {
        var n = this.data[t];
        if (e(n) === !1) return;
      }
    };

    return t;
  }(p);
  t.ArrayCollection = f;
  var g = function(e) {
    function t() {
      e.apply(this, arguments);

      this._dict = new _;
    }
    __extends(t, e);

    t.prototype.forEach = function(e) {
      this._dict.forEach(function(t) {
        e(t.key);
      });
    };

    Object.defineProperty(t.prototype, "length", {
      get: function() {
        return this._dict.length;
      },
      enumerable: !0,
      configurable: !0
    });

    t.prototype.clear = function() {
      this._dict.clear();
    };

    t.prototype.add = function(e) {
      this._dict.add(e, !0);
    };

    t.prototype.remove = function(e) {
      var t = this.length;
      this._dict.remove(e);

      return t !== this.length;
    };

    t.prototype.contains = function(e) {
      return this._dict.containsKey(e);
    };

    return t;
  }(p);
  t.HashSet = g;
  var m = function(e) {
    function t(t) {
      e.call(this);

      this._dict = new v(t);
    }
    __extends(t, e);

    t.prototype.forEach = function(e) {
      this._dict.forEach(function(t) {
        e(t.key);
      });
    };

    Object.defineProperty(t.prototype, "length", {
      get: function() {
        return this._dict.length;
      },
      enumerable: !0,
      configurable: !0
    });

    t.prototype.clear = function() {
      this._dict.clear();
    };

    t.prototype.add = function(e) {
      this._dict.add(e, !0);
    };

    t.prototype.remove = function(e) {
      var t = this.length;
      this._dict.remove(e);

      return t !== this.length;
    };

    t.prototype.contains = function(e) {
      return this._dict.containsKey(e);
    };

    return t;
  }(p);
  t.DelegateHashSet = m;
  var v = function(e) {
    function t(t) {
      e.call(this);

      this.hashFn = t;

      this._data = {};

      this._count = 0;
    }
    __extends(t, e);

    t.prototype.forEach = function(e) {
      for (var t in this._data)
        if (this._data.hasOwnProperty(t)) {
          var n = this._data[t];
          if (e(n) === !1) return;
        }
    };

    Object.defineProperty(t.prototype, "length", {
      get: function() {
        return this._count;
      },
      enumerable: !0,
      configurable: !0
    });

    Object.defineProperty(t.prototype, "keys", {
      get: function() {
        var e = new Array;
        this.forEach(function(t) {
          e.push(t.key);
        });

        return new f(e);
      },
      enumerable: !0,
      configurable: !0
    });

    Object.defineProperty(t.prototype, "values", {
      get: function() {
        var e = new Array;
        this.forEach(function(t) {
          e.push(t.value);
        });

        return new f(e);
      },
      enumerable: !0,
      configurable: !0
    });

    t.prototype.clear = function() {
      this._data = {};

      this._count = 0;
    };

    t.prototype.add = function(e, t) {
      var n = this.hashFn(e);
      this._data.hasOwnProperty(n) || (this._count += 1);

      this._data[n] = {
        key: e,
        value: t
      };
    };

    t.prototype.lookup = function(e) {
      var t = this.hashFn(e);
      return this._data.hasOwnProperty(t) ? this._data[t].value : null;
    };

    t.prototype.remove = function(e) {
      var t = this.hashFn(e);
      this._data.hasOwnProperty(t) && (this._count -= 1, delete this._data[t]);
    };

    t.prototype.containsKey = function(e) {
      return this._data.hasOwnProperty(this.hashFn(e));
    };

    return t;
  }(p);
  t.DelegateDictionary = v;
  var y = function(e) {
    function t() {
      e.call(this, function(e) {
        return String(e);
      });
    }
    __extends(t, e);

    return t;
  }(v);
  t.StringDictionary = y;
  var _ = function(e) {
    function t(t) {
      "undefined" == typeof t && (t = 10);

      e.call(this);

      this.size = t;

      this._elements = new Array(this.size);

      this._count = 0;
    }
    __extends(t, e);

    t.wrap = function(e) {
      return null === e ? t.NULL_PLACEHOLDER : "undefined" == typeof e ? t.UNDEFINED_PLACEHOLDER : e;
    };

    t.unwrap = function(e) {
      return e === t.NULL_PLACEHOLDER ? null : e === t.UNDEFINED_PLACEHOLDER ? void 0 : e;
    };

    t.prototype.forEach = function(e) {
      for (var n = 0; n < this._elements.length; n++) {
        var i = this._elements[n];
        if ("undefined" != typeof i)
          for (var o = 0; o < i.length; o++) {
            var r = {
              key: t.unwrap(i[o].key),
              value: i[o].value
            };
            if (e(r) === !1) return;
          }
      }
    };

    Object.defineProperty(t.prototype, "length", {
      get: function() {
        return this._count;
      },
      enumerable: !0,
      configurable: !0
    });

    Object.defineProperty(t.prototype, "keys", {
      get: function() {
        var e = new Array;
        this.forEach(function(n) {
          e.push(t.unwrap(n.key));
        });

        return new f(e);
      },
      enumerable: !0,
      configurable: !0
    });

    Object.defineProperty(t.prototype, "values", {
      get: function() {
        var e = new Array;
        this.forEach(function(t) {
          e.push(t.value);
        });

        return new f(e);
      },
      enumerable: !0,
      configurable: !0
    });

    t.prototype.clear = function() {
      this._elements.length = 0;

      this._elements.length = this.size;

      this._count = 0;
    };

    t.prototype.add = function(e, n) {
      e = t.wrap(e);
      var i = this.indexOf(e);

      var o = this._elements[i];
      if ("undefined" == typeof o) this._elements[i] = [{
        key: e,
        value: n
      }];

      this._count += 1;
      else {
        for (var r = 0; r < o.length; r++)
          if (e.equals(o[r].key)) o[r].key = e;

        o[r].value = n;

        return void 0;
        o.push({
          key: e,
          value: n
        });

        this._count += 1;
      }
    };

    t.prototype.lookup = function(e) {
      e = t.wrap(e);
      var n = this.indexOf(e);

      var i = this._elements[n];
      if ("undefined" != typeof i)
        for (var o = 0; o < i.length; o++)
          if (e.equals(i[o].key)) return i[o].value;
      return null;
    };

    t.prototype.remove = function(e) {
      e = t.wrap(e);
      var n = this.indexOf(e);

      var i = this._elements[n];
      if ("undefined" != typeof i)
        for (var o = 0; o < i.length; o++)
          if (e.equals(i[o].key)) i.splice(o, 1);

      this._count -= 1;

      return !0;
      return !1;
    };

    t.prototype.containsKey = function(e) {
      e = t.wrap(e);
      var n = this.indexOf(e);

      var i = this._elements[n];
      if ("undefined" != typeof i)
        for (var o = 0; o < i.length; o++)
          if (e.equals(i[o].key)) return !0;
      return !1;
    };

    t.prototype.indexOf = function(e) {
      return e.hashCode() % this._elements.length;
    };

    t.UNDEFINED_PLACEHOLDER = {
      hashCode: function() {
        return 0;
      },
      equals: function(e) {
        return t.UNDEFINED_PLACEHOLDER === e;
      }
    };

    t.NULL_PLACEHOLDER = {
      hashCode: function() {
        return 0;
      },
      equals: function(e) {
        return t.NULL_PLACEHOLDER === e;
      }
    };

    return t;
  }(p);
  t.Dictionary = _;
});