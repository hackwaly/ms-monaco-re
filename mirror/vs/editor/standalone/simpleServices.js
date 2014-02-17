define("vs/editor/standalone/simpleServices", ["require", "exports", "vs/base/lib/winjs.base", "vs/platform/services",
  "vs/base/errors", "vs/base/types", "vs/editor/core/constants"
], function(e, t, n, i, o, r, s) {
  var a = function() {
    function e(e) {
      this._widget = e;
    }
    e.prototype.getId = function() {
      return "editor";
    };

    e.prototype.getControl = function() {
      return this._widget;
    };

    e.prototype.getSelection = function() {
      return this._widget.getSelection();
    };

    e.prototype.focus = function() {
      this._widget.focus();
    };

    return e;
  }();
  t.SimpleEditor = a;
  var u = function() {
    function e(e) {
      this.model = e;
    }
    Object.defineProperty(e.prototype, "textEditorModel", {
      get: function() {
        return this.model;
      },
      enumerable: !0,
      configurable: !0
    });

    return e;
  }();
  t.SimpleModel = u;
  var l = function() {
    function e(e) {
      e && this.setEditor(e);
    }
    e.prototype.setEditor = function(e) {
      this.editor = new a(e);
    };

    e.prototype.getActiveEditor = function() {
      return this.editor;
    };

    e.prototype.getVisibleEditors = function() {
      return [this.editor];
    };

    e.prototype.getActiveEditorInput = function() {
      return null;
    };

    e.prototype.openEditor = function(e) {
      var t = e;
      if (this.editor._widget.getEditorType() === s.EditorType.ICodeEditor) {
        return n.Promise.as(this.doOpenEditor(this.editor._widget, t));
      }
      var i = this.editor._widget;
      return n.Promise.as(this.doOpenEditor(i.getOriginalEditor(), t) || this.doOpenEditor(i.getModifiedEditor(), t));
    };

    e.prototype.moveEditor = function() {};

    e.prototype.doOpenEditor = function(e, t) {
      var n = this.findModel(e, t);
      if (!n) {
        return !1;
      }
      var i = t.options.selection;
      i && (r.isUndefinedOrNull(i.endLineNumber) || r.isUndefinedOrNull(i.endColumn) ? e.setPosition({
        lineNumber: i.startLineNumber,
        column: i.startColumn
      }, !0, !0, !0) : e.setSelection(i, !0, !0, !0));

      return !0;
    };

    e.prototype.findModel = function(e, t) {
      var n = e.getModel();
      return n.getAssociatedResource().equals(t.resource) ? n : null;
    };

    e.prototype.closeEditor = function() {
      return n.TPromise.as(this.editor);
    };

    e.prototype.focusEditor = function() {
      this.editor.focus();

      return n.TPromise.as(this.editor);
    };

    e.prototype.resolveEditorModel = function(e) {
      var t;

      var i = e;
      if (this.editor._widget.getEditorType() === s.EditorType.ICodeEditor) {
        t = this.findModel(this.editor._widget, i);
      } else {
        var o = this.editor._widget;
        t = this.findModel(o.getOriginalEditor(), i) || this.findModel(o.getModifiedEditor(), i);
      }
      return t ? n.Promise.as(new u(t)) : n.Promise.as(null);
    };

    return e;
  }();
  t.SimpleEditorService = l;
  var c = function() {
    function e() {}
    e.prototype.show = function(t, n) {
      switch (t) {
        case 2:
          console.error(o.toErrorMessage(n, !0));
          break;
        case 1:
          console.warn(n);
          break;
        default:
          console.log(n);
      }
      return e.Empty;
    };

    e.Empty = function() {};

    return e;
  }();
  t.SimpleMessageService = c;
});