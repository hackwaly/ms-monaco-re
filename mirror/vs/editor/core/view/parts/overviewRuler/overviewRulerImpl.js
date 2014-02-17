define('vs/editor/core/view/parts/overviewRuler/overviewRulerImpl', [
  'require',
  'exports',
  'vs/editor/editor'
], function(e, t) {
  t.hasCanvas = -1 === window.navigator.userAgent.indexOf('MSIE 8');
  var n = function() {
    function e(e, t, n, i, o, r, s) {
      this._canvasLeftOffset = e, this._minimumHeight = o, this._maximumHeight = r, this._getVerticalOffsetForLine =
        s, this._zones = [], this._domNode = document.createElement('canvas'), this._domNode.className = t, this._domNode
        .style.position = 'absolute', this._width = 0, this._height = 0, this._outerHeight = n, this._lineHeight = i,
        this._lanesCount = 3;
    }
    return e.prototype.dispose = function() {
      this._zones = [];
    }, e.prototype.setLayout = function(e, t) {
      this._domNode.style.top = e.top + 'px', this._domNode.style.right = e.right + 'px', (this._width !== e.width ||
        this._height !== e.height) && (this._width = e.width, this._height = e.height, this._domNode.width = this._width,
        this._domNode.height = this._height, t && this.render());
    }, e.prototype.getLanesCount = function() {
      return this._lanesCount;
    }, e.prototype.setLanesCount = function(e, t) {
      this._lanesCount = e, t && this.render();
    }, e.prototype.getDomNode = function() {
      return this._domNode;
    }, e.prototype.getWidth = function() {
      return this._width;
    }, e.prototype.getHeight = function() {
      return this._height;
    }, e.prototype.setScrollHeight = function(e, t) {
      this._outerHeight = e, t && this.render();
    }, e.prototype.setLineHeight = function(e, t) {
      this._lineHeight = e, t && this.render();
    }, e.prototype.setZones = function(e, t) {
      this._zones = e, t && this.render();
    }, e.prototype._insertZone = function(e, t, n, i, o, r) {
      var s = Math.floor((t + n) / 2),
        a = n - s;
      a > o / 2 && (a = o / 2), i / 2 > a && (a = i / 2), 0 > s - a && (s = a), s + a > this._height && (s = this._height -
        a), e[r] = e[r] || [], e[r].push({
        from: s - a,
        to: s + a
      });
    }, e.prototype._renderVerticalPatch = function(e, t, n, i, o) {
      var r, s, a, u, l, c, d, h = {};
      for (r = 0, s = this._zones.length; s > r; r++)
        if (a = this._zones[r], a.position & n)
          if (u = this._getVerticalOffsetForLine(a.startLineNumber), l = this._getVerticalOffsetForLine(a.endLineNumber) +
            this._lineHeight, u *= t, l *= t, a.forceHeight)
            l = u + a.forceHeight, this._insertZone(h, u, l, a.forceHeight, a.forceHeight, a.color);
          else if (c = a.endLineNumber - a.startLineNumber + 1, d = c * this._maximumHeight, l - u > d)
        for (var p = a.startLineNumber; p <= a.endLineNumber; p++)
          u = this._getVerticalOffsetForLine(p), l = u + this._lineHeight, u *= t, l *= t, this._insertZone(h, u, l,
            this._minimumHeight, this._maximumHeight, a.color);
      else
        this._insertZone(h, u, l, this._minimumHeight, d, a.color);
      var f, g, m, v, y = function(e, t) {
          return e.from - t.from;
        };
      for (f in h)
        if (h.hasOwnProperty(f)) {
          for (g = h[f], g.sort(y), m = g[0].from, v = g[0].to, e.fillStyle = f, r = 1, s = g.length; s > r; r++)
            v >= g[r].from ? v = Math.max(v, g[r].to) : (e.fillRect(i, m, o, v - m), m = g[r].from, v = g[r].to);
          e.fillRect(i, m, o, v - m);
        }
    }, e.prototype.render = function() {
      if (0 !== this._outerHeight && t.hasCanvas) {
        var e = this._height / this._outerHeight,
          n = this._domNode.getContext('2d');
        n.clearRect(0, 0, this._width, this._height);
        var i = this._width - this._canvasLeftOffset - 1;
        this._lanesCount >= 3 ? this._renderThreeLanes(n, e, i) : 2 === this._lanesCount ? this._renderTwoLanes(n, e,
          i) : 1 === this._lanesCount && this._renderOneLane(n, e, i);
      }
    }, e.prototype._renderOneLane = function(e, t, n) {
      this._renderVerticalPatch(e, t, 7, this._canvasLeftOffset, n);
    }, e.prototype._renderTwoLanes = function(e, t, n) {
      var i = Math.floor(n / 2),
        o = n - i,
        r = this._canvasLeftOffset,
        s = this._canvasLeftOffset + i;
      this._renderVerticalPatch(e, t, 3, r, i), this._renderVerticalPatch(e, t, 4, s, o);
    }, e.prototype._renderThreeLanes = function(e, t, n) {
      var i = Math.floor(n / 3),
        o = Math.floor(n / 3),
        r = n - i - o,
        s = this._canvasLeftOffset,
        a = this._canvasLeftOffset + i,
        u = this._canvasLeftOffset + i + r;
      this._renderVerticalPatch(e, t, 1, s, i), this._renderVerticalPatch(e, t, 2, a, r), this._renderVerticalPatch(e,
        t, 4, u, o);
    }, e;
  }();
  t.OverviewRulerImpl = n;
})