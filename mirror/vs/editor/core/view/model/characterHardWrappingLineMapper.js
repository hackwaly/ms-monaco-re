define(["require", "exports", "vs/editor/core/view/model/prefixSumComputer"], function(a, b, c) {
  function j(a, b, c) {
    var d = [];

    var e = 0;

    var f = a + b + c;

    var j;
    for (j = 0; j < f.length; j++) {
      e = Math.max(e, f.charCodeAt(j));
    }
    for (j = 0; j <= e; j++) {
      d[j] = 0;
    }
    for (j = 0; j < a.length; j++) {
      d[a.charCodeAt(j)] = g;
    }
    for (j = 0; j < b.length; j++) {
      d[b.charCodeAt(j)] = h;
    }
    for (j = 0; j < c.length; j++) {
      d[c.charCodeAt(j)] = i;
    }
    return d;
  }
  var d = c;

  var e = {
    index: -1,
    remainder: -1
  };

  var f = "	".charCodeAt(0);

  var g = 1;

  var h = 2;

  var i = 3;

  var k = function() {
    function a(a, b, c, d) {
      this.characterClasses = a;

      this.lineText = b;

      this.tabSize = c;

      this.wrappingColumn = d;

      this.prefixSums = null;

      this.computeMapping();
    }
    a.prototype.setLineText = function(a) {
      this.lineText = a;

      this.computeMapping();
    };

    a.prototype.setWrappingColumn = function(a) {
      this.wrappingColumn = a;

      this.computeMapping();
    };

    a.prototype.setTabSize = function(a) {
      this.tabSize = a;

      this.computeMapping();
    };

    a.nextVisibleColumn = function(a, b, c) {
      return c ? a + (b - a % b) : a + 1;
    };

    a.prototype.computeMapping = function() {
      if (this.wrappingColumn === -1) {
        this.prefixSums = null;
        return;
      }
      var b = this.characterClasses;

      var c = this.lineText;

      var e = this.tabSize;

      var f = this.wrappingColumn;

      var j = "	".charCodeAt(0);

      var k = 0;

      var l = [];

      var m = 0;

      var n;

      var o;

      var p;

      var q;

      var r;

      var s;

      var t;

      var u;

      var v = -1;

      var w = 0;

      var x = -1;

      var y = 0;
      p = 0;
      for (n = 0, o = c.length; n < o; n++) {
        q = c.charCodeAt(n);
        r = q === j;
        s = q < b.length ? b[q] : 0;
        if (s === g) {
          v = n;
          w = 0;
        }
        p = a.nextVisibleColumn(p, e, r);
        if (p > f && n !== 0) {
          if (v !== -1) {
            t = v;
            u = w;
          } else {
            if (x !== -1) {
              t = x;
              u = y;
            } else {
              t = n;
              u = 0;
            }
          }
          l[m++] = t - k;
          k = t;
          p = a.nextVisibleColumn(u, e, r);
          v = -1;
          w = 0;
          x = -1;
          y = 0;
        }
        if (v !== -1) {
          w = a.nextVisibleColumn(w, e, r);
        }
        if (x !== -1) {
          y = a.nextVisibleColumn(y, e, r);
        }
        if (s === h) {
          v = n + 1;
          w = 0;
        }
        if (s === i) {
          x = n + 1;
          y = 0;
        }
      }
      l[m++] = o - k;

      this.prefixSums = new d.PrefixSumComputer(l);
    };

    a.prototype.getOutputLineCount = function() {
      return this.wrappingColumn === -1 ? 1 : this.prefixSums.getCount();
    };

    a.prototype.getInputOffsetOfOutputPosition = function(a, b) {
      return this.wrappingColumn === -1 ? b : a === 0 ? b : this.prefixSums.getAccumulatedValue(a - 1) + b;
    };

    a.prototype.getOutputPositionOfInputOffset = function(a, b) {
      if (this.wrappingColumn === -1) {
        b.outputLineIndex = 0;

        b.outputOffset = a;
        return;
      }
      this.prefixSums.getIndexOf(a, e);

      b.outputLineIndex = e.index;

      b.outputOffset = e.remainder;
    };

    a.SEARCH_RANGE_RATIO = .2;

    return a;
  }();
  b.CharacterHardWrappingLineMapper = k;
  var l = function() {
    function a(a, b, c) {
      this.characterClasses = j(a, b, c);
    }
    a.prototype.createLineMapper = function(a, b, c) {
      return new k(this.characterClasses, a, b, c);
    };

    return a;
  }();
  b.CharacterHardWrappingLineMapperFactory = l;
});