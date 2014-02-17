var __extends = this.__extends || function(a, b) {
    function d() {
      this.constructor = a;
    }
    for (var c in b) b.hasOwnProperty(c) && (a[c] = b[c]);
    d.prototype = b.prototype;

    a.prototype = new d;
  };

define(["require", "exports", "vs/nls", "vs/base/lib/winjs.base", "vs/platform/platform", "vs/platform/actionRegistry",
  "vs/editor/editorExtensions", "vs/editor/core/range", "vs/editor/contrib/inPlaceReplace/inPlaceReplaceCommand"
], function(a, b, c, d, e, f, g, h, i) {
  var j = c;

  var k = d;

  var l = e;

  var m = f;

  var n = g;

  var o = h;

  var p = i;

  var q = function(a) {
    function b(b, c, d) {
      a.call(this, b, c);

      this.up = d;

      this.requestIdPool = 0;

      this.currentRequest = k.Promise.as(null);

      this.decorationRemover = k.Promise.as(null);

      this.decorationIds = [];
    }
    __extends(b, a);

    b.prototype.getEnablementState = function() {
      return a.prototype.getEnablementState.call(this) && !! this.editor.getModel().getMode().inplaceReplaceSupport;
    };

    b.prototype.run = function() {
      var a = this;
      this.currentRequest.cancel();
      var c = this.editor.getSelection();

      var d = this.editor.getPosition();

      var e = this.editor.getModel();

      var f = e.getMode().inplaceReplaceSupport;
      return c.startLineNumber !== c.endLineNumber ? null : (this.currentRequest = f.navigateValueSet(e.getAssociatedResource(),
        c, this.up).then(function(d) {
        if (!d || !d.range || !d.value) return;
        var e = o.create(d.range);

        var f = d.range;

        var g = d.value.length - (c.endColumn - c.startColumn);
        f.endColumn = f.startColumn + d.value.length;

        c.endColumn += g > 1 ? g - 1 : 0;
        var h = new p.InPlaceReplaceCommand(e, c, d.value);
        a.editor.executeCommand(a.id, h);

        a.decorationIds = a.editor.deltaDecorations(a.decorationIds, [{
          range: f,
          options: b.DECORATION
        }]);

        a.decorationRemover.cancel();

        a.decorationRemover = k.Promise.timeout(350).then(function() {
          a.editor.changeDecorations(function(b) {
            while (a.decorationIds.length > 0) b.removeDecoration(a.decorationIds.pop());
          });
        });
      }), this.currentRequest);
    };

    b.COMMAND = "navigateValueSet";

    b.DECORATION = {
      isOverlay: !1,
      className: "valueSetReplacement"
    };

    return b;
  }(n.EditorAction);

  var r = function(a) {
    function b(b, c) {
      a.call(this, b, c, !0);
    }
    __extends(b, a);

    b.ID = "editor.actions.inPlaceReplace.up";

    return b;
  }(q);

  var s = function(a) {
    function b(b, c) {
      a.call(this, b, c, !1);
    }
    __extends(b, a);

    b.ID = "editor.actions.inPlaceReplace.down";

    return b;
  }(q);

  var t = new m.ActionDescriptor(r, r.ID, j.localize("InPlaceReplaceAction.previous.label",
    "Replace with previous value"), {
    ctrlCmd: !0,
    key: "UpArrow"
  });

  var u = new m.ActionDescriptor(s, s.ID, j.localize("InPlaceReplaceAction.next.label", "Replace with next value"), {
    ctrlCmd: !0,
    key: "DownArrow"
  });

  var v = l.Registry.as(n.Extensions.EditorContributions);
  v.registerEditorContribution(t);

  v.registerEditorContribution(u);
});