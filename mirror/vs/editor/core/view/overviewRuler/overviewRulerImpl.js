define(["require", "exports"], function(a, b) {
  b.hasCanvas = window.navigator.userAgent.indexOf("MSIE 8") === -1;
  var c = function() {
    function a(a, b, c, d, e, f) {
      this.minimumHeight = d;

      this.maximumHeight = e;

      this.getVerticalOffsetForLine = f;

      this.zones = [];

      this.domNode = document.createElement("canvas");

      this.domNode.className = a;

      this.domNode.style.position = "absolute";

      this.width = 0;

      this.height = 0;

      this.outerHeight = b;

      this.lineHeight = c;
    }
    a.prototype.dispose = function() {
      this.zones = [];
    };

    a.prototype.setLayout = function(a, b) {
      this.domNode.style.top = a.top + "px";

      this.domNode.style.right = a.right + "px";
      if (this.width !== a.width || this.height !== a.height) {
        this.width = a.width;
        this.height = a.height;
        this.domNode.width = this.width;
        this.domNode.height = this.height;
        b && this.render();
      }
    };

    a.prototype.getDomNode = function() {
      return this.domNode;
    };

    a.prototype.getWidth = function() {
      return this.width;
    };

    a.prototype.getHeight = function() {
      return this.height;
    };

    a.prototype.setScrollHeight = function(a, b) {
      this.outerHeight = a;

      b && this.render();
    };

    a.prototype.setLineHeight = function(a, b) {
      this.lineHeight = a;

      b && this.render();
    };

    a.prototype.setZones = function(a, b) {
      this.zones = a;

      b && this.render();
    };

    a.prototype._insertZone = function(a, b, c, d, e) {
      var f = Math.floor((b + c) / 2);

      var g = c - f;
      g > d / 2 && (g = d / 2);

      g < this.minimumHeight / 2 && (g = this.minimumHeight / 2);

      f - g < 0 && (f = g);

      f + g > this.height && (f = this.height - g);

      a[e] = a[e] || [];

      a[e].push({
        from: f - g,
        to: f + g
      });
    };

    a.prototype.render = function() {
      if (this.outerHeight === 0) return;
      if (!b.hasCanvas) return;
      var a = this.height / this.outerHeight;

      var c = this.domNode.getContext("2d");
      c.clearRect(0, 0, this.width, this.height);
      var d = {};

      var e;

      var f;

      var g;

      var h;

      var i;

      var j;

      var k;
      for (e = 0, f = this.zones.length; e < f; e++) {
        g = this.zones[e];

        h = this.getVerticalOffsetForLine(g.startLineNumber);

        i = this.getVerticalOffsetForLine(g.endLineNumber) + this.lineHeight;

        h *= a;

        i *= a;

        j = g.endLineNumber - g.startLineNumber + 1;

        k = j * this.maximumHeight;
        if (i - h > k)
          for (var l = g.startLineNumber; l <= g.endLineNumber; l++) {
            h = this.getVerticalOffsetForLine(l);
            i = h + this.lineHeight;
            h *= a;
            i *= a;
            this._insertZone(d, h, i, this.maximumHeight, g.color);
          } else {
            this._insertZone(d, h, i, k, g.color);
          }
      }
      var m = function(a, b) {
        return a.from - b.from;
      };

      var n;

      var o;

      var p;

      var q;
      for (n in d)
        if (d.hasOwnProperty(n)) {
          o = d[n];

          o.sort(m);

          p = o[0].from;

          q = o[0].to;

          c.fillStyle = n;
          for (e = 1, f = o.length; e < f; e++) {
            q >= o[e].from ? q = Math.max(q, o[e].to) : (c.fillRect(0, p, this.width, q - p), p = o[e].from, q = o[e]
              .to);
          }
          c.fillRect(0, p, this.width, q - p);
        }
    };

    return a;
  }();
  b.OverviewRulerImpl = c;
});