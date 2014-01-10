var __extends = this.__extends || function(a, b) {
    function d() {
      this.constructor = a
    }
    for (var c in b) b.hasOwnProperty(c) && (a[c] = b[c]);
    d.prototype = b.prototype, a.prototype = new d
  };
define(["require", "exports", "vs/base/lib/winjs.base", "vs/nls", "vs/platform/platform", "vs/platform/actionRegistry",
  "vs/editor/editorExtensions", "vs/platform/services", "vs/editor/core/range", "vs/editor/core/editorState",
  "vs/editor/core/constants", "vs/css!./rename"
], function(a, b, c, d, e, f, g, h, i, j, k) {
  var l = c,
    m = d,
    n = e,
    o = f,
    p = g,
    q = h,
    r = i,
    s = j,
    t = k,
    u = function() {
      function a(a, b, c, d) {
        var e = this;
        this.editor = a, this.isDisposed = !1, this.editor.changeDecorations(function(a) {
          e.decorations = [];
          for (var d = 0, f = b.length; d < f; d++) {
            var g = "linked-editing-placeholder";
            e.decorations.push(a.addDecoration(c[d], {
              className: g
            }))
          }
        }), this.editor.setSelections(b), this.listenersToRemove = [], this.listenersToRemove.push(this.editor.addListener(
          t.EventType.CursorPositionChanged, function(a) {
            if (e.isDisposed) return;
            var b = 1 + a.secondaryPositions.length;
            b !== e.decorations.length && e.dispose()
          })), this.binding = d.bindGroup(function(a) {
          a({
            key: "Enter"
          }, function() {
            return e.onEnterOrEscape()
          }), a({
            key: "Escape"
          }, function() {
            return e.onEnterOrEscape()
          })
        })
      }
      return a.prototype.onEnterOrEscape = function() {
        if (this.isDisposed) return;
        return this.editor.setSelection(this.editor.getSelection()), this.dispose(), !0
      }, a.prototype.dispose = function() {
        if (this.isDisposed) return;
        this.isDisposed = !0, this.decorations = this.editor.deltaDecorations(this.decorations, []), this.binding.dispose(),
          this.listenersToRemove.forEach(function(a) {
            a()
          }), this.listenersToRemove = []
      }, a
    }(),
    v = function(a) {
      function b(b, c) {
        a.call(this, b, c), this.idPool = 0
      }
      return __extends(b, a), b.prototype.injectMessageService = function(a) {
        this.messageService = a
      }, b.prototype.computeInfos = function(a) {
        return l.Promise.as([])
      }, b.prototype.getEnablementState = function() {
        return a.prototype.getEnablementState.call(this) && !! this.messageService
      }, b.prototype.run = function() {
        var a = this,
          b = ++this.idPool,
          c = s.capture(this.editor, s.Flag.Position, s.Flag.Value),
          d = this.editor.getSelection();
        return this.computeInfos(this.editor).then(function(e) {
          if (b !== a.idPool) return;
          if (!c.validate()) return;
          if (e.length === 0) return;
          var f = e.map(function(a) {
            return a.range
          });
          a._beginLinkedEditing(f, d)
        }, function(b) {
          a.messageService.show(q.Severity.Info, b)
        })
      }, b.prototype._indexOf = function(a, b, c) {
        var d = {
          lineNumber: b,
          column: c
        };
        for (var e = 0; e < a.length; e++) {
          if (a[e].startLineNumber !== b) continue;
          if (r.RangeUtils.containsPosition(a[e], d)) return e
        }
        return -1
      }, b.prototype._beginLinkedEditing = function(a, b) {
        var c = this.editor.getSelection(),
          d = this._indexOf(a, c.positionLineNumber, c.positionColumn);
        if (d === -1) {
          c = b, d = this._indexOf(a, c.positionLineNumber, c.positionColumn);
          if (d === -1) return
        }
        var e = !1;
        c.isEmpty() || r.RangeUtils.containsPosition(a[d], {
          lineNumber: c.selectionStartLineNumber,
          column: c.selectionStartColumn
        }) && (e = !0);
        var f, g;
        e ? (f = c.positionColumn - a[d].startColumn, g = c.selectionStartColumn - a[d].startColumn) : (f = a[d].endColumn -
          a[d].startColumn, g = 0);
        var h = [];
        h.push({
          selectionStartLineNumber: a[d].startLineNumber,
          selectionStartColumn: a[d].startColumn + g,
          positionLineNumber: a[d].startLineNumber,
          positionColumn: a[d].startColumn + f
        });
        for (var i = 0; i < a.length; i++) i !== d && h.push({
          selectionStartLineNumber: a[i].startLineNumber,
          selectionStartColumn: a[i].startColumn + g,
          positionLineNumber: a[i].startLineNumber,
          positionColumn: a[i].startColumn + f
        });
        new u(this.editor, h, a, this.handlerService)
      }, b
    }(p.EditorAction);
  b.LinkedEditing = v;
  var w = function(a) {
    function b(b, c) {
      a.call(this, b, c)
    }
    return __extends(b, a), b.prototype.getEnablementState = function() {
      return a.prototype.getEnablementState.call(this) && !! this.editor.getModel().getMode().occurrencesSupport
    }, b.prototype.computeInfos = function(a) {
      var b = a.getSelection(),
        c = b.getStartPosition(),
        d = a.getModel();
      return this.editor.getModel().getMode().occurrencesSupport.findOccurrences(d.getAssociatedResource(), c)
    }, b.ID = "editor.actions.changeAll", b
  }(v);
  b.ChangeAllAction = w;
  var x = function(a) {
    function b(b, c) {
      a.call(this, b, c)
    }
    return __extends(b, a), b.prototype.getEnablementState = function() {
      return a.prototype.getEnablementState.call(this) && !! this.editor.getModel().getMode().referenceSupport
    }, b.prototype.computeInfos = function(a) {
      var c = a.getSelection(),
        d = c.getStartPosition(),
        e = a.getModel(),
        f = e.getMode();
      return new l.Promise(function(a, b, c) {
        f.referenceSupport.findReferences(e.getAssociatedResource(), d).then(function(c) {
          var d, e, f = !1,
            g = [];
          for (e = 0; !f && e < c.length; e++) {
            var h = c[e];
            if (typeof d == "undefined") d = h.resourceUrl;
            else if (d !== h.resourceUrl) {
              f = !0;
              break
            }
            g.push({
              kind: null,
              range: h.range
            })
          }
          f ? b(m.localize("rename.error.multiplefile",
            "Sorry, but rename can not yet be performed on symbols that are used in multiple files.")) : a(g)
        }, b, c)
      })
    }, b.ID = "editor.actions.rename", b
  }(v);
  b.RenameAction = x;
  var y = n.Registry.as(p.Extensions.EditorContributions);
  y.registerEditorContribution(new o.ActionDescriptor(x, x.ID, m.localize("rename.label", "Rename symbol"), {
    key: "F2"
  }, {
    ctrlCmd: !0,
    key: "B"
  })), y.registerEditorContribution(new o.ActionDescriptor(w, w.ID, m.localize("changeAll.label",
    "Change all occurrences"), {
    ctrlCmd: !0,
    alt: !0,
    key: "B"
  }, {
    ctrlCmd: !0,
    key: "F2"
  }))
})