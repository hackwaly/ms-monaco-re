define("vs/editor/contrib/smartSelect/jumpToBracket", ["require", "exports", "vs/nls!vs/editor/editor.main",
  "vs/base/lib/winjs.base", "vs/editor/core/internalConstants", "vs/editor/editorExtensions", "vs/platform/platform",
  "vs/platform/actionRegistry"
], function(e, t, n, i, o, r, s, a) {
  var u = function(e) {
    function t(t, n) {
      e.call(this, t, n);
    }
    __extends(t, e);

    t.prototype.run = function() {
      this.editor.trigger(this.id, o.Handler.JumpToBracket, {});

      return i.TPromise.as(!0);
    };

    t.ID = "editor.action.jumpToBracket";

    return t;
  }(r.EditorAction);

  var l = s.Registry.as(r.Extensions.EditorContributions);
  l.registerEditorContribution(new a.ActionDescriptor(u, u.ID, n.localize(
    "vs_editor_contrib_smartSelect_jumpToBracket", 0), {
    ctrlCmd: !0,
    alt: !0,
    key: "]"
  }));
});