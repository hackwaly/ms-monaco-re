define("vs/editor/contrib/linesOperations/linesOperations", ["require", "exports", "vs/nls!vs/editor/editor.main",
  "vs/base/lib/winjs.base", "vs/platform/platform", "vs/platform/actionRegistry", "vs/editor/editorExtensions",
  "./copyLinesCommand", "./deleteLinesCommand", "./moveLinesCommand"
], function(e, t, n, i, o, r, s, a, u, l) {
  var c = function(e) {
    function t(t, n, i) {
      e.call(this, t, n);

      this.down = i;
    }
    __extends(t, e);

    t.prototype.run = function() {
      for (var e = [], t = this.editor.getSelections(), n = 0; n < t.length; n++) {
        e.push(new a.CopyLinesCommand(t[n], this.down));
      }
      this.editor.executeCommands(this.id, e);

      return i.TPromise.as(!0);
    };

    return t;
  }(s.EditorAction);

  var d = function(e) {
    function t(t, n) {
      e.call(this, t, n, !1);
    }
    __extends(t, e);

    t.ID = "editor.actions.copyLinesUpAction";

    return t;
  }(c);

  var h = function(e) {
    function t(t, n) {
      e.call(this, t, n, !0);
    }
    __extends(t, e);

    t.ID = "editor.actions.copyLinesDownAction";

    return t;
  }(c);

  var p = function(e) {
    function t(t, n, i) {
      e.call(this, t, n);

      this.down = i;
    }
    __extends(t, e);

    t.prototype.run = function() {
      for (var e = [], t = this.editor.getSelections(), n = 0; n < t.length; n++) {
        e.push(new l.MoveLinesCommand(t[n], this.down));
      }
      this.editor.executeCommands(this.id, e);

      return i.TPromise.as(!0);
    };

    return t;
  }(s.EditorAction);

  var f = function(e) {
    function t(t, n) {
      e.call(this, t, n, !1);
    }
    __extends(t, e);

    t.ID = "editor.actions.moveLinesUpAction";

    return t;
  }(p);

  var g = function(e) {
    function t(t, n) {
      e.call(this, t, n, !0);
    }
    __extends(t, e);

    t.ID = "editor.actions.moveLinesDownAction";

    return t;
  }(p);

  var m = function(e) {
    function t(t, n) {
      e.call(this, t, n);
    }
    __extends(t, e);

    t.prototype.run = function() {
      var e = this.editor.getSelections().map(function(e) {
        var t = e.endLineNumber;
        e.startLineNumber < e.endLineNumber && 1 === e.endColumn && (t -= 1);

        return {
          startLineNumber: e.startLineNumber,
          endLineNumber: t,
          positionColumn: e.positionColumn
        };
      });
      e.sort(function(e, t) {
        return e.startLineNumber - t.startLineNumber;
      });
      for (var t = [], n = e[0], o = 1; o < e.length; o++) {
        if (n.endLineNumber + 1 === e[o].startLineNumber) {
          n.endLineNumber = e[o].endLineNumber;
        } else {
          t.push(n);
          n = e[o];
        }
      }
      t.push(n);
      var r = t.map(function(e) {
        return new u.DeleteLinesCommand(e.startLineNumber, e.endLineNumber, e.positionColumn);
      });
      this.editor.executeCommands(this.id, r);

      return i.TPromise.as(!0);
    };

    t.ID = "editor.action.deleteLines";

    return t;
  }(s.EditorAction);

  var v = o.Registry.as(s.Extensions.EditorContributions);
  v.registerEditorContribution(new r.ActionDescriptor(m, m.ID, n.localize(
    "vs_editor_contrib_linesOperations_linesOperations", 0), {
    ctrlCmd: !0,
    key: "D"
  }, {
    shift: !0,
    key: "Delete"
  }));

  v.registerEditorContribution(new r.ActionDescriptor(g, g.ID, n.localize(
    "vs_editor_contrib_linesOperations_linesOperations", 1), {
    alt: !0,
    key: "DownArrow"
  }));

  v.registerEditorContribution(new r.ActionDescriptor(f, f.ID, n.localize(
    "vs_editor_contrib_linesOperations_linesOperations", 2), {
    alt: !0,
    key: "UpArrow"
  }));

  v.registerEditorContribution(new r.ActionDescriptor(h, h.ID, n.localize(
    "vs_editor_contrib_linesOperations_linesOperations", 3), {
    alt: !0,
    shift: !0,
    key: "DownArrow"
  }));

  v.registerEditorContribution(new r.ActionDescriptor(d, d.ID, n.localize(
    "vs_editor_contrib_linesOperations_linesOperations", 4), {
    alt: !0,
    shift: !0,
    key: "UpArrow"
  }));
});