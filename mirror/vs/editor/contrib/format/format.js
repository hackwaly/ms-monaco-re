var __extends = this.__extends || function(a, b) {
    function d() {
      this.constructor = a;
    }
    for (var c in b) b.hasOwnProperty(c) && (a[c] = b[c]);
    d.prototype = b.prototype;

    a.prototype = new d;
  };

define(["require", "exports", "vs/base/lib/winjs.base", "vs/base/types", "vs/platform/platform",
  "vs/platform/actionRegistry", "vs/editor/core/range", "vs/editor/core/constants", "vs/nls",
  "vs/editor/editorExtensions", "vs/editor/core/command/replaceCommand"
], function(a, b, c, d, e, f, g, h, i, j, k) {
  var l = c;

  var m = d;

  var n = e;

  var o = f;

  var p = g;

  var q = h;

  var r = i;

  var s = j;

  var t = k;

  var u = function() {
    function a(a) {
      var b = this;
      this.editor = a;

      this.callOnDispose = [];

      this.callOnModel = [];

      this.callOnDispose.push(a.addListener(q.EventType.ConfigurationChanged, function() {
        return b.update();
      }));

      this.callOnDispose.push(a.addListener(q.EventType.ModelChanged, function() {
        return b.update();
      }));

      this.callOnDispose.push(a.addListener(q.EventType.ModelModeChanged, function() {
        return b.update();
      }));
    }
    a.prototype.update = function() {
      var a = this;
      while (this.callOnModel.length > 0) this.callOnModel.pop()();
      if (!this.editor.getConfiguration().formatOnType) return;
      if (m.isUndefinedOrNull(this.editor.getModel())) return;
      var b = this.editor.getModel();

      var c = b.getMode();
      if (m.isUndefinedOrNull(c.formattingSupport) || !m.isFunction(c.formattingSupport.getAutoFormatTriggerCharacters) || !
        m.isFunction(c.formattingSupport.formatAfterKeystroke)) return;
      this.formattingOptions = {
        tabSize: this.editor.getConfiguration().tabSize,
        insertSpaces: this.editor.getConfiguration().insertSpaces
      };

      c.formattingSupport.getAutoFormatTriggerCharacters().forEach(function(b) {
        a.callOnModel.push(a.editor.addTypingListener(b, function() {
          return a.trigger();
        }));
      });
    };

    a.prototype.trigger = function() {
      var a = this;

      var b = this.editor.getModel();

      var c = this.editor.getPosition().lineNumber;

      var d = new p.Range(c, 1, c, b.getLineMaxColumn(c));

      var e = {
        range: d,
        id: b.addTrackedRange(d),
        lineText: b.getLineContent(c)
      };

      var f = new l.Promise(function(c, d, f) {
        b.getMode().formattingSupport.formatAfterKeystroke(b.getAssociatedResource(), a.editor.getPosition(), a.formattingOptions)
          .then(function(a) {
            var d = b.getTrackedRange(e.id);
            b.removeTrackedRange(e.id);
            if (m.isUndefinedOrNull(a)) return;
            var f = b.getValueInRange(d);
            if (e.lineText !== f || a.text === f) return;
            if (a.range.startLineNumber !== a.range.endLineNumber) return;
            e.lineText = a.text;

            e.range = d;

            c(e);
          }, d, f);
      });
      f.then(function() {
        var b = new p.Range(e.range.startLineNumber, e.range.startColumn, e.range.endLineNumber, e.range.endColumn);

        var c = a.editor.getSelection();

        var d = new t.ReplaceCommandThatPreservesSelection(b, e.lineText, c);
        a.editor.executeCommand(a.getId(), d);
      }, function(a) {});
    };

    a.prototype.getId = function() {
      return a.ID;
    };

    a.prototype.dispose = function() {
      while (this.callOnDispose.length > 0) this.callOnDispose.pop()();
      while (this.callOnModel.length > 0) this.callOnModel.pop()();
    };

    a.ID = "editor.contrib.autoFormat";

    return a;
  }();

  var v = function(a) {
    function b(b, c) {
      a.call(this, b, c);
    }
    __extends(b, a);

    b.prototype.getEnablementState = function() {
      return a.prototype.getEnablementState.call(this) && !! this.editor.getModel().getMode().formattingSupport;
    };

    b.prototype.run = function() {
      var a = this;

      var b = this.editor.getModel();

      var c = b.getMode();

      var d = b.getMode().formattingSupport;

      var e = this.editor.getPosition();

      var f = this.editor.getSelection();
      f.isEmpty() || (f.startColumn = 1);
      var g = f;
      f.isEmpty() && (g = new p.Range(1, 1, b.getLineCount(), b.getLineMaxColumn(b.getLineCount())));
      var h = {
        tabSize: this.editor.getConfiguration().tabSize,
        insertSpaces: this.editor.getConfiguration().insertSpaces
      };
      return d.format(b.getAssociatedResource(), g, h).then(function(b) {
        m.isString(b) && (a.apply(a.editor, e, f, b), a.editor.focus());
      });
    };

    b.prototype.apply = function(a, b, c, d) {
      if (!c.isEmpty()) {
        var e = new t.ReplaceCommandThatPreservesSelection(c, d, c);
        a.executeCommand(this.id, e);
      } else {
        if (a.getModel().getValue() === d) return;
        var f = a.getModel().getLineCount();

        var g = a.getModel().getLineMaxColumn(f);

        var h = new t.ReplaceCommand(new p.Range(1, 1, f, g), d);
        a.executeCommand(this.id, h);

        a.setSelection(c);
      }
    };

    b.ID = "editor.actions.format";

    return b;
  }(s.EditorAction);
  b.FormatAction = v;
  var w = new o.ActionDescriptor(v, v.ID, r.localize("formatAction.label", "Format code"), {
    ctrlCmd: !0,
    alt: !0,
    key: "F"
  });

  var x = n.Registry.as(s.Extensions.EditorContributions);
  x.registerEditorContribution(w);

  x.registerEditorContribution(new n.BaseDescriptor(u));
});