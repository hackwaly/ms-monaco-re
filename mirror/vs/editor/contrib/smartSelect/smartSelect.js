var __extends = this.__extends || function(a, b) {
    function d() {
      this.constructor = a;
    }
    for (var c in b) {
      if (b.hasOwnProperty(c)) {
        a[c] = b[c];
      }
    }
    d.prototype = b.prototype;

    a.prototype = new d;
  };

define(["require", "exports", "vs/nls", "vs/base/env", "vs/base/lib/winjs.base", "vs/editor/core/constants",
  "vs/editor/core/range", "vs/editor/editorExtensions", "vs/platform/platform", "vs/platform/actionRegistry"
], function(a, b, c, d, e, f, g, h, i, j) {
  var k = c;

  var l = d;

  var m = e;

  var n = f;

  var o = g;

  var p = h;

  var q = i;

  var r = j;

  var s = function() {
    function a(a) {
      this.editor = a;

      this.next = null;

      this.previous = null;

      this.selection = a.getSelection();
    }
    return a;
  }();

  var t = null;

  var u = !1;

  var v = function(a) {
    function b(b, c, d) {
      a.call(this, b, c);

      this.forward = d;
    }
    __extends(b, a);

    b.prototype.getEnablementState = function() {
      return a.prototype.getEnablementState.call(this) && !! this.editor.getModel().getMode().logicalSelectionSupport;
    };

    b.prototype.run = function(a) {
      var b = this;

      var c = this.editor.getSelection();

      var d = this.editor.getModel();

      var e = d.getMode().logicalSelectionSupport;
      if (t && t.editor !== this.editor) {
        t = null;
      }
      var f = m.Promise.as(t);
      t || (f = e.getRangesToPosition(d.getAssociatedResource(), c.getStartPosition()).then(function(a) {
        var c;
        a.filter(function(a) {
          var c = b.editor.getSelection();

          var d = new o.Range(a.range.startLineNumber, a.range.startColumn, a.range.endLineNumber, a.range.endColumn);
          return d.containsPosition(c.getStartPosition()) && d.containsPosition(c.getEndPosition());
        }).forEach(function(a) {
          var d = a.range;

          var e = new s(b.editor);
          e.selection = new o.Range(d.startLineNumber, d.startColumn, d.endLineNumber, d.endColumn);

          if (c) {
            e.next = c;
            c.previous = e;
          }

          c = e;
        });
        var d = new s(b.editor);
        d.next = c;

        if (c) {
          c.previous = d;
        }

        t = d;
      }).then(function() {
        var a = b.editor.addListener(n.EventType.CursorPositionChanged, function(b) {
          if (u) return;
          t = null;

          a();
        });
      }));

      return f.then(function() {
        t = b.forward ? t.next : t.previous;
        if (!t) return;
        u = !0;
        try {
          b.editor.setSelection(t.selection);
        } finally {
          u = !1;
        }
      });
    };

    return b;
  }(p.EditorAction);

  var w = function(a) {
    function b(b, c) {
      a.call(this, b, c, !0);
    }
    __extends(b, a);

    b.ID = "editor.action.smartSelect.grow";

    return b;
  }(v);

  var x = function(a) {
    function b(b, c) {
      a.call(this, b, c, !1);
    }
    __extends(b, a);

    b.ID = "editor.action.smartSelect.shrink";

    return b;
  }(v);

  var y = q.Registry.as(p.Extensions.EditorContributions);
  y.registerEditorContribution(new r.ActionDescriptor(w, w.ID, k.localize("smartSelect.grow", "Expand select"), l.browser
    .isMacintosh ? {
      shift: !0,
      cmdCtrl: !0,
      winCtrl: !0,
      alt: !1,
      key: "RightArrow"
    } : {
      shift: !0,
      alt: !0,
      key: "RightArrow"
    }));

  y.registerEditorContribution(new r.ActionDescriptor(x, x.ID, k.localize("smartSelect.shrink", "Shrink select"), l.browser
    .isMacintosh ? {
      shift: !0,
      cmdCtrl: !0,
      winCtrl: !0,
      alt: !1,
      key: "LeftArrow"
    } : {
      shift: !0,
      alt: !0,
      key: "LeftArrow"
    }));
});