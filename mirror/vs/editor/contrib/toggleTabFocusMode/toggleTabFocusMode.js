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
  "vs/editor/editorExtensions"
], function(a, b, c, d, e, f, g) {
  var h = c;

  var i = d;

  var j = e;

  var k = f;

  var l = g;

  var m = function(a) {
    function b(b, c) {
      a.call(this, b, c);
    }
    __extends(b, a);

    b.prototype.run = function() {
      this.editor.getConfiguration().tabFocusMode ? this.editor.updateOptions({
        tabFocusMode: !1
      }) : this.editor.updateOptions({
        tabFocusMode: !0
      });

      return i.Promise.as(null);
    };

    b.ID = "editor.actions.toggleTabFocusMode";

    return b;
  }(l.EditorAction);

  var n = new k.ActionDescriptor(m, m.ID, h.localize("toggle.tabfocusmode", "Toggle use of tab key for setting focus"), {
    ctrlCmd: !0,
    key: "M"
  });

  var o = j.Registry.as(l.Extensions.EditorContributions);
  o.registerEditorContribution(n);
});