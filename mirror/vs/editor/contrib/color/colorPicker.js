var __extends = this.__extends || function(a, b) {
    function d() {
      this.constructor = a;
    }
    for (var c in b) {
      if (b.hasOwnProperty(c)) {
        a[c] = b[c];
      }
    }
    d.prototype = b.prototype;

    a.prototype = new d;
  };

define(["require", "exports", "vs/nls", "vs/base/ui/actions"], function(a, b, c, d) {
  var e = c;

  var f = d;

  var g = function(a) {
    function b() {
      a.call(this, b.ID);

      this.label = e.localize("color.action.label", "Color Picker Action");
    }
    __extends(b, a);

    b.prototype.run = function() {
      return null;
    };

    b.ID = "editor.actions.colorPicker.trigger";

    return b;
  }(f.Action);
  b.ColorPickerAction = g;
});