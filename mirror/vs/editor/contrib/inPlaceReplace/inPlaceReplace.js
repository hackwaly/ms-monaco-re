var __extends = this.__extends || function(a, b) {
    function d() {
      this.constructor = a
    }
    for (var c in b) b.hasOwnProperty(c) && (a[c] = b[c]);
    d.prototype = b.prototype, a.prototype = new d
  };
define(["require", "exports", "vs/nls", "vs/base/lib/winjs.base", "vs/platform/platform", "vs/platform/actionRegistry",
  "vs/editor/editorExtensions", "vs/editor/core/range", "vs/editor/contrib/inPlaceReplace/inPlaceReplaceCommand"
], function(a, b, c, d, e, f, g, h, i) {
  var j = c,
    k = d,
    l = e,
    m = f,
    n = g,
    o = h,
    p = i,
    q = function(a) {
      function b(b, c, d) {
        a.call(this, b, c), this.up = d, this.requestIdPool = 0, this.currentRequest = k.Promise.as(null), this.decorationRemover =
          k.Promise.as(null), this.decorationIds = []
      }
      return __extends(b, a), b.prototype.getEnablementState = function() {
        return a.prototype.getEnablementState.call(this) && !! this.editor.getModel().getMode().inplaceReplaceSupport
      }, b.prototype.run = function() {
        var a = this;
        this.currentRequest.cancel();
        var c = this.editor.getSelection(),
          d = this.editor.getPosition(),
          e = this.editor.getModel(),
          f = e.getMode().inplaceReplaceSupport;
        return c.startLineNumber !== c.endLineNumber ? null : (this.currentRequest = f.navigateValueSet(e.getAssociatedResource(),
          c, this.up).then(function(d) {
          if (!d || !d.range || !d.value) return;
          var e = o.create(d.range),
            f = d.range,
            g = d.value.length - (c.endColumn - c.startColumn);
          f.endColumn = f.startColumn + d.value.length, c.endColumn += g > 1 ? g - 1 : 0;
          var h = new p.InPlaceReplaceCommand(e, c, d.value);
          a.editor.executeCommand(a.id, h), a.decorationIds = a.editor.deltaDecorations(a.decorationIds, [{
            range: f,
            options: b.DECORATION
          }]), a.decorationRemover.cancel(), a.decorationRemover = k.Promise.timeout(350).then(function() {
            a.editor.changeDecorations(function(b) {
              while (a.decorationIds.length > 0) b.removeDecoration(a.decorationIds.pop())
            })
          })
        }), this.currentRequest)
      }, b.COMMAND = "navigateValueSet", b.DECORATION = {
        isOverlay: !1,
        className: "valueSetReplacement"
      }, b
    }(n.EditorAction),
    r = function(a) {
      function b(b, c) {
        a.call(this, b, c, !0)
      }
      return __extends(b, a), b.ID = "editor.actions.inPlaceReplace.up", b
    }(q),
    s = function(a) {
      function b(b, c) {
        a.call(this, b, c, !1)
      }
      return __extends(b, a), b.ID = "editor.actions.inPlaceReplace.down", b
    }(q),
    t = new m.ActionDescriptor(r, r.ID, j.localize("InPlaceReplaceAction.previous.label",
      "Replace with previous value"), {
      ctrlCmd: !0,
      key: "UpArrow"
    }),
    u = new m.ActionDescriptor(s, s.ID, j.localize("InPlaceReplaceAction.next.label", "Replace with next value"), {
      ctrlCmd: !0,
      key: "DownArrow"
    }),
    v = l.Registry.as(n.Extensions.EditorContributions);
  v.registerEditorContribution(t), v.registerEditorContribution(u)
})