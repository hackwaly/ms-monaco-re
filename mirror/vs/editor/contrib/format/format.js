define("vs/editor/contrib/format/format", ["require", "exports", "vs/base/lib/winjs.base", "vs/base/types",
  "vs/platform/platform", "vs/platform/actionRegistry", "vs/editor/core/range", "vs/editor/core/constants",
  "vs/nls!vs/editor/editor.main", "vs/editor/editorExtensions", "vs/editor/core/command/replaceCommand",
  "vs/editor/editor", "vs/editor/core/editorState"
], function(e, t, n, i, o, r, s, a, u, l, c, d, h) {
  var p = function() {
    function e(e) {
      var t = this;
      this.editor = e;

      this.callOnDispose = [];

      this.callOnModel = [];

      this.callOnDispose.push(e.addListener(a.EventType.ConfigurationChanged, function() {
        return t.update();
      }));

      this.callOnDispose.push(e.addListener(a.EventType.ModelChanged, function() {
        return t.update();
      }));

      this.callOnDispose.push(e.addListener(a.EventType.ModelModeChanged, function() {
        return t.update();
      }));
    }
    e.prototype.update = function() {
      for (var e = this; this.callOnModel.length > 0;) {
        this.callOnModel.pop()();
      }
      if (this.editor.getConfiguration().formatOnType && !i.isUndefinedOrNull(this.editor.getModel())) {
        var t = this.editor.getModel();

        var n = t.getMode();
        if (!i.isUndefinedOrNull(n.formattingSupport) && i.isFunction(n.formattingSupport.getAutoFormatTriggerCharacters) &&
          i.isFunction(n.formattingSupport.formatAfterKeystroke)) {
          this.formattingOptions = this.editor.getIndentationOptions();
          n.formattingSupport.getAutoFormatTriggerCharacters().forEach(function(t) {
            e.callOnModel.push(e.editor.addTypingListener(t, function() {
              return e.trigger();
            }));
          });
        }
      }
    };

    e.prototype.trigger = function() {
      var e = this;

      var t = this.editor.getModel();

      var o = this.editor.getPosition().lineNumber;

      var r = new s.Range(o, 1, o, t.getLineMaxColumn(o));

      var a = {
        range: r,
        id: t.addTrackedRange(r, 0),
        lineText: t.getLineContent(o)
      };

      var u = new n.TPromise(function(n, o, r) {
        t.getMode().formattingSupport.formatAfterKeystroke(t.getAssociatedResource(), e.editor.getPosition(), e.formattingOptions)
          .then(function(e) {
            var o = t.getTrackedRange(a.id);
            if (t.removeTrackedRange(a.id), !i.isUndefinedOrNull(e)) {
              var r = t.getValueInRange(o);
              if (a.lineText === r && e.text !== r && e.range.startLineNumber === e.range.endLineNumber) {
                a.lineText = e.text;
                a.range = o;
                n(a);
              }
            }
          }, o, r);
      });
      u.then(function(t) {
        var n = new s.Range(t.range.startLineNumber, t.range.startColumn, t.range.endLineNumber, t.range.endColumn);

        var i = e.editor.getSelection();

        var o = new c.ReplaceCommandThatPreservesSelection(n, t.lineText, i);
        e.editor.executeCommand(e.getId(), o);
      }, function() {});
    };

    e.prototype.getId = function() {
      return e.ID;
    };

    e.prototype.dispose = function() {
      for (; this.callOnDispose.length > 0;) {
        this.callOnDispose.pop()();
      }
      for (; this.callOnModel.length > 0;) {
        this.callOnModel.pop()();
      }
    };

    e.ID = "editor.contrib.autoFormat";

    return e;
  }();

  var f = function(e) {
    function t(t, n) {
      e.call(this, t, n, l.Precondition.WidgetFocus | l.Precondition.Writeable | l.Precondition.UpdateOnModelChange |
        l.Precondition.ShowInContextMenu);
    }
    __extends(t, e);

    t.prototype.getEnablementState = function() {
      return e.prototype.getEnablementState.call(this) && !! this.editor.getModel().getMode().formattingSupport;
    };

    t.prototype.run = function() {
      var e = this;

      var t = this.editor.getModel();

      var n = (t.getMode(), t.getMode().formattingSupport);

      var o = this.editor.getPosition();

      var r = this.editor.getSelection();
      if (!r.isEmpty()) {
        r.startColumn = 1;
      }
      var a = r;
      if (r.isEmpty()) {
        a = new s.Range(1, 1, t.getLineCount(), t.getLineMaxColumn(t.getLineCount()));
      }
      var u = this.editor.getIndentationOptions();

      var l = h.capture(this.editor, 0, 2);
      return n.format(t.getAssociatedResource(), a, u).then(function(t) {
        return l.validate() ? i.isString(t) ? (e.apply(e.editor, o, r, t), e.editor.focus(), !0) : !1 : !1;
      });
    };

    t.prototype.apply = function(e, t, n, i) {
      if (n.isEmpty()) {
        if (e.getModel().getValue() === i) return;
        var o = e.getModel().getLineCount();

        var r = e.getModel().getLineMaxColumn(o);

        var a = new c.ReplaceCommand(new s.Range(1, 1, o, r), i);
        e.executeCommand(this.id, a);

        e.setSelection(n);
      } else {
        var u = new c.ReplaceCommandThatPreservesSelection(n, i, n);
        e.executeCommand(this.id, u);
      }
    };

    t.ID = "editor.actions.format";

    return t;
  }(l.EditorAction);
  t.FormatAction = f;
  var g = new r.ActionDescriptor(f, f.ID, u.localize("vs_editor_contrib_format_format", 0));

  var m = o.Registry.as(l.Extensions.EditorContributions);
  m.registerEditorContribution(g);

  m.registerEditorContribution(new o.BaseDescriptor(p));
});