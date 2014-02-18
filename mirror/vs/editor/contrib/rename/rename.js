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

define(["require", "exports", "vs/base/lib/winjs.base", "vs/nls", "vs/platform/platform", "vs/platform/actionRegistry",
  "vs/editor/editorExtensions", "vs/platform/services", "vs/editor/core/range", "vs/editor/core/editorState",
  "vs/editor/core/constants", "vs/css!./rename"
], function(a, b, c, d, e, f, g, h, i, j, k) {
  var l = c;

  var m = d;

  var n = e;

  var o = f;

  var p = g;

  var q = h;

  var r = i;

  var s = j;

  var t = k;

  var u = function() {
    function a(a, b, c, d) {
      var e = this;
      this.editor = a;

      this.isDisposed = !1;

      this.editor.changeDecorations(function(a) {
        e.decorations = [];
        for (var d = 0, f = b.length; d < f; d++) {
          var g = "linked-editing-placeholder";
          e.decorations.push(a.addDecoration(c[d], {
            className: g
          }));
        }
      });

      this.editor.setSelections(b);

      this.listenersToRemove = [];

      this.listenersToRemove.push(this.editor.addListener(t.EventType.CursorPositionChanged, function(a) {
        if (e.isDisposed) return;
        var b = 1 + a.secondaryPositions.length;
        if (b !== e.decorations.length) {
          e.dispose();
        }
      }));

      this.binding = d.bindGroup(function(a) {
        a({
          key: "Enter"
        }, function() {
          return e.onEnterOrEscape();
        });

        a({
          key: "Escape"
        }, function() {
          return e.onEnterOrEscape();
        });
      });
    }
    a.prototype.onEnterOrEscape = function() {
      if (this.isDisposed) return;
      this.editor.setSelection(this.editor.getSelection());

      this.dispose();

      return !0;
    };

    a.prototype.dispose = function() {
      if (this.isDisposed) return;
      this.isDisposed = !0;

      this.decorations = this.editor.deltaDecorations(this.decorations, []);

      this.binding.dispose();

      this.listenersToRemove.forEach(function(a) {
        a();
      });

      this.listenersToRemove = [];
    };

    return a;
  }();

  var v = function(a) {
    function b(b, c) {
      a.call(this, b, c);

      this.idPool = 0;
    }
    __extends(b, a);

    b.prototype.injectMessageService = function(a) {
      this.messageService = a;
    };

    b.prototype.computeInfos = function(a) {
      return l.Promise.as([]);
    };

    b.prototype.getEnablementState = function() {
      return a.prototype.getEnablementState.call(this) && !! this.messageService;
    };

    b.prototype.run = function() {
      var a = this;

      var b = ++this.idPool;

      var c = s.capture(this.editor, s.Flag.Position, s.Flag.Value);

      var d = this.editor.getSelection();
      return this.computeInfos(this.editor).then(function(e) {
        if (b !== a.idPool) return;
        if (!c.validate()) return;
        if (e.length === 0) return;
        var f = e.map(function(a) {
          return a.range;
        });
        a._beginLinkedEditing(f, d);
      }, function(b) {
        a.messageService.show(q.Severity.Info, b);
      });
    };

    b.prototype._indexOf = function(a, b, c) {
      var d = {
        lineNumber: b,
        column: c
      };
      for (var e = 0; e < a.length; e++) {
        if (a[e].startLineNumber !== b) continue;
        if (r.RangeUtils.containsPosition(a[e], d)) {
          return e;
        }
      }
      return -1;
    };

    b.prototype._beginLinkedEditing = function(a, b) {
      var c = this.editor.getSelection();

      var d = this._indexOf(a, c.positionLineNumber, c.positionColumn);
      if (d === -1) {
        c = b;

        d = this._indexOf(a, c.positionLineNumber, c.positionColumn);
        if (d === -1) return;
      }
      var e = !1;
      if (!c.isEmpty()) {
        if (r.RangeUtils.containsPosition(a[d], {
          lineNumber: c.selectionStartLineNumber,
          column: c.selectionStartColumn
        })) {
          e = !0;
        }
      }
      var f;

      var g;
      if (e) {
        f = c.positionColumn - a[d].startColumn;
        g = c.selectionStartColumn - a[d].startColumn;
      } else {
        f = a[d].endColumn - a[d].startColumn;
        g = 0;
      }
      var h = [];
      h.push({
        selectionStartLineNumber: a[d].startLineNumber,
        selectionStartColumn: a[d].startColumn + g,
        positionLineNumber: a[d].startLineNumber,
        positionColumn: a[d].startColumn + f
      });
      for (var i = 0; i < a.length; i++) {
        if (i !== d) {
          h.push({
            selectionStartLineNumber: a[i].startLineNumber,
            selectionStartColumn: a[i].startColumn + g,
            positionLineNumber: a[i].startLineNumber,
            positionColumn: a[i].startColumn + f
          });
        }
      }
      new u(this.editor, h, a, this.handlerService);
    };

    return b;
  }(p.EditorAction);
  b.LinkedEditing = v;
  var w = function(a) {
    function b(b, c) {
      a.call(this, b, c);
    }
    __extends(b, a);

    b.prototype.getEnablementState = function() {
      return a.prototype.getEnablementState.call(this) && !! this.editor.getModel().getMode().occurrencesSupport;
    };

    b.prototype.computeInfos = function(a) {
      var b = a.getSelection();

      var c = b.getStartPosition();

      var d = a.getModel();
      return this.editor.getModel().getMode().occurrencesSupport.findOccurrences(d.getAssociatedResource(), c);
    };

    b.ID = "editor.actions.changeAll";

    return b;
  }(v);
  b.ChangeAllAction = w;
  var x = function(a) {
    function b(b, c) {
      a.call(this, b, c);
    }
    __extends(b, a);

    b.prototype.getEnablementState = function() {
      return a.prototype.getEnablementState.call(this) && !! this.editor.getModel().getMode().referenceSupport;
    };

    b.prototype.computeInfos = function(a) {
      var c = a.getSelection();

      var d = c.getStartPosition();

      var e = a.getModel();

      var f = e.getMode();
      return new l.Promise(function(a, b, c) {
        f.referenceSupport.findReferences(e.getAssociatedResource(), d).then(function(c) {
          var d;

          var e;

          var f = !1;

          var g = [];
          for (e = 0; !f && e < c.length; e++) {
            var h = c[e];
            if (typeof d == "undefined") {
              d = h.resourceUrl;
            } else if (d !== h.resourceUrl) {
              f = !0;
              break;
            }
            g.push({
              kind: null,
              range: h.range
            });
          }
          if (f) {
            b(m.localize("rename.error.multiplefile",
              "Sorry, but rename can not yet be performed on symbols that are used in multiple files."));
          } else {
            a(g);
          }
        }, b, c);
      });
    };

    b.ID = "editor.actions.rename";

    return b;
  }(v);
  b.RenameAction = x;
  var y = n.Registry.as(p.Extensions.EditorContributions);
  y.registerEditorContribution(new o.ActionDescriptor(x, x.ID, m.localize("rename.label", "Rename symbol"), {
    key: "F2"
  }, {
    ctrlCmd: !0,
    key: "B"
  }));

  y.registerEditorContribution(new o.ActionDescriptor(w, w.ID, m.localize("changeAll.label", "Change all occurrences"), {
    ctrlCmd: !0,
    alt: !0,
    key: "B"
  }, {
    ctrlCmd: !0,
    key: "F2"
  }));
});