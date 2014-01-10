define(["require", "exports", "vs/editor/core/view/model/prefixSumComputer"], function(a, b, c) {
  function j(a, b, c) {
    var d = [],
      e = 0,
      f = a + b + c,
      j;
    for (j = 0; j < f.length; j++) e = Math.max(e, f.charCodeAt(j));
    for (j = 0; j <= e; j++) d[j] = 0;
    for (j = 0; j < a.length; j++) d[a.charCodeAt(j)] = g;
    for (j = 0; j < b.length; j++) d[b.charCodeAt(j)] = h;
    for (j = 0; j < c.length; j++) d[c.charCodeAt(j)] = i;
    return d
  }
  var d = c,
    e = {
      index: -1,
      remainder: -1
    }, f = "	".charCodeAt(0),
    g = 1,
    h = 2,
    i = 3,
    k = function() {
      function a(a, b, c, d) {
        this.characterClasses = a, this.lineText = b, this.tabSize = c, this.wrappingColumn = d, this.prefixSums =
          null, this.computeMapping()
      }
      return a.prototype.setLineText = function(a) {
        this.lineText = a, this.computeMapping()
      }, a.prototype.setWrappingColumn = function(a) {
        this.wrappingColumn = a, this.computeMapping()
      }, a.prototype.setTabSize = function(a) {
        this.tabSize = a, this.computeMapping()
      }, a.nextVisibleColumn = function(a, b, c) {
        return c ? a + (b - a % b) : a + 1
      }, a.prototype.computeMapping = function() {
        if (this.wrappingColumn === -1) {
          this.prefixSums = null;
          return
        }
        var b = this.characterClasses,
          c = this.lineText,
          e = this.tabSize,
          f = this.wrappingColumn,
          j = "	".charCodeAt(0),
          k = 0,
          l = [],
          m = 0,
          n, o, p, q, r, s, t, u, v = -1,
          w = 0,
          x = -1,
          y = 0;
        p = 0;
        for (n = 0, o = c.length; n < o; n++) q = c.charCodeAt(n), r = q === j, s = q < b.length ? b[q] : 0, s === g &&
          (v = n, w = 0), p = a.nextVisibleColumn(p, e, r), p > f && n !== 0 && (v !== -1 ? (t = v, u = w) : x !== -1 ?
          (t = x, u = y) : (t = n, u = 0), l[m++] = t - k, k = t, p = a.nextVisibleColumn(u, e, r), v = -1, w = 0, x = -
          1, y = 0), v !== -1 && (w = a.nextVisibleColumn(w, e, r)), x !== -1 && (y = a.nextVisibleColumn(y, e, r)),
          s === h && (v = n + 1, w = 0), s === i && (x = n + 1, y = 0);
        l[m++] = o - k, this.prefixSums = new d.PrefixSumComputer(l)
      }, a.prototype.getOutputLineCount = function() {
        return this.wrappingColumn === -1 ? 1 : this.prefixSums.getCount()
      }, a.prototype.getInputOffsetOfOutputPosition = function(a, b) {
        return this.wrappingColumn === -1 ? b : a === 0 ? b : this.prefixSums.getAccumulatedValue(a - 1) + b
      }, a.prototype.getOutputPositionOfInputOffset = function(a, b) {
        if (this.wrappingColumn === -1) {
          b.outputLineIndex = 0, b.outputOffset = a;
          return
        }
        this.prefixSums.getIndexOf(a, e), b.outputLineIndex = e.index, b.outputOffset = e.remainder
      }, a.SEARCH_RANGE_RATIO = .2, a
    }();
  b.CharacterHardWrappingLineMapper = k;
  var l = function() {
    function a(a, b, c) {
      this.characterClasses = j(a, b, c)
    }
    return a.prototype.createLineMapper = function(a, b, c) {
      return new k(this.characterClasses, a, b, c)
    }, a
  }();
  b.CharacterHardWrappingLineMapperFactory = l
})