define("vs/editor/contrib/color/colorPicker", ["require", "exports", "vs/nls!vs/editor/editor.main",
  "vs/base/ui/actions"
], function(e, t, n, i) {
  var o = function(e) {
    function t() {
      e.call(this, t.ID);

      this.label = n.localize("vs_editor_contrib_color_colorPicker", 0);
    }
    __extends(t, e);

    t.prototype.run = function() {
      return null;
    };

    t.ID = "editor.actions.colorPicker.trigger";

    return t;
  }(i.Action);
  t.ColorPickerAction = o;
});