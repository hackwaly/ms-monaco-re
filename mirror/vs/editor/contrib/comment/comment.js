define("vs/editor/contrib/comment/comment", ["require", "exports", "vs/nls!vs/editor/editor.main",
  "vs/base/lib/winjs.base", "vs/platform/platform", "vs/platform/actionRegistry", "./lineCommentCommand",
  "./blockCommentCommand", "vs/editor/editorExtensions"
], function(e, t, n, i, o, r, s, a, u) {
  var l = function(e) {
    function t(t, n) {
      e.call(this, t, n);
    }
    __extends(t, e);

    t.prototype.run = function() {
      for (var e = [], t = this.editor.getSelections(), n = 0; n < t.length; n++) {
        e.push(new s.LineCommentCommand(t[n]));
      }
      this.editor.executeCommands(this.id, e);

      return i.TPromise.as(null);
    };

    t.ID = "editor.actions.commentLine";

    return t;
  }(u.EditorAction);

  var c = function(e) {
    function t(t, n) {
      e.call(this, t, n);
    }
    __extends(t, e);

    t.prototype.run = function() {
      for (var e = [], t = this.editor.getSelections(), n = 0; n < t.length; n++) {
        e.push(new a.BlockCommentCommand(t[n]));
      }
      this.editor.executeCommands(this.id, e);

      return i.TPromise.as(null);
    };

    t.ID = "editor.actions.blockComment";

    return t;
  }(u.EditorAction);

  var d = new r.ActionDescriptor(l, l.ID, n.localize("vs_editor_contrib_comment_comment", 0), {
    ctrlCmd: !0,
    key: "/"
  }, {
    ctrlCmd: !0,
    key: "7"
  });

  var h = new r.ActionDescriptor(c, c.ID, n.localize("vs_editor_contrib_comment_comment", 1), {
    shift: !0,
    alt: !0,
    key: "A"
  });

  var p = o.Registry.as(u.Extensions.EditorContributions);
  p.registerEditorContribution(d);

  p.registerEditorContribution(h);
});