define(["require", "exports"], function(a, b) {
  function d(a) {
    var b = [];
    for (var c = 0; c < arguments.length - 1; c++) b[c] = arguments[c + 1];
    return new e(a, b)
  }(function(a) {
    a[a.Value = 0] = "Value", a[a.Selection = 1] = "Selection", a[a.Position = 2] = "Position"
  })(b.Flag || (b.Flag = {}));
  var c = b.Flag;
  b.capture = d;
  var e = function() {
    function a(a, b) {
      var d = this;
      this.editor = a, b.forEach(function(a) {
        switch (a) {
          case c.Value:
            d.modelVersionId = d.editor.getModel().getVersionId();
            break;
          case c.Position:
            d.position = d.editor.getPosition();
            break;
          case c.Selection:
            d.selection = d.editor.getSelection()
        }
      })
    }
    return a.prototype.validate = function() {
      return this.position && !this.position.equals(this.editor.getPosition()) ? !1 : this.selection && !this.selection
        .equalsRange(this.editor.getSelection()) ? !1 : this.modelVersionId ? !! this.editor.getModel() && this.modelVersionId ===
        this.editor.getModel().getVersionId() : !0
    }, a
  }()
})