var __extends = this.__extends || function(a, b) {
    function d() {
      this.constructor = a
    }
    for (var c in b) b.hasOwnProperty(c) && (a[c] = b[c]);
    d.prototype = b.prototype, a.prototype = new d
  };
define(["require", "exports", "vs/nls", "vs/base/lib/winjs.base", "vs/platform/platform", "vs/platform/actionRegistry",
  "./lineCommentCommand", "./blockCommentCommand", "vs/editor/editorExtensions"
], function(a, b, c, d, e, f, g, h, i) {
  var j = c,
    k = d,
    l = e,
    m = f,
    n = g,
    o = h,
    p = i,
    q = function(a) {
      function b(b, c) {
        a.call(this, b, c)
      }
      return __extends(b, a), b.prototype.run = function() {
        var a = [],
          b = this.editor.getSelections();
        for (var c = 0; c < b.length; c++) a.push(new n.LineCommentCommand(b[c]));
        return this.editor.executeCommands(this.id, a), k.Promise.as(null)
      }, b.ID = "editor.actions.commentLine", b
    }(p.EditorAction),
    r = function(a) {
      function b(b, c) {
        a.call(this, b, c)
      }
      return __extends(b, a), b.prototype.run = function() {
        var a = [],
          b = this.editor.getSelections();
        for (var c = 0; c < b.length; c++) a.push(new o.BlockCommentCommand(b[c]));
        return this.editor.executeCommands(this.id, a), k.Promise.as(null)
      }, b.ID = "editor.actions.blockComment", b
    }(p.EditorAction),
    s = new m.ActionDescriptor(q, q.ID, j.localize("comment.line", "Insert line comment"), {
      ctrlCmd: !0,
      key: "/"
    }, {
      ctrlCmd: !0,
      key: "7"
    }),
    t = new m.ActionDescriptor(r, r.ID, j.localize("comment.block", "Insert block comment"), {
      shift: !0,
      alt: !0,
      key: "A"
    }),
    u = l.Registry.as(p.Extensions.EditorContributions);
  u.registerEditorContribution(s), u.registerEditorContribution(t)
})