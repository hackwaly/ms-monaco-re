var __extends = this.__extends || function(a, b) {
    function d() {
      this.constructor = a;
    }
    for (var c in b) b.hasOwnProperty(c) && (a[c] = b[c]);
    d.prototype = b.prototype;

    a.prototype = new d;
  };

define(["require", "exports", "vs/nls", "./parameterHintsModel", "./parameterHintsWidget", "vs/base/lib/winjs.base",
  "vs/editor/editorExtensions", "vs/platform/platform", "vs/platform/actionRegistry"
], function(a, b, c, d, e, f, g, h, i) {
  var j = c;

  var k = d;

  var l = e;

  var m = f;

  var n = g;

  var o = h;

  var p = i;

  var q = function(a) {
    function b(b, c) {
      a.call(this, b, c);

      this.model = new k.ParameterHintsModel(this.editor);

      this.parameterHintsWidget = null;
    }
    __extends(b, a);

    b.prototype.getModel = function() {
      return this.model;
    };

    b.prototype.injectHandlerService = function(b) {
      a.prototype.injectHandlerService.call(this, b);

      this.parameterHintsWidget || (this.parameterHintsWidget = new l.ParameterHintsWidget(this.model, this.editor,
        this.handlerService));
    };

    b.prototype.getEnablementState = function() {
      return a.prototype.getEnablementState.call(this) && !! this.editor.getModel().getMode().parameterHintsSupport;
    };

    b.prototype.run = function() {
      return m.Promise.as(!1);
    };

    b.prototype.dispose = function() {
      a.prototype.dispose.call(this);

      this.model && (this.model.dispose(), this.model = null);

      this.parameterHintsWidget && (this.parameterHintsWidget.destroy(), this.parameterHintsWidget = null);
    };

    b.ID = "editor.contrib.parameterHints.trigger";

    return b;
  }(n.EditorAction);
  b.TriggerParameterHintsAction = q;
  var r = o.Registry.as(n.Extensions.EditorContributions);
  r.registerEditorContribution(new p.ActionDescriptor(q, q.ID, j.localize("parameterHints.trigger.label",
    "Trigger parameter hints")));
});