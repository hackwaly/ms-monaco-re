var __extends = this.__extends || function(a, b) {
    function d() {
      this.constructor = a
    }
    for (var c in b) b.hasOwnProperty(c) && (a[c] = b[c]);
    d.prototype = b.prototype, a.prototype = new d
  };
define(["require", "exports", "vs/nls", "vs/base/lib/winjs.base", "vs/platform/platform", "vs/platform/actionRegistry",
  "vs/editor/editorExtensions", "./copyLinesCommand", "./deleteLinesCommand", "./moveLinesCommand"
], function(a, b, c, d, e, f, g, h, i, j) {
  var k = c,
    l = d,
    m = e,
    n = f,
    o = g,
    p = h,
    q = i,
    r = j,
    s = function(a) {
      function b(b, c, d) {
        a.call(this, b, c), this.down = d
      }
      return __extends(b, a), b.prototype.run = function() {
        var a = [],
          b = this.editor.getSelections();
        for (var c = 0; c < b.length; c++) a.push(new p.CopyLinesCommand(b[c], this.down));
        return this.editor.executeCommands(this.id, a), l.Promise.as(null)
      }, b
    }(o.EditorAction),
    t = function(a) {
      function b(b, c) {
        a.call(this, b, c, !1)
      }
      return __extends(b, a), b.ID = "editor.actions.copyLinesUpAction", b
    }(s),
    u = function(a) {
      function b(b, c) {
        a.call(this, b, c, !0)
      }
      return __extends(b, a), b.ID = "editor.actions.copyLinesDownAction", b
    }(s),
    v = function(a) {
      function b(b, c, d) {
        a.call(this, b, c), this.down = d
      }
      return __extends(b, a), b.prototype.run = function() {
        var a = [],
          b = this.editor.getSelections();
        for (var c = 0; c < b.length; c++) a.push(new r.MoveLinesCommand(b[c], this.down));
        return this.editor.executeCommands(this.id, a), l.Promise.as(null)
      }, b
    }(o.EditorAction),
    w = function(a) {
      function b(b, c) {
        a.call(this, b, c, !1)
      }
      return __extends(b, a), b.ID = "editor.actions.moveLinesUpAction", b
    }(v),
    x = function(a) {
      function b(b, c) {
        a.call(this, b, c, !0)
      }
      return __extends(b, a), b.ID = "editor.actions.moveLinesDownAction", b
    }(v),
    y = function(a) {
      function b(b, c) {
        a.call(this, b, c)
      }
      return __extends(b, a), b.prototype.run = function() {
        var a = [],
          b = this.editor.getSelections();
        for (var c = 0; c < b.length; c++) a.push(new q.DeleteLinesCommand(b[c]));
        return this.editor.executeCommands(this.id, a), l.Promise.as(null)
      }, b.ID = "editor.action.deleteLines", b
    }(o.EditorAction),
    z = m.Registry.as(o.Extensions.EditorContributions);
  z.registerEditorContribution(new n.ActionDescriptor(y, y.ID, k.localize("lines.delete", "Delete line"), {
    ctrlCmd: !0,
    key: "D"
  }, {
    shift: !0,
    key: "Delete"
  })), z.registerEditorContribution(new n.ActionDescriptor(x, x.ID, k.localize("lines.moveDown", "Move line down"), {
    alt: !0,
    key: "DownArrow"
  })), z.registerEditorContribution(new n.ActionDescriptor(w, w.ID, k.localize("lines.moveUp", "Move line up"), {
    alt: !0,
    key: "UpArrow"
  })), z.registerEditorContribution(new n.ActionDescriptor(u, u.ID, k.localize("lines.copyDown", "Copy line down"), {
    alt: !0,
    shift: !0,
    key: "DownArrow"
  })), z.registerEditorContribution(new n.ActionDescriptor(t, t.ID, k.localize("lines.copyUp", "Copy line up"), {
    alt: !0,
    shift: !0,
    key: "UpArrow"
  }))
})