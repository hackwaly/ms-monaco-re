define("vs/editor/contrib/toggleTabFocusMode/toggleTabFocusMode", ["require", "exports", "vs/nls!vs/editor/editor.main",
  "vs/base/lib/winjs.base", "vs/platform/platform", "vs/platform/actionRegistry", "vs/editor/editorExtensions"
], function(e, t, n, i, o, r, s) {
  var a = function(e) {
    function t(t, n) {
      e.call(this, t, n);
    }
    __extends(t, e);

    t.prototype.run = function() {
      this.editor.getConfiguration().tabFocusMode ? this.editor.updateOptions({
        tabFocusMode: !1
      }) : this.editor.updateOptions({
        tabFocusMode: !0
      });

      return i.TPromise.as(!0);
    };

    t.ID = "editor.actions.toggleTabFocusMode";

    return t;
  }(s.EditorAction);

  var u = new r.ActionDescriptor(a, a.ID, n.localize("vs_editor_contrib_toggleTabFocusMode_toggleTabFocusMode", 0), {
    ctrlCmd: !0,
    key: "M"
  });

  var l = o.Registry.as(s.Extensions.EditorContributions);
  l.registerEditorContribution(u);
});