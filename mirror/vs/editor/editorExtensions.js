define("vs/editor/editorExtensions", ["require", "exports", "vs/base/ui/actions", "vs/editor/core/constants",
  "vs/base/lib/winjs.base", "vs/platform/platform"
], function(e, t, n, i, o, r) {
  ! function(e) {
    e[e.TextFocus = 1] = "TextFocus";

    e[e.WidgetFocus = 2] = "WidgetFocus";

    e[e.Writeable = 4] = "Writeable";

    e[e.UpdateOnModelChange = 8] = "UpdateOnModelChange";

    e[e.UpdateOnConfigurationChange = 16] = "UpdateOnConfigurationChange";

    e[e.ShowInContextMenu = 32] = "ShowInContextMenu";
  }(t.Precondition || (t.Precondition = {}));
  var s = t.Precondition;
  t.defaultPrecondition = s.TextFocus | s.Writeable | s.UpdateOnModelChange;
  var a = function(e) {
    function n(n, o, r) {
      if ("undefined" == typeof r) {
        r = t.defaultPrecondition;
      }
      var a = this;
      e.call(this, o.id);

      this.descriptor = o;

      this.editor = n;

      this.needsTextFocus = !! (r & s.TextFocus);

      this.needsWidgetFocus = !! (r & s.WidgetFocus);

      this.needsWritable = !! (r & s.Writeable);

      this._shouldShowInContextMenu = !! (r & s.ShowInContextMenu);

      this.toUnhook = [];

      this.bindings = [];

      if (o.label) {
        this.label = o.label;
      }

      this.hasFocus = !1;

      if (this.needsTextFocus) {
        this.toUnhook.push(this.editor.addListener("focus", function() {
          return a.onFocusChanged(!0);
        }));
        this.toUnhook.push(this.editor.addListener("blur", function() {
          return a.onFocusChanged(!1);
        }));
      }

      this.hasWidgetFocus = !1;

      if (this.needsWidgetFocus) {
        this.toUnhook.push(this.editor.addListener("widgetFocus", function() {
          return a.onWidgetFocusChanges(!0);
        }));
        this.toUnhook.push(this.editor.addListener("widgetBlur", function() {
          return a.onWidgetFocusChanges(!1);
        }));
      }

      this.isReadOnly = this.editor.getConfiguration().readOnly;

      if (this.needsWritable) {
        this.toUnhook.push(this.editor.addListener(i.EventType.ConfigurationChanged, function(e) {
          return a.onConfigurationChanged(e);
        }));
      }

      if (r & s.UpdateOnModelChange) {
        this.toUnhook.push(this.editor.addListener(i.EventType.ModelChanged, function() {
          return a.updateEnablementState();
        }));
      }

      if (r & s.UpdateOnConfigurationChange) {
        this.toUnhook.push(this.editor.addListener(i.EventType.ConfigurationChanged, function() {
          return a.updateEnablementState();
        }));
      }

      this.enabled = this.getEnablementState();
    }
    __extends(n, e);

    n.prototype.getId = function() {
      return this.id;
    };

    n.prototype.injectTelemetryService = function(e) {
      this.telemetryService = e;
    };

    n.prototype.injectHandlerService = function(e) {
      var t = this;
      this.handlerService = e;
      for (var n = function() {
        return t.enabled ? (t.telemetryService.publicLog("editorActionInvoked", {
          name: t.label
        }), o.Promise.as(t.run()).done(), !0) : !1;
      }, i = 0; i < this.descriptor.keybindings.length; i++) {
        this.bindings.push(this.handlerService.bind(this.descriptor.keybindings[i], n));
      }
      this.updateEnablementState();
    };

    n.prototype.shouldShowInContextMenu = function() {
      return this._shouldShowInContextMenu;
    };

    n.prototype.getDescriptor = function() {
      return this.descriptor;
    };

    n.prototype.onFocusChanged = function(e) {
      this.hasFocus = e;

      this.enabled = this.getEnablementState();
    };

    n.prototype.onWidgetFocusChanges = function(e) {
      this.hasWidgetFocus = e;

      this.enabled = this.getEnablementState();
    };

    n.prototype.onConfigurationChanged = function() {
      this.isReadOnly = this.editor.getConfiguration().readOnly;

      this.enabled = this.getEnablementState();
    };

    n.prototype.getEnablementState = function() {
      return this.editor.getModel() ? this.needsTextFocus && !this.hasFocus ? !1 : this.needsWidgetFocus && !this.hasWidgetFocus ? !
        1 : this.needsWritable && this.isReadOnly ? !1 : !! this.handlerService && !! this.telemetryService : !1;
    };

    n.prototype.updateEnablementState = function() {
      this.enabled = this.getEnablementState();
    };

    n.prototype.dispose = function() {
      for (; this.toUnhook.length > 0;) {
        this.toUnhook.pop()();
      }
      for (var t = 0; t < this.bindings.length; t++) {
        this.bindings[t].dispose();
      }
      this.bindings = [];

      e.prototype.dispose.call(this);
    };

    return n;
  }(n.Action);
  t.EditorAction = a;

  t.Extensions = {
    EditorContributions: "editor.contributions"
  };
  var u = function() {
    function e() {
      this.editorContributions = [];
    }
    e.prototype.registerEditorContribution = function(e) {
      this.editorContributions.push(e);
    };

    e.prototype.getEditorContributions = function() {
      return this.editorContributions.slice(0);
    };

    return e;
  }();
  r.Registry.add(t.Extensions.EditorContributions, new u);
});