define("vs/editor/core/view/parts/overviewRuler/overviewRuler", ["require", "exports",
  "vs/editor/core/view/parts/overviewRuler/overviewRulerImpl", "vs/editor/core/view/viewEventHandler"
], function(e, t, n, i) {
  var o = function(e) {
    function t(t, i, o, r, s, a) {
      e.call(this);

      this._context = t;

      this._overviewRuler = new n.OverviewRulerImpl(0, i, o, this._context.configuration.editor.lineHeight, r, s, a);

      this._context.addEventHandler(this);
    }
    __extends(t, e);

    t.prototype.destroy = function() {
      this.dispose();
    };

    t.prototype.dispose = function() {
      this._context.removeEventHandler(this);

      this._overviewRuler.dispose();
    };

    t.prototype.onConfigurationChanged = function(e) {
      return e.lineHeight ? (this._overviewRuler.setLineHeight(this._context.configuration.editor.lineHeight, !0), !0) : !
        1;
    };

    t.prototype.onZonesChanged = function() {
      return !0;
    };

    t.prototype.onModelFlushed = function() {
      return !0;
    };

    t.prototype.onScrollHeightChanged = function(e) {
      this._overviewRuler.setScrollHeight(e, !0);

      return !0;
    };

    t.prototype.getDomNode = function() {
      return this._overviewRuler.getDomNode();
    };

    t.prototype.setLayout = function(e) {
      this._overviewRuler.setLayout(e, !0);
    };

    t.prototype.setZones = function(e) {
      this._overviewRuler.setZones(e, !0);
    };

    return t;
  }(i.ViewEventHandler);
  t.OverviewRuler = o;
});