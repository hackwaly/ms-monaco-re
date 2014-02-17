define("vs/editor/contrib/smartSelect/smartSelect", ["require", "exports", "vs/nls!vs/editor/editor.main",
  "vs/base/env", "vs/base/lib/winjs.base", "vs/editor/core/constants", "vs/editor/core/range",
  "vs/editor/editorExtensions", "vs/platform/platform", "vs/platform/actionRegistry"
], function(e, t, n, i, o, r, s, a, u, l) {
  var c = function() {
    function e(e) {
      this.editor = e;

      this.next = null;

      this.previous = null;

      this.selection = e.getSelection();
    }
    return e;
  }();

  var d = null;

  var h = !1;

  var p = function(e) {
    function t(t, n, i) {
      e.call(this, t, n);

      this.forward = i;
    }
    __extends(t, e);

    t.prototype.getEnablementState = function() {
      return e.prototype.getEnablementState.call(this) && !! this.editor.getModel().getMode().logicalSelectionSupport;
    };

    t.prototype.run = function() {
      var e = this;

      var t = this.editor.getSelection();

      var n = this.editor.getModel();

      var i = n.getMode().logicalSelectionSupport;
      if (d && d.editor !== this.editor) {
        d = null;
      }
      var a = o.Promise.as(d);
      d || (a = i.getRangesToPosition(n.getAssociatedResource(), t.getStartPosition()).then(function(t) {
        var n;
        t.filter(function(t) {
          var n = e.editor.getSelection();

          var i = new s.Range(t.range.startLineNumber, t.range.startColumn, t.range.endLineNumber, t.range.endColumn);
          return i.containsPosition(n.getStartPosition()) && i.containsPosition(n.getEndPosition());
        }).forEach(function(t) {
          var i = t.range;

          var o = new c(e.editor);
          o.selection = new s.Range(i.startLineNumber, i.startColumn, i.endLineNumber, i.endColumn);

          if (n) {
            o.next = n;
            n.previous = o;
          }

          n = o;
        });
        var i = new c(e.editor);
        i.next = n;

        if (n) {
          n.previous = i;
        }

        d = i;
      }).then(function() {
        var t = e.editor.addListener(r.EventType.CursorPositionChanged, function() {
          if (!h) {
            d = null;
            t();
          }
        });
      }));

      return a.then(function() {
        if (d = e.forward ? d.next : d.previous) {
          h = !0;
          try {
            e.editor.setSelection(d.selection);
          } finally {
            h = !1;
          }
        }
      });
    };

    return t;
  }(a.EditorAction);

  var f = function(e) {
    function t(t, n) {
      e.call(this, t, n, !0);
    }
    __extends(t, e);

    t.ID = "editor.action.smartSelect.grow";

    return t;
  }(p);

  var g = function(e) {
    function t(t, n) {
      e.call(this, t, n, !1);
    }
    __extends(t, e);

    t.ID = "editor.action.smartSelect.shrink";

    return t;
  }(p);

  var m = u.Registry.as(a.Extensions.EditorContributions);
  m.registerEditorContribution(new l.ActionDescriptor(f, f.ID, n.localize("vs_editor_contrib_smartSelect_smartSelect",
    0), i.browser.isMacintosh ? {
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

  m.registerEditorContribution(new l.ActionDescriptor(g, g.ID, n.localize("vs_editor_contrib_smartSelect_smartSelect",
    1), i.browser.isMacintosh ? {
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