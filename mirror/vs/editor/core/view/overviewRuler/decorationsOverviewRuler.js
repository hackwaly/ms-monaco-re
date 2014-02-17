var __extends = this.__extends || function(a, b) {
    function d() {
      this.constructor = a;
    }
    for (var c in b) b.hasOwnProperty(c) && (a[c] = b[c]);
    d.prototype = b.prototype;

    a.prototype = new d;
  };

define(["require", "exports", "vs/editor/core/view/overviewRuler/overviewRulerImpl",
  "vs/editor/core/view/viewEventHandler"
], function(a, b, c, d) {
  var e = c;

  var f = d;

  var g = function(a) {
    function b(c, d, f) {
      a.call(this);

      this.context = c;

      this.overviewRuler = new e.OverviewRulerImpl("decorationsOverviewRuler", d, this.context.configuration.editor.lineHeight,
        b.DECORATION_HEIGHT, b.DECORATION_HEIGHT, f);

      this.shouldUpdateDecorations = !0;

      this.hasDecorations = !1;

      this.context.addEventHandler(this);
    }
    __extends(b, a);

    b.prototype.dispose = function() {
      this.context.removeEventHandler(this);

      this.overviewRuler.dispose();
    };

    b.prototype.onConfigurationLineHeightChanged = function() {
      this.overviewRuler.setLineHeight(this.context.configuration.editor.lineHeight, !1);

      return !0;
    };

    b.prototype.onLayoutChanged = function(a) {
      this.overviewRuler.setLayout(a.overviewRuler, !1);

      return !0;
    };

    b.prototype.onZonesChanged = function() {
      return !0;
    };

    b.prototype.onModelFlushed = function() {
      return !0;
    };

    b.prototype.onModelDecorationsChanged = function(a) {
      this.shouldUpdateDecorations = !0;

      return !0;
    };

    b.prototype.onScrollHeightChanged = function(a) {
      this.overviewRuler.setScrollHeight(a, !1);

      return !0;
    };

    b.prototype.getDomNode = function() {
      return this.overviewRuler.getDomNode();
    };

    b.prototype.prepareRender = function(a) {
      if (this.shouldUpdateDecorations) {
        this.shouldUpdateDecorations = !1;
        var b = this.context.model.getAllDecorations();

        var c = [];

        var d;

        var e;

        var f;
        for (d = 0, e = b.length; d < e; d++) f = b[d];

        f.options.showInOverviewRuler && c.push({
          startLineNumber: f.range.startLineNumber,
          endLineNumber: f.range.endLineNumber,
          color: f.options.showInOverviewRuler
        });
        this.hasDecorations = c.length > 0;

        this.overviewRuler.setZones(c, !1);
      }
      return null;
    };

    b.prototype.render = function(a, b) {
      if (!this.shouldRender) return;
      this.shouldRender = !1;

      this.overviewRuler.render();
      if (this.hasDecorations && e.hasCanvas) {
        var c = this.overviewRuler.getDomNode().getContext("2d");
        c.fillStyle = "rgba(197,197,197,0.4)";

        c.fillRect(0, 0, this.overviewRuler.getWidth(), 1);

        c.fillRect(0, 0, 1, this.overviewRuler.getHeight());

        c.fillRect(0, this.overviewRuler.getHeight() - 1, this.overviewRuler.getWidth(), 1);
      }
    };

    b.DECORATION_HEIGHT = 4;

    return b;
  }(f.ViewEventHandler);
  b.DecorationsOverviewRuler = g;
});