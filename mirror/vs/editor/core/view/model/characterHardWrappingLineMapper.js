define("vs/editor/core/view/model/characterHardWrappingLineMapper", ["require", "exports",
  "vs/editor/core/view/model/prefixSumComputer"
], function(e, t, n) {
  function i(e, t, n) {
    var i;

    var o = [];

    var u = 0;

    var l = e + t + n;
    for (i = 0; i < l.length; i++) {
      u = Math.max(u, l.charCodeAt(i));
    }
    for (i = 0; u >= i; i++) {
      o[i] = 0;
    }
    for (i = 0; i < e.length; i++) {
      o[e.charCodeAt(i)] = r;
    }
    for (i = 0; i < t.length; i++) {
      o[t.charCodeAt(i)] = s;
    }
    for (i = 0; i < n.length; i++) {
      o[n.charCodeAt(i)] = a;
    }
    return o;
  }
  var o = {
    index: -1,
    remainder: -1
  };

  var r = 1;

  var s = 2;

  var a = 3;

  var u = function() {
    function e(e, t, n, i) {
      this.characterClasses = e;

      this.lineText = t;

      this.tabSize = n;

      this.wrappingColumn = i;

      this.prefixSums = null;

      this.computeMapping();
    }
    e.prototype.setLineText = function(e) {
      this.lineText = e;

      this.computeMapping();
    };

    e.prototype.setWrappingColumn = function(e) {
      this.wrappingColumn = e;

      this.computeMapping();
    };

    e.prototype.setTabSize = function(e) {
      this.tabSize = e;

      this.computeMapping();
    };

    e.nextVisibleColumn = function(e, t, n) {
      return n ? e + (t - e % t) : e + 1;
    };

    e.prototype.computeMapping = function() {
      if (-1 === this.wrappingColumn) {
        this.prefixSums = null;
        return void 0;
      }
      var t;

      var i;

      var o;

      var u;

      var l;

      var c;

      var d;

      var h;

      var p = this.characterClasses;

      var f = this.lineText;

      var g = this.tabSize;

      var m = this.wrappingColumn;

      var v = "	".charCodeAt(0);

      var y = 0;

      var _ = [];

      var b = 0;

      var C = -1;

      var w = 0;

      var E = -1;

      var S = 0;
      for (o = 0, t = 0, i = f.length; i > t; t++) {
        u = f.charCodeAt(t);
        l = u === v;
        c = u < p.length ? p[u] : 0;
        if (c === r) {
          C = t;
          w = 0;
        }
        o = e.nextVisibleColumn(o, g, l);
        if (o > m && 0 !== t) {
          if (-1 !== C) {
            d = C;
            h = w;
          } else {
            if (-1 !== E) {
              d = E;
              h = S;
            } else {
              d = t;
              h = 0;
            }
          }
          _[b++] = d - y;
          y = d;
          o = e.nextVisibleColumn(h, g, l);
          C = -1;
          w = 0;
          E = -1;
          S = 0;
        }
        if (-1 !== C) {
          w = e.nextVisibleColumn(w, g, l);
        }
        if (-1 !== E) {
          S = e.nextVisibleColumn(S, g, l);
        }
        if (c === s) {
          C = t + 1;
          w = 0;
        }
        if (c === a) {
          E = t + 1;
          S = 0;
        }
      }
      _[b++] = i - y;

      this.prefixSums = new n.PrefixSumComputer(_);
    };

    e.prototype.getOutputLineCount = function() {
      return -1 === this.wrappingColumn ? 1 : this.prefixSums.getCount();
    };

    e.prototype.getInputOffsetOfOutputPosition = function(e, t) {
      return -1 === this.wrappingColumn ? t : 0 === e ? t : this.prefixSums.getAccumulatedValue(e - 1) + t;
    };

    e.prototype.getOutputPositionOfInputOffset = function(e, t) {
      return -1 === this.wrappingColumn ? (t.outputLineIndex = 0, t.outputOffset = e, void 0) : (this.prefixSums.getIndexOf(
        e, o), t.outputLineIndex = o.index, t.outputOffset = o.remainder, void 0);
    };

    return e;
  }();
  t.CharacterHardWrappingLineMapper = u;
  var l = function() {
    function e(e, t, n) {
      this.characterClasses = i(e, t, n);
    }
    e.prototype.createLineMapper = function(e, t, n) {
      return new u(this.characterClasses, e, t, n);
    };

    return e;
  }();
  t.CharacterHardWrappingLineMapperFactory = l;
});