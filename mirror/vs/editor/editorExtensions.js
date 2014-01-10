var __extends = this.__extends || function(a, b) {
    function d() {
      this.constructor = a
    }
    for (var c in b) b.hasOwnProperty(c) && (a[c] = b[c]);
    d.prototype = b.prototype, a.prototype = new d
  };
define(["require", "exports", "vs/base/ui/actions", "vs/editor/core/constants", "vs/base/lib/winjs.base",
  "vs/editor/editor", "vs/platform/platform", "vs/platform/services"
], function(a, b, c, d, e, f, g, h) {
  var i = c,
    j = d,
    k = e,
    l = f,
    m = g,
    n = h;
  (function(a) {
    a[a.TextFocus = 1] = "TextFocus", a[a.WidgetFocus = 2] = "WidgetFocus", a[a.Writeable = 4] = "Writeable", a[a.UpdateOnModelChange =
      8] = "UpdateOnModelChange", a[a.UpdateOnConfigurationChange = 16] = "UpdateOnConfigurationChange"
  })(b.Precondition || (b.Precondition = {}));
  var o = b.Precondition;
  b.defaultPrecondition = o.TextFocus | o.Writeable | o.UpdateOnModelChange;
  var p = function(a) {
    function c(c, d, e) {
      typeof e == "undefined" && (e = b.defaultPrecondition);
      var f = this;
      a.call(this, d.id), this.descriptor = d, this.editor = c, this.needsTextFocus = !! (e & o.TextFocus), this.needsWidgetFocus = !!
        (e & o.WidgetFocus), this.needsWritable = !! (e & o.Writeable), this.toUnhook = [], this.bindings = [], d.label &&
        (this.label = d.label), this.hasFocus = !1, this.needsTextFocus && (this.toUnhook.push(this.editor.addListener(
        "focus", function() {
          return f.onFocusChanged(!0)
        })), this.toUnhook.push(this.editor.addListener("blur", function() {
        return f.onFocusChanged(!1)
      }))), this.hasWidgetFocus = !1, this.needsWidgetFocus && (this.toUnhook.push(this.editor.addListener(
        "widgetFocus", function() {
          return f.onWidgetFocusChanges(!0)
        })), this.toUnhook.push(this.editor.addListener("widgetBlur", function() {
        return f.onWidgetFocusChanges(!1)
      }))), this.isReadOnly = this.editor.getConfiguration().readOnly, this.needsWritable && this.toUnhook.push(this.editor
        .addListener(j.EventType.ConfigurationChanged, function(a) {
          return f.onConfigurationChanged(a)
        })), !(e & o.UpdateOnModelChange) || this.toUnhook.push(this.editor.addListener(j.EventType.ModelChanged,
        function() {
          return f.updateEnablementState()
        })), !(e & o.UpdateOnConfigurationChange) || this.toUnhook.push(this.editor.addListener(j.EventType.ConfigurationChanged,
        function() {
          return f.updateEnablementState()
        })), this.enabled = this.getEnablementState()
    }
    return __extends(c, a), c.prototype.getId = function() {
      return this.id
    }, c.prototype.injectTelemetryService = function(a) {
      this.telemetryService = a
    }, c.prototype.injectHandlerService = function(a) {
      var b = this;
      this.handlerService = a;
      var c = function() {
        return b.enabled ? (b.telemetryService.publicLog("editorActionInvoked", {
          name: b.label
        }), k.Promise.as(b.run()).done(), !0) : !1
      };
      for (var d = 0; d < this.descriptor.keybindings.length; d++) this.bindings.push(this.handlerService.bind(this.descriptor
        .keybindings[d], c));
      this.updateEnablementState()
    }, c.prototype.getDescriptor = function() {
      return this.descriptor
    }, c.prototype.onFocusChanged = function(a) {
      this.hasFocus = a, this.enabled = this.getEnablementState()
    }, c.prototype.onWidgetFocusChanges = function(a) {
      this.hasWidgetFocus = a, this.enabled = this.getEnablementState()
    }, c.prototype.onConfigurationChanged = function(a) {
      this.isReadOnly = this.editor.getConfiguration().readOnly, this.enabled = this.getEnablementState()
    }, c.prototype.getEnablementState = function() {
      return this.editor.getModel() ? this.needsTextFocus && !this.hasFocus ? !1 : this.needsWidgetFocus && !this.hasWidgetFocus ? !
        1 : this.needsWritable && this.isReadOnly ? !1 : !! this.handlerService && !! this.telemetryService : !1
    }, c.prototype.updateEnablementState = function() {
      this.enabled = this.getEnablementState()
    }, c.prototype.dispose = function() {
      while (this.toUnhook.length > 0) this.toUnhook.pop()();
      for (var b = 0; b < this.bindings.length; b++) this.bindings[b].dispose();
      this.bindings = [], a.prototype.dispose.call(this)
    }, c
  }(i.Action);
  b.EditorAction = p, b.Extensions = {
    EditorContributions: "editor.contributions"
  };
  var q = function() {
    function a() {
      this.editorContributions = []
    }
    return a.prototype.registerEditorContribution = function(a) {
      this.editorContributions.push(a)
    }, a.prototype.getEditorContributions = function() {
      return this.editorContributions.slice(0)
    }, a
  }();
  m.Registry.mixin(b.Extensions.EditorContributions, new q)
})