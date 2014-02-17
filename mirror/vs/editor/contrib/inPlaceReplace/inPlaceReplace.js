define("vs/editor/contrib/inPlaceReplace/inPlaceReplace", ["require", "exports", "vs/nls!vs/editor/editor.main",
  "vs/base/lib/winjs.base", "vs/platform/platform", "vs/platform/actionRegistry", "vs/editor/editorExtensions",
  "vs/editor/core/range", "vs/editor/core/editorState", "vs/editor/contrib/inPlaceReplace/inPlaceReplaceCommand"
], function(e, t, n, i, o, r, s, a, u, l) {
  var c = function(e) {
    function t(t, n, o) {
      e.call(this, t, n);

      this.up = o;

      this.requestIdPool = 0;

      this.currentRequest = i.TPromise.as(null);

      this.decorationRemover = i.TPromise.as(null);

      this.decorationIds = [];
    }
    __extends(t, e);

    t.prototype.getEnablementState = function() {
      return e.prototype.getEnablementState.call(this) && !! this.editor.getModel().getMode().inplaceReplaceSupport;
    };

    t.prototype.run = function() {
      var e = this;
      this.currentRequest.cancel();
      var n = this.editor.getSelection();

      var o = (this.editor.getPosition(), this.editor.getModel());

      var r = o.getMode().inplaceReplaceSupport;
      if (n.startLineNumber !== n.endLineNumber) {
        return null;
      }
      var s = u.capture(this.editor, 0, 2);
      this.currentRequest = r.navigateValueSet(o.getAssociatedResource(), n, this.up);

      return this.currentRequest.then(function(o) {
        if (o && o.range && o.value && s.validate()) {
          var r = a.create(o.range);

          var u = o.range;

          var c = o.value.length - (n.endColumn - n.startColumn);
          u.endColumn = u.startColumn + o.value.length;

          n.endColumn += c > 1 ? c - 1 : 0;
          var d = new l.InPlaceReplaceCommand(r, n, o.value);
          e.editor.executeCommand(e.id, d);

          e.decorationIds = e.editor.deltaDecorations(e.decorationIds, [{
            range: u,
            options: t.DECORATION
          }]);

          e.decorationRemover.cancel();

          e.decorationRemover = i.TPromise.timeout(350);

          e.decorationRemover.then(function() {
            e.editor.changeDecorations(function(t) {
              for (; e.decorationIds.length > 0;) {
                t.removeDecoration(e.decorationIds.pop());
              }
            });
          });

          return !0;
        }
      });
    };

    t.COMMAND = "navigateValueSet";

    t.DECORATION = {
      isOverlay: !1,
      className: "valueSetReplacement"
    };

    return t;
  }(s.EditorAction);

  var d = function(e) {
    function t(t, n) {
      e.call(this, t, n, !0);
    }
    __extends(t, e);

    t.ID = "editor.actions.inPlaceReplace.up";

    return t;
  }(c);

  var h = function(e) {
    function t(t, n) {
      e.call(this, t, n, !1);
    }
    __extends(t, e);

    t.ID = "editor.actions.inPlaceReplace.down";

    return t;
  }(c);

  var p = new r.ActionDescriptor(d, d.ID, n.localize("vs_editor_contrib_inPlaceReplace_inPlaceReplace", 0), {
    ctrlCmd: !0,
    key: "UpArrow"
  });

  var f = new r.ActionDescriptor(h, h.ID, n.localize("vs_editor_contrib_inPlaceReplace_inPlaceReplace", 1), {
    ctrlCmd: !0,
    key: "DownArrow"
  });

  var g = o.Registry.as(s.Extensions.EditorContributions);
  g.registerEditorContribution(p);

  g.registerEditorContribution(f);
});