define("vs/editor/contrib/parameterHints/parameterHints", ["require", "exports", "vs/nls!vs/editor/editor.main",
  "./parameterHintsModel", "./parameterHintsWidget", "vs/base/lib/winjs.base", "vs/editor/editorExtensions",
  "vs/platform/platform", "vs/platform/actionRegistry"
], function(e, t, n, i, o, r, s, a, u) {
  var l = function(e) {
    function t(t, n) {
      e.call(this, t, n);
    }
    __extends(t, e);

    t.prototype.injectInstantiationService = function(e) {
      this.model = new i.ParameterHintsModel(this.editor);

      this.widget = e.createInstance(o.ParameterHintsWidget, this.model, this.editor);
    };

    t.prototype.getModel = function() {
      return this.model;
    };

    t.prototype.getEnablementState = function() {
      return e.prototype.getEnablementState.call(this) && !! this.editor.getModel().getMode().parameterHintsSupport;
    };

    t.prototype.run = function() {
      return r.TPromise.as(!1);
    };

    t.prototype.dispose = function() {
      if (this.model) {
        this.model.dispose();
        this.model = null;
      }

      if (this.widget) {
        this.widget.destroy();
        this.widget = null;
      }

      e.prototype.dispose.call(this);
    };

    t.ID = "editor.contrib.parameterHints.trigger";

    return t;
  }(s.EditorAction);
  t.TriggerParameterHintsAction = l;
  var c = a.Registry.as(s.Extensions.EditorContributions);
  c.registerEditorContribution(new u.ActionDescriptor(l, l.ID, n.localize(
    "vs_editor_contrib_parameterHints_parameterHints", 0)));
});