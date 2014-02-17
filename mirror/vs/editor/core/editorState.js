define("vs/editor/core/editorState", ["require", "exports", "vs/base/strings"], function(e, t, n) {
  function i(e) {
    for (var t = [], n = 0; n < arguments.length - 1; n++) {
      t[n] = arguments[n + 1];
    }
    return new o(e, t);
  }! function(e) {
    e[e.Value = 0] = "Value";

    e[e.Selection = 1] = "Selection";

    e[e.Position = 2] = "Position";

    e[e.Scroll = 3] = "Scroll";
  }(t.Flag || (t.Flag = {}));
  t.Flag;
  t.capture = i;
  var o = function() {
    function e(e, t) {
      var i = this;
      this.editor = e;

      this.flags = t;

      t.forEach(function(e) {
        switch (e) {
          case 0:
            var t = i.editor.getModel();
            i.modelVersionId = t ? n.format("{0}#{1}", t.getAssociatedResource().toExternal(), t.getVersionId()) :
              null;
            break;
          case 2:
            i.position = i.editor.getPosition();
            break;
          case 1:
            i.selection = i.editor.getSelection();
            break;
          case 3:
            i.scrollLeft = i.editor.getScrollLeft();

            i.scrollTop = i.editor.getScrollTop();
        }
      });
    }
    e.prototype.equals = function(t) {
      if (!(t instanceof e)) {
        return !1;
      }
      var n = t;
      return this.modelVersionId !== n.modelVersionId ? !1 : this.scrollLeft !== n.scrollLeft || this.scrollTop !== n
        .scrollTop ? !1 : !this.position && n.position || this.position && !n.position || this.position && n.position && !
        this.position.equals(n.position) ? !1 : !this.selection && n.selection || this.selection && !n.selection ||
        this.selection && n.selection && !this.selection.equalsRange(n.selection) ? !1 : !0;
    };

    e.prototype.validate = function() {
      return this.equals(new e(this.editor, this.flags));
    };

    return e;
  }();
});