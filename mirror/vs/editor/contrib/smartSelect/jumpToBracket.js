var __extends = this.__extends || function(a, b) {
    function d() {
      this.constructor = a
    }
    for (var c in b) b.hasOwnProperty(c) && (a[c] = b[c]);
    d.prototype = b.prototype, a.prototype = new d
  };
define(["require", "exports", "vs/nls", "vs/editor/core/constants", "vs/editor/editorExtensions",
  "vs/platform/platform", "vs/platform/actionRegistry"
], function(a, b, c, d, e, f, g) {
  var h = c,
    i = d,
    j = e,
    k = f,
    l = g,
    m = function(a) {
      function b(b, c) {
        a.call(this, b, c)
      }
      return __extends(b, a), b.prototype.run = function() {
        return this.editor.trigger(this.id, i.Handler.JumpToBracket, {}), null
      }, b.ID = "editor.action.jumpToBracket", b
    }(j.EditorAction),
    n = k.Registry.as(j.Extensions.EditorContributions);
  n.registerEditorContribution(new l.ActionDescriptor(m, m.ID, h.localize("smartSelect.jumpBracket", "Go to bracket"), {
    ctrlCmd: !0,
    alt: !0,
    key: "]"
  }))
})