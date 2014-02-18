var __extends = this.__extends || function(a, b) {
    function d() {
      this.constructor = a;
    }
    for (var c in b) {
      if (b.hasOwnProperty(c)) {
        a[c] = b[c];
      }
    }
    d.prototype = b.prototype;

    a.prototype = new d;
  };

define(["require", "exports", "vs/editor/core/codeEditorWidget", "vs/editor/core/constants", "vs/base/dom/dom",
  "vs/editor/core/command/replaceCommand", "vs/css!./terminal"
], function(a, b, c, d, e, f) {
  var g = c;

  var h = d;

  var i = e;

  var j = f;

  var k = function(a) {
    function b(b, c, d) {
      var e = this;
      a.call(this, b, c, d);

      this.terminalListenersToRemove = [];

      this.terminalListenersToRemove.push(i.addListener(b, "mouseup", function(a) {
        return e.onMouseUp();
      }));

      this.isReadOnly = !1;

      this.resume(!0, !0);
    }
    __extends(b, a);

    b.prototype._attachModel = function(b) {
      var c = this;
      a.prototype._attachModel.call(this, b);

      if (this.cursor) {
        this.listenersToRemove.push(this.cursor.addListener(h.EventType.CursorSelectionChanged, function(a) {
          return c._onCursorSelectionChanged(a);
        }));
      }
    };

    b.prototype._onCursorSelectionChanged = function(a) {
      if (a.source === "modelChange" && a.selection.isEmpty()) {
        var b = this.getPosition();

        var c = this.cursor.getEditableRange();
        if (b.equals(c.getEndPosition())) {
          this.revealPosition(b, !1, !1);
        }
      }
    };

    b.prototype.onMouseUp = function() {
      if (!this.getModel()) return;
      if (!this.getSelection().isEmpty()) return;
      var a = this.getPosition();

      var b = this.cursor.getEditableRange();
      if (!b.containsPosition(a)) {
        var c = this.model.getLineCount();

        var d = this.model.getLineMaxColumn(c);
        this.setPosition({
          lineNumber: c,
          column: d
        }, !1, !1, !1);
      }
    };

    b.prototype.destroy = function() {
      this.terminalListenersToRemove.forEach(function(a) {
        a();
      });

      this.terminalListenersToRemove = [];

      a.prototype.destroy.call(this);
    };

    b.prototype.getEditorType = function() {
      return h.EditorType.ITerminal;
    };

    b.prototype.peekCurrentInput = function() {
      var a = this.cursor.getEditableRange();
      return this.getModel().getValueInRange(a);
    };

    b.prototype.acceptInput = function() {
      var a = this.peekCurrentInput();
      this.resume(!0, !0);

      return a;
    };

    b.prototype.replaceInput = function(a) {
      var b = this.peekCurrentInput();

      var c = this.cursor.getEditableRange();

      var d = new j.ReplaceCommand(c, a);
      this.trigger("terminal", h.Handler.ExecuteCommand, d);

      return b;
    };

    b.prototype.setReadOnly = function(a) {
      if (this.isReadOnly !== a) {
        this.isReadOnly = a;
        this.updateOptions({
          readOnly: a
        });
      }
    };

    b.prototype.pause = function() {
      this.setReadOnly(!0);
    };

    b.prototype.resume = function(a, b) {
      if (!this.getModel()) return;
      this.setReadOnly(!1);
      var c = this.model.getLineCount();

      var d = this.model.getLineMaxColumn(c);
      if (a) {
        this.cursor.setEditableRange({
          startLineNumber: c,
          startColumn: d,
          endLineNumber: c,
          endColumn: d
        });
      }

      if (b) {
        this.setPosition({
          lineNumber: c,
          column: d
        }, !1, !1, !1);
      }
    };

    return b;
  }(g.CodeEditorWidget);
  b.Terminal = k;
});