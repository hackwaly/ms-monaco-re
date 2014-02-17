define("vs/editor/core/embeddedCodeEditorWidget", ["require", "exports", "vs/editor/core/codeEditorWidget",
  "vs/editor/core/constants", "vs/base/objects"
], function(e, t, n, i, o) {
  var r = function(e) {
    function t(t, n, o, r) {
      var s = this;
      e.call(this, n, t.getRawConfiguration(), r);

      this._parentEditor = t;

      this._overwriteOptions = o;

      e.prototype.updateOptions.call(this, this._overwriteOptions);

      this._lifetimeListeners.push(t.addListener(i.EventType.ConfigurationChanged, function(e) {
        return s._onParentConfigurationChanged(e);
      }));
    }
    __extends(t, e);

    t.prototype._onParentConfigurationChanged = function() {
      e.prototype.updateOptions.call(this, this._parentEditor.getRawConfiguration());

      e.prototype.updateOptions.call(this, this._overwriteOptions);
    };

    t.prototype.updateOptions = function(t) {
      o.mixin(this._overwriteOptions, t, !0);

      e.prototype.updateOptions.call(this, this._overwriteOptions);
    };

    return t;
  }(n.CodeEditorWidget);
  t.EmbeddedCodeEditorWidget = r;
});