var __extends = this.__extends || function(a, b) {
    function d() {
      this.constructor = a;
    }
    for (var c in b) {
      b.hasOwnProperty(c) && (a[c] = b[c]);
    }
    d.prototype = b.prototype;

    a.prototype = new d;
  };

define(["require", "exports", "vs/nls", "vs/base/lib/winjs.base", "vs/platform/platform", "vs/platform/actionRegistry",
  "vs/editor/editorExtensions", "./copyLinesCommand", "./deleteLinesCommand", "./moveLinesCommand"
], function(a, b, c, d, e, f, g, h, i, j) {
  var k = c;

  var l = d;

  var m = e;

  var n = f;

  var o = g;

  var p = h;

  var q = i;

  var r = j;

  var s = function(a) {
    function b(b, c, d) {
      a.call(this, b, c);

      this.down = d;
    }
    __extends(b, a);

    b.prototype.run = function() {
      var a = [];

      var b = this.editor.getSelections();
      for (var c = 0; c < b.length; c++) {
        a.push(new p.CopyLinesCommand(b[c], this.down));
      }
      this.editor.executeCommands(this.id, a);

      return l.Promise.as(null);
    };

    return b;
  }(o.EditorAction);

  var t = function(a) {
    function b(b, c) {
      a.call(this, b, c, !1);
    }
    __extends(b, a);

    b.ID = "editor.actions.copyLinesUpAction";

    return b;
  }(s);

  var u = function(a) {
    function b(b, c) {
      a.call(this, b, c, !0);
    }
    __extends(b, a);

    b.ID = "editor.actions.copyLinesDownAction";

    return b;
  }(s);

  var v = function(a) {
    function b(b, c, d) {
      a.call(this, b, c);

      this.down = d;
    }
    __extends(b, a);

    b.prototype.run = function() {
      var a = [];

      var b = this.editor.getSelections();
      for (var c = 0; c < b.length; c++) {
        a.push(new r.MoveLinesCommand(b[c], this.down));
      }
      this.editor.executeCommands(this.id, a);

      return l.Promise.as(null);
    };

    return b;
  }(o.EditorAction);

  var w = function(a) {
    function b(b, c) {
      a.call(this, b, c, !1);
    }
    __extends(b, a);

    b.ID = "editor.actions.moveLinesUpAction";

    return b;
  }(v);

  var x = function(a) {
    function b(b, c) {
      a.call(this, b, c, !0);
    }
    __extends(b, a);

    b.ID = "editor.actions.moveLinesDownAction";

    return b;
  }(v);

  var y = function(a) {
    function b(b, c) {
      a.call(this, b, c);
    }
    __extends(b, a);

    b.prototype.run = function() {
      var a = [];

      var b = this.editor.getSelections();
      for (var c = 0; c < b.length; c++) {
        a.push(new q.DeleteLinesCommand(b[c]));
      }
      this.editor.executeCommands(this.id, a);

      return l.Promise.as(null);
    };

    b.ID = "editor.action.deleteLines";

    return b;
  }(o.EditorAction);

  var z = m.Registry.as(o.Extensions.EditorContributions);
  z.registerEditorContribution(new n.ActionDescriptor(y, y.ID, k.localize("lines.delete", "Delete line"), {
    ctrlCmd: !0,
    key: "D"
  }, {
    shift: !0,
    key: "Delete"
  }));

  z.registerEditorContribution(new n.ActionDescriptor(x, x.ID, k.localize("lines.moveDown", "Move line down"), {
    alt: !0,
    key: "DownArrow"
  }));

  z.registerEditorContribution(new n.ActionDescriptor(w, w.ID, k.localize("lines.moveUp", "Move line up"), {
    alt: !0,
    key: "UpArrow"
  }));

  z.registerEditorContribution(new n.ActionDescriptor(u, u.ID, k.localize("lines.copyDown", "Copy line down"), {
    alt: !0,
    shift: !0,
    key: "DownArrow"
  }));

  z.registerEditorContribution(new n.ActionDescriptor(t, t.ID, k.localize("lines.copyUp", "Copy line up"), {
    alt: !0,
    shift: !0,
    key: "UpArrow"
  }));
});