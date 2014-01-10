var __extends = this.__extends || function(a, b) {
    function d() {
      this.constructor = a
    }
    for (var c in b) b.hasOwnProperty(c) && (a[c] = b[c]);
    d.prototype = b.prototype, a.prototype = new d
  };
define(["require", "exports", "vs/nls", "vs/base/env", "vs/base/lib/winjs.base", "vs/editor/core/constants",
  "vs/editor/core/range", "vs/editor/editorExtensions", "vs/platform/platform", "vs/platform/actionRegistry"
], function(a, b, c, d, e, f, g, h, i, j) {
  var k = c,
    l = d,
    m = e,
    n = f,
    o = g,
    p = h,
    q = i,
    r = j,
    s = function() {
      function a(a) {
        this.editor = a, this.next = null, this.previous = null, this.selection = a.getSelection()
      }
      return a
    }(),
    t = null,
    u = !1,
    v = function(a) {
      function b(b, c, d) {
        a.call(this, b, c), this.forward = d
      }
      return __extends(b, a), b.prototype.getEnablementState = function() {
        return a.prototype.getEnablementState.call(this) && !! this.editor.getModel().getMode().logicalSelectionSupport
      }, b.prototype.run = function(a) {
        var b = this,
          c = this.editor.getSelection(),
          d = this.editor.getModel(),
          e = d.getMode().logicalSelectionSupport;
        t && t.editor !== this.editor && (t = null);
        var f = m.Promise.as(t);
        return t || (f = e.getRangesToPosition(d.getAssociatedResource(), c.getStartPosition()).then(function(a) {
          var c;
          a.filter(function(a) {
            var c = b.editor.getSelection(),
              d = new o.Range(a.range.startLineNumber, a.range.startColumn, a.range.endLineNumber, a.range.endColumn);
            return d.containsPosition(c.getStartPosition()) && d.containsPosition(c.getEndPosition())
          }).forEach(function(a) {
            var d = a.range,
              e = new s(b.editor);
            e.selection = new o.Range(d.startLineNumber, d.startColumn, d.endLineNumber, d.endColumn), c && (e.next =
              c, c.previous = e), c = e
          });
          var d = new s(b.editor);
          d.next = c, c && (c.previous = d), t = d
        }).then(function() {
          var a = b.editor.addListener(n.EventType.CursorPositionChanged, function(b) {
            if (u) return;
            t = null, a()
          })
        })), f.then(function() {
          t = b.forward ? t.next : t.previous;
          if (!t) return;
          u = !0;
          try {
            b.editor.setSelection(t.selection)
          } finally {
            u = !1
          }
        })
      }, b
    }(p.EditorAction),
    w = function(a) {
      function b(b, c) {
        a.call(this, b, c, !0)
      }
      return __extends(b, a), b.ID = "editor.action.smartSelect.grow", b
    }(v),
    x = function(a) {
      function b(b, c) {
        a.call(this, b, c, !1)
      }
      return __extends(b, a), b.ID = "editor.action.smartSelect.shrink", b
    }(v),
    y = q.Registry.as(p.Extensions.EditorContributions);
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
    })), y.registerEditorContribution(new r.ActionDescriptor(x, x.ID, k.localize("smartSelect.shrink",
    "Shrink select"), l.browser.isMacintosh ? {
    shift: !0,
    cmdCtrl: !0,
    winCtrl: !0,
    alt: !1,
    key: "LeftArrow"
  } : {
    shift: !0,
    alt: !0,
    key: "LeftArrow"
  }))
})