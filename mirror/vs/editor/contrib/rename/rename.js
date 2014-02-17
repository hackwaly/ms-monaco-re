define("vs/editor/contrib/rename/rename", ["require", "exports", "vs/base/lib/winjs.base",
  "vs/nls!vs/editor/editor.main", "vs/platform/platform", "vs/platform/actionRegistry", "vs/editor/editorExtensions",
  "vs/platform/services", "vs/editor/core/range", "vs/editor/core/editorState", "vs/editor/core/constants",
  "vs/css!./rename"
], function(e, t, n, i, o, r, s, a, u, l, c) {
  var d = function() {
    function e(e, t, n, i) {
      var o = this;
      this.editor = e;

      this.isDisposed = !1;

      this.editor.changeDecorations(function(e) {
        o.decorations = [];
        for (var i = 0, r = t.length; r > i; i++) {
          var s = "linked-editing-placeholder";
          o.decorations.push(e.addDecoration(n[i], {
            className: s
          }));
        }
      });

      this.editor.setSelections(t);

      this.listenersToRemove = [];

      this.listenersToRemove.push(this.editor.addListener(c.EventType.CursorPositionChanged, function(e) {
        if (!o.isDisposed) {
          var t = 1 + e.secondaryPositions.length;
          if (t !== o.decorations.length) {
            o.dispose();
          }
        }
      }));

      this.binding = i.bindGroup(function(e) {
        e({
          key: "Enter"
        }, function() {
          return o.onEnterOrEscape();
        });

        e({
          key: "Escape"
        }, function() {
          return o.onEnterOrEscape();
        });
      });
    }
    e.prototype.onEnterOrEscape = function() {
      return this.isDisposed ? void 0 : (this.editor.setSelection(this.editor.getSelection()), this.dispose(), !0);
    };

    e.prototype.dispose = function() {
      if (!this.isDisposed) {
        this.isDisposed = !0;
        this.decorations = this.editor.deltaDecorations(this.decorations, []);
        this.binding.dispose();
        this.listenersToRemove.forEach(function(e) {
          e();
        });
        this.listenersToRemove = [];
      }
    };

    return e;
  }();

  var h = function(e) {
    function t(t, n) {
      e.call(this, t, n, s.Precondition.WidgetFocus | s.Precondition.Writeable | s.Precondition.ShowInContextMenu);

      this.idPool = 0;
    }
    __extends(t, e);

    t.prototype.injectMessageService = function(e) {
      this.messageService = e;
    };

    t.prototype.computeInfos = function() {
      return n.Promise.as([]);
    };

    t.prototype.getEnablementState = function() {
      return e.prototype.getEnablementState.call(this) && !! this.messageService;
    };

    t.prototype.run = function() {
      var e = this;

      var t = ++this.idPool;

      var n = l.capture(this.editor, 2, 0);

      var i = this.editor.getSelection();
      return this.computeInfos(this.editor).then(function(o) {
        if (t === e.idPool && n.validate() && 0 !== o.length) {
          var r = o.map(function(e) {
            return e.range;
          });
          e._beginLinkedEditing(r, i);
        }
      }, function(t) {
        e.messageService.show(0, t);
      });
    };

    t.prototype._indexOf = function(e, t, n) {
      for (var i = {
        lineNumber: t,
        column: n
      }, o = 0; o < e.length; o++)
        if (e[o].startLineNumber === t && u.containsPosition(e[o], i)) {
          return o;
        }
      return -1;
    };

    t.prototype._beginLinkedEditing = function(e, t) {
      var n = this.editor.getSelection();

      var i = this._indexOf(e, n.positionLineNumber, n.positionColumn);
      if (-1 !== i || (n = t, i = this._indexOf(e, n.positionLineNumber, n.positionColumn), -1 !== i)) {
        var o = !1;
        if (!n.isEmpty()) {
          if (u.containsPosition(e[i], {
            lineNumber: n.selectionStartLineNumber,
            column: n.selectionStartColumn
          })) {
            o = !0;
          }
        }
        var r;

        var s;
        if (o) {
          r = n.positionColumn - e[i].startColumn;
          s = n.selectionStartColumn - e[i].startColumn;
        }

        {
          r = e[i].endColumn - e[i].startColumn;
          s = 0;
        }
        var a = [];
        a.push({
          selectionStartLineNumber: e[i].startLineNumber,
          selectionStartColumn: e[i].startColumn + s,
          positionLineNumber: e[i].startLineNumber,
          positionColumn: e[i].startColumn + r
        });
        for (var l = 0; l < e.length; l++) {
          if (l !== i) {
            a.push({
              selectionStartLineNumber: e[l].startLineNumber,
              selectionStartColumn: e[l].startColumn + s,
              positionLineNumber: e[l].startLineNumber,
              positionColumn: e[l].startColumn + r
            });
          }
        }
        new d(this.editor, a, e, this.handlerService);
      }
    };

    return t;
  }(s.EditorAction);
  t.LinkedEditing = h;
  var p = function(e) {
    function t(t, n) {
      e.call(this, t, n);
    }
    __extends(t, e);

    t.prototype.getEnablementState = function() {
      return e.prototype.getEnablementState.call(this) && this.editor.getModel().getMode().occurrencesSupport && !
        this.editor.getModel().hasEditableRange();
    };

    t.prototype.computeInfos = function(e) {
      var t = e.getSelection();

      var n = t.getStartPosition();

      var i = e.getModel();
      return this.editor.getModel().getMode().occurrencesSupport.findOccurrences(i.getAssociatedResource(), n);
    };

    t.ID = "editor.actions.changeAll";

    return t;
  }(h);
  t.ChangeAllAction = p;
  var f = function(e) {
    function t(t, n) {
      e.call(this, t, n);
    }
    __extends(t, e);

    t.prototype.getEnablementState = function() {
      return e.prototype.getEnablementState.call(this) && !! this.editor.getModel().getMode().referenceSupport;
    };

    t.prototype.computeInfos = function(e) {
      var t = e.getSelection();

      var o = t.getStartPosition();

      var r = e.getModel();

      var s = r.getMode();
      return new n.Promise(function(e, t, n) {
        s.referenceSupport.findReferences(r.getAssociatedResource(), o).then(function(n) {
          var o;

          var r;

          var s = !1;

          var a = [];
          for (r = 0; !s && r < n.length; r++) {
            var u = n[r];
            if ("undefined" == typeof o) {
              o = u.resourceUrl;
            } else if (o !== u.resourceUrl) {
              s = !0;
              break;
            }
            a.push({
              kind: null,
              range: u.range
            });
          }
          if (s) {
            t(i.localize("vs_editor_contrib_rename_rename", 0));
          }

          {
            e(a);
          }
        }, t, n);
      });
    };

    t.ID = "editor.actions.rename";

    return t;
  }(h);
  t.RenameAction = f;
  var g = o.Registry.as(s.Extensions.EditorContributions);
  g.registerEditorContribution(new r.ActionDescriptor(f, f.ID, i.localize("vs_editor_contrib_rename_rename", 1), {
    key: "F2"
  }));

  g.registerEditorContribution(new r.ActionDescriptor(p, p.ID, i.localize("vs_editor_contrib_rename_rename", 2), {
    ctrlCmd: !0,
    key: "F2"
  }));
});