define("vs/editor/contrib/quickOpen/quickOpenEditorWidget", ["require", "exports", "vs/editor/editor",
  "vs/base/dom/builder", "vs/base/ui/widgets/quickopen/quickOpenWidget"
], function(e, t, n, i, o) {
  var r = 0;

  var s = 20;

  var a = i.$;

  var u = function() {
    function e(e, t, n, i) {
      this.codeEditor = e;

      this.create(t, n, i);
    }
    e.prototype.create = function(e, t, n) {
      this.domNode = a().div().getHTMLElement();

      this.quickOpenWidget = new o.QuickOpenWidget(this.domNode, {
        onOk: e,
        onCancel: t,
        onType: n
      }, {
        minItemsToShow: r,
        maxItemsToShow: s,
        inputPlaceHolder: null
      }, null);

      this.quickOpenWidget.create();

      this.codeEditor.addOverlayWidget(this);
    };

    e.prototype.setInput = function(e, t) {
      this.quickOpenWidget.setInput(e, t);
    };

    e.prototype.getId = function() {
      return e.ID;
    };

    e.prototype.getDomNode = function() {
      return this.domNode;
    };

    e.prototype.destroy = function() {
      this.quickOpenWidget.dispose();
    };

    e.prototype.isVisible = function() {
      return this.visible;
    };

    e.prototype.show = function(e) {
      this.visible = !0;

      this.quickOpenWidget.show(e);

      this.codeEditor.layoutOverlayWidget(this);
    };

    e.prototype.hide = function() {
      this.visible = !1;

      this.quickOpenWidget.hide();

      this.codeEditor.layoutOverlayWidget(this);
    };

    e.prototype.getPosition = function() {
      return this.visible ? {
        preference: 1
      } : null;
    };

    e.ID = "editor.contrib.quickOpenEditorWidget";

    return e;
  }();
  t.QuickOpenEditorWidget = u;
});