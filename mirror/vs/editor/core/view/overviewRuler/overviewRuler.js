var __extends = this.__extends || function(a, b) {
    function d() {
      this.constructor = a;
    }
    for (var c in b) {
      b.hasOwnProperty(c) && (a[c] = b[c]);
    }
    d.prototype = b.prototype;

    a.prototype = new d;
  };

define(["require", "exports", "vs/editor/core/view/overviewRuler/overviewRulerImpl",
  "vs/editor/core/view/viewEventHandler"
], function(a, b, c, d) {
  var e = c;

  var f = d;

  var g = function(a) {
    function b(b, c, d, f, g, h) {
      a.call(this);

      this.context = b;

      this.overviewRuler = new e.OverviewRulerImpl(c, d, this.context.configuration.editor.lineHeight, f, g, h);

      this.context.addEventHandler(this);
    }
    __extends(b, a);

    b.prototype.destroy = function() {
      this.context.removeEventHandler(this);

      this.overviewRuler.dispose();
    };

    b.prototype.onConfigurationLineHeightChanged = function() {
      this.overviewRuler.setLineHeight(this.context.configuration.editor.lineHeight, !0);

      return !0;
    };

    b.prototype.onZonesChanged = function() {
      return !0;
    };

    b.prototype.onModelFlushed = function() {
      return !0;
    };

    b.prototype.onScrollHeightChanged = function(a) {
      this.overviewRuler.setScrollHeight(a, !0);

      return !0;
    };

    b.prototype.getDomNode = function() {
      return this.overviewRuler.getDomNode();
    };

    b.prototype.setLayout = function(a) {
      this.overviewRuler.setLayout(a, !0);
    };

    b.prototype.setZones = function(a) {
      this.overviewRuler.setZones(a, !0);
    };

    return b;
  }(f.ViewEventHandler);
  b.OverviewRuler = g;
});