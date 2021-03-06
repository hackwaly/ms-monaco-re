define("vs/editor/contrib/quickOpen/editorQuickOpen", ["require", "exports", "vs/base/lib/winjs.base",
  "vs/editor/editorExtensions", "./quickOpenEditorWidget"
], function(e, t, n, i, o) {
  var r = function(e) {
    function t(t, n, i) {
      e.call(this, t, n);

      this.label = i;
    }
    __extends(t, e);

    t.prototype.run = function() {
      var e = this;
      if (!this.widget) {
        this.widget = new o.QuickOpenEditorWidget(this.editor, function() {
          return e._onClose(!1);
        }, function() {
          return e._onClose(!0);
        }, function(t) {
          return e.onType(t);
        });
      }

      if (!this.lastKnownEditorSelection) {
        this.lastKnownEditorSelection = this.editor.getSelection();
      }
      var t = "";
      this.onType(t);

      this.widget.show(t);

      return n.Promise.as(!0);
    };

    t.prototype._getModel = function() {
      throw new Error("Subclasses to implement");
    };

    t.prototype._getAutoFocus = function() {
      throw new Error("Subclasses to implement");
    };

    t.prototype.onType = function(e) {
      this.widget.setInput(this._getModel(e), this._getAutoFocus(e));
    };

    t.prototype.decorateLine = function(e, t) {
      var n = this;
      t.changeDecorations(function(t) {
        if (n.lineHighlightDecorationId) {
          t.removeDecoration(n.lineHighlightDecorationId);
          n.lineHighlightDecorationId = null;
        }

        n.lineHighlightDecorationId = t.addDecoration(e, {
          className: "lineHighlight",
          isWholeLine: !0
        });
      });
    };

    t.prototype.clearDecorations = function() {
      var e = this;
      if (this.lineHighlightDecorationId) {
        this.editor.changeDecorations(function(t) {
          t.removeDecoration(e.lineHighlightDecorationId);

          e.lineHighlightDecorationId = null;
        });
      }
    };

    t.prototype._onClose = function(e) {
      this.clearDecorations();

      if (e && this.lastKnownEditorSelection) {
        this.editor.setSelection(this.lastKnownEditorSelection, !0, !0, !0);
      }

      this.lastKnownEditorSelection = null;

      this.editor.focus();
    };

    t.prototype.dispose = function() {
      e.prototype.dispose.call(this);

      if (this.widget) {
        this.widget.destroy();
        this.widget = null;
      }
    };

    return t;
  }(i.EditorAction);
  t.BaseEditorQuickOpenAction = r;
});